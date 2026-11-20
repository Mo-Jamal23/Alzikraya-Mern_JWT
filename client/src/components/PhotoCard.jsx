import { Link } from 'react-router-dom';
import { fullName } from '../api.js';

export default function PhotoCard({ photo }) {
  const text = photo.description || '';
  return (
    <article className="photo-card">
      <Link to={`/photos/${photo._id}`}>
        <img className="photo-thumb" src={`/uploads/${photo.fileName}`} alt={photo.title} loading="lazy" />
      </Link>
      <div className="photo-body">
        <p className="muted small">By {fullName(photo.userId)}</p>
        <h2><Link to={`/photos/${photo._id}`}>{photo.title}</Link></h2>
        <p className="muted small">{text.length > 110 ? `${text.slice(0, 110)}…` : text}</p>
      </div>
    </article>
  );
}
