import type { StudyLessonAsideMeta, StudySectionAside } from './study-section-aside-types';

const BY_SECTION: Record<string, StudySectionAside> = {
  'Навіщо A2A': {
    sectionNoteUk:
      'A2A допомагає передати задачу між QA- і dev-сервісами та отримати її стан або результат. Зміст TaskSpec і PatchProposal визначає наш навчальний приклад; протокол сам не доводить причину падіння й не схвалює зміну коду.',
  },
  'Як задача переходить': {
    sectionNoteUk:
      'Надіслати задачу, почати роботу, повернути пропозицію та підтвердити виправлення — різні події. У випадку ABC-123 результат A2A ще має пройти правила workflow, review і перевірки CI.',
  },
  'Де код, а де LLM': {
    sectionNoteUk:
      'У цьому прикладі моделі працюють усередині агентів. Між QA- і dev-сервісами звертається код: він передає повідомлення A2A, перевіряє доступ і повертає стан або результат задачі.',
  },
  'Де може зламатися': {
    sectionNoteUk:
      'Перед обробкою A2A-запиту код перевіряє відправника й доступ до конкретних даних. Після timeout він не припускає, що попередня спроба не виконалася. mTLS або підписи можуть входити до захисту окремого продукту, але не підміняють цих перевірок.',
  },
  Збої: {
    sectionNoteUk:
      'Перед обробкою A2A-запиту код перевіряє відправника й доступ до конкретних даних. Після timeout він не припускає, що попередня спроба не виконалася. mTLS або підписи можуть входити до захисту окремого продукту, але не підміняють цих перевірок.',
  },
};

export function getA2aSectionAside(navTitle: string): StudySectionAside {
  const hit = Object.entries(BY_SECTION).find(([key]) => navTitle.startsWith(key));
  if (hit) return hit[1];
  return { suppressSectionContext: true };
}

export const A2A_ASIDE_META: StudyLessonAsideMeta = {
  sectionCount: 8,
  tocHint: '',
  schemaTitle: '',
  schemaBlurb: '',
  atlasTo: '',
  atlasLinkLabel: '',
};
