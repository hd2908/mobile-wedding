import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import '../styles/Gallery.css';

const B = '/mobile-wedding/gallery/';

type Row =
  | { type: 'solo'; src: string; landscape?: boolean }
  | { type: 'duo'; items: { src: string; flex: number }[] }
  | { type: 'trio'; left: string; right: [string, string] };

const rows: Row[] = [
  { type: 'solo', src: 'black1.jpg' },
  { type: 'duo', items: [{ src: 'white2.jpg', flex: 6 }, { src: 'charcol1.jpg', flex: 4 }] },
  { type: 'solo', src: 'black4.jpg', landscape: true },
  { type: 'duo', items: [{ src: 'brown3.jpg', flex: 4 }, { src: 'brown2.jpg', flex: 6 }] },
  { type: 'solo', src: 'brown1.jpg', landscape: true },
  { type: 'trio', left: 'brown4.jpg', right: ['black2.jpg', 'charcol2.jpg'] },
  { type: 'solo', src: 'brown5.jpg', landscape: true },
  { type: 'duo', items: [{ src: 'out2.jpg', flex: 5 }, { src: 'out5.jpg', flex: 5 }] },
  { type: 'solo', src: 'out4.jpg', landscape: true },
  { type: 'duo', items: [{ src: 'out3.jpg', flex: 6 }, { src: 'black3.jpg', flex: 4 }] },
  { type: 'solo', src: 'brown6.jpg', landscape: true },
  { type: 'duo', items: [{ src: 'white3.jpg', flex: 5 }, { src: 'white4.jpg', flex: 5 }] },
  { type: 'solo', src: 'out6.jpg', landscape: true },
  { type: 'duo', items: [{ src: 'white1.png', flex: 5 }, { src: 'black5.png', flex: 5 }] },
  { type: 'solo', src: 'out1.png', landscape: true },
];

// Flatten for swiper order
const allImages: string[] = [];
for (const row of rows) {
  if (row.type === 'solo') allImages.push(row.src);
  else if (row.type === 'duo') for (const item of row.items) allImages.push(item.src);
  else { allImages.push(row.left); for (const s of row.right) allImages.push(s); }
}

export default function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  const open = (src: string) => setSelected(allImages.indexOf(src));

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
        className="gallery__grid"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {rows.map((row, ri) => {
          if (row.type === 'solo') {
            return (
              <div
                key={ri}
                className={`gallery__solo${row.landscape ? ' gallery__solo--land' : ''}`}
                onClick={() => open(row.src)}
              >
                <img src={B + row.src} alt="" loading={ri < 2 ? 'eager' : 'lazy'} />
              </div>
            );
          }
          if (row.type === 'duo') {
            return (
              <div key={ri} className="gallery__duo">
                {row.items.map((item) => (
                  <div
                    key={item.src}
                    className="gallery__cell"
                    style={{ flex: item.flex }}
                    onClick={() => open(item.src)}
                  >
                    <img src={B + item.src} alt="" loading={ri < 2 ? 'eager' : 'lazy'} />
                  </div>
                ))}
              </div>
            );
          }
          // trio
          return (
            <div key={ri} className="gallery__trio">
              <div className="gallery__cell gallery__trio-main" onClick={() => open(row.left)}>
                <img src={B + row.left} alt="" loading="lazy" />
              </div>
              <div className="gallery__trio-stack">
                {row.right.map((src) => (
                  <div key={src} className="gallery__cell" onClick={() => open(src)}>
                    <img src={B + src} alt="" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="gallery__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <div className="gallery__modal" onClick={(e) => e.stopPropagation()}>
              <button className="gallery__close" onClick={() => setSelected(null)}>
                &times;
              </button>
              <Swiper
                className="gallery__swiper"
                initialSlide={selected}
                onSlideChange={(s) => setSelected(s.activeIndex)}
              >
                {allImages.map((src, i) => (
                  <SwiperSlide key={i}>
                    <img src={B + src} alt="" />
                  </SwiperSlide>
                ))}
              </Swiper>
              <p className="gallery__counter">
                {selected + 1} / {allImages.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
