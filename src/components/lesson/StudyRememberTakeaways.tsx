import type { KeyIdeaBullet } from '../../types/lessonBlocks';
import { parseLessonBold } from './lessonRichText';
import { StudyTermAccent } from './StudyTermAccent';

type Props = {
  bullets?: KeyIdeaBullet[];
  /** Кілька абзаців (\n\n) трактуються як окремі висновки в одному блоці. */
  text?: string;
};

function bulletsFromText(text: string): KeyIdeaBullet[] {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((bodyUk) => ({ bodyUk }));
}

function TakeawayLine({ item }: { item: KeyIdeaBullet }) {
  return (
    <>
      {item.termUk ? (
        <>
          <StudyTermAccent>{item.termUk}</StudyTermAccent>
          {' '}
        </>
      ) : null}
      <span className="study-learner-explanation">{parseLessonBold(item.bodyUk)}</span>
    </>
  );
}

/** Компактний блок висновків «Запам’ятати» (без маркерів і внутрішніх рисок). */
export function StudyRememberTakeaways({ bullets, text }: Props) {
  const items = bullets?.length ? bullets : bulletsFromText(text ?? '');
  if (items.length === 0) return null;

  if (items.length === 1) {
    return (
      <p className="study-remember-takeaways-single study-learner-explanation">
        <TakeawayLine item={items[0]} />
      </p>
    );
  }

  return (
    <div className="study-remember-takeaways" role="list">
      {items.map((item, i) => (
        <p key={i} className="study-remember-takeaways-item study-learner-explanation" role="listitem">
          <TakeawayLine item={item} />
        </p>
      ))}
    </div>
  );
}
