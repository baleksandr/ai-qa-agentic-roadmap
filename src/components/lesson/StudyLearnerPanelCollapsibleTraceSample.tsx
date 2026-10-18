import type { StudyLabeledPair } from '../../data/study/study-learner-panel-sections';
import { StudyLabeledExplanationStack } from './StudyLabeledExplanationStack';
import { parseLessonBold } from './lessonRichText';

type Props = {
  summaryUk: string;
  jsonExample: string;
  fieldExplanations: StudyLabeledPair[];
  calloutUk: string;
};

/** Розкривний умовний JSON trace у навчальній панелі (без горизонтального скролу сторінки). */
export function StudyLearnerPanelCollapsibleTraceSample({
  summaryUk,
  jsonExample,
  fieldExplanations,
  calloutUk,
}: Props) {
  return (
    <details className="study-rag-tech-details study-tc-trace-sample-details">
      <summary>{summaryUk}</summary>
      <div className="study-tc-trace-sample-inner">
        <div className="study-prompt-block study-tc-trace-sample-json-card">
          <pre className="study-prompt-block-body is-mono study-tc-trace-sample-json-pre">
            {jsonExample}
          </pre>
        </div>
        <StudyLabeledExplanationStack items={fieldExplanations} />
        <p className="study-tc-trace-sample-callout lesson-callout lesson-key-idea" role="note">
          {parseLessonBold(calloutUk)}
        </p>
      </div>
    </details>
  );
}
