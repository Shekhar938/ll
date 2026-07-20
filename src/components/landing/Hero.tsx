'use client';
import Link from 'next/link';
import styles from './Hero.module.css';

const stats = [
  { value: '500+', label: 'Consultations' },
  { value: '15+', label: 'Practice Areas' },
  { value: '12', label: 'Years Experience' },
  { value: '98%', label: 'Client Trust' },
];

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.grid} />
      </div>

      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Trusted Legal Platform
          </div>
          <h1 className={styles.heading}>
            Legal Guidance
            <span className={styles.accent}> You Can Trust</span>
          </h1>
          <p className={styles.sub}>
            Describe your legal issue securely and receive professional consultation from experienced Indian advocates. Confidential, transparent, and fast.
          </p>
          <div className={styles.ctas}>
            <Link href="/consult" className={styles.primaryBtn} id="hero-cta">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              Request Consultation
            </Link>
            <a href="/#areas" className={styles.secondaryBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 8 16 12 12 16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              Explore Areas
            </a>
          </div>

          <div className={styles.trust}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>Secure &amp; Confidential &nbsp;·&nbsp; No Data Sharing &nbsp;·&nbsp; Privacy Protected</span>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>
              </div>
              <div>
                <h3 className={styles.cardTitle}>Legal Consultation</h3>
                <p className={styles.cardSub}>Secure & Confidential</p>
              </div>
              <div className={styles.cardStatus}>
                <span className={styles.statusDot} /> Live
              </div>
            </div>

            <div className={styles.steps}>
              {[
                { icon: '01', label: 'Describe your issue', done: true },
                { icon: '02', label: 'Upload documents', done: true },
                { icon: '03', label: 'Review & submit', done: false },
                { icon: '04', label: 'Get consultation', done: false },
              ].map((step) => (
                <div key={step.icon} className={`${styles.step} ${step.done ? styles.stepDone : ''}`}>
                  <div className={styles.stepNum}>{step.done ? '✓' : step.icon}</div>
                  <span className={styles.stepLabel}>{step.label}</span>
                </div>
              ))}
            </div>

            <div className={styles.cardFooter}>
              <div className={styles.avatars}>
                {['A', 'B', 'C', 'D'].map((l, i) => (
                  <div key={l} className={styles.avatar} style={{ zIndex: 4 - i, marginLeft: i ? -10 : 0 }}>{l}</div>
                ))}
              </div>
              <span className={styles.cardFooterText}>500+ consultations helped</span>
            </div>
          </div>

          <div className={styles.floatCard1}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            <span>FIR matter resolved</span>
          </div>

          <div className={styles.floatCard2}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>5.0 rating</span>
          </div>
        </div>
      </div>

      <div className={`container ${styles.stats}`}>
        {stats.map((s) => (
          <div key={s.label} className={styles.stat}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
