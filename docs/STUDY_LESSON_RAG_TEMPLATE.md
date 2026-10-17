# Еталон Study Mode: concept-03 (RAG)

Усі нові та оновлені уроки вирівнюються під цей шаблон. **Не копіюйте INC-442** в інші теми — свій наскрізний приклад (Tool Calling: `readPlaywrightReport`, Guardrails: `createJiraIssue`).

## 0. Сторінка Study (над акордеоном)

| Елемент | Де в коді | RAG | Tool Calling (concept-10) |
|--------|-----------|-----|---------------------------|
| **Hero (акронім / опори)** | `study-lesson-heroes.ts` → `StudyLessonAcronymHero` | R · A · G | T · C · R (schema / call / run) |
| **Що я зрозумію…** | `buildStudyLearningOutcomes()` → `StudyMarkdownWithFlows` | runtime + offline ribbons | один виклик + оглядовий ланцюг §3 |
| **Blurb у змісті** | `getLessonNavBlurb()` | внутрішні документи → investigation | текст ≠ дія → tool_call |

Без hero і outcomes урок **не** вважається вирівняним під еталон, навіть якщо §2/§3 уже з картками.

## 1. Markdown (`content/concepts/NN-*.md`)

| Блок | RAG (зразок) |
|------|----------------|
| **Review Mode** | Проблема → ідея → 2 фази / межа LLM-код → одна фраза для QA |
| **Study `###`** | 6–8 розділів з людськими заголовками (не лише «0.», «1.» з DOCX) |
| **Один run** | Одна історія runtime (§2); offline окремо (§3) |
| **Таблиці** | Термін \| пояснення (не ланцюжки через крапку з комою) |
| **Запам’ятати** | 3–5 тез у таблиці; інтерактив — посилання в prose |
| **Джерела** | Лише `:::study-sources` внизу |

## 2. Дані та панелі (`src/data/study/`)

| Шар | Файли RAG |
|-----|-----------|
| Навчальний потік | `rag-teaching-thread.ts` |
| Clarity-панелі | `rag-pipeline-panel-content.ts` + `studyClarityPanel.ts` |
| Lookup карток | `rag-pipeline-component-details.ts`, `rag-chain-stage-details.ts` |
| Співбесіда | `rag-interview-self-check.ts` |
| Реєстр | `lesson-enrichment.registry.ts` |

Панель: **Проблема → … → Як перевіряє QA → Глибше**; терміни в `StudyPanelTerms` (teal chips).

## 3. UI (`src/components/lesson/`)

| Патерн | Компонент |
|--------|-----------|
| Split list + панель | `StudyRagPipelineComponents`, `StudyRagQaChecks` + `StudyInteractionHint` |
| Один сценарій | `StudyRagOneQueryFlow` |
| Співбесіда | `StudyInterviewSelfCheck` + deck у `study-interview-registry.ts` |
| Markdown секції | `studyPanelLabels` + міні-картки в CSS |

## 4. Локальний прогрес співбесіди

- `useStudySelfCheck(deckId)` — **не** `useProgress` (тема на карті курсу).
- Показати / **Приховати** відповідь; «Можу пояснити» / «Треба повторити».

## 5. Атлас

- Панелі кроків: `what / who / input / output / recipient / why / risks / qaAgent` (як `schema-rag.ts`).
- Текст узгоджувати з `*-panel-content.ts`, не дублювати суперечливі факти.

## 6. Черга впровадження (див. `COURSE_CLARITY_AUDIT.md`)

1. concept-10 Tool Calling — ☑ markdown + panels + `verify:tool-calling`
2. concept-17 Guardrails — ☑ interview deck; clarity panels — далі
3. concept-04 Harness, concept-15 Vector DB
4. Решта concepts → Review Mode → Labs

## 7. Перевірки

- Тема-специфічний smoke (RAG: `npm run verify:rag`)
- `npm run build` після UI
- Skill: `.cursor/skills/study-mode-lesson/SKILL.md`
