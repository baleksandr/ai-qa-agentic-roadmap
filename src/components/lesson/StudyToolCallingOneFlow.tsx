import { useMemo, useState } from 'react';
import {
  TC_ONE_FLOW_ALLOW_LIST_FENCE,
  TC_ONE_FLOW_INTRO,
  TC_ONE_FLOW_RUNTIME_STEPS,
  TC_ONE_FLOW_TOOL_CALL_FENCE,
  TC_ONE_FLOW_TRACE_NOTE,
} from '../../data/study/tool-calling-runtime-steps';
import { lookupToolCallingComponentDetail } from '../../data/study/tool-calling-component-details';
import { TOOL_CALLING_STAGES } from '../../data/study/tool-calling-flow-stages';
import { chainStageDetailToMarkdown } from '../../data/study/rag-chain-stage-details';
import { MarkdownBody } from '../MarkdownBody';
import { StudyPanelTerms } from './StudyPanelTerms';
import { StudyStepDetailLayout } from './StudyStepDetailLayout';
import { StudyInteractionHint } from './StudyInteractionHint';
import { StudyPipelineStepNav } from './StudyPipelineStepNav';
import { STUDY_EMPTY_PANEL_UK } from '../../lib/studyLearnerCopy';

export function StudyToolCallingOneFlow() {
  const [activeStep, setActiveStep] = useState(1);
  const stage = TOOL_CALLING_STAGES.find((s) => s.index === activeStep);
  const runtime = TC_ONE_FLOW_RUNTIME_STEPS.find((s) => s.step === activeStep);
  const detail = lookupToolCallingComponentDetail(activeStep);

  const panelMarkdown = useMemo(() => {
    if (!detail || !stage) return '';
    const qa = stage.qaUk ? `\n\n**Як перевіряє QA:**\n\n${stage.qaUk}` : '';
    const trace = activeStep === 5 ? `\n\n${TC_ONE_FLOW_TRACE_NOTE}` : '';
    return chainStageDetailToMarkdown(detail, { omitTerms: true }) + qa + trace;
  }, [activeStep, detail, stage]);

  const navItems = useMemo(
    () =>
      TC_ONE_FLOW_RUNTIME_STEPS.map((s) => {
        const meta = TOOL_CALLING_STAGES.find((t) => t.index === s.step);
        return {
          key: s.step,
          titleUk: meta?.titleUk ?? `Крок ${s.step}`,
          teaserUk: s.lessonUk,
          detail: lookupToolCallingComponentDetail(s.step),
          clickable: !!lookupToolCallingComponentDetail(s.step),
        };
      }),
    [],
  );

  return (
    <section
      className="study-rag-one-query study-tool-calling-one-flow study-rag-pipeline-glossary"
      aria-label="Один виклик tool"
    >
      <p className="study-rag-scenario-kicker muted small">
        Навчальний приклад · `login_spec` · readPlaywrightReport
      </p>

      <div className="study-rag-story-intro lesson-callout lesson-key-idea">
        <span className="lesson-callout-label">Один виклик у run</span>
        <p className="study-rag-story-intro-text">{TC_ONE_FLOW_INTRO}</p>
      </div>

      <pre className="study-tc-fence muted small">{TC_ONE_FLOW_ALLOW_LIST_FENCE}</pre>
      <pre className="study-tc-fence muted small">{TC_ONE_FLOW_TOOL_CALL_FENCE}</pre>

      <StudyStepDetailLayout
        wrapperClassName="study-rag-pipeline-with-panel"
        hint={
          <StudyInteractionHint>
            Оберіть крок ліворуч — поруч з’явиться пояснення з уроку та розбір механізму для QA.
          </StudyInteractionHint>
        }
        navAriaLabel="П’ять кроків одного виклику tool"
        nav={
          <StudyPipelineStepNav
            items={navItems}
            activeKey={activeStep}
            onSelect={(key) => setActiveStep(Number(key))}
            ariaLabel="П’ять кроків одного виклику tool"
          />
        }
        panel={
          stage && panelMarkdown ? (
            <>
              <p className="study-rag-qa-panel-label">Крок {activeStep}</p>
              <h4 className="study-rag-qa-panel-title">{stage.titleUk}</h4>
              <p className="study-tc-lesson-line">{runtime?.lessonUk}</p>
              <div className="study-rag-qa-panel-body markdown-body study-detail-panel-with-terms">
                <MarkdownBody markdown={panelMarkdown} studyTables studyPanelLabels />
                {detail?.terms?.length ? <StudyPanelTerms terms={detail.terms} /> : null}
              </div>
            </>
          ) : (
            <p className="study-rag-qa-panel-empty muted small">{STUDY_EMPTY_PANEL_UK}</p>
          )
        }
      />
    </section>
  );
}
