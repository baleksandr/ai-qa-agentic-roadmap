import type { KeyIdeaBullet } from '../../types/lessonBlocks';
import { StudyRememberTakeaways } from './StudyRememberTakeaways';

type Props = {
  bullets: KeyIdeaBullet[];
};

/** @deprecated Використовуйте `StudyRememberTakeaways` */
export function StudyKeyIdeaBullets({ bullets }: Props) {
  return <StudyRememberTakeaways bullets={bullets} />;
}
