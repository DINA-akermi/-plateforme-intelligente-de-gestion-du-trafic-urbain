import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Map, AlertTriangle, Car, Bell, User, Shield } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Map, label: 'Traffic Map', path: '/traffic' },
    { icon: AlertTriangle, label: 'Incidents', path: '/incidents' },
    { icon: Car, label: 'Vehicles', path: '/vehicles' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
  ];

  return (
    <aside className={`sidebar glass ${isOpen ? 'open' : ''}`}>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">
            {user?.role === 'ADMIN' ? <Shield size={18} /> : <User size={18} />}
          </div>
          <div className="user-info">
            <span className="username">{user?.name || 'User'}</span>
            <span className="role">{user?.role || 'Guest'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
