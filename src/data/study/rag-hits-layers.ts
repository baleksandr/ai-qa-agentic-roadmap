import type { RagInvestigationScenario } from '../../lib/ragInvestigationScenario';

export type RagHitsLayerKey = 'candidates' | 'authorized' | 'selected';

export type RagHitsLayerRow = {
  chunkId: string;
  sourceId: string;
  retrievalScore?: number;
  rerankScore?: number;
  excerptUk?: string;
  noteUk?: string;
};

export type RagHitsFilterChip = { key: string; value: string };

export type RagHitsLayerView = {
  layers: Record<RagHitsLayerKey, RagHitsLayerRow[]>;
  traceFilters: RagHitsFilterChip[];
  demoRetrieverNoteUk: string;
  /** Умовний chunk іншого tenant — лише в candidates, не в authorized */
  rejectedAclUk: string;
};

/** Навчальні дані для панелі Hits (не демо-retriever у коді). */
export function buildRagHitsLayerView(
  scenario: RagInvestigationScenario,
  activeStep: number,
): RagHitsLayerView {
  const authorized = scenario.chunks.map((c) => ({
    chunkId: c.id,
    sourceId: c.sourceId,
    retrievalScore: c.score,
    excerptUk: c.excerpt,
  }));

  const candidates: RagHitsLayerRow[] = [
    ...authorized.map((h) => ({ ...h, noteUk: 'tenant=acme · пройшов similarity' })),
    {
      chunkId: 'chk-tenant-b-z',
      sourceId: 'INC-991',
      retrievalScore: 0.79,
      noteUk: 'tenant=other-corp · similarity високий, але ACL відсікає до authorized hits',
      excerptUk: undefined,
    },
  ];

  const rerankScores = [0.92, 0.41];
  const selected: RagHitsLayerRow[] =
    activeStep >= 3
      ? authorized.map((h, i) => ({
          ...h,
          rerankScore: rerankScores[i] ?? 0.5,
          noteUk:
            i === 0
              ? 'У prompt після rerank / token budget'
              : 'Може бути обрізано top-k — перевірка A дивиться на selected, не на всі hits',
        }))
      : [];

  return {
    layers: { candidates, authorized, selected },
    traceFilters: scenario.filters.map((f) => ({ key: f.key, value: f.value })),
    demoRetrieverNoteUk:
      'Демо-retriever у цьому репозиторії може не застосувати incident_date_gte — показано як вимога в trace, не як факт пошуку.',
    rejectedAclUk:
      'Негативний QA: chk-tenant-b-z (INC-991) лишається поза authorized hits і selected evidence для tenant acme.',
  };
}
