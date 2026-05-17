import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, TrafficCone, Shield, User } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setIsLoading(true);
    const demoEmail = role === 'ADMIN' ? 'admin@gmail.com' : 'operator@gmail.com';
    const result = await login(demoEmail, 'password123');
    if (result.success) {
      navigate('/');
    } else {
      setError('Demo login failed. Ensure Auth Service is running.');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box glass">
        <div className="login-header">
          <div className="logo-icon">
            <TrafficCone size={48} />
          </div>
          <h1>TraffiQ Control</h1>
          <p>Intelligent Traffic Management Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {successMessage && <div className="success-message">{successMessage}</div>}
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label><Mail size={16} /> Email Address</label>
            <input 
              type="email" 
              placeholder="user@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label><Lock size={16} /> Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Connecting...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <Link to="/register">Create one</Link></p>
        </div>

        <div className="demo-section">
          <p>Quick access with demo accounts:</p>
          <div className="demo-buttons">
            <button className="demo-btn admin" onClick={() => handleDemoLogin('ADMIN')}>
              <Shield size={24} /> 
              <span>Admin</span>
            </button>
            <button className="demo-btn operator" onClick={() => handleDemoLogin('OPERATOR')}>
              <User size={24} /> 
              <span>Operator</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
