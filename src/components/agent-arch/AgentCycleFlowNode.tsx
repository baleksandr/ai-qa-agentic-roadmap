import { Handle, Position, useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { useRef, type PointerEvent as ReactPointerEvent } from 'react';
import type { AgentCycleNodeData } from '../../lib/agentCycleReactFlow';
import { ArchInteractiveActionLabel } from './ArchInteractiveActionLabel';
import { useAgentCycleSelectNode } from './agentCycleFlowContext';

const DRAG_THRESHOLD = 6;

export function AgentCycleFlowNode({ data }: NodeProps<Node<AgentCycleNodeData>>) {
  const d = data as AgentCycleNodeData;
  const { getViewport, setViewport } = useReactFlow();
  const onSelectNode = useAgentCycleSelectNode();
  const sessionRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    moved: boolean;
    lastX: number;
    lastY: number;
  } | null>(null);

  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    sessionRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      moved: false,
    };
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    const session = sessionRef.current;
    if (!session || session.pointerId !== e.pointerId) return;
    const dx = e.clientX - session.startX;
    const dy = e.clientY - session.startY;
    if (!session.moved && Math.hypot(dx, dy) >= DRAG_THRESHOLD) {
      session.moved = true;
    }
    if (!session.moved) return;
    e.preventDefault();
    const stepX = e.clientX - session.lastX;
    const stepY = e.clientY - session.lastY;
    session.lastX = e.clientX;
    session.lastY = e.clientY;
    const vp = getViewport();
    setViewport({ x: vp.x + stepX, y: vp.y + stepY, zoom: vp.zoom }, { duration: 0 });
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    const session = sessionRef.current;
    if (!session || session.pointerId !== e.pointerId) return;
    if (!session.moved) {
      onSelectNode(d.simId);
    }
    sessionRef.current = null;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div
      className={`arch-vsim-node arch-vsim-flow-node arch-vsim-flow-node-inner role-${d.role} ${d.dataStore ? 'is-data-store' : ''} ${
        d.isPicked ? 'is-picked' : ''
      } ${d.isStepActive ? 'is-step-active' : ''      } ${d.isActive && !d.isPicked ? 'active' : ''} ${
        d.isVisited ? 'visited' : ''
      } ${d.isFuture ? 'future' : ''      } ${d.sideLane ? 'is-side' : ''} ${
        d.isTransitionEndpoint ? 'is-transition-endpoint' : ''
      } ${d.isTransitionDim ? 'is-transition-dim' : ''      } ${d.optionalAccent === 'rag' ? 'is-opt-rag-on' : ''} ${
        d.optionalAccent === 'mcp' ? 'is-opt-mcp-on' : ''
      }`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectNode(d.simId);
        }
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="button"
      tabIndex={0}
      aria-pressed={d.isPicked}
      aria-label={`${d.cardTitleUk ?? d.title}. ${d.isPicked ? 'Пояснення відкрито в панелі' : 'Відкрити пояснення в панелі'}`}
      id={`arch-vnode-${d.simId}`}
    >
      <Handle id="t-top" type="target" position={Position.Top} className="arch-vsim-flow-handle" />
      <Handle id="s-top" type="source" position={Position.Top} className="arch-vsim-flow-handle" />
      <Handle id="t-bottom" type="target" position={Position.Bottom} className="arch-vsim-flow-handle" />
      <Handle id="s-bottom" type="source" position={Position.Bottom} className="arch-vsim-flow-handle" />
      <Handle id="t-left" type="target" position={Position.Left} className="arch-vsim-flow-handle" />
      <Handle id="s-left" type="source" position={Position.Left} className="arch-vsim-flow-handle" />
      <Handle id="t-right" type="target" position={Position.Right} className="arch-vsim-flow-handle" />
      <Handle id="s-right" type="source" position={Position.Right} className="arch-vsim-flow-handle" />
      {d.roleChipUk || d.optionBadgeUk ? (
        <span className="arch-vsim-node-chip-row">
          {d.roleChipUk ? <span className="arch-vsim-node-role-chip">{d.roleChipUk}</span> : null}
          {d.optionBadgeUk ? (
            <span
              className={`arch-vsim-node-opt-badge is-${d.optionalAccent ?? 'rag'}`}
              aria-label={d.optionBadgeUk === 'RAG' ? 'Блок RAG' : 'Блок MCP'}
            >
              {d.optionBadgeUk}
            </span>
          ) : null}
        </span>
      ) : null}
      {d.cardTitleEn ? (
        <span className="arch-vsim-node-title-stack">
          <span className="arch-vsim-card-en study-term-accent">{d.cardTitleEn}</span>
          <span className="arch-vsim-card-ua">{d.cardTitleUk ?? d.title}</span>
        </span>
      ) : (
        <span className="arch-vsim-node-title">{d.title}</span>
      )}
      {d.outcome ? <span className="arch-vsim-node-outcome">{d.outcome}</span> : null}
      <ArchInteractiveActionLabel kind="openExplanation" selected={d.isPicked} />
    </div>
  );
}
