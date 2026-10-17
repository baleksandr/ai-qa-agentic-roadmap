/** Прибирає редакторські «§N» з тексту панелей для учня (зміст лишається). */
export function stripEditorSectionMarkers(text: string): string {
  return text
    .replace(/\b§\d+(?:[–-]\d+)?\b\s*(?:[—–-]\s*)?/g, '')
    .replace(/\s+([,;.])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
