import type { StudyTeachingCardsBundle } from './study-teaching-card-types';
import { fundamentalsTeachingStep } from './fundamentals-teaching-step';

export const FUNDAMENTALS_NEXT_TOKEN_CARDS: StudyTeachingCardsBundle = {
  ariaLabel: 'Спрощений цикл next-token prediction',
  leadUk:
    'Це **спрощена** mental model генерації, не точний опис усіх внутрішніх операцій. **Hallucination** не зводиться лише до «модель передбачає токени»: також брак даних у context, неоднозначний запит і відсутність перевірки доказів.',
  flowArrowLine: 'context → ймовірності → вибір токена → додати → повтор або stop',
  steps: [
    fundamentalsTeachingStep(
      'ctx',
      'Поточний context',
      'Усе, що модель бачить зараз у виклику.',
      {
        whatUk: 'Сума token IDs: instructions, history, tool results і вже згенеровані assistant-токени **в цьому** completion.',
        inputUk: 'Messages + часткова відповідь.',
        outputUk: 'Єдиний ланцюг для forward pass.',
        linkUk: 'Context window визначає, хто зібрав input; token IDs приходять із токенізації.',
        exampleUk: 'Після токенів «The failure» context вже містить їх — наступний токен залежить від цього продовження.',
        failureUk: 'Переповнення window — старий tool result випав.',
        testUk: 'Synthetic long history: критичний факт залишився в prompt.',
      },
      'Context',
    ),
    fundamentalsTeachingStep(
      'probs',
      'Оцінка наступних токенів',
      'Розподіл на одну позицію вперед.',
      {
        whatUk: 'Модель видає **розподіл** на наступний токен (без вигаданих точних відсотків у навчанні). Не обирає всю фразу одразу.',
        inputUk: 'Context після forward pass.',
        outputUk: 'Ймовірності/логіти по словнику токенів.',
        linkUk: 'Transformer (attention) змішує токени перед цим кроком.',
        exampleUk: 'Після «import» частіше з’являються токени, пов’язані з тестовим кодом — залежить від попереднього тексту.',
        failureUk: 'Висока впевненість у неіснуючому API-токені.',
        testUk: 'Groundedness: чи є опора в tool result, а не лише плавний текст.',
      },
      'LLM',
    ),
    fundamentalsTeachingStep(
      'pick',
      'Вибір одного токена',
      'Sampling за правилами API (temperature, top_p).',
      {
        whatUk: 'З розподілу обирається **один** token ID; temperature і top_p керують випадковістю вибору.',
        inputUk: 'Розподіл + параметри генерації.',
        outputUk: 'Обраний token ID.',
        linkUk: 'Не повторюємо повний опис temperature тут.',
        exampleUk: 'Наступний токен після «login» може бути `_` або `-` залежно від контексту POM у prompt.',
        failureUk: 'Ставити temperature=0 замість перевірки schema.',
        testUk: 'Фіксуйте параметри в trace поруч із model id.',
      },
      'Sampling',
    ),
    fundamentalsTeachingStep(
      'append',
      'Додати до відповіді',
      'Токен стає частиною assistant text.',
      {
        whatUk: 'ID декодується у фрагмент тексту; context для **наступної** ітерації стає довшим.',
        inputUk: 'Token ID + decoder.',
        outputUk: 'Оновлений completion.',
        linkUk: 'Замикає цикл — знову крок context.',
        exampleUk: 'Токен `;` після `import` змінює ймовірності наступного токена.',
        failureUk: 'Repetition loop до max_tokens.',
        testUk: 'Детектор повторів у eval.',
      },
      'Цикл',
    ),
    fundamentalsTeachingStep(
      'stop',
      'Повтор або зупинка',
      'Stop sequence, EOS або max output tokens.',
      {
        whatUk: 'Цикл повторюється, доки harness не зупинить генерацію (stop sequence, max tokens). Далі — парсер, tools, валідація.',
        inputUk: 'Довжина completion + finish rules.',
        outputUk: 'Фінальний assistant message.',
        linkUk: 'Ліміти завершення (sampling) — окремо від повного циклу next-token.',
        exampleUk: 'Обрізаний JSON без `}` — парсер harness падає з явною помилкою.',
        failureUk: 'Вважати обрізок «відмовою моделі» без finish_reason.',
        testUk: 'Assert finish_reason і повний structured output.',
      },
      'Stop',
    ),
  ],
};
