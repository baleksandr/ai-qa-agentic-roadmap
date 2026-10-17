import { useMemo, useState } from 'react';
import type { StudyTeachingCardsBundle } from '../../data/study/study-teaching-card-types';
import { chainStageDetailToMarkdown } from '../../data/study/rag-chain-stage-details';
import { MarkdownBody } from '../MarkdownBody';
import { LessonRichParagraphs } from './lessonRichText';
import { StudyLearnerPanelBody } from './StudyLearnerPanelBody';
import { StudyLearnerFlowTrack } from './StudyLearnerFlowTrack';
import { StudyPanelTerms } from './StudyPanelTerms';
import { StudyPipelineStepNav } from './StudyPipelineStepNav';
import { StudyStepDetailLayout } from './StudyStepDetailLayout';
import { formatStudyCardNumber, studyCardPanelLabel } from '../../lib/studyCardNumber';
import { STUDY_EMPTY_PANEL_UK } from '../../lib/studyLearnerCopy';
import { StudyAfterInteractiveSummary } from './StudyAfterInteractiveSummary';
import { StudyModelResponseExampleBlock } from './StudyModelResponseExampleBlock';
import { StudyLearnerPanelCourseLessonLink } from './StudyLearnerPanelCourseLessonLink';

type Props = {
  bundle: StudyTeachingCardsBundle;
  className?: string;
};

