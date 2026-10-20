/** Службова нотатка міграції — не показувати в навчальному UI. */
export const INTERNAL_MIGRATION_NOTE_PDF =
  'Текст з PDF; DOCX не знайдено — таблиці/зображення не звірені.';

export function migrationNotesForLearners(notes?: string): string | undefined {
  const trimmed = notes?.trim();
  if (!trimmed || trimmed === INTERNAL_MIGRATION_NOTE_PDF) return undefined;
  return trimmed;
}
