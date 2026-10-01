import { createPool } from '@vercel/postgres';
import { ConsultationRequest } from './types';

// Lazily initialize the pool to avoid build-time crashes and support DATA_POSTGRES_URL
function getPool() {
  const connectionString = process.env.DATA_POSTGRES_URL || process.env.POSTGRES_URL;
  if (!connectionString) return null;
  return createPool({ connectionString });
}

// Helper to initialize the table if it doesn't exist
export async function initializeDatabase() {
  const pool = getPool();
  if (!pool) {
    console.warn('Skipping database initialization: Connection string is missing.');
    return;
  }
  
  try {
    await pool.sql`
      CREATE TABLE IF NOT EXISTS consultations (
        id VARCHAR(255) PRIMARY KEY,
        "createdAt" TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP NOT NULL,
        status VARCHAR(50) NOT NULL,
        "fullName" VARCHAR(255) NOT NULL,
        mobile VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        city VARCHAR(100),
        state VARCHAR(100),
        "preferredLanguage" VARCHAR(50),
        occupation VARCHAR(100),
        "practiceArea" VARCHAR(100),
        "caseType" VARCHAR(100),
        "caseSummary" TEXT,
        "opponentName" VARCHAR(255),
        court VARCHAR(255),
        "policeStation" VARCHAR(255),
        "caseStage" VARCHAR(100),
        urgency VARCHAR(50),
        "preferredContactTime" VARCHAR(50),
        "videoConsultation" BOOLEAN,
        documents JSONB,
        "aiSummary" TEXT,
        "aiCategory" VARCHAR(100),
        "aiPriority" VARCHAR(50),
        "aiDocuments" JSONB,
        "aiDuration" VARCHAR(100),
        "aiRiskLevel" VARCHAR(50),
        "aiKeywords" JSONB,
        "aiNextSteps" JSONB,
        "internalNotes" TEXT
      );
    `;

    // Ensure the internalNotes column exists for older deployments
    await pool.sql`
      ALTER TABLE consultations 
      ADD COLUMN IF NOT EXISTS "internalNotes" TEXT;
    `;

    // Performance Indexes
    await pool.sql`CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);`;
    await pool.sql`CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON consultations("createdAt" DESC);`;
    await pool.sql`CREATE INDEX IF NOT EXISTS idx_consultations_practice_area ON consultations("practiceArea");`;
    await pool.sql`CREATE INDEX IF NOT EXISTS idx_consultations_urgency ON consultations(urgency);`;
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

const memoryStore: ConsultationRequest[] = [
  {
    id: 'NYC-2026-0814-01',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'pending',
    fullName: 'Rajesh Kumar',
    mobile: '9812345678',
    email: 'rajesh.kumar@example.com',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    preferredLanguage: 'Hindi',
    occupation: 'Business Owner',
    practiceArea: 'Property Law',
    caseType: 'Land Boundary Dispute',
    caseSummary: 'Neighbor has illegally encroached upon 500 sq ft of ancestral land in Gomti Nagar and sent a bogus legal notice claiming title. Need urgent civil suit representation.',
    opponentName: 'Suresh Chandra',
    court: 'Lucknow Civil Court',
    policeStation: 'Gomti Nagar PS',
    caseStage: 'Notice Received',
    urgency: 'high',
    preferredContactTime: 'morning',
    videoConsultation: true,
    documents: [{ name: 'Sale_Deed_2012.pdf', size: 2450000, type: 'application/pdf' }],
    aiSummary: 'The client Rajesh Kumar from Lucknow, UP has presented a high-urgency Property Law matter involving a land boundary encroachment dispute. Current stage is Notice Received. Immediate title verification and reply to notice recommended.',
    aiCategory: 'Property Law – Land Boundary Dispute',
    aiPriority: 'High',
    aiDocuments: ['Sale deed', 'Encumbrance certificate', 'Property tax receipts', 'Survey records'],
    aiDuration: '90 minutes',
    aiRiskLevel: 'High',
    aiKeywords: ['property', 'encroachment', 'title', 'survey', 'legal notice'],
    aiNextSteps: ['Verify title deeds and survey maps', 'Draft formal reply to opponent notice', 'File application for temporary injunction in Civil Court'],
    internalNotes: 'Initial contact made. Client requested video consultation tomorrow at 11:00 AM.'
  },
  {
    id: 'NYC-2026-0814-02',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'in-progress',
    fullName: 'Vikram Aditya',
    mobile: '9876543210',
    email: 'vikram.aditya@example.com',
    city: 'Bengaluru',
    state: 'Karnataka',
    preferredLanguage: 'English',
    occupation: 'Software Engineer',
    practiceArea: 'Cyber Crime',
    caseType: 'Online Financial Fraud',
    caseSummary: 'An unauthorized transaction of 2,50,000 INR was made from my bank account via a phishing call yesterday. I have lodged an initial complaint with the Cyber Crime Police Cell.',
    opponentName: 'Unknown Cyber Fraudster',
    court: 'N/A',
    policeStation: 'Bengaluru Cyber Crime Cell',
    caseStage: 'FIR',
    urgency: 'high',
    preferredContactTime: 'evening',
    videoConsultation: false,
    documents: [{ name: 'Bank_Statement_Aug2026.pdf', size: 1200000, type: 'application/pdf' }],
    aiSummary: 'Client Vikram Aditya experienced a ₹2.5L banking phishing fraud. FIR registered with Cyber Cell. Case requires fast bank dispute representation under RBI cyber fraud guidelines.',
    aiCategory: 'Cyber Crime – Online Financial Fraud',
    aiPriority: 'High',
    aiDocuments: ['Bank statement showing transaction', 'Phishing call logs & SMS screenshots', 'Police complaint acknowledgment'],
    aiDuration: '60 minutes',
    aiRiskLevel: 'High',
    aiKeywords: ['cyber', 'phishing', 'unauthorized transaction', 'banking', 'FIR'],
    aiNextSteps: ['Submit zero-liability claim under RBI guidelines to Bank', 'Follow up with Cyber Cell Investigating Officer', 'File representation with Banking Ombudsman'],
    internalNotes: 'Representing client before Banking Ombudsman.'
  },
  {
    id: 'NYC-2026-0814-03',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: 'resolved',
    fullName: 'Aastha Sharma',
    mobile: '9876543211',
    email: 'aastha.sharma@example.com',
    city: 'Mumbai',
    state: 'Maharashtra',
    preferredLanguage: 'English',
    occupation: 'Architect',
    practiceArea: 'Family Law',
    caseType: 'Divorce & Child Custody',
    caseSummary: 'Seeking mutual consent divorce agreement terms and child custody arrangement negotiation.',
    opponentName: 'Rahul Sharma',
    court: 'Mumbai Family Court',
    policeStation: 'N/A',
    caseStage: 'Court Case',
    urgency: 'medium',
    preferredContactTime: 'afternoon',
    videoConsultation: true,
    documents: [],
    aiSummary: 'Family law matter regarding mutual divorce settlement and child custody terms. Mediation completed successfully.',
    aiCategory: 'Family Law – Divorce & Child Custody',
    aiPriority: 'Medium',
    aiDocuments: ['Marriage certificate', 'Income proof', 'Child custody draft agreement'],
    aiDuration: '60 minutes',
    aiRiskLevel: 'Medium',
    aiKeywords: ['divorce', 'custody', 'settlement', 'family court'],
    aiNextSteps: ['Finalize mutual consent petition', 'File in Family Court', 'Obtain decree'],
    internalNotes: 'Case successfully resolved. Mutual petition filed.'
  }
];


export interface FetchConsultationsFilter {
  search?: string;
  status?: string;
  practiceArea?: string;
  state?: string;
  limit?: number;
  offset?: number;
}

export async function getFilteredConsultations(filter: FetchConsultationsFilter = {}): Promise<{
  rows: ConsultationRequest[];
  total: number;
}> {
  const pool = getPool();
  if (pool) {
    try {
      const conditions: string[] = [];
      const values: any[] = [];
      let idx = 1;

      if (filter.search) {
        conditions.push(`("fullName" ILIKE $${idx} OR mobile ILIKE $${idx} OR id ILIKE $${idx} OR "practiceArea" ILIKE $${idx})`);
        values.push(`%${filter.search}%`);
        idx++;
      }

      if (filter.status) {
        conditions.push(`status = $${idx}`);
        values.push(filter.status);
        idx++;
      }

      if (filter.practiceArea) {
        conditions.push(`"practiceArea" = $${idx}`);
        values.push(filter.practiceArea);
        idx++;
      }

      if (filter.state) {
        conditions.push(`state = $${idx}`);
        values.push(filter.state);
        idx++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const countQuery = `SELECT COUNT(*)::int as count FROM consultations ${whereClause}`;
      const countRes = await pool.query(countQuery, values);
      const total = countRes.rows[0]?.count || 0;

      let dataQuery = `SELECT * FROM consultations ${whereClause} ORDER BY "createdAt" DESC`;
      if (filter.limit) {
        dataQuery += ` LIMIT $${idx}`;
        values.push(filter.limit);
        idx++;
        if (filter.offset) {
          dataQuery += ` OFFSET $${idx}`;
          values.push(filter.offset);
          idx++;
        }
      }

      const { rows } = await pool.query(dataQuery, values);
      return { rows: rows as ConsultationRequest[], total };
    } catch (error) {
      console.warn('PostgreSQL query failed, using in-memory store:', error);
    }
  }

  let rows = [...memoryStore];
  if (filter.search) {
    const q = filter.search.toLowerCase();
    rows = rows.filter(c => c.fullName.toLowerCase().includes(q) || c.mobile.includes(q) || c.id.toLowerCase().includes(q));
  }
  if (filter.status) rows = rows.filter(c => c.status === filter.status);
  if (filter.practiceArea) rows = rows.filter(c => c.practiceArea === filter.practiceArea);
  if (filter.state) rows = rows.filter(c => c.state === filter.state);

  const total = rows.length;
  if (filter.offset || filter.limit) {
    const start = filter.offset || 0;
    const end = filter.limit ? start + filter.limit : rows.length;
    rows = rows.slice(start, end);
  }

  return { rows, total };
}

export async function getAllConsultations(): Promise<ConsultationRequest[]> {
  const pool = getPool();
  if (pool) {
    try {
      const { rows } = await pool.sql<ConsultationRequest>`SELECT * FROM consultations ORDER BY "createdAt" DESC`;
      return rows;
    } catch (error) {
      console.warn('PostgreSQL query failed, returning in-memory store:', error);
    }
  }
  return [...memoryStore];
}

export async function getConsultationById(id: string): Promise<ConsultationRequest | null> {
  const pool = getPool();
  if (pool) {
    try {
      const { rows } = await pool.sql<ConsultationRequest>`SELECT * FROM consultations WHERE id = ${id} LIMIT 1`;
      return rows[0] || null;
    } catch (error) {
      console.warn('PostgreSQL query failed, searching in-memory store:', error);
    }
  }
  return memoryStore.find(c => c.id === id) || null;
}

export async function getConsultationByCredentials(id: string, identifier: string): Promise<ConsultationRequest | null> {
  const cleanId = id.trim().toUpperCase();
  const cleanIdent = identifier.trim().toLowerCase();
  
  const pool = getPool();
  if (pool) {
    try {
      const { rows } = await pool.query<ConsultationRequest>(
        `SELECT * FROM consultations WHERE UPPER(id) = $1 AND (LOWER(mobile) = $2 OR LOWER(email) = $2) LIMIT 1`,
        [cleanId, cleanIdent]
      );
      if (rows[0]) return rows[0];
    } catch (error) {
      console.warn('PostgreSQL query failed, searching in-memory store:', error);
    }
  }

  return memoryStore.find(c => 
    c.id.toUpperCase() === cleanId && 
    (c.mobile.toLowerCase() === cleanIdent || c.email.toLowerCase() === cleanIdent)
  ) || null;
}

export async function saveConsultation(c: ConsultationRequest): Promise<void> {
  const pool = getPool();
  if (pool) {
    try {
      await pool.sql`
        INSERT INTO consultations (
          id, "createdAt", "updatedAt", status, "fullName", mobile, email, city, state, "preferredLanguage",
          occupation, "practiceArea", "caseType", "caseSummary", "opponentName", court, "policeStation", "caseStage",
          urgency, "preferredContactTime", "videoConsultation", documents, "aiSummary", "aiCategory", "aiPriority",
          "aiDocuments", "aiDuration", "aiRiskLevel", "aiKeywords", "aiNextSteps"
        ) VALUES (
          ${c.id}, ${c.createdAt}, ${c.updatedAt}, ${c.status}, ${c.fullName}, ${c.mobile}, ${c.email}, ${c.city}, ${c.state}, ${c.preferredLanguage},
          ${c.occupation}, ${c.practiceArea}, ${c.caseType}, ${c.caseSummary}, ${c.opponentName}, ${c.court}, ${c.policeStation}, ${c.caseStage},
          ${c.urgency}, ${c.preferredContactTime}, ${c.videoConsultation ? true : false}::boolean, ${JSON.stringify(c.documents || [])}::jsonb, ${c.aiSummary}, ${c.aiCategory}, ${c.aiPriority},
          ${JSON.stringify(c.aiDocuments || [])}::jsonb, ${c.aiDuration}, ${c.aiRiskLevel}, ${JSON.stringify(c.aiKeywords || [])}::jsonb, ${JSON.stringify(c.aiNextSteps || [])}::jsonb
        )
      `;
    } catch (error) {
      console.warn('PostgreSQL save failed, using fallback in-memory store:', error);
    }
  }

  const idx = memoryStore.findIndex((item) => item.id === c.id);
  if (idx >= 0) {
    memoryStore[idx] = c;
  } else {
    memoryStore.unshift(c);
  }
}

const ALLOWED_COLUMNS = new Set([
  'status', 'fullName', 'mobile', 'email', 'city', 'state', 'preferredLanguage',
  'occupation', 'practiceArea', 'caseType', 'caseSummary', 'opponentName', 'court',
  'policeStation', 'caseStage', 'urgency', 'preferredContactTime', 'videoConsultation',
  'documents', 'aiSummary', 'aiCategory', 'aiPriority', 'aiDocuments', 'aiDuration',
  'aiRiskLevel', 'aiKeywords', 'aiNextSteps', 'internalNotes', 'assignedTo'
]);

export async function updateConsultation(id: string, updates: Partial<ConsultationRequest>): Promise<ConsultationRequest | null> {
  const pool = getPool();
  if (pool) {
    try {
      const setClauses: string[] = [];
      const values: any[] = [];
      let idx = 1;

      for (const [key, value] of Object.entries(updates)) {
        if (key === 'id' || !ALLOWED_COLUMNS.has(key)) continue;
        
        const dbKey = key.match(/[A-Z]/) ? `"${key}"` : key;
        setClauses.push(`${dbKey} = $${idx}`);
        values.push(typeof value === 'object' && value !== null ? JSON.stringify(value) : value);
        idx++;
      }

      if (setClauses.length > 0) {
        setClauses.push(`"updatedAt" = $${idx}`);
        values.push(new Date().toISOString());
        idx++;
        values.push(id);

        const query = `UPDATE consultations SET ${setClauses.join(', ')} WHERE id = $${idx} RETURNING *`;
        const { rows } = await pool.query(query, values);
        if (rows[0]) return rows[0] as ConsultationRequest;
      }
    } catch (error) {
      console.warn('PostgreSQL update failed, updating in-memory store:', error);
    }
  }

  const item = memoryStore.find(c => c.id === id);
  if (!item) return null;
  Object.assign(item, updates, { updatedAt: new Date().toISOString() });
  return item;
}

export async function deleteConsultation(id: string): Promise<boolean> {
  const pool = getPool();
  if (pool) {
    try {
      const res = await pool.sql`DELETE FROM consultations WHERE id = ${id}`;
      if ((res.rowCount ?? 0) > 0) {
        const memIdx = memoryStore.findIndex(c => c.id === id);
        if (memIdx >= 0) memoryStore.splice(memIdx, 1);
        return true;
      }
    } catch (error) {
      console.warn('PostgreSQL delete failed, removing from memory store:', error);
    }
  }

  const memIdx = memoryStore.findIndex(c => c.id === id);
  if (memIdx >= 0) {
    memoryStore.splice(memIdx, 1);
    return true;
  }
  return false;
}


