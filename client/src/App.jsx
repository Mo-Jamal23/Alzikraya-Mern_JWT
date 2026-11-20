import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Gallery from './pages/Gallery.jsx';
import PhotoDetail from './pages/PhotoDetail.jsx';
import LoginRegister from './pages/LoginRegister.jsx';
import UploadPhoto from './pages/UploadPhoto.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/photos/:id" element={<PhotoDetail />} />
          <Route path="/upload" element={<UploadPhoto />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
