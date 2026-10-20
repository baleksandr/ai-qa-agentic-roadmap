export const PLANNING_LEARNING_OUTCOMES_LEAD_UK =
  'Після падіння login_spec агент знає симптом, але ще не знає причину. Ви навчитеся складати короткий план перевірок, відрізняти заплановану дію від виконаної та змінювати план, коли звіт або trace дають нові факти.';

export type PlanningLearningOutcomeCard = {
  titleUk: string;
  bodyUk: string;
};

export const PLANNING_LEARNING_OUTCOME_CARDS: PlanningLearningOutcomeCard[] = [
  {
    titleUk: 'Відомий факт',
    bodyUk: 'CI повідомив про timeout на #login-btn. Причину ще не встановлено.',
  },
  {
    titleUk: 'Наступний доказ',
    bodyUk:
      'Агент може запропонувати перевірити звіт або trace поточного запуску, якщо ці дії доступні.',
  },
  {
    titleUk: 'Перегляд плану',
    bodyUk:
      'Після фактичного результату агент уточнює наступний крок або завершує розслідування з чесним статусом.',
  },
];
