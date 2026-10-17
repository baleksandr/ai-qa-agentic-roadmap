import type { ChainStageDetail } from './rag-chain-stage-details';
import {
  RAG_CHUNKS_PANEL,
  RAG_CONTEXT_PANEL,
  RAG_EMBED_PANEL,
  RAG_HITS_PANEL,
  RAG_LOADER_PANEL,
  RAG_LLM_PANEL,
  RAG_QUERY_PANEL,
  RAG_RETRIEVER_PANEL,
} from './rag-pipeline-panel-content';
import { clarityProcessPanel } from '../../lib/studyClarityPanel';

const EVIDENCE_MESSAGES_PANEL = clarityProcessPanel({
  problem: 'API моделі приймає масив повідомлень, а не окремі файли з диска.',
  simpleIdea:
    '**messages[]** — пакет ролей: system (правила агента), Retrieved context (зовнішній документ), user (симптом з CI).',
  input: 'Зібраний evidence block + опис падіння login_spec.',
  who: 'Harness (код) перед HTTP-викликом.',
  action: 'Складає ролі в один запит до API; Retrieved context не стає system policy.',
  output: 'Готовий JSON messages для generative endpoint.',
  nextRecipient: 'Generative LLM (inference).',
  why: 'У trace видно exact текст, який бачила модель — основа перевірок groundedness.',
  teachingExample: 'Retrieved context містить INC-442 про #login-btn; user turn — login_spec staging, trace ci-8842.',
  risks: 'Зайвий chunk у Retrieved context; обрізання через token budget.',
  qa: 'Текст у Retrieved context ⊆ selected evidence у trace.',
});

const ANSWER_OUTPUT_PANEL = clarityProcessPanel({
  problem: 'Команда хоче швидку причину падіння — модель може звучати впевнено без доказів.',
  simpleIdea:
    'Відповідь LLM — **гіпотеза**, поки harness і QA не пройшли три перевірки: citation, зміст chunk, oracle DOM/trace/logs.',
  input: 'messages[] після retrieval augment.',
  who: 'Generative LLM генерує; harness і QA валідують.',
  action: 'Формулює текст із посиланням на source_id (навчально INC-442).',
  output: 'Текст відповіді + citations у trace.',
  nextRecipient: 'QA / наступні tool steps investigation agent.',
  why: 'Технічно правильний citation не доводить root cause сьогоднішнього падіння.',
  teachingExample: 'Висновок QA може бути: підтверджено, спростовано або доказів недостатньо.',
  risks: 'Хибна теза з «правильним» INC-442; плутанина двох схожих chunks.',
  qa: 'A citation ⊆ selected; B теза в тексті chunk; C поточний DOM/trace — окремо.',
});

const OFFLINE_INDEX: ChainStageDetail[] = [
  {
    titleUk: 'Документ',
    visualKey: 'documents',
    cardBadgeUk: 'Offline',
    cardActorUk: 'Код',
    cardTeaserUk: 'Сирий корпус до chunking.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: RAG_LOADER_PANEL,
    terms: [
      { label: 'offline', text: 'Підготовка знань — окремо від runtime запиту.' },
      { label: 'metadata', text: 'Поля для фільтрів на пошуку.' },
    ],
  },
  {
    titleUk: 'Chunks + metadata',
    visualKey: 'chunks',
    cardBadgeUk: 'Chunker',
    cardActorUk: 'Код',
    cardTeaserUk: 'chunks[{ id, text, metadata }].',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: RAG_CHUNKS_PANEL,
    terms: [
      { label: 'chunk_id', text: 'Ідентифікатор у індексі, hits і trace.' },
      { label: 'metadata', text: 'tenant, env, service для фільтрів.' },
    ],
  },
  {
    titleUk: 'Vectors у index',
    visualKey: 'embed',
    cardBadgeUk: 'Index (опційно)',
    cardActorUk: 'Код + модель',
    cardTeaserUk: 'Vectors або BM25 — готовий store.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: RAG_EMBED_PANEL,
    terms: [
      { label: 'hybrid', text: 'Vector + BM25 — можливий варіант індексу.' },
      { label: 'embedding', text: 'Офлайн-вектор для similarity.' },
    ],
  },
];

