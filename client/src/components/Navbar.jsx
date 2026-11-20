import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">ALZIKRAYAT</Link>
        <nav className="nav-links">
          <NavLink to="/gallery">Gallery</NavLink>
          <NavLink to="/about">About</NavLink>
          {user && <NavLink to="/upload">Upload</NavLink>}
          {user ? (
            <>
              <span className="greeting">Hi {user.firstName}</span>
              <button className="btn btn-light btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-gold btn-sm">Please Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
