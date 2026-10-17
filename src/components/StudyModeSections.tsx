import { useCallback, useMemo, useState } from 'react';
import type { StudySection } from '../lib/studySections';
import {
  extractBulletComponentList,
  extractKeyIdeaBlock,
  extractProcessSteps,
  extractTransferFlow,
  normalizeStudyBullets,
} from '../lib/studyBodyFormat';
import { StudyComponentGlossary } from './lesson/StudyComponentGlossary';
import { StudyKeyIdeaCallout } from './lesson/StudyKeyIdeaCallout';
import {
  StudyGuardrailsConnections,
  StudyGuardrailsDataTransfer,
  StudyGuardrailsFailureModes,
  StudyGuardrailsInterview,
  StudyGuardrailsObservability,
  StudyGuardrailsProduction,
  StudyGuardrailsQaTests,
  StudyGuardrailsRemember,
  StudyGuardrailsSecurity,
} from './lesson/StudyGuardrailsExtraSections';
import { StudyGuardrailsPolicyExample } from './lesson/StudyGuardrailsPolicyExample';
import { StudyLlmVsCodeBoundary } from './lesson/StudyLlmVsCodeBoundary';
import { StudyProcessStepCards } from './lesson/StudyProcessStepCards';
import { StudyTransferFlow } from './lesson/StudyTransferFlow';
import { StudyRagFailureCards } from './lesson/StudyRagFailureCards';
import { StudyRagOneQueryFlow } from './lesson/StudyRagOneQueryFlow';
import { extractRagInvestigationScenario } from '../lib/ragInvestigationScenario';
import { extractRagOfflinePipeline } from '../lib/ragOfflinePipeline';
import { StudyRagOfflinePipeline } from './lesson/StudyRagOfflinePipeline';
import { StudyRagDataChainAndPrompt } from './lesson/StudyRagDataChainAndPrompt';
import { extractRagDataChainAndPrompt } from '../lib/ragDataChainPrompt';
import { extractRagQaChecks } from '../lib/ragQaSection';
import { StudyRagQaChecks } from './lesson/StudyRagQaChecks';
import { extractRagProductionSection } from '../lib/ragProductionSection';
import { StudyRagProductionCards } from './lesson/StudyRagProductionCards';
import { StudyRagPipelineComponents } from './lesson/StudyRagPipelineComponents';
import { StudyLessonAside } from './lesson/StudyLessonAside';
import { hasStudyLessonAside } from '../data/study/study-lesson-aside.registry';
import { stripRagPipelineInlineList } from '../lib/ragPrepSection';
import { stripRagInterviewTablesFromRememberSection } from '../lib/ragRememberSection';
import { StudyInterviewSelfCheck } from './lesson/StudyInterviewSelfCheck';
import { StudyToolCallingComponents } from './lesson/StudyToolCallingComponents';
import { StudyToolCallingOneFlow } from './lesson/StudyToolCallingOneFlow';
import { StudyToolCallingFailureModes } from './lesson/StudyToolCallingFailureModes';
import { StudyToolCallingQaTesting } from './lesson/StudyToolCallingQaTesting';
import { StudyToolCallingLlmCodeBoundary } from './lesson/StudyToolCallingLlmCodeBoundary';
import {
  getStudyInterviewDeck,
  shouldShowInterviewDeck,
} from '../data/study/study-interview-registry';
import type { LearningStatus } from '../types/topic';
import { StudySourcesCollapsible } from './lesson/StudySourcesCollapsible';
import { StudyProcessSchema } from './lesson/StudyProcessSchema';
import { isLikelyFlowDiagram, parseStudyFlowAscii } from '../lib/studyFlowSchema';
import { getLessonNavBlurb, getLessonOutcomesFlowAriaLabel } from '../data/study/study-lesson-intros';
import { getMapLabel } from '../data/learning-map.registry';
import { MarkdownBody } from './MarkdownBody';
import { StudyMarkdownWithFlows } from './lesson/StudyMarkdownWithFlows';
import { stripFencedArrowFlowBlock } from '../lib/studyArrowFlow';
import { StudyFlowRibbon } from './lesson/StudyFlowRibbon';
import { parseArrowFlowParagraph, splitMarkdownWithArrowFlows } from '../lib/studyArrowFlow';

