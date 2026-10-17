export type StudyInterviewQuestion = {
  id: string;
  questionUk: string;
  /** Одношарова відповідь (legacy decks). Для нових — `answerBriefUk` + `answerDeepUk`. */
  answerUk?: string;
  /** 2–3 речення для співбесіди */
  answerBriefUk?: string;
  /** Детальне пояснення (markdown: абзаци, списки, ```json```) */
  answerDeepUk?: string;
  pitfallUk?: string;
};

export type StudyInterviewNextLink = {
  to: string;
  label: string;
  hintUk: string;
};

export type StudyInterviewDeck = {
  deckId: string;
  headingUk: string;
  leadUk: string;
  questions: StudyInterviewQuestion[];
  pitchUk: string;
  pitchEn: string;
  nextLinks: StudyInterviewNextLink[];
};
