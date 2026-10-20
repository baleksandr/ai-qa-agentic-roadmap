import type { StudyAgentHandoffFixtureBlock } from './study-learner-panel-sections';

export const AGENT_A_TO_B_HANDOFF_FIXTURE: StudyAgentHandoffFixtureBlock = {
  titleUk: 'Що Agent A передає Agent B',
  introUk:
    'CI повідомив про timeout на #login-btn. У цьому умовному випадку Agent A прочитав звіт і побачив, що кнопка була на сторінці, але залишалася неактивною. Це спростовує припущення «кнопки взагалі немає», проте ще не пояснює, чому її не активували.',
  jsonExample: `{
  "ticketId": "ABC-123",
  "ciRunId": "test-run-17",
  "status": "evidence_found",
  "symptom": "Timeout під час очікування #login-btn",
  "observation": "У звіті кнопка #login-btn є, але вона неактивна",
  "evidenceRef": "report-fragment-1",
  "hypothesis": "Причина неактивності кнопки ще невідома",
  "nextCheck": "Перевірити доступний trace цього запуску"
}`,
  fieldsDropdownSummaryUk: 'Що означає кожне поле',
  fields: [
    {
      termUk: 'ticketId',
      explanationUk:
        'до якого навчального тікета належить результат. Це не номер CI запуску.',
    },
    {
      termUk: 'ciRunId',
      explanationUk:
        'який саме запуск login_spec досліджували. За ним Agent B не переплутає два падіння одного тесту.',
    },
    {
      termUk: 'status',
      explanationUk:
        'чи Agent A отримав доказ. Значення evidence_found у цьому прикладі означає лише те, що звіт дав спостереження, а не те, що кореневу причину вже доведено.',
    },
    {
      termUk: 'symptom',
      explanationUk: 'факт із повідомлення CI: тест завершився timeout на #login-btn.',
    },
    {
      termUk: 'observation',
      explanationUk:
        'що Agent A фактично прочитав у НАВЧАЛЬНОМУ звіті. Кнопка присутня, але неактивна. Цей рядок не можна підставляти в реальний run без такого результату інструмента.',
    },
    {
      termUk: 'evidenceRef',
      explanationUk:
        'посилання на конкретний фрагмент звіту, яким можна підтвердити observation. Посилання має стосуватися цього ciRunId і залишатися доступним лише за правилами продукту.',
    },
    {
      termUk: 'hypothesis',
      explanationUk:
        'що ще невідомо. Дані про неактивну кнопку не доводять, чому вона стала неактивною.',
    },
    {
      termUk: 'nextCheck',
      explanationUk:
        'доречна наступна перевірка, якщо trace доступний і код дозволить його прочитати. Це пропозиція, а не виконаний виклик.',
    },
  ],
  agentBLabelUk: 'Що робить Agent B',
  agentBBodyUk:
    'Agent B бачить підтверджений стан кнопки та джерело цього твердження. Він не повинен одразу «виправляти селектор», адже наведене спостереження не доводить, що селектор неправильний. Спершу workflow має вирішити, чи потрібна додаткова перевірка причини неактивності.',
  footnoteUk:
    'Наведені поля та їхні назви — навчальний приклад. Це не контракт чинного продукту й не дані реального Playwright-звіту.',
};
