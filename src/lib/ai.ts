import { ConsultationRequest } from './types';

const RISK_KEYWORDS: Record<string, string[]> = {
  'Criminal Law': ['FIR', 'arrest', 'bail', 'custody', 'charge', 'police', 'accused', 'crime'],
  'Family Law': ['divorce', 'custody', 'maintenance', 'alimony', 'marriage', 'domestic', 'child'],
  'Property Law': ['property', 'land', 'title', 'registration', 'builder', 'possession', 'dispute'],
  'Civil Law': ['contract', 'agreement', 'breach', 'compensation', 'damages', 'suit', 'claim'],
  'Corporate Law': ['company', 'board', 'shareholder', 'merger', 'acquisition', 'compliance'],
  'Consumer Law': ['consumer', 'product', 'defect', 'refund', 'deficiency', 'service'],
  'Labour Law': ['employment', 'termination', 'dismissal', 'salary', 'provident', 'gratuity'],
  'Tax Law': ['tax', 'income', 'GST', 'penalty', 'assessment', 'evasion', 'refund'],
  'Cyber Crime': ['cyber', 'online', 'fraud', 'hacking', 'phishing', 'data', 'digital'],
  'Banking Law': ['bank', 'loan', 'NPA', 'recovery', 'cheque', 'bounce', 'credit'],
  'Arbitration': ['arbitration', 'mediation', 'award', 'dispute', 'settlement'],
  'Employment Law': ['employment', 'workplace', 'harassment', 'discrimination', 'wrongful'],
};

const RISK_LEVELS: Record<string, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const DOCS_BY_AREA: Record<string, string[]> = {
  'Criminal Law': ['FIR copy', 'Bail papers', 'Chargesheet', 'Previous orders', 'Identity proof'],
  'Family Law': ['Marriage certificate', 'Birth certificates', 'Property documents', 'Income proof'],
  'Property Law': ['Sale deed', 'Encumbrance certificate', 'Property tax receipts', 'Survey records'],
  'Civil Law': ['Agreement/Contract copy', 'Correspondence', 'Previous court orders', 'Evidence documents'],
  'Corporate Law': ['MOA/AOA', 'Board resolutions', 'Shareholder agreements', 'Financial statements'],
  'Consumer Law': ['Purchase invoice', 'Warranty card', 'Service complaints', 'Payment receipts'],
  'Labour Law': ['Appointment letter', 'Termination notice', 'Pay slips', 'PF/ESI documents'],
  'Tax Law': ['Tax returns', 'Assessment orders', 'Demand notices', 'Bank statements'],
  'Cyber Crime': ['Screenshots', 'Email logs', 'Transaction records', 'Police complaint copy'],
  'Banking Law': ['Loan documents', 'Bank statements', 'Cheque copies', 'Demand notices'],
  'Arbitration': ['Arbitration agreement', 'Claims statement', 'Counter-claims', 'Evidence'],
  'Employment Law': ['Employment contract', 'Warning letters', 'HR correspondence', 'Pay slips'],
};

const DURATION_MAP: Record<string, string> = {
  high: '90 minutes',
  medium: '60 minutes',
  low: '30 minutes',
};

const NEXT_STEPS: Record<string, string[]> = {
  'Criminal Law': [
    'Obtain bail if in custody',
    'Collect all relevant police documents',
    'Prepare defense strategy',
    'File for anticipatory bail if needed',
  ],
  'Family Law': [
    'Attempt mediation for amicable resolution',
    'Document all relevant communications',
    'Gather financial records and property documents',
    'Assess child custody requirements',
  ],
  'Property Law': [
    'Verify title documents',
    'Conduct due diligence on property records',
    'Send legal notice to opposing party',
    'File civil suit if required',
  ],
  default: [
    'Gather all relevant documents',
    'Review the legal position',
    'Send formal legal notice',
    'Consider alternative dispute resolution',
    'Prepare for litigation if necessary',
  ],
};

