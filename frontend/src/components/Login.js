import React,{useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Login.css';
import Register from './Register';
export default function Login(){
  const [activeTab, setActiveTab] = useState('login');
  const [isRemembered, setIsRemembered] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { setToken, setRole, setFullName } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      setRole(data.role);
      setFullName(data.full_name);
      if (isRemembered) {
        localStorage.setItem('rememberMe', 'true');
      }
      navigate('/dashboard');
    } else {
      setMessage('Invalid login');
    }
  }

  return (
    <div className="login-container">
      <div className="login-overlay"></div>
      <div className="login-form-wrapper">
        <div className="tab-buttons">
          <button
            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            SIGN IN
          </button>
          <button
            className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            SIGN UP
          </button>
        </div>

        {activeTab === 'login' ? (
          <form onSubmit={handleLogin}>
            <h5 className="mb-3">Welcome Back</h5>
            <div className="form-group">
              <input
                className="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="remember"
                checked={isRemembered}
                onChange={(e) => setIsRemembered(e.target.checked)}
              />
              <label htmlFor="remember">Keep me signed in</label>
            </div>
            <button type="submit" className="login-btn">SIGN IN</button>
            {message && <div className="text-danger mt-2">{message}</div>}
          </form>
        ) : (
          <Register />
        )}

        <div className="footer">
          <p>&copy; LUCT Reporting App</p>
        </div>
      </div>
    </div>
  );
}
