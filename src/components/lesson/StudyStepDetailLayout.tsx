import type { ReactNode } from 'react';

type Props = {
  lead?: ReactNode;
  hint?: ReactNode;
  /** Оглядова ribbon-схема над списком кроків */
  beforeNav?: ReactNode;
  nav: ReactNode;
  panel: ReactNode;
  wrapperClassName?: string;
  navAriaLabel?: string;
};

/**
 * Еталон: компактна навігація зліва (220–280px), пояснення справа (решта ширини).
 * Не поєднувати з `.study-rag-qa-layout` — той layout інвертує колонки.
 */
export function StudyStepDetailLayout({
  lead,
  hint,
  beforeNav,
  nav,
  panel,
  wrapperClassName = '',
  navAriaLabel,
}: Props) {
  return (
    <div className={wrapperClassName.trim()}>
      {lead}
      {hint}
      {beforeNav}
      <div className="study-step-detail-layout">
        <nav className="study-step-detail-nav" aria-label={navAriaLabel}>
          {nav}
        </nav>
        <aside className="study-step-detail-panel study-rag-qa-detail-panel" aria-live="polite">
          {panel}
        </aside>
      </div>
    </div>
  );
}
