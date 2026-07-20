'use client';
import { useState } from 'react';
import StepHeader from './StepHeader';
import NavButtons from './NavButtons';
import fieldStyles from './FormField.module.css';
import styles from './Steps.module.css';
import { FormData } from './ConsultForm';
import { PRACTICE_AREAS, CASE_TYPES } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

const CASE_STAGES = ['Pending', 'Notice Received', 'FIR', 'Court Case', 'Need Advice'];

interface Props { data: FormData; update: (u: Partial<FormData>) => void; onNext: () => void; onBack: () => void; }

function validate(data: FormData, t: any) {
  const errs: Partial<Record<keyof FormData, string>> = {};
  if (!data.practiceArea) errs.practiceArea = t.consult.step2.errors.practiceArea;
  if (!data.caseType) errs.caseType = t.consult.step2.errors.caseType;
  if (!data.caseSummary.trim()) errs.caseSummary = t.consult.step2.errors.caseSummary;
  else if (data.caseSummary.trim().length < 30) errs.caseSummary = t.consult.step2.errors.summaryShort;
  if (!data.caseStage) errs.caseStage = t.consult.step2.errors.caseStage;
  return errs;
}

export default function Step2Legal({ data, update, onNext, onBack }: Props) {
  const { t } = useLanguage();
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const caseTypes = data.practiceArea ? (CASE_TYPES[data.practiceArea] || []) : [];
  const charLen = data.caseSummary.length;

  const handleNext = () => {
    const errs = validate(data, t);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onNext();
  };

  return (
    <div>
      <StepHeader step={2} title={t.consult.step2.title} desc={t.consult.step2.desc} />
      <div className={styles.stack}>
        <div className={styles.grid2}>
          <div className={fieldStyles.group}>
            <label className={fieldStyles.label}>{t.consult.step2.practiceArea} <span className={fieldStyles.required}>*</span></label>
            <select className={`${fieldStyles.select} ${errors.practiceArea ? fieldStyles.error : ''}`} value={data.practiceArea}
              onChange={(e) => { update({ practiceArea: e.target.value, caseType: '' }); setErrors((p) => ({ ...p, practiceArea: '' })); }}>
              <option value="">{t.consult.step2.selectPractice}</option>
              {PRACTICE_AREAS.map((a) => <option key={a}>{a}</option>)}
            </select>
            {errors.practiceArea && <span className={fieldStyles.errorMsg}>{errors.practiceArea}</span>}
          </div>
          <div className={fieldStyles.group}>
            <label className={fieldStyles.label}>{t.consult.step2.caseType} <span className={fieldStyles.required}>*</span></label>
            <select className={`${fieldStyles.select} ${errors.caseType ? fieldStyles.error : ''}`} value={data.caseType} disabled={!data.practiceArea}
              onChange={(e) => { update({ caseType: e.target.value }); setErrors((p) => ({ ...p, caseType: '' })); }}>
              <option value="">{t.consult.step2.selectCaseType}</option>
              {caseTypes.map((t) => <option key={t}>{t}</option>)}
            </select>
            {errors.caseType && <span className={fieldStyles.errorMsg}>{errors.caseType}</span>}
          </div>
        </div>

        <div className={`${fieldStyles.group} ${styles.colSpan2}`}>
          <label className={fieldStyles.label}>{t.consult.step2.caseSummary} <span className={fieldStyles.required}>*</span></label>
          <textarea className={`${fieldStyles.textarea} ${errors.caseSummary ? fieldStyles.error : ''}`}
            placeholder={t.consult.step2.summaryPlaceholder} rows={6}
            maxLength={1000} value={data.caseSummary}
            onChange={(e) => { update({ caseSummary: e.target.value }); setErrors((p) => ({ ...p, caseSummary: '' })); }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {errors.caseSummary ? <span className={fieldStyles.errorMsg}>{errors.caseSummary}</span> : <span />}
            <span className={`${fieldStyles.charCount} ${charLen > 900 ? fieldStyles.limit : charLen > 700 ? fieldStyles.warn : ''}`}>{charLen}/1000</span>
          </div>
        </div>

        <div className={styles.grid2}>
          <div className={fieldStyles.group}>
            <label className={fieldStyles.label}>{t.consult.step2.opponent}</label>
            <input className={fieldStyles.input} placeholder={t.consult.step2.opponentPlaceholder} value={data.opponentName} onChange={(e) => update({ opponentName: e.target.value })} />
          </div>
          <div className={fieldStyles.group}>
            <label className={fieldStyles.label}>{t.consult.step2.stage} <span className={fieldStyles.required}>*</span></label>
            <select className={`${fieldStyles.select} ${errors.caseStage ? fieldStyles.error : ''}`} value={data.caseStage}
              onChange={(e) => { update({ caseStage: e.target.value }); setErrors((p) => ({ ...p, caseStage: '' })); }}>
              <option value="">{t.consult.step2.selectStage}</option>
              {CASE_STAGES.map((s) => <option key={s}>{s}</option>)}
            </select>
            {errors.caseStage && <span className={fieldStyles.errorMsg}>{errors.caseStage}</span>}
          </div>
          <div className={fieldStyles.group}>
            <label className={fieldStyles.label}>{t.consult.step2.court} <span className={fieldStyles.hint}>{t.consult.step2.optional}</span></label>
            <input className={fieldStyles.input} placeholder={t.consult.step2.courtPlaceholder} value={data.court} onChange={(e) => update({ court: e.target.value })} />
          </div>
          <div className={fieldStyles.group}>
            <label className={fieldStyles.label}>{t.consult.step2.station} <span className={fieldStyles.hint}>{t.consult.step2.optional}</span></label>
            <input className={fieldStyles.input} placeholder={t.consult.step2.stationPlaceholder} value={data.policeStation} onChange={(e) => update({ policeStation: e.target.value })} />
          </div>
        </div>
      </div>
      <NavButtons onBack={onBack} onNext={handleNext} />
    </div>
  );
}
