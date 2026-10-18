# Concept 04 — Agent Harness

> **migrationStatus:** `partial` — Study Mode: 9 розділів, сценарій login_spec.

## Review Mode

**Проблема:** голий виклик LLM не запускає Playwright, не тримає loop tool calls, не застосовує permissions і не зупиняється вчасно.

**Ідея agent harness (виконавча оболонка):** звичайний **runtime-код** навколо моделі: context, model client, tool registry, executor, state, policy, stop rules, tracing.

**Для QA:** тестуйте harness окремо від «якості відповіді» LLM — loop limits, schema validation, deny path, trace кожного tool.

## Study Mode

### Навіщо потрібен harness?

### Один run після login_spec

### З чого складається harness?

### Послідовність циклу (loop)

### Де код, а де LLM?

### Де може зламатися?

### Як QA це тестує?

### Production і observability

### Запам’ятати та співбесіда

:::study-sources
- *AI Engineering*, 2025 — building blocks / layers of agentic AI, друк. с. 181, 240 (часткова відповідність терміну harness).
- *AI for QA / Agentic Engineering — Deep Study Guide v10*, Concept 4 — component list, loop, tracing (архів курсу).
- Навчальний сценарій: `readPlaywrightReport` після `login_spec` — узгоджено з уроком Tool Calling.
:::
