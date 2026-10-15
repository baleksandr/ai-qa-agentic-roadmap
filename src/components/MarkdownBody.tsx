import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  markdown: string;
}

export function MarkdownBody({ markdown }: Props) {
  if (!markdown.trim()) {
    return <p className="muted">Контент ще не додано.</p>;
  }
  return (
    <div className="markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}
