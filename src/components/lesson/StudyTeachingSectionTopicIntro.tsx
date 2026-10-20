import { STUDY_SECTION_CARDS_HOW_UK } from '../../lib/studyPageInteractive';
import { LessonRichParagraphs } from './lessonRichText';

type Props = {
  topicIntroUk: string;
  /** Показати блок «Як працювати з картками» (split-nav розділи). */
  showCardsHow?: boolean;
  cardsHowUk?: string;
  className?: string;
};

/** Вступ розділу: тема + окремо коротка інструкція до карток. */
export function StudyTeachingSectionTopicIntro({
  topicIntroUk,
  showCardsHow = true,
  cardsHowUk,
  className = '',
}: Props) {
  const howText = cardsHowUk?.trim() || STUDY_SECTION_CARDS_HOW_UK;
  return (
    <div className={`study-teaching-section-topic-intro${className ? ` ${className}` : ''}`}>
      <div className="study-teaching-section-topic-about study-teaching-compact-section-intro">
        <p className="study-teaching-section-topic-label study-learner-panel-label">Про що цей розділ</p>
        <LessonRichParagraphs
          text={topicIntroUk}
          className="study-teaching-compact-section-intro-text study-learner-explanation"
        />
      </div>
      {showCardsHow ? (
        <aside
          className="study-teaching-section-cards-how study-interaction-hint study-harness-section-cards-hint study-teaching-section-cards-hint"
          role="note"
        >
          <span className="study-interaction-hint-label">Як працювати з картками</span>
          <p className="study-interaction-hint-text">{howText}</p>
        </aside>
      ) : null}
    </div>
  );
}
