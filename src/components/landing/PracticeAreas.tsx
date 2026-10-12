'use client';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './PracticeAreas.module.css';

const areas = [
  { icon: '📊', title: 'Business Strategy', desc: 'Market analysis, business plan formulation, growth strategies, and execution roadmaps.' },
  { icon: '💼', title: 'Corporate Advisory', desc: 'Governance, structural restructuring, stakeholder alignment, and board compliance.' },
  { icon: '💰', title: 'Financial Consulting', desc: 'Cash flow forecasting, audit readiness, valuation, and capital allocation strategies.' },
  { icon: '🛡️', title: 'Legal & Compliance', desc: 'Regulatory compliance, contract workflows, dispute risk review, and risk management.' },
  { icon: '💻', title: 'Technology & Cloud', desc: 'Digital transformation, software systems evaluation, data governance, and tech roadmap.' },
  { icon: '🤝', title: 'Client Operations', desc: 'Service desk optimization, CRM setup, process automation, and retention strategy.' },
  { icon: '👔', title: 'HR & Talent Strategy', desc: 'Workforce structuring, leadership hiring, policy handbooks, and team development.' },
  { icon: '🛒', title: 'Consumer & Commerce', desc: 'Product lifecycle advisory, vendor agreements, refund governance, and customer care.' },
  { icon: '🔐', title: 'Cyber & Information Security', desc: 'Security audits, data privacy compliance (DPDP/GDPR), and threat mitigation.' },
  { icon: '🏦', title: 'Fintech & Banking Solutions', desc: 'Payment rails integration, debt advisory, loan structures, and fintech compliance.' },
  { icon: '🌐', title: 'Marketing & Brand Strategy', desc: 'Inbound pipeline architecture, content strategy, positioning, and market penetration.' },
  { icon: '📈', title: 'Performance Analytics', desc: 'KPI scorecards, operational metrics, executive dashboards, and efficiency audits.' },
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
