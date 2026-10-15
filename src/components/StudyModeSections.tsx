import { useCallback, useMemo, useState } from 'react';
import type { StudySection } from '../lib/studySections';
import { MarkdownBody } from './MarkdownBody';

interface Props {
  sections: StudySection[];
  /** Початково розгорнута одна секція (id) */
  initialOpenId?: string | null;
}

export function StudyModeSections({ sections, initialOpenId = null }: Props) {
  const allIds = useMemo(() => sections.map((s) => s.id), [sections]);
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const first = initialOpenId ?? sections[0]?.id;
    if (first) return new Set([first]);
    return new Set();
  });

  const expandAll = useCallback(() => setOpenIds(new Set(allIds)), [allIds]);
  const collapseAll = useCallback(() => setOpenIds(new Set()), []);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (sections.length === 0) {
    return <p className="muted">Секції Study Mode ще не структуровані для цієї теми.</p>;
  }

  return (
    <div className="study-mode">
      <div className="study-toolbar">
        <button type="button" className="study-toolbar-btn" onClick={expandAll}>
          Розгорнути всі
        </button>
        <button type="button" className="study-toolbar-btn" onClick={collapseAll}>
          Згорнути всі
        </button>
      </div>

      <div className="study-sections">
        {sections.map((section) => {
          const isOpen = openIds.has(section.id);
          return (
            <section key={section.id} className={`study-section ${isOpen ? 'open' : ''}`}>
              <button
                type="button"
                className="study-section-header"
                aria-expanded={isOpen}
                onClick={() => toggle(section.id)}
              >
                <span className="study-section-chevron" aria-hidden="true">{isOpen ? '▼' : '▶'}</span>
                <span className="study-section-title">{section.title}</span>
              </button>
              {isOpen && (
                <div className="study-section-body markdown-body">
                  <MarkdownBody markdown={section.bodyMarkdown} />
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
