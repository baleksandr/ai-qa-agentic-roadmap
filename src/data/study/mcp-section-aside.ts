import type { StudySectionAside, StudyLessonAsideMeta } from './study-section-aside-types';

const BY_SECTION: Record<string, StudySectionAside> = {
  'Навіщо MCP': {
    sectionNoteUk:
      'Host, MCP client і MCP server. Протокол не замінює правила доступу й не виконує дію замість застосунку.',
  },
  'Навчальний run': {
    sectionNoteUk:
      'Шість кроків одного дозволеного read_artifact. Jira — окремий сценарій після цього ланцюга.',
  },
  Компоненти: {
    sectionNoteUk:
      'Client, server, transport, tool schema і доступ. Harness ≠ лише MCP client.',
  },
  Послідовність: {
    sectionNoteUk:
      'Discovery → пропозиція → перевірка застосунку → RPC → сервер → observation. Без обходу policy.',
  },
  'Код vs LLM': {
    sectionNoteUk:
      'Модель пропонує. Застосунок дозволяє або відмовляє. Client передає. Server виконує I/O.',
  },
  Збої: {
    sectionNoteUk:
      'Недоступний server, розхід schema з кодом, надмірні права tool. QA — окремо для кожного.',
  },
  Production: {
    sectionNoteUk:
      'Версії й контракт. Transport і mTLS за потреби. Ліміти, повтори, dev/prod або інша конфігурація.',
  },
  Запам: {
    sectionNoteUk:
      'Протокол ≠ агент. Host, client, server. Policy в застосунку. П’ять питань + pitch 30–45 с.',
  },
};

export function getMcpSectionAside(navTitle: string): StudySectionAside {
  const hit = Object.entries(BY_SECTION).find(([key]) => navTitle.startsWith(key));
  if (hit) return hit[1];
  return { suppressSectionContext: true };
}

export const MCP_ASIDE_META: StudyLessonAsideMeta = {
  sectionCount: 8,
  tocHint: '',
  schemaTitle: 'Схема курсу',
  schemaBlurb: 'MCP client і server на схемі курсу:',
  atlasTo: '/agent-architecture?tab=mcp',
  atlasLinkLabel: 'Відкрити схему MCP',
  compactAside: true,
} as const;
