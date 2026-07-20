import styles from './StepHeader.module.css';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  step: number;
  title: string;
  desc: string;
}

export default function StepHeader({ step, title, desc }: Props) {
  const { lang } = useLanguage();
  const stepText = lang === 'hi' ? `चरण ${step} / 5` : `Step ${step} of 5`;
  return (
    <div className={styles.header}>
      <div className={styles.stepNum}>{stepText}</div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.desc}>{desc}</p>
    </div>
  );
}
