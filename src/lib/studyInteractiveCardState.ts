/** Спільний стан «обрана картка» (React activeKey ↔ UI). Не прив’язувати до :hover / :focus. */

export function studyInteractiveCardActiveClass(active: boolean): string {
  return active ? ' is-active is-selected' : '';
}

export function studyInteractiveCardSelectionProps(active: boolean): {
  'aria-pressed': boolean;
  'aria-current': 'step' | undefined;
  'data-selected': 'true' | 'false';
} {
  return {
    'aria-pressed': active,
    'aria-current': active ? 'step' : undefined,
    'data-selected': active ? 'true' : 'false',
  };
}
