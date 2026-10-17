/** Ієрархічна нумерація інтерактивних карток Study Mode (не в тексті уроку). */
export function formatStudyCardNumber(parentPrefix: string | undefined, index1: number): string {
  const n = String(index1);
  return parentPrefix?.trim() ? `${parentPrefix.trim()}.${n}` : n;
}

export function studyCardPanelLabel(cardNumber: string): string {
  return `Картка ${cardNumber}`;
}
