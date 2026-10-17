import type { PhraseParagraphItem } from '../../types/lessonBlocks';
import { StudyLearnerKeyPhraseLine } from './StudyLearnerKeyPhraseLine';

export function StudyLearnerPhraseParagraphs({ items }: { items: PhraseParagraphItem[] }) {
  if (!items.length) return null;

  return (
    <div className="study-learner-phrase-stack">
      {items.map((item) => (
        <StudyLearnerKeyPhraseLine key={item.phraseUk} {...item} />
      ))}
    </div>
  );
}
