'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './FAQ.module.css';

const faqs = [
  {
    q: 'Is client information kept confidential and secure?',
    a: 'Yes, absolutely. All client communications, records, and uploaded attachments are encrypted at rest and in transit. Your business data remains strictly confidential and protected.',
  },
  {
    q: 'How quickly does the team respond to consultation requests?',
    a: 'Consultation inquiries are acknowledged immediately, and a specialist will contact you within 24 hours. High-priority inquiries receive same-day priority review.',
  },
  {
    q: 'What types of documents can clients upload?',
    a: 'You can upload PDF files, Word documents (DOCX), spreadsheets, and high-resolution images (JPG, PNG) up to 20 MB each.',
  },
  {
    q: 'Can clients schedule virtual video meetings?',
    a: 'Yes. When booking a consultation, you can select video conferencing or phone call based on your preference.',
  },
  {
    q: 'How does the Client Portal login work?',
    a: 'Clients receive a Consultation ID upon submission. By entering this ID or their registered mobile number, clients can securely review project status, messages, and office notes anytime.',
  },
  {
    q: 'Can this platform support multiple service departments?',
    a: 'Yes, ClientFlow provides multi-category routing across strategy, finance, technology, compliance, and client operations.',
  },
];

export default function FAQ() {
  const { t } = useLanguage();
  const faqs = t.faq.faqs;
  const [open, setOpen] = useState<number | null>(null);
  const toggle = (i: number) => setOpen(open === i ? null : i);

  return (
    <>
      <section className={styles.section} id="faq">
        <div className="container">
          <div className={styles.header}>
            <div className={styles.badge}>{t.faq.badge}</div>
            <h2 className={styles.heading}>{t.faq.heading}</h2>
            <p className={styles.sub}>{t.faq.sub}</p>
          </div>

          <div className={styles.list}>
            {faqs.map((faq, i) => (
              <div key={i} className={`${styles.item} ${open === i ? styles.itemOpen : ''}`}>
                <button className={styles.question} onClick={() => toggle(i)} aria-expanded={open === i}>
                  <span>{faq.q}</span>
                  <div className={`${styles.icon} ${open === i ? styles.iconOpen : ''}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </button>
                {open === i && (
                  <div className={styles.answer}>
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.cta}>
            <h3 className={styles.ctaTitle}>{t.faq.stillQuestions}</h3>
            <p className={styles.ctaText}>{t.faq.submitQuery}</p>
            <Link href="/consult" className={styles.ctaBtn} id="faq-cta">{t.faq.clientPortalBtn}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
