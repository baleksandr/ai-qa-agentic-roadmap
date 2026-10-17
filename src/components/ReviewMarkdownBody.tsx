import { MarkdownBody } from './MarkdownBody';
import { STUDY_LEARNER_MARKDOWN } from '../lib/studyLearnerMarkdown';
import { splitReviewMarkdown } from '../lib/reviewMarkdownBlocks';

interface Props {
  markdown: string;
}

export function ReviewMarkdownBody({ markdown }: Props) {
  const segments = splitReviewMarkdown(markdown);
  return (
    <div className="review-markdown">
      {segments.map((seg, i) => {
        if (seg.kind === 'md') {
          return (
            <div key={i} className="review-markdown-prose">
              <MarkdownBody markdown={seg.text} {...STUDY_LEARNER_MARKDOWN} />
            </div>
          );
        }
        if (seg.kind === 'phases') {
          return (
            <div key={i} className="review-card-grid review-card-grid--phases" role="list">
              {seg.cards.map((c) => (
                <article key={c.title} className="review-card review-card--phase" role="listitem">
                  <h3 className="review-card-title">{c.title}</h3>
                  <p className="review-card-body">{c.body}</p>
                </article>
              ))}
            </div>
          );
        }
        if (seg.kind === 'steps') {
          return (
            <ol key={i} className="review-step-list">
              {seg.cards.map((c) => (
                <li key={c.title} className="review-step-card">
                  <div className="review-step-head">
                    <span className="review-step-title">{c.title}</span>
                    {c.who && <span className="review-step-who">{c.who}</span>}
                  </div>
                  <p className="review-step-body">{c.body}</p>
                </li>
              ))}
            </ol>
          );
        }
        if (seg.kind === 'compare') {
          return (
            <div key={i} className="review-compare-stack">
              {seg.cards.map((c, j) => (
                <div key={j} className="review-compare-row">
                  <article className="review-card review-card--compare">
                    <h3 className="review-card-title">{c.leftTitle}</h3>
                    <p className="review-card-body">{c.leftBody}</p>
                  </article>
                  <article className="review-card review-card--compare">
                    <h3 className="review-card-title">{c.rightTitle}</h3>
                    <p className="review-card-body">{c.rightBody}</p>
                  </article>
                </div>
              ))}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
