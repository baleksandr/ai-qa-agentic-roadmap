import type { RagE2eHop } from '../../data/study/rag-one-query-e2e-flow';
import { StudyConceptCard } from './StudyConceptCard';

type Props = {
  hops: RagE2eHop[];
  titleUk: string;
};

export function StudyRagE2eTimeline({ hops, titleUk }: Props) {
  return (
    <section className="study-rag-e2e-timeline" aria-label={titleUk}>
      <h4 className="study-rag-e2e-title">{titleUk}</h4>
      <ol className="study-rag-e2e-timeline-list">
        {hops.map((hop, i) => (
          <li key={hop.label} className="study-rag-e2e-timeline-item">
            <StudyConceptCard
              step={i + 1}
              kind={hop.whoUk}
              title={hop.label}
              className="study-rag-e2e-hop-card"
            >
              <p className="study-concept-card-mono study-rag-e2e-hop-data">{hop.dataUk}</p>
            </StudyConceptCard>
            {i < hops.length - 1 ? (
              <span className="study-rag-e2e-timeline-arrow" aria-hidden="true">↓</span>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
