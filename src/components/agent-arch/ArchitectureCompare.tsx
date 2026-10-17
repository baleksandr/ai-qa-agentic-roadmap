import { Link } from 'react-router-dom';
import { getMapLabel } from '../../data/learning-map.registry';

const ROWS = [
  {
    id: 'rag',
    name: 'RAG',
    gist: 'Під час запиту код шукає релевантні фрагменти в індексі й додає їх у context LLM.',
    when: 'Велика база інцидентів, документації або postmortems — потрібне лише те, що схоже на поточну помилку.',
    qa: 'Regression agent шукає схожі падіння login/checkout у історії, перш ніж висновувати root cause.',
    not: 'Не обов’язково vector DB, не заміна agent loop.',
    topicId: 'concept-03',
  },
  {
    id: 'cag',
    name: 'Підготовлений контекст (V10)',
    gist: 'Context-Augmented Generation у гіді V10: стабільні правила готують наперед і підкладають у context. Окремо в книзі — Cache-Augmented (с. 141–143); prefix cache на атласі показує книжковий механізм.',
    when: 'Невеликий стабільний набір: формат bug report, severity matrix, internal QA policy.',
    qa: 'Ті самі правила оформлення bug report для кожного investigation run без пошуку по базі.',
    not: 'Не «будь-який довгий prompt». Книга AI Engineering використовує CAG як Cache-Augmented — інший акронім; на вкладці CAG атласу розведено окремо.',
    topicId: 'concept-20',
  },
  {
    id: 'mcp',
    name: 'MCP',
    gist: 'Протокол між agent application (client) і server, що надає tools або дані (наприклад Jira).',
    when: 'Потрібен стандартизований спосіб підключити зовнішні системи замість ad-hoc REST у кожному tool.',
    qa: 'Читання issue fields через MCP server, секрети залишаються на server.',
    not: 'Не LLM, не knowledge store, не сам цикл агента.',
    topicId: 'concept-10',
  },
] as const;

export function ArchitectureCompare() {
  return (
    <div className="arch-compare">
      <h2 className="arch-compare-title">Порівняння RAG, CAG і MCP</h2>
      <p className="muted">
        Це різні способи організувати context і доступ до даних. У QA Regression Investigation Agent вони можуть
        співіснувати паралельно — не як ланцюг RAG → CAG → MCP.
      </p>

      <div className="arch-compare-grid">
        {ROWS.map((row) => (
          <article key={row.id} className="arch-compare-card">
            <h3>{row.name}</h3>
            <p>{row.gist}</p>
            <dl>
              <dt>Коли обрати</dt>
              <dd>{row.when}</dd>
              <dt>Приклад для QA Agent</dt>
              <dd>{row.qa}</dd>
              <dt>Що це не є</dt>
              <dd className="muted small">{row.not}</dd>
            </dl>
            <p className="small">
              <Link to={`/topic/${row.topicId}/study`}>{getMapLabel(row.topicId)}</Link>
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
