import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import Navbar from '../components/Navbar';

const Signup = () => {
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
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        createdAt: serverTimestamp(),
      });
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
          <h1 className="ed-title">Create Account</h1>
          <p className="ed-subtitle">Join KaiDoku to start decoding research.</p>

          <div className="ed-divider" />

          {error && <p className="up-error">{error}</p>}

          <form onSubmit={handleSubmit} className="up-form">
            <div className="up-field">
              <label htmlFor="signup-email" className="up-label">Email</label>
              <input
                id="signup-email"
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
              <label htmlFor="signup-password" className="up-label">Password</label>
              <input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="up-input"
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="ed-btn-primary up-submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-footer__link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
