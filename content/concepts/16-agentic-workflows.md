# Concept 16 — Agentic Workflows

> **migrationStatus:** `partial` — Study Mode: 8 розділів (PART II пакет 4).

## Review Mode

**Проблема:** один monolithic agent погано масштабується на end-to-end SDLC.

**Ідея agentic workflows:** **композиція** кроків і агентів (investigation → fix proposal → review) зі спільним state і orchestration.

**Для QA:** end-to-end trace через workflow; handoff даних між агентами.

## Study Mode

### Навіщо потрібні agentic workflows?

Шість кроків навчального маршруту ABC-123 — у картках Study Mode (nightly CI → triage → investigation → gate → coding/CI → review).

### Приклад

Шість кроків handoff Agent A → artifact → Agent B → human gate → CI — у картках Study Mode.

### Agentic workflow і orchestration: у чому різниця?

Дві картки: що описує workflow і що координує orchestration — у картках Study Mode.

### Де може зламатися?

Дві картки збою handoff (загублений результат і несумісний формат) — у картках Study Mode.

### Production

Дві картки: час етапів і дії після часткового успіху — у картках Study Mode.

### Запам’ятати та співбесіда

«Запам’ятати», п’ять питань співбесіди та перехід до Orchestration — у Study Mode.

:::study-sources
:::study-sources-end
