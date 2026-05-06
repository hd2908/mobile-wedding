import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { config } from '../config';
import '../styles/Menu.css';

export default function Menu() {
  const { menu } = config;
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="menu" ref={ref}>
      <motion.p
        className="menu__title"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        식사 안내
      </motion.p>

      <div className="menu__rule" />

      <motion.div
        className="menu__columns"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <div className="menu__column">
          <h4 className="menu__column-title">양식</h4>
          <ul className="menu__list">
            {menu.western.map((item, i) => (
              <li key={i} className="menu__item">{item}</li>
            ))}
          </ul>
        </div>

        <div className="menu__column-divider" />

        <div className="menu__column">
          <h4 className="menu__column-title">중식</h4>
          <ul className="menu__list">
            {menu.chinese.map((item, i) => (
              <li key={i} className="menu__item">{item}</li>
            ))}
          </ul>
        </div>
      </motion.div>

      <div className="menu__rule" />

      <motion.div
        className="menu__notice"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <p>식권은 현장에서 선택해주세요.</p>
        <p className="menu__notice-sub">
          양식과 중식 식당이 분리되어 있으니<br />
          일행분들과 같은 메뉴를 선택하시는 것을 권해드립니다.
        </p>
      </motion.div>
    </section>
  );
}
