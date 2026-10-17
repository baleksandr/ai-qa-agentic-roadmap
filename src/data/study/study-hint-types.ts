export type StudyHintSection = {
  labelUk: string;
  bodyUk: string;
  /** Пункти списку (рендеряться стовпчиком, не в один рядок) */
  listItemsUk?: string[];
};

export type StudyHintItem = {
  id: string;
  titleUk: string;
  termEn?: string;
  teaserUk: string;
  sections: StudyHintSection[];
  qaUk?: string;
  exampleUk?: string;
};
