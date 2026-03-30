import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { config } from '../config';
import '../styles/Location.css';

export default function Location() {
  const { wedding, transport } = config;
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const openNaverMap = () => {
    window.open(
      `https://map.naver.com/v5/search/${encodeURIComponent(wedding.address)}`,
      '_blank'
    );
  };

  const openKakaoMap = () => {
    window.open(
      `https://map.kakao.com/link/search/${encodeURIComponent(wedding.address)}`,
      '_blank'
    );
  };

  const openTMap = () => {
    window.open(
      `https://apis.openapi.sk.com/tmap/app/routes?appKey=&name=${encodeURIComponent(wedding.venue)}&lon=${wedding.lng}&lat=${wedding.lat}`,
      '_blank'
    );
  };

  return (
    <section className="location" ref={ref}>
      <div className="location__divider" />
      <motion.p
        className="location__title"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        Location
      </motion.p>

      <motion.h3
        className="location__venue-name"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        {wedding.venue} {wedding.hall}
      </motion.h3>

      <motion.p
        className="location__address"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {wedding.address}
      </motion.p>

      <motion.div
        className="location__map"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #e8ddd0, #d4c5b0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '2rem' }}>&#x1F4CD;</span>
          <span style={{ fontSize: '0.8rem', color: '#888' }}>지도 영역</span>
          <span style={{ fontSize: '0.7rem', color: '#aaa' }}>카카오맵 API 키 설정 후 표시됩니다</span>
        </div>
      </motion.div>

      <motion.div
        className="location__buttons"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <button className="location__btn" onClick={openNaverMap}>
          네이버 지도
        </button>
        <button className="location__btn" onClick={openKakaoMap}>
          카카오맵
        </button>
        <button className="location__btn" onClick={openTMap}>
          티맵
        </button>
      </motion.div>

      <motion.div
        className="location__transport"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <p className="location__transport-title">교통 안내</p>
        {transport.map((item, i) => (
          <p key={i} className="location__transport-item">
            <span className="location__transport-label">{item.label}</span>
            {item.description}
          </p>
        ))}
      </motion.div>
    </section>
  );
}
