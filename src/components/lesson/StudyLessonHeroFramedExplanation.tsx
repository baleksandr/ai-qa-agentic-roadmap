type Props = {
  textUk: string;
  className?: string;
};

/** Коротке пояснення в шапці Study Mode: темна рамка, помірна блакитна підсвітка. */
export function StudyLessonHeroFramedExplanation({ textUk, className = '' }: Props) {
  const trimmed = textUk.trim();
  if (!trimmed) return null;
  return (
    <p
      className={`study-lesson-hero-framed-explanation study-learner-explanation${className ? ` ${className}` : ''}`}
    >
      {trimmed}
    </p>
  );
}
