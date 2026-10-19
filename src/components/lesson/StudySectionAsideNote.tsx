import type { ReactNode } from 'react';
import type {
  StudySectionAsideTermRow,
  StudySectionAsideTrackCard,
} from '../../data/study/study-section-aside-types';
import { LessonRichParagraphs, parseLessonBold } from './lessonRichText';

export type StudySectionAsideNoteProps = {
  titleUk?: string;
  bodyUk?: string;
  labeledLines?: StudySectionAsideTermRow[];
  trackCard?: StudySectionAsideTrackCard;
  /** `hud` — права колонка (Neon HUD); `inline` — спокійна нотатка в центральному змісті. */
  variant?: 'hud' | 'inline';
  className?: string;
  children?: ReactNode;
};

function AsideLabeledLine({
  term,
  textUk,
  termClassName,
  lineClassName,
  sepClassName,
  explClassName,
}: StudySectionAsideTermRow & {
  termClassName: string;
  lineClassName: string;
  sepClassName: string;
  explClassName: string;
}) {
  return (
    <p className={lineClassName}>
      <span className={termClassName}>{term}</span>
      <span className={sepClassName}> — </span>
      <span className={explClassName}>{parseLessonBold(textUk)}</span>
    </p>
  );
}

/** Компактна нотатка Study Mode: Neon HUD у правій колонці; inline — без HUD у центрі уроку. */
export function StudySectionAsideNote({
  titleUk = 'Нотатка до розділу',
  bodyUk,
  labeledLines,
  trackCard,
  variant = 'hud',
  className = '',
  children,
}: StudySectionAsideNoteProps) {
  const hasTrack = (trackCard?.rows?.length ?? 0) > 0;
  const hasLines = (labeledLines?.length ?? 0) > 0;
  const hasBody = Boolean(bodyUk?.trim());

  if (variant === 'inline') {
    const lineProps = {
      termClassName: 'study-teaching-inline-aside-note__term',
      lineClassName: 'study-teaching-inline-aside-note__line',
      sepClassName: 'study-teaching-inline-aside-note__sep',
      explClassName: 'study-teaching-inline-aside-note__expl',
    };

    return (
      <aside
        className={`study-teaching-inline-aside-note${className ? ` ${className}` : ''}`}
        role="note"
        aria-label={titleUk}
      >
        <p className="study-teaching-inline-aside-note__title">{titleUk}</p>
        <div className="study-teaching-inline-aside-note__body">
          {hasTrack ? (
            <div className="study-teaching-inline-aside-note__track">
              {trackCard!.titleUk?.trim() ? (
                <p className="study-teaching-inline-aside-note__inner-title">{trackCard!.titleUk}</p>
              ) : null}
              <ul className="study-teaching-inline-aside-note__track-list">
                {trackCard!.rows.map((row) => (
                  <li key={row.labelUk} className="study-teaching-inline-aside-note__track-item">
                    <AsideLabeledLine term={row.labelUk} textUk={row.bodyUk} {...lineProps} />
                  </li>
                ))}
              </ul>
              {trackCard!.footnoteUk?.trim() ? (
                <p className="study-teaching-inline-aside-note__footnote study-learner-explanation">
                  {parseLessonBold(trackCard!.footnoteUk)}
                </p>
              ) : null}
            </div>
          ) : null}
          {hasLines ? (
            <div className="study-teaching-inline-aside-note__lines">
              {labeledLines!.map((line) => (
                <AsideLabeledLine key={line.term} {...line} {...lineProps} />
              ))}
            </div>
          ) : null}
          {hasBody ? (
            <LessonRichParagraphs
              text={bodyUk!}
              className="study-teaching-inline-aside-note__prose study-learner-explanation"
            />
          ) : null}
          {children}
        </div>
      </aside>
    );
  }

  const hudLineProps = {
    termClassName: 'study-cyber-aside-note__term',
    lineClassName: 'study-cyber-aside-note__line',
    sepClassName: 'study-cyber-aside-note__sep',
    explClassName: 'study-cyber-aside-note__expl',
  };

  return (
    <aside
      className={`study-cyber-aside-note study-cyber-hud-surface study-cyber-hud-surface--static${className ? ` ${className}` : ''}`}
      role="note"
      aria-label={titleUk}
    >
      <p className="study-cyber-aside-note__title">{titleUk}</p>
      <div className="study-cyber-aside-note__body">
        {hasTrack ? (
          <div className="study-cyber-aside-note__track">
            {trackCard!.titleUk?.trim() ? (
              <p className="study-cyber-aside-note__inner-title">{trackCard!.titleUk}</p>
            ) : null}
            <ul className="study-cyber-aside-note__track-list">
              {trackCard!.rows.map((row) => (
                <li key={row.labelUk} className="study-cyber-aside-note__track-item">
                  <AsideLabeledLine term={row.labelUk} textUk={row.bodyUk} {...hudLineProps} />
                </li>
              ))}
            </ul>
            {trackCard!.footnoteUk?.trim() ? (
              <p className="study-cyber-aside-note__footnote study-learner-explanation">
                {parseLessonBold(trackCard!.footnoteUk)}
              </p>
            ) : null}
          </div>
        ) : null}
        {hasLines ? (
          <div className="study-cyber-aside-note__lines">
            {labeledLines!.map((line) => (
              <AsideLabeledLine key={line.term} {...line} {...hudLineProps} />
            ))}
          </div>
        ) : null}
        {hasBody ? (
          <LessonRichParagraphs
            text={bodyUk!}
            className="study-cyber-aside-note__prose study-learner-explanation"
          />
        ) : null}
        {children}
      </div>
    </aside>
  );
}
