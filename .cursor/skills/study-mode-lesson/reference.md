# Study Mode — файли (RAG пілот)

| Файл | Призначення |
|------|-------------|
| `content/concepts/03-rag.md` | Джерело тексту, `:::study-sources` |
| `src/components/LearningMapView.tsx` | Етапи карти, зв’язки, compact single-node |
| `src/components/MapTopicNode.tsx` | Вузол теми на карті |
| `src/components/MapLearningStatus.tsx` | ○/◐/● + підпис стану вивчення |
| `src/data/learning-map.registry.ts` | Етапи, labels, фільтр маршруту |
| `src/data/study/study-ready-for-learning.ts` | Теми з готовим Study Mode на карті |
| `src/lib/studyLearnerCopy.ts` | Порожні стани панелей (мова учня) |
| `src/lib/studySections.ts` | Парсинг `###`, джерела, readerNumber 1…N |
| `src/components/StudyModeSections.tsx` | Маршрутизація enhanced blocks |
| `src/lib/studyArrowFlow.ts` | Коли `→` = схема vs проза |
| `src/lib/studyClarityPanel.ts` | `clarityProcessPanel` / `clarityDataPanel` → markdown секцій |
| `src/lib/studyPanelMarkdown.ts` | `isStudyPanelSectionLabel`, мітки для `studyPanelLabels` |
| `src/lib/studyKeyPhraseMarkdown.ts` | `:::study-key-phrase` → `StudyLearnerKeyPhraseLine` |
| `src/components/lesson/StudyLearnerKeyPhraseLine.tsx` | Спільний UI фрази + пояснення |
| `src/components/lesson/StudyMarkdownSegments.tsx` | Markdown + key-phrase блоки |
| `src/components/lesson/StudyProcessCompareSection.tsx` | Порівняння двох процесів (картки + панель) |
| `src/data/study/fundamentals-training-inference-compare.ts` | §5 Training vs Inference |
| `src/data/study/fundamentals-model-aspects.ts` | §4 Model — три картки |
| `src/lib/studyPanelContent.ts` | `studyPanelMarkdown()` — склейка `**label** body` |
| `src/data/study/rag-teaching-thread.ts` | Навчальний INC-442 / login_spec / index-v12 |
| `src/data/study/rag-pipeline-panel-content.ts` | Єдині тексти clarity-панелей RAG pipeline |
| `src/components/lesson/StudyFlowRibbon.tsx` | Ribbon + cards, клік → flyout / inline panel |
| `src/components/lesson/StudyMarkdownWithFlows.tsx` | Markdown + auto ribbon |
| `src/components/MarkdownBody.tsx` | `studyTables`, `studyPanelLabels` |
| `src/components/lesson/StudyPanelTerms.tsx` | Блок «Терміни» внизу бокової панелі |
| `src/components/lesson/StudyPageCardsHint.tsx` | Єдина UI-підказка на Study-сторінку (`studyPageInteractive.ts`) |
| `src/components/lesson/StudyInteractionHint.tsx` | Смуга «Підказка» (лише через `StudyPageCardsHint`) |
| `src/components/lesson/StudyStepDetailLayout.tsx` | Еталон grid: nav 220–280px + панель |
| `src/components/lesson/StudyPipelineStepNav.tsx` | Єдині ліві картки (pipeline) |
| `src/data/study/tool-calling-runtime-steps.ts` | §2 кроки 1–5 (дослівно з markdown) |
| `src/data/study/tool-calling-failure-details.ts` | §5 збої — панель «до гвинтиків» |
| `src/components/lesson/StudyToolCallingFailureModes.tsx` | §5 split nav + панель |
| `src/data/study/tool-calling-llm-code-flow.ts` | §4 код vs LLM — 6 кроків readPlaywrightReport |
| `src/components/lesson/StudyToolCallingLlmCodeBoundary.tsx` | §4 UI |
| `src/data/study/tool-calling-qa-testing.ts` | §6 QA — рівні, категорії, GWT |
| `src/components/lesson/StudyToolCallingQaTesting.tsx` | §6 UI |
| `src/data/study/tool-calling-learner-flow.ts` | Єдиний ланцюг hero + §3 (7 кроків) |
| `src/components/lesson/StudyLearnerFlowTrack.tsx` | Довгі ланцюги без горизонтального скролу |
| `src/data/study/tool-calling-ribbon-stages.ts` | Масив етапів для §3 (з learner-flow) |
| `src/components/lesson/StudyToolCallingOneFlow.tsx` | §2 один виклик — картки + панель |
| `src/components/lesson/StudyRagPipelineComponents.tsx` | 9 компонентів + панель |
| `src/data/study/rag-pipeline-component-details.ts` | Lookup деталей + `terms[]` |
| `src/data/study/rag-chain-stage-details.ts` | Offline ribbon + `chainStageDetailToMarkdown` |
| `src/data/study/rag-data-chain-stage-details.ts` | Ланцюг даних (3 гілки) |
| `src/data/study/rag-qa-check-details.ts` | Панель QA |
| `src/data/study/rag-production-details.ts` | Панель production |
| `src/data/study/rag-section-aside.ts` | Контекст RAG по розділах |
| `src/data/study/tool-calling-section-aside.ts` | Контекст Tool Calling по розділах |
| `src/data/study/study-lesson-aside.registry.ts` | `hasStudyLessonAside`, meta атласу |
| `src/components/lesson/StudyLessonAside.tsx` | Права колонка (прогрес + контекст) |
| `src/data/review/review-mode-by-topic.ts` | Review Mode (пріоритет над md) |
| `src/components/ReviewMarkdownBody.tsx` | Рендер `:::review-phases/steps/compare` |
| `src/lib/reviewMarkdownBlocks.ts` | Парсер review-блоків |
| `src/styles/review-mode.css` | Стилі Review / бічної панелі |
| `src/styles/learning-map-layout.css` | Доп. layout навчальної карти |
| `src/styles/study-learner-flow-layout.css` | Компактні схеми StudyLearnerFlowTrack / outcomes |
| `src/components/lesson/StudyLearnerFlowTrack.tsx` | Довгі ланцюги → 2 ряди + mobile timeline |
| `docs/PART_II_STUDY_ROLLOUT_PROGRESS.md` | Трекінг PART II: зроблено / бракує / verify; пакети 3–4 |
| `docs/COURSE_CLARITY_AUDIT.md` | Аудит ясності всього курсу (статус по темах) |
| `docs/STUDY_LESSON_RAG_TEMPLATE.md` | Еталон структури уроку (від RAG) |
| `src/data/study/lesson-enrichment.registry.ts` | Статус збагучення по topicId |
| `src/data/study/study-lesson-heroes.ts` | Hero H1 (акронім / опори теми) |
| `src/data/study/study-lesson-intros.ts` | «Що я зрозумію», nav blurb, aria для ribbon |
| `src/components/lesson/StudyLessonAcronymHero.tsx` | UI hero (CSS як RAG) |
| `src/data/study/study-interview-registry.ts` | Який deck показати в якому розділі |
| `src/data/study/rag-interview-self-check.ts` | RAG deck (еталон) |
| `src/data/study/tool-calling-interview-self-check.ts` | Tool Calling deck |
| `src/data/study/tool-calling-interview-questions.ts` | 10 питань brief+deep (еталон співбесіди) |
| `src/components/lesson/StudyInterviewSelfCheck.tsx` | Універсальний UI співбесіди |
| `src/hooks/useStudySelfCheck.ts` | Локальні позначки ok/repeat (не прогрес теми) |
| `scripts/verify-rag-study.mjs` | Smoke parse 8 sections |

## CSS (панелі)

| Клас | Роль |
|------|------|
| `.markdown-body-study-panel p` | Міні-картка на секцію clarity |
| `.study-panel-section-label` | Мітка секції (amber, uppercase) |
| `.study-panel-terms-list li` | Міні-картка терміну (teal border) |
| `.study-panel-term-label` | Chip назви терміну |
| `.study-interaction-hint` | Підказка над split-panel |
| `.study-rag-qa-detail-panel` | Sticky панель; `min-width: 0`, без overflow-x |
