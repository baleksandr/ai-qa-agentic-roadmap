import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

/** Коротка підказка до split-panel: оберіть зліва — деталі праворуч. */
export function StudyInteractionHint({ children, className }: Props) {
  return (
    <aside
      className={`study-interaction-hint${className ? ` ${className}` : ''}`}
      role="note"
      aria-label="Підказка"
    >
      <span className="study-interaction-hint-label">Підказка</span>
      <p className="study-interaction-hint-text">{children}</p>
    </aside>
  );
}
