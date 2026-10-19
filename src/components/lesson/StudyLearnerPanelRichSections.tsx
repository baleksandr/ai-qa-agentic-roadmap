import type { StudyLearnerPanelSection } from '../../data/study/study-learner-panel-sections';
import { parseLessonBold } from './lessonRichText';
import { StudyLabeledExplanation } from './StudyLabeledExplanation';
import { StudyLabeledExplanationStack } from './StudyLabeledExplanationStack';
import { StudyLearnerConceptMiniCards } from './StudyLearnerConceptMiniCards';
import { StudyLearnerExplanationBlocks } from './StudyLearnerExplanationBlocks';
import { StudyLearnerPanelProcessStepPick } from './StudyLearnerPanelProcessStepPick';
import { StudyLearnerPanelQaCheck } from './StudyLearnerPanelQaCheck';
import { StudyLearnerPanelTermPairCards } from './StudyLearnerPanelTermPairCards';
import { StudyLearnerPanelCourseLessonLink } from './StudyLearnerPanelCourseLessonLink';
import { StudyModelResponseExampleBlock } from './StudyModelResponseExampleBlock';
import { StudyLearnerPanelCollapsibleTraceSample } from './StudyLearnerPanelCollapsibleTraceSample';
import { StudyTermDefinitionCard } from './StudyTermDefinitionCard';
import { StudyLearnerPanelOutcomeCard } from './StudyLearnerPanelOutcomeCard';

type Props = {
  sections: StudyLearnerPanelSection[];
  parentCardNumber?: string;
};

