'use client';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './LanguageToggle.module.css';

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className={styles.toggleGroup}>
      <button 
        className={`${styles.toggleBtn} ${lang === 'en' ? styles.active : ''}`}
        onClick={() => setLang('en')}
        aria-label="Switch to English"
      >
        EN
      </button>
      <div className={styles.divider} />
      <button 
        className={`${styles.toggleBtn} ${lang === 'hi' ? styles.active : ''}`}
        onClick={() => setLang('hi')}
        aria-label="Switch to Hindi"
      >
        हि
      </button>
    </div>
  );
}
