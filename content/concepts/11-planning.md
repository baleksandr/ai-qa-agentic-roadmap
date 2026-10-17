# Concept 11 — Planning

> **migrationStatus:** `partial` — Study Mode: 8 розділів (PART II пакет 4).

## Review Mode

**Проблема:** складне investigation без плану веде до хаотичних tool calls.

**Ідея planning (планування):** явний **план кроків** (LLM і/или код) перед або під час run — що зробити, у якому порядку, коли зупинитись.

**Для QA:** план відповідає policy; кроки виконуються або оновлюються після нових facts.

## Study Mode

### Навіщо planning?

`login_spec` failed → план: (1) read CI summary, (2) read Playwright report, (3) compare з last green, (4) сформувати гіпотезу, (5) optional Jira draft. Harness може зберегти plan у state; кожен крок — tool або LLM subgoal.

### Run приклад

LLM output plan JSON → harness validate → execute step 1 → replan якщо report empty.

### Компоненти

Planner prompt, plan schema, executor, replan triggers.

### Код vs LLM

LLM пропонує plan; harness валідує кроки проти allow-list. Replan — після observation.

### Збої

План з забороненим tool; нескінченний replan. **QA:** max replans; deny step у trace.

### Production

Log plan versions; eval plan quality на golden incidents.

### Запам’ятати та співбесіда

Plan — **карта** run; facts — з tools.

:::study-sources
- V10 Concept 11.
:::study-sources-end