interface Props {
  sections: StudySection[];
  introMarkdown?: string;
  topicId?: string;
  /** Початково розгорнута одна секція (id) */
  initialOpenId?: string | null;
  sourcesMarkdown?: string;
  chapterTitle?: string;
  learning?: LearningStatus;
  onLearningChange?: (s: LearningStatus) => void;
}

export function StudyModeSections({
  sections,
  introMarkdown = '',
  topicId,
  initialOpenId = null,
  sourcesMarkdown = '',
  chapterTitle,
  learning = 'not_studied',
  onLearningChange,
}: Props) {
  const allIds = useMemo(() => sections.map((s) => s.id), [sections]);
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const first = initialOpenId ?? sections[0]?.id;
    if (first) return new Set([first]);
    return new Set();
  });
  const [activeNavId, setActiveNavId] = useState(sections[0]?.id ?? '');

  const navBlurb = topicId ? getLessonNavBlurb(topicId) : null;
  const lessonLabel = topicId ? getMapLabel(topicId) : null;
  const outcomesFlowAriaLabel = topicId ? getLessonOutcomesFlowAriaLabel(topicId) : 'Схема з уроку';

  const expandAll = useCallback(() => setOpenIds(new Set(allIds)), [allIds]);
  const collapseAll = useCallback(() => setOpenIds(new Set()), []);

  const toggle = (id: string) => {
    setActiveNavId(id);
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const scrollToSection = (id: string) => {
    setActiveNavId(id);
    setOpenIds((prev) => new Set(prev).add(id));
    document.getElementById(`study-section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (sections.length === 0) {
    return <p className="muted">Секції Study Mode ще не структуровані для цієї теми.</p>;
  }

  const asideLayout = topicId ? hasStudyLessonAside(topicId) : false;

  return (
    <div
      className={`structured-study-layout study-mode-layout${asideLayout ? ' study-mode-with-aside' : ''}`}
    >
      <nav className="study-col-nav study-col-nav-sticky" aria-label="Зміст уроку">
        {lessonLabel && <p className="study-col-nav-title">{lessonLabel}</p>}
        {navBlurb && <p className="study-lesson-nav-blurb muted small">{navBlurb}</p>}
        <p className="study-col-nav-sub muted small">Розділи</p>
        <ul className="study-nav-flat">
          {sections.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className={activeNavId === s.id ? 'active' : ''}
                onClick={() => scrollToSection(s.id)}
              >
                <span className="study-nav-num">{s.readerNumber}.</span> {s.navTitle}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="study-col-main">
        {chapterTitle && (
          <header className="study-chapter-header study-chapter-header-inline">
            <h2 className="study-chapter-title">{chapterTitle}</h2>
          </header>
        )}
        {introMarkdown && (
          <aside className="study-learning-outcomes" aria-label="Що я зрозумію після цього уроку">
            <h2 className="study-outcomes-title">Що я зрозумію після цього уроку</h2>
            <div className="markdown-body study-outcomes-body study-outcomes-with-flows">
              <StudyMarkdownWithFlows
                markdown={introMarkdown}
                flowAriaLabel={outcomesFlowAriaLabel}
              />
            </div>
          </aside>
        )}

        <div className="study-toolbar">
          <button type="button" className="study-toolbar-btn" onClick={expandAll}>
            Розгорнути всі
          </button>
          <button type="button" className="study-toolbar-btn" onClick={collapseAll}>
            Згорнути всі
          </button>
        </div>

        <div className="study-sections">
          {sections.map((section) => {
            const isOpen = openIds.has(section.id);
            return (
              <section
                key={section.id}
                id={`study-section-${section.id}`}
                className={`study-section ${isOpen ? 'open' : ''}`}
              >
                <button
                  type="button"
                  className="study-section-header"
                  aria-expanded={isOpen}
                  onClick={() => toggle(section.id)}
                >
                  <span className="study-section-chevron" aria-hidden="true">{isOpen ? '▼' : '▶'}</span>
                  <span className="study-section-title">{section.title}</span>
                </button>
                {isOpen && (
                  <div className="study-section-body markdown-body">
                    <LessonBodyEnhancements
                      markdown={section.bodyMarkdown}
                      topicId={topicId}
                      sectionTitle={section.navTitle}
                    />
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {sourcesMarkdown?.trim() && <StudySourcesCollapsible markdown={sourcesMarkdown} />}
      </div>

      {asideLayout && topicId && onLearningChange && (
        <StudyLessonAside
          topicId={topicId}
          sections={sections}
          activeSectionId={activeNavId}
          learning={learning}
          onLearningChange={onLearningChange}
        />
      )}
    </div>
  );
}

function LessonBodyEnhancements({
  markdown,
  topicId,
  sectionTitle,
}: {
  markdown: string;
  topicId?: string;
  sectionTitle?: string;
}) {
  const parts = useMemo(() => splitContentBlocks(markdown), [markdown]);
  return (
    <>
      {parts.map((part, i) => {
        if (part.kind === 'flow') {
          const schema = parseStudyFlowAscii(part.text);
          return <StudyProcessSchema key={i} schema={schema} />;
        }
        return (
          <StudyMarkdownSegment key={i} text={part.text} topicId={topicId} sectionTitle={sectionTitle} />
        );
      })}
    </>
  );
}

function StudyMarkdownSegment({
  text,
  topicId,
  sectionTitle,
}: {
  text: string;
  topicId?: string;
  sectionTitle?: string;
}) {
  if (!text.trim()) return null;

  if (topicId === 'concept-03' && (sectionTitle ?? '').toLowerCase().includes('production')) {
    const prod = extractRagProductionSection(text);
    if (prod.items.length >= 2) {
      return <StudyRagProductionCards items={prod.items} footerMarkdown={prod.footerMarkdown} />;
    }
  }

  if (topicId === 'concept-03' && (sectionTitle ?? '').toLowerCase().includes('qa це тестує')) {
    const qaItems = extractRagQaChecks(text);
    if (qaItems.length >= 3) {
      return <StudyRagQaChecks items={qaItems} />;
    }
  }

  if (topicId === 'concept-03' && (sectionTitle ?? '').toLowerCase().includes('помилитися')) {
    return <StudyRagFailureCards markdown={text} />;
  }

  if (topicId === 'concept-10' && (sectionTitle ?? '').toLowerCase().includes('один виклик')) {
    return <StudyToolCallingOneFlow />;
  }

  if (topicId === 'concept-10' && (sectionTitle ?? '').toLowerCase().includes('складається')) {
    let intro = stripFencedArrowFlowBlock(text.split(/Оберіть крок/i)[0]?.trim() ?? text);
    intro = intro.replace(/^Типовий ланцюг[^\n]*\n+/im, '').trim();
    return (
      <>
        {intro ? (
          <StudyMarkdownWithFlows
            markdown={intro}
            flowAriaLabel="Ланцюг tool calling"
          />
        ) : null}
        <StudyToolCallingComponents />
      </>
    );
  }

  if (topicId === 'concept-10' && (sectionTitle ?? '').toLowerCase().includes('зламатися')) {
    const intro = text.split(/^####\s+/m)[0]?.trim();
    return <StudyToolCallingFailureModes introUk={intro} />;
  }

  if (topicId === 'concept-10' && (sectionTitle ?? '').toLowerCase().includes('qa це тестує')) {
    return <StudyToolCallingQaTesting introUk={text.trim()} />;
  }

  if (topicId === 'concept-10' && /де код.*llm/i.test((sectionTitle ?? '').toLowerCase())) {
    return <StudyToolCallingLlmCodeBoundary introMarkdown={text.trim()} />;
  }

  if (topicId === 'concept-03' && (sectionTitle ?? '').toLowerCase().includes('одному запиті')) {
    const ragScene = extractRagInvestigationScenario(text);
    if (ragScene) {
      return <StudyRagOneQueryFlow scenario={ragScene.scenario} restMarkdown={ragScene.rest} />;
    }
  }

  if (topicId === 'concept-03' && /де код.*llm/i.test((sectionTitle ?? '').toLowerCase())) {
    const dataChain = extractRagDataChainAndPrompt(text);
    if (dataChain) {
      return (
        <>
          {dataChain.before ? (
            <StudyMarkdownSegment text={dataChain.before} topicId={topicId} sectionTitle={sectionTitle} />
          ) : null}
          <StudyRagDataChainAndPrompt chainLines={dataChain.chainLines} prompt={dataChain.prompt} />
          {dataChain.after ? (
            <StudyMarkdownSegment text={dataChain.after} topicId={topicId} sectionTitle={sectionTitle} />
          ) : null}
        </>
      );
    }
  }

  if (topicId && shouldShowInterviewDeck(topicId, sectionTitle ?? '')) {
    const deck = getStudyInterviewDeck(topicId);
    if (deck) {
      let rememberMd = text;
      if (topicId === 'concept-03') rememberMd = stripRagInterviewTablesFromRememberSection(text);
      if (topicId === 'concept-10') {
        rememberMd = text.replace(/Нижче — інтерактив[^\n]*\n?/i, '').trim();
      }
      if (topicId === 'concept-17') {
        rememberMd = text
          .replace(/\*\*Interview answer\*\*[\s\S]*?(?=\n###|\n##|$)/i, '')
          .replace(/Нижче — інтерактив[^\n]*\n?/i, '')
          .trim();
      }
      return (
        <>
          {rememberMd.trim() ? <MarkdownBody markdown={rememberMd} studyTables /> : null}
          <StudyInterviewSelfCheck deck={deck} />
        </>
      );
    }
  }

  if (topicId === 'concept-03' && (sectionTitle ?? '').toLowerCase().includes('підготувати документи')) {
    const offline = extractRagOfflinePipeline(text);
    if (offline) {
      const before = stripRagPipelineInlineList(offline.before);
      const after = stripRagPipelineInlineList(offline.after);
      const showPipelineList =
        offline.before.includes('Типові компоненти pipeline') ||
        text.includes('Типові компоненти pipeline');
      return (
        <>
          {before ? (
            <StudyMarkdownSegment text={before} topicId={topicId} sectionTitle={sectionTitle} />
          ) : null}
          <StudyRagOfflinePipeline pipeline={offline.pipeline} />
          {showPipelineList && <StudyRagPipelineComponents />}
          {after ? (
            <StudyMarkdownSegment text={after} topicId={topicId} sectionTitle={sectionTitle} />
          ) : null}
        </>
      );
    }
  }

  if (topicId === 'concept-17' && isLlmVsCodeSection(sectionTitle, text)) {
    return <StudyLlmVsCodeBoundary sourceText={text} />;
  }

  if (topicId === 'concept-17' && isPolicyExampleSection(sectionTitle, text)) {
    return <StudyGuardrailsPolicyExample />;
  }

  if (topicId === 'concept-17') {
    const extra = renderGuardrailsBySection(sectionTitle, text);
    if (extra) return extra;
  }

  const keyIdea = extractKeyIdeaBlock(text);
  if (keyIdea) {
    return (
      <>
        <StudyKeyIdeaCallout sourceText={keyIdea.idea} topicId={topicId} />
        {keyIdea.rest ? (
          <StudyMarkdownSegment text={keyIdea.rest} topicId={topicId} sectionTitle={sectionTitle} />
        ) : null}
      </>
    );
  }

  const steps = extractProcessSteps(text);
  if (steps) {
    return (
      <>
        {steps.rest ? (
          <StudyMarkdownSegment text={steps.rest} topicId={topicId} sectionTitle={sectionTitle} />
        ) : null}
        <StudyProcessStepCards steps={steps.steps} topicId={topicId} sectionHint={sectionTitle} />
      </>
    );
  }

  const arrowOnly = parseArrowFlowParagraph(text.trim());
  if (arrowOnly) {
    return <StudyFlowRibbon stages={arrowOnly} layout="ribbon" />;
  }

  const transfer = extractTransferFlow(text);
  if (transfer) {
    return (
      <>
        <StudyTransferFlow stages={transfer.stages} />
        {transfer.rest ? (
          <StudyMarkdownSegment text={transfer.rest} topicId={topicId} sectionTitle={sectionTitle} />
        ) : null}
      </>
    );
  }

  const components = extractBulletComponentList(text);
  const useComponentGlossary =
    components &&
    (topicId !== 'concept-17' || (sectionTitle ?? '').toLowerCase().includes('компонентів'));
  if (useComponentGlossary && components) {
    return (
      <>
        {components.rest ? (
          <StudyMarkdownSegment text={components.rest} topicId={topicId} sectionTitle={sectionTitle} />
        ) : null}
        <StudyComponentGlossary items={components.items} topicId={topicId} />
      </>
    );
  }

  const normalized = normalizeStudyBullets(text);
  if (normalized.includes('→') && splitMarkdownWithArrowFlows(normalized).some((p) => p.kind === 'flow')) {
    return <StudyMarkdownWithFlows markdown={normalized} />;
  }
  return <MarkdownBody markdown={normalized} studyTables />;
}

function splitContentBlocks(md: string): Array<{ kind: 'md' | 'flow'; text: string }> {
  const lines = md.split('\n');
  const out: Array<{ kind: 'md' | 'flow'; text: string }> = [];
  let buf: string[] = [];
  let flowBuf: string[] = [];
  let inFlow = false;

  const flushMd = () => {
    const text = buf.join('\n').trim();
    if (text) out.push({ kind: 'md', text });
    buf = [];
  };
  const flushFlow = () => {
    const text = flowBuf.join('\n').trim();
    if (text && isLikelyFlowDiagram(text)) out.push({ kind: 'flow', text });
    else if (text) out.push({ kind: 'md', text: `\n\n\`\`\`\n${text}\n\`\`\`\n` });
    flowBuf = [];
    inFlow = false;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!inFlow && trimmed.includes('↓')) {
      if (buf.length > 0) {
        const last = buf[buf.length - 1];
        if (last.trim() && !last.trim().startsWith('#') && !last.trim().startsWith('**Крок')) {
          buf.pop();
          flushMd();
          flowBuf.push(last);
        } else {
          flushMd();
        }
      } else {
        flushMd();
      }
      inFlow = true;
      flowBuf.push(line);
      continue;
    }

    if (inFlow) {
      if (trimmed === '') {
        flowBuf.push(line);
        continue;
      }
      if (isFlowDiagramLine(trimmed)) {
        flowBuf.push(line);
        continue;
      }
      flushFlow();
      buf.push(line);
      continue;
    }

    buf.push(line);
  }
  flushMd();
  if (inFlow) flushFlow();

  if (out.length === 0) return [{ kind: 'md', text: md }];
  return out;
}

