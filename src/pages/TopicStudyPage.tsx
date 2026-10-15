import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { StructuredStudyView } from '../components/lesson/StructuredStudyView';
import { StudyModeSections } from '../components/StudyModeSections';
import { SiteNav } from '../components/SiteNav';
import { ProgressPicker } from '../components/ProgressPicker';
import { getMapLabel } from '../data/learning-map.registry';
import { TOPIC_BY_ID, getLearningRoute } from '../data/topics.registry';
import { loadMarkdownByPath, parseLessonMarkdown } from '../lib/content';
import { loadStructuredStudy } from '../lib/structuredStudy';
import { parseStudySections } from '../lib/studySections';
import { useProgress } from '../hooks/useProgress';
import { LEARNING_LABELS, MIGRATION_LABELS } from '../types/topic';

export function TopicStudyPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const topic = topicId ? TOPIC_BY_ID[topicId] : undefined;
  const { getProgress, setProgress } = useProgress();

  const structured = topic ? loadStructuredStudy(topic.id) : null;

  const legacySections = useMemo(() => {
    if (!topic || structured) return [];
    const raw = loadMarkdownByPath(topic.contentPath);
    if (!raw) return [];
    const lesson = parseLessonMarkdown(raw);
    const study = lesson.studyMarkdown
      .replace(/^###\s+(QA-приклад|Failure modes|Запитання|Коротка відповідь)[\s\S]*$/im, '')
      .trim();
    return parseStudySections(study);
  }, [topic, structured]);

  const route = getLearningRoute();
  const index = topic ? route.findIndex((t) => t.id === topic.id) : -1;
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

  return (
    <div className="page topic-study-page topic-study-page-wide">
      <Link className="back-link" to="/">← До карти курсу</Link>
      <SiteNav />

      <header className="topic-header study-header study-header-compact">
        <p className="muted small">
          <Link to={`/topic/${topic.id}`}>← Review Mode</Link>
        </p>
        <h1>{getMapLabel(topic.id)}</h1>
        <p className="lead study-lead">Study Mode</p>
        <div className="topic-badges">
          <span className={`badge migration-${topic.migrationStatus}`}>
            Перенесення: {MIGRATION_LABELS[topic.migrationStatus]}
          </span>
          <span className={`badge progress-${learning}`}>{LEARNING_LABELS[learning]}</span>
        </div>
      </header>

      {topic.migrationStatus === 'not_migrated' ? (
        <p className="muted">Матеріал ще не перенесено з DOCX.</p>
      ) : structured ? (
        <StructuredStudyView
          study={structured}
          learning={learning}
          onLearningChange={(s) => setProgress(topic.id, s)}
        />
      ) : (
        <div className="study-col-main study-col-main-only">
          <StudyModeSections sections={legacySections} initialOpenId={legacySections[0]?.id} />
          <footer className="study-footer study-footer-inline">
            <ProgressPicker value={learning} onChange={(s) => setProgress(topic.id, s)} />
          </footer>
        </div>
      )}

      <footer className="study-footer study-footer-global">
        {!structured && (
          <ProgressPicker value={learning} onChange={(s) => setProgress(topic.id, s)} />
        )}
        <nav className="topic-nav study-next-nav">
          {next ? (
            <Link className="study-next-link" to={`/topic/${next.id}/study`}>
              Наступна тема: {next.title} →
            </Link>
          ) : (
            <Link to="/">Завершити маршрут на карті</Link>
          )}
        </nav>
      </footer>
    </div>
  );
}
