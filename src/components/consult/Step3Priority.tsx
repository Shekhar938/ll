'use client';
import StepHeader from './StepHeader';
import NavButtons from './NavButtons';
import fieldStyles from './FormField.module.css';
import styles from './Steps.module.css';
import { FormData } from './ConsultForm';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Step3Priority({ data, update, onNext, onBack }: { data: FormData; update: (u: Partial<FormData>) => void; onNext: () => void; onBack: () => void; }) {
  const { t } = useLanguage();
  const handleNext = () => onNext();

  const CONTACT_TIMES = [
    { value: 'morning', label: `🌅 ${t.consult.step3.timeMorn}` },
    { value: 'afternoon', label: `☀️ ${t.consult.step3.timeAft}` },
    { value: 'evening', label: `🌙 ${t.consult.step3.timeEve}` },
  ];

  const URGENCIES = [
    { value: 'low', label: t.consult.step3.urgLow, icon: '🟢' },
    { value: 'medium', label: t.consult.step3.urgMed, icon: '🟡' },
    { value: 'high', label: t.consult.step3.urgHigh, icon: '🔴' },
  ];

  return (
    <div>
      <StepHeader step={3} title={t.consult.step3.title} desc={t.consult.step3.desc} />
      <div className={styles.stack}>
        <div className={fieldStyles.group}>
          <label className={fieldStyles.label}>{t.consult.step3.urgency}</label>
          <div className={styles.urgencyGroup}>
            {URGENCIES.map((u) => (
              <div key={u.value} className={`${styles.urgencyCard} ${data.urgency === u.value ? styles.urgencyCardActive : ''}`} onClick={() => update({ urgency: u.value as FormData['urgency'] })} role="button" tabIndex={0}>
                <span className={styles.urgencyIcon}>{u.icon}</span>
                <span className={styles.urgencyLabel}>{u.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={fieldStyles.group}>
          <label className={fieldStyles.label}>{t.consult.step3.contactTime}</label>
          <div className={styles.optionGroup}>
            {CONTACT_TIMES.map((timeOpt) => (
              <div key={timeOpt.value} className={`${styles.option} ${data.preferredContactTime === timeOpt.value ? styles.optionActive : ''}`} onClick={() => update({ preferredContactTime: timeOpt.value })} role="button" tabIndex={0}>
                <span>{timeOpt.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.toggleRow}>
          <div>
            <div className={styles.toggleLabel}>{t.consult.step3.video}</div>
            <div className={styles.toggleSub}>{t.consult.step3.videoDesc}</div>
          </div>
          <label className={styles.toggle}>
            <input type="checkbox" checked={data.videoConsultation} onChange={(e) => update({ videoConsultation: e.target.checked })} />
            <span className={styles.toggleSlider} />
          </label>
        </div>
      </div>
      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  );
}
