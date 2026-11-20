import { useEffect, useState } from 'react';
import { api } from '../api.js';
import PhotoCard from '../components/PhotoCard.jsx';
import { Loading, ErrorMessage } from '../components/StatusMessage.jsx';

const VIEWS = [
  { key: 'grid3', label: '3 Columns' },
  { key: 'grid4', label: '4 Columns' },
  { key: 'list', label: 'List View' },
];

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('grid3');

  useEffect(() => {
    api('/photos')
      .then(setPhotos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="page-head">
        <h1>Photo Gallery</h1>
        <div className="btn-group" role="group" aria-label="Display style">
          {VIEWS.map((v) => (
            <button key={v.key} className={`btn btn-outline ${view === v.key ? 'active' : ''}`} onClick={() => setView(v.key)}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <Loading text="Loading photos…" />}
      <ErrorMessage message={error} />
      {!loading && !error && photos.length === 0 && (
        <div className="panel center"><h2>No photos yet</h2><p className="muted">Be the first person to share a memory.</p></div>
      )}
      <div className={`gallery gallery-${view}`}>
        {photos.map((p) => <PhotoCard key={p._id} photo={p} />)}
      </div>
    </>
  );
}
