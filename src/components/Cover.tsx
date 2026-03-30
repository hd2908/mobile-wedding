import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { config } from '../config';
import '../styles/Cover.css';

export default function Cover() {
  const { groom, bride, wedding } = config;
  const [showDim, setShowDim] = useState(true);
  const [activeTab, setActiveTab] = useState<'groom' | 'bride'>('groom');
  const heroRef = useRef<HTMLElement>(null);
  const [greetingRef, greetingInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // SVG path draws as user scrolls through the entire hero section
  const pathProgress = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const pathOpacity = useTransform(scrollYProgress, [0, 0.05, 0.6, 0.8], [0.3, 0.8, 0.8, 0]);

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
          {/* Starting vertical line */}
          <motion.line
            x1="100" y1="0" x2="100" y2="60"
            stroke="rgba(0,0,0,0.15)"
            strokeWidth="0.5"
            style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0.4]) }}
          />
          {/* Left path - splits away then returns */}
          <motion.path
            d="M100,60 C100,110 50,160 30,240 C10,320 30,420 100,520"
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="0.6"
            fill="none"
            style={{ pathLength: pathProgress, opacity: pathOpacity }}
          />
          {/* Right path - splits away then returns */}
          <motion.path
            d="M100,60 C100,110 150,160 170,240 C190,320 170,420 100,520"
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="0.6"
            fill="none"
            style={{ pathLength: pathProgress, opacity: pathOpacity }}
          />
          {/* Ending vertical line */}
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

      {/* Invitation area - profile tabs */}
      <div className="hero__invitation" ref={greetingRef}>
        <motion.p
          className="hero__invitation-title"
          initial={{ opacity: 0, y: 20 }}
          animate={greetingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          Invitation
        </motion.p>

        <div className="hero__rule" />

        <motion.div
          className="hero__tabs"
          initial={{ opacity: 0, y: 20 }}
          animate={greetingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <button
            className={`hero__tab ${activeTab === 'groom' ? 'hero__tab--active' : ''}`}
            onClick={() => setActiveTab('groom')}
          >
            신랑
          </button>
          <button
            className={`hero__tab ${activeTab === 'bride' ? 'hero__tab--active' : ''}`}
            onClick={() => setActiveTab('bride')}
          >
            신부
          </button>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="hero__profile"
            initial={{ opacity: 0, x: activeTab === 'groom' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === 'groom' ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            {(() => {
              const person = activeTab === 'groom' ? groom : bride;
              const role = activeTab === 'groom' ? '아들' : '딸';
              return (
                <>
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

                  <div className="hero__rule hero__rule--short" />

                  <p className="hero__profile-intro">
                    {person.intro.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>

                  {activeTab === 'groom' && groom.playlist && (
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
                </>
              );
            })()}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
