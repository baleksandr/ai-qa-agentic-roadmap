export type ObservabilityWhyCard = {
  titleUk: string;
  bodyUk: string;
};

/** Вступ §1 «Навіщо observability?» — concept-18 (картки в блоці outcomes, тут — схема). */
export const OBSERVABILITY_WHY_SECTION_INTRO_UK =
  'У production QA часто починає з симптому: агент дав неочікувану відповідь або run завис. Trace і метрики показують, які кроки справді відбулися між запуском і результатом. Нижче — спрощений ланцюжок від одного run до розбору on-call.';

export const OBSERVABILITY_WHY_FLOW_STAGES = ['run', 'spans', 'on-call debug'];

export const OBSERVABILITY_WHY_FLOW_CAPTION_UK =
  'Один запуск містить пов’язані події в spans. Їх аналіз допомагає команді відновити перебіг виконання та знайти причину проблеми.';
