/** Блоки **Мітка** текст для бокової панелі Study Mode */
export function studyPanelMarkdown(sections: Array<{ label: string; body: string }>): string {
  return sections.map((s) => `**${s.label}** ${s.body}`).join('\n\n');
}
