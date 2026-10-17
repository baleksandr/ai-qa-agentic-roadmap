export type RagPromptExample = {
  system: string;
  retrieved: string;
  user: string;
};

export type RagDataChainBlock = {
  before: string;
  chainLines: string[];
  prompt: RagPromptExample;
  after: string;
};

const CHAIN_HEADING = /Узагальнений ланцюг даних:\s*\n+/i;
const PROMPT_HEADING = /\*\*Приклад зібраного prompt[^*]*\*\*:?\s*\n+/i;

/** Короткі підписи кроків у markdown (узгоджено з кількістю `→` у кожному рядку) */
export const DATA_CHAIN_CANONICAL_LABELS: string[][] = [
  ['Документ', 'Chunks + metadata', 'Vectors у index'],
  ['Запит', 'Retriever', 'Hits'],
  ['Context builder', 'Evidence + user message', 'API моделі', 'Відповідь'],
];

function parsePromptFence(raw: string): RagPromptExample | null {
  const system = raw.match(/\[System\]\s*\n([\s\S]*?)(?=\n\[Retrieved context\])/i);
  const retrieved = raw.match(/\[Retrieved context\]\s*\n([\s\S]*?)(?=\n\[User\])/i);
  const user = raw.match(/\[User\]\s*\n([\s\S]*)$/i);
  if (!system || !retrieved || !user) return null;
  return {
    system: system[1].trim(),
    retrieved: retrieved[1].trim(),
    user: user[1].trim(),
  };
}

export function extractRagDataChainAndPrompt(text: string): RagDataChainBlock | null {
  const chainIdx = text.search(CHAIN_HEADING);
  if (chainIdx < 0) return null;

  const before = text.slice(0, chainIdx).trim();
  const fromChain = text.slice(chainIdx);

  const chainFence = fromChain.match(/```text\n([\s\S]*?)```/);
  if (!chainFence || chainFence.index === undefined) return null;

  const chainLines = chainFence[1]
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  if (chainLines.length < 2) return null;

  const afterChainFence = fromChain.slice(chainFence.index + chainFence[0].length);
  const promptIdx = afterChainFence.search(PROMPT_HEADING);
  if (promptIdx < 0) return null;

  const fromPrompt = afterChainFence.slice(promptIdx);
  const promptFence = fromPrompt.match(/```text\n([\s\S]*?)```/);
  if (!promptFence) return null;

  const prompt = parsePromptFence(promptFence[1]);
  if (!prompt) return null;

  const after = fromPrompt.slice((promptFence.index ?? 0) + promptFence[0].length).trim();

  return { before, chainLines, prompt, after };
}

export function arrowStagesFromChainLine(line: string): string[] {
  return line.split(/\s*→\s*/).map((s) => s.trim()).filter(Boolean);
}

/** Підписи для UI — без дублювання lookup на схожих фрагментах (напр. «evidence» vs context builder) */
export function dataChainDisplayStages(chainIndex: number, line: string): string[] {
  const canonical = DATA_CHAIN_CANONICAL_LABELS[chainIndex];
  const parsed = arrowStagesFromChainLine(line);
  if (canonical && canonical.length === parsed.length) {
    return canonical;
  }
  return parsed;
}
