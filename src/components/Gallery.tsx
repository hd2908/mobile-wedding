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
  { src: 'KakaoTalk_Photo_2026-04-20-15-36-28 003.webp' },
  { src: 'KakaoTalk_Photo_2026-04-20-15-36-28 004.webp' },
  { src: 'KakaoTalk_Photo_2026-04-20-15-36-28 005.webp' },
  { src: 'KakaoTalk_Photo_2026-04-20-15-36-28 006.webp' },
  { src: 'KakaoTalk_Photo_2026-04-20-15-36-28 007.webp' },
  { src: 'KakaoTalk_Photo_2026-04-20-15-36-28 008.webp' },
  { src: 'KakaoTalk_Photo_2026-04-20-15-36-28 009.webp' },
  { src: 'KakaoTalk_Photo_2026-04-20-15-36-28 010.webp' },
  { src: 'KakaoTalk_Photo_2026-04-20-15-36-28 011.webp' },
  { src: 'KakaoTalk_Photo_2026-04-20-15-36-28 012.webp' },
  { src: 'KakaoTalk_Photo_2026-04-20-15-36-28 013.webp' },
  { src: 'KakaoTalk_Photo_2026-04-20-15-36-28 014.webp', landscape: true },
  { src: 'KakaoTalk_Photo_2026-04-20-15-36-28 015.webp', landscape: true },
  { src: 'KakaoTalk_Photo_2026-04-20-15-36-28 016.webp' },
  { src: 'KakaoTalk_Photo_2026-04-20-15-36-28 017.webp', landscape: true },
  { src: 'KakaoTalk_Photo_2026-04-20-15-36-28 018.webp' },
  { src: 'KakaoTalk_Photo_2026-04-20-15-36-28 019.webp' },
  { src: 'KakaoTalk_Photo_2026-04-20-15-36-29 020.webp' },
  { src: 'KakaoTalk_Photo_2026-04-20-15-36-29 021.webp' },
  { src: 'KakaoTalk_Photo_2026-04-20-15-36-29 022.webp' },
  { src: 'KakaoTalk_Photo_2026-04-20-15-36-29 023.webp' },
  { src: 'KakaoTalk_Photo_2026-04-20-15-36-29 024.webp', landscape: true },
  { src: 'KakaoTalk_Photo_2026-04-20-15-36-29 026.webp' },
  { src: 'KakaoTalk_Photo_2026-04-20-15-36-29 028.webp' },
  { src: 'KakaoTalk_Photo_2026-04-20-15-36-29 029.webp' },
  { src: 'KakaoTalk_Photo_2026-04-20-15-36-29 030.webp' },
  { src: 'KakaoTalk_Photo_2026-04-20-15-37-01.webp' },
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
