import type { StudyLessonHero } from '../../data/study/study-lesson-heroes';

type Props = {
  hero: StudyLessonHero;
};

/** H1-візуал: коротка назва + abbr + сітка літер (еталон RAG). */
export function StudyLessonAcronymHero({ hero }: Props) {
  const gridLabel = `Розшифровка ${hero.topicLabel}`;
  return (
    <div className="study-rag-acronym-hero">
      <p className="study-rag-acronym-topic">{hero.topicLabel}</p>

      <p className="study-rag-acronym-full">
        <abbr title={hero.abbrTitle ?? hero.abbrEn} className="study-rag-acronym-abbr">
          {hero.abbrEn}
        </abbr>
        <span className="study-rag-acronym-full-sep" aria-hidden="true"> — </span>
        <span className="study-rag-acronym-full-uk">{hero.taglineUk}</span>
      </p>

      <div className="study-rag-acronym-grid" role="list" aria-label={gridLabel}>
        {hero.letters.map((item) => (
          <article key={item.char} className="study-rag-acronym-cell" role="listitem">
            <span className="study-rag-acronym-char">{item.char}</span>
            <div className="study-rag-acronym-cell-text">
              <span className="study-rag-acronym-en">{item.en}</span>
              <span className="study-rag-acronym-uk">{item.uk}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
