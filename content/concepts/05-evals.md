# Concept 05 — Evals

> **migrationStatus:** `partial` — Study Mode: 8 розділів (PART II пакет 5).

## Review Mode

**Проблема:** «здається працює» на кількох ручних прогонах не ловить регресії після зміни prompt, RAG або моделі.

**Ідея evals (оцінювання):** систематичні **набори кейсів** + метрики (correctness, groundedness, tool accuracy) на фіксованому harness.

**Для QA:** eval pipeline у CI; поріг merge; не плутати з production monitoring (observability).

## Study Mode

### Навіщо evals investigation агенту?

Після зміни system prompt для `login_spec` сценаріїв перевіряють: чи модель **викликає** `readPlaywrightReport` до висновку; чи citation відповідає chunk; чи не пропонує заборонений tool. Eval run — **код** запускає N cases з mock або recorded tools.

golden set → harness+LLM → scorer → pass/fail gate

### Компоненти

Dataset, eval harness, metrics, baselines, reporting.

### Код vs LLM

Scoring rules — код/люди; LLM — subject under test.

### Збої

Flaky eval через live API; metric gaming. **QA:** seed, mock tools, version lock.

### Production

Nightly eval job; alert on drop vs baseline.

### Запам’ятати та співбесіда

Evals — **регресія якості** агента, не один demo run.

:::study-sources
- V10 Concept 5; *AI Engineering* — evaluation (inventory).
:::study-sources-end
