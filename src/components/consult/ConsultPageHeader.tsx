'use client';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from '@/app/consult/page.module.css';

export default function ConsultPageHeader() {
  const { t } = useLanguage();
  return (
    <>
      <h1 className={styles.heading}>{t.consult.page.title}</h1>
      <p className={styles.sub}>{t.consult.page.sub}</p>
    </>
  );
}
