import { createPool } from '@vercel/postgres';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  tags?: string[];
}

function getPool() {
  const connectionString = process.env.DATA_POSTGRES_URL || process.env.POSTGRES_URL;
  if (!connectionString) return null;
  return createPool({ connectionString });
}

export async function initializeBlogDatabase() {
  const pool = getPool();
  if (!pool) {
    console.warn('Skipping blog database initialization: Connection string is missing.');
    return;
  }
  
  try {
    await pool.sql`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id VARCHAR(255) PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT,
        content TEXT NOT NULL,
        author VARCHAR(255),
        "publishedAt" TIMESTAMP NOT NULL,
        tags JSONB
      );
    `;
    await pool.sql`CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);`;
    await pool.sql`CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts("publishedAt" DESC);`;

    // Seed/update blog posts in database
    for (const post of memoryPosts) {
      await pool.sql`
        INSERT INTO blog_posts (id, slug, title, excerpt, content, author, "publishedAt", tags)
        VALUES (${post.id}, ${post.slug}, ${post.title}, ${post.excerpt}, ${post.content}, ${post.author}, ${post.publishedAt}, ${JSON.stringify(post.tags || [])}::jsonb)
        ON CONFLICT (id) DO UPDATE SET
          slug = EXCLUDED.slug,
          title = EXCLUDED.title,
          excerpt = EXCLUDED.excerpt,
          content = EXCLUDED.content,
          author = EXCLUDED.author,
          "publishedAt" = EXCLUDED."publishedAt",
          tags = EXCLUDED.tags;
      `;
    }
    console.log('Synchronized blog_posts table with latest business article data.');
  } catch (error) {
    console.error('Failed to initialize blog database:', error);
  }
}

