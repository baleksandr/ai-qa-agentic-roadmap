import { LessonRichParagraphs } from './lessonRichText';
import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';
import { REASONING_REMEMBER_CONCEPT_MINI_CARDS } from '../../data/study/reasoning-interview-self-check';
import {
  REASONING_FAILURE_BUNDLE,
  REASONING_INVESTIGATION_BUNDLE,
  REASONING_LLM_CODE_BUNDLE,
  REASONING_MECHANISM_BUNDLE,
  REASONING_PRODUCTION_BUNDLE,
  REASONING_QA_BUNDLE,
  REASONING_SEQUENCE_BUNDLE,
  REASONING_WHY_BUNDLE,
} from '../../data/study/reasoning-study-bundles';

const REASONING_TEACHING_CLASS = 'study-reasoning-teaching-cards';

export function StudyReasoningWhy() {
  return <StudyTeachingCardsSection bundle={REASONING_WHY_BUNDLE} className={REASONING_TEACHING_CLASS} />;
}

export function StudyReasoningInvestigation() {
  return (
    <StudyTeachingCardsSection bundle={REASONING_INVESTIGATION_BUNDLE} className={REASONING_TEACHING_CLASS} />
  );
}

export function StudyReasoningMechanism() {
  return (
    <StudyTeachingCardsSection bundle={REASONING_MECHANISM_BUNDLE} className={REASONING_TEACHING_CLASS} />
  );
}

export function StudyReasoningSequence() {
  return (
    <StudyTeachingCardsSection
      bundle={REASONING_SEQUENCE_BUNDLE}
      className={`${REASONING_TEACHING_CLASS} study-reasoning-sequence-trio`}
    />
  );
}

export function StudyReasoningLlmCode() {
  return (
    <StudyTeachingCardsSection
      bundle={REASONING_LLM_CODE_BUNDLE}
      className={`${REASONING_TEACHING_CLASS} study-reasoning-llm-code`}
    />
  );
}

export function StudyReasoningFailures() {
  return (
    <StudyTeachingCardsSection
      bundle={REASONING_FAILURE_BUNDLE}
      className={`${REASONING_TEACHING_CLASS} study-reasoning-failure-risks`}
    />
  );
}

export function StudyReasoningQaTesting() {
  return (
    <StudyTeachingCardsSection
      bundle={REASONING_QA_BUNDLE}
      className={`${REASONING_TEACHING_CLASS} study-reasoning-qa-checks`}
    />
  );
}

export function StudyReasoningProduction() {
  return (
    <StudyTeachingCardsSection
      bundle={REASONING_PRODUCTION_BUNDLE}
      className={`${REASONING_TEACHING_CLASS} study-reasoning-production`}
    />
  );
}

export function StudyReasoningRememberInterview() {
  return (
    <div className="study-reasoning-remember-trio-wrap" aria-label="Запам’ятати">
      <ul className="study-teaching-intro-mini-cards study-reasoning-remember-trio">
        {REASONING_REMEMBER_CONCEPT_MINI_CARDS.map((card) => (
          <li key={card.titleUk} className="study-teaching-intro-mini-card">
            <p className="study-teaching-intro-mini-card-title">{card.titleUk}</p>
            <LessonRichParagraphs
              text={card.bodyUk}
              className="study-teaching-intro-mini-card-body study-learner-explanation"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
