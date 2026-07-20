import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <div className={`${styles.badge} animate-fadeInUp`}>
            <span className={styles.badgePulse} />
            Advocate Aastha's Digital Practice
          </div>
          
          <h1 className={`${styles.title} animate-fadeInUp`} style={{ animationDelay: '0.1s' }}>
            Expert Legal Guidance, <span className="gradient-text">Digitally Delivered.</span>
          </h1>
          
          <p className={`${styles.desc} animate-fadeInUp`} style={{ animationDelay: '0.2s' }}>
            I provide secure, private, and transparent legal consultation. Request an appointment online and get the professional advice you deserve, tailored to your unique case.
          </p>
          
          <div className={`${styles.actions} animate-fadeInUp`} style={{ animationDelay: '0.3s' }}>
            <Link href="/consult" className={styles.primaryBtn}>
              Request Consultation
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
            <a href="#why" className={styles.secondaryBtn}>Why Choose Me</a>
          </div>
          
          <div className={`${styles.trust} animate-fadeIn`} style={{ animationDelay: '0.6s' }}>
            <div className={styles.avatars}>
              <div className={styles.avatar}>A</div>
              <div className={styles.avatar}>S</div>
              <div className={styles.avatar}>R</div>
            </div>
            <p className={styles.trustText}>Trusted by 500+ clients across India</p>
          </div>
        </div>
        
        <div className={`${styles.imageWrap} animate-scaleIn`} style={{ animationDelay: '0.3s' }}>
          <Image 
            src="/images/hero.png" 
            alt="Advocate Aastha" 
            width={600} 
            height={600} 
            className={styles.illustration}
            priority
          />
        </div>
      </div>
    </section>
  );
}
