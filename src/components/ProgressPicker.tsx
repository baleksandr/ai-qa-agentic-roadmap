import type { LearningStatus } from '../types/topic';
import { LEARNING_LABELS } from '../types/topic';

const ORDER: LearningStatus[] = ['not_studied', 'in_progress', 'studied'];

interface Props {
  value: LearningStatus;
  onChange: (state: LearningStatus) => void;
}

export function ProgressPicker({ value, onChange }: Props) {
  return (
    <fieldset className="progress-picker">
      <legend>Мій прогрес вивчення</legend>
      {ORDER.map((state) => (
        <label key={state} className="progress-option">
          <input
            type="radio"
            name="learning-status"
            checked={value === state}
            onChange={() => onChange(state)}
          />
          {LEARNING_LABELS[state]}
        </label>
      ))}
    </fieldset>
  );
}
