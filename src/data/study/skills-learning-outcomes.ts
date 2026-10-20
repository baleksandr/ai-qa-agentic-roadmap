export const SKILLS_LEARNING_OUTCOMES_LEAD_UK =
  'Після уроку ви зможете пояснити, навіщо агенту повторювана інструкція для розбору падіння тесту, як він отримує потрібний skill і чому його інструкції не дають автоматичного доступу до файлів чи API.';

export type SkillsLearningOutcomeCard = {
  titleUk: string;
  bodyUk: string;
};

export const SKILLS_LEARNING_OUTCOME_CARDS: SkillsLearningOutcomeCard[] = [
  {
    titleUk: 'Що містить skill',
    bodyUk: 'Інструкцію для задачі та, за потреби, приклади чи допоміжні матеріали.',
  },
  {
    titleUk: 'Як його застосовують',
    bodyUk: 'Агент отримує доречні інструкції й використовує їх для наступного кроку розслідування.',
  },
  {
    titleUk: 'Хто контролює дії',
    bodyUk: 'Код перевіряє запропоновані інструменти, аргументи та доступ до артефактів.',
  },
];
