import { useLanguage } from '@/contexts/LanguageContext';
import styles from './NavButtons.module.css';

interface Props {
  onBack?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  submitting?: boolean;
  nextLabel?: string;
  disabled?: boolean;
}

export default function NavButtons({ onBack, onNext, onSubmit, submitting, disabled }: Props) {
  const { t } = useLanguage();
  return (
    <div className={styles.nav}>
      {onBack && (
        <button type="button" className={styles.backBtn} onClick={onBack} disabled={submitting || disabled}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          {t.consult.nav.back}
        </button>
      )}
      {onNext && (
        <button type="button" className={styles.nextBtn} onClick={onNext} disabled={disabled}>
          {t.consult.nav.next}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      )}
      {onSubmit && (
        <button type="button" className={styles.submitBtn} onClick={onSubmit} disabled={submitting || disabled}>
          {submitting ? (
            <><span className={styles.spinner} /> {t.consult.nav.submitting}</>
          ) : (
            <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> {t.consult.nav.submit}</>
          )}
        </button>
      )}
    </div>
  );
}
