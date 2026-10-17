# Concept 02 — Orchestration

> **migrationStatus:** `partial` — Study Mode: 8 розділів, самодостатній текст (пакет 1 PART II).

## Review Mode

**Проблема:** кілька агентів, CI, Jira і людина без спільного «диригента» запускаються в хаотичному порядку — review до коду, два writer на один файл.

**Ідея orchestration (оркестрація):** шар **коду**, який визначає готовність кроків, виконавця, retries, human gates і перехід по workflow. LLM може планувати *всередині* кроку, але **не** замінює scheduler і черги.

**Для QA:** тестуйте порядок подій, idempotency при retry, відсутність deadlock і duplicate side effects у trace.

## Study Mode

### Навіщо потрібна orchestration?

У продукті одночасно живуть Coding Agent, QA Investigation Agent, Review Agent, CI pipeline і людина з approve. Кожен вміє робити свою частину, але **ніхто з них за замовчуванням не знає глобальний порядок** для тікета ABC-123.

Без orchestration після падіння `login_spec` може статися так: CI ще збирає артефакти, а investigation agent уже намагається створити Jira; reviewer коментує старий diff; два процеси пишуть у один config. Потрібен рівень, який тримає **граф робіт**: що готово, що blocked, хто наступний, що робити після failure.

| Термін | Простими словами |
|--------|------------------|
| **Orchestration** | Керування workflow: порядок, залежності, паралельність, retries, approvals |
| **Workflow graph** | Вузли (кроки) і ребра (умови переходу) |
| **Human gate** | Крок не йде далі без явної дії людини |

*Примітка:* у книзі Pachaar & Chawla немає окремої глави «Orchestration»; модель нижче — **каркас курсу V10**, узгоджений з patterns/deployment у книзі за потреби.

### Де це в investigation після login_spec?

*Навчальний приклад.*

Подія: failed `login_spec` на nightly. Orchestrator (код) отримує goal «розслідувати regression» і розкладає на задачі:

1. Дочекатися артефактів CI (blocked, поки немає report path).  
2. Запустити QA Investigation Agent (tool-heavy run).  
3. Якщо висновок «потрібен product fix» — маршрут до Coding Agent; якщо «flake» — обмежений retry CI.  
4. Якщо пропозиція змінити production config — **human gate** перед виконанням.

Orchestration **не** робить embedding і **не** парсить PDF — це RAG. Вона **не** виконує tool call — це harness усередині агента. Вона відповідає: **коли** стартує investigation run і **що** дозволено після його результату.

CI ready → investigation task → (branch) fix / retry / escalate → human gate?

### З чого складається механізм?

| Компонент | Роль |
|-----------|------|
| Workflow graph / state machine | Модель кроків і переходів |
| Scheduler / dispatcher | Вибирає ready tasks |
| Task queue | Черга подій і завдань |
| Routing rules | Хто виконує крок: agent, tool, human |
| Retry / timeout policy | Поведінка при помилках |
| Approval gates | Блокування до approve |
| Shared state / event bus | Статуси між сервісами |

### Послідовність під капотом

**Крок 1.** User goal → workflow instance (код).  
**Вхід:** «Investigate login_spec failure»; **вихід:** `workflowId`, початковий вузол.

**Крок 2.** Orchestrator дивиться state graph, знаходить ready tasks (код).  
**Вихід:** список task з preconditions.

**Крок 3.** Призначає виконавця: agent id / external job / human (код).  
**Вихід:** task envelope + context pointer (не весь wiki).

**Крок 4.** Отримує result / event (код).  
**Вхід:** `success|failure|needs_approval`.

**Крок 5.** Оновлює workflow state, переходить по ребру (код).  
**При failure:** retry policy або escalation — **детерміновані правила**, не «модель вирішила».

### Де код, а де LLM?

| Що | Хто |
|----|-----|
| Черги, таймери, retry count, routing matrix | Код orchestrator |
| Human approval UI | Людина + код |
| План усередині одного agent run | LLM + harness (інша концепція) |
| Визначення «чи пройшов CI» | CI / код, не LLM |

### Де може зламатися?

#### Deadlock

Два кроки чекають один на одного. **QA:** статичний аналіз графа або simulation — немає циклу без progress.

#### Retry storm

Flaky CI → нескінченні rerun. **Очікування:** max attempts + backoff у trace.

#### Duplicate event

Один і той же `ci_finished` оброблено двічі → два investigation run. **Harness:** idempotent consumer, `eventId`.

#### Wrong routing

Product failure пішла на «ignore». **QA:** golden workflows + assert наступного вузла в trace orchestrator.

### Як QA це тестує?

| Перевірка | Дія | Очікування | Доказ |
|-----------|-----|------------|-------|
| Порядок | Симулювати CI slow | Investigation стартує після `artifacts_ready` | ordered events у bus |
| Gate | Висновок «prod config» | Run blocked до approve | audit `approvedBy` |
| Retry | Flake flag | Рівно N CI rerun | counter у state |
| Isolation | Паралельні тікети | Окремі workflow instance | `workflowId` |

### Production

Моніторинг: час у вузлі, кількість retries, stuck workflows, SLA human gates. Версіонування графа workflow при deploy — щоб старі run не ламалися на новій схемі.

### Запам’ятати та співбесіда

| Теза | Коротко |
|------|---------|
| Orchestration | **Порядок і правила** між агентами та сервісами |
| Не LLM | Scheduler і policy — код |
| Investigation | Старт/гілки після `login_spec` — приклад вузлів workflow |

:::study-sources
- *AI Engineering*, 2025 — design patterns, deployment (орієнтири; окремого concept orchestration у книзі немає).
- *AI for QA / Agentic Engineering — Deep Study Guide v10*, Concept 2 — workflow, retries, approvals (архів курсу).
- Навчальний сценарій: nightly `login_spec`, гілки fix/retry/escalate — умовні дані.
:::study-sources-end
