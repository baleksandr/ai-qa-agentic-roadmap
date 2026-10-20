import { useState } from 'react';
import {
  GUARDRAILS_OBS_APPROVAL_DENIED_JSON,
  GUARDRAILS_OBS_APPROVAL_GRANTED_JSON,
  GUARDRAILS_OBS_DENY_JSON,
  GUARDRAILS_OBS_EVENT_EXAMPLE_JSON,
  GUARDRAILS_OBS_EXECUTOR_ERROR_JSON,
  GUARDRAILS_OBS_EXECUTOR_SUCCESS_JSON,
  GUARDRAILS_OBS_FIELDS,
  GUARDRAILS_OBS_REMEMBER,
  GUARDRAILS_OBS_SCENARIO_OUTCOMES,
  GUARDRAILS_OBS_SOURCE_MARKDOWN,
} from '../../data/study/guardrails-observability-lesson';
import { StudyPolicyApprovalFlowDiagram } from './StudyPolicyApprovalFlowDiagram';
import { LessonRichParagraphs, parseLessonBold } from './lessonRichText';
import { StudyPipelineStepNav } from './StudyPipelineStepNav';
import { STUDY_EMPTY_ITEM_PANEL_UK } from '../../lib/studyLearnerCopy';
import { StudyStepDetailLayout } from './StudyStepDetailLayout';
import { StudyGuardrailsSectionTopicIntro } from './StudyGuardrailsSectionTopicIntro';

function ObsJson({ label, json }: { label: string; json: string }) {
  return (
    <figure className="study-obs-figure">
      <figcaption className="study-obs-figure-cap">
        {label} <span className="study-obs-teach-badge">навчальний приклад</span>
      </figcaption>
      <pre className="study-obs-json" lang="en"><code>{json}</code></pre>
    </figure>
  );
}

function FieldSplitPanel() {
  const [selectedId, setSelectedId] = useState(GUARDRAILS_OBS_FIELDS[0]?.id ?? '');
  const selected = GUARDRAILS_OBS_FIELDS.find((f) => f.id === selectedId) ?? GUARDRAILS_OBS_FIELDS[0];

  const navItems = GUARDRAILS_OBS_FIELDS.map((field) => ({
    key: field.id,
    titleUk: field.titleUk,
    teaserUk: field.teaserUk,
    badgeUk: 'Observability',
  }));

  return (
    <div className="study-split-hint study-obs-fields study-rag-pipeline-glossary">
      <StudyStepDetailLayout
        navAriaLabel="Поля observability"
        nav={
          <StudyPipelineStepNav
            items={navItems}
            activeKey={selected?.id ?? ''}
            onSelect={(key) => setSelectedId(String(key))}
            ariaLabel="Поля observability"
          />
        }
        panel={
          selected ? (
          <>
            <h4 className="study-split-hint-detail-title">{selected.titleUk}</h4>
            <p className="study-policy-term muted small" lang="en">
              Термін у курсі: <em>{selected.termEn}</em>
            </p>
            <dl className="study-failure-details">
              <div>
                <dt>Що це простими словами?</dt>
                <dd>{parseLessonBold(selected.plainUk)}</dd>
              </div>
              <div>
                <dt>Звідки код бере значення?</dt>
                <dd>{parseLessonBold(selected.sourceUk)}</dd>
              </div>
              <div>
                <dt>Де з’являється: подія, trace чи метрика?</dt>
                <dd>{parseLessonBold(selected.whereUk)}</dd>
              </div>
              <div>
                <dt>Яке питання вирішує при розслідуванні?</dt>
                <dd>{parseLessonBold(selected.investigationUk)}</dd>
              </div>
              <div>
                <dt>Як це виглядає в QA Agent?</dt>
                <dd>{parseLessonBold(selected.qaAgentUk)}</dd>
              </div>
            </dl>
          </>
          ) : (
            <p className="muted small">{STUDY_EMPTY_ITEM_PANEL_UK}</p>
          )
        }
      />
    </div>
  );
}

