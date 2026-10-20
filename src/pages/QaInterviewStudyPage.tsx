import { Link } from 'react-router-dom';
import { StudyTopicRouteNav } from '../components/StudyTopicRouteNav';
import { QaInterviewBankView } from '../components/qa-interview/QaInterviewBankView';
import { SiteNav } from '../components/SiteNav';
import { ProgressPicker } from '../components/ProgressPicker';
import { QA_INTERVIEW_BANK } from '../data/qa-interview/qa-interview-bank';
import { useProgress } from '../hooks/useProgress';
import { LEARNING_LABELS } from '../types/topic';

/** Study-сторінка банку питань QA-співбесіди (окремий вузол маршруту, не Fundamentals). */
export function QaInterviewStudyPage() {
  const topicId = QA_INTERVIEW_BANK.bankId;
  const { getProgress, setProgress } = useProgress();
  const learning = getProgress(topicId);

  return (
    <div className="page topic-study-page topic-study-page-wide qa-interview-study-page">
      <Link className="back-link" to="/">← До карти курсу</Link>
      <SiteNav />

      <header className="topic-header study-header study-header-compact">
        <p className="muted small">
          <Link to={`/topic/${topicId}`}>← Огляд теми</Link>
        </p>
        <h1>{QA_INTERVIEW_BANK.pageTitleUk}</h1>
        <p className="lead study-lead muted small">
          Допоміжний розділ маршруту — не входить у лічильник обов’язкових тем Fundamentals.
        </p>
        <div className="topic-badges">
          <span className={`badge progress-${learning}`}>{LEARNING_LABELS[learning]}</span>
        </div>
      </header>

      <QaInterviewBankView bank={QA_INTERVIEW_BANK} />

      <footer className="study-footer study-footer-global">
        <ProgressPicker value={learning} onChange={(s) => setProgress(topicId, s)} />
        <StudyTopicRouteNav topicId={topicId} />
      </footer>
    </div>
  );
}
