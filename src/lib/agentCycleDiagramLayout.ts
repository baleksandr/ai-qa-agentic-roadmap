import type { ArchitectureSchema, SimEdge, SimNode } from '../types/architecture-simulation';
import { MCP_NODE, RAG_ENRICH_NODE, RAG_SEARCH_NODE, type AgentOptionalFlags } from './agentCycleOptionalNodes';
import { edgePathD, edgePolyline } from './archSimGeometry';

const PAD = 48;
const LEFT_W = 212;
const MAIN_W = 300;
const RIGHT_W = 192;
const GAP_L = 56;
const GAP_R = 52;
const MAIN_H_MIN = 108;
const SIDE_H_MIN = 118;
const ENRICH_H_MIN = 96;
const GUTTER = 58;
const ROW_GAP = 12;

const LEFT_X = PAD;
const MAIN_X = LEFT_X + LEFT_W + GAP_L;
const RIGHT_X = MAIN_X + MAIN_W + GAP_R;
const MAIN_CX = MAIN_X + MAIN_W / 2;

const BUS_RIGHT_LOOP = RIGHT_X + RIGHT_W + 56;
const BUS_RIGHT_RETURN = BUS_RIGHT_LOOP + 72;
const BUS_RIGHT_FINISH = BUS_RIGHT_RETURN + 72;
const VIEW_W = BUS_RIGHT_FINISH + PAD;

const LEFT_OUTER = 12;
type RowSpec = {
  main: string;
  left?: string;
  right?: string;
  spineLabel?: string;
  spineEdgeId?: string;
  gapBefore?: number;
  mainMinH?: number;
};

export type SpineLabel = { edgeId: string; x: number; y: number; text: string };

export type EdgeCalloutPlacement = {
  edgeId: string;
  x: number;
  y: number;
  w: number;
};

export type AgentLayoutResult = {
  viewW: number;
  viewH: number;
  nodes: SimNode[];
  edges: SimEdge[];
  spineLabels: SpineLabel[];
  edgeCallouts: EdgeCalloutPlacement[];
};

function wrappedLineCount(text: string, charsPerLine: number): number {
  const t = text.trim();
  if (!t) return 0;
  return Math.max(1, Math.ceil(t.length / charsPerLine));
}

/** Висота картки: чип ролі + заголовок + короткий опис (узгоджено з AgentCycleFlowNode). */
export function estimateAgentCardHeight(base: SimNode, width: number, minH: number): number {
  const innerW = Math.max(80, width - 28);
  const charsPerLine = Math.max(11, Math.floor(innerW / 7.1));
  const chipH = 24;
  const gap = 8;
  const titleLineH = 22;
  const outcomeLineH = 20;
  const vPad = 30;

  let titleLines = 1;
  if (base.cardTitleEn && base.cardTitleUk) {
    titleLines =
      wrappedLineCount(base.cardTitleEn, charsPerLine) +
      wrappedLineCount(base.cardTitleUk, charsPerLine);
  } else {
    titleLines = wrappedLineCount(base.label, charsPerLine);
  }

  const outcomeLines = base.cardOutcomeUk
    ? wrappedLineCount(base.cardOutcomeUk, charsPerLine)
    : 0;

  const actionRowH = 26;

  const body =
    chipH +
    gap +
    titleLines * titleLineH +
    (outcomeLines > 0 ? gap + outcomeLines * outcomeLineH : 0) +
    gap +
    actionRowH;

  return Math.max(minH, vPad * 2 + body);
}

function rect(id: string, x: number, y: number, w: number, h: number, base: SimNode): SimNode {
  const dataStore = base.diagramDataStore || base.role === 'data' || id === 'state';
  return {
    ...base,
    id,
    x,
    y,
    w,
    h,
    diagramDataStore: dataStore,
    diagramLane: x < MAIN_X - 4 ? 'side' : x > MAIN_X + MAIN_W - 4 ? 'side' : 'main',
  };
}

