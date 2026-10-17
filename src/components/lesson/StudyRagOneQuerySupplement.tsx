import type { RagOneQueryRestBlocks, RagCompactHop } from '../../lib/ragOneQueryRest';
import { RAG_QUERY_FLOW_STEPS } from '../../data/study/rag-query-flow-steps';
import { StudyConceptCard } from './StudyConceptCard';
import { MarkdownBody } from '../MarkdownBody';

type Props = {
  blocks: RagOneQueryRestBlocks;
};

function CompactWalkthrough({ hops, title }: { hops: RagCompactHop[]; title: string }) {
  return (
    <section className="study-rag-walkthrough" aria-label={title}>
      <h4 className="study-rag-block-heading">{title}</h4>
      <ol className="study-rag-walkthrough-list">
        {hops.map((hop, i) => (
          <li key={`${hop.label}-${i}`} className="study-rag-walkthrough-item">
            <StudyConceptCard step={i + 1} kind="Передача даних" title={hop.label} className="study-rag-walkthrough-card">
              {hop.detail ? (
                <p className="study-rag-walkthrough-detail">
                  <span className="study-rag-walkthrough-arrow" aria-hidden="true">→</span>
                  {hop.detail}
                </p>
              ) : null}
            </StudyConceptCard>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function StudyRagOneQuerySupplement({ blocks }: Props) {
  return (
    <div className="study-rag-one-query-supplement">
      {blocks.sequenceSteps.length >= 2 ? (
        <section className="study-rag-sequence" aria-label="Послідовність кроків одного запиту">
          <h4 className="study-rag-block-heading">Послідовність кроків одного запиту</h4>
          <ol className="study-rag-sequence-list">
            {blocks.sequenceSteps.map((step) => {
              const flow = RAG_QUERY_FLOW_STEPS[step.index - 1];
              return (
                <li key={step.index}>
                  <StudyConceptCard
                    step={step.index}
                    kind={flow?.actorLabel ?? `Крок ${step.index}`}
                    title={flow?.titleUk ?? `Крок ${step.index}`}
                  >
                    <p className="study-concept-card-lead">{step.text}</p>
                  </StudyConceptCard>
                </li>
              );
            })}
          </ol>
        </section>
      ) : null}

      {blocks.walkthroughHops.length > 0 ? (
        <CompactWalkthrough hops={blocks.walkthroughHops} title="Навчальний прохід (умовні дані)" />
      ) : null}

      {blocks.risks.length > 0 ? (
        <section className="study-rag-risks" aria-label="Два ризики для QA">
          <h4 className="study-rag-block-heading">Два ризики для QA</h4>
          <ol className="study-rag-risks-list">
            {blocks.risks.map((risk, i) => (
              <li key={i}>
                <StudyConceptCard step={i + 1} kind="Негативний тест" title={`Ризик ${i + 1}`}>
                  <p className="study-concept-card-lead">{risk}</p>
                </StudyConceptCard>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {blocks.verifiedMarkdown ? (
        <aside className="study-rag-verified study-concept-card study-concept-card-wide">
          <header className="study-concept-card-head">
            <span className="study-concept-card-step">✓</span>
            <div className="study-concept-card-titles">
              <span className="study-concept-card-kind">Перевірка репозиторію</span>
              <h4 className="study-concept-card-title">Що перевірено</h4>
            </div>
          </header>
          <div className="study-concept-card-body markdown-body study-rag-verified-body">
            <MarkdownBody markdown={blocks.verifiedMarkdown} studyPanelLabels />
          </div>
        </aside>
      ) : null}
    </div>
  );
}
