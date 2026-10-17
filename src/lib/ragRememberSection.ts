/** Відрізає з розділу 8 таблицю співбесіди — її замінює інтерактивний блок. */
export function stripRagInterviewTablesFromRememberSection(markdown: string): string {
  const idx = markdown.search(/\|\s*\*\*Співбесіда\*\*/i);
  if (idx < 0) return markdown.trim();
  return markdown.slice(0, idx).trim();
}
