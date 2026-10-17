# Concept 16 — Agentic Workflows

> **migrationStatus:** `partial` — Study Mode: 8 розділів (PART II пакет 4).

## Review Mode

**Проблема:** один monolithic agent погано масштабується на end-to-end SDLC.

**Ідея agentic workflows:** **композиція** кроків і агентів (investigation → fix proposal → review) зі спільним state і orchestration.

**Для QA:** end-to-end trace через workflow; handoff даних між агентами.

## Study Mode

### Навіщо workflows?

Nightly `login_spec` → workflow: triage agent → investigation agent → (gate) coding agent → CI → review agent. Кожен крок — окремий harness run або sub-workflow.

### Приклад

Investigation output `hypothesis=selector` + evidence refs передається coding agent як structured artifact, не як довгий chat.

workflow start → agent A → artifact → agent B → human gate → CI

### vs Orchestration

Orchestration — engine графа; agentic workflow — **продуктовий сценарій** з кількох агентських ролей.

### Збої

Lost handoff artifact; incompatible schema між агентами. **QA:** contract на artifact JSON.

### Production

SLA per stage, compensating transactions.

### Запам’ятати та співбесіда

Workflow — **сценарій**; orchestration — **двигун**.

:::study-sources
- V10 Concept 16.
:::study-sources-end
