import type { StudySection } from '../../lib/studySections';
import type { LearningStatus } from '../../types/topic';
import { StudyLessonAside } from './StudyLessonAside';

type Props = {
  sections: StudySection[];
  activeSectionId: string;
  learning: LearningStatus;
  onLearningChange: (s: LearningStatus) => void;
};

/** @deprecated Використовуйте StudyLessonAside з topicId concept-03 */
export function StudyRagLessonAside(props: Props) {
  return <StudyLessonAside topicId="concept-03" {...props} />;
}
