import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: 'Dashboard', href: '/', icon: '🏠', description: 'Overview and analytics' },
    { name: 'Leads', href: '/leads', icon: '👥', description: 'Manage leads and prospects' },

    { name: 'Agents', href: '/agents', icon: '👤', description: 'Sales agent management' },
    { name: 'Reports', href: '/reports', icon: '📊', description: 'Analytics and insights' },

  ];

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <>
     
     <button
  className={`sidebar__collapse-btn btn btn-primary custom-color shadow-sm d-flex align-items-center justify-content-center ${isCollapsed ? 'sidebar__collapse-btn--collapsed' : ''}`}
  onClick={() => setIsCollapsed(!isCollapsed)}
  aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
>
  <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
</button>

      <aside className={`sidebar${isCollapsed ? ' sidebar--collapsed' : ''}`}>
        
        <nav className="sidebar__nav">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`sidebar__nav-item${isActive(item.href) ? ' sidebar__nav-item--active' : ''}`}
            >
              
              <div className="sidebar__nav-content">
                <span className="sidebar__nav-name">{item.name}</span>
                <p className="sidebar__nav-description">{item.description}</p>
              </div>
            </Link>
          ))}
        </nav>
       
      </aside>
    </>
  );
};

export default Sidebar;