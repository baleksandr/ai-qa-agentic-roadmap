# Lab 4 — QA Regression Investigation Agent

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** LAB 4 (pdf)  
> Текст з PDF; DOCX не знайдено — таблиці/зображення не звірені.

## Review Mode

LAB 4. Tools, Tool Calling та MCP
0. Яку проблему вирішуємо?
Промпт не надає доступу до файлової системи. Інструменти — звичайні функції, які читають звіти та логи.
1. Хто що виконує та куди йдуть дані?
LLM proposes read_report(path)

## Study Mode

LAB 4. Tools, Tool Calling та MCP
### 0. Яку проблему вирішуємо?
Промпт не надає доступу до файлової системи. Інструменти — звичайні функції, які читають звіти та логи.
### 1. Хто що виконує та куди йдуть дані?
LLM proposes read_report(path)
↓
Harness validates name + arguments + permissions
↓
readFile(path) → JSON.parse → tool result
↓
Harness appends observation → LLM
MCP (опційно): Host/Client → MCP Server → same backend tool
### 2. Що створюємо руками?
Створи src/tools/read-report.ts. Спочатку локальний tool, лише потім порівняй із MCP server/client.
### 3. Приклад, який можна повторити
import { readFile } from 'node:fs/promises';
export async function readReport(path: string) {
const raw = await readFile(path, 'utf8');
return JSON.parse(raw);
}
// Production: validate path allowlist and schema before use.
### 4. Запуск і перевірка
Перевір правильний JSON, відсутній файл, невалідний JSON, path traversal. Поясни, що LLM не виконує
readFile.
### 5. Що може піти не так / безпека
Заборони читання довільних шляхів; не довіряй аргументам tool call без перевірки.
### 6. Як пояснити на співбесіді
Українською: MCP стандартизує підключення інструментів, але сам не замінює код, авторизацію чи
перевірку результату.
English: The model requests a tool call, while trusted application code validates and executes it. MCP can
standardize the tool connection.
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
