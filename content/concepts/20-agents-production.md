# Concept 20 — AI Agents in Production

> **migrationStatus:** `partial` — Study Mode: 8 розділів (PART II пакет 6).

## Review Mode

**Проблема:** demo agent ламається на rate limits, partial outages, data retention і incident response.

**Ідея production agents:** той самий harness + orchestration + guardrails + observability + evals, але з **SLO, deploy, rollback, cost, security review**.

**Для QA:** chaos/partition tests; runbooks; не лише happy path `login_spec`.

## Study Mode

### Навіщо окрема «production» тема?

Investigation agent у staging з mock tools — не те саме, що nightly load на prod tenant з real Jira. Production додає: autoscaling harness, queue depth, model fallback, feature flags, on-call.

### login_spec у prod

Alert → orchestrator → investigation (rate limited) → human gate на write → observability → post-incident eval на новий кейс у golden set.

### Шари

Deploy, secrets, network, DR, compliance, cost caps.

### Збої

Cascading failure MCP+LLM; **QA:** degraded mode з явним user message.

### Запам’ятати та співбесіда

Production = **операційна оболонка** навколо концепцій 01–19.

:::study-sources
:::study-sources-end
