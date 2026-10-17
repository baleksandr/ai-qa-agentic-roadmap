import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'ai-qa-agentic-roadmap-self-check-v1';

export type SelfCheckMark = 'ok' | 'repeat';

type DeckState = Record<string, SelfCheckMark>;

type Store = Record<string, DeckState>;

let cache: Store | null = null;
const listeners = new Set<() => void>();

function readStorage(): Store {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    cache = raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    cache = {};
  }
  return cache;
}

function writeStorage(next: Store) {
  cache = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Локальні позначки «Можу пояснити / Треба повторити» — не впливають на прогрес теми. */
export function useStudySelfCheck(deckId: string) {
  const store = useSyncExternalStore(subscribe, readStorage, readStorage);

  const getMark = useCallback(
    (questionId: string): SelfCheckMark | null => store[deckId]?.[questionId] ?? null,
    [store, deckId],
  );

  const setMark = useCallback(
    (questionId: string, mark: SelfCheckMark | null) => {
      const all = { ...readStorage() };
      const deck = { ...(all[deckId] ?? {}) };
      if (mark === null) {
        delete deck[questionId];
      } else {
        deck[questionId] = mark;
      }
      if (Object.keys(deck).length === 0) {
        delete all[deckId];
      } else {
        all[deckId] = deck;
      }
      writeStorage(all);
    },
    [deckId],
  );

  return { getMark, setMark };
}
