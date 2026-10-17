import type { ReactNode } from 'react';
import { tokenizeStudyLessonInline } from '../../lib/studyLessonBoldParse';

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
 * Inline з markdown-джерела: **наголос** (лише вага, без кольору терміна) та `code`.
 * Селектори #id у простому тексті — inline code. Акцентний колір — лише через `StudyTermAccent`.
 */
export function parseLessonBold(text: string): ReactNode[] {
  const tokens = tokenizeStudyLessonInline(text);
  const nodes: ReactNode[] = [];
  let key = 0;
  for (const token of tokens) {
    if (token.type === 'bold') {
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

export function LessonRichParagraphs({
  text,
  className = 'lesson-p',
}: {
  text: string;
  className?: string;
}) {
  const paragraphs = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  if (paragraphs.length === 0) return null;
  if (paragraphs.length === 1) {
    return <p className={className}>{parseLessonBold(paragraphs[0])}</p>;
  }
  return (
    <div className="lesson-p-stack">
      {paragraphs.map((para, i) => (
        <p key={i} className={className}>
          {parseLessonBold(para)}
        </p>
      ))}
    </div>
  );
}
