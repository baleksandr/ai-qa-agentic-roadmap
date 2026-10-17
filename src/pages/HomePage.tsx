import { useCallback, useState } from 'react';
import type { LearningMapViewFilter } from '../data/learning-map.registry';
import { Link } from 'react-router-dom';
import { CompactProgress } from '../components/CompactProgress';
import { LearningMapView } from '../components/LearningMapView';
import { SiteNav } from '../components/SiteNav';
import { TopicSearch } from '../components/TopicSearch';
import { TopicSidePanel } from '../components/TopicSidePanel';
import { TOPIC_BY_ID } from '../data/topics.registry';

export function HomePage() {
  const [mapViewFilter, setMapViewFilter] = useState<LearningMapViewFilter>('all');
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

      <div className="home-map-framing">
        <div className="home-map-framing-grid">
          <article className="home-map-framing-card home-map-framing-card--theory">
            <p className="home-map-framing-kicker">Теорія</p>
            <p className="home-map-framing-text">
              <strong>20 концепцій</strong> агентного ШІ — повний розділ PART II V10, згруповані на карті за логікою
              навчання (не окремі «короткі картки» з огляду курсу).
            </p>
            <p className="home-map-framing-note muted">
              <span className="home-map-framing-ready-legend" aria-hidden="true">✓</span>
              RAG і Tool Calling — повні уроки готові для навчання.
            </p>
          </article>
          <article className="home-map-framing-card home-map-framing-card--practice">
            <p className="home-map-framing-kicker">Практика</p>
            <p className="home-map-framing-text">
              <strong>10 кроків</strong> створення QA Regression Investigation Agent (Lab 0–9).
            </p>
            <p className="home-map-framing-note muted">
              <strong>Основи</strong> і <strong>довідник</strong> — окремі вузли; довідник не входить у лічильник
              прогресу.
            </p>
          </article>
        </div>
        <div className="home-map-filter home-map-filter--segmented" role="tablist" aria-label="Фільтр маршруту на карті">
          {(
            [
              { id: 'all' as const, label: 'Увесь маршрут' },
              { id: 'concepts' as const, label: '20 концепцій' },
              { id: 'practice' as const, label: 'Практика' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={mapViewFilter === tab.id}
              className={`home-map-filter-btn${mapViewFilter === tab.id ? ' is-active' : ''}`}
              onClick={() => setMapViewFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <LearningMapView
        viewFilter={mapViewFilter}
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
