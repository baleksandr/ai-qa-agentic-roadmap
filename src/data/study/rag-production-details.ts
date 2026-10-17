export type RagProductionDetail = {
  meansUk: string;
  whyUk: string;
  qaUk: string;
  terms?: Array<{ label: string; text: string }>;
};

const DETAILS: Record<string, RagProductionDetail> = {
  'Метрики та логування': {
    meansUk:
      'Окремо знімають показники **індексації** (batch/cron) і **кожного runtime-run** (retrieval + generation). Без цього не відрізнити «погана модель» від «поганий індекс».',
    whyUk:
      'Production RAG ламається в двох фазах. Метрики лише runtime ховають stale index; метрики лише offline не покажуть spike latency на запиті.',
    qaUk:
      'У CI: golden recall після reindex; у staging — один trace з retrieval_latency і generation_latency на типовий investigation.',
    terms: [
      { label: 'Час індексації', text: 'Скільки триває reindex — сигнал, що corpus виріс або embed API повільний.' },
      { label: 'Розмір corpus', text: 'Кількість chunks/документів — раптовий стрибок може означати витік зайвих даних у індекс.' },
      { label: 'Помилки embed', text: 'Частка failed chunks — інакше «дірки» в індексі без червоного алерту.' },
      { label: 'retrieval_latency', text: 'Час пошуку до LLM — регрес після deploy retriever/embed model.' },
      { label: 'hits / token evidence', text: 'Скільки фрагментів і токенів пішло в prompt — контроль budget і шуму.' },
      { label: 'generation_latency', text: 'Час відповіді моделі — не плутати з retrieval.' },
      { label: 'Відповіді без citation', text: 'Частка run, де модель не посилається на retrieval — ризик ungrounded відповідей.' },
    ],
  },
  'Свіжість індексу': {
    meansUk: 'Версіонований індекс (наприклад `index-v12`) і процес **reindex** після зміни документів або UI.',
    whyUk: 'Retrieval «успішний», але з минулого — головна причина «правильних» але хибних порад у QA.',
    qaUk: 'Після merge postmortem — автотест: query знаходить новий chunk; у deploy-логах очікувана версія індексу.',
  },
  'Поведінка при збої пошуку': {
    meansUk:
      'Явна політика застосунку, коли retriever таймаутить, індекс порожній або hits = 0 — **не** поведінка LLM за замовчуванням.',
    whyUk: 'Без політики модель продовжить відповідати з «пам’яті» або вигадувати postmortem.',
    qaUk:
      'Симулюйте down retriever: run зупиняється, деградує з warning, або retry — і це задокументовано в runbook.',
    terms: [
      { label: 'Зупинити run', text: 'Немає RAG — немає investigation з «фейковим» контекстом.' },
      { label: 'Деградація без RAG', text: 'LLM працює, але UI/лог каже, що retrieval недоступний.' },
      { label: 'Retry + backoff', text: 'Тимчасові збої embed/search API — не одразу fallback на hallucination.' },
    ],
  },
  Ліміти: {
    meansUk: 'Rate limits, idempotent reindex, cap на об’єм retrieved text у одному prompt.',
    whyUk: 'Захист від витоку токенів, дубльованих reindex job і «випадкового» витягування всього архіву.',
    qaUk: 'Навантажувальний тест embed API; повторний reindex з тим самим job id не дублює corpus; evidence не перевищує max tokens.',
    terms: [
      { label: 'Rate limits embed API', text: 'Індексація не валить прод через 429 без черги.' },
      { label: 'Idempotent reindex', text: 'Повторний cron не множить дублікати chunks.' },
      { label: 'Обмеження evidence', text: 'Context builder обрізає hits за політикою, не за «що влізло».' },
    ],
  },
  Моніторинг: {
    meansUk: 'Алерти на аномалії retrieval і на якість пошуку на **golden set** після змін.',
    whyUk: 'Latency spike без drop recall — інфра; drop recall без latency — модель/embedding/корпус.',
    qaUk: 'Після кожного deploy retriever — прогін golden queries; порівняння recall@k з baseline у дашборді.',
    terms: [
      { label: 'Spike retrieval latency', text: 'p95/p99 зросли — перевірити індекс, мережу, навантаження.' },
      { label: 'Drop recall на golden set', text: 'Фіксовані запити перестали знаходити очікувані chunk_id — регрес retrieval.' },
    ],
  },
};

export function lookupRagProductionDetail(title: string): RagProductionDetail | null {
  const key = Object.keys(DETAILS).find((k) => title.includes(k) || k.includes(title));
  return key ? DETAILS[key] : null;
}

export function productionDetailToMarkdown(
  detail: RagProductionDetail,
  options?: { omitTerms?: boolean },
): string {
  const lines = [
    `**Що це?** ${detail.meansUk}`,
    `**Навіщо в production?** ${detail.whyUk}`,
    `**Що перевірити?** ${detail.qaUk}`,
  ];
  if (!options?.omitTerms && detail.terms?.length) {
    lines.push('', '**Терміни:**', '');
    for (const t of detail.terms) {
      lines.push(`- **${t.label}** — ${t.text}`);
    }
  }
  return lines.join('\n\n');
}
