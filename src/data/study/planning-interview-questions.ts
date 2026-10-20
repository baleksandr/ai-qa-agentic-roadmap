import type { StudyInterviewQuestion } from './study-interview-types';

export const PLANNING_INTERVIEW_QUESTIONS: StudyInterviewQuestion[] = [
  {
    id: 'c11-q1',
    questionUk: 'Навіщо агенту план під час розслідування?',
    answerBriefUk:
      'План допомагає визначити наступні перевірки та їхню мету. Після нових даних його можна змінити.',
    answerBriefEn:
      'A plan identifies useful next checks and their purpose. It can change when new evidence arrives.',
    answerDeepUk:
      'CI повідомив, що login_spec не дочекався #login-btn. Агент може спланувати перевірку звіту поточного запуску, а за потреби — доступного trace. План не стверджує, що причиною став селектор, і не означає, що звіт уже прочитали. Коли інструмент поверне дані або помилку, наступні кроки можна переглянути.',
    answerDeepEn:
      'CI reports that login_spec timed out waiting for #login-btn. The agent may plan to inspect the current run’s report and, if needed, an available trace. This does not prove the cause or mean the report has already been read. The next steps can change after a tool result or error.',
    pitfallUk: 'Сприймати заплановане читання звіту як уже отриманий доказ.',
  },
  {
    id: 'c11-q2',
    questionUk: 'Хто перевіряє кроки плану?',
    answerBriefUk:
      'Код може перевірити форму й допустимість плану. Перед кожною конкретною дією він окремо перевіряє інструмент, аргументи та доступ.',
    answerBriefEn:
      'Code may validate the plan’s structure and allowed step types. Before each actual action, it separately checks the tool, arguments, and access.',
    answerDeepUk:
      'У навчальному прикладі модель повертає структурований план. Harness відхиляє некоректний формат або невідомий тип кроку. Якщо пізніше модель пропонує readPlaywrightReport, код перевіряє, чи доступний інструмент і чи дозволено читати саме цей артефакт. Навіть прийнятий план не дає права відкрити файл іншого run.',
    answerDeepEn:
      'In our example, the model returns a structured plan. The harness rejects malformed data or unknown step types. When the model later proposes readPlaywrightReport, code checks the tool and access to the specific artifact. Accepting the plan does not authorize reading another run’s file.',
    pitfallUk: 'Вважати перевірку форми плану достатнім дозволом для всіх майбутніх викликів інструментів.',
  },
  {
    id: 'c11-q3',
    questionUk: 'Коли потрібно переглянути план?',
    answerBriefUk:
      'Коли фактичний результат змінює наступний доречний крок: з’явився доказ, даних не вистачило або інструмент повернув помилку.',
    answerBriefEn:
      'Revisit the plan when an actual result changes the useful next step: evidence appears, data is insufficient, or a tool fails.',
    answerDeepUk:
      'Агент планував прочитати Playwright-звіт і зробити висновок. Якщо звіт повернув потрібний фрагмент, агент зіставляє його з гіпотезою. Якщо результат порожній, може знадобитися інше дозволене джерело. Якщо файл не знайдено, не можна робити висновок із його уявного вмісту. Код вирішує, чи продовжувати run, за правилами продукту.',
    answerDeepEn:
      'The agent planned to read a Playwright report and draw a conclusion. A useful excerpt may support or challenge a hypothesis. An empty result may call for another allowed source. A read error means the report’s contents are unavailable. Product rules determine whether the run continues.',
    pitfallUk: 'Продовжувати початковий план так, ніби всі попередні кроки успішно виконалися.',
  },
  {
    id: 'c11-q4',
    questionUk: 'Чим план відрізняється від trace?',
    answerBriefUk:
      'План описує намічені кроки. Trace записує пропозиції, рішення коду й те, що справді відбулося.',
    answerBriefEn:
      'A plan describes intended steps. A trace records proposals, code decisions, and what actually happened.',
    answerDeepUk:
      'У плані є «прочитати Playwright-звіт». Модель запропонувала виклик, але код відмовив через шлях до чужого артефакта. У trace мають бути пропозиція й причина відмови, але не має бути події успішного читання. QA звіряє підсумок агента саме з фактичними результатами, а не лише з планом.',
    answerDeepEn:
      'The plan says “read the Playwright report,” but the model proposes a path to another run’s artifact. Code denies the call. The trace should show the proposal and denial, with no successful read event. QA checks the conclusion against actual results rather than the plan alone.',
    pitfallUk: 'Позначати крок «виконано» лише тому, що він є в плані.',
  },
  {
    id: 'c11-q5',
    questionUk: 'Як QA перевіряє зациклення перепланувань?',
    answerBriefUk:
      'Підставляє повторювані плани й результати без нового доказу та перевіряє, що код завершує run за встановленою межею.',
    answerBriefEn:
      'QA supplies repeated plans and results with no new evidence, then checks that code stops the run at its configured limit.',
    answerDeepUk:
      'Підставна модель знову й знову пропонує прочитати той самий звіт. Інструмент повертає ту саму помилку. QA рахує пропозиції, фактичні виклики й причину завершення. Продукт може мати окремий ліміт перепланувань або загальний ліміт кроків. Після зупинки не повинно бути нових викликів, а UI не має показувати ліміт як знайдену причину падіння тесту.',
    answerDeepEn:
      'A mock model repeatedly proposes reading the same report, and the tool repeatedly returns the same error. QA counts proposals and actual calls, then checks the stop reason. The product may use a dedicated replanning limit or an overall step limit. No calls occur after the stop, and the UI does not present the limit as the test’s root cause.',
    pitfallUk: 'Сподіватися, що модель сама перестане пропонувати однакові кроки.',
  },
];
