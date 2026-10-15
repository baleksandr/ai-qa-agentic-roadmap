import { Link } from 'react-router-dom';
import { getMapLabel } from '../data/learning-map.registry';
import { LEARNING_MAP_STAGES } from '../data/learning-map.registry';
import { SiteNav } from '../components/SiteNav';

export function RoutePage() {
  return (
    <div className="page route-list-page">
      <Link className="back-link" to="/">← На карту</Link>
      <SiteNav />
      <h1>Усі теми (список)</h1>
      <p className="muted">
        Текстовий режим для швидкого пошуку та доступності. Основна навігація — інтерактивна карта на
        головній вкладці.
      </p>
      {LEARNING_MAP_STAGES.map((stage) => (
        <section key={stage.id} className="route-stage-block">
          <h2>{stage.title}</h2>
          <ol className="route-list">
            {stage.nodes.map((node) => (
              <li key={node.topicId}>
                <Link to={`/topic/${node.topicId}`}>{getMapLabel(node.topicId)}</Link>
                <span className="muted small">
                  {' '}
                  · <Link to={`/topic/${node.topicId}/study`}>Study</Link>
                </span>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