const RUNTIME_RETRIEVAL: ChainStageDetail[] = [
  {
    titleUk: 'Запит',
    visualKey: 'query',
    cardBadgeUk: 'Harness',
    cardActorUk: 'Код',
    cardTeaserUk: 'Query + фільтри без LLM.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: RAG_QUERY_PANEL,
    terms: [
      { label: 'login_spec', text: 'Умовний автотест у сценарії курсу.' },
      { label: 'tenant', text: 'Обов’язковий scope для ізольованого сховища.' },
    ],
  },
  {
    titleUk: 'Retriever',
    visualKey: 'retrieve',
    cardBadgeUk: 'Retriever',
    cardActorUk: 'Код',
    cardTeaserUk: 'Пошук у готовому індексі.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: RAG_RETRIEVER_PANEL,
    terms: [
      { label: 'recall@k', text: 'Golden: потрібний chunk у перших k.' },
      { label: 'top-k', text: 'Скільки кандидатів повертає пошук.' },
    ],
  },
  {
    titleUk: 'Hits — що повернув пошук',
    visualKey: 'hits',
    cardBadgeUk: 'hits[]',
    cardActorUk: 'Дані',
    cardTeaserUk: 'Candidates → authorized → selected.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: RAG_HITS_PANEL,
    terms: [
      { label: 'score', text: 'Ранжування для trace; не oracle правди.' },
      { label: 'selected evidence', text: 'Лише це потрапляє в prompt.' },
    ],
  },
];

const RUNTIME_GENERATION: ChainStageDetail[] = [
  {
    titleUk: 'Context builder',
    visualKey: 'context',
    cardBadgeUk: 'Harness',
    cardActorUk: 'Код',
    cardTeaserUk: 'Evidence під token budget.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: RAG_CONTEXT_PANEL,
    terms: [
      { label: 'evidence', text: 'Текст selected chunks для augment.' },
      { label: 'token budget', text: 'Ліміт розміру context у messages[].' },
    ],
  },
  {
    titleUk: 'Evidence + user message',
    visualKey: 'context',
    cardBadgeUk: 'messages[]',
    cardActorUk: 'Код',
    cardTeaserUk: 'System + Retrieved + User.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: EVIDENCE_MESSAGES_PANEL,
    terms: [
      { label: 'Retrieved context', text: 'Зовнішній документ — не system policy.' },
      { label: 'messages[]', text: 'Формат harness перед API.' },
    ],
  },
  {
    titleUk: 'API моделі',
    visualKey: 'llm',
    cardBadgeUk: 'Inference',
    cardActorUk: 'LLM',
    cardTeaserUk: 'Ймовірнісна генерація.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: RAG_LLM_PANEL,
    terms: [
      { label: 'generation_latency', text: 'Час після retrieval — окрема метрика.' },
      { label: 'LLM', text: 'Не виконує пошук у wiki сама.' },
    ],
  },
  {
    titleUk: 'Відповідь',
    visualKey: 'llm',
    cardBadgeUk: 'Output',
    cardActorUk: 'LLM + harness',
    cardTeaserUk: 'Гіпотеза + перевірки QA.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: ANSWER_OUTPUT_PANEL,
    terms: [
      { label: 'citation', text: 'Посилання на source у відповіді.' },
      { label: 'groundedness', text: 'Зв’язок тези з текстом chunk.' },
    ],
  },
];

const BY_CHAIN: ChainStageDetail[][] = [OFFLINE_INDEX, RUNTIME_RETRIEVAL, RUNTIME_GENERATION];

export function lookupDataChainStageDetail(chainIndex: number, stageIndex: number): ChainStageDetail | null {
  return BY_CHAIN[chainIndex]?.[stageIndex] ?? null;
}
