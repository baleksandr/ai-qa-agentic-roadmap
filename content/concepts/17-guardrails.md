# Concept 17 — Guardrails

> **migrationStatus:** `partial` — Study Mode: 8 розділів + enriched UI (PART II пакет 6).

## Review Mode

**Проблема:** LLM ймовірнісна; prompt injection і hallucinated permissions небезпечні для prod.

**Ідея guardrails (обмеження):** детермінований **код** — validators, permission matrix, sandbox, rate limits, human approval — навколо пропозицій моделі.

**Для QA:** deny/approve у trace; bypass tests; не плутати з текстом у system prompt.

## Study Mode

### Навіщо guardrails?

Після падіння login_spec агент може пропонувати дії щодо CI-збою. Guardrails перевіряють кожну запропоновану дію в коді перед executor, а не лише через текст промпта.

### Повний простий приклад

Read Playwright report — allow read-only sandbox path. `createJiraIssue` — `needs_approval`. `deleteProductionDb` — **немає в registry** → deny до policy. Retrieved postmortem з injection «ignore rules» — input sanitizer + untrusted data boundary.

input → LLM proposal → schema → policy → (approve?) → executor

### Компоненти

Input/output validators, tool permission matrix, sandbox, allow/deny lists, budgets, approval UI.

### Що передається між компонентами?

Proposed action + arguments → policy decision (allow / deny / needs_approval) → sanitized input/output.

### Послідовність

1. Input checks (код). 2. Model output (LLM). 3. Schema validate (код). 4. Policy engine (код). 5. Human gate (людина+код). 6. Executor (код).

### Де код, а де LLM?

LLM пропонує; **verdict allow/deny/approve** — код. Людина — risky writes.

### 7. Де це може впасти? — типові збої Guardrails

Permissive policy; inconsistent rules across MCP/local tools; false positive blocks work.

### Security — що важливо захистити?

Least privilege, sandbox, audit trail — guardrails як core security layer.

### Як це тестувати як QA/SDET?

Unauthorized resource, malformed args, approval bypass, rate limit — кожен з expected deny у trace.

### Observability — що потрібно бачити в production?

policy decision, rule id, actor, resource, approval latency.

### Production considerations

Audit `rule_id`, actor, resource; version policies з deploy.

### Запам’ятати та співбесіда

Guardrails — **trusted code**, не частина weights моделі.

:::study-sources
:::study-sources-end
