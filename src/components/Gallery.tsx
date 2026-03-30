import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { config } from '../config';
import '../styles/Gallery.css';

export default function Gallery() {
  const { gallery } = config;
  const [selected, setSelected] = useState<number | null>(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="gallery" ref={ref}>
      <motion.p
        className="gallery__title"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        갤러리
      </motion.p>

      <div className="gallery__rule" />

      <div className="gallery__grid">
        {gallery.map((photo, i) => (
          <motion.div
            key={photo.id}
            className="gallery__item"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.05 * i, duration: 0.5 }}
            onClick={() => setSelected(i)}
          >
            {photo.src ? (
              <img src={photo.src} alt={photo.alt} />
            ) : (
              <div className="gallery__placeholder">
                <span>{String(i + 1).padStart(2, '0')}</span>
              </div>
            )}
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
                {gallery.map((photo, i) => (
                  <SwiperSlide key={photo.id}>
                    {photo.src ? (
                      <img src={photo.src} alt={photo.alt} />
                    ) : (
                      <div className="gallery__modal-placeholder">
                        <span>{String(i + 1).padStart(2, '0')}</span>
                      </div>
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="gallery__modal-counter">
                {selected + 1} / {gallery.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
