import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { getAllConsultations } from '@/lib/store';
import DashboardClient from '@/components/admin/DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) redirect('/admin');

  const { initializeDatabase } = await import('@/lib/store');
  await initializeDatabase();
  const consultations = await getAllConsultations();
  const today = new Date().toDateString();
  const stats = {
    total: consultations.length,
    todayCount: consultations.filter((c) => new Date(c.createdAt).toDateString() === today).length,
    pending: consultations.filter((c) => c.status === 'pending').length,
    resolved: consultations.filter((c) => c.status === 'resolved').length,
    inProgress: consultations.filter((c) => c.status === 'in-progress').length,
  };

  return <DashboardClient consultations={consultations} stats={stats} />;
}
