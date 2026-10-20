export const ORCHESTRATION_LEARNING_OUTCOMES_LEAD_UK =
  'Після уроку ви зможете пояснити, хто запускає наступну перевірку після збою login_spec, чому результат однієї дії впливає на наступну та як код обробляє помилку, повтор і дію, що потребує схвалення.';

export type OrchestrationLearningOutcomeCard = {
  titleUk: string;
  bodyUk: string;
};

export const ORCHESTRATION_LEARNING_OUTCOME_CARDS: OrchestrationLearningOutcomeCard[] = [
  {
    titleUk: 'Надійшов збій',
    bodyUk: 'CI повідомив про timeout. Причина ще невідома.',
  },
  {
    titleUk: 'Потрібен доказ',
    bodyUk: 'Код може запустити дозволену перевірку артефакта.',
  },
  {
    titleUk: 'Отримано результат',
    bodyUk: 'Фрагмент звіту або помилка впливає на наступний крок.',
  },
  {
    titleUk: 'Потрібне рішення',
    bodyUk:
      'Run завершується, продовжується або чекає схвалення, якщо цього вимагають правила конкретної дії.',
  },
];
