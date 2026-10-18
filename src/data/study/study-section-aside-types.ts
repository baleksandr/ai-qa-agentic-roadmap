/** Контекст правої колонки Study Mode (еталон — RAG concept-03). */
export type StudySectionAsideTable = {
  headers: string[];
  rows: string[][];
};

export type StudySectionAsideJsonCard = {
  /** Підпис над блоком (наприклад «Умовний tool result») */
  label?: string;
  json: string;
  note?: string;
};

export type StudySectionAsideTermRow = {
  term: string;
  textUk: string;
};

export type StudySectionAsideContextCard = {
  titleUk: string;
  bodyUk?: string;
  termRows?: StudySectionAsideTermRow[];
  footnoteUk?: string;
};

/** Компактні рядки «назва — пояснення» у нотатці правої колонки (Harness: один run). */
export type StudySectionAsideTrackRow = {
  labelUk: string;
  bodyUk: string;
};

export type StudySectionAsideTrackCard = {
  titleUk: string;
  rows: StudySectionAsideTrackRow[];
  footnoteUk?: string;
};

export type StudySectionAside = {
  /** Коротка орієнтація (1–2 речення), замість розгорнутого контексту — etalon Tool Calling. */
  sectionNoteUk?: string;
  /** Компактна нотатка: темний фон і бірюзова смуга зліва (Reasoning §8). */
  sectionNoteStyle?: 'compact-strip';
  /** Компактна картка з окремими рядками замість суцільного `sectionNoteUk`. */
  sectionNoteTrackCard?: StudySectionAsideTrackCard;
  /** Термін окремим рядком (акцент), пояснення — у `sectionNoteExplanationUk`. */
  sectionNoteTermUk?: string;
  sectionNoteExplanationUk?: string;
  /** Не показувати блок контексту (лише прогрес і схема курсу). */
  suppressSectionContext?: boolean;
  focus?: string;
  example?: string;
  contextCards?: StudySectionAsideContextCard[];
  diagram?: string;
  tips?: string[];
  table?: StudySectionAsideTable;
  jsonCard?: StudySectionAsideJsonCard;
};

export type StudyLessonAsideMeta = {
  sectionCount: number;
  tocHint: string;
  schemaTitle: string;
  schemaBlurb: string;
  atlasTo: string;
  atlasLinkLabel: string;
  /** Вужча права колонка без окремої прокрутки нотатки (Tool Calling). */
  compactAside?: boolean;
};
