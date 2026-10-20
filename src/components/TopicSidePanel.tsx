import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getMapLabel } from '../data/learning-map.registry';
import { isStudyReadyForLearning } from '../data/study/study-ready-for-learning';
import type { TopicMeta } from '../types/topic';
import { loadMarkdownByPath, parseLessonMarkdown } from '../lib/content';
import { ReviewMarkdownBody } from './ReviewMarkdownBody';
import { getEnrichedReviewMarkdown } from '../data/review/review-mode-by-topic';
import { getRouteTopicSidePanel } from '../data/review/route-topic-side-panels';
import { RouteTopicSidePanelBody } from './RouteTopicSidePanelBody';
import { ProgressPicker } from './ProgressPicker';
import { useProgress } from '../hooks/useProgress';

interface Props {
  topic: TopicMeta;
  onClose: () => void;
}

export function TopicSidePanel({ topic, onClose }: Props) {
  const { getProgress, setProgress } = useProgress();
  const learning = getProgress(topic.id);
  const routePanel = getRouteTopicSidePanel(topic.id);

  const reviewMarkdown = useMemo(() => {
    const raw = loadMarkdownByPath(topic.contentPath);
    if (!raw) return '';
    const fromFile = parseLessonMarkdown(raw).reviewMarkdown;
    return getEnrichedReviewMarkdown(topic.id, fromFile);
  }, [topic.contentPath, topic.id]);

  const titleUk = getMapLabel(topic.id);
  const badges = isStudyReadyForLearning(topic.id) ? (
    <div className="topic-badges topic-badges--route-panel">
      <span className="badge migration-migrated" title="Study Mode готовий для навчання">
        Готово для навчання
      </span>
    </div>
  ) : null;

  const studyLink = (
    <Link className="study-open-btn study-open-btn-compact" to={`/topic/${topic.id}/study`}>
      Study Mode — повна сторінка
    </Link>
  );

  const bodyContent =
    topic.migrationStatus === 'not_migrated' ? (
      <p className="muted">Матеріал ще не перенесено з DOCX.</p>
    ) : routePanel ? (
      <RouteTopicSidePanelBody panel={routePanel} />
    ) : (
      <ReviewMarkdownBody markdown={reviewMarkdown} />
    );

  return (
    <aside
      className={`topic-side-panel${routePanel ? ' topic-side-panel--route' : ''}`}
      role="dialog"
      aria-label={topic.title}
    >
      {routePanel ? (
        <div className="route-topic-panel-shell">
          <div className="route-topic-panel-hero">
            <header className="topic-side-header route-topic-panel-header">
              <button type="button" className="topic-side-close" onClick={onClose} aria-label="Закрити">
                ×
              </button>
              <div className="route-topic-panel-title-row">
                <h2 className="route-topic-panel-title">{titleUk}</h2>
                {badges}
              </div>
            </header>
            {studyLink}
          </div>
          <div className="topic-side-body route-topic-panel-body">{bodyContent}</div>
          <div className="route-topic-panel-footer">
            <ProgressPicker value={learning} onChange={(s) => setProgress(topic.id, s)} />
          </div>
        </div>
      ) : (
        <>
          <header className="topic-side-header">
            <button type="button" className="topic-side-close" onClick={onClose} aria-label="Закрити">
              ×
            </button>
            <h2>{titleUk}</h2>
            <p className="muted small">Review Mode</p>
            {badges}
          </header>
          {studyLink}
          <div className="topic-side-body markdown-body">{bodyContent}</div>
          <ProgressPicker value={learning} onChange={(s) => setProgress(topic.id, s)} />
        </>
      )}
    </aside>
  );
}
