import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMapLabel } from '../data/learning-map.registry';
import { TOPIC_BY_ID, getLearningRoute } from '../data/topics.registry';
import { loadMarkdownByPath, parseLessonMarkdown } from '../lib/content';
import { MarkdownBody } from '../components/MarkdownBody';
import { SiteNav } from '../components/SiteNav';
import { ProgressPicker } from '../components/ProgressPicker';
import { useProgress } from '../hooks/useProgress';
import { LEARNING_LABELS, MIGRATION_LABELS } from '../types/topic';

export function TopicPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const topic = topicId ? TOPIC_BY_ID[topicId] : undefined;
  const { getProgress, setProgress } = useProgress();

  const lesson = useMemo(() => {
    if (!topic) return null;
    const raw = loadMarkdownByPath(topic.contentPath);
    if (!raw) return null;
    return parseLessonMarkdown(raw);
  }, [topic]);

  const route = getLearningRoute();
  const index = topic ? route.findIndex((t) => t.id === topic.id) : -1;
  const prev = index > 0 ? route[index - 1] : null;
  const next = index >= 0 && index < route.length - 1 ? route[index + 1] : null;

  if (!topic) {
    return (
      <div className="page">
        <p>Тему не знайдено.</p>
        <Link to="/">На головну</Link>
      </div>
    );
  }

  const learning = getProgress(topic.id);
  const reviewMarkdown = lesson?.reviewMarkdown ?? '';

  return (
    <div className="page topic-page topic-review-page">
      <Link className="back-link" to="/">← До карти курсу</Link>
      <SiteNav />

      <header className="topic-header">
        <h1>{getMapLabel(topic.id)}</h1>
        <p className="muted">Review Mode — короткий огляд перед повним вивченням</p>
        <div className="topic-badges">
          <span className={`badge migration-${topic.migrationStatus}`}>
            Перенесення: {MIGRATION_LABELS[topic.migrationStatus]}
          </span>
          <span className={`badge progress-${learning}`}>{LEARNING_LABELS[learning]}</span>
        </div>
        {(topic.migrationStatus === 'partial' || topic.migrationStatus === 'not_migrated') &&
          topic.migrationNotes && <p className="muted small">{topic.migrationNotes}</p>}
      </header>

      <div className="review-cta">
        <Link className="study-open-btn" to={`/topic/${topic.id}/study`}>
          Відкрити Study Mode — повний розділ з підтемами
        </Link>
      </div>

      <article className="markdown-body review-body">
        {topic.migrationStatus === 'not_migrated' ? (
          <p className="muted">Огляд з’явиться після перенесення з DOCX.</p>
        ) : (
          <MarkdownBody markdown={reviewMarkdown} />
        )}
      </article>

      <footer className="study-footer">
        <ProgressPicker value={learning} onChange={(s) => setProgress(topic.id, s)} />
      </footer>

      {topic.relatedTopicIds.length > 0 && (
        <section className="related">
          <h2>Пов’язані теми</h2>
          <ul>
            {topic.relatedTopicIds.map((id) => {
              const rel = TOPIC_BY_ID[id];
              if (!rel) return null;
              return (
                <li key={id}>
                  <Link to={`/topic/${id}`}>{rel.title}</Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <nav className="topic-nav">
        {prev ? (
          <Link to={`/topic/${prev.id}`}>← {prev.shortTitle}</Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/topic/${next.id}`}>{next.shortTitle} →</Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
