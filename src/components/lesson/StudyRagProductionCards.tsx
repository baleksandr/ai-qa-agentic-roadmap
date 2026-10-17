import { lookupRagProductionDetail, productionDetailToMarkdown } from '../../data/study/rag-production-details';
import type { RagProductionItem } from '../../lib/ragProductionSection';
import { MarkdownBody } from '../MarkdownBody';
import { StudyPanelTerms } from './StudyPanelTerms';
import { useMemo, useState } from 'react';
import { StudyPipelineStepNav } from './StudyPipelineStepNav';
import { STUDY_EMPTY_ITEM_PANEL_UK } from '../../lib/studyLearnerCopy';
import { StudyStepDetailLayout } from './StudyStepDetailLayout';

type Props = {
  items: RagProductionItem[];
  footerMarkdown: string;
};

export function StudyRagProductionCards({ items, footerMarkdown }: Props) {
  const first = items.find((it) => lookupRagProductionDetail(it.title));
  const [activeTitle, setActiveTitle] = useState<string | null>(first?.title ?? null);

  const activeDetail = useMemo(
    () => (activeTitle ? lookupRagProductionDetail(activeTitle) : null),
    [activeTitle],
  );

  const panelMarkdown = useMemo(() => {
    if (!activeTitle || !activeDetail) return '';
    const item = items.find((i) => i.title === activeTitle);
    const summary = item?.bodyMarkdown ? `\n\n**Коротко з уроку.** ${item.bodyMarkdown}` : '';
    return productionDetailToMarkdown(activeDetail, { omitTerms: true }) + summary;
  }, [activeTitle, activeDetail, items]);

  const navItems = useMemo(
    () =>
      items.map((item) => {
        const detail = lookupRagProductionDetail(item.title);
        return {
          key: item.title,
          titleUk: item.title,
          teaserUk: item.bodyMarkdown.replace(/\*\*/g, '').replace(/\n+/g, ' ').trim(),
          clickable: !!detail,
          badgeUk: 'Production',
        };
      }),
    [items],
  );

  return (
    <div className="study-rag-production-block study-rag-pipeline-glossary">
      <StudyStepDetailLayout
        wrapperClassName="study-rag-production-layout"
        navAriaLabel="Теми production"
        nav={
          <StudyPipelineStepNav
            items={navItems}
            activeKey={activeTitle ?? ''}
            onSelect={(key) => setActiveTitle(String(key))}
            ariaLabel="Теми production"
          />
        }
        panel={
          activeTitle && panelMarkdown ? (
            <>
              <p className="study-rag-qa-panel-label">Пояснення</p>
              <h4 className="study-rag-qa-panel-title">{activeTitle}</h4>
              <div className="study-rag-qa-panel-body markdown-body study-detail-panel-with-terms study-rag-production-panel">
                <MarkdownBody markdown={panelMarkdown} studyTables studyPanelLabels />
                {activeDetail?.terms?.length ? <StudyPanelTerms terms={activeDetail.terms} /> : null}
              </div>
            </>
          ) : (
            <p className="study-rag-qa-panel-empty muted small">{STUDY_EMPTY_ITEM_PANEL_UK}</p>
          )
        }
      />

      {footerMarkdown && (
        <aside className="lesson-callout lesson-key-idea study-rag-production-footer">
          <span className="lesson-callout-label">Пам’ятайте</span>
          <div className="markdown-body">
            <MarkdownBody markdown={footerMarkdown} studyTables />
          </div>
        </aside>
      )}
    </div>
  );
}
