'use client';
import { useState } from 'react';
import StepHeader from './StepHeader';
import NavButtons from './NavButtons';
import fieldStyles from './FormField.module.css';
import styles from './Steps.module.css';
import { FormData } from './ConsultForm';
import { STATES, LANGUAGES, BIHAR_DISTRICTS } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props { data: FormData; update: (u: Partial<FormData>) => void; onNext: () => void; }

function validate(data: FormData, t: any) {
  const errs: Partial<Record<keyof FormData, string>> = {};
  if (!data.fullName.trim()) errs.fullName = t.consult.step1.errors.fullName;
  if (!data.mobile.trim()) errs.mobile = t.consult.step1.errors.mobileReq;
  else if (!/^[6-9]\d{9}$/.test(data.mobile.replace(/\s/g, ''))) errs.mobile = t.consult.step1.errors.mobileInv;
  if (!data.email.trim()) errs.email = t.consult.step1.errors.emailReq;
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = t.consult.step1.errors.emailInv;
  if (!data.city.trim()) errs.city = t.consult.step1.errors.cityReq;
  if (!data.state) errs.state = t.consult.step1.errors.stateReq;
  return errs;
}

export default function Step1Personal({ data, update, onNext }: Props) {
  const { t } = useLanguage();
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleNext = () => {
    const errs = validate(data, t);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onNext();
  };

  const field = (key: keyof FormData) => errors[key] ? fieldStyles.error : '';

  return (
    <div>
      <StepHeader step={1} title={t.consult.step1.title} desc={t.consult.step1.desc} />
      <div className={styles.grid2}>
        <div className={fieldStyles.group}>
          <label className={fieldStyles.label}>{t.consult.step1.fullName} <span className={fieldStyles.required}>*</span></label>
          <input className={`${fieldStyles.input} ${field('fullName')}`} placeholder={t.consult.step1.fullNamePlaceholder} value={data.fullName} onChange={(e) => { update({ fullName: e.target.value }); setErrors((p) => ({ ...p, fullName: '' })); }} />
          {errors.fullName && <span className={fieldStyles.errorMsg}>{errors.fullName}</span>}
        </div>
        <div className={fieldStyles.group}>
          <label className={fieldStyles.label}>{t.consult.step1.mobile} <span className={fieldStyles.required}>*</span></label>
          <input className={`${fieldStyles.input} ${field('mobile')}`} placeholder={t.consult.step1.mobilePlaceholder} value={data.mobile} maxLength={10} onChange={(e) => { update({ mobile: e.target.value.replace(/\D/g, '') }); setErrors((p) => ({ ...p, mobile: '' })); }} />
          {errors.mobile && <span className={fieldStyles.errorMsg}>{errors.mobile}</span>}
        </div>
        <div className={fieldStyles.group}>
          <label className={fieldStyles.label}>{t.consult.step1.email} <span className={fieldStyles.required}>*</span></label>
          <input className={`${fieldStyles.input} ${field('email')}`} type="email" placeholder={t.consult.step1.emailPlaceholder} value={data.email} onChange={(e) => { update({ email: e.target.value }); setErrors((p) => ({ ...p, email: '' })); }} />
          {errors.email && <span className={fieldStyles.errorMsg}>{errors.email}</span>}
        </div>
        <div className={fieldStyles.group}>
          <label className={fieldStyles.label}>{t.consult.step1.occupation}</label>
          <input className={fieldStyles.input} placeholder={t.consult.step1.occupationPlaceholder} value={data.occupation} onChange={(e) => update({ occupation: e.target.value })} />
        </div>
        <div className={fieldStyles.group}>
          <label className={fieldStyles.label}>{t.consult.step1.city} <span className={fieldStyles.required}>*</span></label>
          <select className={`${fieldStyles.select} ${field('city')}`} value={data.city} onChange={(e) => { update({ city: e.target.value }); setErrors((p) => ({ ...p, city: '' })); }}>
            <option value="">{t.consult.step1.citySelect}</option>
            {BIHAR_DISTRICTS.map((d) => <option key={d} value={d}>{(t.districts as Record<string, string>)[d] || d}</option>)}
          </select>
          {errors.city && <span className={fieldStyles.errorMsg}>{errors.city}</span>}
        </div>
        <div className={fieldStyles.group}>
          <label className={fieldStyles.label}>{t.consult.step1.state} <span className={fieldStyles.required}>*</span></label>
          <select className={`${fieldStyles.select} ${field('state')}`} value={data.state} onChange={(e) => { update({ state: e.target.value }); setErrors((p) => ({ ...p, state: '' })); }}>
            {STATES.map((s) => <option key={s} value={s}>{(t.states as Record<string, string>)[s] || s}</option>)}
          </select>
          {errors.state && <span className={fieldStyles.errorMsg}>{errors.state}</span>}
        </div>
        <div className={fieldStyles.group}>
          <label className={fieldStyles.label}>{t.consult.step1.prefLang}</label>
          <select className={fieldStyles.select} value={data.preferredLanguage} onChange={(e) => update({ preferredLanguage: e.target.value })}>
            <option value="">{t.consult.step1.langSelect}</option>
            {LANGUAGES.map((l) => <option key={l} value={l}>{(t.languages as Record<string, string>)[l] || l}</option>)}
          </select>
        </div>
      </div>
      <NavButtons onNext={handleNext} />
    </div>
  );
}
