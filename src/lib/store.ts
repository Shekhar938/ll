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

    // Seed and synchronize sample consultations into PostgreSQL database
    for (const c of memoryStore) {
      await pool.sql`
        INSERT INTO consultations (
          id, "createdAt", "updatedAt", status, "fullName", mobile, email, city, state, "preferredLanguage",
          occupation, "practiceArea", "caseType", "caseSummary", "opponentName", court, "policeStation", "caseStage",
          urgency, "preferredContactTime", "videoConsultation", documents, "aiSummary", "aiCategory", "aiPriority",
          "aiDocuments", "aiDuration", "aiRiskLevel", "aiKeywords", "aiNextSteps", "internalNotes"
        ) VALUES (
          ${c.id}, ${c.createdAt}, ${c.updatedAt}, ${c.status}, ${c.fullName}, ${c.mobile}, ${c.email}, ${c.city}, ${c.state}, ${c.preferredLanguage},
          ${c.occupation}, ${c.practiceArea}, ${c.caseType}, ${c.caseSummary}, ${c.opponentName}, ${c.court}, ${c.policeStation}, ${c.caseStage},
          ${c.urgency}, ${c.preferredContactTime}, ${c.videoConsultation ? true : false}::boolean, ${JSON.stringify(c.documents || [])}::jsonb, ${c.aiSummary}, ${c.aiCategory}, ${c.aiPriority},
          ${JSON.stringify(c.aiDocuments || [])}::jsonb, ${c.aiDuration}, ${c.aiRiskLevel}, ${JSON.stringify(c.aiKeywords || [])}::jsonb, ${JSON.stringify(c.aiNextSteps || [])}::jsonb, ${c.internalNotes || ''}
        )
        ON CONFLICT (id) DO UPDATE SET
          "fullName" = EXCLUDED."fullName",
          "practiceArea" = EXCLUDED."practiceArea",
          "caseType" = EXCLUDED."caseType",
          "caseSummary" = EXCLUDED."caseSummary",
          "opponentName" = EXCLUDED."opponentName",
          court = EXCLUDED.court,
          "policeStation" = EXCLUDED."policeStation",
          "caseStage" = EXCLUDED."caseStage",
          "aiSummary" = EXCLUDED."aiSummary",
          "aiCategory" = EXCLUDED."aiCategory",
          "aiPriority" = EXCLUDED."aiPriority",
          "aiDocuments" = EXCLUDED."aiDocuments",
          "aiDuration" = EXCLUDED."aiDuration",
          "aiRiskLevel" = EXCLUDED."aiRiskLevel",
          "aiKeywords" = EXCLUDED."aiKeywords",
          "aiNextSteps" = EXCLUDED."aiNextSteps",
          "internalNotes" = EXCLUDED."internalNotes";
      `;
    }
    console.log('Synchronized consultations table with latest business data.');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

