import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/', label: 'Навчальний маршрут', end: true },
  { to: '/agent-architecture', label: 'Архітектура агента', end: false },
];

export function SiteNav() {
  return (
    <nav className="site-nav" aria-label="Розділи курсу">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) => (isActive ? 'site-nav-link active' : 'site-nav-link')}
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
