import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import Navbar from '../components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ed-page auth-page">
      {/* Decorative right kanji */}
      <span className="auth-deco-kanji" aria-hidden>解読</span>

      <Navbar />

      <div className="ed-content auth-content">
        <div className="auth-form-col">
          <span className="ed-eyebrow">— KaiDoku</span>
          <h1 className="ed-title">Sign In</h1>
          <p className="ed-subtitle">Welcome back. Continue decoding research.</p>

          <div className="ed-divider" />

          {error && <p className="up-error">{error}</p>}

          <form onSubmit={handleSubmit} className="up-form">
            <div className="up-field">
              <label htmlFor="login-email" className="up-label">Email</label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="up-input"
                autoComplete="email"
              />
            </div>

            <div className="up-field">
              <label htmlFor="login-password" className="up-label">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="up-input"
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="ed-btn-primary up-submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="auth-footer">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="auth-footer__link">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
