export type SimNodeRole = 'human' | 'code' | 'llm' | 'data' | 'outcome' | 'tool';

export type SimNode = {
  id: string;
  label: string;
  shortLabel: string;
  role: SimNodeRole;
  topicId: string;
  x: number;
  y: number;
  w: number;
  h: number;
  mobileOrder: number;
  /** Опційний блок на спільній схемі */
  optional?: boolean;
  /** Хто виконує (картка на вертикальній схемі). */
  cardActorUk?: string;
  /** Короткий результат кроку на картці. */
  cardOutcomeUk?: string;
  /** Англійська назва на картці вертикальної схеми агента. */
  cardTitleEn?: string;
  /** Український переклад назви (окремий рядок на картці). */
  cardTitleUk?: string;
  /** Основний стовпець або бічний допоміжний вузол. */
  diagramLane?: 'main' | 'side';
  /** Візуально сховище даних, не виконавець кроку. */
  diagramDataStore?: boolean;
};

export type SimEdgePort = 'left' | 'right' | 'top' | 'bottom';

export type SimEdge = {
  id: string;
  from: string;
  to: string;
  label: string;
  cx?: number;
  cy?: number;
  loop?: boolean;
  optional?: boolean;
  fromPort?: SimEdgePort;
  toPort?: SimEdgePort;
  /** Проміжні точки для обходу вузлів (після fromPort, перед toPort) */
  waypoints?: { x: number; y: number }[];
  /** Точка виходу стрілки на краю картки (замість центру порту). */
  anchorFrom?: { x: number; y: number };
  /** Точка входу стрілки на краю картки. */
  anchorTo?: { x: number; y: number };
  /** Пунктирна гілка збою (не основний успішний шлях). */
  failureBranch?: boolean;
};

export type SimStepPanel = {
  /** Яку проблему вирішує крок (якщо немає — показується why) */
  problem?: string;
  what: string;
  who: string;
  input: string;
  output: string;
  /** Кому передається вихід (якщо окремо від output) */
  recipient?: string;
  why: string;
  /** Що змінилось у системі після кроку */
  systemChange?: string;
  /** Що система ще не знає після цього кроку */
  unknown?: string;
  risks: string;
  qaAgent?: string;
};

export type SimStep = {
  id: string;
  title: string;
  activeNodes: string[];
  activeEdges: string[];
  markerEdgeId?: string;
  panel: SimStepPanel;
};

export type SimAux = {
  id: string;
  label: string;
  summary: string;
  topicId: string;
  optional?: boolean;
};

export type ArchitectureSchemaId =
  | 'concept-layers'
  | 'agent'
  | 'tool-calling'
  | 'harness'
  | 'rag'
  | 'cag'
  | 'mcp'
  | 'combined';

export type ArchitectureConceptLayerNode = {
  id: string;
  label: string;
  /** Одна теза на картці (не дублює перше речення панелі). */
  cardLineUk: string;
  topicId: string;
  /** Короткий підпис зв’язку під карткою (опційно). */
  relationHintUk?: string;
};

export type ArchitectureConceptLayersConfig = {
  /** Один рядок у шапці карти. */
  headerNoteUk: string;
  /** Додаткова примітка про незалежність LLM. */
  standaloneNoteUk: string;
  /** Ненав’язлива примітка біля заголовка вкладки. */
  tabFootnoteUk: string;
  nodes: ArchitectureConceptLayerNode[];
};

export type ArchitectureSchema = {
  id: ArchitectureSchemaId;
  tabLabel: string;
  title: string;
  subtitle: string;
  disclaimer: string;
  svgLabel: string;
  /** `concept-layers` — карта понять; `vertical-sim` — висока вертикальна схема з pan/zoom. */
  diagramLayout?: 'simulation' | 'concept-layers' | 'vertical-sim';
  conceptLayers?: ArchitectureConceptLayersConfig;
  viewW: number;
  viewH: number;
  nodes: SimNode[];
  edges: SimEdge[];
  steps: SimStep[];
  exitConditions?: string[];
  aux?: SimAux[];
  /** Показати опційні вузли/ребра (MCP/RAG на agent, опційні блоки на combined) */
  optionalToggleLabel?: string;
  /** Пояснення, що змінює optional toggle (навчальний текст, не цитата книги) */
  optionalToggleHint?: string;
  /** Коротка примітка про термін (наприклад CAG курс vs книга) */
  termNote?: string;
  /** Коротке посилання на книгу (друковані сторінки), без цитат */
  bookSourceUk?: string;
  /** Позначка навчального QA-прикладу (не джерело книги) */
  teachingExampleUk?: string;
  /** Пояснення, який сценарій показано на основній схемі (наприклад успішний allow + tool result). */
  diagramRouteExampleUk?: string;
};
