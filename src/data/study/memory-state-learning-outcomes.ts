import type { StudyAfterInteractiveSummary } from './study-teaching-card-types';

export const MEMORY_STATE_LEARNING_OUTCOMES: StudyAfterInteractiveSummary = {
  sectionTitleUk: '',
  cards: [
    {
      titleUk: 'State — що відбувається зараз',
      bodyUk:
        'Код зберігає кроки й результати одного розслідування login_spec. Якщо застосунок має продовжити run після перерви, ці дані потрібно зберегти так, щоб їх можна було відновити.',
    },
    {
      titleUk: 'Memory — що залишилося з минулого',
      bodyUk:
        'Застосунок може зберігати корисні відомості з попередніх запусків. Вони допомагають обрати перевірку, але не доводять причину нового падіння.',
    },
    {
      titleUk: 'Context builder — що побачить модель',
      bodyUk:
        'Код вибирає потрібні дані зі стану поточного run і, за потреби, зі збереженої пам’яті. Саме вибране він передає моделі в наступному запиті.',
    },
  ],
};
