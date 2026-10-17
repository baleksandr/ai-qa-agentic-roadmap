import type { FundamentalsCardPanel, StudyPanelTermEntry } from './fundamentals-card-panels';
import type { StudyTeachingCardPanel, StudyTeachingCardsBundle } from './study-teaching-card-types';
import { buildTeachingCardDetail, teachingPanelToFundamentals } from './study-teaching-card-types';

const EMPTY_TEACHING_PANEL: StudyTeachingCardPanel = {
  whatUk: '',
  inputUk: '',
  outputUk: '',
  linkUk: '',
  exampleUk: '',
  failureUk: '',
  testUk: '',
};

/** Картка з готовою структурованою панеллю (поняття, не плоскі поля). */
export function fundamentalsConceptStep(
  key: string,
  titleUk: string,
  teaserUk: string,
  panel: FundamentalsCardPanel,
  badge?: string,
  actorUk?: string,
): StudyTeachingCardsBundle['steps'][number] {
  return {
    key,
    titleUk,
    teaserUk,
    cardBadgeUk: badge,
    cardActorUk: actorUk,
    fundamentalsPanel: panel,
    detail: buildTeachingCardDetail(titleUk, teaserUk, EMPTY_TEACHING_PANEL, {
      cardBadgeUk: badge,
      cardActorUk: actorUk,
      terms: panel.terms,
    }),
  };
}

export function fundamentalsTeachingStep(
  key: string,
  titleUk: string,
  teaserUk: string,
  panel: StudyTeachingCardPanel,
  badge?: string,
  opts?: { omitInputOutput?: boolean; terms?: StudyPanelTermEntry[] },
): StudyTeachingCardsBundle['steps'][number] {
  const terms = opts?.terms;
  return {
    key,
    titleUk,
    teaserUk,
    cardBadgeUk: badge,
    fundamentalsPanel: teachingPanelToFundamentals(panel, { ...opts, terms }),
    detail: buildTeachingCardDetail(titleUk, teaserUk, panel, {
      cardBadgeUk: badge,
      terms,
    }),
  };
}
