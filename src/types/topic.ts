export type MigrationStatus = 'complete' | 'partial' | 'not_migrated';

/** Прогрес вивчення (незалежно від migrationStatus) */
export type LearningStatus = 'not_studied' | 'in_progress' | 'studied';

/** @deprecated використовуйте LearningStatus */
export type ProgressState = LearningStatus;

export type TopicKind = 'fundamentals' | 'concept' | 'reference' | 'lab';

export type TopicGroupId =
  | 'fundamentals'
  | 'agent-core'
  | 'knowledge'
  | 'control-quality'
  | 'advanced-agents'
  | 'production'
  | 'reference'
  | 'qa-lab';

export interface TopicMeta {
  id: string;
  kind: TopicKind;
  /** Оригінальний номер Concept (1–20) або Lab (0–9), якщо є */
  sourceNumber?: number;
  title: string;
  shortTitle: string;
  groupId: TopicGroupId;
  /** Рекомендований порядок вивчення (1 = перший) */
  learningOrder: number;
  /** Стабільні id попередніх тем */
  prerequisites: string[];
  contentPath: string;
  migrationStatus: MigrationStatus;
  migrationNotes?: string;
  /** Якір у DOCX — заповнюється після інвентаризації */
  docxSection?: string;
  relatedTopicIds: string[];
}

export interface RoadmapGroup {
  id: TopicGroupId;
  title: string;
  subtitle?: string;
  topicIds: string[];
  /** Візуальні зв’язки між сусідніми темами в групі (для стрілок на карті) */
  flowEdges: Array<{ from: string; to: string }>;
}

export const LEARNING_LABELS: Record<LearningStatus, string> = {
  not_studied: 'Не вивчено',
  in_progress: 'У процесі',
  studied: 'Вивчено',
};

export const PROGRESS_LABELS: Record<LearningStatus, string> = LEARNING_LABELS;

export const MIGRATION_LABELS: Record<MigrationStatus, string> = {
  complete: 'Перенесено',
  partial: 'Частково',
  not_migrated: 'Ще не перенесено',
};
