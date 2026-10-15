import { HashRouter, Route, Routes } from 'react-router-dom';
import { AgentArchitecturePage } from './pages/AgentArchitecturePage';
import { HomePage } from './pages/HomePage';
import { RoutePage } from './pages/RoutePage';
import { TopicPage } from './pages/TopicPage';
import { TopicStudyPage } from './pages/TopicStudyPage';
import './App.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/agent-architecture" element={<AgentArchitecturePage />} />
        <Route path="/route" element={<RoutePage />} />
        <Route path="/topic/:topicId" element={<TopicPage />} />
        <Route path="/topic/:topicId/study" element={<TopicStudyPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
