import type { ReactNode } from 'react';

/** **жирний** і абзаци через порожній рядок (\n\n) у тексті Study Mode */
export function parseLessonBold(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
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
