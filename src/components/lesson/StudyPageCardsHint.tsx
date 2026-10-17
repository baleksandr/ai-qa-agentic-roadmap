import { STUDY_PAGE_CARDS_INTERACTION_HINT_UK } from '../../lib/studyPageInteractive';
import { StudyInteractionHint } from './StudyInteractionHint';

/** Єдина UI-підказка для всієї Study-сторінки з інтерактивними картками. */
export function StudyPageCardsHint() {
  return (
    <StudyInteractionHint className="study-page-cards-hint">
      {STUDY_PAGE_CARDS_INTERACTION_HINT_UK}
    </StudyInteractionHint>
  );
}
