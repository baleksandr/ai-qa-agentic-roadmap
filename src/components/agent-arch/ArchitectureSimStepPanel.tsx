import { Link } from 'react-router-dom';
import { ArchInteractiveActionLabel } from './ArchInteractiveActionLabel';
import type { AgentNodeConnectionCard } from '../../lib/agentCycleNodeConnections';
import type { SimStepPanel } from '../../types/architecture-simulation';
import type { AgentNodePanelKind } from '../../data/architecture/agent-cycle-node-panel-views';
type Props = {
  title: string;
  stepIndex: number;
  stepCount: number;
  panel: SimStepPanel;
  focusedNode: boolean;
  onBackToStep?: () => void;
  topicLinks: { topicId: string; label: string }[];
  exitConditions?: string[];
  auxItems?: { label: string; summary: string; topicId: string }[];
  onOpenRagMcpIntro?: () => void;
  transitionView?: {
    leadUk?: string;
    fromUk: string;
    payloadUk: string;
    toUk: string;
    purposeUk: string;
    scope?: 'sideState' | 'main';
  };
  nodeView?: {
    panelKind: AgentNodePanelKind;
    whoUk?: string;
    dataKindUk?: string;
    whatIsUk?: string;
    containsUk?: string;
    happensUk: string;
    receivesUk?: string;
    sendsUk: string;
    qaUk: string;
    alternativesUk?: string;
  };
  panelBilingualTitle?: { en: string; uk: string };
  nodeConnectionCards?: AgentNodeConnectionCard[];
  selectedNodeEdgeId?: string | null;
  onSelectNodeConnection?: (edgeId: string) => void;
  nodeConnectionDetail?: {
    leadUk?: string;
    fromUk: string;
    payloadUk: string;
    toUk: string;
    purposeUk: string;
    schematicOnly?: boolean;
    actionUk?: string;
  };
};

type Section = {
  key: string;
  titleUk: string;
  bodyUk: string;
  mono?: boolean;
  variant?: 'qa' | 'default';
};

function looksLikeCodeField(text: string): boolean {
  const t = text.trim();
  return (
    t.includes('[]') ||
    t.includes('messages') ||
    /^[a-z][a-zA-Z0-9_]*$/.test(t) ||
    t.includes('readReport') ||
    t.includes('readTrace')
  );
}

function buildSections(panel: SimStepPanel): Section[] {
  const sections: Section[] = [];
  if (panel.what?.trim()) {
    sections.push({ key: 'what', titleUk: 'Що відбувається', bodyUk: panel.what.trim() });
  }
  if (panel.who?.trim()) {
    sections.push({ key: 'who', titleUk: 'Хто виконує', bodyUk: panel.who.trim() });
  }
  if (panel.input?.trim()) {
    sections.push({
      key: 'input',
      titleUk: 'Що отримує',
      bodyUk: panel.input.trim(),
      mono: looksLikeCodeField(panel.input),
    });
  }
  if (panel.output?.trim()) {
    let outBody = panel.output.trim();
    if (panel.recipient?.trim()) {
      outBody = `${outBody} Кому: ${panel.recipient.trim()}`;
    }
    sections.push({
      key: 'output',
      titleUk: 'Що передає далі',
      bodyUk: outBody,
      mono: looksLikeCodeField(panel.output),
    });
  } else if (panel.recipient?.trim()) {
    sections.push({ key: 'recipient', titleUk: 'Що передає далі', bodyUk: panel.recipient.trim() });
  }
  const why = panel.problem?.trim() || panel.why?.trim();
  if (why) {
    sections.push({ key: 'why', titleUk: 'Навіщо цей крок', bodyUk: why });
  }
  if (panel.systemChange?.trim()) {
    sections.push({ key: 'system', titleUk: 'Що змінилось у системі', bodyUk: panel.systemChange.trim() });
  }
  if (panel.unknown?.trim()) {
    sections.push({ key: 'unknown', titleUk: 'Що ще невідомо', bodyUk: panel.unknown.trim() });
  }
  if (panel.qaAgent?.trim()) {
    sections.push({
      key: 'qa',
      titleUk: 'QA-перевірка',
      bodyUk: panel.qaAgent.trim(),
      variant: 'qa',
    });
  }
  if (panel.risks?.trim()) {
    sections.push({ key: 'risks', titleUk: 'Що може піти не так', bodyUk: panel.risks.trim() });
  }
  return sections;
}