/** Єдиний патерн навчальних карток + бокова панель (еталон RAG / Tool Calling). */
export function StudyTeachingCardsSection({ bundle, className = '' }: Props) {
  const firstKey = bundle.steps[0]?.key ?? '';
  const [activeKey, setActiveKey] = useState<string | number>(firstKey);

  const activeStep = bundle.steps.find((s) => s.key === activeKey) ?? bundle.steps[0];

  const panelMarkdown = useMemo(() => {
    if (!activeStep?.detail) return '';
    return chainStageDetailToMarkdown(activeStep.detail, { omitTerms: true });
  }, [activeStep]);

  const isConcepts = bundle.presentation === 'concepts';

  const flowStages = useMemo(() => {
    if (isConcepts) return [];
    if (bundle.flowArrowLine?.includes('→')) {
      return bundle.flowArrowLine.split('→').map((s) => s.trim());
    }
    return bundle.steps.map((s) => s.titleUk);
  }, [bundle.flowArrowLine, bundle.steps, isConcepts]);

  const navItems = useMemo(
    () =>
      bundle.steps.map((s) => ({
        key: s.key,
        titleUk: s.titleUk,
        teaserUk: s.teaserUk,
        detail: s.detail,
        navBadgeUk: s.cardBadgeUk,
        navActorUk: s.cardActorUk,
        clickable: true,
      })),
    [bundle.steps],
  );

  const orderedMainKeys =
    isConcepts && bundle.conceptGroups?.length
      ? bundle.conceptGroups.flatMap((g) => g.stepKeys)
      : bundle.steps.map((s) => s.key);
  const activeMainIndex = orderedMainKeys.indexOf(activeKey);
  const mainCardNumber =
    activeMainIndex >= 0 ? formatStudyCardNumber(undefined, activeMainIndex + 1) : undefined;
  const activeStepIndex = bundle.steps.findIndex((s) => s.key === activeKey);
  const activeFundamentalsPanel = bundle.steps.find((s) => s.key === activeKey)?.fundamentalsPanel;

  return (
    <section
      className={`study-teaching-cards study-rag-pipeline-glossary study-rag-one-query study-teaching-cards--cyber${isConcepts ? ' study-teaching-cards--concepts' : ''} ${className}`.trim()}
      aria-label={bundle.ariaLabel}
    >
      {bundle.introScenarioCard ? (
        <div className="study-teaching-intro-run-card lesson-callout lesson-key-idea">
          <span className="lesson-callout-label">{bundle.introScenarioCard.titleUk}</span>
          <div className="study-rag-story-intro-text">
            <LessonRichParagraphs
              text={bundle.introScenarioCard.bodyUk}
              className="study-rag-story-intro-text-p"
            />
          </div>
          {bundle.introScenarioCard.flowLineUk.includes('→') ? (
            <div className="study-teaching-intro-run-flow">
              <StudyLearnerFlowTrack
                stages={bundle.introScenarioCard.flowLineUk.split('→').map((s) => s.trim())}
                ariaLabel={bundle.introScenarioCard.titleUk}
              />
            </div>
          ) : null}
          {bundle.introScenarioCard.noteUk?.trim() ? (
            <p className="study-teaching-intro-run-note muted small">{bundle.introScenarioCard.noteUk}</p>
          ) : null}
        </div>
      ) : null}

      {bundle.leadUk ? (
        <div className="study-rag-story-intro lesson-callout lesson-key-idea">
          <span className="lesson-callout-label">
            {bundle.introCalloutLabelUk ?? (isConcepts ? 'Огляд теми' : 'Розбір по кроках')}
          </span>
          <div className="study-rag-story-intro-text">
            <LessonRichParagraphs text={bundle.leadUk} className="study-rag-story-intro-text-p" />
          </div>
        </div>
      ) : null}

      {bundle.introDataExample ? (
        <div className="study-teaching-intro-data-example">
          <StudyModelResponseExampleBlock block={bundle.introDataExample} />
        </div>
      ) : null}

      {isConcepts && bundle.conceptsHeadingUk ? (
        <h3 className="study-teaching-concepts-heading">{bundle.conceptsHeadingUk}</h3>
      ) : null}

      {flowStages.length >= 3 ? (
        <div className="study-teaching-cards-flow-overview">
          <StudyLearnerFlowTrack stages={flowStages} ariaLabel={bundle.ariaLabel} />
        </div>
      ) : null}

      <StudyStepDetailLayout
        wrapperClassName="study-rag-pipeline-with-panel study-teaching-cards-layout"
        navAriaLabel={bundle.ariaLabel}
        nav={
          <>
            <StudyPipelineStepNav
              items={navItems}
              activeKey={activeKey}
              onSelect={setActiveKey}
              ariaLabel={bundle.ariaLabel}
              presentation={bundle.presentation}
              conceptGroups={bundle.conceptGroups}
            />
          </>
        }
        panel={
          activeStep && (activeFundamentalsPanel || panelMarkdown) ? (
            <>
              <p className="study-rag-qa-panel-label">
                {mainCardNumber
                  ? studyCardPanelLabel(mainCardNumber)
                  : isConcepts
                    ? 'Поняття'
                    : `Крок ${activeStepIndex + 1} з ${bundle.steps.length}`}
              </p>
              <h4 className="study-rag-qa-panel-title">{activeStep.titleUk}</h4>
              {!activeFundamentalsPanel && activeStep.teaserUk ? (
                <p className="study-tc-lesson-line">{activeStep.teaserUk}</p>
              ) : null}
              <div className="study-rag-qa-panel-body study-detail-panel-with-terms">
                {activeFundamentalsPanel ? (
                  <StudyLearnerPanelBody
                    panel={activeFundamentalsPanel}
                    parentCardNumber={mainCardNumber}
                  />
                ) : (
                  <div className="markdown-body">
                    <MarkdownBody markdown={panelMarkdown} studyTables studyPanelLabels />
                  </div>
                )}
                {!activeFundamentalsPanel && activeStep.detail.terms?.length ? (
                  <StudyPanelTerms terms={activeStep.detail.terms} />
                ) : null}
              </div>
            </>
          ) : (
            <p className="study-rag-qa-panel-empty muted small">{STUDY_EMPTY_PANEL_UK}</p>
          )
        }
      />

      {bundle.afterInteractiveSummary ? (
        <StudyAfterInteractiveSummary summary={bundle.afterInteractiveSummary} />
      ) : null}

      {bundle.courseContinueLink ? (
        <nav
          className="study-teaching-course-continue"
          aria-label="Наступна частина маршруту"
        >
          <p className="study-teaching-course-continue-text study-learner-explanation">
            {bundle.courseContinueLink.sentenceUk}
          </p>
          <StudyLearnerPanelCourseLessonLink
            topicId={bundle.courseContinueLink.topicId}
            linkLabelUk={bundle.courseContinueLink.linkLabelUk}
          />
        </nav>
      ) : null}
    </section>
  );
}
