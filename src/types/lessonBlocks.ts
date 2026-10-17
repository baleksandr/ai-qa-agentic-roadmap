export type PhraseParagraphItem = { phraseUk: string; detailUk: string };

export type KeyIdeaBullet = { termUk?: string; bodyUk: string };

export type LessonBlock =
  | { type: 'paragraph'; text: string; editorialReview?: boolean }
  | { type: 'phraseParagraphs'; items: PhraseParagraphItem[] }
  | { type: 'heading'; level: 3 | 4; text: string }
  | { type: 'definitionAccent'; termUk: string; termEn: string; leadUk: string }
  | { type: 'studyWidget'; widgetId: string }
  | { type: 'term'; body: string; termEn: string; termUk: string }
  | { type: 'list'; items: string[]; ordered?: boolean; title?: string }
  | { type: 'diagram'; title?: string; lines: string }
  | { type: 'code'; language?: string; content: string }
  | { type: 'keyIdea'; text?: string; bullets?: KeyIdeaBullet[] }
  | { type: 'qaExample'; title?: string; text: string }
  | { type: 'interviewAnswer'; question: string; answerEn: string }
  | { type: 'flow'; title?: string; lines: string };

export interface StructuredStudySection {
  id: string;
  title: string;
  blocks: LessonBlock[];
}

export interface StructuredStudy {
  topicId: string;
  sourceArchivePath: string;
  chapterTitle: string;
  chapterSubtitle?: string;
  sections: StructuredStudySection[];
}
