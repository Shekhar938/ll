'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ConsultationRequest } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import styles from './ClientDetailView.module.css';

interface Props { consultation: ConsultationRequest; }

const RISK_COLORS: Record<string, string> = {
  High: 'var(--danger)',
  Medium: 'var(--warning)',
  Low: 'var(--success)',
};

export default function ClientDetailView({ consultation: initial }: Props) {
  const router = useRouter();
  const [c, setC] = useState(initial);
  const [notes, setNotes] = useState(initial.internalNotes || '');
  const [saving, setSaving] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);

  const updateStatus = async (status: string) => {
    setSaving(true);
    const res = await fetch(`/api/consult/${c.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    const json = await res.json();
    if (json.consultation) setC(json.consultation);
    setSaving(false);
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    const res = await fetch(`/api/consult/${c.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ internalNotes: notes }) });
    const json = await res.json();
    if (json.consultation) setC(json.consultation);
    setSavingNotes(false);
  };

  return (
    <div className={styles.wrapper}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <Link href="/admin/dashboard" className={styles.backBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Dashboard
          </Link>
          <div className={styles.sidebarBrand}>
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L3 8V20L14 26L25 20V8L14 2Z" fill="#C9A227" opacity="0.2"/>
              <path d="M14 2L3 8V20L14 26L25 20V8L14 2Z" stroke="#C9A227" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M8 14H20M14 8V20" stroke="#C9A227" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Nyaya Aastha</span>
          </div>
        </div>

        <div className={styles.profileCard}>
          <div className={styles.profileAvatar}>{c.fullName.charAt(0)}</div>
          <h2 className={styles.profileName}>{c.fullName}</h2>
          <p className={styles.profileSub}>{c.city}, {c.state}</p>
          <div className={styles.profileId}>{c.id}</div>
        </div>

        <div className={styles.contactActions}>
          <a href={`tel:${c.mobile}`} className={styles.contactBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
            Call
          </a>
          <a href={`https://wa.me/91${c.mobile}`} target="_blank" rel="noopener noreferrer" className={`${styles.contactBtn} ${styles.waBtn}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>
            WhatsApp
          </a>
          <a href={`mailto:${c.email}`} className={styles.contactBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Email
          </a>
        </div>

        <div className={styles.statusControl}>
          <label className={styles.statusLabel}>Case Status</label>
          <select className={styles.statusSelect} value={c.status} onChange={(e) => updateStatus(e.target.value)} disabled={saving}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </aside>

      {/* Content */}
      <main className={styles.main}>
        {/* AI Summary */}
        {c.aiSummary && (
          <div className={styles.aiCard}>
            <div className={styles.aiHeader}>
              <div className={styles.aiBadge}>
                <span>✨</span> AI Analysis
              </div>
              <div className={styles.aiMeta}>
                {c.aiRiskLevel && (
                  <span className={styles.riskBadge} style={{ color: RISK_COLORS[c.aiRiskLevel], background: `${RISK_COLORS[c.aiRiskLevel]}15` }}>
                    Risk: {c.aiRiskLevel}
                  </span>
                )}
                {c.aiPriority && <span className={styles.priorityBadge}>Priority: {c.aiPriority}</span>}
                {c.aiDuration && <span className={styles.durationBadge}>⏱ {c.aiDuration}</span>}
              </div>
            </div>
            <p className={styles.aiSummaryText}>{c.aiSummary}</p>
            <div className={styles.aiGrid}>
              {c.aiKeywords && c.aiKeywords.length > 0 && (
                <div className={styles.aiSection}>
                  <h4 className={styles.aiSectionTitle}>Key Terms</h4>
                  <div className={styles.tagCloud}>
                    {c.aiKeywords.map((kw) => <span key={kw} className={styles.tag}>{kw}</span>)}
                  </div>
                </div>
              )}
              {c.aiDocuments && c.aiDocuments.length > 0 && (
                <div className={styles.aiSection}>
                  <h4 className={styles.aiSectionTitle}>Required Documents</h4>
                  <ul className={styles.aiList}>
                    {c.aiDocuments.map((d) => <li key={d}>{d}</li>)}
                  </ul>
                </div>
              )}
              {c.aiNextSteps && c.aiNextSteps.length > 0 && (
                <div className={styles.aiSection}>
                  <h4 className={styles.aiSectionTitle}>Suggested Next Steps</h4>
                  <ul className={styles.aiList}>
                    {c.aiNextSteps.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Case Details */}
        <div className={styles.detailCard}>
          <h3 className={styles.cardTitle}>Case Details</h3>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}><span className={styles.detailLabel}>Practice Area</span><span className={styles.detailValue}>{c.practiceArea}</span></div>
            <div className={styles.detailItem}><span className={styles.detailLabel}>Case Type</span><span className={styles.detailValue}>{c.caseType}</span></div>
            <div className={styles.detailItem}><span className={styles.detailLabel}>Case Stage</span><span className={styles.detailValue}>{c.caseStage}</span></div>
            <div className={styles.detailItem}><span className={styles.detailLabel}>Urgency</span><span className={styles.detailValue} style={{ textTransform: 'capitalize' }}>{c.urgency}</span></div>
            {c.opponentName && <div className={styles.detailItem}><span className={styles.detailLabel}>Opponent</span><span className={styles.detailValue}>{c.opponentName}</span></div>}
            {c.court && <div className={styles.detailItem}><span className={styles.detailLabel}>Court</span><span className={styles.detailValue}>{c.court}</span></div>}
            {c.policeStation && <div className={styles.detailItem}><span className={styles.detailLabel}>Police Station</span><span className={styles.detailValue}>{c.policeStation}</span></div>}
            <div className={styles.detailItem}><span className={styles.detailLabel}>Contact Time</span><span className={styles.detailValue} style={{ textTransform: 'capitalize' }}>{c.preferredContactTime}</span></div>
            <div className={styles.detailItem}><span className={styles.detailLabel}>Video Call</span><span className={styles.detailValue}>{c.videoConsultation ? 'Yes' : 'No'}</span></div>
            <div className={styles.detailItem}><span className={styles.detailLabel}>Language</span><span className={styles.detailValue}>{c.preferredLanguage}</span></div>
            <div className={styles.detailItem}><span className={styles.detailLabel}>Submitted</span><span className={styles.detailValue}>{formatDate(c.createdAt)}</span></div>
          </div>
          <div className={styles.summaryBlock}>
            <span className={styles.detailLabel}>Case Summary</span>
            <p className={styles.summaryText}>{c.caseSummary}</p>
          </div>
        </div>

        {/* Documents */}
        {c.documents && c.documents.length > 0 && (
          <div className={styles.detailCard}>
            <h3 className={styles.cardTitle}>Uploaded Documents</h3>
            <div className={styles.docList}>
              {c.documents.map((doc, i) => (
                <div key={i} className={styles.docItem}>
                  <span className={styles.docIcon}>📄</span>
                  <div><div className={styles.docName}>{doc.name}</div><div className={styles.docMeta}>{doc.type} · {(doc.size / (1024 * 1024)).toFixed(2)} MB</div></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Internal Notes */}
        <div className={styles.detailCard}>
          <h3 className={styles.cardTitle}>Internal Notes</h3>
          <textarea className={styles.notesArea} placeholder="Add internal notes about this case..." value={notes} rows={5} onChange={(e) => setNotes(e.target.value)} />
          <button className={styles.saveNotesBtn} onClick={saveNotes} disabled={savingNotes}>
            {savingNotes ? 'Saving...' : 'Save Notes'}
          </button>
        </div>
      </main>
    </div>
  );
}
