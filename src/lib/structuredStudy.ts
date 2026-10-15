import type { StructuredStudy } from '../types/lessonBlocks';

const modules = import.meta.glob('../../content/**/*.study.json', {
  eager: true,
  import: 'default',
}) as Record<string, StructuredStudy>;

const BY_TOPIC: Record<string, StructuredStudy> = {};

for (const data of Object.values(modules)) {
  if (data?.topicId) BY_TOPIC[data.topicId] = data;
}

export function loadStructuredStudy(topicId: string): StructuredStudy | null {
  return BY_TOPIC[topicId] ?? null;
}
