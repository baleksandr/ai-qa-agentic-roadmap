export type RagQaCheckItem = {
  title: string;
  body: string;
};

/** Парсить абзаци **Заголовок.** текст для розділу QA */
export function extractRagQaChecks(text: string): RagQaCheckItem[] {
  const items: RagQaCheckItem[] = [];
  const re = /\*\*([^*]+)\.\*\*\s*([\s\S]*?)(?=\n\n\*\*[^*]+\.\*\*|\s*$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const title = m[1].trim();
    const body = m[2].trim().replace(/\s+/g, ' ');
    if (title && body) items.push({ title, body });
  }
  return items;
}
