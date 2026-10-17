import type { FundamentalsCardPanel } from './fundamentals-card-panels';

export type ProcessCompareStep = {
  labelUk: string;
  textUk: string;
};

export type ProcessCompareCard = {
  key: string;
  titleUk: string;
  subtitleUk?: string;
  teaserUk: string;
  steps: ProcessCompareStep[];
  hallmarkUk: string;
  panel: FundamentalsCardPanel;
  /** primary — великі картки порівняння; secondary — короткі уточнення */
  tier: 'primary' | 'secondary';
};

export type StudyProcessCompareBundle = {
  ariaLabel: string;
  questionUk?: string;
  cards: ProcessCompareCard[];
  footerUk?: string;
};
