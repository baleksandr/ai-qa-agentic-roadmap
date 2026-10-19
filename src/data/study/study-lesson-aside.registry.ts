import { getRagSectionAside } from './rag-section-aside';
import type { StudyLessonAsideMeta, StudySectionAside } from './study-section-aside-types';
import {
  getToolCallingSectionAside,
  TOOL_CALLING_ASIDE_META,
} from './tool-calling-section-aside';
import { getHarnessSectionAside, HARNESS_ASIDE_META } from './harness-section-aside';
import { getReasoningSectionAside, REASONING_ASIDE_META } from './reasoning-section-aside';
import {
  getMemoryStateSectionAside,
  MEMORY_STATE_ASIDE_META,
} from './memory-state-section-aside';
import {
  getVectorDatabaseSectionAside,
  VECTOR_DATABASE_ASIDE_META,
} from './vector-database-section-aside';
import { getMcpSectionAside, MCP_ASIDE_META } from './mcp-section-aside';

const RAG_META: StudyLessonAsideMeta = {
  sectionCount: 8,
  tocHint: '',
  schemaTitle: 'Схема курсу',
  schemaBlurb: 'Інтерактивний ланцюг offline + runtime з панелями на кроках:',
  atlasTo: '/agent-architecture?tab=rag',
  atlasLinkLabel: 'Відкрити схему RAG',
};

const ASIDE_TOPIC_IDS = new Set([
  'concept-01',
  'concept-03',
  'concept-04',
  'concept-10',
  'concept-12',
  'concept-15',
  'concept-06',
]);

/** Уроки з правою колонкою прогресу без повного контекстного aside (атлас, підказки розділу). */
const PROGRESS_SIDEBAR_ONLY_TOPIC_IDS = new Set(['concept-13', 'concept-14', 'concept-17']);

const ASIDE_COMPACT_TOPIC_IDS = new Set([
  'concept-01',
  'concept-04',
  'concept-06',
  'concept-10',
  'concept-12',
  'concept-15',
]);

export function hasStudyLessonAside(topicId: string): boolean {
  return ASIDE_TOPIC_IDS.has(topicId);
}

/** Компактна права панель «Мій прогрес вивчення» (десктоп) + слот під контентом (мобільний). */
export function hasStudyProgressSidebar(topicId: string): boolean {
  return hasStudyLessonAside(topicId) || PROGRESS_SIDEBAR_ONLY_TOPIC_IDS.has(topicId);
}

export function isStudyProgressSidebarCompact(topicId: string): boolean {
  if (PROGRESS_SIDEBAR_ONLY_TOPIC_IDS.has(topicId)) return true;
  return ASIDE_COMPACT_TOPIC_IDS.has(topicId);
}

export function getStudyLessonAsideMeta(topicId: string): StudyLessonAsideMeta | null {
  if (topicId === 'concept-03') return RAG_META;
  if (topicId === 'concept-01') return { ...MEMORY_STATE_ASIDE_META };
  if (topicId === 'concept-04') return { ...HARNESS_ASIDE_META };
  if (topicId === 'concept-10') return { ...TOOL_CALLING_ASIDE_META };
  if (topicId === 'concept-12') return { ...REASONING_ASIDE_META };
  if (topicId === 'concept-15') return { ...VECTOR_DATABASE_ASIDE_META };
  if (topicId === 'concept-06') return { ...MCP_ASIDE_META };
  return null;
}

export function getStudySectionAside(topicId: string, navTitle: string): StudySectionAside {
  if (topicId === 'concept-03') return getRagSectionAside(navTitle);
  if (topicId === 'concept-01') return getMemoryStateSectionAside(navTitle);
  if (topicId === 'concept-04') return getHarnessSectionAside(navTitle);
  if (topicId === 'concept-10') return getToolCallingSectionAside(navTitle);
  if (topicId === 'concept-12') return getReasoningSectionAside(navTitle);
  if (topicId === 'concept-15') return getVectorDatabaseSectionAside(navTitle);
  if (topicId === 'concept-06') return getMcpSectionAside(navTitle);
  return {
    focus: 'Контекст для цього розділу ще не налаштований.',
    example: 'Оберіть розділ у змісті уроку.',
  };
}
