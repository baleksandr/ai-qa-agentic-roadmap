import { VECTOR_DATABASE_REMEMBER_THESES } from '../../data/study/vector-database-remember';
import { StudyLabeledExplanation } from './StudyLabeledExplanation';
import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';
import {
  VECTOR_DATABASE_COMPONENTS_BUNDLE,
  VECTOR_DATABASE_COMPONENTS_INTRO_UK,
  VECTOR_DATABASE_INVESTIGATION_BUNDLE,
  VECTOR_DATABASE_INVESTIGATION_INTRO_UK,
  VECTOR_DATABASE_FAILURES_BUNDLE,
  VECTOR_DATABASE_FAILURES_INTRO_UK,
  VECTOR_DATABASE_PRODUCTION_BUNDLE,
  VECTOR_DATABASE_PRODUCTION_INTRO_UK,
  VECTOR_DATABASE_LLM_CODE_BUNDLE,
  VECTOR_DATABASE_LLM_CODE_INTRO_UK,
  VECTOR_DATABASE_RUNTIME_BUNDLE,
  VECTOR_DATABASE_RUNTIME_INTRO_UK,
  VECTOR_DATABASE_WHY_BUNDLE,
} from '../../data/study/vector-database-study-bundles';

const VECTOR_DB_TEACHING_CLASS =
  'study-vector-database-teaching-cards study-memory-state-teaching-cards study-memory-state-panel-qa-pick';

export function StudyVectorDatabaseWhy() {
  return <StudyTeachingCardsSection bundle={VECTOR_DATABASE_WHY_BUNDLE} className={VECTOR_DB_TEACHING_CLASS} />;
}

export function StudyVectorDatabaseInvestigation() {
  return (
    <div className="study-vector-db-investigation">
      <p className="study-vector-db-investigation-lead study-learner-explanation">
        {VECTOR_DATABASE_INVESTIGATION_INTRO_UK}
      </p>
      <StudyTeachingCardsSection
        bundle={VECTOR_DATABASE_INVESTIGATION_BUNDLE}
        className={`${VECTOR_DB_TEACHING_CLASS} study-vector-db-investigation-cards`}
      />
    </div>
  );
}

export function StudyVectorDatabaseComponents() {
  return (
    <div className="study-vector-db-components">
      <StudyTeachingCardsSection
        bundle={VECTOR_DATABASE_COMPONENTS_BUNDLE}
        className={`${VECTOR_DB_TEACHING_CLASS} study-vector-db-components-cards`}
        compactSectionIntroUk={VECTOR_DATABASE_COMPONENTS_INTRO_UK}
      />
    </div>
  );
}

export function StudyVectorDatabaseRuntime() {
  return (
    <div className="study-vector-db-runtime">
      <StudyTeachingCardsSection
        bundle={VECTOR_DATABASE_RUNTIME_BUNDLE}
        className={`${VECTOR_DB_TEACHING_CLASS} study-vector-db-runtime-cards`}
        compactSectionIntroUk={VECTOR_DATABASE_RUNTIME_INTRO_UK}
      />
    </div>
  );
}

export function StudyVectorDatabaseLlmCode() {
  return (
    <div className="study-vector-db-llm-code">
      <StudyTeachingCardsSection
        bundle={VECTOR_DATABASE_LLM_CODE_BUNDLE}
        className={`${VECTOR_DB_TEACHING_CLASS} study-vector-db-llm-code-cards`}
        compactSectionIntroUk={VECTOR_DATABASE_LLM_CODE_INTRO_UK}
      />
    </div>
  );
}

export function StudyVectorDatabaseFailures() {
  return (
    <div className="study-vector-db-failures">
      <StudyTeachingCardsSection
        bundle={VECTOR_DATABASE_FAILURES_BUNDLE}
        className={`${VECTOR_DB_TEACHING_CLASS} study-vector-db-failures-cards study-memory-state-failure-risks study-memory-state-panel-qa-pick`}
        compactSectionIntroUk={VECTOR_DATABASE_FAILURES_INTRO_UK}
      />
    </div>
  );
}

export function StudyVectorDatabaseProduction() {
  return (
    <div className="study-vector-db-production">
      <StudyTeachingCardsSection
        bundle={VECTOR_DATABASE_PRODUCTION_BUNDLE}
        className={`${VECTOR_DB_TEACHING_CLASS} study-vector-db-production-cards study-memory-state-panel-qa-pick`}
        compactSectionIntroUk={VECTOR_DATABASE_PRODUCTION_INTRO_UK}
      />
    </div>
  );
}

export function StudyVectorDatabaseRememberInterview() {
  return (
    <aside className="lesson-callout lesson-key-idea study-remember-rich study-vector-db-remember study-memory-state-remember">
      <span className="lesson-callout-label">Запам’ятати</span>
      <div className="study-memory-state-remember-theses">
        {VECTOR_DATABASE_REMEMBER_THESES.map((thesis) => (
          <StudyLabeledExplanation
            key={thesis.termUk}
            termUk={thesis.termUk}
            explanationUk={thesis.explanationUk}
            className="study-memory-state-remember-thesis study-learner-labeled-line"
          />
        ))}
      </div>
    </aside>
  );
}
