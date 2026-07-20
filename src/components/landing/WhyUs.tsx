'use client';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './WhyUs.module.css';

const FEATURES = [
  {
    title: 'Bar Council Enrollment',
    desc: 'Enrolled with the Bar Council of Delhi since 2015. Enrollment Number: D/4567/2015.',
    icon: '⚖️'
  },
  {
    title: 'Academic Qualifications',
    desc: 'B.A. LL.B. (Hons.) from National Law University. LL.M. in Corporate Law.',
    icon: '🎓'
  },
  {
    title: 'Client Portal',
    desc: 'This digital portal allows clients to securely share case documents and request appointments online.',
    icon: '💻'
  }
];

export default function WhyUs() {
  const { t } = useLanguage();
  const FEATURES = t.whyUs.features;

  return (
    <section id="why" className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.imageCol}>
          <Image 
            src="/images/trust.png" 
            alt="Digital Trust and Security" 
            width={500} 
            height={500} 
            className={styles.illustration}
          />
        </div>
        <div className={styles.contentCol}>
          <h2 className={styles.title}>{t.whyUs.title}</h2>
          <p className={styles.subtitle}>{t.whyUs.subtitle}</p>
          
          <div className={styles.features}>
            {FEATURES.map((f, i) => (
              <div key={i} className={styles.feature}>
                <div className={styles.icon}>{f.icon}</div>
                <div>
                  <h3 className={styles.featureTitle}>{f.title}</h3>
                  <p className={styles.featureDesc}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
