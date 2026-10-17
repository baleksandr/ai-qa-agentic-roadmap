export type StudyFlowSchema =
  | { type: 'linear'; steps: string[] }
  | {
      type: 'branch';
      preamble: string[];
      decision: string;
      branches: Array<{ sourceLabel: string; label: string; detail: string }>;
    }
  | { type: 'cycle'; note: string; steps: string[] }
  | { type: 'ascii-fallback'; raw: string; needsReview?: boolean };

const BRANCH_LINE = /^\s*[├└│]\s*[─-]?\s*(.+)$/;

const BRANCH_ENRICHMENT: Record<string, { label: string; detail: string }> = {
  allow: { label: 'Дозволити', detail: 'Код може виконати дію' },
  deny: { label: 'Відхилити', detail: 'Дія не виконується' },
  'human approval': { label: 'Потрібне підтвердження', detail: 'Дія чекає рішення людини' },
};

function enrichBranch(sourceLabel: string): { label: string; detail: string } {
  const key = sourceLabel.trim().toLowerCase();
  const hit = BRANCH_ENRICHMENT[key];
  if (hit) return { label: hit.label, detail: hit.detail };
  return { label: sourceLabel.trim(), detail: '' };
}

/** Визначає тип ASCII-схеми з markdown/тексту уроку */
export function parseStudyFlowAscii(raw: string): StudyFlowSchema {
  const lines = raw
    .split('\n')
    .map((l) => l.trimEnd())
    .filter((l, i, arr) => !(l === '' && i === arr.length - 1));

  if (lines.length === 0) return { type: 'ascii-fallback', raw, needsReview: true };

  const hasBranch = lines.some((l) => BRANCH_LINE.test(l));
  const hasArrow = lines.some((l) => l.includes('↓'));

  if (!hasArrow && !hasBranch) {
    return { type: 'ascii-fallback', raw, needsReview: true };
  }

  if (hasBranch) {
    const preamble: string[] = [];
    const branches: Array<{ sourceLabel: string; label: string; detail: string }> = [];
    let decision = '';
    let phase: 'preamble' | 'branches' = 'preamble';

    for (const line of lines) {
      const branchMatch = line.match(BRANCH_LINE);
      if (branchMatch) {
        phase = 'branches';
        const sourceLabel = branchMatch[1].trim();
        const enriched = enrichBranch(sourceLabel);
        branches.push({ sourceLabel, ...enriched });
        continue;
      }
      if (line.includes('↓')) continue;
      if (phase === 'branches') continue;
      if (line.trim()) preamble.push(line.trim());
    }

    if (preamble.length > 0) decision = preamble[preamble.length - 1];
    const head = preamble.length > 1 ? preamble.slice(0, -1) : [];

    if (!decision || branches.length === 0) {
      return { type: 'ascii-fallback', raw, needsReview: true };
    }

    return { type: 'branch', preamble: head, decision, branches };
  }

  const steps: string[] = [];
  for (const line of lines) {
    if (line.includes('↓')) continue;
    if (line.trim()) steps.push(line.trim());
  }

  if (steps.length < 2) {
    return { type: 'ascii-fallback', raw, needsReview: true };
  }

  const lower = raw.toLowerCase();
  if (lower.includes('loop') || lower.includes('цикл') || lower.includes('→') && lower.includes('harness')) {
    return { type: 'cycle', note: steps.join(' → '), steps };
  }

  return { type: 'linear', steps };
}

export function isLikelyFlowDiagram(text: string): boolean {
  return text.includes('↓') || /[├└]/.test(text);
}