/** Структурні блоки навчальної панелі: теза, мінікартки, ланцюг понять, механізм → перевірка. */
export function StudyLearnerPanelRichSections({ sections, parentCardNumber }: Props) {
  return (
    <dl className="study-learner-panel">
      {sections.map((section, sectionIndex) => {
        if (section.type === 'processStepPick') {
          return (
            <div
              key={section.labelUk}
              className="study-learner-panel-block study-learner-panel-block--step-pick"
            >
              <dd className="study-learner-panel-value study-learner-panel-value--flush">
                <StudyLearnerPanelProcessStepPick
                  labelUk={section.labelUk}
                  pickAriaLabel={section.pickAriaLabel}
                  steps={section.steps}
                  qaEvidence={section.qaEvidence}
                  presentation={section.presentation}
                  leadUk={section.leadUk}
                  leadLabeledPairs={section.leadLabeledPairs}
                  modelResponseExample={section.modelResponseExample}
                  parentCardNumber={parentCardNumber}
                  showActorInPanel={section.showActorInPanel}
                  showStepIndexInPanel={section.showStepIndexInPanel}
                  showNestedCardNumberInPanel={section.showNestedCardNumberInPanel}
                  pickPanelDetailVariant={section.pickPanelDetailVariant}
                  conceptGroups={section.conceptGroups}
                  pickConclusionLabelUk={section.pickConclusionLabelUk}
                  pickConclusionUk={section.pickConclusionUk}
                  navLayout={section.navLayout}
                  interactionHintUk={section.interactionHintUk}
                  navCompactTitleOnly={section.navCompactTitleOnly}
                />
              </dd>
            </div>
          );
        }

        if (section.type === 'collapsibleTraceSample') {
          return (
            <div key={section.summaryUk} className="study-learner-panel-block">
              <dd className="study-learner-panel-value study-learner-panel-value--flush">
                <StudyLearnerPanelCollapsibleTraceSample
                  summaryUk={section.summaryUk}
                  jsonExample={section.jsonExample}
                  fieldExplanations={section.fieldExplanations}
                  calloutUk={section.calloutUk}
                />
              </dd>
            </div>
          );
        }

        if (section.type === 'modelResponseExample') {
          return (
            <div key={section.labelUk} className="study-learner-panel-block">
              <dt className="study-learner-panel-label">{section.labelUk}</dt>
              <dd className="study-learner-panel-value study-learner-panel-value--flush">
                <StudyModelResponseExampleBlock block={section.block} />
              </dd>
            </div>
          );
        }

        if (section.type === 'courseLessonLink') {
          return (
            <div
              key={`courseLessonLink-${section.topicId}`}
              className="study-learner-panel-block study-learner-panel-block--course-link"
            >
              <dd className="study-learner-panel-value study-learner-panel-value--flush">
                <StudyLearnerPanelCourseLessonLink
                  topicId={section.topicId}
                  linkLabelUk={section.linkLabelUk}
                />
              </dd>
            </div>
          );
        }

        if (section.type === 'cardIntent') {
          const intentLabel =
            section.labelUk?.trim() || 'Що я зрозумію з цієї картки';
          return (
            <div
              key={`cardIntent-${sectionIndex}`}
              className="study-learner-panel-block study-learner-panel-block--card-intent"
            >
              <dd className="study-learner-panel-value study-learner-panel-value--flush">
                <div className="study-learner-panel-card-intent" role="note">
                  {section.hideLabel ? null : (
                    <p className="study-learner-panel-card-intent-label">{intentLabel}</p>
                  )}
                  <p className="study-learner-panel-card-intent-body study-learner-explanation">
                    {parseLessonBold(section.bodyUk)}
                  </p>
                </div>
              </dd>
            </div>
          );
        }

        if (section.type === 'termDefinition' || section.type === 'definitionAccent') {
          const termUk = section.type === 'termDefinition' ? section.termUk : section.termUk;
          const explanationUk =
            section.type === 'termDefinition' ? section.explanationUk : section.leadUk;
          const termEn = section.termEn;
          return (
            <div
              key={`termDef-${sectionIndex}-${termUk}`}
              className="study-learner-panel-block study-learner-panel-block--term-definition"
            >
              <dd className="study-learner-panel-value study-learner-panel-value--flush">
                <StudyTermDefinitionCard
                  termUk={termUk}
                  explanationUk={explanationUk}
                  termEn={termEn}
                />
              </dd>
            </div>
          );
        }

        if (section.type === 'qaCheck') {
          return (
            <div
              key={`qaCheck-${sectionIndex}`}
              className="study-learner-panel-block study-learner-panel-block--qa-check"
            >
              <dd className="study-learner-panel-value study-learner-panel-value--flush">
                <StudyLearnerPanelQaCheck bodyUk={section.bodyUk} />
              </dd>
            </div>
          );
        }

        const hideMiniCardsSectionLabel =
          section.type === 'miniCards' && section.hideSectionLabel;
        const hidePlainSectionLabel =
          section.type === 'plain' && section.hideLabel === true;
        const hideSectionLabel = hideMiniCardsSectionLabel || hidePlainSectionLabel;
        const framedPlainBlock =
          (section.type === 'plain' && section.framed === true) ||
          (section.type === 'orderedList' && section.framed === true) ||
          (section.type === 'labeledLines' && section.framed === true) ||
          (section.type === 'miniCards' && section.framed === true);
        const framedVariant =
          section.type === 'plain' ||
          section.type === 'orderedList' ||
          section.type === 'labeledLines' ||
          section.type === 'miniCards'
            ? section.framedVariant
            : undefined;
        const framedAccentClass =
          framedVariant === 'why'
            ? 'study-learner-panel-block--framed-why'
            : framedVariant === 'expect'
              ? 'study-learner-panel-block--framed-expect'
              : framedVariant === 'limit'
                ? 'study-learner-panel-block--framed-limit'
                : '';
        return (
        <div
          key={`${section.labelUk}-${sectionIndex}`}
          className={[
            'study-learner-panel-block',
            framedPlainBlock ? 'study-learner-panel-block--framed' : '',
            framedAccentClass,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {hideSectionLabel ? null : (
            <dt className="study-learner-panel-label">{section.labelUk}</dt>
          )}
          <dd
            className={`study-learner-panel-value${
              hideSectionLabel ? ' study-learner-panel-value--flush' : ''
            }`}
          >
            {section.type === 'prose' ? (
              <div className="study-learner-panel-prose">
                {section.labeledLead ? (
                  <StudyTermDefinitionCard
                    termUk={section.labeledLead.termUk}
                    explanationUk={section.labeledLead.explanationUk}
                  />
                ) : section.thesisUk ? (
                  <p className="study-learner-panel-thesis study-learner-explanation">
                    {parseLessonBold(section.thesisUk)}
                  </p>
                ) : null}
                <StudyLearnerExplanationBlocks
                  bodyUk={section.bodyUk}
                  labeledPairs={section.labeledPairs}
                />
              </div>
            ) : null}

            {section.type === 'termPairCards' ? (
              <StudyLearnerPanelTermPairCards
                cards={section.cards}
                conclusionLabelUk={section.conclusionLabelUk}
                conclusionUk={section.conclusionUk}
              />
            ) : null}

            {section.type === 'miniCards' ? (
              <div
                className={`study-learner-panel-mini-wrap${section.layout === 'flow' ? ' study-learner-panel-mini-wrap--flow' : ''}`}
              >
                {section.captionUk && section.layout !== 'flow' ? (
                  <p className="study-learner-panel-caption study-learner-explanation muted small">
                    {parseLessonBold(section.captionUk)}
                  </p>
                ) : null}
                {(() => {
                  const outcomeStack =
                    section.layout !== 'numberedStack' &&
                    (section.layout === 'titledStack' ||
                      (section.layout !== 'flow' && section.items.some((item) => item.tone)));
                  const listClass =
                    section.layout === 'flow'
                      ? 'study-learner-panel-mini-list study-learner-panel-mini-list--flow'
                      : section.layout === 'numberedStack'
                        ? 'study-learner-panel-mini-list study-learner-panel-mini-list--numbered-stack'
                        : outcomeStack
                          ? 'study-learner-panel-mini-list study-learner-panel-mini-list--outcome-stack'
                          : 'study-learner-panel-mini-list';
                  return (
                <ul className={listClass}>
                  {section.items.map((item, itemIndex) => (
                    <li key={item.titleUk}>
                      {section.layout === 'numberedStack' ? (
                        <div className="study-learner-panel-mini-card study-learner-panel-mini-card--numbered">
                          <div className="study-learner-panel-mini-card-numbered-head">
                            <span
                              className="study-learner-panel-mini-card-step-badge"
                              aria-hidden="true"
                            >
                              {itemIndex + 1}
                            </span>
                            <p className="study-learner-panel-mini-card-heading">{item.titleUk}</p>
                          </div>
                          <p className="study-learner-panel-mini-card-body study-learner-explanation">
                            {parseLessonBold(item.bodyUk)}
                          </p>
                        </div>
                      ) : section.layout === 'flow' ? (
                        <div className="study-learner-panel-mini-card study-learner-panel-mini-card--flow-step">
                          <div className="study-panel-flow-step-inner">
                            <span className="study-panel-flow-step-badge">{item.titleUk}</span>
                            <span className="study-panel-flow-step-text study-learner-explanation">
                              {parseLessonBold(item.bodyUk)}
                            </span>
                          </div>
                        </div>
                      ) : outcomeStack || item.tone ? (
                        <StudyLearnerPanelOutcomeCard
                          titleUk={item.titleUk}
                          bodyUk={item.bodyUk}
                          footnoteUk={item.footnoteUk}
                          tone={
                            item.tone !== undefined
                              ? item.tone
                              : section.layout === 'titledStack'
                                ? 'neutral'
                                : undefined
                          }
                        />
                      ) : (
                        <div className="study-learner-panel-mini-card">
                          <StudyLabeledExplanation termUk={item.titleUk} explanationUk={item.bodyUk} />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                  );
                })()}
                {section.captionUk && section.layout === 'flow' ? (
                  <p className="study-learner-panel-caption study-learner-panel-flow-footnote study-learner-explanation muted small">
                    {parseLessonBold(section.captionUk)}
                  </p>
                ) : null}
              </div>
            ) : null}

            {section.type === 'taxonomy' ? (
              <StudyLearnerConceptMiniCards items={section.items} footnoteUk={section.footnoteUk} />
            ) : null}

            {section.type === 'mechanismChecks' ? (
              <ul className="study-learner-panel-check-list">
                {section.rows.map((row) => (
                  <li key={row.mechanismUk} className="study-learner-panel-check-row">
                    <StudyLabeledExplanation
                      termUk={row.mechanismUk}
                      explanationUk={row.checkUk}
                      separatorUk=" → "
                      className="study-learner-labeled-line study-learner-check-line"
                    />
                  </li>
                ))}
              </ul>
            ) : null}

            {section.type === 'labeledLines' ? (
              <div
                className={
                  section.panelCard ? 'study-learner-panel-focus-card' : undefined
                }
              >
                {section.leadUk?.trim() ? (
                  <p className="study-learner-panel-focus-card-lead study-learner-explanation muted small">
                    {parseLessonBold(section.leadUk)}
                  </p>
                ) : null}
                <StudyLabeledExplanationStack items={section.items} />
              </div>
            ) : null}

            {section.type === 'orderedList' ? (
              <div className="study-learner-panel-ordered-list-wrap">
                <ol className="study-learner-panel-ordered-list study-learner-explanation">
                  {section.items.map((item) => (
                    <li key={item} className="study-learner-panel-ordered-list-item">
                      {parseLessonBold(item)}
                    </li>
                  ))}
                </ol>
                {section.noteUk?.trim() ? (
                  <p className="study-learner-panel-ordered-list-note study-learner-explanation">
                    {parseLessonBold(section.noteUk)}
                  </p>
                ) : null}
              </div>
            ) : null}

            {section.type === 'plain' ? (
              <>
                <StudyLearnerExplanationBlocks bodyUk={section.bodyUk} />
                {section.qaCheckUk?.trim() ? (
                  <StudyLearnerPanelQaCheck bodyUk={section.qaCheckUk} />
                ) : null}
              </>
            ) : null}
          </dd>
        </div>
        );
      })}
    </dl>
  );
}
