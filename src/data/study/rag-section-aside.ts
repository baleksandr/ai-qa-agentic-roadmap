import type { StudySectionAside } from './study-section-aside-types';

export type RagSectionAside = StudySectionAside;

const BY_SECTION: Record<string, RagSectionAside> = {
  'Навіщо потрібен RAG?': {
    focus: 'Модель не бачить вашу wiki. RAG — це код, який підбирає уривки **до** генерації.',
    example: 'Падіння `login_spec` без postmortem у prompt → переконлива, але вигадана порада.',
    diagram: 'Порівняйте з таблицею «фаза offline vs запит» у цьому розділі.',
  },
  'Як RAG працює в одному запиті?': {
    focus:
      'Одна історія з 6 кроків: падіння → пошук → відбір (знайдено → дозволено → LLM) → prompt → гіпотеза → перевірка.',
    example: 'У прикладі LLM бачить лише INC-442; INC-318 не в prompt.',
    diagram: 'Крок 3 — три стани відбору; деталі — у поясненні обраного кроку.',
  },
  'Як підготувати документи для пошуку?': {
    focus: 'Offline: documents → chunks → index. Це **не** той самий процес, що відповідь на одне питання.',
    example: 'Версія `index-v12` після reindex postmortem.',
    diagram: 'Підготовку індексу можна переглянути в інтерактивній схемі RAG (посилання в боковій колонці).',
  },
  'Де код, а де LLM?': {
    focus: 'Пошук і ACL — детермінований код; інтерпретація мови — LLM.',
    example: 'Приклад prompt з блоком `[Retrieved context]` і `INC-442`.',
    tips: [
      'У блоці «Узагальнений ланцюг даних» оберіть крок — з’явиться пояснення для QA.',
      'Фраза «запит → chunk_id» у тестах — формулювання перевірки, не схема pipeline.',
    ],
  },
  'Де RAG може помилитися?': {
    focus: 'Картки failure modes: retrieval, індекс, права, injection, збої.',
    example: 'Два схожих INC у context → змішаний root cause у відповіді.',
  },
  'Як QA це тестує?': {
    focus: 'Golden queries, ACL, groundedness, adversarial chunk, trace.',
    example: 'Фіксований query → очікуваний набір `chunk_id` без виклику LLM.',
    tips: [
      'Retrieval перевіряйте без LLM — інакше не відділите recall від «гарної мови».',
      'Для offline-кроків натисніть «Деталі» на картці — там повний розбір.',
    ],
  },
  'Що потрібно для production?': {
    focus: 'Свіжість індексу, деградація без retrieval, метрики обох фаз.',
    example: 'Spike `retrieval_latency` після deploy embed model.',
  },
  'Запам’ятати та співбесіда': {
    focus: 'Чотири тези; далі — 10 питань «Перевір себе» + короткий pitch UK/EN.',
    example: 'Питання про hits vs selected evidence і citation ≠ root cause.',
  },
};

export function getRagSectionAside(navTitle: string): RagSectionAside {
  const hit = Object.entries(BY_SECTION).find(([key]) => navTitle.startsWith(key) || key.startsWith(navTitle));
  if (hit) return hit[1];
  return {
    focus: 'Пройдіть розділи по порядку 1 → 8. Зміст уроку — у колонці з переліком розділів.',
    example: 'Увесь урок самодостатній; книга лише в «Джерела та примітки» внизу.',
  };
}
