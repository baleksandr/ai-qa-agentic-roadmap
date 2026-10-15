# Lab 3 — QA Regression Investigation Agent

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** LAB 3 (pdf)  
> Текст з PDF; DOCX не знайдено — таблиці/зображення не звірені.

## Review Mode

LAB 3. LLM API — перший виклик
0. Яку проблему вирішуємо?
Звичайний скрипт може читати JSON, але не здатний сам робити гнучкий текстовий аналіз. Підключаємо
модель через API.
1. Хто що виконує та куди йдуть дані?

## Study Mode

LAB 3. LLM API — перший виклик
### 0. Яку проблему вирішуємо?
Звичайний скрипт може читати JSON, але не здатний сам робити гнучкий текстовий аналіз. Підключаємо
модель через API.
### 1. Хто що виконує та куди йдуть дані?
TypeScript → HTTPS model API → response JSON
↓ ↑
validate output ← provider response
### 2. Що створюємо руками?
Створи src/llm/client.ts. Для запуску потрібні окремий SDK, API key у захищеному середовищі та обрана
модель. Нижче нейтральний псевдокод: API відрізняється між провайдерами.
### 3. Приклад, який можна повторити
async function analyze(report: unknown) {
const response = await modelClient.generate({
system: SYSTEM_PROMPT,
user: JSON.stringify(report)
});
return validateFindings(response);
}
### 4. Запуск і перевірка
Спочатку протестуй fake modelClient, який повертає фіксований результат. Потім підключай справжній
API та вимірюй tokens, latency, cost.
### 5. Що може піти не так / безпека
Обробляй 401, 429, 5xx, timeout, malformed JSON; не логуй API keys чи приватний вміст.
### 6. Як пояснити на співбесіді
Українською: LLM API — це зовнішній сервіс; наш код викликає його та перевіряє відповідь.

English: My TypeScript application calls the model API, validates the response, and handles provider errors.
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
