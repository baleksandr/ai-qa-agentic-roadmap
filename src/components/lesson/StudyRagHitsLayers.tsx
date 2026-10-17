import type { RagHitsLayerRow, RagHitsLayerView, RagHitsLayerKey } from '../../data/study/rag-hits-layers';
import { StudyConceptCard } from './StudyConceptCard';

const LAYER_META: Record<
  RagHitsLayerKey,
  { title: string; kind: string; hint: string; step: string }
> = {
  candidates: {
    title: 'Candidates',
    kind: 'Similarity · до ACL',
    hint: 'Що повернув механізм similarity (до повного ACL).',
    step: '1',
  },
  authorized: {
    title: 'Authorized hits',
    kind: 'Metadata + tenant/ACL',
    hint: 'Після metadata-фільтрів і tenant/ACL — лише дозволені фрагменти.',
    step: '2',
  },
  selected: {
    title: 'Selected evidence',
    kind: 'Rerank → messages[]',
    hint: 'Після відбору/rerank — те, що реально піде в LLM.',
    step: '3',
  },
};

const LAYER_ORDER: RagHitsLayerKey[] = ['candidates', 'authorized', 'selected'];

function HitCard({ row, layer }: { row: RagHitsLayerRow; layer: RagHitsLayerKey }) {
  const rejected = row.chunkId === 'chk-tenant-b-z';
  return (
    <article
      className={`study-rag-hit-card layer-${layer}${rejected ? ' is-acl-rejected' : ''}`}
    >
      <div className="study-rag-hit-card-head">
        <code className="study-rag-hit-chunk">{row.chunkId}</code>
        <span className="study-rag-hit-source">{row.sourceId}</span>
      </div>
      <div className="study-rag-hit-scores">
        {row.retrievalScore != null ? (
          <span className="study-rag-hit-score score-retrieval">retrieval {row.retrievalScore.toFixed(2)}</span>
        ) : null}
        {row.rerankScore != null ? (
          <span className="study-rag-hit-score score-rerank">rerank {row.rerankScore.toFixed(2)}</span>
        ) : null}
      </div>
      {row.excerptUk ? <p className="study-rag-hit-excerpt">«{row.excerptUk}»</p> : null}
      {row.noteUk && !row.excerptUk ? <p className="study-rag-hit-note">{row.noteUk}</p> : null}
      {row.noteUk && row.excerptUk && layer === 'selected' ? (
        <p className="study-rag-hit-note muted small">{row.noteUk}</p>
      ) : null}
    </article>
  );
}

type Props = {
  view: RagHitsLayerView;
  highlightStep: number;
};

export function StudyRagHitsLayers({ view, highlightStep }: Props) {
  const showSelected = highlightStep >= 3;

  return (
    <section
      className="study-rag-hits-panel study-concept-card study-concept-card-wide"
      aria-label="Панель Hits — candidates, authorized hits, selected evidence"
    >
      <header className="study-concept-card-head">
        <span className="study-concept-card-step">H</span>
        <div className="study-concept-card-titles">
          <span className="study-concept-card-kind">Trace · умовні навчальні дані</span>
          <h4 className="study-concept-card-title">Панель Hits</h4>
        </div>
      </header>

      <div className="study-concept-card-body study-rag-hits-body">
        <div className="study-rag-hits-trace-card">
          <span className="study-prompt-block-badge">У trace запиту</span>
          <ul className="study-rag-filter-chips study-rag-hits-trace-chips">
            {view.traceFilters.map((f) => (
              <li key={f.key}>
                <code>{f.key}</code>
                <span className="study-rag-filter-eq">=</span>
                <span>{f.value}</span>
              </li>
            ))}
          </ul>
          <p className="muted small study-rag-hits-demo-note">{view.demoRetrieverNoteUk}</p>
        </div>

        <div className="study-rag-hits-columns">
          {LAYER_ORDER.map((key) => {
            const meta = LAYER_META[key];
            const rows = view.layers[key];
            const pendingSelected = key === 'selected' && !showSelected;

            return (
              <StudyConceptCard
                key={key}
                step={meta.step}
                kind={meta.kind}
                title={meta.title}
                className={`study-rag-hits-layer-card layer-${key}`}
              >
                <p className="study-rag-hits-layer-hint muted small">{meta.hint}</p>
                {pendingSelected ? (
                  <p className="study-rag-hits-pending muted small">
                    Оберіть <strong>крок 3</strong> run (відбір/rerank), щоб побачити selected evidence.
                  </p>
                ) : (
                  <div className="study-rag-hits-hit-stack">
                    {rows.map((row) => (
                      <HitCard key={`${key}-${row.chunkId}`} row={row} layer={key} />
                    ))}
                  </div>
                )}
              </StudyConceptCard>
            );
          })}
        </div>

        <aside className="study-rag-hits-acl-callout">
          <span className="study-rag-hits-acl-label">QA</span>
          <p className="study-rag-hits-acl-text">{view.rejectedAclUk}</p>
        </aside>
      </div>
    </section>
  );
}
