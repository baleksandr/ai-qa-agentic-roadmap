import type { StudyInterviewDeck } from './study-interview-types';
import { VECTOR_DATABASE_INTERVIEW_QUESTIONS } from './vector-database-interview-questions';

export const VECTOR_DATABASE_INTERVIEW_DECK: StudyInterviewDeck = {
  deckId: 'concept-15-vector-db-interview',
  headingUk: 'Перевір себе перед співбесідою',
  leadUk:
    'Сформулюйте відповідь своїми словами, потім натисніть «Показати відповідь». У відповіді — чотири окремі блоки українською та англійською, потім типова помилка. Позначки зберігаються лише в цьому браузері.',
  answerBriefLabelUk: 'Коротко українською',
  answerDeepLabelUk: 'Докладніше українською',
  answerBriefEnLabelUk: 'Short answer in English',
  answerDeepEnLabelUk: 'Detailed answer in English',
  pitchHeadingUk: 'Цільна відповідь для співбесіди, приблизно 30–45 секунд',
  pitchUk:
    'Векторний пошук допомагає QA-агенту знайти схожі фрагменти документації, наприклад старий postmortem після падіння login_spec. Застосунок перевіряє доступ і передає моделі дозволені уривки з джерелами. Схожість не доводить причину сьогоднішнього збою, тому висновок треба звірити з артефактами поточного run. Як QA я перевіряю актуальність документів, доречність результатів на контрольному наборі та фактичний контекст, який отримала модель. Векторна база — можливий інструмент пошуку для RAG, але не обов’язкова його частина.',
  pitchEn:
    'Vector search helps a QA agent find related documentation, such as an earlier postmortem after a login_spec failure. The application enforces access rules and passes permitted passages with their sources to the model. Similarity does not prove the cause of today’s failure, so the conclusion must be checked against current run artifacts. As QA, I test document freshness, retrieval quality on a labeled set, and the actual context sent to the model. A vector database is one possible retrieval tool for RAG, not a required part of RAG.',
  questions: VECTOR_DATABASE_INTERVIEW_QUESTIONS,
  nextLinkCtaUk: 'Перейти до теми ↗',
  nextLinks: [
    {
      to: '/topic/concept-03/study',
      label: 'RAG',
      hintUk: '— як знайдені джерела потрапляють до запиту моделі та підтримують відповідь',
    },
  ],
};
