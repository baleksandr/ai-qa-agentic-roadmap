import {
  SKILLS_COMPONENTS_BUNDLE,
  SKILLS_COMPONENTS_INTRO_UK,
  SKILLS_FAILURES_BUNDLE,
  SKILLS_FAILURES_INTRO_UK,
  SKILLS_FLOW_BUNDLE,
  SKILLS_FLOW_INTRO_UK,
  SKILLS_LLM_CODE_BUNDLE,
  SKILLS_LLM_CODE_INTRO_UK,
  SKILLS_PRODUCTION_BUNDLE,
  SKILLS_PRODUCTION_INTRO_UK,
  SKILLS_WHY_BUNDLE,
  SKILLS_WHY_INTRO_UK,
} from '../../data/study/skills-study-bundles';
import { SKILLS_REMEMBER_TEXT } from '../../data/study/skills-remember';
import { StudyRememberTakeaways } from './StudyRememberTakeaways';
import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';

const SKILLS_TEACHING_CLASS =
  'study-skills-teaching-cards study-memory-state-teaching-cards study-memory-state-panel-qa-pick';

export function StudySkillsWhy() {
  return (
    <StudyTeachingCardsSection
      bundle={SKILLS_WHY_BUNDLE}
      className={SKILLS_TEACHING_CLASS}
      compactSectionIntroUk={SKILLS_WHY_INTRO_UK}
    />
  );
}

export function StudySkillsComponents() {
  return (
    <StudyTeachingCardsSection
      bundle={SKILLS_COMPONENTS_BUNDLE}
      className={SKILLS_TEACHING_CLASS}
      compactSectionIntroUk={SKILLS_COMPONENTS_INTRO_UK}
    />
  );
}

export function StudySkillsFlow() {
  return (
    <StudyTeachingCardsSection
      bundle={SKILLS_FLOW_BUNDLE}
      className={`${SKILLS_TEACHING_CLASS} study-skills-flow-cards`}
      compactSectionIntroUk={SKILLS_FLOW_INTRO_UK}
    />
  );
}

export function StudySkillsLlmCode() {
  return (
    <StudyTeachingCardsSection
      bundle={SKILLS_LLM_CODE_BUNDLE}
      className={SKILLS_TEACHING_CLASS}
      compactSectionIntroUk={SKILLS_LLM_CODE_INTRO_UK}
    />
  );
}

export function StudySkillsFailures() {
  return (
    <StudyTeachingCardsSection
      bundle={SKILLS_FAILURES_BUNDLE}
      className={`${SKILLS_TEACHING_CLASS} study-skills-failures-cards`}
      compactSectionIntroUk={SKILLS_FAILURES_INTRO_UK}
    />
  );
}

export function StudySkillsProduction() {
  return (
    <StudyTeachingCardsSection
      bundle={SKILLS_PRODUCTION_BUNDLE}
      className={`${SKILLS_TEACHING_CLASS} study-skills-production-cards`}
      compactSectionIntroUk={SKILLS_PRODUCTION_INTRO_UK}
    />
  );
}

export function StudySkillsRememberInterview() {
  return (
    <aside
      className="lesson-callout lesson-key-idea study-remember-rich study-skills-remember study-memory-state-remember"
    >
      <span className="lesson-callout-label">Запам’ятати</span>
      <StudyRememberTakeaways text={SKILLS_REMEMBER_TEXT} />
    </aside>
  );
}
