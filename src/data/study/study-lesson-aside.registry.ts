import { getRagSectionAside } from './rag-section-aside';
import type { StudyLessonAsideMeta, StudySectionAside } from './study-section-aside-types';
import {
  getToolCallingSectionAside,
  TOOL_CALLING_ASIDE_META,
} from './tool-calling-section-aside';
import { getHarnessSectionAside, HARNESS_ASIDE_META } from './harness-section-aside';
import { getReasoningSectionAside, REASONING_ASIDE_META } from './reasoning-section-aside';

const RAG_META: StudyLessonAsideMeta = {
  sectionCount: 8,
  tocHint: '',
  schemaTitle: 'Схема курсу',
  schemaBlurb: 'Інтерактивний ланцюг offline + runtime з панелями на кроках:',
  atlasTo: '/agent-architecture?tab=rag',
  atlasLinkLabel: 'Відкрити схему RAG',
};

const ASIDE_TOPIC_IDS = new Set(['concept-03', 'concept-04', 'concept-10', 'concept-12']);

export function hasStudyLessonAside(topicId: string): boolean {
  return ASIDE_TOPIC_IDS.has(topicId);
}

export function getStudyLessonAsideMeta(topicId: string): StudyLessonAsideMeta | null {
  if (topicId === 'concept-03') return RAG_META;
  if (topicId === 'concept-04') return { ...HARNESS_ASIDE_META };
  if (topicId === 'concept-10') return { ...TOOL_CALLING_ASIDE_META };
  if (topicId === 'concept-12') return { ...REASONING_ASIDE_META };
  return null;
}

export function getStudySectionAside(topicId: string, navTitle: string): StudySectionAside {
  if (topicId === 'concept-03') return getRagSectionAside(navTitle);
  if (topicId === 'concept-04') return getHarnessSectionAside(navTitle);
  if (topicId === 'concept-10') return getToolCallingSectionAside(navTitle);
  if (topicId === 'concept-12') return getReasoningSectionAside(navTitle);
  return {
    focus: 'Контекст для цього розділу ще не налаштований.',
    example: 'Оберіть розділ у змісті уроку.',
  };
}
