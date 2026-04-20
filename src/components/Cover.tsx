import { motion, useTransform, type MotionValue } from 'framer-motion';
import { config } from '../config';
import '../styles/Cover.css';

interface Props {
  phase: number;
  scrollYProgress: MotionValue<number>;
  segment: number;
}

const FADE = { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const };

export default function Cover({ phase, scrollYProgress, segment }: Props) {
  const { groom, bride, wedding } = config;

  // Scroll-linked only within phase 0's scroll range
  const lineProgress = useTransform(scrollYProgress, [0, segment * 0.6], [0, 1]);
  const inkScale = useTransform(scrollYProgress, [segment * 0.55, segment * 1.0], [0, 1]);
  const inkOpacity = useTransform(scrollYProgress, [segment * 0.55, segment * 0.7], [0, 1]);

  const active = phase <= 2;

  return (
    <motion.div
      className="app__slide app__slide--transparent"
      animate={{ opacity: active ? 1 : 0 }}
      transition={FADE}
      style={{ pointerEvents: active ? 'auto' : 'none' }}
    >
      {/* SVG — line + ink drop (only visible during phase 0) */}
      <motion.svg
        className="hero__svg"
        viewBox="0 0 200 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        animate={{ opacity: phase === 0 ? 1 : 0 }}
        transition={FADE}
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
      </motion.svg>

      {/* Cover main — names/date/venue */}
      <motion.div
        className="hero__layer hero__layer--cover"
        animate={{ opacity: phase === 0 ? 1 : 0 }}
        transition={FADE}
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

      {/* Groom */}
      <motion.div
        className="hero__layer"
        animate={{ opacity: phase === 1 ? 1 : 0 }}
        transition={FADE}
        style={{ pointerEvents: phase === 1 ? 'auto' : 'none' }}
      >
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
              신랑&신부가 직접 고른 플레이리스트
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1" />
              </svg>
            </a>
          )}
        </div>
      </motion.div>

      {/* Bride */}
      <motion.div
        className="hero__layer"
        animate={{ opacity: phase === 2 ? 1 : 0 }}
        transition={FADE}
        style={{ pointerEvents: phase === 2 ? 'auto' : 'none' }}
      >
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
          {bride.playlist && (
            <a
              href={bride.playlist}
              target="_blank"
              rel="noopener noreferrer"
              className="hero__profile-playlist"
            >
              신랑&신부가 직접 고른 플레이리스트
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1" />
              </svg>
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
