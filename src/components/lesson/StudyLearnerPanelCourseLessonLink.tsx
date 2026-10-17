import { Link } from 'react-router-dom';
import { topicStudyHref } from '../../lib/topicStudyHref';

type Props = {
  topicId: string;
  linkLabelUk: string;
};

/** Помітне посилання на повний Study-урок теми з маршруту курсу. */
export function StudyLearnerPanelCourseLessonLink({ topicId, linkLabelUk }: Props) {
  return (
    <p className="study-learner-panel-course-lesson-link-wrap">
      <Link className="study-learner-panel-course-lesson-link" to={topicStudyHref(topicId)}>
        {linkLabelUk}
      </Link>
    </p>
  );
}
