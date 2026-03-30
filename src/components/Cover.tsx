import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, type MotionValue } from 'framer-motion';
import { config } from '../config';
import '../styles/Cover.css';

type Person = typeof config.groom | typeof config.bride;

function ProfileLayer({
  person,
  role,
  opacity,
  playlist,
  zIndex,
}: {
  person: Person;
  role: string;
  opacity: MotionValue<number>;
  playlist?: string;
  zIndex?: number;
}) {
  return (
    <motion.div className="hero__layer" style={{ opacity, zIndex }}>
      <div className="hero__profile-inner">
        <p className="hero__profile-label">소개</p>
        <div className="hero__profile-photo">
          {person.photo ? (
            <img src={person.photo} alt={person.name} />
          ) : (
            <div className="hero__profile-photo-placeholder" />
          )}
        </div>
        <h3 className="hero__profile-name">{person.name}</h3>
        <p className="hero__profile-parents">
          {person.father} · {person.mother}
          <span>의 {role}</span>
        </p>
        <div className="hero__profile-rule" />
        <p className="hero__profile-intro">
          {person.intro.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </p>
        {playlist && (
          <a
            href={playlist}
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
  );
}

export default function Cover() {
  const { groom, bride, wedding } = config;
  const [showDim, setShowDim] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  });

  // 800vh total, 700vh of actual scroll
  // Cover:  0 ~ 0.20  (140vh)
  // Groom:  0.22 ~ 0.48  (182vh)
  // Bride:  0.50 ~ 0.78  (196vh)
  // Exit:   0.78 ~ 0.88

  // Cover layer (transparent bg, SVG shows through)
  // Stays visible until groom is fully opaque, then drops
  const coverOpacity = useTransform(scrollYProgress, [0, 0.16, 0.26, 0.28], [1, 1, 1, 0]);

  // SVG lines
  const pathProgress = useTransform(scrollYProgress, [0, 0.18], [0, 1]);
  const pathOpacity = useTransform(scrollYProgress, [0, 0.02, 0.16, 0.22], [0.5, 1, 1, 0]);

  // Groom layer (white bg)
  // Stays at 1 until bride is fully opaque at 0.54, then drops
  const groomOpacity = useTransform(scrollYProgress, [0.20, 0.26, 0.54, 0.56], [0, 1, 1, 0]);

  // Bride layer (white bg, on top)
  const brideOpacity = useTransform(scrollYProgress, [0.48, 0.54, 0.76, 0.84], [0, 1, 1, 0]);

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
        {/* SVG background - z-index 0 */}
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
          style={{ opacity: coverOpacity, zIndex: 1 }}
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

        {/* Layer 2: Groom profile (white bg, covers everything behind) */}
        <ProfileLayer
          person={groom}
          role="아들"
          opacity={groomOpacity}
          playlist={groom.playlist || undefined}
          zIndex={2}
        />

        {/* Layer 3: Bride profile (white bg, covers everything behind) */}
        <ProfileLayer
          person={bride}
          role="딸"
          opacity={brideOpacity}
          zIndex={3}
        />

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
