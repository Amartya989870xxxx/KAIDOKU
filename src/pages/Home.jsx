import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "./Home.css";

// ─── MARQUEE ───────────────────────────────────────────────────────
function Marquee({ items }) {
  return (
    <div className="marquee-track">
      <div className="marquee-inner">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="marquee-item">
            {item} <span className="marquee-sep">解読</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── VERTICAL GRID LINES ───────────────────────────────────────────
function GridLines({ count = 8 }) {
  return (
    <div className="grid-lines" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="grid-line" />
      ))}
    </div>
  );
}

// ─── SPLIT TEXT REVEAL ─────────────────────────────────────────────
function SplitReveal({ text, className, delay = 0 }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="word-wrap">
          <span
            className="word-inner"
            style={{ animationDelay: `${delay + i * 0.06}s` }}
          >
            {word}
          </span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────
function Hero({ onUpload }) {
  const heroRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (!heroRef.current || !imgRef.current) return;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      imgRef.current.style.transform = `scale(1.05) translate(${x * 20}px, ${y * 12}px)`;
    };
    const el = heroRef.current;
    el?.addEventListener("mousemove", onMove);
    return () => el?.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <GridLines count={9} />

      <div className="hero-img-wrap">
        <div className="hero-img" ref={imgRef}>
          <div className="hero-img-gradient" />
        </div>
      </div>

      <div className="hero-labels">
        <span className="hero-label hero-label--left">Research Analysis</span>
        <span className="hero-label hero-label--center">Plain Language</span>
        <span className="hero-label hero-label--right">Audio Playback</span>
      </div>

      <div className="hero-headline">
        <h1 className="headline">
          <SplitReveal text="RESEARCH" className="headline-line headline-line--1" delay={0.1} />
          <SplitReveal text="DECODED" className="headline-line headline-line--2" delay={0.25} />
          <SplitReveal text="FINALLY" className="headline-line headline-line--3" delay={0.4} />
        </h1>
      </div>

      <div className="hero-bottom">
        <div className="hero-bottom-left">
          <span className="hero-scroll-hint">↓ Scroll to explore</span>
        </div>
        <div className="hero-bottom-center">
          <button className="hero-cta" onClick={onUpload}>
            <span className="hero-cta-kanji">解</span>
            <span>Upload a Paper</span>
            <span className="hero-cta-arrow">↗</span>
          </button>
        </div>
        <div className="hero-bottom-right">
          <span className="hero-counter">
            <span className="hero-counter-num">解読</span>
            <span>EST 2026©</span>
          </span>
        </div>
      </div>
    </section>
  );
}

// ─── ABOUT / COLLAGE SECTION ───────────────────────────────────────
function AboutSection() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className={`about-section ${visible ? "about-section--visible" : ""}`} ref={sectionRef}>
      <GridLines count={9} />

      <div className="about-grid">
        <div className="about-img-block about-img-block--tl">
          <div className="about-img about-img--1">
            <span className="about-panel-num">01</span>
            <h3 className="about-panel-title">GEMINI DECODES</h3>
            <p className="about-panel-desc">Every section processed by Gemini 2.5 Flash. Complex terms defined. Plain language guaranteed.</p>
            <div className="about-img-label">AI Processing</div>
          </div>
        </div>

        <div className="about-img-block about-img-block--tr">
          <div className="about-img about-img--2">
            <span className="about-panel-num">02</span>
            <h3 className="about-panel-title">CHUNK BY CHUNK</h3>
            <p className="about-panel-desc">Papers split into 3,000 character sections. Each explained independently. Nothing skipped.</p>
            <div className="about-img-label">Section Breakdown</div>
          </div>
        </div>

        <div className="about-img-block about-img-block--bl">
          <div className="about-img about-img--3">
            <span className="about-panel-num">03</span>
            <h3 className="about-panel-title">ANY PDF FORMAT</h3>
            <p className="about-panel-desc">Upload any text-based research paper. Physics. Biology. Computer Science. Economics.</p>
            <div className="about-img-label">Any Research Paper</div>
          </div>
        </div>

        <div className="about-img-block about-img-block--bc">
          <div className="about-img about-img--4">
            <span className="about-panel-num">04</span>
            <h3 className="about-panel-title">READ OR LISTEN</h3>
            <p className="about-panel-desc">Switch between markdown explanation and Web Speech audio. Research that fits your workflow.</p>
            <div className="about-img-label">Audio Playback</div>
          </div>
        </div>

        <div className="about-text-block">
          <p className="about-text">
            We live in an age where knowledge is everywhere, but understanding is scarce. The real challenge isn't access to research. It's comprehension.
          </p>
          <p className="about-text">
            KaiDoku exists to decode the gap between researchers and the rest of the world. Every paper, every section, every term, translated into language anyone can read.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── PROCESS SECTION ──────────────────────────────────────────────
