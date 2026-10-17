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

export type StudySectionAside = {
  focus: string;
  example: string;
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
};
