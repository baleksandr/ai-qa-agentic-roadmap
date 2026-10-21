import { Link } from 'react-router-dom';
import { getMapLabel } from '../../data/learning-map.registry';
import {
  GUARDRAILS_INTERVIEW_ANSWER_EN,
  GUARDRAILS_INTERVIEW_ANSWER_UK,
  GUARDRAILS_INTERVIEW_QUESTION_EN,
  GUARDRAILS_INTERVIEW_QUESTION_UK,
  GUARDRAILS_REMEMBER_UK,
} from '../../data/study/guardrails-extra-sections';
import { GUARDRAILS_PRODUCTION_CLOSING_UK } from '../../data/study/guardrails-production-panels';
import {
  GUARDRAILS_DATA_TRANSFER_BUNDLE,
  GUARDRAILS_FAILURE_BUNDLE,
  GUARDRAILS_LLM_CODE_BUNDLE,
  GUARDRAILS_PRODUCTION_BUNDLE,
  GUARDRAILS_QA_TESTS_BUNDLE,
  GUARDRAILS_SECURITY_BUNDLE,
  GUARDRAILS_SEQUENCE_BUNDLE,
} from '../../data/study/guardrails-study-bundles';
import { StudyGuardrailsObservability } from './StudyGuardrailsObservability';
import { StudyGuardrailsSectionTopicIntro } from './StudyGuardrailsSectionTopicIntro';
import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';
import { LessonRichParagraphs } from './lessonRichText';

export { StudyGuardrailsObservability };

const GUARDRAILS_TEACHING_CLASS =
  'study-guardrails-teaching-cards study-guardrails-sequence study-memory-state-teaching-cards study-multi-agent-teaching-cards study-agentic-workflows-teaching-cards';

/** §6 «Де код, а де LLM?» — шість етапів pipeline (картки + панель). */
export function StudyGuardrailsLlmCode() {
  return (
    <StudyTeachingCardsSection
      bundle={GUARDRAILS_LLM_CODE_BUNDLE}
      className={`${GUARDRAILS_TEACHING_CLASS} study-guardrails-llm-code`}
    />
  );
}

/** §5 «Послідовність» — три етапи tool call (вертикальні картки + панель, як Approval UI). */
export function StudyGuardrailsSequence() {
  return <StudyTeachingCardsSection bundle={GUARDRAILS_SEQUENCE_BUNDLE} className={GUARDRAILS_TEACHING_CLASS} />;
}

/** @deprecated Використовуйте StudyGuardrailsSequence */
export function StudyGuardrailsUnderHoodSequence() {
  return <StudyGuardrailsSequence />;
}

/** §4 «Що передається між компонентами?» — три етапи передачі даних. */
export function StudyGuardrailsDataTransfer() {
  return (
    <StudyTeachingCardsSection
      bundle={GUARDRAILS_DATA_TRANSFER_BUNDLE}
      className={`${GUARDRAILS_TEACHING_CLASS} study-guardrails-data-transfer`}
    />
  );
}

export function StudyGuardrailsFailureModes() {
  return (
    <StudyTeachingCardsSection
      bundle={GUARDRAILS_FAILURE_BUNDLE}
      className={`${GUARDRAILS_TEACHING_CLASS} study-guardrails-failure-modes`}
    />
  );
}

export function StudyGuardrailsQaTests() {
  return (
    <StudyTeachingCardsSection
      bundle={GUARDRAILS_QA_TESTS_BUNDLE}
      className={`${GUARDRAILS_TEACHING_CLASS} study-guardrails-qa-tests`}
    />
  );
}

export function StudyGuardrailsSecurity() {
  return (
    <StudyTeachingCardsSection
      bundle={GUARDRAILS_SECURITY_BUNDLE}
      className={`${GUARDRAILS_TEACHING_CLASS} study-guardrails-security`}
    />
  );
}

export function StudyGuardrailsProduction() {
  return (
    <>
      <StudyTeachingCardsSection
        bundle={GUARDRAILS_PRODUCTION_BUNDLE}
        className={`${GUARDRAILS_TEACHING_CLASS} study-guardrails-production study-memory-state-production`}
      />
      <aside className="lesson-callout lesson-key-idea study-guardrails-production-closing">
        <span className="lesson-callout-label">Підсумок</span>
        <LessonRichParagraphs
          text={GUARDRAILS_PRODUCTION_CLOSING_UK}
          className="lesson-p study-learner-explanation"
        />
      </aside>
    </>
  );
}

export function StudyGuardrailsConnections() {
  return (
    <div className="study-connections-block">
      <p className="study-boundary-lead">Guardrails не окремий модуль — вони вшиті в harness, tools і observability.</p>
      <dl className="study-connections-dl">
        <dt>Попередній крок</dt>
        <dd>
          <Link to="/topic/concept-16/study">{getMapLabel('concept-16')}</Link> — workflows і кроки run.
        </dd>
        <dt>Наступний крок</dt>
        <dd>
          <Link to="/topic/concept-18/study">{getMapLabel('concept-18')}</Link> — traces і метрики рішень policy.
        </dd>
      </dl>
      <p className="muted small study-connections-map">
        На карті курсу: модель, harness, state/memory, tools/MCP, RAG, A2A, <strong>guardrails</strong>, evals, observability — шари
        однієї системи. <Link to="/">Відкрити карту</Link>
      </p>
    </div>
  );
}

export function StudyGuardrailsInterview() {
  return (
    <>
      <StudyGuardrailsSectionTopicIntro sectionTitle="співбесіда" showCardsHow={false} />
    <aside className="lesson-callout lesson-interview study-interview-rich">
      <span className="lesson-callout-label">Коротка відповідь на співбесіді</span>

      <p className="study-lang-flag" aria-hidden="true">
        <span className="study-lang-badge">🇺🇦</span> Питання
      </p>
      <p className="study-interview-question">{GUARDRAILS_INTERVIEW_QUESTION_UK}</p>

      <p className="study-lang-flag" aria-hidden="true">
        <span className="study-lang-badge">🇬🇧</span> Question
      </p>
      <p className="study-interview-question muted" lang="en">{GUARDRAILS_INTERVIEW_QUESTION_EN}</p>

      <p className="study-lang-flag study-lang-flag-answer">
        <span className="study-lang-badge">🇺🇦</span> Як відповісти
      </p>
      <LessonRichParagraphs text={GUARDRAILS_INTERVIEW_ANSWER_UK} className="lesson-p" />

      <p className="study-lang-flag study-lang-flag-answer">
        <span className="study-lang-badge">🇬🇧</span> Answer
      </p>
      <p className="study-interview-answer-en" lang="en">{GUARDRAILS_INTERVIEW_ANSWER_EN}</p>
    </aside>
    </>
  );
}

export function StudyGuardrailsRemember({ sourceText }: { sourceText?: string }) {
  return (
    <>
      <StudyGuardrailsSectionTopicIntro sectionTitle="Запам'ятати" showCardsHow={false} />
    <aside className="lesson-callout lesson-key-idea study-remember-rich">
      <span className="lesson-callout-label">Що варто запам’ятати</span>
      <LessonRichParagraphs text={GUARDRAILS_REMEMBER_UK} className="lesson-p" />
      {sourceText?.trim() && (
        <p className="study-step-source muted small">{sourceText.replace(/\s+/g, ' ').trim()}</p>
      )}
    </aside>
    </>
  );
}