function buildAgentNodeSections(nodeView: NonNullable<Props['nodeView']>): Section[] {
  const sections: Section[] = [];
  if (nodeView.panelKind === 'data' && nodeView.dataKindUk?.trim()) {
    sections.push({ key: 'data', titleUk: 'Що це за дані', bodyUk: nodeView.dataKindUk.trim() });
  }
  if (nodeView.panelKind === 'outcome') {
    if (nodeView.whatIsUk?.trim()) {
      sections.push({ key: 'what', titleUk: 'Що це', bodyUk: nodeView.whatIsUk.trim() });
    }
    if (nodeView.containsUk?.trim()) {
      sections.push({ key: 'contains', titleUk: 'Що містить', bodyUk: nodeView.containsUk.trim() });
    }
    if (nodeView.qaUk?.trim()) {
      sections.push({
        key: 'qa',
        titleUk: 'Що перевіряє QA',
        bodyUk: nodeView.qaUk.trim(),
        variant: 'qa',
      });
    }
    return sections;
  }
  if (nodeView.whoUk?.trim()) {
    sections.push({ key: 'who', titleUk: 'Хто це робить', bodyUk: nodeView.whoUk.trim() });
  }
  if (nodeView.happensUk?.trim()) {
    sections.push({ key: 'happens', titleUk: 'Що відбувається', bodyUk: nodeView.happensUk.trim() });
  }
  if (nodeView.receivesUk?.trim()) {
    sections.push({ key: 'receives', titleUk: 'Що отримує', bodyUk: nodeView.receivesUk.trim() });
  }
  if (nodeView.sendsUk?.trim()) {
    sections.push({ key: 'sends', titleUk: 'Що передає далі', bodyUk: nodeView.sendsUk.trim() });
  }
  if (nodeView.qaUk?.trim()) {
    sections.push({
      key: 'qa',
      titleUk: 'Що перевіряє QA',
      bodyUk: nodeView.qaUk.trim(),
      variant: 'qa',
    });
  }
  return sections;
}

