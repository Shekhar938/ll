import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/blogStore';
import styles from './page.module.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Optional: Generates static routes at build time for speed
// export async function generateStaticParams() {
//   const posts = await getBlogPosts();
//   return posts.map((post) => ({
//     slug: post.slug,
//   }));
// }

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return { title: 'Not Found' };
  
  return {
    title: `${post.title} | NyayaConnect`,
    description: post.excerpt,
  };
}

export default async function BlogPost(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return (
      <>
        <Navbar />
        <div className={styles.notFound}>
          <h1>Post not found</h1>
          <Link href="/blog" className={styles.backLink}>&larr; Back to Blog</Link>
        </div>
        <Footer />
      </>
    );
  }

  // Simple parser to convert newlines to paragraphs
  const renderContent = (text: string) => {
    return text.split('\n\n').map((paragraph, idx) => (
      <p key={idx}>{paragraph}</p>
    ));
  };

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <Link href="/blog" className={styles.backLink}>
          &larr; Back to Blog
        </Link>
        
        <article>
          <header className={styles.header}>
            <h1 className={styles.title}>{post.title}</h1>
            <div className={styles.meta}>
              <div className={styles.avatar}>
                {post.author.charAt(0)}
              </div>
              <div>
                <strong>{post.author}</strong>
                <div>
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              </div>
            </div>
          </header>
          
          <div className={styles.content}>
            {renderContent(post.content)}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
