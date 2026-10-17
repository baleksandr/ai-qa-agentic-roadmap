import { useMemo, useState } from 'react';
import { TOOL_CALLING_STAGES } from '../../data/study/tool-calling-flow-stages';
import { lookupToolCallingComponentDetail } from '../../data/study/tool-calling-component-details';
import { chainStageDetailToMarkdown } from '../../data/study/rag-chain-stage-details';
import { MarkdownBody } from '../MarkdownBody';
import { StudyInteractionHint } from './StudyInteractionHint';
import { StudyPanelTerms } from './StudyPanelTerms';
import { StudyStepDetailLayout } from './StudyStepDetailLayout';
import { StudyLearnerFlowTrack } from './StudyLearnerFlowTrack';
import { TOOL_CALLING_LEARNER_FLOW_FIRST_ROW } from '../../data/study/tool-calling-learner-flow';
import { TOOL_CALLING_PIPELINE_RIBBON } from '../../data/study/tool-calling-ribbon-stages';
import { StudyPipelineStepNav } from './StudyPipelineStepNav';
import { STUDY_EMPTY_PANEL_UK } from '../../lib/studyLearnerCopy';

export function StudyToolCallingComponents() {
  const first = TOOL_CALLING_STAGES.find((c) => lookupToolCallingComponentDetail(c.index));
  const [activeIndex, setActiveIndex] = useState<number | null>(first?.index ?? null);

  const activeDetail = useMemo(
    () => (activeIndex !== null ? lookupToolCallingComponentDetail(activeIndex) : null),
    [activeIndex],
  );

  const panelMarkdown = useMemo(() => {
    if (!activeDetail || activeIndex === null) return '';
    const comp = TOOL_CALLING_STAGES.find((c) => c.index === activeIndex);
    const lesson = comp?.summaryUk ? `\n\n**З уроку (крок ${activeIndex}):**\n\n${comp.summaryUk}` : '';
    return chainStageDetailToMarkdown(activeDetail, { omitTerms: true }) + lesson;
  }, [activeDetail, activeIndex]);

  const activeTitle = TOOL_CALLING_STAGES.find((c) => c.index === activeIndex)?.titleUk;

  const navItems = useMemo(
    () =>
      TOOL_CALLING_STAGES.map((c) => ({
        key: c.index,
        titleUk: c.titleUk,
        teaserUk: c.summaryUk,
        detail: lookupToolCallingComponentDetail(c.index),
        clickable: !!lookupToolCallingComponentDetail(c.index),
      })),
    [],
  );

  return (
    <StudyStepDetailLayout
      wrapperClassName="study-component-glossary study-rag-pipeline-glossary study-rag-pipeline-with-panel"
      navAriaLabel="Кроки tool calling"
      lead={
        <p className="study-component-glossary-lead">
          <strong>П’ять кроків механізму</strong> (назви в проді різняться).
        </p>
      }
      hint={<StudyInteractionHint>Оберіть крок ліворуч, щоб побачити пояснення для QA.</StudyInteractionHint>}
      beforeNav={
        <div className="study-pipeline-ribbon-overview">
          <p className="muted small study-pipeline-ribbon-lead">Один run investigation (назви в проді різняться):</p>
          <StudyLearnerFlowTrack
            stages={TOOL_CALLING_PIPELINE_RIBBON}
            ariaLabel="Ланцюг tool calling"
            firstRowCount={TOOL_CALLING_LEARNER_FLOW_FIRST_ROW}
          />
          <p className="muted small study-pipeline-ribbon-note">
            Список ліворуч — п’ять ролей механізму; на схемі той самий прохід, що в прикладі <code>readPlaywrightReport</code> у §2.
          </p>
        </div>
      }
      nav={
        <StudyPipelineStepNav
          items={navItems}
          activeKey={activeIndex ?? -1}
          onSelect={(key) => setActiveIndex(Number(key))}
          ariaLabel="Кроки tool calling"
        />
      }
      panel={
        activeIndex !== null && panelMarkdown && activeTitle ? (
          <>
            <p className="study-rag-qa-panel-label">Крок механізму</p>
            <h4 className="study-rag-qa-panel-title">{activeTitle}</h4>
            <div className="study-rag-qa-panel-body markdown-body study-detail-panel-with-terms">
              <MarkdownBody markdown={panelMarkdown} studyTables studyPanelLabels />
              {activeDetail?.terms?.length ? <StudyPanelTerms terms={activeDetail.terms} /> : null}
            </div>
          </>
        ) : (
          <p className="study-rag-qa-panel-empty muted small">{STUDY_EMPTY_PANEL_UK}</p>
        )
      }
    />
  );
}
