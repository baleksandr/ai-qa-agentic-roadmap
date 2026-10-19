import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { StructuredStudyView } from '../components/lesson/StructuredStudyView';
import { StudyModeSections } from '../components/StudyModeSections';
import { SiteNav } from '../components/SiteNav';
import { ProgressPicker } from '../components/ProgressPicker';
import { getMapLabel } from '../data/learning-map.registry';
import { TOPIC_BY_ID } from '../data/topics.registry';
import { getStudyNextTopic } from '../lib/studyTopicNavigation';
import { loadMarkdownByPath, parseLessonMarkdown } from '../lib/content';
import { loadStructuredStudy } from '../lib/structuredStudy';
import { buildStudyLearningOutcomes } from '../data/study/study-lesson-intros';
import { parseStudyDocument } from '../lib/studySections';
import { useProgress } from '../hooks/useProgress';
import { LEARNING_LABELS } from '../types/topic';
import { StudyLessonAcronymHero } from '../components/lesson/StudyLessonAcronymHero';
import { hasStudyProgressSidebar } from '../data/study/study-lesson-aside.registry';
import { getStudyLessonHero } from '../data/study/study-lesson-heroes';
import { StudyMarkdownWithFlows } from '../components/lesson/StudyMarkdownWithFlows';
import {
  getLessonOutcomesFlowAriaLabel,
  getStudyOutcomesLessonHint,
} from '../data/study/study-lesson-intros';
import { StudyOutcomesLessonHint } from '../components/lesson/StudyOutcomesLessonHint';
import { StudyFundamentalsLearningOutcomes } from '../components/lesson/StudyFundamentalsLearningOutcomes';
import { StudyMcpLearningOutcomes } from '../components/lesson/StudyMcpLearningOutcomes';
import { StudyVectorDatabaseLearningOutcomes } from '../components/lesson/StudyVectorDatabaseLearningOutcomes';
import { StudyFineTuningLearningOutcomes } from '../components/lesson/StudyFineTuningLearningOutcomes';
import { studyNeonHudHeroZoneClassName } from '../lib/studyNeonHudTheme';
import { isStudyReadyForLearning } from '../data/study/study-ready-for-learning';
export function TopicStudyPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const topic = topicId ? TOPIC_BY_ID[topicId] : undefined;
  const { getProgress, setProgress } = useProgress();

  const structured = topic ? loadStructuredStudy(topic.id) : null;

  const legacyStudy = useMemo(() => {
    if (!topic || structured) return { sections: [], introMarkdown: '', sourcesMarkdown: '' };
    const raw = loadMarkdownByPath(topic.contentPath);
    if (!raw) return { sections: [], introMarkdown: '', sourcesMarkdown: '' };
    const lesson = parseLessonMarkdown(raw);
    const study = lesson.studyMarkdown
      .replace(/^###\s+(QA-приклад|Failure modes|Запитання|Коротка відповідь)[\s\S]*$/im, '')
      .trim();
    const parsed = parseStudyDocument(study);
    return {
      ...parsed,
      introMarkdown: buildStudyLearningOutcomes(topic.id, parsed.introMarkdown),
    };
  }, [topic, structured]);

  const next = topic ? getStudyNextTopic(topic.id) : null;

  if (!topic) {
    return (
      <div className="page">
        <p>Тему не знайдено.</p>
        <Link to="/">На головну</Link>
      </div>
    );
  }

  const learning = getProgress(topic.id);
  const lessonHero = getStudyLessonHero(topic.id);
  const fundamentalsOutcomes = structured && topic.id === 'fundamentals';
  const vectorDatabaseOutcomes = structured && topic.id === 'concept-15';
  const mcpOutcomes = structured && topic.id === 'concept-06';
  const fineTuningOutcomes = structured && topic.id === 'concept-13';
  const structuredOutcomes =
    structured &&
    topic.id !== 'fundamentals' &&
    topic.id !== 'concept-06' &&
    topic.id !== 'concept-15' &&
    topic.id !== 'concept-13'
      ? buildStudyLearningOutcomes(topic.id, '')
      : '';
  const outcomesLessonHint = structured ? getStudyOutcomesLessonHint(topic.id) : null;
  const neonHudTheme = isStudyReadyForLearning(topic.id);
  const heroHudZone = studyNeonHudHeroZoneClassName(topic.id);

  return (
    <div className={`page topic-study-page topic-study-page-wide topic-study-page--${topic.id}`.trim()}>
      <Link className="back-link" to="/">← До карти курсу</Link>
      <SiteNav />

      <header
        className={`topic-header study-header study-header-compact${heroHudZone ? ` ${heroHudZone}` : ''}`.trim()}
      >
        <p className="muted small">
          <Link to={`/topic/${topic.id}`}>← Review Mode</Link>
        </p>
        <h1 className={lessonHero ? 'study-rag-page-h1' : undefined}>
          {lessonHero ? (
            <>
              <span className="sr-only">{lessonHero.pageTitleUk}</span>
              <StudyLessonAcronymHero hero={lessonHero} neonHudTheme={neonHudTheme} />
            </>
          ) : (
            getMapLabel(topic.id)
          )}
        </h1>
        <p className="lead study-lead">Study Mode</p>
        <div className="topic-badges">
          <span className={`badge progress-${learning}`}>{LEARNING_LABELS[learning]}</span>
        </div>
      </header>

      {topic.migrationStatus === 'not_migrated' ? (
        <p className="muted">Матеріал ще не перенесено з DOCX.</p>
      ) : structured ? (
        <>
          {fundamentalsOutcomes ? (
            <aside
              className={`study-learning-outcomes study-fundamentals-outcomes-hud${heroHudZone ? ` ${heroHudZone}` : ''}`.trim()}
              aria-label="Що я зрозумію після цього уроку"
            >
              <h2 className="study-outcomes-title">Що я зрозумію після цього уроку</h2>
              <StudyFundamentalsLearningOutcomes />
            </aside>
          ) : mcpOutcomes ? (
            <aside
              className={`study-learning-outcomes study-outcomes-with-flows${heroHudZone ? ` ${heroHudZone}` : ''}`.trim()}
              aria-label="Що я зрозумію після цього уроку"
            >
              <h2 className="study-outcomes-title">Що я зрозумію після цього уроку</h2>
              <div className="markdown-body study-outcomes-body study-outcomes-with-flows">
                <StudyMcpLearningOutcomes />
              </div>
            </aside>
          ) : vectorDatabaseOutcomes ? (
            <aside
              className={`study-learning-outcomes study-outcomes-with-flows${heroHudZone ? ` ${heroHudZone}` : ''}`.trim()}
              aria-label="Що я зрозумію після цього уроку"
            >
              <h2 className="study-outcomes-title">Що я зрозумію після цього уроку</h2>
              <div className="markdown-body study-outcomes-body study-outcomes-with-flows">
                <StudyVectorDatabaseLearningOutcomes />
              </div>
            </aside>
          ) : fineTuningOutcomes ? (
            <aside
              className={`study-learning-outcomes study-outcomes-with-flows${heroHudZone ? ` ${heroHudZone}` : ''}`.trim()}
              aria-label="Що я зрозумію після цього уроку"
            >
              <h2 className="study-outcomes-title">Що я зрозумію після цього уроку</h2>
              <div className="markdown-body study-outcomes-body study-outcomes-with-flows">
                <StudyFineTuningLearningOutcomes />
              </div>
            </aside>
          ) : structuredOutcomes ? (
            <aside
              className={`study-learning-outcomes study-outcomes-with-flows${heroHudZone ? ` ${heroHudZone}` : ''}`.trim()}
              aria-label="Що я зрозумію після цього уроку"
            >
              <h2 className="study-outcomes-title">Що я зрозумію після цього уроку</h2>
              <StudyMarkdownWithFlows
                markdown={structuredOutcomes}
                flowAriaLabel={getLessonOutcomesFlowAriaLabel(topic.id)}
              />
              {outcomesLessonHint ? (
                <StudyOutcomesLessonHint
                  labelUk={outcomesLessonHint.labelUk}
                  textUk={outcomesLessonHint.textUk}
                />
              ) : null}
            </aside>
          ) : null}
          <StructuredStudyView
            study={structured}
            learning={learning}
            onLearningChange={(s) => setProgress(topic.id, s)}
          />
        </>
      ) : (
        <div className="topic-study-legacy-wrap">
          <StudyModeSections
            topicId={topic.id}
            sections={legacyStudy.sections}
            introMarkdown={legacyStudy.introMarkdown}
            sourcesMarkdown={legacyStudy.sourcesMarkdown}
            initialOpenId={legacyStudy.sections[0]?.id}
            learning={learning}
            onLearningChange={(s) => setProgress(topic.id, s)}
          />
        </div>
      )}

      <footer className="study-footer study-footer-global">
        {!structured && !hasStudyProgressSidebar(topic.id) && (
          <ProgressPicker value={learning} onChange={(s) => setProgress(topic.id, s)} />
        )}
        <nav className="topic-nav study-next-nav">
          {next ? (
            <Link className="study-next-link" to={`/topic/${next.id}/study`}>
              Наступна тема: {getMapLabel(next.id)} →
            </Link>
          ) : (
            <Link to="/">Завершити маршрут на карті</Link>
          )}
        </nav>
      </footer>
    </div>
  );
}
