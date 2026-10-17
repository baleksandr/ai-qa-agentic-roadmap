import type { RoadmapGroup, TopicMeta } from '../types/topic';
import { MIGRATION_OVERRIDE } from './migration.generated';

/** Очікуване ім’я файлу DOCX у `source/` */
export const SOURCE_DOCX_FILENAME =
  '10_Lab_2_AI_for_QA_Agentic_Engineering_From_Zero_Under_the_Hood_v10_Lab_Updated.docx';

const concept = (
  num: number,
  slug: string,
  title: string,
  groupId: TopicMeta['groupId'],
  learningOrder: number,
  prerequisites: string[],
  related: string[],
): TopicMeta => ({
  id: `concept-${String(num).padStart(2, '0')}`,
  kind: 'concept',
  sourceNumber: num,
  title: `Concept ${String(num).padStart(2, '0')} — ${title}`,
  shortTitle: title,
  groupId,
  learningOrder,
  prerequisites,
  contentPath: `content/concepts/${String(num).padStart(2, '0')}-${slug}.md`,
  migrationStatus: 'not_migrated',
  migrationNotes: 'Очікує перенесення з PART II DOCX після інвентаризації.',
  docxSection: `PART II — Concept ${num} (уточнити після npm run docx:inventory)`,
  relatedTopicIds: related,
});

export const TOPICS: TopicMeta[] = [
  {
    id: 'fundamentals',
    kind: 'fundamentals',
    title: 'AI / LLM Fundamentals',
    shortTitle: 'Fundamentals',
    groupId: 'fundamentals',
    learningOrder: 1,
    prerequisites: [],
    contentPath: 'content/fundamentals/ai-llm-fundamentals.md',
    migrationStatus: 'not_migrated',
    migrationNotes: 'Запустіть npm run source:migrate після DOCX у source/.',
    docxSection: '1. AI / LLM Fundamentals — що реально відбувається',
    relatedTopicIds: ['concept-14', 'concept-10'],
  },
  concept(1, 'memory-state', 'Memory & State', 'agent-core', 6, ['concept-10', 'concept-04'], [
    'concept-06',
    'concept-02',
  ]),
  concept(2, 'orchestration', 'Orchestration', 'agent-core', 5, ['concept-04', 'concept-10'], [
    'concept-16',
    'concept-09',
  ]),
  concept(3, 'rag', 'RAG', 'knowledge', 10, ['concept-14', 'concept-15'], ['concept-15', 'concept-06']),
  concept(4, 'agent-harness', 'Agent Harness', 'agent-core', 4, ['concept-10'], [
    'concept-02',
    'concept-07',
  ]),
  concept(5, 'evals', 'Evals', 'control-quality', 17, ['concept-17', 'concept-18'], [
    'concept-19',
  ]),
  concept(6, 'mcp', 'MCP', 'agent-core', 7, ['concept-01'], ['concept-07', 'concept-03']),
  concept(7, 'skills', 'Skills', 'agent-core', 8, ['concept-06', 'concept-01'], ['concept-16']),
  concept(8, 'a2a', 'A2A', 'advanced-agents', 20, ['concept-09'], ['concept-09']),
  concept(9, 'multi-agent-system', 'Multi-Agent System', 'advanced-agents', 19, [
    'concept-02',
    'concept-08',
  ], ['concept-08', 'concept-16']),
  concept(10, 'tool-calling', 'Tool Calling', 'agent-core', 3, ['fundamentals'], [
    'concept-04',
    'concept-06',
  ]),
  concept(11, 'planning', 'Planning', 'advanced-agents', 13, ['concept-12', 'concept-10'], [
    'concept-16',
  ]),
  concept(12, 'reasoning', 'Reasoning', 'advanced-agents', 12, ['concept-14'], ['concept-11']),
  concept(13, 'fine-tuning', 'Fine-tuning', 'knowledge', 11, ['fundamentals', 'concept-14'], []),
  concept(14, 'prompt-engineering', 'Prompt Engineering', 'knowledge', 2, ['fundamentals'], [
    'concept-03',
    'concept-12',
  ]),
  concept(15, 'vector-database', 'Vector Database', 'knowledge', 9, ['concept-03'], ['concept-03']),
  concept(16, 'agentic-workflows', 'Agentic Workflows', 'advanced-agents', 21, [
    'concept-02',
    'concept-11',
  ], ['concept-20']),
  concept(17, 'guardrails', 'Guardrails', 'control-quality', 15, ['concept-04'], [
    'concept-18',
    'concept-05',
  ]),
  concept(18, 'observability', 'Observability', 'control-quality', 16, ['concept-17'], [
    'concept-05',
    'concept-20',
  ]),
  concept(19, 'evaluation-benchmarks', 'Evaluation Benchmarks', 'control-quality', 18, [
    'concept-05',
  ], ['concept-05']),
  concept(20, 'agents-production', 'AI Agents in Production', 'production', 32, [
    'concept-18',
    'lab-9',
  ], ['concept-17', 'concept-18']),
  {
    id: 'qa-interview',
    kind: 'reference',
    title: 'QA Interview Questions',
    shortTitle: 'Питання для QA-співбесіди',
    groupId: 'reference',
    learningOrder: 98,
    prerequisites: [],
    contentPath: 'content/qa-interview/qa-interview-bank.md',
    migrationStatus: 'partial',
    migrationNotes: 'Банк питань у Study Mode; категорії в qa-interview-bank.ts.',
    relatedTopicIds: ['fundamentals', 'concept-14', 'concept-03'],
  },
  {
    id: 'reference-library',
    kind: 'reference',
    title: 'Reference Library',
    shortTitle: 'Reference',
    groupId: 'reference',
    learningOrder: 99,
    prerequisites: [],
    contentPath: 'content/reference/reference-library.md',
    migrationStatus: 'not_migrated',
    migrationNotes: 'Очікує перенесення Reference Library з DOCX.',
    docxSection: 'Reference Library (уточнити після інвентаризації)',
    relatedTopicIds: [],
  },
  ...Array.from({ length: 10 }, (_, i) => {
    const n = i;
    return {
      id: `lab-${n}`,
      kind: 'lab' as const,
      sourceNumber: n,
      title: `Lab ${n} — QA Regression Investigation Agent`,
      shortTitle: `Lab ${n}`,
      groupId: 'qa-lab' as const,
      learningOrder: 22 + n,
      prerequisites: n === 0 ? ['fundamentals'] : [`lab-${n - 1}`],
      contentPath: `content/labs/lab-${n}.md`,
      migrationStatus: 'not_migrated' as const,
      migrationNotes: 'Очікує перенесення Lab з DOCX.',
      docxSection: `Lab ${n} (уточнити після інвентаризації)`,
      relatedTopicIds: n > 0 ? [`lab-${n - 1}`] : ['concept-10', 'concept-04'],
    };
  }),
];

