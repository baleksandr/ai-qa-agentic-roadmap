import type { StudyLessonHero } from '../../data/study/study-lesson-heroes';
import { StudyAfterInteractiveSummary } from './StudyAfterInteractiveSummary';

type Props = {
  hero: StudyLessonHero;
};

/** H1-візуал: коротка назва + abbr + сітка літер (еталон RAG) або інформаційні картки. */
export function StudyLessonAcronymHero({ hero }: Props) {
  const gridLabel = `Розшифровка ${hero.topicLabel}`;
  const hasIntroCards = (hero.introCards?.length ?? 0) > 0;
  const hasLetterGrid = hero.letters.length > 0;
  const isTitleTaglineOnly = !hasIntroCards && !hasLetterGrid;

  return (
    <div
      className={`study-rag-acronym-hero${isTitleTaglineOnly ? ' study-rag-acronym-hero--title-tagline' : ''}`}
    >
      <p className="study-rag-acronym-topic">{hero.topicLabel}</p>

      {hasIntroCards ? (
        hero.taglineUk?.trim() ? (
          <p className="study-rag-acronym-subtitle study-learner-explanation">{hero.taglineUk}</p>
        ) : null
      ) : (
        <>
          {hero.abbrEn?.trim() ? (
            <p className="study-rag-acronym-en-line">
              <abbr title={hero.abbrTitle ?? hero.abbrEn} className="study-rag-acronym-abbr">
                {hero.abbrEn}
              </abbr>
            </p>
          ) : null}
          {hero.taglineUk?.trim() ? (
            <p className="study-rag-acronym-subtitle study-learner-explanation">{hero.taglineUk}</p>
          ) : null}
        </>
      )}

      {hasIntroCards ? (
        <div className="study-tc-hero-intro-cards study-harness-outcomes-cards">
          <StudyAfterInteractiveSummary
            summary={{ sectionTitleUk: '', cards: hero.introCards ?? [] }}
          />
        </div>
      ) : hasLetterGrid ? (
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
      ) : null}
    </div>
  );
}
