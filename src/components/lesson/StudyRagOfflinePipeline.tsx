import type { RagOfflinePipeline } from '../../lib/ragOfflinePipeline';
import { lookupOfflinePipelineStageDetail } from '../../data/study/rag-chain-stage-details';
import { StudyFlowRibbon } from './StudyFlowRibbon';

type Props = {
  pipeline: RagOfflinePipeline;
};

export function StudyRagOfflinePipeline({ pipeline }: Props) {
  return (
    <figure className="study-rag-offline-pipeline" aria-label="Підготовка знань offline">
      <figcaption className="study-rag-offline-heading">{pipeline.heading}</figcaption>
      <StudyFlowRibbon
        stages={pipeline.stages}
        layout="cards"
        cardFlow="column"
        detailPlacement="inline"
        stageDetailLookup={(stage) => lookupOfflinePipelineStageDetail(stage)}
      />
      {pipeline.annotation && (
        <p className="study-rag-offline-note muted small">
          <span className="study-rag-offline-note-label">Разом із індексацією:</span>{' '}
          {pipeline.annotation}
        </p>
      )}
    </figure>
  );
}
