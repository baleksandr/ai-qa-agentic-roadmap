export type RagPipelineComponent = {
  index: number;
  title: string;
  titleUk: string;
  summaryUk: string;
  qaUk: string;
};

/** Короткі підписи на картках списку §3 — деталі в боковій панелі (clarity panels). */
export const RAG_PIPELINE_COMPONENTS: RagPipelineComponent[] = [
  {
    index: 1,
    title: 'Document loader',
    titleUk: 'Завантаження документів',
    summaryUk:
      'Код читає дозволені джерела (export wiki, PDF postmortem) і передає сирий текст + metadata (tenant, env, сервіс) далі — ще без chunk_id.',
    qaUk: 'Переконайтеся, що .env, токени й закриті space не потрапляють у корпус для індексації.',
  },
  {
    index: 2,
    title: 'Chunker',
    titleUk: 'Розбиття на фрагменти',
    summaryUk:
      'Код ділить текст на chunks: chunk_id, поле text, metadata. У навчальному прикладі chk-442-a містить речення про #login-btn.',
    qaUk: 'Golden offline: text chunk збігається з postmortem; селектор не розірваний між двома chunks.',
  },
  {
    index: 3,
    title: 'Embedding model',
    titleUk: 'Embedding-модель',
    summaryUk:
      'Окрема модель (не chat LLM) перетворює text chunk на vector для similarity search — або готує текст для BM25-only індексу.',
    qaUk: 'Після зміни embedding model — rebuild індексу й прогін golden queries.',
  },
  {
    index: 4,
    title: 'Index',
    titleUk: 'Індекс / vector store',
    summaryUk:
      'Сховище пошуку RAG (навчально index-v12): vectors, text і metadata. Runtime лише читає store, не будує його на кожен run.',
    qaUk: 'Версія індексу в deploy збігається з очікуваною на staging.',
  },
  {
    index: 5,
    title: 'Retriever',
    titleUk: 'Пошук (retriever)',
    summaryUk:
      'Код за query повертає top-k hits (chunk_id, text, score, source_id) — без виклику generative LLM.',
    qaUk: 'Recall@k на фіксованих запитах; replay query string з trace.',
  },
  {
    index: 6,
    title: 'Metadata filters',
    titleUk: 'Фільтри метаданих',
    summaryUk:
      'Код обмежує пошук tenant/env/service — щоб chunk іншого клієнта не став «дозволеним hit».',
    qaUk: 'Негативний тест: tenant A не бачить chunks tenant B.',
  },
  {
    index: 7,
    title: 'Reranker',
    titleUk: 'Rerank (опційно)',
    summaryUk:
      'Harness може переставити hits перед prompt; оцінку часто робить rerank-модель. У прикладі до LLM лишають лише INC-442.',
    qaUk: 'Golden по chunk_id після rerank, не по точному score.',
  },
  {
    index: 8,
    title: 'Context builder',
    titleUk: 'Збір контексту',
    summaryUk:
      'Код збирає messages[]: system, Retrieved context (зовнішній документ), user turn з CI — перед API LLM.',
    qaUk: 'Кожен citation у відповіді → chunk з selected evidence у trace.',
  },
  {
    index: 9,
    title: 'Generation LLM',
    titleUk: 'Generative LLM',
    summaryUk:
      'Модель формулює гіпотезу з опорою на переданий context; не шукає в wiki і не підтверджує root cause сама.',
    qaUk: 'Три перевірки: citation, зміст chunk, oracle DOM/trace; висновок QA — не лише «так/ні».',
  },
];
