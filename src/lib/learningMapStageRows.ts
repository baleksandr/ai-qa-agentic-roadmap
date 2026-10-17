import type { LearningMapNode } from '../data/learning-map.registry';

/** Розбиття лінійного маршруту на ряди без розриву порядку тем (5+ вузлів). */
export function packConceptStageRows(nodes: LearningMapNode[]): LearningMapNode[][] {
  const n = nodes.length;
  if (n <= 4) return [nodes];
  if (n === 5) return [nodes.slice(0, 3), nodes.slice(3)];
  if (n === 6) return [nodes.slice(0, 3), nodes.slice(3)];
  if (n === 7) return [nodes.slice(0, 4), nodes.slice(4)];
  const half = Math.ceil(n / 2);
  return [nodes.slice(0, half), nodes.slice(half)];
}
