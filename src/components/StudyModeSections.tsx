import { useEffect, useMemo, useState } from 'react';
import { useStudySectionsOpen } from '../hooks/useStudySectionsOpen';
import { StudySectionsToolbar } from './lesson/StudySectionsToolbar';
import type { StudySection } from '../lib/studySections';
import {
  extractBulletComponentList,
  extractKeyIdeaBlock,
  extractProcessSteps,
  extractTransferFlow,
  normalizeStudyBullets,
} from '../lib/studyBodyFormat';
import { StudyComponentGlossary } from './lesson/StudyComponentGlossary';
import { StudyKeyIdeaCallout } from './lesson/StudyKeyIdeaCallout';
import {
  StudyGuardrailsConnections,
  StudyGuardrailsDataTransfer,
  StudyGuardrailsFailureModes,
  StudyGuardrailsInterview,
  StudyGuardrailsObservability,
  StudyGuardrailsProduction,
  StudyGuardrailsQaTests,
  StudyGuardrailsRemember,
  StudyGuardrailsSecurity,
} from './lesson/StudyGuardrailsExtraSections';
import { StudyGuardrailsPolicyExample } from './lesson/StudyGuardrailsPolicyExample';
import { StudyLlmVsCodeBoundary } from './lesson/StudyLlmVsCodeBoundary';
import { StudyProcessStepCards } from './lesson/StudyProcessStepCards';
import { StudyTransferFlow } from './lesson/StudyTransferFlow';
import { StudyRagFailureCards } from './lesson/StudyRagFailureCards';
import { StudyRagOneQueryFlow } from './lesson/StudyRagOneQueryFlow';
import { extractRagInvestigationScenario } from '../lib/ragInvestigationScenario';
import { extractRagOfflinePipeline } from '../lib/ragOfflinePipeline';
import { StudyRagOfflinePipeline } from './lesson/StudyRagOfflinePipeline';
import { StudyRagDataChainAndPrompt } from './lesson/StudyRagDataChainAndPrompt';
import { extractRagDataChainAndPrompt } from '../lib/ragDataChainPrompt';
import { extractRagQaChecks } from '../lib/ragQaSection';
import { StudyRagQaChecks } from './lesson/StudyRagQaChecks';
import { extractRagProductionSection } from '../lib/ragProductionSection';
import { StudyRagProductionCards } from './lesson/StudyRagProductionCards';
import { StudyRagPipelineComponents } from './lesson/StudyRagPipelineComponents';
import { StudyLessonAside } from './lesson/StudyLessonAside';
import { StudyProgressAsideCard } from './lesson/StudyProgressAsideCard';
import { hasStudyLessonAside } from '../data/study/study-lesson-aside.registry';
import { stripRagPipelineInlineList } from '../lib/ragPrepSection';
import { stripRagInterviewTablesFromRememberSection } from '../lib/ragRememberSection';
import { stripRememberSectionNoise } from '../lib/studyRememberSection';
import { STUDY_LEARNER_MARKDOWN } from '../lib/studyLearnerMarkdown';
import { StudyInterviewSelfCheck } from './lesson/StudyInterviewSelfCheck';
import { StudyToolCallingComponents } from './lesson/StudyToolCallingComponents';
import { StudyToolCallingOneFlow } from './lesson/StudyToolCallingOneFlow';
import { StudyToolCallingWhySection } from './lesson/StudyToolCallingWhySection';
import { StudyToolCallingFailureModes } from './lesson/StudyToolCallingFailureModes';
import { StudyToolCallingQaTesting } from './lesson/StudyToolCallingQaTesting';
import { StudyToolCallingLlmCodeBoundary } from './lesson/StudyToolCallingLlmCodeBoundary';
import { StudyToolCallingProduction } from './lesson/StudyToolCallingProduction';
import { StudyToolCallingRememberInterview } from './lesson/StudyToolCallingRememberInterview';
import {
  StudyHarnessComponents,
  StudyHarnessCycle,
  StudyHarnessFailureModesSection,
  StudyHarnessLlmCode,
  StudyHarnessOneRun,
  StudyHarnessProduction,
  StudyHarnessQaTestingSection,
  StudyHarnessRememberInterview,
} from './lesson/StudyHarnessSections';
import {
  StudyHarnessLearningOutcomes,
  StudyHarnessWhySection,
} from './lesson/StudyHarnessIntroBlocks';
import { StudyPromptEngineeringLearningOutcomes } from './lesson/StudyPromptEngineeringLearningOutcomes';
import { StudyReasoningLearningOutcomes } from './lesson/StudyReasoningLearningOutcomes';
import {
  StudyReasoningFailures,
  StudyReasoningInvestigation,
  StudyReasoningLlmCode,
  StudyReasoningMechanism,
  StudyReasoningProduction,
  StudyReasoningQaTesting,
  StudyReasoningRememberInterview,
  StudyReasoningSequence,
  StudyReasoningWhy,
} from './lesson/StudyReasoningSections';
import {
  StudyPromptEngineeringIntroOverview,
  StudyPromptEngineeringInvestigation,
  StudyPromptEngineeringParts,
  StudyPromptEngineeringSequence,
  StudyPromptEngineeringLlmCode,
  StudyPromptEngineeringFailures,
  StudyPromptEngineeringQaTesting,
  StudyPromptEngineeringProduction,
  StudyPromptEngineeringRememberInterview,
  StudyPromptEngineeringWhy,
} from './lesson/StudyPromptEngineeringSections';
import {
  getStudyInterviewDeck,
  shouldShowInterviewDeck,
} from '../data/study/study-interview-registry';
import type { LearningStatus } from '../types/topic';
import { StudySourcesCollapsible } from './lesson/StudySourcesCollapsible';
import { StudyProcessSchema } from './lesson/StudyProcessSchema';
import { isLikelyFlowDiagram, parseStudyFlowAscii } from '../lib/studyFlowSchema';
import {
  getLessonNavBlurb,
  getLessonOutcomesFlowAriaLabel,
  getStudyOutcomesLessonHint,
} from '../data/study/study-lesson-intros';
import { StudyOutcomesLessonHint } from './lesson/StudyOutcomesLessonHint';
import { StudyPageCardsHint } from './lesson/StudyPageCardsHint';
import { topicStudyPageHasInteractiveCards } from '../lib/studyPageInteractive';
import { getMapLabel } from '../data/learning-map.registry';
import { MarkdownBody } from './MarkdownBody';
import { StudyMarkdownWithFlows } from './lesson/StudyMarkdownWithFlows';
import { StudyFlowRibbon } from './lesson/StudyFlowRibbon';
import { parseArrowFlowParagraph, splitMarkdownWithArrowFlows } from '../lib/studyArrowFlow';

