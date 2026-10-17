import type { ReactNode } from 'react';

/** Назва механізму, термін або коротка теза в підписаному поясненні (не заголовок секції панелі). */
export function StudyTermAccent({ children }: { children: ReactNode }) {
  return <span className="study-term-accent">{children}</span>;
}
