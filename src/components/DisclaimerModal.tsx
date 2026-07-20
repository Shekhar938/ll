'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './DisclaimerModal.module.css';

export default function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const hasAccepted = localStorage.getItem('bci_disclaimer_accepted');
    if (!hasAccepted) {
      setIsOpen(true);
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('bci_disclaimer_accepted', 'true');
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleDecline = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.icon}>⚖️</div>
          <h2 className={styles.title}>{t.disclaimerModal.title}</h2>
        </div>
        
        <div className={styles.content}>
          <p className={styles.text}>{t.disclaimerModal.p1}</p>
          <p className={styles.text}>{t.disclaimerModal.p2}</p>
          <p className={styles.text}>{t.disclaimerModal.p3}</p>
        </div>

        <div className={styles.actions}>
          <button className={styles.declineBtn} onClick={handleDecline}>{t.disclaimerModal.decline}</button>
          <button className={styles.acceptBtn} onClick={handleAccept}>{t.disclaimerModal.accept}</button>
        </div>
      </div>
    </div>
  );
}
