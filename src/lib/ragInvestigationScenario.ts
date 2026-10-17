export type RagScenarioChunk = {
  id: string;
  sourceId: string;
  score: number;
  excerpt: string;
};

export type RagInvestigationScenario = {
  introMarkdown: string;
  /** Блок «Передумова run (offline)» */
  prerequisiteMarkdown: string;
  /** Абзац про signal з CI перед query fence */
  ciLeadMarkdown: string;
  queryLine: string;
  filters: { key: string; value: string }[];
  hitsLeadMarkdown: string;
  chunks: RagScenarioChunk[];
  outroMarkdown: string;
};

const SCENARIO_ANCHOR = /QA Regression Investigation Agent/i;

/** Витягує навчальний сценарій login_spec з тіла розділу «один запит» */
export function extractRagInvestigationScenario(
  text: string,
): { scenario: RagInvestigationScenario; rest: string } | null {
  if (!SCENARIO_ANCHOR.test(text)) return null;

  const split = text.split(/\n####\s+Послідовність/i);
  const sceneBlock = split[0] ?? '';
  const rest = split.length > 1 ? `#### Послідовність${split.slice(1).join('\n#### Послідовність')}` : '';

  const fences = [...sceneBlock.matchAll(/```text\n([\s\S]*?)```/g)];
  if (fences.length < 2) return null;

  const queryRaw = fences[0][1].trim();
  const chunksRaw = fences[1][1].trim();

  const beforeFirstFence = sceneBlock.slice(0, fences[0].index).trim();
  const betweenFences = sceneBlock.slice(fences[0].index! + fences[0][0].length, fences[1].index).trim();
  const afterSecondFence = sceneBlock.slice(fences[1].index! + fences[1][0].length).trim();

  const prereqStart = beforeFirstFence.search(/\*\*Передумова/i);
  const ciStart = beforeFirstFence.search(/\n\nПісля падіння/i);
  if (prereqStart < 0 || ciStart < 0) return null;

  const introMarkdown = beforeFirstFence.slice(0, prereqStart).trim();
  const prerequisiteMarkdown = beforeFirstFence.slice(prereqStart, ciStart).trim();
  const ciLeadMarkdown = beforeFirstFence.slice(ciStart).replace(/^\n+/, '').trim();

  const queryLines = queryRaw.split('\n').map((l) => l.trim()).filter(Boolean);
  const queryLine = queryLines[0]?.replace(/^"|"$/g, '') ?? '';
  const filters: { key: string; value: string }[] = [];
  for (const line of queryLines.slice(1)) {
    const m = line.match(/^Filters:\s*(.+)$/i);
    if (!m) continue;
    m[1].split(',').forEach((pair) => {
      const eq = pair.indexOf('=');
      if (eq < 0) return;
      const key = pair.slice(0, eq).trim();
      const value = pair.slice(eq + 1).trim();
      if (key && value) filters.push({ key, value });
    });
  }

  const hitsLeadMarkdown = betweenFences.trim();
  const chunks = parseChunkBlocks(chunksRaw);
  if (chunks.length < 1) return null;

  const outroMarkdown = afterSecondFence.trim();

  return {
    scenario: {
      introMarkdown,
      prerequisiteMarkdown,
      ciLeadMarkdown,
      queryLine,
      filters,
      hitsLeadMarkdown,
      chunks,
      outroMarkdown,
    },
    rest: rest.trim(),
  };
}

function parseChunkBlocks(raw: string): RagScenarioChunk[] {
  const blocks = raw.split(/\n\n+/).filter(Boolean);
  const out: RagScenarioChunk[] = [];
  for (const block of blocks) {
    const head = block.match(
      /^(?:\[[^\]]+\]\s+)?chunk_id=([^\s]+)\s+source_id=([^\s]+)\s+score=([\d.]+)/,
    );
    const legacy = block.match(/^\[([^\]]+)\]\s+source_id=([^\s]+)\s+score=([\d.]+)/);
    const quote = block.match(/"([^"]*)"/);
    const m = head ?? legacy;
    if (!m) continue;
    const id = head ? head[1] : legacy![1];
    const sourceId = head ? head[2] : legacy![2];
    const score = parseFloat(head ? head[3] : legacy![3]);
    out.push({
      id,
      sourceId,
      score,
      excerpt: quote?.[1] ?? block.replace(m[0], '').trim(),
    });
  }
  return out;
}
