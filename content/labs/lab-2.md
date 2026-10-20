# Lab 2 — QA Regression Investigation Agent

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** LAB 2 (pdf)  

## Review Mode

LAB 2. System Prompt — інструкція моделі
0. Яку проблему вирішуємо?
Без чітких правил модель може змішати факти й припущення або написати впевнений, але
необґрунтований висновок.
1. Хто що виконує та куди йдуть дані?

## Study Mode

LAB 2. System Prompt — інструкція моделі
### 0. Яку проблему вирішуємо?
Без чітких правил модель може змішати факти й припущення або написати впевнений, але
необґрунтований висновок.
### 1. Хто що виконує та куди йдуть дані?
System instruction + tool descriptions + user task
↓
LLM
↓
Structured findings (не виконання коду)
### 2. Що створюємо руками?
Створи src/agent/prompts.ts з шаблоном системної інструкції. Prompt — це не механізм авторизації.
### 3. Приклад, який можна повторити
export const SYSTEM_PROMPT = `
You are a QA investigation assistant.
Separate observations from hypotheses.
Never claim verified root cause without evidence.
Do not invent logs, traces, or tool results.
Return findings with evidence references.
If evidence is missing, say what is missing.
`;
### 4. Запуск і перевірка
Дай моделі тільки HTTP 500 і перевір, чи вона НЕ називає конкретну причину доведеною.

### 5. Що може піти не так / безпека
Prompt injection у логах — недовірений текст. Права інструментів перевіряються кодом незалежно від
промпту.
### 6. Як пояснити на співбесіді
Українською: Prompt задає поведінку і формат, але security boundary забезпечує код.
English: The system prompt defines constraints, evidence standards, and output format; code still enforces
permissions.
Самоперевірка: чи можу я пояснити цей етап без підказки, запустити приклад і назвати щонайменше два
failure modes?

### QA-приклад

Див. відповідний підрозділ «повний приклад» у Study Mode (якщо є в джерелі).

### Failure modes / security / testing / observability / production

Див. розділи failure / security / testing / observability / production у Study Mode.

### Запитання для самоперевірки

Відновіть flow без документа (див. блок «АААА» або hands-on у джерелі).

### Коротка відповідь для співбесіди

Див. **Interview answer** у Study Mode.
