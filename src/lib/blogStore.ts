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

    // Seed initial blog posts if table is empty
    const { rows: countRows } = await pool.sql`SELECT COUNT(*)::int as count FROM blog_posts`;
    if (countRows[0]?.count === 0) {
      for (const post of memoryPosts) {
        await pool.sql`
          INSERT INTO blog_posts (id, slug, title, excerpt, content, author, "publishedAt", tags)
          VALUES (${post.id}, ${post.slug}, ${post.title}, ${post.excerpt}, ${post.content}, ${post.author}, ${post.publishedAt}, ${JSON.stringify(post.tags || [])}::jsonb)
          ON CONFLICT (id) DO NOTHING
        `;
      }
      console.log('Seeded blog_posts table with initial data.');
    }
  } catch (error) {
    console.error('Failed to initialize blog database:', error);
  }
}

// Memory fallback
let memoryPosts: BlogPost[] = [
  {
    id: 'post-bns-2023',
    slug: 'navigating-bharatiya-nyaya-sanhita-bns',
    title: 'Navigating the Bharatiya Nyaya Sanhita (BNS) 2023: What Has Changed?',
    excerpt: 'An in-depth analysis of the transition from the Indian Penal Code (IPC) to the Bharatiya Nyaya Sanhita (BNS), highlighting critical shifts in substantive criminal law, sedition, and digital evidence.',
    content: `The introduction of the Bharatiya Nyaya Sanhita (BNS) 2023 marks a watershed moment in India's criminal justice system, officially replacing the colonial-era Indian Penal Code (IPC) of 1860. Implemented in mid-2024, the BNS aims to decolonize Indian jurisprudence, placing a stronger emphasis on justice rather than mere punishment. This whitepaper-style brief explores the structural and substantive changes introduced by the new framework.

One of the most debated changes is the restructuring of offenses against the State. The historical offense of 'sedition' (Section 124A IPC) has been omitted by name. However, Section 152 of the BNS introduces a newly worded offense penalizing acts that endanger the sovereignty, unity, and integrity of India. Legal scholars note that while the colonial term is gone, the scope of the new provision requires stringent judicial oversight to prevent misuse against legitimate dissent *(Reference: Bharatiya Nyaya Sanhita Act, 2023, Sec 152)*.

Furthermore, the BNS modernizes the approach to contemporary crimes. It explicitly recognizes acts of terrorism, organized crime, and mob lynching, prescribing stringent punishments, including the death penalty or life imprisonment for the latter. The integration of digital and electronic records as primary evidence is a significant leap forward, aligning substantive law with the Bharatiya Sakshya Adhiniyam (which replaces the Indian Evidence Act).

For the common citizen and legal practitioners alike, the transition requires a thorough re-mapping of familiar legal provisions. The emphasis on community service as a punitive measure for minor offenses is a progressive step toward restorative justice. However, the overarching success of the BNS will heavily depend on the sensitisation of law enforcement agencies and the judiciary's interpretation of these newly codified laws.`,
    author: 'NyayaConnect Criminal Law Panel',
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    tags: ['Criminal Law', 'BNS', 'Legislation']
  },
  {
    id: 'post-dpdp-act',
    slug: 'digital-personal-data-protection-dpdp-act-compliance',
    title: 'The Digital Personal Data Protection (DPDP) Act: A Compliance Whitepaper',
    excerpt: 'A comprehensive guide on the DPDP Act, detailing the rights of Data Principals, obligations of Data Fiduciaries, and the financial implications of non-compliance.',
    content: `The Digital Personal Data Protection (DPDP) Act establishes a robust legal framework for processing digital personal data in India. It balances the right of individuals (Data Principals) to protect their personal data with the necessity of processing such data for lawful purposes. As businesses increasingly digitise their operations, understanding the DPDP Act is no longer optional but a critical compliance mandate.

At the core of the Act is the principle of 'consent'. Data Fiduciaries—entities determining the purpose and means of data processing—must obtain free, specific, informed, unconditional, and unambiguous consent with a clear notice. The Act introduces the concept of 'Consent Managers', regulated platforms that enable Data Principals to give, manage, review, and withdraw their consent through an accessible, transparent, and interoperable platform *(Reference: DPDP Act, Section 6)*.

The legislation places heavy obligations on Data Fiduciaries. They are required to implement appropriate technical and organisational measures to ensure compliance. In the event of a personal data breach, fiduciaries must notify both the Data Protection Board of India and the affected Data Principals. Furthermore, 'Significant Data Fiduciaries'—designated based on the volume and sensitivity of data processed—face additional obligations, including appointing a resident Data Protection Officer (DPO) and conducting periodic Data Protection Impact Assessments (DPIA).

Non-compliance carries severe financial penalties, which can extend up to ₹250 crores (approx. $30 million USD) for failure to take reasonable security safeguards to prevent data breaches. Unlike previous drafts, the DPDP Act does not contain provisions for criminal liability, opting instead for a purely financial deterrence model. Businesses must conduct immediate data audits, revise their privacy policies, and overhaul their data collection mechanisms to align with the new statutory requirements.`,
    author: 'NyayaConnect Corporate Desk',
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    tags: ['Data Privacy', 'Corporate Law', 'Compliance']
  },
  {
    id: 'post-ai-deepfakes',
    slug: 'evolving-jurisprudence-deepfakes-generative-ai',
    title: 'Evolving Jurisprudence on Deepfakes and Generative AI in India',
    excerpt: 'Examining the legal vacuum, recent judicial observations, and the applicability of the IT Act and Copyright laws concerning deepfakes and AI-generated content.',
    content: `The rapid proliferation of Generative Artificial Intelligence (AI) and deepfake technology has outpaced legislative frameworks globally. In India, the intersection of AI with privacy, defamation, and intellectual property rights presents complex challenges for the judiciary and policymakers. This analysis explores the current legal landscape governing deepfakes and AI-generated content in the Indian context.

Currently, India lacks specific, standalone legislation addressing AI or deepfakes. However, regulatory authorities and courts are interpreting existing laws to address these novel challenges. The Information Technology (IT) Act, 2000, specifically Sections 66E (violation of privacy) and 67 (publishing obscene material in electronic form), serve as the primary statutory tools against malicious deepfakes. Furthermore, the IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, mandate social media platforms to remove non-consensual deepfake content within 24 hours of receiving a complaint *(Reference: Ministry of Electronics and Information Technology Advisories, 2023-2024)*.

From an Intellectual Property perspective, the copyrightability of AI-generated content remains a contentious issue. Under Section 2(d) of the Copyright Act, 1957, an "author" must be a human being. Consequently, works generated entirely autonomously by AI algorithms currently fall outside the protective ambit of traditional copyright law. However, where human intervention is substantial in directing the AI, a co-authorship model is being heavily debated by legal scholars.

Recent Delhi High Court rulings have emphasized the right to publicity and personality rights, issuing ex-parte injunctions against the unauthorized use of celebrities' likenesses via AI tools. As the technology matures, it is imperative for the legislature to enact a comprehensive AI regulation that balances innovation with the protection of fundamental rights, specifically addressing the evidentiary value of synthetic media in judicial proceedings.`,
    author: 'Adv. Meera Natarajan (Tech Law)',
    publishedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    tags: ['Cyber Crime', 'AI & Law', 'Intellectual Property']
  },
  {
    id: 'post-rera-homebuyers',
    slug: 'rera-homebuyer-rights-supreme-court-delayed-possession',
    title: 'RERA and Homebuyer Rights: Supreme Court Perspectives on Delayed Possessions',
    excerpt: 'A critical review of the Real Estate (Regulation and Development) Act (RERA) and landmark Supreme Court judgments empowering homebuyers against defaulting developers.',
    content: `The Real Estate (Regulation and Development) Act (RERA), 2016, revolutionized the Indian real estate sector by establishing an adjudicatory mechanism for speedy dispute redressal and protecting the interests of homebuyers. Despite its robust framework, delayed possessions remain a systemic issue. Recent judicial pronouncements by the Supreme Court of India have significantly fortified the legal remedies available to aggrieved allottees.

A cornerstone of RERA is Section 18, which grants the homebuyer an absolute right to demand a refund with interest, or claim delayed possession compensation, if the promoter fails to deliver the apartment by the date specified in the agreement to sell. In the landmark judgment of *Imperia Structures Ltd. v. Anil Patni*, the Supreme Court reaffirmed that the remedies available under RERA are in addition to, and not in derogation of, the provisions of the Consumer Protection Act. This dual-remedy doctrine provides homebuyers with strategic flexibility in choosing their forum for litigation.

Furthermore, the apex court has adopted a strict interpretation of 'force majeure' clauses often invoked by developers to justify delays. The courts have clarified that routine administrative delays, lack of funds, or predictable economic downturns do not constitute acts of God or force majeure. Promoters are held strictly liable to the timelines promised in the registered agreements.

Another critical development is the judicial stance on one-sided builder-buyer agreements. The Supreme Court has unequivocally struck down arbitrary clauses that penalize buyers heavily for delayed payments while offering negligible compensation for delayed delivery by the builder, terming them as unfair trade practices. For homebuyers, navigating these disputes requires meticulous documentation and a strategic choice between approaching the RERA Authority, the Consumer Forum, or the NCLT under the Insolvency and Bankruptcy Code (IBC).`,
    author: 'NyayaConnect Real Estate Division',
    publishedAt: new Date(Date.now() - 86400000 * 18).toISOString(),
    tags: ['Property Law', 'Consumer Rights', 'RERA']
  },
  {
    id: 'post-new-labour-codes',
    slug: 'implementation-new-labour-codes-corporate-compliance',
    title: 'The Implementation of the New Labour Codes: Navigating Corporate Compliance',
    excerpt: 'An extensive breakdown of the four new Labour Codes in India, their impact on the gig economy, wage definitions, and industrial relations.',
    content: `The consolidation of 29 central labour laws into four distinct Labour Codes—the Code on Wages, the Industrial Relations Code, the Code on Social Security, and the Occupational Safety, Health and Working Conditions Code—represents the most significant overhaul of Indian labour jurisprudence since independence. While the central rules have been drafted, phased implementation by respective state governments requires corporations to preemptively restructure their HR and compliance frameworks.

A major paradigm shift is the uniform definition of 'Wages'. Under the new Code, basic pay must constitute at least 50% of the total remuneration. If allowances exceed this threshold, the excess amount is deemed as wages for the purpose of calculating Provident Fund (PF) and gratuity contributions. This restructuring will invariably increase the financial liability of employers towards terminal benefits and requires a comprehensive redesign of existing salary structures *(Reference: Code on Wages, 2019, Section 2(y))*.

The Code on Social Security introduces a progressive, albeit complex, framework for gig and platform workers. For the first time, independent contractors operating through digital platforms are legally recognized and entitled to social security benefits, including life and disability cover, health and maternity benefits, and old age protection. Aggregators are mandated to contribute between 1% to 2% of their annual turnover towards a dedicated social security fund.

From an industrial relations perspective, the threshold for standing orders—which define the conditions of employment—has been increased from 100 to 300 workers. This provides greater operational flexibility for mid-sized manufacturing units. However, the conditions for legal strikes have been tightened, mandating a 14-day notice period across all industrial establishments. As these codes transition from paper to practice, human resource professionals and legal counsels must conduct extensive gap analyses to ensure seamless statutory compliance.`,
    author: 'NyayaConnect Employment Law Team',
    publishedAt: new Date(Date.now() - 86400000 * 25).toISOString(),
    tags: ['Labour Law', 'Corporate Compliance', 'Gig Economy']
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
