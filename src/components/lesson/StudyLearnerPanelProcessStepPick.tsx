import { useMemo, useState } from 'react';
import type { StudyLearnerPanelProcessStepPickSection } from '../../data/study/study-learner-panel-sections';
import { StudyLearnerExplanationBlocks } from './StudyLearnerExplanationBlocks';
import { StudyModelResponseExampleBlock } from './StudyModelResponseExampleBlock';
import { StudyLearnerPanelQaCheck } from './StudyLearnerPanelQaCheck';
import { StudyLabeledExplanation } from './StudyLabeledExplanation';
import { StudyLabeledExplanationStack } from './StudyLabeledExplanationStack';
import { StudyPipelineStepNav } from './StudyPipelineStepNav';
import { StudyStepDetailLayout } from './StudyStepDetailLayout';
import { formatStudyCardNumber, studyCardPanelLabel } from '../../lib/studyCardNumber';
import { STUDY_EMPTY_PANEL_UK } from '../../lib/studyLearnerCopy';
import { parseLessonBold } from './lessonRichText';
import { StudyPanelTerms } from './StudyPanelTerms';

export type StudyLearnerPanelProcessStep = {
  key: string;
  titleUk: string;
  teaserUk: string;
  actorUk: string;
  detailUk: string;
  qaCheckUk?: string;
};

type Props = Pick<
  StudyLearnerPanelProcessStepPickSection,
  | 'labelUk'
  | 'pickAriaLabel'
  | 'steps'
  | 'qaEvidence'
  | 'presentation'
  | 'leadUk'
  | 'leadLabeledPairs'
  | 'modelResponseExample'
  | 'showActorInPanel'
  | 'showStepIndexInPanel'
  | 'conceptGroups'
  | 'pickConclusionLabelUk'
  | 'pickConclusionUk'
  | 'navLayout'
> & {
  parentCardNumber?: string;
};

