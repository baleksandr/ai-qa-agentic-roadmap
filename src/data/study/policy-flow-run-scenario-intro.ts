/** Спільний вступ до навчальної схеми одного run (Harness production, Guardrails observability). */

export const POLICY_FLOW_SCENARIO_INTRO_UK =
  'QA Regression Investigation Agent розслідує падіння `login.spec.ts` у CI. Умовні дані вказують на шлях до `./playwright-report/`. Агент читає доступні артефакти, формує висновок і може запропонувати створити bug у Jira в проєкті `QA`.';

/** Єдине пояснення до схеми: сценарій → ланцюжок → гілки policy_decision. */
export const POLICY_FLOW_SCHEMA_EXPLANATION_UK = [
  POLICY_FLOW_SCENARIO_INTRO_UK,
  'На схемі показано шлях від запуску агента до перевірки аргументів запропонованого інструмента і рішення політики. У навчальному trace цей шлях видно як ланцюжок подій від `run_started` через `model_request`, `tool_call_proposal` і `validate_arguments` до `policy_decision`, де код перевіряє, чи дозволена конкретна дія для цього run.',
  'Після `policy_decision` схема розходиться на три альтернативні гілки: `deny`, `allow` і `needs_approval`. Це три можливі результати одного рішення політики, а не три кроки підряд. `deny` зупиняє run без executor. `allow` відкриває шлях до виконання в межах подальших перевірок. `needs_approval` ставить run на паузу, доки людина не схвалить або не відхилить дію.',
].join('\n\n');

/** @deprecated Використовуйте POLICY_FLOW_SCHEMA_EXPLANATION_UK */
export const POLICY_FLOW_SCENARIO_CHAIN_UK =
  'На схемі нижче показано гілки після перевірки аргументів і рішення політики. Повний ланцюжок до цього кроку в навчальному trace: `run_started` → `model_request` → `tool_call_proposal` → `validate_arguments` → `policy_decision`. Далі `deny`, `allow` і `needs_approval` — альтернативи одного рішення, а не послідовні кроки.';

export const POLICY_FLOW_SCENARIO_SEQUENCE_CHAIN_UK =
  'Повний ланцюжок до рішення політики в навчальному trace: `run_started` → `model_request` → `tool_call_proposal` → `validate_arguments` → `policy_decision`.';

export const POLICY_FLOW_SCENARIO_SEQUENCE_BRANCHES_UK =
  'Після `policy_decision` можливі три альтернативні гілки: `deny`, `allow` або `needs_approval`. Це різні результати одного рішення, а не послідовні кроки. Назви подій на схемі залишай англійською, відповідно до термінології trace.';
