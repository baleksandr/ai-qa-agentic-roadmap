import type { StudyInterviewQuestion } from './study-interview-types';

export const AGENTIC_WORKFLOWS_INTERVIEW_QUESTIONS: StudyInterviewQuestion[] = [
  {
    id: 'c16-q1',
    questionUk: 'Що передають від Investigation Agent до Coding Agent?',
    answerBriefUk:
      'Потрібний для задачі результат розслідування: підтверджені факти, посилання на докази, непідтверджені гіпотези й статус. Не обов’язково весь чат.',
    answerBriefEn:
      'The relevant investigation result: confirmed observations, evidence references, unconfirmed hypotheses, and status. The full chat is not required by default.',
    answerDeepUk:
      'Для ABC-123 Agent A повідомляє, що login_spec не дочекався #login-btn. Якщо він успішно прочитав Playwright-звіт, у результаті є конкретне спостереження та посилання на його джерело. Якщо читання не вдалося, передає помилку й зазначає, що причина не підтверджена. Agent B отримує лише потрібні й дозволені дані. Формат передачі визначає продукт: це може бути структурований об’єкт або інший формат із чітким контрактом.',
    answerDeepEn:
      'For ABC-123, Agent A reports the login_spec timeout and any observations supported by an actual Playwright report result. A read error is passed as an error, not as evidence. Agent B receives the relevant permitted context through a product-defined handoff contract, which does not have to be JSON.',
    pitfallUk:
      'Передавати лише речення «причину знайдено» без доказу або, навпаки, весь чат із зайвими даними.',
  },
  {
    id: 'c16-q2',
    questionUk: 'Чим agentic workflow відрізняється від orchestration?',
    answerBriefUk:
      'Workflow описує пов’язані задачі й результати між ними. Orchestration керує їхнім запуском, залежностями та переходами.',
    answerBriefEn:
      'A workflow describes connected tasks and their outputs. Orchestration manages their execution, dependencies, and transitions.',
    answerDeepUk:
      'Маршрут ABC-123 містить investigation, можливу підготовку зміни й перевірку CI. Це сценарій workflow. Код визначає, коли Playwright-звіт готовий, чи є підстава запускати Coding Agent і до якої revision належить результат CI. Це orchestration. Обидві ролі може реалізовувати один застосунок.',
    answerDeepEn:
      'The ABC-123 scenario connects investigation, a possible code change, and CI verification. That is the workflow. Code deciding when the report is ready, whether the coding task may start, and which revision CI checked is orchestration. Both responsibilities may live in one application.',
    pitfallUk:
      'Вважати, що workflow — це обов’язково кілька агентів, а orchestration — обов’язково окремий сервер.',
  },
  {
    id: 'c16-q3',
    questionUk: 'Коли можна передати задачу Coding Agent?',
    answerBriefUk:
      'Коли результат investigation і правила продукту дають підставу підготувати конкретну зміну. Сам timeout не доводить причину.',
    answerBriefEn:
      'When the investigation result and product rules justify a specific change. A timeout alone does not prove its cause.',
    answerDeepUk:
      'CI повідомив про timeout на #login-btn. Agent A перевіряє доступні артефакти. Якщо фактичний результат підтверджує проблему, workflow може передати Agent B задачу з посиланням на доказ. Якщо звіт недоступний і іншого доказу немає, Agent B не отримує команду «виправ селектор» як встановлену причину. Продукт може вибрати іншу перевірку або передати випадок людині.',
    answerDeepEn:
      'CI reports a timeout on #login-btn. Agent A checks available artifacts. When the actual result supports a specific problem, the workflow can give Agent B a task with evidence references. If the report is unavailable and no other evidence exists, the workflow must not present “fix the selector” as a proven diagnosis.',
    pitfallUk: 'Автоматично запускати виправлення після будь-якого failed тесту.',
  },
  {
    id: 'c16-q4',
    questionUk: 'Як QA перевіряє контракт передачі між агентами?',
    answerBriefUk:
      'Перевіряє, що Agent B отримує дані правильного run у погодженому форматі, а відсутні поля та недоступні докази викликають явну помилку.',
    answerBriefEn:
      'QA checks that Agent B receives the right run’s data in the agreed format, while missing fields or inaccessible evidence cause explicit errors.',
    answerDeepUk:
      'QA дає системі валідний результат Agent A, а потім варіанти з відсутнім обов’язковим полем, неправильним типом і посиланням на чужий звіт. Перевіряє producer і consumer разом: помилку формату не можна трактувати як «причину підтверджено» або «доказів немає». Якщо продукт підтримує кілька редакцій контракту, сумісність перевіряють для заявлених версій.',
    answerDeepEn:
      'QA tests a valid Agent A output, then outputs with a missing required field, a wrong type, and a reference to another run’s report. Producer and consumer are tested together. A contract error must not be treated as confirmed evidence or silently converted into “no evidence.” Supported contract versions are tested explicitly.',
    pitfallUk:
      'Вважати будь-який вільний текст достатньою передачею, хоча наступний етап очікує конкретні поля та їхній зміст.',
  },
  {
    id: 'c16-q5',
    questionUk: 'Що робити, якщо CI не підтвердив зміну Agent B?',
    answerBriefUk:
      'Позначити перевірку цієї revision невдалою, зберегти результат CI й обрати наступний крок за правилами workflow.',
    answerBriefEn:
      'Mark that revision’s verification as failed, retain the CI result, and follow the workflow’s rules for the next step.',
    answerDeepUk:
      'Agent B підготував revision B. CI запустив login_spec саме для B, і тест знову впав. Workflow не пише «виправлено» лише тому, що код змінили. Він передає фактичний CI результат для подальшого аналізу. Якщо Agent B створить revision C, попередній CI запуск не стане перевіркою C. Подальший retry, нова зміна або рішення людини залежать від правил продукту.',
    answerDeepEn:
      'Agent B creates revision B, and CI runs login_spec against B. If the test still fails, the workflow does not mark the issue fixed. It retains the actual CI result for the next decision. If revision C is created, the earlier CI run does not validate C. Further retries, changes, or human decisions follow product rules.',
    pitfallUk:
      'Позначати задачу завершеною за фактом створення patch, не звіривши CI з конкретною revision.',
  },
];
