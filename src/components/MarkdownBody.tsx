import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { isStudyPanelSectionLabel, reactNodeToPlainText } from '../lib/studyPanelMarkdown';

interface Props {
  markdown: string;
  /** Стильні таблиці для Study Mode (обгортка + картковий вигляд) */
  studyTables?: boolean;
  /** Мітки «Що це?», «Для QA.» тощо — колір як у термінів */
  studyPanelLabels?: boolean;
}

function studyMarkdownComponents(studyTables: boolean, studyPanelLabels: boolean): Components {
  const components: Components = {};

  if (studyTables) {
    components.table = ({ children, ...props }) => (
      <div className="study-table-wrap">
        <table className="study-markdown-table" {...props}>{children}</table>
      </div>
    );
  }

  if (studyPanelLabels) {
    components.strong = ({ children }) => {
      const text = reactNodeToPlainText(children);
      if (isStudyPanelSectionLabel(text)) {
        return <strong className="study-panel-section-label">{children}</strong>;
      }
      return <strong className="study-text-emphasis">{children}</strong>;
    };
  }

  return components;
}

export function MarkdownBody({
  markdown,
  studyTables = false,
  studyPanelLabels = false,
}: Props) {
  if (!markdown.trim()) {
    return <p className="muted">Контент ще не додано.</p>;
  }
  const components = studyMarkdownComponents(studyTables, studyPanelLabels);
  const hasComponents = Object.keys(components).length > 0;
  return (
    <div
      className={`markdown-body${studyTables ? ' markdown-body-study-tables' : ''}${studyPanelLabels ? ' markdown-body-study-panel' : ''}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={hasComponents ? components : undefined}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
