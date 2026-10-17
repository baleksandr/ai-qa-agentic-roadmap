/** Чи це навчальна схема «крок → крок», а не проза з однією стрілкою */
export function isPipelineArrowLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed.includes('→')) return false;
  if (/^\*\*/.test(trimmed)) return false;
  if (/Golden queries|recall@|mapping citation|chunk_id.*→/i.test(trimmed)) return false;

  const parts = trimmed.split(/\s*→\s*/).map((s) => s.trim()).filter(Boolean);
  if (parts.length < 2) return false;

  // Одна стрілка в довгому реченні — не схема
  if (parts.length === 2) {
    if (parts.some((p) => p.length > 52)) return false;
    if ((trimmed.match(/→/g) ?? []).length > 1) return false;
    return false;
  }

  if (parts.some((p) => p.length > 120)) return false;
  return true;
}

/** Витягнути рядок-схему з ```text``` або plain абзаца */
function arrowLineFromBlock(block: string): string | null {
  const trimmed = block.trim();
  const fenced = trimmed.match(/^```(?:text)?\s*\n?([\s\S]*?)\n?```\s*$/i);
  let body = fenced ? fenced[1].trim() : trimmed.replace(/^```text\s*/i, '').replace(/```\s*$/i, '').trim();

  if (!body.includes('→')) return null;

  if (!body.includes('\n')) {
    return isPipelineArrowLine(body) ? body : null;
  }

  for (const raw of body.split('\n')) {
    const line = raw.trim();
    if (line && isPipelineArrowLine(line)) return line;
  }
  return null;
}

/** Один абзац лише з «a → b → c» (схема, не QA-проза) */
export function parseArrowFlowParagraph(block: string): string[] | null {
  const line = arrowLineFromBlock(block);
  if (!line) return null;
  return line.split(/\s*→\s*/).map((s) => s.trim()).filter(Boolean);
}

/** Прибрати ```text``` блок зі схемою — коли ribbon рендериться окремим компонентом */
export function stripFencedArrowFlowBlock(markdown: string): string {
  return markdown.replace(/```(?:text)?\s*\n?[^`]*→[^`]*\n?```/gi, '').trim();
}

export function splitMarkdownWithArrowFlows(markdown: string): Array<{ kind: 'md' | 'flow'; text: string }> {
  const blocks = markdown.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);
  const out: Array<{ kind: 'md' | 'flow'; text: string }> = [];
  for (const block of blocks) {
    const stages = parseArrowFlowParagraph(block);
    if (stages) {
      out.push({ kind: 'flow', text: stages.join('\n') });
    } else {
      out.push({ kind: 'md', text: block });
    }
  }
  return out;
}

export function flowStagesFromChunk(chunk: string): string[] {
  return chunk.split('\n').map((s) => s.trim()).filter(Boolean);
}
