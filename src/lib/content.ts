const modules = import.meta.glob('../../content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export function loadMarkdownByPath(contentPath: string): string | null {
  const key = `../../${contentPath.replace(/\\/g, '/')}`;
  return modules[key] ?? null;
}

export interface ParsedLesson {
  reviewMarkdown: string;
  studyMarkdown: string;
  bodyMarkdown: string;
}

const REVIEW_HEADING = /^##\s+Review Mode\s*$/im;
const STUDY_HEADING = /^##\s+Study Mode\s*$/im;

/** Розділяє markdown на Review / Study за заголовками другого рівня */
export function parseLessonMarkdown(raw: string): ParsedLesson {
  const reviewMatch = REVIEW_HEADING.exec(raw);
  const studyMatch = STUDY_HEADING.exec(raw);

  if (!reviewMatch || !studyMatch) {
    return {
      reviewMarkdown: '',
      studyMarkdown: raw,
      bodyMarkdown: raw,
    };
  }

  const reviewStart = reviewMatch.index + reviewMatch[0].length;
  const studyStart = studyMatch.index + studyMatch[0].length;

  const reviewMarkdown = raw.slice(reviewStart, studyMatch.index).trim();
  const studyMarkdown = raw.slice(studyStart).trim();

  return {
    reviewMarkdown,
    studyMarkdown,
    bodyMarkdown: raw,
  };
}