// Memory fallback with strategic business thought-leadership articles
let memoryPosts: BlogPost[] = [
  {
    id: 'post-strategy-growth',
    slug: 'navigating-b2b-growth-strategy-modern-markets',
    title: 'Mastering B2B Growth Strategy: Unit Economics, Expansion Playbooks, and Market Penetration',
    excerpt: 'A strategic playbook for enterprise leaders and founders on optimizing customer acquisition cost (CAC), scaling net revenue retention (NRR), and executing disciplined go-to-market strategies.',
    content: `Sustainable enterprise expansion requires balancing aggressive top-line growth with resilient unit economics. In volatile macroeconomic cycles, business leaders can no longer rely on unconstrained marketing expenditures or vanity top-of-funnel metrics. Instead, disciplined execution demands structured alignment across customer acquisition, pricing elasticity, and retention flywheels.

1. Unpacking the Fundamental Unit Economics Flywheel
The cornerstone of resilient commercial performance is the LTV:CAC ratio. While high-growth ventures often accept elevated payback periods during market entry phases, mature organizations must maintain payback windows under 12 months. Driving down acquisition friction starts with targeted account-based positioning, high-intent outbound mechanisms, and transparent consultation pathways.

2. Net Revenue Retention (NRR) as the Primary Valuation Driver
Expansion revenue from existing clients consistently yields 3x to 5x higher margins than net-new acquisition. Enterprise service providers who implement dedicated Client Success and strategic review cadences achieve NRR benchmarks above 120%. By tracking milestone delivery through collaborative client portals, organizations establish trust, accelerate cross-department expansion, and mitigate churn risk.

3. Aligning Go-To-Market with Execution Architecture
Scaling from regional operations to multi-territory distribution demands institutional governance. Executive teams must institute weekly pipeline reviews, standardized service level agreements (SLAs), and rigorous feedback loops between sales discovery and service delivery teams.`,
    author: 'ClientFlow Strategy Advisory Group',
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    tags: ['Business Strategy', 'Growth', 'Enterprise', 'Operations']
  },
  {
    id: 'post-data-governance',
    slug: 'enterprise-data-governance-and-dpdp-compliance',
    title: 'Enterprise Data Governance in Practice: Privacy Architecture, Operational Risk, and Compliance Frameworks',
    excerpt: 'How organizations can implement pragmatic data fiduciary controls, consent management workflows, and audit trails without disrupting core engineering velocity.',
    content: `As digital commerce and cloud platforms expand, regulatory frameworks worldwide—from GDPR in Europe to the DPDP Act in India—hold enterprises strictly accountable for how customer records are gathered, processed, and safeguarded. For growing enterprises, data governance is no longer just a legal checklist; it is a foundational operational requirement.

1. Principles of Purpose Limitation and Granular Consent
Modern compliance regimes require explicit, unambiguous consent architectures. Organizations must maintain verifiable audit trails showing when customer consent was granted, for what specific operational purpose, and under what conditions. Implementing unified digital consent managers eliminates fragmented databases and reduces institutional liability.

2. Minimizing Attack Surfaces and Role-Based Access Controls (RBAC)
Internal security breaches frequently trace back to over-privileged employee accounts. Adopting zero-trust architectures, automated session expiration, and role-based data views ensures that sensitive commercial documents and client records are strictly restricted to assigned project teams.

3. Incident Response Readiness and Notification Lifecycles
Regulatory compliance mandates rapid reporting windows when security incidents arise. Enterprises must conduct quarterly simulation drills, test automated encryption integrity, and maintain clear escalation trees linking IT operations, legal counsel, and executive management.`,
    author: 'ClientFlow Technology & Risk Practice',
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    tags: ['Data Governance', 'Compliance', 'Enterprise Architecture', 'Information Security']
  },
  {
    id: 'post-ai-workflows',
    slug: 'operationalizing-generative-ai-in-client-services',
    title: 'Operationalizing Generative AI in Professional Services: Guardrails, Agentic Workflows, and Productivity Gains',
    excerpt: 'Analyzing the shift from ad-hoc prompting to robust agentic architectures, automated client triage, context grounding, and enterprise guardrails in consulting operations.',
    content: `Artificial intelligence has crossed the chasm from experimental chatbots to core operational infrastructure. Forward-thinking professional firms and business owners are embedding autonomous agents into client intake, inquiry analysis, and content synthesis to multiply team throughput while elevating client satisfaction.

1. Moving Beyond Generic Chat to Context-Grounded Triage
Generic large language models hallucinate when deprived of specific domain parameters. By integrating intelligent intake forms and semantic document analyzers, client portals can automatically classify incoming inquiries, evaluate urgency, and generate synthesized executive summaries before human consultants step into discovery meetings.

2. Implementing Strict Safety Guardrails and Anti-Leak Protection
Enterprise deployment requires rigorous boundary enforcement. Input sanitization prevents prompt injections and unauthorized system disclosures, while output redaction ensures proprietary API keys and confidential client data never appear in AI generation streams.

3. Augmenting Human Experts Rather than Replacing Judgment
The highest-performing professional organizations utilize AI as an operational multiplier. Automated drafting assistants accelerate initial research and structure briefs, empowering senior advisors to focus their high-value hours on relationship building, strategic negotiation, and tailored execution.`,
    author: 'ClientFlow AI Innovation Desk',
    publishedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    tags: ['Artificial Intelligence', 'Automation', 'Client Operations', 'Technology']
  },
  {
    id: 'post-client-operations',
    slug: 'modernizing-client-lifecycle-retention-and-onboarding',
    title: 'Modernizing the Client Lifecycle: High-Touch Onboarding, Service Portals, and Retention Dynamics',
    excerpt: 'Why digital client portals and transparent engagement workflows drive 40% higher client retention across professional consulting and advisory firms.',
    content: `In an era of hyper-competition, client experience during the first 30 days of an engagement sets the trajectory for long-term retention. Traditional email attachments, lost document revisions, and opaque project timelines frustrate high-value clients and strain account managers.

1. Transparency Through Self-Service Client Portals
Providing clients with a dedicated digital dashboard to track milestone statuses, view uploaded agreements, and inspect assigned consultation schedules transforms customer perception. When clients have real-time visibility into operational progress, relationship friction plummets.

2. Standardizing Intake and Document Collection
Delayed onboarding usually stems from unstructured document exchanges. Structured multi-step intake flows with pre-validated file types and encryption ensure complete requirement gathering in a single customer session, eliminating back-and-forth email friction.

3. Proactive Engagement Cadences
Retaining premium business accounts requires proactive communication rather than reactive firefighting. Automated milestone alerts, post-consultation advisory summaries, and scheduled touchpoints demonstrate continuous partnership value.`,
    author: 'ClientFlow Operations Practice Group',
    publishedAt: new Date(Date.now() - 86400000 * 18).toISOString(),
    tags: ['Client Operations', 'Customer Experience', 'SLA Optimization', 'Retention']
  },
  {
    id: 'post-capital-allocation',
    slug: 'strategic-capital-allocation-and-cash-flow-resilience',
    title: 'Strategic Capital Allocation: Building Cash-Flow Resilience in High-Interest Environments',
    excerpt: 'A financial executive guide to balancing reinvestment, working capital optimization, and milestone-driven capital management for scaling enterprises.',
    content: `Capital allocation is the preeminent responsibility of executive leadership. In periods of macroeconomic uncertainty and higher cost of capital, businesses must prioritize liquidity resilience, cash conversion cycles, and prudent margin expansion over speculative market bets.

1. Optimizing the Cash Conversion Cycle (CCC)
Every day trapped in accounts receivable or delayed billing directly inflates short-term borrowing costs. Structuring transparent payment milestones, establishing automated invoice generation, and enforcing contractual net payment terms ensures continuous liquidity for daily operations.

2. Rigorous Hurdle Rates for Capital Expenditure
Every strategic investment—whether in software modernization, market expansion, or talent acquisition—must undergo rigorous ROI modeling with stress-tested sensitivity analyses. Projects failing to demonstrate accretive free cash flow within predefined payback windows should be halted or rescoped.

3. Building Financial Buffers for Strategic Flexibility
Resilient balance sheets provide significant offensive advantages during market downturns. Maintaining 6 to 9 months of non-discretionary operating runway enables organizations to seize discounted assets, attract premier talent, and negotiate favorable commercial terms when competitors face liquidity constraints.`,
    author: 'ClientFlow Financial Advisory Group',
    publishedAt: new Date(Date.now() - 86400000 * 25).toISOString(),
    tags: ['Financial Consulting', 'Capital Allocation', 'Corporate Finance', 'Valuation']
  }
];

