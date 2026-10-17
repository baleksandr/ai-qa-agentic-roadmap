import { extractProcessSteps, type ProcessStep } from './studyBodyFormat';

export type RagCompactHop = {
  label: string;
  detail: string;
};

export type RagOneQueryRestBlocks = {
  sequenceSteps: ProcessStep[];
  walkthroughHops: RagCompactHop[];
  risks: string[];
  verifiedMarkdown: string;
};

function parseWalkthroughFence(raw: string): RagCompactHop[] {
  const hops: RagCompactHop[] = [];
  let current: RagCompactHop | null = null;

  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const arrow = trimmed.match(/^→\s*(.+)$/);
    if (arrow) {
      if (current) current.detail = arrow[1].trim();
      continue;
    }
    if (current) hops.push(current);
    current = { label: trimmed, detail: '' };
  }
  if (current) hops.push(current);

  return hops.filter((h) => h.label);
}

/** Розбирає markdown після сцени «один запит» (послідовність, прохід, ризики). */
export function parseRagOneQueryRestMarkdown(rest: string): RagOneQueryRestBlocks | null {
  if (!rest.trim()) return null;

  const sequence = extractProcessSteps(rest);
  const sequenceSteps = sequence?.steps ?? [];

  const walkMatch = rest.match(/####\s+Навчальний прохід[^\n]*\n+```text\n([\s\S]*?)```/i);
  const walkthroughHops = walkMatch ? parseWalkthroughFence(walkMatch[1]) : [];

  const risksBlock = rest.match(/\*\*Два ризики для QA\.\*\*\s*([\s\S]*?)(?=\n\n\*\*Що перевірено|$)/i);
  const risks: string[] = [];
  if (risksBlock) {
    const body = risksBlock[1].trim();
    const parts = body.split(/\(\d+\)\s*/).map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 2) risks.push(...parts);
    else if (body) risks.push(body);
  }

  const verifiedMatch = rest.match(/\*\*Що перевірено\.\*\*\s*([\s\S]*?)$/i);
  const verifiedMarkdown = verifiedMatch?.[1]?.trim() ?? '';

  if (sequenceSteps.length < 2 && walkthroughHops.length === 0) return null;

  return {
    sequenceSteps,
    walkthroughHops,
    risks,
    verifiedMarkdown,
  };
}
