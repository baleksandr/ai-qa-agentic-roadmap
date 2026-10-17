import type { RagFailureMeta } from './rag-failure-modes';
import { TOOL_CALLING_FAILURE_DETAILS } from './tool-calling-failure-details';

export function lookupToolCallingFailureMeta(title: string): RagFailureMeta {
  const hit = TOOL_CALLING_FAILURE_DETAILS.find(
    (f) => title.toLowerCase().includes(f.titleUk.toLowerCase()) || f.titleUk.toLowerCase().includes(title.toLowerCase()),
  );
  if (hit) return hit.meta;
  return { index: 0, categoryUk: 'Збій', categoryClass: 'cat-ops', severity: 'warning' };
}
