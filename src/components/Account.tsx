import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { config } from '../config';
import '../styles/Account.css';

interface AccountInfo {
  bank: string;
  number: string;
  holder: string;
}

function AccountItem({ account }: { account: AccountInfo }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(account.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = account.number;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="account__item">
      <div className="account__info">
        <span className="account__bank">{account.bank}</span>
        <span className="account__number">{account.number}</span>
        <span className="account__holder">{account.holder}</span>
      </div>
      <button
        className={`account__copy-btn ${copied ? 'account__copy-btn--copied' : ''}`}
        onClick={handleCopy}
      >
        {copied ? '복사완료' : '복사하기'}
      </button>
    </div>
  );
}

function AccountGroup({ label, accounts }: { label: string; accounts: AccountInfo[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="account__group">
      <div className="account__group-header" onClick={() => setOpen(!open)}>
        <span className="account__group-label">{label}</span>
        <span className={`account__group-toggle ${open ? 'account__group-toggle--open' : ''}`}>
          &#x25BE;
        </span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="account__list"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {accounts.map((acc, i) => (
              <AccountItem key={i} account={acc} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Account() {
  const { groom, bride } = config;
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const groomAccounts = [groom.account, groom.fatherAccount, groom.motherAccount];
  const brideAccounts = [bride.account, bride.fatherAccount, bride.motherAccount];

  return (
    <section className="account" ref={ref}>
      <div className="account__divider" />
      <motion.p
        className="account__title"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        Gift
      </motion.p>

      <motion.p
        className="account__subtitle"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        축하의 마음을 전해주세요
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <AccountGroup label="신랑측 계좌번호" accounts={groomAccounts} />
        <AccountGroup label="신부측 계좌번호" accounts={brideAccounts} />
      </motion.div>
    </section>
  );
}
