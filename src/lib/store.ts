import fs from 'fs';
import path from 'path';
import { ConsultationRequest } from './types';

const DATA_FILE = path.join(process.cwd(), 'data', 'consultations.json');

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
}

export function getAllConsultations(): ConsultationRequest[] {
  ensureDataDir();
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw) as ConsultationRequest[];
}

export function getConsultationById(id: string): ConsultationRequest | null {
  const all = getAllConsultations();
  return all.find((c) => c.id === id) || null;
}

export function saveConsultation(consultation: ConsultationRequest): void {
  ensureDataDir();
  const all = getAllConsultations();
  all.unshift(consultation);
  fs.writeFileSync(DATA_FILE, JSON.stringify(all, null, 2));
}

export function updateConsultation(id: string, updates: Partial<ConsultationRequest>): ConsultationRequest | null {
  ensureDataDir();
  const all = getAllConsultations();
  const idx = all.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
  fs.writeFileSync(DATA_FILE, JSON.stringify(all, null, 2));
  return all[idx];
}

export function deleteConsultation(id: string): boolean {
  ensureDataDir();
  const all = getAllConsultations();
  const filtered = all.filter((c) => c.id !== id);
  if (filtered.length === all.length) return false;
  fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2));
  return true;
}
