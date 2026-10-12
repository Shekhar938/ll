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
  'Business Strategy',
  'Corporate Advisory',
  'Financial Consulting',
  'Legal & Compliance',
  'Technology & Cloud',
  'Client Operations',
  'HR & Talent Strategy',
  'Consumer & Commerce',
  'Cyber & Information Security',
  'Fintech & Banking Solutions',
  'Marketing & Brand Strategy',
  'Performance Analytics',
];

export const CASE_TYPES: Record<string, string[]> = {
  'Business Strategy': ['Growth Strategy', 'Market Entry', 'Business Plan Review', 'Competitive Analysis', 'Partnerships'],
  'Corporate Advisory': ['Corporate Governance', 'Board Advisory', 'Restructuring', 'Mergers & Acquisitions', 'Stakeholder Alignment'],
  'Financial Consulting': ['Cash Flow Optimization', 'Financial Audit Prep', 'Valuation Advisory', 'Cost Reduction', 'Capital Raising'],
  'Legal & Compliance': ['Commercial Contracts', 'Regulatory Compliance', 'Risk Assessment', 'Policy Formulation', 'Dispute Advisory'],
  'Technology & Cloud': ['Digital Transformation', 'Architecture Review', 'Vendor Selection', 'Cloud Migration', 'Data Governance'],
  'Client Operations': ['Process Automation', 'Service Desk Modernization', 'CRM Workflow Setup', 'SLA Optimization', 'Client Onboarding'],
  'HR & Talent Strategy': ['Organizational Design', 'Executive Search Advisory', 'Compensation & Benefits', 'Employee Policies', 'Culture Audit'],
  'Consumer & Commerce': ['Product Strategy', 'E-commerce Operations', 'Vendor Agreements', 'Customer Experience Review', 'Pricing Strategy'],
  'Cyber & Information Security': ['Security Posture Audit', 'Privacy Compliance (GDPR/DPDP)', 'Incident Response Planning', 'Access Control Review', 'Threat Analysis'],
  'Fintech & Banking Solutions': ['Payment Integration Advisory', 'Banking Relations', 'Lending Framework Review', 'Fintech Licensing', 'Debt Advisory'],
  'Marketing & Brand Strategy': ['Brand Positioning', 'Inbound Lead Strategy', 'Content Architecture', 'Campaign Architecture', 'Reputation Management'],
  'Performance Analytics': ['KPI Scorecards', 'Executive Dashboards', 'Operational Efficiency Audit', 'Unit Economics', 'Cost-Benefit Analysis'],
};

export const STATES = ['General', 'National', 'International'];

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
