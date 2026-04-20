import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

// Vertical grid lines — same pattern as Home
function GridLines({ count = 9 }) {
  return (
    <div className="ed-grid-lines" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="ed-grid-line" />
      ))}
    </div>
  );
}

const Explore = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const q = query(collection(db, 'papers'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setPapers(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error('Error fetching papers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, []);

  const formatDate = (dateVal) => {
    if (!dateVal) return '';
    const d = dateVal.toDate ? dateVal.toDate() : new Date(dateVal);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (user === null) {
    return (
      <div className="ed-page">
        <GridLines />
        <Navbar />
        <div className="ed-content">
          <div className="ed-empty">
            <span className="ed-empty__kanji">界</span>
            <p className="ed-empty__title">EXPLORE PAPERS</p>
            <p className="ed-subtitle" style={{ marginBottom: '32px' }}>SIGN IN TO ACCESS THE COMMUNITY LIBRARY.</p>
            <button className="ed-btn-primary" onClick={() => navigate('/login')}>
              SIGN IN
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ed-page">
      <GridLines />
      <Navbar />

      <div className="ed-content">
        {/* Header */}
        <div className="ed-header">
          <span className="ed-eyebrow">— Community Library</span>
          <h1 className="ed-title">Explore Papers</h1>
          <p className="ed-subtitle">Research decoded by the KaiDoku community</p>
        </div>

        <div className="ed-divider" />

        {/* Grid */}
        {loading ? (
          <div className="ed-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="ed-skeleton">
                <div className="ed-skeleton__title" />
                <div className="ed-skeleton__line" />
                <div className="ed-skeleton__line ed-skeleton__line--short" />
                <div className="ed-skeleton__btn" />
              </div>
            ))}
          </div>
        ) : papers.length === 0 ? (
          <div className="ed-empty">
            <span className="ed-empty__kanji">解</span>
            <p className="ed-empty__title">No papers decoded yet.</p>
            <p className="ed-empty__sub">Be the first.</p>
            <button className="ed-btn-primary" onClick={() => navigate('/upload')}>
              Upload a Paper
            </button>
          </div>
        ) : (
          <div className="ed-grid">
            {papers.map((paper) => (
              <div key={paper.id} className="ed-card">
                {/* Placeholder thumbnail */}
                <div className="ed-card__thumb">
                  <span className="ed-card__thumb-kanji">解</span>
                </div>
                <div className="ed-card__body">
                  <h3 className="ed-card__title">{paper.title}</h3>
                  <div className="ed-card__meta">
                    <span className="ed-card__meta-item">Uploaded by a KaiDoku member</span>
                    <span className="ed-card__meta-item">{formatDate(paper.createdAt)}</span>
                    <span className="ed-card__meta-item">
                      {paper.explanation?.length || 0} sections
                    </span>
                  </div>
                  <button
                    className="ed-card__btn"
                    onClick={() => navigate(`/paper/${paper.id}`)}
                  >
                    Decode &amp; Read
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
