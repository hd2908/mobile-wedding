import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { config } from '../config';
import '../styles/Greeting.css';

export default function Greeting() {
  const { groom, bride, greeting } = config;
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="greeting" ref={ref}>
      <div className="greeting__divider" />
      <motion.p
        className="greeting__title"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        Invitation
      </motion.p>

      <motion.p
        className="greeting__message"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {greeting.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            <br />
          </span>
        ))}
      </motion.p>

      <motion.div
        className="greeting__parents"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <div className="greeting__parents-row">
          <span className="greeting__parents-role">신랑측</span>
          <span className="greeting__parents-name">
            {groom.father} &middot; {groom.mother}
            <strong>의 아들 {groom.name}</strong>
          </span>
        </div>
        <div className="greeting__parents-row">
          <span className="greeting__parents-role">신부측</span>
          <span className="greeting__parents-name">
            {bride.father} &middot; {bride.mother}
            <strong>의 딸 {bride.name}</strong>
          </span>
        </div>
      </motion.div>

      <motion.div
        className="greeting__contact-row"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.9, duration: 0.8 }}
      >
        <a href={`tel:${groom.phone}`} className="greeting__contact-btn">
          신랑에게 연락하기
        </a>
        <a href={`tel:${bride.phone}`} className="greeting__contact-btn">
          신부에게 연락하기
        </a>
      </motion.div>
    </section>
  );
}
