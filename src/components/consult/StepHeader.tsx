import styles from './StepHeader.module.css';

interface Props {
  step: number;
  title: string;
  desc: string;
}

export default function StepHeader({ step, title, desc }: Props) {
  return (
    <div className={styles.header}>
      <div className={styles.stepNum}>Step {step} of 5</div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.desc}>{desc}</p>
    </div>
  );
}
