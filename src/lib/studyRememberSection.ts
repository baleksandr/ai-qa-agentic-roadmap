/**
 * «Запам’ятати» — лише 2–3 змістовні тези. Службові підказки про інтерактив — лише `StudyPageCardsHint` на рівні Study-сторінки.
 */

const REMEMBER_NOISE_PATTERNS: RegExp[] = [
  /^Нижче\s*[—–-]\s*інтерактив[^\n]*\n?/gim,
  /^Нижче\s*[—–-]\s*\*\*«Перевір себе[^\n]*\n?/gim,
  /^\*\*Interview answer\*\*[\s\S]*?(?=\n###|\n##|$)/gim,
  /^Після підключення deck[^\n]*\n?/gim,
];

export function stripRememberSectionNoise(markdown: string): string {
  let out = markdown.trim();
  for (const re of REMEMBER_NOISE_PATTERNS) {
    out = out.replace(re, '').trim();
  }
  return out;
}

/** Рядки, які не мають потрапляти в блок «Запам’ятати» (перевірка контенту). */
export const REMEMBER_FORBIDDEN_LINE_RE =
  /^(нижче\s*[—–-]|оберіть|натисніть|подивіться панел|клікніть|інтерактивний блок|після підключення deck)/i;
