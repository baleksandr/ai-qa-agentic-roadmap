# Concept 09 — Multi-Agent System

> **migrationStatus:** `partial` — Study Mode: 8 розділів (PART II пакет 4).

## Review Mode

**Проблема:** одна модель не оптимальна для коду, QA і review одночасно.

**Ідея multi-agent system:** кілька **спеціалізованих** агентів (різні prompts/tools/policies) взаємодіють через orchestration/A2A.

**Для QA:** немає конфліктних writes; чіткі ролі в trace.

## Study Mode

### Навіщо кілька агентів?

Після `login_spec` Investigation Agent збирає facts; Coding Agent пропонує patch; Review Agent коментує diff — різні skills, різні guardrails.

### Приклад

Investigation завершується artifact → orchestrator запускає Coding Agent з read-only repo token vs write token після approve.

### Код vs LLM

Кожен agent — harness+LLM; координація — orchestration.

### Збої

Два агенти змінюють один файл; circular messages. **QA:** file lock policy; max hops.

### Запам’ятати та співбесіда

Multi-agent = **ролі + координація**, не «більше LLM в одному prompt».

:::study-sources
- V10 Concept 9; книга — multi-agent patterns (inventory).
:::study-sources-end
