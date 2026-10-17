/** Витягує блок «Два ризики для QA» з хвоста розділу «один запит». */
export function extractRagQaRisksMarkdown(rest: string): string | null {
  if (!rest.trim()) return null;
  const m = rest.match(/\*\*Два ризики для QA\.\*\*\s*([\s\S]*?)(?:\n\n\*\*Крок|$)/i);
  const body = m?.[1]?.trim();
  return body || null;
}
