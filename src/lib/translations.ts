export const translations = {
  en: {
    nav: {
      practiceAreas: 'Services',
      profile: 'About Us',
      faq: 'FAQ',
      clientPortal: 'Client Portal',
    },
    hero: {
      title: 'ClientFlow',
      subtitle: 'Client Portal & Consultation Engine',
      desc: 'All-in-one client management, consultation scheduling, and secure digital collaboration platform built for professional businesses and consultants.',
      enrollment: 'Enterprise Grade Security',
      bar: 'Client Management & Portal System',
      clientPortal: 'Client Portal',
      profile: 'Platform Overview'
    },
    whyUs: {
      title: 'Platform Overview',
      subtitle: 'Everything your business needs to manage client lifecycles.',
      features: [
        {
          title: 'Consultation & Scheduling',
          desc: 'Seamless client booking with automated triage, category routing, and calendar coordination.',
          icon: '📅'
        },
        {
          title: 'Secure Client Portal',
          desc: 'End-to-end client workspace for tracking case/project status, uploading files, and reviewing updates.',
          icon: '🔒'
        },
        {
          title: 'Business Content & Publishing',
          desc: 'Integrated editorial workspace and AI Copilot for knowledge base publishing and client advisories.',
          icon: '💻'
        }
      ]
    },
    practiceAreas: {
      badge: 'Solutions & Services',
      heading: 'Business & Advisory Solutions',
      sub: 'Flexible service modules and consultation categories tailored to your organization.',
      areas: [
        { icon: '📊', title: 'Business Strategy', desc: 'Market analysis, business plan formulation, growth strategies, and execution roadmaps.' },
        { icon: '💼', title: 'Corporate Advisory', desc: 'Governance, structural restructuring, stakeholder alignment, and board compliance.' },
        { icon: '💰', title: 'Financial Consulting', desc: 'Cash flow forecasting, audit readiness, valuation, and capital allocation strategies.' },
        { icon: '🛡️', title: 'Legal & Compliance', desc: 'Regulatory compliance, contract workflows, dispute risk review, and risk management.' },
        { icon: '💻', title: 'Technology & Cloud', desc: 'Digital transformation, software systems evaluation, data governance, and tech roadmap.' },
        { icon: '🤝', title: 'Client Operations', desc: 'Service desk optimization, CRM setup, process automation, and retention strategy.' },
        { icon: '👔', title: 'HR & Talent Strategy', desc: 'Workforce structuring, leadership hiring, policy handbooks, and team development.' },
        { icon: '🛒', title: 'Consumer & Commerce', desc: 'Product lifecycle advisory, vendor agreements, refund governance, and customer care.' },
        { icon: '🔐', title: 'Cyber & Information Security', desc: 'Security audits, data privacy compliance (DPDP/GDPR), and threat mitigation.' },
        { icon: '🏦', title: 'Fintech & Banking Solutions', desc: 'Payment rails integration, debt advisory, loan structures, and fintech compliance.' },
        { icon: '🌐', title: 'Marketing & Brand Strategy', desc: 'Inbound pipeline architecture, content strategy, positioning, and market penetration.' },
        { icon: '📈', title: 'Performance Analytics', desc: 'KPI scorecards, operational metrics, executive dashboards, and efficiency audits.' },
      ]
    },
    faq: {
      badge: 'FAQ',
      heading: 'Frequently Asked Questions',
      sub: 'Learn how our consultation booking and client portal keep your engagements seamless.',
      stillQuestions: 'Still have questions?',
      submitQuery: 'Please submit your inquiry via the portal for personalized support.',
      clientPortalBtn: 'Access Client Portal',
      faqs: [
        { q: 'Is client information kept confidential and secure?', a: 'Yes, absolutely. All client communications, records, and uploaded attachments are encrypted at rest and in transit. Your business data remains strictly confidential and protected.' },
        { q: 'How quickly does the team respond to consultation requests?', a: 'Consultation inquiries are acknowledged immediately, and a specialist will contact you within 24 hours. High-priority inquiries receive same-day priority review.' },
        { q: 'What types of documents can clients upload?', a: 'You can upload PDF files, Word documents (DOCX), spreadsheets, and high-resolution images (JPG, PNG) up to 20 MB each.' },
        { q: 'Can clients schedule virtual video meetings?', a: 'Yes. When booking a consultation, you can select video conferencing or phone call based on your preference.' },
        { q: 'How does the Client Portal login work?', a: 'Clients receive a Consultation ID upon submission. By entering this ID or their registered mobile number, clients can securely review project status, messages, and office notes anytime.' },
        { q: 'Can this platform support multiple service departments?', a: 'Yes, ClientFlow provides multi-category routing across strategy, finance, technology, compliance, and client operations.' },
      ]
    },
    footer: {
      brand: 'ClientFlow',
      tagline: 'Client Management & Portal System',
      desc: 'Modern platform for consultation scheduling, secure client management, and automated collaboration.',
      infoCol: 'Navigation',
      clientPortal: 'Client Portal',
      practiceAreas: 'Services',
      profile: 'Platform Overview',
      legalCol: 'Legal & Terms',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      disclaimer: 'Terms of Engagement',
      contactCol: 'Support & Inquiries',
      address: 'ClientFlow Technologies • Enterprise Business Hub',
      copy: `© ${new Date().getFullYear()} ClientFlow. All rights reserved.`,
      admin: 'Admin Portal'
    },
    disclaimerModal: {
      title: 'Terms of Engagement & Privacy Notice',
      p1: 'Welcome to ClientFlow. By proceeding, you agree to access our professional services and client consultation platform.',
      p2: 'All communications, appointment bookings, and uploaded records submitted through this application are processed securely in accordance with our privacy practices.',
      p3: 'Information provided on this site is for general business guidance. Specific advisory engagements are formalized upon mutual agreement.',
      decline: 'Decline',
      accept: 'I Understand & Accept'
    },
    consult: {
      page: { title: 'Book a Consultation', sub: 'Fill in your details below and our team will get in touch promptly.' },
      steps: { 1: 'Contact Info', 2: 'Inquiry Details', 3: 'Priority & Schedule', 4: 'Documents', 5: 'Review & Submit' },
      nav: { back: 'Back', next: 'Next', submit: 'Submit Consultation Request', submitting: 'Submitting...' },
      step1: {
        title: 'Contact Information', desc: 'Tell us about yourself so our team can connect with the right guidance.',
        fullName: 'Full Name', fullNamePlaceholder: 'Alex Morgan',
        mobile: 'Contact Number', mobilePlaceholder: '9XXXXXXXXX',
        email: 'Email Address', emailPlaceholder: 'alex@example.com',
        occupation: 'Organization / Role', occupationPlaceholder: 'e.g. Founder, Operations Director, Manager',
        city: 'City / Region', citySelect: 'Select Region',
        state: 'State / Province', prefLang: 'Preferred Language', langSelect: 'Select Language',
        errors: {
          fullName: 'Full name is required', mobileReq: 'Contact number is required', mobileInv: 'Enter a valid 10-digit number',
          emailReq: 'Email is required', emailInv: 'Enter a valid email address', cityReq: 'City is required', stateReq: 'Please select a state'
        }
      },
      step2: {
        title: 'Inquiry & Requirements', desc: 'Provide overview details about your project or consultation requirement.',
        practiceArea: 'Service Category', selectPractice: 'Select Service Category', caseType: 'Inquiry Type', selectCaseType: 'Select Inquiry Type', 
        caseSummary: 'Inquiry Summary', summaryPlaceholder: 'Describe your objectives, current challenges, or specific needs...',
        opponent: 'Organization / Counterparty (Optional)', opponentPlaceholder: 'Related company or entity name',
        court: 'Jurisdiction / Industry Sector', courtPlaceholder: 'e.g. Technology / FinTech / National',
        station: 'Department / Reference Code', stationPlaceholder: 'e.g. Operations Unit 4', 
        stage: 'Current Project Stage', selectStage: 'Select Stage', optional: '(if applicable)',
        errors: { practiceArea: 'Please select a service category', caseType: 'Please select an inquiry type', caseSummary: 'Please provide a brief summary', summaryShort: 'Please provide at least 30 characters', caseStage: 'Please select a project stage' }
      },
      step3: {
        title: 'Priority & Scheduling', desc: 'Let us know how urgently you need assistance.',
        urgency: 'How urgent is this inquiry?', urgLow: 'Standard (Within a week)', urgMed: 'Medium (Within 2-3 days)', urgHigh: 'Priority (Within 24 hours)',
        contactTime: 'Preferred Contact Time', timeMorn: 'Morning (10 AM - 1 PM)', timeAft: 'Afternoon (2 PM - 5 PM)', timeEve: 'Evening (6 PM - 8 PM)',
        video: 'Request Video Consultation', videoDesc: 'I would prefer a video meeting over a phone call if possible.'
      },
      step4: {
        title: 'Supporting Documents', desc: 'Upload any relevant project briefs, contracts, or reference files.',
        uploadBtn: 'Click or drag files here to upload', uploadSub: 'Supported: PDF, JPG, PNG, DOCX (Max 20MB per file)'
      },
      step5: {
        title: 'Review & Submit', desc: 'Please review your consultation details before submitting.',
        edit: 'Edit', personal: 'Contact Info', legal: 'Inquiry Details', prefs: 'Preferences', docs: 'Documents', noDocs: 'No documents uploaded',
        submitError: 'Something went wrong. Please try again.',
        consent: 'By submitting, you agree to our Privacy Policy and Terms of Service. Your data is encrypted and secure.'
      }
    },
    languages: { 'English': 'English', 'Hindi': 'Hindi' },
    states: { 'General': 'General', 'National': 'National', 'International': 'International' },
    districts: {
      'Araria': 'Araria', 'Arwal': 'Arwal', 'Aurangabad': 'Aurangabad', 'Banka': 'Banka', 'Begusarai': 'Begusarai', 'Bhagalpur': 'Bhagalpur', 'Bhojpur': 'Bhojpur', 
      'Buxar': 'Buxar', 'Darbhanga': 'Darbhanga', 'East Champaran': 'East Champaran', 'Gaya': 'Gaya', 'Gopalganj': 'Gopalganj', 'Jamui': 'Jamui', 'Jehanabad': 'Jehanabad', 
      'Kaimur': 'Kaimur', 'Katihar': 'Katihar', 'Khagaria': 'Khagaria', 'Kishanganj': 'Kishanganj', 'Lakhisarai': 'Lakhisarai', 'Madhepura': 'Madhepura', 'Madhubani': 'Madhubani', 
      'Munger': 'Munger', 'Muzaffarpur': 'Muzaffarpur', 'Nalanda': 'Nalanda', 'Nawada': 'Nawada', 'Patna': 'Patna', 'Purnia': 'Purnia', 'Rohtas': 'Rohtas', 'Saharsa': 'Saharsa', 
      'Samastipur': 'Samastipur', 'Saran': 'Saran', 'Sheikhpura': 'Sheikhpura', 'Sheohar': 'Sheohar', 'Sitamarhi': 'Sitamarhi', 'Siwan': 'Siwan', 'Supaul': 'Supaul', 
      'Vaishali': 'Vaishali', 'West Champaran': 'West Champaran'
    }
  },
  hi: {
    nav: {
      practiceAreas: 'सेवाएं',
      profile: 'हमारे बारे में',
      faq: 'सामान्य प्रश्न',
      clientPortal: 'क्लाइंट पोर्टल',
    },
    hero: {
      title: 'ClientFlow',
      subtitle: 'क्लाइंट पोर्टल और परामर्श इंजन',
      desc: 'पेशेवर व्यवसायों और सलाहकारों के लिए निर्मित संपूर्ण क्लाइंट प्रबंधन, परामर्श शेड्यूलिंग और सुरक्षित डिजिटल सहयोग प्लेटफ़ॉर्म।',
      enrollment: 'एंटरप्राइज-ग्रेड सुरक्षा',
      bar: 'क्लाइंट प्रबंधन और पोर्टल सिस्टम',
      clientPortal: 'क्लाइंट पोर्टल',
      profile: 'प्लेटफ़ॉर्म विवरण'
    },
    whyUs: {
      title: 'प्लेटफ़ॉर्म विवरण',
      subtitle: 'क्लाइंट जीवनचक्र प्रबंधित करने के लिए आपके व्यवसाय की हर ज़रूरत।',
      features: [
        {
          title: 'परामर्श और शेड्यूलिंग',
          desc: 'स्वचालित ट्राइएज और कैलेंडर समन्वय के साथ निर्बाध क्लाइंट बुकिंग।',
          icon: '📅'
        },
        {
          title: 'सुरक्षित क्लाइंट पोर्टल',
          desc: 'स्थिति ट्रैक करने, दस्तावेज़ अपलोड करने और अपडेट देखने के लिए सुरक्षित वर्कस्पेस।',
          icon: '🔒'
        },
        {
          title: 'व्यावसायिक सामग्री और प्रकाशन',
          desc: 'नॉलेज बेस प्रकाशन और क्लाइंट परामर्श के लिए एकीकृत संपादकीय वर्कस्पेस।',
          icon: '💻'
        }
      ]
    },
    practiceAreas: {
      badge: 'समाधान और सेवाएं',
      heading: 'व्यावसायिक और सलाहकार समाधान',
      sub: 'आपके संगठन के अनुकूल लचीले सेवा मॉड्यूल और परामर्श श्रेणियां।',
      areas: [
        { icon: '📊', title: 'व्यावसायिक रणनीति', desc: 'बाजार विश्लेषण, व्यवसाय योजना निर्माण, और विकास रणनीतियाँ।' },
        { icon: '💼', title: 'कॉर्पोरेट सलाहकार', desc: 'शासन, संरचनात्मक पुनर्गठन, और अनुपालन समीक्षा।' },
        { icon: '💰', title: 'वित्तीय परामर्श', desc: 'कैश फ्लो पूर्वानुमान, ऑडिट तैयारी, और पूंजी आवंटन।' },
        { icon: '🛡️', title: 'कानूनी और अनुपालन', desc: 'नियामक अनुपालन, अनुबंध वर्कफ़्लो, और जोखिम प्रबंधन।' },
        { icon: '💻', title: 'प्रौद्योगिकी और क्लाउड', desc: 'डिजिटल परिवर्तन, सॉफ्टवेयर सिस्टम मूल्यांकन, और टेक रोडमैप।' },
        { icon: '🤝', title: 'क्लाइंट संचालन', desc: 'सर्विस डेस्क अनुकूलन, सीआरएम सेटअप, और प्रोसेस ऑटोमेशन।' },
        { icon: '👔', title: 'मानव संसाधन रणनीति', desc: 'कार्यबल संरचना, नेतृत्व भर्ती, और टीम विकास।' },
        { icon: '🛒', title: 'उपभोक्ता और वाणिज्य', desc: 'उत्पाद जीवनचक्र सलाह, विक्रेता समझौते, और ग्राहक सेवा।' },
        { icon: '🔐', title: 'साइबर और डेटा सुरक्षा', desc: 'सुरक्षा ऑडिट, डेटा गोपनीयता अनुपालन (DPDP/GDPR), और सुरक्षा।' },
        { icon: '🏦', title: 'फिनटेक और बैंकिंग', desc: 'पेमेंट एकीकरण, ऋण सलाहकार, और वित्तीय अनुपालन।' },
        { icon: '🌐', title: 'विपणन और ब्रांड रणनीति', desc: 'कंटेंट रणनीति, ब्रांड स्थिति, और बाजार विस्तार।' },
        { icon: '📈', title: 'प्रदर्शन विश्लेषण', desc: 'केपीआई स्कोरकार्ड, परिचालन मेट्रिक्स, और दक्षता ऑडिट।' },
      ]
    },
    faq: {
      badge: 'सामान्य प्रश्न',
      heading: 'अक्सर पूछे जाने वाले प्रश्न',
      sub: 'जानें कि हमारी परामर्श बुकिंग और क्लाइंट पोर्टल आपके काम को कैसे आसान बनाते हैं।',
      stillQuestions: 'क्या अभी भी प्रश्न हैं?',
      submitQuery: 'व्यक्तिगत सहायता के लिए कृपया पोर्टल के माध्यम से अपनी क्वेरी सबमिट करें।',
      clientPortalBtn: 'क्लाइंट पोर्टल तक पहुंचें',
      faqs: [
        { q: 'क्या क्लाइंट की जानकारी सुरक्षित और गोपनीय है?', a: 'हाँ, बिल्कुल। सभी संचार, रिकॉर्ड और अपलोड किए गए दस्तावेज़ पूरी तरह से एन्क्रिप्टेड और सुरक्षित हैं।' },
        { q: 'परामर्श अनुरोधों का उत्तर कितनी जल्दी मिलता है?', a: 'सभी पूछताछ का 24 घंटों के भीतर समाधान किया जाता है। प्राथमिकता वाली पूछताछ की उसी दिन समीक्षा की जाती है।' },
        { q: 'क्लाइंट किस प्रकार के दस्तावेज़ अपलोड कर सकते हैं?', a: 'आप पीडीएफ, वर्ड दस्तावेज़, स्प्रेडशीट और चित्र (अधिकतम 20MB) अपलोड कर सकते हैं।' },
        { q: 'क्या वीडियो परामर्श उपलब्ध हैं?', a: 'हाँ, बुकिंग के दौरान आप फ़ोन कॉल या वीडियो कॉन्फ्रेंसिंग चुन सकते हैं।' },
        { q: 'क्लाइंट पोर्टल कैसे काम करता है?', a: 'सबमिशन पर आपको एक कंसल्टेशन आईडी मिलती है जिससे आप किसी भी समय स्थिति और नोट्स देख सकते हैं।' },
        { q: 'क्या यह कई सेवा श्रेणियों का समर्थन करता है?', a: 'हाँ, ClientFlow रणनीति, वित्त, प्रौद्योगिकी और संचालन श्रेणियों का समर्थन करता है।' },
      ]
    },
    footer: {
      brand: 'ClientFlow',
      tagline: 'क्लाइंट प्रबंधन और पोर्टल सिस्टम',
      desc: 'परामर्श शेड्यूलिंग, सुरक्षित क्लाइंट प्रबंधन और सहयोग के लिए आधुनिक प्लेटफ़ॉर्म।',
      infoCol: 'नेविगेशन',
      clientPortal: 'क्लाइंट पोर्टल',
      practiceAreas: 'सेवाएं',
      profile: 'प्लेटफ़ॉर्म विवरण',
      legalCol: 'कानूनी और शर्तें',
      privacy: 'गोपनीयता नीति',
      terms: 'सेवा की शर्तें',
      disclaimer: 'नियम व शर्तें',
      contactCol: 'सहायता और संपर्क',
      address: 'ClientFlow Technologies • बिजनेस हब',
      copy: `© ${new Date().getFullYear()} ClientFlow. सर्वाधिकार सुरक्षित।`,
      admin: 'एडमिन पोर्टल'
    },
    disclaimerModal: {
      title: 'नियम व शर्तें एवं गोपनीयता सूचना',
      p1: 'ClientFlow में आपका स्वागत है। आगे बढ़कर, आप हमारे पेशेवर सेवाओं और परामर्श प्लेटफ़ॉर्म तक पहुंचने के लिए सहमत होते हैं।',
      p2: 'इस एप्लिकेशन के माध्यम से सबमिट किए गए सभी रिकॉर्ड हमारी गोपनीयता नीतियों के अनुसार सुरक्षित रूप से संसाधित किए जाते हैं।',
      p3: 'इस साइट पर दी गई जानकारी सामान्य व्यावसायिक मार्गदर्शन के लिए है। विशिष्ट सलाहकार सेवाएं आपसी सहमति पर आधारित होती हैं।',
      decline: 'अस्वीकार',
      accept: 'मैं सहमत हूँ'
    },
    consult: {
      page: { title: 'परामर्श का अनुरोध करें', sub: 'नीचे विवरण भरें और हम आपसे शीघ्र संपर्क करेंगे।' },
      steps: { 1: 'व्यक्तिगत जानकारी', 2: 'कानूनी मामला', 3: 'प्राथमिकता', 4: 'दस्तावेज़', 5: 'समीक्षा' },
      nav: { back: 'पीछे', next: 'अगला', submit: 'अनुरोध सबमिट करें', submitting: 'सबमिट हो रहा है...' },
      step1: {
        title: 'संपर्क जानकारी', desc: 'अपने बारे में बताएं ताकि हमारी टीम सही मार्गदर्शन के साथ आप तक पहुंच सके।',
        fullName: 'पूरा नाम', fullNamePlaceholder: 'राजेश कुमार',
        mobile: 'संपर्क नंबर', mobilePlaceholder: '9XXXXXXXXX',
        email: 'ईमेल पता', emailPlaceholder: 'rajesh@example.com',
        occupation: 'संगठन / पद', occupationPlaceholder: 'जैसे- संस्थापक, संचालन निदेशक, प्रबंधक',
        city: 'शहर / क्षेत्र', citySelect: 'क्षेत्र चुनें',
        state: 'राज्य / प्रांत', prefLang: 'पसंदीदा भाषा', langSelect: 'भाषा चुनें',
        errors: {
          fullName: 'पूरा नाम आवश्यक है', mobileReq: 'संपर्क नंबर आवश्यक है', mobileInv: 'मान्य 10-अंकीय नंबर दर्ज करें',
          emailReq: 'ईमेल आवश्यक है', emailInv: 'वैध ईमेल पता दर्ज करें', cityReq: 'शहर आवश्यक है', stateReq: 'कृपया एक राज्य चुनें'
        }
      },
      step2: {
        title: 'पूछताछ और आवश्यकताएं', desc: 'अपनी परियोजना या परामर्श आवश्यकता के बारे में विवरण प्रदान करें।',
        practiceArea: 'सेवा श्रेणी', selectPractice: 'सेवा श्रेणी चुनें', caseType: 'पूछताछ का प्रकार', selectCaseType: 'पूछताछ का प्रकार चुनें', 
        caseSummary: 'पूछताछ सारांश', summaryPlaceholder: 'अपने उद्देश्यों, वर्तमान चुनौतियों या विशिष्ट आवश्यकताओं का वर्णन करें...',
        opponent: 'संगठन / संबंधित पक्ष (वैकल्पिक)', opponentPlaceholder: 'संबंधित कंपनी या संस्था का नाम',
        court: 'उद्योग क्षेत्र / कार्यक्षेत्र', courtPlaceholder: 'जैसे- प्रौद्योगिकी / फिनटेक / राष्ट्रीय',
        station: 'विभाग / संदर्भ कोड', stationPlaceholder: 'जैसे- ऑपरेशंस यूनिट 4', 
        stage: 'वर्तमान परियोजना चरण', selectStage: 'चरण चुनें', optional: '(यदि लागू हो)',
        errors: { practiceArea: 'कृपया सेवा श्रेणी चुनें', caseType: 'कृपया पूछताछ का प्रकार चुनें', caseSummary: 'कृपया संक्षिप्त सारांश प्रदान करें', summaryShort: 'कृपया कम से कम 30 अक्षर प्रदान करें', caseStage: 'कृपया एक परियोजना चरण चुनें' }
      },
      step3: {
        title: 'प्राथमिकता और शेड्यूलिंग', desc: 'हमें बताएं कि आपको कितनी तत्परता से सहायता की आवश्यकता है।',
        urgency: 'यह पूछताछ कितनी जरूरी है?', urgLow: 'मानक (एक सप्ताह के भीतर)', urgMed: 'मध्यम (2-3 दिनों के भीतर)', urgHigh: 'प्राथमिकता (24 घंटों के भीतर)',
        contactTime: 'पसंदीदा संपर्क समय', timeMorn: 'सुबह (10 AM - 1 PM)', timeAft: 'दोपहर (2 PM - 5 PM)', timeEve: 'शाम (6 PM - 8 PM)',
        video: 'वीडियो परामर्श का अनुरोध करें', videoDesc: 'यदि संभव हो तो मैं फोन कॉल के बजाय वीडियो कॉल पसंद करूंगा।'
      },
      step4: {
        title: 'समर्थक दस्तावेज़', desc: 'कोई प्रासंगिक प्रोजेक्ट ब्रीफ, अनुबंध या संदर्भ फाइलें अपलोड करें।',
        uploadBtn: 'अपलोड करने के लिए फ़ाइलों को यहां क्लिक या ड्रैग करें', uploadSub: 'समर्थित: PDF, JPG, PNG, DOCX (अधिकतम 20MB प्रति फ़ाइल)'
      },
      step5: {
        title: 'समीक्षा और सबमिट', desc: 'अनुरोध सबमिट करने से पहले कृपया अपने विवरण की समीक्षा करें।',
        edit: 'संपादित करें', personal: 'संपर्क विवरण', legal: 'पूछताछ विवरण', prefs: 'प्राथमिकताएं', docs: 'दस्तावेज़', noDocs: 'कोई दस्तावेज़ अपलोड नहीं किया गया',
        submitError: 'कुछ गलत हो गया। कृपया पुन: प्रयास करें।',
        consent: 'सबमिट करके, आप हमारी गोपनीयता नीति और सेवा की शर्तों से सहमत होते हैं। आपकी जानकारी एन्क्रिप्टेड और गोपनीय है।'
      }
    },
    languages: { 'English': 'अंग्रेज़ी', 'Hindi': 'हिंदी' },
    states: { 'General': 'सामान्य', 'National': 'राष्ट्रीय', 'International': 'अंतर्राष्ट्रीय' },
    districts: {
      'Araria': 'अररिया', 'Arwal': 'अरवल', 'Aurangabad': 'औरंगाबाद', 'Banka': 'बांका', 'Begusarai': 'बेगूसराय', 'Bhagalpur': 'भागलपुर', 'Bhojpur': 'भोजपुर', 
      'Buxar': 'बक्सर', 'Darbhanga': 'दरभंगा', 'East Champaran': 'पूर्वी चंपारण', 'Gaya': 'गया', 'Gopalganj': 'गोपालगंज', 'Jamui': 'जमुई', 'Jehanabad': 'जहानाबाद', 
      'Kaimur': 'कैमूर', 'Katihar': 'कटिहार', 'Khagaria': 'खगड़िया', 'Kishanganj': 'किशनगंज', 'Lakhisarai': 'लखीसराय', 'Madhepura': 'मधेपुरा', 'Madhubani': 'मधुबनी', 
      'Munger': 'मुंगेर', 'Muzaffarpur': 'मुजफ्फरपुर', 'Nalanda': 'नालंदा', 'Nawada': 'नवादा', 'Patna': 'पटना', 'Purnia': 'पूर्णिया', 'Rohtas': 'रोहतास', 'Saharsa': 'सहरसा', 
      'Samastipur': 'समस्तीपुर', 'Saran': 'सारण', 'Sheikhpura': 'शेखपुरा', 'Sheohar': 'शिवहर', 'Sitamarhi': 'सीतामढ़ी', 'Siwan': 'सीवान', 'Supaul': 'सुपौल', 
      'Vaishali': 'वैशाली', 'West Champaran': 'पश्चिमी चंपारण'
    }
  }
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;
