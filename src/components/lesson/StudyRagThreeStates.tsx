import type { ReactNode } from 'react';
import type { RagInvestigationScenario } from '../../lib/ragInvestigationScenario';
import { RAG_FORBIDDEN_TENANT_CARD } from '../../data/study/rag-one-query-story';

type Props = {
  scenario: RagInvestigationScenario;
};

/** Міні-схема кроку 3: знайдено → дозволено → передано LLM (один приклад). */
export function StudyRagThreeStates({ scenario }: Props) {
  const inc442 = scenario.chunks.find((c) => c.sourceId === 'INC-442') ?? scenario.chunks[0];
  const inc318 = scenario.chunks.find((c) => c.sourceId === 'INC-318');

  return (
    <div className="study-rag-three-states" aria-label="Знайдено, дозволено, передано LLM">
      <div className="study-rag-three-states-ribbon" aria-hidden="true">
        <span>Знайдено</span>
        <span className="study-rag-three-states-arrow">→</span>
        <span>Дозволено</span>
        <span className="study-rag-three-states-arrow">→</span>
        <span>Передано LLM</span>
      </div>

      <div className="study-rag-three-states-columns">
        <StateColumn title="Знайдено пошуком" hint="Кандидати similarity">
          {inc442 && <ChunkCard chunk={inc442} />}
          {inc318 && <ChunkCard chunk={inc318} />}
        </StateColumn>

        <StateColumn title="Дозволено цьому run" hint="Після tenant і ACL">
          {inc442 && <ChunkCard chunk={inc442} />}
          {inc318 && <ChunkCard chunk={inc318} />}
        </StateColumn>

        <StateColumn title="Передано LLM" hint="Лише вибране в prompt">
          {inc442 && <ChunkCard chunk={inc442} highlight />}
          {inc318 ? (
            <p className="study-rag-three-states-dropped muted small">
              <strong>{inc318.sourceId}</strong> — дозволений hit, але в цьому прикладі{' '}
              <strong>не переданий</strong> моделі (менш доречний).
            </p>
          ) : null}
        </StateColumn>
      </div>

      <aside className="study-rag-three-states-forbidden">
        <p className="study-rag-three-states-forbidden-title">{RAG_FORBIDDEN_TENANT_CARD.titleUk}</p>
        <p className="muted small">{RAG_FORBIDDEN_TENANT_CARD.bodyUk}</p>
      </aside>
    </div>
  );
}

function StateColumn({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <div className="study-rag-three-states-col">
      <h5 className="study-rag-three-states-col-title">{title}</h5>
      <p className="muted small study-rag-three-states-col-hint">{hint}</p>
      <div className="study-rag-three-states-col-body">{children}</div>
    </div>
  );
}

function ChunkCard({
  chunk,
  highlight,
}: {
  chunk: { id: string; sourceId: string; excerpt: string };
  highlight?: boolean;
}) {
  return (
    <article className={`study-rag-chunk-mini${highlight ? ' is-selected' : ''}`}>
      <span className="study-rag-chunk-mini-id">{chunk.sourceId}</span>
      <p className="study-rag-chunk-mini-text">«{chunk.excerpt}»</p>
    </article>
  );
}
