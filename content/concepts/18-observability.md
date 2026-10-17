# Concept 18 — Observability

> **migrationStatus:** `partial` — Study Mode: 8 розділів (PART II пакет 5).

## Review Mode

**Проблема:** без trace не зрозуміти, чому агент після `login_spec` створив Jira з хибною причиною.

**Ідея observability (спостережуваність):** логи, **traces**, метрики, correlation id на кожен turn, tool, retrieval.

**Для QA:** trace як доказ у bug report; не логувати secrets.

## Study Mode

### Навіщо observability?

Investigation run: spans `model`, `tool`, `retrieval`, `policy_decision`. QA бачить: proposal → allow → handler result → next prompt hash.

### Приклад полів

`runId`, `workflowId`, `chunk_ids`, `tool_name`, `latency_ms`, `prompt_version`.

### vs Evals

Observability — **production/runtime** visibility; evals — **controlled** regression sets.

### Збої

Missing correlation між orchestrator і harness. **QA:** один `correlationId` end-to-end.

### Production

Sampling, retention, PII scrubbing.

### Запам’ятати та співбесіда

Без trace QA сліпий до **механізму**, бачить лише текст.

:::study-sources
- V10 Concept 18.
:::study-sources-end
