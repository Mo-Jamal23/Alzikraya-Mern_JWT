import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { user } = useAuth();
  return (
    <>
      <section className="hero">
        <h1 className="display-title">Stories worth<br />remembering.</h1>
        <p className="lead">
          Alzikrayat is a thoughtful photo-sharing space for the moments, places, and people that stay with us.
        </p>
        <Link to="/gallery" className="btn btn-gold btn-lg">Explore the gallery</Link>
      </section>

      <section className="split">
        <div>
          <h2>Keep the context, not only the image.</h2>
          <p className="muted">
            Upload a photograph with its title and story, then let others join the conversation in the comments.
          </p>
        </div>
        <div className="panel">
          <h3>Ready to contribute?</h3>
          <p className="muted">
            {user ? 'Share a new memory with the community.' : 'Create an account to upload photos and comment.'}
          </p>
          <Link to={user ? '/upload' : '/login'} className="btn btn-dark">
            {user ? 'Upload a photo' : 'Login or register'}
          </Link>
        </div>
      </section>
    </>
  );
}
