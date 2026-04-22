import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Thumbs, Keyboard } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/swiper-bundle.css';
import '../styles/Gallery.css';

const B = '/mobile-wedding/gall/';

type Photo = { src: string; landscape?: boolean };

const images: Photo[] = [
  { src: 'gall_image_00.webp' },
  { src: 'gall_image_01.webp' },
  { src: 'gall_image_02.webp', landscape: true },
  { src: 'gall_image_03.webp' },
  { src: 'gall_image_04.webp' },
  { src: 'gall_image_05.webp' },
  { src: 'gall_image_06.webp' },
  { src: 'gall_image_07.webp', landscape: true },
  { src: 'gall_image_08.webp' },
  { src: 'gall_image_09.webp' },
  { src: 'gall_image_10.webp', landscape: true },
  { src: 'gall_image_11.webp', landscape: true },
  { src: 'gall_image_12.webp' },
  { src: 'gall_image_13.webp' },
  { src: 'gall_image_14.webp' },
  { src: 'gall_image_15.webp' },
  { src: 'gall_image_16.webp' },
  { src: 'gall_image_17.webp' },
  { src: 'gall_image_18.webp' },
  { src: 'gall_image_19.webp', landscape: true },
  { src: 'gall_image_20.webp', landscape: true },
  { src: 'gall_image_21.webp' },
  { src: 'gall_image_22.webp' },
  { src: 'gall_image_23.webp' },
  { src: 'gall_image_24.webp' },
  { src: 'gall_image_25.webp' },
  { src: 'gall_image_26.webp' },
  { src: 'gall_image_27.webp' },
];

const src = (name: string) => B + encodeURIComponent(name);

export default function Gallery() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [thumbs, setThumbs] = useState<SwiperType | null>(null);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

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

      <motion.div
        className="gallery__stage"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Swiper
          className="gallery__main"
          modules={[Thumbs, Keyboard]}
          thumbs={{ swiper: thumbs && !thumbs.destroyed ? thumbs : null }}
          spaceBetween={8}
          keyboard={{ enabled: true }}
          onSlideChange={(s) => setActive(s.activeIndex)}
        >
          {images.map((photo, i) => (
            <SwiperSlide key={photo.src}>
              <button
                type="button"
                className={`gallery__main-slide${photo.landscape ? ' gallery__main-slide--land' : ''}`}
                onClick={() => setLightbox(i)}
                aria-label={`사진 ${i + 1} 크게 보기`}
              >
                <img
                  src={src(photo.src)}
                  alt=""
                  loading={i < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                />
                <span className="gallery__main-caption" aria-hidden>
                  눌러서 크게 보기
                </span>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="gallery__meta">
          <span className="gallery__counter">
            {String(active + 1).padStart(2, '0')}
            <span className="gallery__counter-sep"> / </span>
            {String(images.length).padStart(2, '0')}
          </span>
        </div>

        <Swiper
          className="gallery__strip"
          modules={[FreeMode, Thumbs]}
          onSwiper={setThumbs}
          slidesPerView={5.5}
          spaceBetween={6}
          freeMode
          watchSlidesProgress
          breakpoints={{
            480: { slidesPerView: 6.5, spaceBetween: 6 },
            640: { slidesPerView: 8, spaceBetween: 8 },
          }}
        >
          {images.map((photo) => (
            <SwiperSlide key={photo.src} className="gallery__thumb">
              <img
                src={src(photo.src)}
                alt=""
                loading="lazy"
                decoding="async"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="gallery__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <div className="gallery__modal" onClick={(e) => e.stopPropagation()}>
              <button
                className="gallery__close"
                onClick={() => setLightbox(null)}
                aria-label="닫기"
              >
                &times;
              </button>
              <Swiper
                className="gallery__swiper"
                modules={[Keyboard]}
                keyboard={{ enabled: true }}
                initialSlide={lightbox}
                onSlideChange={(s) => setLightbox(s.activeIndex)}
              >
                {images.map((photo) => (
                  <SwiperSlide key={photo.src}>
                    <img src={src(photo.src)} alt="" />
                  </SwiperSlide>
                ))}
              </Swiper>
              <p className="gallery__lightbox-counter">
                {lightbox + 1} / {images.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
