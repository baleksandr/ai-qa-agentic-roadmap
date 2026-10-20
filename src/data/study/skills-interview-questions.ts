import type { StudyInterviewQuestion } from './study-interview-types';

export const SKILLS_INTERVIEW_QUESTIONS: StudyInterviewQuestion[] = [
  {
    id: 'c07-q1',
    questionUk: 'Навіщо оформлювати повторювану задачу як skill?',
    answerBriefUk:
      'Щоб зберегти доречну інструкцію для певного типу роботи й повторно використовувати її без переписування великого загального prompt.',
    answerBriefEn:
      'To reuse task-specific instructions without repeating one large general prompt.',
    answerDeepUk:
      'Після падіння login_spec агент має назвати відомий симптом, відокремити гіпотези та перевірити доступні артефакти. Цей порядок можна записати в skill для розбору тестових падінь. Коли надходить відповідна задача, агент отримує потрібну інструкцію. Чи покращує це відповіді, команда перевіряє на контрольних випадках.',
    answerDeepEn:
      'After login_spec fails, the agent should state the known symptom, separate hypotheses from facts, and check available artifacts. A skill can package these instructions for repeated use. The team still tests whether the skill improves behavior on representative cases.',
    pitfallUk: 'Вважати, що сама наявність skill доводить якість відповідей агента.',
  },
  {
    id: 'c07-q2',
    questionUk: 'Хто вибирає skill для задачі?',
    answerBriefUk:
      'Залежить від системи: вибір може виконувати застосунок, платформа або агент за доступними описами skills.',
    answerBriefEn:
      'It depends on the system: the application, platform, or agent may select a skill using its description.',
    answerDeepUk:
      'У нашому навчальному прикладі код застосунку бачить задачу «розбери падіння login_spec» й передає інструкцію для investigation. Це один можливий дизайн. В іншій реалізації середовище може надати агенту описи skills і дозволити вибір серед них. QA перевіряє фактичну поведінку конкретного продукту, а не припускає, що всюди існує окремий skill router.',
    answerDeepEn:
      'In our example, application code selects the investigation skill for the login_spec failure. Other systems may let the platform or agent choose among available skill descriptions. QA checks the mechanism implemented by the product instead of assuming every system has a separate router.',
    pitfallUk: 'Називати окремий router обов’язковим компонентом кожної системи skills.',
  },
  {
    id: 'c07-q3',
    questionUk: 'Чи дає skill право викликати інструмент?',
    answerBriefUk:
      'Ні. Інструкція може порадити перевірку, але код визначає доступні інструменти й перевіряє конкретний виклик.',
    answerBriefEn:
      'No. A skill may recommend a check, but code controls available tools and validates each call.',
    answerDeepUk:
      'Skill для розбору падіння може радити прочитати Playwright-звіт. Модель пропонує readPlaywrightReport із певними аргументами. Harness перевіряє, чи інструмент доступний, чи правильні аргументи та чи дозволено читати саме цей артефакт. Якщо шлях веде до звіту іншого run, код відмовляє незалежно від тексту skill.',
    answerDeepEn:
      'An investigation skill may suggest reading a Playwright report. The model proposes readPlaywrightReport with arguments. The harness checks tool availability, argument validity, and access to the specific artifact. A path to another run’s report is rejected even if the skill recommends reading reports.',
    pitfallUk: 'Сприймати згадку інструмента в інструкції як дозвіл виконати будь-який його виклик.',
  },
  {
    id: 'c07-q4',
    questionUk: 'Що робити, якщо skill радить інструмент, якого немає в цьому run?',
    answerBriefUk:
      'Не вигадувати результат. Агент має назвати відсутність доступної перевірки або використати іншу дозволену, якщо вона є.',
    answerBriefEn:
      'Do not invent a result. Report that the check is unavailable or use another allowed check if one exists.',
    answerDeepUk:
      'Skill радить перевірити звіт, але readPlaywrightReport не надано для поточного run. Код не викликає невідомий або недоступний інструмент. Агент може запропонувати інший наданий інструмент, наприклад читання доступного trace, або чесно сказати, що причину timeout поки не підтверджено. QA перевіряє відсутність вигаданих цитат зі звіту.',
    answerDeepEn:
      'The skill recommends checking the report, but readPlaywrightReport is unavailable in this run. The application does not execute an unavailable tool. The agent may use another allowed check or explain that the cause remains unconfirmed. QA verifies that the answer contains no invented report content.',
    pitfallUk: 'Писати «звіт показав…», коли інструмент не був доступний або не повернув даних.',
  },
  {
    id: 'c07-q5',
    questionUk: 'Як QA перевіряє зміну skill перед випуском?',
    answerBriefUk:
      'Порівнює відповіді на однакових задачах, перевіряє сумісність з інструментами та встановлює, яка редакція skill діяла для run.',
    answerBriefEn:
      'QA compares behavior on the same cases, checks tool compatibility, and identifies the skill version used by each run.',
    answerDeepUk:
      'Після зміни інструкції команда запускає випадки з одним лише повідомленням CI, з отриманим фрагментом звіту та з помилкою читання. QA перевіряє, чи агент не називає гіпотезу фактом. Якщо змінився readPlaywrightReport або інструмент MCP-сервера, окремо перевіряє назву, аргументи й обробку результату. Записи run мають давати змогу встановити застосовану редакцію інструкції, якщо продукт веде такий облік.',
    answerDeepEn:
      'After changing a skill, the team runs cases with only a CI message, with a real report excerpt, and with a read error. QA checks whether the agent keeps hypotheses separate from facts. If a local or MCP tool changed, QA also checks its name, arguments, and result handling. Run records should identify the instruction revision when the product supports version tracking.',
    pitfallUk:
      'Оцінювати лише фінальний текст і не помітити, що інструкція посилається на застарілий інструмент.',
  },
];
