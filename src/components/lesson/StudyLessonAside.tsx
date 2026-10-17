import { Link } from 'react-router-dom';
import {
  getStudyLessonAsideMeta,
  getStudySectionAside,
} from '../../data/study/study-lesson-aside.registry';
import type { StudySection } from '../../lib/studySections';
import { ProgressPicker } from '../ProgressPicker';
import type { LearningStatus } from '../../types/topic';
import { LEARNING_LABELS } from '../../types/topic';
import { parseLessonBold } from './lessonRichText';

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

  const hasSupplement =
    (aside.table && aside.table.rows.length > 0) ||
    aside.jsonCard ||
    (aside.tips && aside.tips.length > 0) ||
    aside.diagram;

  return (
    <aside className="study-col-aside study-lesson-aside" aria-label="Контекст уроку">
      <div className="study-lesson-aside-pinned">
        <div className="study-aside-card study-aside-card-compact">
          <p className="study-aside-label">Ваш прогрес</p>
          <p className={`badge progress-${learning}`}>{LEARNING_LABELS[learning]}</p>
          <ProgressPicker value={learning} onChange={onLearningChange} />
        </div>
      </div>

      <div className="study-lesson-aside-scroll">
        {active && (
          <div className="study-aside-card study-rag-aside-context">
            <p className="study-aside-label">Контекст · розділ {active.readerNumber}</p>
            <p className="study-rag-aside-section-title">{active.navTitle}</p>
            <p className="study-rag-aside-focus">{parseLessonBold(aside.focus)}</p>
            <p className="study-rag-aside-example muted small">
              <span className="study-component-qa-label">Приклад:</span> {parseLessonBold(aside.example)}
            </p>
            {aside.diagram && (
              <p className="study-rag-aside-diagram muted small">{parseLessonBold(aside.diagram)}</p>
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
