import styles from './WhyUs.module.css';

const features = [
  {
    icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>),
    title: 'Strictly Confidential',
    desc: 'Your case details and personal information are encrypted and never shared with any third party.',
    color: '#0B1F3A',
  },
  {
    icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>),
    title: 'Fully Transparent',
    desc: 'Clear communication about your case, process, and expected outcomes at every step of the journey.',
    color: '#C9A227',
  },
  {
    icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>),
    title: 'Experienced Advocates',
    desc: 'Decades of combined experience across all major practice areas of Indian law and courts.',
    color: '#34C759',
  },
  {
    icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
    title: 'Fast Response',
    desc: 'We respond to every consultation request within 24 hours, prioritizing urgent legal matters.',
    color: '#FF9F0A',
  },
  {
    icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>),
    title: 'Secure Document Sharing',
    desc: 'Upload sensitive legal documents through our encrypted, secure platform with full privacy controls.',
    color: '#5856D6',
  },
  {
    icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>),
    title: 'Trusted Legal Advice',
    desc: 'Over 500 satisfied clients across India trust our platform for their most sensitive legal matters.',
    color: '#FF3B30',
  },
];

export default function WhyUs() {
  return (
    <section className={styles.section} id="why">
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.left}>
            <div className={styles.badge}>Why Choose Us</div>
            <h2 className={styles.heading}>
              The Legal Platform
              <span className={styles.accent}> Built for Trust</span>
            </h2>
            <p className={styles.sub}>
              We combine technology with legal expertise to make professional legal consultation accessible, secure, and transparent for every Indian citizen.
            </p>
            <div className={styles.metric}>
              <div className={styles.metricItem}>
                <span className={styles.metricVal}>500+</span>
                <span className={styles.metricLabel}>Happy Clients</span>
              </div>
              <div className={styles.metricDivider} />
              <div className={styles.metricItem}>
                <span className={styles.metricVal}>12+</span>
                <span className={styles.metricLabel}>Years Active</span>
              </div>
              <div className={styles.metricDivider} />
              <div className={styles.metricItem}>
                <span className={styles.metricVal}>98%</span>
                <span className={styles.metricLabel}>Satisfaction</span>
              </div>
            </div>
          </div>

          <div className={styles.right}>
            {features.map((f) => (
              <div key={f.title} className={styles.card}>
                <div className={styles.iconWrap} style={{ color: f.color, background: `${f.color}18` }}>
                  {f.icon}
                </div>
                <div>
                  <h3 className={styles.cardTitle}>{f.title}</h3>
                  <p className={styles.cardDesc}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
