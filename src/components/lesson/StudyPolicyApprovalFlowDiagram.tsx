import { useCallback, useState, type ReactNode } from 'react';
import {
  POLICY_FLOW_HINT_BY_ID,
  POLICY_FLOW_NODE_HINTS,
} from '../../data/study/policy-flow-node-hints';
import { parseLessonBold } from './lessonRichText';

/** Візуальна схема policy → approval → executor (Guardrails observability) */

type FlowVariant =
  | 'llm'
  | 'code'
  | 'deny'
  | 'allow'
  | 'approval'
  | 'human'
  | 'executor'
  | 'success'
  | 'error'
  | 'neutral'
  | 'stop';

function FlowArrow({ label }: { label?: string }) {
  return (
    <div className="policy-flow-arrow" aria-hidden="true">
      <span className="policy-flow-arrow-line" />
      {label && <span className="policy-flow-arrow-label">{label}</span>}
    </div>
  );
}

function FlowNode({
  nodeId,
  children,
  variant = 'neutral',
  lang,
  small,
  isActive,
  onSelect,
}: {
  nodeId?: string;
  children: ReactNode;
  variant?: FlowVariant;
  lang?: string;
  small?: boolean;
  isActive?: boolean;
  onSelect?: (id: string) => void;
}) {
  const className = [
    'policy-flow-node',
    `policy-flow-node--${variant}`,
    small ? 'is-small' : '',
    nodeId ? 'is-clickable' : '',
    isActive ? 'is-selected' : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (!nodeId || !onSelect) {
    return (
      <div className={className} lang={lang}>
        {children}
      </div>
    );
  }

  const hint = POLICY_FLOW_HINT_BY_ID[nodeId];

  return (
    <button
      type="button"
      className={className}
      lang={lang}
      aria-pressed={isActive}
      aria-label={hint ? `${hint.titleUk}. Натисніть для пояснення` : undefined}
      onClick={() => onSelect(nodeId)}
    >
      <span className="policy-flow-node-inner">{children}</span>
      <span className="policy-flow-node-hint-icon" aria-hidden="true" title="Детальніше">
        i
      </span>
    </button>
  );
}

function PolicyFlowDetailPanel({
  selectedId,
  onClear,
  onPick,
}: {
  selectedId: string | null;
  onClear: () => void;
  onPick: (id: string) => void;
}) {
  const selected = selectedId ? POLICY_FLOW_HINT_BY_ID[selectedId] : undefined;

  return (
    <aside
      className="policy-flow-detail study-split-hint-detail"
      aria-live="polite"
      id="policy-flow-detail-panel"
    >
      {selected ? (
        <>
          <div className="policy-flow-detail-head">
            <h4 className="study-split-hint-detail-title">{selected.titleUk}</h4>
            <button type="button" className="policy-flow-detail-close muted small" onClick={onClear}>
              Згорнути
            </button>
          </div>
          {selected.termEn && (
            <p className="study-policy-term muted small" lang="en">
              Термін у курсі: <em>{selected.termEn}</em>
            </p>
          )}
          <p className="policy-flow-detail-teaser">{parseLessonBold(selected.teaserUk)}</p>
          <dl className="study-failure-details">
            {selected.sections.map((sec) => (
              <div key={sec.labelUk}>
                <dt>{sec.labelUk}</dt>
                <dd>
                  {sec.listItemsUk?.length ? (
                    <ol className="study-hint-ol">
                      {sec.listItemsUk.map((item) => (
                        <li key={item}>{parseLessonBold(item)}</li>
                      ))}
                    </ol>
                  ) : (
                    parseLessonBold(sec.bodyUk)
                  )}
                </dd>
              </div>
            ))}
          </dl>
          {selected.exampleUk && (
            <p className="study-split-hint-example">
              <span className="study-component-qa-label">Приклад:</span> {parseLessonBold(selected.exampleUk)}
            </p>
          )}
          {selected.qaUk && (
            <p className="study-component-qa">
              <span className="study-component-qa-label">Для QA-агента:</span> {parseLessonBold(selected.qaUk)}
            </p>
          )}
        </>
      ) : (
        <div className="policy-flow-detail-empty">
          <p className="policy-flow-detail-empty-title">Підказки до схеми</p>
          <p className="muted small">
            Натисніть будь-який блок на діаграмі — зліва з’явиться розгорнуте пояснення: що це означає, що шукати в trace і типові
            помилки.
          </p>
          <div className="policy-flow-detail-picks" role="list">
            {POLICY_FLOW_NODE_HINTS.map((h) => (
              <button
                key={h.id}
                type="button"
                className="policy-flow-detail-pick"
                role="listitem"
                onClick={() => onPick(h.id)}
              >
                {h.titleUk}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

export function StudyPolicyApprovalFlowDiagram() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectNode = useCallback((id: string) => {
    setSelectedId(id);
    requestAnimationFrame(() => {
      const panel = document.getElementById('policy-flow-detail-panel');
      if (panel && window.matchMedia('(max-width: 960px)').matches) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }, []);

  const isActive = (id: string) => selectedId === id;

  return (
    <figure className="policy-flow-figure">
      <figcaption className="policy-flow-caption muted small">
        Альтернативні гілки після policy — не послідовні кроки. Терміни на схемі англійською, як у trace.{' '}
        <strong className="policy-flow-caption-cta">Натисніть блок</strong> — деталі праворуч (на телефоні — нижче).
      </figcaption>

      <div className="policy-flow-shell">
        <div
          className="policy-flow-layout"
          role="group"
          aria-label="Інтерактивна схема policy та approval"
        >
          <div className="policy-flow-main">
            <div className="policy-flow">
              <FlowNode
                nodeId="llm-propose"
                variant="llm"
                lang="en"
                isActive={isActive('llm-propose')}
                onSelect={selectNode}
              >
                LLM proposed createJiraIssue
              </FlowNode>
              <FlowArrow />
              <FlowNode
                nodeId="validate-policy"
                variant="code"
                lang="en"
                isActive={isActive('validate-policy')}
                onSelect={selectNode}
              >
                TypeScript: validate + policy
              </FlowNode>
              <FlowArrow />

              <div className="policy-flow-fork">
                <div className="policy-flow-fork-col">
                  <FlowNode
                    nodeId="policy-deny"
                    variant="deny"
                    lang="en"
                    isActive={isActive('policy-deny')}
                    onSelect={selectNode}
                  >
                    deny
                  </FlowNode>
                  <FlowArrow />
                  <FlowNode
                    nodeId="audit-deny"
                    variant="stop"
                    small
                    isActive={isActive('audit-deny')}
                    onSelect={selectNode}
                  >
                    audit: deny
                    <span className="policy-flow-note">executor не викликається</span>
                  </FlowNode>
                </div>

                <div className="policy-flow-fork-col policy-flow-fork-col--center">
                  <FlowNode
                    nodeId="policy-allow"
                    variant="allow"
                    lang="en"
                    isActive={isActive('policy-allow')}
                    onSelect={selectNode}
                  >
                    allow
                  </FlowNode>
                  <FlowArrow label="дозвіл спробувати" />
                  <p className="policy-flow-merge-hint muted small">
                    Зливається з гілкою після re-check → executor
                  </p>
                </div>

                <div className="policy-flow-fork-col policy-flow-fork-col--wide">
                  <FlowNode
                    nodeId="needs-approval"
                    variant="approval"
                    lang="en"
                    isActive={isActive('needs-approval')}
                    onSelect={selectNode}
                  >
                    needs_approval
                  </FlowNode>
                  <FlowArrow />

                  <div className="policy-flow-sub">
                    <div className="policy-flow-sub-path">
                      <FlowNode
                        nodeId="human-reject"
                        variant="human"
                        small
                        isActive={isActive('human-reject')}
                        onSelect={selectNode}
                      >
                        людина відхилила
                      </FlowNode>
                      <FlowArrow />
                      <FlowNode
                        nodeId="approval-denied"
                        variant="stop"
                        lang="en"
                        small
                        isActive={isActive('approval-denied')}
                        onSelect={selectNode}
                      >
                        approval_denied
                      </FlowNode>
                      <p className="policy-flow-note">executor не викликається</p>
                    </div>

                    <div className="policy-flow-sub-divider" aria-hidden="true">або</div>

                    <div className="policy-flow-sub-path">
                      <FlowNode
                        nodeId="human-approve"
                        variant="human"
                        small
                        isActive={isActive('human-approve')}
                        onSelect={selectNode}
                      >
                        людина схвалила
                      </FlowNode>
                      <FlowArrow />
                      <FlowNode
                        nodeId="approval-granted"
                        variant="approval"
                        lang="en"
                        small
                        isActive={isActive('approval-granted')}
                        onSelect={selectNode}
                      >
                        approval_granted
                        <span className="policy-flow-note">issue ще не створено</span>
                      </FlowNode>
                      <FlowArrow />
                      <FlowNode
                        nodeId="recheck-policy"
                        variant="code"
                        small
                        isActive={isActive('recheck-policy')}
                        onSelect={selectNode}
                      >
                        re-check policy + актуальність запиту
                      </FlowNode>
                      <FlowArrow />
                      <div className="policy-flow-mini-fork">
                        <FlowNode
                          nodeId="policy-deny"
                          variant="deny"
                          small
                          isActive={isActive('policy-deny')}
                          onSelect={selectNode}
                        >
                          deny (stop)
                        </FlowNode>
                        <FlowNode
                          nodeId="allow-execute"
                          variant="allow"
                          lang="en"
                          small
                          isActive={isActive('allow-execute')}
                          onSelect={selectNode}
                        >
                          allow execute
                        </FlowNode>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="policy-flow-executor-block">
                <FlowArrow />
                <FlowNode
                  nodeId="executor-jira"
                  variant="executor"
                  lang="en"
                  isActive={isActive('executor-jira')}
                  onSelect={selectNode}
                >
                  executor → Jira API
                </FlowNode>
                <FlowArrow />
                <div className="policy-flow-outcomes">
                  <FlowNode
                    nodeId="executor-success"
                    variant="success"
                    lang="en"
                    small
                    isActive={isActive('executor-success')}
                    onSelect={selectNode}
                  >
                    success
                    <span className="policy-flow-note">QA-1234</span>
                  </FlowNode>
                  <FlowNode
                    nodeId="executor-error"
                    variant="error"
                    lang="en"
                    small
                    isActive={isActive('executor-error')}
                    onSelect={selectNode}
                  >
                    error
                    <span className="policy-flow-note">JIRA_503</span>
                  </FlowNode>
                </div>
                <p className="policy-flow-footer-note muted small">
                  allow execute ≠ гарантія успіху API. Помилка Jira — окрема подія в логах.
                </p>
              </div>
            </div>
          </div>

          <PolicyFlowDetailPanel
            selectedId={selectedId}
            onClear={() => setSelectedId(null)}
            onPick={selectNode}
          />
        </div>
      </div>
    </figure>
  );
}
