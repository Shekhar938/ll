'use client';
import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Step1Personal from './Step1Personal';
import Step2Legal from './Step2Legal';
import Step3Priority from './Step3Priority';
import Step4Documents from './Step4Documents';
import Step5Review from './Step5Review';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './ConsultForm.module.css';

export type FormData = {
  fullName: string; mobile: string; email: string; city: string;
  state: string; preferredLanguage: string; occupation: string;
  practiceArea: string; caseType: string; caseSummary: string;
  opponentName: string; court: string; policeStation: string; caseStage: string;
  urgency: 'low' | 'medium' | 'high';
  preferredContactTime: string; videoConsultation: boolean;
  documents: File[];
};



const INITIAL: FormData = {
  fullName: '', mobile: '', email: '', city: '', state: 'Bihar', preferredLanguage: '', occupation: '',
  practiceArea: '', caseType: '', caseSummary: '', opponentName: '', court: '', policeStation: '', caseStage: '',
  urgency: 'medium', preferredContactTime: 'morning', videoConsultation: false, documents: [],
};

export default function ConsultForm() {
  const router = useRouter();
  const params = useSearchParams();
  const areaParam = params.get('area') || '';
  const { t } = useLanguage();

  const STEPS = [
    { num: 1, label: t.consult.steps[1] },
    { num: 2, label: t.consult.steps[2] },
    { num: 3, label: t.consult.steps[3] },
    { num: 4, label: t.consult.steps[4] },
    { num: 5, label: t.consult.steps[5] },
  ];

  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>({ ...INITIAL, practiceArea: areaParam });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const update = useCallback((updates: Partial<FormData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const scrollToForm = () => {
    const el = document.getElementById('consult-form');
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100; // 100px offset for fixed navbar
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const next = () => { setStep((s) => Math.min(s + 1, 5)); scrollToForm(); };
  const back = () => { setStep((s) => Math.max(s - 1, 1)); scrollToForm(); };
  const goTo = (s: number) => { if (s < step) { setStep(s); scrollToForm(); } };

  const submit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const payload = { ...data, documents: data.documents.map((f) => ({ name: f.name, size: f.size, type: f.type })) };
      const res = await fetch('/api/consult', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Submission failed');
      router.push(`/success?id=${json.id}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div id="consult-form" className={styles.wrapper}>
      {/* Stepper */}
      <div className={styles.stepper}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        {STEPS.map((s) => (
          <button key={s.num} className={`${styles.stepBtn} ${step === s.num ? styles.stepActive : ''} ${step > s.num ? styles.stepDone : ''}`} onClick={() => goTo(s.num)} disabled={s.num > step}>
            <div className={styles.stepCircle}>
              {step > s.num ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              ) : s.num}
            </div>
            <span className={styles.stepLabel}>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Form card */}
      <div className={styles.card}>
        {step === 1 && <Step1Personal data={data} update={update} onNext={next} />}
        {step === 2 && <Step2Legal data={data} update={update} onNext={next} onBack={back} />}
        {step === 3 && <Step3Priority data={data} update={update} onNext={next} onBack={back} />}
        {step === 4 && <Step4Documents data={data} update={update} onNext={next} onBack={back} />}
        {step === 5 && <Step5Review data={data} onBack={back} onEdit={goTo} onSubmit={submit} submitting={submitting} error={error} />}
      </div>
    </div>
  );
}
