import { motion } from 'framer-motion';
import { config } from '../config';
import '../styles/Cover.css';

export default function Cover() {
  const { groom, bride, wedding } = config;

  return (
    <section className="cover">
      <div className="cover__bg-pattern" />
      <motion.div
        className="cover__content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <motion.p
          className="cover__label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Wedding Invitation
        </motion.p>

        <motion.div
          className="cover__ornament"
          initial={{ width: 0 }}
          animate={{ width: 60 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        />

        <motion.h1
          className="cover__names"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {groom.name}
          <span>&amp;</span>
          {bride.name}
        </motion.h1>

        <motion.p
          className="cover__date"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          {wedding.date.replace(/-/g, '. ')}. {wedding.dayOfWeek}
        </motion.p>

        <motion.p
          className="cover__venue"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          {wedding.venue} {wedding.hall}
        </motion.p>
      </motion.div>

      <motion.div
        className="cover__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
      >
        <span className="cover__scroll-text">Scroll</span>
        <motion.div
          className="cover__scroll-line"
          animate={{ scaleY: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originY: 0 }}
        />
      </motion.div>
    </section>
  );
}
