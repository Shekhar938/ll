'use client';
import { useState } from 'react';
import StepHeader from './StepHeader';
import NavButtons from './NavButtons';
import fieldStyles from './FormField.module.css';
import styles from './Steps.module.css';
import { FormData } from './ConsultForm';
import { STATES, LANGUAGES } from '@/lib/utils';

interface Props { data: FormData; update: (u: Partial<FormData>) => void; onNext: () => void; }

function validate(data: FormData) {
  const errs: Partial<Record<keyof FormData, string>> = {};
  if (!data.fullName.trim()) errs.fullName = 'Full name is required';
  if (!data.mobile.trim()) errs.mobile = 'Mobile number is required';
  else if (!/^[6-9]\d{9}$/.test(data.mobile.replace(/\s/g, ''))) errs.mobile = 'Enter a valid 10-digit Indian mobile number';
  if (!data.email.trim()) errs.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = 'Enter a valid email address';
  if (!data.city.trim()) errs.city = 'City is required';
  if (!data.state) errs.state = 'Please select a state';
  return errs;
}

export default function Step1Personal({ data, update, onNext }: Props) {
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleNext = () => {
    const errs = validate(data);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onNext();
  };

  const field = (key: keyof FormData) => errors[key] ? fieldStyles.error : '';

  return (
    <div>
      <StepHeader step={1} title="Personal Information" desc="Tell us about yourself so we can reach you with the right guidance." />
      <div className={styles.grid2}>
        <div className={fieldStyles.group}>
          <label className={fieldStyles.label}>Full Name <span className={fieldStyles.required}>*</span></label>
          <input className={`${fieldStyles.input} ${field('fullName')}`} placeholder="Rajesh Kumar" value={data.fullName} onChange={(e) => { update({ fullName: e.target.value }); setErrors((p) => ({ ...p, fullName: '' })); }} />
          {errors.fullName && <span className={fieldStyles.errorMsg}>{errors.fullName}</span>}
        </div>
        <div className={fieldStyles.group}>
          <label className={fieldStyles.label}>Mobile Number <span className={fieldStyles.required}>*</span></label>
          <input className={`${fieldStyles.input} ${field('mobile')}`} placeholder="9XXXXXXXXX" value={data.mobile} maxLength={10} onChange={(e) => { update({ mobile: e.target.value.replace(/\D/g, '') }); setErrors((p) => ({ ...p, mobile: '' })); }} />
          {errors.mobile && <span className={fieldStyles.errorMsg}>{errors.mobile}</span>}
        </div>
        <div className={fieldStyles.group}>
          <label className={fieldStyles.label}>Email Address <span className={fieldStyles.required}>*</span></label>
          <input className={`${fieldStyles.input} ${field('email')}`} type="email" placeholder="rajesh@example.com" value={data.email} onChange={(e) => { update({ email: e.target.value }); setErrors((p) => ({ ...p, email: '' })); }} />
          {errors.email && <span className={fieldStyles.errorMsg}>{errors.email}</span>}
        </div>
        <div className={fieldStyles.group}>
          <label className={fieldStyles.label}>Occupation</label>
          <input className={fieldStyles.input} placeholder="e.g. Business Owner, Teacher" value={data.occupation} onChange={(e) => update({ occupation: e.target.value })} />
        </div>
        <div className={fieldStyles.group}>
          <label className={fieldStyles.label}>City <span className={fieldStyles.required}>*</span></label>
          <input className={`${fieldStyles.input} ${field('city')}`} placeholder="e.g. Mumbai" value={data.city} onChange={(e) => { update({ city: e.target.value }); setErrors((p) => ({ ...p, city: '' })); }} />
          {errors.city && <span className={fieldStyles.errorMsg}>{errors.city}</span>}
        </div>
        <div className={fieldStyles.group}>
          <label className={fieldStyles.label}>State <span className={fieldStyles.required}>*</span></label>
          <select className={`${fieldStyles.select} ${field('state')}`} value={data.state} onChange={(e) => { update({ state: e.target.value }); setErrors((p) => ({ ...p, state: '' })); }}>
            <option value="">Select State</option>
            {STATES.map((s) => <option key={s}>{s}</option>)}
          </select>
          {errors.state && <span className={fieldStyles.errorMsg}>{errors.state}</span>}
        </div>
        <div className={fieldStyles.group}>
          <label className={fieldStyles.label}>Preferred Language</label>
          <select className={fieldStyles.select} value={data.preferredLanguage} onChange={(e) => update({ preferredLanguage: e.target.value })}>
            <option value="">Select Language</option>
            {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>
      <NavButtons onNext={handleNext} />
    </div>
  );
}
