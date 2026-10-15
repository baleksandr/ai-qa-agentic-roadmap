# Concept 07 — Skills

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** PART II — Concept 7 (pdf)  
> Текст з PDF; DOCX не знайдено — таблиці/зображення не звірені.

## Review Mode

Skills: повторно використовувані інструкції, процедури та ресурси, які додають agent спеціалізовану capability без зміни ваг моделі. Concept 6 — MCP ↓ [Concept 7 — Skills] <-- ЗАРАЗ ВИВЧАЄМО ↓ Concept 8 — A2A

## Study Mode

Concept 7. Skills — повторно використовувані навички
### QUICK VIEW — Skills: повторно використовувані інструкції, процедури та ресурси, які додають agent
спеціалізовану capability без зміни ваг моделі.
Concept 6 — MCP
↓
[Concept 7 — Skills] <-- ЗАРАЗ ВИВЧАЄМО
↓
Concept 8 — A2A
### 0. Яку проблему ми взагалі намагаємося вирішити?
Якщо щоразу вставляти в system prompt сотні інструкцій для кожної можливої задачі, context стає
великим, дорогим і суперечливим. Потрібно завантажувати спеціалізовані процедури тільки коли вони
потрібні.
One huge prompt
├─ create-test instructions
├─ review-PR instructions
├─ investigate-logs instructions
└─ deploy instructions
→ зайві tokens + конфлікти
### 1. Головна ідея простими словами
Ключова думка
Skill — пакет reusable instructions/procedure/resources, який agent runtime може підключити для
конкретної задачі. Skill не обов’язково є model або tool; це часто керований контекст +
scripts/resources.
### 2. З яких компонентів це складається?
• Skill metadata/name/description
• Instructions
• Examples
• Scripts/templates/resources
• Loader/router
• Versioning
### 3. Що фізично передається між компонентами?
Metadata для discovery, instruction text у context, optional file/resource references, script outputs.
### 4. Що відбувається під капотом — крок за кроком
### 55. 1) Runtime бачить available skills metadata.
### 56. 2) За task/intent вибирає релевантний skill.
### 57. 3) Завантажує instruction body/resources.
### 58. 4) Додає їх до context або запускає deterministic helper script.
### 59. 5) Виконує task за локальними правилами.

### 60. 6) Після завершення skill context може бути вивантажений.
### 5. Де тут LLM, а де звичайний deterministic code?
LLM відповідає за probabilistic interpretation/decision/generation там, де потрібне розуміння природної
мови або вибір наступної дії. Усе, що стосується реального I/O, зберігання, permissions, network calls,
retries, schema validation, queues, databases і policy enforcement, виконується звичайним програмним
кодом та інфраструктурою. Межа між цими двома світами — одна з найважливіших mental models у
всьому курсі.
### 6. Повний простий приклад
Skill create-playwright-test містить framework conventions, fixtures, selector policy, test-data rules і шаблон.
Agent отримує Jira ticket, підключає skill і генерує test у стилі repo.
### 7. Де це може впасти? — failure modes
• Застарілий skill
• Конфлікт двох skills
• Надто загальні інструкції
• Skill не завантажив потрібний resource
• Неправильний routing
### 8. Security — що важливо захистити?
• Skill не повинен сам надавати додаткові permissions
• Review scripts
• Signed/controlled skill sources
• Не зберігати secrets у skill text
### 9. Як це тестувати як QA/SDET?
• Skill selection
• Instruction compliance
• Golden tasks
• Version regression
• Conflicting skill resolution
### 10. Observability — що потрібно бачити в production?
Який skill/version завантажено, скільки tokens додано, які scripts виконано, чи вплинув skill на quality.
### 11. Production considerations
У production важливо думати не лише про happy path, а про versioning, backward compatibility, latency,
cost, retries, idempotency, rate limits, concurrency, degradation/fallback, data retention, deployment,
monitoring і incident response. Конкретна вага цих факторів залежить від цієї концепції, але production-
система завжди повинна мати контрольовану поведінку при часткових збоях.

### 12. Як ця концепція пов’язана з іншими?
Ця концепція не існує ізольовано. Попередній логічний крок: Concept 6 — MCP. Наступний: Concept 8 —
A2A. Під час навчання завжди повертайся до глобальної карти: модель, harness, state/memory, tools/MCP,
RAG, A2A, guardrails, evals та observability — це шари однієї системи.
### 13. Коротка відповідь на співбесіді
**Interview answer**
Skills are reusable capability packages—usually instructions, examples and optional scripts/resources—that
are loaded on demand so an agent can follow domain-specific procedures without keeping all instructions in
every prompt.
### 14. “АААА, ось воно як!” — що треба запам’ятати
Не зубри визначення. Спробуй без документа намалювати flow від входу до виходу і для кожної стрілки
відповісти: хто це виконує, що саме передається, де зберігається state, де працює LLM, а де звичайний
код. Якщо можеш це відновити — концепція реально засвоєна.

### QA-приклад

Див. відповідний підрозділ «повний приклад» у Study Mode (якщо є в джерелі).

### Failure modes / security / testing / observability / production

Див. розділи failure / security / testing / observability / production у Study Mode.

### Запитання для самоперевірки

Відновіть flow без документа (див. блок «АААА» або hands-on у джерелі).

### Коротка відповідь для співбесіди

Див. **Interview answer** у Study Mode.
