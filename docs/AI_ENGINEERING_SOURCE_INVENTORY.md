# Інвентар джерел: курс ↔ AI Engineering (2025 Edition)

**Книга (локально):** `source/AI.pdf` — *AI Engineering*, 2025 Edition, Akshay Pachaar & Avi Chawla (Daily Dose of Data Science).  
**Не публікувати:** файл у `.gitignore` (`source/**/*.pdf`), не класти в `dist`, не вбудовувати текст книги в JS-збірку. У `src/` немає імпортів PDF; інвентар і майбутні «Джерело: …» — лише короткі посилання на **друковані** сторінки.

**Як читати номери сторінок:** у PDF-переглядачі маркер `-- N of 384 --` ≠ друкований номер у футері розділу (наприклад `141` перед `-- 142 of 384 --`). Для уроків використовуй **друкований** номер зі сторінки книги / змісту.

**Друге джерело курсу (QA-агент):** `source/10_Lab_2_…_v10_Lab_Updated.pdf` / DOCX — *AI for QA / Agentic Engineering — Deep Study Guide v10*. Concept 1–20, labs, guardrails policy, hybrid context **3.5–3.8** тощо. Це **навчальний каркас курсу**, не заміна книги Pachaar & Chawla.

**Референсний агент для прикладів:** QA Regression Investigation Agent (labs, combined schema, guardrails study) — **навчальний сценарій**, якщо явно не позначено інше.

---

## Правило для майбутніх правок уроків

1. Знайти фрагмент у `AI.pdf` (або зафіксувати «книга не покриває»).
2. Звірити визначення, складові, напрям даних.
3. Пояснення UA крок за кроком на прикладі QA Regression Investigation Agent.
4. Блок **«Джерело: …, с. …»** — друкована сторінка книги.
5. JSON, trace, Jira keys, policy ids — **навчальний приклад**, не цитата книги.
6. Без вигаданих визначень від імені книги.

---

## Розбіжність CAG (обов’язково не змішувати)

Детальна таблиця назв, UI та джерел: **`docs/CAG_TERMINOLOGY.md`**.

| | **V10 курс (UI: «Підготовлений контекст»)** | **Книга (окрема назва)** |
|---|---------------------------------------------|---------------------------|
| **Термін** | **Context-Augmented Generation** | **Cache-Augmented Generation** |
| **Джерело** | Deep Study Guide v10, §3.5–3.8 | *AI Engineering*, «RAG vs CAG», друк. **с. 141–143** |
| **Ідея** | Підготовлений стабільний context у run | Повторне використання стабільного шару через **кеш** (у книзі — KV memory), dynamic — retrieval |
| **Атлас** | Вкладка **«Підготовлений контекст (V10)»**, `schema-cag.ts` | Не окрема вкладка: **варіант схеми** — toggle «Prefix cache (книга: Cache-Augmented)» + пояснення |

### KV / prompt caching (книга с. 326) — механізм, не третій CAG

- **Cache-Augmented Generation** (книга) — архітектурний спосіб поділити static vs dynamic knowledge.
- **KV caching / prompt caching** — механізм inference/runtime, яким цей підхід **може** реалізуватися (повторний prefix). V10 §3.6 про prompt caching належить до **механізму**, не до назви Context-Augmented курсу.
- Не описувати KV caching як повністю незалежну «третю лінію» поруч із двома CAG; описувати як **шар реалізації** для книжкового Cache-Augmented.

### UI (узгоджено, не мовчки)

1. Атлас: не ярлик «CAG» alone → **Підготовлений контекст (V10)**.
2. Книга: **Cache-Augmented Generation** — toggle + hint на тій же схемі, посилання с. 141–143.
3. Study Mode / карта — окремий етап після пілотів уроків.
4. Compare RAG / MCP / підготовлений контекст — з footnote на Cache-Augmented (книга).

---

## Зведена таблиця тем курсу

Легенда колонок:

- **Книга** — розділ + **друкована** стор. змісту (підтверджено по `AI.pdf`, жовтень 2026).
- **Книга підтверджує** — коротко, своїми словами (не цитата).
- **QA-приклад (не книга)** — що вигадано/адаптовано під Regression Agent.
- **Книга не покриває** — немає адекватного розділу або лише згадка.
- **Розбіжність** — курс/V10/атлас vs книга.