let dbInitPromise: Promise<void> | null = null;
export async function ensureDatabaseInitialized(): Promise<void> {
  const pool = getPool();
  if (!pool) return;
  if (!dbInitPromise) {
    dbInitPromise = initializeDatabase().catch((err) => {
      console.error('Failed to auto-initialize database:', err);
      dbInitPromise = null;
    });
  }
  return dbInitPromise;
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
    state: 'National',
    preferredLanguage: 'English',
    occupation: 'Managing Director',
    practiceArea: 'Corporate Advisory',
    caseType: 'Restructuring',
    caseSummary: 'Enterprise governance review and stakeholder realignment advisory for our multi-tier distribution business ahead of Series-B capital raise.',
    opponentName: 'Apex Distribution Ventures',
    court: 'Corporate Commercial Services',
    policeStation: 'Unit-CORP-4',
    caseStage: 'Initiating Project',
    urgency: 'high',
    preferredContactTime: 'morning',
    videoConsultation: true,
    documents: [{ name: 'Governance_Audit_Brief.pdf', size: 2450000, type: 'application/pdf' }],
    aiSummary: 'Client Rajesh Kumar has requested Corporate Advisory services for capital structuring and stakeholder governance. Initial consultation and preliminary deck review recommended.',
    aiCategory: 'Corporate Advisory – Restructuring',
    aiPriority: 'High',
    aiDocuments: ['Corporate bylaws', 'Shareholder registers', 'Audited financial statements', 'Series-B term sheet'],
    aiDuration: '90 minutes',
    aiRiskLevel: 'High',
    aiKeywords: ['corporate', 'governance', 'restructuring', 'stakeholders', 'advisory'],
    aiNextSteps: ['Review capitalization table and stakeholder agreements', 'Schedule executive discovery workshop', 'Formulate 90-day restructuring milestones'],
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
    state: 'National',
    preferredLanguage: 'English',
    occupation: 'VP of Technology',
    practiceArea: 'Cyber & Information Security',
    caseType: 'Security Posture Audit',
    caseSummary: 'Comprehensive security posture assessment, DPDP privacy compliance readiness review, and vendor access audit for payment gateway integration.',
    opponentName: 'FinTech Integrators Consortium',
    court: 'FinTech & Digital Commerce',
    policeStation: 'SecOps-Desk-1',
    caseStage: 'Active Operations',
    urgency: 'high',
    preferredContactTime: 'evening',
    videoConsultation: false,
    documents: [{ name: 'Architecture_Security_Scope.pdf', size: 1200000, type: 'application/pdf' }],
    aiSummary: 'Client Vikram Aditya requires end-to-end information security architecture review and data privacy compliance framework. Project is active in Stage 2.',
    aiCategory: 'Cyber & Information Security – Security Posture Audit',
    aiPriority: 'High',
    aiDocuments: ['Network topology diagrams', 'IAM access policies', 'Data flow mappings', 'Third-party vendor list'],
    aiDuration: '60 minutes',
    aiRiskLevel: 'High',
    aiKeywords: ['cybersecurity', 'DPDP', 'cloud infrastructure', 'audit', 'compliance'],
    aiNextSteps: ['Deliver vulnerability and access control audit matrix', 'Draft DPDP compliance operational handbook', 'Review third-party API token policies'],
    internalNotes: 'Security audit phase 1 completed. Awaiting review with CTO.'
  },
  {
    id: 'NYC-2026-0814-03',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: 'resolved',
    fullName: 'Jordan Hayes',
    mobile: '9876543211',
    email: 'jordan.hayes@example.com',
    city: 'Mumbai',
    state: 'International',
    preferredLanguage: 'English',
    occupation: 'Chief Executive Officer',
    practiceArea: 'Business Strategy',
    caseType: 'Growth Strategy',
    caseSummary: 'Strategic growth advisory for expanding enterprise SaaS operations into international tier-1 markets.',
    opponentName: 'Global Expansion Unit',
    court: 'Enterprise Technology Sector',
    policeStation: 'GTM-Desk-North',
    caseStage: 'Scaling & Delivery',
    urgency: 'medium',
    preferredContactTime: 'afternoon',
    videoConsultation: true,
    documents: [{ name: 'SaaS_Expansion_Strategy_Brief.pdf', size: 1850000, type: 'application/pdf' }],
    aiSummary: 'Enterprise strategy advisory regarding international go-to-market and partnership framework. Advisory completed and milestones delivered.',
    aiCategory: 'Business Strategy – Growth Strategy',
    aiPriority: 'Medium',
    aiDocuments: ['Corporate deck', 'Financial model', 'Market penetration roadmap'],
    aiDuration: '60 minutes',
    aiRiskLevel: 'Medium',
    aiKeywords: ['growth', 'strategy', 'expansion', 'SaaS', 'partnership'],
    aiNextSteps: ['Review regional market analysis', 'Draft strategic partnership terms', 'Schedule quarterly review session'],
    internalNotes: 'Engagement successfully delivered. Partnership framework finalized.'
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
  await ensureDatabaseInitialized();
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
  await ensureDatabaseInitialized();
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
  await ensureDatabaseInitialized();
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
  await ensureDatabaseInitialized();
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
  await ensureDatabaseInitialized();
  const pool = getPool();
  if (pool) {
    try {
      await pool.sql`
        INSERT INTO consultations (
          id, "createdAt", "updatedAt", status, "fullName", mobile, email, city, state, "preferredLanguage",
          occupation, "practiceArea", "caseType", "caseSummary", "opponentName", court, "policeStation", "caseStage",
          urgency, "preferredContactTime", "videoConsultation", documents, "aiSummary", "aiCategory", "aiPriority",
          "aiDocuments", "aiDuration", "aiRiskLevel", "aiKeywords", "aiNextSteps", "internalNotes"
        ) VALUES (
          ${c.id}, ${c.createdAt}, ${c.updatedAt}, ${c.status}, ${c.fullName}, ${c.mobile}, ${c.email}, ${c.city}, ${c.state}, ${c.preferredLanguage},
          ${c.occupation}, ${c.practiceArea}, ${c.caseType}, ${c.caseSummary}, ${c.opponentName}, ${c.court}, ${c.policeStation}, ${c.caseStage},
          ${c.urgency}, ${c.preferredContactTime}, ${c.videoConsultation ? true : false}::boolean, ${JSON.stringify(c.documents || [])}::jsonb, ${c.aiSummary}, ${c.aiCategory}, ${c.aiPriority},
          ${JSON.stringify(c.aiDocuments || [])}::jsonb, ${c.aiDuration}, ${c.aiRiskLevel}, ${JSON.stringify(c.aiKeywords || [])}::jsonb, ${JSON.stringify(c.aiNextSteps || [])}::jsonb, ${c.internalNotes || ''}
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
  await ensureDatabaseInitialized();
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
  await ensureDatabaseInitialized();
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


