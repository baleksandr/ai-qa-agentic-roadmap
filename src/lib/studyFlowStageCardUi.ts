/**
 * Бейджі на StudyFlowStageCard — лише зрозумілі учню підписи.
 * Службові гліфи (STP, Q, PAR, …) у коді не показуємо; номер картки — studyCardNumber.
 */

/**
 * Колишні glyphForKey (лише для історії коду, не рендеримо):
 * DOC — document loader, PAR — parse, CHK — check/QA-фаза, IDX — index,
 * DB — vector store, Q — query, SR — search/retriever, K — top-k hits,
 * CTX — context builder, FLT — filter/metadata, HAR — harness,
 * EXE — executor/tool, STP — generic step.
 */
const LEARNER_GLYPH: Record<string, string> = {
  llm: 'LLM',
};

const GENERIC_KIND_WHEN_NUMBERED = new Set(['Крок', 'Вхід', 'Вихід', 'Результат']);

export function studyFlowStageGlyphLabel(visualKey: string, hasCardNumber: boolean): string | null {
  if (hasCardNumber) return null;
  return LEARNER_GLYPH[visualKey] ?? null;
}

export function studyFlowStageKindBadge(
  navBadgeUk: string | undefined,
  cardBadgeUk: string | undefined,
  autoStepKind: string | null,
  hasCardNumber: boolean,
): string | null {
  const explicit = navBadgeUk?.trim() || cardBadgeUk?.trim();
  if (explicit) {
    if (hasCardNumber && (GENERIC_KIND_WHEN_NUMBERED.has(explicit) || /^\d+$/.test(explicit))) {
      return null;
    }
    return explicit;
  }
  if (hasCardNumber) return null;
  return autoStepKind;
}

/** Виконавець на картці процесу (RAG, tool calling); без дефолту «Код» на картках з номером. */
export function studyFlowStageActorBadge(
  navActorUk: string | undefined,
  cardActorUk: string | undefined,
  hasCardNumber: boolean,
): string | null {
  const explicit = navActorUk?.trim() || cardActorUk?.trim();
  if (explicit) {
    if (hasCardNumber && explicit === 'Код') return null;
    return explicit;
  }
  if (hasCardNumber) return null;
  return 'Код';
}
