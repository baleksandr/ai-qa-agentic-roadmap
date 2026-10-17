import { useMemo, useState } from 'react';
import { TOOL_CALLING_FAILURE_DETAILS } from '../../data/study/tool-calling-failure-details';
import { StudyInteractionHint } from './StudyInteractionHint';
import { StudyPipelineStepNav } from './StudyPipelineStepNav';
import { StudyStepDetailLayout } from './StudyStepDetailLayout';
import { STUDY_EMPTY_PANEL_UK } from '../../lib/studyLearnerCopy';
import { parseLessonBold } from './lessonRichText';

type Props = {
  introUk?: string;
};

export function StudyToolCallingFailureModes({ introUk }: Props) {
  const [activeId, setActiveId] = useState(TOOL_CALLING_FAILURE_DETAILS[0]?.id ?? '');
  const active = TOOL_CALLING_FAILURE_DETAILS.find((f) => f.id === activeId) ?? TOOL_CALLING_FAILURE_DETAILS[0];

  const navItems = useMemo(
    () =>
      TOOL_CALLING_FAILURE_DETAILS.map((f) => ({
        key: f.id,
        titleUk: f.titleUk,
        teaserUk: `${f.subtitleUk} · ${f.navTeaserUk}`,
        badgeUk: f.meta.categoryUk,
        actorUk: `Збій ${f.meta.index}`,
      })),
    [],
  );

  return (
    <div className="study-rag-failures study-tool-calling-failures study-rag-pipeline-glossary">
      {introUk?.trim() ? (
        <p className="study-rag-failures-intro muted">{parseLessonBold(introUk)}</p>
      ) : null}
      <p className="study-rag-failures-lead muted small">
        Сім типових збоїв tool calling (навчальні приклади).
      </p>
      <StudyInteractionHint>
        Оберіть збій ліворуч — поруч з’являться сценарій, сигнал у trace і перевірка QA.
      </StudyInteractionHint>

      <StudyStepDetailLayout
        navAriaLabel="Збої tool calling"
        nav={
          <StudyPipelineStepNav
            items={navItems}
            activeKey={activeId}
            onSelect={(key) => setActiveId(String(key))}
            ariaLabel="Збої tool calling"
          />
        }
        panel={
          active ? (
            <div className={`study-tool-calling-failure-panel severity-${active.meta.severity} ${active.meta.categoryClass}`}>
              <p className="study-rag-failure-tag study-tool-calling-failure-tag">{active.meta.categoryUk}</p>
              <h4 className="study-tool-calling-failure-panel-title">
                {active.meta.index}. {active.titleUk}
                <span className="study-tool-calling-failure-subtitle"> — {active.subtitleUk}</span>
              </h4>
              <dl className="study-failure-details study-tool-calling-failure-details">
                {active.sections.map((sec) => (
                  <div key={sec.headingUk} className="study-failure-details-block">
                    <dt>{sec.headingUk}</dt>
                    <dd>{parseLessonBold(sec.bodyUk)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : (
            <p className="muted small">{STUDY_EMPTY_PANEL_UK}</p>
          )
        }
      />
    </div>
  );
}
