# Concept 13 — Fine-tuning

> **migrationStatus:** `partial` — Study Mode: 8 розділів (PART II пакет 3).

## Review Mode

**Проблема:** загальна модель слабко тримає внутрішній жаргон, формат звітів або стиль investigation без довгого prompt.

**Ідея fine-tuning (до навчання ваг):** додаткове навчання моделі на **ваших** прикладах — змінює weights, на відміну від prompt/RAG.

**Для QA:** eval set до/після; regression на safety; fine-tune **не** замінює guardrails.

## Study Mode

### Навіщо fine-tuning, якщо є prompt і RAG?

Prompt engineering задає правила в runtime; RAG дає факти з docs. Fine-tuning «вшиває» патерни: як писати internal incident summary, як частіше обирати правильний tool **стилістично**. Після `login_spec` це може зменшити довжину system prompt, але **не** додає свіжий postmortem — для фактів лишається RAG.

### Investigation приклад

Без tune модель verbose; після tune на прикладах QA звітів — коротший structured output. Якщо в training потрапив застарілий селектор — модель може наполягати на хибному — **ризик data drift**.

data → train job → new weights → deploy → eval gate

### Компоненти

Dataset, training pipeline, eval harness, model registry, rollback.

### Код vs LLM

Training — offline код/сервіс. Inference — LLM з новими weights. Policy — код.

### Збої

Overfit, PII у dataset, regression safety. **QA:** holdout evals, red-team prompts.

### Production

Version models, A/B, cost; книга — fine-tuning глава (inventory).

### Запам’ятати та співбесіда

Fine-tune змінює **модель**; RAG/prompt — **контекст і правила** runtime.

:::study-sources
- *AI Engineering*, 2025 — fine-tuning (inventory).
- V10 Concept 13.
:::study-sources-end
