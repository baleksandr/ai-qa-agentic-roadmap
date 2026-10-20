import type { StudyInterviewQuestion } from './study-interview-types';

export const MULTI_AGENT_INTERVIEW_QUESTIONS: StudyInterviewQuestion[] = [
  {
    id: 'c09-q1',
    questionUk: 'Коли після login_spec варто залучити кількох агентів?',
    answerBriefUk:
      'Коли збір доказів, підготовка зміни й перевірка потребують різних задач або прав доступу. Якщо поділ не дає користі, достатньо одного агента.',
    answerBriefEn:
      'Use multiple agents when investigation, coding, and review benefit from different tasks or permissions. One agent may be enough for a simpler case.',
    answerDeepUk:
      'Після падіння login_spec Investigation Agent може прочитати дозволений звіт і записати, що саме відомо. Coding Agent отримує задачу щодо коду, якщо для цього є підстава, і готує пропозицію зміни. Review Agent перевіряє її разом із доказами та результатами CI. Такий поділ допомагає призначити різні інструменти й права кожному етапу, але додає передачі задач і перевірки між ними. Тому його обирають за потребою продукту.',
    answerDeepEn:
      'After login_spec fails, an investigation agent can collect permitted evidence. A coding agent may then propose a change if the evidence supports a coding task. A review agent checks the patch, its rationale, and CI results. Separate roles can have separate tools and permissions, but every handoff adds work and potential failure points.',
    pitfallUk:
      'Стверджувати, що кілька агентів завжди кращі або що кожне падіння тесту повинно запускати Coding Agent.',
  },
  {
    id: 'c09-q2',
    questionUk: 'Що передати від Investigation Agent до Coding Agent?',
    answerBriefUk:
      'Ідентифікатор потрібного запуску, відомий симптом, фактично отримані докази, непідтверджені гіпотези й посилання на джерела.',
    answerBriefEn:
      'Pass the correct run ID, known symptom, actual evidence, unverified hypotheses, and references to the sources.',
    answerDeepUk:
      'Для ABC-123 недостатньо повідомлення «селектор зламався». Переданий результат має показати, що CI повідомив про timeout на #login-btn, чи вдалося прочитати звіт саме цього запуску, який фрагмент повернув інструмент і чого поки не встановлено. Coding Agent може перевірити посилання на доказ і зіставити його з кодом. Якщо читання завершилося помилкою, в результаті має бути помилка, а не вигаданий вміст звіту.',
    answerDeepEn:
      '“The selector is broken” is not a reliable handoff. For ABC-123, the next agent needs the observed timeout, the identity of the CI run, the report fragment actually retrieved, and what remains unknown. It can then compare that evidence with the code. A failed report read must be represented as an error, not as report content.',
    pitfallUk:
      'Передати впевнений переказ першого агента без статусу твердження та можливості перевірити його джерело.',
  },
  {
    id: 'c09-q3',
    questionUk: 'Хто вирішує, чи запускати Coding Agent і чи дозволяти запис?',
    answerBriefUk:
      'Код workflow вирішує маршрут за правилами продукту. Права на запис перевіряє код перед конкретною дією.',
    answerBriefEn:
      'Workflow code chooses the next stage under product rules. Code checks write permissions before the specific action.',
    answerDeepUk:
      'Investigation Agent може запропонувати наступний крок, але сам текст його висновку не видає доступу до репозиторію. Код перевіряє результат передачі й обирає: відкрити coding задачу, попросити додаткові дані або завершити розслідування. Coding Agent може читати дозволений код і підготувати локальний patch. Публікація зміни — окрема дія, якщо політика вимагає схвалення людини, код чекає його та перевіряє саме ту дію, яку схвалили. Це приклад правила продукту, а не обов’язковий процес для всіх multi-agent систем.',
    answerDeepEn:
      'An investigation agent may recommend a next step, but its message does not grant repository access. Workflow code decides whether to open a coding task, request more evidence, or stop. A coding agent may inspect code and prepare a local patch. Publishing the change is a separate action subject to permissions and, where the product requires it, human approval for that specific action.',
    pitfallUk:
      'Вважати, що напис «ти Coding Agent» у prompt надає право змінювати віддалений репозиторій.',
  },
  {
    id: 'c09-q4',
    questionUk: 'Як відрізнити гіпотезу від доведеного факту під час handoff?',
    answerBriefUk:
      'Зберегти статус кожного твердження та перевірити, чи конкретний доказ справді його підтверджує.',
    answerBriefEn:
      'Preserve the status of each claim and check whether the cited evidence actually supports it.',
    answerDeepUk:
      'Повідомлення CI про timeout — факт про результат тесту. «Селектор застарів» — можливе пояснення. Навіть якщо у handoff є посилання на звіт, це ще не доводить гіпотезу: потрібно подивитися, що містить відповідний фрагмент. Якщо доказу не вистачає, Coding Agent може запропонувати перевірку, але не повинен видавати зміну селектора за виправлення встановленої причини.',
    answerDeepEn:
      'The CI timeout is an observed test result. “The selector is outdated” is a hypothesis. A report reference alone does not prove it: the referenced content must support that claim. If it does not, the coding agent may propose another check rather than treating a selector change as a confirmed fix.',
    pitfallUk:
      'Автоматично позначати гіпотезу як доведену лише тому, що в результаті передачі є поле evidenceRef.',
  },
  {
    id: 'c09-q5',
    questionUk: 'Які збої QA перевіряє саме між агентами?',
    answerBriefUk:
      'Конфлікт двох змін, повторні передачі без прогресу та втрату статусу доказу під час handoff.',
    answerBriefEn:
      'Check conflicting edits, repeated handoffs without progress, and claims that gain a false “confirmed” status during handoff.',
    answerDeepUk:
      'QA запускає два coding завдання для однієї базової версії файла й перевіряє, що пізніша зміна не перезаписує попередню мовчки. Окремий сценарій передає задачу між агентами без нових даних: workflow має завершити повтори за правилом продукту й назвати причину зупинки. Ще один тест передає непідтверджену гіпотезу: наступний агент повинен бачити її саме як гіпотезу. У trace QA звіряє переходи, версію коду та фактично передані докази.',
    answerDeepEn:
      'QA can start two coding tasks from the same file revision and verify that neither silently overwrites the other. Another test passes a task back and forth without new evidence; the workflow should stop according to its configured rule and report why. A third test sends an unverified hypothesis through the handoff and checks that the receiving agent still sees it as unverified. The trace should show transitions, code revisions, and evidence passed between stages.',
    pitfallUk:
      'Тестувати лише фінальну відповідь, не перевіряючи переданий результат і події між агентами.',
  },
];
