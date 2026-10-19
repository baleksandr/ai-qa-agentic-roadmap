import type { StudyInterviewQuestion } from './study-interview-types';

export const FINE_TUNING_INTERVIEW_QUESTIONS: StudyInterviewQuestion[] = [
  {
    id: 'c13-q1',
    questionUk: 'Чи замінить fine-tuning пошук у postmortem?',
    answerBriefUk:
      'Ні. Fine-tuning може навчити модель, як використовувати знайдені дані, але не надає їй автоматичного доступу до актуальних postmortem.',
    answerBriefEn:
      'No. Fine-tuning can teach the model how to use retrieved information, but it does not give it automatic access to current postmortems.',
    answerDeepUk:
      'Якщо після падіння login_spec потрібен postmortem команди, застосунок має знайти дозволений документ і передати доречний фрагмент моделі. Fine-tuning може допомогти моделі послідовно відокремлювати факт із документа від гіпотези. Навіть коли сховище документів оновлене, пошук може не знайти потрібний фрагмент, тому його наявність у відповіді потрібно перевіряти.',
    answerDeepEn:
      'After login_spec fails, the application must retrieve an allowed postmortem and pass the relevant excerpt to the model. Fine-tuning may help the model distinguish a documented fact from a hypothesis. Retrieval still has to find the right excerpt, so its presence in the model’s input must be checked.',
    pitfallUk: 'Вважати, що модель дізнається про нові інциденти тільки тому, що її колись донавчили на старих прикладах.',
  },
  {
    id: 'c13-q2',
    questionUk: 'Коли спершу варто змінити prompt, а коли оцінювати fine-tuning?',
    answerBriefUk:
      'Спершу перевіряють, чи зрозуміла інструкція та чи є потрібні факти. Fine-tuning оцінюють, коли вимірювана помилка повторюється на багатьох схожих задачах після цих перевірок.',
    answerBriefEn:
      'First check whether the instruction is clear and the required facts are available. Consider fine-tuning when a measurable error persists across many similar cases.',
    answerDeepUk:
      'Якщо модель змішує факт із гіпотезою, бо формат відповіді взагалі не визначений, команда уточнює prompt і порівнює результати на тих самих контрольних випадках. Якщо модель не бачила Playwright-звіт, потрібно передати фактичний результат читання. Коли ці проблеми усунено, але поведінка все ще систематично не відповідає вимогам, можна перевірити кандидата після fine-tuning на окремих випадках.',
    answerDeepEn:
      'If the prompt never asks the model to separate facts from hypotheses, clarify it and compare results on the same test cases. If the report is missing, provide the actual tool result. If a measurable behavior problem remains across many cases, evaluate a fine-tuned candidate on held-out cases.',
    pitfallUk: 'Починати навчання, щоб виправити відсутній файл або нечітке формулювання задачі.',
  },
  {
    id: 'c13-q3',
    questionUk: 'Що fine-tuning змінює в розслідуванні login_spec?',
    answerBriefUk:
      'Він може змінити типову поведінку моделі у відповідях. Він не читає звіт поточного run і не надає прав на виклик інструментів.',
    answerBriefEn:
      'It can change the model’s typical response behavior. It does not read the current run’s report or grant permission to use tools.',
    answerDeepUk:
      'На прикладах модель можуть навчити стабільніше подавати «симптом → гіпотези → перевірки». Під час нового run код окремо передає повідомлення CI, перевіряє пропозицію readPlaywrightReport і викликає інструмент лише за дозволу. Конкретний спосіб fine-tuning залежить від платформи: це можуть бути змінені параметри моделі або навчений адаптер.',
    answerDeepEn:
      'Training examples may encourage a consistent “symptom → hypotheses → checks” response. In a new run, the application still provides the CI message, validates any proposed report read, and invokes the tool only when allowed. The training method may update model parameters or use an adapter, depending on the platform.',
    pitfallUk: 'Плутати навчену манеру відповіді з доступом до файлів чи зовнішніх систем.',
  },
  {
    id: 'c13-q4',
    questionUk: 'Як довести, що fine-tuning справді допоміг?',
    answerBriefUk:
      'Порівняти кандидатну та початкову версії на однакових випадках, які не використовували для навчання, і перевірити також небажані регресії.',
    answerBriefEn:
      'Compare the candidate and baseline on the same held-out cases, and check for unwanted regressions.',
    answerDeepUk:
      'Підготуй випадок, де відомий лише timeout на #login-btn, випадок з отриманим фрагментом звіту і випадок із помилкою читання. Порівняй, чи версії відрізняють факт від припущення, не вигадують вміст файла та пропонують доречну перевірку. Окремо перевір, чи кандидат не став частіше пропонувати ризикові дії. Один красивий підсумок не доводить покращення.',
    answerDeepEn:
      'Use cases with only a timeout, with an actual report excerpt, and with a read error. Compare whether both versions separate facts from hypotheses, avoid invented file contents, and suggest useful checks. Also look for an increase in risky tool proposals. One polished answer is not enough evidence.',
    pitfallUk: 'Оцінювати кандидата лише на прикладах, які використали для його навчання.',
  },
  {
    id: 'c13-q5',
    questionUk: 'Що робити, якщо нова версія погіршила відповіді після випуску?',
    answerBriefUk:
      'Встановити, які run використовували нову версію, зупинити її використання за процедурою продукту й перевірити повернення попередньої версії.',
    answerBriefEn:
      'Identify which runs used the new version, stop using it under the product’s release procedure, and verify the return to the previous version.',
    answerDeepUk:
      'Припустімо, нова версія частіше називає застарілий селектор доведеною причиною, хоча бачила лише повідомлення CI. Команда порівнює записи run і метрики з попередньою версією. Якщо узгоджений критерій порушено, нові run переводять на попередню перевірену версію. QA перевіряє фактичну версію нових run і сумісність із поточними інструкціями та інструментами.',
    answerDeepEn:
      'Suppose the new version more often claims an outdated selector is the proven cause when it saw only the CI message. The team compares run records and metrics against the baseline. If a release criterion fails, new runs return to the previously validated version. QA verifies the version used by new runs and its compatibility with current instructions and tools.',
    pitfallUk: 'Вважати, що запис у model registry сам перемикає робочий застосунок на іншу версію.',
  },
];
