import {
  RAG_CHUNKS_PANEL,
  RAG_EMBED_PANEL,
  RAG_LOADER_PANEL,
  RAG_PARSE_PANEL,
  RAG_SEARCHABLE_STORE_PANEL,
} from './rag-pipeline-panel-content';

export type ChainStageDetail = {
  titleUk: string;
  bodyUk: string;
  qaUk: string;
  whoUk?: string;
  outputUk?: string;
  lessonUk?: string;
  bookRefUk?: string;
  terms?: Array<{ label: string; text: string }>;
  /** Короткий рядок на обличчі картки */
  cardTeaserUk?: string;
  cardBadgeUk?: string;
  cardActorUk?: string;
  visualKey?: string;
  /** Якщо задано — лише цей текст у боковій панелі (без шаблону «Хто виконує») */
  panelMarkdownUk?: string;
};

export function formatStudyTermsMarkdown(terms?: Array<{ label: string; text: string }>): string {
  if (!terms?.length) return '';
  const lines = ['', '**Терміни:**', ''];
  for (const t of terms) {
    lines.push(`- **${t.label}** — ${t.text}`);
  }
  return lines.join('\n\n');
}

type PanelMarkdownOptions = {
  /** У inline-панелі терміни рендеряться окремим блоком `StudyPanelTerms` */
  omitTerms?: boolean;
};

export function chainStageDetailToMarkdown(d: ChainStageDetail, options?: PanelMarkdownOptions): string {
  let body: string;
  if (d.panelMarkdownUk?.trim()) {
    body = d.panelMarkdownUk.trim();
  } else {
    const lines: string[] = [];
    if (d.whoUk) lines.push(`**Хто виконує.** ${d.whoUk}`);
    lines.push(`**Що відбувається.** ${d.bodyUk}`);
    if (d.outputUk) lines.push(`**Результат кроку.** ${d.outputUk}`);
    if (d.lessonUk) lines.push(`**З уроку.** ${d.lessonUk}`);
    lines.push(`**Для QA.** ${d.qaUk}`);
    body = lines.join('\n\n');
  }
  if (!options?.omitTerms) {
    body += formatStudyTermsMarkdown(d.terms);
  }
  return body;
}

const OFFLINE_PIPELINE: Record<string, ChainStageDetail> = {
  documents: {
    titleUk: 'Documents',
    visualKey: 'documents',
    cardBadgeUk: 'Document loader',
    cardActorUk: 'Код',
    cardTeaserUk: 'Дозволені джерела → сирий текст і metadata.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: RAG_LOADER_PANEL,
    terms: [
      { label: 'metadata', text: 'Дата, service, env, tenant — для фільтрів на запиті.' },
      { label: 'offline', text: 'Підготовка знань до будь-якого run investigation.' },
    ],
  },
  parse: {
    titleUk: 'Parse',
    visualKey: 'parse',
    cardBadgeUk: 'Parse',
    cardActorUk: 'Код',
    cardTeaserUk: 'PDF / HTML → текст для chunker.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: RAG_PARSE_PANEL,
    terms: [{ label: 'parse', text: 'Нормалізація формату файлу в текст перед chunking.' }],
  },
  chunks: {
    titleUk: 'Chunks',
    visualKey: 'chunks',
    cardBadgeUk: 'Chunker',
    cardActorUk: 'Код',
    cardTeaserUk: 'id + text + metadata у сховищі.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: RAG_CHUNKS_PANEL,
    terms: [
      { label: 'chunk_id', text: 'Ідентифікатор фрагмента в індексі, hits і trace.' },
      { label: 'source_id', text: 'Документ-джерело (напр. INC-442).' },
    ],
  },
  embed: {
    titleUk: '[embed / index]',
    visualKey: 'embed',
    cardBadgeUk: 'Embed · index',
    cardActorUk: 'Код + модель',
    cardTeaserUk: 'Vector або BM25/hybrid + версія індексу.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: RAG_EMBED_PANEL,
    terms: [
      { label: 'index-v12', text: 'Умовна версія індексу в сценарії курсу.' },
      { label: 'hybrid', text: 'Поєднання vector search і BM25 — варіант реалізації.' },
    ],
  },
  searchable: {
    titleUk: 'Searchable store',
    visualKey: 'store',
    cardBadgeUk: 'Vector store',
    cardActorUk: 'Інфра',
    cardTeaserUk: 'Готовий індекс для retriever.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: RAG_SEARCHABLE_STORE_PANEL,
    terms: [
      { label: 'query-time', text: 'Момент run: пошук виконує код, не generative LLM.' },
      { label: 'retriever', text: 'Наступний крок runtime — читає цей store.' },
    ],
  },
};

function normalizeOfflineStage(stageLabel: string): string {
  const s = stageLabel.toLowerCase();
  if (s.includes('document')) return 'documents';
  if (s.includes('parse')) return 'parse';
  if (s.includes('chunk')) return 'chunks';
  if (s.includes('embed') || (s.includes('index') && !s.includes('searchable'))) return 'embed';
  if (s.includes('searchable')) return 'searchable';
  return '';
}

