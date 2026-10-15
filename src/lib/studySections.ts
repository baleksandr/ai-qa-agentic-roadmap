export interface StudySection {
  id: string;
  title: string;
  bodyMarkdown: string;
}

const FOOTER_HEADING =
  /^(QA-приклад|Failure modes|Запитання для самоперевірки|Коротка відповідь)/i;

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

/** Розбиває Study Mode на підтеми за заголовками `### …` (PART II 0–14 тощо). */
export function parseStudySections(studyMarkdown: string): StudySection[] {
  const trimmed = studyMarkdown.trim();
  if (!trimmed) return [];

  const chunks = trimmed.split(/^###\s+/m);
  const sections: StudySection[] = [];

  for (const chunk of chunks) {
    if (!chunk.trim()) continue;
    const nl = chunk.indexOf('\n');
    const titleLine = (nl >= 0 ? chunk.slice(0, nl) : chunk).trim();
    const body = (nl >= 0 ? chunk.slice(nl + 1) : '').trim();

    if (/^QUICK VIEW/i.test(titleLine)) continue;
    if (/^Concept \d+\./i.test(titleLine)) continue;
    if (FOOTER_HEADING.test(titleLine)) break;

    sections.push({
      id: slugify(titleLine) || `section-${sections.length}`,
      title: titleLine,
      bodyMarkdown: body,
    });
  }

  return sections;
}
