import { useMemo, useState } from 'react';
import {
  TOOL_CALLING_LLM_CODE_INTRO,
  TOOL_CALLING_LLM_CODE_STEPS,
  TOOL_CALLING_RESPONSIBILITY_ROWS,
  TOOL_CALLING_RISK_EXAMPLES,
} from '../../data/study/tool-calling-llm-code-flow';
import { StudyPipelineStepNav } from './StudyPipelineStepNav';
import { StudyStepDetailLayout } from './StudyStepDetailLayout';
import { STUDY_EMPTY_PANEL_UK } from '../../lib/studyLearnerCopy';
import { parseLessonBold } from './lessonRichText';

type Props = {
  introMarkdown?: string;
};

export function StudyToolCallingLlmCodeBoundary({ introMarkdown }: Props) {
  const [activeStep, setActiveStep] = useState(TOOL_CALLING_LLM_CODE_STEPS[0]?.step ?? 1);
  const active = TOOL_CALLING_LLM_CODE_STEPS.find((s) => s.step === activeStep) ?? TOOL_CALLING_LLM_CODE_STEPS[0];

  const navItems = useMemo(
    () =>
      TOOL_CALLING_LLM_CODE_STEPS.map((s) => ({
        key: s.step,
        titleUk: `Крок ${s.step}`,
        teaserUk: s.titleUk,
        actorUk: s.actorUk,
      })),
    [],
  );

  const lead = introMarkdown?.trim() || TOOL_CALLING_LLM_CODE_INTRO;

  return (
    <section className="study-tool-calling-llm-code study-rag-pipeline-glossary" aria-label="Де код, а де LLM">
      <p className="study-rag-scenario-kicker muted small">Навчальний приклад · login_spec · readPlaywrightReport</p>
      <p className="study-boundary-lead">{parseLessonBold(lead)}</p>

      <StudyStepDetailLayout
        navAriaLabel="Шість кроків readPlaywrightReport"
        nav={
          <StudyPipelineStepNav
            items={navItems}
            activeKey={activeStep}
            onSelect={(key) => setActiveStep(Number(key))}
            ariaLabel="Шість кроків readPlaywrightReport"
          />
        }
        panel={
          active ? (
            <div className="study-tool-calling-llm-code-panel">
              <p className="study-rag-qa-panel-label">Крок {active.step}</p>
              <h4 className="study-rag-qa-panel-title">{active.titleUk}</h4>
              <p className="muted small">
                Виконує: <strong>{active.actorUk}</strong>
              </p>
              <dl className="study-failure-details study-tool-calling-failure-details">
                <div className="study-failure-details-block">
                  <dt>Вхід</dt>
                  <dd>{parseLessonBold(active.inputUk)}</dd>
                </div>
                <div className="study-failure-details-block">
                  <dt>Дія</dt>
                  <dd>{parseLessonBold(active.actionUk)}</dd>
                </div>
                <div className="study-failure-details-block">
                  <dt>Вихід</dt>
                  <dd>{parseLessonBold(active.outputUk)}</dd>
                </div>
              </dl>
            </div>
          ) : (
            <p className="muted small">{STUDY_EMPTY_PANEL_UK}</p>
          )
        }
      />

      <div className="study-tool-calling-llm-code-risks">
        <h4 className="study-tool-calling-qa-gwt-title">Дві межі на практиці</h4>
        <ul className="study-tool-calling-qa-gwt-list">
          {TOOL_CALLING_RISK_EXAMPLES.map((ex) => (
            <li key={ex.id} className="lesson-callout study-tool-calling-qa-gwt-card">
              <p className="study-tool-calling-qa-gwt-card-title">{ex.titleUk}</p>
              <p className="lesson-p">{parseLessonBold(ex.bodyUk)}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="study-aside-table-wrap study-tool-calling-responsibility-table">
        <table className="study-aside-data-table study-markdown-table">
          <thead>
            <tr>
              <th scope="col">Роль</th>
              <th scope="col">Відповідальність у цьому прикладі</th>
            </tr>
          </thead>
          <tbody>
            {TOOL_CALLING_RESPONSIBILITY_ROWS.map((row) => (
              <tr key={row.roleUk}>
                <td>{row.roleUk}</td>
                <td>{parseLessonBold(row.doesUk)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
