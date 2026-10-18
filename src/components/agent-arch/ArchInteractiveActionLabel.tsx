export type ArchInteractiveActionKind = 'showLink' | 'openExplanation' | 'navigateLesson';

export function getArchInteractiveActionText(
  kind: ArchInteractiveActionKind,
  selected: boolean,
): string {
  switch (kind) {
    case 'showLink':
      return selected ? 'Зв’язок показано ✓' : 'Показати зв’язок →';
    case 'openExplanation':
      return selected ? 'Пояснення відкрито ✓' : 'Відкрити пояснення →';
    case 'navigateLesson':
      return 'Перейти до уроку ↗';
    default:
      return '';
  }
}

type Props = {
  kind: ArchInteractiveActionKind;
  selected?: boolean;
  className?: string;
};

export function ArchInteractiveActionLabel({ kind, selected = false, className = '' }: Props) {
  return (
    <span
      className={`arch-interactive-card-action ${selected ? 'is-selected' : ''} ${className}`.trim()}
      aria-hidden={kind === 'navigateLesson' ? undefined : true}
    >
      {getArchInteractiveActionText(kind, selected)}
    </span>
  );
}
