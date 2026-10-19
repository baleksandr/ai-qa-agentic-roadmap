import type { StudyInterviewQuestion } from './study-interview-types';

export const MCP_INTERVIEW_QUESTIONS: StudyInterviewQuestion[] = [
  {
    id: 'c06-q1',
    questionUk: 'Що таке MCP в розслідуванні падіння тесту?',
    answerBriefUk:
      'MCP — протокол, через який застосунок агента може отримувати описані інструменти й дані від MCP servers.',
    answerDeepUk:
      'Після падіння login_spec застосунку може знадобитися CI-артефакт. MCP server оголошує інструмент для його отримання. Застосунок отримує опис інструмента через MCP client і може передати його моделі. Якщо модель запропонує виклик, код спершу перевірить дію. Сам MCP не встановлює причину падіння тесту й не замінює правила доступу застосунку.',
    answerBriefEn:
      'MCP is a protocol that lets an agent application access described capabilities from MCP servers.',
    answerDeepEn:
      'After login_spec fails, the application may need a CI artifact. An MCP server exposes a tool for retrieving it. The application learns about the tool through its MCP client and may show the tool description to the model. If the model proposes a call, the application checks the action first. MCP does not determine the failure’s cause or replace the application’s access rules.',
    pitfallUk: 'Називати MCP готовим агентом, який сам проводить розслідування.',
  },
  {
    id: 'c06-q2',
    questionUk: 'Чим відрізняються host, MCP client і MCP server?',
    answerBriefUk:
      'Host керує агентом. MCP client у складі host обмінюється повідомленнями із сервером. MCP server надає можливості й обробляє виклики.',
    answerDeepUk:
      'У навчальному прикладі host — застосунок для розслідування login_spec. Його harness створює run, викликає модель і перевіряє запропоновані дії. MCP client є компонентом цього застосунку для зв’язку з конкретним сервером. Умовний CI-сервер надає інструмент отримання артефакта. Називати весь harness просто “MCP client” неточно, бо його робота ширша за передавання повідомлень.',
    answerBriefEn:
      'The host runs the agent. An MCP client inside the host communicates with a server. The MCP server exposes capabilities and handles requests.',
    answerDeepEn:
      'In this example, the host is the login_spec investigation application. Its harness manages the run, calls the model, and checks proposed actions. An MCP client within that application communicates with a particular server. A CI server may expose a tool for retrieving an artifact. The whole harness is more than an MCP client.',
    pitfallUk: 'Вважати host, harness і MCP client трьома назвами одного компонента.',
  },
  {
    id: 'c06-q3',
    questionUk: 'Чи означає опис tool, що модель уже виконала дію?',
    answerBriefUk:
      'Ні. Опис повідомляє про можливу дію. Пропозиція моделі також ще не є її виконанням.',
    answerDeepUk:
      'Сервер оголосив інструмент read_artifact. Застосунок може передати моделі його опис. Модель запропонувала прочитати звіт login_spec. Лише після перевірки аргументів і доступу код надсилає виклик через MCP client. Сервер може повернути дані або помилку. До успішного результату модель не може називати вміст звіту побаченим фактом.',
    answerBriefEn:
      'No. A tool description lists an available capability, and a model’s proposed call is not execution.',
    answerDeepEn:
      'The server describes a tool such as read_artifact. The application may show that description to the model. If the model proposes reading the login_spec report, the application checks the arguments and access rules before sending a call through its MCP client. The server then returns data or an error. The report’s contents are not known merely because the tool was listed or proposed.',
    pitfallUk: 'Плутати discovery, пропозицію моделі та фактичний виклик інструмента.',
  },
  {
    id: 'c06-q4',
    questionUk: 'Де перевіряють право читати CI-артефакт або створювати Jira-задачу?',
    answerBriefUk:
      'Код застосунку перевіряє запропоновану дію за правилами продукту. Сервер і джерело даних можуть додатково перевіряти власний доступ.',
    answerDeepUk:
      'Застосунок може дозволити читання артефакта поточного run і відмовити в читанні чужого. Якщо він відмовив, MCP-виклику інструмента немає. Якщо дозволив, сервер усе ще може повернути помилку, бо не має доступу до CI. Створення Jira-задачі є окремою дією із записом. Для неї правила продукту можуть вимагати схвалення людини й захисту від дубля після невизначеного результату.',
    answerBriefEn:
      'The application checks the proposed action under product rules. The server and the underlying service may enforce additional access checks.',
    answerDeepEn:
      'The application may allow reading an artifact from the current run and deny access to another run’s artifact. An application-level denial prevents the tool call. Even after approval, the server may fail to read from CI. Creating a Jira issue is a separate write action that may require human approval and protection against duplicate creation after an uncertain result.',
    pitfallUk:
      'Вважати tool schema або текст prompt дозволом на будь-який артефакт і будь-яку дію.',
  },
  {
    id: 'c06-q5',
    questionUk: 'Як QA відрізнить відмову, помилку сервера й успішний результат?',
    answerBriefUk:
      'QA зіставляє пропозицію моделі, рішення застосунку, фактичний виклик і відповідь. Це різні події.',
    answerDeepUk:
      'Якщо застосунок відмовив у доступі, CI-сервер не отримує запиту на виконання інструмента. Якщо виклик відбувся, але сервер повідомив “артефакт не знайдено”, це помилка інструмента. Якщо відповідь не надійшла через timeout, це помилка зв’язку. Лише фактично повернені дані можна записати як отриманий фрагмент звіту. QA перевіряє ці події в trace й те, що наступний запит моделі відповідає реальному результату.',
    answerBriefEn:
      'QA compares the model proposal, application decision, actual call, and server response as separate events.',
    answerDeepEn:
      'If the application denies access, no tool execution request reaches the CI server. If the server responds that the artifact is missing, that is a tool error. If no response arrives before the timeout, that is a communication failure. Only data actually returned by the tool can be recorded as retrieved report content. QA checks these events and the next model request.',
    pitfallUk: 'Записувати будь-яку невдалу спробу як порожній, але успішно прочитаний звіт.',
  },
];
