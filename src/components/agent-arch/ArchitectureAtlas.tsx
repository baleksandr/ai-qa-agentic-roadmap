import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ARCHITECTURE_TABS, SCHEMA_BY_TAB, type ArchitectureTabId } from '../../data/architecture/registry';
import { ArchitectureCompare } from './ArchitectureCompare';
import { ArchitectureDiagram } from './ArchitectureDiagram';

const TAB_IDS = new Set(ARCHITECTURE_TABS.map((t) => t.id));

export function ArchitectureAtlas() {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const initialTab: ArchitectureTabId =
    tabFromUrl && TAB_IDS.has(tabFromUrl as ArchitectureTabId) ? (tabFromUrl as ArchitectureTabId) : 'agent';

  const [tab, setTab] = useState<ArchitectureTabId>(initialTab);
  const [diagramEpoch, setDiagramEpoch] = useState(0);

  useEffect(() => {
    if (tabFromUrl && TAB_IDS.has(tabFromUrl as ArchitectureTabId)) {
      setTab(tabFromUrl as ArchitectureTabId);
    }
  }, [tabFromUrl]);

  const selectTab = useCallback((id: ArchitectureTabId) => {
    setTab(id);
    if (id !== 'compare') {
      setDiagramEpoch((e) => e + 1);
    }
  }, []);

  const schema = tab !== 'compare' ? SCHEMA_BY_TAB[tab] : null;

  return (
    <div className="arch-atlas">
      <nav className="arch-atlas-tabs" aria-label="Схеми архітектури">
        {ARCHITECTURE_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`arch-atlas-tab ${tab === t.id ? 'active' : ''}`}
            aria-current={tab === t.id ? 'page' : undefined}
            onClick={() => selectTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'compare' ? (
        <ArchitectureCompare />
      ) : schema ? (
        <ArchitectureDiagram key={`${schema.id}-${diagramEpoch}`} schema={schema} />
      ) : null}
    </div>
  );
}
