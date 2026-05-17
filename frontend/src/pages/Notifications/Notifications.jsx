import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { notificationClient } from '../../api/apolloClient';
import { useAuth } from '../../context/AuthContext';
import { Bell, Check, Trash2, AlertCircle, Info, AlertTriangle, Send, Shield, User } from 'lucide-react';
import './Notifications.css';

const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    getNotifications {
      id
      message
      type
      recipientRole
      isRead
      createdAt
    }
  }
`;

const CREATE_NOTIFICATION = gql`
  mutation CreateNotification($message: String!, $type: String, $recipientRole: String) {
    createNotification(message: $message, type: $type, recipientRole: $recipientRole) {
      id
    }
  }
`;

const MARK_AS_READ = gql`
  mutation MarkAsRead($id: ID!) {
    markAsRead(id: $id) {
      id
      isRead
    }
  }
`;

const Notifications = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [newMsg, setNewMsg] = useState('');
  const [targetRole, setTargetRole] = useState('ALL');
  
  const { loading, error, data, refetch } = useQuery(GET_NOTIFICATIONS, { 
    client: notificationClient,
    pollInterval: 5000 // Real-time updates
  });
  
  const [createNotification] = useMutation(CREATE_NOTIFICATION, { 
    client: notificationClient,
    onCompleted: () => {
      refetch();
      setNewMsg('');
    }
  });

  const [markAsRead] = useMutation(MARK_AS_READ, { 
    client: notificationClient,
    onCompleted: () => refetch()
  });

  const notifications = data?.getNotifications || [];

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    try {
      await createNotification({ 
        variables: { 
          message: newMsg, 
          type: 'ALERT',
          recipientRole: targetRole 
        } 
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'alert':
      case 'warning': return <AlertTriangle size={20} style={{ color: '#f59e0b' }} />;
      case 'error': return <AlertCircle size={20} style={{ color: '#ef4444' }} />;
      case 'info': return <Info size={20} style={{ color: '#3b82f6' }} />;
      default: return <Bell size={20} style={{ color: '#94a3b8' }} />;
    }
  };

  return (
    <div className="notifications-page">
      <header className="page-header">
        <div className="title-section">
          <h1>Security & Traffic Alerts</h1>
          <p>Real-time notifications filtered by your role: <span className="highlight">{user?.role}</span></p>
        </div>
      </header>

      {isAdmin && (
        <div className="admin-console card">
          <div className="section-header">
            <h3><Send size={18} /> Broadcast Dispatch</h3>
          </div>
          <form onSubmit={handleSend} className="notif-form">
            <input 
              type="text" 
              placeholder="Enter message for dispatch..." 
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
            />
            <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)} className="role-select">
              <option value="ALL">All Staff</option>
              <option value="OPERATOR">Operators Only</option>
              <option value="ADMIN">Admins Only</option>
            </select>
            <button type="submit" className="primary-btn">Broadcast</button>
          </form>
        </div>
      )}

      <div className="card notifications-card">
        {loading && !data ? (
          <div className="loading-state">Synchronizing alerts...</div>
        ) : error ? (
          <div className="error-card card">
            <AlertCircle color="#ef4444" />
            <p>Notification Service Offline: Could not sync via GraphQL.</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <Bell size={48} color="#1e293b" />
            <p>Your notification queue is currently empty.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notif) => (
              <div key={notif.id} className={`notification-item ${notif.isRead ? 'read' : 'unread'}`}>
                <div className="notif-icon-wrapper">
                  {getIcon(notif.type)}
                </div>
                <div className="notif-content">
                  <div className="notif-meta">
                    <span className="notif-type">{notif.type}</span>
                    <span className="notif-role-badge">
                      {notif.recipientRole === 'ADMIN' ? <Shield size={12} /> : <User size={12} />}
                      {notif.recipientRole}
                    </span>
                    <span className="notif-time">
                      {notif.createdAt ? new Date(parseInt(notif.createdAt)).toLocaleTimeString() : 'Just now'}
                    </span>
                  </div>
                  <p className="notif-message">{notif.message}</p>
                </div>
                <div className="notif-actions">
                  {!notif.isRead && (
                    <button className="icon-btn success" onClick={() => markAsRead({ variables: { id: notif.id } })}>
                      <Check size={16} />
                    </button>
                  )}
                  {isAdmin && (
                    <button className="icon-btn danger">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
