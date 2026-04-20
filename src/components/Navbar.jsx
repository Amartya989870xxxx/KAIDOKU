import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  const logoTarget = user ? '/dashboard' : '/';

  return (
    <nav className={`kd-navbar${scrolled ? ' kd-navbar--scrolled' : ''}`}>

      {/* Col 1: Logo */}
      <button className="kd-navbar__logo" onClick={() => navigate(logoTarget)}>
        <span className="kd-navbar__kanji">界</span>
        <span className="kd-navbar__wordmark">KaiDoku</span>
      </button>

      {/* Col 2: Center tagline */}
      <div className="kd-navbar__tagline-wrap">
        <p className="kd-navbar__tagline">
          AI research decoder.<br />
          Upload papers. Read plainly.
        </p>
      </div>

      {/* Col 3: Nav links + auth */}
      <div className="kd-navbar__links">
        <button className="kd-navbar__link" onClick={() => navigate('/')}>Home</button>
        <button className="kd-navbar__link" onClick={() => navigate('/explore')}>Explore</button>
        <button className="kd-navbar__link" onClick={() => navigate('/dashboard')}>Dashboard</button>
        {user ? (
          <button className="kd-navbar__link" onClick={handleSignOut}>Sign Out</button>
        ) : (
          <button className="kd-navbar__link" onClick={() => navigate('/login')}>Sign In</button>
        )}
      </div>

      {/* Col 4: Upload button */}
      <button className="kd-navbar__upload" onClick={() => navigate('/upload')}>
        Upload
      </button>

    </nav>
  );
};

export default Navbar;
