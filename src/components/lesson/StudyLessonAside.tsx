import { Link } from 'react-router-dom';
import {
  getStudyLessonAsideMeta,
  getStudySectionAside,
} from '../../data/study/study-lesson-aside.registry';
import type { StudySection } from '../../lib/studySections';
import { StudyProgressAsideCard } from './StudyProgressAsideCard';
import type { LearningStatus } from '../../types/topic';
import { parseLessonBold } from './lessonRichText';
import { StudyTermAccent } from './StudyTermAccent';

type Props = {
  topicId: string;
  sections: StudySection[];
  activeSectionId: string;
  learning: LearningStatus;
  onLearningChange: (s: LearningStatus) => void;
};

export function StudyLessonAside({
  topicId,
  sections,
  activeSectionId,
  learning,
  onLearningChange,
}: Props) {
  const meta = getStudyLessonAsideMeta(topicId);
  const active = sections.find((s) => s.id === activeSectionId) ?? sections[0];
  const aside = getStudySectionAside(topicId, active?.navTitle ?? '');

  if (!meta) return null;

  const useSectionNote = Boolean(
    aside.sectionNoteUk?.trim() ||
      (aside.sectionNoteTermUk?.trim() && aside.sectionNoteExplanationUk?.trim()) ||
      (aside.sectionNoteTrackCard?.rows?.length ?? 0) > 0,
  );
  const useContextCards = Boolean(aside.contextCards && aside.contextCards.length > 0);
  const hasSupplement =
    useContextCards ||
    (aside.table && aside.table.rows.length > 0) ||
    aside.jsonCard ||
    (aside.tips && aside.tips.length > 0) ||
    aside.diagram;

  return (
    <aside
      className={`study-col-aside study-lesson-aside${meta.compactAside ? ' study-lesson-aside--compact' : ''}`}
      aria-label="Контекст уроку"
    >
      <div className="study-lesson-aside-pinned study-progress-aside-desktop">
        <StudyProgressAsideCard learning={learning} onLearningChange={onLearningChange} />
      </div>

      <div className="study-lesson-aside-scroll">
        {active && !aside.suppressSectionContext && useSectionNote && (
          <div
            className={`study-aside-card study-aside-section-note${
              aside.sectionNoteStyle === 'compact-strip' ? ' study-aside-section-note--compact-strip' : ''
            }`}
          >
            <p className="study-aside-label">Нотатка до розділу</p>
            {aside.sectionNoteTrackCard?.rows?.length ? (
              <div className="study-aside-track-card">
                <p className="study-aside-track-card-title">{aside.sectionNoteTrackCard.titleUk}</p>
                <ul className="study-aside-track-card-rows">
                  {aside.sectionNoteTrackCard.rows.map((row) => (
                    <li key={row.labelUk} className="study-aside-track-card-row">
                      <p className="study-aside-track-card-row-label">{row.labelUk}</p>
                      <p className="study-aside-track-card-row-body study-learner-explanation">
                        {parseLessonBold(row.bodyUk)}
                      </p>
                    </li>
                  ))}
                </ul>
                {aside.sectionNoteTrackCard.footnoteUk?.trim() ? (
                  <p className="study-aside-track-card-footnote study-learner-explanation">
                    {parseLessonBold(aside.sectionNoteTrackCard.footnoteUk)}
                  </p>
                ) : null}
              </div>
            ) : aside.sectionNoteTermUk?.trim() ? (
              <>
                <p className="study-aside-section-note-term">
                  <StudyTermAccent>{aside.sectionNoteTermUk}</StudyTermAccent>
                </p>
                <p className="study-aside-section-note-body">
                  {parseLessonBold(aside.sectionNoteExplanationUk ?? '')}
                </p>
              </>
            ) : (
              <p className="study-aside-section-note-body">{parseLessonBold(aside.sectionNoteUk!)}</p>
            )}
          </div>
        )}

        {active && !aside.suppressSectionContext && !useSectionNote && (
          <div className="study-aside-card study-rag-aside-context">
            <p className="study-aside-label">Контекст · розділ {active.readerNumber}</p>
            <p className="study-rag-aside-section-title">{active.navTitle}</p>

            {useContextCards ? (
              <div className="study-aside-context-cards">
                {aside.contextCards!.map((card) => (
                  <div key={card.titleUk} className="study-aside-context-card">
                    <p className="study-aside-context-card-title">{card.titleUk}</p>
                    {card.bodyUk ? (
                      <p className="study-aside-context-card-body">{parseLessonBold(card.bodyUk)}</p>
                    ) : null}
                    {card.termRows && card.termRows.length > 0 ? (
                      <ul className="study-aside-term-rows">
                        {card.termRows.map((row) => (
                          <li key={row.term} className="study-aside-term-row">
                            <StudyTermAccent>{row.term}</StudyTermAccent>
                            <span className="study-aside-term-row-sep" aria-hidden="true"> — </span>
                            <span>{row.textUk}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {card.footnoteUk ? (
                      <p className="study-aside-context-card-footnote muted small">
                        {parseLessonBold(card.footnoteUk)}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <>
                {aside.focus ? (
                  <p className="study-rag-aside-focus">{parseLessonBold(aside.focus)}</p>
                ) : null}
                {aside.example ? (
                  <p className="study-rag-aside-example muted small">
                    <span className="study-component-qa-label">Приклад:</span>{' '}
                    {parseLessonBold(aside.example)}
                  </p>
                ) : null}
                {aside.diagram && (
                  <p className="study-rag-aside-diagram muted small">{parseLessonBold(aside.diagram)}</p>
                )}
              </>
            )}

            {aside.table && aside.table.rows.length > 0 && (
              <div className="study-aside-table-wrap">
                <table className="study-aside-data-table">
                  <thead>
                    <tr>
                      {aside.table.headers.map((h) => (
                        <th key={h} scope="col">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {aside.table.rows.map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => (
                          <td key={ci}>{parseLessonBold(cell)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {aside.jsonCard && (
              <figure className="study-aside-json-card">
                {aside.jsonCard.label ? (
                  <figcaption className="study-aside-json-label">{aside.jsonCard.label}</figcaption>
                ) : null}
                <pre className="study-aside-json-pre" lang="en">
                  <code>{aside.jsonCard.json}</code>
                </pre>
                {aside.jsonCard.note ? (
                  <p className="study-aside-json-note muted small">{aside.jsonCard.note}</p>
                ) : null}
              </figure>
            )}

            {aside.tips && aside.tips.length > 0 && (
              <ul className="study-aside-tip-list muted small">
                {aside.tips.map((t) => (
                  <li key={t.slice(0, 48)}>{t}</li>
                ))}
              </ul>
            )}

            {!hasSupplement && !aside.diagram && (
              <p className="study-aside-pointer muted small">
                Розгорніть розділ уроку — там основний текст, таблиці й покрокові пояснення.
              </p>
            )}
          </div>
        )}

        <div className="study-aside-card study-aside-card-compact">
          <p className="study-aside-label">{meta.schemaTitle}</p>
          <p className="muted small study-aside-schema-blurb">{meta.schemaBlurb}</p>
          <Link className="study-rag-atlas-link" to={meta.atlasTo}>
            {meta.atlasLinkLabel}
          </Link>
        </div>
      </div>
    </aside>
  );
}
