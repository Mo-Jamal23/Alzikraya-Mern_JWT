import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { ErrorMessage } from '../components/StatusMessage.jsx';

export default function UploadPhoto() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!user) return <Navigate to="/login" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please choose an image');
    const data = new FormData();
    data.append('title', title);
    data.append('description', description);
    data.append('image', file);
    setBusy(true);
    setError('');
    try {
      const photo = await api('/photos', { method: 'POST', body: data, isForm: true });
      navigate(`/photos/${photo._id}`);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="panel narrow">
      <h1>Upload a photo</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>Title<input required maxLength="200" value={title} onChange={(e) => setTitle(e.target.value)} /></label>
        <label>Story (optional)<textarea rows="3" maxLength="1000" value={description} onChange={(e) => setDescription(e.target.value)} /></label>
        <label>Image (JPG, PNG, GIF, WebP · max 5MB)
          <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" required onChange={(e) => setFile(e.target.files[0])} />
        </label>
        <ErrorMessage message={error} />
        <button className="btn btn-dark" disabled={busy}>{busy ? 'Uploading…' : 'Upload'}</button>
      </form>
    </div>
  );
}
