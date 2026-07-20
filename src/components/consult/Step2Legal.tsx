'use client';
import { useState } from 'react';
import StepHeader from './StepHeader';
import NavButtons from './NavButtons';
import fieldStyles from './FormField.module.css';
import styles from './Steps.module.css';
import { FormData } from './ConsultForm';
import { PRACTICE_AREAS, CASE_TYPES } from '@/lib/utils';

const CASE_STAGES = ['Pending', 'Notice Received', 'FIR', 'Court Case', 'Need Advice'];

interface Props { data: FormData; update: (u: Partial<FormData>) => void; onNext: () => void; onBack: () => void; }

function validate(data: FormData) {
  const errs: Partial<Record<keyof FormData, string>> = {};
  if (!data.practiceArea) errs.practiceArea = 'Please select a practice area';
  if (!data.caseType) errs.caseType = 'Please select a case type';
  if (!data.caseSummary.trim()) errs.caseSummary = 'Case summary is required';
  else if (data.caseSummary.trim().length < 30) errs.caseSummary = 'Please provide at least 30 characters';
  if (!data.caseStage) errs.caseStage = 'Please select a case stage';
  return errs;
}

export default function Step2Legal({ data, update, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const caseTypes = data.practiceArea ? (CASE_TYPES[data.practiceArea] || []) : [];
  const charLen = data.caseSummary.length;

  const handleNext = () => {
    const errs = validate(data);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onNext();
  };

  return (
    <div>
      <StepHeader step={2} title="Legal Matter" desc="Describe your legal issue so we can understand how to help you best." />
      <div className={styles.stack}>
        <div className={styles.grid2}>
          <div className={fieldStyles.group}>
            <label className={fieldStyles.label}>Practice Area <span className={fieldStyles.required}>*</span></label>
            <select className={`${fieldStyles.select} ${errors.practiceArea ? fieldStyles.error : ''}`} value={data.practiceArea}
              onChange={(e) => { update({ practiceArea: e.target.value, caseType: '' }); setErrors((p) => ({ ...p, practiceArea: '' })); }}>
              <option value="">Select Practice Area</option>
              {PRACTICE_AREAS.map((a) => <option key={a}>{a}</option>)}
            </select>
            {errors.practiceArea && <span className={fieldStyles.errorMsg}>{errors.practiceArea}</span>}
          </div>
          <div className={fieldStyles.group}>
            <label className={fieldStyles.label}>Case Type <span className={fieldStyles.required}>*</span></label>
            <select className={`${fieldStyles.select} ${errors.caseType ? fieldStyles.error : ''}`} value={data.caseType} disabled={!data.practiceArea}
              onChange={(e) => { update({ caseType: e.target.value }); setErrors((p) => ({ ...p, caseType: '' })); }}>
              <option value="">Select Case Type</option>
              {caseTypes.map((t) => <option key={t}>{t}</option>)}
            </select>
            {errors.caseType && <span className={fieldStyles.errorMsg}>{errors.caseType}</span>}
          </div>
        </div>

        <div className={fieldStyles.group}>
          <label className={fieldStyles.label}>Case Summary <span className={fieldStyles.required}>*</span></label>
          <textarea className={`${fieldStyles.textarea} ${errors.caseSummary ? fieldStyles.error : ''}`}
            placeholder="Describe your legal issue in detail. Include dates, parties involved, and any relevant background information..." rows={6}
            maxLength={1000} value={data.caseSummary}
            onChange={(e) => { update({ caseSummary: e.target.value }); setErrors((p) => ({ ...p, caseSummary: '' })); }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {errors.caseSummary ? <span className={fieldStyles.errorMsg}>{errors.caseSummary}</span> : <span />}
            <span className={`${fieldStyles.charCount} ${charLen > 900 ? fieldStyles.limit : charLen > 700 ? fieldStyles.warn : ''}`}>{charLen}/1000</span>
          </div>
        </div>

        <div className={styles.grid2}>
          <div className={fieldStyles.group}>
            <label className={fieldStyles.label}>Opponent / Other Party Name</label>
            <input className={fieldStyles.input} placeholder="Name of opponent or organization" value={data.opponentName} onChange={(e) => update({ opponentName: e.target.value })} />
          </div>
          <div className={fieldStyles.group}>
            <label className={fieldStyles.label}>Case Stage <span className={fieldStyles.required}>*</span></label>
            <select className={`${fieldStyles.select} ${errors.caseStage ? fieldStyles.error : ''}`} value={data.caseStage}
              onChange={(e) => { update({ caseStage: e.target.value }); setErrors((p) => ({ ...p, caseStage: '' })); }}>
              <option value="">Select Stage</option>
              {CASE_STAGES.map((s) => <option key={s}>{s}</option>)}
            </select>
            {errors.caseStage && <span className={fieldStyles.errorMsg}>{errors.caseStage}</span>}
          </div>
          <div className={fieldStyles.group}>
            <label className={fieldStyles.label}>Court Name <span className={fieldStyles.hint}>(if applicable)</span></label>
            <input className={fieldStyles.input} placeholder="e.g. Delhi High Court" value={data.court} onChange={(e) => update({ court: e.target.value })} />
          </div>
          <div className={fieldStyles.group}>
            <label className={fieldStyles.label}>Police Station <span className={fieldStyles.hint}>(if applicable)</span></label>
            <input className={fieldStyles.input} placeholder="e.g. Connaught Place PS" value={data.policeStation} onChange={(e) => update({ policeStation: e.target.value })} />
          </div>
        </div>
      </div>
      <NavButtons onBack={onBack} onNext={handleNext} />
    </div>
  );
}
