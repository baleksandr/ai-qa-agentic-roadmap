import type {
  RouteTopicSidePanel,
  RouteTopicSidePanelBlock,
  RouteTopicSidePanelStep,
} from '../data/review/route-topic-side-panels';

const AGENT_HEADING = '**У QA Regression Investigation Agent:**';

function inferStepWho(bodyUk: string): string {
  if (/\*\*Модель\*\*/.test(bodyUk)) return 'Модель';
  if (/\*\*Harness\*\*/i.test(bodyUk) || /\bharness\b/i.test(bodyUk)) return 'Harness';
  if (/\*\*Оркестратор\*\*/.test(bodyUk)) return 'Код';
  if (/\*\*Код\*\*|\*\*застосунок\*\*/.test(bodyUk)) return 'Код';
  if (/\*\*LLM\*\*/.test(bodyUk)) return 'LLM';
  return '';
}

function formatStepsBlock(steps: RouteTopicSidePanelStep[] | undefined): string | null {
  if (!steps?.length) return null;
  const lines = steps.map((step) => {
    const who = inferStepWho(step.bodyUk);
    const body = step.bodyUk.replace(/\s+/g, ' ').trim();
    return `${step.titleUk} | ${who} | ${body}`;
  });
  return `:::review-steps\n${lines.join('\n')}\n:::`;
}

function formatExampleCompare(block: RouteTopicSidePanelBlock): string | null {
  const steps = block.steps;
  if (block.bodyUk?.trim() || !steps || steps.length !== 2) return null;
  const [left, right] = steps;
  const leftBody = left.bodyUk.replace(/\s+/g, ' ').trim();
  const rightBody = right.bodyUk.replace(/\s+/g, ' ').trim();
  return `:::review-compare\n${left.titleUk} | ${leftBody} || ${right.titleUk} | ${rightBody}\n:::`;
}

function formatExampleProse(block: RouteTopicSidePanelBlock): string | null {
  if (block.bodyUk?.trim()) return block.bodyUk.trim();
  const steps = block.steps;
  if (!steps?.length) return null;
  if (steps.length === 2 && isContrastPair(steps[0].titleUk, steps[1].titleUk)) {
    return null;
  }
  return steps
    .map((s) => `${s.titleUk}: ${s.bodyUk.replace(/\s+/g, ' ').trim()}`)
    .join(' ');
}

function isContrastPair(a: string, b: string): boolean {
  const al = a.toLowerCase();
  const bl = b.toLowerCase();
  return (
    (al.includes('до ') && bl.includes('після')) ||
    (al.includes('лише') && bl.includes('harness')) ||
    al.includes('чат') ||
    (al.includes('без') && bl.includes('з '))
  );
}

function ideaLine(how: RouteTopicSidePanelBlock): string | null {
  if (how.bodyUk?.trim()) return how.bodyUk.trim();
  return null;
}

/** Review Mode markdown узгоджений з бічною панеллю «Увесь маршрут» (еталон Fundamentals / concept-03). */
export function buildReviewMarkdownFromRoutePanel(panel: RouteTopicSidePanel): string {
  const chunks: string[] = [];
  chunks.push(`**Проблема:** ${panel.whyUk}`);

  const idea = ideaLine(panel.how);
  const howSteps = formatStepsBlock(panel.how.steps);
  if (idea && !howSteps) {
    chunks.push('');
    chunks.push(`**Ідея:** ${idea}`);
  } else if (idea && howSteps) {
    chunks.push('');
    chunks.push(`**Ідея:** ${idea}`);
    chunks.push('');
    chunks.push(howSteps);
  } else if (howSteps) {
    chunks.push('');
    chunks.push(howSteps);
  }

  const exampleCompare = formatExampleCompare(panel.example);
  const exampleProse = formatExampleProse(panel.example);
  if (exampleCompare) {
    chunks.push('');
    chunks.push(exampleCompare);
  } else if (exampleProse) {
    chunks.push('');
    chunks.push(`${AGENT_HEADING} ${exampleProse}`);
  }

  chunks.push('');
  chunks.push(`**Для QA:** ${panel.qaUk}`);

  if (panel.rememberUk?.trim()) {
    chunks.push('');
    chunks.push(`**Запам’ятати:** ${panel.rememberUk}`);
  }

  return chunks.join('\n');
}