export function StudyGuardrailsObservability() {
  return (
    <article className="study-obs-lesson">
      <StudyGuardrailsSectionTopicIntro sectionTitle="Observability" showCardsHow={false} />
      <section className="study-obs-block" aria-labelledby="obs-why">
        <h3 id="obs-why" className="study-obs-heading">Навіщо нам це бачити</h3>
        <LessonRichParagraphs
          className="lesson-p"
          text="У production запитують: чому агент не створив bug у Jira, чому заблокували read, хто схвалив write. Відповідь у **записах коду** (policy, audit, trace), а не в промпті."
        />
        <aside className="lesson-callout lesson-key-idea study-obs-callout">
          <span className="lesson-callout-label">Ключовий висновок</span>
          <p className="lesson-p">
            LLM лише <strong>пропонує</strong> tool call. Перевірку, запис події й виклик Jira API виконує TypeScript harness і executor.
            Якщо <code lang="en">policy_decision: deny</code>, інструмент <strong>не виконувався</strong>, навіть якщо модель «впевнено» просила{' '}
            <code lang="en">createJiraIssue</code>.
          </p>
        </aside>
      </section>

      <section className="study-obs-block" aria-labelledby="obs-run">
        <h3 id="obs-run" className="study-obs-heading">Один запуск крок за кроком</h3>
        <p className="study-obs-intro muted small">
          <span className="study-obs-teach-badge">навчальний сценарій</span> QA Regression Investigation Agent, умовні дані.
        </p>
        <ol className="study-obs-steps">
          <li>Playwright-тест <code lang="en">login.spec.ts</code> упав у CI, шлях до <code>./playwright-report/</code>.</li>
          <li>Людина або CI запускає агента — harness отримує runId і actor.</li>
          <li>Після allow на read-only tools код читає report, trace, logs.</li>
          <li>LLM <strong>пропонує</strong> <code lang="en">createJiraIssue</code> для project QA — це ще не ticket у Jira.</li>
          <li>Policy engine зіставляє actor, tool, resource <code lang="en">jira:project/QA</code>, action write.</li>
          <li>Далі — одна з гілок на схемі (не послідовні кроки).</li>
        </ol>
        <StudyPolicyApprovalFlowDiagram />
      </section>

      <section className="study-obs-block" aria-labelledby="obs-levels">
        <h3 id="obs-levels" className="study-obs-heading">Подія vs trace vs метрики</h3>
        <div className="study-obs-levels">
          <div className="study-component-card">
            <h4 className="study-component-title">Подія в журналі</h4>
            <p>Один запис = одне рішення або одна дія коду: що запросили, actor, resource, rule id, policy decision.</p>
          </div>
          <div className="study-component-card">
            <h4 className="study-component-title">Trace одного запуску</h4>
            <p>Усі події одного runId в порядку часу — від старту до результату. Відновлює шлях агента.</p>
          </div>
          <div className="study-component-card">
            <h4 className="study-component-title">Метрики й дашборд</h4>
            <p>Агрегат багатьох runs: deny_rate, p95 approval latency, топ rule id. <strong>Графік тут</strong>, не в trace одного run.</p>
          </div>
        </div>
        <ObsJson label="Приклад події в trace/log" json={GUARDRAILS_OBS_EVENT_EXAMPLE_JSON} />
        <ObsJson label="approval_granted — людина схвалила (issue ще не створено)" json={GUARDRAILS_OBS_APPROVAL_GRANTED_JSON} />
        <div className="study-obs-metric-wrap">
          <p className="study-obs-figure-cap">
            Приклад метрики на дашборді <span className="study-obs-teach-badge">навчальний приклад</span>
          </p>
          <table className="study-obs-metric-table">
            <caption className="sr-only">Метрики за 24 години staging</caption>
            <thead>
              <tr>
                <th>Метрика</th>
                <th>Значення</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code lang="en">policy_checks_total</code></td>
                <td>10 000</td>
              </tr>
              <tr>
                <td><code lang="en">policy_denied_total</code></td>
                <td>10</td>
              </tr>
              <tr>
                <td><code lang="en">deny_rate</code></td>
                <td>0,1% (10 / 10 000)</td>
              </tr>
              <tr>
                <td><code lang="en">approval_latency_p95</code></td>
                <td>4 хв</td>
              </tr>
            </tbody>
          </table>
          <p className="muted small study-obs-metric-note">
            10 deny з 10 000 перевірок і 10 deny з 20 — різні ситуації. Spike deny — привід розібратися (rule id, deploy, тести), не автоматичний доказ атаки.
          </p>
        </div>
      </section>

      <section className="study-obs-block" aria-labelledby="obs-fields">
        <h3 id="obs-fields" className="study-obs-heading">Які поля записуємо і яке питання вони вирішують</h3>
        <p className="muted small study-obs-intro">
          Кожне поле пояснено через сценарій <code lang="en">createJiraIssue</code> і project QA.
        </p>
        <FieldSplitPanel />
      </section>

      <section className="study-obs-block" aria-labelledby="obs-scenarios">
        <h3 id="obs-scenarios" className="study-obs-heading">Чотири кінцівки сценарію</h3>
        <ul className="study-obs-scenario-list">
          {GUARDRAILS_OBS_SCENARIO_OUTCOMES.map((s) => (
            <li key={s.id} className="study-component-card">
              <h4 className="study-component-title">{s.titleUk}</h4>
              <p>{s.bodyUk}</p>
            </li>
          ))}
        </ul>
        <ObsJson label="deny" json={GUARDRAILS_OBS_DENY_JSON} />
        <ObsJson label="approval_denied" json={GUARDRAILS_OBS_APPROVAL_DENIED_JSON} />
        <ObsJson label="Після re-check: успіх API" json={GUARDRAILS_OBS_EXECUTOR_SUCCESS_JSON} />
        <ObsJson label="allow execute, але помилка Jira API" json={GUARDRAILS_OBS_EXECUTOR_ERROR_JSON} />
      </section>

      <section className="study-obs-block" aria-labelledby="obs-release">
        <h3 id="obs-release" className="study-obs-heading">Приклад розслідування після релізу</h3>
        <p>
          <span className="study-obs-teach-badge">навчальний приклад</span> Після deploy policy v2 на staging{' '}
          <code lang="en">policy_denied_total</code> за годину: 2 → 18 при <code lang="en">policy_checks_total</code> ≈ 5200.{' '}
          <code lang="en">deny_rate</code> ≈ 0,35% (було ≈ 0,04%). Дашборд показує топ <code lang="en">rule_id</code> — reports-read-sandbox.
          У trace одного run — deny на read з resource path. Висновок: регресія політики або тестів, не «атака» без доказів.
        </p>
      </section>

      <section className="study-obs-block" aria-labelledby="obs-qa">
        <h3 id="obs-qa" className="study-obs-heading">Як QA це перевіряє</h3>
        <ul className="study-obs-qa-list">
          <li>На expected deny / needs_approval у eval є подія з policy_decision і rule_id.</li>
          <li>deny → немає executor span і немає issue в mock Jira.</li>
          <li>needs_approval → немає create до approval_granted, потім re-check, потім executor.</li>
          <li>approval_denied → executor не викликається.</li>
          <li>allow execute + JIRA_503 → окрема подія tool_execution_result error, issue не створено.</li>
          <li>Порівнюйте deny_rate з baseline, не лише абсолютний лічильник deny.</li>
          <li>У тестах — фейкові run_id та email, без API keys і PII.</li>
        </ul>
      </section>

      <section className="study-obs-block" aria-labelledby="obs-remember">
        <aside className="lesson-callout lesson-key-idea study-remember-rich">
          <h3 id="obs-remember" className="study-obs-heading study-obs-heading-in-callout">Запам’ятати</h3>
          <ul className="study-obs-remember-list">
            {GUARDRAILS_OBS_REMEMBER.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </aside>
      </section>

      <details className="study-obs-original">
        <summary>Текст з матеріалу курсу (повний оригінал для звірки)</summary>
        <pre className="study-obs-source">{GUARDRAILS_OBS_SOURCE_MARKDOWN}</pre>
      </details>
    </article>
  );
}
