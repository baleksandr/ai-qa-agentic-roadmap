# Єдиний стандарт навчального UI (Study + Review + Labs)

Один джерело правил для агентів: `.cursor/skills/study-mode-lesson/SKILL.md` (розділ «Єдиний стандарт навчального UI»). Цей файл — карта реалізації та аудит.

## Реалізація (спільно)

| Правило | Компоненти / стилі |
|--------|---------------------|
| Пара «назва — пояснення» | `StudyLabeledExplanation`; панелі — `StudyLearnerExplanationBlocks` (абзац + рядки-пари). Дані: `labeledLead`, `labeledLines`, `labeledPairs`, key-phrase. Хвіст після `. Назва — …` — окремий рядок; не кожне тире в тексті |
| Акцент терміна (колір) | `.study-term-accent` на назві; пояснення — `.study-learner-explanation`; блок-визначення — `StudyDefinitionAccent` |
| Наголос у тексті (`**`) | `parseLessonBold` / `MarkdownBody` → `.study-text-emphasis` (вага, `color: inherit`) |
| Markdown уроків і «Запам’ятати» | `MarkdownBody` + `STUDY_LEARNER_MARKDOWN` |
| Структурні панелі | `StudyLearnerPanelBody`, `StudyLearnerPanelRichSections`, `StudyTeachingCardsSection` |
| Вкладені картки наслідків у панелі | `miniCards` + `layout: 'titledStack'` → `StudyLearnerPanelOutcomeCard`; тони `allow` / `deny` / `end` / `neutral` (`study-outcome-cards.css`). Не плутати з `processStepPick` і `StudyLabeledExplanation` у `layout: 'stack'` |
| Інтерактивні навчальні картки | `studyInteractiveCardState.ts` + `study-interactive-cards.css`; назва — `StudyInteractiveCardTitle`, токен `--study-interactive-card-title`; обрана картка — `aria-pressed` / `data-selected`, рожевий акцент рамки (не заголовка) |
| Вибрана картка кроку | `StudyPipelineStepNav` → `StudyFlowStageCard` (+ Guardrails policy nodes, compare, transfer ribbon за тим самим CSS); `aria-current="step"` |
| Картки понять / процес | `presentation: 'process'` — послідовний run; `concepts` + `conceptGroups` — пов’язані аспекти однієї історії без «Крок N з M» (еталон §2 ML, §14 Hallucination). Сценарій — `leadUk`; одна UI-підказка на сторінку — `StudyPageCardsHint` (`studyPageInteractive.ts`). Concept-nav — `ul` (без нумерації кроків). Layout: `study-teaching-cards--cyber` |
| Десктоп layout карток | ≥769px: grid `study-step-detail-layout` (картки \| панель), `width: 100%` у `study-col-main`; §1 `fundamentals-ai-map-body` row |
| Review картки | `ReviewMarkdownBody` + `review-mode.css` (title = term accent, body = explanation) |
| «Запам’ятати» без UI-шуму | `StudyRememberTakeaways` (компактний стек, без маркерів) + `study-remember-markdown`; deck — `StudyInterviewSelfCheck` |
| Підсумок після інтерактиву | `afterInteractiveSummary` + `StudyAfterInteractiveSummary`; пара карток — `grid--pair` на всю ширину, `align-items: start`; `footnoteUk` під сіткою |
| Редакторські § у панелях | Виправляти в `src/data/study`; `verify:study-standards` падає на `§` у `*Uk` полях |
| Автоперевірка | `npm run verify:study-standards` |
| Інтерактивна схема агента (еталон) | `docs/INTERACTIVE_ARCHITECTURE_DIAGRAM_STANDARDS.md` |
| «Увесь маршрут» — бічна панель теми | `src/data/review/route-topic-side-panels.ts`, `RouteTopicSidePanelBody.tsx`, `review-mode.css` |

## Автоперевірка vs браузер

`verify:study-standards` ловить службові рядки в «Запам’ятати», дубль diagram/flow у Fundamentals з картками, попереджає про § у даних панелей. **Не** замінює візуальний огляд контрасту й панелей.
