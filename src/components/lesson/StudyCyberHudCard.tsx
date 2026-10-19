import type { ReactNode } from 'react';

type Props = {
  badge: string;
  title: string;
  subtitle: string;
  className?: string;
  children?: ReactNode;
};

/** Інформаційна HUD-картка (шапка уроку): не клікабельна. */
export function StudyCyberHudCard({ badge, title, subtitle, className = '' }: Props) {
  return (
    <article
      className={`study-cyber-hud-card study-cyber-hud-card--hero study-cyber-hud-surface study-cyber-hud-surface--static${className ? ` ${className}` : ''}`}
      role="listitem"
    >
      <span className="study-cyber-hud-card__badge" aria-hidden="true">{badge}</span>
      <div className="study-cyber-hud-card__copy">
        <span className="study-cyber-hud-card__title">{title}</span>
        <span className="study-cyber-hud-card__sub">{subtitle}</span>
      </div>
    </article>
  );
}

type GridProps = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
};

export function StudyCyberHudHeroGrid({ ariaLabel, children, className = '' }: GridProps) {
  return (
    <div
      className={`study-cyber-hud-hero-grid${className ? ` ${className}` : ''}`}
      role="list"
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}
