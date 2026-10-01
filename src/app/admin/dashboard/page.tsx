import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { getAllConsultations, initializeDatabase } from '@/lib/store';
import { getBlogPosts, initializeBlogDatabase } from '@/lib/blogStore';
import DashboardClient from '@/components/admin/DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) redirect('/admin');

  await initializeDatabase();
  await initializeBlogDatabase();

  const consultations = await getAllConsultations();
  const blogPosts = await getBlogPosts();

  const today = new Date().toDateString();
  const stats = {
    total: consultations.length,
    todayCount: consultations.filter((c) => new Date(c.createdAt).toDateString() === today).length,
    pending: consultations.filter((c) => c.status === 'pending').length,
    resolved: consultations.filter((c) => c.status === 'resolved').length,
    inProgress: consultations.filter((c) => c.status === 'in-progress').length,
  };

  return <DashboardClient consultations={consultations} stats={stats} initialBlogPosts={blogPosts} />;
}