export async function getBlogPosts(): Promise<BlogPost[]> {
  const pool = getPool();
  if (pool) {
    try {
      const { rows } = await pool.sql<BlogPost>`SELECT * FROM blog_posts ORDER BY "publishedAt" DESC`;
      if (rows.length > 0) return rows;
    } catch (error) {
      console.warn('PostgreSQL query failed, using in-memory blog store:', error);
    }
  }
  return [...memoryPosts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const pool = getPool();
  if (pool) {
    try {
      const { rows } = await pool.sql<BlogPost>`SELECT * FROM blog_posts WHERE slug = ${slug} LIMIT 1`;
      if (rows.length > 0) return rows[0];
    } catch (error) {
      console.warn('PostgreSQL query failed, searching in-memory blog store:', error);
    }
  }
  return memoryPosts.find(p => p.slug === slug) || null;
}

export async function createBlogPost(data: {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  author?: string;
  tags?: string[];
}): Promise<BlogPost> {
  const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newPost: BlogPost = {
    id: `post-${Date.now()}`,
    slug,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    author: data.author || 'Business Admin',
    publishedAt: new Date().toISOString(),
    tags: data.tags || ['Business Insights']
  };

  const pool = getPool();
  if (pool) {
    try {
      await pool.sql`
        INSERT INTO blog_posts (id, slug, title, excerpt, content, author, "publishedAt", tags)
        VALUES (${newPost.id}, ${newPost.slug}, ${newPost.title}, ${newPost.excerpt}, ${newPost.content}, ${newPost.author}, ${newPost.publishedAt}, ${JSON.stringify(newPost.tags)}::jsonb)
      `;
    } catch (err) {
      console.error('Failed to create blog post in DB:', err);
    }
  }

  memoryPosts.unshift(newPost);
  return newPost;
}

export async function updateBlogPost(
  id: string,
  data: Partial<Omit<BlogPost, 'id' | 'publishedAt'>>
): Promise<BlogPost | null> {
  const existing = memoryPosts.find(p => p.id === id);
  if (!existing) return null;

  const updated: BlogPost = {
    ...existing,
    ...data,
    slug: data.slug || (data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : existing.slug)
  };

  const pool = getPool();
  if (pool) {
    try {
      await pool.sql`
        UPDATE blog_posts
        SET slug = ${updated.slug},
            title = ${updated.title},
            excerpt = ${updated.excerpt},
            content = ${updated.content},
            author = ${updated.author},
            tags = ${JSON.stringify(updated.tags || [])}::jsonb
        WHERE id = ${id}
      `;
    } catch (err) {
      console.error('Failed to update blog post in DB:', err);
    }
  }

  const idx = memoryPosts.findIndex(p => p.id === id);
  if (idx >= 0) memoryPosts[idx] = updated;

  return updated;
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const pool = getPool();
  if (pool) {
    try {
      await pool.sql`DELETE FROM blog_posts WHERE id = ${id}`;
    } catch (err) {
      console.error('Failed to delete blog post from DB:', err);
    }
  }

  const initialLength = memoryPosts.length;
  memoryPosts = memoryPosts.filter(p => p.id !== id);
  return memoryPosts.length < initialLength;
}
