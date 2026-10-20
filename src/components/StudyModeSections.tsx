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
  StudyGuardrailsLlmCode,
  StudyGuardrailsUnderHoodSequence,
  StudyGuardrailsFailureModes,
  StudyGuardrailsInterview,
  StudyGuardrailsObservability,
  StudyGuardrailsProduction,
  StudyGuardrailsQaTests,
  StudyGuardrailsRemember,
  StudyGuardrailsSecurity,
} from './lesson/StudyGuardrailsExtraSections';
import { StudyGuardrailsComponents, StudyGuardrailsWhy } from './lesson/StudyGuardrailsSections';
import { StudyGuardrailsPolicyExample } from './lesson/StudyGuardrailsPolicyExample';
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
import {
  hasStudyLessonAside,
  hasStudyProgressSidebar,
  isStudyProgressSidebarCompact,
} from '../data/study/study-lesson-aside.registry';
import { StudyProgressSidebarAside } from './lesson/StudyProgressSidebarAside';
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
import { StudyMemoryStateLearningOutcomes } from './lesson/StudyMemoryStateLearningOutcomes';
import {
  StudyMemoryStateFailures,
  StudyMemoryStateQaTesting,
  StudyMemoryStateLlmCode,
  StudyMemoryStateMechanism,
  StudyMemoryStateRun,
  StudyMemoryStateSequence,
  StudyMemoryStateWhy,
  StudyMemoryStateProduction,
  StudyMemoryStateRememberInterview,
} from './lesson/StudyMemoryStateSections';
import { StudyVectorDatabaseLearningOutcomes } from './lesson/StudyVectorDatabaseLearningOutcomes';
import {
  StudyVectorDatabaseComponents,
  StudyVectorDatabaseInvestigation,
  StudyVectorDatabaseFailures,
  StudyVectorDatabaseProduction,
  StudyVectorDatabaseRememberInterview,
  StudyVectorDatabaseLlmCode,
  StudyVectorDatabaseRuntime,
  StudyVectorDatabaseWhy,
} from './lesson/StudyVectorDatabaseSections';
import {
  StudyMcpComponents,
  StudyMcpFailures,
  StudyMcpLlmCode,
  StudyMcpProduction,
  StudyMcpRememberInterview,
  StudyMcpRun,
  StudyMcpSequence,
  StudyMcpWhy,
} from './lesson/StudyMcpSections';
import { StudyMcpLearningOutcomes } from './lesson/StudyMcpLearningOutcomes';
import { StudyFineTuningLearningOutcomes } from './lesson/StudyFineTuningLearningOutcomes';
import { StudySkillsLearningOutcomes } from './lesson/StudySkillsLearningOutcomes';
import { StudyPlanningLearningOutcomes } from './lesson/StudyPlanningLearningOutcomes';
import { StudyOrchestrationLearningOutcomes } from './lesson/StudyOrchestrationLearningOutcomes';
import { StudyAgenticWorkflowsLearningOutcomes } from './lesson/StudyAgenticWorkflowsLearningOutcomes';
import { StudyGuardrailsLearningOutcomes } from './lesson/StudyGuardrailsLearningOutcomes';
import {
  StudyAgenticWorkflowsExample,
  StudyAgenticWorkflowsFailures,
  StudyAgenticWorkflowsProduction,
  StudyAgenticWorkflowsRememberInterview,
  StudyAgenticWorkflowsVsOrchestration,
  StudyAgenticWorkflowsWhy,
} from './lesson/StudyAgenticWorkflowsSections';
import { StudyMultiAgentLearningOutcomes } from './lesson/StudyMultiAgentLearningOutcomes';
import {
  StudyMultiAgentExample,
  StudyMultiAgentFailures,
  StudyMultiAgentLlmCode,
  StudyMultiAgentRememberInterview,
  StudyMultiAgentWhy,
} from './lesson/StudyMultiAgentSections';
import {
  StudyA2aFailures,
  StudyA2aLlmCode,
  StudyA2aQaDevFlow,
  StudyA2aRememberInterview,
  StudyA2aWhy,
} from './lesson/StudyA2aSections';
import {
  StudyOrchestrationComponents,
  StudyOrchestrationFailures,
  StudyOrchestrationInvestigation,
  StudyOrchestrationLlmCode,
  StudyOrchestrationProduction,
  StudyOrchestrationQaTesting,
  StudyOrchestrationRememberInterview,
  StudyOrchestrationSequence,
  StudyOrchestrationWhy,
} from './lesson/StudyOrchestrationSections';
import {
  StudyPlanningComponents,
  StudyPlanningFailures,
  StudyPlanningLlmCode,
  StudyPlanningOneRun,
  StudyPlanningProduction,
  StudyPlanningRememberInterview,
  StudyPlanningWhy,
} from './lesson/StudyPlanningSections';
import {
  StudySkillsComponents,
  StudySkillsFailures,
  StudySkillsFlow,
  StudySkillsLlmCode,
  StudySkillsProduction,
  StudySkillsRememberInterview,
  StudySkillsWhy,
} from './lesson/StudySkillsSections';
import {
  StudyFineTuningComponents,
  StudyFineTuningFailures,
  StudyFineTuningLlmCode,
  StudyFineTuningProduction,
  StudyFineTuningRememberInterview,
  StudyFineTuningLoginSpecExample,
  StudyFineTuningWhy,
} from './lesson/StudyFineTuningSections';
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
import { hasStudyLessonSources } from '../data/study/study-lesson-sources';
import { StudyProcessSchema } from './lesson/StudyProcessSchema';
import { isLikelyFlowDiagram, parseStudyFlowAscii } from '../lib/studyFlowSchema';
import {
  getLessonNavBlurb,
  getLessonOutcomesFlowAriaLabel,
  getStudyOutcomesLessonHint,
} from '../data/study/study-lesson-intros';
import { StudyOutcomesLessonHint } from './lesson/StudyOutcomesLessonHint';
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

  const lessonAside = topicId ? hasStudyLessonAside(topicId) : false;
  const progressSidebar = topicId ? hasStudyProgressSidebar(topicId) : false;
  const asideCompact = topicId ? isStudyProgressSidebarCompact(topicId) : false;

  return (
    <div
      className={`structured-study-layout study-mode-layout${progressSidebar ? ' study-mode-with-aside' : ''}${asideCompact ? ' study-mode-aside-compact' : ''}`}
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
          topicId === 'concept-01' ||
          topicId === 'concept-04' ||
          topicId === 'concept-12' ||
          topicId === 'concept-14' ||
          topicId === 'concept-06' ||
          topicId === 'concept-15' ||
          topicId === 'concept-13' ||
          topicId === 'concept-07' ||
          topicId === 'concept-11' ||
          topicId === 'concept-02' ||
          topicId === 'concept-16' ||
          topicId === 'concept-09' ||
          topicId === 'concept-17' ||
          topicId === 'concept-08') && (
          <aside
            className={`study-learning-outcomes${topicId === 'concept-12' ? ' study-learning-outcomes--reasoning-compact' : ''}`}
            aria-label="Що я зрозумію після цього уроку"
          >
            <h2 className="study-outcomes-title">Що я зрозумію після цього уроку</h2>
            <div className="markdown-body study-outcomes-body study-outcomes-with-flows">
              {topicId === 'concept-01' ? (
                <StudyMemoryStateLearningOutcomes />
              ) : topicId === 'concept-04' ? (
                <StudyHarnessLearningOutcomes />
              ) : topicId === 'concept-12' ? (
                <StudyReasoningLearningOutcomes />
              ) : topicId === 'concept-14' ? (
                <StudyPromptEngineeringLearningOutcomes />
              ) : topicId === 'concept-06' ? (
                <StudyMcpLearningOutcomes />
              ) : topicId === 'concept-15' ? (
                <StudyVectorDatabaseLearningOutcomes />
              ) : topicId === 'concept-13' ? (
                <StudyFineTuningLearningOutcomes />
              ) : topicId === 'concept-07' ? (
                <StudySkillsLearningOutcomes />
              ) : topicId === 'concept-11' ? (
                <StudyPlanningLearningOutcomes />
              ) : topicId === 'concept-02' ? (
                <StudyOrchestrationLearningOutcomes />
              ) : topicId === 'concept-16' ? (
                <StudyAgenticWorkflowsLearningOutcomes />
              ) : topicId === 'concept-09' ? (
                <StudyMultiAgentLearningOutcomes />
              ) : topicId === 'concept-17' ? (
                <StudyGuardrailsLearningOutcomes />
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

        {(sourcesMarkdown?.trim() || (topicId && hasStudyLessonSources(topicId))) && (
          <StudySourcesCollapsible topicId={topicId} markdown={sourcesMarkdown} />
        )}

        {progressSidebar && onLearningChange ? (
          <StudyProgressAsideCard
            className="study-progress-aside-mobile study-progress-aside-mobile--after-content"
            learning={learning}
            onLearningChange={onLearningChange}
          />
        ) : null}
      </div>

      {lessonAside && topicId && onLearningChange ? (
        <StudyLessonAside
          topicId={topicId}
          sections={sections}
          activeSectionId={activeNavId}
          learning={learning}
          onLearningChange={onLearningChange}
        />
      ) : null}

      {progressSidebar && !lessonAside && onLearningChange ? (
        <StudyProgressSidebarAside learning={learning} onLearningChange={onLearningChange} />
      ) : null}
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

function renderConcept06StudySection(sectionTitle?: string) {
  const t = (sectionTitle ?? '').toLowerCase();
  if (t.includes('навіщо')) {
    return <StudyMcpWhy />;
  }
  if (t.includes('навчальний') || (t.includes('run') && !t.includes('runtime'))) {
    return <StudyMcpRun />;
  }
  if (t.includes('компонент')) {
    return <StudyMcpComponents />;
  }
  if (t.includes('послідовність')) {
    return <StudyMcpSequence />;
  }
  if (/де код.*llm/i.test(t) || (t.includes('код') && (t.includes('llm') || t.includes('сервіс')))) {
    return <StudyMcpLlmCode />;
  }
  if (t.includes('збої') || t.includes('зламати')) {
    return <StudyMcpFailures />;
  }
  if (t.includes('production')) {
    return <StudyMcpProduction />;
  }
  if (t.includes('запам')) {
    const deck = getStudyInterviewDeck('concept-06');
    return (
      <div className="study-mcp-interview-section study-memory-state-interview-section">
        <StudyMcpRememberInterview />
        {deck ? <StudyInterviewSelfCheck deck={deck} /> : null}
      </div>
    );
  }
  return null;
}

function renderConcept08StudySection(sectionTitle?: string) {
  const t = (sectionTitle ?? '').toLowerCase();
  if (t.includes('навіщо')) {
    return <StudyA2aWhy />;
  }
  if (t.includes('переходить') || (t.includes('задача') && t.includes('dev'))) {
    return <StudyA2aQaDevFlow />;
  }
  if (/де код.*llm/i.test(t) || (t.includes('код') && t.includes('llm'))) {
    return <StudyA2aLlmCode />;
  }
  if (t.includes('зламати') || t.includes('збої')) {
    return <StudyA2aFailures />;
  }
  if (t.includes('запам')) {
    const deck = getStudyInterviewDeck('concept-08');
    return (
      <>
        <StudyA2aRememberInterview />
        {deck ? <StudyInterviewSelfCheck deck={deck} /> : null}
      </>
    );
  }
  return null;
}

function renderConcept09StudySection(sectionTitle?: string) {
  const t = (sectionTitle ?? '').toLowerCase();
  if (t.includes('навіщо')) {
    return <StudyMultiAgentWhy />;
  }
  if (t.includes('приклад') || t.includes('abc-123')) {
    return <StudyMultiAgentExample />;
  }
  if (/де код.*llm/i.test(t) || (t.includes('код') && t.includes('llm'))) {
    return <StudyMultiAgentLlmCode />;
  }
  if (t.includes('зламати') || t.includes('збої')) {
    return <StudyMultiAgentFailures />;
  }
  if (t.includes('запам')) {
    const deck = getStudyInterviewDeck('concept-09');
    return (
      <>
        <StudyMultiAgentRememberInterview />
        {deck ? <StudyInterviewSelfCheck deck={deck} /> : null}
      </>
    );
  }
  return null;
}

function renderConcept16StudySection(sectionTitle?: string) {
  const t = (sectionTitle ?? '').toLowerCase();
  if (t.includes('навіщо')) {
    return <StudyAgenticWorkflowsWhy />;
  }
  if (t.includes('приклад')) {
    return <StudyAgenticWorkflowsExample />;
  }
  if (t.includes('orchestration') || t.includes('різниця')) {
    return <StudyAgenticWorkflowsVsOrchestration />;
  }
  if (t.includes('зламати') || t.includes('збої')) {
    return <StudyAgenticWorkflowsFailures />;
  }
  if (t.includes('production')) {
    return <StudyAgenticWorkflowsProduction />;
  }
  if (t.includes('запам')) {
    const deck = getStudyInterviewDeck('concept-16');
    return (
      <>
        <StudyAgenticWorkflowsRememberInterview />
        {deck ? <StudyInterviewSelfCheck deck={deck} /> : null}
      </>
    );
  }
  return null;
}

function renderConcept02StudySection(sectionTitle?: string) {
  const t = (sectionTitle ?? '').toLowerCase();
  if (t.includes('навіщо')) {
    return <StudyOrchestrationWhy />;
  }
  if (t.includes('investigation') || t.includes('login_spec')) {
    return <StudyOrchestrationInvestigation />;
  }
  if (t.includes('складається') || t.includes('механізм')) {
    return <StudyOrchestrationComponents />;
  }
  if (t.includes('послідовність') || t.includes('капотом')) {
    return <StudyOrchestrationSequence />;
  }
  if (/де код.*llm/i.test(t) || (t.includes('код') && t.includes('llm'))) {
    return <StudyOrchestrationLlmCode />;
  }
  if (t.includes('зламати') || t.includes('зламатися') || t.includes('збої')) {
    return <StudyOrchestrationFailures />;
  }
  if (t.includes('qa') && t.includes('тест')) {
    return <StudyOrchestrationQaTesting />;
  }
  if (t.includes('production')) {
    return <StudyOrchestrationProduction />;
  }
  if (t.includes('запам')) {
    const deck = getStudyInterviewDeck('concept-02');
    return (
      <div className="study-orchestration-interview-section study-memory-state-interview-section">
        <StudyOrchestrationRememberInterview />
        {deck ? (
          <div className="study-memory-state-interview-block">
            <StudyInterviewSelfCheck deck={deck} />
          </div>
        ) : null}
      </div>
    );
  }
  return null;
}

function renderConcept11StudySection(sectionTitle?: string) {
  const t = (sectionTitle ?? '').toLowerCase();
  if (t.includes('навіщо')) {
    return <StudyPlanningWhy />;
  }
  if (t.includes('run') && t.includes('приклад')) {
    return <StudyPlanningOneRun />;
  }
  if (t.includes('компонент')) {
    return <StudyPlanningComponents />;
  }
  if (/де код.*llm/i.test(t) || (t.includes('код') && t.includes('llm'))) {
    return <StudyPlanningLlmCode />;
  }
  if (t.includes('зламатися') || t.includes('зламати') || t.includes('збої')) {
    return <StudyPlanningFailures />;
  }
  if (t.includes('production')) {
    return <StudyPlanningProduction />;
  }
  if (t.includes('запам')) {
    const deck = getStudyInterviewDeck('concept-11');
    return (
      <div className="study-planning-interview-section study-memory-state-interview-section">
        <StudyPlanningRememberInterview />
        {deck ? (
          <div className="study-memory-state-interview-block">
            <StudyInterviewSelfCheck deck={deck} />
          </div>
        ) : null}
      </div>
    );
  }
  return null;
}

function renderConcept07StudySection(sectionTitle?: string) {
  const t = (sectionTitle ?? '').toLowerCase();
  if (t.includes('навіщо')) {
    return <StudySkillsWhy />;
  }
  if (t.includes('компонент') || t.includes('складається')) {
    return <StudySkillsComponents />;
  }
  if (t.includes('послідовність') || t.includes('потрапляє')) {
    return <StudySkillsFlow />;
  }
  if (/де код.*llm/i.test(t) || (t.includes('код') && t.includes('llm'))) {
    return <StudySkillsLlmCode />;
  }
  if (t.includes('зламатися') || t.includes('збої')) {
    return <StudySkillsFailures />;
  }
  if (t.includes('production')) {
    return <StudySkillsProduction />;
  }
  if (t.includes('запам')) {
    const deck = getStudyInterviewDeck('concept-07');
    return (
      <div className="study-skills-interview-section study-memory-state-interview-section">
        <StudySkillsRememberInterview />
        {deck ? (
          <div className="study-memory-state-interview-block">
            <StudyInterviewSelfCheck deck={deck} />
          </div>
        ) : null}
      </div>
    );
  }
  return null;
}

function renderConcept13StudySection(sectionTitle?: string) {
  const t = (sectionTitle ?? '').toLowerCase();
  if (t.includes('навіщо')) {
    return <StudyFineTuningWhy />;
  }
  if (t.includes('складається') || t.includes('механізм')) {
    return <StudyFineTuningComponents />;
  }
  if (/де код.*llm/i.test(t) || (t.includes('код') && t.includes('llm'))) {
    return <StudyFineTuningLlmCode />;
  }
  if (t.includes('збої') || t.includes('зламати')) {
    return <StudyFineTuningFailures />;
  }
  if (t.includes('production')) {
    return <StudyFineTuningProduction />;
  }
  if (t.includes('запам')) {
    const deck = getStudyInterviewDeck('concept-13');
    return (
      <div className="study-fine-tuning-interview-section study-memory-state-interview-section">
        <StudyFineTuningRememberInterview />
        {deck ? (
          <div className="study-memory-state-interview-block">
            <StudyInterviewSelfCheck deck={deck} />
          </div>
        ) : null}
      </div>
    );
  }
  if (t.includes('investigation') || t.includes('login_spec') || t.includes('приклад')) {
    return <StudyFineTuningLoginSpecExample />;
  }
  return null;
}

function renderConcept15StudySection(sectionTitle?: string) {
  const t = (sectionTitle ?? '').toLowerCase();
  if (t.includes('навіщо')) return <StudyVectorDatabaseWhy />;
  if (t.includes('investigation') || t.includes('розслідуван')) {
    return <StudyVectorDatabaseInvestigation />;
  }
  if (t.includes('компонент')) {
    return <StudyVectorDatabaseComponents />;
  }
  if (t.includes('послідовність') || t.includes('runtime')) {
    return <StudyVectorDatabaseRuntime />;
  }
  if (/де код.*llm/i.test(t) || (t.includes('код') && t.includes('llm'))) {
    return <StudyVectorDatabaseLlmCode />;
  }
  if (t.includes('збої') || t.includes('зламати')) {
    return <StudyVectorDatabaseFailures />;
  }
  if (t.includes('production')) {
    return <StudyVectorDatabaseProduction />;
  }
  if (t.includes('запам')) {
    const deck = getStudyInterviewDeck('concept-15');
    return (
      <div className="study-vector-db-interview-section study-memory-state-interview-section">
        <StudyVectorDatabaseRememberInterview />
        {deck ? (
          <div className="study-memory-state-interview-block">
            <StudyInterviewSelfCheck deck={deck} />
          </div>
        ) : null}
      </div>
    );
  }
  return null;
}

function renderConcept01StudySection(sectionTitle?: string) {
  const t = (sectionTitle ?? '').toLowerCase();
  if (t.includes('навіщо') && t.includes('memory')) return <StudyMemoryStateWhy />;
  if (t.includes('login_spec') || t.includes('одному run')) return <StudyMemoryStateRun />;
  if (t.includes('складається')) return <StudyMemoryStateMechanism />;
  if (t.includes('послідовність')) return <StudyMemoryStateSequence />;
  if (/де код.*llm/i.test(t)) return <StudyMemoryStateLlmCode />;
  if (t.includes('зламатися')) return <StudyMemoryStateFailures />;
  if (/як qa(\s+це)?\s+тестує/i.test(t.trim())) return <StudyMemoryStateQaTesting />;
  if (t.includes('production')) return <StudyMemoryStateProduction />;
  if (t.includes('запам')) {
    const deck = getStudyInterviewDeck('concept-01');
    return (
      <div className="study-memory-state-interview-section">
        <StudyMemoryStateRememberInterview />
        {deck ? (
          <div className="study-memory-state-interview-block">
            <StudyInterviewSelfCheck deck={deck} />
          </div>
        ) : null}
      </div>
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
  if (topicId === 'concept-01') {
    const memorySection = renderConcept01StudySection(sectionTitle);
    if (memorySection) return memorySection;
  }

  if (topicId === 'concept-02') {
    const orchestrationSection = renderConcept02StudySection(sectionTitle);
    if (orchestrationSection) return orchestrationSection;
  }

  if (topicId === 'concept-16') {
    const workflowsSection = renderConcept16StudySection(sectionTitle);
    if (workflowsSection) return workflowsSection;
  }

  if (topicId === 'concept-08') {
    const a2aSection = renderConcept08StudySection(sectionTitle);
    if (a2aSection) return a2aSection;
  }

  if (topicId === 'concept-09') {
    const multiAgentSection = renderConcept09StudySection(sectionTitle);
    if (multiAgentSection) return multiAgentSection;
  }

  if (topicId === 'concept-06') {
    const mcpSection = renderConcept06StudySection(sectionTitle);
    if (mcpSection) return mcpSection;
  }

  if (topicId === 'concept-15') {
    const vectorDbSection = renderConcept15StudySection(sectionTitle);
    if (vectorDbSection) return vectorDbSection;
  }

  if (topicId === 'concept-13') {
    const fineTuningSection = renderConcept13StudySection(sectionTitle);
    if (fineTuningSection) return fineTuningSection;
  }

  if (topicId === 'concept-07') {
    const skillsSection = renderConcept07StudySection(sectionTitle);
    if (skillsSection) return skillsSection;
  }

  if (topicId === 'concept-11') {
    const planningSection = renderConcept11StudySection(sectionTitle);
    if (planningSection) return planningSection;
  }

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
    return <StudyGuardrailsLlmCode />;
  }

  if (topicId === 'concept-17' && isPolicyExampleSection(sectionTitle, text)) {
    return <StudyGuardrailsPolicyExample />;
  }

  if (topicId === 'concept-17' && isGuardrailsComponentsSection(sectionTitle)) {
    return <StudyGuardrailsComponents />;
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

function isGuardrailsComponentsSection(sectionTitle?: string): boolean {
  const t = (sectionTitle ?? '').trim().toLowerCase();
  return t === 'компоненти' || t.startsWith('компоненти ');
}

function renderGuardrailsBySection(sectionTitle?: string, text?: string) {
  const t = (sectionTitle ?? '').toLowerCase();
  if (t.includes('навіщо') && t.includes('guardrail')) return <StudyGuardrailsWhy />;
  if (t.includes('передається між')) return <StudyGuardrailsDataTransfer />;
  if (t.trim() === 'послідовність' || t.startsWith('послідовність ')) {
    return <StudyGuardrailsUnderHoodSequence />;
  }
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
