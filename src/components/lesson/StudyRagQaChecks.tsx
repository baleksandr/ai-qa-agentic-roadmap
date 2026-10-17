import { lookupRagQaCheckDetail, qaCheckDetailToMarkdown } from '../../data/study/rag-qa-check-details';
import type { RagQaCheckItem } from '../../lib/ragQaSection';
import { MarkdownBody } from '../MarkdownBody';
import { StudyPanelTerms } from './StudyPanelTerms';
import { StudyQaPhaseStrip } from './StudyQaPhaseStrip';
import { useMemo, useState } from 'react';
import { StudyPipelineStepNav } from './StudyPipelineStepNav';
import { STUDY_EMPTY_ITEM_PANEL_UK } from '../../lib/studyLearnerCopy';
import { StudyStepDetailLayout } from './StudyStepDetailLayout';

type Props = {
  items: RagQaCheckItem[];
};

export function StudyRagQaChecks({ items }: Props) {
  const firstWithDetail = items.find((it) => lookupRagQaCheckDetail(it.title));
  const [activeTitle, setActiveTitle] = useState<string | null>(firstWithDetail?.title ?? null);

  const activeDetail = useMemo(() => {
    if (!activeTitle) return null;
    return lookupRagQaCheckDetail(activeTitle);
  }, [activeTitle]);

  const panelMarkdown = useMemo(() => {
    if (!activeTitle || !activeDetail) return '';
    const item = items.find((i) => i.title === activeTitle);
    return qaCheckDetailToMarkdown(activeDetail, item?.body, { omitTerms: true });
  }, [activeTitle, activeDetail, items]);

  const navItems = useMemo(
    () =>
      items.map((item) => {
        const detail = lookupRagQaCheckDetail(item.title);
        return {
          key: item.title,
          titleUk: item.title,
          teaserUk: item.body.replace(/\*\*/g, ''),
          clickable: !!detail,
          badgeUk: detail?.phaseUk,
        };
      }),
    [items],
  );

  return (
    <div className="study-rag-qa-block study-rag-pipeline-glossary">
      <StudyStepDetailLayout
        navAriaLabel="Перевірки QA"
        nav={
          <StudyPipelineStepNav
            items={navItems}
            activeKey={activeTitle ?? ''}
            onSelect={(key) => setActiveTitle(String(key))}
            ariaLabel="Перевірки QA"
          />
        }
        panel={
          activeTitle && activeDetail && panelMarkdown ? (
            <>
              <StudyQaPhaseStrip active={activeDetail.phaseKey} phaseLabel={activeDetail.phaseUk} />
              <p className="study-rag-qa-panel-label">Пояснення перевірки</p>
              <h4 className="study-rag-qa-panel-title">{activeTitle}</h4>
              <div className="study-rag-qa-panel-body markdown-body study-detail-panel-with-terms">
                <MarkdownBody markdown={panelMarkdown} studyTables studyPanelLabels />
                {activeDetail.terms?.length ? <StudyPanelTerms terms={activeDetail.terms} /> : null}
              </div>
            </>
          ) : (
            <p className="study-rag-qa-panel-empty muted small">{STUDY_EMPTY_ITEM_PANEL_UK}</p>
          )
        }
      />
    </div>
  );
}
