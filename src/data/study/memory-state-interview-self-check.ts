import type { StudyInterviewDeck, StudyInterviewQuestion } from './study-interview-types';

const MEMORY_STATE_INTERVIEW_QUESTIONS: StudyInterviewQuestion[] = [
  {
    id: 'c01-q1',
    questionUk: 'Чим відрізняються state і memory?',
    answerBriefUk:
      'State описує поточне розслідування. Memory містить відомості з минулого, які можна використати пізніше.',
    answerDeepUk:
      'Після падіння login_spec код створює окремий run. У його state записує повідомлення CI, виконані кроки, результати інструментів і статус. Якщо звіт не вдалося прочитати, у state цього run зберігають помилку читання.\n\nУ memory може бути примітка про схоже падіння минулого тижня. Вона може підказати наступну перевірку, але не доводить причину сьогоднішнього збою. Код має позначати, звідки походить кожна інформація.',
    answerBriefEn:
      'State tracks the current investigation. Memory stores information from earlier work that may be reused later.',
    answerDeepEn:
      'After login_spec fails, the application creates a run. Its state records the CI message, completed steps, tool results, and status. A report read error belongs to this run’s state. Memory might contain a note about a similar failure last week. That note may suggest what to check, but it does not prove the cause of today’s failure.',
    pitfallUk: 'Називати стару примітку фактом із поточного звіту.',
  },
  {
    id: 'c01-q2',
    questionUk: 'Хто вирішує, які дані побачить модель?',
    answerBriefUk:
      'Код застосунку готує запит. Context builder вибирає дані поточного run і дозволені відомості з memory.',
    answerDeepUk:
      'Перед кожним зверненням до моделі код складає новий запит. Наприклад, після читання Playwright-звіту він додає фактично отриманий фрагмент або повідомлення про помилку. Якщо історія завелика, код може вибрати важливі повідомлення чи підготувати стислий виклад. Модель бачить лише те, що потрапило в цей запит. Тому QA перевіряє сам підготовлений запит, а не припускає, що модель автоматично знає всю історію.',
    answerBriefEn:
      'The application prepares the request. Its context builder selects current run data and permitted memory for the model.',
    answerDeepEn:
      'Before each model call, the application builds a new request. After reading a Playwright report, it adds the actual result or the read error. If the history is too large, it may select important messages or summarize earlier ones. The model only sees the data included in that request. QA should inspect the prepared request to verify what the model actually received.',
    pitfallUk: 'Вважати, що вся попередня історія автоматично доступна моделі.',
  },
  {
    id: 'c01-q3',
    questionUk: 'Для чого потрібен checkpoint?',
    answerBriefUk:
      'Checkpoint зберігає стан run, щоб продукт міг відновити розслідування після перерви, якщо така можливість реалізована.',
    answerDeepUk:
      'Припустімо, інструмент прочитав звіт login_spec, а код зберіг результат і контрольну точку. Після перезапуску застосунок може відновити ці дані. Якщо перерва сталася під час створення Jira-задачі, потрібно окремо перевірити, чи задача вже існує, перш ніж повторювати дію. Checkpoint допомагає відновити збережений стан, але сам по собі не гарантує захисту від дублювання зовнішніх дій.',
    answerBriefEn:
      'A checkpoint saves run state so the application can resume an investigation after an interruption, if recovery is supported.',
    answerDeepEn:
      'Suppose a tool reads the login_spec report and the application saves the result in a checkpoint. After a restart, it can recover that saved information. If the interruption happened while creating a Jira issue, the application must also check whether the issue was already created before repeating the write. A checkpoint helps recover state, but does not by itself prevent duplicate external actions.',
    pitfallUk: 'Очікувати відновлення того самого кроку, коли checkpoint не збережено.',
  },
  {
    id: 'c01-q4',
    questionUk: 'Як memory може зашкодити новому розслідуванню?',
    answerBriefUk:
      'У новий запит може потрапити застаріла, недоречна або чужа примітка. Вона здатна спрямувати висновок у хибний бік або розкрити чужі дані.',
    answerDeepUk:
      'У клієнта А є приватна примітка про попереднє падіння login_spec. Клієнт Б починає власне розслідування тесту з такою самою назвою. Context builder не повинен додати примітку клієнта А до запиту клієнта Б. Навіть якщо стара примітка дозволена, її потрібно подавати як підказку з минулого. Поточну причину підтверджують даними поточного run.',
    answerBriefEn:
      'Old, irrelevant, or unauthorized memory can mislead the investigation or expose another user’s data.',
    answerDeepEn:
      'Client A has a private note about an earlier login_spec failure. Client B starts a separate investigation of a test with the same name. The context builder must not include Client A’s private note in Client B’s request. Even when an old note is permitted, it remains historical context. Evidence from the current run is needed to confirm the current cause.',
    pitfallUk: 'Перевіряти лише відповідь моделі й не переглядати дані, які їй передали.',
  },
  {
    id: 'c01-q5',
    questionUk: 'Що QA перевіряє в state, запиті моделі та trace?',
    answerBriefUk:
      'QA звіряє фактичну подію, збережений результат і дані, передані моделі. Вони не повинні суперечити одне одному.',
    answerDeepUk:
      'Припустімо, читання звіту login_spec завершилося помилкою “Файл не знайдено”. QA перевіряє, що в state записано помилку. Якщо модель викликали повторно, у запиті до неї теж має бути повідомлення про помилку, а не вигаданий фрагмент звіту. У trace QA знаходить події цього run і причину його завершення. Якщо історію скоротили, важлива помилка не повинна непомітно перетворитися на успішне читання.',
    answerBriefEn:
      'QA compares the actual event, the stored result, and the data sent to the model. They must tell a consistent story.',
    answerDeepEn:
      'Suppose reading the login_spec report returns a ‘File not found’ error. QA checks that state stores the error. If the model is called again, its request must contain the error, not an invented report excerpt. The trace should show the events of this run and why it ended. If history was shortened, the read error must not silently become a successful result.',
    pitfallUk: 'Оцінювати лише фінальну відповідь і не перевіряти, які факти були доступні моделі.',
  },
];

