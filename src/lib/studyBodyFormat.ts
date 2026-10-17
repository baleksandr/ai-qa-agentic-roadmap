import { isPipelineArrowLine } from './studyArrowFlow';

/** Витягує блок «Ключова думка» з тіла розділу */
export function extractKeyIdeaBlock(text: string): { idea: string; rest: string } | null {
  const m = text.match(/^Ключова думка\s*\n+([\s\S]*?)$/im);
  if (!m || m.index === undefined) return null;
  const idea = m[1].trim();
  const rest = (text.slice(0, m.index) + text.slice(m.index + m[0].length)).trim();
  return { idea, rest };
}

/** Рядки з «• …» як список компонентів */
export function extractBulletComponentList(text: string): { items: string[]; rest: string } | null {
  const lines = text.split('\n');
  const items: string[] = [];
  const restLines: string[] = [];
  let inRun = false;

  for (const line of lines) {
    const bullet = line.match(/^•\s+(.+)$/);
    if (bullet) {
      inRun = true;
      items.push(bullet[1].trim());
      continue;
    }
    if (inRun && line.trim() === '') continue;
    if (inRun && items.length > 0 && line.trim() !== '') {
      inRun = false;
    }
    restLines.push(line);
  }

  if (items.length < 2) return null;
  return { items, rest: restLines.join('\n').trim() };
}

/** GFM-список замість «•» в інших абзацах */
export function normalizeStudyBullets(text: string): string {
  return text.replace(/^•\s+/gm, '- ');
}

export type ProcessStep = { index: number; text: string };

/** Кроки «**Крок 1.** …» лише в блоках послідовності (не звичайні нумеровані списки) */
export function extractProcessSteps(text: string): { steps: ProcessStep[]; rest: string } | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const seqSplit = trimmed.split(/####\s+Послідовність[^\n]*\n?/i);
  let leadRest = '';
  let stepSource = trimmed;
  if (seqSplit.length > 1) {
    leadRest = seqSplit[0].trim();
    stepSource = seqSplit.slice(1).join('\n');
  } else if (!/####\s+Крок за кроком/i.test(trimmed) && !/\*\*Крок \d+\.\*\*/.test(trimmed)) {
    return null;
  }

  const hasStepBlock =
    /####\s+Послідовність/i.test(trimmed) ||
    /####\s+Крок за кроком/i.test(trimmed) ||
    /\*\*Крок \d+\.\*\*/.test(stepSource);
  if (!hasStepBlock) return null;

  const pieces: string[] = [];
  if (/\*\*Крок \d+\.\*\*/.test(stepSource)) {
    stepSource
      .split(/(?=\*\*Крок \d+\.\*\*)/)
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((p) => pieces.push(p));
  } else {
    stepSource.split(/\n+/).forEach((line) => {
      if (line.trim()) pieces.push(line.trim());
    });
  }

  const steps: ProcessStep[] = [];
  const rest: string[] = leadRest ? [leadRest] : [];

  for (const line of pieces) {
    const bold = line.match(/^\*\*Крок (\d+)\.\*\*\s*(.+)$/);
    if (bold) {
      steps.push({ index: parseInt(bold[1], 10), text: bold[2].trim() });
      continue;
    }
    const numbered = line.match(/^(\d+)\.\s+(.+)$/);
    if (numbered && !/\*\*Крок \d+\.\*\*/.test(trimmed)) {
      steps.push({ index: parseInt(numbered[1], 10), text: numbered[2].trim() });
    } else if (!/^####\s+/.test(line)) {
      rest.push(line);
    }
  }

  if (steps.length < 2) return null;
  steps.sort((a, b) => a.index - b.index);
  return { steps, rest: rest.join('\n\n').trim() };
}

/** Один або кілька сегментів з «→» (що передається між блоками) */
export function extractTransferFlow(text: string): { stages: string[]; rest: string } | null {
  const trimmed = text.trim();
  if (!trimmed.includes('→')) return null;

  const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length > 3) return null;

  const line = lines.join(' ');
  if (!isPipelineArrowLine(line)) return null;

  const arrowParts = line.split(/\s*→\s*/);
  if (arrowParts.length < 2) return null;

  const stages: string[] = [];
  stages.push(arrowParts[0].trim());
  const tail = arrowParts.slice(1).join(' → ');
  tail
    .split(/;\s*/)
    .map((s) => s.replace(/\.\s*$/, '').trim())
    .filter(Boolean)
    .forEach((s) => stages.push(s));

  if (stages.length < 2) return null;
  return { stages, rest: '' };
}
