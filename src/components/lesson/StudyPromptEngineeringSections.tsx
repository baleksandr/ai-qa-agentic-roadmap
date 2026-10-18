import { StudyProcessCompareSection } from './StudyProcessCompareSection';
import { StudyRememberTakeaways } from './StudyRememberTakeaways';
import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';
import { PROMPT_PE_REMEMBER_BULLETS } from '../../data/study/prompt-engineering-interview-self-check';
import {
  PROMPT_PE_INTRO_OVERVIEW_BUNDLE,
  PROMPT_PE_INVESTIGATION_FLOW,
  PROMPT_PE_PARTS_BUNDLE,
  PROMPT_PE_SEQUENCE_BUNDLE,
  PROMPT_PE_LLM_CODE_BUNDLE,
  PROMPT_PE_FAILURE_BUNDLE,
  PROMPT_PE_PRODUCTION_BUNDLE,
  PROMPT_PE_QA_TESTING_BUNDLE,
  PROMPT_PE_WHY_COMPARE,
} from '../../data/study/prompt-engineering-study-bundles';

export function StudyPromptEngineeringIntroOverview() {
  return <StudyTeachingCardsSection bundle={PROMPT_PE_INTRO_OVERVIEW_BUNDLE} />;
}

export function StudyPromptEngineeringWhy() {
  const { footerUk, ...compare } = PROMPT_PE_WHY_COMPARE;
  return (
    <>
      <StudyProcessCompareSection bundle={compare} />
      {footerUk ? (
        <div className="lesson-callout lesson-key-idea study-prompt-pe-why-summary">
          <span className="lesson-callout-label">Запам’ятати</span>
          <p className="study-learner-explanation">{footerUk.replace(/\*\*/g, '')}</p>
        </div>
      ) : null}
    </>
  );
}

const PE_TEACHING_CARDS_CLASS = 'study-prompt-pe-teaching-cards';

export function StudyPromptEngineeringInvestigation() {
  return (
    <StudyTeachingCardsSection
      bundle={PROMPT_PE_INVESTIGATION_FLOW}
      className={PE_TEACHING_CARDS_CLASS}
    />
  );
}

export function StudyPromptEngineeringParts() {
  return <StudyTeachingCardsSection bundle={PROMPT_PE_PARTS_BUNDLE} />;
}

export function StudyPromptEngineeringSequence() {
  return (
    <StudyTeachingCardsSection
      bundle={PROMPT_PE_SEQUENCE_BUNDLE}
      className={PE_TEACHING_CARDS_CLASS}
    />
  );
}

export function StudyPromptEngineeringLlmCode() {
  return (
    <StudyTeachingCardsSection
      bundle={PROMPT_PE_LLM_CODE_BUNDLE}
      className={PE_TEACHING_CARDS_CLASS}
    />
  );
}

export function StudyPromptEngineeringFailures() {
  return <StudyTeachingCardsSection bundle={PROMPT_PE_FAILURE_BUNDLE} />;
}

export function StudyPromptEngineeringQaTesting() {
  return <StudyTeachingCardsSection bundle={PROMPT_PE_QA_TESTING_BUNDLE} />;
}

export function StudyPromptEngineeringProduction() {
  return <StudyTeachingCardsSection bundle={PROMPT_PE_PRODUCTION_BUNDLE} />;
}

export function StudyPromptEngineeringRememberInterview() {
  return (
    <aside className="lesson-callout lesson-key-idea study-remember-rich">
      <span className="lesson-callout-label">Запам’ятати</span>
      <StudyRememberTakeaways bullets={PROMPT_PE_REMEMBER_BULLETS} />
    </aside>
  );
}
