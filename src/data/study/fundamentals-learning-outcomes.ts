import type { StudyAfterInteractiveSummary } from './study-teaching-card-types';

export const FUNDAMENTALS_LEARNING_OUTCOMES: StudyAfterInteractiveSummary = {
  sectionTitleUk: '',
  cards: [
    {
      titleUk: 'Як модель формує відповідь',
      bodyUk:
        'Застосунок передає моделі запит. Модель працює з токенами доступного контексту й генерує відповідь токен за токеном. Це не означає, що кожне твердження в її відповіді правдиве.',
    },
    {
      titleUk: 'Чому контекст має межу',
      bodyUk:
        'Модель бачить лише те, що помістилося в переданий їй запит. Якщо Playwright-звіт login_spec не читали й не додали до запиту, модель не знає його вмісту.',
    },
    {
      titleUk: 'Що перевіряє QA',
      bodyUk:
        'QA перевіряє, які дані код передав моделі, чи відповідь має потрібний формат і чи конкретні твердження підтверджуються отриманими доказами.',
    },
  ],
};
