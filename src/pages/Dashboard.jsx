import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function GridLines({ count = 9 }) {
  return (
    <div className="ed-grid-lines" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="ed-grid-line" />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [allPapers, setAllPapers] = useState([]);
  const [myPapers, setMyPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBanner, setActiveBanner] = useState(0);
  const [bannerFading, setBannerFading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const allQ = query(collection(db, 'papers'), orderBy('createdAt', 'desc'));
        const allSnap = await getDocs(allQ);
        const all = allSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setAllPapers(all);

        if (user) {
          const myQ = query(
            collection(db, 'papers'),
            where('uploadedBy', '==', user.uid)
          );
          const mySnap = await getDocs(myQ);
          const my = mySnap.docs.map(d => ({ id: d.id, ...d.data() }));
          my.sort((a, b) => {
            const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt instanceof Date ? a.createdAt.getTime() : 0);
            const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt instanceof Date ? b.createdAt.getTime() : 0);
            return timeB - timeA;
          });
          setMyPapers(my);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  useEffect(() => {
    if (allPapers.length <= 1) return;
    const interval = setInterval(() => {
      setBannerFading(true);
      setTimeout(() => {
        setActiveBanner(prev => (prev + 1) % allPapers.length);
        setBannerFading(false);
      }, 350);
    }, 5000);
    return () => clearInterval(interval);
  }, [allPapers.length]);

  const goToBanner = (idx) => {
    if (idx === activeBanner) return;
    setBannerFading(true);
    setTimeout(() => {
      setActiveBanner(idx);
      setBannerFading(false);
    }, 350);
  };

  const totalSections = myPapers.reduce((sum, p) => sum + (p.explanation?.length || 0), 0);

  const formatDate = (d) => {
    if (!d) return '';
    const date = d.toDate ? d.toDate() : new Date(d);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const activePaper = allPapers[activeBanner];

  if (!user && !loading) {
    return (
      <div className="ed-page">
        <GridLines />
        <Navbar />
        <div className="ed-content">
          <div className="ed-empty">
            <span className="ed-empty__kanji">界</span>
            <p className="ed-empty__title">Sign in to view your workspace</p>
            <p className="ed-subtitle" style={{ marginBottom: '32px' }}>Track your decodes and see research stats.</p>
            <button className="ed-btn-primary" onClick={() => navigate('/login')}>
              Sign In
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

      <div className="ed-content dash-content">
        <div className="ed-header">
          <span className="ed-eyebrow">— Your Workspace</span>
          <h1 className="ed-title">Dashboard</h1>
        </div>
        <div className="ed-divider" />

        <div className="dash-stats">
          <div className="dash-stat">
            <span className="dash-stat__num">{loading ? '—' : myPapers.length}</span>
            <span className="dash-stat__label">Papers Decoded</span>
          </div>
          <div className="dash-stat">
            <span className="dash-stat__num">{loading ? '—' : totalSections}</span>
            <span className="dash-stat__label">Sections Explained</span>
          </div>
          <div className="dash-stat">
            <span className="dash-stat__num">{loading ? '—' : allPapers.length}</span>
            <span className="dash-stat__label">Community Papers</span>
          </div>
        </div>

        <div className="ed-divider" />

        <div className="dash-section-heading">
          <span className="ed-eyebrow">— Latest Papers</span>
          <h2 className="dash-section-title">Community Papers</h2>
        </div>

        {loading ? (
          <div className="dash-banner-skeleton" />
        ) : allPapers.length === 0 ? (
          <div className="ed-empty">
            <span className="ed-empty__kanji">解</span>
            <p className="ed-empty__title">No papers yet.</p>
            <button className="ed-btn-primary" onClick={() => navigate('/upload')}>
              Upload Your First Paper
            </button>
          </div>
        ) : activePaper ? (
          <>
            <div className={`dash-banner${bannerFading ? ' dash-banner--fading' : ''}`}>
              <div className="dash-banner__thumb" onClick={() => navigate(`/paper/${activePaper.id}`)}>
                <span className="dash-banner__thumb-kanji">解</span>
                <p className="dash-banner__thumb-title">{activePaper.title}</p>
              </div>

              <div className="dash-banner__info">
                <h3 className="dash-banner__title">{activePaper.title}</h3>
                <div className="dash-banner__meta">
                  <span>{formatDate(activePaper.createdAt)}</span>
                  <span>·</span>
                  <span>{activePaper.explanation?.length || 0} sections</span>
                </div>
                {activePaper.explanation?.[0] && (
                  <p className="dash-banner__preview">
                    {typeof activePaper.explanation[0] === 'string'
                      ? activePaper.explanation[0].slice(0, 150)
                      : (activePaper.explanation[0].explanation?.slice(0, 150) || '')}…
                  </p>
                )}
                <div className="dash-banner__actions">
                  <button
                    className="ed-btn-primary"
                    onClick={() => navigate(`/paper/${activePaper.id}`)}
                  >
                    Read Paper
                  </button>
                  <button
                    className="ed-btn-outline"
                    onClick={() => navigate('/explore')}
                  >
                    Explore Library
                  </button>
                </div>
              </div>
            </div>

            {allPapers.length > 1 && (
              <div className="dash-dots">
                {allPapers.map((_, i) => (
                  <button
                    key={i}
                    className={`dash-dot${i === activeBanner ? ' dash-dot--active' : ''}`}
                    onClick={() => goToBanner(i)}
                    aria-label={`Go to paper ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}