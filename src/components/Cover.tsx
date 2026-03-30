import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { config } from '../config';
import '../styles/Cover.css';

function ProfileCard({
  person,
  role,
  opacity,
  playlist,
}: {
  person: typeof config.groom;
  role: string;
  opacity: ReturnType<typeof useTransform>;
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
  const heroRef = useRef<HTMLElement>(null);
  const invitationRef = useRef<HTMLDivElement>(null);

  // Hero-level scroll for SVG animation
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Invitation section scroll for profile fade transition
  const { scrollYProgress: invProgress } = useScroll({
    target: invitationRef,
    offset: ['start start', 'end end'],
  });

  // SVG path
  const pathProgress = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const pathOpacity = useTransform(scrollYProgress, [0, 0.03, 0.4, 0.6], [0.3, 0.8, 0.8, 0]);

  // Profile fade: groom visible first half, bride visible second half
  const groomOpacity = useTransform(invProgress, [0, 0.35, 0.45, 0.5], [1, 1, 0, 0]);
  const brideOpacity = useTransform(invProgress, [0.45, 0.55, 0.95, 1], [0, 1, 1, 1]);
  // Title label transition
  const labelOpacity = useTransform(invProgress, [0, 0.1], [0, 1]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setShowDim(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      {/* SVG animation spanning entire hero */}
      <div className="hero__svg-container">
        <svg
          viewBox="0 0 200 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="hero__svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <motion.line
            x1="100" y1="0" x2="100" y2="60"
            stroke="rgba(0,0,0,0.15)"
            strokeWidth="0.5"
            style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0.4]) }}
          />
          <motion.path
            d="M100,60 C100,110 50,160 30,240 C10,320 30,420 100,520"
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="0.6"
            fill="none"
            style={{ pathLength: pathProgress, opacity: pathOpacity }}
          />
          <motion.path
            d="M100,60 C100,110 150,160 170,240 C190,320 170,420 100,520"
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="0.6"
            fill="none"
            style={{ pathLength: pathProgress, opacity: pathOpacity }}
          />
          <motion.line
            x1="100" y1="520" x2="100" y2="600"
            stroke="rgba(0,0,0,0.15)"
            strokeWidth="0.5"
            style={{ opacity: pathProgress }}
          />
        </svg>
      </div>

      {/* Cover area - first viewport */}
      <div className="hero__cover">
        <div className="hero__cover-content">
          <motion.p
            className="hero__date"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            {wedding.dateDisplay}
          </motion.p>

          <motion.h1
            className="hero__names"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <span className="hero__name">{groom.name}</span>
            <span className="hero__amp">&</span>
            <span className="hero__name">{bride.name}</span>
          </motion.h1>

          <motion.p
            className="hero__venue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            {wedding.venue}
          </motion.p>
        </div>

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

      {/* Invitation - scroll-locked profile transition */}
      <div className="hero__invitation" ref={invitationRef}>
        <div className="hero__invitation-sticky">
          <motion.p className="hero__invitation-title" style={{ opacity: labelOpacity }}>
            소개
          </motion.p>

          <div className="hero__invitation-cards">
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
        </div>
      </div>
    </section>
  );
}
