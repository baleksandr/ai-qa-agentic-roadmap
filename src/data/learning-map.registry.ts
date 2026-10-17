/**
 * Навчальна карта для UI: етапи українською, **назва на картці** — `shortTitle` з topics.registry (EN).
 * topicId лишаються незмінними — уроки й прогрес прив’язані до них.
 */
import { TOPIC_BY_ID } from './topics.registry';
export type LearningMapNode = {
  topicId: string;
  label: string;
  hint?: string;
};

export type LearningMapStage = {
  id: string;
  title: string;
  subtitle?: string;
  nodes: LearningMapNode[];
  edges: Array<{ from: string; to: string }>;
};

export const LEARNING_MAP_STAGES: LearningMapStage[] = [
  {
    id: 'foundations',
    title: '1. Основи AI та LLM',
    subtitle: 'Модель, токени, контекст, генерація',
    nodes: [
      {
        topicId: 'fundamentals',
        label: 'Основи AI та LLM',
        hint: 'З чого почати: що таке модель, токени й контекстне вікно',
      },
    ],
    edges: [],
  },
  {
    id: 'agent-action',
    title: '2. Як агент діє',
    subtitle: 'Промпт, інструменти, оболонка агента, цикл рішень',
    nodes: [
      {
        topicId: 'concept-14',
        label: 'Промпт і інструкції',
        hint: 'Як сформулювати задачу для моделі',
      },
      {
        topicId: 'concept-10',
        label: 'Виклик інструментів',
        hint: 'Від рішення LLM до коду, що читає report чи trace',
      },
      {
        topicId: 'concept-04',
        label: 'Оболонка агента',
        hint: 'Запуск, контекст, результати інструментів і цикл виконання',
      },
      {
        topicId: 'concept-12',
        label: 'Міркування моделі',
        hint: 'Складніші рішення та вибір наступного кроку',
      },
    ],
    edges: [
      { from: 'concept-14', to: 'concept-10' },
      { from: 'concept-10', to: 'concept-04' },
      { from: 'concept-04', to: 'concept-12' },
    ],
  },
  {
    id: 'knowledge',
    title: '3. Знання та контекст',
    subtitle: 'Пам’ять, RAG, вектори, MCP, донавчання',
    nodes: [
      {
        topicId: 'concept-01',
        label: 'Пам’ять і стан',
        hint: 'Що агент пам’ятає між кроками й запусками',
      },
      {
        topicId: 'concept-03',
        label: 'Доповнення з документами (RAG)',
        hint: 'Діставання знань з документів у контекст моделі',
      },
      {
        topicId: 'concept-15',
        label: 'Векторний пошук',
        hint: 'Embeddings і пошук релевантних фрагментів',
      },
      {
        topicId: 'concept-06',
        label: 'Протокол MCP',
        hint: 'Підключення інструментів і даних за стандартом',
      },
      {
        topicId: 'concept-13',
        label: 'Донавчання моделі',
        hint: 'Коли змінюють саму модель, а не лише контекст',
      },
      {
        topicId: 'concept-07',
        label: 'Навички агента',
        hint: 'Повторно використовувані пакети інструкцій і дій',
      },
    ],
    edges: [
      { from: 'concept-01', to: 'concept-03' },
      { from: 'concept-03', to: 'concept-15' },
      { from: 'concept-15', to: 'concept-06' },
      { from: 'concept-06', to: 'concept-13' },
      { from: 'concept-13', to: 'concept-07' },
    ],
  },
  {
    id: 'complex-tasks',
    title: '4. Складні задачі',
    subtitle: 'Планування, оркестрація, workflows, кілька агентів',
    nodes: [
      {
        topicId: 'concept-11',
        label: 'Планування',
        hint: 'Розклад цілі на кроки та залежності',
      },
      {
        topicId: 'concept-02',
        label: 'Оркестрація',
        hint: 'Хто виконує крок, retries, approvals',
      },
      {
        topicId: 'concept-16',
        label: 'Агентні робочі процеси',
        hint: 'Графи та сценарії з кількох кроків',
      },
      {
        topicId: 'concept-09',
        label: 'Кілька агентів',
        hint: 'Розподіл ролей між агентами',
      },
      {
        topicId: 'concept-08',
        label: 'Протокол A2A між агентами',
        hint: 'Делегування між агентами',
      },
    ],
    edges: [
      { from: 'concept-11', to: 'concept-02' },
      { from: 'concept-02', to: 'concept-16' },
      { from: 'concept-16', to: 'concept-09' },
      { from: 'concept-09', to: 'concept-08' },
    ],
  },
  {
    id: 'quality',
    title: '5. Контроль якості',
    subtitle: 'Обмеження, спостережуваність, оцінювання, бенчмарки',
    nodes: [
      {
        topicId: 'concept-17',
        label: 'Політики та захист',
        hint: 'Дозволені дії та межі безпеки агента',
      },
      {
        topicId: 'concept-18',
        label: 'Спостережуваність',
        hint: 'Трасування, логи та докази того, що сталося в run',
      },
      {
        topicId: 'concept-05',
        label: 'Оцінювання агента',
        hint: 'Повторювані вимірювання якості',
      },
      {
        topicId: 'concept-19',
        label: 'Бенчмарки',
        hint: 'Набори для порівняння версій і моделей',
      },
    ],
    edges: [
      { from: 'concept-17', to: 'concept-18' },
      { from: 'concept-18', to: 'concept-05' },
      { from: 'concept-05', to: 'concept-19' },
    ],
  },
  {
    id: 'practice',
    title: '6. Практика: QA Regression Investigation Agent',
    subtitle: 'Від ідеї до робочого агента крок за кроком',
    nodes: [
      { topicId: 'lab-0', label: 'Від LLM до агента', hint: 'Чому одного промпту недостатньо' },
      { topicId: 'lab-1', label: 'Мета й межі', hint: 'Purpose і scope проєкту' },
      { topicId: 'lab-2', label: 'Системний промпт', hint: 'Інструкція для моделі' },
      { topicId: 'lab-3', label: 'Підключаємо модель', hint: 'Перший виклик LLM API' },
      { topicId: 'lab-4', label: 'Додаємо інструменти', hint: 'Виклики інструментів і MCP у коді' },
      { topicId: 'lab-5', label: 'Пам’ять у практиці', hint: 'Пам’ять і стан у коді агента' },
      { topicId: 'lab-6', label: 'Цикл агента', hint: 'Оркестрація та цикл виконання' },
      { topicId: 'lab-7', label: 'Запуск з термінала', hint: 'Командний рядок для розслідування' },
      { topicId: 'lab-8', label: 'Тестуємо агента', hint: 'Автотести та оцінювання' },
      { topicId: 'lab-9', label: 'Надійність і підтримка', hint: 'Агент готовий до експлуатації' },
    ],
    edges: Array.from({ length: 9 }, (_, i) => ({
      from: `lab-${i}`,
      to: `lab-${i + 1}`,
    })),
  },
  {
    id: 'production',
    title: '7. Робота в production',
    subtitle: 'Надійність, безпека, вартість, підтримка',
    nodes: [
      {
        topicId: 'concept-20',
        label: 'Агенти в production',
        hint: 'Експлуатація після лабораторії',
      },
    ],
    edges: [],
  },
  {
    id: 'reference',
    title: '8. Довідкові матеріали',
    subtitle: 'Швидкий доступ до довідника курсу',
    nodes: [
      {
        topicId: 'reference-library',
        label: 'Довідник курсу',
        hint: 'Довідник курсу — не обов’язковий маршрут',
      },
      {
        topicId: 'qa-interview',
        label: 'Питання для QA-співбесіди',
        hint: 'Питання й відповіді для інтерв’ю за темами — не входить у лічильник Fundamentals',
      },
    ],
    edges: [],
  },
];

