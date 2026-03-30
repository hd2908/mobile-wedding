import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import '../styles/Gallery.css';

const placeholderColors = ['#d4c5b0', '#c9b99a', '#bfaf8e', '#b8a888', '#c4b69c'];

export default function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="gallery" ref={ref}>
      <div className="gallery__divider" />
      <motion.p
        className="gallery__title"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        Gallery
      </motion.p>

      <div className="gallery__grid">
        {placeholderColors.map((color, i) => (
          <motion.div
            key={i}
            className="gallery__item"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 * i, duration: 0.5 }}
            onClick={() => setSelected(i)}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.75rem',
                letterSpacing: '2px',
              }}
            >
              PHOTO {i + 1}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="gallery__modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <div className="gallery__modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="gallery__modal-close" onClick={() => setSelected(null)}>
                &times;
              </button>
              <Swiper
                className="gallery__swiper"
                initialSlide={selected}
                onSlideChange={(swiper) => setSelected(swiper.activeIndex)}
              >
                {placeholderColors.map((color, i) => (
                  <SwiperSlide key={i}>
                    <div
                      style={{
                        width: '100%',
                        height: '60vh',
                        background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1rem',
                        letterSpacing: '3px',
                      }}
                    >
                      PHOTO {i + 1}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="gallery__modal-counter">
                {selected + 1} / {placeholderColors.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
