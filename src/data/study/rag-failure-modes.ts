export type RagFailureMeta = {
  index: number;
  categoryUk: string;
  categoryClass: string;
  severity: 'info' | 'warning' | 'danger';
};

const BY_TITLE: Array<{ match: string; meta: RagFailureMeta }> = [
  {
    match: 'Не знайшли потрібний документ',
    meta: { index: 1, categoryUk: 'Retrieval', categoryClass: 'cat-retrieval', severity: 'warning' },
  },
  {
    match: 'Застарілий індекс',
    meta: { index: 2, categoryUk: 'Індекс', categoryClass: 'cat-index', severity: 'warning' },
  },
  {
    match: 'Порушення доступу',
    meta: { index: 3, categoryUk: 'Security', categoryClass: 'cat-security', severity: 'danger' },
  },
  {
    match: 'Неправильне використання фрагмента',
    meta: { index: 4, categoryUk: 'Grounding', categoryClass: 'cat-grounding', severity: 'warning' },
  },
  {
    match: 'єкція в документ',
    meta: { index: 5, categoryUk: 'Injection', categoryClass: 'cat-injection', severity: 'danger' },
  },
  {
    match: 'Технічний збій',
    meta: { index: 6, categoryUk: 'Операції', categoryClass: 'cat-ops', severity: 'info' },
  },
  {
    match: 'Безпека на рівні політики',
    meta: { index: 7, categoryUk: 'Політика', categoryClass: 'cat-policy', severity: 'danger' },
  },
];

export function lookupRagFailureMeta(title: string): RagFailureMeta {
  const hit = BY_TITLE.find((e) => title.includes(e.match) || e.match.includes(title));
  if (hit) return hit.meta;
  return { index: 0, categoryUk: 'Ризик', categoryClass: 'cat-default', severity: 'info' };
}
