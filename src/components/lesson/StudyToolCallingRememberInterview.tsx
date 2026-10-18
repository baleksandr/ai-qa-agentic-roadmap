import { StudyAfterInteractiveSummary } from './StudyAfterInteractiveSummary';
import { TOOL_CALLING_REMEMBER_SUMMARY } from '../../data/study/tool-calling-remember';

/** §8 «Запам’ятати» — чотири статичні картки без таблиці markdown. */
export function StudyToolCallingRememberInterview() {
  return (
    <aside className="lesson-callout lesson-key-idea study-remember-rich study-tool-calling-remember">
      <span className="lesson-callout-label">Запам’ятати</span>
      <div className="study-tool-calling-remember-cards">
        <StudyAfterInteractiveSummary summary={TOOL_CALLING_REMEMBER_SUMMARY} />
      </div>
    </aside>
  );
}
