import type { StudyInterviewQuestion } from './study-interview-types';

export const VECTOR_DATABASE_INTERVIEW_QUESTIONS: StudyInterviewQuestion[] = [
  {
    id: 'c15-q1',
    questionUk: 'Що повертає векторний пошук для запиту про login_spec?',
    answerBriefUk:
      'Пошук повертає фрагменти-кандидати або посилання на них. Конкретні поля результату залежать від системи.',
    answerDeepUk:
      'Агент шукає документи про timeout на #login-btn. Пошуковий компонент може повернути ідентифікатори фрагментів, відомості про джерела, оцінки близькості й сам текст, якщо це передбачено запитом та сховищем. Код отримує потрібний текст і перевіряє, що користувачу дозволено його бачити. Результат пошуку ще не є відповіддю на питання, чому впав сьогоднішній тест.',
    answerBriefEn:
      'Vector search returns candidate passages or references to them. The exact result fields depend on the system.',
    answerDeepEn:
      'For a login_spec timeout, the search component may return passage IDs, source metadata, similarity scores, and possibly text. The application obtains the needed content and enforces access rules. A retrieved passage is a candidate source, not proof of the current failure’s cause.',
    pitfallUk: 'Називати набір chunk_id, scores і metadata обов’язковим форматом кожного векторного пошуку.',
  },
  {
    id: 'c15-q2',
    questionUk: 'Чому схожий документ не доводить причину падіння тесту?',
    answerBriefUk:
      'Пошук показує схожість із запитом. Причину поточного падіння підтверджують факти поточного run.',
    answerDeepUk:
      'Старий postmortem може описувати timeout кнопки входу через затримку завантаження. Сьогодні login_spec також не дочекався #login-btn. Це причина перевірити завантаження сторінки, але не доказ, що проблема повторилася. Для висновку потрібно зіставити гіпотезу зі звітом, trace або іншими доступними даними сьогоднішнього запуску.',
    answerBriefEn:
      'Similarity suggests a useful document. Evidence from the current run is needed to establish the current cause.',
    answerDeepEn:
      'An old postmortem may describe a login button timeout caused by slow page loading. Today’s login_spec failure looks similar, so that document suggests a check. It does not prove the same cause occurred again. The agent needs evidence from today’s report, trace, or another current artifact.',
    pitfallUk: 'Подавати старий postmortem як прочитаний звіт цього запуску.',
  },
  {
    id: 'c15-q3',
    questionUk: 'Хто не допускає приватні фрагменти до моделі?',
    answerBriefUk:
      'Застосунок забезпечує правила доступу. Пошукові механізми можуть допомагати фільтрувати результати, але сама схожість не дає права читати документ.',
    answerDeepUk:
      'Припустімо, документ іншого клієнта дуже схожий на запит про login_spec. Застосунок визначає, до яких документів має доступ поточний користувач, і організовує пошук так, щоб чужий текст не потрапив до запиту мовної моделі. Це можуть забезпечувати область пошуку, фільтри й додаткові перевірки. Точна реалізація залежить від архітектури.',
    answerBriefEn:
      'The application enforces access rules. Search filters can support this, but similarity never grants permission to read a document.',
    answerDeepEn:
      'A document from another client may closely match the login_spec query. The application determines which documents the current user may access and ensures unauthorized text does not enter the model request. Search scopes, filters, and additional checks may all be involved. The exact design depends on the application.',
    pitfallUk: 'Вважати, що поле tenant у метаданих автоматично захищає документ.',
  },
  {
    id: 'c15-q4',
    questionUk: 'Як QA перевіряє якість пошуку?',
    answerBriefUk:
      'QA використовує контрольні питання з відомими доречними джерелами й перевіряє, що потрібні фрагменти доходять до запиту моделі.',
    answerDeepUk:
      'Для навчального набору QA готує питання про login_spec і заздалегідь позначає документи, які мають допомогти з відповіддю. Потім переглядає кандидатів пошуку та фактичний запит моделі. Якщо команда використовує recall@K, його рахують на цьому розміченому наборі. Після оновлення документів або embeddings результати порівнюють із попередньою версією за однакових умов.',
    answerBriefEn:
      'QA uses labeled questions with known relevant sources and checks that useful passages reach the model request.',
    answerDeepEn:
      'For a controlled set of login_spec questions, QA identifies relevant documents in advance. Then QA inspects retrieved candidates and the actual model request. If the team uses recall@K, it is calculated on this labeled set. After changes to documents or embeddings, results should be compared under the same test conditions.',
    pitfallUk:
      'Вимагати однакові chunk IDs для кожного пошуку або вважати, що recall@K відомий для кожного живого питання.',
  },
  {
    id: 'c15-q5',
    questionUk: 'Чи обов’язкова векторна база для RAG?',
    answerBriefUk:
      'Ні. RAG означає, що застосунок знаходить зовнішні матеріали й передає їх моделі. Спосіб пошуку може бути різним.',
    answerDeepUk:
      'У питаннях про точний селектор #login-btn корисним може бути пошук за словами. Для запиту, сформульованого іншими словами, може допомогти векторний пошук. Продукт може застосовувати один спосіб або поєднувати кілька. У кожному випадку застосунок має передати моделі дозволені джерела й перевірити, чи відповідь на них спирається.',
    answerBriefEn: 'No. RAG retrieves external material for the model. It does not require a vector database.',
    answerDeepEn:
      'Keyword search may work well for an exact selector such as #login-btn. Vector search may help when the question uses different wording. An application may use either approach or combine them. In every case, it should pass permitted sources to the model and check whether the answer is supported by them.',
    pitfallUk: 'Називати векторну базу синонімом усього RAG.',
  },
];
