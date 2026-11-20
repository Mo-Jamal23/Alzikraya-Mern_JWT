import { useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { ErrorMessage } from './StatusMessage.jsx';

export default function LoginForm({ onSuccess }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      login(await api('/auth/login', { method: 'POST', body: form }));
      onSuccess();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <label>Email<input name="email" type="email" required value={form.email} onChange={handleChange} /></label>
      <label>Password<input name="password" type="password" required value={form.password} onChange={handleChange} /></label>
      <ErrorMessage message={error} />
      <button className="btn btn-dark" disabled={busy}>{busy ? 'Signing in…' : 'Login'}</button>
    </form>
  );
}