function buildRowSpecs(flags: AgentOptionalFlags): RowSpec[] {
  const rows: RowSpec[] = [
    { main: 'human' },
    {
      main: 'harness',
      right: 'state',
      spineLabel: 'подія CI',
      spineEdgeId: 'e-human-harness',
    },
  ];

  if (flags.showRag) {
    rows.push({
      left: RAG_SEARCH_NODE.id,
      main: RAG_ENRICH_NODE.id,
      mainMinH: ENRICH_H_MIN,
      spineLabel: 'пошук',
      spineEdgeId: 'e-harness-rag-query',
    });
  }

  rows.push({
    main: 'llm',
    spineLabel: flags.showRag ? 'з фрагментами' : 'запит моделі',
    spineEdgeId: flags.showRag ? 'e-rag-enrich-llm' : 'e-harness-llm',
  });

  rows.push({
    main: 'validation',
    spineLabel: 'пропозиція дії',
    spineEdgeId: 'e-llm-harness-call',
  });

  if (flags.showMcp) {
    rows.push({
      main: MCP_NODE.id,
      mainMinH: MAIN_H_MIN,
      spineLabel: 'до MCP',
      spineEdgeId: 'e-validation-mcp',
    });
  }

  rows.push({
    main: 'tools',
    left: 'artifacts',
    spineLabel: flags.showMcp ? 'виклик MCP' : 'дозвіл',
    spineEdgeId: flags.showMcp ? 'e-mcp-tools' : 'e-validation-tools',
  });

  rows.push({
    main: 'tool-ingest',
    spineLabel: 'результат інструмента',
    spineEdgeId: 'e-tools-tool-ingest',
  });

  rows.push({
    main: 'llm-refine',
    spineLabel: 'до моделі',
    spineEdgeId: 'e-tool-ingest-llm-refine',
  });

  rows.push({
    main: 'prepare-result',
    spineLabel: 'уточнення',
    spineEdgeId: 'e-llm-refine-prepare',
  });

  rows.push({
    main: 'result',
    spineLabel: 'підсумок',
    spineEdgeId: 'e-prepare-result',
    gapBefore: 20,
  });
  return rows;
}

function resolveNodeBase(id: string, byId: Map<string, SimNode>, flags: AgentOptionalFlags): SimNode | undefined {
  if (id === RAG_SEARCH_NODE.id && flags.showRag) return { ...RAG_SEARCH_NODE };
  if (id === RAG_ENRICH_NODE.id && flags.showRag) return { ...RAG_ENRICH_NODE };
  if (id === MCP_NODE.id && flags.showMcp) return { ...MCP_NODE };
  return byId.get(id);
}

export function computeAgentCycleLayout(
  schema: ArchitectureSchema,
  flags: AgentOptionalFlags = { showRag: false, showMcp: false },
): AgentLayoutResult {
  const byId = new Map(schema.nodes.map((n) => [n.id, n]));
  const placed: SimNode[] = [];
  const spineLabels: SpineLabel[] = [];
  const rows = buildRowSpecs(flags);

  let y = PAD;
  let prevMainId: string | null = null;

  for (const row of rows) {
    const mainBase = resolveNodeBase(row.main, byId, flags);
    if (!mainBase) continue;

    if (row.gapBefore) y += row.gapBefore;

    if (prevMainId && row.spineLabel && row.spineEdgeId) {
      spineLabels.push({
        edgeId: row.spineEdgeId,
        x: MAIN_CX,
        y: y - GUTTER / 2,
        text: row.spineLabel,
      });
      y += GUTTER;
    }

    const rowY = y;
    const mainW = MAIN_W;
    const mainMin = row.mainMinH ?? MAIN_H_MIN;
    const mainH = estimateAgentCardHeight(mainBase, mainW, mainMin);

    let leftH = 0;
    let leftBase: SimNode | undefined;
    if (row.left) {
      leftBase = resolveNodeBase(row.left, byId, flags);
      if (leftBase) {
        leftH = estimateAgentCardHeight(leftBase, LEFT_W, SIDE_H_MIN);
      }
    }

    const rowMaxH = Math.max(mainH, leftH);
    const mainY = rowY + (rowMaxH - mainH) / 2;
    let rowH = rowMaxH + ROW_GAP;

    if (row.left && leftBase) {
      const sideY = rowY + (rowMaxH - leftH) / 2;
      placed.push(rect(row.left, LEFT_X, sideY, LEFT_W, leftH, leftBase));
    }

    placed.push(rect(row.main, MAIN_X, mainY, mainW, mainH, mainBase));

    if (row.right) {
      const base = byId.get(row.right);
      if (base) {
        const sideH = estimateAgentCardHeight({ ...base, diagramDataStore: true }, RIGHT_W, SIDE_H_MIN);
        const sideY = rowY + (rowMaxH - sideH) / 2;
        placed.push(rect(row.right, RIGHT_X, sideY, RIGHT_W, sideH, { ...base, diagramDataStore: true }));
        rowH = Math.max(rowH, sideY - rowY + sideH + ROW_GAP);
      }
    }

    y = rowY + rowH;
    prevMainId = row.main;
  }

  const viewH = y + PAD;
  const pos = new Map(placed.map((n) => [n.id, n]));
  const edges = schema.edges.map((edge) => routeAgentEdge(edge, pos));

  return { viewW: VIEW_W, viewH, nodes: placed, edges, spineLabels, edgeCallouts: [] };
}

