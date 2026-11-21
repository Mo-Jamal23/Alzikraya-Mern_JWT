import { useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { ErrorMessage } from './StatusMessage.jsx';

const empty = { firstName: '', lastName: '', email: '', password: '', location: '', occupation: '', description: '' };

export default function RegisterForm({ onRegistered }) {
  const { login } = useAuth();
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      login(await api('/auth/register', { method: 'POST', body: form }));
      onRegistered();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-row">
        <label>First name<input name="firstName" required value={form.firstName} onChange={handleChange} /></label>
        <label>Last name<input name="lastName" required value={form.lastName} onChange={handleChange} /></label>
      </div>
      <label>Email<input name="email" type="email" required value={form.email} onChange={handleChange} /></label>
      <label>Password (min 6 characters)<input name="password" type="password" minLength="6" required value={form.password} onChange={handleChange} /></label>
      <div className="form-row">
        <label>Location (optional)<input name="location" value={form.location} onChange={handleChange} /></label>
        <label>Occupation (optional)<input name="occupation" value={form.occupation} onChange={handleChange} /></label>
      </div>
      <label>About you (optional)<textarea name="description" rows="3" maxLength="500" value={form.description} onChange={handleChange} /></label>
      <ErrorMessage message={error} />
      <button className="btn btn-dark" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
    </form>
  );
}
