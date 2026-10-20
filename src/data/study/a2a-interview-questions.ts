import type { StudyInterviewQuestion } from './study-interview-types';

export const A2A_INTERVIEW_QUESTIONS: StudyInterviewQuestion[] = [
  {
    id: 'c08-q1',
    questionUk: 'Навіщо A2A у прикладі з QA- і dev-сервісами?',
    answerBriefUk:
      'Щоб передати задачу та отримати стан або результат між застосунками, коли агенти не живуть в одному процесі. A2A задає Message, Task, статус і результат; HTTP з JSON — один із способів доставки, а не заміна всього REST світом.',
    answerBriefEn:
      'Use A2A when agents run in separate apps and need a shared way to delegate work and read status or results. A2A defines messages, tasks, status, and artifacts; HTTP with JSON is one supported transport, not a claim that A2A replaces every REST API.',
    answerDeepUk:
      'Після login_spec Investigation Agent у QA-сервісі збирає факти про timeout на #login-btn і, за дозволу, фрагмент звіту. Coding Agent у dev-сервісі не бачить ці дані автоматично. Код QA-сервісу формує задачу ABC-123 і надсилає її через A2A client. Протокол описує, як виглядає обмін повідомленнями й задачами між застосунками, але не замінює внутрішню логіку кожного сервісу. Транспорт може бути HTTP з JSON за специфікацією, однак сенс A2A — спільні поняття делегування та результату, а не «просто ще один REST endpoint».',
    answerDeepEn:
      'After login_spec fails, the investigation agent in the QA service collects the timeout on #login-btn and, when allowed, a report fragment. The coding agent in the dev service does not see that data by default. QA service code builds the ABC-123 task and sends it through an A2A client. The protocol defines how apps exchange messages and tasks; it does not replace each service’s internal logic. Transport may be HTTP with JSON per the spec, but the value is shared task lifecycle semantics, not merely calling another REST URL.',
    pitfallUk:
      'Стверджувати, що A2A «замінює REST» або що він обов’язковий навіть коли обидва агенти в одному застосунку.',
  },
  {
    id: 'c08-q2',
    questionUk: 'Чим «задачу прийнято» відрізняється від готового результату?',
    answerBriefUk:
      'Прийняття означає, що виконавець почав або погодився обробити запит. Результат — фактичні дані або помилка після роботи, наприклад PatchProposal або повідомлення про брак доказів.',
    answerBriefEn:
      'Accepted means the executor agreed to handle the request or work started. A result is what actually came back afterward—a patch proposal, an error, or a message that evidence is insufficient.',
    answerDeepUk:
      'У ABC-123 dev-сервіс може швидко відповісти, що задачу прийнято, і повернути стан «виконується». Це ще не означає, що Coding Agent знайшов причину падіння або підготував patch. Код QA-сервісу має відстежувати стан і чекати результат задачі. UI не повинен показувати «зміну готово» після самого прийняття. Якщо результат — PatchProposal, його ще перевіряють review і CI.',
    answerDeepEn:
      'For ABC-123 the dev service may quickly acknowledge the task and return a running status. That does not mean the coding agent found the root cause or produced a patch. QA service code should poll or wait for the task result. The UI must not show “fix ready” on acceptance alone. If the result is a patch proposal, review and CI still validate it.',
    pitfallUk:
      'Показувати користувачу завершення workflow лише тому, що виконавець прийняв запит.',
  },
  {
    id: 'c08-q3',
    questionUk: 'Що описує Agent Card і чого вона не гарантує?',
    answerBriefUk:
      'Картка описує можливості агента та адресу, куди звертатися. Вона не підтверджує довіру до адреси, не дає доступу до даних і не замінює автентифікацію відправника.',
    answerBriefEn:
      'The card describes what an agent supports and where to reach it. It does not prove the endpoint is trustworthy, grant data access, or replace sender authentication.',
    answerDeepUk:
      'Перед надсиланням задачі QA-сервіс може прочитати Agent Card Coding Agent: які типи задач приймаються і який інтерфейс доступний. Це допомагає сформувати коректне повідомлення. Якщо хтось підсунув картку з чужою адресою, задача може піти не туди. Тому код звіряє довірене джерело опису й автентичність з’єднання. Наявність картки не означає, що будь-який текст у повідомленні можна виконувати без перевірок.',
    answerDeepEn:
      'Before delegating, the QA service may read the coding agent’s card to learn supported task types and the endpoint. That helps shape the message. If an attacker supplies a card with a wrong address, work may go to the wrong app. Code must verify trusted discovery and connection authenticity. Having a card does not mean every claim in the message should be executed without checks.',
    pitfallUk:
      'Вважати Agent Card доказом надійності або дозволом на будь-яку дію з репозиторієм.',
  },
  {
    id: 'c08-q4',
    questionUk: 'Хто перевіряє доступ до даних і інструментів?',
    answerBriefUk:
      'Код кожного застосунку: QA-сервіс перед відправкою, dev-сервіс при прийомі та перед інструментами Coding Agent. A2A не надає автоматичного права запису в репозиторій.',
    answerBriefEn:
      'Each app’s code: the QA service before send, the dev service on receive and before tools run. A2A does not automatically grant repository write access.',
    answerDeepUk:
      'Investigation Agent може запропонувати readPlaywrightReport, але код QA-сервісу вирішує, чи дозволено читання артефакта цього CI запуску. При формуванні A2A-задачі код не включає секрети в текст для моделі. Dev-сервіс перевіряє, чи посилання на доказ належить ABC-123 і дозволеному клієнту, перед тим як Coding Agent читає код або готує patch. Публікація зміни — окрема операція з власними правилами.',
    answerDeepEn:
      'The investigation agent may suggest reading a report, but QA service code decides whether that CI artifact is allowed. When building the A2A task, code must not embed secrets in model-visible text. The dev service checks evidence references against ABC-123 and tenant rules before the coding agent reads code or drafts a patch. Publishing a change is a separate permissioned step.',
    pitfallUk:
      'Думати, що успішний A2A-обмін сам надає Coding Agent право змінювати віддалений репозиторій.',
  },
  {
    id: 'c08-q5',
    questionUk: 'Що робить QA, коли dev-сервіс недоступний?',
    answerBriefUk:
      'Перевіряє, що помилка зв’язку видима в trace, не маскується під успішну передачу, і що система не вигадує результат або patch.',
    answerBriefEn:
      'Verify the connectivity failure is visible in traces, is not shown as success, and the system does not fabricate a result or patch.',
    answerDeepUk:
      'У тесті QA-сервіс намагається надіслати задачу ABC-123, але A2A server недоступний або повертає помилку мережі. Очікування: користувач і оператор бачать відмову, workflow не позначає coding задачу виконаною, не з’являється фальшивий PatchProposal. Окремо перевіряють повтор після timeout: повтор не повинен мовчки дублювати небезпечну дію запису, якщо перша спроба могла виконатися.',
    answerDeepEn:
      'In a test the QA service tries to delegate ABC-123 but the A2A server is down or the network fails. Expect a clear failure—no “success” handoff, no fake patch, workflow not marked complete. Also test retry after timeout: a retry must not silently duplicate a dangerous write if the first attempt might have succeeded.',
    pitfallUk:
      'Тестувати лише happy path і приймати відсутність відповіді за «доказів для patch немає».',
  },
];
