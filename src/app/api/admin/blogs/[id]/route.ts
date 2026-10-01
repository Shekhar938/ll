import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { updateBlogPost, deleteBlogPost } from '@/lib/blogStore';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await updateBlogPost(id, {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      author: body.author,
      tags: Array.isArray(body.tags) ? body.tags : typeof body.tags === 'string' ? body.tags.split(',').map((t: string) => t.trim()) : undefined
    });

    if (!updated) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, post: updated });
  } catch (error: any) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: error.message || 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const success = await deleteBlogPost(id);

    if (!success) {
      return NextResponse.json({ error: 'Post not found or delete failed' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete blog post' }, { status: 500 });
  }
}
