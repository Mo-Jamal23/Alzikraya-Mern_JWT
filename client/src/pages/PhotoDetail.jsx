import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, fullName, formatDate } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import CommentForm from '../components/CommentForm.jsx';
import { Loading, ErrorMessage } from '../components/StatusMessage.jsx';

export default function PhotoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([api(`/photos/${id}`), api(`/photos/${id}/comments`)])
      .then(([p, c]) => {
        setPhoto(p);
        setComments(c);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this photo permanently?')) return;
    try {
      await api(`/photos/${id}`, { method: 'DELETE' });
      navigate('/gallery');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loading />;
  if (!photo) return <ErrorMessage message={error || 'Photo not found'} />;

  const isOwner = user && photo.userId?._id === user._id;

  return (
    <>
      <div className="detail">
        <img className="detail-image" src={`/uploads/${photo.fileName}`} alt={photo.title} />
        <div>
          <h1>{photo.title}</h1>
          <p className="muted">By {fullName(photo.userId)} · {formatDate(photo.dateTime)}</p>
          <p className="pre">{photo.description}</p>
          {isOwner && <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete my photo</button>}
          <ErrorMessage message={error} />
        </div>
      </div>

      <section className="comments">
        <h2>Comments <span className="muted">({comments.length})</span></h2>
        {comments.map((c) => (
          <div className="comment" key={c._id}>
            <strong>{fullName(c.userId)}</strong> <span className="muted small">· {formatDate(c.dateTime)}</span>
            <p className="pre">{c.comment}</p>
          </div>
        ))}
        {user ? (
          <CommentForm photoId={id} onAdded={(c) => setComments((prev) => [...prev, c])} />
        ) : (
          <p className="muted"><Link to="/login">Login</Link> to join the conversation.</p>
        )}
      </section>
    </>
  );
}
