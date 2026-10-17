import type { RagPromptExample } from '../../lib/ragDataChainPrompt';
import { dataChainDisplayStages } from '../../lib/ragDataChainPrompt';
import { lookupDataChainStageDetail } from '../../data/study/rag-data-chain-stage-details';
import { StudyFlowRibbon } from './StudyFlowRibbon';

const CHAIN_META: Array<{ title: string; subtitle: string }> = [
  { title: 'Offline · індексація', subtitle: 'Документи перетворюються на searchable одиниці' },
  { title: 'Runtime · retrieval', subtitle: 'Запит знаходить hits у вже готовому індексі' },
  { title: 'Runtime · генерація', subtitle: 'Evidence збирається в messages і йде в API моделі' },
];

type Props = {
  chainLines: string[];
  prompt: RagPromptExample;
};

export function StudyRagDataChainAndPrompt({ chainLines, prompt }: Props) {
  return (
    <div className="study-rag-data-chain-block">
      <h3 className="study-rag-block-heading">Узагальнений ланцюг даних</h3>
      <p className="study-rag-block-lead muted small">
        Три окремі потоки — не один рядок. Натисніть крок — пояснення з’явиться поруч у тому ж блоці.
      </p>
      <ol className="study-rag-chain-list">
        {chainLines.map((line, i) => {
          const meta = CHAIN_META[i] ?? { title: `Ланцюг ${i + 1}`, subtitle: '' };
          const stages = dataChainDisplayStages(i, line);
          return (
            <li key={i} className="study-rag-chain-item">
              <div className="study-rag-chain-item-head">
                <span className="study-rag-chain-item-num">{i + 1}</span>
                <div>
                  <p className="study-rag-chain-item-title">{meta.title}</p>
                  {meta.subtitle && <p className="study-rag-chain-item-sub muted small">{meta.subtitle}</p>}
                </div>
              </div>
              <StudyFlowRibbon
                stages={stages}
                layout="cards"
                cardFlow="column"
                detailPlacement="inline"
                numbered
                ariaLabel={meta.title}
                stageDetailLookup={(_stage, stageIndex) => lookupDataChainStageDetail(i, stageIndex)}
              />
            </li>
          );
        })}
      </ol>

      <h3 className="study-rag-block-heading">Приклад зібраного prompt</h3>
      <p className="study-rag-block-lead muted small">Навчальний фрагмент messages[] — як виглядає augment перед LLM.</p>
      <div className="study-prompt-stack" role="group" aria-label="Приклад messages для моделі">
        <PromptBlock role="system" label="System" body={prompt.system} />
        <PromptBlock role="retrieved" label="Retrieved context" body={prompt.retrieved} mono />
        <PromptBlock role="user" label="User" body={prompt.user} />
      </div>
    </div>
  );
}

function PromptBlock({
  role,
  label,
  body,
  mono,
}: {
  role: 'system' | 'retrieved' | 'user';
  label: string;
  body: string;
  mono?: boolean;
}) {
  return (
    <div className={`study-prompt-block study-prompt-block-${role}`}>
      <div className="study-prompt-block-head">
        <span className="study-prompt-block-badge">{label}</span>
      </div>
      <pre className={`study-prompt-block-body${mono ? ' is-mono' : ''}`}>{body}</pre>
    </div>
  );
}
