import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getMapLabel } from '../data/learning-map.registry';
import type { TopicMeta } from '../types/topic';
import { LEARNING_LABELS, MIGRATION_LABELS } from '../types/topic';
import { loadMarkdownByPath, parseLessonMarkdown } from '../lib/content';
import { MarkdownBody } from './MarkdownBody';
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
    return parseLessonMarkdown(raw).reviewMarkdown;
  }, [topic.contentPath]);

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
          {(topic.migrationStatus === 'partial' || topic.migrationStatus === 'not_migrated') && (
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
          <MarkdownBody markdown={reviewMarkdown} />
        )}
      </div>

      <ProgressPicker value={learning} onChange={(s) => setProgress(topic.id, s)} />
    </aside>
  );
}
