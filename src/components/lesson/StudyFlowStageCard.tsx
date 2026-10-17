import type { ChainStageDetail } from '../../data/study/rag-chain-stage-details';

type Props = {
  stageLabel: string;
  index: number;
  total: number;
  detail: ChainStageDetail | null;
  clickable: boolean;
  active?: boolean;
  onOpen: () => void;
  /** Компактні картки в лівій колонці §3 (RAG pipeline, tool calling). */
  layout?: 'default' | 'pipeline';
  /** Повний короткий опис з уроку (не обрізати; пріоритет над cardTeaserUk). */
  listTeaserUk?: string;
  /** Якщо немає ChainStageDetail (QA, guardrails hint тощо). */
  navBadgeUk?: string;
  navActorUk?: string;
};

function stepKind(index: number, total: number): string {
  if (index === 0) return 'Вхід';
  if (index === total - 1 && total > 2) return 'Результат';
  if (index === total - 1) return 'Вихід';
  return 'Крок';
}

function visualKeyFromStage(stage: string, detail: ChainStageDetail | null): string {
  if (detail?.visualKey) return detail.visualKey;
  const s = stage.toLowerCase();
  if (s.includes('document')) return 'documents';
  if (s.includes('parse')) return 'parse';
  if (s.includes('chunk')) return 'chunks';
  if (s.includes('embed') || s.includes('index')) return 'embed';
  if (s.includes('searchable')) return 'store';
  if (s.includes('запит') || s === 'query') return 'query';
  if (s.includes('retriever')) return 'retrieve';
  if (s.includes('hit')) return 'hits';
  if (s.includes('filter') || s.includes('метадан')) return 'filter';
  if (s.includes('context') || s.includes('evidence')) return 'context';
  if (s.includes('api') || s.includes('модел') || s.includes('відповідь')) return 'llm';
  return 'step';
}

function glyphForKey(key: string): string {
  const map: Record<string, string> = {
    documents: 'DOC',
    parse: 'PAR',
    chunks: 'CHK',
    embed: 'IDX',
    store: 'DB',
    query: 'Q',
    retrieve: 'SR',
    hits: 'K',
    context: 'CTX',
    filter: 'FLT',
    llm: 'LLM',
    harness: 'HAR',
    executor: 'EXE',
    step: 'STP',
  };
  return map[key] ?? 'STP';
}

export function StudyFlowStageCard({
  stageLabel,
  index,
  total,
  detail,
  clickable,
  active,
  onOpen,
  layout = 'default',
  listTeaserUk,
  navBadgeUk,
  navActorUk,
}: Props) {
  const kind = navBadgeUk ?? detail?.cardBadgeUk ?? stepKind(index, total);
  const title = detail?.titleUk ?? stageLabel;
  const teaser =
    listTeaserUk?.trim() ||
    detail?.cardTeaserUk ||
    (detail?.outputUk ? detail.outputUk.replace(/\*\*/g, '') : stageLabel);
  const actor = navActorUk ?? detail?.cardActorUk ?? 'Код';
  const visual = visualKeyFromStage(stageLabel, detail);
  const position =
    index === 0 ? 'is-input' : index === total - 1 ? 'is-output' : 'is-middle';

  const className = [
    'study-flow-stage-card',
    `study-flow-stage-card--${visual}`,
    position,
    layout === 'pipeline' ? 'is-pipeline-compact' : '',
    clickable ? 'is-clickable' : '',
    active ? 'is-active' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const inner =
    layout === 'pipeline' ? (
      <>
        <div className="study-flow-stage-card-top study-flow-stage-card-top--pipeline">
          <span className={`study-flow-stage-glyph study-flow-stage-glyph--${visual}`} aria-hidden="true">
            {glyphForKey(visual)}
          </span>
          <div className="study-flow-stage-card-meta study-flow-stage-card-meta--pipeline">
            <h5 className="study-flow-stage-title">{title}</h5>
            <div className="study-flow-stage-card-badges">
              <span className="study-flow-stage-kind">{kind}</span>
              <span className={`study-flow-stage-actor${actor === 'LLM' ? ' is-llm' : ''}`}>{actor}</span>
            </div>
          </div>
          <span className="study-flow-stage-num" aria-label={`Крок ${index + 1}`}>
            {index + 1}
          </span>
        </div>
        <div className="study-flow-stage-card-foot">
          <p className="study-flow-stage-teaser">{teaser}</p>
          {clickable && (
            <span className="study-flow-stage-cta">
              Деталі
              <span className="study-flow-stage-cta-arrow" aria-hidden="true">→</span>
            </span>
          )}
        </div>
      </>
    ) : (
      <>
        <div className="study-flow-stage-card-top">
          <span className={`study-flow-stage-glyph study-flow-stage-glyph--${visual}`} aria-hidden="true">
            {glyphForKey(visual)}
          </span>
          <div className="study-flow-stage-card-meta">
            <div className="study-flow-stage-card-badges">
              <span className="study-flow-stage-kind">{kind}</span>
              <span className={`study-flow-stage-actor${actor === 'LLM' ? ' is-llm' : ''}`}>{actor}</span>
            </div>
            <span className="study-flow-stage-num" aria-label={`Крок ${index + 1}`}>
              {index + 1}
            </span>
          </div>
        </div>
        <h5 className="study-flow-stage-title">{title}</h5>
        <p className="study-flow-stage-teaser">{teaser}</p>
        {clickable && (
          <span className="study-flow-stage-cta">
            Деталі
            <span className="study-flow-stage-cta-arrow" aria-hidden="true">→</span>
          </span>
        )}
      </>
    );

  if (clickable) {
    return (
      <button type="button" className={className} onClick={onOpen} aria-pressed={active}>
        {inner}
      </button>
    );
  }
  return <div className={className}>{inner}</div>;
}
