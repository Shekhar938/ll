'use client';
import StepHeader from './StepHeader';
import NavButtons from './NavButtons';
import styles from './Steps.module.css';
import { FormData } from './ConsultForm';
import { useLanguage } from '@/contexts/LanguageContext';

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

function Section({ title, step, onEdit, editLabel, children }: { title: string; step: number; onEdit: (s: number) => void; editLabel: string; children: React.ReactNode }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        <button className={styles.editBtn} onClick={() => onEdit(step)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          {editLabel}
        </button>
      </div>
      <div className={styles.rows}>{children}</div>
    </div>
  );
}

export default function Step5Review({ data, onBack, onEdit, onSubmit, submitting, error }: Props) {
  const { t } = useLanguage();
  return (
    <div>
      <StepHeader step={5} title={t.consult.step5.title} desc={t.consult.step5.desc} />

      <div className={styles.stack}>
        {/* Personal Details */}
        <div className={styles.reviewSection}>
          <div className={styles.reviewHeader}>
            <h3 className={styles.reviewTitle}>{t.consult.step5.personal}</h3>
            <button className={styles.editBtn} onClick={() => onEdit(1)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              {t.consult.step5.edit}
            </button>
          </div>
          <div className={styles.reviewGrid}>
            <div className={styles.reviewItem}>
              <div className={styles.reviewLabel}>{t.consult.step1.fullName}</div>
              <div className={styles.reviewValue}>{data.fullName}</div>
            </div>
            <div className={styles.reviewItem}>
              <div className={styles.reviewLabel}>{t.consult.step1.mobile}</div>
              <div className={styles.reviewValue}>+91 {data.mobile}</div>
            </div>
            <div className={styles.reviewItem}>
              <div className={styles.reviewLabel}>{t.consult.step1.email}</div>
              <div className={styles.reviewValue}>{data.email}</div>
            </div>
            <div className={styles.reviewItem}>
              <div className={styles.reviewLabel}>{t.consult.step1.city}, {t.consult.step1.state}</div>
              <div className={styles.reviewValue}>{data.city ? (t.districts as Record<string,string>)[data.city] : ''}, {data.state ? (t.states as Record<string,string>)[data.state] : ''}</div>
            </div>
            <div className={styles.reviewItem}>
              <div className={styles.reviewLabel}>{t.consult.step1.prefLang}</div>
              <div className={styles.reviewValue}>{data.preferredLanguage ? (t.languages as Record<string,string>)[data.preferredLanguage] : ''}</div>
            </div>
          </div>
        </div>

        <Section title={t.consult.step5.legal} step={2} onEdit={onEdit} editLabel={t.consult.step5.edit}>
          <Row label={t.consult.step2.practiceArea} value={data.practiceArea} />
          <Row label={t.consult.step2.caseType} value={data.caseType} />
          <Row label={t.consult.step2.stage} value={data.caseStage} />
          <Row label={t.consult.step2.opponent} value={data.opponentName} />
          <Row label={t.consult.step2.court} value={data.court} />
          <Row label={t.consult.step2.station} value={data.policeStation} />
          <div className={styles.summaryBlock}>
            <span className={styles.rowLabel}>{t.consult.step2.caseSummary}</span>
            <p className={styles.summaryText}>{data.caseSummary}</p>
          </div>
        </Section>

        <Section title={t.consult.step5.prefs} step={3} onEdit={onEdit} editLabel={t.consult.step5.edit}>
          <Row label={t.consult.step3.urgency} value={data.urgency === 'low' ? t.consult.step3.urgLow : data.urgency === 'medium' ? t.consult.step3.urgMed : t.consult.step3.urgHigh} />
          <Row label={t.consult.step3.contactTime} value={data.preferredContactTime === 'morning' ? t.consult.step3.timeMorn : data.preferredContactTime === 'afternoon' ? t.consult.step3.timeAft : t.consult.step3.timeEve} />
          <Row label={t.consult.step3.video} value={data.videoConsultation ? 'Yes' : 'No'} />
        </Section>

        {/* Documents */}
        <div className={styles.reviewSection}>
          <div className={styles.reviewHeader}>
            <h3 className={styles.reviewTitle}>{t.consult.step5.docs}</h3>
            <button className={styles.editBtn} onClick={() => onEdit(4)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              {t.consult.step5.edit}
            </button>
          </div>
          {data.documents.length === 0 ? (
            <p className={styles.noDocs}>{t.consult.step5.noDocs}</p>
          ) : (
            <div className={styles.docList}>
              {data.documents.map((file, i) => (
                <div key={i} className={styles.docItem}>
                  <span>📄</span>
                  <span className={styles.docName}>{file.name}</span>
                  <span className={styles.docSize}>({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className={styles.errorBox}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}

      <div className={styles.consent}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        {t.consult.step5.consent}
      </div>

      <NavButtons onBack={onBack} onSubmit={onSubmit} submitting={submitting} />
    </div>
  );
}
