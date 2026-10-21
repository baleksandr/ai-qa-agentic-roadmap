import type { ReactNode } from 'react';
import { tokenizeStudyLessonInline } from '../../lib/studyLessonBoldParse';
import { StudyTermAccent } from './StudyTermAccent';

function isSuppressedTermAccent(value: string, suppressTermAccent?: string[]): boolean {
  if (!suppressTermAccent?.length) return false;
  const needle = value.trim().toLowerCase();
  return suppressTermAccent.some((term) => term.trim().toLowerCase() === needle);
}

const HASH_SELECTOR_RE = /^#[\w][\w-]*$/;

function renderPlainSegment(value: string, keyBase: string): ReactNode[] {
  const parts = value.split(/(#[\w][\w-]*)/g);
  return parts.map((part, i) => {
    if (HASH_SELECTOR_RE.test(part)) {
      return (
        <code key={`${keyBase}-h-${i}`} className="study-inline-code">
          {part}
        </code>
      );
    }
    return part;
  });
}

/**
 * Inline: **наголос**, `code`, `[[термін]]` → `StudyTermAccent`, #id — inline code.
 */
export function parseLessonBold(
  text: string,
  options?: { suppressTermAccent?: string[]; maxTermAccents?: number },
): ReactNode[] {
  const tokens = tokenizeStudyLessonInline(text);
  const nodes: ReactNode[] = [];
  let key = 0;
  let termAccentsUsed = 0;
  const maxTermAccents = options?.maxTermAccents;
  for (const token of tokens) {
    if (token.type === 'term') {
      if (isSuppressedTermAccent(token.value, options?.suppressTermAccent)) {
        nodes.push(token.value);
      } else if (
        maxTermAccents !== undefined &&
        termAccentsUsed >= maxTermAccents
      ) {
        nodes.push(token.value);
      } else {
        termAccentsUsed += 1;
        nodes.push(
          <StudyTermAccent key={key++}>{token.value}</StudyTermAccent>,
        );
      }
    } else if (token.type === 'bold') {
      nodes.push(
        <strong key={key++} className="study-text-emphasis">
          {token.value}
        </strong>,
      );
    } else if (token.type === 'code') {
      nodes.push(
        <code key={key++} className="study-inline-code">
          {token.value}
        </code>,
      );
    } else {
      for (const c of renderPlainSegment(token.value, `t${key++}`)) {
        nodes.push(c);
      }
    }
  }
  return nodes;
}

type LessonRichBlock = { type: 'prose'; text: string } | { type: 'ul'; items: string[] };

const MARKDOWN_BULLET_LINE_RE = /^-\s+(.+)$/;

/** Розбиває абзац на прозу та підрядки «- …» (GFM-маркери в одному блоці). */
function expandParagraphWithBulletLists(paragraph: string): LessonRichBlock[] {
  const lines = paragraph.split('\n');
  const blocks: LessonRichBlock[] = [];
  let proseLines: string[] = [];
  let bulletItems: string[] = [];

  const flushProse = () => {
    const text = proseLines.join('\n').trim();
    if (text) blocks.push({ type: 'prose', text });
    proseLines = [];
  };
  const flushBullets = () => {
    if (bulletItems.length) blocks.push({ type: 'ul', items: [...bulletItems] });
    bulletItems = [];
  };

  for (const line of lines) {
    const bullet = line.match(MARKDOWN_BULLET_LINE_RE);
    if (bullet) {
      flushProse();
      bulletItems.push(bullet[1].trim());
      continue;
    }
    if (!line.trim() && bulletItems.length > 0) continue;
    if (bulletItems.length > 0) flushBullets();
    proseLines.push(line);
  }
  flushProse();
  flushBullets();

  return blocks.length ? blocks : [{ type: 'prose', text: paragraph.trim() }];
}

function renderLessonRichBlocks(
  blocks: LessonRichBlock[],
  className: string,
  inlineOpts?: { suppressTermAccent?: string[]; maxTermAccents?: number },
): ReactNode {
  return blocks.map((block, i) => {
    if (block.type === 'ul') {
      return (
        <ul key={`ul-${i}`} className="study-learner-bullet-list">
          {block.items.map((item, j) => (
            <li key={j} className={className}>
              {parseLessonBold(item, inlineOpts)}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p key={`p-${i}`} className={className}>
        {parseLessonBold(block.text, inlineOpts)}
      </p>
    );
  });
}

export function LessonRichParagraphs({
  text,
  className = 'lesson-p',
  suppressTermAccent,
  maxTermAccents,
}: {
  text: string;
  className?: string;
  /** Не фарбувати повторно термін, якщо він уже в `StudyDefinitionAccent` у цій відповіді. */
  suppressTermAccent?: string[];
  /** Скільки `[[термін]]` підсвітити кольором у цьому блоці (решта — звичайний текст). */
  maxTermAccents?: number;
}) {
  const paragraphs = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  if (paragraphs.length === 0) return null;
  const inlineOpts =
    suppressTermAccent?.length || maxTermAccents !== undefined
      ? { suppressTermAccent, maxTermAccents }
      : undefined;
  const blocks = paragraphs.flatMap((para) => expandParagraphWithBulletLists(para));
  if (blocks.length === 1 && blocks[0].type === 'prose') {
    return <p className={className}>{parseLessonBold(blocks[0].text, inlineOpts)}</p>;
  }
  return (
    <div className="lesson-p-stack">
      {renderLessonRichBlocks(blocks, className, inlineOpts)}
    </div>
  );
}
