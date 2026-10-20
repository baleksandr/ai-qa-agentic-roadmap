# Concept 09 — Multi-Agent System

> **migrationStatus:** `partial` — Study Mode: картки та Neon HUD у UI.

## Review Mode

**Проблема:** одна модель не оптимальна для коду, QA і review одночасно.

**Ідея multi-agent system:** кілька **спеціалізованих** агентів (різні prompts/tools/policies) взаємодіють через orchestration/A2A.

**Для QA:** немає конфліктних writes; чіткі ролі в trace.

## Study Mode

### Навіщо кілька агентів?

Три картки ролей Investigation, Coding і Review Agent — у картках Study Mode.

### Приклад

Чотири кроки: handoff → orchestrator → patch → approval перед записом — у картках Study Mode.

### Де код, а де LLM?

Чотири картки ролей моделі й коду для Investigation, Coding і координації — у картках Study Mode.

### Де може зламатися?

Три картки збоїв: конфлікт файлу, цикли делегування, гіпотеза як факт — у картках Study Mode.

### Запам’ятати та співбесіда

«Запам’ятати» та питання співбесіди — у Study Mode.

:::study-sources
:::study-sources-end
