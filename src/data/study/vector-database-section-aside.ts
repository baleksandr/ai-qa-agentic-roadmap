import type { StudySectionAside } from './study-section-aside-types';

const BY_SECTION: Record<string, StudySectionAside> = {
  'Навіщо vector DB': {
    sectionNoteUk:
      'Векторний пошук допомагає знайти семантично близькі фрагменти. У RAG це поширений, але не єдиний спосіб retrieval.',
  },
  'Де в investigation': {
    sectionNoteUk:
      'Сім кроків: підготовка документів (1–4), потім пошук після падіння login_spec (5–7). Старий знайдений фрагмент не замінює звіт поточного run.',
  },
  Компоненти: {
    sectionNoteUk:
      'Організація даних, фільтри метаданих і опційний комбінований пошук. Qdrant і «колекція» — приклад назв, не вимога для login_spec.',
  },
  'Послідовність runtime': {
    sectionNoteUk:
      'Один пошук після CI: запит, кандидати, доступ, контекст моделі, відповідь. Порожня видача і помилка пошуку — різні статуси.',
  },
  'Код vs LLM': {
    sectionNoteUk:
      'Код, embeddings, пошуковий компонент і мовна модель. Пошук може бути сервісом або частиною сховища, не окрема «vector DB» за замовчуванням.',
  },
  Збої: {
    sectionNoteUk:
      'Застарілий індекс, недоречні кандидати, несумісні embeddings і витік чужого тексту. QA дивиться на запит моделі, а не лише на HTTP-відповідь пошуку.',
  },
  Production: {
    sectionNoteUk:
      'Оновлення документів, контрольний набір, витрати викликів і вибір способу пошуку. RAG ширший за векторний пошук.',
  },
  'Запам’ятати': {
    sectionNoteUk:
      'Три тези, п’ять питань з UA/EN відповідями та посилання на тему RAG у центральному блоці.',
  },
};

export function getVectorDatabaseSectionAside(navTitle: string): StudySectionAside {
  const hit = Object.entries(BY_SECTION).find(([key]) => navTitle.startsWith(key));
  if (hit) return hit[1];
  return { sectionNoteUk: 'Повний зміст розділу — у центральному блоці уроку.' };
}

export const VECTOR_DATABASE_ASIDE_META = {
  sectionCount: 8,
  tocHint: '',
  schemaTitle: 'Схема курсу',
  schemaBlurb: 'Ланцюг RAG з vector search на схемі:',
  atlasTo: '/agent-architecture?tab=rag',
  atlasLinkLabel: 'Відкрити схему RAG',
  compactAside: true,
} as const;
