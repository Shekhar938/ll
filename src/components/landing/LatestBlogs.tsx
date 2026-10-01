import Link from 'next/link';
import { getBlogPosts, initializeBlogDatabase } from '@/lib/blogStore';
import styles from './LatestBlogs.module.css';

export default async function LatestBlogs() {
  await initializeBlogDatabase();
  const allPosts = await getBlogPosts();
  const latestPosts = allPosts.slice(0, 3); // Get top 3 latest posts

  if (latestPosts.length === 0) return null;

  return (
    <section className={`section ${styles.blogSection}`} id="blog">
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Latest Legal Insights</h2>
          <p className={styles.subtitle}>Stay informed with our expert guides and recent legal updates.</p>
        </div>

        <div className={styles.grid}>
          {latestPosts.map((post) => (
            <article key={post.id} className={styles.card}>
              <div className={styles.meta}>
                <span className={styles.tag}>{post.tags?.[0] || 'Law'}</span>
                <time dateTime={post.publishedAt} className={styles.date}>
                  {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </time>
              </div>
              <h3 className={styles.postTitle}>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              <p className={styles.excerpt}>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                Read More &rarr;
              </Link>
            </article>
          ))}
        </div>
        
        <div className={styles.footer}>
          <Link href="/blog" className={styles.viewAllBtn}>
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}
