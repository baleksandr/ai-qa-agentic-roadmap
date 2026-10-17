export interface StudySection {
  id: string;
  /** Заголовок для акордеона (читацька нумерація з 1) */
  title: string;
  /** Короткий заголовок для лівого змісту (без дублювання номера джерела) */
  navTitle: string;
  /** Номер розділу для читача (1, 2, 3…) */
  readerNumber: number;
  group: string;
  bodyMarkdown: string;
}

const FOOTER_HEADING =
  /^(QA-приклад|Failure modes|Запитання для самоперевірки|Коротка відповідь)/i;

/** Глобальний лічильник з PDF/DOCX: `### 114. 1) …` — не окремий розділ */
const GLOBAL_PROCESS_STEP = /^(\d{2,})\.\s+(\d+\))\s*(.*)$/;

/** Крок процесу в межах розділу: `6. 1) …` (рідко в markdown) */
const LOCAL_PROCESS_STEP = /^(\d{1,2})\.\s+(\d+\))\s*(.+)$/;

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function sectionGroup(sectionNumber: number | null): string {
  if (sectionNumber === null) return 'Інше';
  if (sectionNumber <= 1) return 'Вступ';
  if (sectionNumber <= 4) return 'Як це працює';
  if (sectionNumber <= 6) return 'Приклади';
  if (sectionNumber <= 8) return 'Ризики й безпека';
  if (sectionNumber === 9) return 'Тестування (QA/SDET)';
  if (sectionNumber <= 11) return 'Production';
  if (sectionNumber === 12) return 'Зв’язки в курсі';
  if (sectionNumber === 13) return 'Співбесіда';
  if (sectionNumber === 14) return 'Запам’ятати';
  return 'Інше';
}

function parseMainSectionNumber(titleLine: string): number | null {
  const nested = titleLine.match(/^(\d{1,2})\.\d+/);
  if (nested) return parseInt(nested[1], 10);
  const main = titleLine.match(/^(\d{1,2})\.\s+(?!\d+\))/);
  if (main) return parseInt(main[1], 10);
  return null;
}

/** Текст заголовка без номера з джерела (0., 1., 10.1. …) */
export function stripSourceSectionPrefix(titleLine: string): string {
  return titleLine.replace(/^(\d{1,2})(\.\d+)+\.\s+/, '').replace(/^(\d{1,2})\.\s+/, '').trim();
}

function bareTitleFromSource(titleLine: string): string {
  const stripped = stripSourceSectionPrefix(titleLine);
  return stripped || titleLine.trim();
}

function isProcessStepTitle(titleLine: string): boolean {
  if (GLOBAL_PROCESS_STEP.test(titleLine)) return true;
  const local = titleLine.match(LOCAL_PROCESS_STEP);
  if (!local) return false;
  const sectionNum = parseInt(local[1], 10);
  const stepNum = local[2];
  return sectionNum >= 0 && sectionNum <= 14 && /^\d+\)$/.test(stepNum);
}

function stepToListItem(titleLine: string): string {
  const global = titleLine.match(GLOBAL_PROCESS_STEP);
  if (global) {
    const rest = global[3].trim();
    return `${global[2].replace(')', '')}. ${rest}`;
  }
  const local = titleLine.match(LOCAL_PROCESS_STEP);
  if (local) {
    return `${local[2].replace(')', '')}. ${local[3].trim()}`;
  }
  return titleLine;
}

function appendProcessStep(section: StudySection, titleLine: string, inlineBody: string) {
  const itemText = stepToListItem(titleLine).replace(/^\d+\.\s*/, '');
  const extra = inlineBody ? `\n\n${inlineBody}` : '';
  const hasStepBlock =
    section.bodyMarkdown.includes('#### Крок за кроком') ||
    section.bodyMarkdown.includes('#### Послідовність дій');
  if (!hasStepBlock) {
    const lead = section.title.toLowerCase().includes('крок за кроком')
      ? '\n\n#### Крок за кроком\n\n'
      : '\n\n#### Послідовність дій\n\n';
    section.bodyMarkdown += `${lead}**Крок 1.** ${itemText}${extra}`;
    return;
  }
  const stepCount = (section.bodyMarkdown.match(/\*\*Крок \d+\.\*\*/g) ?? []).length;
  section.bodyMarkdown += `\n\n**Крок ${stepCount + 1}.** ${itemText}${extra}`;
}

/** Нумеровані рядки в блоці «крок за кроком» → **Крок N.** */
function formatProcessStepsInBody(body: string, sectionBareTitle: string): string {
  const isStepSection = /крок за кроком/i.test(sectionBareTitle) || /#### Крок за кроком/.test(body);
  if (!isStepSection) return body;

  let step = 0;
  return body.replace(/^(\d+)\.\s+(.+)$/gm, (match, _n, text) => {
    if (body.includes('#### Крок за кроком') && !match) return match;
    step += 1;
    return `\n\n**Крок ${step}.** ${text.trim()}\n`;
  });
}

