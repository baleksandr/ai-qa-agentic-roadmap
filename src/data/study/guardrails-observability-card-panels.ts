import type { FundamentalsCardPanel } from './fundamentals-card-panels';
import {
  framed,
  guardrailsPanel,
  qaBlockWithBullets,
  qaBulletBody,
  terminology,
} from './guardrails-panel-helpers';

function obsCardPanel(
  sections: Array<{ labelUk: string; bodyUk: string }>,
  terms: Array<{ termUk: string; bodyUk: string }>,
): FundamentalsCardPanel {
  return guardrailsPanel([...sections.map((s) => framed(s.labelUk, s.bodyUk)), terminology(terms, 'Терміни')], []);
}

export const GUARDRAILS_OBSERVABILITY_CARD_STEPS = [
  {
    key: 'gr-obs-proposal',
    titleUk: 'Пропозиція моделі',
    teaserUk: 'Що модель попросила виконати, перш ніж код ухвалив рішення',
    termEn: 'tool call proposal',
    panel: obsCardPanel(
      [
        {
          labelUk: 'Простими словами',
          bodyUk:
            'Модель повертає структуровану пропозицію: назву інструмента та аргументи. Наприклад, `createJiraIssue` для проєкту `QA`. На цьому етапі ще немає ні рішення policy, ні факту створення issue.',
        },
        {
          labelUk: 'Що відбувається',
          bodyUk:
            'Harness отримує пропозицію та передає її на відповідні перевірки. Далі код має перевірити структуру аргументів, допустимість інструмента й політику доступу. Точний порядок внутрішніх перевірок має відповідати реалізації застосунку.',
        },
        {
          labelUk: 'Що шукати в trace',
          bodyUk: qaBulletBody([
            '`model_request` — дані, передані моделі',
            '`tool_call_proposal` — запропонована назва інструмента та аргументи',
            '`run_id` — ідентифікатор запуску, якщо він записується цією реалізацією',
          ]),
        },
        {
          labelUk: 'Типова помилка',
          bodyUk: 'Вважати, що модель уже створила Jira issue. Пропозиція — це лише запит на майбутню дію.',
        },
        {
          labelUk: 'Приклад',
          bodyUk:
            '`tool_call_proposal: createJiraIssue`\n\nНаступна перевірка ще може відхилити цю пропозицію.',
        },
      ],
      [{ termUk: 'Tool call proposal', bodyUk: 'структурована пропозиція моделі викликати інструмент.' }],
    ),
  },
  {
    key: 'gr-obs-validate-policy',
    titleUk: 'Валідація та policy',
    teaserUk: 'Код перевіряє аргументи й вирішує, чи дозволена дія',
    termEn: 'validate + policy engine',
    panel: obsCardPanel(
      [
        {
          labelUk: 'Простими словами',
          bodyUk:
            'Harness перевіряє структуру аргументів і застосовує правила доступу. Policy може враховувати `actor`, `tool`, `resource` та `action`. Для прикладу з Jira ресурсом може бути `jira:project/QA`, а дією — `write`.',
        },
        {
          labelUk: 'Важливе розрізнення',
          bodyUk:
            'Валідні аргументи ще не означають, що дія дозволена. Перевірка схеми відповідає на питання, чи правильно сформовано запит. Policy відповідає на питання, чи дозволено його виконувати.',
        },
        {
          labelUk: 'Можливі вердикти',
          bodyUk: qaBulletBody([
            '`deny` — дія заборонена',
            '`allow` — виконання дозволено без додаткового погодження',
            '`needs_approval` — потрібне погодження людини',
          ]),
        },
        {
          labelUk: 'Що шукати в trace',
          bodyUk: qaBulletBody([
            'Подія `policy_decision` з вердиктом allow, deny або needs_approval.',
            'Поле `rule_id`, якщо реалізація його записує.',
            '`run_id` для кореляції з іншими подіями того самого run.',
          ]),
        },
        {
          labelUk: 'Для QA-агента',
          bodyUk:
            'Підготуйте контрольні сценарії з відомими вхідними даними й очікуваним вердиктом. Перевіряйте не лише сам результат, а й причину рішення.',
        },
        {
          labelUk: 'Типова помилка',
          bodyUk: 'Плутати правильну структуру аргументів із правом на доступ до ресурсу.',
        },
      ],
      [{ termUk: 'Policy decision', bodyUk: 'рішення коду щодо дозволу на конкретну дію.' }],
    ),
  },
  {
    key: 'gr-obs-deny',
    titleUk: 'Deny: дія заблокована',
    teaserUk: 'Заборона policy означає, що виклик інструмента не відбувся',
    termEn: 'policy decision: deny',
    panel: obsCardPanel(
      [
        {
          labelUk: 'Що означає',
          bodyUk:
            'Код заборонив дію за відповідним правилом. Наприклад, політика може забороняти запис у Jira для певного актора або середовища. Executor не повинен викликатися.',
        },
        {
          labelUk: 'Що шукати в trace',
          bodyUk: qaBulletBody([
            '`policy_decision: deny`',
            '`rule_id`, якщо він передбачений',
            'запис аудиту з причиною відмови, якщо він налаштований',
            'відсутність фактичного executor-виклику для цієї пропозиції',
          ]),
        },
        {
          labelUk: 'Метрики',
          bodyUk: qaBlockWithBullets(
            '`deny_rate` може показувати частку відхилених пропозицій. Перед інтерпретацією уточніть знаменник:',
            [
              'Усі пропозиції інструментів.',
              'Усі policy-рішення.',
              'Інша визначена в продукті сукупність.',
            ],
            'Без цього показник легко витлумачити неправильно.',
          ),
        },
        {
          labelUk: 'Приклад',
          bodyUk:
            'Модель пропонує `createJiraIssue`, але policy повертає `deny`. Issue не створюється через цей виклик.',
        },
        {
          labelUk: 'Типова помилка',
          bodyUk: 'Шукати помилку Jira API, коли запит узагалі не дійшов до executor.',
        },
      ],
      [{ termUk: 'Policy decision: deny', bodyUk: 'код заборонив дію до виконання інструмента.' }],
    ),
  },
  {
    key: 'gr-obs-allow',
    titleUk: 'Allow: виконання дозволено',
    teaserUk: 'Дозвіл policy ще не означає успішного результату',
    termEn: 'policy decision: allow',
    panel: obsCardPanel(
      [
        {
          labelUk: 'Що означає',
          bodyUk:
            'Policy дозволила перейти до виконання. Далі executor викликає інструмент, а той може звернутися до Jira API. API все ще може повернути помилку.',
        },
        {
          labelUk: 'Послідовність подій',
          bodyUk:
            '`policy_decision: allow` → `executor` → `jira_api_request` → `tool_execution_result`',
        },
        {
          labelUk: 'Що шукати в trace',
          bodyUk: qaBlockWithBullets(
            'Зіставте послідовність подій для одного запиту:',
            [
              '`policy_decision: allow` перед викликом executor.',
              'Фактичний виклик executor після дозволу.',
              'Подія `tool_execution_result` з даними або помилкою API.',
              'Підтвердження створення issue у відповіді API при успіху.',
            ],
          ),
        },
        {
          labelUk: 'Метрики',
          bodyUk: qaBulletBody([
            'Дозволені policy-операції — скільки разів код дозволив перейти до виконання.',
            'Фактичні виклики інструмента — скільки разів executor справді запускався.',
            'Успішні результати API — скільки операцій завершилося без помилки з боку сервісу.',
          ]),
        },
        {
          labelUk: 'Типова помилка',
          bodyUk: 'Вважати `policy_decision: allow` доказом того, що bug уже створено в Jira.',
        },
      ],
      [{ termUk: 'Policy decision: allow', bodyUk: 'код дозволив перейти до спроби виконання інструмента.' }],
    ),
  },
  {
    key: 'gr-obs-approval',
    titleUk: 'Погодження людини',
    teaserUk: 'Рішення людини та виконання інструмента — різні події',
    termEn: 'needs_approval, approval_granted, approval_denied',
    panel: obsCardPanel(
      [
        {
          labelUk: 'Що відбувається',
          bodyUk:
            'Якщо policy повернула `needs_approval`, система очікує рішення уповноваженої людини. До погодження executor не запускається.',
        },
        {
          labelUk: 'Якщо людина відхилила',
          bodyUk:
            '`approval_denied`\n\nСистема записує факт відмови. Для цього запиту executor не викликається. Ця подія не означає, що policy повернула `deny`.',
        },
        {
          labelUk: 'Якщо людина схвалила',
          bodyUk:
            '`approval_granted`\n\nСистема записує факт схвалення. Це ще не означає, що Jira issue створено. Перед виконанням код повторно перевіряє політику та актуальність запиту.',
        },
        {
          labelUk: 'Що шукати в trace',
          bodyUk: qaBulletBody([
            '`approval_id` або інший ідентифікатор запиту погодження, якщо записується.',
            '`run_id` для зв’язку з пропозицією та policy-рішеннями.',
            'Час і результат рішення людини (`approval_granted` або `approval_denied`).',
            'Наступне `policy_decision` після схвалення, якщо передбачено повторною перевіркою.',
            'Відсутність executor до моменту дозволу на виконання.',
          ]),
        },
        {
          labelUk: 'Метрики',
          bodyUk:
            '`approval_latency` може вимірювати час від запиту погодження до рішення людини. Не включайте час Jira API до цього показника, якщо він призначений саме для вимірювання очікування approval.',
        },
        {
          labelUk: 'Для QA-агента',
          bodyUk: qaBulletBody([
            'Людина відхилила запит — executor не викликається, причина в `approval_denied`.',
            'Людина схвалила запит — далі діє повторна перевірка policy та можливе виконання.',
            'Після схвалення повторна перевірка policy повернула deny — executor не викликається.',
          ]),
        },
      ],
      [
        { termUk: 'needs_approval', bodyUk: 'дія потребує погодження людини перед виконанням.' },
        { termUk: 'approval_granted', bodyUk: 'записаний факт схвалення, не доказ виконання інструмента.' },
        { termUk: 'approval_denied', bodyUk: 'записаний факт відмови людини, окрема від policy deny.' },
      ],
    ),
  },
  {
    key: 'gr-obs-recheck-result',
    titleUk: 'Re-check і результат Jira API',
    teaserUk: 'Після погодження перевірте запит повторно та підтвердьте фактичний результат',
    termEn: 'post-approval policy re-check, tool_execution_result',
    panel: obsCardPanel(
      [
        {
          labelUk: 'Що відбувається',
          bodyUk:
            'Після `approval_granted` код повторно перевіряє, чи залишається операція дозволеною. Він має переконатися, що погодження стосується того самого запиту та що правила доступу досі дозволяють виконання.\n\nЯкщо перевірка повернула `deny`, executor не викликається. Якщо вона повернула `allow`, executor може виконати запит. Після цього потрібно перевірити фактичну відповідь Jira API.',
        },
        {
          labelUk: 'Що шукати в trace',
          bodyUk: qaBulletBody([
            'Подія `approval_granted`, якщо вона записується.',
            'Повторний `policy_decision` після схвалення.',
            'Виклик `executor` лише після дозволу.',
            'Подія `tool_execution_result`.',
            'Ідентифікатор створеного issue, якщо його повернув API.',
            'Фінальний статус run.',
          ]),
        },
        {
          labelUk: 'Для QA-агента',
          bodyUk: qaBulletBody([
            'Відхилення під час повторної перевірки не спричиняє виклик Jira API.',
            'Помилка API не відображається в UI як успішне створення issue.',
            'Успіх підтверджується полями `tool_execution_result`, а не лише `approval_granted`.',
          ]),
        },
        {
          labelUk: 'Типова помилка',
          bodyUk:
            'Вважати, що натискання Approve автоматично створює тікет. Схвалення, повторна перевірка, виконання та результат API — різні етапи.',
        },
      ],
      [
        {
          termUk: 'Post-approval policy re-check',
          bodyUk: 'повторна перевірка політики після схвалення людиною.',
        },
        {
          termUk: 'Tool execution result',
          bodyUk: 'фактичні дані або помилка, повернуті виконаним інструментом.',
        },
      ],
    ),
  },
] as const;
