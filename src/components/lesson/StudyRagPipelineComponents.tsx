import { useMemo, useState } from 'react';
import { RAG_PIPELINE_COMPONENTS } from '../../data/study/rag-pipeline-components';
import { lookupRagPipelineComponentDetail } from '../../data/study/rag-pipeline-component-details';
import { chainStageDetailToMarkdown } from '../../data/study/rag-chain-stage-details';
import { MarkdownBody } from '../MarkdownBody';
import { StudyInteractionHint } from './StudyInteractionHint';
import { StudyPanelTerms } from './StudyPanelTerms';
import { StudyStepDetailLayout } from './StudyStepDetailLayout';
import { STUDY_EMPTY_PANEL_UK } from '../../lib/studyLearnerCopy';
import { StudyPipelineStepNav } from './StudyPipelineStepNav';

export function StudyRagPipelineComponents() {
  const first = RAG_PIPELINE_COMPONENTS.find((c) => lookupRagPipelineComponentDetail(c.index));
  const [activeIndex, setActiveIndex] = useState<number | null>(first?.index ?? null);

  const activeDetail = useMemo(
    () => (activeIndex !== null ? lookupRagPipelineComponentDetail(activeIndex) : null),
    [activeIndex],
  );

  const panelMarkdown = useMemo(() => {
    if (!activeDetail || activeIndex === null) return '';
    const comp = RAG_PIPELINE_COMPONENTS.find((c) => c.index === activeIndex);
    const lesson = comp?.summaryUk ? `\n\n**Коротко з уроку:**\n\n${comp.summaryUk}` : '';
    return chainStageDetailToMarkdown(activeDetail, { omitTerms: true }) + lesson;
  }, [activeDetail, activeIndex]);

  const activeTitle = RAG_PIPELINE_COMPONENTS.find((c) => c.index === activeIndex)?.titleUk;

  const navItems = useMemo(
    () =>
      RAG_PIPELINE_COMPONENTS.map((c) => ({
        key: c.index,
        titleUk: c.titleUk,
        teaserUk: c.summaryUk,
        detail: lookupRagPipelineComponentDetail(c.index),
        clickable: !!lookupRagPipelineComponentDetail(c.index),
      })),
    [],
  );

  return (
    <StudyStepDetailLayout
      wrapperClassName="study-component-glossary study-rag-pipeline-glossary study-rag-pipeline-with-panel"
      navAriaLabel="Компоненти pipeline"
      lead={
        <p className="study-component-glossary-lead">
          <strong>Дев’ять кроків підготовки та запиту</strong> (назви в проді різняться).
        </p>
      }
      hint={<StudyInteractionHint>Оберіть крок ліворуч, щоб побачити пояснення для QA.</StudyInteractionHint>}
      nav={
        <StudyPipelineStepNav
          items={navItems}
          activeKey={activeIndex ?? -1}
          onSelect={(key) => setActiveIndex(Number(key))}
          ariaLabel="Компоненти pipeline"
        />
      }
      panel={
        activeIndex !== null && panelMarkdown && activeTitle ? (
          <>
            <p className="study-rag-qa-panel-label">Компонент pipeline</p>
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
