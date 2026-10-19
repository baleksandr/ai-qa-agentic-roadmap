# Concept 01 — Memory & State

> **migrationStatus:** `partial` — Study Mode: 8 розділів, самодостатній текст (пакет 1 PART II).

## Review Mode

**Проблема:** модель не «пам’ятає» між окремими HTTP-запитами; довге investigation з десятками кроків без збереженого стану неможливо відновити після збою.

**Ідея:** **state (стан)** — де зараз цей run (крок, статус, останні спостереження); **memory (пам’ять)** — що система зберегла з минулих run і може знову покласти в контекст. Зберігання і відбір контексту — **код harness**, не LLM.

**Для QA:** перевіряйте restore після рестарту, ізоляцію між користувачами/run, що саме потрапило в `messages[]` перед викликом моделі.

## Study Mode

### Навіщо потрібні memory і state?

Один виклик API до моделі — це замкнений епізод: надіслали `messages[]`, отримали відповідь, з’єднання закрилося. Модель **не має** внутрішньої бази «що ми говорили вчора», поки застосунок знову не передасть текст у prompt.

Для **QA Regression Investigation Agent** це критично. Після падіння `login_spec` агент може десять разів викликати tools, чекати human approval і зупинитися посеред run через рестарт pod. Без **state** він не знає, що вже прочитав звіт CI і який гіпотезі довіряє. Без **memory** він не може акуратно підтягнути, наприклад, що в цьому продукті таймаут на кнопці часто був селектор, а не мережа — якщо таке знання колись зберегли з дозволу політики.

| Термін | Простими словами |
|--------|------------------|
| **State (стан)** | Поточний знімок **цього** run: id, крок, статус, останні результати tools |
| **Memory (пам’ять)** | Збережене з **минулого**, що harness **може** знову додати в контекст |
| **Context builder** | Код, який вирішує, **який** шмат state/history/memory потрапить у наступний виклик LLM |

### Де це в одному run після login_spec?

*Навчальний приклад: умовні `runId`, тікети.*

Падіння `login_spec` на staging. Harness створює `runId=inv-442`, state: `step=1`, `status=investigating`. Агент (через LLM) просить прочитати звіт — harness виконує tool, записує в state `lastObservation=timeout_on_submit_button`. Перед другим викликом моделі **context builder** додає в `messages[]` короткий summary state, а з long-term memory — один факт «у UI-тестах login після редизайну v12 часто ламався `#submit`» (якщо політика дозволяє цьому tenant).

Ця концепція **не** замінює RAG (пошук у документах) і **не** є orchestration (хто наступний у workflow). Вона відповідає на питання: **що зберегти між кроками одного run і що перенести з минулого в контекст**.

run створено → кроки investigation → checkpoint state → context builder → LLM → оновлення state

### З чого складається механізм?

| Компонент | Роль |
|-----------|------|
| State manager | Читає/записує поточний об’єкт run |
| Conversation history | Короткострокова історія повідомлень у межах run |
| Long-term memory store | Факти, summary, embeddings + metadata (за дизайном продукту) |
| Checkpoint store | Знімок state для відновлення після збою |
| Context builder | Збирає фінальний prompt: system + state slice + memory hits + user |
| Retention / summarization | Стискає історію, коли наближається ліміт токенів |

### Послідовність під капотом

**Крок 1.** Harness створює `runId` і початковий state (код).  
**Вхід:** подія «почати investigation»; **вихід:** `{ runId, step, status }`.

**Крок 2.** Після кожної дії (tool, approval, помилка) harness дописує observation у state (код).  
**Вхід:** structured result; **вихід:** оновлений state JSON.

**Крок 3.** За політикою — checkpoint у Redis/PostgreSQL/інше сховище (код).  
**Вхід:** state; **вихід:** `checkpointId`.

**Крок 4.** Перед model call context builder обирає фрагменти state, history, memory (код).  
**Вхід:** state + policy; **вихід:** `messages[]` для API.

**Крок 5.** LLM бачить лише переданий контекст і генерує наступну дію або текст (модель).  
**Вхід:** `messages[]`; **вихід:** text або tool_call proposal.

**Крок 6.** Після рестарту процес відновлює state з checkpoint і продовжує з того ж кроку (код).

### Де код, а де LLM?

| Що | Хто |
|----|-----|
| Створення run, запис state, checkpoint, TTL, ACL на memory | Код harness |
| Вибір, **що** з memory показати (правила, не «інтуїція» моделі) | Код + політики |
| Інтерпретація падіння тесту, формування гіпотези, пропозиція наступного tool | LLM |
| Виконання tool після approve | Код handler |

Модель **не читає** базу пам’яті напряму — лише те, що context builder поклав у prompt.

### Де може зламатися?

#### State загубився після рестарту

**Сценарій:** pod перезапустили без checkpoint.  
**Де зупиняється:** агент повторює вже виконаний write-tool.  
**У trace:** новий `runId` або `step=1` при тому ж user goal.  
**Harness:** idempotent tools, dedupe по `correlationId`.  
**QA:** kill process після кроку 3 → restore → той самий `runId`, той самий `step`, без повторного side effect.

#### Стара memory в новій задачі

**Сценарій:** факт з payment flow потрапив у investigation login.  
**Сигнал:** неправильна гіпотеза при коректному CI.  
**QA:** новий run з іншим `productArea` — memory з іншого tenant/area не в prompt (spy на context builder).

#### Переповнення контексту

**Сценарій:** вся історія 40 tool calls у `messages[]`.  
**Очікування:** summarization або обрізання з логом «що викинули».  
**Не має статися:** тихий drop критичного `lastObservation` без trace.

#### Неатомарний checkpoint

**Сценарій:** запис state обірвався на півкроку.  
**QA:** property test або chaos: після restore state консистентний, немає `status=running` без `lastObservation`.

### Як QA це тестує?

| Перевірка | Умова | Дія | Очікування | Не має статися | Доказ |
|-----------|-------|-----|------------|----------------|-------|
| Restore | Checkpoint увімкнено | Рестарт після tool N | Продовження з N+1 | Повторний write | trace `checkpointId`, state diff |
| Ізоляція | Два user | Паралельні run | Memory user A не в run B | Витік PII | лог context builder |
| Reset | «Нова розмова» | New session | Порожній state, стара memory за політикою | Старий `runId` | API + UI session id |
| Summarization | Довга історія | 30+ turns | Латентність у межах SLA | Втрата останнього failure summary | metric + snapshot prompt |

### Production і observability

Повний зміст розділу — у навчальних картках Study Mode (події та trace, формат state, ізоляція клієнтів, недоступна memory).

### Запам’ятати та співбесіда

Повний зміст розділу — у навчальних картках Study Mode (блок «Запам’ятати», п’ять питань для самоперевірки, цільна відповідь і посилання далі).

:::study-sources
- *AI Engineering*, 2025 — memory types, друк. с. 195–196; RAG and AI Memory, друк. с. 143 (контекст для агентів).
- *AI for QA / Agentic Engineering — Deep Study Guide v10*, Concept 1 — state manager, checkpoint, context builder (архів курсу).
- Навчальний сценарій: QA Regression Investigation Agent, `login_spec`, умовні `runId` / investigation — для закріплення механізму.
:::study-sources-end
