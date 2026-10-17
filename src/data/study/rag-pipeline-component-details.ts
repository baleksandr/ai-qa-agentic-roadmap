import type { ChainStageDetail } from './rag-chain-stage-details';
import {
  RAG_CHUNKS_PANEL,
  RAG_CONTEXT_PANEL,
  RAG_EMBED_PANEL,
  RAG_FILTERS_PANEL,
  RAG_INDEX_PANEL,
  RAG_LLM_PANEL,
  RAG_LOADER_PANEL,
  RAG_RETRIEVER_PANEL,
  RAG_RERANK_PANEL,
} from './rag-pipeline-panel-content';
import { RAG_INC442 } from './rag-teaching-thread';

const INC = RAG_INC442;

const DETAILS: Record<number, ChainStageDetail> = {
  1: {
    titleUk: 'Завантаження документів',
    visualKey: 'documents',
    cardBadgeUk: 'Document loader',
    cardActorUk: 'Код',
    cardTeaserUk: 'Читає дозволені джерела → сирий текст і metadata.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: RAG_LOADER_PANEL,
    terms: [
      {
        label: 'document loader',
        text: 'Код, який читає файли/API і передає текст у pipeline (не LLM).',
      },
      {
        label: 'metadata',
        text: 'Поля про документ (tenant, env, дата) для фільтрів на пошуку.',
      },
      { label: 'ACL', text: 'Хто може бачити документ при індексації й при retrieval.' },
    ],
  },
  2: {
    titleUk: 'Розбиття на фрагменти',
    visualKey: 'chunks',
    cardBadgeUk: 'Chunker',
    cardActorUk: 'Код',
    cardTeaserUk: `Фрагменти з id — напр. ${INC.chunkId}.`,
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: RAG_CHUNKS_PANEL,
    terms: [
      { label: 'chunk', text: 'Запис text + chunk_id + metadata в індексі.' },
      { label: 'chunker', text: 'Код offline, який ділить текст після Parse.' },
      { label: 'overlap', text: 'Перекриття сусідніх фрагментів — політика реалізації.' },
    ],
  },
  3: {
    titleUk: 'Embedding-модель',
    visualKey: 'embed',
    cardBadgeUk: 'Embedding model',
    cardActorUk: 'Код + модель',
    cardTeaserUk: 'Текст chunk → vector для similarity.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: RAG_EMBED_PANEL,
    terms: [
      { label: 'embedding', text: 'Векторне представлення тексту; не generative chat.' },
      { label: 'rebuild', text: 'Повна перебудова індексу після зміни embedding model.' },
    ],
  },
  4: {
    titleUk: 'Індекс / vector store',
    visualKey: 'store',
    cardBadgeUk: 'Index',
    cardActorUk: 'Інфра',
    cardTeaserUk: `Пам’ять пошуку RAG (навчально ${INC.indexVersion}).`,
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: RAG_INDEX_PANEL,
    terms: [
      { label: 'vector store', text: 'Сховище vectors + text chunks; не пам’ять LLM.' },
      { label: 'index-v12', text: 'Умовна версія індексу в сценарії курсу.' },
    ],
  },
  5: {
    titleUk: 'Пошук (retriever)',
    visualKey: 'retrieve',
    cardBadgeUk: 'Retriever',
    cardActorUk: 'Код',
    cardTeaserUk: 'top-k за query — без LLM.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: RAG_RETRIEVER_PANEL,
    terms: [
      { label: 'recall@k', text: 'Чи потрібний chunk у перших k результатах (golden без LLM).' },
      { label: 'top-k', text: 'Скільки кандидатів повертає пошук на один запит.' },
    ],
  },
  6: {
    titleUk: 'Фільтри метаданих',
    visualKey: 'filter',
    cardBadgeUk: 'Metadata filters',
    cardActorUk: 'Код',
    cardTeaserUk: 'tenant, env, service — scope пошуку.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: RAG_FILTERS_PANEL,
    terms: [
      { label: 'tenant', text: 'Межа ізоляції даних між клієнтами/орг.' },
      { label: 'metadata filter', text: 'Обмеження по полях chunk, не зміна тексту query.' },
    ],
  },
  7: {
    titleUk: 'Rerank (опційно)',
    visualKey: 'hits',
    cardBadgeUk: 'Reranker',
    cardActorUk: 'Код + модель',
    cardTeaserUk: 'Перестановка hits перед prompt.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: RAG_RERANK_PANEL,
    terms: [
      { label: 'rerank', text: 'Опційне покращення порядку hits; можна вимкнути.' },
      { label: 'token budget', text: 'Ліміт розміру evidence у messages[].' },
    ],
  },
  8: {
    titleUk: 'Збір контексту',
    visualKey: 'context',
    cardBadgeUk: 'Context builder',
    cardActorUk: 'Код',
    cardTeaserUk: 'Retrieved context + user у messages[].',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: RAG_CONTEXT_PANEL,
    terms: [
      { label: 'source_id', text: `Ідентифікатор документа (навчально ${INC.sourceId}).` },
      { label: 'messages[]', text: 'Пакет повідомлень для API: system, context, user.' },
    ],
  },
  9: {
    titleUk: 'Generative LLM',
    visualKey: 'llm',
    cardBadgeUk: 'Generation LLM',
    cardActorUk: 'LLM',
    cardTeaserUk: 'Гіпотеза мовою — не пошук у wiki.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: RAG_LLM_PANEL,
    terms: [
      { label: 'groundedness', text: 'Чи підтверджує текст chunk тезу відповіді (окремо від citation).' },
      { label: 'citation', text: 'Посилання на source_id у відповіді моделі.' },
    ],
  },
};

export function lookupRagPipelineComponentDetail(index: number): ChainStageDetail | null {
  return DETAILS[index] ?? null;
}
