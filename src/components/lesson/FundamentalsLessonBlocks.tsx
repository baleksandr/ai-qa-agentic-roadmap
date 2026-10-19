import type { LessonBlock } from '../../types/lessonBlocks';
import {
  fundamentalsShouldHideBlock,
  fundamentalsWidgetIdForSection,
} from '../../lib/fundamentalsStudyBlocks';
import { getStructuredSectionTeachingCards } from '../../data/study/study-teaching-cards.registry';
import { LessonBlockRenderer } from './LessonBlockRenderer';
import { StudyTermDefinitionCard } from './StudyTermDefinitionCard';
import { StudyFundamentalsWidget } from './StudyFundamentalsWidget';
import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';

type Props = {
  sectionId: string;
  blocks: LessonBlock[];
};

export function FundamentalsLessonBlocks({ sectionId, blocks }: Props) {
  const teaching = getStructuredSectionTeachingCards('fundamentals', sectionId);
  const autoWidgetId = fundamentalsWidgetIdForSection(sectionId);
  let widgetRendered = false;

  const visible = blocks.filter((b) => !fundamentalsShouldHideBlock(sectionId, b));

  return (
    <div className="lesson-blocks fundamentals-lesson-blocks">
      {visible.map((block, i) => {
        if (block.type === 'studyWidget') {
          widgetRendered = true;
          return <StudyFundamentalsWidget key={`w-${i}`} widgetId={block.widgetId} />;
        }
        if (block.type === 'definitionAccent') {
          return (
            <StudyTermDefinitionCard
              key={`d-${i}`}
              termUk={block.termUk}
              termEn={block.termEn}
              explanationUk={block.leadUk}
            />
          );
        }
        if (block.type === 'term') {
          return (
            <StudyTermDefinitionCard
              key={`t-${i}`}
              termUk={block.termUk}
              termEn={block.termEn}
              explanationUk={block.body}
            />
          );
        }
        return <LessonBlockRenderer key={`b-${i}`} block={block} />;
      })}
      {!widgetRendered && autoWidgetId ? (
        <StudyFundamentalsWidget key={`auto-${autoWidgetId}`} widgetId={autoWidgetId} />
      ) : null}
      {teaching ? <StudyTeachingCardsSection bundle={teaching} /> : null}
    </div>
  );
}
