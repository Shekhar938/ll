'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand}>
          <div className={styles.logo}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L3 8V20L14 26L25 20V8L14 2Z" fill="#C9A227" opacity="0.15"/>
              <path d="M14 2L3 8V20L14 26L25 20V8L14 2Z" stroke="#C9A227" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M8 14H20M14 8V20" stroke="#C9A227" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className={styles.brandText}>Nyaya Aastha</span>
        </Link>

        <div className={styles.links}>
          <a href="/#areas" className={styles.link}>Practice Areas</a>
          <a href="/#why" className={styles.link}>Why Us</a>
          <a href="/#faq" className={styles.link}>FAQ</a>
          <Link href="/consult" className={styles.ctaBtn}>Request Consultation</Link>
        </div>

        <button
          className={styles.hamburger}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`${styles.bar} ${mobileOpen ? styles.barOpen1 : ''}`} />
          <span className={`${styles.bar} ${mobileOpen ? styles.barOpen2 : ''}`} />
          <span className={`${styles.bar} ${mobileOpen ? styles.barOpen3 : ''}`} />
        </button>
      </div>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <a href="/#areas" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Practice Areas</a>
          <a href="/#why" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Why Us</a>
          <a href="/#faq" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>FAQ</a>
          <Link href="/consult" className={styles.mobileCta} onClick={() => setMobileOpen(false)}>Request Consultation</Link>
        </div>
      )}
    </nav>
  );
}
