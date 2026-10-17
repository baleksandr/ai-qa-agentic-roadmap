import type { ElementType, ReactNode } from 'react';

type Props = {
  as?: 'h4' | 'h5' | 'h6' | 'span' | 'p';
  className?: string;
  children: ReactNode;
};

/** Назва інтерактивної навчальної картки (колір — `--study-interactive-card-title`). */
export function StudyInteractiveCardTitle({ as = 'h5', className = '', children }: Props) {
  const Tag = as as ElementType;
  const merged = ['study-interactive-card-title', className].filter(Boolean).join(' ');
  return <Tag className={merged}>{children}</Tag>;
}
