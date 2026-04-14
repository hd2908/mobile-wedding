import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import dayjs from 'dayjs';
import { supabase, hashPassword } from '../lib/supabase';
import '../styles/Guestbook.css';

interface GuestMessage {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getCardStyle(id: string) {
  const seed = id.charCodeAt(0) + id.charCodeAt(1);
  const rotate = (seededRandom(seed) - 0.5) * 6;
  return { rotate };
}

export default function Guestbook() {
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [text, setText] = useState('');
  const [selectedMsg, setSelectedMsg] = useState<GuestMessage | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const seenIds = useRef(new Set<string>());
  const isFirstLoad = useRef(true);

  const fetchMessages = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from('guestbook')
      .select('id, name, message, created_at')
      .order('created_at', { ascending: false });
    if (data) {
      setMessages(data);
      // 첫 로드 후 기존 ID를 모두 기록
      if (isFirstLoad.current) {
        data.forEach((m) => seenIds.current.add(m.id));
        isFirstLoad.current = false;
      }
    }
  }, []);

  useEffect(() => {
    fetchMessages();

    if (!supabase) return;
    const channel = supabase
      .channel('guestbook-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'guestbook' }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim() || !password.trim()) return;
    setSubmitting(true);

    const passwordHash = await hashPassword(password.trim());

    let ip = '';
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      ip = data.ip;
    } catch { /* IP 수집 실패해도 진행 */ }

    if (!supabase) return;
    const { error } = await supabase.from('guestbook').insert({
      name: name.trim(),
      message: text.trim(),
      password_hash: passwordHash,
      ip_address: ip,
    });

    if (!error) {
      setName('');
      setPassword('');
      setText('');
      setShowForm(false);
      await fetchMessages();
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget || !deletePassword.trim()) return;

    const pwdHash = await hashPassword(deletePassword.trim());
    if (!supabase) return;
    const { data } = await supabase.rpc('delete_guestbook_message', {
      msg_id: deleteTarget,
      pwd_hash: pwdHash,
    });

    if (data) {
      setDeleteTarget(null);
      setDeletePassword('');
      setDeleteError('');
      setSelectedMsg(null);
      await fetchMessages();
    } else {
      setDeleteError('비밀번호가 일치하지 않습니다');
    }
  };

  const cardStyles = useMemo(
    () => messages.map((msg) => getCardStyle(msg.id)),
    [messages],
  );

  return (
    <section className="guestbook" ref={ref}>
      <motion.div
        className="guestbook__header"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="guestbook__leaf" />
        <p className="guestbook__title">방명록</p>
        <p className="guestbook__subtitle">축하의 마음을 남겨주세요</p>
      </motion.div>

      <motion.button
        className="guestbook__write-btn"
        onClick={() => setShowForm(true)}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        작성하기
      </motion.button>

      {/* 카드 쌓임 영역 */}
      <LayoutGroup>
        <div className="guestbook__pile">
          <AnimatePresence>
            {messages.map((msg, i) => {
              const style = cardStyles[i];
              const isNew = !seenIds.current.has(msg.id);
              if (isNew) seenIds.current.add(msg.id);

              return (
                <motion.div
                  key={msg.id}
                  className="guestbook__mini-card"
                  layout
                  layoutId={`card-${msg.id}`}
                  initial={isNew ? { opacity: 0, y: -120, scale: 0.85 } : false}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{
                    layout: { type: 'spring', damping: 22, stiffness: 160, delay: i * 0.04 },
                    opacity: { duration: 0.35 },
                    y: isNew ? { type: 'spring', damping: 14, stiffness: 120 } : undefined,
                    scale: isNew ? { type: 'spring', damping: 14, stiffness: 120 } : undefined,
                  }}
                  onClick={() => setSelectedMsg(msg)}
                  whileTap={{ scale: 0.96 }}
                >
                  <div
                    className="guestbook__mini-inner"
                    style={{
                      background: ['#fafaf8', '#f5f9f6', '#f8f6f3', '#f4f7f5', '#f9f8f5', '#f6f8f4'][i % 6],
                      transform: `rotate(${style.rotate}deg)`,
                    }}
                  >
                    <span className="guestbook__mini-quote">"</span>
                    <span className="guestbook__mini-preview">
                      {msg.message.length > 18 ? msg.message.slice(0, 18) + '…' : msg.message}
                    </span>
                    <span className="guestbook__mini-from">— {msg.name}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </LayoutGroup>

      {/* 카드 확대 모달 */}
      <AnimatePresence>
        {selectedMsg && !deleteTarget && (
          <motion.div
            className="guestbook__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMsg(null)}
          >
            <motion.div
              className="guestbook__card-modal"
              layoutId={`card-${selectedMsg.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="guestbook__card-modal-accent" />
              <p className="guestbook__card-modal-name">{selectedMsg.name}</p>
              <p className="guestbook__card-modal-date">
                {dayjs(selectedMsg.created_at).format('YYYY.MM.DD')}
              </p>
              <div className="guestbook__card-modal-divider" />
              <p className="guestbook__card-modal-message">{selectedMsg.message}</p>
              <div className="guestbook__card-modal-footer">
                <button
                  className="guestbook__card-modal-delete"
                  onClick={() => {
                    setDeleteTarget(selectedMsg.id);
                    setDeleteError('');
                    setDeletePassword('');
                  }}
                >
                  삭제
                </button>
                <button
                  className="guestbook__card-modal-close"
                  onClick={() => setSelectedMsg(null)}
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 작성 팝업 */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="guestbook__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              className="guestbook__modal"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="guestbook__modal-accent" />
              <p className="guestbook__modal-title">축하 메시지</p>
              <form className="guestbook__form" onSubmit={handleSubmit}>
                <input
                  className="guestbook__input"
                  type="text"
                  placeholder="이름"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={20}
                  autoFocus
                />
                <input
                  className="guestbook__input"
                  type="password"
                  placeholder="비밀번호 (삭제 시 필요)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={20}
                />
                <textarea
                  className="guestbook__textarea"
                  placeholder="축하의 마음을 남겨주세요"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  maxLength={200}
                />
                <p className="guestbook__privacy">
                  등록 시 개인정보보호법 제15조에 따라 비정상 이용 방지
                  목적으로 IP 주소가 수집되며, 게시일로부터 6개월 후
                  자동 파기됩니다.
                </p>
                <div className="guestbook__form-actions">
                  <button
                    type="button"
                    className="guestbook__modal-btn guestbook__modal-btn--cancel"
                    onClick={() => setShowForm(false)}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="guestbook__modal-btn guestbook__modal-btn--confirm"
                    disabled={submitting}
                  >
                    {submitting ? '등록 중...' : '등록'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 삭제 확인 모달 */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="guestbook__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setDeleteTarget(null); setSelectedMsg(null); }}
          >
            <motion.div
              className="guestbook__modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="guestbook__modal-title">비밀번호 확인</p>
              <input
                className="guestbook__input"
                type="password"
                placeholder="비밀번호 입력"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleDelete()}
                autoFocus
              />
              {deleteError && <p className="guestbook__modal-error">{deleteError}</p>}
              <div className="guestbook__modal-actions">
                <button
                  className="guestbook__modal-btn guestbook__modal-btn--cancel"
                  onClick={() => { setDeleteTarget(null); setSelectedMsg(null); }}
                >
                  취소
                </button>
                <button
                  className="guestbook__modal-btn guestbook__modal-btn--confirm"
                  onClick={handleDelete}
                >
                  삭제
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
