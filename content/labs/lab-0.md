# Lab 0 — QA Regression Investigation Agent

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** LAB 0 (pdf)  

## Review Mode

LAB 0. Чому одного промпту недостатньо?
0. Яку проблему вирішуємо?
Тест checkout.spec.ts отримав HTTP 500. Якщо вставити тільки помилку в чат, LLM може припустити
проблему сервера, але не читала логи й не встановила root cause. Для самостійного розслідування
потрібні дозволені інструменти.

## Study Mode

LAB 0. Чому одного промпту недостатньо?
### 0. Яку проблему вирішуємо?

:::study-key-phrase
Помилка лише в чаті|тест checkout.spec.ts отримав HTTP 500; LLM може припустити проблему сервера, але не читає логи й не встановлює root cause без дозволених інструментів.
:::
### 1. Хто що виконує та куди йдуть дані?
USER + prompt + error log
↓
LLM → гіпотеза, а не підтвердження
↓
Додаємо Harness → Tool Executor → Report/Logs
↓
Evidence → LLM → висновок з посиланням на факти
### 2. Що створюємо руками?
Спершу створимо fixtures/failed-run.json; це контрольований приклад, а не реальний production log.

### 3. Приклад, який можна повторити
{
"test": "checkout.spec.ts",
"status": "failed",
"error": {"expected": 200, "actual": 500},
"correlationId": "req-123"
}
### 4. Запуск і перевірка
Поясни різницю між «спостерігав HTTP 500», «припускаю проблему БД» та «знайшов у trace
підтверджений timeout».
### 5. Що може піти не так / безпека
Не називай гіпотезу підтвердженою причиною; уникай реальних токенів та приватних логів у навчальних
даних.
### 6. Як пояснити на співбесіді
Українською: Аналіз тексту не дорівнює виконанню інструментів; для агента потрібні код, дозволи та
перевірка evidence.
English: A prompt alone can analyze supplied evidence, but cannot automatically inspect artifacts without
access to tools.
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