function ProcessSection() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const steps = [
    {
      num: "01",
      kanji: "読",
      title: "Upload & Extract",
      desc: "Drop any PDF. pdfjs-dist extracts every section — equations, tables, references. All handled.",
    },
    {
      num: "02",
      kanji: "解",
      title: "AI Decoding",
      desc: "Gemini 2.5 Flash processes each 3,000-character chunk. Plain language. Term definitions. No jargon.",
    },
    {
      num: "03",
      kanji: "聴",
      title: "Read or Listen",
      desc: "Switch between markdown view and Web Speech API audio. Research that fits any workflow.",
    },
  ];

  return (
    <section className={`process-section ${visible ? "process-section--visible" : ""}`} ref={sectionRef}>
      <GridLines count={9} />

      <div className="process-header">
        <span className="process-eyebrow">— How It Works</span>
        <h2 className="process-title">THREE STEPS<br />TO CLARITY</h2>
      </div>

      <div className="process-steps">
        {steps.map((step, i) => (
          <div className="process-step" key={step.num} style={{ animationDelay: `${i * 0.12}s` }}>
            <div className="process-step-top">
              <span className="process-num">{step.num}</span>
              <span className="process-kanji">{step.kanji}</span>
            </div>
            <div className="process-step-line" />
            <div className="process-step-body">
              <h3 className="process-step-title">{step.title}</h3>
              <p className="process-step-desc">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CTA SECTION ──────────────────────────────────────────────────
function CtaSection({ onUpload, navigate }) {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className={`cta-section ${visible ? "cta-section--visible" : ""}`} ref={sectionRef}>
      <GridLines count={9} />
      <div className="cta-bg" />
      <div className="cta-content">
        <p className="cta-pre">Ready to decode?</p>
        <h2 className="cta-title">Upload your first<br />research paper.</h2>
        <button className="cta-btn" onClick={onUpload}>
          <span>Begin Decoding</span>
          <span className="cta-btn-kanji">解</span>
        </button>
      </div>

      <div className="cta-footer">
        <div className="cta-footer-col">
          <span className="cta-footer-label">(a.) Product</span>
          <button className="cta-footer-link" onClick={() => navigate("/explore")}>Explore Papers</button>
          <button className="cta-footer-link" onClick={() => navigate("/upload")}>Upload PDF</button>
        </div>
        <div className="cta-footer-col">
          <span className="cta-footer-label">(b.) Tech Stack</span>
          <span className="cta-footer-link">React + Vite</span>
          <span className="cta-footer-link">Gemini 2.5 Flash</span>
          <span className="cta-footer-link">Firebase + Cloudinary</span>
        </div>
        <div className="cta-footer-col">
          <span className="cta-footer-label">(c.) Academic</span>
          <span className="cta-footer-link">Any PDF Format</span>
          <span className="cta-footer-link">Audio Playback</span>
          <span className="cta-footer-link">Section by Section</span>
        </div>
        <div className="cta-footer-col">
          <span className="cta-footer-label">(d.) Origin</span>
          <span className="cta-footer-link">KaiDoku — 解読</span>
          <span className="cta-footer-link">Built at SST, Bengaluru</span>
          <span className="cta-footer-link">EST 2026©</span>
        </div>
      </div>
    </section>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();

  const handleUpload = () => { navigate("/upload"); };
  const marqueeItems = ["Research Decoded", "Plain Language", "Section by Section", "Audio Playback", "Upload Any PDF", "AI-Powered"];

  return (
    <div className="home">
      <Navbar />
      <main>
        <Hero onUpload={handleUpload} />
        <Marquee items={marqueeItems} />
        <AboutSection />
        <Marquee items={["Attention Is All You Need", "BERT", "ImageNet", "GPT-4", "AlphaFold", "ResNet"]} />
        <ProcessSection />
        <CtaSection onUpload={handleUpload} navigate={navigate} />
      </main>
    </div>
  );
}
