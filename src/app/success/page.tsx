import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Thank You – NyayaConnect',
  description: 'Your consultation request has been submitted successfully.',
};

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <svg className={styles.checkIcon} viewBox="0 0 52 52">
            <circle className={styles.checkCircle} cx="26" cy="26" r="25" fill="none" />
            <path className={styles.checkMark} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        </div>

        <h1 className={styles.heading}>Request Submitted!</h1>
        <p className={styles.message}>
          Your consultation request has been received. Our advocate will review your case and contact you at your preferred time.
        </p>

        {id && (
          <div className={styles.idBox}>
            <span className={styles.idLabel}>Your Reference ID</span>
            <span className={styles.idValue}>{id}</span>
            <span className={styles.idHint}>Save this ID to track your request</span>
          </div>
        )}

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <div>
              <p className={styles.stepTitle}>Case Review</p>
              <p className={styles.stepDesc}>Our advocate reviews your case details</p>
            </div>
          </div>
          <div className={styles.stepLine} />
          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <div>
              <p className={styles.stepTitle}>Contact</p>
              <p className={styles.stepDesc}>We reach you at your preferred time</p>
            </div>
          </div>
          <div className={styles.stepLine} />
          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <div>
              <p className={styles.stepTitle}>Consultation</p>
              <p className={styles.stepDesc}>Professional legal guidance provided</p>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryBtn}>Return to Home</Link>
          <Link href="/consult" className={styles.secondaryBtn}>New Request</Link>
        </div>
      </div>
    </main>
  );
}
