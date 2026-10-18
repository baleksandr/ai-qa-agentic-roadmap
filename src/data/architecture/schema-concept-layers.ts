import type { ArchitectureSchema } from '../../types/architecture-simulation';

export const CONCEPT_LAYERS_SCHEMA: ArchitectureSchema = {
  id: 'concept-layers',
  tabLabel: 'LLM · RAG · Agent · System',
  title: 'LLM · RAG · Agent · Agentic system',
  subtitle: 'Чотири поняття однієї системи — не один обов’язковий ланцюг',
  disclaimer: '',
  svgLabel: 'Карта понять LLM, RAG, Agent і Agentic system',
  diagramLayout: 'concept-layers',
  conceptLayers: {
    headerNoteUk:
      'Не чотири кроки одного run. LLM можна викликати без RAG і без agent loop — оберіть картку для пояснення.',
    standaloneNoteUk: '',
    tabFootnoteUk: 'Покрокові схеми run — на інших вкладках атласу.',
    nodes: [
      {
        id: 'llm',
        label: 'LLM',
        cardLineUk: 'Обробляє переданий context і формує відповідь або пропозицію дії.',
        topicId: 'concept-14',
      },
      {
        id: 'rag',
        label: 'RAG',
        cardLineUk: 'Код може знайти фрагменти документів і додати їх до context перед викликом моделі.',
        topicId: 'concept-03',
        relationHintUk: 'Може додати знайдені дані до context LLM (не обов’язково в кожному run).',
      },
      {
        id: 'agent',
        label: 'Agent',
        cardLineUk: 'Керований цикл: модель пропонує, код перевіряє й виконує дозволені інструменти.',
        topicId: 'concept-04',
        relationHintUk: 'Використовує модель і може викликати інструменти.',
      },
      {
        id: 'agentic-system',
        label: 'Agentic system',
        cardLineUk: 'Права, стан, ліміти й оцінювання run навколо агентного процесу.',
        topicId: 'concept-20',
        relationHintUk: 'Додає контроль виконання, права, стан і оцінювання.',
      },
    ],
  },
  viewW: 640,
  viewH: 400,
  nodes: [],
  edges: [],
  steps: [],
};
