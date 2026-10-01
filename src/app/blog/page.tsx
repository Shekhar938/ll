import Link from 'next/link';
import { getBlogPosts, initializeBlogDatabase } from '@/lib/blogStore';
import styles from './page.module.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Blog | NyayaConnect',
  description: 'Legal insights, guides, and news from NyayaConnect.',
};

export default async function BlogIndex() {
  // Initialize DB if not already initialized
  await initializeBlogDatabase();
  
  const posts = await getBlogPosts();

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Legal Insights & Guides</h1>
          <p className={styles.subtitle}>Stay informed about your rights and Indian law.</p>
        </div>

        <div className={styles.grid}>
          {posts.map((post) => (
            <article key={post.id} className={styles.card}>
              <div className={styles.meta}>
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <span>•</span>
                <span>{post.author}</span>
              </div>
              
              <Link href={`/blog/${post.slug}`}>
                <h2 className={styles.postTitle}>{post.title}</h2>
              </Link>
              
              <p className={styles.excerpt}>{post.excerpt}</p>
              
              {post.tags && (
                <div className={styles.tags}>
                  {post.tags.map(tag => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              )}
              
              <div>
                <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                  Read Article <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
