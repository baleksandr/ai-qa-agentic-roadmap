import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';
import { StudyLearnerExplanationBlocks } from './StudyLearnerExplanationBlocks';
import { TOOL_CALLING_QA_LEVELS } from '../../data/study/tool-calling-qa-testing';
import {
  TOOL_CALLING_QA_CATEGORIES_BUNDLE,
  TOOL_CALLING_QA_GWT_BUNDLE,
  TOOL_CALLING_QA_GWT_NOTE_UK,
  TOOL_CALLING_QA_INTRO_UK,
} from '../../data/study/tool-calling-study-bundles';

/** §6 «Як QA це тестує?» — три рівні, шість категорій, два сценарії. */
export function StudyToolCallingQaTesting() {
  return (
    <section
      className="study-tool-calling-qa study-rag-pipeline-glossary study-teaching-cards-layout"
      aria-label="Як QA тестує tool calling"
    >
      <div className="study-rag-story-intro lesson-callout lesson-key-idea">
        <span className="lesson-callout-label">Як перевірити Tool Calling</span>
        <StudyLearnerExplanationBlocks bodyUk={TOOL_CALLING_QA_INTRO_UK} />
      </div>

      <section
        className="study-tool-calling-qa-levels study-tool-calling-qa-levels--info-only"
        aria-label="Три рівні тестування"
      >
        <ol className="study-tool-calling-qa-levels-stack">
          {TOOL_CALLING_QA_LEVELS.map((level) => (
            <li key={level.id} className="study-tool-calling-qa-level-card">
              <h5 className="study-tool-calling-qa-level-title">{level.titleUk}</h5>
              <p className="study-tool-calling-qa-level-body">{level.bodyUk}</p>
            </li>
          ))}
        </ol>
      </section>

      <StudyTeachingCardsSection bundle={TOOL_CALLING_QA_CATEGORIES_BUNDLE} />

      <div className="study-rag-story-intro lesson-callout lesson-key-idea study-tool-calling-qa-gwt-note-block">
        <StudyLearnerExplanationBlocks bodyUk={TOOL_CALLING_QA_GWT_NOTE_UK} />
      </div>

      <StudyTeachingCardsSection bundle={TOOL_CALLING_QA_GWT_BUNDLE} />
    </section>
  );
}
