import type { StudyAfterInteractiveSummary } from './study-teaching-card-types';

/** Блок «Що я зрозумію» для concept-14 Prompt Engineering. */
export const PROMPT_ENGINEERING_LEARNING_OUTCOMES: StudyAfterInteractiveSummary = {
  sectionTitleUk: '',
  cards: [
    {
      titleUk: 'Передати факти',
      bodyUk:
        'Код повідомляє моделі, що тест login_spec завершився timeout на #login-btn. Не додає вміст звіту, якщо його ще не прочитали.',
    },
    {
      titleUk: 'Поставити задачу',
      bodyUk:
        'Запит пояснює, що потрібно запропонувати наступний крок розслідування, а не вигадати причину падіння.',
    },
    {
      titleUk: 'Задати формат',
      bodyUk:
        'Запит указує, які поля має містити відповідь, щоб код міг її перевірити й використати.',
    },
    {
      titleUk: 'Перевірити відповідь',
      bodyUk:
        'Код перевіряє формат. QA окремо звіряє твердження моделі з доступними доказами.',
    },
  ],
};
