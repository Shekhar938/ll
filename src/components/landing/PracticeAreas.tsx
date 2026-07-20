'use client';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './PracticeAreas.module.css';

const areas = [
  { icon: '⚖️', title: 'Criminal Law', desc: 'Bail applications, trial defense, FIR matters, anticipatory bail, and criminal appeals.' },
  { icon: '📋', title: 'Civil Law', desc: 'Recovery suits, injunctions, specific performance, and civil dispute resolution.' },
  { icon: '🏠', title: 'Property Law', desc: 'Title disputes, property registration, possession matters, and partition suits.' },
  { icon: '👨👩👧', title: 'Family Law', desc: 'Divorce proceedings, child custody, maintenance, domestic violence, and adoption.' },
  { icon: '🏢', title: 'Corporate Law', desc: 'Company incorporation, compliance, mergers, acquisitions, and shareholder disputes.' },
  { icon: '🛒', title: 'Consumer Law', desc: 'Product defects, service deficiencies, misleading advertisements, and refund matters.' },
  { icon: '👔', title: 'Labour Law', desc: 'Wrongful termination, gratuity, PF disputes, and workplace rights protection.' },
  { icon: '💰', title: 'Tax Law', desc: 'Income tax disputes, GST matters, customs, assessments, and penalty waivers.' },
  { icon: '💻', title: 'Cyber Crime', desc: 'Online fraud, data breaches, cyberstalking, hacking incidents, and digital crimes.' },
  { icon: '🏦', title: 'Banking Law', desc: 'Loan recovery, cheque bounce cases, NPA matters, and SARFAESI proceedings.' },
  { icon: '🤝', title: 'Arbitration', desc: 'Commercial disputes, enforcement of awards, and alternative dispute resolution.' },
  { icon: '💼', title: 'Employment Law', desc: 'Discrimination, harassment, wrongful dismissal, and employment benefits disputes.' },
];

export default function PracticeAreas() {
  const { t } = useLanguage();
  const areas = t.practiceAreas.areas;

  return (
    <section className={styles.section} id="areas">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.badge}>{t.practiceAreas.badge}</div>
          <h2 className={styles.heading}>{t.practiceAreas.heading}</h2>
          <p className={styles.sub}>
            {t.practiceAreas.sub}
          </p>
        </div>

        <div className={styles.grid}>
          {areas.map((area, i) => (
            <Link key={area.title} href={`/consult?area=${encodeURIComponent(area.title)}`} className={styles.card} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className={styles.icon}>{area.icon}</div>
              <h3 className={styles.cardTitle}>{area.title}</h3>
              <p className={styles.cardDesc}>{area.desc}</p>
              <div className={styles.arrow}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
