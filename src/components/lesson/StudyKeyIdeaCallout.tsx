import { GUARDRAILS_KEY_IDEA_UK } from '../../data/study/guardrails-components';
import { LessonRichParagraphs } from './lessonRichText';

type Props = {
  sourceText: string;
  topicId?: string;
};

export function StudyKeyIdeaCallout({ sourceText, topicId }: Props) {
  const glossUk = topicId === 'concept-17' ? GUARDRAILS_KEY_IDEA_UK : null;

  return (
    <aside className="lesson-callout lesson-key-idea study-key-idea">
      <span className="lesson-callout-label">Ключова думка</span>
      {glossUk && (
        <div className="study-key-idea-gloss">
          <LessonRichParagraphs text={glossUk} className="lesson-p" />
        </div>
      )}
      <blockquote className="study-source-quote" lang="en">
        <LessonRichParagraphs text={sourceText} className="lesson-p" />
      </blockquote>
    </aside>
  );
}
