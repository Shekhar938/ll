'use client';
import { useState, useMemo, useEffect } from 'react';
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

function parseInlineMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return <strong key={i} style={{ color: '#FFFFFF', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2 && !part.startsWith('**')) {
      return <em key={i} style={{ fontStyle: 'italic', opacity: 0.9 }}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return <code key={i} style={{ background: 'rgba(255,255,255,0.15)', color: '#FCE8A6', padding: '2px 6px', borderRadius: 4, fontSize: '0.9em', fontFamily: 'monospace' }}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

function FormattedMarkdown({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${key}`} style={{ paddingLeft: 18, margin: '8px 0', listStyleType: 'disc' }}>
          {listItems.map((item, idx) => (
            <li key={idx} style={{ marginBottom: 4 }}>
              {parseInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      listItems.push(trimmed.slice(2));
      return;
    } else {
      flushList(`${index}`);
    }

    if (!trimmed) {
      elements.push(<div key={`sp-${index}`} style={{ height: 6 }} />);
      return;
    }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={index} style={{ fontSize: 13, fontWeight: 700, color: '#FCE8A6', margin: '10px 0 4px 0' }}>
          {parseInlineMarkdown(trimmed.slice(4))}
        </h4>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h3 key={index} style={{ fontSize: 14, fontWeight: 700, color: '#FCE8A6', margin: '12px 0 6px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 4 }}>
          {parseInlineMarkdown(trimmed.slice(3))}
        </h3>
      );
    } else if (trimmed.startsWith('# ')) {
      elements.push(
        <h2 key={index} style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF', margin: '14px 0 6px 0' }}>
          {parseInlineMarkdown(trimmed.slice(2))}
        </h2>
      );
    } else {
      elements.push(
        <p key={index} style={{ margin: '4px 0', lineHeight: 1.6 }}>
          {parseInlineMarkdown(line)}
        </p>
      );
    }
  });

  flushList('final');

  return <div style={{ wordBreak: 'break-word' }}>{elements}</div>;
}

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

  // Draft Cache State
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  const [hasRestoredDraft, setHasRestoredDraft] = useState<boolean>(false);
  const [focusMode, setFocusMode] = useState<boolean>(false);

  // Blog Copilot State
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState<boolean>(false);
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'model'; content: string }>>([]);
  const [aiInput, setAiInput] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [copilotToast, setCopilotToast] = useState<string>('');

  // Blog Copilot Drag Resizer State
  const [copilotWidth, setCopilotWidth] = useState<number>(440);
  const [isResizingCopilot, setIsResizingCopilot] = useState<boolean>(false);

  const startResizingCopilot = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingCopilot(true);
  };

  useEffect(() => {
    if (!isResizingCopilot) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX;
      const clampedWidth = Math.max(300, Math.min(Math.min(950, window.innerWidth * 0.7), newWidth));
      setCopilotWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizingCopilot(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingCopilot]);

  const sendAiAssistantRequest = async (action?: string, customPrompt?: string) => {
    const userText = customPrompt || aiInput;
    if (!action && !userText.trim()) return;

    const newMessages = [...aiMessages];
    if (userText.trim()) {
      newMessages.push({ role: 'user', content: userText.trim() });
      setAiMessages(newMessages);
      setAiInput('');
    }

    setLoadingAi(true);
    try {
      const res = await fetch('/api/admin/blog-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          prompt: userText,
          articleContext: {
            title: formTitle,
            author: formAuthor,
            slug: formSlug,
            tags: formTags,
            excerpt: formExcerpt,
            content: formContent
          },
          messages: newMessages
        })
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setAiMessages(prev => [...prev, { role: 'model', content: data.reply }]);
      } else {
        setAiMessages(prev => [...prev, { role: 'model', content: data.reply || 'Blog Copilot is currently unavailable.' }]);
      }
    } catch (err) {
      console.error('Error with Blog Copilot:', err);
      setAiMessages(prev => [...prev, { role: 'model', content: 'Network error contacting Blog Copilot.' }]);
    } finally {
      setLoadingAi(false);
    }
  };

  const insertIntoContent = (text: string) => {
    setFormContent(prev => prev ? `${prev}\n\n${text}` : text);
  };

  // Auto-save draft to localStorage whenever form fields change
  useEffect(() => {
    if (!isModalOpen) return;
    const draftKey = editingPost ? `nyaya_draft_${editingPost.id}` : 'nyaya_draft_new';
    
    const draftData = {
      title: formTitle,
      slug: formSlug,
      excerpt: formExcerpt,
      content: formContent,
      author: formAuthor,
      tags: formTags,
      savedAt: new Date().toISOString()
    };

    if (formTitle.trim() || formContent.trim() || formExcerpt.trim()) {
      localStorage.setItem(draftKey, JSON.stringify(draftData));
      const now = new Date();
      setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  }, [formTitle, formSlug, formExcerpt, formContent, formAuthor, formTags, isModalOpen, editingPost]);

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

  // URL State Persistence Helpers
  const updateUrlParams = (updates: Record<string, string | null>) => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null) {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    const newQuery = params.toString();
    const newUrl = `${window.location.pathname}${newQuery ? `?${newQuery}` : ''}`;
    window.history.replaceState(null, '', newUrl);
  };

  const switchTab = (tab: 'consultations' | 'blogs') => {
    setActiveTab(tab);
    if (tab === 'blogs') {
      updateUrlParams({ tab: 'blogs' });
    } else {
      updateUrlParams({ tab: 'consultations', action: null, edit: null });
    }
  };

  const closeBlogModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    updateUrlParams({ action: null, edit: null });
  };

  // Blog CRUD actions
  const openNewBlogModal = (skipUrlUpdate: boolean | React.MouseEvent = false) => {
    setEditingPost(null);
    const draftKey = 'nyaya_draft_new';
    const savedDraft = typeof window !== 'undefined' ? localStorage.getItem(draftKey) : null;
    
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormTitle(parsed.title || '');
        setFormSlug(parsed.slug || '');
        setFormExcerpt(parsed.excerpt || '');
        setFormContent(parsed.content || '');
        setFormAuthor(parsed.author || 'Advocate Aastha');
        setFormTags(parsed.tags || 'Legal Insights, Indian Law');
        setHasRestoredDraft(true);
        if (parsed.savedAt) {
          const d = new Date(parsed.savedAt);
          setLastSavedTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      } catch {
        setFormTitle('');
        setFormSlug('');
        setFormExcerpt('');
        setFormContent('');
        setFormAuthor('Advocate Aastha');
        setFormTags('Legal Insights, Indian Law');
        setHasRestoredDraft(false);
      }
    } else {
      setFormTitle('');
      setFormSlug('');
      setFormExcerpt('');
      setFormContent('');
      setFormAuthor('Advocate Aastha');
      setFormTags('Legal Insights, Indian Law');
      setHasRestoredDraft(false);
      setLastSavedTime('');
    }
    setIsModalOpen(true);
    if (skipUrlUpdate !== true) {
      updateUrlParams({ tab: 'blogs', action: 'new', edit: null });
    }
  };

  const openEditBlogModal = (post: BlogPost, skipUrlUpdate: boolean | React.MouseEvent = false) => {
    setEditingPost(post);
    const draftKey = `nyaya_draft_${post.id}`;
    const savedDraft = typeof window !== 'undefined' ? localStorage.getItem(draftKey) : null;
    
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormTitle(parsed.title || post.title);
        setFormSlug(parsed.slug || post.slug);
        setFormExcerpt(parsed.excerpt || post.excerpt);
        setFormContent(parsed.content || post.content);
        setFormAuthor(parsed.author || post.author);
        setFormTags(parsed.tags || (post.tags ? post.tags.join(', ') : ''));
        setHasRestoredDraft(true);
        if (parsed.savedAt) {
          const d = new Date(parsed.savedAt);
          setLastSavedTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      } catch {
        setFormTitle(post.title);
        setFormSlug(post.slug);
        setFormExcerpt(post.excerpt);
        setFormContent(post.content);
        setFormAuthor(post.author);
        setFormTags(post.tags ? post.tags.join(', ') : '');
        setHasRestoredDraft(false);
      }
    } else {
      setFormTitle(post.title);
      setFormSlug(post.slug);
      setFormExcerpt(post.excerpt);
      setFormContent(post.content);
      setFormAuthor(post.author);
      setFormTags(post.tags ? post.tags.join(', ') : '');
      setHasRestoredDraft(false);
      setLastSavedTime('');
    }
    setIsModalOpen(true);
    if (skipUrlUpdate !== true) {
      updateUrlParams({ tab: 'blogs', action: null, edit: post.id });
    }
  };

  // Restore Active Tab and Modal state from URL search params on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const actionParam = params.get('action');
    const editParam = params.get('edit');

    if (tabParam === 'blogs') {
      setActiveTab('blogs');
    } else if (tabParam === 'consultations') {
      setActiveTab('consultations');
    }

    if (actionParam === 'new') {
      openNewBlogModal(true);
    } else if (editParam) {
      const found = blogs.find(b => b.id === editParam);
      if (found) {
        openEditBlogModal(found, true);
      }
    }
  }, []);

  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeBlogModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const discardDraft = () => {
    const draftKey = editingPost ? `nyaya_draft_${editingPost.id}` : 'nyaya_draft_new';
    localStorage.removeItem(draftKey);
    setHasRestoredDraft(false);
    setLastSavedTime('');
    
    if (editingPost) {
      setFormTitle(editingPost.title);
      setFormSlug(editingPost.slug);
      setFormExcerpt(editingPost.excerpt);
      setFormContent(editingPost.content);
      setFormAuthor(editingPost.author);
      setFormTags(editingPost.tags ? editingPost.tags.join(', ') : '');
    } else {
      setFormTitle('');
      setFormSlug('');
      setFormExcerpt('');
      setFormContent('');
      setFormAuthor('Advocate Aastha');
      setFormTags('Legal Insights, Indian Law');
    }
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

      // Clear draft on successful publish
      const draftKey = editingPost ? `nyaya_draft_${editingPost.id}` : 'nyaya_draft_new';
      localStorage.removeItem(draftKey);
      setHasRestoredDraft(false);
      setLastSavedTime('');

      closeBlogModal();
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
          <div className={styles.mobileLogo}>
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L3 8V20L14 26L25 20V8L14 2Z" fill="#C9A227" opacity="0.2"/>
              <path d="M14 2L3 8V20L14 26L25 20V8L14 2Z" stroke="#C9A227" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M8 14H20M14 8V20" stroke="#C9A227" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className={styles.mobileBrand}>Nyaya Aastha</span>
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
            onClick={() => switchTab('consultations')}
          >
            Consultations
            {stats.pending > 0 && <span className={styles.tabBadge}>{stats.pending}</span>}
          </button>
          <button
            className={`${styles.mobileTabBtn} ${activeTab === 'blogs' ? styles.mobileTabActive : ''}`}
            onClick={() => switchTab('blogs')}
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
            onClick={() => switchTab('consultations')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Consultations
            {stats.pending > 0 && <span className={styles.tabBadge}>{stats.pending}</span>}
          </button>
          
          <button
            className={`${styles.navItem} ${activeTab === 'blogs' ? styles.navActive : ''}`}
            onClick={() => switchTab('blogs')}
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

      {/* Full Screen Workspace for Creating / Editing Legal Articles */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeBlogModal}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            {/* Top Fixed Header Bar */}
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleWrap}>
                <h2 className={styles.modalTitle}>
                  {editingPost ? 'Edit Legal Article' : 'Write New Legal Article'}
                </h2>
                {lastSavedTime && (
                  <span className={styles.draftBadge}>
                    💾 Cache Auto-saved {lastSavedTime}
                  </span>
                )}
              </div>
              <div className={styles.modalHeaderRight}>
                <button
                  type="button"
                  className={`${styles.copilotToggleBtn} ${isAiCopilotOpen ? styles.copilotToggleActive : ''}`}
                  onClick={() => setIsAiCopilotOpen(!isAiCopilotOpen)}
                  title="Toggle Blog Copilot"
                >
                  ✨ Blog Copilot
                </button>
                <button
                  type="button"
                  className={`${styles.focusToggleBtn} ${focusMode ? styles.focusToggleActive : ''}`}
                  onClick={() => setFocusMode(!focusMode)}
                  title={focusMode ? "Show metadata sidebar" : "Focus writing mode (hide metadata)"}
                >
                  {focusMode ? '📑 Show Metadata' : '✨ Focus Mode'}
                </button>
                {hasRestoredDraft && (
                  <button
                    type="button"
                    className={styles.discardDraftBtn}
                    onClick={discardDraft}
                    title="Discard unsaved draft cache"
                  >
                    Discard Saved Cache
                  </button>
                )}
                <button className={styles.modalClose} onClick={closeBlogModal} title="Close (Esc)">✕</button>
              </div>
            </div>

            {/* Main Workspace with Integrated Blog Copilot Drawer */}
            <div style={{ display: 'flex', flex: 1, height: 'calc(100vh - 128px)', overflow: 'hidden' }}>
              <form id="blogForm" onSubmit={handleSaveBlog} className={styles.modalEditorBody}>
                {/* Left Metadata Sidebar (Hidden in Focus Mode) */}
                {!focusMode && (
                  <aside className={styles.editorSidebar}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Article Title *</label>
                      <textarea
                        rows={2}
                        className={`${styles.formTextarea} ${styles.expandableInput}`}
                        placeholder="e.g. Navigating the Bharatiya Nyaya Sanhita (BNS) 2023: Structural Shifts and Judicial Implications"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Author Name</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={formAuthor}
                        onChange={(e) => setFormAuthor(e.target.value)}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>URL Slug</label>
                      <textarea
                        rows={2}
                        className={`${styles.formTextarea} ${styles.expandableInput}`}
                        placeholder="auto-generated-if-empty"
                        value={formSlug}
                        onChange={(e) => setFormSlug(e.target.value)}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Category Tags (comma-separated)</label>
                      <textarea
                        rows={2}
                        className={`${styles.formTextarea} ${styles.expandableInput}`}
                        placeholder="Criminal Law, BNS 2023, Legal Reform"
                        value={formTags}
                        onChange={(e) => setFormTags(e.target.value)}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Summary / Excerpt</label>
                      <textarea
                        rows={4}
                        className={`${styles.formTextarea} ${styles.expandableInput}`}
                        style={{ minHeight: 120 }}
                        placeholder="Brief executive summary of the article..."
                        value={formExcerpt}
                        onChange={(e) => setFormExcerpt(e.target.value)}
                      />
                    </div>
                  </aside>
                )}

                {/* Right Main Writing Canvas */}
                <main className={`${styles.editorCanvas} ${focusMode ? styles.focusCanvas : ''}`}>
                  <div className={styles.canvasHeader}>
                    <label className={styles.formLabel}>
                      {focusMode ? `Editing: ${formTitle || 'Untitled Article'} (Focus Writing Mode)` : 'Full Article Content (Markdown / Text) *'}
                    </label>
                    <span className={styles.wordCountBadge}>
                      {formContent.trim() ? `${formContent.trim().split(/\s+/).length} words` : '0 words'}
                    </span>
                  </div>
                  <textarea
                    className={styles.fullArticleTextarea}
                    placeholder="Write full legal whitepaper or article content here... (Markdown supported)"
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    required
                  />
                </main>
              </form>

              {/* Integrated Draggable Blog Copilot Drawer */}
              {isAiCopilotOpen && (
                <div
                  className={styles.copilotDrawer}
                  style={{ width: `${copilotWidth}px` }}
                >
                  {/* Drag resizer handle on left border */}
                  <div
                    className={`${styles.copilotResizer} ${isResizingCopilot ? styles.copilotResizerActive : ''}`}
                    onMouseDown={startResizingCopilot}
                    title="Drag to resize Blog Copilot width"
                  >
                    <div className={styles.copilotResizerHandle} />
                  </div>

                  <div className={styles.copilotHeader}>
                    <div className={styles.copilotTitle}>
                      <div className={styles.copilotBadgeIcon}>🖋️</div>
                      <div>
                        <h3>Blog Copilot</h3>
                        <p>Legal Writing & Proofreading Assistant</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.modalClose}
                      onClick={() => setIsAiCopilotOpen(false)}
                      style={{ width: 28, height: 28, fontSize: 13 }}
                      title="Hide Blog Copilot"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Quick Action Prompt Chips */}
                  <div className={styles.copilotChips}>
                    <button type="button" className={`${styles.copilotChip} ${styles.copilotAuditChip}`} onClick={() => sendAiAssistantRequest('audit-originality')}>
                      🔍 Audit AI & Plagiarism
                    </button>
                    <button type="button" className={styles.copilotChip} onClick={() => sendAiAssistantRequest('review')}>
                      ✨ Audit & Review
                    </button>
                    <button type="button" className={styles.copilotChip} onClick={() => sendAiAssistantRequest('enhance')}>
                      💡 Elevate Style
                    </button>
                    <button type="button" className={styles.copilotChip} onClick={() => sendAiAssistantRequest('summary')}>
                      📝 Auto Summary
                    </button>
                    <button type="button" className={styles.copilotChip} onClick={() => sendAiAssistantRequest('simplify')}>
                      🎯 Simplify Text
                    </button>
                  </div>

                  {/* Toast Notification */}
                  {copilotToast && (
                    <div className={styles.copilotToastBar}>
                      {copilotToast}
                    </div>
                  )}

                  {/* Conversation History */}
                  <div className={styles.copilotMessages}>
                    {aiMessages.length === 0 ? (
                      <div className={styles.copilotEmpty}>
                        <span style={{ fontSize: 32 }}>📜</span>
                        <p>Ask Blog Copilot to draft section outlines, check statutory accuracy (BNS/BNSS/BSA), or polish your article style.</p>
                      </div>
                    ) : (
                      aiMessages.map((msg, idx) => (
                        <div key={idx} className={msg.role === 'user' ? styles.copilotUserMsg : styles.copilotModelMsg}>
                          <div className={styles.copilotMsgRole}>{msg.role === 'user' ? 'You' : 'Blog Copilot'}</div>
                          <div className={styles.copilotMsgBody}>
                            {msg.role === 'model' ? (
                              <FormattedMarkdown content={msg.content} />
                            ) : (
                              msg.content
                            )}
                          </div>
                          {msg.role === 'model' && (
                            <div className={styles.copilotMsgActions}>
                              <button
                                type="button"
                                className={styles.copilotInsertBtn}
                                onClick={() => {
                                  insertIntoContent(msg.content);
                                  setCopilotToast('✓ Inserted into article body!');
                                  setTimeout(() => setCopilotToast(''), 2500);
                                }}
                                title="Append text directly into article body"
                              >
                                📌 Insert into Article
                              </button>
                              <button
                                type="button"
                                className={styles.copilotCopyBtn}
                                onClick={() => {
                                  navigator.clipboard.writeText(msg.content);
                                  setCopilotToast('✓ Copied to clipboard!');
                                  setTimeout(() => setCopilotToast(''), 2500);
                                }}
                                title="Copy to clipboard"
                              >
                                📋 Copy
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                    {loadingAi && <div className={styles.copilotLoading}>🤖 Blog Copilot analyzing legal draft...</div>}
                  </div>

                  {/* Input Row */}
                  <form onSubmit={(e) => { e.preventDefault(); sendAiAssistantRequest(); }} className={styles.copilotInputRow}>
                    <input
                      className={styles.copilotInput}
                      placeholder="Ask Blog Copilot to draft, edit, or check citations..."
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      disabled={loadingAi}
                    />
                    <button type="submit" className={styles.copilotSendBtn} disabled={loadingAi || !aiInput.trim()}>
                      Send
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Sticky Action Footer Bar */}
            <div className={styles.modalActions}>
              <div className={styles.footerInfo}>
                {hasRestoredDraft ? (
                  <span style={{ color: '#FF9F0A', fontSize: 13, fontWeight: 600 }}>⚡ Unsaved draft restored from browser cache</span>
                ) : (
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Draft automatically saved in browser local storage</span>
                )}
              </div>
              <div className={styles.footerButtons}>
                <button type="button" className={styles.cancelBtn} onClick={closeBlogModal}>
                  Cancel
                </button>
                <button type="submit" form="blogForm" className={styles.saveBtn} disabled={savingBlog || !formTitle.trim() || !formContent.trim()}>
                  {savingBlog ? 'Saving Article...' : editingPost ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
