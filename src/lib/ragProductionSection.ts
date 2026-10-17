export type RagProductionItem = {
  title: string;
  bodyMarkdown: string;
};

/** Розбирає production-розділ: «**Тема** — текст», метрики, підсумок */
export function extractRagProductionSection(text: string): {
  items: RagProductionItem[];
  footerMarkdown: string;
} {
  const paragraphs = text.trim().split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  const items: RagProductionItem[] = [];
  let footerMarkdown = '';

  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    const dashed = extractBoldDashItems(p);
    if (dashed.length > 0) {
      items.push(...dashed);
      continue;
    }

    if (isMetricsParagraph(p)) {
      items.push({ title: 'Метрики та логування', bodyMarkdown: formatMetricsParagraph(p) });
      continue;
    }

    if (i === paragraphs.length - 1 && items.length > 0) {
      footerMarkdown = p;
      continue;
    }

    items.push({ title: 'Production', bodyMarkdown: p });
  }

  return { items, footerMarkdown };
}

function extractBoldDashItems(paragraph: string): RagProductionItem[] {
  const re = /\*\*([^*]+)\*\*\s*—\s*([\s\S]*?)(?=\s*\*\*[^*]+\*\*\s*—|$)/g;
  const out: RagProductionItem[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(paragraph)) !== null) {
    const title = m[1].trim();
    const body = m[2].trim().replace(/\s+/g, ' ');
    if (title && body) out.push({ title, bodyMarkdown: body });
  }
  return out;
}

function isMetricsParagraph(p: string): boolean {
  return /метрик/i.test(p) && /індексація/i.test(p) && /runtime/i.test(p);
}

function formatMetricsParagraph(p: string): string {
  const afterPhase = p.split(/фаз:\s*/i)[1]?.trim() ?? p;
  const runtimeSplit = afterPhase.split(/;\s*runtime\s*\(/i);
  if (runtimeSplit.length >= 2) {
    const offline = runtimeSplit[0].replace(/^\s*індексація\s*/i, '').trim();
    const runtimeRest = runtimeSplit.slice(1).join('').replace(/^\)\s*/, '').trim();
    const runtime = runtimeRest.startsWith('(') ? runtimeRest : `(${runtimeRest}`;
    return `**Offline (індексація)**\n\n${offline}\n\n**Runtime**\n\n${runtime}`;
  }
  return p.replace(/;\s*/g, ';\n\n');
}
