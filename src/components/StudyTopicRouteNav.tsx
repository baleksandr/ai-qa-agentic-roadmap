import { Link } from 'react-router-dom';
import { getMapLabel } from '../data/learning-map.registry';
import { getStudyNextTopic, getStudyPrevTopic } from '../lib/studyTopicNavigation';

type Props = {
  topicId: string;
};

/** Послідовна навігація курсом (джерело: `getLearningMapRoute()`). */
export function StudyTopicRouteNav({ topicId }: Props) {
  const prev = getStudyPrevTopic(topicId);
  const next = getStudyNextTopic(topicId);

  if (!prev && !next) return null;

  return (
    <nav className="study-topic-route-nav" aria-label="Навігація курсом">
      {prev ? (
        <Link className="study-topic-route-nav__card study-topic-route-nav__card--prev" to={`/topic/${prev.id}/study`}>
          <span className="study-topic-route-nav__dir">
            <span className="study-topic-route-nav__arrow" aria-hidden="true">←</span>
            <span className="study-topic-route-nav__dir-text">Попередня тема</span>
          </span>
          <span className="study-topic-route-nav__title">{getMapLabel(prev.id)}</span>
        </Link>
      ) : (
        <div className="study-topic-route-nav__card study-topic-route-nav__card--placeholder" aria-hidden="true" />
      )}
      {next ? (
        <Link className="study-topic-route-nav__card study-topic-route-nav__card--next" to={`/topic/${next.id}/study`}>
          <span className="study-topic-route-nav__dir">
            <span className="study-topic-route-nav__dir-text">Наступна тема</span>
            <span className="study-topic-route-nav__arrow" aria-hidden="true">→</span>
          </span>
          <span className="study-topic-route-nav__title">{getMapLabel(next.id)}</span>
        </Link>
      ) : (
        <div className="study-topic-route-nav__card study-topic-route-nav__card--placeholder" aria-hidden="true" />
      )}
    </nav>
  );
}
