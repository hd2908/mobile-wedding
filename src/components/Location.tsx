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

  return (
    <section className="location" ref={ref}>
      <motion.p
        className="location__title"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        오시는 길
      </motion.p>

      <div className="location__rule" />

      <motion.div
        className="location__info"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <h3 className="location__venue-name">{wedding.venue}</h3>
        {wedding.hall && <p className="location__hall">{wedding.hall}</p>}
        <p className="location__address">{wedding.address}</p>
      </motion.div>

      <motion.div
        className="location__map"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="location__map-placeholder">
          <span>MAP</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <button className="location__btn" onClick={openNaverMap}>
          네이버 지도에서 보기
        </button>
      </motion.div>

      <div className="location__rule" />

      <motion.div
        className="location__transport"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        {transport.map((item, i) => (
          <div key={i} className="location__transport-item">
            <span className="location__transport-label">{item.label}</span>
            <span className="location__transport-desc">{item.description}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
