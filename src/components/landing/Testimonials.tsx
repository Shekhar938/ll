'use client';
import { useState } from 'react';
import styles from './Testimonials.module.css';

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'Business Owner, Delhi',
    initials: 'RK',
    rating: 5,
    text: 'NyayaConnect resolved my complex property dispute within weeks. The process was completely transparent and I always knew what was happening with my case. Highly professional service.',
    area: 'Property Law',
  },
  {
    name: 'Priya Sharma',
    role: 'Software Engineer, Bangalore',
    initials: 'PS',
    rating: 5,
    text: 'I was a victim of online fraud and did not know where to start. NyayaConnect guided me through the entire cyber crime complaint process. They responded within hours of my submission.',
    area: 'Cyber Crime',
  },
  {
    name: 'Mohammed Farooq',
    role: 'Teacher, Hyderabad',
    initials: 'MF',
    rating: 5,
    text: 'My wrongful termination case was handled with utmost care and professionalism. The advocate understood my situation deeply and fought for my rights effectively. Got my dues.',
    area: 'Employment Law',
  },
  {
    name: 'Sunita Devi',
    role: 'Homemaker, Lucknow',
    initials: 'SD',
    rating: 5,
    text: 'Going through a difficult family situation, I found NyayaConnect to be incredibly compassionate and efficient. They handled my case with sensitivity and professionalism throughout.',
    area: 'Family Law',
  },
  {
    name: 'Arun Mehta',
    role: 'CA, Mumbai',
    initials: 'AM',
    rating: 5,
    text: 'The GST dispute I had been struggling with for months was resolved efficiently. The tax law expertise was exceptional and the communication was always clear and timely.',
    area: 'Tax Law',
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className={styles.stars}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#C9A227" stroke="#C9A227" strokeWidth="1">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((a) => (a + 1) % testimonials.length);

  return (
    <section className={styles.section} id="testimonials">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.badge}>Testimonials</div>
          <h2 className={styles.heading}>Trusted by Clients Across India</h2>
          <p className={styles.sub}>Real stories from people who trusted us with their most important legal matters.</p>
        </div>

        <div className={styles.carousel}>
          <div className={styles.mainCard}>
            <Stars count={testimonials[active].rating} />
            <blockquote className={styles.quote}>
              &ldquo;{testimonials[active].text}&rdquo;
            </blockquote>
            <div className={styles.author}>
              <div className={styles.avatar}>{testimonials[active].initials}</div>
              <div>
                <div className={styles.name}>{testimonials[active].name}</div>
                <div className={styles.role}>{testimonials[active].role}</div>
              </div>
              <div className={styles.areaBadge}>{testimonials[active].area}</div>
            </div>
          </div>

          <div className={styles.controls}>
            <button onClick={prev} className={styles.navBtn} aria-label="Previous">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div className={styles.dots}>
              {testimonials.map((_, i) => (
                <button key={i} className={`${styles.dot} ${i === active ? styles.dotActive : ''}`} onClick={() => setActive(i)} aria-label={`Go to testimonial ${i + 1}`} />
              ))}
            </div>
            <button onClick={next} className={styles.navBtn} aria-label="Next">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          <div className={styles.thumbs}>
            {testimonials.map((t, i) => (
              <button key={t.name} className={`${styles.thumb} ${i === active ? styles.thumbActive : ''}`} onClick={() => setActive(i)}>
                <div className={styles.thumbAvatar}>{t.initials}</div>
                <div className={styles.thumbInfo}>
                  <span className={styles.thumbName}>{t.name}</span>
                  <span className={styles.thumbArea}>{t.area}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
