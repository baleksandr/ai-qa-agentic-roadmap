/** «1. Основи AI та LLM» → індекс і текст без префікса для картки етапу на карті. */
export function parseLearningMapStageTitle(title: string): {
  index: string | null;
  headingUk: string;
} {
  const match = title.match(/^(\d+)\.\s*(.+)$/);
  if (!match) {
    return { index: null, headingUk: title };
  }
  return { index: match[1], headingUk: match[2] };
}
