import { useMemo, useState } from 'react';
import type { StudyHintItem } from '../../data/study/study-hint-types';
import { LessonRichParagraphs, parseLessonBold } from './lessonRichText';
import { StudyPipelineStepNav } from './StudyPipelineStepNav';
import { STUDY_EMPTY_ITEM_PANEL_UK } from '../../lib/studyLearnerCopy';
import { StudyStepDetailLayout } from './StudyStepDetailLayout';

type Props = {
  leadUk: string;
  introUk?: string;
  items: StudyHintItem[];
  listAriaLabel: string;
  detailPlaceholderUk?: string;
};

export function StudySplitHintPanel({
  leadUk,
  introUk,
  items,
  listAriaLabel,
  detailPlaceholderUk = STUDY_EMPTY_ITEM_PANEL_UK,
}: Props) {
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? '');
  const selected = items.find((item) => item.id === selectedId) ?? items[0];

  const navItems = useMemo(
    () =>
      items.map((item) => ({
        key: item.id,
        titleUk: item.titleUk,
        teaserUk: item.teaserUk,
        badgeUk: item.termEn ?? undefined,
      })),
    [items],
  );

  return (
    <div className="study-split-hint study-rag-pipeline-glossary">
      <LessonRichParagraphs text={leadUk} className="lesson-p study-boundary-lead" />
      {introUk?.trim() ? (
        <p className="study-split-hint-intro muted small study-learner-explanation">
          {parseLessonBold(introUk)}
        </p>
      ) : null}

      <StudyStepDetailLayout
        navAriaLabel={listAriaLabel}
        nav={
          <StudyPipelineStepNav
            items={navItems}
            activeKey={selected?.id ?? ''}
            onSelect={(key) => setSelectedId(String(key))}
            ariaLabel={listAriaLabel}
          />
        }
        panel={
          selected ? (
            <>
              <h4 className="study-split-hint-detail-title">{selected.titleUk}</h4>
              {selected.termEn && (
                <p className="study-policy-term muted small" lang="en">
                  Термін у курсі: <em>{selected.termEn}</em>
                </p>
              )}
              <dl className="study-failure-details">
                {selected.sections.map((sec) => (
                  <div key={sec.labelUk}>
                    <dt>{sec.labelUk}</dt>
                    <dd>
                      {sec.listItemsUk?.length ? (
                        <ol className="study-hint-ol">
                          {sec.listItemsUk.map((item) => (
                            <li key={item}>{parseLessonBold(item)}</li>
                          ))}
                        </ol>
                      ) : (
                        parseLessonBold(sec.bodyUk ?? '')
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              {selected.exampleUk && (
                <p className="study-split-hint-example">
                  <span className="study-component-qa-label">У trace це виглядає так:</span>{' '}
                  {parseLessonBold(selected.exampleUk)}
                </p>
              )}
              {selected.qaUk && (
                <p className="study-component-qa">
                  <span className="study-component-qa-label">Для QA-агента:</span> {parseLessonBold(selected.qaUk)}
                </p>
              )}
            </>
          ) : (
            <p className="muted small">{detailPlaceholderUk}</p>
          )
        }
      />
    </div>
  );
}
