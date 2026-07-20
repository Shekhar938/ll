'use client';
import { useCallback, useState } from 'react';
import StepHeader from './StepHeader';
import NavButtons from './NavButtons';
import fieldStyles from './FormField.module.css';
import styles from './Step4Documents.module.css';
import { FormData } from './ConsultForm';

const ACCEPTED = '.pdf,.docx,.doc,.jpg,.jpeg,.png,.webp';
const MAX_SIZE = 20 * 1024 * 1024;
const MAX_FILES = 10;

function fileIcon(type: string) {
  if (type.includes('pdf')) return '📄';
  if (type.includes('word') || type.includes('document')) return '📝';
  if (type.startsWith('image')) return '🖼️';
  return '📎';
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface Props { data: FormData; update: (u: Partial<FormData>) => void; onNext: () => void; onBack: () => void; }

export default function Step4Documents({ data, update, onNext, onBack }: Props) {
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState('');

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    setFileError('');
    const valid: File[] = [];
    const errs: string[] = [];
    Array.from(incoming).forEach((f) => {
      if (f.size > MAX_SIZE) errs.push(`${f.name} exceeds 20 MB limit`);
      else if (data.documents.length + valid.length >= MAX_FILES) errs.push(`Maximum ${MAX_FILES} files allowed`);
      else valid.push(f);
    });
    if (errs.length) setFileError(errs[0]);
    if (valid.length) update({ documents: [...data.documents, ...valid] });
  }, [data.documents, update]);

  const removeFile = (i: number) => {
    const docs = [...data.documents];
    docs.splice(i, 1);
    update({ documents: docs });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <StepHeader step={4} title="Document Upload" desc="Upload relevant documents to help us better understand your case. All files are securely encrypted." />

      <div
        className={`${styles.dropZone} ${dragging ? styles.dragging : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <input id="fileInput" type="file" multiple accept={ACCEPTED} className={styles.fileInput} onChange={(e) => addFiles(e.target.files)} />
        <div className={styles.dropIcon}>📂</div>
        <p className={styles.dropTitle}>Drag & drop files here</p>
        <p className={styles.dropSub}>or click to browse</p>
        <div className={styles.dropMeta}>
          <span>PDF, DOCX, JPG, PNG</span>
          <span>·</span>
          <span>Max 20 MB per file</span>
          <span>·</span>
          <span>Up to {MAX_FILES} files</span>
        </div>
      </div>

      {fileError && <p className={styles.fileError}>{fileError}</p>}

      {data.documents.length > 0 && (
        <div className={styles.fileList}>
          <p className={styles.fileListTitle}>{data.documents.length} file{data.documents.length !== 1 ? 's' : ''} selected</p>
          {data.documents.map((file, i) => (
            <div key={`${file.name}-${i}`} className={styles.fileItem}>
              <span className={styles.fileItemIcon}>{fileIcon(file.type)}</span>
              <div className={styles.fileItemInfo}>
                <span className={styles.fileItemName}>{file.name}</span>
                <span className={styles.fileItemSize}>{formatSize(file.size)}</span>
              </div>
              <button className={styles.removeBtn} onClick={() => removeFile(i)} aria-label="Remove file">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.securityNote}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        All uploaded documents are encrypted and accessible only to your assigned advocate.
      </div>

      <NavButtons onBack={onBack} onNext={onNext} nextLabel="Review & Submit" />
    </div>
  );
}