/** Деталі для схеми «Offline (навчальний потік)» у §3 */
export function lookupOfflinePipelineStageDetail(stageLabel: string): ChainStageDetail | null {
  const key = normalizeOfflineStage(stageLabel);
  return key ? OFFLINE_PIPELINE[key] ?? null : null;
}

/** Підказки для кроків у «Узагальнений ланцюг даних» та інших ribbon */
export function lookupChainStageDetail(stageLabel: string, chainIndex: number): ChainStageDetail | null {
  const s = stageLabel.toLowerCase();

  if (chainIndex === 0) {
    const offline = lookupOfflinePipelineStageDetail(stageLabel);
    if (offline) return offline;
  }

  if ((s.includes('document') || s.includes('документ')) && chainIndex === 0) {
    return OFFLINE_PIPELINE.documents;
  }
  if (s.includes('parse')) {
    return OFFLINE_PIPELINE.parse;
  }
  if (s.includes('searchable')) {
    return OFFLINE_PIPELINE.searchable;
  }
  if (s.includes('chunk')) {
    return chainIndex === 0
      ? OFFLINE_PIPELINE.chunks
      : {
          titleUk: 'Chunks + metadata',
          visualKey: 'chunks',
          cardBadgeUk: 'У індексі',
          cardActorUk: 'Код',
          cardTeaserUk: 'id, text, metadata — те, що шукає retriever.',
          bodyUk: 'Текст ріжуть на фрагменти з id, service, env, датою — по цьому потім фільтрують.',
          qaUk: 'Поганий chunk = retrieval знаходить «щось», але не те речення.',
        };
  }
  if (s.includes('embed') || (s.includes('index') && !s.includes('searchable'))) {
    return chainIndex === 0
      ? OFFLINE_PIPELINE.embed
      : {
          titleUk: 'Index / vectors',
          visualKey: 'embed',
          cardBadgeUk: 'Index',
          cardActorUk: 'Код',
          cardTeaserUk: 'Runtime лише lookup — offline вже побудував store.',
          bodyUk: 'Offline: embeddings або BM25/hybrid. Runtime лише читає індекс, не будує його.',
          qaUk: 'Версія індексу в deploy має збігатися з тестовим golden set.',
        };
  }
  if (s.includes('запит') || s === 'query' || s.includes('user query')) {
    return {
      titleUk: 'Query',
      visualKey: 'query',
      cardBadgeUk: 'Harness',
      cardActorUk: 'Код',
      cardTeaserUk: 'Текст запиту + фільтри tenant/env — без LLM.',
      bodyUk: 'Harness формує текст + фільтри; LLM ще не викликано.',
      qaUk: 'Залогуйте exact query string у trace — для replay без LLM.',
    };
  }
  if (s.includes('retriever')) {
    return {
      titleUk: 'Retriever',
      visualKey: 'retrieve',
      cardBadgeUk: 'Retriever',
      cardActorUk: 'Код',
      cardTeaserUk: 'candidates → authorized hits після ACL/фільтрів.',
      bodyUk: 'Повертає authorized hits: chunk_id, text, retrieval score, source_id.',
      qaUk: 'Golden: очікуваний chunk_id у authorized/selected; score ≠ oracle.',
    };
  }
  if (s.includes('context builder') || s.includes('evidence')) {
    return {
      titleUk: 'Context builder',
      visualKey: 'context',
      cardBadgeUk: 'Context builder',
      cardActorUk: 'Код',
      cardTeaserUk: 'Evidence у messages[] в межах token budget.',
      bodyUk: 'Збирає evidence block у межах token budget для messages[].',
      qaUk: 'Перевірте, що confidential chunk не проскочив через фільтр.',
    };
  }
  if (s.includes('api') || s.includes('модел') || s.includes('відповідь') || s.includes('answer')) {
    return {
      titleUk: 'LLM call',
      visualKey: 'llm',
      cardBadgeUk: 'Generation',
      cardActorUk: 'LLM',
      cardTeaserUk: 'Відповідь з опорою на retrieved context.',
      bodyUk: 'Генерація з опорою на retrieved context; citations перевіряє harness.',
      qaUk: 'Citation ⊆ selected evidence у trace; groundedness B окремо від A.',
    };
  }
  if (s.includes('hits')) {
    return {
      titleUk: 'Hits',
      visualKey: 'hits',
      cardBadgeUk: 'Top-k',
      cardActorUk: 'Код',
      cardTeaserUk: 'Кандидати перед rerank / context builder.',
      bodyUk: 'Top-k кандидатів з індексу перед rerank/context builder.',
      qaUk: 'Порівняйте scores і chunk_id з очікуванням у golden test.',
    };
  }
  return {
    titleUk: stageLabel,
    cardBadgeUk: 'Крок',
    cardActorUk: 'Код',
    cardTeaserUk: 'Детермінований перехід даних у pipeline.',
    bodyUk: 'Крок у ланцюгу даних RAG — детермінований код передає структуровані дані далі по pipeline.',
    qaUk: 'Знайдіть цей крок у trace run і переконайтесь, що вхід/вихід збігаються з тестом.',
  };
}
