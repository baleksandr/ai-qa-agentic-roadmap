/**
 * Inline **bold** та `code` для навчальних панелей (без MarkdownBody).
 * Не вкладені **; селектори #id — inline code у простому тексті.
 */

const HASH_SELECTOR_RE = /(#[\w][\w-]*)/g;

export type StudyBoldToken =
  | { type: 'text'; value: string }
  | { type: 'bold'; value: string }
  | { type: 'code'; value: string }
  | { type: 'term'; value: string };

/** Розбір рядка на токени (перший прохід — ** і `). */
export function tokenizeStudyLessonInline(text: string): StudyBoldToken[] {
  const tokens: StudyBoldToken[] = [];
  let i = 0;
  while (i < text.length) {
    if (text.startsWith('[[', i)) {
      const close = text.indexOf(']]', i + 2);
      if (close !== -1) {
        tokens.push({ type: 'term', value: text.slice(i + 2, close) });
        i = close + 2;
        continue;
      }
    }
    if (text.startsWith('**', i)) {
      const close = text.indexOf('**', i + 2);
      if (close !== -1) {
        tokens.push({ type: 'bold', value: text.slice(i + 2, close) });
        i = close + 2;
        continue;
      }
    }
    if (text[i] === '`') {
      const close = text.indexOf('`', i + 1);
      if (close !== -1) {
        tokens.push({ type: 'code', value: text.slice(i + 1, close) });
        i = close + 1;
        continue;
      }
    }
    let next = text.length;
    const nTerm = text.indexOf('[[', i);
    const nBold = text.indexOf('**', i);
    const nCode = text.indexOf('`', i);
    if (nTerm !== -1) next = Math.min(next, nTerm);
    if (nBold !== -1) next = Math.min(next, nBold);
    if (nCode !== -1) next = Math.min(next, nCode);
    if (next > i) {
      tokens.push({ type: 'text', value: text.slice(i, next) });
      i = next;
    } else {
      tokens.push({ type: 'text', value: text[i] });
      i += 1;
    }
  }
  return tokens;
}

/** Плоский текст після «рендеру» — для перевірок verify (без React). */
export function renderStudyLessonInlinePlain(text: string): string {
  const out: string[] = [];
  for (const token of tokenizeStudyLessonInline(text)) {
    if (token.type === 'text') {
      out.push(token.value.replace(HASH_SELECTOR_RE, '$1'));
    } else {
      out.push(token.value);
    }
  }
  return out.join('');
}

/** Залишки сирої розмітки після tokenize (незакриті ** або `). */
export function findStudyInlineMarkupArtifacts(text: string): string[] {
  const issues: string[] = [];
  if (/\\[*`]/.test(text)) issues.push('escaped \\* or \\` in source');
  const plain = renderStudyLessonInlinePlain(text);
  if (/\*\*/.test(plain)) issues.push('unparsed ** in rendered output');
  if (/\[\[/.test(text) && !text.includes(']]')) issues.push('unclosed [[ term markup');
  if (/\]\]/.test(plain)) issues.push('unparsed ]] in rendered output');
  return issues;
}
