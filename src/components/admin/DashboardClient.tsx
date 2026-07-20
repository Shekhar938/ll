'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ConsultationRequest } from '@/lib/types';
import { PRACTICE_AREAS, STATES, formatDate } from '@/lib/utils';
import styles from './DashboardClient.module.css';

interface Props {
  consultations: ConsultationRequest[];
  stats: { total: number; todayCount: number; pending: number; resolved: number; inProgress: number };
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#FF9F0A',
  'in-progress': '#5856D6',
  resolved: '#34C759',
  archived: '#8E8E93',
};

const URGENCY_COLORS: Record<string, string> = {
  high: '#FF3B30',
  medium: '#FF9F0A',
  low: '#34C759',
};

export default function DashboardClient({ consultations, stats }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [filterState, setFilterState] = useState('');

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  };

  const filtered = useMemo(() => {
    let list = consultations;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.mobile.includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.practiceArea.toLowerCase().includes(q)
      );
    }
    if (filterStatus) list = list.filter((c) => c.status === filterStatus);
    if (filterArea) list = list.filter((c) => c.practiceArea === filterArea);
    if (filterState) list = list.filter((c) => c.state === filterState);
    return list;
  }, [consultations, search, filterStatus, filterArea, filterState]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/consult/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  };

  const deleteRequest = async (id: string) => {
    if (!confirm('Delete this request? This cannot be undone.')) return;
    await fetch(`/api/consult/${id}`, { method: 'DELETE' });
    router.refresh();
  };

  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L3 8V20L14 26L25 20V8L14 2Z" fill="#C9A227" opacity="0.2"/>
            <path d="M14 2L3 8V20L14 26L25 20V8L14 2Z" stroke="#C9A227" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M8 14H20M14 8V20" stroke="#C9A227" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className={styles.sidebarBrand}>Nyaya Aastha</span>
        </div>
        <nav className={styles.sidebarNav}>
          <div className={`${styles.navItem} ${styles.navActive}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Dashboard
          </div>
          <Link href="/" className={styles.navItem} target="_blank">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            View Site
          </Link>
        </nav>
        <button className={styles.logoutBtn} onClick={logout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Log Out
        </button>
      </aside>

      <main className={styles.main}>
        <div className={styles.topbar}>
          <div>
            <h1 className={styles.heading}>Dashboard</h1>
            <p className={styles.subheading}>Manage all consultation requests</p>
          </div>
        </div>

        <div className={styles.statsGrid}>
          {[
            { label: "Today's Requests", value: stats.todayCount, icon: '📅', color: '#5856D6' },
            { label: 'Pending', value: stats.pending, icon: '⏳', color: '#FF9F0A' },
            { label: 'In Progress', value: stats.inProgress, icon: '🔄', color: '#0B1F3A' },
            { label: 'Resolved', value: stats.resolved, icon: '✅', color: '#34C759' },
          ].map((s) => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: `${s.color}15`, color: s.color }}>{s.icon}</div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.filtersRow}>
          <div className={styles.searchWrap}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input className={styles.searchInput} placeholder="Search by name, phone, ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className={styles.filterSelect} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="archived">Archived</option>
          </select>
          <select className={styles.filterSelect} value={filterArea} onChange={(e) => setFilterArea(e.target.value)}>
            <option value="">All Areas</option>
            {PRACTICE_AREAS.map((a) => <option key={a}>{a}</option>)}
          </select>
          <select className={styles.filterSelect} value={filterState} onChange={(e) => setFilterState(e.target.value)}>
            <option value="">All States</option>
            {STATES.slice(0, 15).map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className={styles.tableWrap}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <span style={{ fontSize: 48 }}>📭</span>
              <p>No consultation requests found</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Practice Area</th>
                  <th>Stage</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className={styles.clientCell}>
                        <div className={styles.clientAvatar}>{c.fullName.charAt(0)}</div>
                        <div>
                          <div className={styles.clientName}>{c.fullName}</div>
                          <div className={styles.clientPhone}>{c.mobile} · {c.city}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className={styles.areaTag}>{c.practiceArea}</span></td>
                    <td><span className={styles.stageText}>{c.caseStage}</span></td>
                    <td>
                      <span className={styles.urgencyBadge} style={{ background: `${URGENCY_COLORS[c.urgency]}18`, color: URGENCY_COLORS[c.urgency] }}>
                        {c.urgency}
                      </span>
                    </td>
                    <td>
                      <select
                        className={styles.statusSelect}
                        value={c.status}
                        style={{ borderColor: STATUS_COLORS[c.status] || '#ccc' }}
                        onChange={(e) => updateStatus(c.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className={styles.dateCell}>{formatDate(c.createdAt)}</td>
                    <td>
                      <div className={styles.actions}>
                        <Link href={`/admin/client/${c.id}`} className={styles.actionBtn} title="View Details">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </Link>
                        <a href={`tel:${c.mobile}`} className={styles.actionBtn} title="Call">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                        </a>
                        <button className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Delete" onClick={() => deleteRequest(c.id)}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <p className={styles.count}>{filtered.length} of {consultations.length} requests shown</p>
      </main>
    </div>
  );
}
