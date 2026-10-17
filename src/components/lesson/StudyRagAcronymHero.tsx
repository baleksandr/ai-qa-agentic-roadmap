import { getStudyLessonHero } from '../../data/study/study-lesson-heroes';
import { StudyLessonAcronymHero } from './StudyLessonAcronymHero';

/** @deprecated Використовуйте StudyLessonAcronymHero + getStudyLessonHero */
export function StudyRagAcronymHero() {
  const hero = getStudyLessonHero('concept-03');
  if (!hero) return null;
  return <StudyLessonAcronymHero hero={hero} />;
}
