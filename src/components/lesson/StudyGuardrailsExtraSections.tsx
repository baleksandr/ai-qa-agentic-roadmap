import { Link } from 'react-router-dom';
import { getMapLabel } from '../../data/learning-map.registry';
import {
  GUARDRAILS_DATA_TRANSFER_HINTS,
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
import { StudyEnrichedCardList } from './StudyEnrichedCardList';
import { StudyGuardrailsObservability } from './StudyGuardrailsObservability';
import { StudySplitHintPanel } from './StudySplitHintPanel';
import { LessonRichParagraphs } from './lessonRichText';

export { StudyGuardrailsObservability };

export function StudyGuardrailsDataTransfer() {
  return (
    <StudySplitHintPanel
      leadUk="Між LLM, policy і executor летять не «думки», а **конкретні структури даних**. Оберіть крок ліворуч — поруч розбір і навчальний приклад."
      introUk="Ланцюг: пропозиція дії від моделі → verdict policy engine → лише після цього sanitized результат у context для наступного кроку LLM."
      items={GUARDRAILS_DATA_TRANSFER_HINTS}
      listAriaLabel="Кроки передачі даних"
    />
  );
}

export function StudyGuardrailsFailureModes() {
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
    <StudySplitHintPanel
      leadUk="Як SDET перевіряє guardrails: не лише happy path, а **навмисні зловживання** і крайові випадки."
      introUk="Оберіть сценарій ліворуч — поруч що перевіряти, як запускати й що шукати в trace. Англійська назва внизу — термін курсу."
      items={GUARDRAILS_QA_TESTS_HINTS}
      listAriaLabel="Сценарії тестування guardrails"
    />
  );
}

export function StudyGuardrailsSecurity() {
  return (
    <StudySplitHintPanel
      leadUk="Guardrails — **основний security-шар** агента: не фраза в промпті, а код і інфраструктура навколо кожного tool call."
      introUk="Чотири принципи з уроку. Оберіть принцип ліворуч — поруч пояснення для дизайну й перевірок QA."
      items={GUARDRAILS_SECURITY_HINTS}
      listAriaLabel="Принципи security"
    />
  );
}

export function StudyGuardrailsProduction() {
  return (
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
  );
}

export function StudyGuardrailsRemember({ sourceText }: { sourceText?: string }) {
  return (
    <aside className="lesson-callout lesson-key-idea study-remember-rich">
      <span className="lesson-callout-label">Що варто запам’ятати</span>
      <LessonRichParagraphs text={GUARDRAILS_REMEMBER_UK} className="lesson-p" />
      {sourceText?.trim() && (
        <p className="study-step-source muted small">{sourceText.replace(/\s+/g, ' ').trim()}</p>
      )}
    </aside>
  );
}
