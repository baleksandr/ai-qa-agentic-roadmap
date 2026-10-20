import { GUARDRAILS_FULL_EXAMPLE_BUNDLE } from '../../data/study/guardrails-study-bundles';
import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';

const GUARDRAILS_FULL_EXAMPLE_CLASS =
  'study-guardrails-teaching-cards study-guardrails-full-example study-memory-state-teaching-cards study-multi-agent-teaching-cards study-agentic-workflows-teaching-cards';

/** §2 «Повний простий приклад» — сценарії policy як навчальні картки + панель. */
export function StudyGuardrailsPolicyExample() {
  return (
    <StudyTeachingCardsSection
      bundle={GUARDRAILS_FULL_EXAMPLE_BUNDLE}
      className={GUARDRAILS_FULL_EXAMPLE_CLASS}
    />
  );
}
