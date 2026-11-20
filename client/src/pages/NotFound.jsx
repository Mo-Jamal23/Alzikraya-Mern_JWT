import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="panel center">
      <h1>Page not found</h1>
      <Link to="/" className="btn btn-dark">Back home</Link>
    </div>
  );
}
