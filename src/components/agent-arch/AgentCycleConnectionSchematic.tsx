type Props = {
  fromUk: string;
  actionUk: string;
  toUk: string;
};

export function AgentCycleConnectionSchematic({ fromUk, actionUk, toUk }: Props) {
  return (
    <div className="arch-agent-conn-schematic" aria-label={`${fromUk} — ${actionUk} — ${toUk}`}>
      <span className="arch-agent-conn-schematic-node">{fromUk}</span>
      <span className="arch-agent-conn-schematic-arrow" aria-hidden="true">→</span>
      <span className="arch-agent-conn-schematic-action">{actionUk}</span>
      <span className="arch-agent-conn-schematic-arrow" aria-hidden="true">→</span>
      <span className="arch-agent-conn-schematic-node">{toUk}</span>
    </div>
  );
}