const BRANCH_PREFIX = /^[├└│]/;

function isLlmVsCodeSection(sectionTitle?: string, text?: string): boolean {
  const t = (sectionTitle ?? '').toLowerCase();
  if (t.includes('llm') && t.includes('deterministic')) return true;
  return /mental models/i.test(text ?? '') && /probabilistic interpretation/i.test(text ?? '');
}

function isPolicyExampleSection(sectionTitle?: string, text?: string): boolean {
  const t = (sectionTitle ?? '').toLowerCase();
  if (t.includes('простий приклад') || t.includes('повний простий')) return true;
  return (
    /tool registry/i.test(text ?? '') ||
    (/production/i.test(text ?? '') && /jira/i.test(text ?? '') && /заборонено|читати/i.test(text ?? ''))
  );
}

function renderGuardrailsBySection(sectionTitle?: string, text?: string) {
  const t = (sectionTitle ?? '').toLowerCase();
  if (t.includes('передається між')) return <StudyGuardrailsDataTransfer />;
  if (t.includes('впасти') || t.includes('failure')) {
    return <StudyGuardrailsFailureModes />;
  }
  if (t.includes('security') || t.includes('захистити')) return <StudyGuardrailsSecurity />;
  if (t.includes('тестувати') || t.includes('qa/sdet')) {
    return <StudyGuardrailsQaTests />;
  }
  if (t.includes('observability')) return <StudyGuardrailsObservability />;
  if (t.includes('production considerations')) return <StudyGuardrailsProduction />;
  if (t.includes('пов') && t.includes('язан')) return <StudyGuardrailsConnections />;
  if (t.includes('співбесід')) return <StudyGuardrailsInterview />;
  if (t.includes('запам') || t.includes('ось воно')) {
    return <StudyGuardrailsRemember sourceText={text} />;
  }
  return null;
}

/** Рядок належить ASCII-схемі (не звичайний абзац уроку) */
function isFlowDiagramLine(trimmed: string): boolean {
  if (!trimmed) return true;
  if (trimmed.includes('↓')) return true;
  if (BRANCH_PREFIX.test(trimmed)) return true;
  if (trimmed.startsWith('│')) return true;
  if (/^(LLM proposes|Policy\/|Model |Harness |User\/|Trigger |Root request)/i.test(trimmed)) return true;
  if (trimmed.length <= 80 && !/^(\*\*Крок|\d+\.)/.test(trimmed) && !trimmed.endsWith('.')) {
    const words = trimmed.split(/\s+/).length;
    if (words <= 12) return true;
  }
  return false;
}
