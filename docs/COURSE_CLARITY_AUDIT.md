# Аудит ясності курсу Agentic AI for QA

Робочий список для системного переписування пояснень. **Статус оновлюється по мірі роботи** — курс не вважається завершеним, поки всі рядки нижче не в статусі «перевірено» або явно «N/A».

**Стандарт:** проблема → проста ідея → вхід/виконавець/дія/вихід/наступний крок → наскрізний навчальний приклад → ризики → QA; для вузлів-даних — «що містить / хто підготував / хто використовує». Технічна глибина — блок **Глибше**, посилання на інші уроки — **Докладніше**, не замість визначення.

**Інфраструктура (2026-03):**

- `src/lib/studyClarityPanel.ts` — шаблони панелей process/data
- `src/data/study/rag-teaching-thread.ts` — наскрізний INC-442 / login_spec
- `src/data/study/rag-pipeline-panel-content.ts` — єдине джерело текстів RAG-панелей

**Скан проблем (автоматично орієнтовно):** `§`, `компонент N`, `Хто це створює?` у `src/data/study/*`, порожні teaser у schema panels.

---

## 1. Study Mode — concept lessons (20)

| ID | Тема | Study MD | TS панелі / UI | Статус | Примітки |
|----|------|----------|----------------|--------|----------|
| concept-01 | Memory & State | ☐ | ☐ | не розпочато | |
| concept-02 | Orchestration | ☐ | ☐ | не розпочато | |
| **concept-03** | **RAG** | ☑ | ☑ | **еталон** | `STUDY_LESSON_RAG_TEMPLATE.md`; interview deck + clarity panels |
| **concept-10** | Tool Calling | ☑ 8 § | ☑ panels + deck | **partial** | `verify:tool-calling`; thread `readPlaywrightReport`; 5-step UI |
| concept-04 | Agent Harness | ☐ | schema-harness | не розпочато | |
| concept-05 | Evals | ☐ | ☐ | не розпочато | |
| concept-06 | MCP | ☐ | schema-mcp | не розпочато | |
| concept-07 | Skills | ☐ | ☐ | не розпочато | |
| concept-08 | A2A | ☐ | ☐ | не розпочато | |
| concept-09 | Multi-agent | ☐ | ☐ | не розпочато | |
| concept-11 | Planning | ☐ | ☐ | не розпочато | |
| concept-12 | Reasoning | ☐ | ☐ | не розпочато | |
| concept-13 | Fine-tuning | ☐ | ☐ | не розпочато | |
| concept-14 | Prompt Engineering | ☐ | ☐ | не розпочато | |
| concept-15 | Vector Database | ☐ | ☐ | не розпочато | зв’язок з RAG |
| concept-16 | Agentic Workflows | ☐ | ☐ | не розпочато | |
| **concept-17** | Guardrails | legacy DOCX | ☑ enriched + deck | **partial** | interview deck; policy UI; clarity panels — далі |
| concept-18 | Observability | ☐ | guardrails-obs | не розпочато | |
| concept-19 | Evaluation Benchmarks | ☐ | ☐ | не розпочато | |
| concept-20 | Agents Production | ☐ | ☐ | не розпочато | |

---

## 2. Review Mode (короткий огляд)

| ID | Статус | Примітки |
|----|--------|----------|
| concept-03 RAG | ☑ оновлено | Проблема, дві фази, межа LLM/код, QA |
| concept-01 … 02, 04–20 | ☐ | Більшість — 1–2 речення або порожньо |
| fundamentals | ☐ | |
| labs (посилання) | ☐ | |

---

## 3. Архітектура агента (атлас / simulation)

| Schema | Панелі кроків | Статус | Примітки |
|--------|---------------|--------|----------|
| agent | architecture-node-panels | частково OK | Структура what/who/input/output вже близька до стандарту |
| rag | schema-rag.ts steps | ☐ | Узгодити з rag-pipeline-panel-content (INC-442 thread) |
| harness | schema-harness.ts | ☐ | |
| tool-calling | schema-tool-calling.ts | ☐ | |
| mcp | schema-mcp.ts | ☐ | |
| cag | schema-cag.ts | ☐ | |
| combined | schema-combined.ts | ☐ | |

---

## 4. Навчальна карта (learning map)

| Елемент | Статус | Примітки |
|---------|--------|----------|
| `learning-map.registry.ts` підписи | ☐ | |
| зв’язки між темами | ☐ | Мають пояснювати «навіщо далі», не лише id |

---

## 5. Labs 0–9

| Lab | Файл | Статус | Примітки |
|-----|------|--------|----------|
| 0 | lab-0.md | ☐ | |
| 1–9 | lab-1 … lab-9 | ☐ | Терміни на вході кожної вправи |

---

## 6. Довідник термінів

| Джерело | Статус | Примітки |
|---------|--------|----------|
| `content/reference/reference-library.md` | ☐ | Великий; потрібна вибірка UI-термінів + перехресні якорі |
| inline `StudyPanelTerms` | ☐ | Мають дублювати мінімум з першої появи в уроку |

---

## 7. Типові дефекти (чеклист по кожній темі)

- [ ] Англійський термін без українського пояснення при першій появі
- [ ] Термін A пояснюється через незнайомий термін B
- [ ] «Компонент N», «§K», «див. розділ» замість визначення
- [ ] «Хто це створює?» для пасивних даних (chunks, index)
- [ ] Неясний виконавець (LLM vs код vs людина vs сервіс)
- [ ] Немає вхід → вихід → наступний отримувач
- [ ] Схема і текст про різні процеси
- [ ] Зміна прикладу без позначки (INC-442 ↔ інший інцидент)
- [ ] Універсальне правило замість «у цьому прикладі / може»

---

## 8. RAG (concept-03) — детальний трекер

| Область | Що зроблено | Залишилось | Перевірка |
|---------|-------------|------------|-----------|
| Study MD `03-rag.md` | Review Mode; основні § без «§N» | Проходка всіх 8 розділів на chain jargon | `npm run verify:rag` |
| 9 pipeline panels | `rag-pipeline-panel-content.ts` | `rag-pipeline-components.ts` card summaries | build |
| Offline ribbon | OFFLINE_PIPELINE → shared panels | — | UI клік Parse/Chunks |
| Data chain ribbon | `rag-data-chain-stage-details.ts` | — | UI |
| One-query flow §2 | story steps (попередні ітерації) | Узгодити tech details з новими термінами | verify:rag |
| QA checks panels | прибрано § у частині refs | Повний rewrite detail bodies | |
| Production panels | ☐ | clarity standard | |
| Atlas RAG | ☐ | sync INC-442 з panels | |
| Failure modes cards | ☐ | | |

---

## 9. Наступні теми (черга після RAG)

1. concept-10 Tool Calling + schema-tool-calling (readReport thread)
2. concept-17 Guardrails + policy flow (createJiraIssue)
3. concept-04 Harness + schema-harness
4. concept-15 Vector DB (узгодити з RAG термінами)
5. Решта concepts за `topics.registry` порядком навчання
6. Labs 0→9
7. Review Mode пакетно для всіх concept-*.md
8. reference-library вибірка для UI glossary

---

*Останнє оновлення: сесія clarity pass (RAG panels + audit file).*
