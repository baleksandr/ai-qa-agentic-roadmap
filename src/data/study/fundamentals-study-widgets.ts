import { FUNDAMENTALS_TRAINING_INFERENCE_COMPARE } from './fundamentals-training-inference-compare';
import type { StudyProcessCompareBundle } from './study-process-compare-types';

const PROCESS_COMPARE: Record<string, StudyProcessCompareBundle> = {
  'glossary-05-training-inference': FUNDAMENTALS_TRAINING_INFERENCE_COMPARE,
};

export function getFundamentalsProcessCompare(widgetId: string): StudyProcessCompareBundle | null {
  return PROCESS_COMPARE[widgetId] ?? null;
}
