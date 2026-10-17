type PolicyRule = {
  id: string;
  verdict: 'allow' | 'deny' | 'approval' | 'not-exposed';
  verdictLabel: string;
  actionUk: string;
  termEn?: string;
  explainUk: string;
  qaUk: string;
};

const GUARDRAILS_EXAMPLE_RULES: PolicyRule[] = [
  {
    id: 'read-logs',
    verdict: 'allow',
    verdictLabel: 'Дозволено (allow)',
    actionUk: 'Читання production-логів',
    termEn: 'read production logs',
    explainUk:
      'Read-only доступ: лише дозволені шляхи в sandbox. Модель може запропонувати дію, policy engine дозволяє виконання.',
    qaUk: 'Regression-агент може отримати логи CI або Playwright для розбору падіння.',
  },
  {
    id: 'db-write',
    verdict: 'deny',
    verdictLabel: 'Заборонено (deny)',
    actionUk: 'Запис у production БД',
    termEn: 'production DB write',
    explainUk:
      'Запис у бойову базу політика завжди відхиляє — незалежно від того, що написала модель у промпті.',
    qaUk: 'Навіть якщо LLM «порадить» оновити запис, policy engine поверне deny.',
  },
  {
    id: 'jira-create',
    verdict: 'approval',
    verdictLabel: 'Потрібне підтвердження (needs_approval)',
    actionUk: 'Створення bug у Jira',
    termEn: 'create Jira bug',
    explainUk:
      'Ризикова write-дія: run зупиняється до human approval — людина підтверджує в UI або за ticket.',
    qaUk: 'Текст бага може готувати модель, створення issue в Jira — лише після OK від QA.',
  },
  {
    id: 'jira-delete',
    verdict: 'not-exposed',
    verdictLabel: 'Немає в tool registry',
    actionUk: 'Видалення issue у Jira',
    termEn: 'delete Jira issue',
    explainUk:
      'Інструмент не зареєстрований у harness — модель не може викликати tool, якого немає в registry і схемах.',
    qaUk: 'Видалення issue взагалі не входить у можливості regression-агента.',
  },
];

const GUARDRAILS_EXAMPLE_SUMMARY_UK =
  'Один агент, одна політика: читання логів — дозволено, запис у production БД — заборонено, bug у Jira — лише після підтвердження, видалення issue — інструмент не підключений.';

export function StudyGuardrailsPolicyExample() {
  return (
    <div className="study-policy-example">
      <p className="study-policy-lead">{GUARDRAILS_EXAMPLE_SUMMARY_UK}</p>
      <p className="study-policy-lead muted small">
        Різні дії проходять <strong>різні правила</strong> — не «все або нічого».
      </p>
      <ul className="study-policy-rules">
        {GUARDRAILS_EXAMPLE_RULES.map((rule) => (
          <li key={rule.id} className={`study-policy-rule verdict-${rule.verdict}`}>
            <div className="study-policy-rule-head">
              <span className="study-policy-verdict">{rule.verdictLabel}</span>
              <span className="study-policy-action">{rule.actionUk}</span>
            </div>
            {rule.termEn && (
              <p className="study-policy-term muted small" lang="en">
                Термін у курсі: <em>{rule.termEn}</em>
              </p>
            )}
            <p className="study-policy-explain">{rule.explainUk}</p>
            <p className="study-policy-qa">
              <span className="study-component-qa-label">Для QA-агента:</span> {rule.qaUk}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
