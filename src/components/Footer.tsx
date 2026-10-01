'use client';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Footer.module.css';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <path d="M14 2L3 8V20L14 26L25 20V8L14 2Z" fill="#C9A227" opacity="0.2"/>
                <path d="M14 2L3 8V20L14 26L25 20V8L14 2Z" stroke="#C9A227" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M8 14H20M14 8V20" stroke="#C9A227" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className={styles.brandName}>{t.footer.brand}</span>
          </div>
          <p className={styles.tagline}>{t.footer.tagline}</p>
          <p className={styles.desc}>{t.footer.desc}</p>
        </div>

        <div className={styles.links}>
          <div className={styles.col}>
            <h4 className={styles.colTitle}>{t.footer.infoCol}</h4>
            <Link href="/consult" className={styles.colLink}>{t.footer.clientPortal}</Link>
            <a href="/#areas" className={styles.colLink}>{t.footer.practiceAreas}</a>
            <a href="/#why" className={styles.colLink}>{t.footer.profile}</a>
          </div>
          <div className={styles.col}>
            <h4 className={styles.colTitle}>{t.footer.legalCol}</h4>
            <Link href="/privacy" className={styles.colLink}>{t.footer.privacy}</Link>
            <Link href="/terms" className={styles.colLink}>{t.footer.terms}</Link>
            <Link href="/disclaimer" className={styles.colLink}>{t.footer.disclaimer}</Link>
          </div>
          <div className={styles.col}>
            <h4 className={styles.colTitle}>{t.footer.contactCol}</h4>
            <p className={styles.address}>{t.footer.address}</p>
            <a href="tel:+919999999999" className={styles.colLink}>+91 99999 99999</a>
            <a href="mailto:contact@nyayaaastha.in" className={styles.colLink}>contact@nyayaaastha.in</a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <p className={styles.copy}>{t.footer.copy}</p>
          <Link href="/admin" className={styles.adminLink}>{t.footer.admin}</Link>
        </div>
      </div>
    </footer>
  );
}
