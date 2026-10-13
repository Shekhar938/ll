import { ConsultationRequest } from './types';

const RISK_KEYWORDS: Record<string, string[]> = {
  'Business Strategy': ['growth', 'market', 'scale', 'revenue', 'expansion', 'competitive', 'roadmap'],
  'Corporate Advisory': ['governance', 'board', 'shareholder', 'merger', 'acquisition', 'restructuring', 'compliance'],
  'Financial Consulting': ['cash flow', 'valuation', 'burn rate', 'audit', 'capital', 'debt', 'funding'],
  'Legal & Compliance': ['contract', 'agreement', 'regulatory', 'policy', 'dispute', 'terms', 'liability'],
  'Technology & Cloud': ['cloud', 'architecture', 'infrastructure', 'software', 'migration', 'security', 'api'],
  'Client Operations': ['workflow', 'automation', 'crm', 'onboarding', 'sla', 'process', 'efficiency'],
  'HR & Talent Strategy': ['talent', 'hiring', 'retention', 'compensation', 'leadership', 'organization'],
  'Consumer & Commerce': ['pricing', 'ecommerce', 'customer', 'inventory', 'channel', 'conversion'],
  'Cyber & Information Security': ['vulnerability', 'privacy', 'audit', 'access', 'threat', 'dpdp', 'gdpr'],
  'Fintech & Banking Solutions': ['payment', 'banking', 'fintech', 'lending', 'reconciliation', 'settlement'],
  'Marketing & Brand Strategy': ['brand', 'acquisition', 'campaign', 'positioning', 'leads', 'content'],
  'Performance Analytics': ['kpi', 'dashboard', 'metrics', 'unit economics', 'analytics', 'roi'],
};

const RISK_LEVELS: Record<string, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const DOCS_BY_AREA: Record<string, string[]> = {
  'Business Strategy': ['Executive pitch deck', 'Market research report', 'Current business plan', 'Competitive analysis'],
  'Corporate Advisory': ['Cap table / Bylaws', 'Board resolutions', 'Shareholder agreements', 'Financial audit statements'],
  'Financial Consulting': ['P&L statements', 'Cash flow projections', 'Balance sheets', 'Tax filings'],
  'Legal & Compliance': ['Standard service contracts', 'Vendor agreements', 'Regulatory licenses', 'NDA documents'],
  'Technology & Cloud': ['System architecture diagrams', 'Infrastructure bill/specs', 'Vendor contracts', 'Data flow mappings'],
  'Client Operations': ['Standard operating procedures (SOPs)', 'Client workflow maps', 'SLA definitions', 'CRM export data'],
  'HR & Talent Strategy': ['Organizational chart', 'Compensation benchmarking', 'Employee policy manual', 'Hiring roadmap'],
  'Consumer & Commerce': ['Product catalog/pricing list', 'Channel performance metrics', 'Supplier agreements', 'Customer survey data'],
  'Cyber & Information Security': ['Security audit report', 'Access control matrix', 'Data privacy policy', 'Incident response plan'],
  'Fintech & Banking Solutions': ['Transaction processing logs', 'Banking partnership terms', 'Compliance certificates', 'Integration specs'],
  'Marketing & Brand Strategy': ['Brand guidelines', 'Marketing budget breakdown', 'Attribution reports', 'Customer persona documents'],
  'Performance Analytics': ['Executive KPI scorecard', 'Historical cohort data', 'Unit economics model', 'Revenue dashboards'],
};

const DURATION_MAP: Record<string, string> = {
  high: '90 minutes',
  medium: '60 minutes',
  low: '30 minutes',
};

const NEXT_STEPS: Record<string, string[]> = {
  'Business Strategy': [
    'Conduct executive discovery workshop',
    'Analyze addressable market and competitive moat',
    'Formulate 90-day strategic milestone roadmap',
    'Establish growth KPI dashboard',
  ],
  'Corporate Advisory': [
    'Review cap table and corporate bylaws',
    'Align stakeholder and board governance milestones',
    'Draft advisory engagement scope',
    'Schedule quarterly governance review',
  ],
  'Technology & Cloud': [
    'Conduct architecture and cloud infrastructure audit',
    'Assess technical debt and scalability bottlenecks',
    'Draft modernization and migration roadmap',
    'Define security and SLA benchmark targets',
  ],
  'Client Operations': [
    'Audit current client intake and onboarding workflows',
    'Map operational bottlenecks and handover delays',
    'Deploy automated milestone tracking and notification rules',
    'Establish client portal self-service capabilities',
  ],
  default: [
    'Schedule exploratory consultation session',
    'Review submitted project brief and reference files',
    'Formulate tailored strategy and milestone roadmap',
    'Define scope of engagement and initial deliverables',
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
  if (urgency === 'high') {
    priority = 'high';
  }

  // Risk / Complexity level
  let riskScore = 0;
  if (urgency === 'high') riskScore += 3;
  if (urgency === 'medium') riskScore += 1;
  if (caseStage === 'Initiating Project' || caseStage === 'Active Operations') riskScore += 2;
  if (practiceArea === 'Cyber & Information Security' || practiceArea === 'Corporate Advisory') riskScore += 2;

  let riskLevel = 'Low';
  if (riskScore >= 5) riskLevel = 'High';
  else if (riskScore >= 3) riskLevel = 'Medium';

  // Generate executive summary
  const summary = `Client ${data.fullName} from ${data.city}, ${data.state} has requested ${practiceArea} advisory services. The inquiry centers on ${data.caseType} and is currently in the ${caseStage} phase. ${caseSummary.length > 100 ? caseSummary.substring(0, 120) + '...' : caseSummary} This engagement is categorized as ${RISK_LEVELS[riskLevel] || riskLevel} priority with an estimated briefing session of ${DURATION_MAP[priority] || '60 minutes'}.`;

  const docs = DOCS_BY_AREA[practiceArea] || ['Executive project brief', 'Relevant correspondence', 'Organizational overview'];
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
    const prompt = `You are an expert Business & Strategic Advisory AI Assistant. Analyze the following business consultation request and output a JSON object containing concise executive insights for the consulting lead.

Client Name: ${data.fullName}
City/State: ${data.city}, ${data.state}
Service Category: ${data.practiceArea}
Inquiry Type: ${data.caseType}
Project Stage: ${data.caseStage}
Urgency Level: ${data.urgency}
Project Summary: ${data.caseSummary}
Organization / Counterparty: ${data.opponentName || 'N/A'}
Sector / Department: ${data.court || data.policeStation || 'N/A'}

Respond with raw JSON only (no markdown code blocks) matching this schema:
{
  "summary": "Executive summary of project and strategic priorities (2-3 sentences)",
  "category": "${data.practiceArea} – ${data.caseType}",
  "priority": "High | Medium | Low",
  "documents": ["List of 3-5 specific project documents the client should prepare"],
  "duration": "30 minutes | 60 minutes | 90 minutes",
  "riskLevel": "High | Medium | Low",
  "keywords": ["List of 4-8 relevant business and strategic keywords"],
  "nextSteps": ["List of 3-5 actionable steps for the consulting lead to take"]
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
      documents: Array.isArray(parsed.documents) ? parsed.documents : ['Executive project brief'],
      duration: parsed.duration || '60 minutes',
      riskLevel: parsed.riskLevel || 'Medium',
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [data.practiceArea],
      nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : ['Schedule exploratory consultation session'],
    };
  } catch (err) {
    console.error('Error calling Gemini API for business analysis:', err);
    return generateAISummary(data);
  }
}
