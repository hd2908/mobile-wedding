import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import dayjs from 'dayjs';
import '../styles/Guestbook.css';

interface Message {
  id: number;
  name: string;
  text: string;
  date: string;
  password: string;
}

const STORAGE_KEY = 'wedding-guestbook';

function loadMessages(): Message[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveMessages(messages: Message[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

export default function Guestbook() {
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [text, setText] = useState('');
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim() || !password.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      name: name.trim(),
      text: text.trim(),
      date: dayjs().format('YYYY.MM.DD'),
      password: password.trim(),
    };

    const updated = [newMessage, ...messages];
    setMessages(updated);
    saveMessages(updated);
    setName('');
    setPassword('');
    setText('');
  };

  const handleDelete = (id: number) => {
    const message = messages.find((m) => m.id === id);
    if (!message) return;

    const input = prompt('비밀번호를 입력하세요');
    if (input === message.password) {
      const updated = messages.filter((m) => m.id !== id);
      setMessages(updated);
      saveMessages(updated);
    } else if (input !== null) {
      alert('비밀번호가 일치하지 않습니다');
    }
  };

  return (
    <section className="guestbook" ref={ref}>
      <div className="guestbook__divider" />
      <motion.p
        className="guestbook__title"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        Guestbook
      </motion.p>

      <motion.form
        className="guestbook__form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <div className="guestbook__input-row">
          <input
            className="guestbook__input"
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
          />
          <input
            className="guestbook__input"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={20}
          />
        </div>
        <textarea
          className="guestbook__textarea"
          placeholder="축하 메시지를 남겨주세요"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={200}
        />
        <button type="submit" className="guestbook__submit">
          등록하기
        </button>
      </motion.form>

      <div className="guestbook__messages">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className="guestbook__message"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="guestbook__message-header">
                <span className="guestbook__message-name">{msg.name}</span>
                <span className="guestbook__message-date">{msg.date}</span>
              </div>
              <p className="guestbook__message-text">{msg.text}</p>
              <button
                className="guestbook__delete-btn"
                onClick={() => handleDelete(msg.id)}
              >
                삭제
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
