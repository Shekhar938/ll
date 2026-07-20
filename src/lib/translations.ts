export const translations = {
  en: {
    nav: {
      practiceAreas: 'Practice Areas',
      profile: 'Professional Profile',
      faq: 'FAQ',
      clientPortal: 'Client Portal',
    },
    hero: {
      title: 'Advocate Aastha',
      subtitle: 'Official Portal',
      desc: 'Information portal for Advocate Aastha. Practicing across multiple legal disciplines in India.',
      enrollment: 'Enrollment No: D/4567/2015',
      bar: 'Bar Council of Delhi',
      clientPortal: 'Client Portal',
      profile: 'Professional Profile'
    },
    whyUs: {
      title: 'Professional Profile',
      subtitle: 'Background and academic qualifications.',
      features: [
        {
          title: 'Bar Council Enrollment',
          desc: 'Enrolled with the Bar Council of Delhi since 2015. Enrollment Number: D/4567/2015.',
          icon: '⚖️'
        },
        {
          title: 'Academic Qualifications',
          desc: 'B.A. LL.B. (Hons.) from National Law University. LL.M. in Corporate Law.',
          icon: '🎓'
        },
        {
          title: 'Client Portal',
          desc: 'This digital portal allows clients to securely share case documents and request appointments online.',
          icon: '💻'
        }
      ]
    },
    practiceAreas: {
      badge: 'Practice Areas',
      heading: 'Areas of Legal Practice',
      sub: 'Information regarding broad areas of legal practice undertaken by Advocate Aastha.',
      areas: [
        { icon: '⚖️', title: 'Criminal Law', desc: 'Bail applications, trial defense, FIR matters, anticipatory bail, and criminal appeals.' },
        { icon: '📋', title: 'Civil Law', desc: 'Recovery suits, injunctions, specific performance, and civil dispute resolution.' },
        { icon: '🏠', title: 'Property Law', desc: 'Title disputes, property registration, possession matters, and partition suits.' },
        { icon: '👨👩👧', title: 'Family Law', desc: 'Divorce proceedings, child custody, maintenance, domestic violence, and adoption.' },
        { icon: '🏢', title: 'Corporate Law', desc: 'Company incorporation, compliance, mergers, acquisitions, and shareholder disputes.' },
        { icon: '🛒', title: 'Consumer Law', desc: 'Product defects, service deficiencies, misleading advertisements, and refund matters.' },
        { icon: '👔', title: 'Labour Law', desc: 'Wrongful termination, gratuity, PF disputes, and workplace rights protection.' },
        { icon: '💰', title: 'Tax Law', desc: 'Income tax disputes, GST matters, customs, assessments, and penalty waivers.' },
        { icon: '💻', title: 'Cyber Crime', desc: 'Online fraud, data breaches, cyberstalking, hacking incidents, and digital crimes.' },
        { icon: '🏦', title: 'Banking Law', desc: 'Loan recovery, cheque bounce cases, NPA matters, and SARFAESI proceedings.' },
        { icon: '🤝', title: 'Arbitration', desc: 'Commercial disputes, enforcement of awards, and alternative dispute resolution.' },
        { icon: '💼', title: 'Employment Law', desc: 'Discrimination, harassment, wrongful dismissal, and employment benefits disputes.' },
      ]
    },
    faq: {
      badge: 'FAQ',
      heading: 'Frequently Asked Questions',
      sub: 'Information regarding the digital consultation process.',
      stillQuestions: 'Still have questions?',
      submitQuery: 'Please submit your query via the portal for further information.',
      clientPortalBtn: 'Access Client Portal',
      faqs: [
        { q: 'Is my information kept confidential?', a: 'Absolutely. All your personal details, case information, and uploaded documents are encrypted and stored securely. We never share your information with any third party. Your privacy is our highest priority.' },
        { q: 'How long does it take to receive a response?', a: 'We respond to all consultation requests within 24 hours. Urgent matters (marked as High priority) are typically addressed within 2-4 hours during business hours.' },
        { q: 'What types of documents can I upload?', a: 'You can upload PDF files, Word documents (DOCX), and image files (JPG, PNG). Each file can be up to 20 MB in size. This allows you to share FIR copies, court orders, agreements, and other relevant legal documents.' },
        { q: 'Is this a free consultation service?', a: 'The initial consultation request is completely free. Once you submit your details, our advocate will review your case and contact you to discuss the consultation process and any applicable fees.' },
        { q: 'Can I request a video consultation?', a: 'Yes, video consultations are available. During the consultation request form, you can indicate your preference for a video call. Our advocate will schedule a suitable time with you.' },
        { q: 'What happens after I submit my consultation request?', a: 'After submission, our system generates a case summary and our advocate reviews your matter. You will receive a call or message at your preferred contact time. A unique case ID is generated for tracking your request.' },
        { q: 'Can I track my consultation request?', a: 'Yes. After submission, you will receive a unique consultation ID. You can use this ID to track the status of your request. Our team will also proactively keep you informed about any updates.' },
        { q: 'Do you handle cases from all states in India?', a: 'Yes, we accept consultation requests from clients across all states and union territories of India. Consultations can be conducted in person, by phone, or via video call.' },
      ]
    },
    footer: {
      brand: 'Nyaya Aastha',
      tagline: 'Advocate Aastha | Official Portal',
      desc: 'Enrollment No: D/4567/2015 (Bar Council of Delhi). Strictly for informational purposes in compliance with BCI Rules.',
      infoCol: 'Information',
      clientPortal: 'Client Portal',
      practiceAreas: 'Practice Areas',
      profile: 'Professional Profile',
      legalCol: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      disclaimer: 'Legal Disclaimer',
      contactCol: 'Contact',
      address: '123, Lawyers Chamber, High Court Road, New Delhi – 110001',
      copy: `© ${new Date().getFullYear()} Advocate Aastha. All rights reserved. | Not an advertisement or solicitation.`,
      admin: 'Admin'
    },
    disclaimerModal: {
      title: 'Disclaimer',
      p1: 'The Bar Council of India does not permit advertisement or solicitation by advocates in any form or manner.',
      p2: 'By accessing this website (www.nyayaaastha.in), you acknowledge and confirm that you are seeking information relating to Advocate Aastha of your own accord and that there has been no form of solicitation, advertisement, or inducement by Advocate Aastha or her members.',
      p3: 'The content of this website is for informational purposes only and should not be interpreted as soliciting or advertisement. No material/information provided on this website should be construed as legal advice.',
      decline: 'Decline',
      accept: 'I Agree'
    },
    consult: {
      page: { title: 'Request a Consultation', sub: 'Fill in the details below and we will get back to you promptly.' },
      steps: { 1: 'Personal Info', 2: 'Legal Matter', 3: 'Priority', 4: 'Documents', 5: 'Review' },
      nav: { back: 'Back', next: 'Next', submit: 'Submit Request', submitting: 'Submitting...' },
      step1: {
        title: 'Personal Information', desc: 'Tell us about yourself so we can reach you with the right guidance.',
        fullName: 'Full Name', fullNamePlaceholder: 'Rajesh Kumar',
        mobile: 'Mobile Number', mobilePlaceholder: '9XXXXXXXXX',
        email: 'Email Address', emailPlaceholder: 'rajesh@example.com',
        occupation: 'Occupation', occupationPlaceholder: 'e.g. Business Owner, Teacher',
        city: 'City (District)', citySelect: 'Select District',
        state: 'State', prefLang: 'Preferred Language', langSelect: 'Select Language',
        errors: {
          fullName: 'Full name is required', mobileReq: 'Mobile number is required', mobileInv: 'Enter a valid 10-digit Indian mobile number',
          emailReq: 'Email is required', emailInv: 'Enter a valid email address', cityReq: 'City is required', stateReq: 'Please select a state'
        }
      },
      step2: {
        title: 'Legal Matter Details', desc: 'Provide basic details about your legal requirement.',
        practiceArea: 'Practice Area', selectPractice: 'Select Practice Area', caseType: 'Case Type', selectCaseType: 'Select Case Type', 
        caseSummary: 'Brief Case Summary', summaryPlaceholder: 'Describe your issue briefly...',
        opponent: 'Opposing Party Name (If any)', opponentPlaceholder: 'Name of opponent or organization',
        court: 'Relevant Court / Jurisdiction', courtPlaceholder: 'e.g. Delhi High Court',
        station: 'Police Station', stationPlaceholder: 'e.g. Connaught Place PS', 
        stage: 'Current Stage of Case', selectStage: 'Select Stage', optional: '(if applicable)',
        errors: { practiceArea: 'Please select a practice area', caseType: 'Please select a case type', caseSummary: 'Please provide a brief summary', summaryShort: 'Please provide at least 30 characters', caseStage: 'Please select a case stage' }
      },
      step3: {
        title: 'Priority & Preferences', desc: 'Let us know how urgently you need assistance.',
        urgency: 'How urgent is this matter?', urgLow: 'Low (Within a week)', urgMed: 'Medium (Within 2-3 days)', urgHigh: 'High (Within 24 hours)',
        contactTime: 'Preferred Contact Time', timeMorn: 'Morning (10 AM - 1 PM)', timeAft: 'Afternoon (2 PM - 5 PM)', timeEve: 'Evening (6 PM - 8 PM)',
        video: 'Request Video Consultation', videoDesc: 'I would prefer a video call over a phone call if possible.'
      },
      step4: {
        title: 'Supporting Documents', desc: 'Upload any relevant documents (FIR, Notices, Agreements) to help us understand your case better.',
        uploadBtn: 'Click or drag files here to upload', uploadSub: 'Supported: PDF, JPG, PNG (Max 20MB per file)'
      },
      step5: {
        title: 'Review & Submit', desc: 'Please review your details before submitting the request.',
        edit: 'Edit', personal: 'Personal', legal: 'Legal Matter', prefs: 'Preferences', docs: 'Documents', noDocs: 'No documents uploaded',
        submitError: 'Something went wrong. Please try again.',
        consent: 'By submitting, you agree to our Privacy Policy and Terms of Service. Your information is encrypted and confidential.'
      }
    },
    languages: { 'English': 'English', 'Hindi': 'Hindi' },
    states: { 'Bihar': 'Bihar' },
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
      practiceAreas: 'अभ्यास क्षेत्र',
      profile: 'पेशेवर प्रोफ़ाइल',
      faq: 'सामान्य प्रश्न',
      clientPortal: 'क्लाइंट पोर्टल',
    },
    hero: {
      title: 'अधिवक्ता आस्था',
      subtitle: 'आधिकारिक पोर्टल',
      desc: 'अधिवक्ता आस्था के लिए सूचना पोर्टल। भारत में कई कानूनी विषयों में अभ्यास कर रही हैं।',
      enrollment: 'नामांकन संख्या: D/4567/2015',
      bar: 'दिल्ली बार काउंसिल',
      clientPortal: 'क्लाइंट पोर्टल',
      profile: 'पेशेवर प्रोफ़ाइल'
    },
    whyUs: {
      title: 'पेशेवर प्रोफ़ाइल',
      subtitle: 'पृष्ठभूमि और शैक्षणिक योग्यता।',
      features: [
        {
          title: 'बार काउंसिल नामांकन',
          desc: '2015 से दिल्ली बार काउंसिल में नामांकित। नामांकन संख्या: D/4567/2015।',
          icon: '⚖️'
        },
        {
          title: 'शैक्षणिक योग्यता',
          desc: 'नेशनल लॉ यूनिवर्सिटी से बी.ए. एलएल.बी. (ऑनर्स)। कॉर्पोरेट लॉ में एलएल.एम।',
          icon: '🎓'
        },
        {
          title: 'क्लाइंट पोर्टल',
          desc: 'यह डिजिटल पोर्टल ग्राहकों को सुरक्षित रूप से केस दस्तावेज़ साझा करने और ऑनलाइन अपॉइंटमेंट का अनुरोध करने की अनुमति देता है।',
          icon: '💻'
        }
      ]
    },
    practiceAreas: {
      badge: 'अभ्यास क्षेत्र',
      heading: 'कानूनी अभ्यास के क्षेत्र',
      sub: 'अधिवक्ता आस्था द्वारा किए गए कानूनी अभ्यास के व्यापक क्षेत्रों के बारे में जानकारी।',
      areas: [
        { icon: '⚖️', title: 'आपराधिक कानून', desc: 'जमानत आवेदन, ट्रायल डिफेंस, एफआईआर मामले, अग्रिम जमानत, और आपराधिक अपील।' },
        { icon: '📋', title: 'सिविल कानून', desc: 'वसूली के मुकदमे, निषेधाज्ञा, विशिष्ट प्रदर्शन, और दीवानी विवाद समाधान।' },
        { icon: '🏠', title: 'संपत्ति कानून', desc: 'शीर्षक विवाद, संपत्ति पंजीकरण, कब्जा मामले, और विभाजन के मुकदमे।' },
        { icon: '👨👩👧', title: 'पारिवारिक कानून', desc: 'तलाक की कार्यवाही, बाल संरक्षण, भरण-पोषण, घरेलू हिंसा, और गोद लेना।' },
        { icon: '🏢', title: 'कॉर्पोरेट कानून', desc: 'कंपनी निगमन, अनुपालन, विलय, अधिग्रहण, और शेयरधारक विवाद।' },
        { icon: '🛒', title: 'उपभोक्ता कानून', desc: 'उत्पाद दोष, सेवा की कमियां, भ्रामक विज्ञापन, और धनवापसी के मामले।' },
        { icon: '👔', title: 'श्रम कानून', desc: 'गलत तरीके से बर्खास्तगी, ग्रेच्युटी, पीएफ विवाद, और कार्यस्थल अधिकार संरक्षण।' },
        { icon: '💰', title: 'कर कानून', desc: 'आयकर विवाद, जीएसटी मामले, सीमा शुल्क, मूल्यांकन, और जुर्माना छूट।' },
        { icon: '💻', title: 'साइबर अपराध', desc: 'ऑनलाइन धोखाधड़ी, डेटा उल्लंघन, साइबरस्टॉकिंग, हैकिंग की घटनाएं, और डिजिटल अपराध।' },
        { icon: '🏦', title: 'बैंकिंग कानून', desc: 'ऋण वसूली, चेक बाउंस मामले, एनपीए मामले, और सरफेसी कार्यवाही।' },
        { icon: '🤝', title: 'मध्यस्थता', desc: 'वाणिज्यिक विवाद, पुरस्कारों का प्रवर्तन, और वैकल्पिक विवाद समाधान।' },
        { icon: '💼', title: 'रोजगार कानून', desc: 'भेदभाव, उत्पीड़न, गलत तरीके से बर्खास्तगी, और रोजगार लाभ विवाद।' },
      ]
    },
    faq: {
      badge: 'सामान्य प्रश्न',
      heading: 'अक्सर पूछे जाने वाले प्रश्न',
      sub: 'डिजिटल परामर्श प्रक्रिया के बारे में जानकारी।',
      stillQuestions: 'क्या अभी भी प्रश्न हैं?',
      submitQuery: 'अधिक जानकारी के लिए कृपया पोर्टल के माध्यम से अपनी क्वेरी सबमिट करें।',
      clientPortalBtn: 'क्लाइंट पोर्टल तक पहुंचें',
      faqs: [
        { q: 'क्या मेरी जानकारी गोपनीय रखी जाती है?', a: 'बिल्कुल। आपके सभी व्यक्तिगत विवरण, केस की जानकारी, और अपलोड किए गए दस्तावेज़ एन्क्रिप्टेड और सुरक्षित रूप से संग्रहीत किए जाते हैं। हम कभी भी किसी तीसरे पक्ष के साथ आपकी जानकारी साझा नहीं करते हैं। आपकी गोपनीयता हमारी सर्वोच्च प्राथमिकता है।' },
        { q: 'प्रतिक्रिया प्राप्त करने में कितना समय लगता है?', a: 'हम 24 घंटों के भीतर सभी परामर्श अनुरोधों का जवाब देते हैं। तत्काल मामलों (उच्च प्राथमिकता के रूप में चिह्नित) को आमतौर पर व्यावसायिक घंटों के दौरान 2-4 घंटों के भीतर संबोधित किया जाता है।' },
        { q: 'मैं किस प्रकार के दस्तावेज़ अपलोड कर सकता हूँ?', a: 'आप पीडीएफ फाइलें, वर्ड दस्तावेज़ (DOCX), और छवि फाइलें (JPG, PNG) अपलोड कर सकते हैं। प्रत्येक फाइल आकार में 20 एमबी तक हो सकती है। इससे आप एफआईआर की प्रतियां, अदालत के आदेश, समझौते, और अन्य प्रासंगिक कानूनी दस्तावेज़ साझा कर सकते हैं।' },
        { q: 'क्या यह एक मुफ्त परामर्श सेवा है?', a: 'प्रारंभिक परामर्श अनुरोध पूरी तरह से मुफ्त है। एक बार जब आप अपना विवरण सबमिट करते हैं, तो हमारे अधिवक्ता आपके मामले की समीक्षा करेंगे और परामर्श प्रक्रिया और किसी भी लागू शुल्क पर चर्चा करने के लिए आपसे संपर्क करेंगे।' },
        { q: 'क्या मैं वीडियो परामर्श का अनुरोध कर सकता हूँ?', a: 'हां, वीडियो परामर्श उपलब्ध हैं। परामर्श अनुरोध फ़ॉर्म के दौरान, आप वीडियो कॉल के लिए अपनी प्राथमिकता का संकेत दे सकते हैं। हमारे अधिवक्ता आपके साथ उपयुक्त समय निर्धारित करेंगे।' },
        { q: 'अपना परामर्श अनुरोध सबमिट करने के बाद क्या होता है?', a: 'सबमिशन के बाद, हमारा सिस्टम एक केस सारांश उत्पन्न करता है और हमारे अधिवक्ता आपके मामले की समीक्षा करते हैं। आपको अपने पसंदीदा संपर्क समय पर एक कॉल या संदेश प्राप्त होगा। आपके अनुरोध को ट्रैक करने के लिए एक अद्वितीय केस आईडी उत्पन्न की जाती है।' },
        { q: 'क्या मैं अपने परामर्श अनुरोध को ट्रैक कर सकता हूँ?', a: 'हाँ। सबमिशन के बाद, आपको एक अद्वितीय परामर्श आईडी प्राप्त होगी। आप इस आईडी का उपयोग अपने अनुरोध की स्थिति को ट्रैक करने के लिए कर सकते हैं। हमारी टीम आपको किसी भी अपडेट के बारे में सक्रिय रूप से सूचित रखेगी।' },
        { q: 'क्या आप भारत के सभी राज्यों के मामलों को संभालते हैं?', a: 'हां, हम भारत के सभी राज्यों और केंद्र शासित प्रदेशों के ग्राहकों से परामर्श अनुरोध स्वीकार करते हैं। परामर्श व्यक्तिगत रूप से, फोन द्वारा, या वीडियो कॉल के माध्यम से आयोजित किए जा सकते हैं।' },
      ]
    },
    footer: {
      brand: 'न्याय आस्था',
      tagline: 'अधिवक्ता आस्था | आधिकारिक पोर्टल',
      desc: 'नामांकन संख्या: D/4567/2015 (दिल्ली बार काउंसिल)। BCI नियमों के अनुपालन में केवल सूचनात्मक उद्देश्यों के लिए।',
      infoCol: 'जानकारी',
      clientPortal: 'क्लाइंट पोर्टल',
      practiceAreas: 'अभ्यास क्षेत्र',
      profile: 'पेशेवर प्रोफ़ाइल',
      legalCol: 'कानूनी',
      privacy: 'गोपनीयता नीति',
      terms: 'सेवा की शर्तें',
      disclaimer: 'कानूनी अस्वीकरण',
      contactCol: 'संपर्क',
      address: '123, लॉयर्स चैंबर, हाई कोर्ट रोड, नई दिल्ली – 110001',
      copy: `© ${new Date().getFullYear()} अधिवक्ता आस्था। सर्वाधिकार सुरक्षित। | यह विज्ञापन या आग्रह नहीं है।`,
      admin: 'एडमिन'
    },
    disclaimerModal: {
      title: 'अस्वीकरण',
      p1: 'बार काउंसिल ऑफ इंडिया अधिवक्ताओं द्वारा किसी भी रूप या तरीके से विज्ञापन या आग्रह की अनुमति नहीं देता है।',
      p2: 'इस वेबसाइट (www.nyayaaastha.in) तक पहुंचकर, आप स्वीकार करते हैं और पुष्टि करते हैं कि आप अपनी स्वेच्छा से अधिवक्ता आस्था से संबंधित जानकारी मांग रहे हैं और अधिवक्ता आस्था या उनके सदस्यों द्वारा किसी भी प्रकार का आग्रह, विज्ञापन या प्रलोभन नहीं दिया गया है।',
      p3: 'इस वेबसाइट की सामग्री केवल सूचना के उद्देश्यों के लिए है और इसे आग्रह या विज्ञापन के रूप में व्याख्या नहीं किया जाना चाहिए। इस वेबसाइट पर प्रदान की गई किसी भी सामग्री/जानकारी को कानूनी सलाह के रूप में नहीं माना जाना चाहिए।',
      decline: 'अस्वीकार',
      accept: 'मैं सहमत हूँ'
    },
    consult: {
      page: { title: 'परामर्श का अनुरोध करें', sub: 'नीचे विवरण भरें और हम आपसे शीघ्र संपर्क करेंगे।' },
      steps: { 1: 'व्यक्तिगत जानकारी', 2: 'कानूनी मामला', 3: 'प्राथमिकता', 4: 'दस्तावेज़', 5: 'समीक्षा' },
      nav: { back: 'पीछे', next: 'अगला', submit: 'अनुरोध सबमिट करें', submitting: 'सबमिट हो रहा है...' },
      step1: {
        title: 'व्यक्तिगत जानकारी', desc: 'अपने बारे में बताएं ताकि हम सही मार्गदर्शन के साथ आप तक पहुंच सकें।',
        fullName: 'पूरा नाम', fullNamePlaceholder: 'राजेश कुमार',
        mobile: 'मोबाइल नंबर', mobilePlaceholder: '9XXXXXXXXX',
        email: 'ईमेल पता', emailPlaceholder: 'rajesh@example.com',
        occupation: 'पेशा', occupationPlaceholder: 'जैसे- व्यवसायी, शिक्षक',
        city: 'शहर (ज़िला)', citySelect: 'ज़िला चुनें',
        state: 'राज्य', prefLang: 'पसंदीदा भाषा', langSelect: 'भाषा चुनें',
        errors: {
          fullName: 'पूरा नाम आवश्यक है', mobileReq: 'मोबाइल नंबर आवश्यक है', mobileInv: 'मान्य 10-अंकीय भारतीय मोबाइल नंबर दर्ज करें',
          emailReq: 'ईमेल आवश्यक है', emailInv: 'वैध ईमेल पता दर्ज करें', cityReq: 'शहर आवश्यक है', stateReq: 'कृपया एक राज्य चुनें'
        }
      },
      step2: {
        title: 'कानूनी मामले का विवरण', desc: 'अपनी कानूनी आवश्यकता के बारे में बुनियादी विवरण प्रदान करें।',
        practiceArea: 'अभ्यास क्षेत्र', selectPractice: 'अभ्यास क्षेत्र चुनें', caseType: 'केस का प्रकार', selectCaseType: 'केस का प्रकार चुनें', 
        caseSummary: 'संक्षिप्त केस सारांश', summaryPlaceholder: 'अपनी समस्या का संक्षेप में वर्णन करें...',
        opponent: 'विरोधी पक्ष का नाम (यदि कोई हो)', opponentPlaceholder: 'विरोधी या संगठन का नाम',
        court: 'संबंधित न्यायालय / अधिकार क्षेत्र', courtPlaceholder: 'जैसे- दिल्ली उच्च न्यायालय',
        station: 'पुलिस स्टेशन', stationPlaceholder: 'जैसे- कनॉट प्लेस पीएस', 
        stage: 'केस का वर्तमान चरण', selectStage: 'चरण चुनें', optional: '(यदि लागू हो)',
        errors: { practiceArea: 'कृपया अभ्यास क्षेत्र चुनें', caseType: 'कृपया केस का प्रकार चुनें', caseSummary: 'कृपया संक्षिप्त सारांश प्रदान करें', summaryShort: 'कृपया कम से कम 30 अक्षर प्रदान करें', caseStage: 'कृपया एक केस चरण चुनें' }
      },
      step3: {
        title: 'प्राथमिकता और प्राथमिकताएं', desc: 'हमें बताएं कि आपको कितनी तत्परता से सहायता की आवश्यकता है।',
        urgency: 'यह मामला कितना जरूरी है?', urgLow: 'कम (एक सप्ताह के भीतर)', urgMed: 'मध्यम (2-3 दिनों के भीतर)', urgHigh: 'उच्च (24 घंटों के भीतर)',
        contactTime: 'पसंदीदा संपर्क समय', timeMorn: 'सुबह (10 AM - 1 PM)', timeAft: 'दोपहर (2 PM - 5 PM)', timeEve: 'शाम (6 PM - 8 PM)',
        video: 'वीडियो परामर्श का अनुरोध करें', videoDesc: 'यदि संभव हो तो मैं फोन कॉल के बजाय वीडियो कॉल पसंद करूंगा।'
      },
      step4: {
        title: 'समर्थक दस्तावेज़', desc: 'आपके मामले को बेहतर ढंग से समझने में हमारी मदद करने के लिए कोई प्रासंगिक दस्तावेज़ (FIR, नोटिस, समझौते) अपलोड करें।',
        uploadBtn: 'अपलोड करने के लिए फ़ाइलों को यहां क्लिक या ड्रैग करें', uploadSub: 'समर्थित: PDF, JPG, PNG (अधिकतम 20MB प्रति फ़ाइल)'
      },
      step5: {
        title: 'समीक्षा और सबमिट', desc: 'अनुरोध सबमिट करने से पहले कृपया अपने विवरण की समीक्षा करें।',
        edit: 'संपादित करें', personal: 'व्यक्तिगत', legal: 'कानूनी मामला', prefs: 'प्राथमिकताएं', docs: 'दस्तावेज़', noDocs: 'कोई दस्तावेज़ अपलोड नहीं किया गया',
        submitError: 'कुछ गलत हो गया। कृपया पुन: प्रयास करें।',
        consent: 'सबमिट करके, आप हमारी गोपनीयता नीति और सेवा की शर्तों से सहमत होते हैं। आपकी जानकारी एन्क्रिप्टेड और गोपनीय है।'
      }
    },
    languages: { 'English': 'अंग्रेज़ी', 'Hindi': 'हिंदी' },
    states: { 'Bihar': 'बिहार' },
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
