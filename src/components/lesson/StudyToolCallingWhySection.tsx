import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';
import { TOOL_CALLING_WHY_BUNDLE } from '../../data/study/tool-calling-study-bundles';
import { StudyLearnerExplanationBlocks } from './StudyLearnerExplanationBlocks';

/** §1 «Навіщо потрібен tool calling?» */
export function StudyToolCallingWhySection() {
  return (
    <div className="study-tool-calling-why study-rag-pipeline-glossary">
      <div className="study-rag-story-intro lesson-callout lesson-key-idea study-tc-why-accent">
        <span className="lesson-callout-label">Текст моделі не відкриває файл</span>
        <StudyLearnerExplanationBlocks
          bodyUk="Після падіння login_spec модель може написати «потрібно перевірити звіт». Щоб отримати фактичні дані зі звіту Playwright, застосунок має перевірити пропозицію й викликати інструмент."
        />
      </div>
      <StudyTeachingCardsSection bundle={TOOL_CALLING_WHY_BUNDLE} />
    </div>
  );
}
