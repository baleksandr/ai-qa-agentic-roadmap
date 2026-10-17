import { useMemo, useState } from 'react';
import {
  TOOL_CALLING_QA_CATEGORIES,
  TOOL_CALLING_QA_GWT_SCENARIOS,
  TOOL_CALLING_QA_LEVELS,
  TOOL_CALLING_QA_NO_AUTOMATED_TESTS_NOTE,
} from '../../data/study/tool-calling-qa-testing';
import { StudyPipelineStepNav } from './StudyPipelineStepNav';
import { StudyStepDetailLayout } from './StudyStepDetailLayout';
import { STUDY_EMPTY_PANEL_UK } from '../../lib/studyLearnerCopy';
import { parseLessonBold } from './lessonRichText';

const CATEGORY_FIELDS: { label: string; key: keyof (typeof TOOL_CALLING_QA_CATEGORIES)[0] }[] = [
  { label: 'Що підготувати', key: 'setupUk' },
  { label: 'Яку дію виконати', key: 'actionUk' },
  { label: 'Який результат очікувати', key: 'expectUk' },
  { label: 'Чого не повинно статися', key: 'mustNotUk' },
  { label: 'Як побачити результат', key: 'evidenceUk' },
];

type Props = {
  introUk?: string;
};

export function StudyToolCallingQaTesting({ introUk }: Props) {
  const [activeId, setActiveId] = useState(TOOL_CALLING_QA_CATEGORIES[0]?.id ?? '');
  const active = TOOL_CALLING_QA_CATEGORIES.find((c) => c.id === activeId) ?? TOOL_CALLING_QA_CATEGORIES[0];

  const navItems = useMemo(
    () =>
      TOOL_CALLING_QA_CATEGORIES.map((c) => ({
        key: c.id,
        titleUk: c.titleUk,
        teaserUk: `${c.subtitleUk} · ${c.navTeaserUk}`,
        actorUk: 'QA',
      })),
    [],
  );

  return (
    <div className="study-tool-calling-qa study-rag-pipeline-glossary">
      {introUk?.trim() ? <p className="muted study-tool-calling-qa-intro">{parseLessonBold(introUk)}</p> : null}

      <section className="study-tool-calling-qa-levels" aria-labelledby="tc-qa-levels-title">
        <h4 id="tc-qa-levels-title" className="study-tool-calling-qa-levels-title">Три рівні перевірки</h4>
        <p className="muted small study-tool-calling-qa-levels-lead">
          Від вузького шару до повного run — спочатку handler, потім harness, наприкінці модель.
        </p>
        <ol className="study-tool-calling-qa-levels-stack">
          {TOOL_CALLING_QA_LEVELS.map((level, index) => (
            <li
              key={level.id}
              className={`study-tool-calling-qa-level-card is-level-${index + 1}`}
            >
              <div className="study-tool-calling-qa-level-card-head">
                <span className="study-tool-calling-qa-level-num" aria-hidden="true">{index + 1}</span>
                <span className="study-tool-calling-qa-level-badge">{level.badgeUk}</span>
              </div>
              <h5 className="study-tool-calling-qa-level-title">{level.titleUk}</h5>
              <p className="study-tool-calling-qa-level-body">{parseLessonBold(level.bodyUk)}</p>
            </li>
          ))}
        </ol>
      </section>

      <StudyStepDetailLayout
        navAriaLabel="Категорії QA tool calling"
        nav={
          <StudyPipelineStepNav
            items={navItems}
            activeKey={activeId}
            onSelect={(key) => setActiveId(String(key))}
            ariaLabel="Категорії QA tool calling"
          />
        }
        panel={
          active ? (
            <div className="study-tool-calling-qa-panel">
              <h4 className="study-tool-calling-failure-panel-title">{active.titleUk}</h4>
              <p className="muted small study-tool-calling-failure-subtitle">{active.subtitleUk}</p>
              <dl className="study-failure-details study-tool-calling-failure-details">
                {CATEGORY_FIELDS.map((field) => (
                  <div key={field.key} className="study-failure-details-block">
                    <dt>{field.label}</dt>
                    <dd>{parseLessonBold(active[field.key])}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : (
            <p className="muted small">{STUDY_EMPTY_PANEL_UK}</p>
          )
        }
      />

      <section className="study-tool-calling-qa-gwt" aria-label="Приклади Given When Then">
        <h4 className="study-tool-calling-qa-gwt-title">Повні приклади Given → When → Then</h4>
        <p className="muted small study-tool-calling-qa-gwt-note">{TOOL_CALLING_QA_NO_AUTOMATED_TESTS_NOTE}</p>
        <ul className="study-tool-calling-qa-gwt-list">
          {TOOL_CALLING_QA_GWT_SCENARIOS.map((s) => (
            <li key={s.id} className="lesson-callout study-tool-calling-qa-gwt-card">
              <p className="study-tool-calling-qa-gwt-card-title">{s.titleUk}</p>
              <dl className="study-failure-details">
                <div className="study-failure-details-block">
                  <dt>Given</dt>
                  <dd>{parseLessonBold(s.givenUk)}</dd>
                </div>
                <div className="study-failure-details-block">
                  <dt>When</dt>
                  <dd>{parseLessonBold(s.whenUk)}</dd>
                </div>
                <div className="study-failure-details-block">
                  <dt>Then</dt>
                  <dd>{parseLessonBold(s.thenUk)}</dd>
                </div>
                <div className="study-failure-details-block">
                  <dt>Чого не повинно статися</dt>
                  <dd>{parseLessonBold(s.mustNotUk)}</dd>
                </div>
                <div className="study-failure-details-block">
                  <dt>Докази</dt>
                  <dd>{parseLessonBold(s.evidenceUk)}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