/** Читацька нумерація розділів: 1, 2, 3… (джерело 0–14 лишається лише в markdown-архіві) */
function applyReaderNumbers(sections: StudySection[]): StudySection[] {
  return sections.map((s, index) => {
    const readerNumber = index + 1;
    const bare = stripSourceSectionPrefix(s.title) || s.navTitle;
    const shortNav = bare.length > 48 ? `${bare.slice(0, 45)}…` : bare;
    return {
      ...s,
      readerNumber,
      title: `${readerNumber}. ${bare}`,
      navTitle: shortNav,
      bodyMarkdown: formatProcessStepsInBody(s.bodyMarkdown, bare),
    };
  });
}

export interface ParsedStudy {
  introMarkdown: string;
  sections: StudySection[];
  /** Блок «Джерела та примітки» (поза акордеонами) */
  sourcesMarkdown?: string;
}

const STUDY_SOURCES_START = /^:::study-sources\s*$/m;
const STUDY_SOURCES_END = /^:::study-sources-end\s*$/m;

function extractStudySourcesBlock(md: string): { body: string; sourcesMarkdown: string } {
  const start = md.search(STUDY_SOURCES_START);
  if (start < 0) return { body: md, sourcesMarkdown: '' };
  const afterStart = md.slice(start);
  const endRel = afterStart.search(STUDY_SOURCES_END);
  if (endRel < 0) return { body: md, sourcesMarkdown: '' };
  const sourcesMarkdown = afterStart
    .replace(STUDY_SOURCES_START, '')
    .slice(0, endRel)
    .trim();
  const endAbs = start + endRel + ':::study-sources-end'.length;
  const body = `${md.slice(0, start).trim()}\n\n${md.slice(endAbs).trim()}`.trim();
  return { body, sourcesMarkdown };
}

/** Прибирає одиночний H1 і «Concept N.» з початку Study Mode */
function stripStudyPreamble(md: string): string {
  return md
    .replace(/^#\s+[^\n]+\n+/, '')
    .replace(/^Concept \d+\.[^\n]*\n+/im, '')
    .trim();
}

/** Витягує QUICK VIEW для вступу «Що я зрозумію» */
export function extractStudyIntro(studyMarkdown: string): string {
  const match = studyMarkdown.match(
    /^###\s+QUICK VIEW[^\n]*\n([\s\S]*?)(?=^###\s+(?!QUICK)|\n##\s+|\Z)/im,
  );
  if (!match) return '';
  const body = match[1]
    .replace(/^Concept \d+.*$/gm, '')
    .replace(/^↓$/gm, '')
    .replace(/^\[Concept.*$/gm, '')
    .trim();
  return body;
}

/** Розбиває Study Mode на підтеми; кроки `114. 1)` зливає в попередній розділ */
export function parseStudySections(studyMarkdown: string): StudySection[] {
  return parseStudyDocument(studyMarkdown).sections;
}

export function parseStudyDocument(studyMarkdown: string): ParsedStudy {
  let introMarkdown = extractStudyIntro(studyMarkdown);
  let trimmed = studyMarkdown.trim();
  if (introMarkdown) {
    trimmed = trimmed.replace(
      /^###\s+QUICK VIEW[\s\S]*?(?=^###\s+(?!QUICK)|\Z)/im,
      '',
    ).trim();
  }

  trimmed = stripStudyPreamble(trimmed);
  const { body: withoutSources, sourcesMarkdown } = extractStudySourcesBlock(trimmed);
  trimmed = withoutSources;

  if (!trimmed) return { introMarkdown, sections: [], sourcesMarkdown };

  const chunks = trimmed.split(/^#{2,3}\s+/m);
  const sections: StudySection[] = [];

  if (chunks[0]?.trim() && !/^Навіщо|^Як |^Де |^Що потрібно|^Запам/i.test(chunks[0].trim().split('\n')[0])) {
    const preamble = chunks.shift()?.trim();
    if (preamble) {
      introMarkdown = introMarkdown ? `${introMarkdown}\n\n${preamble}` : preamble;
    }
  }

  for (const chunk of chunks) {
    if (!chunk.trim()) continue;
    const nl = chunk.indexOf('\n');
    const titleLine = (nl >= 0 ? chunk.slice(0, nl) : chunk).trim();
    const body = (nl >= 0 ? chunk.slice(nl + 1) : '').trim();

    if (/^QUICK VIEW/i.test(titleLine)) continue;
    if (/^Concept \d+\./i.test(titleLine)) continue;
    if (FOOTER_HEADING.test(titleLine)) break;

    if (isProcessStepTitle(titleLine)) {
      const parent = sections[sections.length - 1];
      if (parent) {
        appendProcessStep(parent, titleLine, body);
      } else {
        sections.push({
          id: slugify(titleLine),
          title: 'Послідовність дій',
          navTitle: 'Послідовність дій',
          readerNumber: 0,
          group: 'Як це працює',
          bodyMarkdown: `**Крок 1.** ${stepToListItem(titleLine).replace(/^\d+\.\s*/, '')}${body ? `\n\n${body}` : ''}`,
        });
      }
      continue;
    }

    const bare = bareTitleFromSource(titleLine);
    const num = parseMainSectionNumber(titleLine);
    sections.push({
      id: slugify(titleLine) || `section-${sections.length}`,
      title: bare,
      navTitle: bare,
      readerNumber: 0,
      group: sectionGroup(num),
      bodyMarkdown: body,
    });
  }

  return { introMarkdown, sections: applyReaderNumbers(sections), sourcesMarkdown };
}
