import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { config } from '../config';
import '../styles/Calendar.css';

const DAY_HEADERS = ['일', '월', '화', '수', '목', '금', '토'];

export default function Calendar() {
  const weddingDate = dayjs(config.wedding.date);
  const year = weddingDate.year();
  const month = weddingDate.month(); // 0-indexed
  const day = weddingDate.date();
  const firstDayOfMonth = dayjs(new Date(year, month, 1)).day();
  const daysInMonth = weddingDate.daysInMonth();

  const [countdown, setCountdown] = useState(getCountdown());
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  function getCountdown() {
    const now = dayjs();
    const target = dayjs(`${config.wedding.date} ${config.wedding.time}`);
    const diff = target.diff(now);

    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const timer = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(timer);
  }, []);

  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => (
    <div key={`blank-${i}`} className="calendar__day calendar__day--empty" />
  ));

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1;
    const isWeddingDay = d === day;

    return (
      <motion.div
        key={d}
        className={`calendar__day ${isWeddingDay ? 'calendar__day--today' : ''}`}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.02 * d, duration: 0.3 }}
      >
        {d}
      </motion.div>
    );
  });

  return (
    <section className="calendar" ref={ref}>
      <div className="calendar__divider" />
      <motion.p
        className="calendar__title"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        Wedding Day
      </motion.p>

      <motion.p
        className="calendar__date-text"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {year}년 {month + 1}월 {day}일 {config.wedding.dayOfWeek}
      </motion.p>

      <motion.p
        className="calendar__time-text"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        오후 {config.wedding.time} | {config.wedding.venue}
      </motion.p>

      <motion.div
        className="calendar__grid"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        {DAY_HEADERS.map((h) => (
          <div key={h} className="calendar__day-header">{h}</div>
        ))}
        {blanks}
        {days}
      </motion.div>

      <motion.div
        className="calendar__countdown"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <div className="calendar__countdown-item">
          <span className="calendar__countdown-number">{countdown.days}</span>
          <span className="calendar__countdown-label">Days</span>
        </div>
        <span className="calendar__countdown-colon">:</span>
        <div className="calendar__countdown-item">
          <span className="calendar__countdown-number">{String(countdown.hours).padStart(2, '0')}</span>
          <span className="calendar__countdown-label">Hours</span>
        </div>
        <span className="calendar__countdown-colon">:</span>
        <div className="calendar__countdown-item">
          <span className="calendar__countdown-number">{String(countdown.minutes).padStart(2, '0')}</span>
          <span className="calendar__countdown-label">Min</span>
        </div>
        <span className="calendar__countdown-colon">:</span>
        <div className="calendar__countdown-item">
          <span className="calendar__countdown-number">{String(countdown.seconds).padStart(2, '0')}</span>
          <span className="calendar__countdown-label">Sec</span>
        </div>
      </motion.div>
    </section>
  );
}
