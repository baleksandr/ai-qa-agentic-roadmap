# Concept 12 — Reasoning

> **migrationStatus:** `partial` — Study Mode: 8 розділів (PART II пакет 2).

## Review Mode

**Проблема:** складне investigation потребує кількох кроків мислення; один короткий prompt часто дає поспішний висновок.

**Ідея reasoning (міркування моделі):** способи змусити або дозволити LLM **розкладати** задачу (chain-of-thought у prompt, structured steps, tool-assisted reasoning) — це **поведінка inference**, не окремий «розумний сервіс».

**Для QA:** чи кроки мислення відповідають evidence; чи немає «красивої» логіки без tool facts.

## Study Mode

### Навіщо reasoning в агенті?

Після `login_spec` недостатньо відповісти «перевірте мережу». Потрібно зв’язати: symptom у звіті → можливі причини → які tools дадуть доказ. Reasoning — як модель **планує проміжні кроки** в тексті або через чергу tool calls (часто разом із planning).

| Термін | Простими словами |
|--------|------------------|
| **Reasoning** | Ланцюг проміжних кроків до висновку |
| **Grounding** | Висновок має спиратися на tool/RAG facts |

### Де в run investigation?

*Навчальний приклад.*

1. LLM бачить timeout на `#submit`.  
2. У тексті (або hidden scratchpad, якщо продукт підтримує) відокремлює гіпотези: селектор / staging data / мережа.  
3. Пропонує `readPlaywrightReport` — harness виконує.  
4. Оновлює висновок після fact з trace snippet.

Reasoning **не** замінює tools: без звіту це guess. QA перевіряє, що кожна сильна теза має evidence у trace.

symptom → гіпотези → tool facts → оновлений висновок

### Компоненти (у продукті)

| Елемент | Роль |
|---------|------|
| Prompt (step-by-step) | Просить явні кроки |
| Tool results | Факти для оновлення міркування |
| Harness max steps | Обмежує нескінченне «думаю» |
| Evaluator (опційно) | Окрема перевірка логіки |

### Послідовність

**Вхід:** goal + context. **LLM:** проміжні кроки / tool_call. **Код:** tools, state. **Вихід:** висновок або наступний tool. **Наступний:** context builder додає observations.

### Де код vs LLM?

LLM — формулює гіпотези. Код — надає facts, stop rules. Людина — approve небезпечні дії.

### Збої

#### Ungrounded reasoning

Красива причинність без citation. **QA:** assert tool викликано перед сильним твердженням.

#### Over-long chain

Витік токенів. **Harness:** summarization mid-run.

### Як QA тестує?

Golden cases: за фіксованого mock tool output очікуваний наступний tool або поле в JSON. Adversarial: суперечливі facts → модель має запитати ще data, не вгадувати.

### Production

Не логувати повний scratchpad з PII; latency vs depth trade-off. Книга: reasoning patterns — частково в inventory.

### Запам’ятати та співбесіда

Міркування має бути **прив’язане до evidence** з tools/RAG, не замінювати їх.

:::study-sources
- *AI Engineering*, 2025 — reasoning / agents (inventory).
- V10 Concept 12.
- Навчальний: `login_spec`, гіпотези селектор vs data.
:::study-sources-end
