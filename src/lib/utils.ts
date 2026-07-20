// Client-safe utilities and constants
// Do NOT import server-only modules here

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
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

export const STATES = ['Bihar'];

export const BIHAR_DISTRICTS = [
  'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 
  'Buxar', 'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 
  'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 
  'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 
  'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 
  'Vaishali', 'West Champaran'
];

export const LANGUAGES = [
  'English', 'Hindi'
];
