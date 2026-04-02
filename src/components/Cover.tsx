import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { config } from '../config';
import '../styles/Cover.css';

export default function Cover() {
  const { groom, bride, wedding } = config;
  const [showDim, setShowDim] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  });

  // 400vh total scroll space
  // Cover:  0 ~ 0.25
  // Groom:  0.25 ~ 0.55
  // Bride:  0.55 ~ 1.0

  // SVG line draws downward, ink drop spreads on impact
  const lineProgress = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const inkScale = useTransform(scrollYProgress, [0.13, 0.25], [0, 1]);
  const inkOpacity = useTransform(scrollYProgress, [0.13, 0.17], [0, 1]);

  const coverOpacity = useTransform(scrollYProgress, (p: number) => {
    if (p <= 0.20) return 1;
    if (p >= 0.30) return 0;
    return 1 - (p - 0.20) / 0.10;
  });

  const groomOpacity = useTransform(scrollYProgress, (p: number) => {
    if (p <= 0.25) return 0;
    if (p <= 0.32) return (p - 0.25) / 0.07;
    if (p <= 0.55) return 1;
    if (p >= 0.62) return 0;
    return 1 - (p - 0.55) / 0.07;
  });

  const brideOpacity = useTransform(scrollYProgress, (p: number) => {
    if (p <= 0.62) return 0;
    if (p <= 0.69) return (p - 0.62) / 0.07;
    return 1;
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) setShowDim(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="hero" ref={heroRef}>
      <div className="hero__sticky">
        {/* SVG background - vertical line + splash particles */}
        <svg
          className="hero__svg"
          viewBox="0 0 200 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <motion.line
            x1="100" y1="0" x2="100" y2="200"
            stroke="#333"
            strokeWidth="0.2"
            style={{ pathLength: lineProgress }}
          />
          {/* Ink drop */}
          <defs>
            <radialGradient id="inkGrad">
              <stop offset="0%" stopColor="#3a8b26" stopOpacity="1" />
              <stop offset="35%" stopColor="#4ca632" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#6abf4e" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#8fd47a" stopOpacity="0" />
            </radialGradient>
            <filter id="inkBlur">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>
          <motion.circle
            cx="100" cy="200" r="80"
            fill="url(#inkGrad)"
            filter="url(#inkBlur)"
            style={{
              scale: inkScale,
              opacity: inkOpacity,
              transformOrigin: '100px 200px',
            }}
          />
        </svg>

        {/* Layer 1: Cover (transparent bg, SVG visible behind) */}
        <motion.div
          className="hero__layer hero__layer--cover"
          style={{ opacity: coverOpacity }}
        >
          <div className="hero__cover-content">
            <p className="hero__date">{wedding.dateDisplay}</p>
            <h1 className="hero__names">
              <span className="hero__name">{groom.name}</span>
              <span className="hero__amp">&</span>
              <span className="hero__name">{bride.name}</span>
            </h1>
            <p className="hero__venue">{wedding.venue}</p>
          </div>
        </motion.div>

        {/* Layer 2: Groom profile */}
        <motion.div className="hero__layer" style={{ opacity: groomOpacity }}>
          <div className="hero__profile-inner">
            <p className="hero__profile-label">소개</p>
            <div className="hero__profile-photo">
              {groom.photo ? (
                <img src={groom.photo} alt={groom.name} className="hero__profile-photo--groom-zoomed" />
              ) : (
                <div className="hero__profile-photo-placeholder" />
              )}
            </div>
            <h3 className="hero__profile-name">{groom.name}</h3>
            <p className="hero__profile-parents">
              {groom.father} · {groom.mother}
              <span>의 아들</span>
            </p>
            <div className="hero__profile-rule" />
            <p className="hero__profile-intro">
              {groom.intro.split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
            </p>
            {groom.playlist && (
              <a
                href={groom.playlist}
                target="_blank"
                rel="noopener noreferrer"
                className="hero__profile-playlist"
              >
                신랑의 플레이리스트
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1" />
                </svg>
              </a>
            )}
          </div>
        </motion.div>

        {/* Layer 3: Bride profile */}
        <motion.div className="hero__layer" style={{ opacity: brideOpacity }}>
          <div className="hero__profile-inner">
            <p className="hero__profile-label">소개</p>
            <div className="hero__profile-photo">
              {bride.photo ? (
                <img src={bride.photo} alt={bride.name} className="hero__profile-photo--zoomed" />
              ) : (
                <div className="hero__profile-photo-placeholder" />
              )}
            </div>
            <h3 className="hero__profile-name">{bride.name}</h3>
            <p className="hero__profile-parents">
              {bride.father} · {bride.mother}
              <span>의 딸</span>
            </p>
            <div className="hero__profile-rule" />
            <p className="hero__profile-intro">
              {bride.intro.split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
            </p>
          </div>
        </motion.div>

        {/* Dim overlay */}
        <AnimatePresence>
          {showDim && (
            <motion.div
              className="hero__dim"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="hero__dim-bottom"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <p className="hero__dim-text">스크롤해주세요</p>
                <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                  <path d="M8 0 L8 20 M2 14 L8 20 L14 14" stroke="black" strokeWidth="1" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
