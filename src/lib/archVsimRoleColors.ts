import type { SimNode } from '../types/architecture-simulation';

/** Колір стрілки за роллю вузла-джерела (відповідає легенді схеми). */
export function edgeColorForRole(role: SimNode['role'], emphasis: 'idle' | 'active' | 'focused'): string {
  const table: Record<SimNode['role'], { idle: string; active: string }> = {
    human: { idle: 'rgba(232, 184, 74, 0.72)', active: '#e8b84a' },
    code: { idle: 'rgba(61, 214, 195, 0.7)', active: '#3dd6c3' },
    llm: { idle: 'rgba(184, 140, 255, 0.72)', active: '#b88cff' },
    tool: { idle: 'rgba(94, 224, 200, 0.68)', active: '#5ee0c8' },
    data: { idle: 'rgba(110, 181, 255, 0.72)', active: '#6eb5ff' },
    outcome: { idle: 'rgba(94, 224, 168, 0.72)', active: '#5ee0a8' },
  };
  const row = table[role] ?? table.code;
  if (emphasis === 'focused') return row.active;
  return emphasis === 'active' ? row.active : row.idle;
}
