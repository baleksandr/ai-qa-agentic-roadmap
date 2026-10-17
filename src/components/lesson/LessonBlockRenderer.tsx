import type { LessonBlock } from '../../types/lessonBlocks';
import { LessonRichParagraphs } from './lessonRichText';
import { StudyLearnerPhraseParagraphs } from './StudyLearnerPhraseParagraphs';
import { StudyRememberTakeaways } from './StudyRememberTakeaways';

interface Props {
  block: LessonBlock;
}

export function LessonBlockRenderer({ block }: Props) {
  switch (block.type) {
    case 'phraseParagraphs':
      return <StudyLearnerPhraseParagraphs items={block.items} />;
    case 'paragraph':
      return (
        <div className={block.editorialReview ? 'lesson-needs-review' : undefined}>
          <LessonRichParagraphs text={block.text} />
          {block.editorialReview && (
            <p className="lesson-p">
              <span className="lesson-review-tag">Потребує звірки з DOCX</span>
            </p>
          )}
        </div>
      );
    case 'heading':
      if (block.level === 4) {
        return <h4 className="lesson-h4">{block.text}</h4>;
      }
      return <h3 className="lesson-h3">{block.text}</h3>;
    case 'term':
      return (
        <dl className="lesson-term">
          <dt className="lesson-term-heading">
            <span className="lesson-term-en">{block.termEn}</span>
            <span className="lesson-term-uk-inline"> ({block.termUk})</span>
          </dt>
          <dd className="lesson-term-def">{block.body}</dd>
        </dl>
      );
    case 'list': {
      const ListTag = block.ordered ? 'ol' : 'ul';
      return (
        <div className="lesson-list-wrap">
          {block.title && <h4 className="lesson-h4">{block.title}</h4>}
          <ListTag className="lesson-list">
            {block.items.map((item) => (
              <li key={item.slice(0, 40)}>{item}</li>
            ))}
          </ListTag>
        </div>
      );
    }
    case 'diagram':
    case 'flow':
      return (
        <figure className="lesson-diagram-wrap">
          {block.title && <figcaption className="lesson-diagram-title">{block.title}</figcaption>}
          <pre className="lesson-diagram">{block.lines}</pre>
        </figure>
      );
    case 'code':
      return (
        <pre className="lesson-code">
          <code className={block.language ? `language-${block.language}` : undefined}>
            {block.content}
          </code>
        </pre>
      );
    case 'keyIdea':
      return (
        <aside className="lesson-callout lesson-key-idea">
          <span className="lesson-callout-label">Запам’ятати</span>
          <StudyRememberTakeaways bullets={block.bullets} text={block.text} />
        </aside>
      );
    case 'qaExample':
      return (
        <aside className="lesson-callout lesson-qa">
          <span className="lesson-callout-label">{block.title ?? 'Як це стосується QA'}</span>
          <LessonRichParagraphs text={block.text} />
        </aside>
      );
    case 'interviewAnswer':
      return (
        <aside className="lesson-callout lesson-interview">
          <span className="lesson-callout-label">На співбесіді</span>
          <p className="lesson-interview-q">
            <strong>Питання:</strong> {block.question}
          </p>
          <p className="lesson-interview-a">
            <strong>Interview answer (EN):</strong> {block.answerEn}
          </p>
        </aside>
      );
    default:
      return null;
  }
}

export function LessonBlocks({ blocks }: { blocks: LessonBlock[] }) {
  return (
    <div className="lesson-blocks">
      {blocks.map((block, i) => (
        <LessonBlockRenderer key={i} block={block} />
      ))}
    </div>
  );
}