export function ArchitectureSimStepPanel({
  title,
  stepIndex,
  stepCount,
  panel,
  focusedNode,
  onBackToStep,
  topicLinks,
  exitConditions,
  auxItems,
  onOpenRagMcpIntro,
  transitionView,
  nodeView,
  nodeConnectionCards,
  selectedNodeEdgeId,
  onSelectNodeConnection,
  nodeConnectionDetail,
  panelBilingualTitle,
}: Props) {
  const showNodeConnections = focusedNode && nodeConnectionCards && nodeConnectionCards.length > 0;
  const showExitConditions =
    exitConditions &&
    exitConditions.length > 0 &&
    !focusedNode &&
    !transitionView &&
    !nodeConnectionDetail;

  const sections = nodeConnectionDetail
    ? [
        { key: 'from', titleUk: 'Звідки', bodyUk: nodeConnectionDetail.fromUk },
        { key: 'payload', titleUk: 'Що передається', bodyUk: nodeConnectionDetail.payloadUk },
        { key: 'to', titleUk: 'Куди', bodyUk: nodeConnectionDetail.toUk },
        { key: 'purpose', titleUk: 'Навіщо', bodyUk: nodeConnectionDetail.purposeUk },
      ]
    : transitionView
      ? [
          { key: 'from', titleUk: 'Звідки', bodyUk: transitionView.fromUk },
          { key: 'payload', titleUk: 'Що передається', bodyUk: transitionView.payloadUk },
          { key: 'to', titleUk: 'Куди', bodyUk: transitionView.toUk },
          { key: 'purpose', titleUk: 'Навіщо', bodyUk: transitionView.purposeUk },
        ]
      : nodeView
        ? buildAgentNodeSections(nodeView)
        : buildSections(panel);

  return (
    <aside className="arch-sim-step-panel" aria-live="polite">
      <div className="arch-sim-panel-mode">
        {transitionView ? (
          <>
            <span
              className={`arch-sim-mode-badge ${transitionView.scope === 'sideState' ? 'is-side-state' : 'is-transition'}`}
            >
              {transitionView.scope === 'sideState'
                ? 'Бічна операція зі станом'
                : 'Перехід на схемі'}
            </span>
            {onBackToStep ? (
              <button type="button" className="arch-sim-mode-back" onClick={onBackToStep}>
                ← Пояснення кроку {stepIndex + 1}
              </button>
            ) : null}
          </>
        ) : focusedNode ? (
          <>
            <span className="arch-sim-mode-badge is-node">Обраний вузол</span>
            {onBackToStep ? (
              <button type="button" className="arch-sim-mode-back" onClick={onBackToStep}>
                ← Пояснення кроку {stepIndex + 1}
              </button>
            ) : null}
          </>
        ) : (
          <span className="arch-sim-mode-badge is-step">
            Крок симуляції {stepIndex + 1} / {stepCount}
          </span>
        )}
      </div>
      {panelBilingualTitle ? (
        <h3 className="arch-sim-step-panel-title arch-sim-step-panel-title--bilingual">
          <span className="arch-vsim-card-en study-term-accent">{panelBilingualTitle.en}</span>
          <span className="arch-vsim-card-ua">{panelBilingualTitle.uk}</span>
        </h3>
      ) : (
        <h3 className="arch-sim-step-panel-title">{title}</h3>
      )}

      {onOpenRagMcpIntro ? (
        <p className="arch-opt-node-intro-link-wrap">
          <button
            type="button"
            className="arch-interactive-panel-card"
            onClick={onOpenRagMcpIntro}
          >
            <span className="arch-interactive-panel-card-title">Пояснити RAG і MCP</span>
            <ArchInteractiveActionLabel kind="openExplanation" />
          </button>
        </p>
      ) : null}

      {transitionView?.leadUk ? (
        <p className="arch-sim-step-transition-lead">{transitionView.leadUk}</p>
      ) : null}

      {nodeConnectionDetail?.leadUk ? (
        <p className="arch-sim-step-transition-lead">{nodeConnectionDetail.leadUk}</p>
      ) : null}

      {showNodeConnections ? (
        <div className="arch-node-conn-picker">
          <p className="arch-node-conn-picker-hint">
            Оберіть один зв’язок — на схемі підсвітиться лише він (решта додаткових маршрутів приховані).
          </p>
          <ul className="arch-node-conn-list" role="list">
            {nodeConnectionCards!.map((card) => {
              const selected = selectedNodeEdgeId === card.edgeId;
              return (
                <li key={card.edgeId}>
                  <button
                    type="button"
                    className={`arch-node-conn-card arch-interactive-card ${selected ? 'is-selected' : ''}`}
                    onClick={() => onSelectNodeConnection?.(card.edgeId)}
                    aria-pressed={selected}
                    aria-label={`${card.titleUk}. ${selected ? 'Зв’язок показано на схемі' : 'Показати зв’язок на схемі'}`}
                  >
                    <span className="arch-interactive-card-body">
                      <span className="arch-node-conn-card-title">{card.titleUk}</span>
                      <span className="arch-node-conn-card-route">
                        {card.fromUk} → {card.toUk}
                      </span>
                      <span className="arch-node-conn-card-summary">
                        {card.summaryUk ?? card.payloadUk}
                      </span>
                    </span>
                    <ArchInteractiveActionLabel kind="showLink" selected={selected} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {focusedNode && nodeView?.alternativesUk && !nodeConnectionDetail ? (
        <div className="arch-sim-node-alternatives" role="note">
          <h4 className="arch-sim-node-alternatives-title">Інші варіанти (не на основній схемі)</h4>
          <p className="arch-sim-node-alternatives-body">{nodeView.alternativesUk}</p>
        </div>
      ) : null}

      <div className="arch-sim-step-sections">
        {sections.map((section) => (
          <article
            key={section.key}
            className={`arch-sim-step-card ${section.variant === 'qa' ? 'is-qa' : ''} ${
              section.key === 'what' && !focusedNode ? 'is-step-selected' : ''
            }`}
          >
            <h4 className="arch-sim-step-card-title">{section.titleUk}</h4>
            {section.mono ? (
              <p className="arch-sim-step-card-body">
                <code className="arch-sim-inline-code">{section.bodyUk}</code>
              </p>
            ) : (
              <p className="arch-sim-step-card-body">{section.bodyUk}</p>
            )}
          </article>
        ))}
      </div>

      {topicLinks.length > 0 ? (
        <div className="arch-sim-step-study-stack">
          <p className="arch-sim-step-study-lead">Вивчити докладніше</p>
          <ul className="arch-sim-step-study-list" role="list">
            {topicLinks.map((t) => (
              <li key={t.topicId}>
                <Link
                  to={`/topic/${t.topicId}/study`}
                  className="arch-interactive-panel-card arch-interactive-panel-card--link"
                >
                  <span className="arch-interactive-panel-card-title">{t.label}</span>
                  <ArchInteractiveActionLabel kind="navigateLesson" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {showExitConditions ? (
        <div className="arch-sim-step-exit">
          <h4 className="arch-sim-step-card-title">Умови завершення run</h4>
          <ul className="arch-sim-list">
            {exitConditions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {auxItems && auxItems.length > 0 ? (
        <div className="arch-sim-step-aux">
          <h4 className="arch-sim-step-card-title">Допоміжні ролі</h4>
          <ul className="arch-sim-aux-list">
            {auxItems.map((aux) => (
              <li key={aux.label}>
                <strong>{aux.label}</strong> — {aux.summary}{' '}
                <Link to={`/topic/${aux.topicId}/study`}>Study</Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

    </aside>
  );
}
