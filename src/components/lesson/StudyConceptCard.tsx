import type { ReactNode } from 'react';

type Props = {
  /** Номер кроку або короткий код (як 03 на карті курсу) */
  step?: string | number;
  kind?: string;
  title: string;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

/** Картка уроку в стилі карток концепцій на навчальній карті (topic-card) */
export function StudyConceptCard({ step, kind, title, children, footer, className = '' }: Props) {
  return (
    <article className={`study-concept-card ${className}`.trim()}>
      <header className="study-concept-card-head">
        {step != null && <span className="study-concept-card-step">{step}</span>}
        <div className="study-concept-card-titles">
          {kind && <span className="study-concept-card-kind">{kind}</span>}
          <h4 className="study-concept-card-title">{title}</h4>
        </div>
      </header>
      {children && <div className="study-concept-card-body">{children}</div>}
      {footer && <footer className="study-concept-card-footer">{footer}</footer>}
    </article>
  );
}
