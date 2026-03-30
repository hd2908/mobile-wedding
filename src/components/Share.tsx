import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { config } from '../config';
import '../styles/Share.css';

export default function Share() {
  const { groom, bride, wedding } = config;
  const [toast, setToast] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = window.location.href;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  const handleKakaoShare = () => {
    const { Kakao } = window as unknown as { Kakao?: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Share: { sendDefault: (options: unknown) => void };
    }};

    if (!Kakao) {
      alert('카카오톡 SDK가 로드되지 않았습니다');
      return;
    }
    if (!Kakao.isInitialized() && config.kakao.jsKey) {
      Kakao.init(config.kakao.jsKey);
    }
    if (!config.kakao.jsKey) {
      alert('카카오 JavaScript 키를 config.ts에 설정해주세요');
      return;
    }

    Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `${groom.name} ♥ ${bride.name} 결혼합니다`,
        description: `${wedding.date} ${wedding.time}\n${wedding.venue}`,
        imageUrl: '',
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: '청첩장 보기',
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      ],
    });
  };

  return (
    <section className="share" ref={ref}>
      <div className="share__divider" />
      <motion.p
        className="share__title"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        Share
      </motion.p>

      <motion.p
        className="share__message"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        소중한 분들에게 청첩장을 공유해주세요
      </motion.p>

      <motion.div
        className="share__buttons"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <button className="share__btn share__btn--kakao" onClick={handleKakaoShare}>
          카카오톡으로 공유하기
        </button>
        <button className="share__btn share__btn--copy" onClick={handleCopyLink}>
          링크 복사하기
        </button>
      </motion.div>

      <motion.div
        className="share__footer"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <p className="share__footer-names">
          {groom.name} <span>&amp;</span> {bride.name}
        </p>
        <p className="share__footer-date">
          {wedding.date.replace(/-/g, '. ')}
        </p>
      </motion.div>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="share__toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            링크가 복사되었습니다
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
