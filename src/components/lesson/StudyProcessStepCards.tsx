import type { ProcessStep } from '../../lib/studyBodyFormat';
import { buildProcessStepsTeachingBundle } from '../../data/study/study-teaching-cards.registry';
import {
  GUARDRAILS_UNDER_THE_HOOD_INTRO,
  lookupGuardrailsProcessStep,
} from '../../data/study/guardrails-process-steps';
import { lookupRagFlowStep } from '../../data/study/rag-query-flow-steps';
import { LessonRichParagraphs } from './lessonRichText';
import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';

type Props = {
  steps: ProcessStep[];
  topicId?: string;
  sectionHint?: string;
};

function isGuardrailsUnderTheHoodSection(topicId?: string, sectionHint?: string) {
  return (
    topicId === 'concept-17' &&
    (sectionHint?.toLowerCase().includes('крок за кроком') ||
      sectionHint?.toLowerCase().includes('під капотом'))
  );
}

export function StudyProcessStepCards({ steps, topicId, sectionHint }: Props) {
  const teachingBundle =
    topicId && sectionHint ? buildProcessStepsTeachingBundle(topicId, sectionHint, steps) : null;
  if (teachingBundle) {
    return (
      <StudyTeachingCardsSection
        bundle={{
          ...teachingBundle,
          leadUk: isGuardrailsUnderTheHoodSection(topicId, sectionHint)
            ? GUARDRAILS_UNDER_THE_HOOD_INTRO.replace(/\*\*/g, '')
            : teachingBundle.leadUk,
        }}
      />
    );
  }

  const isGuardrailsFlow =
    topicId === 'concept-17' &&
    (sectionHint?.toLowerCase().includes('крок за кроком') ||
      sectionHint?.toLowerCase().includes('під капотом') ||
      steps.some((s) => lookupGuardrailsProcessStep(s.text)));

  const isRagQueryFlow =
    topicId === 'concept-03' && sectionHint?.toLowerCase().includes('одному запиті');

  return (
    <div className="study-step-section">
      {isGuardrailsFlow && (
        <div className="study-step-intro lesson-callout lesson-key-idea">
          <span className="lesson-callout-label">Коротко: що «під капотом»</span>
          <LessonRichParagraphs text={GUARDRAILS_UNDER_THE_HOOD_INTRO} className="lesson-p" />
        </div>
      )}
      <ol className="study-step-cards" aria-label="Кроки процесу">
        {steps.map((step) => {
          const guardHelp = topicId === 'concept-17' ? lookupGuardrailsProcessStep(step.text) : null;
          const ragHelp = isRagQueryFlow ? lookupRagFlowStep(step.index, step.text) : null;
          const help = guardHelp ?? ragHelp;
          return (
            <li key={step.index} className="study-step-card">
              <span className="study-step-badge" aria-hidden="true">{step.index}</span>
              <div className="study-step-body">
                {help && 'qaUk' in help && help.qaUk ? (
                  <>
                    <div className="study-step-head">
                      <h4 className="study-step-title">{help.titleUk}</h4>
                      <span className={`study-step-actor actor-${help.actor}`}>{help.actorLabel}</span>
                    </div>
                    <p className="study-step-text">{help.explainUk}</p>
                    <p className="study-step-qa">
                      <span className="study-component-qa-label">Для QA Agent:</span> {help.qaUk}
                    </p>
                    <p className="study-step-source muted small" lang="en">{step.text}</p>
                  </>
                ) : help && 'inputUk' in help ? (
                  <>
                    <div className="study-step-head">
                      <h4 className="study-step-title">{help.titleUk}</h4>
                      <span className={`study-step-actor actor-${help.actor}`}>{help.actorLabel}</span>
                    </div>
                    <p className="study-step-text">{help.explainUk}</p>
                    <dl className="study-step-io small">
                      <div>
                        <dt>Вхід</dt>
                        <dd>{help.inputUk}</dd>
                      </div>
                      <div>
                        <dt>Вихід</dt>
                        <dd>{help.outputUk}</dd>
                      </div>
                    </dl>
                  </>
                ) : (
                  <>
                    <h4 className="study-step-title">Крок {step.index}</h4>
                    <p className="study-step-text">{step.text}</p>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
