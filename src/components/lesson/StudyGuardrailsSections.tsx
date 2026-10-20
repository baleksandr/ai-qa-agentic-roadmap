import { GUARDRAILS_COMPONENTS_BUNDLE, GUARDRAILS_WHY_BUNDLE } from '../../data/study/guardrails-study-bundles';
import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';

const GUARDRAILS_TEACHING_CLASS =
  'study-guardrails-teaching-cards study-memory-state-teaching-cards study-multi-agent-teaching-cards study-agentic-workflows-teaching-cards';

/** §1 «Навіщо guardrails?» */
export function StudyGuardrailsWhy() {
  return (
    <StudyTeachingCardsSection bundle={GUARDRAILS_WHY_BUNDLE} className={GUARDRAILS_TEACHING_CLASS} />
  );
}

/** §3 «Компоненти» */
export function StudyGuardrailsComponents() {
  return (
    <StudyTeachingCardsSection bundle={GUARDRAILS_COMPONENTS_BUNDLE} className={GUARDRAILS_TEACHING_CLASS} />
  );
}
