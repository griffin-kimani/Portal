import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { handlePushSetup } from '../../hooks/usePushNotifications';
import './loginpage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          if (res.ok) navigate('/dashboard');
        })
        .catch(() => localStorage.removeItem('token'));
    }
  }, [navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.token);
      await handlePushSetup(data.token); // Register push notifications
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}

        <label>Username</label>
        <input name="username" value={credentials.username} onChange={handleChange} required />

        <label>Password</label>
        <input type="password" name="password" value={credentials.password} onChange={handleChange} required />

        <button type="submit">Login</button>
        <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
      </form>
    </div>
  );
};

export default LoginPage;
