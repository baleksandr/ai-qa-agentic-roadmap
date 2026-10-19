export type MemoryStateRememberThesis = {
  termUk: string;
  explanationUk: string;
};

/** §9 «Запам’ятати» — чотири тези в одному блоці. */
export const MEMORY_STATE_REMEMBER_THESES: MemoryStateRememberThesis[] = [
  {
    termUk: 'State',
    explanationUk: 'зберігає кроки, результати й статус поточного розслідування.',
  },
  {
    termUk: 'Memory',
    explanationUk: 'містить відомості з минулого, які можна використати за правилами продукту.',
  },
  {
    termUk: 'Код застосунку',
    explanationUk: 'вибирає, які з цих даних передати моделі.',
  },
  {
    termUk: 'Модель',
    explanationUk: 'бачить лише дані, які код додав до її запиту.',
  },
];
