import { createPool } from '@vercel/postgres';
import { ConsultationRequest } from './types';

// The Vercel Neon integration added a 'DATA_' prefix to the environment variables.
const connectionString = process.env.DATA_POSTGRES_URL || process.env.POSTGRES_URL;
const pool = createPool({ connectionString });
const sql = pool.sql;

// Helper to initialize the table if it doesn't exist
export async function initializeDatabase() {
  try {
    await sql`
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
        "aiNextSteps" JSONB
      );
    `;
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

export async function getAllConsultations(): Promise<ConsultationRequest[]> {
  try {
    const { rows } = await sql<ConsultationRequest>`SELECT * FROM consultations ORDER BY "createdAt" DESC`;
    return rows;
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return [];
  }
}

export async function getConsultationById(id: string): Promise<ConsultationRequest | null> {
  try {
    const { rows } = await sql<ConsultationRequest>`SELECT * FROM consultations WHERE id = ${id} LIMIT 1`;
    return rows[0] || null;
  } catch (error) {
    console.error('Error fetching consultation by id:', error);
    return null;
  }
}

export async function saveConsultation(c: ConsultationRequest): Promise<void> {
  try {
    await sql`
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
    console.error('Error saving consultation:', error);
    throw error;
  }
}

export async function updateConsultation(id: string, updates: Partial<ConsultationRequest>): Promise<ConsultationRequest | null> {
  try {
    // Basic dynamic update builder for Postgres
    const setClauses: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (key === 'id') continue;
      const dbKey = key.includes('A') || key.includes('C') || key.includes('N') || key.includes('D') || key.includes('L') || key.includes('S') || key.includes('P') || key.includes('K') || key.includes('R') || key.includes('F') ? `"${key}"` : key;
      
      setClauses.push(`${dbKey} = $${idx}`);
      values.push(typeof value === 'object' ? JSON.stringify(value) : value);
      idx++;
    }

    setClauses.push(`"updatedAt" = $${idx}`);
    values.push(new Date().toISOString());
    idx++;

    values.push(id); // For the WHERE clause

    const query = `UPDATE consultations SET ${setClauses.join(', ')} WHERE id = $${idx - 1} RETURNING *`;
    
    // We have to use the underlying pool to run a dynamic query string safely.
    const { rows } = await pool.query(query, values);
    return (rows[0] as ConsultationRequest) || null;
  } catch (error) {
    console.error('Error updating consultation:', error);
    return null;
  }
}

export async function deleteConsultation(id: string): Promise<boolean> {
  try {
    const res = await sql`DELETE FROM consultations WHERE id = ${id}`;
    return (res.rowCount ?? 0) > 0;
  } catch (error) {
    console.error('Error deleting consultation:', error);
    return false;
  }
}
