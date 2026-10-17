import { parseLessonBold } from './lessonRichText';
import { StudyTermAccent } from './StudyTermAccent';

export type StudyLearnerTermPairCard = {
  termUk: string;
  fullNameUk?: string;
  explanationUk: string;
};

type Props = {
  cards: StudyLearnerTermPairCard[];
  conclusionLabelUk: string;
  conclusionUk: string;
};

/** Дві паралельні мінікартки термінів + спільний підсумок (§19 LLM/SLM тощо). */
export function StudyLearnerPanelTermPairCards({
  cards,
  conclusionLabelUk,
  conclusionUk,
}: Props) {
  return (
    <div className="study-learner-term-pair-block">
      <ul className="study-learner-term-pair-grid">
        {cards.map((card) => (
          <li key={card.termUk} className="study-learner-term-pair-card">
            <p className="study-learner-term-pair-card-term">
              <StudyTermAccent>{card.termUk}</StudyTermAccent>
            </p>
            {card.fullNameUk?.trim() ? (
              <p className="study-learner-term-pair-card-fullname">{card.fullNameUk}</p>
            ) : null}
            <p className="study-learner-term-pair-card-body study-learner-explanation">
              {parseLessonBold(card.explanationUk)}
            </p>
          </li>
        ))}
      </ul>
      <div className="study-learner-term-pair-conclusion">
        <p className="study-learner-term-pair-conclusion-label">{conclusionLabelUk}</p>
        <p className="study-learner-term-pair-conclusion-body study-learner-explanation">
          {parseLessonBold(conclusionUk)}
        </p>
      </div>
    </div>
  );
}
