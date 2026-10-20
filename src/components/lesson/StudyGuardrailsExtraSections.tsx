import { Link } from 'react-router-dom';
import { getMapLabel } from '../../data/learning-map.registry';
import {
  GUARDRAILS_FAILURE_MODES_LIST,
  GUARDRAILS_INTERVIEW_ANSWER_EN,
  GUARDRAILS_INTERVIEW_ANSWER_UK,
  GUARDRAILS_INTERVIEW_QUESTION_EN,
  GUARDRAILS_INTERVIEW_QUESTION_UK,
  GUARDRAILS_PRODUCTION_TOPICS,
  GUARDRAILS_QA_TESTS_HINTS,
  GUARDRAILS_REMEMBER_UK,
  GUARDRAILS_SECURITY_HINTS,
} from '../../data/study/guardrails-extra-sections';
import {
  GUARDRAILS_DATA_TRANSFER_BUNDLE,
  GUARDRAILS_LLM_CODE_BUNDLE,
  GUARDRAILS_UNDER_HOOD_SEQUENCE_BUNDLE,
} from '../../data/study/guardrails-study-bundles';
import { StudyEnrichedCardList } from './StudyEnrichedCardList';
import { StudyGuardrailsObservability } from './StudyGuardrailsObservability';
import { StudySplitHintPanel } from './StudySplitHintPanel';
import { StudyGuardrailsSectionTopicIntro } from './StudyGuardrailsSectionTopicIntro';
import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';
import { LessonRichParagraphs } from './lessonRichText';

export { StudyGuardrailsObservability };

const GUARDRAILS_DATA_TRANSFER_CLASS =
  'study-guardrails-teaching-cards study-guardrails-data-transfer study-memory-state-teaching-cards study-multi-agent-teaching-cards study-agentic-workflows-teaching-cards';

/** §6 «Де код, а де LLM?» — ролі моделі, коду та людини на прикладі login_spec. */
export function StudyGuardrailsLlmCode() {
  return (
    <StudyTeachingCardsSection
      bundle={GUARDRAILS_LLM_CODE_BUNDLE}
      className="study-guardrails-teaching-cards study-guardrails-llm-code study-memory-state-teaching-cards study-multi-agent-teaching-cards study-agentic-workflows-teaching-cards"
    />
  );
}

/** §5 «Послідовність» — шість етапів від input checks до executor. */
export function StudyGuardrailsUnderHoodSequence() {
  return (
    <StudyTeachingCardsSection
      bundle={GUARDRAILS_UNDER_HOOD_SEQUENCE_BUNDLE}
      className="study-guardrails-teaching-cards study-guardrails-under-hood-sequence study-memory-state-teaching-cards study-multi-agent-teaching-cards study-agentic-workflows-teaching-cards"
    />
  );
}

/** §4 «Що передається між компонентами?» — одна послідовність із трьох карток. */
export function StudyGuardrailsDataTransfer() {
  return (
    <StudyTeachingCardsSection
      bundle={GUARDRAILS_DATA_TRANSFER_BUNDLE}
      className={`${GUARDRAILS_DATA_TRANSFER_CLASS} study-guardrails-sequence-stages`}
    />
  );
}

export function StudyGuardrailsFailureModes() {
  return (
    <>
      <StudyGuardrailsSectionTopicIntro sectionTitle="failure modes" showCardsHow={false} />
      <StudyGuardrailsFailureModesBody />
    </>
  );
}

function StudyGuardrailsFailureModesBody() {
  const cards = GUARDRAILS_FAILURE_MODES_LIST.map((mode) => ({
    id: mode.termEn,
    titleUk: mode.titleUk,
    termEn: mode.termEn,
    sections: [
      { labelUk: 'Що це', bodyUk: mode.whatUk },
      { labelUk: 'Як проявляється', bodyUk: mode.symptomUk },
      { labelUk: 'Що зробити в дизайні', bodyUk: mode.mitigationUk },
    ],
    qaUk: mode.qaUk,
  }));

  return (
    <StudyEnrichedCardList
      leadUk="Тут не «баг LLM», а збої шару політик — коду permissions, validators і policy engine."
      introUk="Шар політик — це все, що приймає рішення allow/deny/needs_approval детерміновано, до executor. Він може бути занадто м’яким (небезпечні allow), занадто жорстким (false deny), обходитися через текст у RAG/логах або роз’їжджатися між різними tools. Далі — чотири типові збої з уроку."
      cards={cards}
      listAriaLabel="Failure modes"
    />
  );
}

export function StudyGuardrailsQaTests() {
  return (
    <>
      <StudyGuardrailsSectionTopicIntro sectionTitle="Як це тестувати" />
      <StudySplitHintPanel
      leadUk="Як SDET перевіряє guardrails: не лише happy path, а **навмисні зловживання** і крайові випадки."
      introUk="Для кожного сценарію — що перевіряти, як запускати й що шукати в trace. Англійська назва внизу — термін курсу."
      items={GUARDRAILS_QA_TESTS_HINTS}
      listAriaLabel="Сценарії тестування guardrails"
    />
    </>
  );
}

export function StudyGuardrailsSecurity() {
  return (
    <>
      <StudyGuardrailsSectionTopicIntro sectionTitle="Security" />
      <StudySplitHintPanel
      leadUk="Guardrails — **основний security-шар** агента: не фраза в промпті, а код і інфраструктура навколо кожного tool call."
      introUk="Чотири принципи з уроку — пояснення для дизайну й перевірок QA."
      items={GUARDRAILS_SECURITY_HINTS}
      listAriaLabel="Принципи security"
    />
    </>
  );
}

export function StudyGuardrailsProduction() {
  return (
    <>
      <StudyGuardrailsSectionTopicIntro sectionTitle="Production considerations" showCardsHow={false} />
    <div className="study-production-block">
      <LessonRichParagraphs
        text="Guardrails живуть у реальному deploy: політики версіонуються, сервіси падають, навантаження росте — поведінка має залишатися **передбачуваною**."
        className="lesson-p study-boundary-lead"
      />
      <ul className="study-production-list">
        {GUARDRAILS_PRODUCTION_TOPICS.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
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
