import { isStudyReadyForLearning } from '../data/study/study-ready-for-learning';

/** Клас зони шапки / outcomes з Neon HUD (не на всю сторінку). */
export const STUDY_NEON_HUD_HERO_ZONE_CLASS = 'study-neon-hud-hero-zone';

export function studyNeonHudHeroZoneClassName(topicId: string): string {
  return isStudyReadyForLearning(topicId) ? STUDY_NEON_HUD_HERO_ZONE_CLASS : '';
}

/** @deprecated Не застосовуйте на корені сторінки — лише {@link studyNeonHudHeroZoneClassName}. */
export function studyNeonHudThemeClassName(_topicId: string): string {
  return '';
}
