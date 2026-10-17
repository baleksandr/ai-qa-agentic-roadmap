import { HashRouter, Route, Routes } from 'react-router-dom';
import { AgentArchitecturePage } from './pages/AgentArchitecturePage';
import { HomePage } from './pages/HomePage';
import { RoutePage } from './pages/RoutePage';
import { TopicPage } from './pages/TopicPage';
import { TopicStudyPage } from './pages/TopicStudyPage';
import { QaInterviewStudyPage } from './pages/QaInterviewStudyPage';
import './App.css';
import './styles/review-mode.css';
import './styles/learning-map-layout.css';
import './styles/study-learner-flow-layout.css';
import './styles/study-teaching-cards-layout.css';
import './styles/study-interactive-cards.css';
import './styles/fundamentals-study-layout.css';
import './styles/study-learner-panel.css';
import './styles/study-remember-takeaways.css';
import './styles/study-after-interactive-summary.css';
import './styles/study-term-accent.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/agent-architecture" element={<AgentArchitecturePage />} />
        <Route path="/route" element={<RoutePage />} />
        <Route path="/topic/:topicId" element={<TopicPage />} />
        <Route path="/topic/qa-interview/study" element={<QaInterviewStudyPage />} />
        <Route path="/topic/:topicId/study" element={<TopicStudyPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
