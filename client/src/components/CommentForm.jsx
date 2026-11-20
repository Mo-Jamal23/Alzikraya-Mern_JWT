import { useState } from 'react';
import { api } from '../api.js';
import { ErrorMessage } from './StatusMessage.jsx';

export default function CommentForm({ photoId, onAdded }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const created = await api(`/photos/${photoId}/comments`, { method: 'POST', body: { comment: text } });
      onAdded(created);
      setText('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <label htmlFor="comment">Add a comment</label>
      <textarea id="comment" rows="3" maxLength="1000" required value={text} onChange={(e) => setText(e.target.value)} />
      <ErrorMessage message={error} />
      <button className="btn btn-dark" disabled={busy}>{busy ? 'Posting…' : 'Post comment'}</button>
    </form>
  );
}
