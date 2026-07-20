'use client';
import StepHeader from './StepHeader';
import NavButtons from './NavButtons';
import fieldStyles from './FormField.module.css';
import styles from './Steps.module.css';
import { FormData } from './ConsultForm';

const CONTACT_TIMES = [
  { value: 'morning', label: '🌅 Morning', sub: '9 AM – 12 PM' },
  { value: 'afternoon', label: '☀️ Afternoon', sub: '12 PM – 5 PM' },
  { value: 'evening', label: '🌙 Evening', sub: '5 PM – 8 PM' },
];

const URGENCIES = [
  { value: 'low', label: 'Low', icon: '🟢', desc: 'General advice needed' },
  { value: 'medium', label: 'Medium', icon: '🟡', desc: 'Matter needs attention soon' },
  { value: 'high', label: 'High', icon: '🔴', desc: 'Urgent legal action required' },
];

interface Props { data: FormData; update: (u: Partial<FormData>) => void; onNext: () => void; onBack: () => void; }

export default function Step3Priority({ data, update, onNext, onBack }: Props) {
  return (
    <div>
      <StepHeader step={3} title="Priority & Contact Preferences" desc="Help us understand the urgency and how best to reach you." />
      <div className={styles.stack}>
        <div className={fieldStyles.group}>
          <label className={fieldStyles.label}>Urgency Level</label>
          <div className={styles.urgencyGroup}>
            {URGENCIES.map((u) => (
              <div key={u.value} className={`${styles.urgencyCard} ${data.urgency === u.value ? styles.urgencyCardActive : ''}`} onClick={() => update({ urgency: u.value as FormData['urgency'] })} role="button" tabIndex={0}>
                <span className={styles.urgencyIcon}>{u.icon}</span>
                <span className={styles.urgencyLabel}>{u.label}</span>
                <span className={styles.urgencyDesc}>{u.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={fieldStyles.group}>
          <label className={fieldStyles.label}>Preferred Contact Time</label>
          <div className={styles.optionGroup}>
            {CONTACT_TIMES.map((t) => (
              <div key={t.value} className={`${styles.option} ${data.preferredContactTime === t.value ? styles.optionActive : ''}`} onClick={() => update({ preferredContactTime: t.value })} role="button" tabIndex={0}>
                <span>{t.label}</span>
                <span style={{ opacity: 0.6, fontSize: 12 }}>{t.sub}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.toggleRow}>
          <div>
            <div className={styles.toggleLabel}>Video Consultation</div>
            <div className={styles.toggleSub}>Request a video call instead of a phone call</div>
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
