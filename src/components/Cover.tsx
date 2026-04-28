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

  // 500vh total scroll space — 3 phases split evenly
  // Cover:  0       ~ 1/3
  // Groom:  1/3     ~ 2/3
  // Bride:  2/3     ~ 1

  const lineProgress = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const inkScale = useTransform(scrollYProgress, [0.18, 0.33], [0, 1]);
  const inkOpacity = useTransform(scrollYProgress, [0.18, 0.23], [0, 1]);

  const coverOpacity = useTransform(scrollYProgress, (p: number) => {
    if (p <= 0.29) return 1;
    if (p >= 0.37) return 0;
    return 1 - (p - 0.29) / 0.08;
  });

  const groomOpacity = useTransform(scrollYProgress, (p: number) => {
    if (p <= 0.29) return 0;
    if (p <= 0.37) return (p - 0.29) / 0.08;
    if (p <= 0.63) return 1;
    if (p >= 0.70) return 0;
    return 1 - (p - 0.63) / 0.07;
  });

  const brideOpacity = useTransform(scrollYProgress, (p: number) => {
    if (p <= 0.63) return 0;
    if (p <= 0.70) return (p - 0.63) / 0.07;
    return 1;
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) setShowDim(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const phaseOf = (p: number) => {
      if (p <= 1 / 3) return 'cover';
      if (p <= 2 / 3) return 'groom';
      if (p < 1) return 'bride';
      return 'past';
    };
    let lastPhase = phaseOf(scrollYProgress.get());
    return scrollYProgress.on('change', (p) => {
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const heroEl = heroRef.current;
      const heroTop = heroEl?.getBoundingClientRect().top ?? 0;
      const heroH = heroEl?.offsetHeight ?? 0;
      console.log(
        `[cover] p=${p.toFixed(4)}  scrollY=${scrollY}  vh=${vh}  heroH=${heroH}  heroTop=${heroTop.toFixed(1)}`
      );
      const next = phaseOf(p);
      if (next !== lastPhase) {
        console.log(
          `%c[transition] ${lastPhase} → ${next}  p=${p.toFixed(4)}  scrollY=${scrollY}`,
          'color:#00A94F; font-weight:bold'
        );
        lastPhase = next;
      }
    });
  }, [scrollYProgress]);

  return (
    <div className="hero" ref={heroRef}>
      <div className="hero__sticky">
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
          <defs>
            <radialGradient id="inkGrad">
              <stop offset="0%" stopColor="#00A94F" stopOpacity="1" />
              <stop offset="35%" stopColor="#2EBD6E" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#5CD18D" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#8AE5AC" stopOpacity="0" />
            </radialGradient>
            <filter id="inkBlur">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>
          <motion.circle
            cx="100" cy="200" r="100"
            fill="url(#inkGrad)"
            filter="url(#inkBlur)"
            style={{
              scale: inkScale,
              opacity: inkOpacity,
              transformOrigin: '100px 200px',
            }}
          />
        </svg>

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
          </div>
        </motion.div>

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
