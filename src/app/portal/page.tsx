'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ConsultationRequest, UploadedDocument } from '@/lib/types';
import styles from './portal.module.css';

export default function ClientPortalPage() {
  const [loading, setLoading] = useState(true);
  const [consultation, setConsultation] = useState<ConsultationRequest | null>(null);

  // Login Form state
  const [caseIdInput, setCaseIdInput] = useState('');
  const [identifierInput, setIdentifierInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [submittingLogin, setSubmittingLogin] = useState(false);

  // Active Dashboard Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'edit' | 'documents' | 'ai' | 'notes'>('overview');

  // Edit Form state
  const [editFullName, setEditFullName] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCaseSummary, setEditCaseSummary] = useState('');
  const [editOpponentName, setEditOpponentName] = useState('');
  const [editCourt, setEditCourt] = useState('');
  const [editPoliceStation, setEditPoliceStation] = useState('');
  const [editCaseStage, setEditCaseStage] = useState('');
  const [editPreferredContactTime, setEditPreferredContactTime] = useState('');
  const [savingUpdates, setSavingUpdates] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState('');

  // Document Upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // Check if client is already logged in on mount
  useEffect(() => {
    fetchClientSession();
  }, []);

  const fetchClientSession = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/client/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.case) {
          setConsultation(data.case);
          populateEditState(data.case);
        }
      }
    } catch (err) {
      console.error('Failed to load client session', err);
    } finally {
      setLoading(false);
    }
  };

  const populateEditState = (c: ConsultationRequest) => {
    setEditFullName(c.fullName || '');
    setEditMobile(c.mobile || '');
    setEditEmail(c.email || '');
    setEditCaseSummary(c.caseSummary || '');
    setEditOpponentName(c.opponentName || '');
    setEditCourt(c.court || '');
    setEditPoliceStation(c.policeStation || '');
    setEditCaseStage(c.caseStage || '');
    setEditPreferredContactTime(c.preferredContactTime || 'morning');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setSubmittingLogin(true);

    try {
      const res = await fetch('/api/client/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: caseIdInput, identifier: identifierInput }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoginError(data.error || 'Login failed. Please verify your credentials.');
        return;
      }

      setConsultation(data.case);
      populateEditState(data.case);
    } catch (err) {
      console.error('Login error', err);
      setLoginError('A network error occurred. Please try again.');
    } finally {
      setSubmittingLogin(false);
    }
  };

  const handlePresetLogin = (cId: string, ident: string) => {
    setCaseIdInput(cId);
    setIdentifierInput(ident);
    setLoginError('');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/client/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      setConsultation(null);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultation) return;

    setSavingUpdates(true);
    setUpdateSuccess('');

    try {
      const res = await fetch('/api/client/case', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: editFullName,
          mobile: editMobile,
          email: editEmail,
          caseSummary: editCaseSummary,
          opponentName: editOpponentName,
          court: editCourt,
          policeStation: editPoliceStation,
          caseStage: editCaseStage,
          preferredContactTime: editPreferredContactTime,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setConsultation(data.case);
        setUpdateSuccess('✨ Case details updated successfully!');
        setTimeout(() => setUpdateSuccess(''), 4000);
      }
    } catch (err) {
      console.error('Update case error', err);
    } finally {
      setSavingUpdates(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !consultation) return;

    setUploadingDoc(true);
    const newDocs: UploadedDocument[] = [...(consultation.documents || [])];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      newDocs.push({
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        url: URL.createObjectURL(file),
      });
    }

    try {
      const res = await fetch('/api/client/case', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documents: newDocs }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setConsultation(data.case);
        setUpdateSuccess('📁 Additional document(s) attached successfully!');
        setTimeout(() => setUpdateSuccess(''), 4000);
      }
    } catch (err) {
      console.error('Document upload error', err);
    } finally {
      setUploadingDoc(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteDocument = async (docIndex: number) => {
    if (!consultation || !consultation.documents) return;
    const updatedDocs = consultation.documents.filter((_, idx) => idx !== docIndex);

    try {
      const res = await fetch('/api/client/case', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documents: updatedDocs }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setConsultation(data.case);
      }
    } catch (err) {
      console.error('Delete document error', err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <Link href="/" className={styles.brand}>
              <div className={styles.logo}>⚖️</div>
              <span className={styles.brandText}>Advocate Aastha</span>
              <span className={styles.brandBadge}>Client Portal</span>
            </Link>
          </div>
        </header>
        <div className={styles.container} style={{ textAlign: 'center', paddingTop: 100 }}>
          <p style={{ fontSize: 18, color: '#0B132B' }}>🔒 Loading your Client Portal session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Top Header Bar */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>
            <div className={styles.logo}>
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <path d="M14 2L3 8V20L14 26L25 20V8L14 2Z" fill="#C9A227" opacity="0.15"/>
                <path d="M14 2L3 8V20L14 26L25 20V8L14 2Z" stroke="#C9A227" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M8 14H20M14 8V20" stroke="#C9A227" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <span className={styles.brandText}>Advocate Aastha</span>
              <span className={styles.brandBadge}>Client Portal</span>
            </div>
          </Link>
          <div className={styles.headerRight}>
            <Link href="/consult" className={styles.headerBtn}>
              📝 Book New Consultation
            </Link>
            {consultation && (
              <button onClick={handleLogout} className={`${styles.headerBtn} ${styles.logoutBtn}`}>
                🚪 Logout
              </button>
            )}
          </div>
        </div>
      </header>

      <div className={styles.container}>
        {/* VIEW 1: LOGIN CARD (When not logged in) */}
        {!consultation ? (
          <div className={styles.loginContainer}>
            <h1 className={styles.loginTitle}>Client Portal Access</h1>
            <p className={styles.loginSubtitle}>
              Log in with your Case Reference ID & registered Mobile Number or Email to access your case dashboard.
            </p>

            {loginError && <div className={styles.errorBanner}>{loginError}</div>}

            <form onSubmit={handleLoginSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Case Reference ID *</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. NYC-2026-0814-01"
                  value={caseIdInput}
                  onChange={(e) => setCaseIdInput(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Registered Mobile Number or Email *</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. 9812345678 or client@example.com"
                  value={identifierInput}
                  onChange={(e) => setIdentifierInput(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={submittingLogin}>
                {submittingLogin ? 'Validating Credentials...' : '🔑 Access Case Portal'}
              </button>
            </form>

            <div className={styles.demoBox}>
              <p className={styles.demoTitle}>💡 Quick Demo Client Accounts</p>
              <div className={styles.demoButtons}>
                <button
                  type="button"
                  className={styles.demoBtn}
                  onClick={() => handlePresetLogin('NYC-2026-0814-01', '9812345678')}
                >
                  <span className={styles.demoBtnName}>📌 Rajesh Kumar (Property Encroachment Suit)</span>
                  <span className={styles.demoBtnMeta}>ID: NYC-2026-0814-01 | Mobile: 9812345678</span>
                </button>

                <button
                  type="button"
                  className={styles.demoBtn}
                  onClick={() => handlePresetLogin('NYC-2026-0814-02', '9876543210')}
                >
                  <span className={styles.demoBtnName}>📌 Vikram Aditya (Cyber Fraud & Phishing Claim)</span>
                  <span className={styles.demoBtnMeta}>ID: NYC-2026-0814-02 | Mobile: 9876543210</span>
                </button>

                <button
                  type="button"
                  className={styles.demoBtn}
                  onClick={() => handlePresetLogin('NYC-2026-0814-03', '9876543211')}
                >
                  <span className={styles.demoBtnName}>📌 Aastha Sharma (Mutual Divorce & Custody)</span>
                  <span className={styles.demoBtnMeta}>ID: NYC-2026-0814-03 | Mobile: 9876543211</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* VIEW 2: LOGGED-IN CLIENT DASHBOARD */
          <div>
            {/* Client Profile Header Card */}
            <div className={styles.profileCard}>
              <div className={styles.profileInfo}>
                <div className={styles.avatar}>
                  {consultation.fullName.slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <h1 className={styles.userName}>{consultation.fullName}</h1>
                  <div className={styles.userMeta}>
                    <span className={styles.metaItem}>📞 {consultation.mobile}</span>
                    <span className={styles.metaItem}>✉️ {consultation.email}</span>
                    <span className={styles.metaItem}>📍 {consultation.city}, {consultation.state}</span>
                  </div>
                </div>
              </div>

              <div className={styles.caseRefBadge}>
                Ref: {consultation.id}
              </div>
            </div>

            {/* Stepper Card for Real-Time Status Tracking */}
            <div className={styles.stepperCard}>
              <div className={styles.stepperHeader}>
                <h3 className={styles.stepperTitle}>Case Progress Lifecycle</h3>
                <span className={`${styles.statusBadge} ${
                  consultation.status === 'pending' ? styles.statusPending :
                  consultation.status === 'in-progress' ? styles.statusInProgress :
                  consultation.status === 'resolved' ? styles.statusResolved : styles.statusArchived
                }`}>
                  ● {consultation.status === 'pending' ? 'Pending Legal Review' : consultation.status}
                </span>
              </div>

              <div className={styles.stepperTrack}>
                <div className={`${styles.stepItem} ${styles.stepDone}`}>
                  <div className={styles.stepCircle}>✓</div>
                  <span className={styles.stepLabel}>1. Submitted</span>
                </div>

                <div className={`${styles.stepItem} ${consultation.status !== 'pending' ? styles.stepDone : styles.stepActive}`}>
                  <div className={styles.stepCircle}>{consultation.status !== 'pending' ? '✓' : '2'}</div>
                  <span className={styles.stepLabel}>2. Under Review</span>
                </div>

                <div className={`${styles.stepItem} ${consultation.status === 'in-progress' ? styles.stepActive : (consultation.status === 'resolved' ? styles.stepDone : '')}`}>
                  <div className={styles.stepCircle}>{consultation.status === 'resolved' ? '✓' : '3'}</div>
                  <span className={styles.stepLabel}>3. Court / Action</span>
                </div>

                <div className={`${styles.stepItem} ${consultation.status === 'resolved' ? styles.stepDone : ''}`}>
                  <div className={styles.stepCircle}>4</div>
                  <span className={styles.stepLabel}>4. Resolved & Decreed</span>
                </div>
              </div>
            </div>

            {/* Dashboard Tabs */}
            <div className={styles.tabs}>
              <button
                className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                📊 Case Overview
              </button>

              <button
                className={`${styles.tabBtn} ${activeTab === 'edit' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('edit')}
              >
                ✏️ Edit Case & Contact Info
              </button>

              <button
                className={`${styles.tabBtn} ${activeTab === 'documents' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('documents')}
              >
                📁 Attach & Manage Documents ({consultation.documents?.length || 0})
              </button>

              <button
                className={`${styles.tabBtn} ${activeTab === 'ai' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('ai')}
              >
                🧠 AI Next Steps & Preparation
              </button>

              <button
                className={`${styles.tabBtn} ${activeTab === 'notes' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('notes')}
              >
                💬 Legal Team Updates
              </button>
            </div>

            {updateSuccess && <div className={styles.successMsg}>{updateSuccess}</div>}

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className={styles.cardGrid}>
                <div className={styles.detailCard}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>⚖️ Legal Matter Overview</h3>
                  </div>
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabel}>Practice Area</div>
                    <div className={styles.detailValue}>{consultation.practiceArea}</div>
                  </div>
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabel}>Case Type</div>
                    <div className={styles.detailValue}>{consultation.caseType}</div>
                  </div>
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabel}>Case Summary</div>
                    <div className={styles.detailValue}>{consultation.caseSummary}</div>
                  </div>
                </div>

                <div className={styles.detailCard}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>🏛️ Court & Proceedings Info</h3>
                  </div>
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabel}>Opponent Party Name</div>
                    <div className={styles.detailValue}>{consultation.opponentName || 'N/A'}</div>
                  </div>
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabel}>Court Jurisdiction</div>
                    <div className={styles.detailValue}>{consultation.court || 'N/A'}</div>
                  </div>
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabel}>Police Station</div>
                    <div className={styles.detailValue}>{consultation.policeStation || 'N/A'}</div>
                  </div>
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabel}>Current Case Stage</div>
                    <div className={styles.detailValue}>{consultation.caseStage || 'Initial Filing'}</div>
                  </div>
                </div>

                <div className={styles.detailCard}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>📞 Contact & Consultation Preferences</h3>
                  </div>
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabel}>Urgency Level</div>
                    <div className={styles.detailValue} style={{ textTransform: 'capitalize', fontWeight: 700 }}>
                      {consultation.urgency === 'high' ? '🔴 High Urgency' : consultation.urgency === 'medium' ? '🟡 Medium Urgency' : '🟢 Standard Priority'}
                    </div>
                  </div>
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabel}>Preferred Contact Time</div>
                    <div className={styles.detailValue} style={{ textTransform: 'capitalize' }}>{consultation.preferredContactTime}</div>
                  </div>
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabel}>Video Consultation Requested</div>
                    <div className={styles.detailValue}>{consultation.videoConsultation ? 'Yes (Google Meet / Zoom)' : 'No (In-person / Call)'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: EDIT CASE DETAILS */}
            {activeTab === 'edit' && (
              <div className={styles.detailCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>✏️ Update Your Case Details</h3>
                </div>
                <form onSubmit={handleSaveEdit} className={styles.editSection}>
                  <div className={styles.cardGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Full Name *</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={editFullName}
                        onChange={(e) => setEditFullName(e.target.value)}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Mobile Number *</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={editMobile}
                        onChange={(e) => setEditMobile(e.target.value)}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Email Address *</label>
                      <input
                        type="email"
                        className={styles.input}
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Preferred Contact Time</label>
                      <select
                        className={styles.input}
                        value={editPreferredContactTime}
                        onChange={(e) => setEditPreferredContactTime(e.target.value)}
                      >
                        <option value="morning">Morning (9 AM - 12 PM)</option>
                        <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                        <option value="evening">Evening (4 PM - 7 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Updated Case Summary & Legal Facts</label>
                    <textarea
                      rows={4}
                      className={styles.input}
                      value={editCaseSummary}
                      onChange={(e) => setEditCaseSummary(e.target.value)}
                      placeholder="Add any new developments, timeline events, or details about your legal dispute..."
                    />
                  </div>

                  <div className={styles.cardGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Opponent Party Name</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={editOpponentName}
                        onChange={(e) => setEditOpponentName(e.target.value)}
                        placeholder="e.g. Suresh Chandra"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Court Jurisdiction</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={editCourt}
                        onChange={(e) => setEditCourt(e.target.value)}
                        placeholder="e.g. Patna High Court / Civil Court"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Police Station</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={editPoliceStation}
                        onChange={(e) => setEditPoliceStation(e.target.value)}
                        placeholder="e.g. Gomti Nagar PS"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Case Stage</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={editCaseStage}
                        onChange={(e) => setEditCaseStage(e.target.value)}
                        placeholder="e.g. Notice Received / FIR / Evidence"
                      />
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', marginTop: 10 }}>
                    <button type="submit" className={styles.saveBtn} disabled={savingUpdates}>
                      {savingUpdates ? 'Saving Updates...' : '💾 Save Case Updates'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 3: ATTACH & MANAGE DOCUMENTS */}
            {activeTab === 'documents' && (
              <div className={styles.detailCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>📁 Upload & Manage Case Documents</h3>
                </div>

                <div className={styles.docList}>
                  {consultation.documents && consultation.documents.length > 0 ? (
                    consultation.documents.map((doc, idx) => (
                      <div key={idx} className={styles.docItem}>
                        <div className={styles.docInfo}>
                          <div className={styles.docIcon}>📄</div>
                          <div>
                            <div className={styles.docName}>{doc.name}</div>
                            <div className={styles.docSize}>{formatFileSize(doc.size)} • {doc.type}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          className={styles.docDeleteBtn}
                          onClick={() => handleDeleteDocument(idx)}
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', padding: '16px 0' }}>
                      No documents attached yet. Attach your legal notices, agreements, FIR copies, or property deeds below.
                    </p>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                  multiple
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                />

                <div
                  className={styles.uploadDropzone}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📤</div>
                  <div className={styles.uploadTitle}>
                    {uploadingDoc ? 'Attaching document(s)...' : 'Click or drag files here to attach to your case'}
                  </div>
                  <div className={styles.uploadSub}>Supports PDF, DOCX, PNG, JPG (up to 10MB per file)</div>
                </div>
              </div>
            )}

            {/* TAB 4: AI GUIDANCE & NEXT STEPS */}
            {activeTab === 'ai' && (
              <div className={styles.cardGrid}>
                <div className={styles.detailCard}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>🧠 AI Legal Assessment</h3>
                  </div>
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabel}>Legal Category</div>
                    <div className={styles.detailValue}>{consultation.aiCategory || consultation.practiceArea}</div>
                  </div>
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabel}>Assessed Risk Level</div>
                    <div className={styles.detailValue} style={{ fontWeight: 700, color: consultation.aiRiskLevel === 'High' ? '#D32F2F' : '#2F855A' }}>
                      {consultation.aiRiskLevel || 'Standard Risk'}
                    </div>
                  </div>
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabel}>Executive Summary</div>
                    <div className={styles.detailValue}>{consultation.aiSummary || 'Summary pending legal review.'}</div>
                  </div>
                </div>

                <div className={styles.detailCard}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>📋 Recommended Next Steps Checklist</h3>
                  </div>
                  <ul style={{ paddingLeft: 20, margin: 0 }}>
                    {consultation.aiNextSteps && consultation.aiNextSteps.length > 0 ? (
                      consultation.aiNextSteps.map((step, idx) => (
                        <li key={idx} style={{ marginBottom: 10, fontSize: 14, lineHeight: 1.6, color: 'var(--navy)' }}>
                          <strong>Step {idx + 1}:</strong> {step}
                        </li>
                      ))
                    ) : (
                      <li style={{ fontSize: 14, color: 'var(--text-muted)' }}>Checklist will be populated by senior counsel during initial briefing.</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 5: LEGAL TEAM NOTES */}
            {activeTab === 'notes' && (
              <div className={styles.detailCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>💬 Advocate Aastha's Office Notes</h3>
                </div>
                {consultation.internalNotes ? (
                  <div style={{ background: 'var(--bg)', padding: 18, borderRadius: 'var(--radius-md)', borderLeft: '4px solid #C9A227', fontSize: 15, lineHeight: 1.7 }}>
                    {consultation.internalNotes}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                    No public office notes added yet. Updates will appear here after your scheduled consultation.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
