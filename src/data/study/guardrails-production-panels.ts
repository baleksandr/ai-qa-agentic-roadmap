import type { FundamentalsCardPanel } from './fundamentals-card-panels';
import { framed, guardrailsPanel } from './guardrails-panel-helpers';

function productionPanel(
  plainUk: string,
  whyUk: string,
  exampleUk: string,
  rememberUk: string,
): FundamentalsCardPanel {
  return guardrailsPanel([
    framed('Простими словами', plainUk),
    framed('Чому це важливо в production', whyUk),
    framed('Приклад або типова помилка', exampleUk),
    framed('Запам’ятати', rememberUk),
  ]);
}

export const GUARDRAILS_PRODUCTION_STEPS = [
  {
    key: 'gr-prod-versioning',
    titleUk: 'Versioning політик і tool schemas',
    termEn: 'Policy and schema versioning',
    teaserUk: 'Зміни правил і аргументів без зламу старих агентів',
    panel: productionPanel(
      'Політики доступу і схеми аргументів інструментів описують контракт між моделлю, validator і executor. Коли правило або структура полів змінюється, старий агент або кешований prompt можуть ще пропонувати попередній формат.',
      'У production deploy політики часто йде разом із кодом harness. Без версіонування і перевірки сумісності run падає на validation, або гірше — проходить з некоректними аргументами.',
      'Після deploy ви додали обов’язкове поле `projectKey` у `createJiraIssue`. Модель ще шле старий JSON без поля. Validator відхиляє виклик, хоча policy формально дозволяла створення bug у `QA`.',
      'Версіонуйте зміни політик і схем, перевіряйте їх у staging перед production і тримайте backward compatibility, поки старі клієнти не оновлені.',
    ),
  },
  {
    key: 'gr-prod-latency',
    titleUk: 'Latency policy checks',
    termEn: 'Policy check latency',
    teaserUk: 'Кожен tool call може додавати затримку',
    panel: productionPanel(
      'Перед виконанням інструмента код часто звертається до policy engine або зовнішнього сервісу правил. Це додатковий round-trip на кожну пропозицію моделі.',
      'Агент може зробити багато tool calls за один run. Сумарна затримка перевірок впливає на SLA користувача і на вартість очікування в черзі.',
      'Regression-агент читає кілька файлів з `./playwright-report/` і двічі пропонує `createJiraIssue`. Якщо кожна перевірка політики займає 200 ms, лише policy додає суттєву частину часу run без користі для користувача.',
      'Вимірюйте latency policy окремо від LLM і executor, ставте бюджет на run і оптимізуйте кеш лише там, де це безпечно для рішень доступу.',
    ),
  },
  {
    key: 'gr-prod-cost',
    titleUk: 'Cost і rate limits',
    termEn: 'Cost and rate limits',
    teaserUk: 'LLM і зовнішні API мають ціну та квоти',
    panel: productionPanel(
      'Кожен запит до моделі і кожен виклик Jira, GitHub або іншого API коштує грошей або споживає квоту. Guardrails не скасовують ці витрати, але впливають на те, скільки спроб дійде до executor.',
      'Без лімітів на run агент у циклі retry може вичерпати бюджет команди або отримати throttle від зовнішнього сервісу. Це виглядає як «агент зламався», хоча причина — rate limit.',
      'Після падіння `login.spec.ts` модель у навчальному сценарії багато разів пропонує читання звітів. Навіть дозволені read виклики накопичують вартість LLM і навантаження на сховище артефактів.',
      'Контролюйте кількість tool calls, витрати на run і частоту звернень до зовнішніх API разом із policy, а не лише в промпті.',
    ),
  },
  {
    key: 'gr-prod-retries',
    titleUk: 'Retries та idempotency',
    termEn: 'Retries and idempotency',
    teaserUk: 'Повтор читання і повтор запису — не одне й те саме',
    panel: productionPanel(
      'Повторний запит на **читання** зазвичай безпечніший: він не змінює стан системи. Повтор **запису** без захисту може створити дублікат issue, платежу або запису в БД.',
      'У production мережеві збої і таймаути трапляються після того, як зовнішній сервіс уже виконав дію. Retry без idempotency key дає другий side effect.',
      'Перший виклик `createJiraIssue` у проєкт `QA` вдався, але клієнт не отримав відповідь. Harness повторює write — з’являється другий bug на те саме падіння `login.spec.ts`.',
      'Повторюйте read обережно, а write — лише з idempotency key або явною перевіркою, що дія ще не виконана.',
    ),
  },
  {
    key: 'gr-prod-concurrency',
    titleUk: 'Concurrency та approval state',
    termEn: 'Concurrency and approval state',
    teaserUk: 'Один approve не для всіх паралельних run',
    panel: productionPanel(
      'Кілька run агента можуть працювати одночасно. Стан погодження людини має належати конкретному run, пропозиції інструмента і набору аргументів, а не «глобальному дозволу на Jira».',
      'Якщо approval спільний, один схвалений запит може випадково розблокувати іншу дію в іншому run. Це пряма вразливість для privilege escalation між сесіями.',
      'Користувач схвалив створення bug для одного розслідування `login.spec.ts`, а паралельний run з іншими аргументами отримав той самий approval token і виконав write.',
      'Прив’язуйте approval до run id, proposal id і hash аргументів, і перевіряйте це в коді перед executor.',
    ),
  },
  {
    key: 'gr-prod-degradation',
    titleUk: 'Degradation і policy service',
    termEn: 'Policy service degradation',
    teaserUk: 'Fail closed і fail open залежать від ризику',
    panel: productionPanel(
      '**Fail closed** означає, що захищена операція не виконується, якщо перевірку політики неможливо надійно завершити. **Fail open** дозволяє продовжити без перевірки, коли сервіс недоступний.',
      'Для ризикових write, prod-змін і платежів типова безпечна поведінка за замовчуванням — не виконувати дію без рішення policy. Для низькоризикового read у деяких системах обирають іншу стратегію залежно від вимог.',
      'Policy service недоступний під час спроби `createJiraIssue`. Fail open створить issue без запису рішення. Fail closed зупинить run і залишить слід для incident response.',
      'Стратегію degradation визначайте за ризиком операції, а не одним глобальним перемикачем для всіх інструментів.',
    ),
  },
  {
    key: 'gr-prod-retention',
    titleUk: 'Data retention і compliance',
    termEn: 'Retention and compliance',
    teaserUk: 'Що зберігати про рішення policy і як довго',
    panel: productionPanel(
      'Журнали policy decision, audit events і approval потрібні для розслідувань і compliance. Потрібно заздалегідь визначити, які поля зберігаються, термін життя і хто має доступ.',
      'Занадто довге зберігання повних trace з артефактами збільшує ризик витоку. Занадто коротке — не дає відповісти на питання після інциденту.',
      'У trace залишили повний `./playwright-report/` і токен Jira «для зручності QA». Це порушує і правила логування з розділу observability, і вимоги compliance.',
      'Зберігайте мінімум полів для аудиту, без секретів і зайвих PII, з чітким retention і контролем доступу.',
    ),
  },
  {
    key: 'gr-prod-monitoring',
    titleUk: 'Monitoring та incident response',
    termEn: 'Monitoring and incidents',
    teaserUk: 'Spike deny, помилки policy і спроби обходу',
    panel: productionPanel(
      'Моніторинг guardrails — це метрики і алерти на аномалії: різке зростання `deny`, помилки policy service, спроби обійти approval або незвичні комбінації tool і resource.',
      'Без цього команда дізнається про зламану політику або атаку лише після скарг користувачів. Incident response описує, хто аналізує trace, чи відкочувати deploy політики і як тимчасово посилити deny.',
      'Після релізу нової матриці дозволів кількість deny для read звітів зросла вдесятеро. Алерт за rule id показує помилку в конфігурації sandbox шляху до `./playwright-report/`.',
      'Відстежуйте health policy разом із бізнес-метриками агента, і майте план дій, коли guardrails сигналізують про аномалію.',
    ),
  },
];

export const GUARDRAILS_PRODUCTION_CLOSING_UK =
  'Guardrails у production — це не лише перевірка дозволу перед викликом інструмента. Це ще контроль сумісності версій, затримок, витрат, безпечних повторів, паралельного виконання, поведінки при відмові сервісу та подальшого аудиту рішень.';
