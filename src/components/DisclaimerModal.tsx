'use client';
import { useState, useEffect } from 'react';
import styles from './DisclaimerModal.module.css';

export default function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('bci_disclaimer_accepted');
    if (!hasAccepted) {
      setIsOpen(true);
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('bci_disclaimer_accepted', 'true');
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleDecline = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.icon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h2 className={styles.title}>Disclaimer</h2>
        </div>
        
        <div className={styles.content}>
          <p>The Bar Council of India does not permit advertisement or solicitation by advocates in any form or manner.</p>
          <p>By accessing this website (www.nyayaaastha.in), you acknowledge and confirm that you are seeking information relating to Advocate Aastha of your own accord and that there has been no form of solicitation, advertisement, or inducement by Advocate Aastha or her members.</p>
          <p>The content of this website is for informational purposes only and should not be interpreted as soliciting or advertisement. No material/information provided on this website should be construed as legal advice.</p>
        </div>

        <div className={styles.actions}>
          <button className={styles.declineBtn} onClick={handleDecline}>Decline</button>
          <button className={styles.acceptBtn} onClick={handleAccept}>I Agree</button>
        </div>
      </div>
    </div>
  );
}
