'use client';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from '@/app/consult/page.module.css';

export default function ConsultPageHeader() {
  const { t } = useLanguage();
  return (
    <>
      <h1 className={styles.heading}>{t.consult.page.title}</h1>
      <p className={styles.sub}>{t.consult.page.sub}</p>

      <div style={{
        marginTop: 18,
        padding: '10px 16px',
        background: 'rgba(201, 162, 39, 0.15)',
        border: '1px solid rgba(201, 162, 39, 0.4)',
        borderRadius: 8,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13,
        fontWeight: 600,
        color: '#FCE8A6'
      }}>
        <span>🔒 Already a client?</span>
        <Link href="/portal" style={{ color: '#FFE082', textDecoration: 'underline', fontWeight: 700 }}>
          Login to Client Portal & Track Case Status ➔
        </Link>
      </div>
    </>
  );
}