| Тема курсу | Розділ книги (друк. стор.) | Книга підтверджує | QA-приклад (не книга) | Книга не покриває | Розбіжність |
|------------|----------------------------|-------------------|------------------------|-------------------|-------------|
| **fundamentals** | LLMs (зміст з **с. 6**): що таке LLM, токени, навчання | LLM як Transformer, next-token prediction; базові параметри генерації | Regression agent «читає» CI log як текст у context | QA-специфіка Playwright/Jira як обов’язковий фундамент | Курс глибше через V10 fundamentals, не лише книгу |
| **concept-14** Prompt Engineering | Prompt Engineering (**с. 49**+): reasoning prompts, JSON prompting | Роль промпту, техніки reasoning, структурований вивід | System prompt агента з bug format | Повний harness message assembly | — |
| **concept-12** Reasoning | «3 prompting techniques for reasoning» (**с. 51**); ReAct (**с. 205**) | Reasoning через prompting; ReAct як pattern | «Чому впав тест» chain у study | QA oracle для regression | — |
| **concept-13** Fine-tuning | Fine-tuning (**с. 66**+): LoRA, SFT vs RFT, GRPO | Коли fine-tune, LoRA, обмеження повного FT | Fine-tune «моделі агента» як гіпотетичний production крок | Зв’язок з Playwright codegen | Курс concept може дублювати V10; звіряти з книгою с. 124 «Prompting vs RAG vs Finetuning» |
| **concept-03** RAG | RAG (**с. 105**+): workflow **с. 113**, chunking, architectures | Index/retrieve/chunk/embed pipeline; Agentic RAG (**с. 128**) | 10k Jira + Confluence для investigation | Деталі вашого vector store у prod | Agentic RAG у книзі ≈ ідея, не 1:1 з назвою всіх уроків |
| **concept-15** Vector DB | «What are vector databases?» (**с. 107**), purpose in RAG (**с. 109**) | Роль embeddings і retrieval | Індекс lab artifacts | Конкретний vendor | — |
| **concept-10** Tool Calling | Building blocks (**с. 181**); MCP vs Function calling (**с. 281**) | Tools як блок агента; відмінність API/function call vs MCP | validate → policy → executor, Playwright tool | Повний guardrails lifecycle як у concept-17 | Курс деталізує policy **поза** книгою |
| **concept-06** MCP | MCP (**с. 264**+): architecture **с. 269**, primitives **с. 282**, agents **с. 286** | Client/server, tools/resources/prompts, tool overload | Jira MCP, CI MCP у combined schema | Актуальні revision spec — лише через офіц. docs | Книга не замінює specification anthropic/modelcontextprotocol |
| **concept-04** Agent Harness | «4 Layers of Agentic AI» (**с. 240**); building blocks (**с. 181**) — **частково** | Шари/блоки агента, не термін «harness» | Context builder, loop, tracing, stop rules — **модель курсу** | Термін **Agent Harness**, permissions matrix, V10 component list | **Книга не вводить harness** як у Concept 4 DOCX |
| **concept-01** Memory & State | Memory types (**с. 195**), importance (**с. 196**); RAG, Agentic RAG and AI Memory (**с. 143**) | Short/long-term, memory для агентів | run_id state, checkpoint lab | Точна семантика «state manager» курсу | Звірити з V10 Concept 1 |
| **concept-07** Skills | Context Engineering in Claude Skills (**с. 168**) | Skills як context engineering | Skill pack для regression checklist | — | Назва «Skills» прив’язана до Claude/ecosystem |
| **concept-08** A2A | Agent2Agent (A2A) Protocol (**с. 245**) | Протокол multi-agent | Делегування між двома QA-агентами | Актуальна spec Google A2A | Перевіряти з офіц. документацією |
| **concept-09** Multi-Agent | 7 Patterns in Multi-Agent Systems (**с. 242**) | Патерни координації | Specialist «log analyst» + «reporter» | — | — |
| **concept-02** Orchestration | Розкидано: design patterns (**с. 199**), deployment (**с. 260**), multi-agent | Немає глави «Orchestration» | Router harness, retries, human-in-the-loop | Єдиної моделі orchestration як у Concept 2 | **Книга не покриває тему як окремий concept** |
| **concept-11** Planning | У patterns / context workflow (**с. 158**) — **неявно** | Планування як частина agent workflow | План кроків investigation | Глава «Planning» | **Слабке покриття** |
| **concept-16** Agentic workflows | Build a Context Engineering workflow (**с. 158**); 5 Agentic AI Design Patterns (**с. 199**) | Workflow збору context і agent patterns | Граф lab-9 production flow | V10 state machine деталі | — |
| **concept-17** Guardrails | Building blocks: Guardrails (**друк. с. 193–194**); Red teaming LLM apps (**с. 352**) | Tool limits, checkpoints, fallback; red team на рівні app | policy_decision, needs_approval, rule_id, audit JSON | Enterprise policy engine як у study mode | Курс **набагато глибше** за 1 сторінку guardrails у книзі |
| **concept-18** Observability | LLM Observability (**с. 370**); Evaluation vs Observability (**с. 371**) | Відмінність eval vs prod observability | Trace spans, policy events, JIRA_503 | Повна схема observability guardrails lesson | Деталі подій — курс/V10 |
| **concept-05** Evals | LLM Evaluation (**с. 331**+): G-eval, arena, multi-turn, MCP evals (**с. 341**) | Методи оцінки, component-level evals | Golden traces для policy | Regression benchmark suite курсу | — |
| **concept-19** Evaluation Benchmarks | G-eval, LLM Arena (**с. 332**, **335**) | Benchmark / judge patterns | Freeze dataset v3 для agent | — | — |
| **concept-20** Agents in Production | AI Agents deployment (**с. 260**); Context Engineering (**с. 146**); hybrid RAG/CAG (**с. 141–143**) | Deployment, context layers, RAG+CAG | §3.5–3.8 hybrid **V10** (Context-Augmented CAG) | Production runbook як єдине джерело | **CAG: Context (курс) vs Cache (книга)** — головна розбіжність |
| **Атлас «Підготовлений контекст (V10)»** | RAG vs CAG (**с. 141–143**); KV Caching (**с. 326**) як механізм | Cache-Augmented (книга) через toggle; KV — реалізація кешу | Context-Augmented, QA rules pack | — | Два акроніми CAG — див. `CAG_TERMINOLOGY.md` |
| **concept-03 RAG (пілот)** | RAG **с. 105+**; What is RAG **с. 106**; Workflow **с. 113–115** | Дві фази: індекс + query-time retrieval; vector DB як шар пам’яті | Regression agent: postmortem lookup (INC-*) | Повний harness RAG tool | Урок `03-rag.md` + `schema-rag.ts` з блоком «Джерело» |
| **Атлас RAG / MCP / Agent** | RAG **с. 105**+, MCP **с. 264**+, AI Agents **с. 176**+ | Загальні потоки | QA Regression combined schema | — | Підписи EN в атласі звірити з книгою при редагуванні |
| **lab-0 … lab-9** | Hands-on фрагменти (GRPO **с. 94**, MCP client **с. 289**, тощо) | Окремі вправи з книги **не дорівнюють** lab chain курсу | Повний шлях Regression Investigation Agent | — | Labs = **переважно V10**, книга — додаткове джерело де збігається тема |
| **reference-library** | Змішано | Частина дублює V10 + загальні AI теми | — | — | Потребує розділення «книга / V10 / приклад» при ревізії |

