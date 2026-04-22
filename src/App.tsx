import { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import Cover from './components/Cover';
import Location from './components/Location';
import Menu from './components/Menu';
import Account from './components/Account';
import Gallery from './components/Gallery';
import Guestbook from './components/Guestbook';
import Share from './components/Share';
import './styles/App.css';

// Phase 0 (cover + ink drop) gets 3x scroll length; others are 1x.
// Container height: (3 + 8) * 100svh = 1100svh.
// scrollYProgress boundaries — phase N is active when p < BOUNDS[N].
const BOUNDS = [3 / 11, 4 / 11, 5 / 11, 6 / 11, 7 / 11, 8 / 11, 9 / 11, 10 / 11];
const COVER_SEGMENT = BOUNDS[0]; // phase 0's scroll range end
const FADE = { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const };

function getPhase(p: number): number {
  for (let i = 0; i < BOUNDS.length; i++) {
    if (p < BOUNDS[i]) return i;
  }
  return BOUNDS.length;
}

function Slide({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <motion.div
      className="app__slide"
      animate={{ opacity: active ? 1 : 0 }}
      transition={FADE}
      style={{ pointerEvents: active ? 'auto' : 'none' }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);
  const [showDim, setShowDim] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    return scrollYProgress.on('change', (p) => {
      setPhase(getPhase(p));
    });
  }, [scrollYProgress]);

  useEffect(() => {
    const h = () => { if (window.scrollY > 10) setShowDim(false); };
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <div ref={containerRef} className="app">
      <div className="app__sticky">
        <Cover
          phase={phase}
          scrollYProgress={scrollYProgress}
          segment={COVER_SEGMENT}
        />

        <Slide active={phase === 3}><Location /></Slide>
        <Slide active={phase === 4}><Gallery /></Slide>
        <Slide active={phase === 5}><Menu /></Slide>
        <Slide active={phase === 6}><Account /></Slide>
        <Slide active={phase === 7}><Guestbook /></Slide>
        <Slide active={phase === 8}><Share /></Slide>

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
