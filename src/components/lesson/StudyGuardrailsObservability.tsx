import { GUARDRAILS_TOPIC_INTRO_OBSERVABILITY } from '../../data/study/guardrails-section-topic-intros';
import { POLICY_FLOW_SCHEMA_EXPLANATION_UK } from '../../data/study/policy-flow-run-scenario-intro';
import {
  GUARDRAILS_OBS_GLOSSARY_TERMS,
  GUARDRAILS_OBS_LOGGING_RULES_UK,
  GUARDRAILS_OBS_TRACE_READ_PICK,
} from '../../data/study/guardrails-observability-trace-read';
import { GUARDRAILS_OBSERVABILITY_CARDS_BUNDLE } from '../../data/study/guardrails-study-bundles';
import { StudyPolicyApprovalFlowDiagram } from './StudyPolicyApprovalFlowDiagram';
import { StudyPolicyVerdictStatusRows } from './StudyPolicyVerdictStatusRows';
import { StudyLearnerPanelRichSections } from './StudyLearnerPanelRichSections';
import { StudyPanelTerms } from './StudyPanelTerms';
import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';
import { StudyTeachingSectionTopicIntro } from './StudyTeachingSectionTopicIntro';
import { LessonRichParagraphs } from './lessonRichText';

const GUARDRAILS_TEACHING_CLASS =
  'study-guardrails-teaching-cards study-guardrails-observability-cards study-memory-state-teaching-cards';

export function StudyGuardrailsObservability() {
  return (
    <article className="study-obs-lesson study-guardrails-observability">
      <StudyTeachingSectionTopicIntro topicIntroUk={GUARDRAILS_TOPIC_INTRO_OBSERVABILITY} showCardsHow={false} />

      <aside className="lesson-callout lesson-key-idea study-obs-callout">
        <span className="lesson-callout-label">Головний принцип</span>
        <p className="lesson-p study-learner-explanation">
          Пропозиція моделі — ще не дія. <code lang="en">allow</code> — ще не успішний запис у Jira.{' '}
          <code lang="en">approval_granted</code> — ще не створений issue. Фактичне виконання та результат
          потрібно підтверджувати відповідними подіями.
        </p>
      </aside>

      <section className="study-obs-block study-harness-run-flow" aria-labelledby="obs-run-flow">
        <div
          className="study-teaching-intro-run-card study-rag-story-intro lesson-callout lesson-key-idea study-harness-run-flow-intro"
        >
          <h3 id="obs-run-flow" className="study-obs-heading study-obs-heading-in-callout">
            Схема одного run
          </h3>
          <div className="study-rag-story-intro-text">
            <LessonRichParagraphs
              text={POLICY_FLOW_SCHEMA_EXPLANATION_UK}
              className="study-rag-story-intro-text-p study-learner-explanation"
            />
          </div>
        </div>
        <StudyPolicyVerdictStatusRows />
        <StudyPolicyApprovalFlowDiagram />
      </section>

      <StudyTeachingCardsSection bundle={GUARDRAILS_OBSERVABILITY_CARDS_BUNDLE} className={GUARDRAILS_TEACHING_CLASS} />

      <section className="study-obs-block study-obs-trace-read" aria-labelledby="obs-trace-read">
        <StudyLearnerPanelRichSections sections={[GUARDRAILS_OBS_TRACE_READ_PICK]} />
      </section>

      <aside
        id="obs-logging"
        className="lesson-callout lesson-key-idea study-obs-block study-obs-logging-callout"
        aria-labelledby="obs-logging-label"
      >
        <span id="obs-logging-label" className="lesson-callout-label">
          Що не потрібно записувати в логи
        </span>
        <ul className="study-obs-qa-list study-learner-explanation study-obs-logging-list">
          {GUARDRAILS_OBS_LOGGING_RULES_UK.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="lesson-p study-learner-explanation study-obs-logging-outro">
          Дотримуючись цих правил, trace допомагає відновити послідовність подій run без копії секретів, повних звітів
          і зайвих персональних даних.
        </p>
      </aside>

      <section className="study-obs-block study-obs-glossary" aria-labelledby="obs-terms">
        <h3 id="obs-terms" className="study-obs-heading">Терміни</h3>
        <StudyPanelTerms
          hideHeading
          terms={GUARDRAILS_OBS_GLOSSARY_TERMS.map((t) => ({ label: t.termUk, text: t.bodyUk }))}
        />
        <p className="muted small study-learner-explanation study-obs-glossary-footnote">
          Якщо назви в наявному коді відрізняються, не видавай навчальні назви за фактичні назви подій системи.
        </p>
      </section>
    </article>
  );
}
