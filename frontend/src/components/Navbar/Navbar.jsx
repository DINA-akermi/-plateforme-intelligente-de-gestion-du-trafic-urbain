import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, LogOut, TrafficCone, Activity } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar glass">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="brand">
          <div className="brand-logo">
            <TrafficCone size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-name">TraffiQ</span>
            <span className="brand-tag">Intelligent Control</span>
          </div>
        </div>
      </div>

      <div className="navbar-right">
        <div className="status-badge pulse-container">
          <Activity size={16} />
          <span>System Live</span>
          <div className="pulse-dot"></div>
        </div>
        <button className="logout-btn" onClick={logout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
