import { StudyLabeledExplanation } from './StudyLabeledExplanation';

type Props = {
  termUk: string;
  explanationUk: string;
  termEn?: string;
};

/** «Термін — визначення» в одній компактній рамці; термін блакитний, решта світла. */
export function StudyTermDefinitionCard({ termUk, explanationUk, termEn }: Props) {
  const displayTerm = termEn?.trim() ? `${termUk} (${termEn.trim()})` : termUk;

  return (
    <div className="study-term-definition-card">
      <StudyLabeledExplanation
        termUk={displayTerm}
        explanationUk={explanationUk}
        className="study-term-definition-card__line"
      />
    </div>
  );
}
