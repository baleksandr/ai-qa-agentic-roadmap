import { Fragment, useMemo, useState } from 'react';
import {
  AI_TAXONOMY_CAPTION_UK,
  AI_TAXONOMY_CLASSICAL,
  AI_TAXONOMY_ML_CHAIN,
  AI_TAXONOMY_ROOT,
  type FundamentalsMapNode,
} from '../../data/study/fundamentals-ai-taxonomy';
import { StudyInteractiveCardTitle } from './StudyInteractiveCardTitle';
import { StudyLearnerPanelBody } from './StudyLearnerPanelBody';
import {
  studyInteractiveCardActiveClass,
  studyInteractiveCardSelectionProps,
} from '../../lib/studyInteractiveCardState';

function ConceptNode({
  node,
  active,
  onSelect,
}: {
  node: FundamentalsMapNode;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`fundamentals-concept-node-btn study-interactive-card${studyInteractiveCardActiveClass(active)}`}
      {...studyInteractiveCardSelectionProps(active)}
      onClick={onSelect}
    >
      <StudyInteractiveCardTitle as="span" className="fundamentals-concept-node-title">
        {node.titleUk}
      </StudyInteractiveCardTitle>
      <div className="fundamentals-concept-node-foot">
        <span className="fundamentals-concept-node-teaser">{node.teaserUk}</span>
        <span className="study-flow-stage-cta fundamentals-concept-node-cta">
          Деталі
          <span className="study-flow-stage-cta-arrow" aria-hidden="true">→</span>
        </span>
      </div>
    </button>
  );
}

export function StudyFundamentalsAiTaxonomyMap() {
  const allNodes = useMemo(
    () => [AI_TAXONOMY_ROOT, ...AI_TAXONOMY_CLASSICAL, ...AI_TAXONOMY_ML_CHAIN],
    [],
  );
  const [activeId, setActiveId] = useState(AI_TAXONOMY_ROOT.id);
  const active = allNodes.find((n) => n.id === activeId) ?? AI_TAXONOMY_ROOT;
  return (
    <section className="fundamentals-ai-map" aria-label="Карта понять AI">
      <div className="fundamentals-ai-map-body">
        <div className="fundamentals-ai-map-schema" role="group" aria-label="Схема понять AI">
          <p className="fundamentals-concept-map-caption">{AI_TAXONOMY_CAPTION_UK}</p>

          <div className="fundamentals-ai-map-root">
            <ConceptNode
              node={AI_TAXONOMY_ROOT}
              active={activeId === AI_TAXONOMY_ROOT.id}
              onSelect={() => setActiveId(AI_TAXONOMY_ROOT.id)}
            />
          </div>

          <div className="fundamentals-ai-map-fork" aria-hidden="true">
            <span className="fundamentals-ai-map-fork-stem">↓</span>
            <div className="fundamentals-ai-map-fork-split">
              <span className="fundamentals-ai-map-fork-arm">↙</span>
              <span className="fundamentals-ai-map-fork-arm">↘</span>
            </div>
          </div>

          <div className="fundamentals-ai-map-groups">
            <div className="fundamentals-ai-map-group">
              <p className="fundamentals-concept-map-branch-label">Класичні підходи</p>
              <div className="fundamentals-ai-map-group-cards">
                {AI_TAXONOMY_CLASSICAL.map((node) => (
                  <ConceptNode
                    key={node.id}
                    node={node}
                    active={activeId === node.id}
                    onSelect={() => setActiveId(node.id)}
                  />
                ))}
              </div>
            </div>

            <div className="fundamentals-ai-map-group">
              <p className="fundamentals-concept-map-branch-label">Навчання на даних</p>
              <div className="fundamentals-ai-map-group-cards fundamentals-ai-map-group-cards--chain">
                {AI_TAXONOMY_ML_CHAIN.map((node, i) => (
                  <Fragment key={node.id}>
                    {i > 0 && (
                      <div className="fundamentals-concept-map-chain-arrow" aria-hidden="true">↓</div>
                    )}
                    <ConceptNode
                      node={node}
                      active={activeId === node.id}
                      onSelect={() => setActiveId(node.id)}
                    />
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside
          className="fundamentals-ai-map-detail study-rag-qa-detail-panel study-step-detail-panel"
          aria-live="polite"
          aria-label={`Пояснення: ${active.titleUk}`}
        >
          <>
            <h4 className="study-rag-qa-panel-title">{active.titleUk}</h4>
            <div className="study-rag-qa-panel-body fundamentals-concept-map-panel">
              <StudyLearnerPanelBody panel={active.panel} />
            </div>
          </>
        </aside>
      </div>
    </section>
  );
}
