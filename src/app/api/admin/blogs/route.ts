import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { getBlogPosts, createBlogPost } from '@/lib/blogStore';

export async function GET() {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const posts = await getBlogPosts();
    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, excerpt, content, author, tags } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const newPost = await createBlogPost({
      title,
      excerpt: excerpt || title,
      content,
      author: author || 'Advocate Aastha',
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : ['Legal Insights']
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: error.message || 'Failed to create blog post' }, { status: 500 });
  }
}
