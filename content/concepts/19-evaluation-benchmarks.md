# Concept 19 — Evaluation Benchmarks

> **migrationStatus:** `partial` — Study Mode: 8 розділів (PART II пакет 5).

## Review Mode

**Проблема:** внутрішні evals не порівнюються з індустрією; важко обґрунтувати вибір моделі.

**Ідея evaluation benchmarks:** стандартизовані **набори** і метрики (MMLU, agent benches тощо) — орієнтир, не заміна ваших QA golden cases.

**Для QA:** benchmark ≠ ваш prod; використовуйте як **один** сигнал разом із domain evals.

## Study Mode

### Навіщо benchmarks?

Команда вибирає base model для investigation agent: benchmark дає загальну здатність reasoning; **ваш** eval на `login_spec` сценаріях — головний gate для релізу.

### Investigation контекст

Високий bench score не гарантує правильний tool_call з вашим registry.

### Код vs LLM

Benchmark harness — код; модель — candidate.

### Збої

Overfit публічний bench; ігнор domain safety. **QA:** вимагайте internal golden set.

### Запам’ятати та співбесіда

Benchmark — **порівняння моделей**; prod quality — **ваші evals**.

:::study-sources
:::study-sources-end