interface Props {
  sections: StudySection[];
  introMarkdown?: string;
  topicId?: string;
  /** Початково розгорнута одна секція (id) */
  initialOpenId?: string | null;
  sourcesMarkdown?: string;
  chapterTitle?: string;
  learning?: LearningStatus;
  onLearningChange?: (s: LearningStatus) => void;
}

export function StudyModeSections({
  sections,
  introMarkdown = '',
  topicId,
  initialOpenId = null,
  sourcesMarkdown = '',
  chapterTitle,
  learning = 'not_studied',
  onLearningChange,
}: Props) {
  const allIds = useMemo(() => sections.map((s) => s.id), [sections]);
  const {
    openIds,
    expandAll,
    collapseAll,
    toggleSection,
    openSection,
    allExpanded,
    allCollapsed,
  } = useStudySectionsOpen(allIds, { initialOpenId: initialOpenId });
  const [activeNavId, setActiveNavId] = useState(() => {
    if (initialOpenId && sections.some((s) => s.id === initialOpenId)) return initialOpenId;
    return sections[0]?.id ?? '';
  });

  useEffect(() => {
    if (initialOpenId && sections.some((s) => s.id === initialOpenId)) {
      setActiveNavId(initialOpenId);
    }
  }, [initialOpenId, sections]);

  useEffect(() => {
    if (openIds.size === 1) {
      const onlyOpen = [...openIds][0];
      if (onlyOpen) setActiveNavId(onlyOpen);
    }
  }, [openIds]);

  const navBlurb = topicId ? getLessonNavBlurb(topicId) : null;
  const lessonLabel = topicId ? getMapLabel(topicId) : null;
  const outcomesFlowAriaLabel = topicId ? getLessonOutcomesFlowAriaLabel(topicId) : 'Схема з уроку';
  const outcomesLessonHint = topicId ? getStudyOutcomesLessonHint(topicId) : null;
  const showPageCardsHint =
    topicId
      ? topicStudyPageHasInteractiveCards(topicId) &&
        topicId !== 'concept-04' &&
        topicId !== 'concept-12'
      : false;

  const toggle = (id: string) => {
    setActiveNavId(id);
    toggleSection(id);
  };

  const scrollToSection = (id: string) => {
    setActiveNavId(id);
    openSection(id);
    document.getElementById(`study-section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (sections.length === 0) {
    return <p className="muted">Секції Study Mode ще не структуровані для цієї теми.</p>;
  }

  const asideLayout = topicId ? hasStudyLessonAside(topicId) : false;

  return (
    <div
      className={`structured-study-layout study-mode-layout${asideLayout ? ' study-mode-with-aside' : ''}${topicId === 'concept-10' || topicId === 'concept-04' || topicId === 'concept-12' ? ' study-mode-aside-compact' : ''}`}
    >
      <nav className="study-col-nav study-col-nav-sticky" aria-label="Зміст уроку">
        {lessonLabel && <p className="study-col-nav-title">{lessonLabel}</p>}
        {navBlurb && <p className="study-lesson-nav-blurb muted small">{navBlurb}</p>}
        <p className="study-col-nav-sub muted small">Розділи</p>
        <ul className="study-nav-flat">
          {sections.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className={activeNavId === s.id ? 'active' : ''}
                onClick={() => scrollToSection(s.id)}
              >
                <span className="study-nav-num">{s.readerNumber}.</span> {s.navTitle}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="study-col-main">
        {chapterTitle && (
          <header className="study-chapter-header study-chapter-header-inline">
            <h2 className="study-chapter-title">{chapterTitle}</h2>
          </header>
        )}
        {(introMarkdown?.trim() ||
          topicId === 'concept-04' ||
          topicId === 'concept-12' ||
          topicId === 'concept-14') && (
          <aside
            className={`study-learning-outcomes${topicId === 'concept-12' ? ' study-learning-outcomes--reasoning-compact' : ''}`}
            aria-label="Що я зрозумію після цього уроку"
          >
            <h2 className="study-outcomes-title">Що я зрозумію після цього уроку</h2>
            <div className="markdown-body study-outcomes-body study-outcomes-with-flows">
              {topicId === 'concept-04' ? (
                <StudyHarnessLearningOutcomes />
              ) : topicId === 'concept-12' ? (
                <StudyReasoningLearningOutcomes />
              ) : topicId === 'concept-14' ? (
                <StudyPromptEngineeringLearningOutcomes />
              ) : (
                <StudyMarkdownWithFlows
                  markdown={introMarkdown}
                  flowAriaLabel={outcomesFlowAriaLabel}
                />
              )}
              {outcomesLessonHint ? (
                <StudyOutcomesLessonHint
                  labelUk={outcomesLessonHint.labelUk}
                  textUk={outcomesLessonHint.textUk}
                />
              ) : null}
            </div>
          </aside>
        )}

        {showPageCardsHint ? <StudyPageCardsHint /> : null}

        {asideLayout && onLearningChange ? (
          <StudyProgressAsideCard
            className="study-progress-aside-mobile"
            learning={learning}
            onLearningChange={onLearningChange}
          />
        ) : null}

        {topicId === 'concept-14' ? (
          <div className="study-prompt-pe-intro-overview">
            <StudyPromptEngineeringIntroOverview />
          </div>
        ) : null}

        <StudySectionsToolbar
          allExpanded={allExpanded}
          allCollapsed={allCollapsed}
          onExpandAll={expandAll}
          onCollapseAll={collapseAll}
        />

        <div className="study-sections">
          {sections.map((section) => {
            const isOpen = openIds.has(section.id);
            return (
              <section
                key={section.id}
                id={`study-section-${section.id}`}
                className={`study-section ${isOpen ? 'open' : ''}`}
              >
                <button
                  type="button"
                  className="study-section-header"
                  aria-expanded={isOpen}
                  onClick={() => toggle(section.id)}
                >
                  <span className="study-section-chevron" aria-hidden="true">{isOpen ? '▼' : '▶'}</span>
                  <span className="study-section-title">{section.title}</span>
                </button>
                {isOpen && (
                  <div className="study-section-body markdown-body">
                    <LessonBodyEnhancements
                      markdown={section.bodyMarkdown}
                      topicId={topicId}
                      sectionTitle={section.navTitle}
                    />
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {sourcesMarkdown?.trim() && <StudySourcesCollapsible markdown={sourcesMarkdown} />}
      </div>

      {asideLayout && topicId && onLearningChange && (
        <StudyLessonAside
          topicId={topicId}
          sections={sections}
          activeSectionId={activeNavId}
          learning={learning}
          onLearningChange={onLearningChange}
        />
      )}
    </div>
  );
}

function LessonBodyEnhancements({
  markdown,
  topicId,
  sectionTitle,
}: {
  markdown: string;
  topicId?: string;
  sectionTitle?: string;
}) {
  const parts = useMemo(() => splitContentBlocks(markdown), [markdown]);
  if (parts.length === 0) {
    return (
      <StudyMarkdownSegment text="" topicId={topicId} sectionTitle={sectionTitle} />
    );
  }
  return (
    <>
      {parts.map((part, i) => {
        if (part.kind === 'flow') {
          const schema = parseStudyFlowAscii(part.text);
          return <StudyProcessSchema key={i} schema={schema} />;
        }
        return (
          <StudyMarkdownSegment key={i} text={part.text} topicId={topicId} sectionTitle={sectionTitle} />
        );
      })}
    </>
  );
}

function renderConcept10StudySection(sectionTitle?: string, _text = '') {
  const t = (sectionTitle ?? '').toLowerCase();
  if (t.includes('навіщо')) return <StudyToolCallingWhySection />;
  if (t.includes('один виклик')) return <StudyToolCallingOneFlow />;
  if (t.includes('дані передаються') || t.includes('які дані')) {
    return <StudyToolCallingComponents />;
  }
  if (t.includes('зламатися')) {
    return <StudyToolCallingFailureModes />;
  }
  if (t.includes('qa це тестує')) {
    return <StudyToolCallingQaTesting />;
  }
  if (t.includes('production')) {
    return <StudyToolCallingProduction />;
  }
  if (/де код.*llm/i.test(t)) {
    return <StudyToolCallingLlmCodeBoundary />;
  }
  if (t.includes('запам')) {
    const deck = getStudyInterviewDeck('concept-10');
    return (
      <>
        <StudyToolCallingRememberInterview />
        {deck ? <StudyInterviewSelfCheck deck={deck} /> : null}
      </>
    );
  }
  return null;
}

function renderConcept04StudySection(sectionTitle?: string) {
  const t = (sectionTitle ?? '').toLowerCase();
  if (t.includes('навіщо')) return <StudyHarnessWhySection />;
  if (t.includes('один run')) return <StudyHarnessOneRun />;
  if (t.includes('складається')) return <StudyHarnessComponents />;
  if (t.includes('послідовність')) return <StudyHarnessCycle />;
  if (/де код.*llm/i.test(t)) return <StudyHarnessLlmCode />;
  if (t.includes('зламатися')) return <StudyHarnessFailureModesSection />;
  if (/qa.*тестує/i.test(t.trim())) return <StudyHarnessQaTestingSection />;
  if (t.includes('production')) return <StudyHarnessProduction />;
  if (t.includes('запам')) {
    const deck = getStudyInterviewDeck('concept-04');
    return (
      <>
        <StudyHarnessRememberInterview />
        {deck ? <StudyInterviewSelfCheck deck={deck} /> : null}
      </>
    );
  }
  return null;
}

function renderConcept12StudySection(sectionTitle?: string) {
  const t = (sectionTitle ?? '').toLowerCase();
  if (t.includes('навіщо')) return <StudyReasoningWhy />;
  if (t.includes('розслідуванні login_spec') || t.includes('run investigation')) {
    return <StudyReasoningInvestigation />;
  }
  if (t.includes('складається')) return <StudyReasoningMechanism />;
  if (t.includes('послідовність')) return <StudyReasoningSequence />;
  if (/де код.*llm/i.test(t)) return <StudyReasoningLlmCode />;
  if (t.includes('зламатися')) return <StudyReasoningFailures />;
  if (/як qa(\s+це)?\s+тестує/i.test(t.trim())) return <StudyReasoningQaTesting />;
  if (t.includes('production')) return <StudyReasoningProduction />;
  if (t.includes('запам')) {
    const deck = getStudyInterviewDeck('concept-12');
    return (
      <div className="study-reasoning-interview-section">
        <StudyReasoningRememberInterview />
        {deck ? (
          <div className="study-reasoning-interview-block">
            <StudyInterviewSelfCheck deck={deck} />
          </div>
        ) : null}
      </div>
    );
  }
  return null;
}

function StudyMarkdownSegment({
  text,
  topicId,
  sectionTitle,
}: {
  text: string;
  topicId?: string;
  sectionTitle?: string;
}) {
  if (topicId === 'concept-04') {
    const harnessSection = renderConcept04StudySection(sectionTitle);
    if (harnessSection) return harnessSection;
  }

  if (topicId === 'concept-12') {
    const reasoningSection = renderConcept12StudySection(sectionTitle);
    if (reasoningSection) return reasoningSection;
  }

  if (topicId === 'concept-10') {
    const toolCallingSection = renderConcept10StudySection(sectionTitle, text);
    if (toolCallingSection) return toolCallingSection;
  }

  if (!text.trim()) return null;

  if (topicId === 'concept-03' && (sectionTitle ?? '').toLowerCase().includes('production')) {
    const prod = extractRagProductionSection(text);
    if (prod.items.length >= 2) {
      return <StudyRagProductionCards items={prod.items} footerMarkdown={prod.footerMarkdown} />;
    }
  }

  if (topicId === 'concept-03' && (sectionTitle ?? '').toLowerCase().includes('qa це тестує')) {
    const qaItems = extractRagQaChecks(text);
    if (qaItems.length >= 3) {
      return <StudyRagQaChecks items={qaItems} />;
    }
  }

  if (topicId === 'concept-03' && (sectionTitle ?? '').toLowerCase().includes('помилитися')) {
    return <StudyRagFailureCards markdown={text} />;
  }

  if (topicId === 'concept-14' && (sectionTitle ?? '').toLowerCase().includes('навіщо')) {
    return <StudyPromptEngineeringWhy />;
  }

  if (topicId === 'concept-14' && (sectionTitle ?? '').toLowerCase().includes('investigation')) {
    return <StudyPromptEngineeringInvestigation />;
  }

  if (topicId === 'concept-14' && (sectionTitle ?? '').toLowerCase().includes('складається')) {
    return <StudyPromptEngineeringParts />;
  }

  if (topicId === 'concept-14' && (sectionTitle ?? '').toLowerCase().includes('послідовність')) {
    return <StudyPromptEngineeringSequence />;
  }

  if (topicId === 'concept-14' && /де код.*llm/i.test((sectionTitle ?? '').toLowerCase())) {
    return <StudyPromptEngineeringLlmCode />;
  }

  if (topicId === 'concept-14' && (sectionTitle ?? '').toLowerCase().includes('зламатися')) {
    return <StudyPromptEngineeringFailures />;
  }

  if (
    topicId === 'concept-14' &&
    /як qa(\s+це)?\s+тестує/i.test((sectionTitle ?? '').trim().toLowerCase())
  ) {
    return <StudyPromptEngineeringQaTesting />;
  }

  if (topicId === 'concept-14' && (sectionTitle ?? '').toLowerCase().includes('production')) {
    return <StudyPromptEngineeringProduction />;
  }

  if (topicId === 'concept-03' && (sectionTitle ?? '').toLowerCase().includes('одному запиті')) {
    const ragScene = extractRagInvestigationScenario(text);
    if (ragScene) {
      return <StudyRagOneQueryFlow scenario={ragScene.scenario} restMarkdown={ragScene.rest} />;
    }
  }

  if (topicId === 'concept-03' && /де код.*llm/i.test((sectionTitle ?? '').toLowerCase())) {
    const dataChain = extractRagDataChainAndPrompt(text);
    if (dataChain) {
      return (
        <>
          {dataChain.before ? (
            <StudyMarkdownSegment text={dataChain.before} topicId={topicId} sectionTitle={sectionTitle} />
          ) : null}
          <StudyRagDataChainAndPrompt chainLines={dataChain.chainLines} prompt={dataChain.prompt} />
          {dataChain.after ? (
            <StudyMarkdownSegment text={dataChain.after} topicId={topicId} sectionTitle={sectionTitle} />
          ) : null}
        </>
      );
    }
  }

  if (topicId && shouldShowInterviewDeck(topicId, sectionTitle ?? '')) {
    const deck = getStudyInterviewDeck(topicId);
    if (deck) {
      if (topicId === 'concept-14') {
        return (
          <>
            <StudyPromptEngineeringRememberInterview />
            <StudyInterviewSelfCheck deck={deck} />
          </>
        );
      }
      if (topicId === 'concept-12') {
        return (
          <>
            <StudyReasoningRememberInterview />
            <StudyInterviewSelfCheck deck={deck} />
          </>
        );
      }
      if (topicId === 'concept-10') {
        return (
          <>
            <StudyToolCallingRememberInterview />
            <StudyInterviewSelfCheck deck={deck} />
          </>
        );
      }
      let rememberMd = text;
      if (topicId === 'concept-03') rememberMd = stripRagInterviewTablesFromRememberSection(text);
      rememberMd = stripRememberSectionNoise(rememberMd);
      return (
        <>
          {rememberMd.trim() ? (
            <div className="study-remember-markdown">
              <MarkdownBody markdown={rememberMd} {...STUDY_LEARNER_MARKDOWN} />
            </div>
          ) : null}
          <StudyInterviewSelfCheck deck={deck} />
        </>
      );
    }
  }

  if (topicId === 'concept-03' && (sectionTitle ?? '').toLowerCase().includes('підготувати документи')) {
    const offline = extractRagOfflinePipeline(text);
    if (offline) {
      const before = stripRagPipelineInlineList(offline.before);
      const after = stripRagPipelineInlineList(offline.after);
      const showPipelineList =
        offline.before.includes('Типові компоненти pipeline') ||
        text.includes('Типові компоненти pipeline');
      return (
        <>
          {before ? (
            <StudyMarkdownSegment text={before} topicId={topicId} sectionTitle={sectionTitle} />
          ) : null}
          <StudyRagOfflinePipeline pipeline={offline.pipeline} />
          {showPipelineList && <StudyRagPipelineComponents />}
          {after ? (
            <StudyMarkdownSegment text={after} topicId={topicId} sectionTitle={sectionTitle} />
          ) : null}
        </>
      );
    }
  }

  if (topicId === 'concept-17' && isLlmVsCodeSection(sectionTitle, text)) {
    return <StudyLlmVsCodeBoundary sourceText={text} />;
  }

  if (topicId === 'concept-17' && isPolicyExampleSection(sectionTitle, text)) {
    return <StudyGuardrailsPolicyExample />;
  }

  if (topicId === 'concept-17') {
    const extra = renderGuardrailsBySection(sectionTitle, text);
    if (extra) return extra;
  }

  const keyIdea = extractKeyIdeaBlock(text);
  if (keyIdea) {
    return (
      <>
        <StudyKeyIdeaCallout sourceText={keyIdea.idea} topicId={topicId} />
        {keyIdea.rest ? (
          <StudyMarkdownSegment text={keyIdea.rest} topicId={topicId} sectionTitle={sectionTitle} />
        ) : null}
      </>
    );
  }

  const steps = extractProcessSteps(text);
  if (steps) {
    return (
      <>
        {steps.rest ? (
          <StudyMarkdownSegment text={steps.rest} topicId={topicId} sectionTitle={sectionTitle} />
        ) : null}
        <StudyProcessStepCards steps={steps.steps} topicId={topicId} sectionHint={sectionTitle} />
      </>
    );
  }

  const arrowOnly = parseArrowFlowParagraph(text.trim());
  if (arrowOnly) {
    return <StudyFlowRibbon stages={arrowOnly} layout="ribbon" />;
  }

  const transfer = extractTransferFlow(text);
  if (transfer) {
    return (
      <>
        <StudyTransferFlow stages={transfer.stages} />
        {transfer.rest ? (
          <StudyMarkdownSegment text={transfer.rest} topicId={topicId} sectionTitle={sectionTitle} />
        ) : null}
      </>
    );
  }

  const components = extractBulletComponentList(text);
  const useComponentGlossary =
    components &&
    (topicId !== 'concept-17' || (sectionTitle ?? '').toLowerCase().includes('компонентів'));
  if (useComponentGlossary && components) {
    return (
      <>
        {components.rest ? (
          <StudyMarkdownSegment text={components.rest} topicId={topicId} sectionTitle={sectionTitle} />
        ) : null}
        <StudyComponentGlossary items={components.items} topicId={topicId} />
      </>
    );
  }

  const normalized = normalizeStudyBullets(text);
  if (normalized.includes('→') && splitMarkdownWithArrowFlows(normalized).some((p) => p.kind === 'flow')) {
    return <StudyMarkdownWithFlows markdown={normalized} />;
  }
  return <MarkdownBody markdown={normalized} {...STUDY_LEARNER_MARKDOWN} />;
}

function splitContentBlocks(md: string): Array<{ kind: 'md' | 'flow'; text: string }> {
  const lines = md.split('\n');
  const out: Array<{ kind: 'md' | 'flow'; text: string }> = [];
  let buf: string[] = [];
  let flowBuf: string[] = [];
  let inFlow = false;

  const flushMd = () => {
    const text = buf.join('\n').trim();
    if (text) out.push({ kind: 'md', text });
    buf = [];
  };
  const flushFlow = () => {
    const text = flowBuf.join('\n').trim();
    if (text && isLikelyFlowDiagram(text)) out.push({ kind: 'flow', text });
    else if (text) out.push({ kind: 'md', text: `\n\n\`\`\`\n${text}\n\`\`\`\n` });
    flowBuf = [];
    inFlow = false;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!inFlow && trimmed.includes('↓')) {
      if (buf.length > 0) {
        const last = buf[buf.length - 1];
        if (last.trim() && !last.trim().startsWith('#') && !last.trim().startsWith('**Крок')) {
          buf.pop();
          flushMd();
          flowBuf.push(last);
        } else {
          flushMd();
        }
      } else {
        flushMd();
      }
      inFlow = true;
      flowBuf.push(line);
      continue;
    }

    if (inFlow) {
      if (trimmed === '') {
        flowBuf.push(line);
        continue;
      }
      if (isFlowDiagramLine(trimmed)) {
        flowBuf.push(line);
        continue;
      }
      flushFlow();
      buf.push(line);
      continue;
    }

    buf.push(line);
  }
  flushMd();
  if (inFlow) flushFlow();

  if (out.length === 0) return [{ kind: 'md', text: md }];
  return out;
}