const BOUNDS_PAD = 22;

export type LayoutBounds = { x: number; y: number; w: number; h: number };

export function computeAgentOverviewFit(
  schema: ArchitectureSchema,
  viewportW: number,
  viewportH: number,
  padPx = 40,
  minZoom = 0.35,
  maxZoom = 1.55,
): { cx: number; cy: number; zoom: number } {
  const bounds = computeAgentLayoutBounds(schema);
  const bw = Math.max(1, bounds.w + padPx * 2);
  const bh = Math.max(1, bounds.h + padPx * 2);
  const zoom = Math.min(maxZoom, Math.max(minZoom, Math.min(viewportW / bw, viewportH / bh)));
  return {
    cx: bounds.x + bounds.w / 2,
    cy: bounds.y + bounds.h / 2,
    zoom,
  };
}

export function computeAgentLayoutBounds(schema: ArchitectureSchema): LayoutBounds {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  const bump = (x: number, y: number, pad = BOUNDS_PAD) => {
    minX = Math.min(minX, x - pad);
    minY = Math.min(minY, y - pad);
    maxX = Math.max(maxX, x + pad);
    maxY = Math.max(maxY, y + pad);
  };

  for (const node of schema.nodes) {
    bump(node.x, node.y, 4);
    bump(node.x + node.w, node.y + node.h, 4);
  }

  for (const edge of schema.edges) {
    const pts = edgePolyline(schema, edge);
    for (const p of pts) bump(p.x, p.y, 10);
  }

  if (!Number.isFinite(minX)) {
    return { x: 0, y: 0, w: schema.viewW, h: schema.viewH };
  }

  return {
    x: minX,
    y: minY,
    w: Math.max(1, maxX - minX),
    h: Math.max(1, maxY - minY),
  };
}

