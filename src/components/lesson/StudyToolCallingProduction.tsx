import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';
import { TOOL_CALLING_PRODUCTION_BUNDLE } from '../../data/study/tool-calling-study-bundles';

/** §7 «Production і observability» — чотири інтерактивні картки з панелями. */
export function StudyToolCallingProduction() {
  return (
    <section
      className="study-tool-calling-production study-rag-pipeline-glossary study-teaching-cards-layout"
      aria-label="Production і observability для tool calling"
    >
      <StudyTeachingCardsSection bundle={TOOL_CALLING_PRODUCTION_BUNDLE} />
    </section>
  );
}
