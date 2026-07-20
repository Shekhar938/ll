import Image from 'next/image';
import styles from './WhyUs.module.css';

const FEATURES = [
  {
    title: 'Personalized Attention',
    desc: 'You work directly with me. No middlemen, no passed-around files. Your case gets my undivided focus.',
    icon: '🤝'
  },
  {
    title: 'Digital Efficiency',
    desc: 'Upload documents, schedule consultations, and track progress securely online without unnecessary office visits.',
    icon: '⚡'
  },
  {
    title: 'Absolute Privacy',
    desc: 'All communications and documents are end-to-end encrypted and treated with strict attorney-client privilege.',
    icon: '🔒'
  }
];

export default function WhyUs() {
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
          <h2 className={styles.title}>Why Choose Me</h2>
          <p className={styles.subtitle}>Modern legal practice designed for your convenience.</p>
          
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
