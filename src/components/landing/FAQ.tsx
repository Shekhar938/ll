'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './FAQ.module.css';

const faqs = [
  {
    q: 'Is my information kept confidential?',
    a: 'Absolutely. All your personal details, case information, and uploaded documents are encrypted and stored securely. We never share your information with any third party. Your privacy is our highest priority.',
  },
  {
    q: 'How long does it take to receive a response?',
    a: 'We respond to all consultation requests within 24 hours. Urgent matters (marked as High priority) are typically addressed within 2-4 hours during business hours.',
  },
  {
    q: 'What types of documents can I upload?',
    a: 'You can upload PDF files, Word documents (DOCX), and image files (JPG, PNG). Each file can be up to 20 MB in size. This allows you to share FIR copies, court orders, agreements, and other relevant legal documents.',
  },
  {
    q: 'Is this a free consultation service?',
    a: 'The initial consultation request is completely free. Once you submit your details, our advocate will review your case and contact you to discuss the consultation process and any applicable fees.',
  },
  {
    q: 'Can I request a video consultation?',
    a: 'Yes, video consultations are available. During the consultation request form, you can indicate your preference for a video call. Our advocate will schedule a suitable time with you.',
  },
  {
    q: 'What happens after I submit my consultation request?',
    a: 'After submission, our system generates a case summary and our advocate reviews your matter. You will receive a call or message at your preferred contact time. A unique case ID is generated for tracking your request.',
  },
  {
    q: 'Can I track my consultation request?',
    a: 'Yes. After submission, you will receive a unique consultation ID. You can use this ID to track the status of your request. Our team will also proactively keep you informed about any updates.',
  },
  {
    q: 'Do you handle cases from all states in India?',
    a: 'Yes, we accept consultation requests from clients across all states and union territories of India. Consultations can be conducted in person, by phone, or via video call.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const toggle = (i: number) => setOpen(open === i ? null : i);

  return (
    <>
      <section className={styles.section} id="faq">
        <div className="container">
          <div className={styles.header}>
            <div className={styles.badge}>FAQ</div>
            <h2 className={styles.heading}>Frequently Asked Questions</h2>
            <p className={styles.sub}>Everything you need to know about our legal consultation platform.</p>
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
            <h3 className={styles.ctaTitle}>Still have questions?</h3>
            <p className={styles.ctaText}>Submit a consultation request and we will personally address your query.</p>
            <Link href="/consult" className={styles.ctaBtn} id="faq-cta">Get Legal Help Now</Link>
          </div>
        </div>
      </section>
    </>
  );
}