export function routeAgentEdge(edge: SimEdge, pos: Map<string, SimNode>): SimEdge {
  const from = pos.get(edge.from);
  const to = pos.get(edge.to);
  if (!from || !to) return edge;

  const base = { ...edge, loop: false, cx: undefined, cy: undefined, waypoints: undefined as undefined };

  switch (edge.id) {
    case 'e-human-harness':
    case 'e-harness-llm':
    case 'e-rag-enrich-llm':
    case 'e-llm-harness-call':
    case 'e-validation-tools':
    case 'e-validation-mcp':
    case 'e-mcp-tools':
    case 'e-tools-tool-ingest':
    case 'e-tool-ingest-llm-refine':
    case 'e-llm-refine-prepare':
    case 'e-prepare-result':
      return { ...base, fromPort: 'bottom', toPort: 'top' };
    case 'e-harness-state-write': {
      const writeY = from.y + from.h * 0.34;
      return {
        ...base,
        anchorFrom: { x: from.x + from.w, y: writeY },
        anchorTo: { x: to.x, y: to.y + to.h * 0.34 },
      };
    }
    case 'e-state-harness-read': {
      const readY = from.y + from.h * 0.72;
      return {
        ...base,
        anchorFrom: { x: from.x, y: readY },
        anchorTo: { x: to.x + to.w, y: to.y + to.h * 0.72 },
      };
    }
    case 'e-artifacts-tools': {
      const fy = from.y + from.h / 2;
      const ty = to.y + to.h / 2;
      return {
        ...base,
        fromPort: 'right',
        toPort: 'left',
        anchorFrom: { x: from.x + from.w, y: fy },
        anchorTo: { x: to.x, y: ty },
      };
    }
    case 'e-validation-deny': {
      const fy = from.y + from.h / 2;
      const ty = to.y + to.h / 2;
      return {
        ...base,
        fromPort: 'left',
        toPort: 'left',
        anchorFrom: { x: from.x, y: fy },
        anchorTo: { x: to.x, y: ty },
        waypoints: [{ x: LEFT_OUTER, y: fy }, { x: LEFT_OUTER, y: ty }],
      };
    }
    case 'e-llm-done': {
      const fy = from.y + from.h / 2;
      const ty = to.y + to.h / 2;
      return {
        ...base,
        fromPort: 'left',
        toPort: 'left',
        anchorFrom: { x: from.x, y: fy },
        anchorTo: { x: to.x, y: ty },
        waypoints: [{ x: LEFT_OUTER + 22, y: fy }, { x: LEFT_OUTER + 22, y: ty }],
      };
    }
    case 'e-tools-harness': {
      const fy = from.y + from.h / 2;
      const ty = to.y + to.h / 2;
      return {
        ...base,
        fromPort: 'right',
        toPort: 'right',
        anchorFrom: { x: from.x + from.w, y: fy },
        anchorTo: { x: to.x + to.w, y: ty },
        waypoints: [
          { x: BUS_RIGHT_RETURN, y: fy },
          { x: BUS_RIGHT_RETURN, y: ty },
        ],
      };
    }
    case 'e-llm-direct-prepare': {
      const fy = from.y + from.h / 2;
      const ty = to.y + to.h / 2;
      return {
        ...base,
        fromPort: 'left',
        toPort: 'left',
        anchorFrom: { x: from.x, y: fy },
        anchorTo: { x: to.x, y: ty },
        waypoints: [{ x: LEFT_OUTER + 44, y: fy }, { x: LEFT_OUTER + 44, y: ty }],
      };
    }
    case 'e-tool-fail': {
      const below = from.y + from.h + 20;
      const ty = to.y + to.h / 2;
      return {
        ...base,
        failureBranch: true,
        fromPort: 'bottom',
        toPort: 'left',
        anchorFrom: { x: from.x + from.w / 2, y: from.y + from.h },
        anchorTo: { x: to.x, y: ty },
        waypoints: [
          { x: from.x + from.w / 2, y: below },
          { x: LEFT_OUTER + 44, y: below },
          { x: LEFT_OUTER + 44, y: ty },
        ],
      };
    }
    case 'e-harness-rag-query': {
      const startX = from.x + from.w / 2;
      const startY = from.y + from.h;
      const endX = to.x + to.w / 2;
      const topY = to.y;
      const bendY = startY + 28;
      const approachY = topY - 16;
      return {
        ...base,
        fromPort: 'bottom',
        toPort: 'top',
        anchorFrom: { x: startX, y: startY },
        anchorTo: { x: endX, y: topY },
        waypoints: [
          { x: startX, y: bendY },
          { x: endX, y: bendY },
          { x: endX, y: approachY },
        ],
      };
    }
    case 'e-rag-rag-enrich': {
      const midY = from.y + from.h / 2;
      const ty = to.y + to.h / 2;
      return {
        ...base,
        fromPort: 'right',
        toPort: 'left',
        anchorFrom: { x: from.x + from.w, y: midY },
        anchorTo: { x: to.x, y: ty },
      };
    }
    default:
      return edge;
  }
}

export function layoutSchemaForRender(
  schema: ArchitectureSchema,
  flags: AgentOptionalFlags = { showRag: false, showMcp: false },
): ArchitectureSchema & {
  spineLabels: SpineLabel[];
  edgeCallouts: EdgeCalloutPlacement[];
} {
  if (schema.id !== 'agent') {
    return { ...schema, spineLabels: [], edgeCallouts: [] };
  }
  const layout = computeAgentCycleLayout(schema, flags);
  return {
    ...schema,
    viewW: layout.viewW,
    viewH: layout.viewH,
    nodes: layout.nodes,
    edges: layout.edges,
    spineLabels: layout.spineLabels,
    edgeCallouts: layout.edgeCallouts,
  };
}

export function markerOnEdge(schema: ArchitectureSchema, edgeId: string, t = 0.85) {
  const edge = schema.edges.find((e) => e.id === edgeId);
  if (!edge) return null;
  const pts = edgePolyline(schema, edge);
  if (pts.length < 2) return null;
  let total = 0;
  const seg: number[] = [];
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    seg.push(l);
    total += l;
  }
  const target = total * t;
  let acc = 0;
  for (let i = 0; i < seg.length; i++) {
    if (acc + seg[i] >= target) {
      const u = (target - acc) / seg[i];
      return {
        x: pts[i].x + (pts[i + 1].x - pts[i].x) * u,
        y: pts[i].y + (pts[i + 1].y - pts[i].y) * u,
      };
    }
    acc += seg[i];
  }
  return pts[pts.length - 1];
}

export function edgePathForLayout(schema: ArchitectureSchema, edge: SimEdge): string {
  const pos = new Map(schema.nodes.map((n) => [n.id, n]));
  const routed = routeAgentEdge(edge, pos);
  return edgePathD(schema, routed);
}
