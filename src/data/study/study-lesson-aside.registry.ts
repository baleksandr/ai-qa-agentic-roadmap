import { getRagSectionAside } from './rag-section-aside';
import type { StudyLessonAsideMeta, StudySectionAside } from './study-section-aside-types';
import {
  getToolCallingSectionAside,
  TOOL_CALLING_ASIDE_META,
} from './tool-calling-section-aside';

const RAG_META: StudyLessonAsideMeta = {
  sectionCount: 8,
  tocHint: '',
  schemaTitle: 'Схема курсу',
  schemaBlurb: 'Інтерактивний ланцюг offline + runtime з панелями на кроках:',
  atlasTo: '/agent-architecture?tab=rag',
  atlasLinkLabel: 'Відкрити схему RAG',
};

const ASIDE_TOPIC_IDS = new Set(['concept-03', 'concept-10']);

export function hasStudyLessonAside(topicId: string): boolean {
  return ASIDE_TOPIC_IDS.has(topicId);
}

export function getStudyLessonAsideMeta(topicId: string): StudyLessonAsideMeta | null {
  if (topicId === 'concept-03') return RAG_META;
  if (topicId === 'concept-10') return { ...TOOL_CALLING_ASIDE_META };
  return null;
}

export function getStudySectionAside(topicId: string, navTitle: string): StudySectionAside {
  if (topicId === 'concept-03') return getRagSectionAside(navTitle);
  if (topicId === 'concept-10') return getToolCallingSectionAside(navTitle);
  return {
    focus: 'Контекст для цього розділу ще не налаштований.',
    example: 'Оберіть розділ у змісті уроку.',
  };
}
