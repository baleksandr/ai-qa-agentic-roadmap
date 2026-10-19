import { StudyProgressAsideCard } from './StudyProgressAsideCard';
import type { LearningStatus } from '../../types/topic';

type Props = {
  learning: LearningStatus;
  onLearningChange: (s: LearningStatus) => void;
};

/** Права колонка лише з «Мій прогрес вивчення» (без контексту розділу). */
export function StudyProgressSidebarAside({ learning, onLearningChange }: Props) {
  return (
    <aside className="study-col-aside study-col-aside--progress-only" aria-label="Прогрес вивчення">
      <div className="study-lesson-aside-pinned study-progress-aside-desktop">
        <StudyProgressAsideCard learning={learning} onLearningChange={onLearningChange} />
      </div>
    </aside>
  );
}