const labelByTopicId: Record<string, string> = {};
const hintByTopicId: Record<string, string> = {};

for (const stage of LEARNING_MAP_STAGES) {
  for (const node of stage.nodes) {
    labelByTopicId[node.topicId] = node.label;
    if (node.hint) hintByTopicId[node.topicId] = node.hint;
  }
}

export function getMapLabel(topicId: string): string {
  const topic = TOPIC_BY_ID[topicId];
  if (topic?.shortTitle) return topic.shortTitle;
  return labelByTopicId[topicId] ?? topicId;
}

export function getMapHint(topicId: string): string | undefined {
  return hintByTopicId[topicId];
}

/** Усі topicId на карті (для прогресу та пошуку) */
export function getAllMapTopicIds(): string[] {
  return LEARNING_MAP_STAGES.flatMap((s) => s.nodes.map((n) => n.topicId));
}

/** Фільтр карти: ті самі topicId, інший спосіб перегляду (без дублікатів уроків). */
export type LearningMapViewFilter = 'all' | 'concepts' | 'practice';

export function filterLearningMapStages(filter: LearningMapViewFilter): LearningMapStage[] {
  if (filter === 'all') return LEARNING_MAP_STAGES;
  return LEARNING_MAP_STAGES
    .map((stage) => ({
      ...stage,
      nodes: stage.nodes.filter((n) => {
        if (filter === 'concepts') return n.topicId.startsWith('concept-');
        if (filter === 'practice') return n.topicId.startsWith('lab-');
        return true;
      }),
      edges: stage.edges.filter((e) => {
        const fromOk =
          filter === 'concepts'
            ? e.from.startsWith('concept-')
            : filter === 'practice'
              ? e.from.startsWith('lab-')
              : true;
        const toOk =
          filter === 'concepts'
            ? e.to.startsWith('concept-')
            : filter === 'practice'
              ? e.to.startsWith('lab-')
              : true;
        return fromOk && toOk;
      }),
    }))
    .filter((stage) => stage.nodes.length > 0);
}

/** Усі concept-* на карті (20 тем PART II). */
export function getConceptMapTopicIds(): string[] {
  return getAllMapTopicIds().filter((id) => id.startsWith('concept-'));
}

/** Міжетапний рекомендований перехід (для візуальної «доріжки») */
export const STAGE_BRIDGE: Array<{ fromTopicId: string; toTopicId: string }> = [
  { fromTopicId: 'fundamentals', toTopicId: 'concept-14' },
  { fromTopicId: 'concept-12', toTopicId: 'concept-01' },
  { fromTopicId: 'concept-07', toTopicId: 'concept-11' },
  { fromTopicId: 'concept-08', toTopicId: 'concept-17' },
  { fromTopicId: 'concept-19', toTopicId: 'lab-0' },
  { fromTopicId: 'lab-9', toTopicId: 'concept-20' },
];
