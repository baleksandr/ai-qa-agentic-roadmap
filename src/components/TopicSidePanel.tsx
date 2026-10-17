import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getMapLabel } from '../data/learning-map.registry';
import { isStudyReadyForLearning } from '../data/study/study-ready-for-learning';
import type { TopicMeta } from '../types/topic';
import { LEARNING_LABELS, MIGRATION_LABELS } from '../types/topic';
import { loadMarkdownByPath, parseLessonMarkdown } from '../lib/content';
import { ReviewMarkdownBody } from './ReviewMarkdownBody';
import { getEnrichedReviewMarkdown } from '../data/review/review-mode-by-topic';
import { ProgressPicker } from './ProgressPicker';
import { useProgress } from '../hooks/useProgress';

interface Props {
  topic: TopicMeta;
  onClose: () => void;
}

export function TopicSidePanel({ topic, onClose }: Props) {
  const { getProgress, setProgress } = useProgress();
  const learning = getProgress(topic.id);

  const reviewMarkdown = useMemo(() => {
    const raw = loadMarkdownByPath(topic.contentPath);
    if (!raw) return '';
    const fromFile = parseLessonMarkdown(raw).reviewMarkdown;
    return getEnrichedReviewMarkdown(topic.id, fromFile);
  }, [topic.contentPath, topic.id]);

  return (
    <aside className="topic-side-panel" role="dialog" aria-label={topic.title}>
      <header className="topic-side-header">
        <button type="button" className="topic-side-close" onClick={onClose} aria-label="Закрити">
          ×
        </button>
        <h2>{getMapLabel(topic.id)}</h2>
        <p className="muted small">Review Mode</p>
        <div className="topic-badges">
          <span className={`badge progress-${learning}`}>{LEARNING_LABELS[learning]}</span>
          {isStudyReadyForLearning(topic.id) && (
            <span className="badge migration-migrated" title="Study Mode готовий для навчання">
              Готово для навчання
            </span>
          )}
          {!isStudyReadyForLearning(topic.id) &&
            (topic.migrationStatus === 'partial' || topic.migrationStatus === 'not_migrated') && (
            <span
              className={`badge migration-${topic.migrationStatus}`}
              title="Частина матеріалу ще звіряється з оригіналом курсу"
            >
              {MIGRATION_LABELS[topic.migrationStatus]}
            </span>
          )}
        </div>
      </header>

      <Link className="study-open-btn study-open-btn-compact" to={`/topic/${topic.id}/study`}>
        Study Mode — повна сторінка
      </Link>

      <div className="topic-side-body markdown-body">
        {topic.migrationStatus === 'not_migrated' ? (
          <p className="muted">Матеріал ще не перенесено з DOCX.</p>
        ) : (
          <ReviewMarkdownBody markdown={reviewMarkdown} />
        )}
      </div>

      <ProgressPicker value={learning} onChange={(s) => setProgress(topic.id, s)} />
    </aside>
  );
}
