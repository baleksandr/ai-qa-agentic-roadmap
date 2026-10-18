import type { AgentOptionalFlags } from '../../lib/agentCycleOptionalNodes';
import { getAgentOptionalSchemaStateUk } from '../../data/architecture/agent-cycle-optional-panels';
import {
  AGENT_EXPLAINER_MCP,
  AGENT_EXPLAINER_RAG,
  AGENT_EXPLAINER_TEASERS,
  AGENT_EXPLAINER_TOGETHER,
  type AgentExplainerTopic,
} from '../../data/architecture/agent-cycle-optional-explainer-content';

export const AGENT_RAG_MCP_EXPLAINER_SECTION_ID = 'arch-agent-rag-mcp-explainer';

type Accent = 'rag' | 'mcp' | 'neutral';

function LabeledBlock({
  accent,
  label,
  body,
}: {
  accent: Accent;
  label: string;
  body: string;
}) {
  return (
    <div className="arch-opt-labeled-block">
      <p className={`arch-opt-k is-${accent}`}>{label}</p>
      <p className="arch-opt-v">{body}</p>
    </div>
  );
}

function RagMcpExplanationBody({
  accent,
  titleUk,
  expansionUk,
  definitionUk,
  howUk,
  exampleUk,
  qaUk,
}: {
  accent: 'rag' | 'mcp';
  titleUk: string;
  expansionUk: string;
  definitionUk: string;
  howUk: string;
  exampleUk: string;
  qaUk: string;
}) {
  return (
    <>
      <h5 className={`arch-opt-detail-heading is-${accent}`} id="arch-opt-explanation-active-title">
        {titleUk}
      </h5>
      <p className="arch-opt-card-expansion">{expansionUk}</p>
      <LabeledBlock accent={accent} label="Визначення" body={definitionUk} />
      <LabeledBlock accent={accent} label="Як працює" body={howUk} />
      <LabeledBlock accent={accent} label="Приклад login_spec" body={exampleUk} />
      <LabeledBlock accent={accent} label="Що перевіряє QA" body={qaUk} />
    </>
  );
}

function SelectedExplanation({ selectedExplanationId }: { selectedExplanationId: AgentExplainerTopic }) {
  if (selectedExplanationId === 'rag') {
    const d = AGENT_EXPLAINER_RAG;
    return (
      <article className="arch-opt-detail is-rag" aria-labelledby="arch-opt-explanation-active-title">
        <RagMcpExplanationBody {...d} />
      </article>
    );
  }
  if (selectedExplanationId === 'mcp') {
    const d = AGENT_EXPLAINER_MCP;
    return (
      <article className="arch-opt-detail is-mcp" aria-labelledby="arch-opt-explanation-active-title">
        <RagMcpExplanationBody {...d} />
      </article>
    );
  }
  const d = AGENT_EXPLAINER_TOGETHER;
  return (
    <article className="arch-opt-detail is-neutral" aria-labelledby="arch-opt-explanation-active-title">
      <h5 className="arch-opt-detail-heading is-neutral" id="arch-opt-explanation-active-title">
        {d.titleUk}
      </h5>
      {d.paragraphsUk.map((paragraph) => (
        <p key={paragraph} className="arch-opt-detail-body">{paragraph}</p>
      ))}
    </article>
  );
}

type Props = {
  flags: AgentOptionalFlags;
  selectedExplanationId: AgentExplainerTopic | null;
  onSelectExplanation: (id: AgentExplainerTopic) => void;
};

export function AgentOptionalRagMcpExplainer({
  flags,
  selectedExplanationId,
  onSelectExplanation,
}: Props) {
  const schemaState = getAgentOptionalSchemaStateUk(flags);

  return (
    <section
      id={AGENT_RAG_MCP_EXPLAINER_SECTION_ID}
      className="arch-opt-explainer"
      aria-label="RAG і MCP для новачка"
    >
      <h4 className="arch-opt-explainer-heading">
        <span className="arch-opt-explainer-heading-text">RAG і MCP для новачка</span>
      </h4>

      <p className="arch-opt-explainer-hint">Натисніть картку, щоб прочитати пояснення.</p>

      <ul className="arch-opt-picker-list" role="tablist" aria-label="Теми пояснення RAG і MCP">
        {AGENT_EXPLAINER_TEASERS.map((card) => {
          const isSelected = selectedExplanationId === card.id;
          const tabId = `arch-opt-tab-${card.id}`;
          const panelId = 'arch-opt-explanation-panel';
          return (
            <li key={card.id} role="presentation">
              <button
                type="button"
                role="tab"
                id={tabId}
                className={`arch-opt-picker-card arch-interactive-card is-${card.accent} ${isSelected ? 'is-selected' : ''}`}
                onClick={() => onSelectExplanation(card.id)}
                aria-selected={isSelected}
                aria-controls={isSelected ? panelId : undefined}
              >
                <span className="arch-opt-picker-main">
                  <span className={`arch-opt-picker-title is-${card.accent}`}>{card.titleUk}</span>
                  <span className="arch-opt-picker-teaser">{card.teaserUk}</span>
                </span>
                <span className="arch-interactive-card-action arch-opt-picker-action" aria-hidden="true">
                  {isSelected ? 'Пояснення відкрито ✓' : 'Відкрити пояснення →'}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {selectedExplanationId ? (
        <div
          id="arch-opt-explanation-panel"
          className="arch-opt-detail-wrap"
          role="tabpanel"
          aria-labelledby={`arch-opt-tab-${selectedExplanationId}`}
        >
          <SelectedExplanation selectedExplanationId={selectedExplanationId} />
        </div>
      ) : null}

      <div className="arch-opt-schema-state">
        <h5 className="arch-opt-schema-state-title">Поточний стан схеми</h5>
        <p className="arch-opt-schema-line is-rag">{schemaState.ragUk}</p>
        <p className="arch-opt-schema-line is-mcp">{schemaState.mcpUk}</p>
      </div>
    </section>
  );
}
