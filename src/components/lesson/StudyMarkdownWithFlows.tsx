import {
  TOOL_CALLING_LEARNER_FLOW_FIRST_ROW,
  TOOL_CALLING_LEARNER_FLOW_STAGES,
} from '../../data/study/tool-calling-learner-flow';
import { flowStagesFromChunk, splitMarkdownWithArrowFlows } from '../../lib/studyArrowFlow';
import { StudyMarkdownSegments } from './StudyMarkdownSegments';
import { StudyFlowRibbon } from './StudyFlowRibbon';
import { StudyLearnerFlowTrack } from './StudyLearnerFlowTrack';

type Props = {
  markdown: string;
  flowAriaLabel?: string;
  studyTables?: boolean;
};

function stagesMatchToolCallingFlow(stages: string[]): boolean {
  if (stages.length !== TOOL_CALLING_LEARNER_FLOW_STAGES.length) return false;
  return stages.every((s, i) => s === TOOL_CALLING_LEARNER_FLOW_STAGES[i]);
}

/** Markdown з абзацами «a → b → c» як стильні ribbon-схеми */
export function StudyMarkdownWithFlows({ markdown, flowAriaLabel, studyTables = true }: Props) {
  const parts = splitMarkdownWithArrowFlows(markdown);
  if (parts.length === 0) return null;

  return (
    <>
      {parts.map((part, i) => {
        if (part.kind === 'flow') {
          const stages = flowStagesFromChunk(part.text);
          if (stages.length >= 4 || stagesMatchToolCallingFlow(stages)) {
            return (
              <StudyLearnerFlowTrack
                key={`flow-${i}`}
                stages={stages}
                ariaLabel={flowAriaLabel}
                firstRowCount={stagesMatchToolCallingFlow(stages) ? TOOL_CALLING_LEARNER_FLOW_FIRST_ROW : undefined}
              />
            );
          }
          return (
            <StudyFlowRibbon
              key={`flow-${i}`}
              stages={stages}
              layout="ribbon"
              ariaLabel={flowAriaLabel}
            />
          );
        }
        return (
          <div key={`md-${i}`} className="study-md-flow-block">
            <StudyMarkdownSegments markdown={part.text} studyTables={studyTables} />
          </div>
        );
      })}
    </>
  );
}
