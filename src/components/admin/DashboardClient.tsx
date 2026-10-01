'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ConsultationRequest } from '@/lib/types';
import { BlogPost } from '@/lib/blogStore';
import { PRACTICE_AREAS, STATES, formatDate } from '@/lib/utils';
import styles from './DashboardClient.module.css';

interface Props {
  consultations: ConsultationRequest[];
  stats: { total: number; todayCount: number; pending: number; resolved: number; inProgress: number };
  initialBlogPosts?: BlogPost[];
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

export default function DashboardClient({ consultations, stats, initialBlogPosts = [] }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'consultations' | 'blogs'>('consultations');

  // Consultation state
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [filterState, setFilterState] = useState('');

  // Blog management state
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogPosts);
  const [blogSearch, setBlogSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  
  // Blog Form State
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formAuthor, setFormAuthor] = useState('Advocate Aastha');
  const [formTags, setFormTags] = useState('Legal Insights');
  const [savingBlog, setSavingBlog] = useState(false);

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  };

  const filteredConsultations = useMemo(() => {
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

  const filteredBlogs = useMemo(() => {
    let list = blogs;
    if (blogSearch) {
      const q = blogSearch.toLowerCase();
      list = list.filter((b) =>
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        (b.tags && b.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    return list;
  }, [blogs, blogSearch]);

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

  // Blog CRUD actions
  const openNewBlogModal = () => {
    setEditingPost(null);
    setFormTitle('');
    setFormSlug('');
    setFormExcerpt('');
    setFormContent('');
    setFormAuthor('Advocate Aastha');
    setFormTags('Legal Insights, Indian Law');
    setIsModalOpen(true);
  };

  const openEditBlogModal = (post: BlogPost) => {
    setEditingPost(post);
    setFormTitle(post.title);
    setFormSlug(post.slug);
    setFormExcerpt(post.excerpt);
    setFormContent(post.content);
    setFormAuthor(post.author);
    setFormTags(post.tags ? post.tags.join(', ') : '');
    setIsModalOpen(true);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formContent) return;

    setSavingBlog(true);
    try {
      const payload = {
        title: formTitle,
        slug: formSlug,
        excerpt: formExcerpt,
        content: formContent,
        author: formAuthor,
        tags: formTags.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (editingPost) {
        // Edit existing post
        const res = await fetch(`/api/admin/blogs/${editingPost.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success && data.post) {
          setBlogs(prev => prev.map(p => p.id === data.post.id ? data.post : p));
        }
      } else {
        // Create new post
        const res = await fetch('/api/admin/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success && data.post) {
          setBlogs(prev => [data.post, ...prev]);
        }
      }
      setIsModalOpen(false);
      router.refresh();
    } catch (err) {
      console.error('Error saving blog post:', err);
      alert('Failed to save article. Please try again.');
    } finally {
      setSavingBlog(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this legal whitepaper/article?')) return;
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBlogs(prev => prev.filter(b => b.id !== id));
        router.refresh();
      }
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Mobile Top Header Bar */}
      <header className={styles.mobileHeader}>
        <div className={styles.mobileTopRow}>
          <div className={styles.sidebarLogo} style={{ padding: 0, margin: 0, border: 'none' }}>
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L3 8V20L14 26L25 20V8L14 2Z" fill="#C9A227" opacity="0.2"/>
              <path d="M14 2L3 8V20L14 26L25 20V8L14 2Z" stroke="#C9A227" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M8 14H20M14 8V20" stroke="#C9A227" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className={styles.sidebarBrand}>Nyaya Aastha</span>
          </div>
          <div className={styles.mobileHeaderActions}>
            <Link href="/" className={styles.mobileNavIcon} target="_blank" title="View Live Site">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </Link>
            <button className={styles.mobileNavIcon} onClick={logout} title="Log Out">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
        <nav className={styles.mobileNavTabs}>
          <button
            className={`${styles.mobileTabBtn} ${activeTab === 'consultations' ? styles.mobileTabActive : ''}`}
            onClick={() => setActiveTab('consultations')}
          >
            Consultations
            {stats.pending > 0 && <span className={styles.tabBadge}>{stats.pending}</span>}
          </button>
          <button
            className={`${styles.mobileTabBtn} ${activeTab === 'blogs' ? styles.mobileTabActive : ''}`}
            onClick={() => setActiveTab('blogs')}
          >
            Blog & Articles
            <span className={styles.tabBadgeAlt}>{blogs.length}</span>
          </button>
        </nav>
      </header>

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
          <button
            className={`${styles.navItem} ${activeTab === 'consultations' ? styles.navActive : ''}`}
            onClick={() => setActiveTab('consultations')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Consultations
            {stats.pending > 0 && <span className={styles.tabBadge}>{stats.pending}</span>}
          </button>
          
          <button
            className={`${styles.navItem} ${activeTab === 'blogs' ? styles.navActive : ''}`}
            onClick={() => setActiveTab('blogs')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Blog & Articles
            <span className={styles.tabBadgeAlt}>{blogs.length}</span>
          </button>

          <Link href="/" className={styles.navItem} target="_blank">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            View Live Site
          </Link>
        </nav>
        <button className={styles.logoutBtn} onClick={logout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Log Out
        </button>
      </aside>

      <main className={styles.main}>
        {activeTab === 'consultations' ? (
          <>
            <div className={styles.topbar}>
              <div>
                <h1 className={styles.heading}>Consultation Dashboard</h1>
                <p className={styles.subheading}>Manage legal consultation requests & case inquiries</p>
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

            {/* Desktop Table View */}
            <div className={styles.tableWrap}>
              {filteredConsultations.length === 0 ? (
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
                    {filteredConsultations.map((c) => (
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

            {/* Mobile Card List View */}
            <div className={styles.mobileCardList}>
              {filteredConsultations.length === 0 ? (
                <div className={styles.empty}>
                  <span style={{ fontSize: 36 }}>📭</span>
                  <p>No consultation requests found</p>
                </div>
              ) : (
                filteredConsultations.map((c) => (
                  <div key={c.id} className={styles.mobileCard}>
                    <div className={styles.mobileCardTop}>
                      <div className={styles.clientCell}>
                        <div className={styles.clientAvatar}>{c.fullName.charAt(0)}</div>
                        <div>
                          <div className={styles.clientName}>{c.fullName}</div>
                          <div className={styles.clientPhone}>{c.mobile} · {c.city}</div>
                        </div>
                      </div>
                      <span className={styles.urgencyBadge} style={{ background: `${URGENCY_COLORS[c.urgency]}18`, color: URGENCY_COLORS[c.urgency] }}>
                        {c.urgency}
                      </span>
                    </div>

                    <div className={styles.mobileCardBody}>
                      <div className={styles.mobileBadgeRow}>
                        <span className={styles.areaTag}>{c.practiceArea}</span>
                        <span className={styles.stageText}>{c.caseStage}</span>
                      </div>
                      <div className={styles.dateCell} style={{ marginTop: 4 }}>
                        Submitted {formatDate(c.createdAt)}
                      </div>
                    </div>

                    <div className={styles.mobileCardBottom}>
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
                    </div>
                  </div>
                ))
              )}
            </div>

            <p className={styles.count}>{filteredConsultations.length} of {consultations.length} requests shown</p>
          </>
        ) : (
          <>
            <div className={styles.topbar}>
              <div>
                <h1 className={styles.heading}>Blog & Legal Whitepapers</h1>
                <p className={styles.subheading}>Publish and manage articles, whitepapers & legal guides</p>
              </div>
              <button className={styles.addBtn} onClick={openNewBlogModal}>
                + Write New Article
              </button>
            </div>

            <div className={styles.filtersRow}>
              <div className={styles.searchWrap}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input className={styles.searchInput} placeholder="Search articles by title, tags..." value={blogSearch} onChange={(e) => setBlogSearch(e.target.value)} />
              </div>
            </div>

            {/* Desktop Table View */}
            <div className={styles.tableWrap}>
              {filteredBlogs.length === 0 ? (
                <div className={styles.empty}>
                  <span style={{ fontSize: 48 }}>📚</span>
                  <p>No legal articles published yet</p>
                  <button className={styles.addBtn} onClick={openNewBlogModal} style={{ marginTop: 12 }}>
                    Write First Article
                  </button>
                </div>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Article Title</th>
                      <th>Author</th>
                      <th>Tags</th>
                      <th>Published Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBlogs.map((b) => (
                      <tr key={b.id}>
                        <td style={{ maxWidth: 360 }}>
                          <div className={styles.clientName}>{b.title}</div>
                          <div className={styles.clientPhone} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {b.excerpt}
                          </div>
                        </td>
                        <td>
                          <span className={styles.stageText}>{b.author}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {b.tags && b.tags.map(t => <span key={t} className={styles.areaTag}>{t}</span>)}
                          </div>
                        </td>
                        <td className={styles.dateCell}>{formatDate(b.publishedAt)}</td>
                        <td>
                          <div className={styles.actions}>
                            <Link href={`/blog/${b.slug}`} target="_blank" className={styles.actionBtn} title="View Published Article">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                            </Link>
                            <button className={styles.actionBtn} title="Edit Article" onClick={() => openEditBlogModal(b)}>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Delete Article" onClick={() => handleDeleteBlog(b.id)}>
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

            {/* Mobile Blog Cards View */}
            <div className={styles.mobileCardList}>
              {filteredBlogs.length === 0 ? (
                <div className={styles.empty}>
                  <span style={{ fontSize: 36 }}>📚</span>
                  <p>No legal articles published yet</p>
                </div>
              ) : (
                filteredBlogs.map((b) => (
                  <div key={b.id} className={styles.mobileCard}>
                    <div className={styles.clientName} style={{ fontSize: 16 }}>{b.title}</div>
                    <div className={styles.clientPhone} style={{ margin: '6px 0 10px' }}>{b.excerpt}</div>
                    <div className={styles.mobileBadgeRow}>
                      {b.tags && b.tags.map(t => <span key={t} className={styles.areaTag}>{t}</span>)}
                    </div>
                    <div className={styles.dateCell} style={{ marginTop: 6 }}>
                      By {b.author} · {formatDate(b.publishedAt)}
                    </div>

                    <div className={styles.mobileCardBottom} style={{ justifyContent: 'flex-end', marginTop: 12 }}>
                      <div className={styles.actions}>
                        <Link href={`/blog/${b.slug}`} target="_blank" className={styles.actionBtn} title="View Published Article">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </Link>
                        <button className={styles.actionBtn} title="Edit Article" onClick={() => openEditBlogModal(b)}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Delete Article" onClick={() => handleDeleteBlog(b.id)}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <p className={styles.count}>{filteredBlogs.length} of {blogs.length} articles shown</p>
          </>
        )}
      </main>

      {/* Modal for Creating / Editing Blog Posts */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingPost ? 'Edit Legal Article' : 'Write New Legal Article'}
              </h2>
              <button className={styles.modalClose} onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveBlog} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Article Title *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="e.g. Navigating the Bharatiya Nyaya Sanhita 2023"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label className={styles.formLabel}>Author Name</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label className={styles.formLabel}>URL Slug (Optional)</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="auto-generated-if-empty"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Category Tags (comma-separated)</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="Criminal Law, BNS 2023, Legal Reform"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Summary / Excerpt</label>
                <textarea
                  className={styles.formTextarea}
                  style={{ height: 70 }}
                  placeholder="Brief summary of the article..."
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Full Article Content (Markdown or Text) *</label>
                <textarea
                  className={styles.formTextarea}
                  style={{ height: 220 }}
                  placeholder="Write full legal whitepaper or article content here..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  required
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn} disabled={savingBlog || !formTitle.trim() || !formContent.trim()}>
                  {savingBlog ? 'Saving Article...' : editingPost ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
