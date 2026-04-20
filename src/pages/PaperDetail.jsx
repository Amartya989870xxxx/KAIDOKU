import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
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

const PaperDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('explanation');

  // Speech state
  const [speaking, setSpeaking] = useState(false);
  const [currentSection, setCurrentSection] = useState(-1);
  const utteranceRef = useRef(null);
  const sectionIndexRef = useRef(0);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const snap = await getDoc(doc(db, 'papers', id));
        if (snap.exists()) {
          setPaper({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.error('Error fetching paper:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPaper();
  }, [id]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speakSection = useCallback((sections, index) => {
    if (index >= sections.length) {
      setSpeaking(false);
      setCurrentSection(-1);
      sectionIndexRef.current = 0;
      return;
    }

    sectionIndexRef.current = index;
    setCurrentSection(index);

    const utterance = new SpeechSynthesisUtterance(sections[index].explanation);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => {
      speakSection(sections, index + 1);
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setCurrentSection(-1);
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const handlePlayPause = () => {
    if (!paper?.explanation?.length) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setCurrentSection(-1);
      sectionIndexRef.current = 0;
    } else {
      window.speechSynthesis.cancel();
      setSpeaking(true);
      speakSection(paper.explanation, 0);
    }
  };

  const formatDate = (dateVal) => {
    if (!dateVal) return '';
    const d = dateVal.toDate ? dateVal.toDate() : new Date(dateVal);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const sections = paper?.explanation ? (Array.isArray(paper.explanation) ? paper.explanation : [{ explanation: paper.explanation }]) : [];

  if (loading) {
    return (
      <div className="ed-page">
        <GridLines />
        <Navbar />
        <div className="ed-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
          <div className="up-overlay__spinner" />
        </div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="ed-page">
        <GridLines />
        <Navbar />
        <div className="ed-content">
          <div className="ed-empty">
            <span className="ed-empty__kanji">解</span>
            <p className="ed-empty__title">Paper Not Found</p>
            <button className="ed-btn-primary" style={{ marginTop: '24px' }} onClick={() => navigate('/explore')}>Explore Library</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ed-page" style={{ paddingTop: '80px', background: '#050505' }}>
      <GridLines />
      <Navbar />

      <div className="ed-content" style={{ maxWidth: '1000px' }}>
        {/* Back Link */}
        <Link to="/explore" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          fontFamily: 'IBM Plex Mono', 
          fontSize: '11px', 
          color: 'rgba(255,255,255,0.4)', 
          textDecoration: 'none',
          textTransform: 'uppercase',
          marginBottom: '32px'
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Library
        </Link>

        {/* Header Section */}
        <header style={{ marginBottom: '64px' }}>
          <h1 style={{ 
            fontFamily: 'Bebas Neue', 
            fontSize: 'clamp(36px, 6vw, 72px)', 
            color: '#f5f2ec', 
            lineHeight: '1', 
            marginBottom: '16px',
            textTransform: 'uppercase'
          }}>
            {paper.title}
          </h1>
          <p style={{ 
            fontFamily: 'IBM Plex Mono', 
            fontSize: '11px', 
            color: 'rgba(255,255,255,0.4)', 
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Uploaded by a KaiDoku member · {formatDate(paper.createdAt)}
          </p>
        </header>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '48px', width: 'fit-content' }}>
          <button 
            onClick={() => setActiveTab('explanation')}
            style={{ 
              padding: '12px 32px', 
              fontSize: '11px', 
              fontFamily: 'IBM Plex Mono', 
              textTransform: 'uppercase', 
              cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.08)',
              background: activeTab === 'explanation' ? '#f5f2ec' : 'transparent',
              color: activeTab === 'explanation' ? '#050505' : '#f5f2ec'
            }}
          >
            Explanation
          </button>
          <button 
            onClick={() => setActiveTab('listen')}
            style={{ 
              padding: '12px 32px', 
              fontSize: '11px', 
              fontFamily: 'IBM Plex Mono', 
              textTransform: 'uppercase', 
              cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.08)',
              background: activeTab === 'listen' ? '#f5f2ec' : 'transparent',
              color: activeTab === 'listen' ? '#050505' : '#f5f2ec'
            }}
          >
            Listen
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'explanation' ? (
            <motion.div 
              key="explanation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
            >
              {sections.map((section, idx) => (
                <div key={idx} style={{ 
                  background: '#0a0a0a', 
                  border: '1px solid rgba(255,255,255,0.08)', 
                  padding: '32px',
                  position: 'relative'
                }}>
                  <div style={{ 
                    fontFamily: 'IBM Plex Mono', 
                    fontSize: '10px', 
                    color: '#a78bfa', 
                    textTransform: 'uppercase', 
                    marginBottom: '20px',
                    letterSpacing: '0.1em'
                  }}>
                    Section {idx + 1}
                  </div>
                  <div className="paper-markdown-view" style={{ 
                    fontFamily: 'Barlow Condensed, sans-serif', 
                    fontSize: '18px', 
                    lineHeight: '1.6', 
                    color: 'rgba(245,242,236,0.8)' 
                  }}>
                    <ReactMarkdown>{section.explanation}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="listen"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <button 
                onClick={handlePlayPause}
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '0', 
                  border: 'none', 
                  background: '#f5f2ec', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer',
                  marginBottom: '32px'
                }}
              >
                {speaking ? (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="#050505">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="#050505">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </button>

              <div style={{ 
                fontFamily: 'IBM Plex Mono', 
                fontSize: '12px', 
                color: '#f5f2ec', 
                textTransform: 'uppercase',
                marginBottom: '48px',
                textAlign: 'center'
              }}>
                {speaking ? `Now Playing: Section ${currentSection + 1}` : "Click to start audio decoding"}
              </div>

              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.06)' }}>
                {sections.map((section, idx) => (
                  <div key={idx} style={{ 
                    padding: '20px 32px', 
                    background: currentSection === idx ? 'rgba(167, 139, 250, 0.05)' : '#0a0a0a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    border: '1px solid rgba(255,255,255,0.04)'
                  }}>
                    <span style={{ 
                      fontFamily: 'IBM Plex Mono', 
                      fontSize: '11px', 
                      color: currentSection === idx ? '#a78bfa' : 'rgba(255,255,255,0.2)',
                      width: '80px'
                    }}>
                      Section {idx + 1}
                    </span>
                    <span style={{ 
                      fontFamily: 'IBM Plex Mono', 
                      fontSize: '11px', 
                      color: currentSection === idx ? '#f5f2ec' : 'rgba(255,255,255,0.4)',
                      flex: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {section.explanation}
                    </span>
                    {currentSection === idx && (
                      <div style={{ display: 'flex', gap: '3px' }}>
                        <div className="audio-wave-bar" style={{ width: '2px', height: '12px', background: '#a78bfa' }} />
                        <div className="audio-wave-bar" style={{ width: '2px', height: '16px', background: '#a78bfa' }} />
                        <div className="audio-wave-bar" style={{ width: '2px', height: '10px', background: '#a78bfa' }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PaperDetail;
