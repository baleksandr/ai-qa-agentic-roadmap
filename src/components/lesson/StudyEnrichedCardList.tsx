import type { StudyHintSection } from '../../data/study/study-hint-types';
import { parseLessonBold } from './lessonRichText';

export type StudyEnrichedCard = {
  id: string;
  titleUk: string;
  termEn?: string;
  sections: StudyHintSection[];
  qaUk?: string;
};

type Props = {
  leadUk: string;
  introUk?: string;
  cards: StudyEnrichedCard[];
  listAriaLabel: string;
};

/** Повноширинні картки (failure modes тощо) — той самий зміст, що в split-панелі, але все видно одразу */
export function StudyEnrichedCardList({ leadUk, introUk, cards, listAriaLabel }: Props) {
  return (
    <div className="study-enriched-cards">
      <p className="study-boundary-lead">{parseLessonBold(leadUk)}</p>
      {introUk?.trim() && <p className="study-failure-intro muted small">{parseLessonBold(introUk)}</p>}
      <ul className="study-component-list" aria-label={listAriaLabel}>
        {cards.map((card) => (
          <li key={card.id} className="study-component-card study-failure-card">
            <h4 className="study-component-title">{card.titleUk}</h4>
            {card.termEn && (
              <p className="study-policy-term muted small" lang="en">
                Термін у курсі: <em>{card.termEn}</em>
              </p>
            )}
            <dl className="study-failure-details">
              {card.sections.map((sec) => (
                <div key={sec.labelUk}>
                  <dt>{sec.labelUk}</dt>
                  <dd>
                    {sec.listItemsUk?.length ? (
                      <ol className="study-hint-ol">
                        {sec.listItemsUk.map((item) => (
                          <li key={item}>{parseLessonBold(item)}</li>
                        ))}
                      </ol>
                    ) : (
                      parseLessonBold(sec.bodyUk ?? '')
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            {card.qaUk && (
              <p className="study-component-qa">
                <span className="study-component-qa-label">Для QA-агента:</span> {parseLessonBold(card.qaUk)}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
