export type RagOfflinePipeline = {
  heading: string;
  stages: string[];
  annotation: string;
};

/** Витягує ```text``` блок із ланцюжком Documents → … → Searchable store */
export function extractRagOfflinePipeline(
  text: string,
): { pipeline: RagOfflinePipeline; before: string; after: string } | null {
  const fence = text.match(/```text\n([\s\S]*?)```/);
  if (!fence || fence.index === undefined) return null;
  const raw = fence[1];
  if (!/Documents\s*→/i.test(raw)) return null;

  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
  const heading = (lines[0] ?? 'Offline').replace(/:$/, '');
  const arrowLine = lines.find((l) => l.includes('→')) ?? '';
  const stages = arrowLine
    .split('→')
    .map((s) => s.trim())
    .filter(Boolean);

  if (stages.length < 2) return null;

  const annotation =
    lines.find((l) => /версія|ACL|tenant/i.test(l) && !l.includes('→'))?.trim() ?? '';

  const before = text.slice(0, fence.index).trim();
  const after = text.slice(fence.index + fence[0].length).trim();
  return { pipeline: { heading, stages, annotation }, before, after };
}