/** Компактний процес у правій панелі: картки кроків + пояснення обраного (спільний StudyStepDetailLayout). */
export function StudyLearnerPanelProcessStepPick({
  labelUk,
  pickAriaLabel,
  steps,
  qaEvidence,
  presentation = 'process',
  leadUk,
  leadLabeledPairs,
  modelResponseExample,
  parentCardNumber,
  showActorInPanel = true,
  showStepIndexInPanel = true,
  conceptGroups,
  pickConclusionLabelUk,
  pickConclusionUk,
  navLayout = 'sidebar',
}: Props) {
  const firstKey = steps[0]?.key ?? '';
  const [activeKey, setActiveKey] = useState<string>(firstKey);

  const active = steps.find((s) => s.key === activeKey) ?? steps[0];
  const activeStepIndex = steps.findIndex((s) => s.key === activeKey);
  const activeCardNumber =
    activeStepIndex >= 0
      ? formatStudyCardNumber(parentCardNumber, activeStepIndex + 1)
      : undefined;

  const navItems = useMemo(
    () =>
      steps.map((s) => ({
        key: s.key,
        titleUk: s.titleUk,
        teaserUk: s.teaserUk,
        actorUk: s.actorUk,
        clickable: true,
      })),
    [steps],
  );

  const stepNav = (
    <StudyPipelineStepNav
      items={navItems}
      activeKey={activeKey}
      onSelect={(k) => setActiveKey(String(k))}
      ariaLabel={pickAriaLabel}
      presentation={presentation}
      conceptGroups={conceptGroups}
      numberPrefix={parentCardNumber}
    />
  );

  const detailPanel = active ? (
    <>
      {activeCardNumber ? (
        <p className="study-rag-qa-panel-label">{studyCardPanelLabel(activeCardNumber)}</p>
      ) : showStepIndexInPanel ? (
        <p className="study-rag-qa-panel-label">
          {presentation === 'concepts' ? 'Питання' : 'Крок'} {activeStepIndex + 1} з {steps.length}
        </p>
      ) : null}
      <h5 className="study-learner-panel-step-pick-panel-title">{active.titleUk}</h5>
      {showActorInPanel && active.actorUk?.trim() ? (
        <p className="study-learner-panel-step-pick-actor muted small">
          Виконує: <span className="study-term-accent">{active.actorUk}</span>
        </p>
      ) : null}
      <div className="study-learner-panel-step-pick-panel-body">
        {active.detailSections?.length ? (
          <dl className="study-learner-panel study-learner-panel--step-pick-detail">
            {active.detailSections.map((sec) => (
              <div key={sec.labelUk} className="study-learner-panel-block">
                <dt className="study-learner-panel-label">{sec.labelUk}</dt>
                <dd className="study-learner-panel-value">
                          {sec.labeledLead ? (
                            <StudyLabeledExplanation
                              termUk={sec.labeledLead.termUk}
                              explanationUk={sec.labeledLead.explanationUk}
                            />
                          ) : null}
                          {sec.bodyUk?.trim() || sec.labeledPairs?.length ? (
                            <StudyLearnerExplanationBlocks
                              bodyUk={sec.bodyUk ?? ''}
                              labeledPairs={sec.labeledPairs}
                            />
                          ) : null}
                        </dd>
              </div>
            ))}
          </dl>
        ) : active.detailUk?.trim() ? (
          <StudyLearnerExplanationBlocks bodyUk={active.detailUk} />
        ) : null}
        {active.exampleUk?.trim() ? (
          <div className="study-learner-panel-step-pick-example">
            <p className="study-learner-panel-label">Приклад login_spec</p>
            <StudyLearnerExplanationBlocks bodyUk={active.exampleUk} />
          </div>
        ) : null}
        {active.qaCheckUk?.trim() ? (
          <StudyLearnerPanelQaCheck bodyUk={active.qaCheckUk} />
        ) : null}
        {active.terms?.length ? <StudyPanelTerms terms={active.terms} /> : null}
      </div>
    </>
  ) : (
    <p className="study-rag-qa-panel-empty muted small">{STUDY_EMPTY_PANEL_UK}</p>
  );

  const layoutClassName =
    navLayout === 'rowAbovePanel'
      ? 'study-learner-panel-step-pick-layout study-learner-panel-step-pick-layout--row-above-panel'
      : 'study-learner-panel-step-pick-layout';

  return (
    <div className="study-learner-panel-step-pick">
      <p className="study-learner-panel-step-pick-heading">{labelUk}</p>
      {modelResponseExample ? (
        <div className="study-learner-panel-step-pick-lead">
          <StudyModelResponseExampleBlock block={modelResponseExample} />
        </div>
      ) : null}
      {!modelResponseExample && (leadUk?.trim() || leadLabeledPairs?.length) ? (
        <div className="study-learner-panel-step-pick-lead">
          <StudyLearnerExplanationBlocks
            bodyUk={leadUk ?? ''}
            labeledPairs={leadLabeledPairs}
          />
        </div>
      ) : null}
      {navLayout === 'rowAbovePanel' ? (
        <div className={layoutClassName}>
          <nav className="study-learner-panel-step-pick-row-nav" aria-label={pickAriaLabel}>
            {stepNav}
          </nav>
          <aside
            className="study-learner-panel-step-pick-row-panel study-rag-qa-detail-panel"
            aria-live="polite"
          >
            {detailPanel}
          </aside>
        </div>
      ) : (
        <StudyStepDetailLayout
          wrapperClassName={layoutClassName}
          navAriaLabel={pickAriaLabel}
          nav={stepNav}
          panel={detailPanel}
        />
      )}
      {pickConclusionLabelUk?.trim() && pickConclusionUk?.trim() ? (
        <div className="study-learner-term-pair-conclusion study-learner-panel-step-pick-conclusion">
          <p className="study-learner-term-pair-conclusion-label">{pickConclusionLabelUk}</p>
          <p className="study-learner-term-pair-conclusion-body study-learner-explanation">
            {parseLessonBold(pickConclusionUk)}
          </p>
        </div>
      ) : null}
      {qaEvidence?.items.length ? (
        <section className="study-learner-panel-qa-evidence" aria-label={qaEvidence.labelUk}>
          <h5 className="study-learner-panel-qa-evidence-title">{qaEvidence.labelUk}</h5>
          <StudyLabeledExplanationStack items={qaEvidence.items} />
        </section>
      ) : null}
    </div>
  );
}
