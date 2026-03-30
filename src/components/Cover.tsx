import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, type MotionValue } from 'framer-motion';
import { config } from '../config';
import '../styles/Cover.css';

type Person = typeof config.groom | typeof config.bride;

function ProfileCard({
  person,
  role,
  opacity,
  playlist,
}: {
  person: Person;
  role: string;
  opacity: MotionValue<number>;
  playlist?: string;
}) {
  return (
    <motion.div className="hero__profile" style={{ opacity }}>
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

  // 600vh total, offset ['start start', 'end end'] = 500vh of scroll
  // Phase 1: Cover + SVG draw  0 ~ 0.30  (150vh - SVG 완성까지)
  // Phase 2: Groom             0.32 ~ 0.55 (115vh viewing)
  // Phase 3: Bride             0.58 ~ 0.82 (120vh viewing)
  // Phase 4: Fade out          0.82 ~ 0.92

  // Cover content - stays while SVG draws
  const coverOpacity = useTransform(scrollYProgress, [0, 0.22, 0.3], [1, 1, 0]);

  // SVG lines - fully drawn by 0.30, then stays, fades at end
  const pathProgress = useTransform(scrollYProgress, [0, 0.28], [0, 1]);
  const pathOpacity = useTransform(scrollYProgress, [0, 0.05, 0.7, 0.88], [0.2, 0.6, 0.6, 0]);

  // Invitation title - appears after SVG completes
  const titleOpacity = useTransform(scrollYProgress, [0.28, 0.34, 0.84, 0.9], [0, 1, 1, 0]);

  // Groom profile - appears after SVG fully drawn
  const groomOpacity = useTransform(scrollYProgress, [0.3, 0.36, 0.5, 0.56], [0, 1, 1, 0]);

  // Bride profile
  const brideOpacity = useTransform(scrollYProgress, [0.54, 0.6, 0.78, 0.86], [0, 1, 1, 0]);

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
            stroke="rgba(0,0,0,0.12)"
            strokeWidth="0.5"
            style={{ opacity: pathOpacity }}
          />
          <motion.path
            d="M100,50 C100,100 45,140 25,200 C5,260 30,320 100,370"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="0.6"
            fill="none"
            style={{ pathLength: pathProgress, opacity: pathOpacity }}
          />
          <motion.path
            d="M100,50 C100,100 155,140 175,200 C195,260 170,320 100,370"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="0.6"
            fill="none"
            style={{ pathLength: pathProgress, opacity: pathOpacity }}
          />
          <motion.line
            x1="100" y1="370" x2="100" y2="400"
            stroke="rgba(0,0,0,0.12)"
            strokeWidth="0.5"
            style={{ opacity: pathProgress }}
          />
        </svg>

        {/* Cover content */}
        <motion.div className="hero__cover-content" style={{ opacity: coverOpacity }}>
          <p className="hero__date">{wedding.dateDisplay}</p>
          <h1 className="hero__names">
            <span className="hero__name">{groom.name}</span>
            <span className="hero__amp">&</span>
            <span className="hero__name">{bride.name}</span>
          </h1>
          <p className="hero__venue">{wedding.venue}</p>
        </motion.div>

        {/* Invitation title */}
        <motion.p className="hero__invitation-title" style={{ opacity: titleOpacity }}>
          소개
        </motion.p>

        {/* Profile cards - stacked, opacity-controlled */}
        <div className="hero__profiles">
          <ProfileCard
            person={groom}
            role="아들"
            opacity={groomOpacity}
            playlist={groom.playlist || undefined}
          />
          <ProfileCard
            person={bride}
            role="딸"
            opacity={brideOpacity}
          />
        </div>

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
