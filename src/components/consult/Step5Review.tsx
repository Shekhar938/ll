'use client';
import StepHeader from './StepHeader';
import NavButtons from './NavButtons';
import styles from './Step5Review.module.css';
import { FormData } from './ConsultForm';

interface Props {
  data: FormData;
  onBack: () => void;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string;
}

function Row({ label, value }: { label: string; value: string | boolean | undefined }) {
  if (!value && value !== false) return null;
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}</span>
    </div>
  );
}

function Section({ title, step, onEdit, children }: { title: string; step: number; onEdit: (s: number) => void; children: React.ReactNode }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        <button className={styles.editBtn} onClick={() => onEdit(step)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit
        </button>
      </div>
      <div className={styles.rows}>{children}</div>
    </div>
  );
}

export default function Step5Review({ data, onBack, onEdit, onSubmit, submitting, error }: Props) {
  return (
    <div>
      <StepHeader step={5} title="Review Your Request" desc="Please review all details carefully before submitting. You can edit any section." />

      <div className={styles.sections}>
        <Section title="Personal Information" step={1} onEdit={onEdit}>
          <Row label="Full Name" value={data.fullName} />
          <Row label="Mobile" value={data.mobile} />
          <Row label="Email" value={data.email} />
          <Row label="City" value={data.city} />
          <Row label="State" value={data.state} />
          <Row label="Language" value={data.preferredLanguage} />
          <Row label="Occupation" value={data.occupation} />
        </Section>

        <Section title="Legal Matter" step={2} onEdit={onEdit}>
          <Row label="Practice Area" value={data.practiceArea} />
          <Row label="Case Type" value={data.caseType} />
          <Row label="Case Stage" value={data.caseStage} />
          <Row label="Opponent" value={data.opponentName} />
          <Row label="Court" value={data.court} />
          <Row label="Police Station" value={data.policeStation} />
          <div className={styles.summaryBlock}>
            <span className={styles.rowLabel}>Case Summary</span>
            <p className={styles.summaryText}>{data.caseSummary}</p>
          </div>
        </Section>

        <Section title="Priority & Contact" step={3} onEdit={onEdit}>
          <Row label="Urgency" value={data.urgency.charAt(0).toUpperCase() + data.urgency.slice(1)} />
          <Row label="Contact Time" value={data.preferredContactTime.charAt(0).toUpperCase() + data.preferredContactTime.slice(1)} />
          <Row label="Video Consultation" value={data.videoConsultation} />
        </Section>

        <Section title={`Documents (${data.documents.length})`} step={4} onEdit={onEdit}>
          {data.documents.length === 0 ? (
            <p className={styles.noDoc}>No documents uploaded</p>
          ) : (
            data.documents.map((f, i) => (
              <div key={i} className={styles.docRow}>
                <span className={styles.docIcon}>📄</span>
                <span className={styles.docName}>{f.name}</span>
                <span className={styles.docSize}>{(f.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            ))
          )}
        </Section>
      </div>

      {error && (
        <div className={styles.errorBox}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}

      <div className={styles.consent}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        By submitting, you agree to our Privacy Policy and Terms of Service. Your information is encrypted and confidential.
      </div>

      <NavButtons onBack={onBack} onSubmit={onSubmit} submitting={submitting} />
    </div>
  );
}
