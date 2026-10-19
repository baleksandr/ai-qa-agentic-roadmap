import {
  STUDY_SECTION_CARDS_INTERACTION_HINT_UK,
  type StudySectionCardsInteractionHintText,
} from '../../lib/studyPageInteractive';
import { StudyInteractionHint } from './StudyInteractionHint';

type Props = {
  /** За замовчуванням — стандартна підказка для split-nav карток. */
  children?: StudySectionCardsInteractionHintText;
  className?: string;
};

/** Компактна зелена «Підказка» один раз перед групою інтерактивних карток розділу. */
export function StudySectionCardsInteractionHint({ children, className }: Props) {
  const text = children ?? STUDY_SECTION_CARDS_INTERACTION_HINT_UK;
  return (
    <StudyInteractionHint
      className={['study-harness-section-cards-hint', 'study-teaching-section-cards-hint', className]
        .filter(Boolean)
        .join(' ')}
    >
      {text}
    </StudyInteractionHint>
  );
}
