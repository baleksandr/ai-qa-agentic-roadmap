import type { ReactNode } from 'react';
import type {
  RouteTopicSidePanel,
  RouteTopicSidePanelBlock,
} from '../data/review/route-topic-side-panels';

type Props = {
  panel: RouteTopicSidePanel;
};

function renderAccentProse(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <span key={i} className="study-term-accent">
          {part.slice(2, -2)}
        </span>
      );
    }
    return part;
  });
}

function ProseParagraph({ text }: { text: string }) {
  return <p className="route-side-panel-prose">{renderAccentProse(text)}</p>;
}

function BlockContent({ block }: { block: RouteTopicSidePanelBlock }) {
  if (block.steps && block.steps.length > 0) {
    return (
      <ol className="route-side-panel-steps">
        {block.steps.map((step, index) => (
          <li key={`${index}-${step.titleUk}`} className="route-side-panel-step-card">
            <p className="route-side-panel-step-title">
              <span className="route-side-panel-step-index" aria-hidden="true">
                {index + 1}.
              </span>
              {step.titleUk}
            </p>
            <p className="route-side-panel-step-body">{renderAccentProse(step.bodyUk)}</p>
          </li>
        ))}
      </ol>
    );
  }
  if (block.bodyUk) {
    return (
      <div className="route-side-panel-prose-card">
        <ProseParagraph text={block.bodyUk} />
      </div>
    );
  }
  return null;
}

function blockHasContent(block?: RouteTopicSidePanelBlock): boolean {
  if (!block) return false;
  return Boolean(block.bodyUk?.trim() || (block.steps && block.steps.length > 0));
}

function Section({
  headingUk,
  block,
  proseUk,
}: {
  headingUk: string;
  block?: RouteTopicSidePanelBlock;
  proseUk?: string;
}) {
  const hasBlock = blockHasContent(block);
  const hasProse = Boolean(proseUk?.trim());
  if (!hasBlock && !hasProse) return null;

  return (
    <section className="route-side-panel-section">
      <h3 className="route-side-panel-section-heading">{headingUk}</h3>
      {hasProse && (
        <div className="route-side-panel-prose-card">
          <ProseParagraph text={proseUk!} />
        </div>
      )}
      {hasBlock && block && <BlockContent block={block} />}
    </section>
  );
}

export function RouteTopicSidePanelBody({ panel }: Props) {
  return (
    <div className="route-side-panel">
      <Section headingUk="Навіщо ця тема" proseUk={panel.whyUk} />
      <Section headingUk="Як це працює" block={panel.how} />
      {blockHasContent(panel.example) ? (
        <Section headingUk="Приклад у login_spec" block={panel.example} />
      ) : null}
      <Section headingUk="Що перевіряє QA" proseUk={panel.qaUk} />
      {panel.rememberUk?.trim() ? (
        <section className="route-side-panel-section route-side-panel-section--remember">
          <h3 className="route-side-panel-section-heading">Запам’ятати</h3>
          <div className="route-side-panel-prose-card">
            <ProseParagraph text={panel.rememberUk} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
