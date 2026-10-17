import type { LessonBlock } from '../types/lessonBlocks';

/** Блоки, які дублюють інтерактивні картки / віджети в тому ж розділі. */
const HIDE_BLOCK_TYPES: Record<string, LessonBlock['type'][] | undefined> = {
  'glossary-01': ['diagram'],
  'glossary-14': ['flow'],
  'glossary-17': ['flow'],
  'glossary-19': ['diagram'],
  'glossary-20': ['diagram'],
};

export function fundamentalsShouldHideBlock(sectionId: string, block: LessonBlock): boolean {
  const types = HIDE_BLOCK_TYPES[sectionId];
  return types?.includes(block.type) ?? false;
}

export function fundamentalsWidgetIdForSection(_sectionId: string): string | null {
  return null;
}