for (const topic of TOPICS) {
  const o = MIGRATION_OVERRIDE[topic.id];
  if (o) {
    topic.migrationStatus = o.migrationStatus;
    topic.migrationNotes = o.migrationNotes;
  }
}

export const TOPIC_BY_ID: Record<string, TopicMeta> = Object.fromEntries(
  TOPICS.map((t) => [t.id, t]),
);

/** Групи на карті — звірити з фазами DOCX після інвентаризації */
export const ROADMAP_GROUPS: RoadmapGroup[] = [
  {
    id: 'fundamentals',
    title: 'AI / LLM Fundamentals',
    subtitle: 'Старт: базові моделі та термінологія',
    topicIds: ['fundamentals'],
    flowEdges: [{ from: 'fundamentals', to: 'concept-14' }],
  },
  {
    id: 'agent-core',
    title: 'Ядро агента',
    subtitle: 'Tool Calling → Harness → Orchestration → Memory → MCP → Skills',
    topicIds: [
      'concept-10',
      'concept-04',
      'concept-02',
      'concept-01',
      'concept-06',
      'concept-07',
    ],
    flowEdges: [
      { from: 'concept-10', to: 'concept-04' },
      { from: 'concept-04', to: 'concept-02' },
      { from: 'concept-02', to: 'concept-01' },
      { from: 'concept-01', to: 'concept-06' },
      { from: 'concept-06', to: 'concept-07' },
    ],
  },
  {
    id: 'knowledge',
    title: 'Знання та контекст',
    subtitle: 'Prompt → RAG → Vector DB (+ Fine-tuning)',
    topicIds: ['concept-14', 'concept-03', 'concept-15', 'concept-13'],
    flowEdges: [
      { from: 'concept-14', to: 'concept-03' },
      { from: 'concept-03', to: 'concept-15' },
      { from: 'concept-15', to: 'concept-13' },
    ],
  },
  {
    id: 'advanced-agents',
    title: 'Мислення та мульти-агентність',
    subtitle: 'Reasoning, Planning, Workflows, Multi-Agent, A2A',
    topicIds: [
      'concept-12',
      'concept-11',
      'concept-16',
      'concept-09',
      'concept-08',
    ],
    flowEdges: [
      { from: 'concept-12', to: 'concept-11' },
      { from: 'concept-11', to: 'concept-16' },
      { from: 'concept-16', to: 'concept-09' },
      { from: 'concept-09', to: 'concept-08' },
    ],
  },
  {
    id: 'control-quality',
    title: 'Контроль і якість',
    subtitle: 'Guardrails → Observability → Evals → Benchmarks',
    topicIds: ['concept-17', 'concept-18', 'concept-05', 'concept-19'],
    flowEdges: [
      { from: 'concept-17', to: 'concept-18' },
      { from: 'concept-18', to: 'concept-05' },
      { from: 'concept-05', to: 'concept-19' },
    ],
  },
  {
    id: 'qa-lab',
    title: 'Практика: QA Regression Investigation Agent',
    subtitle: 'Lab 0–9',
    topicIds: TOPICS.filter((t) => t.kind === 'lab').map((t) => t.id),
    flowEdges: Array.from({ length: 9 }, (_, i) => ({
      from: `lab-${i}`,
      to: `lab-${i + 1}`,
    })),
  },
  {
    id: 'production',
    title: 'Production',
    subtitle: 'Після лабораторії',
    topicIds: ['concept-20'],
    flowEdges: [{ from: 'lab-9', to: 'concept-20' }],
  },
  {
    id: 'reference',
    title: 'Reference Library',
    topicIds: ['qa-interview', 'reference-library'],
    flowEdges: [],
  },
];

/** Номер Concept у документі vs рекомендований порядок вивчення */
export function getLearningRoute(): TopicMeta[] {
  return [...TOPICS].sort((a, b) => a.learningOrder - b.learningOrder);
}
