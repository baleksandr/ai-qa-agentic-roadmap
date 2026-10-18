import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ARCHITECTURE_TABS, SCHEMA_BY_TAB, type ArchitectureTabId } from '../../data/architecture/registry';
import { ArchitectureCompare } from './ArchitectureCompare';
import { ArchitectureDiagram } from './ArchitectureDiagram';

const TAB_IDS = new Set(ARCHITECTURE_TABS.map((t) => t.id));

function updateScrollHints(el: HTMLDivElement | null, setEnd: (v: boolean) => void, setStart: (v: boolean) => void) {
  if (!el) return;
  const { scrollLeft, scrollWidth, clientWidth } = el;
  setEnd(scrollLeft + clientWidth < scrollWidth - 2);
  setStart(scrollLeft > 2);
}

export function ArchitectureAtlas() {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const initialTab: ArchitectureTabId =
    tabFromUrl && TAB_IDS.has(tabFromUrl as ArchitectureTabId)
      ? (tabFromUrl as ArchitectureTabId)
      : 'concept-layers';

  const [tab, setTab] = useState<ArchitectureTabId>(initialTab);
  const [diagramEpoch, setDiagramEpoch] = useState(0);
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const [scrollEnd, setScrollEnd] = useState(false);
  const [scrollStart, setScrollStart] = useState(false);

  useEffect(() => {
    if (tabFromUrl && TAB_IDS.has(tabFromUrl as ArchitectureTabId)) {
      setTab(tabFromUrl as ArchitectureTabId);
    }
  }, [tabFromUrl]);

  const refreshScrollHints = useCallback(() => {
    updateScrollHints(tabsScrollRef.current, setScrollEnd, setScrollStart);
  }, []);

  useEffect(() => {
    refreshScrollHints();
    const el = tabsScrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(refreshScrollHints);
    ro.observe(el);
    return () => ro.disconnect();
  }, [refreshScrollHints]);

  const selectTab = useCallback((id: ArchitectureTabId) => {
    setTab(id);
    if (id !== 'compare') {
      setDiagramEpoch((e) => e + 1);
    }
  }, []);

  const onTabKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
      const last = ARCHITECTURE_TABS.length - 1;
      let next = index;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next = index >= last ? 0 : index + 1;
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        next = index <= 0 ? last : index - 1;
      } else if (e.key === 'Home') {
        e.preventDefault();
        next = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        next = last;
      } else {
        return;
      }
      const target = ARCHITECTURE_TABS[next];
      selectTab(target.id);
      const btn = tabsScrollRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next];
      btn?.focus();
    },
    [selectTab],
  );

  const schema = tab !== 'compare' ? SCHEMA_BY_TAB[tab] : null;
  const tabFootnoteUk =
    tab === 'concept-layers' ? schema?.conceptLayers?.tabFootnoteUk?.trim() : '';

  return (
    <div className="arch-atlas">
      <div
        className={`arch-atlas-tabs-wrap ${scrollEnd ? 'has-scroll-end' : ''} ${scrollStart ? 'has-scroll-start' : ''}`}
      >
        <nav
          className="arch-atlas-tabs"
          aria-label="Схеми архітектури"
          role="tablist"
        >
          <div
            ref={tabsScrollRef}
            className="arch-atlas-tabs-scroll"
            onScroll={refreshScrollHints}
          >
            {ARCHITECTURE_TABS.map((t, index) => {
              const selected = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  id={`arch-tab-${t.id}`}
                  aria-selected={selected}
                  aria-controls={`arch-tabpanel-${t.id}`}
                  tabIndex={selected ? 0 : -1}
                  className={`arch-atlas-tab ${selected ? 'is-active' : ''}`}
                  onClick={() => selectTab(t.id)}
                  onKeyDown={(e) => onTabKeyDown(e, index)}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </nav>
        {tabFootnoteUk ? (
          <p className="arch-atlas-tab-footnote muted small">{tabFootnoteUk}</p>
        ) : null}
      </div>

      <div
        id={`arch-tabpanel-${tab}`}
        role="tabpanel"
        aria-labelledby={`arch-tab-${tab}`}
        className="arch-atlas-tabpanel"
      >
        {tab === 'compare' ? (
          <ArchitectureCompare />
        ) : schema ? (
          <ArchitectureDiagram key={`${schema.id}-${diagramEpoch}`} schema={schema} />
        ) : null}
      </div>
    </div>
  );
}
