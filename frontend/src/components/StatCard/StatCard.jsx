import React from 'react';
import { motion } from 'framer-motion';
import './StatCard.css';

const StatCard = ({ title, value, icon: Icon, color, trend }) => {
  return (
    <motion.div 
      className="stat-card"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="stat-card-header">
        <div className="stat-icon" style={{ backgroundColor: `${color}20`, color }}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`stat-trend ${trend > 0 ? 'up' : 'down'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="stat-card-body">
        <h3 className="stat-title">{title}</h3>
        <p className="stat-value">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
