# Lab 9 — QA Regression Investigation Agent

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** LAB 9 (pdf)  
> Текст з PDF; DOCX не знайдено — таблиці/зображення не звірені.

## Review Mode

LAB 9. Production — надійність і підтримка
0. Яку проблему вирішуємо?
Локальний прототип може працювати, але production вимагає контролю доступу, часу, вартості, відмов і
спостережуваності.
1. Хто що виконує та куди йдуть дані?

## Study Mode

LAB 9. Production — надійність і підтримка
### 0. Яку проблему вирішуємо?
Локальний прототип може працювати, але production вимагає контролю доступу, часу, вартості, відмов і
спостережуваності.
### 1. Хто що виконує та куди йдуть дані?
CI trigger → Agent run → traces / metrics / logs
↓
quality gates + approvals
↓
report artifact → human review
### 2. Що створюємо руками?
Додай secret provider, structured logs, correlation IDs, timeouts, retry policy, token budget, audit trail, read-
only by default.
### 3. Приклад, який можна повторити
Production checklist:
[ ] least privilege / secret manager
[ ] request & tool timeouts
[ ] bounded retries + backoff
[ ] maxSteps / token budget
[ ] redacted traces + correlation IDs
[ ] human approval for Jira writes
[ ] eval gate in CI
[ ] rollback / incident playbook
### 4. Запуск і перевірка
Інсценуй 429, provider timeout, unavailable CI, stale report, malformed tool output і повторний запуск.
### 5. Що може піти не так / безпека
Захисти токени та приватні логи; обмеження витрат і прав — частина архітектури, а не додаткова опція.

### QA-приклад

Див. відповідний підрозділ «повний приклад» у Study Mode (якщо є в джерелі).

### Failure modes / security / testing / observability / production

Див. розділи failure / security / testing / observability / production у Study Mode.

### Запитання для самоперевірки

Відновіть flow без документа (див. блок «АААА» або hands-on у джерелі).

### Коротка відповідь для співбесіди

Див. **Interview answer** у Study Mode.
