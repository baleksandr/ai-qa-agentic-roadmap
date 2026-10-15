import { TOPIC_BY_ID, ROADMAP_GROUPS } from '../data/topics.registry';
import type { TopicMeta } from '../types/topic';
import { TopicCard } from './TopicCard';

interface Props {
  selectedTopicId: string | null;
  onSelectTopic: (topic: TopicMeta) => void;
}

export function RoadmapView({ selectedTopicId, onSelectTopic }: Props) {
  return (
    <div className="roadmap">
      {ROADMAP_GROUPS.map((group) => (
        <section key={group.id} className="roadmap-group" data-group={group.id}>
          <header className="roadmap-group-header">
            <h2>{group.title}</h2>
            {group.subtitle && <p className="muted">{group.subtitle}</p>}
          </header>
          <div className="roadmap-flow">
            {group.topicIds.map((id, index) => {
              const topic = TOPIC_BY_ID[id];
              if (!topic) return null;
              const edge = group.flowEdges.find((e) => e.from === id);
              const showArrow = edge && group.topicIds[index + 1] === edge.to;
              return (
                <div key={id} className="roadmap-node-wrap">
                  <TopicCard
                    topic={topic}
                    selected={selectedTopicId === id}
                    onSelect={onSelectTopic}
                  />
                  {showArrow && <div className="roadmap-arrow" aria-hidden="true">↓</div>}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
