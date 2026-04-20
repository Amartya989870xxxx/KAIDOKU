import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { extractTextFromPDF } from '../services/pdfExtractor';
import { explainPaper } from '../services/groq';
import { AnimatePresence, motion } from 'framer-motion';
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

const Upload = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type === 'application/pdf') { setFile(f); setError(''); }
    else setError('Please upload a PDF file.');
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && f.type === 'application/pdf') { setFile(f); setError(''); }
    else setError('Please upload a PDF file.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title.trim()) { setError('Please provide both a title and a PDF file.'); return; }
    
    console.log('Uploading as user:', user?.uid);
    if (!user || !user.uid) {
      setError('Authentication error: Unable to identify user. Please sign in again.');
      return;
    }

    setProcessing(true);
    setError('');
    try {
      const extractedText = await extractTextFromPDF(file);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'kaidoku_papers');
      const cloudRes = await fetch('https://api.cloudinary.com/v1_1/dw2oadaao/raw/upload', { method: 'POST', body: formData });
      const cloudData = await cloudRes.json();
      const docRef = await addDoc(collection(db, 'papers'), {
        title: title.trim(),
        cloudinaryUrl: cloudData.secure_url,
        uploadedBy: user.uid,
        uploaderEmail: user.email || '',
        createdAt: new Date(),
        status: 'processing',
        explanation: [],
      });
      const result = await explainPaper(extractedText);
      await updateDoc(doc(db, 'papers', docRef.id), { explanation: result, status: 'done' });
      navigate(`/paper/${docRef.id}`);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      setProcessing(false);
    }
  };

  if (user === null) {
    return (
      <div className="ed-page">
        <GridLines />
        <Navbar />
        <div className="ed-content">
          <div className="ed-empty">
            <span className="ed-empty__kanji">界</span>
            <p className="ed-empty__title">UPLOAD YOUR PAPER</p>
            <p className="ed-subtitle" style={{ marginBottom: '32px' }}>SIGN IN TO START DECODING RESEARCH.</p>
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

      {/* Processing overlay */}
      <AnimatePresence>
        {processing && (
          <motion.div
            className="up-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <span className="up-overlay__kanji">解</span>
            <p className="up-overlay__text">KaiDoku is decoding your paper…</p>
            <span className="up-overlay__spinner" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="ed-content up-content">
        {/* Left col: form */}
        <div className="up-left">
          <span className="ed-eyebrow">— Upload &amp; Decode</span>
          <h1 className="ed-title">Upload &amp; Decode</h1>
          <p className="ed-subtitle">Drop any PDF. AI will decode every section into plain language.</p>

          <div className="ed-divider" />

          {error && (
            <p className="up-error">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="up-form">
            {/* Title */}
            <div className="up-field">
              <label htmlFor="up-title" className="up-label">Paper Title</label>
              <input
                id="up-title"
                type="text"
                placeholder="e.g. Attention Is All You Need"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="up-input"
              />
            </div>

            {/* Drop zone */}
            <div className="up-field">
              <label className="up-label">PDF File</label>
              <div
                className={`up-dropzone${dragActive ? ' up-dropzone--active' : ''}${file ? ' up-dropzone--has-file' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="up-dropzone__input"
                  style={{ display: 'none' }}
                />
                <AnimatePresence mode="wait">
                  {file ? (
                    <motion.div
                      key="file"
                      className="up-dropzone__file"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="up-dropzone__filename">{file.name}</span>
                      <span className="up-dropzone__size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      className="up-dropzone__placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <p>Drag &amp; drop your PDF here</p>
                      <span>or click to browse</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button type="submit" className="ed-btn-primary up-submit" disabled={processing}>
              {processing ? 'Decoding…' : 'Decode Paper'}
            </button>
          </form>
        </div>

        {/* Right col: decorative */}
        <div className="up-right" aria-hidden>
          <span className="up-deco-kanji">解読</span>
        </div>
      </div>
    </div>
  );
};

export default Upload;
