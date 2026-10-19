import { StudyAfterInteractiveSummary } from './StudyAfterInteractiveSummary';
import { StudyTermAccent } from './StudyTermAccent';
import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';
import { HARNESS_WHY_BUNDLE } from '../../data/study/harness-study-bundles';
import type { StudyAfterInteractiveSummary as StudyAfterInteractiveSummaryData } from '../../data/study/study-teaching-card-types';

const HARNESS_OUTCOMES_SUMMARY: StudyAfterInteractiveSummaryData = {
  sectionTitleUk: 'Короткий результат навчання',
  cards: [
    {
      titleUk: 'Що може модель',
      bodyUk:
        'Модель може запропонувати прочитати звіт Playwright після падіння login_spec. Вона не відкриває файл сама.',
    },
    {
      titleUk: 'Що робить harness',
      bodyUk:
        'Код застосунку збирає запит до моделі, перевіряє дозвіл на інструмент, запускає дозволену дію та вирішує, коли завершити розслідування.',
    },
    {
      titleUk: 'Що перевіряє QA',
      bodyUk:
        'Чи інструмент справді виконався, чи повернув результат або помилку та чи висновок моделі спирається лише на отримані дані.',
    },
  ],
};

/** Блок «Що я зрозумію» для concept-04 — три інформаційні картки без панелей. */
export function StudyHarnessLearningOutcomes() {
  return (
    <div className="study-harness-outcomes-block study-harness-outcomes-cards">
      <StudyAfterInteractiveSummary summary={HARNESS_OUTCOMES_SUMMARY} />
    </div>
  );
}

/** §1 «Навіщо потрібен harness?» — вступ, підказка, наявні картки + панель. */
export function StudyHarnessWhySection() {
  return (
    <div className="study-harness-why-block">
      <div
        className="study-harness-situation lesson-callout lesson-key-idea"
        aria-label="Вихідна ситуація login_spec"
      >
        <span className="lesson-callout-label">Вихідна ситуація: login_spec</span>
        <div className="study-harness-situation-facts">
          <section className="study-harness-situation-fact" aria-label="Що відомо">
            <h3 className="study-harness-situation-fact-title">
              <StudyTermAccent>Що відомо</StudyTermAccent>
            </h3>
            <p className="study-learner-explanation study-harness-situation-fact-body">
              CI повідомив: тест зупинився під час пошуку #login-btn, бо сплив час очікування. Це
              симптом, а не встановлена причина.
            </p>
          </section>
          <section className="study-harness-situation-fact" aria-label="Чого ще не знаємо">
            <h3 className="study-harness-situation-fact-title">
              <StudyTermAccent>Чого ще не знаємо</StudyTermAccent>
            </h3>
            <p className="study-learner-explanation study-harness-situation-fact-body">
              Звіт Playwright цього запуску ще не прочитано. Ми поки не знаємо, що було на сторінці
              в момент збою і чому елемент не знайшли.
            </p>
          </section>
        </div>
        <div className="study-harness-situation-next" aria-label="Що з’ясуємо далі">
          <p className="study-harness-situation-next-title">Що з’ясуємо далі</p>
          <ul className="study-harness-situation-step-list">
            <li className="study-harness-situation-step-card">
              <p className="study-harness-situation-step-heading">Модель пропонує</p>
              <p className="study-harness-situation-step-body study-learner-explanation">
                може запропонувати прочитати звіт.
              </p>
            </li>
            <li className="study-harness-situation-step-card">
              <p className="study-harness-situation-step-heading">Код перевіряє</p>
              <p className="study-harness-situation-step-body study-learner-explanation">
                вирішує, чи дозволено читання.
              </p>
            </li>
            <li className="study-harness-situation-step-card">
              <p className="study-harness-situation-step-heading">Інструмент читає</p>
              <p className="study-harness-situation-step-body study-learner-explanation">
                після дозволу пробує відкрити файл.
              </p>
            </li>
          </ul>
        </div>
      </div>
      <StudyTeachingCardsSection bundle={HARNESS_WHY_BUNDLE} />
    </div>
  );
}
