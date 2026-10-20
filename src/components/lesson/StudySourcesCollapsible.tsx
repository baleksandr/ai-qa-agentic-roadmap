import { Link } from 'react-router-dom';
import { getStudyLessonSources, type StudyLessonSourceEntry } from '../../data/study/study-lesson-sources';
import { MarkdownBody } from '../MarkdownBody';

type Props = {
  topicId?: string;
  /** Legacy markdown усередині `:::study-sources` (лише якщо немає реєстру). */
  markdown?: string;
};

function kindLabel(kind: StudyLessonSourceEntry['kind']): string | null {
  if (kind === 'book') return 'Книга';
  if (kind === 'teachingExample') return 'Навчальний приклад';
  if (kind === 'inApp') return 'Матеріал курсу';
  return null;
}

function SourceCard({ entry }: { entry: StudyLessonSourceEntry }) {
  const badge = kindLabel(entry.kind);
  const isExternal = entry.href?.startsWith('http');
  return (
    <li className="study-lesson-source-card">
      {badge ? (
        <p className="study-lesson-source-kind" aria-hidden="true">{badge}</p>
      ) : null}
      <h3 className="study-lesson-source-title">
        {entry.href?.trim() && isExternal ? (
          <a
            className="study-lesson-source-title-link"
            href={entry.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {entry.titleUk}
          </a>
        ) : (
          entry.titleUk
        )}
      </h3>
      {entry.attributionUk?.trim() ? (
        <p className="study-lesson-source-attribution muted small">{entry.attributionUk}</p>
      ) : null}
      {entry.href?.trim() && !isExternal ? (
        <p className="study-lesson-source-link-wrap">
          <Link className="study-lesson-source-link" to={entry.href}>
            Відкрити в курсі
          </Link>
        </p>
      ) : null}
      {entry.href?.trim() && isExternal ? (
        <p className="study-lesson-source-link-wrap muted small study-lesson-source-url">{entry.href}</p>
      ) : null}
      <p className="study-lesson-source-verify study-learner-explanation">{entry.verifyUk}</p>
    </li>
  );
}

function isLegacySourcesNoise(markdown: string): boolean {
  const stripped = markdown
    .replace(/^:::study-sources\s*$/gm, '')
    .replace(/^:::study-sources-end\s*$/gm, '')
    .trim();
  return stripped.length === 0;
}

export function StudySourcesCollapsible({ topicId, markdown = '' }: Props) {
  const registry = topicId ? getStudyLessonSources(topicId) : [];
  const legacy = markdown.trim();
  const legacyUsable = legacy.length > 0 && !isLegacySourcesNoise(legacy);

  if (registry.length === 0 && !legacyUsable) return null;

  return (
    <details className="study-sources-collapsible">
      <summary>Джерела та примітки</summary>
      <div className="study-sources-body">
        {registry.length > 0 ? (
          <ul className="study-lesson-sources-list">
            {registry.map((entry) => (
              <SourceCard key={entry.id} entry={entry} />
            ))}
          </ul>
        ) : legacyUsable ? (
          <MarkdownBody markdown={legacy} studyTables />
        ) : null}
      </div>
    </details>
  );
}
