# Concept 04 — Agent Harness

> **migrationStatus:** `partial` — Study Mode: 8 розділів, самодостатній текст (пакет 1 PART II).

## Review Mode

**Проблема:** голий виклик LLM не запускає Playwright, не тримає loop tool calls, не застосовує permissions і не зупиняється вчасно.

**Ідея agent harness (виконавча оболонка):** звичайний **runtime-код** навколо моделі: context, model client, tool registry, executor, state, policy, stop rules, tracing.

**Для QA:** тестуйте harness окремо від «якості відповіді» LLM — loop limits, schema validation, deny path, trace кожного tool.

## Study Mode

### Навіщо потрібен harness?

Модель отримує текст і повертає текст або structured **пропозицію** tool call. Сама по собі вона **не** відкриває файл звіту Playwright, **не** пише в Jira і **не** знає, скільки кроків уже зроблено в цьому run.

Щоб QA Regression Investigation Agent став робочою системою, потрібен **harness** — шар, який збирає `messages[]`, викликає API, парсить відповідь, валідує args, виконує handler, оновлює state і повторює цикл до stop condition.

| Термін | Простими словами |
|--------|------------------|
| **Agent harness** | Програмний каркас навколо LLM для реальних дій у світі |
| **Tool registry** | Allow-list операцій і їхніх схем |
| **Stop condition** | Max steps, timeout, «фінальна відповідь без tool» |

Термін **harness** — **модель курсу V10**; у книзі близькі ідеї в «building blocks / layers» агента (друк. с. 181, 240), без одного визначення 1:1.

### Один run після login_spec

*Навчальний приклад.*

1. Harness створює run і початковий state (`investigating`).  
2. Context builder додає system policy, user goal «розбери падіння login_spec», tool schemas.  
3. LLM повертає `tool_call: readPlaywrightReport`.  
4. Harness валідує schema + permissions → handler читає файл → observation у state.  
5. Наступний turn LLM: гіпотеза «селектор submit».  
6. Stop: фінальна відповідь або max steps.

Tool calling деталізує кроки 3–4; memory/state — де зберігається run; orchestration — якщо цей run був **завданням** у більшому workflow.

user goal → harness loop → model API → (tool?) → handler → state → … → stop

### З чого складається harness?

| Компонент | Роль |
|-----------|------|
| Context builder | Збирає prompt |
| Model client | HTTP до LLM API |
| Tool registry | Імена, JSON schema, ACL |
| Tool executor | Виклик handler після policy |
| State manager | Поточний run (див. Memory & State) |
| Policy layer | Deny / sandbox / approval hooks |
| Retry / timeout | На model і tool |
| Tracing | Spans, correlation id |

### Послідовність циклу (loop)

**Крок 1.** `createRun` (код).  
**Крок 2.** `buildContext` → `messages[]` (код).  
**Крок 3.** `model.complete` (код викликає LLM).  
**Крок 4.** Якщо text і політика дозволяє завершити — stop (код).  
**Крок 5.** Якщо tool_call — validate + permission (код).  
**Крок 6.** Execute handler (код); result → state.  
**Крок 7.** Append observation; перевірка stop / max steps (код); інакше → крок 2.

### Де код, а де LLM?

| Що | Хто |
|----|-----|
| Loop, limits, tracing, schema validation, I/O | Harness (код) |
| Wording відповіді, вибір tool з allow-list | LLM |
| Destructive action після approve | Людина + код |

Policy **не** делегують моделі: «Never trust args» — перевірка в коді.

### Де може зламатися?

#### Infinite tool loop

LLM знову і знову викликає той самий tool. **Harness:** max steps + однаковий call fingerprint → stop з помилкою.

#### Invalid arguments

Schema fail до handler. **QA:** assert handler не викликано (spy).

#### Forbidden operation

Модель просить tool поза registry. **Очікування:** deny у trace, без side effect.

#### Context overflow

Занадто великий tool result. **Harness:** truncate/summarize з логом.

### Як QA це тестує?

Три рівні: **handler** (unit), **harness** (integration з mock LLM), **LLM** (evals окремо).

| Категорія | Приклад |
|-----------|---------|
| Loop cap | Mock LLM завжди tool_call → run завершується з `max_steps` |
| Policy | Tool не в registry → 403 у trace |
| Trace | Кожен turn має span `model` + `tool` з correlation id |

### Production і observability

Метрики: latency per turn, tool error rate, відсоток run, що вперлись у max steps. Версіонування tool schemas разом із deploy harness.

### Запам’ятати та співбесіда

| Теза | Коротко |
|------|---------|
| Harness | Робить агента **системою**, не чатом |
| LLM | Пропонує; harness **виконує або відмовляє** |
| QA | Тестуйте loop і policy без «розумності» моделі |

:::study-sources
- *AI Engineering*, 2025 — building blocks / layers of agentic AI, друк. с. 181, 240 (часткова відповідність терміну harness).
- *AI for QA / Agentic Engineering — Deep Study Guide v10*, Concept 4 — component list, loop, tracing (архів курсу).
- Навчальний сценарій: `readPlaywrightReport` після `login_spec` — узгоджено з уроком Tool Calling.
:::study-sources-end
