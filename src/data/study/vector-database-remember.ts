export type VectorDatabaseRememberThesis = {
  termUk: string;
  explanationUk: string;
};

/** §8 «Запам’ятати» — три тези в одному компактному блоці. */
export const VECTOR_DATABASE_REMEMBER_THESES: VectorDatabaseRememberThesis[] = [
  {
    termUk: 'Векторний пошук',
    explanationUk: 'один зі способів знайти фрагменти для RAG.',
  },
  {
    termUk: 'Знайдений фрагмент',
    explanationUk: 'кандидат, а не доказ причини поточного збою.',
  },
  {
    termUk: 'QA',
    explanationUk: 'звіряє джерело, доступ і фактичний запит, який отримала модель.',
  },
];
