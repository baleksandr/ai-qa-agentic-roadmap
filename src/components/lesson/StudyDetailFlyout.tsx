import { useEffect } from 'react';
import { MarkdownBody } from '../MarkdownBody';

type Props = {
  open: boolean;
  title: string;
  markdown: string;
  onClose: () => void;
};

export function StudyDetailFlyout({ open, title, markdown, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="study-flyout-backdrop" role="presentation" onClick={onClose}>
      <aside
        className="study-flyout-panel"
        role="dialog"
        aria-labelledby="study-flyout-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="study-flyout-header">
          <h3 id="study-flyout-title" className="study-flyout-title">{title}</h3>
          <button type="button" className="study-flyout-close" onClick={onClose} aria-label="Закрити">
            ×
          </button>
        </header>
        <div className="study-flyout-body markdown-body">
          <MarkdownBody markdown={markdown} studyTables studyPanelLabels />
        </div>
      </aside>
    </div>
  );
}
