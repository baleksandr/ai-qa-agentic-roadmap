import { useMemo, useState } from 'react';
import { getAllMapTopicIds, getMapLabel } from '../data/learning-map.registry';
import { TOPIC_BY_ID } from '../data/topics.registry';

interface Props {
  onPickTopic?: (topicId: string) => void;
}

export function TopicSearch({ onPickTopic }: Props) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return getAllMapTopicIds()
      .map((id) => {
        const topic = TOPIC_BY_ID[id];
        const label = getMapLabel(id);
        return { id, label, topic };
      })
      .filter(
        (r) =>
          r.topic &&
          (r.label.toLowerCase().includes(q) ||
            r.topic.shortTitle.toLowerCase().includes(q) ||
            r.id.includes(q)),
      )
      .slice(0, 12);
  }, [query]);

  return (
    <div className="topic-search">
      <label className="sr-only" htmlFor="topic-search-input">
        Пошук теми
      </label>
      <input
        id="topic-search-input"
        type="search"
        placeholder="Знайти тему на карті…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoComplete="off"
      />
      {query && (
        <ul className="search-results">
          {results.length === 0 && <li className="muted">Нічого не знайдено</li>}
          {results.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                className="search-result-btn"
                onClick={() => {
                  onPickTopic?.(r.id);
                  setQuery('');
                }}
              >
                {r.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
