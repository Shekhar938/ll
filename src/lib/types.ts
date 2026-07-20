export interface ConsultationRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'archived';

  // Step 1 - Personal
  fullName: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  preferredLanguage: string;
  occupation: string;

  // Step 2 - Legal Matter
  practiceArea: string;
  caseType: string;
  caseSummary: string;
  opponentName: string;
  court: string;
  policeStation: string;
  caseStage: string;

  // Step 3 - Priority
  urgency: 'low' | 'medium' | 'high';
  preferredContactTime: string;
  videoConsultation: boolean;

  // Step 4 - Documents
  documents: UploadedDocument[];

  // AI Analysis
  aiSummary?: string;
  aiCategory?: string;
  aiPriority?: string;
  aiDocuments?: string[];
  aiDuration?: string;
  aiRiskLevel?: string;
  aiKeywords?: string[];
  aiNextSteps?: string[];

  // Admin
  internalNotes?: string;
  assignedTo?: string;
}

export interface UploadedDocument {
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface AdminSession {
  authenticated: boolean;
  expiresAt: string;
}
