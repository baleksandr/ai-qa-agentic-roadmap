import { useCallback, useMemo, useSyncExternalStore } from 'react';
import type { LearningStatus, TopicKind } from '../types/topic';
import { TOPICS } from '../data/topics.registry';

const STORAGE_KEY = 'ai-qa-agentic-roadmap-learning-v2';
const LEGACY_KEY = 'ai-qa-agentic-roadmap-progress-v1';

type LearningMap = Record<string, LearningStatus>;

let cache: LearningMap | null = null;
const listeners = new Set<() => void>();

function migrateLegacy(raw: Record<string, string>): LearningMap {
  const next: LearningMap = {};
  for (const [id, state] of Object.entries(raw)) {
    if (state === 'studying') next[id] = 'in_progress';
    else if (state === 'can_explain' || state === 'can_implement') next[id] = 'studied';
    else next[id] = 'not_studied';
  }
  return next;
}

function readStorage(): LearningMap {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      cache = JSON.parse(raw) as LearningMap;
      return cache;
    }
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      cache = migrateLegacy(JSON.parse(legacy) as Record<string, string>);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
      return cache;
    }
    cache = {};
  } catch {
    cache = {};
  }
  return cache;
}

function writeStorage(next: LearningMap) {
  cache = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useProgress() {
  const map = useSyncExternalStore(subscribe, readStorage, readStorage);

  const setProgress = useCallback((topicId: string, state: LearningStatus) => {
    const next = { ...readStorage(), [topicId]: state };
    writeStorage(next);
  }, []);

  const getProgress = useCallback(
    (topicId: string): LearningStatus => map[topicId] ?? 'not_studied',
    [map],
  );

  const summary = useMemo(() => {
    const byKind = (kind: TopicKind) => TOPICS.filter((t) => t.kind === kind);
    const ids = (kind: TopicKind) => byKind(kind).map((t) => t.id);

    const countFor = (topicIds: string[], state: LearningStatus) =>
      topicIds.filter((id) => (map[id] ?? 'not_studied') === state).length;

    const fundamentalsIds = ids('fundamentals');
    const conceptIds = ids('concept');
    const labIds = ids('lab');

    return {
      fundamentals: {
        total: fundamentalsIds.length,
        studied: countFor(fundamentalsIds, 'studied'),
        inProgress: countFor(fundamentalsIds, 'in_progress'),
      },
      concepts: {
        total: conceptIds.length,
        studied: countFor(conceptIds, 'studied'),
        inProgress: countFor(conceptIds, 'in_progress'),
      },
      labs: {
        total: labIds.length,
        studied: countFor(labIds, 'studied'),
        inProgress: countFor(labIds, 'in_progress'),
      },
    };
  }, [map]);

  return { map, setProgress, getProgress, summary };
}
