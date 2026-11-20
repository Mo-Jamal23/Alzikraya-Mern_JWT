import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoginForm from '../components/LoginForm.jsx';
import RegisterForm from '../components/RegisterForm.jsx';

export default function LoginRegister() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [notice, setNotice] = useState('');

  if (user) return <Navigate to="/gallery" replace />;

  return (
    <div className="panel narrow">
      <div className="btn-group" role="tablist">
        <button className={`btn btn-outline ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>Login</button>
        <button className={`btn btn-outline ${mode === 'register' ? 'active' : ''}`} onClick={() => setMode('register')}>Register</button>
      </div>
      {notice && <p className="alert alert-success">{notice}</p>}
      {mode === 'login' ? (
        <LoginForm onSuccess={() => navigate('/gallery')} />
      ) : (
        <RegisterForm
          onRegistered={() => {
            setNotice('Account created. Please log in.');
            setMode('login');
          }}
        />
      )}
    </div>
  );
}
