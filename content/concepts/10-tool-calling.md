# Concept 10 — Tool Calling

> **migrationStatus:** `partial` — Study Mode: 8 розділів (еталон RAG); interview deck + панелі кроків.

## Review Mode

**Проблема:** модель може сказати «треба відкрити звіт Playwright» або «перевірити QA-123», але текст відповіді сам по собі не читає диск і не викликає HTTP.

**Ідея tool calling:** application описує tool schemas (ім’я, опис, параметри); LLM повертає structured `tool_call`; harness (код) валідує, перевіряє права, виконує handler і повертає tool result у контекст (`messages`) для наступного кроку.

**Межа:** ймовірнісний вибір tool/args — LLM; реальний I/O, sandbox, policy, retries — детермінований код.

**Для QA:** тестуйте окремо schema/args, deny policy, duplicate side effects, truncation великого result — не лише «чи звучить відповідь розумно».

## Study Mode

### Навіщо потрібен tool calling?

### Один виклик tool у run investigation

### Які дані передаються під час Tool Calling?

### Де код, а де LLM?

### Де може зламатися?

### Як QA це тестує?

### Production і observability

### Запам’ятати та співбесіда

:::study-sources
:::study-sources-end
