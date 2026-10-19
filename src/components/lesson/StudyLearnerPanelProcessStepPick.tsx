import { useMemo, useState } from 'react';
import type { StudyLearnerPanelProcessStepPickSection } from '../../data/study/study-learner-panel-sections';
import { StudyLearnerExplanationBlocks } from './StudyLearnerExplanationBlocks';
import { StudyModelResponseExampleBlock } from './StudyModelResponseExampleBlock';
import { StudyLearnerPanelQaCheck } from './StudyLearnerPanelQaCheck';
import { StudyTermDefinitionCard } from './StudyTermDefinitionCard';
import { StudyLabeledExplanationStack } from './StudyLabeledExplanationStack';
import { StudyPipelineStepNav } from './StudyPipelineStepNav';
import { StudyStepDetailLayout } from './StudyStepDetailLayout';
import { formatStudyCardNumber, studyCardPanelLabel } from '../../lib/studyCardNumber';
import { studyOutcomeShellToneFromStepKey } from '../../lib/studyOutcomeShellTone';
import { STUDY_EMPTY_PANEL_UK } from '../../lib/studyLearnerCopy';
import { shouldShowNestedProcessStepPickHint } from '../../lib/studyPageInteractive';
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
  | 'showNestedCardNumberInPanel'
  | 'pickPanelDetailVariant'
  | 'conceptGroups'
  | 'pickConclusionLabelUk'
  | 'pickConclusionUk'
  | 'navLayout'
  | 'interactionHintUk'
  | 'navCompactTitleOnly'
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
  showNestedCardNumberInPanel = true,
  pickPanelDetailVariant,
  conceptGroups,
  pickConclusionLabelUk,
  pickConclusionUk,
  navLayout = 'sidebar',
  interactionHintUk,
  navCompactTitleOnly = false,
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
      compactNav={navCompactTitleOnly}
    />
  );

  const outcomeShellTone = active ? studyOutcomeShellToneFromStepKey(active.key) : 'neutral';
  const outcomeBlockClass =
    pickPanelDetailVariant === 'outcome'
      ? 'study-learner-panel-block study-explainer-block'
      : 'study-learner-panel-block';

  const detailPanel = active ? (
    <>
      {activeCardNumber && showNestedCardNumberInPanel ? (
        <p className="study-rag-qa-panel-label">{studyCardPanelLabel(activeCardNumber)}</p>
      ) : showStepIndexInPanel ? (
        <p className="study-rag-qa-panel-label">
          {presentation === 'concepts' ? 'Питання' : 'Крок'} {activeStepIndex + 1} з {steps.length}
        </p>
      ) : null}
      <div
        className={
          pickPanelDetailVariant === 'outcome'
            ? `study-learner-panel-outcome-detail-shell study-learner-panel-outcome-detail-shell--${outcomeShellTone}`
            : undefined
        }
      >
        <h5
          className={[
            'study-learner-panel-step-pick-panel-title',
            pickPanelDetailVariant === 'outcome'
              ? `study-learner-panel-step-pick-panel-title--outcome study-learner-panel-step-pick-panel-title--tone-${outcomeShellTone}`
              : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {active.titleUk}
        </h5>
        {showActorInPanel && active.actorUk?.trim() ? (
          <p className="study-learner-panel-step-pick-actor muted small">
            Виконує: <span className="study-term-accent">{active.actorUk}</span>
          </p>
        ) : null}
        <div className="study-learner-panel-step-pick-panel-body">
          {active.detailSections?.length ? (
            <>
              {active.detailUk?.trim() ? (
                <StudyLearnerExplanationBlocks bodyUk={active.detailUk} />
              ) : null}
              <dl className="study-learner-panel study-learner-panel--step-pick-detail">
                {active.detailSections.map((sec) => (
                  <div key={sec.labelUk} className={outcomeBlockClass}>
                <dt
                  className={
                    sec.hideLabel ? 'study-learner-panel-label sr-only' : 'study-learner-panel-label'
                  }
                >
                  {sec.hideLabel ? sec.labelUk || 'Пояснення' : sec.labelUk}
                </dt>
                <dd className="study-learner-panel-value">
                          {sec.labeledLead ? (
                            <StudyTermDefinitionCard
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
          </>
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
      </div>
    </>
  ) : (
    <p className="study-rag-qa-panel-empty muted small">{STUDY_EMPTY_PANEL_UK}</p>
  );

  const layoutClassName = [
    'study-learner-panel-step-pick-layout',
    navLayout === 'rowAbovePanel' ? 'study-learner-panel-step-pick-layout--row-above-panel' : '',
    pickPanelDetailVariant === 'outcome'
      ? 'study-learner-panel-step-pick-layout--outcome-detail'
      : '',
    navCompactTitleOnly ? 'study-learner-panel-step-pick-layout--compact-nav' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="study-learner-panel-step-pick">
      <p className="study-learner-panel-step-pick-heading">{labelUk}</p>
      {shouldShowNestedProcessStepPickHint(interactionHintUk) ? (
        <p className="study-learner-panel-step-pick-hint study-interaction-hint study-harness-section-cards-hint" role="note">
          <span className="study-interaction-hint-label">Підказка</span>
          <span className="study-interaction-hint-text">{interactionHintUk!.trim()}</span>
        </p>
      ) : null}
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
      {pickConclusionUk?.trim() ? (
        <div className="study-learner-term-pair-conclusion study-learner-panel-step-pick-conclusion">
          {pickConclusionLabelUk?.trim() ? (
            <p className="study-learner-term-pair-conclusion-label">{pickConclusionLabelUk}</p>
          ) : null}
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