const BRANCH_PREFIX = /^[├└│]/;

function isLlmVsCodeSection(sectionTitle?: string, text?: string): boolean {
  const t = (sectionTitle ?? '').toLowerCase();
  if (t.includes('llm') && t.includes('deterministic')) return true;
  return /mental models/i.test(text ?? '') && /probabilistic interpretation/i.test(text ?? '');
}

function isPolicyExampleSection(sectionTitle?: string, text?: string): boolean {
  const t = (sectionTitle ?? '').toLowerCase();
  if (t.includes('простий приклад') || t.includes('повний простий')) return true;
  return (
    /tool registry/i.test(text ?? '') ||
    (/production/i.test(text ?? '') && /jira/i.test(text ?? '') && /заборонено|читати/i.test(text ?? ''))
  );
}

function renderGuardrailsBySection(sectionTitle?: string, text?: string) {
  const t = (sectionTitle ?? '').toLowerCase();
  if (t.includes('передається між')) return <StudyGuardrailsDataTransfer />;
  if (t.includes('впасти') || t.includes('failure') || t.includes('злам')) {
    return <StudyGuardrailsFailureModes />;
  }
  if (t.includes('security') || t.includes('захистити')) return <StudyGuardrailsSecurity />;
  if (t.includes('тестувати') || t.includes('qa/sdet') || t.includes('qa це тестує')) {
    return <StudyGuardrailsQaTests />;
  }
  if (t.includes('observability')) return <StudyGuardrailsObservability />;
  if (t.includes('production considerations')) return <StudyGuardrailsProduction />;
  if (t.includes('пов') && t.includes('язан')) return <StudyGuardrailsConnections />;
  if (t.includes('співбесід')) return <StudyGuardrailsInterview />;
  if (t.includes('запам') || t.includes('ось воно')) {
    return <StudyGuardrailsRemember sourceText={text} />;
  }
  return null;
}

/** Рядок належить ASCII-схемі (не звичайний абзац уроку) */
function isFlowDiagramLine(trimmed: string): boolean {
  if (!trimmed) return true;
  if (trimmed.includes('↓')) return true;
  if (BRANCH_PREFIX.test(trimmed)) return true;
  if (trimmed.startsWith('│')) return true;
  if (/^(LLM proposes|Policy\/|Model |Harness |User\/|Trigger |Root request)/i.test(trimmed)) return true;
  if (trimmed.length <= 80 && !/^(\*\*Крок|\d+\.)/.test(trimmed) && !trimmed.endsWith('.')) {
    const words = trimmed.split(/\s+/).length;
    if (words <= 12) return true;
  }
  return false;
}
