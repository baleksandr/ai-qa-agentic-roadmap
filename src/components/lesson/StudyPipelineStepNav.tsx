import type { ChainStageDetail } from '../../data/study/rag-chain-stage-details';
import { StudyFlowStageCard } from './StudyFlowStageCard';

/** Єдиний лівий список для StudyStepDetailLayout (еталон RAG / tool calling). */
export type StudyPipelineNavItem = {
  key: string | number;
  titleUk: string;
  teaserUk: string;
  detail?: ChainStageDetail | null;
  clickable?: boolean;
  badgeUk?: string;
  actorUk?: string;
};

type Props = {
  items: StudyPipelineNavItem[];
  activeKey: string | number;
  onSelect: (key: string | number) => void;
  ariaLabel: string;
};

export function StudyPipelineStepNav({ items, activeKey, onSelect, ariaLabel }: Props) {
  const total = items.length;
  return (
    <ol className="study-rag-pipeline-steps-col" aria-label={ariaLabel}>
      {items.map((item, i) => {
        const canClick = item.clickable ?? true;
        return (
          <li key={item.key}>
            <StudyFlowStageCard
              stageLabel={item.titleUk}
              index={i}
              total={total}
              detail={item.detail ?? null}
              listTeaserUk={item.teaserUk}
              navBadgeUk={item.badgeUk}
              navActorUk={item.actorUk}
              clickable={canClick}
              active={activeKey === item.key}
              onOpen={() => canClick && onSelect(item.key)}
              layout="pipeline"
            />
          </li>
        );
      })}
    </ol>
  );
}