export const MEMORY_STATE_INTERVIEW_DECK: StudyInterviewDeck = {
  deckId: 'concept-01-memory-interview',
  headingUk: 'Перевір себе перед співбесідою',
  leadUk:
    'Сформулюйте відповідь своїми словами, потім натисніть «Показати відповідь». У відповіді — чотири окремі блоки українською та англійською, потім типова помилка. Позначки зберігаються лише в цьому браузері.',
  answerBriefLabelUk: 'Коротко українською',
  answerDeepLabelUk: 'Докладніше українською',
  answerBriefEnLabelUk: 'Short answer in English',
  answerDeepEnLabelUk: 'Detailed answer in English',
  pitchHeadingUk: 'Цільна відповідь для співбесіди, приблизно 30–45 секунд',
  pitchUk:
    '[[State]] — це перебіг поточного розслідування: кроки, результати інструментів і статус. [[Memory]] зберігає відомості з минулого, які можна повторно використати за правилами доступу. Context builder бере потрібні дані та готує запит моделі, тому модель не читає сховища сама. Після падіння login_spec я як QA перевірив би, чи результат читання звіту потрапив до правильного run, чи чужа memory не потрапила в запит і чи можна безпечно відновити роботу після перерви, якщо продукт підтримує checkpoint.',
  pitchEn:
    'State tracks the current investigation, including its steps, tool results, and status. Memory stores information from earlier work that may be reused under access rules. The context builder selects the data sent to the model, so the model does not read storage on its own. After a login_spec failure, I would check that the report result belongs to the correct run, that another user’s memory is excluded from the model request, and that recovery works safely if the product supports checkpoints.',
  questions: MEMORY_STATE_INTERVIEW_QUESTIONS,
  nextLinkCtaUk: 'Перейти до теми ↗',
  nextLinks: [
    {
      to: '/topic/concept-04/study',
      label: 'Agent Harness',
      hintUk: 'Як код керує run, інструментами й результатами.',
    },
    {
      to: '/topic/concept-03/study',
      label: 'RAG',
      hintUk: 'Як застосунок знаходить фрагменти джерел і передає їх моделі.',
    },
  ],
};
