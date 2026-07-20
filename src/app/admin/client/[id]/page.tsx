import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { getConsultationById } from '@/lib/store';
import ClientDetailView from '@/components/admin/ClientDetailView';

export const dynamic = 'force-dynamic';

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) redirect('/admin');

  const { id } = await params;
  const { initializeDatabase } = await import('@/lib/store');
  await initializeDatabase();
  const consultation = await getConsultationById(id);
  if (!consultation) redirect('/admin/dashboard');

  return <ClientDetailView consultation={consultation} />;
}
