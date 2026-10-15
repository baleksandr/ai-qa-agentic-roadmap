import { useCallback, useMemo, useState } from 'react';
import type { StructuredStudy } from '../../types/lessonBlocks';
import { LessonBlocks } from './LessonBlockRenderer';
import { ProgressPicker } from '../ProgressPicker';
import type { LearningStatus } from '../../types/topic';
import { LEARNING_LABELS } from '../../types/topic';

interface Props {
  study: StructuredStudy;
  learning: LearningStatus;
  onLearningChange: (s: LearningStatus) => void;
}

export function StructuredStudyView({ study, learning, onLearningChange }: Props) {
  const sectionIds = useMemo(() => study.sections.map((s) => s.id), [study.sections]);
  const [openIds, setOpenIds] = useState<Set<string>>(() =>
    study.sections[0] ? new Set([study.sections[0].id]) : new Set(),
  );
  const [activeNavId, setActiveNavId] = useState(study.sections[0]?.id ?? '');

  const expandAll = useCallback(() => setOpenIds(new Set(sectionIds)), [sectionIds]);
  const collapseAll = useCallback(() => setOpenIds(new Set()), []);

  const toggle = (id: string) => {
    setActiveNavId(id);
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const scrollToSection = (id: string) => {
    setActiveNavId(id);
    setOpenIds((prev) => new Set(prev).add(id));
    document.getElementById(`study-section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="structured-study-layout">
      <nav className="study-col-nav" aria-label="Підтеми розділу">
        <p className="study-col-nav-title">У цьому розділі</p>
        <ul>
          {study.sections.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className={activeNavId === s.id ? 'active' : ''}
                onClick={() => scrollToSection(s.id)}
              >
                {s.title}
              </button>
            </li>
          ))}
        </ul>
        <p className="study-source-note small muted">
          Архів для звірки: <code>{study.sourceArchivePath}</code>
        </p>
      </nav>

      <div className="study-col-main">
        <header className="study-chapter-header">
          <h2 className="study-chapter-title">{study.chapterTitle}</h2>
          {study.chapterSubtitle && <p className="muted study-chapter-sub">{study.chapterSubtitle}</p>}
        </header>

        <div className="study-toolbar">
          <button type="button" className="study-toolbar-btn" onClick={expandAll}>
            Розгорнути всі
          </button>
          <button type="button" className="study-toolbar-btn" onClick={collapseAll}>
            Згорнути всі
          </button>
        </div>

        <div className="study-sections">
          {study.sections.map((section) => {
            const isOpen = openIds.has(section.id);
            return (
              <section
                key={section.id}
                id={`study-section-${section.id}`}
                className={`study-section ${isOpen ? 'open' : ''}`}
              >
                <button
                  type="button"
                  className="study-section-header"
                  aria-expanded={isOpen}
                  onClick={() => toggle(section.id)}
                >
                  <span className="study-section-chevron" aria-hidden="true">
                    {isOpen ? '▼' : '▶'}
                  </span>
                  <span className="study-section-title">{section.title}</span>
                </button>
                {isOpen && (
                  <div className="study-section-body">
                    <LessonBlocks blocks={section.blocks} />
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>

      <aside className="study-col-aside" aria-label="Прогрес і підказки">
        <div className="study-aside-card">
          <p className="study-aside-label">Ваш прогрес</p>
          <p className={`badge progress-${learning}`}>{LEARNING_LABELS[learning]}</p>
          <ProgressPicker value={learning} onChange={onLearningChange} />
        </div>
        <div className="study-aside-card muted small">
          <p className="study-aside-label">Підказка</p>
          <p>Йдіть по номерах 1 → 20. У Review Mode — лише короткий індекс без дублювання тексту.</p>
        </div>
      </aside>
    </div>
  );
}
