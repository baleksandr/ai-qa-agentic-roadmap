import { BaseEdge, type EdgeProps } from '@xyflow/react';
import type { AgentCycleEdgeData } from '../../lib/agentCycleReactFlow';

export function AgentCycleFlowEdge({
  id,
  data,
  style,
  markerEnd,
  label,
  labelStyle,
  labelBgStyle,
  labelBgPadding,
  labelBgBorderRadius,
}: EdgeProps) {
  const edgeData = data as AgentCycleEdgeData | undefined;
  const path = edgeData?.pathD ?? '';

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        style={style}
        markerEnd={markerEnd}
        label={label}
        labelStyle={labelStyle}
        labelBgStyle={labelBgStyle}
        labelBgPadding={labelBgPadding}
        labelBgBorderRadius={labelBgBorderRadius}
        interactionWidth={18}
      />
      {edgeData?.showMarker && edgeData.markerX !== undefined && edgeData.markerY !== undefined ? (
        <circle
          className="arch-sim-marker"
          cx={edgeData.markerX}
          cy={edgeData.markerY}
          r={7}
          pointerEvents="none"
        />
      ) : null}
    </>
  );
}
