import type { StudyLabeledPair } from '../data/study/study-learner-panel-sections';

/** Окремий абзац або хвіст після «. »: коротка назва + « — » + пояснення (не кожне тире в реченні). */
const LABEL_PAIR_LINE = /^([А-ЯA-ZЇІЄҐ0-9][^.\n]{0,56}?)\s+—\s+(.+)$/u;

/** Останнє «. » як межа речення; не плутаємо з «». після цитати («…**#submit**». ). */
function lastSentenceBreakIndex(trimmed: string): number {
  let searchEnd = trimmed.length;
  while (searchEnd > 0) {
    const pos = trimmed.lastIndexOf('. ', searchEnd - 1);
    if (pos === -1) return -1;
    if (trimmed[pos - 1] === '»') {
      searchEnd = pos;
      continue;
    }
    return pos;
  }
  return -1;
}

export function splitTrailingLabeledSentence(bodyUk: string): {
  mainUk: string;
  pair: StudyLabeledPair | null;
} {
  const trimmed = bodyUk.trim();
  const lastDot = lastSentenceBreakIndex(trimmed);
  if (lastDot === -1) return { mainUk: trimmed, pair: null };
  const tail = trimmed.slice(lastDot + 2).trim();
  const m = tail.match(LABEL_PAIR_LINE);
  if (!m) return { mainUk: trimmed, pair: null };
  const termUk = m[1].trim();
  if (termUk.includes('.') || /^(це|але|тобто|наприклад)\b/iu.test(termUk)) {
    return { mainUk: trimmed, pair: null };
  }
  return {
    mainUk: trimmed.slice(0, lastDot + 1).trim(),
    pair: { termUk, explanationUk: m[2].trim() },
  };
}

/** Абзаци + пари «назва — пояснення» на окремих рядках для Study Mode. */
export function expandStudyExplanationBlocks(bodyUk: string): {
  mainUk: string;
  labeledPairs: StudyLabeledPair[];
} {
  const labeledPairs: StudyLabeledPair[] = [];
  const blocks: string[] = [];

  for (const block of bodyUk.split(/\n\n+/)) {
    const t = block.trim();
    if (!t) continue;

    if (!t.includes('. ')) {
      const whole = !t.includes('«') ? t.match(LABEL_PAIR_LINE) : null;
      if (whole) {
        labeledPairs.push({ termUk: whole[1].trim(), explanationUk: whole[2].trim() });
        continue;
      }
    }

    const { mainUk, pair } = splitTrailingLabeledSentence(t);
    if (pair) {
      if (mainUk) blocks.push(mainUk);
      labeledPairs.push(pair);
    } else {
      blocks.push(t);
    }
  }

  return { mainUk: blocks.join('\n\n'), labeledPairs };
}

/** @deprecated Не використовувати для автопарсингу UI — лише явні `labeledLead` / `StudyLabeledExplanation`. */
export function splitLabeledLeadFromText(text: string): {
  termUk: string;
  explanationUk: string;
  restUk: string;
} | null {
  const trimmed = text.trim();
  if (!trimmed.includes(' — ')) return null;

  const dotIdx = trimmed.indexOf('. ');
  const firstChunk = dotIdx === -1 ? trimmed : trimmed.slice(0, dotIdx + 1);
  const restUk = dotIdx === -1 ? '' : trimmed.slice(dotIdx + 2).trim();

  const dash = firstChunk.match(/^(.+?)\s+—\s+(.+)$/u);
  if (!dash) return null;

  return {
    termUk: dash[1].trim(),
    explanationUk: dash[2].trim(),
    restUk,
  };
}

const RELATION_SECTION_LABEL = 'Зв’язок з іншими понятями';
const PLAIN_WORDS_LABEL = 'Простими словами';

export function isRelationConceptSectionLabel(labelUk: string): boolean {
  return labelUk.trim() === RELATION_SECTION_LABEL;
}

export function isPlainWordsSectionLabel(labelUk: string): boolean {
  return labelUk.trim() === PLAIN_WORDS_LABEL;
}

/** Речення з «термін — пояснення» → мінікартки; останнє речення без тире — примітка. */
export function parseRelationTextToConceptCards(text: string): {
  items: Array<{ termUk: string; bodyUk: string }>;
  footnoteUk?: string;
} | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const single = trimmed.match(/^(.+?)\s+—\s+(.+)$/u);
  if (single && !trimmed.includes('. ')) {
    return { items: [{ termUk: single[1].trim(), bodyUk: single[2].trim() }] };
  }

  const sentences = trimmed
    .split(/(?<=[.!?])\s+/u)
    .map((s) => s.trim())
    .filter(Boolean);

  const items: Array<{ termUk: string; bodyUk: string }> = [];
  const footnoteParts: string[] = [];

  for (const sentence of sentences) {
    const dash = sentence.match(/^(.+?)\s+—\s+(.+)$/u);
    if (dash) {
      items.push({ termUk: dash[1].trim(), bodyUk: dash[2].trim() });
      continue;
    }
    if (items.length > 0) {
      footnoteParts.push(sentence);
    }
  }

  if (items.length < 1) return null;

  const footnoteUk = footnoteParts.length ? footnoteParts.join(' ') : undefined;
  return { items, footnoteUk };
}
