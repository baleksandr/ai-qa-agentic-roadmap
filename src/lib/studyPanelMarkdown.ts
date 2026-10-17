import { Children, isValidElement, type ReactNode } from 'react';

/** Мітки секцій у бокових панелях Study Mode */
const PANEL_SECTION_LABELS = new Set([
  'Що це?',
  'Що це.',
  'Навіщо тестувати?',
  'Як тестувати?',
  'Формулювання в урокі.',
  'Хто це створює?',
  'Що далі?',
  'Що перевірити?',
  'QA-приклад.',
  'Хто виконує.',
  'Що відбувається.',
  'Результат кроку.',
  'З уроку.',
  'Навіщо тестувати.',
  'Навіщо в production?',
  'Навіщо в production.',
  'Як тестувати.',
  'Для QA.',
  'Для QA-агента.',
  'Коротко з уроку.',
  'Коротко з уроку:',
  // clarityProcessPanel / clarityDataPanel
  'Проблема',
  'Проста ідея',
  'Вхід (навчальний приклад)',
  'Хто виконує',
  'Що відбувається',
  'Вихід',
  'Кому передається',
  'Навіщо цей крок',
  'Той самий приклад далі',
  'Що може піти не так',
  'Як перевіряє QA',
  'Глибше',
  'Що це за дані',
  'Хто підготував',
  'Що містить',
  'Хто використовує далі',
  'Після Parse → Chunks (INC-442)',
  'Простими словами.',
  'Простими словами',
  'Приклад.',
  'Приклад',
  'Зв’язок з іншими поняттями.',
  'Зв’язок у ланцюгу.',
  'Зв’язок у підрозділі.',
  'Зв’язок у підрозділі',
  'Для QA investigation.',
  'Для QA.',
  'Вхід.',
  'Вихід.',
  'Вхід і вихід.',
  'Що може піти не так.',
  'Як помітити під час тестування.',
  'Як перевіряє QA.',
  'Приклад для QA investigation.',
]);

export function isStudyPanelSectionLabel(text: string): boolean {
  const t = text.trim();
  if (PANEL_SECTION_LABELS.has(t)) return true;
  if (t.startsWith('Коротко з уроку')) return true;
  return false;
}

export function reactNodeToPlainText(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number') return String(child);
      if (isValidElement<{ children?: ReactNode }>(child)) {
        return reactNodeToPlainText(child.props.children);
      }
      return '';
    })
    .join('');
}
