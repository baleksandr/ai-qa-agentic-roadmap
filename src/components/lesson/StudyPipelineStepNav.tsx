import type { ChainStageDetail } from '../../data/study/rag-chain-stage-details';
import type {
  StudyTeachingConceptGroup,
  StudyTeachingCardsPresentation,
} from '../../data/study/study-teaching-card-types';
import { formatStudyCardNumber } from '../../lib/studyCardNumber';
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
  cardNumberUk?: string;
  optionalRouteStep?: boolean;
};

type Props = {
  items: StudyPipelineNavItem[];
  activeKey: string | number;
  onSelect: (key: string | number) => void;
  ariaLabel: string;
  presentation?: StudyTeachingCardsPresentation;
  conceptGroups?: StudyTeachingConceptGroup[];
  /** Префікс для вкладених карток (напр. «3» → 3.1, 3.2). */
  numberPrefix?: string;
};

function NavCard({
  item,
  index,
  total,
  activeKey,
  onSelect,
  cardNumberUk,
}: {
  item: StudyPipelineNavItem;
  index: number;
  total: number;
  activeKey: string | number;
  onSelect: (key: string | number) => void;
  cardNumberUk: string;
}) {
  const canClick = item.clickable ?? true;
  return (
    <StudyFlowStageCard
      stageLabel={item.titleUk}
      index={index}
      total={total}
      detail={item.detail ?? null}
      listTeaserUk={item.teaserUk}
      navBadgeUk={item.badgeUk}
      navActorUk={item.actorUk}
      clickable={canClick}
      active={activeKey === item.key}
      onOpen={() => canClick && onSelect(item.key)}
      layout="pipeline"
      showStepNumber={false}
      cardNumberUk={item.cardNumberUk ?? cardNumberUk}
    />
  );
}

export function StudyPipelineStepNav({
  items,
  activeKey,
  onSelect,
  ariaLabel,
  presentation = 'process',
  conceptGroups,
  numberPrefix,
}: Props) {
  const total = items.length;
  const itemByKey = new Map(items.map((it) => [it.key, it]));
  const orderedKeys =
    presentation === 'concepts' && conceptGroups?.length
      ? conceptGroups.flatMap((g) => g.stepKeys)
      : items.map((it) => it.key);

  const cardNumberForKey = (key: string | number, fallbackIndex: number) => {
    const pos = orderedKeys.indexOf(key);
    const index1 = pos >= 0 ? pos + 1 : fallbackIndex + 1;
    return formatStudyCardNumber(numberPrefix, index1);
  };

  if (presentation === 'concepts' && conceptGroups?.length) {
    return (
      <div className="study-concept-nav" aria-label={ariaLabel}>
        {conceptGroups.map((group) => (
          <section key={group.headingUk} className="study-concept-nav-group" aria-label={group.headingUk}>
            <h3 className="study-concept-nav-group-title">{group.headingUk}</h3>
            <ul className="study-rag-pipeline-steps-col study-concept-nav-group-list">
              {group.stepKeys.map((key) => {
                const item = itemByKey.get(key);
                if (!item) return null;
                const index = items.findIndex((it) => it.key === key);
                return (
                  <li key={String(key)}>
                    <NavCard
                      item={item}
                      index={index}
                      total={total}
                      activeKey={activeKey}
                      onSelect={onSelect}
                      cardNumberUk={cardNumberForKey(key, index)}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    );
  }

  return (
    <ol className="study-rag-pipeline-steps-col" aria-label={ariaLabel}>
      {items.map((item, i) => (
        <li
          key={item.key}
          className={item.optionalRouteStep ? 'study-pipeline-step-li--optional-route' : undefined}
        >
          {item.optionalRouteStep ? (
            <p className="study-pipeline-optional-route-connector muted small" role="note">
              <span className="study-pipeline-optional-route-connector-line" aria-hidden="true" />
              Лише якщо код продовжив розслідування й знову викликав модель
            </p>
          ) : null}
          <NavCard
            item={item}
            index={i}
            total={total}
            activeKey={activeKey}
            onSelect={onSelect}
            cardNumberUk={cardNumberForKey(item.key, i)}
          />
        </li>
      ))}
    </ol>
  );
}
