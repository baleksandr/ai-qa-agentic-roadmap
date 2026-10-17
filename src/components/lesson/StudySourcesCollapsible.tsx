import { MarkdownBody } from '../MarkdownBody';

type Props = {
  markdown: string;
};

export function StudySourcesCollapsible({ markdown }: Props) {
  if (!markdown.trim()) return null;
  return (
    <details className="study-sources-collapsible">
      <summary>Джерела та примітки</summary>
      <div className="study-sources-body">
        <MarkdownBody markdown={markdown} studyTables />
      </div>
    </details>
  );
}
