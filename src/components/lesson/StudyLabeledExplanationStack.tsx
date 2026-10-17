import type { StudyLabeledPair } from '../../data/study/study-learner-panel-sections';
import { StudyLabeledExplanation } from './StudyLabeledExplanation';

/** Кілька явних пар «назва — пояснення» (окремі поля даних, без автопарсингу тексту). */
export function StudyLabeledExplanationStack({ items }: { items: StudyLabeledPair[] }) {
  if (!items.length) return null;
  return (
    <div className="study-learner-labeled-stack">
      {items.map((item) => (
        <StudyLabeledExplanation
          key={item.termUk}
          termUk={item.termUk}
          explanationUk={item.explanationUk}
        />
      ))}
    </div>
  );
}
