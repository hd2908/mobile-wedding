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

  // 800vh total scroll space
  // Cover:  0 ~ 0.20
  // Groom:  0.22 ~ 0.48
  // Bride:  0.50 ~ 0.78
  // Exit:   0.78 ~ 0.88

  // SVG lines
  const pathProgress = useTransform(scrollYProgress, [0, 0.18], [0, 1]);
  const pathOpacity = useTransform(scrollYProgress, [0, 0.02, 0.16, 0.22], [0.5, 1, 1, 0]);

  // Use callback-based useTransform to avoid array-mapping subscription issues
  const coverOpacity = useTransform(scrollYProgress, (p: number) => {
    if (p <= 0.16) return 1;
    if (p >= 0.28) return 0;
    return 1 - (p - 0.16) / 0.12;
  });

  const groomOpacity = useTransform(scrollYProgress, (p: number) => {
    if (p <= 0.20) return 0;
    if (p <= 0.26) return (p - 0.20) / 0.06;
    if (p <= 0.54) return 1;
    if (p >= 0.56) return 0;
    return 1 - (p - 0.54) / 0.02;
  });

  const brideOpacity = useTransform(scrollYProgress, (p: number) => {
    if (p <= 0.48) return 0;
    if (p <= 0.54) return (p - 0.48) / 0.06;
    if (p <= 0.76) return 1;
    if (p >= 0.84) return 0;
    return 1 - (p - 0.76) / 0.08;
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
        {/* SVG background */}
        <svg
          className="hero__svg"
          viewBox="0 0 200 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <motion.line
            x1="100" y1="0" x2="100" y2="50"
            stroke="rgba(0,0,0,0.35)"
            strokeWidth="0.7"
            style={{ opacity: pathOpacity }}
          />
          <motion.path
            d="M100,50 C100,100 45,140 25,200 C5,260 30,320 100,370"
            stroke="rgba(0,0,0,0.5)"
            strokeWidth="0.8"
            fill="none"
            style={{ pathLength: pathProgress, opacity: pathOpacity }}
          />
          <motion.path
            d="M100,50 C100,100 155,140 175,200 C195,260 170,320 100,370"
            stroke="rgba(0,0,0,0.5)"
            strokeWidth="0.8"
            fill="none"
            style={{ pathLength: pathProgress, opacity: pathOpacity }}
          />
          <motion.line
            x1="100" y1="370" x2="100" y2="400"
            stroke="rgba(0,0,0,0.35)"
            strokeWidth="0.7"
            style={{ opacity: pathProgress }}
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
                <img src={groom.photo} alt={groom.name} />
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
