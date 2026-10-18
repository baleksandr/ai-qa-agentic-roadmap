import { useId } from 'react';
import type { LearningStatus } from '../types/topic';
import { LEARNING_LABELS } from '../types/topic';

const ORDER: LearningStatus[] = ['not_studied', 'in_progress', 'studied'];

interface Props {
  value: LearningStatus;
  onChange: (state: LearningStatus) => void;
  /** Заголовок над кнопками; за замовчуванням «Мій прогрес вивчення». */
  legendUk?: string;
}

export function ProgressPicker({ value, onChange, legendUk = 'Мій прогрес вивчення' }: Props) {
  const groupId = useId();

  return (
    <fieldset className="progress-picker">
      <legend className="progress-picker__legend">{legendUk}</legend>
      <div className="progress-picker__options" role="presentation">
        {ORDER.map((state) => {
          const active = value === state;
          return (
            <label
              key={state}
              className={`progress-picker__option progress-picker__option--${state}${active ? ' is-active' : ''}`}
            >
              <input
                type="radio"
                name={`learning-status-${groupId}`}
                checked={active}
                onChange={() => onChange(state)}
              />
              <span className="progress-picker__check" aria-hidden="true">{active ? '✓' : ''}</span>
              <span className="progress-picker__label">{LEARNING_LABELS[state]}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