---

## Теми з сильним покриттям у книзі (пріоритет звірки)

1. LLM fundamentals (**с. 6–48**)  
2. RAG pipeline + vector DB (**с. 105–140**)  
3. **RAG vs CAG** + memory (**с. 141–143**) — обов’язково з розбіжністю CAG  
4. Context Engineering + Skills (**с. 146–171**)  
5. AI Agents + ReAct + multi-agent + A2A (**с. 176–252**)  
6. MCP (**с. 264–291**)  
7. LLM Evaluation (**с. 331–352**)  
8. Observability (**с. 370–373**)

---

## Теми, де книга слабка або відсутня (не приписувати їй визначення)

| Тема | Рекомендація |
|------|----------------|
| **Agent Harness (concept-04)** | Джерело: V10 Concept 4 + власне визначення; у книзі лише «building blocks / layers» |
| **Orchestration (concept-02)** | Книга не покриває як окремий concept; посилання на patterns/deployment за потреби |
| **Planning (concept-11)** | «Книга не покриває цю тему» як первинне джерело; patterns як допоміжне |
| **Guardrails policy engine (concept-17)** | Книга: короткі guardrails + red teaming; **policy/approval/executor** — курс + офіц. docs |
| **MCP / A2A актуальні версії** | Книга + **обов’язково** перевірка specification |
| **QA Regression Agent end-to-end** | Навчальний сценарій курсу, не книга |

---

## Безпека збірки та репозиторію

| Перевірка | Статус |
|-----------|--------|
| `source/AI.pdf` у `.gitignore` | Так (`source/**/*.pdf`) |
| Імпорт PDF у `src/` | Немає |
| `docs/_pdf-extract.txt` | Текст **V10 lab PDF**, не `AI.pdf`; не потрапляє в `dist` (не імпортується клієнтом) |
| Публікація уривків книги на сайті | Заборонено великі цитати; лише «Джерело: розділ, с. N» + власний текст |

**Рекомендація:** не додавати extract `AI.pdf` у репозиторій; для звірки використовувати локальний `source/AI.pdf` або окремий скрипт поза git (аналог `pdf-text.mjs` з другим basename).

---

## Наступні кроки (після вашого OK)

1. Затвердити схему розведення **CAG (курс)** / **Cache-Augmented (книга)** в UI.  
2. Пілот: одна тема (наприклад **concept-03 RAG** або **concept-06 MCP**) — блок «Джерело» + маркування прикладів.  
3. Пройти concept-17/18 з книгою с. 193–194 та 370–371, без зменшення глибини курсу.  
4. Опційно: `npm run` скрипт `book:inventory` лише локально для оновлення цієї таблиці.

*Документ підготовлено за результатами пошуку по `source/AI.pdf` (384 PDF-сторінки). Уроки сайту **не змінювались**.*
