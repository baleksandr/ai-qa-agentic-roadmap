import { useMemo, useState } from 'react';
import type { RagInvestigationScenario } from '../../lib/ragInvestigationScenario';
import { extractRagQaRisksMarkdown } from '../../lib/ragQaRisksFromRest';
import { RAG_OFFLINE_DOCS_SECTION_ID } from '../../data/study/rag-query-flow-steps';
import {
  RAG_HYPOTHESIS_EXAMPLE,
  RAG_LLM_PROMPT_SNIPPET,
  RAG_ONE_QUERY_STORY_INTRO,
  RAG_ONE_QUERY_STORY_STEPS,
  RAG_STEP6_CHECKS,
  RAG_STEP6_QA_OUTCOMES,
} from '../../data/study/rag-one-query-story';
import { StudyRagThreeStates } from './StudyRagThreeStates';
import { MarkdownBody } from '../MarkdownBody';
import { StudyPipelineStepNav } from './StudyPipelineStepNav';
import { StudyStepDetailLayout } from './StudyStepDetailLayout';
type Props = {
  scenario: RagInvestigationScenario;
  restMarkdown?: string;
};

export function StudyRagOneQueryFlow({ scenario, restMarkdown = '' }: Props) {
  const steps = RAG_ONE_QUERY_STORY_STEPS;
  const [activeStep, setActiveStep] = useState(1);
  const [techOpen, setTechOpen] = useState(false);

  const step = steps[activeStep - 1];
  const qaRisksMd = useMemo(() => extractRagQaRisksMarkdown(restMarkdown), [restMarkdown]);

  return (
    <section className="study-rag-one-query" aria-label="Одна історія RAG run">
      <p className="study-rag-scenario-kicker muted small">
        Навчальний приклад · умовні INC-* · `login_spec` на staging
      </p>

      <div className="study-rag-story-intro lesson-callout lesson-key-idea">
        <span className="lesson-callout-label">Одна історія run</span>
        <p className="study-rag-story-intro-text">{RAG_ONE_QUERY_STORY_INTRO}</p>
      </div>

      <p className="muted small study-rag-offline-oneline">
        Передумова: минулі інциденти вже в індексі{' '}
        <code>index-v12</code> (
        <a href={`#study-section-${RAG_OFFLINE_DOCS_SECTION_ID}`}>як готують документи</a>
        ) — не крок цієї історії.
      </p>

      <StudyStepDetailLayout
        wrapperClassName="study-rag-pipeline-glossary study-rag-pipeline-with-panel"
        navAriaLabel="Шість кроків одного run"
        nav={
          <StudyPipelineStepNav
            items={steps.map((s, i) => ({
              key: i + 1,
              titleUk: s.titleUk,
              teaserUk: s.teaserUk,
            }))}
            activeKey={activeStep}
            onSelect={(key) => {
              setActiveStep(Number(key));
              setTechOpen(false);
            }}
            ariaLabel="Шість кроків одного run"
          />
        }
        panel={
        <article className="study-rag-story-panel study-step-detail-panel" aria-live="polite">
          <h4 className="study-rag-story-panel-title">{step.titleUk}</h4>

          <dl className="study-rag-story-facts">
            <div>
              <dt>Що сталося</dt>
              <dd>{step.whatUk}</dd>
            </div>
            <div>
              <dt>Хто зробив</dt>
              <dd>{step.whoUk}</dd>
            </div>
            <div>
              <dt>Що далі</dt>
              <dd>{step.nextUk}</dd>
            </div>
          </dl>

          {activeStep === 2 && (
            <div className="study-rag-story-inline-example">
              <p className="small study-rag-story-inline-label">Що саме запитали в пошуку (умовно)</p>
              <pre className="study-rag-query-card-pre">{scenario.queryLine}</pre>
              <ul className="study-rag-filter-chips">
                {scenario.filters.map((f) => (
                  <li key={f.key}>
                    <code>{f.key}</code>
                    <span className="study-rag-filter-eq">=</span>
                    <span>{f.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeStep === 3 && <StudyRagThreeStates scenario={scenario} />}

          {activeStep === 4 && (
            <div className="study-rag-prompt-snippet">
              <p className="small muted">Фрагмент prompt для LLM (скорочено)</p>
              <div className="study-prompt-stack">
                <div className="study-prompt-block study-prompt-block-retrieved">
                  <div className="study-prompt-block-head">
                    <span className="study-prompt-block-badge">{RAG_LLM_PROMPT_SNIPPET.retrievedBadgeUk}</span>
                  </div>
                  <pre className="study-prompt-block-body is-mono">{RAG_LLM_PROMPT_SNIPPET.retrievedUk}</pre>
                  <p className="muted small study-rag-prompt-callout">{RAG_LLM_PROMPT_SNIPPET.retrievedNoteUk}</p>
                </div>
                <div className="study-prompt-block study-prompt-block-user">
                  <div className="study-prompt-block-head">
                    <span className="study-prompt-block-badge">User</span>
                  </div>
                  <pre className="study-prompt-block-body">{RAG_LLM_PROMPT_SNIPPET.userUk}</pre>
                </div>
              </div>
              <p className="muted small">{RAG_LLM_PROMPT_SNIPPET.noteUk}</p>
            </div>
          )}

          {activeStep === 5 && (
            <blockquote className="study-rag-hypothesis-quote">
              {RAG_HYPOTHESIS_EXAMPLE}
              <footer className="muted small">Гіпотеза моделі — не доведена причина сьогоднішнього падіння.</footer>
            </blockquote>
          )}

          {activeStep === 6 && (
            <div className="study-rag-step6-block">
              <ol className="study-rag-verify-layers">
                {RAG_STEP6_CHECKS.map((c) => (
                  <li key={c.layerUk}>
                    <span className="study-rag-verify-layer-label">{c.layerUk}</span>
                    <p>{c.bodyUk}</p>
                  </li>
                ))}
              </ol>
              <p className="study-rag-verify-order-note muted small">
                Технічна перевірка не замінює змістовну й перевірку поточного збою.
              </p>
              <h5 className="study-rag-qa-outcomes-title">Можливі висновки QA</h5>
              <ul className="study-rag-qa-outcomes">
                {RAG_STEP6_QA_OUTCOMES.map((o) => (
                  <li key={o.labelUk}>
                    <strong>{o.labelUk}</strong>
                    <span className="muted small"> — {o.hintUk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <details
            className="study-rag-tech-details"
            open={techOpen}
            onToggle={(e) => setTechOpen((e.target as HTMLDetailsElement).open)}
          >
            <summary>Технічні деталі цього кроку</summary>
            <div className="markdown-body study-rag-tech-body">
              <MarkdownBody markdown={step.techMarkdownUk} studyPanelLabels />
            </div>
          </details>
        </article>
        }
      />

      {qaRisksMd ? (
        <aside className="study-rag-qa-risks-aside">
          <h4 className="study-rag-block-heading">Два ризики для QA</h4>
          <div className="markdown-body">
            <MarkdownBody markdown={qaRisksMd} studyTables />
          </div>
        </aside>
      ) : null}
    </section>
  );
}
