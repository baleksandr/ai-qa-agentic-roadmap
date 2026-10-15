import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { CompactProgress } from '../components/CompactProgress';
import { LearningMapView } from '../components/LearningMapView';
import { SiteNav } from '../components/SiteNav';
import { TopicSearch } from '../components/TopicSearch';
import { TopicSidePanel } from '../components/TopicSidePanel';
import { TOPIC_BY_ID } from '../data/topics.registry';

export function HomePage() {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [highlightTopicId, setHighlightTopicId] = useState<string | null>(null);
  const selectedTopic = selectedTopicId ? TOPIC_BY_ID[selectedTopicId] : undefined;

  const focusTopicOnMap = useCallback((topicId: string) => {
    setHighlightTopicId(topicId);
    setSelectedTopicId(topicId);
    requestAnimationFrame(() => {
      document.getElementById(`map-node-${topicId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
    window.setTimeout(() => setHighlightTopicId(null), 2500);
  }, []);

  return (
    <div className={`page home-page ${selectedTopic ? 'home-has-panel' : ''}`}>
      <header className="home-top">
        <div className="home-top-row">
          <h1 className="home-title">Agentic AI for QA</h1>
          <SiteNav />
        </div>
        <div className="home-top-tools">
          <TopicSearch onPickTopic={focusTopicOnMap} />
          <Link className="home-list-link" to="/route">Список тем</Link>
        </div>
        <CompactProgress />
      </header>

      <LearningMapView
        selectedTopicId={selectedTopicId}
        highlightTopicId={highlightTopicId}
        onSelectTopic={(t) => setSelectedTopicId(t.id)}
      />

      {selectedTopic && (
        <div className="home-panel-layer">
          <button
            type="button"
            className="home-panel-backdrop"
            aria-label="Закрити панель"
            onClick={() => setSelectedTopicId(null)}
          />
          <TopicSidePanel topic={selectedTopic} onClose={() => setSelectedTopicId(null)} />
        </div>
      )}
    </div>
  );
}
