import type { PhraseParagraphItem } from '../types/lessonBlocks';

/** Явна розмітка в Markdown/Lab Study Mode (не парсинг довільного тире в prose). */
const BLOCK_RE = /:::study-key-phrase\s*\n([\s\S]*?)\n:::/g;

export type StudyMarkdownSegment =
  | { kind: 'md'; text: string }
  | { kind: 'keyPhrase'; items: PhraseParagraphItem[] };

function parseKeyPhraseBody(body: string): PhraseParagraphItem[] {
  return body
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const sep = line.indexOf('|');
      if (sep < 0) {
        return { phraseUk: line, detailUk: '' };
      }
      return {
        phraseUk: line.slice(0, sep).trim(),
        detailUk: line.slice(sep + 1).trim(),
      };
    })
    .filter((item) => item.phraseUk.length > 0);
}

/** Розбиває markdown на звичайні фрагменти та блоки `:::study-key-phrase`. */
export function splitStudyKeyPhraseMarkdown(markdown: string): StudyMarkdownSegment[] {
  const segments: StudyMarkdownSegment[] = [];
  let lastIndex = 0;
  const re = new RegExp(BLOCK_RE.source, 'g');
  let match: RegExpExecArray | null;
  while ((match = re.exec(markdown)) !== null) {
    const before = markdown.slice(lastIndex, match.index).trim();
    if (before) segments.push({ kind: 'md', text: before });
    const items = parseKeyPhraseBody(match[1]);
    if (items.length) segments.push({ kind: 'keyPhrase', items });
    lastIndex = match.index + match[0].length;
  }
  const tail = markdown.slice(lastIndex).trim();
  if (tail) segments.push({ kind: 'md', text: tail });
  if (segments.length === 0 && markdown.trim()) {
    segments.push({ kind: 'md', text: markdown });
  }
  return segments;
}
