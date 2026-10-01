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
    console.log('Synchronized blog_posts table with latest whitepaper data.');
  } catch (error) {
    console.error('Failed to initialize blog database:', error);
  }
}

// Memory fallback with elaborate, highly factual legal whitepapers
let memoryPosts: BlogPost[] = [
  {
    id: 'post-bns-2023',
    slug: 'navigating-bharatiya-nyaya-sanhita-bns',
    title: 'Navigating the Bharatiya Nyaya Sanhita (BNS) 2023: Structural Shifts, Statutory Nuances, and Judicial Implications',
    excerpt: 'A comprehensive analysis of the transition from the Indian Penal Code 1860 to the Bharatiya Nyaya Sanhita 2023, examining key changes in treason/sedition, organized crime, terrorism, offences against women, and digital evidence integration.',
    content: `The introduction of the Bharatiya Nyaya Sanhita (BNS) 2023 (Act No. 45 of 2023) marks a historic overhaul of India's substantive criminal jurisprudence, officially replacing the colonial-era Indian Penal Code (IPC) of 1860. Brought into full operational force on July 1, 2024, alongside the Bharatiya Nagarik Suraksha Sanhita (BNSS) and Bharatiya Sakshya Adhiniyam (BSA), the BNS contains 358 sections (reduced from the IPC's 511 sections) designed to modernize definitions, introduce technology-neutral provisions, and shift focus toward victim-centric and restorative justice.

Re-conceptualization of Offences Against the State (Section 152 vs Section 124A IPC)
One of the most consequential amendments is the formal repeal of 'sedition' as codified under Section 124A of the IPC. In its place, Section 152 of the BNS introduces penal sanctions for acts endangering the sovereignty, unity, and integrity of India. Unlike Section 124A—which targeted vague concepts like generating 'disaffection' against the government—Section 152 specifies concrete acts including subversion, separatist activities, armed rebellion, or encouraging feelings of secessionist activity through spoken, written, electronic, or financial means. Punishment ranges from 7 years to life imprisonment. Legal practitioners emphasize that judicial interpretation of Section 152 must carefully maintain the constitutional threshold established in Kedarnath Singh v. State of Bihar (1962) to prevent overreach against legitimate political speech.

Statutory Codification of Organized Crime & Terrorism (Sections 111 & 113)
For the first time in Indian substantive criminal law, organized crime and terrorism have been directly codified within the general penal code, bridging gaps previously reliant solely on special statutes like UAPA or state-level enactments (e.g., MCOCA). Section 111 defines 'organized crime' to include syndicate activities such as kidnapping, extortion, land grabbing, contract killing, cyber-crimes, and financial scams. Offences resulting in death carry penalties of life imprisonment or death, accompanied by a minimum fine of ₹5 Lakhs. Section 113 incorporates a statutory definition of a 'terrorist act', aligning closely with international conventions by criminalizing acts intended to threaten the unity, integrity, security, or sovereignty of India or intimidate the general public.

Offences Against Women, Children, and Mob Lynching (Sections 63–79 & Section 103(2))
The BNS consolidates offences against women and children into Chapter V (Sections 63–99). Rape provisions under Section 63 preserve strict sentencing, while Section 69 introduces a specific statutory offence criminalizing sexual intercourse obtained by deceitful means—including false promises of employment, promotion, or marriage under a suppressed identity—punishable by up to 10 years imprisonment. Crucially, Section 103(2) introduces statutory recognition and penal sanctions for mob lynching, prescribing the death penalty, life imprisonment, and mandatory fines for murders committed jointly by five or more persons on grounds of race, caste, community, sex, place of birth, language, or personal belief.

Introduction of Community Service as Restorative Punishment (Section 4(f))
Pioneering a shift toward restorative justice, Section 4(f) introduces 'Community Service' as an explicit form of punishment. Applied across six specific minor offences—including theft of property valued under ₹5,000 upon first conviction (Section 303(2)), public drunkenness (Section 355), defamation (Section 356), and misconduct in public by a drunken person—this provision aims to reduce prison overcrowding and foster rehabilitation for petty offenders.

Procedural Synergy & Digital Evidence Framework
The BNS operates in tight synergy with the Bharatiya Sakshya Adhiniyam (BSA) 2023, which grants primary evidentiary status to electronic and digital records (Section 61 BSA). Videography of search and seizure operations, mandatory forensic examination for offences carrying imprisonment of 7 years or more (under BNSS Section 176), and electronic summons delivery represent operational shifts that legal teams must navigate when building criminal defense or prosecution strategies.`,
    author: 'NyayaConnect Criminal Law Practice Group',
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    tags: ['Criminal Law', 'BNS 2023', 'Substantive Law', 'Legal Reform']
  },
  {
    id: 'post-dpdp-act',
    slug: 'digital-personal-data-protection-dpdp-act-compliance',
    title: 'The Digital Personal Data Protection (DPDP) Act 2023: A Comprehensive Corporate Compliance Whitepaper',
    excerpt: 'An exhaustive examination of India’s DPDP Act 2023 (Act No. 22 of 2023), covering Data Principal rights, Data Fiduciary obligations, Consent Managers, cross-border transfers, and the penalty architecture under Schedule I.',
    content: `The Digital Personal Data Protection (DPDP) Act, 2023 (Act No. 22 of 2023) received Presidential assent in August 2023, marking India's transition into a comprehensive statutory data protection regime. Regulating the processing of digital personal data within India—and extraterritorially where processing relates to offering goods or services to Data Principals within India (Section 3)—the Act establishes a compliance framework that mandates structural overhauls for commercial enterprises, tech startups, and multinational entities.

The Consent Architecture & Data Principal Rights (Sections 6 & 11–14)
At the foundation of the DPDP Act is a strictly enforced consent paradigm. Under Section 6, any processing of personal data must be preceded or accompanied by a clear, detailed notice presented in plain language, with accessibility options across English and the 22 languages specified in the Eighth Schedule to the Constitution. Consent must be free, specific, informed, unconditional, and unambiguous, expressed through a clear affirmative action. Section 6(7) introduces regulated 'Consent Managers'—interoperable entities registered with the Data Protection Board of India (DPBI) enabling individuals to grant, review, or revoke consent through a single digital dashboard.

Data Principals (individuals) are conferred statutory rights including: (1) The Right to Access summary of processed data and identities of shared fiduciaries (Section 11); (2) The Right to Correction, Completion, and Erasure (Section 12); (3) The Right to Grievance Redressal (Section 13); and (4) The Right to Nominate a representative in the event of death or incapacity (Section 14).

Data Fiduciary Obligations & Significant Data Fiduciaries (Sections 8 & 10)
Entities determining the purpose and means of data processing ('Data Fiduciaries') bear statutory duties under Section 8:
• Security Safeguards: Implementing reasonable security measures to prevent data breaches.
• Mandatory Breach Notification: In the event of a personal data breach, the Fiduciary MUST notify both the Data Protection Board and every affected Data Principal in the manner prescribed by rules.
• Data Erasure: Mandatory deletion of personal data as soon as the specified purpose is fulfilled or consent is withdrawn, unless retention is required by law.

Under Section 10, the Central Government may designate entities as 'Significant Data Fiduciaries' (SDFs) based on criteria like volume/sensitivity of data, risk to national sovereignty, or public order. SDFs face heightened compliance duties, including mandatory appointment of a resident Data Protection Officer (DPO), hiring an independent Data Auditor, and conducting periodic Data Protection Impact Assessments (DPIAs).

Children’s Data & Cross-Border Data Flows (Sections 9 & 16)
Section 9 imposes strict prohibitions on processing data belonging to children (under 18 years) or persons with disabilities under guardianship without verifiable parental consent. Tracking, behavioral monitoring, or targeted advertising directed at children is expressly prohibited.

Regarding cross-border transfers, Section 16 adopts a 'blacklisting' (negative list) approach: personal data may be transferred outside India to any country except those explicitly restricted by Central Government notifications. This provides operational flexibility compared to earlier localization proposals.

Adjudication & Financial Penalty Architecture (Schedule I)
The Act establishes the Data Protection Board of India (DPBI) as an independent adjudicatory body empowered to inquire into breaches, issue directions, and impose penalties. Appeals lie to the Telecom Disputes Settlement and Appellate Tribunal (TDSAT). The DPDP Act decriminalizes data protection violations, relying on severe financial penalties under Schedule I:
• Failure to implement reasonable security safeguards preventing data breach: Up to ₹250 Crore (~$30 Million USD).
• Failure to notify the Board or Data Principal of a data breach: Up to ₹200 Crore.
• Non-compliance with special obligations regarding children's data: Up to ₹200 Crore.
• Non-compliance by Data Principals (e.g. submitting false/frivolous complaints): Up to ₹10,000.`,
    author: 'NyayaConnect Corporate & Tech Law Practice',
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    tags: ['Data Privacy', 'DPDP Act', 'Corporate Compliance', 'Tech Law']
  },
  {
    id: 'post-ai-deepfakes',
    slug: 'evolving-jurisprudence-deepfakes-generative-ai',
    title: 'Evolving Jurisprudence on Deepfakes and Generative AI in India: Privacy, Copyright, and Personality Rights',
    excerpt: 'A detailed statutory and judicial review of synthetic media regulation in India, spanning the IT Act 2000, Intermediary Rules 2021, Copyright Act 1957, and landmark High Court personality rights injunctions.',
    content: `The rapid emergence of Generative Artificial Intelligence (AI) and synthetic media (deepfakes) has created significant friction between technological acceleration and existing legal doctrine. In India, where standalone legislation specifically governing Artificial Intelligence is currently being formulated under the proposed Digital India Act, courts and regulatory enforcement rely on a synthesis of the Information Technology Act 2000, IPC/BNS, Intellectual Property laws, and common law jurisprudence.

Statutory Provisions & The Regulatory Enforcement Framework
In the absence of a dedicated AI Act, prosecution of malicious deepfakes—ranging from financial impersonation scams to non-consensual synthetic imagery—utilizes existing statutory provisions:
1. Section 66D of the IT Act 2000: Punishes cheating by personation using computer resources with imprisonment up to 3 years and fines up to ₹1 Lakh.
2. Section 66E & Section 67/67A of the IT Act 2000: Criminalizes intentional privacy violations and transmission of sexually explicit or obscene synthetic material, carrying penal terms up to 5 to 7 years.
3. Bharatiya Nyaya Sanhita (BNS) 2023: Section 318 (Cheating), Section 336 (Forgery of electronic records), and Section 356 (Defamation) are routinely invoked in deepfake prosecutions.

Intermediary Liability & MeitY Mandates (IT Rules 2021)
Social media intermediaries operate under strict due diligence requirements mandated by Rule 3(1)(b) of the IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021. Following advisories issued by the Ministry of Electronics and Information Technology (MeitY) in late 2023 and early 2024, intermediaries are legally required to:
• Ensure users do not host, display, or upload impersonating or misinformation content generated via AI.
• Remove or disable access to non-consensual intimate deepfake images/videos within 24 hours of receiving a complaint (Rule 3(2)(b)).
• Implement technical watermarking, metadata tagging, and clear labeling for all AI-generated or manipulated content to prevent public deception. Non-compliance results in the forfeiture of safe harbor immunity under Section 79 of the IT Act.

Judicial Development of Personality and Publicity Rights
Indian jurisprudence has taken a leading international role in protecting individual likeness, voice, and persona from unauthorized AI cloning through high-profile judicial decisions by the Delhi High Court:
• Anil Kapoor v. Simply Life India & Ors. (CS(COMM) 652/2023): The Delhi High Court granted an extensive ex-parte injunction restraining entities from using the actor’s name, voice, likeness, image, or catchphrases for commercial purposes via AI tools or deepfake synthesis without permission. The court held that while technological tools foster creation, unconsented commercial exploitation of personality elements violates the constitutional Right to Privacy under Article 21.
• Jackie Shroff v. The Peepoye Group & Ors. (CS(COMM) 389/2024): Reaffirmed that an individual's personal attributes, voice characteristics, and name constitute commercial property rights that cannot be harvested into AI training models or deepfake generators without express authorization.

Copyright Ambiguities: Authorship & AI Training Datasets
The intersection of Generative AI and the Copyright Act, 1957 presents two unresolved structural challenges:
1. Subsistence of Copyright in AI Output: Under Section 2(d) of the Copyright Act, an 'author' must be a natural person. Autonomous AI outputs lacking human authorial contribution currently fall into the public domain. However, where a human prompt-engineer exercises substantial creative control and selection, courts are evaluating a joint-authorship framework.
2. Copyright Infringement in AI Training: Data scraping of copyrighted literary, artistic, or musical works to train Large Language Models (LLMs) and diffusion models has raised fair-dealing litigation. Indian law under Section 52(1)(a) does not contain an explicit statutory text and data mining (TDM) exception, leaving developers vulnerable to infringement claims if training data is ingested without licensing.`,
    author: 'Adv. Meera Natarajan (Specialist in Tech & IP Law)',
    publishedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    tags: ['Cyber Crime', 'AI & Law', 'Intellectual Property', 'Deepfakes']
  },
  {
    id: 'post-rera-homebuyers',
    slug: 'rera-homebuyer-rights-supreme-court-delayed-possession',
    title: 'RERA and Homebuyer Rights: Supreme Court Perspectives and Adjudicatory Remedies for Delayed Possession',
    excerpt: 'A legal analysis of the Real Estate (Regulation and Development) Act 2016 and key Supreme Court precedents establishing homebuyer remedies, strict force majeure limits, and concurrent litigation forums.',
    content: `The Real Estate (Regulation and Development) Act, 2016 (RERA) fundamentally reshaped India’s urban real estate market, establishing specialized regulatory authorities across states to eliminate project opaqueness, protect homebuyer capital, and provide time-bound dispute resolution. Despite the statute's maturity, delayed possession remains the single largest driver of real estate litigation in India. Landmark rulings by the Supreme Court of India have systematically defined the scope of homebuyer remedies.

Statutory Entitlements under Section 18 & Section 31
Section 18 of RERA forms the bedrock of homebuyer protection. It dictates that if a promoter fails to complete or give possession of an apartment, plot, or building in accordance with the terms of the agreement for sale by the specified date:
1. Right to Exit & Refund: The homebuyer can withdraw from the project and demand full return of the amount paid, alongside statutory interest at prescribed rates (typically SBI Marginal Cost of Funds Lending Rate + 2%) calculated from the date of each payment till actual refund.
2. Right to Delayed Compensation: If the buyer chooses not to withdraw, the promoter MUST pay monthly interest for every month of delay until possession is handed over.

Under Section 31, any aggrieved allottee can file a complaint with the RERA Authority or the Adjudicating Officer for compensation under Section 71.

Doctrine of Concurrent Remedies: RERA, Consumer Courts, and NCLT
A critical jurisdictional question resolved by the Supreme Court is whether a buyer is restricted solely to RERA. In landmark decisions including Imperia Structures Ltd. v. Anil Patni (2020 10 SCC 783) and Experion Developers Pvt. Ltd. v. Sushma Ashok Shiroor (2022 SCC OnLine SC 438), the apex court ruled that remedies available under RERA are concurrent and non-exclusive:
• Consumer Protection Act 2019: Homebuyers qualify as 'consumers' and can initiate proceedings before National or State Consumer Disputes Redressal Commissions (NCDRC/SCDRC) for deficiency of service.
• Insolvency and Bankruptcy Code (IBC) 2016: Under Section 5(8)(f), homebuyers are classified as 'Financial Creditors'. A minimum threshold of 100 allottees or 10% of total allottees in a project can joint-file insolvency proceedings before the NCLT against defaulting developers.

Strict Judicial Narrowing of 'Force Majeure' Claims
Developers frequently invoke 'force majeure' (unforeseen circumstances) clauses in sale agreements to justify multi-year delays. The Supreme Court in Ireo Grace Realtech Pvt. Ltd. v. Abhishek Tewari (2021 3 SCC 241) established that routine administrative approval delays, labor shortages, economic downturns, or liquidity crises DO NOT constitute force majeure events. Promoters bear strict contractual liability to honor delivery timelines promised in RERA registrations.

Striking Down Unfair & One-Sided Builder-Buyer Agreements
In Pioneer Urban Land & Infrastructure Ltd. v. Govindan Raghavan (2019 5 SCC 725), the Supreme Court examined standardized builder contracts that imposed 18% annual interest on buyers for delayed installment payments while offering a meager ₹5 per sq. ft. per month (approx. 2-3% annual equivalent) to buyers for delayed possession. The Court held that such asymmetric terms constitute an unfair trade practice under law, declaring one-sided contract clauses unconstitutional and legally unenforceable against consumers.

Execution of Awards & Recovery Certificates (Section 40)
To overcome developer non-compliance with RERA refund orders, Section 40 of RERA provides that unpaid monetary awards are recoverable as arrears of land revenue. The RERA Authority issues a Recovery Certificate (RC) to the District Collector, who possesses statutory powers under revenue laws to attach and auction developer bank accounts and land assets to settle homebuyer claims.`,
    author: 'NyayaConnect Real Estate Litigation Desk',
    publishedAt: new Date(Date.now() - 86400000 * 18).toISOString(),
    tags: ['Property Law', 'Consumer Rights', 'RERA', 'Supreme Court']
  },
  {
    id: 'post-new-labour-codes',
    slug: 'implementation-new-labour-codes-corporate-compliance',
    title: 'The Implementation of the Four Labour Codes: Corporate Compliance, Wage Restructuring, and Gig Economy Rights',
    excerpt: 'An exhaustive examination of the Code on Wages 2019, Industrial Relations Code 2020, Social Security Code 2020, and OSHWC Code 2020, analyzing wage ceiling rules, PF impact, and platform worker social security.',
    content: `The consolidation of 29 existing central labour statutes into four comprehensive Labour Codes represents the most significant structural reorganization of India's labor market since independence. Comprising the Code on Wages (2019), the Industrial Relations Code (2020), the Code on Social Security (2020), and the Occupational Safety, Health and Working Conditions (OSHWC) Code (2020), this reform aims to standardize workplace protections, enhance ease of doing business, and extend formal social security to informal and platform workers.

Uniform Definition of 'Wages' & Financial Impact on Employers (Code on Wages, Section 2(y))
Perhaps the most impactful operational amendment across all four codes is the introduction of a standardized, uniform definition of 'Wages'. Under Section 2(y) of the Code on Wages:
• Basic Pay + Dearness Allowance + Retaining Allowance must constitute at least 50% of the total gross remuneration paid to an employee.
• If discretionary allowances (such as HRA, conveyance, special allowance) exceed 50% of total compensation, the excess amount is automatically added back to compute the 'Wage' base.

Because statutory benefits like Provident Fund (PF) contributions, Gratuity calculations, and Leave Encashment are tied to the 'Wage' base, companies with allowance-heavy CTC structures (where basic pay was historically kept around 20-30%) must restructure their payroll. This will lead to increased employee retirement savings alongside higher corporate contribution liabilities.

Formal Recognition & Social Security for Gig & Platform Workers (Social Security Code, Chapter IX)
Chapter IX of the Code on Social Security, 2020 marks a major regulatory milestone by legally defining 'Gig Worker' (Section 2(35)) and 'Platform Worker' (Section 2(61)) for the first time in Indian jurisprudence. Key statutory mechanics include:
• Central Social Security Board: Establishing dedicated welfare boards to frame schemes providing life/disability cover, accident insurance, health benefits, and old age protection.
• Aggregator Contribution: Digital aggregators operating ride-sharing, food delivery, e-commerce, or logistics platforms MUST contribute between 1% to 2% of their annual turnover toward the Social Security Fund, subject to a cap of 5% of the total amount paid or payable to gig workers.
• Mandatory Registration: Establishing a universal digital portal (such as e-Shram) for gig worker registration using Aadhaar-linked IDs.

Industrial Relations Flexibility & Lay-off Thresholds (Industrial Relations Code, 2020)
The Industrial Relations Code consolidates the Industrial Disputes Act 1947, Trade Unions Act 1926, and Industrial Employment (Standing Orders) Act 1946:
• Standing Orders Threshold: Section 77 elevates the employee threshold for mandatory Standing Orders—which govern classification of workers, shift working, and disciplinary procedures—from 100 to 300 industrial workers. Establishments with under 300 workers gain flexibility in framing workplace policies without prior government approval.
• Lay-off and Closure Retrenchment: Establishments employing 300 or more workers must seek prior permission from the appropriate Government before lay-off, retrenchment, or closure.
• Mandatory Strike Notice (Section 62): Prohibits workers in ALL industrial establishments from going on strike without giving a 14-day advance notice, eliminating sudden wildcat strikes.

Occupational Safety, Health & Working Conditions (OSHWC Code, 2020)
The OSHWC Code amalgamates 13 safety and working condition laws (including Factories Act 1948 and Contract Labour Act 1970). Key requirements include:
1. Mandatory Appointment Letters: Employer obligation to issue formal written appointment letters to all employees.
2. Free Annual Health Checkups: Mandatory employer-provided annual medical examinations for workers above a specified age threshold (e.g. 45 years) in designated industries.
3. Gender Equality in Shifts: Women are legally permitted to work night shifts (between 7 PM and 6 AM) across all sectors, provided employers secure consent and guarantee transportation and safety measures.`,
    author: 'NyayaConnect Employment & Labour Law Practice Group',
    publishedAt: new Date(Date.now() - 86400000 * 25).toISOString(),
    tags: ['Labour Law', 'Corporate Compliance', 'Gig Economy', 'Wage Code']
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
    author: data.author || 'Advocate Aastha',
    publishedAt: new Date().toISOString(),
    tags: data.tags || ['Legal Insights']
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