export function generateAISummary(data: ConsultationRequest): {
  summary: string;
  category: string;
  priority: string;
  documents: string[];
  duration: string;
  riskLevel: string;
  keywords: string[];
  nextSteps: string[];
} {
  const urgency = data.urgency;
  const practiceArea = data.practiceArea;
  const caseStage = data.caseStage;
  const caseSummary = data.caseSummary;

  // Extract keywords
  const areaKeywords = RISK_KEYWORDS[practiceArea] || [];
  const foundKeywords = areaKeywords.filter((kw) =>
    caseSummary.toLowerCase().includes(kw.toLowerCase())
  );
  const additionalKeywords = [data.practiceArea, data.caseType, data.caseStage].filter(Boolean);
  const keywords = [...new Set([...foundKeywords, ...additionalKeywords])].slice(0, 8);

  // Calculate priority
  let priority = urgency;
  if (caseStage === 'FIR' || caseStage === 'Court Case') {
    priority = 'high';
  }

  // Risk level
  let riskScore = 0;
  if (urgency === 'high') riskScore += 3;
  if (urgency === 'medium') riskScore += 1;
  if (caseStage === 'FIR' || caseStage === 'Court Case') riskScore += 3;
  if (caseStage === 'Notice Received') riskScore += 1;
  if (practiceArea === 'Criminal Law' || practiceArea === 'Cyber Crime') riskScore += 2;

  let riskLevel = 'Low';
  if (riskScore >= 5) riskLevel = 'High';
  else if (riskScore >= 3) riskLevel = 'Medium';

  // Generate summary
  const summary = `The client ${data.fullName} from ${data.city}, ${data.state} has presented a ${urgency}-urgency ${practiceArea} matter. The case involves ${data.caseType} and is currently at the ${caseStage} stage. ${caseSummary.length > 100 ? caseSummary.substring(0, 120) + '...' : caseSummary} Based on the details provided, this case requires ${RISK_LEVELS[riskLevel] || riskLevel} priority attention with an estimated consultation duration of ${DURATION_MAP[priority] || '60 minutes'}.`;

  const docs = DOCS_BY_AREA[practiceArea] || ['Identity proof', 'Relevant correspondence', 'Previous orders'];
  const steps = NEXT_STEPS[practiceArea] || NEXT_STEPS.default;

  return {
    summary,
    category: `${practiceArea} – ${data.caseType}`,
    priority: RISK_LEVELS[priority] || priority,
    documents: docs,
    duration: DURATION_MAP[priority] || '60 minutes',
    riskLevel,
    keywords,
    nextSteps: steps,
  };
}

export async function generateAISummaryLive(data: ConsultationRequest): Promise<{
  summary: string;
  category: string;
  priority: string;
  documents: string[];
  duration: string;
  riskLevel: string;
  keywords: string[];
  nextSteps: string[];
}> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return generateAISummary(data);
  }

  try {
    const prompt = `You are an expert Indian Legal AI Assistant. Analyze the following legal consultation request and output a JSON object containing concise insights for the advocate.

Client Name: ${data.fullName}
City/State: ${data.city}, ${data.state}
Practice Area: ${data.practiceArea}
Case Type: ${data.caseType}
Case Stage: ${data.caseStage}
Urgency Level: ${data.urgency}
Case Summary: ${data.caseSummary}
Opponent Name: ${data.opponentName || 'N/A'}
Court / Police Station: ${data.court || data.policeStation || 'N/A'}

Respond with raw JSON only (no markdown code blocks) matching this schema:
{
  "summary": "Executive summary of case and key legal risks (2-3 sentences)",
  "category": "${data.practiceArea} – ${data.caseType}",
  "priority": "High | Medium | Low",
  "documents": ["List of 3-5 specific legal documents the client must bring"],
  "duration": "30 minutes | 60 minutes | 90 minutes",
  "riskLevel": "High | Medium | Low",
  "keywords": ["List of 4-8 relevant legal terms/statutes"],
  "nextSteps": ["List of 3-5 actionable steps for the advocate to take"]
}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        }),
      }
    );

    if (!res.ok) {
      console.warn('Gemini API call failed, falling back to static analysis:', await res.text());
      return generateAISummary(data);
    }

    const json = await res.json();
    const candidateText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      return generateAISummary(data);
    }

    const cleanText = candidateText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleanText);

    return {
      summary: parsed.summary || generateAISummary(data).summary,
      category: parsed.category || `${data.practiceArea} – ${data.caseType}`,
      priority: parsed.priority || 'Medium',
      documents: Array.isArray(parsed.documents) ? parsed.documents : ['Identity proof'],
      duration: parsed.duration || '60 minutes',
      riskLevel: parsed.riskLevel || 'Medium',
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [data.practiceArea],
      nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : ['Schedule consultation'],
    };
  } catch (err) {
    console.error('Error calling Gemini API for legal analysis:', err);
    return generateAISummary(data);
  }
}

