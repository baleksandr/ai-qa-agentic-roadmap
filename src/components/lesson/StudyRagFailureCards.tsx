import { lookupRagFailureMeta, type RagFailureMeta } from '../../data/study/rag-failure-modes';
import { MarkdownBody } from '../MarkdownBody';
import { parseLessonBold } from './lessonRichText';

type Card = { title: string; body: string };

function parseFailureCards(markdown: string): { intro: string; cards: Card[] } {
  const parts = markdown.split(/^####\s+/m);
  const introChunk = (parts[0] ?? '').trim();
  const cardChunks = parts.slice(1).filter((c) => c.trim());
  if (cardChunks.length === 0) {
    return { intro: markdown.trim(), cards: [] };
  }
  const cards = cardChunks.map((chunk) => {
    const nl = chunk.indexOf('\n');
    const title = (nl >= 0 ? chunk.slice(0, nl) : chunk).trim();
    const body = (nl >= 0 ? chunk.slice(nl + 1) : '').trim();
    return { title, body };
  });
  return { intro: introChunk, cards };
}

type ParsedBody = {
  lead: string;
  symptom?: string;
  mitigation?: string;
  bullets: string[];
};

function parseCardBody(body: string): ParsedBody {
  const bullets: string[] = [];
  const proseLines: string[] = [];
  for (const line of body.split('\n')) {
    const bullet = line.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      bullets.push(bullet[1].trim());
    } else if (line.trim()) {
      proseLines.push(line.trim());
    }
  }

  let text = proseLines.join(' ');
  let symptom: string | undefined;
  let mitigation: string | undefined;

  const symMatch = text.match(/Симптом:\s*([^]+?)(?=\s*Захист:|$)/i);
  if (symMatch) {
    symptom = symMatch[1].trim().replace(/\.\s*$/, '');
    text = text.replace(symMatch[0], '').trim();
  }
  const mitMatch = text.match(/Захист:\s*(.+)$/i);
  if (mitMatch) {
    mitigation = mitMatch[1].trim();
    text = text.replace(mitMatch[0], '').trim();
  }

  return { lead: text.replace(/\s+/g, ' ').trim(), symptom, mitigation, bullets };
}

function FailureCard({
  card,
  displayIndex,
  lookupMeta,
}: {
  card: Card;
  displayIndex: number;
  lookupMeta: (title: string) => RagFailureMeta;
}) {
  const meta = lookupMeta(card.title);
  const index = meta.index || displayIndex;
  const parsed = parseCardBody(card.body);
  const isPolicy = parsed.bullets.length >= 2 && !parsed.lead;

  return (
    <li
      className={`study-rag-failure-card severity-${meta.severity} ${meta.categoryClass}`}
    >
      <header className="study-rag-failure-head">
        <span className="study-rag-failure-index" aria-hidden="true">{index}</span>
        <div className="study-rag-failure-head-text">
          <span className={`study-rag-failure-tag ${meta.categoryClass}`}>{meta.categoryUk}</span>
          <h4 className="study-rag-failure-title">{card.title}</h4>
        </div>
      </header>

      {parsed.lead && (
        <p className="study-rag-failure-lead">{parseLessonBold(parsed.lead)}</p>
      )}

      {parsed.symptom && (
        <p className="study-rag-failure-callout study-rag-failure-symptom">
          <span className="study-rag-failure-callout-label">Симптом</span>
          {parseLessonBold(parsed.symptom)}
        </p>
      )}

      {parsed.mitigation && (
        <p className="study-rag-failure-callout study-rag-failure-mitigation">
          <span className="study-rag-failure-callout-label">Захист</span>
          {parseLessonBold(parsed.mitigation)}
        </p>
      )}

      {parsed.bullets.length > 0 && (
        <ul className={`study-rag-failure-checklist${isPolicy ? ' is-policy' : ''}`}>
          {parsed.bullets.map((item) => (
            <li key={item.slice(0, 48)}>{parseLessonBold(item)}</li>
          ))}
        </ul>
      )}

      {!parsed.lead && parsed.bullets.length === 0 && (
        <div className="study-rag-failure-body markdown-body">
          <MarkdownBody markdown={card.body} studyTables />
        </div>
      )}
    </li>
  );
}

type FailureCardsProps = {
  markdown: string;
  lookupMeta?: (title: string) => RagFailureMeta;
  leadUk?: string;
  listAriaLabel?: string;
};

export function StudyRagFailureCards({
  markdown,
  lookupMeta = lookupRagFailureMeta,
  leadUk = 'Сім типових збоїв RAG — від пошуку до політики. Кожна картка: що пішло не так і на що дивиться QA.',
  listAriaLabel = 'Failure modes RAG',
}: FailureCardsProps) {
  const { intro, cards } = parseFailureCards(markdown);
  if (cards.length === 0) {
    return (
      <div className="markdown-body">
        <MarkdownBody markdown={markdown} studyTables />
      </div>
    );
  }

  return (
    <div className="study-rag-failures">
      {intro ? <p className="study-rag-failures-intro muted">{parseLessonBold(intro)}</p> : null}
      <p className="study-rag-failures-lead">{leadUk}</p>
      <ol className="study-rag-failure-list" aria-label={listAriaLabel}>
        {cards.map((card, i) => (
          <FailureCard key={card.title} card={card} displayIndex={i + 1} lookupMeta={lookupMeta} />
        ))}
      </ol>
    </div>
  );
}
