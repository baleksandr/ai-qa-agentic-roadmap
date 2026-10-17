type Props = {
  labelUk: string;
  textUk: string;
};

/** Пояснення «як користуватися уроком» під блоком outcomes — зеленувата картка. */
export function StudyOutcomesLessonHint({ labelUk, textUk }: Props) {
  return (
    <aside className="lesson-callout lesson-key-idea study-outcomes-lesson-hint">
      <span className="study-outcomes-lesson-hint-label">{labelUk}</span>
      <span className="study-outcomes-lesson-hint-text">{textUk}</span>
    </aside>
  );
}
