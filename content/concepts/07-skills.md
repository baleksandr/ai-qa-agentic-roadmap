# Concept 07 — Skills

> **migrationStatus:** `partial` — Study Mode: 8 розділів (PART II пакет 3).

## Review Mode

**Проблема:** один агент з десятками tools у кожному prompt — шум і помилки вибору.

**Ідея skills (навички):** пакетовані **модулі** знань/процедур (інструкції + tools subset), які harness **підключає** за контекстом задачі.

**Для QA:** правильний skill active для investigation vs triage; межі tools skill.

## Study Mode

### Навіщо skills?

Після `login_spec` потрібен skill «Playwright investigation»: tools read report, compare trace, **без** deploy prod. Інший skill «Create ticket» — лише після approve. Harness router (код) обирає skill за intent або workflow node.

goal → skill router → skill bundle (prompt slice + tools) → harness loop

### Компоненти

Skill manifest, tool subset, prompt template, activation rules.

### Послідовність

Orchestrator/harness визначає skill → context builder додає skill instructions → LLM бачить менший allow-list.

### Код vs LLM

Активація skill — код. Модель працює в межах skill.

### Збої

Wrong skill → missing tool. **QA:** matrix scenario → expected skill id у trace.

### Production

Version skills, test compatibility з MCP/local tools.

### Запам’ятати та співбесіда

Skills — **модульність** агента, не заміна guardrails.

:::study-sources
- V10 Concept 7.
- Навчальний: investigation skill після login_spec.
:::study-sources-end
