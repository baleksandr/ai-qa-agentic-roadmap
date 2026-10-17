/** Розбір :::review-* блоків у Review Mode (бічна панель / TopicPage). */

export type ReviewPhaseCard = { title: string; body: string };
export type ReviewStepCard = { title: string; who: string; body: string };
export type ReviewCompareCard = { leftTitle: string; leftBody: string; rightTitle: string; rightBody: string };

export type ReviewSegment =
  | { kind: 'md'; text: string }
  | { kind: 'phases'; cards: ReviewPhaseCard[] }
  | { kind: 'steps'; cards: ReviewStepCard[] }
  | { kind: 'compare'; cards: ReviewCompareCard[] };

const BLOCK_RE =
  /:::review-(phases|steps|compare)\s*\n([\s\S]*?)\n:::/g;

function parseLines(block: string): string[] {
  return block
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

function parsePhases(body: string): ReviewPhaseCard[] {
  return parseLines(body).map((line) => {
    const sep = line.indexOf('|');
    if (sep < 0) return { title: line, body: '' };
    return {
      title: line.slice(0, sep).trim(),
      body: line.slice(sep + 1).trim(),
    };
  });
}

function parseSteps(body: string): ReviewStepCard[] {
  return parseLines(body).map((line) => {
    const parts = line.split('|').map((p) => p.trim());
    if (parts.length >= 3) {
      return { title: parts[0], who: parts[1], body: parts.slice(2).join(' | ') };
    }
    if (parts.length === 2) return { title: parts[0], who: '', body: parts[1] };
    return { title: line, who: '', body: '' };
  });
}

function parseCompare(body: string): ReviewCompareCard[] {
  const lines = parseLines(body);
  const cards: ReviewCompareCard[] = [];
  for (const line of lines) {
    const halves = line.split('||').map((p) => p.trim());
    if (halves.length >= 2) {
      const [lTitle, lBody] = halves[0].split('|').map((p) => p.trim());
      const [rTitle, rBody] = halves[1].split('|').map((p) => p.trim());
      cards.push({
        leftTitle: lTitle ?? 'A',
        leftBody: lBody ?? '',
        rightTitle: rTitle ?? 'B',
        rightBody: rBody ?? '',
      });
    }
  }
  return cards;
}

export function splitReviewMarkdown(markdown: string): ReviewSegment[] {
  const segments: ReviewSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(BLOCK_RE.source, 'g');
  while ((match = re.exec(markdown)) !== null) {
    const before = markdown.slice(lastIndex, match.index).trim();
    if (before) segments.push({ kind: 'md', text: before });
    const kind = match[1];
    const body = match[2];
    if (kind === 'phases') segments.push({ kind: 'phases', cards: parsePhases(body) });
    else if (kind === 'steps') segments.push({ kind: 'steps', cards: parseSteps(body) });
    else if (kind === 'compare') segments.push({ kind: 'compare', cards: parseCompare(body) });
    lastIndex = match.index + match[0].length;
  }
  const tail = markdown.slice(lastIndex).trim();
  if (tail) segments.push({ kind: 'md', text: tail });
  if (segments.length === 0 && markdown.trim()) segments.push({ kind: 'md', text: markdown.trim() });
  return segments;
}
