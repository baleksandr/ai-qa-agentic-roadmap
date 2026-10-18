import { ProgressPicker } from '../ProgressPicker';
import type { LearningStatus } from '../../types/topic';

type Props = {
  learning: LearningStatus;
  onLearningChange: (s: LearningStatus) => void;
  className?: string;
};

/** Компактна картка «Мій прогрес вивчення» (права колонка або мобільний слот). */
export function StudyProgressAsideCard({ learning, onLearningChange, className = '' }: Props) {
  return (
    <div className={`study-aside-card study-aside-card-compact study-aside-card--progress${className ? ` ${className}` : ''}`}>
      <ProgressPicker value={learning} onChange={onLearningChange} />
    </div>
  );
}
