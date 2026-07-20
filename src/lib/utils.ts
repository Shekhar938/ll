import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from './auth';

export async function adminMiddleware(req: NextRequest): Promise<NextResponse | null> {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export function generateId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `NYC-${timestamp}-${random}`.toUpperCase();
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function sanitizeInput(str: string): string {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}

export const PRACTICE_AREAS = [
  'Criminal Law',
  'Civil Law',
  'Property Law',
  'Family Law',
  'Corporate Law',
  'Consumer Law',
  'Labour Law',
  'Tax Law',
  'Cyber Crime',
  'Banking Law',
  'Arbitration',
  'Employment Law',
];

export const CASE_TYPES: Record<string, string[]> = {
  'Criminal Law': ['Bail Application', 'Anticipatory Bail', 'Quashing', 'Trial Defense', 'Appeal'],
  'Civil Law': ['Recovery Suit', 'Injunction', 'Declaration', 'Specific Performance', 'Damages'],
  'Property Law': ['Title Dispute', 'Possession', 'Partition', 'Injunction', 'Registration'],
  'Family Law': ['Divorce', 'Custody', 'Maintenance', 'Domestic Violence', 'Adoption'],
  'Corporate Law': ['Incorporation', 'Compliance', 'Merger', 'Dispute Resolution', 'IPR'],
  'Consumer Law': ['Product Defect', 'Service Deficiency', 'Misleading Advertisement', 'Refund'],
  'Labour Law': ['Wrongful Termination', 'Gratuity', 'PF Dispute', 'ESIC', 'Wage Dispute'],
  'Tax Law': ['Income Tax', 'GST', 'Customs', 'Assessment', 'Penalty Waiver'],
  'Cyber Crime': ['Online Fraud', 'Data Breach', 'Cyberstalking', 'Hacking', 'Identity Theft'],
  'Banking Law': ['Loan Recovery', 'Cheque Bounce', 'NPA', 'SARFAESI', 'Debt Recovery'],
  'Arbitration': ['Commercial Dispute', 'Construction', 'International', 'Enforcement of Award'],
  'Employment Law': ['Discrimination', 'Harassment', 'Wrongful Dismissal', 'Benefits Dispute'],
};

export const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

export const LANGUAGES = [
  'English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam',
  'Marathi', 'Bengali', 'Gujarati', 'Punjabi', 'Odia', 'Urdu',
];
