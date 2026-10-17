import { splitStudyKeyPhraseMarkdown } from '../../lib/studyKeyPhraseMarkdown';
import { MarkdownBody } from '../MarkdownBody';
import { StudyLearnerPhraseParagraphs } from './StudyLearnerPhraseParagraphs';

type Props = {
  markdown: string;
  studyTables?: boolean;
  studyPanelLabels?: boolean;
};

/** Markdown Study Mode + явні блоки ключових фраз (той самий UI, що `phraseParagraphs` у JSON). */
export function StudyMarkdownSegments({
  markdown,
  studyTables = false,
  studyPanelLabels = false,
}: Props) {
  const segments = splitStudyKeyPhraseMarkdown(markdown);
  if (!segments.length) return null;

  return (
    <>
      {segments.map((seg, i) => {
        if (seg.kind === 'keyPhrase') {
          return <StudyLearnerPhraseParagraphs key={`kp-${i}`} items={seg.items} />;
        }
        return (
          <MarkdownBody
            key={`md-${i}`}
            markdown={seg.text}
            studyTables={studyTables}
            studyPanelLabels={studyPanelLabels}
          />
        );
      })}
    </>
  );
}
