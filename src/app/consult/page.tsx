import type { Metadata } from 'next';
import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import ConsultForm from '@/components/consult/ConsultForm';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Request Consultation – NyayaConnect',
  description: 'Submit your legal consultation request securely. Describe your issue, upload documents, and get expert legal guidance.',
};

export default function ConsultPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.header}>
          <div className="container">
            <div className={styles.headerInner}>
              <h1 className={styles.heading}>Request a Consultation</h1>
              <p className={styles.sub}>Fill in the details below and we will get back to you promptly.</p>
            </div>
          </div>
        </div>
        <div className="container">
          <Suspense fallback={<div>Loading form...</div>}>
            <ConsultForm />
          </Suspense>
        </div>
      </main>
    </>
  );
}
