import { Link } from 'react-router-dom';
import { ArchitectureAtlas } from '../components/agent-arch/ArchitectureAtlas';
import { SiteNav } from '../components/SiteNav';
import { TopicSearch } from '../components/TopicSearch';

export function AgentArchitecturePage() {
  return (
    <div className="page agent-arch-page">
      <header className="site-header">
        <div>
          <h1>Архітектура агента</h1>
          <p className="lead">
            Інтерактивний атлас: загальний цикл агента, RAG, CAG, MCP і спільна схема QA Regression
            Investigation Agent. Кожна вкладка — окрема схема з покроковою симуляцією (навчальна, не live run).
          </p>
          <SiteNav />
        </div>
        <TopicSearch />
      </header>

      <ArchitectureAtlas />

      <p className="small muted arch-footer">
        <Link to="/">← Назад до навчального маршруту</Link>
      </p>
    </div>
  );
}
