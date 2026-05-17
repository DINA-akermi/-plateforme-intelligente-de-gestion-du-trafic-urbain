import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { authClient } from '../../api/apolloClient';
import { User, Mail, Lock, TrafficCone, Shield, UserPlus } from 'lucide-react';
import './Register.css';

const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!, $role: String!) {
    register(name: $name, email: $email, password: $password, role: $role) {
      id
      name
      email
      role
    }
  }
`;

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'OPERATOR'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const [register] = useMutation(REGISTER_MUTATION, { client: authClient });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await register({ variables: formData });
      navigate('/login', { state: { message: 'Account created successfully! Please log in.' } });
    } catch (err) {
      setError(err.message || 'Registration failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header">
          <div className="logo-icon">
            <TrafficCone size={48} />
          </div>
          <h1>Create Account</h1>
          <p>Join the TraffiQ management network</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label><User size={16} /> Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label><Mail size={16} /> Email Address</label>
            <input 
              type="email" 
              placeholder="user@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label><Lock size={16} /> Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Select Role</label>
            <div className="role-selector">
              <div 
                className={`role-option ${formData.role === 'OPERATOR' ? 'active' : ''}`}
                onClick={() => setFormData({...formData, role: 'OPERATOR'})}
              >
                <User size={20} />
                <span>Operator</span>
              </div>
              <div 
                className={`role-option ${formData.role === 'ADMIN' ? 'active' : ''}`}
                onClick={() => setFormData({...formData, role: 'ADMIN'})}
              >
                <Shield size={20} />
                <span>Admin</span>
              </div>
            </div>
          </div>

          <button type="submit" className="register-btn" disabled={isLoading}>
            <UserPlus size={18} />
            {isLoading ? 'Creating Account...' : 'Register Now'}
          </button>
        </form>

        <div className="register-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
