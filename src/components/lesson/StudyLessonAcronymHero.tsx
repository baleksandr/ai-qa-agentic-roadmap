import type { StudyLessonHero } from '../../data/study/study-lesson-heroes';
import { StudyAfterInteractiveSummary } from './StudyAfterInteractiveSummary';
import { StudyCyberHudCard, StudyCyberHudHeroGrid } from './StudyCyberHudCard';

type Props = {
  hero: StudyLessonHero;
  /** Єдиний Neon HUD для тем «готово для навчання». */
  neonHudTheme?: boolean;
};

function useCyberHudLetters(hero: StudyLessonHero, neonHudTheme: boolean, hasLetterGrid: boolean) {
  if (!hasLetterGrid) return false;
  if (hero.letterPresentation === 'cyber-hud') return true;
  if (hero.letterPresentation === 'default') return false;
  return neonHudTheme;
}

function heroTaglineLines(hero: StudyLessonHero): string[] {
  const lines = hero.taglineUkLines?.map((line) => line.trim()).filter(Boolean) ?? [];
  if (lines.length > 0) return lines;
  const single = hero.taglineUk?.trim();
  return single ? [single] : [];
}

function HeroTaglineUk({ hero, neonHudTheme }: { hero: StudyLessonHero; neonHudTheme: boolean }) {
  const lines = heroTaglineLines(hero);
  if (lines.length === 0) return null;
  const multiline = lines.length > 1;
  const framedTagline = neonHudTheme && !multiline;
  const heroLead = hero.letterPresentation === 'cyber-hud';
  return (
    <p
      className={`study-rag-acronym-subtitle study-learner-explanation${
        multiline ? ' study-rag-acronym-subtitle--multiline' : ''
      }${heroLead ? ' study-rag-acronym-subtitle--hero-lead' : ''}${
        framedTagline ? ' study-rag-acronym-hero-tagline' : ''
      }`}
    >
      {multiline
        ? lines.map((line) => (
            <span key={line} className="study-rag-acronym-tagline-line">{line}</span>
          ))
        : lines[0]}
    </p>
  );
}

/** H1-візуал: коротка назва + abbr + сітка літер (еталон RAG) або інформаційні картки. */
export function StudyLessonAcronymHero({ hero, neonHudTheme = false }: Props) {
  const gridLabel = `Розшифровка ${hero.topicLabel}`;
  const hasIntroCards = (hero.introCards?.length ?? 0) > 0;
  const hasLetterGrid = hero.letters.length > 0;
  const isTitleTaglineOnly = !hasIntroCards && !hasLetterGrid;
  const hudLetters = useCyberHudLetters(hero, neonHudTheme, hasLetterGrid);
  const hudIntroCards = neonHudTheme && hasIntroCards;

  return (
    <div
      className={`study-rag-acronym-hero${isTitleTaglineOnly ? ' study-rag-acronym-hero--title-tagline' : ''}`}
    >
      <p className="study-rag-acronym-topic">{hero.topicLabel}</p>

      {hasIntroCards ? (
        <HeroTaglineUk hero={hero} neonHudTheme={neonHudTheme} />
      ) : (
        <>
          {hero.abbrEn?.trim() ? (
            <p className="study-rag-acronym-en-line">
              <abbr title={hero.abbrTitle ?? hero.abbrEn} className="study-rag-acronym-abbr">
                {hero.abbrEn}
              </abbr>
            </p>
          ) : null}
          <HeroTaglineUk hero={hero} neonHudTheme={neonHudTheme} />
        </>
      )}

      {hudIntroCards ? (
        <StudyCyberHudHeroGrid ariaLabel={gridLabel}>
          {(hero.introCards ?? []).map((card, index) => (
            <StudyCyberHudCard
              key={card.titleUk}
              badge={String(index + 1)}
              title={card.titleUk}
              subtitle={card.bodyUk}
            />
          ))}
        </StudyCyberHudHeroGrid>
      ) : hasIntroCards ? (
        <div className="study-tc-hero-intro-cards study-harness-outcomes-cards">
          <StudyAfterInteractiveSummary
            summary={{ sectionTitleUk: '', cards: hero.introCards ?? [] }}
          />
        </div>
      ) : hudLetters ? (
        <StudyCyberHudHeroGrid ariaLabel={gridLabel}>
          {hero.letters.map((item, index) => (
            <StudyCyberHudCard
              key={`${item.char}-${item.en}-${index}`}
              badge={item.char}
              title={item.en}
              subtitle={item.uk}
            />
          ))}
        </StudyCyberHudHeroGrid>
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
