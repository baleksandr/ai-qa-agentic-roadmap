import type { ArchitectureSchema, SimEdge, SimEdgePort, SimNode } from '../types/architecture-simulation';

export function getSimNode(schema: ArchitectureSchema, id: string) {
  return schema.nodes.find((n) => n.id === id);
}

export function getSimEdge(schema: ArchitectureSchema, id: string) {
  return schema.edges.find((e) => e.id === id);
}

function nodeCenter(n: SimNode) {
  return { x: n.x + n.w / 2, y: n.y + n.h / 2 };
}

function portPoint(n: SimNode, port: SimEdgePort): { x: number; y: number } {
  switch (port) {
    case 'left':
      return { x: n.x, y: n.y + n.h / 2 };
    case 'right':
      return { x: n.x + n.w, y: n.y + n.h / 2 };
    case 'top':
      return { x: n.x + n.w / 2, y: n.y };
    case 'bottom':
      return { x: n.x + n.w / 2, y: n.y + n.h };
    default:
      return nodeCenter(n);
  }
}

function autoPorts(from: SimNode, to: SimNode): { fromPort: SimEdgePort; toPort: SimEdgePort } {
  const a = nodeCenter(from);
  const b = nodeCenter(to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? { fromPort: 'right', toPort: 'left' } : { fromPort: 'left', toPort: 'right' };
  }
  return dy >= 0 ? { fromPort: 'bottom', toPort: 'top' } : { fromPort: 'top', toPort: 'bottom' };
}

export function edgePolyline(schema: ArchitectureSchema, edge: SimEdge): { x: number; y: number }[] {
  const from = getSimNode(schema, edge.from);
  const to = getSimNode(schema, edge.to);
  if (!from || !to) return [];
  const { fromPort, toPort } = edge.fromPort && edge.toPort
    ? { fromPort: edge.fromPort, toPort: edge.toPort }
    : autoPorts(from, to);
  const a = edge.anchorFrom ?? portPoint(from, fromPort);
  const b = edge.anchorTo ?? portPoint(to, toPort);
  if (edge.loop) {
    const cx = edge.cx ?? (a.x + b.x) / 2;
    const cy = edge.cy ?? Math.min(a.y, b.y) - 80;
    return [a, { x: cx, y: cy }, b];
  }
  if (edge.cx !== undefined && edge.cy !== undefined && !edge.waypoints?.length) {
    return [a, { x: edge.cx, y: edge.cy }, b];
  }
  const pts: { x: number; y: number }[] = [a];
  if (edge.waypoints?.length) pts.push(...edge.waypoints);
  pts.push(b);
  return pts;
}

export function edgePathD(schema: ArchitectureSchema, edge: SimEdge): string {
  const pts = edgePolyline(schema, edge);
  if (pts.length < 2) return '';
  if (pts.length === 3 && edge.cx !== undefined && !edge.waypoints?.length) {
    const [a, c, b] = pts;
    return `M ${a.x} ${a.y} Q ${c.x} ${c.y} ${b.x} ${b.y}`;
  }
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) d += ` L ${pts[i].x} ${pts[i].y}`;
  return d;
}

export function pointAlongPolyline(pts: { x: number; y: number }[], t: number): { x: number; y: number } {
  if (pts.length === 0) return { x: 0, y: 0 };
  if (pts.length === 1) return pts[0];
  const lengths: number[] = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    lengths.push(seg);
    total += seg;
  }
  const target = total * t;
  let acc = 0;
  for (let i = 0; i < lengths.length; i++) {
    if (acc + lengths[i] >= target) {
      const local = (target - acc) / lengths[i];
      return {
        x: pts[i].x + (pts[i + 1].x - pts[i].x) * local,
        y: pts[i].y + (pts[i + 1].y - pts[i].y) * local,
      };
    }
    acc += lengths[i];
  }
  return pts[pts.length - 1];
}

export function markerPoint(schema: ArchitectureSchema, edgeId: string, t = 0.85): { x: number; y: number } | null {
  const edge = getSimEdge(schema, edgeId);
  if (!edge) return null;
  const pts = edgePolyline(schema, edge);
  if (pts.length < 2) return null;
  return pointAlongPolyline(pts, t);
}

export function edgeLabelPoint(schema: ArchitectureSchema, edge: SimEdge, t = 0.48): { x: number; y: number } | null {
  const pts = edgePolyline(schema, edge);
  if (pts.length < 2) return null;
  return pointAlongPolyline(pts, t);
}
