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
                  conceptGroups={section.conceptGroups}
                  pickConclusionLabelUk={section.pickConclusionLabelUk}
                  pickConclusionUk={section.pickConclusionUk}
                  navLayout={section.navLayout}
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

        return (
        <div key={section.labelUk} className="study-learner-panel-block">
          <dt className="study-learner-panel-label">{section.labelUk}</dt>
          <dd className="study-learner-panel-value">
            {section.type === 'prose' ? (
              <div className="study-learner-panel-prose">
                {section.labeledLead ? (
                  <StudyLabeledExplanation
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
                <ul
                  className={
                    section.layout === 'flow'
                      ? 'study-learner-panel-mini-list study-learner-panel-mini-list--flow'
                      : 'study-learner-panel-mini-list'
                  }
                >
                  {section.items.map((item) => (
                    <li
                      key={item.titleUk}
                      className={
                        section.layout === 'flow'
                          ? 'study-learner-panel-mini-card study-learner-panel-mini-card--flow-step'
                          : 'study-learner-panel-mini-card'
                      }
                    >
                      {section.layout === 'flow' ? (
                        <div className="study-panel-flow-step-inner">
                          <span className="study-panel-flow-step-badge">{item.titleUk}</span>
                          <span className="study-panel-flow-step-text study-learner-explanation">
                            {parseLessonBold(item.bodyUk)}
                          </span>
                        </div>
                      ) : (
                        <StudyLabeledExplanation termUk={item.titleUk} explanationUk={item.bodyUk} />
                      )}
                    </li>
                  ))}
                </ul>
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
                <StudyLabeledExplanationStack items={section.items} />
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
