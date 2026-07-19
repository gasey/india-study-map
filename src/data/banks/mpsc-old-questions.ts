// ============================================
// MPSC OLD QUESTIONS — Mizoram Public Service Commission PYQ bank.
//
// GENERATED FILE. Fallback snapshot for when the live API
// (http://134.209.154.122/mpsc-api) is unreachable — see useMpscData.ts.
// Source of truth is now Postgres on shiksha-dev; this file is
// resynced periodically, not on every extraction batch.
//
// Shape: `papers` are real exam papers (grouped by sitting -> Paper-I/II/...),
// `questions` link back via `paperId`. See src/data/banks/types.ts.
// ============================================

import type { BankQuestion, ExamPaper } from './types';

export const mpscPapers: ExamPaper[] = [
  {
    "id": "mpsc-direct-2020-asst-engineer-civil-general-studies",
    "examType": "Direct",
    "examName": "Technical Competitive Examination for Recruitment to the post of Assistant Engineer (Civil) under Tourism Department",
    "post": "Assistant Engineer (Civil)",
    "paperSubject": "General Studies",
    "year": 2020,
    "sourceFile": "mpsc_pdfs_examination/Old_Questions/Direct_2019-2020/Asst. Engineer (Civil) Deptt. General Studies.pdf"
  },
  {
    "id": "mpsc-direct-2025-cdpo-general-studies",
    "examType": "Direct",
    "examName": "Competitive Examination for Child Development Project Officer (CDPO) under Social Welfare, Women & Child Development Department and Assistant Director (Food & Drugs) under Health & Family Welfare Department",
    "post": "CDPO / Assistant Director (Food & Drugs)",
    "paperSubject": "General Studies",
    "year": 2025,
    "sourceFile": "mpsc_pdfs_examination/Old_Questions/Direct_2025-2027/CDPO General Studies-2025..pdf"
  },
  {
    "id": "mpsc-direct-2022-jr-grade-mes-electrical-wing-general-english",
    "examType": "Direct",
    "examName": "Technical Competitive Examination for Junior Grade of Mizoram Engineering Service, P&E Cadre (Electrical Wing) under Power & Electricity Department",
    "post": "Junior Grade of MES (Electrical Wing)",
    "paperSubject": "General English",
    "year": 2022,
    "sourceFile": "mpsc_pdfs_examination/Old_Questions/Direct_2022-2023/Jr. Grade of MES (Electrical Wing) under P & E Deptt., General English - 2022...pdf"
  },
  {
    "id": "mpsc-direct-2021-informatics-officer-general-english-paper-2",
    "examType": "Direct",
    "examName": "Technical Competitive Examination for Recruitment to the post of Informatics Officer under Information & Communication Technology Department",
    "post": "Informatics Officer",
    "paperNumber": "Paper-II",
    "paperSubject": "General English",
    "year": 2021,
    "sourceFile": "mpsc_pdfs_examination/Old_Questions/Direct_2020-2021/Informatics Officer - General English Paper-II.pdf"
  },
  {
    "id": "mpsc-direct-2019-soil-conservation-ranger-general-english",
    "examType": "Direct",
    "examName": "Competitive Examination for Recruitment to the post of Soil Conservation Ranger under Land Resources, Soil & Water Conservation Department",
    "post": "Soil Conservation Ranger",
    "paperSubject": "General English",
    "year": 2019,
    "sourceFile": "mpsc_pdfs_examination/Old_Questions/Direct_2019-2020/General English(SCR).pdf"
  },
  {
    "id": "mpsc-direct-2018-acf-general-english",
    "examType": "Direct",
    "examName": "General Competitive Examination for Recruitment to the post of Junior Grade of Mizoram Forest Service i.e. Assistant Conservation of Forest (ACF) under Environment, Forest & Climate Change Department",
    "post": "Assistant Conservation of Forest (ACF)",
    "paperSubject": "General English",
    "year": 2018,
    "sourceFile": "mpsc_pdfs_examination/Old_Questions/Direct_2014-2018/ACF General English.pdf"
  },
  {
    "id": "mpsc-direct-ng-2026-assistant-leso-general-english",
    "examType": "Direct_NG",
    "examName": "Competitive Examination for Recruitment to the post of Assistant Labour, Employment, Skill Development & Entrepreneurship Officer (Assistant LESO) under Labour, Employment, Skill Development & Entrepreneurship Department",
    "post": "Assistant LESO",
    "paperSubject": "General English",
    "year": 2026,
    "sourceFile": "mpsc_pdfs_examination/Old_Questions/Direct_NG_2024-2027/Assistant LESO-2026 General English..pdf"
  },
  {
    "id": "mpsc-direct-2024-forest-ranger-general-english-paper-2",
    "examType": "Direct",
    "examName": "Competitive Examinations for Recruitment to the post of Forest Ranger under Environment, Forests & Climate Change Department",
    "post": "Forest Ranger",
    "paperNumber": "Paper-II",
    "paperSubject": "General English",
    "year": 2024,
    "sourceFile": "mpsc_pdfs_examination/Old_Questions/Direct_2023-2025/Forest Ranger General English-II 2024..pdf"
  },
  {
    "id": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2",
    "examType": "Direct_NG",
    "examName": "Combined Competitive Examination for Recruitment to the post of Junior Engineer (J.E.) under LAD, PWD and I&WRD, Government of Mizoram",
    "post": "Junior Engineer (J.E.)",
    "paperNumber": "Paper-II",
    "paperSubject": "General Knowledge",
    "year": 2025,
    "sourceFile": "mpsc_pdfs_examination/Old_Questions/Direct_NG_2024-2027/JE under LAD& PWD Deptt. General Knowledge Paper-II April-2025 ( A )..pdf"
  },
  {
    "id": "mpsc-direct-2024-mizoram-legal-service-general-knowledge",
    "examType": "Direct",
    "examName": "Technical Competitive Examinations for Junior Grade of Mizoram Legal Service (MLS) under Law & Judicial Department, Government of Mizoram",
    "post": "Junior Grade of Mizoram Legal Service",
    "paperSubject": "General Knowledge",
    "year": 2024,
    "sourceFile": "mpsc_pdfs_examination/Old_Questions/Direct_2023-2025/Mizoram Legal Service General Knowledge August-2024..pdf"
  }
];

export const mpscQuestions: BankQuestion[] = [
  {
    "id": "mpsc-og-3-001",
    "subject": "current-affairs",
    "topic": "niti-aayog-partnerships",
    "topicLabel": "NITI Aayog International Partnerships",
    "difficulty": "medium",
    "question": "The NITI Aayog & which International organization has launched 'The Gandhian Challenge'?",
    "options": [
      "UNESCO",
      "FAO",
      "UNICEF",
      "WHO"
    ],
    "answerIndex": 2,
    "explanation": "NITI Aayog and UNICEF jointly launched 'The Gandhian Challenge' in 2019 to mark Gandhi's 150th birth anniversary, focused on eliminating malnutrition.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [
      "niti-aayog"
    ],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-002",
    "subject": "current-affairs",
    "topic": "chief-of-defence-staff",
    "topicLabel": "Chief of Defence Staff",
    "difficulty": "easy",
    "question": "Who among the following is the first Chief of Defense Staff of the Indian Armed Forces?",
    "options": [
      "KV Krishna Rao",
      "Mukund Naravane",
      "Bipin Rawat",
      "RKS Bhadauria"
    ],
    "answerIndex": 2,
    "explanation": "General Bipin Rawat was appointed India's first Chief of Defence Staff (CDS) on 1 January 2020.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [
      "defence"
    ],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-003",
    "subject": "current-affairs",
    "topic": "oxford-word-of-the-year",
    "topicLabel": "Oxford Word of the Year",
    "difficulty": "medium",
    "question": "Oxford Dictionaries has named which word as its 2019 Word of the Year?",
    "options": [
      "Climate Change",
      "Climate Denial",
      "Climate Anxiety",
      "Climate Emergency"
    ],
    "answerIndex": 3,
    "explanation": "'Climate Emergency' was named Oxford Dictionaries' Word of the Year for 2019.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-004",
    "subject": "current-affairs",
    "topic": "cji-appointments",
    "topicLabel": "Chief Justice of India",
    "difficulty": "medium",
    "question": "Justice Sharad Arvind Bobde, who has been sworn-in as the new Chief Justice of India (CJI), is a former Chief Justice of which High Court?",
    "options": [
      "Madhya Pradesh",
      "Gujarat",
      "Maharashtra",
      "Uttar Pradesh"
    ],
    "answerIndex": 0,
    "explanation": "Justice S.A. Bobde served as Chief Justice of the Madhya Pradesh High Court before becoming CJI in November 2019.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [
      "judiciary"
    ],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-005",
    "subject": "current-affairs",
    "topic": "international-affairs-2020",
    "topicLabel": "International Affairs",
    "difficulty": "medium",
    "question": "Qassim Soleimani, who was killed in the US Air Strike was the Military Commander of which Country?",
    "options": [
      "Iraq",
      "Iran",
      "Syria",
      "Turkey"
    ],
    "answerIndex": 1,
    "explanation": "Qassem Soleimani was the commander of Iran's Quds Force, killed in a US strike in Baghdad in January 2020.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-006",
    "subject": "current-affairs",
    "topic": "wildlife-discoveries",
    "topicLabel": "Wildlife Discoveries",
    "difficulty": "hard",
    "question": "Schistura syngkai, recently discovered in Meghalaya is the scientific name of which type of species?",
    "options": [
      "Cat",
      "Lizard",
      "Frog",
      "Fish"
    ],
    "answerIndex": 3,
    "explanation": "Schistura syngkai is a newly discovered cave-dwelling loach (a type of fish) found in Meghalaya.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-007",
    "subject": "current-affairs",
    "topic": "international-book-fairs",
    "topicLabel": "International Book Fairs",
    "difficulty": "medium",
    "question": "The first Asian country to be the 'Guest of Honour Country' at the International Book fair in Mexico is",
    "options": [
      "China",
      "Japan",
      "India",
      "Australia"
    ],
    "answerIndex": 2,
    "explanation": "India became the first Asian country to be the Guest of Honour at the Guadalajara International Book Fair in Mexico (2019).",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-008",
    "subject": "current-affairs",
    "topic": "khelo-india",
    "topicLabel": "Khelo India Youth Games",
    "difficulty": "easy",
    "question": "Which city organized the 3rd edition of Khelo India Youth Games?",
    "options": [
      "Kolkata",
      "Indore",
      "Guwahati",
      "Chennai"
    ],
    "answerIndex": 2,
    "explanation": "The 3rd Khelo India Youth Games were held in Guwahati, Assam in January 2020.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-009",
    "subject": "current-affairs",
    "topic": "education-policy",
    "topicLabel": "Education Boards",
    "difficulty": "medium",
    "question": "Which education board in India is to introduce AI in schools from the session 2019-20?",
    "options": [
      "ICSE",
      "MBOS",
      "CBSE",
      "HBSE"
    ],
    "answerIndex": 2,
    "explanation": "CBSE introduced Artificial Intelligence as a subject in schools starting the 2019-20 session.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-010",
    "subject": "current-affairs",
    "topic": "eu-climate-policy",
    "topicLabel": "European Union Climate Policy",
    "difficulty": "medium",
    "question": "Which country has recently left 2050 Climate Neutrality Agreement of European Union?",
    "options": [
      "Russia",
      "Greece",
      "USA",
      "Poland"
    ],
    "answerIndex": 3,
    "explanation": "Poland refused to commit to the EU's 2050 climate neutrality target at the December 2019 summit.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-011",
    "subject": "current-affairs",
    "topic": "electric-vehicle-policy",
    "topicLabel": "Electric Vehicle Policies",
    "difficulty": "medium",
    "question": "Which state/UT had recently approved the Electric Vehicle Policy, 2019?",
    "options": [
      "Delhi",
      "Bangalore",
      "Kolkata",
      "Chandigarh"
    ],
    "answerIndex": 0,
    "explanation": "Delhi approved its Electric Vehicle Policy around 2019-20; the other options listed are cities, not States/UTs.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-012",
    "subject": "current-affairs",
    "topic": "science-festivals",
    "topicLabel": "India International Science Festival",
    "difficulty": "hard",
    "question": "What is the theme of the 5th India International Science Festival (IISF) held on 5th November 2019?",
    "options": [
      "Science for Humanity",
      "Science for New India",
      "RISEN India",
      "Boost New India"
    ],
    "answerIndex": 2,
    "explanation": "The theme of the 5th IISF (2019) was 'RISEN India: Research, Innovation, and Science Empowering the Nation'.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-013",
    "subject": "current-affairs",
    "topic": "assistive-technology",
    "topicLabel": "Assistive Technology Innovations",
    "difficulty": "medium",
    "question": "Which IIT has launched 'Arise-A Standing Wheelchair' for disabled?",
    "options": [
      "IIT Madras",
      "IIT Bombay",
      "IIT Kharagpur",
      "IIT Kanpur"
    ],
    "answerIndex": 0,
    "explanation": "IIT Madras developed the 'Arise' standing wheelchair to assist persons with disabilities.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-014",
    "subject": "current-affairs",
    "topic": "ecommerce-initiatives",
    "topicLabel": "E-commerce Anti-Counterfeit Programs",
    "difficulty": "medium",
    "question": "Which company has introduced 'Project Zero' in India to remove counterfeit products?",
    "options": [
      "Ebay",
      "Amazon",
      "Flipkart",
      "Alibaba"
    ],
    "answerIndex": 1,
    "explanation": "Amazon's 'Project Zero' is an anti-counterfeiting initiative to help brands remove fake products from its platform.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-015",
    "subject": "current-affairs",
    "topic": "fifa-appointments",
    "topicLabel": "FIFA Appointments",
    "difficulty": "medium",
    "question": "Who has been named FIFA's Chief of global football development?",
    "options": [
      "Anthony Taylor",
      "Arsene Wenger",
      "Pele",
      "Igor Stimac"
    ],
    "answerIndex": 1,
    "explanation": "Arsene Wenger was appointed FIFA's Chief of Global Football Development in 2019.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-016",
    "subject": "current-affairs",
    "topic": "sports-awards",
    "topicLabel": "Sports Awards",
    "difficulty": "medium",
    "question": "Which sportsman was recently named 'BBC Sports Personality of the year 2019'?",
    "options": [
      "Lewis Hamilton",
      "Mo Farah",
      "Troy Deeney",
      "Ben Stokes"
    ],
    "answerIndex": 3,
    "explanation": "English cricketer Ben Stokes was named BBC Sports Personality of the Year 2019.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-017",
    "subject": "current-affairs",
    "topic": "time-person-of-year",
    "topicLabel": "TIME Person of the Year",
    "difficulty": "easy",
    "question": "Who has been named as the 2019 Person of the Year by TIME magazine?",
    "options": [
      "Ricky Gervais",
      "Donald Trump",
      "Greta Thunberg",
      "LeBron James"
    ],
    "answerIndex": 2,
    "explanation": "Climate activist Greta Thunberg was named TIME's Person of the Year for 2019.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-018",
    "subject": "current-affairs",
    "topic": "golden-globe-awards",
    "topicLabel": "Golden Globe Awards",
    "difficulty": "medium",
    "question": "Which film won the 'Best motion Picture – Drama' Award in the Golden Globe Awards, 2020?",
    "options": [
      "Marriage Story",
      "1917",
      "Once Upon a time in Hollywood",
      "Joker"
    ],
    "answerIndex": 1,
    "explanation": "'1917' won the Best Motion Picture - Drama award at the 2020 Golden Globes.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-019",
    "subject": "current-affairs",
    "topic": "nobel-prizes-2019",
    "topicLabel": "Nobel Prizes 2019",
    "difficulty": "medium",
    "question": "The 2019 Nobel prize in Chemistry has been awarded for discovery in which field?",
    "options": [
      "Biological Clock",
      "Cryo-electron microscopy",
      "Lithium-ion batteries",
      "Phage display of peptides"
    ],
    "answerIndex": 2,
    "explanation": "The 2019 Nobel Prize in Chemistry was awarded to Goodenough, Whittingham and Yoshino for developing lithium-ion batteries.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-020",
    "subject": "current-affairs",
    "topic": "nobel-prizes-2019",
    "topicLabel": "Nobel Prizes 2019",
    "difficulty": "medium",
    "question": "Which Indian economist has won the 2019 Nobel Economics Prize for study on poverty?",
    "options": [
      "Abhijit Banerjee",
      "Arvind Subramanian",
      "Pranab Bardhan",
      "Srijit Mukherji"
    ],
    "answerIndex": 0,
    "explanation": "Abhijit Banerjee shared the 2019 Nobel Memorial Prize in Economic Sciences with Esther Duflo and Michael Kremer for work on poverty alleviation.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-021",
    "subject": "current-affairs",
    "topic": "nobel-prizes-2019",
    "topicLabel": "Nobel Prizes 2019",
    "difficulty": "medium",
    "question": "Peter Handke received the Nobel Prize of 2019 in which field?",
    "options": [
      "Physiology or Medicine",
      "Literature",
      "Peace prize",
      "Economic Science"
    ],
    "answerIndex": 1,
    "explanation": "Austrian writer Peter Handke won the 2019 Nobel Prize in Literature.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-022",
    "subject": "gk",
    "topic": "world-literature",
    "topicLabel": "World Literature",
    "difficulty": "easy",
    "question": "Who is the author of the book 'Divine Comedy'?",
    "options": [
      "Dante",
      "Dostoevsky",
      "Tolstoy",
      "Dickens"
    ],
    "answerIndex": 0,
    "explanation": "'The Divine Comedy' is an epic poem written by the Italian poet Dante Alighieri.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-023",
    "subject": "current-affairs",
    "topic": "notable-books",
    "topicLabel": "Notable Books",
    "difficulty": "medium",
    "question": "Who is the author of the book 'How to Avoid a Climate Disaster'?",
    "options": [
      "Satya Nadella",
      "Sundar Pichai",
      "Bill Gates",
      "Mark Zuckerberg"
    ],
    "answerIndex": 2,
    "explanation": "Bill Gates authored 'How to Avoid a Climate Disaster' (2021).",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-024",
    "subject": "gk",
    "topic": "national-observance-days",
    "topicLabel": "National Observance Days",
    "difficulty": "easy",
    "question": "The National Energy Conservation Day is observed on which date?",
    "options": [
      "December 10",
      "December 12",
      "December 14",
      "December 16"
    ],
    "answerIndex": 2,
    "explanation": "National Energy Conservation Day is observed on 14 December every year in India.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-025",
    "subject": "gk",
    "topic": "national-observance-days",
    "topicLabel": "National Observance Days",
    "difficulty": "easy",
    "question": "On which day National Voters day is celebrated.",
    "options": [
      "December 25",
      "January 25",
      "February 25",
      "March 25"
    ],
    "answerIndex": 1,
    "explanation": "National Voters' Day is celebrated on 25 January every year, the foundation day of the Election Commission of India.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-026",
    "subject": "current-affairs",
    "topic": "national-awards",
    "topicLabel": "National Awards",
    "difficulty": "medium",
    "question": "Which of the following is posthumously awarded to Arun Jaitley?",
    "options": [
      "Bharat Ratna",
      "Padma Shri",
      "Padma Vibhusan",
      "Padma Bhusan"
    ],
    "answerIndex": 2,
    "explanation": "Arun Jaitley was posthumously awarded the Padma Vibhushan in 2020.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-027",
    "subject": "current-affairs",
    "topic": "grammy-awards",
    "topicLabel": "Grammy Awards",
    "difficulty": "medium",
    "question": "Grammy 2020 Record of the year is awarded to?",
    "options": [
      "Billie Eilish",
      "Ariana Grande",
      "Post Malone & Swae Lee",
      "Lizzo"
    ],
    "answerIndex": 0,
    "explanation": "Billie Eilish's 'Bad Guy' won the Grammy Award for Record of the Year in 2020.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-028",
    "subject": "history",
    "topic": "mizoram-peace-accord",
    "topicLabel": "Mizoram Peace Accord",
    "difficulty": "medium",
    "question": "The Mizoram Peace Accord, 1986 was signed on ?",
    "options": [
      "March 30",
      "April 30",
      "May 30",
      "June 30"
    ],
    "answerIndex": 3,
    "explanation": "The Mizoram Peace Accord was signed on 30 June 1986 between the Government of India and the Mizo National Front.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [
      "mizoram"
    ],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-029",
    "subject": "polity",
    "topic": "mizoram-statehood",
    "topicLabel": "States of the Indian Union",
    "difficulty": "medium",
    "question": "Mizoram is the ______ State of the Indian Union?",
    "options": [
      "22nd",
      "23rd",
      "24th",
      "25th"
    ],
    "answerIndex": 1,
    "explanation": "Mizoram became the 23rd state of India in 1987.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [
      "mizoram"
    ],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-030",
    "subject": "history",
    "topic": "mizoram-colonial-history",
    "topicLabel": "Mizoram Colonial History",
    "difficulty": "hard",
    "question": "Who among the following is the first to come to Mizoram?",
    "options": [
      "TH Lewin",
      "William Williams",
      "JH Lorrain",
      "DE Jones"
    ],
    "answerIndex": 0,
    "explanation": "T.H. Lewin, a British administrator, was among the earliest Europeans to arrive in the Lushai Hills (Mizoram) in the early 1870s.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [
      "mizoram"
    ],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-031",
    "subject": "history",
    "topic": "mizoram-union-territory",
    "topicLabel": "Mizoram Statehood History",
    "difficulty": "medium",
    "question": "The Union Territory of Mizoram came into being on 21st January, 19__",
    "options": [
      "71",
      "72",
      "73",
      "74"
    ],
    "answerIndex": 1,
    "explanation": "Mizoram became a Union Territory on 21 January 1972.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [
      "mizoram"
    ],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-032",
    "subject": "polity",
    "topic": "constitution-day",
    "topicLabel": "Constitution Day",
    "difficulty": "easy",
    "question": "The 70th Constitution Day of India has celebrated on which date?",
    "options": [
      "25th November, 2019",
      "26th November, 2019",
      "27th November, 2019",
      "28th November, 2019"
    ],
    "answerIndex": 1,
    "explanation": "Constitution Day is observed on 26 November every year; 2019 marked the 70th anniversary of the Constitution's adoption.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-033",
    "subject": "polity",
    "topic": "presidents-rule",
    "topicLabel": "President's Rule",
    "difficulty": "easy",
    "question": "Under which of the following Articles of the Indian Constitution of India, the President can impose Presidential Rule in a State?",
    "options": [
      "Article 360",
      "Article 365",
      "Article 356",
      "Article 350"
    ],
    "answerIndex": 2,
    "explanation": "Article 356 allows the President to impose President's Rule in a state if its constitutional machinery fails.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-034",
    "subject": "polity",
    "topic": "sixth-schedule",
    "topicLabel": "Sixth Schedule",
    "difficulty": "medium",
    "question": "Which among the following is not listed in the Sixth Schedule of the Constitution of India?",
    "options": [
      "Mizoram",
      "Meghalaya",
      "Tripura",
      "Manipur"
    ],
    "answerIndex": 3,
    "explanation": "The Sixth Schedule covers tribal areas of Assam, Meghalaya, Tripura and Mizoram; Manipur is not included.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-035",
    "subject": "polity",
    "topic": "citizenship-amendment-act",
    "topicLabel": "Citizenship Amendment Act",
    "difficulty": "medium",
    "question": "In the Citizenship Amendment Act 2019, which of the following religion is not mentioned?",
    "options": [
      "Parsi",
      "Christian",
      "Jain",
      "Sufi"
    ],
    "answerIndex": 3,
    "explanation": "CAA 2019 covers Hindu, Sikh, Buddhist, Jain, Parsi and Christian communities; 'Sufi' is not a religion and is not listed.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-036",
    "subject": "polity",
    "topic": "preamble",
    "topicLabel": "The Preamble",
    "difficulty": "medium",
    "question": "Which of the following words is not included in the Preamble of the Indian Constitution?",
    "options": [
      "Dignity",
      "Justice",
      "Liberty",
      "Equality"
    ],
    "answerIndex": 0,
    "explanation": "Justice, Liberty and Equality are the core ideals explicitly listed in the Preamble; 'Dignity' appears only within the Fraternity clause, not as a standalone listed ideal.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-037",
    "subject": "history",
    "topic": "ancient-indian-scientists",
    "topicLabel": "Ancient Indian Scientists",
    "difficulty": "easy",
    "question": "Aryabhata was renowned for?",
    "options": [
      "Medicine",
      "Astronomy",
      "Philosophy",
      "Biology"
    ],
    "answerIndex": 1,
    "explanation": "Aryabhata was a renowned ancient Indian mathematician and astronomer.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-038",
    "subject": "history",
    "topic": "british-india",
    "topicLabel": "British India",
    "difficulty": "easy",
    "question": "Who was the last Viceroy of British India?",
    "options": [
      "Lord Mountbatten",
      "Lord Curzon",
      "Lord Canning",
      "Lord Irwin"
    ],
    "answerIndex": 0,
    "explanation": "Lord Mountbatten was the last Viceroy of British India, overseeing independence in 1947.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-039",
    "subject": "history",
    "topic": "jallianwala-bagh",
    "topicLabel": "Jallianwala Bagh Massacre",
    "difficulty": "easy",
    "question": "Who gave the order of Jallianwalla Bagh Massacre?",
    "options": [
      "Reginald Dyer",
      "John Saunders",
      "Michael O'Dwyer",
      "James Bouley"
    ],
    "answerIndex": 0,
    "explanation": "General Reginald Dyer ordered the firing at Jallianwala Bagh in 1919.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-040",
    "subject": "geography",
    "topic": "earths-structure",
    "topicLabel": "Earth's Structure",
    "difficulty": "easy",
    "question": "The Tectonic Plates of the Earth lies in?",
    "options": [
      "Inner Core",
      "Outer Core",
      "Lithosphere",
      "Asthenosphere"
    ],
    "answerIndex": 2,
    "explanation": "Tectonic plates are part of the Earth's lithosphere, the rigid outer layer.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-041",
    "subject": "geography",
    "topic": "solar-system",
    "topicLabel": "Solar System",
    "difficulty": "easy",
    "question": "Which of the following planet has No Moon?",
    "options": [
      "Venus",
      "Mars",
      "Jupiter",
      "Uranus"
    ],
    "answerIndex": 0,
    "explanation": "Venus (along with Mercury) has no natural moons, unlike Mars, Jupiter and Uranus.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-042",
    "subject": "geography",
    "topic": "indian-agriculture",
    "topicLabel": "Indian Agriculture",
    "difficulty": "medium",
    "question": "Which is the largest Rice producing state in India?",
    "options": [
      "Haryana",
      "Punjab",
      "Gujarat",
      "West Bengal"
    ],
    "answerIndex": 3,
    "explanation": "West Bengal is traditionally India's largest rice-producing state.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-043",
    "subject": "polity",
    "topic": "union-territories",
    "topicLabel": "Union Territories of India",
    "difficulty": "medium",
    "question": "How many Union Territories are there in India currently?",
    "options": [
      "6",
      "7",
      "8",
      "9"
    ],
    "answerIndex": 2,
    "explanation": "After the merger of Dadra & Nagar Haveli and Daman & Diu in January 2020, India had 8 Union Territories.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-044",
    "subject": "geography",
    "topic": "world-lakes",
    "topicLabel": "World Geography - Lakes",
    "difficulty": "easy",
    "question": "The largest Freshwater lake 'Lake Baikal' is located in?",
    "options": [
      "Canada",
      "Greenland",
      "Russia",
      "Poland"
    ],
    "answerIndex": 2,
    "explanation": "Lake Baikal, the world's deepest and largest freshwater lake by volume, is located in Russia.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-045",
    "subject": "geography",
    "topic": "geography-terminology",
    "topicLabel": "Geography Terminology",
    "difficulty": "easy",
    "question": "The study of Mountains is known as",
    "options": [
      "Orology",
      "Lithology",
      "Acrology",
      "Geology"
    ],
    "answerIndex": 0,
    "explanation": "Orology is the branch of geography dealing with the study of mountains.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-046",
    "subject": "gk",
    "topic": "scientific-discoveries",
    "topicLabel": "Scientific Discoveries",
    "difficulty": "medium",
    "question": "Radioactivity was discovered by",
    "options": [
      "Marie Curie",
      "Henri Becquerel",
      "Max Plank",
      "Rutherford"
    ],
    "answerIndex": 1,
    "explanation": "Henri Becquerel discovered radioactivity in 1896.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-047",
    "subject": "gk",
    "topic": "world-currencies",
    "topicLabel": "World Currencies",
    "difficulty": "easy",
    "question": "What is the currency of United Arab Emirates?",
    "options": [
      "Dinar",
      "Rial",
      "Riyal",
      "Dirham"
    ],
    "answerIndex": 3,
    "explanation": "The currency of the United Arab Emirates is the Dirham.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-048",
    "subject": "gk",
    "topic": "isro-facilities",
    "topicLabel": "ISRO Facilities",
    "difficulty": "medium",
    "question": "The Master Control Facility of ISRO is located in",
    "options": [
      "Andhra Pradesh",
      "Kerela",
      "Karnataka",
      "Tamil Nadu"
    ],
    "answerIndex": 2,
    "explanation": "ISRO's Master Control Facility is located at Hassan, Karnataka.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-049",
    "subject": "gk",
    "topic": "world-monuments",
    "topicLabel": "World Monuments",
    "difficulty": "easy",
    "question": "The statue of Liberty was given to the People of the United States from the People of",
    "options": [
      "United Kingdom",
      "France",
      "Spain",
      "Italy"
    ],
    "answerIndex": 1,
    "explanation": "The Statue of Liberty was a gift from the people of France to the United States.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-050",
    "subject": "gk",
    "topic": "chemistry-basics",
    "topicLabel": "Chemistry Basics",
    "difficulty": "easy",
    "question": "What is the chemical name of Vinegar?",
    "options": [
      "Tartaric Acid",
      "Malic Acid",
      "Citric Acid",
      "Acetic Acid"
    ],
    "answerIndex": 3,
    "explanation": "Vinegar is a dilute solution of acetic acid.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-051",
    "subject": "gk",
    "topic": "human-biology",
    "topicLabel": "Human Biology",
    "difficulty": "medium",
    "question": "Longest Cell in human body is",
    "options": [
      "Nerve Cell",
      "Muscle Cell",
      "Blood Cell",
      "Skin Cell"
    ],
    "answerIndex": 0,
    "explanation": "The nerve cell (neuron) is the longest cell in the human body.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-052",
    "subject": "gk",
    "topic": "disease-terminology",
    "topicLabel": "Disease Terminology",
    "difficulty": "easy",
    "question": "A type of Coronavirus known as MERS is a term for ______ Resiratory Syndrome",
    "options": [
      "Mild Echophraxia",
      "Middle Edema",
      "Middle East",
      "Middle Echophraxia"
    ],
    "answerIndex": 2,
    "explanation": "MERS stands for Middle East Respiratory Syndrome.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-053",
    "subject": "gk",
    "topic": "chemistry-basics",
    "topicLabel": "Chemistry Basics",
    "difficulty": "medium",
    "question": "Aluminium Salt used to Stop Bleeding is",
    "options": [
      "Potash Alum",
      "Aluminium Chloride",
      "Nitrous Alum",
      "Sulphur Alum"
    ],
    "answerIndex": 0,
    "explanation": "Potash alum is commonly used as a styptic to stop bleeding from minor cuts.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-054",
    "subject": "gk",
    "topic": "scientific-discoveries",
    "topicLabel": "Scientific Discoveries",
    "difficulty": "medium",
    "question": "Who among the following discovered Neutron?",
    "options": [
      "Thomson",
      "Rutherford",
      "Chadwick",
      "Bohr"
    ],
    "answerIndex": 2,
    "explanation": "James Chadwick discovered the neutron in 1932.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-055",
    "subject": "gk",
    "topic": "nutrition-and-vitamins",
    "topicLabel": "Nutrition and Vitamins",
    "difficulty": "easy",
    "question": "Which of the following is caused by deficiency of Vitamin A?",
    "options": [
      "Rickets",
      "Beri beri",
      "Scurvy",
      "Night blindness"
    ],
    "answerIndex": 3,
    "explanation": "Vitamin A deficiency causes night blindness.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-056",
    "subject": "reasoning",
    "topic": "time-speed-distance",
    "topicLabel": "Time, Speed and Distance",
    "difficulty": "medium",
    "question": "A train 200 metres long is moving at the rate of 40 kmph. In how many seconds will it cross a man standing near the railway line?",
    "options": [
      "12",
      "15",
      "16",
      "18"
    ],
    "answerIndex": 3,
    "explanation": "Time = Distance/Speed = 200m / (40x1000/3600 m/s) is approximately 18 seconds.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-057",
    "subject": "reasoning",
    "topic": "coding-decoding",
    "topicLabel": "Coding-Decoding",
    "difficulty": "medium",
    "question": "If LYJEO is the code for MIZORAM, the code for SAIHA is",
    "options": [
      "RYFDV",
      "TBJIB",
      "RZHGZ",
      "RBHIB"
    ],
    "answerIndex": 0,
    "explanation": "Each letter is shifted back by an increasing amount (1,2,3,4,5); applying the same pattern to SAIHA gives RYFDV.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-058",
    "subject": "reasoning",
    "topic": "number-puzzles",
    "topicLabel": "Number Puzzles",
    "difficulty": "medium",
    "question": "A number consists of three digits of which the middle one is zero and their sum is 4. If the number formed by interchanging the first and last digits is greater than the number itself by 198, then the difference between the first and last digits is",
    "options": [
      "1",
      "2",
      "3",
      "4"
    ],
    "answerIndex": 1,
    "explanation": "With digits a,0,c where a+c=4, reversing gives 100c+a; solving 100c+a-(100a+c)=198 gives c-a=2.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-059",
    "subject": "reasoning",
    "topic": "cube-painting",
    "topicLabel": "Cube Painting Problems",
    "difficulty": "medium",
    "question": "A solid cube is 3 cm side, painted on all its faces, is cut up into small cubes of 1 cm side. How many of the small cubes will have exactly two painted faces?",
    "options": [
      "12",
      "8",
      "6",
      "4"
    ],
    "answerIndex": 0,
    "explanation": "In a 3x3x3 cube, the 12 edge cubes (excluding corners) each have exactly two painted faces.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-060",
    "subject": "reasoning",
    "topic": "logical-deduction",
    "topicLabel": "Logical Deduction",
    "difficulty": "medium",
    "question": "If Pen < Pencil, Pencil < Book and Book > Cap, then which one of the following is always true?",
    "options": [
      "Pen > Cap",
      "Pen < Book",
      "Pencil = Cap",
      "Pencil > Cap"
    ],
    "answerIndex": 1,
    "explanation": "Since Pen < Pencil < Book, it follows transitively that Pen < Book; the relation between Pen/Pencil and Cap cannot be determined.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-061",
    "subject": "reasoning",
    "topic": "percentage-problems",
    "topicLabel": "Percentage Problems",
    "difficulty": "medium",
    "question": "A student has to get 40% marks to pass in an examination. Suppose he gets 30 marks and fails by 30 marks, then what are the maximum marks in the examination?",
    "options": [
      "100",
      "120",
      "150",
      "300"
    ],
    "answerIndex": 2,
    "explanation": "Passing marks = 30 + 30 = 60, which is 40% of the maximum marks, so maximum marks = 60/0.4 = 150.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-062",
    "subject": "reasoning",
    "topic": "profit-loss",
    "topicLabel": "Profit and Loss",
    "difficulty": "medium",
    "question": "A shopkeeper sells an article at 40 and gets X% profit. However, when he sells it at 20, he faces same percentage of loss. What is the original cost of the article?",
    "options": [
      "10",
      "20",
      "30",
      "40"
    ],
    "answerIndex": 2,
    "explanation": "With cost price C: 40 = C(1+X/100) and 20 = C(1-X/100); adding gives 60 = 2C, so C = 30.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-063",
    "subject": "reasoning",
    "topic": "circle-geometry",
    "topicLabel": "Circle Geometry",
    "difficulty": "hard",
    "question": "There are 24 equally spaced points lying on the circumference of a circle. What is the maximum number of equilateral triangles that can be drawn by taking sets of three points as the vertices?",
    "options": [
      "4",
      "6",
      "8",
      "12"
    ],
    "answerIndex": 2,
    "explanation": "An equilateral triangle needs vertices spaced 120 degrees apart, i.e. 8 points apart on 24 equally spaced points, giving 24/3 = 8 such triangles.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-064",
    "subject": "reasoning",
    "topic": "date-sequence",
    "topicLabel": "Date Sequences",
    "difficulty": "medium",
    "question": "Consider the sequence given below : 4/12/95, 1/1/96, 29/1/96, 26/2/96, .... What is the next term of the series?",
    "options": [
      "24/3/96",
      "25/3/96",
      "26/3/96",
      "27/3/96"
    ],
    "answerIndex": 1,
    "explanation": "Each date is 28 days after the previous one; 28 days after 26/2/96 (a leap year) is 25/3/96.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-065",
    "subject": "reasoning",
    "topic": "calendar-puzzles",
    "topicLabel": "Calendar Puzzles",
    "difficulty": "medium",
    "question": "If day before yesterday was Friday then what will be the third day after the day-after-tomorrow?",
    "options": [
      "Sunday",
      "Saturday",
      "Friday",
      "Thursday"
    ],
    "answerIndex": 2,
    "explanation": "If day before yesterday was Friday, today is Sunday; day after tomorrow is Tuesday; three days after that is Friday.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-066",
    "subject": "reasoning",
    "topic": "clock-problems",
    "topicLabel": "Clock Problems",
    "difficulty": "medium",
    "question": "How many times the hands of a clock coincide?",
    "options": [
      "2",
      "22",
      "1",
      "24"
    ],
    "answerIndex": 1,
    "explanation": "The hands of a clock coincide 22 times in a 24-hour period (11 times every 12 hours).",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-067",
    "subject": "reasoning",
    "topic": "circular-race-problems",
    "topicLabel": "Circular Track Problems",
    "difficulty": "hard",
    "question": "A,B and C started out together at 10km/h, 15km/h and 20km/h respectively from the same point on a circular track of length 1km. At what time do they first meet again?",
    "options": [
      "6 mins",
      "6 hours",
      "12 mins",
      "12 hours"
    ],
    "answerIndex": 2,
    "explanation": "Lap times are 6, 4 and 3 minutes respectively; the LCM of 6, 4 and 3 is 12 minutes.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-068",
    "subject": "gk",
    "topic": "roman-numerals",
    "topicLabel": "Roman Numerals",
    "difficulty": "easy",
    "question": "Consider the Roman numerals with its value: (i) XL = 40 (ii) L = 50 (iii) LX = 60 (iv) XLX = 70. Select the correct answer.",
    "options": [
      "i and ii",
      "i, ii and iii",
      "ii only",
      "i, ii, iii and iv"
    ],
    "answerIndex": 1,
    "explanation": "XL=40, L=50 and LX=60 are all correct; XLX is not a valid Roman numeral, so only statements i, ii and iii are correct.",
    "source": "MPSC (Mizoram)",
    "year": 2020,
    "tags": [],
    "paperId": "mpsc-direct-2020-asst-engineer-civil-general-studies"
  },
  {
    "id": "mpsc-og-3-069",
    "subject": "gk",
    "topic": "jica-projects-mizoram",
    "topicLabel": "JICA Projects in Mizoram",
    "difficulty": "medium",
    "question": "The major health initiative which is being set up in Mizoram with JICA funding is:",
    "options": [
      "Biarabi-Sairang rail link",
      "Tut river hydropower plant",
      "Airport at Lunglei",
      "Super Speciality Cancer & Research Centre"
    ],
    "answerIndex": 3,
    "explanation": "A JICA-funded Super Speciality Cancer & Research Centre is being set up in Mizoram as the major health initiative; the other options are non-health infrastructure projects.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "mizoram"
    ],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-070",
    "subject": "gk",
    "topic": "nirf-rankings",
    "topicLabel": "NIRF Rankings",
    "difficulty": "medium",
    "question": "According to the NIRF 2025 rankings, the top college in India is",
    "options": [
      "Miranda House",
      "Hans Raj",
      "St. Stephen's College",
      "Hindu College"
    ],
    "answerIndex": 0,
    "explanation": "Miranda House, Delhi University, has consistently topped the NIRF college rankings, including 2025.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-071",
    "subject": "current-affairs",
    "topic": "nobel-prizes-2025",
    "topicLabel": "Nobel Prizes 2025",
    "difficulty": "medium",
    "question": "Maria Corina Machado is the winner of Nobel Prize 2025 in the category of",
    "options": [
      "Economics",
      "Medicine",
      "Literature",
      "Peace"
    ],
    "answerIndex": 3,
    "explanation": "Venezuelan opposition leader Maria Corina Machado won the 2025 Nobel Peace Prize.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-072",
    "subject": "current-affairs",
    "topic": "gst-reform-2025",
    "topicLabel": "GST Reform 2025",
    "difficulty": "medium",
    "question": "The new GST rate structure in India after September 2025 is:",
    "options": [
      "5%, 12% and 18%",
      "5%, 18% and 40%",
      "5%, 12% and 40 %",
      "5%, 12%, 18% and 40 %"
    ],
    "answerIndex": 1,
    "explanation": "The GST 2.0 reform effective September 2025 simplified the tax structure to mainly 5% and 18% slabs, with a special 40% rate for luxury/sin goods.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-073",
    "subject": "gk",
    "topic": "market-capitalization",
    "topicLabel": "Corporate India",
    "difficulty": "medium",
    "question": "India's most valuable company by market capitalization as of September 2025 is:",
    "options": [
      "Airtel",
      "HDFC",
      "Reliance Industries",
      "Tata Consultancy Services"
    ],
    "answerIndex": 2,
    "explanation": "Reliance Industries has remained India's most valuable listed company by market capitalization.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-074",
    "subject": "history",
    "topic": "battle-of-plassey",
    "topicLabel": "Battle of Plassey",
    "difficulty": "easy",
    "question": "The Battle of Plassey (1757) marked the beginning of:",
    "options": [
      "Mughal rule in India",
      "Maratha expansion",
      "British political control in India",
      "French supremacy in India"
    ],
    "answerIndex": 2,
    "explanation": "The Battle of Plassey (1757) marked the beginning of British political control in India.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-075",
    "subject": "history",
    "topic": "non-cooperation-movement",
    "topicLabel": "Non-Cooperation Movement",
    "difficulty": "easy",
    "question": "The Non-Cooperation Movement was launched in:",
    "options": [
      "1915",
      "1918",
      "1920",
      "1922"
    ],
    "answerIndex": 2,
    "explanation": "The Non-Cooperation Movement was launched by Gandhi in 1920.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-076",
    "subject": "history",
    "topic": "young-bengal-movement",
    "topicLabel": "Young Bengal Movement",
    "difficulty": "medium",
    "question": "Who among the following was associated with the 'Young Bengal Movement'?",
    "options": [
      "Henry Louis Vivian Derozio",
      "Raja Ram Mohan Roy",
      "Ishwar Chandra Vidyasagar",
      "Keshab Chandra Sen"
    ],
    "answerIndex": 0,
    "explanation": "Henry Louis Vivian Derozio led the radical Young Bengal Movement in the early 19th century.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-077",
    "subject": "history",
    "topic": "poona-pact",
    "topicLabel": "Poona Pact",
    "difficulty": "medium",
    "question": "The Poona Pact (1932) was signed between:",
    "options": [
      "R. Ambedkar and Mahatma Gandhi",
      "Jawaharlal Nehru and Jinnah",
      "Tilak and Annie Besant",
      "Lajpat Rai and Motilal Nehru"
    ],
    "answerIndex": 0,
    "explanation": "The Poona Pact of 1932 was signed between B.R. Ambedkar and Mahatma Gandhi regarding representation of depressed classes.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-078",
    "subject": "history",
    "topic": "servants-of-india-society",
    "topicLabel": "Servants of India Society",
    "difficulty": "medium",
    "question": "Who was the founder of the Servants of India Society?",
    "options": [
      "Gopal Krishna Gokhale",
      "Dadabhai Naoroji",
      "Mahatma Gandhi",
      "Lala Lajpat Rai"
    ],
    "answerIndex": 0,
    "explanation": "Gopal Krishna Gokhale founded the Servants of India Society in 1905.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-079",
    "subject": "geography",
    "topic": "indian-rivers-islands",
    "topicLabel": "Rivers and Islands",
    "difficulty": "easy",
    "question": "The largest river island in the world, Majuli, is located in which river?",
    "options": [
      "Ganga",
      "Yamuna",
      "Brahmaputra",
      "Godavari"
    ],
    "answerIndex": 2,
    "explanation": "Majuli, the world's largest river island, is located in the Brahmaputra river in Assam.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-080",
    "subject": "geography",
    "topic": "world-physical-features",
    "topicLabel": "World Physical Features",
    "difficulty": "easy",
    "question": "The Great Rift Valley is located in:",
    "options": [
      "South America",
      "Eastern Africa",
      "Central Asia",
      "North America"
    ],
    "answerIndex": 1,
    "explanation": "The Great Rift Valley runs through Eastern Africa.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-081",
    "subject": "geography",
    "topic": "indian-forest-cover",
    "topicLabel": "Forest Cover in India",
    "difficulty": "medium",
    "question": "The state with the largest forest cover in India is:",
    "options": [
      "Chhattisgarh",
      "Madhya Pradesh",
      "Arunachal Pradesh",
      "Odisha"
    ],
    "answerIndex": 1,
    "explanation": "Madhya Pradesh has the largest forest cover by area among Indian states, per India State of Forest Reports.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-082",
    "subject": "geography",
    "topic": "solar-system",
    "topicLabel": "Solar System",
    "difficulty": "easy",
    "question": "The planet known as the Red Planet is:",
    "options": [
      "Mars",
      "Jupiter",
      "Venus",
      "Saturn"
    ],
    "answerIndex": 0,
    "explanation": "Mars is known as the Red Planet due to iron oxide on its surface.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-083",
    "subject": "geography",
    "topic": "tropic-of-cancer",
    "topicLabel": "Tropic of Cancer",
    "difficulty": "medium",
    "question": "The Tropic of Cancer passes through which of the following Indian states?",
    "options": [
      "Odisha",
      "Rajasthan",
      "Tamil Nadu",
      "Jammu & Kashmir"
    ],
    "answerIndex": 1,
    "explanation": "The Tropic of Cancer passes through Rajasthan among the given options (also through Gujarat, MP, Chhattisgarh, Jharkhand, West Bengal, Tripura and Mizoram).",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-084",
    "subject": "geography",
    "topic": "rice-exporters",
    "topicLabel": "World Agriculture",
    "difficulty": "medium",
    "question": "The largest exporter of rice in the world is:",
    "options": [
      "India",
      "Indonesia",
      "China",
      "Bangladesh"
    ],
    "answerIndex": 0,
    "explanation": "India has been the world's largest exporter of rice in recent years.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-085",
    "subject": "polity",
    "topic": "census-constitutional-basis",
    "topicLabel": "Census in India",
    "difficulty": "hard",
    "question": "Which article of the Indian Constitution mandates a census?",
    "options": [
      "Article 246",
      "Article 224",
      "Article 380",
      "Article 324"
    ],
    "answerIndex": 0,
    "explanation": "Census falls under the Union List (Entry 69), governed via Article 246 which distributes legislative powers between Centre and States.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-086",
    "subject": "polity",
    "topic": "attorney-general",
    "topicLabel": "Attorney General of India",
    "difficulty": "easy",
    "question": "The first law officer of the Government of India is:",
    "options": [
      "Solicitor General",
      "Law Minister",
      "Chief Justice of India",
      "Attorney General of India"
    ],
    "answerIndex": 3,
    "explanation": "The Attorney General of India is the government's chief legal advisor and its first law officer.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-087",
    "subject": "polity",
    "topic": "fundamental-rights",
    "topicLabel": "Fundamental Rights",
    "difficulty": "medium",
    "question": "Which Fundamental Right prohibits human trafficking and forced labour?",
    "options": [
      "Article 19",
      "Article 23",
      "Article 24",
      "Article 21"
    ],
    "answerIndex": 1,
    "explanation": "Article 23 prohibits traffic in human beings and forced labour.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "fundamental-rights"
    ],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-088",
    "subject": "polity",
    "topic": "joint-sitting-parliament",
    "topicLabel": "Joint Sitting of Parliament",
    "difficulty": "medium",
    "question": "Who presides over the joint sitting of both Houses of Parliament?",
    "options": [
      "Speaker of Rajya Sabha",
      "Speaker of Lok Sabha",
      "Vice President",
      "Prime Minister"
    ],
    "answerIndex": 1,
    "explanation": "The Speaker of the Lok Sabha presides over a joint sitting of both Houses of Parliament.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-089",
    "subject": "polity",
    "topic": "right-to-property",
    "topicLabel": "Right to Property",
    "difficulty": "medium",
    "question": "The Right to Property is now a:",
    "options": [
      "Fundamental Right",
      "Legal Right",
      "Natural Right",
      "Moral Right"
    ],
    "answerIndex": 1,
    "explanation": "The 44th Constitutional Amendment (1978) removed the Right to Property from Fundamental Rights, making it a legal right under Article 300A.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-090",
    "subject": "polity",
    "topic": "constitutional-amendments",
    "topicLabel": "74th Constitutional Amendment",
    "difficulty": "medium",
    "question": "The 74th Constitutional Amendment deals with:",
    "options": [
      "Panchayati Raj",
      "Urban Local Bodies (Municipalities)",
      "Cooperative Societies",
      "Fundamental Duties"
    ],
    "answerIndex": 1,
    "explanation": "The 74th Amendment (1992) deals with urban local bodies/municipalities.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-091",
    "subject": "gk",
    "topic": "hdi-concept",
    "topicLabel": "Human Development Index",
    "difficulty": "medium",
    "question": "The Human Development Index (HDI) was developed by:",
    "options": [
      "Mahbub ul Haq",
      "Prof. Amartya Sen",
      "Gunnar Myrdal",
      "Paul Krugman"
    ],
    "answerIndex": 0,
    "explanation": "The HDI was developed by Pakistani economist Mahbub ul Haq, with contributions from Amartya Sen.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-092",
    "subject": "gk",
    "topic": "economic-concepts",
    "topicLabel": "Economic Concepts",
    "difficulty": "medium",
    "question": "The concept of 'Invisible Hand' was introduced by:",
    "options": [
      "Karl Marx",
      "John Maynard Keynes",
      "Adam Smith",
      "David Ricardo"
    ],
    "answerIndex": 2,
    "explanation": "Adam Smith introduced the concept of the 'Invisible Hand' in his work on free markets.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-093",
    "subject": "gk",
    "topic": "demographic-dividend",
    "topicLabel": "Demographic Dividend",
    "difficulty": "easy",
    "question": "The Demographic Dividend refers to:",
    "options": [
      "Population decline",
      "Growth due to a higher proportion of working-age population",
      "Aging population",
      "Migration benefits"
    ],
    "answerIndex": 1,
    "explanation": "Demographic dividend refers to economic growth potential arising from a higher proportion of working-age population.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-094",
    "subject": "gk",
    "topic": "blue-economy",
    "topicLabel": "Blue Economy",
    "difficulty": "easy",
    "question": "The Blue Economy focuses on:",
    "options": [
      "Oil exploration",
      "Increase in fruit production",
      "Water transport",
      "Sustainable use of ocean resources"
    ],
    "answerIndex": 3,
    "explanation": "Blue Economy refers to the sustainable use of ocean resources for economic growth.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-095",
    "subject": "gk",
    "topic": "government-schemes",
    "topicLabel": "Government Schemes",
    "difficulty": "easy",
    "question": "The Saubhagya Scheme relates to:",
    "options": [
      "Drinking water supply",
      "Education",
      "Housing",
      "Rural electrification"
    ],
    "answerIndex": 3,
    "explanation": "The Saubhagya Scheme (Pradhan Mantri Sahaj Bijli Har Ghar Yojana) aims at rural electrification and household connections.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-096",
    "subject": "gk",
    "topic": "economic-concepts",
    "topicLabel": "Economic Concepts",
    "difficulty": "medium",
    "question": "The concept of 'trickle-down effect' in economic development refers to:",
    "options": [
      "Redistribution of income through taxation",
      "Growth of informal sector",
      "Benefits of economic growth gradually reaching the poor",
      "Government subsidies to small enterprises"
    ],
    "answerIndex": 2,
    "explanation": "Trickle-down effect refers to the idea that benefits of economic growth eventually reach the poorer sections of society.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-097",
    "subject": "gk",
    "topic": "biodiversity-hotspot",
    "topicLabel": "Biodiversity Hotspots",
    "difficulty": "medium",
    "question": "The term Biodiversity Hotspot was coined by:",
    "options": [
      "Norman Myers",
      "E.O. Wilson",
      "Charles Darwin",
      "Aldo Leopold"
    ],
    "answerIndex": 0,
    "explanation": "Norman Myers coined the term 'Biodiversity Hotspot' in 1988.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-098",
    "subject": "gk",
    "topic": "un-organizations-hq",
    "topicLabel": "UN Organizations",
    "difficulty": "medium",
    "question": "The headquarters of the United Nations Environment Programme (UNEP) is located in:",
    "options": [
      "New York",
      "Paris",
      "Geneva",
      "Nairobi"
    ],
    "answerIndex": 3,
    "explanation": "UNEP's headquarters is located in Nairobi, Kenya.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-099",
    "subject": "gk",
    "topic": "world-observance-days",
    "topicLabel": "World Observance Days",
    "difficulty": "easy",
    "question": "When do we celebrate World Environment Day?",
    "options": [
      "April 5",
      "May 5",
      "June 5",
      "November 4"
    ],
    "answerIndex": 2,
    "explanation": "World Environment Day is observed on 5 June every year.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-100",
    "subject": "gk",
    "topic": "endangered-species",
    "topicLabel": "Endangered Species",
    "difficulty": "medium",
    "question": "Which of the following is an endangered species in India?",
    "options": [
      "Cow",
      "Camel",
      "Snow Leopard",
      "Deer"
    ],
    "answerIndex": 2,
    "explanation": "The Snow Leopard is a vulnerable/endangered species found in the Himalayan region of India.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-101",
    "subject": "geography",
    "topic": "biodiversity-regions",
    "topicLabel": "Biodiversity Regions",
    "difficulty": "easy",
    "question": "Which of the following regions has the highest biodiversity?",
    "options": [
      "Desert",
      "Tropical Rainforest",
      "Tundra",
      "Grassland"
    ],
    "answerIndex": 1,
    "explanation": "Tropical rainforests hold the highest biodiversity among Earth's biomes.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-102",
    "subject": "gk",
    "topic": "earth-hour",
    "topicLabel": "Earth Hour",
    "difficulty": "easy",
    "question": "Earth Hour is observed to:",
    "options": [
      "Celebrate Earth Day",
      "Reduce carbon tax",
      "Plant trees",
      "Encourage energy conservation"
    ],
    "answerIndex": 3,
    "explanation": "Earth Hour, organized by WWF, encourages energy conservation and climate awareness.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-103",
    "subject": "gk",
    "topic": "photosynthesis",
    "topicLabel": "Photosynthesis",
    "difficulty": "easy",
    "question": "The gas used by plants during photosynthesis is:",
    "options": [
      "Oxygen",
      "Nitrogen",
      "Carbon dioxide",
      "Hydrogen"
    ],
    "answerIndex": 2,
    "explanation": "Plants use carbon dioxide during photosynthesis to produce glucose and oxygen.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-104",
    "subject": "gk",
    "topic": "natural-gas-composition",
    "topicLabel": "Natural Gas",
    "difficulty": "easy",
    "question": "The main constituent of natural gas is:",
    "options": [
      "Ethane",
      "Propane",
      "Methane",
      "Butane"
    ],
    "answerIndex": 2,
    "explanation": "Methane is the main constituent of natural gas.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-105",
    "subject": "gk",
    "topic": "physics-constants",
    "topicLabel": "Physics Constants",
    "difficulty": "easy",
    "question": "The speed of light is approximately:",
    "options": [
      "3,000 km/s",
      "3 x 10^8 m/s",
      "3 x 10^6 m/s",
      "3 x 10^5 m/s"
    ],
    "answerIndex": 1,
    "explanation": "The speed of light in vacuum is approximately 3 x 10^8 m/s.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-106",
    "subject": "gk",
    "topic": "human-biology",
    "topicLabel": "Human Biology",
    "difficulty": "easy",
    "question": "Which blood cells help in clotting?",
    "options": [
      "RBCs",
      "WBCs",
      "Platelets",
      "Plasma"
    ],
    "answerIndex": 2,
    "explanation": "Platelets (thrombocytes) help in blood clotting.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-107",
    "subject": "gk",
    "topic": "physics-optics",
    "topicLabel": "Optics",
    "difficulty": "easy",
    "question": "The phenomenon of splitting white light into seven colors is called:",
    "options": [
      "Reflection",
      "Refraction",
      "Dispersion",
      "Diffraction"
    ],
    "answerIndex": 2,
    "explanation": "Dispersion is the splitting of white light into its seven constituent colours.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-108",
    "subject": "gk",
    "topic": "human-biology",
    "topicLabel": "Human Biology",
    "difficulty": "easy",
    "question": "The main function of red blood cells is:",
    "options": [
      "Transport oxygen",
      "Fight infection",
      "Produce hormones",
      "Clot blood"
    ],
    "answerIndex": 0,
    "explanation": "Red blood cells (RBCs) primarily transport oxygen throughout the body.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-109",
    "subject": "gk",
    "topic": "mizo-culture-dance",
    "topicLabel": "Mizo Dance Forms",
    "difficulty": "medium",
    "question": "The 'Chheihlam' dance is usually performed:",
    "options": [
      "Before harvest",
      "After drinking rice beer in celebration",
      "During marriage",
      "During mourning"
    ],
    "answerIndex": 1,
    "explanation": "Chheihlam is a celebratory Mizo dance typically performed after drinking rice beer (zu) during festive occasions.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "mizoram"
    ],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-110",
    "subject": "gk",
    "topic": "mizo-culture-dance",
    "topicLabel": "Mizo Dance Forms",
    "difficulty": "medium",
    "question": "Which among these dances is a welcome dance in Mizo culture?",
    "options": [
      "Cheraw",
      "Chheihlam",
      "Khuallam",
      "Rallu Lam"
    ],
    "answerIndex": 2,
    "explanation": "Khuallam, literally 'guest dance', is traditionally performed to welcome guests in Mizo culture.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "mizoram"
    ],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-111",
    "subject": "polity",
    "topic": "uniform-civil-code",
    "topicLabel": "Uniform Civil Code",
    "difficulty": "medium",
    "question": "Which state has become the first state in India to implement the Uniform Civil Code?",
    "options": [
      "Himachal Pradesh",
      "Uttarakhand",
      "Uttar Pradesh",
      "Maharashtra"
    ],
    "answerIndex": 1,
    "explanation": "Uttarakhand became the first Indian state to implement the Uniform Civil Code.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-112",
    "subject": "polity",
    "topic": "cyber-crime-bodies",
    "topicLabel": "Cyber Security Bodies",
    "difficulty": "medium",
    "question": "Indian Cyber Crime Coordination Centre (I4C) has been established under which Ministry?",
    "options": [
      "Ministry of Home Affairs",
      "Ministry of Defence",
      "Ministry of Science and Technology",
      "Ministry of Electronics and Information Technology"
    ],
    "answerIndex": 0,
    "explanation": "I4C was set up under the Ministry of Home Affairs to tackle cybercrime.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-113",
    "subject": "gk",
    "topic": "cryptocurrency",
    "topicLabel": "Cryptocurrency",
    "difficulty": "medium",
    "question": "Which of the following is not a cryptocurrency?",
    "options": [
      "Ethereum",
      "Bitcoin",
      "Tether",
      "Drachma"
    ],
    "answerIndex": 3,
    "explanation": "Drachma was the historical currency of Greece, not a cryptocurrency, unlike Ethereum, Bitcoin and Tether.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-114",
    "subject": "current-affairs",
    "topic": "iran-us-conflict-2025",
    "topicLabel": "International Affairs 2025",
    "difficulty": "medium",
    "question": "What is the name of the U.S. military operation that targeted Iran's underground nuclear facilities?",
    "options": [
      "Operation Iron Shield",
      "Operation Desert Thunder",
      "Operation Midnight Hammer",
      "Operation Silent Storm"
    ],
    "answerIndex": 2,
    "explanation": "'Operation Midnight Hammer' was the codename for the June 2025 US strikes on Iran's nuclear facilities.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-115",
    "subject": "gk",
    "topic": "un-organizations-hq",
    "topicLabel": "UN Organizations",
    "difficulty": "medium",
    "question": "Where is the headquarters of United Nations Office on Drugs and Crime (UNODC) located?",
    "options": [
      "Geneva, Switzerland",
      "New York, USA",
      "Paris, France",
      "Vienna, Austria"
    ],
    "answerIndex": 3,
    "explanation": "UNODC's headquarters is located in Vienna, Austria.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-116",
    "subject": "current-affairs",
    "topic": "social-media-regulation",
    "topicLabel": "Social Media Regulation",
    "difficulty": "medium",
    "question": "Which country recently passed the 'Online Safety Amendment (Social Media Minimum Age) Bill 2024'?",
    "options": [
      "Australia",
      "India",
      "France",
      "Bangladesh"
    ],
    "answerIndex": 0,
    "explanation": "Australia passed a law setting a minimum age (16) for social media use in 2024.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-117",
    "subject": "geography",
    "topic": "kaladan-project",
    "topicLabel": "Kaladan Multi Modal Project",
    "difficulty": "medium",
    "question": "The Sittwe port being developed as a part of the Kaladan Multi Modal Project is located in which state/region of Myanmar?",
    "options": [
      "Chin",
      "Rakhine",
      "Bago",
      "Ayeyarwady"
    ],
    "answerIndex": 1,
    "explanation": "Sittwe port, part of the Kaladan Multi-Modal Transit Transport Project, is located in Rakhine State, Myanmar.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-118",
    "subject": "polity",
    "topic": "rajya-sabha-quorum",
    "topicLabel": "Rajya Sabha Procedures",
    "difficulty": "medium",
    "question": "How many members must be present (including the presiding officer) in the Rajya Sabha in order to fulfil the quorum?",
    "options": [
      "25",
      "50",
      "55",
      "75"
    ],
    "answerIndex": 0,
    "explanation": "The quorum for Rajya Sabha is one-tenth of its total membership, which works out to about 25 members.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-119",
    "subject": "polity",
    "topic": "constitutional-amendments",
    "topicLabel": "Right to Education Amendment",
    "difficulty": "medium",
    "question": "Which Constitutional Amendment introduced compulsory education to children between the age group of 6 to 14?",
    "options": [
      "82nd",
      "83rd",
      "85th",
      "86th"
    ],
    "answerIndex": 3,
    "explanation": "The 86th Constitutional Amendment (2002) inserted Article 21A, making education a fundamental right for children aged 6-14.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-120",
    "subject": "polity",
    "topic": "preamble",
    "topicLabel": "The Preamble",
    "difficulty": "medium",
    "question": "The correct nomenclature of India according to the Preamble is:",
    "options": [
      "Sovereign, Secular, Democratic Republic",
      "Sovereign, Democratic Republic",
      "Sovereign, Socialist, Secular, Democratic Republic",
      "Sovereign, Secular, Socialist Democracy"
    ],
    "answerIndex": 2,
    "explanation": "The Preamble describes India as a Sovereign, Socialist, Secular, Democratic Republic.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-121",
    "subject": "polity",
    "topic": "fundamental-rights-vs-dpsp",
    "topicLabel": "Fundamental Rights vs DPSP",
    "difficulty": "hard",
    "question": "Which of the following statement is/are not indicative of the difference between Fundamental Rights and Directive Principles? I. Directive Principles are aimed at promoting social welfare, while Fundamental Rights are for protecting individuals from State encroachment. II. Fundamental Rights are limitations on State action, while Directive Principles are positive instructions for the Government to work towards a just socioeconomic order. III. Fundamental Rights were included in the original Constitution, but Directive Principles were added by the first Amendment. IV. Fundamental Rights are amendable, but Directive Principles cannot be amended.",
    "options": [
      "I and II",
      "II and III",
      "III and IV",
      "I, II and III"
    ],
    "answerIndex": 2,
    "explanation": "Statements III and IV are factually incorrect: Directive Principles were part of the original 1950 Constitution (not added by the first Amendment), and both Fundamental Rights and Directive Principles can be amended.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "directive-principles"
    ],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-122",
    "subject": "polity",
    "topic": "presidents-rule",
    "topicLabel": "President's Rule Powers",
    "difficulty": "hard",
    "question": "During a proclamation of emergency due to the breakdown of constitutional machinery in a State the President can: I. assume all powers vested in and exercisable by the Governor II. declare that the powers of the State Legislature shall be exercised by Parliament III. assume certain powers of the High Courts IV. suspend by order any or all Fundamental Rights except those under Articles 20 and 21",
    "options": [
      "I and II",
      "I and III",
      "II, III and IV",
      "II and IV"
    ],
    "answerIndex": 0,
    "explanation": "Under Article 356 (President's Rule), the President assumes the Governor's powers and Parliament exercises the State Legislature's powers; High Court powers are not affected, and Fundamental Rights suspension relates to Article 359 during a national emergency, not President's Rule.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-123",
    "subject": "geography",
    "topic": "ne-india-geology",
    "topicLabel": "Geology of North East India",
    "difficulty": "hard",
    "question": "Which state of North East India has a geological era named after it by the International Commission on Stratigraphy?",
    "options": [
      "Sikkim",
      "Arunachal Pradesh",
      "Meghalaya",
      "Assam"
    ],
    "answerIndex": 2,
    "explanation": "The 'Meghalayan Age', part of the Holocene epoch, is named after Meghalaya by the International Commission on Stratigraphy.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-124",
    "subject": "geography",
    "topic": "indian-agriculture",
    "topicLabel": "Indian Agriculture",
    "difficulty": "medium",
    "question": "The lower Gangetic plain is characterized by humid climate with high temperature throughout the year. Which one among the following pairs of crops is most suitable for this region?",
    "options": [
      "Paddy and cotton",
      "Wheat and Jute",
      "Paddy and Jute",
      "Wheat and cotton"
    ],
    "answerIndex": 2,
    "explanation": "The lower Gangetic plain (West Bengal region), with its humid climate, is best suited for paddy and jute cultivation.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-125",
    "subject": "gk",
    "topic": "palm-oil-facts",
    "topicLabel": "Palm Oil",
    "difficulty": "hard",
    "question": "With reference to 'palm oil', consider the following statements: I. The palm oil tree is native to Southeast Asia. II. The palm oil is a raw material for some industries producing lipstick and perfumes. III. The palm oil can be used to produce biodiesel. Which of the statements given above are correct?",
    "options": [
      "I and II only",
      "II and III only",
      "I and III only",
      "I, II and III"
    ],
    "answerIndex": 1,
    "explanation": "The oil palm tree is native to West Africa, not Southeast Asia, making statement I incorrect; statements II and III (used in cosmetics and biodiesel) are correct.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-126",
    "subject": "geography",
    "topic": "indian-ports",
    "topicLabel": "Indian Ports",
    "difficulty": "medium",
    "question": "Which of the following ports is located on the eastern coast of India?",
    "options": [
      "Kandla",
      "Kochi",
      "Mormugoa",
      "Paradeep"
    ],
    "answerIndex": 3,
    "explanation": "Paradeep (Odisha) is on India's eastern coast; Kandla, Kochi and Mormugoa are on the western coast.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-127",
    "subject": "geography",
    "topic": "geography-terminology",
    "topicLabel": "Geography Terminology",
    "difficulty": "easy",
    "question": "A narrow strip of land that connects two larger land masses is called:",
    "options": [
      "Strait",
      "Cape",
      "Peninsula",
      "Isthumus"
    ],
    "answerIndex": 3,
    "explanation": "An isthmus is a narrow strip of land connecting two larger landmasses.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-128",
    "subject": "gk",
    "topic": "niti-aayog-objectives",
    "topicLabel": "NITI Aayog",
    "difficulty": "easy",
    "question": "The major objectives of NITI Aayog are to",
    "options": [
      "provide technical advice to the Centre and State",
      "design strategic and long-term policies/ programmes for Govt.",
      "Both (a) & (b)",
      "None"
    ],
    "answerIndex": 2,
    "explanation": "NITI Aayog's objectives include both providing technical/policy advice and designing strategic long-term programmes for the government.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-129",
    "subject": "gk",
    "topic": "disguised-unemployment",
    "topicLabel": "Disguised Unemployment",
    "difficulty": "medium",
    "question": "Where will you find the most disguised unemployment? Select the correct option from those given below:",
    "options": [
      "In most of the government offices.",
      "In big private companies.",
      "Among agricultural workers working for small farmlands.",
      "Among part-time industrial workers."
    ],
    "answerIndex": 2,
    "explanation": "Disguised unemployment is most prevalent among agricultural workers on small farmlands, where more people work than needed.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-130",
    "subject": "gk",
    "topic": "mnrega-theory",
    "topicLabel": "MGNREGA",
    "difficulty": "hard",
    "question": "Which of the following best explains the theoretical foundation of the design of the Mahatma Gandhi Rural Employment Guarantee Act (MNREGA)?",
    "options": [
      "Supply-side skilling and productivity targeting",
      "Structural adjustment for agriculture surplus",
      "Keynesian demand-side rural stimulus model",
      "Monetarist principle of wage flexibility"
    ],
    "answerIndex": 2,
    "explanation": "MGNREGA is grounded in a Keynesian demand-side stimulus model, generating rural employment and demand during lean periods.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-131",
    "subject": "gk",
    "topic": "poverty-measurement",
    "topicLabel": "Poverty Measurement",
    "difficulty": "easy",
    "question": "Which of the following measures is commonly used to measure poverty levels?",
    "options": [
      "Gross Domestic Product",
      "Consumer Price Index",
      "Poverty Line",
      "None of the above"
    ],
    "answerIndex": 2,
    "explanation": "The Poverty Line is the standard measure used to assess poverty levels in a population.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-132",
    "subject": "gk",
    "topic": "rtgs-neft",
    "topicLabel": "RTGS and NEFT",
    "difficulty": "hard",
    "question": "Consider the following statements in respect of RTGS and NEFT: I. In RTGS, the settlement time is instantaneous while in case of NEFT, it takes some time to settle payments. II. In RTGS, the customer is charged for inward transactions while that is not the case for NEFT. III. Operating hours for RTGS are restricted on certain days while this is not true for NEFT. Which of the statements given above is/are correct?",
    "options": [
      "I only",
      "I and II",
      "I and III",
      "III only"
    ],
    "answerIndex": 0,
    "explanation": "RTGS settles transactions instantaneously while NEFT settles in batches, making statement I correct; RTGS and NEFT are both now free of inward-transaction charges and both operate 24x7, so statements II and III do not hold currently.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-133",
    "subject": "gk",
    "topic": "microplastics-facts",
    "topicLabel": "Microplastics",
    "difficulty": "medium",
    "question": "Consider the following statements about microplastics. I. Microplastics are small pieces of plastic, less than 50 mm in length, that occur in the environment as a consequence of plastic pollution. II. Microplastics are present in cosmetics, synthetic clothing, plastic bags and plastic bottles. III. Normal plastics are microplastics are biodegradable. Which of the above statements is/are correct?",
    "options": [
      "I and II",
      "I only",
      "II only",
      "I, II and III"
    ],
    "answerIndex": 2,
    "explanation": "Microplastics are actually defined as pieces smaller than 5 mm (not 50 mm), making statement I incorrect; plastics are generally non-biodegradable, making statement III incorrect; only statement II (sources of microplastics) is correct.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-134",
    "subject": "gk",
    "topic": "water-table",
    "topicLabel": "Water Table",
    "difficulty": "easy",
    "question": "Which activity can tend to lower the water table?",
    "options": [
      "Overgrazing",
      "Human population growth",
      "Soil erosion",
      "Over extraction of groundwater"
    ],
    "answerIndex": 3,
    "explanation": "Over-extraction of groundwater directly lowers the water table.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-135",
    "subject": "gk",
    "topic": "greenhouse-effect",
    "topicLabel": "Greenhouse Effect",
    "difficulty": "medium",
    "question": "Which of following radiations of the sun do greenhouse gases trap?",
    "options": [
      "Ultraviolet radiation",
      "Visible radiation",
      "Infrared radiation",
      "All the above"
    ],
    "answerIndex": 2,
    "explanation": "Greenhouse gases trap infrared (heat) radiation re-emitted from the Earth's surface.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-136",
    "subject": "gk",
    "topic": "enso-el-nino",
    "topicLabel": "El Nino and La Nina",
    "difficulty": "medium",
    "question": "Consider the following statement(s) related to the similarity of El Nino and La Nina. I. They are part of a larger cycle called ENSO or El Nino Southern Oscillation II. They are known to alter climate across more than half the planet and dramatically affect weather patterns. Select the correct answer:",
    "options": [
      "I only",
      "II only",
      "Both I and II",
      "Neither I nor II"
    ],
    "answerIndex": 2,
    "explanation": "Both El Nino and La Nina are phases of the ENSO cycle and both significantly alter global weather patterns, making both statements correct.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-137",
    "subject": "gk",
    "topic": "food-adulteration",
    "topicLabel": "Food Adulteration",
    "difficulty": "medium",
    "question": "Which of the following chemical is illegally used to preserve the shelf life of fish?",
    "options": [
      "Acetaldehyde",
      "Formaldehyde",
      "Ethanol",
      "Acetic acid"
    ],
    "answerIndex": 1,
    "explanation": "Formaldehyde is illegally used by some traders to preserve fish and extend its shelf life.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-138",
    "subject": "gk",
    "topic": "laws-of-motion",
    "topicLabel": "Laws of Motion",
    "difficulty": "easy",
    "question": "A passenger in a moving bus is thrown forward when the bus suddenly stops. This is explained by:",
    "options": [
      "Newton's First Law",
      "Newton's Second Law",
      "Newton's Third Law",
      "Principle of Conservation of Momentum"
    ],
    "answerIndex": 0,
    "explanation": "This is explained by Newton's First Law (inertia): the body continues in motion even when the bus stops.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-139",
    "subject": "gk",
    "topic": "chemistry-basics",
    "topicLabel": "Chemistry Basics",
    "difficulty": "easy",
    "question": "The acid used in lead storage cells is:",
    "options": [
      "Hydrochloric acid",
      "Nitric acid",
      "Phosphoric acid",
      "Sulphuric acid"
    ],
    "answerIndex": 3,
    "explanation": "Sulphuric acid is used as the electrolyte in lead-acid storage cells/batteries.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-140",
    "subject": "gk",
    "topic": "carbon-allotropes",
    "topicLabel": "Carbon Allotropes",
    "difficulty": "medium",
    "question": "Non-metals are generally bad conductors of electricity. However, graphite is a good conductor of electricity because it:",
    "options": [
      "forms basic oxide",
      "is an allotrope of carbon",
      "is brittle",
      "has free electrons"
    ],
    "answerIndex": 3,
    "explanation": "Graphite conducts electricity because it has delocalized (free) electrons that can move within its layered structure.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-141",
    "subject": "gk",
    "topic": "human-biology",
    "topicLabel": "Human Biology",
    "difficulty": "easy",
    "question": "The tiny air sacs present in the human lungs are called:",
    "options": [
      "Alveoli",
      "Bronchus",
      "Bronchioles",
      "Nephrons"
    ],
    "answerIndex": 0,
    "explanation": "Alveoli are the tiny air sacs in the lungs where gas exchange occurs.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-142",
    "subject": "history",
    "topic": "colonial-administration",
    "topicLabel": "Lushai Hills Administration",
    "difficulty": "hard",
    "question": "In which year was the North Lushai Hills and South Lushai Hills amalgamated to form the Lushai Hills District?",
    "options": [
      "1892",
      "1895",
      "1897",
      "1898"
    ],
    "answerIndex": 3,
    "explanation": "The North Lushai Hills and South Lushai Hills were amalgamated into the single Lushai Hills District in 1898.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "mizoram"
    ],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-143",
    "subject": "history",
    "topic": "mizo-ethnography",
    "topicLabel": "Mizo Ethnographic Literature",
    "difficulty": "medium",
    "question": "One of the earliest books on Mizo customs and ceremonies 'A Monograph on Lushai Customs and Ceremonies' was written by:",
    "options": [
      "J. Shakespeare",
      "T. H. Lewin",
      "N. E. Parry",
      "A. G. McCall"
    ],
    "answerIndex": 2,
    "explanation": "N.E. Parry, a British administrator, authored 'A Monograph on Lushai Customs and Ceremonies' (1928).",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "mizoram"
    ],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-144",
    "subject": "history",
    "topic": "gandhi-institutions",
    "topicLabel": "Institutions founded by Gandhi",
    "difficulty": "medium",
    "question": "Which of the following institutions was not founded by Gandhiji?",
    "options": [
      "Sabarmati Ashram",
      "Sevagram Asharam",
      "Phoenix Ashram",
      "Vishwa Bharati"
    ],
    "answerIndex": 3,
    "explanation": "Vishwa Bharati was founded by Rabindranath Tagore, not Gandhi, who founded Sabarmati, Sevagram and Phoenix Ashrams.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-145",
    "subject": "history",
    "topic": "freedom-struggle-chronology",
    "topicLabel": "Freedom Struggle Chronology",
    "difficulty": "medium",
    "question": "Consider the following events of the Freedom Struggle : 1. Chauri Chaura Outrage 2. Morley Minto Reforms 3. Dandi March 4. Montague Chelmsford Reforms. Which one of the following is the correct chronological order of the events given above?",
    "options": [
      "1-3-2-4",
      "2-4-1-3",
      "1-4-2-3",
      "2-3-1-4"
    ],
    "answerIndex": 1,
    "explanation": "Correct order: Morley-Minto Reforms (1909), Montague-Chelmsford Reforms (1919), Chauri Chaura Outrage (1922), Dandi March (1930).",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-146",
    "subject": "history",
    "topic": "partition-of-bengal",
    "topicLabel": "Partition of Bengal",
    "difficulty": "easy",
    "question": "In which year was Bengal partitioned?",
    "options": [
      "1904",
      "1906",
      "1905",
      "1907"
    ],
    "answerIndex": 2,
    "explanation": "Bengal was partitioned by Lord Curzon in 1905.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-147",
    "subject": "history",
    "topic": "government-of-india-act-1858",
    "topicLabel": "Government of India Act 1858",
    "difficulty": "medium",
    "question": "By the Act of 1858, India was to be governed under whom?",
    "options": [
      "By the Company",
      "In the name of the Crown",
      "By a Board of Directors",
      "In the name of Governor-General of India"
    ],
    "answerIndex": 1,
    "explanation": "The Government of India Act 1858 transferred control from the East India Company to the British Crown.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-148",
    "subject": "history",
    "topic": "ancient-india-foreign-travellers",
    "topicLabel": "Foreign Travellers to Ancient India",
    "difficulty": "easy",
    "question": "The Chinese traveller Hiuen Tsang came to India during the reign of which king?",
    "options": [
      "Harshavardhana",
      "Chandragupta Maurya",
      "Samudragupta",
      "Kaniskha"
    ],
    "answerIndex": 0,
    "explanation": "Hiuen Tsang (Xuanzang) visited India during the reign of Harshavardhana in the 7th century CE.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-149",
    "subject": "history",
    "topic": "delhi-sultanate",
    "topicLabel": "Delhi Sultanate",
    "difficulty": "easy",
    "question": "The first woman to sit on the throne of Delhi Razia Sultan was the daughter of:",
    "options": [
      "Illtutmish",
      "Qutbuddin Aibak",
      "Mohammad Ghori",
      "Aram Shah"
    ],
    "answerIndex": 0,
    "explanation": "Razia Sultan was the daughter of Iltutmish, ruler of the Delhi Sultanate.",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [],
    "paperId": "mpsc-direct-2025-cdpo-general-studies"
  },
  {
    "id": "mpsc-og-3-150",
    "subject": "english",
    "topic": "tenses",
    "topicLabel": "Verb Tenses",
    "difficulty": "easy",
    "question": "The school shall remain close tomorrow",
    "options": [
      "Present indefinite tense",
      "Future indefinite tense",
      "Future perfect tense",
      "Present perfect tense"
    ],
    "answerIndex": 1,
    "explanation": "'Shall remain' refers to a future action, making this the Future Indefinite Tense.",
    "source": "MPSC (Mizoram)",
    "year": 2022,
    "tags": [],
    "paperId": "mpsc-direct-2022-jr-grade-mes-electrical-wing-general-english"
  },
  {
    "id": "mpsc-og-3-151",
    "subject": "english",
    "topic": "tenses",
    "topicLabel": "Verb Tenses",
    "difficulty": "easy",
    "question": "It is raining cats and dogs outside.",
    "options": [
      "Past continuous tense",
      "Past perfect continuous tense",
      "Present continuous tense",
      "Present perfect continuous tense"
    ],
    "answerIndex": 2,
    "explanation": "'Is raining' is the present continuous tense, describing an action happening now.",
    "source": "MPSC (Mizoram)",
    "year": 2022,
    "tags": [],
    "paperId": "mpsc-direct-2022-jr-grade-mes-electrical-wing-general-english"
  },
  {
    "id": "mpsc-og-3-152",
    "subject": "english",
    "topic": "tenses",
    "topicLabel": "Verb Tenses",
    "difficulty": "easy",
    "question": "Rama has stood first in the test.",
    "options": [
      "Present perfect continuous tense",
      "Present perfect tense",
      "Past perfect tense",
      "Past indefinite tense"
    ],
    "answerIndex": 1,
    "explanation": "'Has stood' (has + past participle) is the Present Perfect Tense.",
    "source": "MPSC (Mizoram)",
    "year": 2022,
    "tags": [],
    "paperId": "mpsc-direct-2022-jr-grade-mes-electrical-wing-general-english"
  },
  {
    "id": "mpsc-og-3-153",
    "subject": "english",
    "topic": "tenses",
    "topicLabel": "Verb Tenses",
    "difficulty": "easy",
    "question": "She will have finished her home-work by 4pm.",
    "options": [
      "Future perfect tense",
      "Future perfect continuous tense",
      "Future indefinite tense",
      "Past perfect tense"
    ],
    "answerIndex": 0,
    "explanation": "'Will have finished' is the Future Perfect Tense, indicating completion before a future point.",
    "source": "MPSC (Mizoram)",
    "year": 2022,
    "tags": [],
    "paperId": "mpsc-direct-2022-jr-grade-mes-electrical-wing-general-english"
  },
  {
    "id": "mpsc-og-3-154",
    "subject": "english",
    "topic": "tenses",
    "topicLabel": "Verb Tenses",
    "difficulty": "medium",
    "question": "Your mother has been looking for you since morning.",
    "options": [
      "Past perfect continuous tense",
      "Past perfect tense",
      "Present perfect tense",
      "Present perfect continuous tense"
    ],
    "answerIndex": 3,
    "explanation": "'Has been looking' (has been + -ing) is the Present Perfect Continuous Tense.",
    "source": "MPSC (Mizoram)",
    "year": 2022,
    "tags": [],
    "paperId": "mpsc-direct-2022-jr-grade-mes-electrical-wing-general-english"
  },
  {
    "id": "mpsc-og-3-155",
    "subject": "english",
    "topic": "tenses",
    "topicLabel": "Verb Tenses",
    "difficulty": "easy",
    "question": "The cook lights a match stick.",
    "options": [
      "Past indefinite tense",
      "Past perfect tense",
      "Present indefinite tense",
      "Future indefinite tense"
    ],
    "answerIndex": 2,
    "explanation": "'Lights' is a simple present verb form, making this the Present Indefinite Tense.",
    "source": "MPSC (Mizoram)",
    "year": 2022,
    "tags": [],
    "paperId": "mpsc-direct-2022-jr-grade-mes-electrical-wing-general-english"
  },
  {
    "id": "mpsc-og-3-156",
    "subject": "english",
    "topic": "tenses",
    "topicLabel": "Verb Tenses",
    "difficulty": "easy",
    "question": "Did you ever smoke in your life?",
    "options": [
      "Past indefinite tense",
      "Past perfect tense",
      "Present indefinite tense",
      "Future indefinite tense"
    ],
    "answerIndex": 0,
    "explanation": "'Did' with the base verb 'smoke' indicates the Past Indefinite (simple past) Tense.",
    "source": "MPSC (Mizoram)",
    "year": 2022,
    "tags": [],
    "paperId": "mpsc-direct-2022-jr-grade-mes-electrical-wing-general-english"
  },
  {
    "id": "mpsc-og-3-157",
    "subject": "english",
    "topic": "tenses",
    "topicLabel": "Verb Tenses",
    "difficulty": "medium",
    "question": "The cowherd had run a thorn into his foot.",
    "options": [
      "Present indefinite tense",
      "Past perfect tense",
      "Present perfect tense",
      "Past indefinite tense"
    ],
    "answerIndex": 1,
    "explanation": "'Had run' (had + past participle) is the Past Perfect Tense.",
    "source": "MPSC (Mizoram)",
    "year": 2022,
    "tags": [],
    "paperId": "mpsc-direct-2022-jr-grade-mes-electrical-wing-general-english"
  },
  {
    "id": "mpsc-og-3-158",
    "subject": "english",
    "topic": "tenses",
    "topicLabel": "Verb Tenses",
    "difficulty": "medium",
    "question": "The church bells had been ringing since dawn.",
    "options": [
      "Present perfect continuous tense",
      "Past perfect continuous tense",
      "Present perfect tense",
      "Past perfect tense"
    ],
    "answerIndex": 1,
    "explanation": "'Had been ringing' (had been + -ing) is the Past Perfect Continuous Tense.",
    "source": "MPSC (Mizoram)",
    "year": 2022,
    "tags": [],
    "paperId": "mpsc-direct-2022-jr-grade-mes-electrical-wing-general-english"
  },
  {
    "id": "mpsc-og-3-159",
    "subject": "english",
    "topic": "tenses",
    "topicLabel": "Verb Tenses",
    "difficulty": "easy",
    "question": "She cuts her finger while cutting vegetables.",
    "options": [
      "Present continuous tense",
      "Past continuous tense",
      "Present indefinite tense",
      "Past perfect tense"
    ],
    "answerIndex": 2,
    "explanation": "'Cuts' is simple present, making this the Present Indefinite Tense.",
    "source": "MPSC (Mizoram)",
    "year": 2022,
    "tags": [],
    "paperId": "mpsc-direct-2022-jr-grade-mes-electrical-wing-general-english"
  },
  {
    "id": "mpsc-og-3-160",
    "subject": "english",
    "topic": "synonyms",
    "topicLabel": "Synonyms",
    "difficulty": "easy",
    "question": "hamper",
    "options": [
      "hint",
      "hinder",
      "temper",
      "candour"
    ],
    "answerIndex": 1,
    "explanation": "'Hamper' means to hinder or obstruct.",
    "source": "MPSC (Mizoram)",
    "year": 2022,
    "tags": [],
    "paperId": "mpsc-direct-2022-jr-grade-mes-electrical-wing-general-english"
  },
  {
    "id": "mpsc-og-3-161",
    "subject": "english",
    "topic": "synonyms",
    "topicLabel": "Synonyms",
    "difficulty": "easy",
    "question": "assignment",
    "options": [
      "task",
      "labour",
      "answer",
      "tutor"
    ],
    "answerIndex": 0,
    "explanation": "'Assignment' means a task given to someone.",
    "source": "MPSC (Mizoram)",
    "year": 2022,
    "tags": [],
    "paperId": "mpsc-direct-2022-jr-grade-mes-electrical-wing-general-english"
  },
  {
    "id": "mpsc-og-3-162",
    "subject": "english",
    "topic": "synonyms",
    "topicLabel": "Synonyms",
    "difficulty": "easy",
    "question": "burden",
    "options": [
      "load",
      "loaf",
      "vice",
      "sin"
    ],
    "answerIndex": 0,
    "explanation": "'Burden' is synonymous with 'load'.",
    "source": "MPSC (Mizoram)",
    "year": 2022,
    "tags": [],
    "paperId": "mpsc-direct-2022-jr-grade-mes-electrical-wing-general-english"
  },
  {
    "id": "mpsc-og-3-163",
    "subject": "english",
    "topic": "synonyms",
    "topicLabel": "Synonyms",
    "difficulty": "medium",
    "question": "antagonistic",
    "options": [
      "hunger",
      "hostile",
      "humor",
      "hunter"
    ],
    "answerIndex": 1,
    "explanation": "'Antagonistic' means hostile or opposed.",
    "source": "MPSC (Mizoram)",
    "year": 2022,
    "tags": [],
    "paperId": "mpsc-direct-2022-jr-grade-mes-electrical-wing-general-english"
  },
  {
    "id": "mpsc-og-3-164",
    "subject": "english",
    "topic": "synonyms",
    "topicLabel": "Synonyms",
    "difficulty": "medium",
    "question": "belligerent",
    "options": [
      "aggressive",
      "progressive",
      "redressive",
      "condusive"
    ],
    "answerIndex": 0,
    "explanation": "'Belligerent' means aggressive or hostile.",
    "source": "MPSC (Mizoram)",
    "year": 2022,
    "tags": [],
    "paperId": "mpsc-direct-2022-jr-grade-mes-electrical-wing-general-english"
  },
  {
    "id": "mpsc-og-3-165",
    "subject": "english",
    "topic": "antonyms",
    "topicLabel": "Antonyms",
    "difficulty": "easy",
    "question": "adversity",
    "options": [
      "adjustment",
      "refinement",
      "duality",
      "prosperity"
    ],
    "answerIndex": 3,
    "explanation": "The antonym of 'adversity' (hardship) is 'prosperity'.",
    "source": "MPSC (Mizoram)",
    "year": 2022,
    "tags": [],
    "paperId": "mpsc-direct-2022-jr-grade-mes-electrical-wing-general-english"
  },
  {
    "id": "mpsc-og-3-166",
    "subject": "english",
    "topic": "antonyms",
    "topicLabel": "Antonyms",
    "difficulty": "easy",
    "question": "enrich",
    "options": [
      "endorse",
      "cherish",
      "novelish",
      "impoverish"
    ],
    "answerIndex": 3,
    "explanation": "The antonym of 'enrich' is 'impoverish'.",
    "source": "MPSC (Mizoram)",
    "year": 2022,
    "tags": [],
    "paperId": "mpsc-direct-2022-jr-grade-mes-electrical-wing-general-english"
  },
  {
    "id": "mpsc-og-3-167",
    "subject": "english",
    "topic": "antonyms",
    "topicLabel": "Antonyms",
    "difficulty": "easy",
    "question": "Coarse",
    "options": [
      "soak",
      "damp",
      "fine",
      "poor"
    ],
    "answerIndex": 2,
    "explanation": "The antonym of 'coarse' (rough) is 'fine'.",
    "source": "MPSC (Mizoram)",
    "year": 2022,
    "tags": [],
    "paperId": "mpsc-direct-2022-jr-grade-mes-electrical-wing-general-english"
  },
  {
    "id": "mpsc-og-3-168",
    "subject": "english",
    "topic": "antonyms",
    "topicLabel": "Antonyms",
    "difficulty": "easy",
    "question": "Important",
    "options": [
      "Imbibe",
      "incur",
      "trivial",
      "trident"
    ],
    "answerIndex": 2,
    "explanation": "The antonym of 'important' is 'trivial'.",
    "source": "MPSC (Mizoram)",
    "year": 2022,
    "tags": [],
    "paperId": "mpsc-direct-2022-jr-grade-mes-electrical-wing-general-english"
  },
  {
    "id": "mpsc-og-3-169",
    "subject": "english",
    "topic": "antonyms",
    "topicLabel": "Antonyms",
    "difficulty": "medium",
    "question": "repulsive",
    "options": [
      "repellant",
      "recurrent",
      "attentive",
      "attractive"
    ],
    "answerIndex": 3,
    "explanation": "The antonym of 'repulsive' is 'attractive'.",
    "source": "MPSC (Mizoram)",
    "year": 2022,
    "tags": [],
    "paperId": "mpsc-direct-2022-jr-grade-mes-electrical-wing-general-english"
  },
  {
    "id": "mpsc-og-3-170",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "easy",
    "question": "There was a very serious accident __________ the roundabout.",
    "options": [
      "in",
      "to",
      "at",
      "from"
    ],
    "answerIndex": 2,
    "explanation": "'At the roundabout' is the correct preposition usage for a specific point/location.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-171",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "easy",
    "question": "In many countries people drive __________ the left.",
    "options": [
      "in",
      "by",
      "at",
      "on"
    ],
    "answerIndex": 3,
    "explanation": "'Drive on the left' is the standard idiomatic usage.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-172",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "There was nothing he could do __________ wait.",
    "options": [
      "and",
      "otherwise",
      "except",
      "than"
    ],
    "answerIndex": 2,
    "explanation": "'Nothing... except wait' is the correct idiomatic construction.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-173",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "If you live in a corrupt society, you cannot easily rise __________ the prevailing corruption.",
    "options": [
      "upon",
      "above",
      "over",
      "beyond"
    ],
    "answerIndex": 1,
    "explanation": "'Rise above' means to overcome or transcend something.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-174",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "The bridge __________ this river was built in the year 1995.",
    "options": [
      "above",
      "over",
      "on",
      "at"
    ],
    "answerIndex": 1,
    "explanation": "'The bridge over this river' is the correct preposition for something spanning a river.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-175",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "We hadn't had anything to eat __________ the journey.",
    "options": [
      "during",
      "for",
      "since",
      "while"
    ],
    "answerIndex": 0,
    "explanation": "'During the journey' correctly indicates the time period.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-176",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "He is quick __________ solving questions.",
    "options": [
      "in",
      "with",
      "at",
      "about"
    ],
    "answerIndex": 2,
    "explanation": "'Quick at' is the correct idiomatic collocation.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-177",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "easy",
    "question": "We must not fight __________ our friends.",
    "options": [
      "against",
      "over",
      "with",
      "for"
    ],
    "answerIndex": 2,
    "explanation": "'Fight with' is the idiomatic phrase used here to mean quarrel with.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-178",
    "subject": "english",
    "topic": "mood-of-sentences",
    "topicLabel": "Mood of Sentences",
    "difficulty": "medium",
    "question": "I may go to the beach later.",
    "options": [
      "Indicative",
      "Infinitive",
      "Imperative",
      "Subjunctive"
    ],
    "answerIndex": 0,
    "explanation": "This is a straightforward statement of possibility, which is Indicative mood.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-179",
    "subject": "english",
    "topic": "mood-of-sentences",
    "topicLabel": "Mood of Sentences",
    "difficulty": "easy",
    "question": "Science is fascinating.",
    "options": [
      "Indicative",
      "Infinitive",
      "Imperative",
      "Subjunctive"
    ],
    "answerIndex": 0,
    "explanation": "A simple statement of fact is in the Indicative mood.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-180",
    "subject": "english",
    "topic": "mood-of-sentences",
    "topicLabel": "Mood of Sentences",
    "difficulty": "easy",
    "question": "Stop writing, put your pens down.",
    "options": [
      "Indicative",
      "Infinitive",
      "Imperative",
      "Subjunctive"
    ],
    "answerIndex": 2,
    "explanation": "This is a command, hence Imperative mood.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-181",
    "subject": "english",
    "topic": "mood-of-sentences",
    "topicLabel": "Mood of Sentences",
    "difficulty": "medium",
    "question": "Have you found your book?",
    "options": [
      "Indicative",
      "Infinitive",
      "Imperative",
      "Subjunctive"
    ],
    "answerIndex": 0,
    "explanation": "A question stating a fact-seeking inquiry is classified as Indicative mood.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-182",
    "subject": "english",
    "topic": "mood-of-sentences",
    "topicLabel": "Mood of Sentences",
    "difficulty": "medium",
    "question": "They came to speak to me.",
    "options": [
      "Indicative",
      "Infinitive",
      "Imperative",
      "Subjunctive"
    ],
    "answerIndex": 1,
    "explanation": "'To speak' is an infinitive construction, so this sentence expresses Infinitive mood.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-183",
    "subject": "english",
    "topic": "mood-of-sentences",
    "topicLabel": "Mood of Sentences",
    "difficulty": "medium",
    "question": "God bless you!",
    "options": [
      "Indicative",
      "Infinitive",
      "Imperative",
      "Subjunctive"
    ],
    "answerIndex": 3,
    "explanation": "'God bless you' expresses a wish, which is Subjunctive mood.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-184",
    "subject": "english",
    "topic": "mood-of-sentences",
    "topicLabel": "Mood of Sentences",
    "difficulty": "easy",
    "question": "Do sit down.",
    "options": [
      "Indicative",
      "Infinitive",
      "Imperative",
      "Subjunctive"
    ],
    "answerIndex": 2,
    "explanation": "This is an emphatic command, hence Imperative mood.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-185",
    "subject": "english",
    "topic": "mood-of-sentences",
    "topicLabel": "Mood of Sentences",
    "difficulty": "medium",
    "question": "He walks as though he were drunk.",
    "options": [
      "Indicative",
      "Infinitive",
      "Imperative",
      "Subjunctive"
    ],
    "answerIndex": 3,
    "explanation": "'Were' used hypothetically ('as though he were') signals Subjunctive mood.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-186",
    "subject": "english",
    "topic": "mood-of-sentences",
    "topicLabel": "Mood of Sentences",
    "difficulty": "easy",
    "question": "I will do the work tonight.",
    "options": [
      "Indicative",
      "Infinitive",
      "Imperative",
      "Subjunctive"
    ],
    "answerIndex": 0,
    "explanation": "A statement of intention/fact is Indicative mood.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-187",
    "subject": "english",
    "topic": "mood-of-sentences",
    "topicLabel": "Mood of Sentences",
    "difficulty": "easy",
    "question": "Take care of your health.",
    "options": [
      "Indicative",
      "Infinitive",
      "Imperative",
      "Subjunctive"
    ],
    "answerIndex": 2,
    "explanation": "This is a command/advice, hence Imperative mood.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-188",
    "subject": "english",
    "topic": "modals",
    "topicLabel": "Modal Verbs",
    "difficulty": "medium",
    "question": "Why __________ we go out for dinner tonight?",
    "options": [
      "shall",
      "don't",
      "do",
      "are"
    ],
    "answerIndex": 1,
    "explanation": "'Why don't we...' is the standard idiom for making a suggestion.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-189",
    "subject": "english",
    "topic": "modals",
    "topicLabel": "Modal Verbs",
    "difficulty": "medium",
    "question": "I __________ met him for lunch had I known he was coming.",
    "options": [
      "would",
      "had",
      "would have",
      "will"
    ],
    "answerIndex": 2,
    "explanation": "This is a third conditional sentence: 'would have met... had I known'.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-190",
    "subject": "english",
    "topic": "modals",
    "topicLabel": "Modal Verbs",
    "difficulty": "medium",
    "question": "He __________ passed easily if only he had spent a bit more time revising.",
    "options": [
      "could have",
      "must have",
      "would have",
      "might have"
    ],
    "answerIndex": 2,
    "explanation": "Third conditional structure: 'would have passed... if only he had...'.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-191",
    "subject": "english",
    "topic": "modals",
    "topicLabel": "Modal Verbs",
    "difficulty": "medium",
    "question": "She went to get flowers, she __________ be here in a minute.",
    "options": [
      "could",
      "must",
      "might",
      "should"
    ],
    "answerIndex": 3,
    "explanation": "'Should' expresses an expectation based on known information (she left recently to get flowers).",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-192",
    "subject": "english",
    "topic": "modals",
    "topicLabel": "Modal Verbs",
    "difficulty": "medium",
    "question": "__________ you learn anything?",
    "options": [
      "Hadn't",
      "Didn't",
      "Weren't",
      "Haven't"
    ],
    "answerIndex": 1,
    "explanation": "The base verb 'learn' requires the simple past auxiliary 'Didn't'.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-193",
    "subject": "english",
    "topic": "modals",
    "topicLabel": "Modal Verbs",
    "difficulty": "medium",
    "question": "Although we didn't have the right tools, we __________ get the work finished on time.",
    "options": [
      "could have",
      "were able to",
      "could",
      "managed to"
    ],
    "answerIndex": 3,
    "explanation": "'Managed to' expresses successful completion despite difficulty, matching the 'although' contrast.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-194",
    "subject": "english",
    "topic": "modals",
    "topicLabel": "Modal Verbs",
    "difficulty": "hard",
    "question": "She __________ to lunch, she usually goes at this time.",
    "options": [
      "should have gone",
      "must go",
      "must have gone",
      "should go"
    ],
    "answerIndex": 2,
    "explanation": "'Must have gone' expresses a confident deduction about a completed action based on habitual behaviour.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-195",
    "subject": "english",
    "topic": "modals",
    "topicLabel": "Modal Verbs",
    "difficulty": "medium",
    "question": "It __________ be ready by Friday, if we don't have any unexpected problems.",
    "options": [
      "should",
      "may",
      "must",
      "might"
    ],
    "answerIndex": 0,
    "explanation": "'Should' expresses expectation under normal conditions.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-196",
    "subject": "english",
    "topic": "modals",
    "topicLabel": "Modal Verbs",
    "difficulty": "medium",
    "question": "Peter __________ waiting long when she arrived.",
    "options": [
      "hadn't been",
      "wasn't",
      "hasn't been",
      "won't be"
    ],
    "answerIndex": 0,
    "explanation": "Past perfect continuous 'hadn't been waiting' is correct for an action ongoing before another past action.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-197",
    "subject": "english",
    "topic": "modals",
    "topicLabel": "Modal Verbs",
    "difficulty": "medium",
    "question": "It was her birthday yesterday, we __________ got her a card.",
    "options": [
      "should have",
      "had to",
      "should",
      "must have"
    ],
    "answerIndex": 0,
    "explanation": "'Should have got' expresses regret about a missed obligation in the past.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-198",
    "subject": "english",
    "topic": "sentence-types",
    "topicLabel": "Simple, Compound, Complex Sentences",
    "difficulty": "easy",
    "question": "My parents were much delighted.",
    "options": [
      "Simple sentence",
      "Compound sentence",
      "Complex Sentence"
    ],
    "answerIndex": 0,
    "explanation": "This has a single clause, making it a Simple sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-199",
    "subject": "english",
    "topic": "sentence-types",
    "topicLabel": "Simple, Compound, Complex Sentences",
    "difficulty": "medium",
    "question": "Tired of playing he went to take bath.",
    "options": [
      "Simple sentence",
      "Compound sentence",
      "Complex Sentence"
    ],
    "answerIndex": 0,
    "explanation": "'Tired of playing' is a participial phrase, not a clause, so this remains a Simple sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-200",
    "subject": "english",
    "topic": "sentence-types",
    "topicLabel": "Simple, Compound, Complex Sentences",
    "difficulty": "medium",
    "question": "Do not walk so quickly, you may fall.",
    "options": [
      "Simple sentence",
      "Compound sentence",
      "Complex Sentence"
    ],
    "answerIndex": 1,
    "explanation": "Two independent clauses are joined here, making it a Compound sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-201",
    "subject": "english",
    "topic": "sentence-types",
    "topicLabel": "Simple, Compound, Complex Sentences",
    "difficulty": "medium",
    "question": "I met a girl who was very beautiful.",
    "options": [
      "Simple sentence",
      "Compound sentence",
      "Complex Sentence"
    ],
    "answerIndex": 2,
    "explanation": "The relative clause 'who was very beautiful' makes this a Complex sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-202",
    "subject": "english",
    "topic": "sentence-types",
    "topicLabel": "Simple, Compound, Complex Sentences",
    "difficulty": "medium",
    "question": "He is doing his best and I am sure of it.",
    "options": [
      "Simple sentence",
      "Compound sentence",
      "Complex Sentence"
    ],
    "answerIndex": 1,
    "explanation": "Two independent clauses joined by 'and' make this a Compound sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-203",
    "subject": "english",
    "topic": "sentence-types",
    "topicLabel": "Simple, Compound, Complex Sentences",
    "difficulty": "easy",
    "question": "I was very happy to receive her message.",
    "options": [
      "Simple sentence",
      "Compound sentence",
      "Complex Sentence"
    ],
    "answerIndex": 0,
    "explanation": "'To receive her message' is an infinitive phrase, not a clause, so this is a Simple sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-204",
    "subject": "english",
    "topic": "sentence-types",
    "topicLabel": "Simple, Compound, Complex Sentences",
    "difficulty": "medium",
    "question": "He is slow but he is sincere.",
    "options": [
      "Simple sentence",
      "Compound sentence",
      "Complex Sentence"
    ],
    "answerIndex": 1,
    "explanation": "Two independent clauses joined by 'but' make this a Compound sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-205",
    "subject": "english",
    "topic": "sentence-types",
    "topicLabel": "Simple, Compound, Complex Sentences",
    "difficulty": "medium",
    "question": "Can you inform me where she has gone?",
    "options": [
      "Simple sentence",
      "Compound sentence",
      "Complex Sentence"
    ],
    "answerIndex": 2,
    "explanation": "The noun clause 'where she has gone' makes this a Complex sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-206",
    "subject": "english",
    "topic": "sentence-types",
    "topicLabel": "Simple, Compound, Complex Sentences",
    "difficulty": "easy",
    "question": "The tea is too hot to drink.",
    "options": [
      "Simple sentence",
      "Compound sentence",
      "Complex Sentence"
    ],
    "answerIndex": 0,
    "explanation": "This is a single-clause Simple sentence with an infinitive phrase.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-207",
    "subject": "english",
    "topic": "sentence-types",
    "topicLabel": "Simple, Compound, Complex Sentences",
    "difficulty": "medium",
    "question": "As she was very tired, she didn't cook food.",
    "options": [
      "Simple sentence",
      "Compound sentence",
      "Complex Sentence"
    ],
    "answerIndex": 2,
    "explanation": "The subordinate clause 'As she was very tired' makes this a Complex sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-208",
    "subject": "english",
    "topic": "clause-types",
    "topicLabel": "Types of Clauses",
    "difficulty": "medium",
    "question": "Please show me how the machine works.",
    "options": [
      "Noun clause",
      "Adjective clause",
      "Adverb clause",
      "None of these"
    ],
    "answerIndex": 0,
    "explanation": "'How the machine works' functions as the object of 'show', making it a Noun clause.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-209",
    "subject": "english",
    "topic": "clause-types",
    "topicLabel": "Types of Clauses",
    "difficulty": "medium",
    "question": "No man who is honest shall suffer in any way.",
    "options": [
      "Noun clause",
      "Adjective clause",
      "Adverb clause",
      "None of these"
    ],
    "answerIndex": 1,
    "explanation": "'Who is honest' modifies 'man', making it an Adjective clause.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-210",
    "subject": "english",
    "topic": "clause-types",
    "topicLabel": "Types of Clauses",
    "difficulty": "medium",
    "question": "Nobody likes him because he is arrogant.",
    "options": [
      "Noun clause",
      "Adjective clause",
      "Adverb clause",
      "None of these"
    ],
    "answerIndex": 2,
    "explanation": "'Because he is arrogant' gives a reason, making it an Adverb clause.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-211",
    "subject": "english",
    "topic": "clause-types",
    "topicLabel": "Types of Clauses",
    "difficulty": "medium",
    "question": "When I was younger, I thought so.",
    "options": [
      "Noun clause",
      "Adjective clause",
      "Adverb clause",
      "None of these"
    ],
    "answerIndex": 2,
    "explanation": "'When I was younger' indicates time, making it an Adverb clause.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-212",
    "subject": "english",
    "topic": "clause-types",
    "topicLabel": "Types of Clauses",
    "difficulty": "medium",
    "question": "He laughs best who laughs last.",
    "options": [
      "Noun clause",
      "Adjective clause",
      "Adverb clause",
      "None of these"
    ],
    "answerIndex": 1,
    "explanation": "'Who laughs last' modifies 'he', making it an Adjective clause.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-213",
    "subject": "english",
    "topic": "clause-types",
    "topicLabel": "Types of Clauses",
    "difficulty": "medium",
    "question": "It is uncertain whether he will come.",
    "options": [
      "Noun clause",
      "Adjective clause",
      "Adverb clause",
      "None of these"
    ],
    "answerIndex": 0,
    "explanation": "'Whether he will come' functions as the real subject, making it a Noun clause.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-214",
    "subject": "english",
    "topic": "clause-types",
    "topicLabel": "Types of Clauses",
    "difficulty": "medium",
    "question": "This is just what I wanted.",
    "options": [
      "Noun clause",
      "Adjective clause",
      "Adverb clause",
      "None of these"
    ],
    "answerIndex": 0,
    "explanation": "'What I wanted' functions as a complement, making it a Noun clause.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-215",
    "subject": "english",
    "topic": "clause-types",
    "topicLabel": "Types of Clauses",
    "difficulty": "medium",
    "question": "Anyone who comes late will be punished.",
    "options": [
      "Noun clause",
      "Adjective clause",
      "Adverb clause",
      "None of these"
    ],
    "answerIndex": 1,
    "explanation": "'Who comes late' modifies 'anyone', making it an Adjective clause.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-216",
    "subject": "english",
    "topic": "clause-types",
    "topicLabel": "Types of Clauses",
    "difficulty": "medium",
    "question": "He always does as I tell him.",
    "options": [
      "Noun clause",
      "Adjective clause",
      "Adverb clause",
      "None of these"
    ],
    "answerIndex": 2,
    "explanation": "'As I tell him' indicates manner, making it an Adverb clause.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-217",
    "subject": "english",
    "topic": "clause-types",
    "topicLabel": "Types of Clauses",
    "difficulty": "medium",
    "question": "We all admire a man who is courageous.",
    "options": [
      "Noun clause",
      "Adjective clause",
      "Adverb clause",
      "None of these"
    ],
    "answerIndex": 1,
    "explanation": "'Who is courageous' modifies 'man', making it an Adjective clause.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-218",
    "subject": "english",
    "topic": "affirmative-negative-degree",
    "topicLabel": "Sentence Types and Degree",
    "difficulty": "medium",
    "question": "Have a cup of tea.",
    "options": [
      "Affirmative",
      "Comparative",
      "Negative",
      "Assertive"
    ],
    "answerIndex": 0,
    "explanation": "This is a positive/affirmative sentence with no negation or comparison.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-219",
    "subject": "english",
    "topic": "affirmative-negative-degree",
    "topicLabel": "Sentence Types and Degree",
    "difficulty": "easy",
    "question": "She does not come here very often.",
    "options": [
      "Comparative",
      "Negative",
      "Affirmative",
      "Superlative"
    ],
    "answerIndex": 1,
    "explanation": "The word 'not' makes this a Negative sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-220",
    "subject": "english",
    "topic": "affirmative-negative-degree",
    "topicLabel": "Sentence Types and Degree",
    "difficulty": "medium",
    "question": "It is a unique item.",
    "options": [
      "Comparative",
      "Superlative",
      "Affirmative",
      "Negative"
    ],
    "answerIndex": 2,
    "explanation": "This is a positive statement with no comparison, hence Affirmative.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-221",
    "subject": "english",
    "topic": "affirmative-negative-degree",
    "topicLabel": "Sentence Types and Degree",
    "difficulty": "easy",
    "question": "That razor is sharper than this one.",
    "options": [
      "Comparative",
      "Assertive",
      "Superlative",
      "Negative"
    ],
    "answerIndex": 0,
    "explanation": "'Sharper than' indicates the Comparative degree.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-222",
    "subject": "english",
    "topic": "affirmative-negative-degree",
    "topicLabel": "Sentence Types and Degree",
    "difficulty": "medium",
    "question": "There is no item like this.",
    "options": [
      "Comparative",
      "Superlative",
      "Negative",
      "Affirmative"
    ],
    "answerIndex": 1,
    "explanation": "This negative construction ('no item like this') is a classic way of expressing the Superlative degree.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-223",
    "subject": "english",
    "topic": "affirmative-negative-degree",
    "topicLabel": "Sentence Types and Degree",
    "difficulty": "easy",
    "question": "He is the tallest boy in the class.",
    "options": [
      "Negative",
      "Superlative",
      "Assertive",
      "Comparative"
    ],
    "answerIndex": 1,
    "explanation": "'Tallest' is the superlative form, indicating Superlative degree.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-224",
    "subject": "english",
    "topic": "affirmative-negative-degree",
    "topicLabel": "Sentence Types and Degree",
    "difficulty": "medium",
    "question": "It is a matter of joy that he scored a goal.",
    "options": [
      "Negative",
      "Affirmative",
      "Comparative",
      "Assertive"
    ],
    "answerIndex": 1,
    "explanation": "This is a straightforward positive statement, hence Affirmative.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-225",
    "subject": "english",
    "topic": "affirmative-negative-degree",
    "topicLabel": "Sentence Types and Degree",
    "difficulty": "easy",
    "question": "John is more sincere than his brothers.",
    "options": [
      "Affirmative",
      "Superlative",
      "Comparative",
      "Assertive"
    ],
    "answerIndex": 2,
    "explanation": "'More sincere than' indicates the Comparative degree.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-226",
    "subject": "english",
    "topic": "affirmative-negative-degree",
    "topicLabel": "Sentence Types and Degree",
    "difficulty": "medium",
    "question": "We won all the matches.",
    "options": [
      "Affirmative",
      "Superlative",
      "Comparative",
      "Assertive"
    ],
    "answerIndex": 0,
    "explanation": "This is a plain positive statement, hence Affirmative.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-227",
    "subject": "english",
    "topic": "affirmative-negative-degree",
    "topicLabel": "Sentence Types and Degree",
    "difficulty": "easy",
    "question": "Mr. Rama is the richest man in the village.",
    "options": [
      "Affirmative",
      "Superlative",
      "Comparative",
      "Assertive"
    ],
    "answerIndex": 1,
    "explanation": "'Richest' is the superlative form, indicating Superlative degree.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-228",
    "subject": "english",
    "topic": "vocabulary-pairs",
    "topicLabel": "Vocabulary - Word Pairs",
    "difficulty": "medium",
    "question": "The Deputy Manager __________ to resign because all his proposals were __________ down by his superiors.",
    "options": [
      "planned, thrown",
      "threatened, turned",
      "began, kept",
      "began, kept"
    ],
    "answerIndex": 1,
    "explanation": "'Threatened to resign' and proposals 'turned down' are the idiomatic word choices.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-229",
    "subject": "english",
    "topic": "vocabulary-pairs",
    "topicLabel": "Vocabulary - Word Pairs",
    "difficulty": "medium",
    "question": "She was not __________ by the criticism and paid no __________ even when her best friend talked against her.",
    "options": [
      "bothered, attention",
      "shaken, indication",
      "threatened, warning",
      "troubled, brain"
    ],
    "answerIndex": 0,
    "explanation": "'Not bothered by' and 'paid no attention' are the idiomatic word choices.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-230",
    "subject": "english",
    "topic": "vocabulary-pairs",
    "topicLabel": "Vocabulary - Word Pairs",
    "difficulty": "medium",
    "question": "Children are more __________ than adults, it is __________ their quickness in learning a new language.",
    "options": [
      "intelligent, disproved by",
      "adaptable, reflected in",
      "conservative, seen in",
      "susceptible, demonstrated in"
    ],
    "answerIndex": 1,
    "explanation": "'More adaptable' and 'reflected in their quickness' fit the sentence's meaning.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-231",
    "subject": "english",
    "topic": "vocabulary-pairs",
    "topicLabel": "Vocabulary - Word Pairs",
    "difficulty": "medium",
    "question": "Mary's__________ in athletics yielded rich __________ she got a scholarship.",
    "options": [
      "performance, money",
      "defeat, results",
      "behavior, appreciation",
      "excellence, dividends"
    ],
    "answerIndex": 3,
    "explanation": "'Excellence... yielded rich dividends' is the idiomatic phrasing.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-232",
    "subject": "english",
    "topic": "vocabulary-pairs",
    "topicLabel": "Vocabulary - Word Pairs",
    "difficulty": "medium",
    "question": "I am not __________ to sell you my house unless you offer a more __________ price.",
    "options": [
      "agree, better",
      "ready, correct",
      "prepared, realistic",
      "having, actual"
    ],
    "answerIndex": 2,
    "explanation": "'Prepared to sell... a realistic price' fits the sentence's meaning.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-233",
    "subject": "english",
    "topic": "vocabulary-pairs",
    "topicLabel": "Vocabulary - Word Pairs",
    "difficulty": "medium",
    "question": "Due to __________ rainfall this year, there will be __________ cut in water supply.",
    "options": [
      "scanty, substantial",
      "surplus, abundant",
      "meagre, least",
      "abundant, considerable"
    ],
    "answerIndex": 0,
    "explanation": "'Scanty rainfall' causing a 'substantial cut' in supply makes logical sense.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-234",
    "subject": "english",
    "topic": "vocabulary-pairs",
    "topicLabel": "Vocabulary - Word Pairs",
    "difficulty": "medium",
    "question": "We __________ him with many promises, but nothing would __________ him.",
    "options": [
      "tempted, influence",
      "attracted, fascinate",
      "provoked, desiccate",
      "gave, deprive"
    ],
    "answerIndex": 0,
    "explanation": "'Tempted him with promises... nothing would influence him' fits the sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-235",
    "subject": "english",
    "topic": "vocabulary-pairs",
    "topicLabel": "Vocabulary - Word Pairs",
    "difficulty": "medium",
    "question": "In his __________, he followed the __________ course.",
    "options": [
      "agony, appropriate",
      "hurry, diversified",
      "ignorance, wrong",
      "predicament, proper"
    ],
    "answerIndex": 2,
    "explanation": "'In his ignorance, he followed the wrong course' reflects a natural cause-and-effect relationship.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-236",
    "subject": "english",
    "topic": "vocabulary-pairs",
    "topicLabel": "Vocabulary - Word Pairs",
    "difficulty": "medium",
    "question": "The construction of the hall has been __________ because of the __________ of cement in the market.",
    "options": [
      "held, non-availability",
      "denied, restrictions",
      "hampered, shortage",
      "prevented, supply"
    ],
    "answerIndex": 2,
    "explanation": "'Hampered... because of the shortage of cement' is the idiomatic phrasing.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-237",
    "subject": "english",
    "topic": "vocabulary-pairs",
    "topicLabel": "Vocabulary - Word Pairs",
    "difficulty": "medium",
    "question": "Only when __________ failed, the police resorted to __________.",
    "options": [
      "efforts, power",
      "power, punishment",
      "arrests, imprisonment",
      "persuasions, force"
    ],
    "answerIndex": 3,
    "explanation": "'When persuasions failed, the police resorted to force' fits the sentence logically.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-238",
    "subject": "english",
    "topic": "proverbs",
    "topicLabel": "Common Proverbs",
    "difficulty": "medium",
    "question": "Do good and cast it into the __________.",
    "options": [
      "river",
      "fire",
      "air",
      "wind"
    ],
    "answerIndex": 0,
    "explanation": "The proverb 'Do good and cast it into the river/sea' means one should do good without expecting recognition or reward.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-239",
    "subject": "english",
    "topic": "proverbs",
    "topicLabel": "Common Proverbs",
    "difficulty": "medium",
    "question": "Guilty conscience is always __________.",
    "options": [
      "unsure",
      "doubtful",
      "suspicious",
      "dubious"
    ],
    "answerIndex": 2,
    "explanation": "The saying 'A guilty conscience is always suspicious' means a guilty person is always wary of being caught.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-240",
    "subject": "english",
    "topic": "proverbs",
    "topicLabel": "Common Proverbs",
    "difficulty": "easy",
    "question": "A bad workman quarrels with his __________.",
    "options": [
      "tools",
      "friends",
      "master",
      "workshop"
    ],
    "answerIndex": 0,
    "explanation": "The proverb 'A bad workman quarrels with his tools' means an incompetent person blames external factors for failure.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-241",
    "subject": "english",
    "topic": "proverbs",
    "topicLabel": "Common Proverbs",
    "difficulty": "medium",
    "question": "Every potter praises his __________.",
    "options": [
      "wheel",
      "pot",
      "vessel",
      "bowl"
    ],
    "answerIndex": 1,
    "explanation": "The proverb 'Every potter praises his pot' means everyone praises their own work.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-242",
    "subject": "english",
    "topic": "vocabulary",
    "topicLabel": "Vocabulary",
    "difficulty": "medium",
    "question": "When someone has advanced to the highest position attainable, he is said to have reached the",
    "options": [
      "vigil",
      "precipice",
      "threshold",
      "pinnacle"
    ],
    "answerIndex": 3,
    "explanation": "'Pinnacle' means the highest point of achievement.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-243",
    "subject": "english",
    "topic": "vocabulary",
    "topicLabel": "Vocabulary",
    "difficulty": "medium",
    "question": "One who does not care for art or literature is called",
    "options": [
      "Philistine",
      "Philanthropist",
      "Philanderer",
      "Pessimist"
    ],
    "answerIndex": 0,
    "explanation": "A 'Philistine' is someone indifferent or hostile to art and culture.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-244",
    "subject": "english",
    "topic": "synonyms",
    "topicLabel": "Synonyms",
    "difficulty": "medium",
    "question": "The synonym of BACKLASH is",
    "options": [
      "reaction",
      "frighten",
      "result",
      "ridicule"
    ],
    "answerIndex": 0,
    "explanation": "'Backlash' means a strong negative reaction.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-245",
    "subject": "english",
    "topic": "antonyms",
    "topicLabel": "Antonyms",
    "difficulty": "easy",
    "question": "The antonym of AMPLE is",
    "options": [
      "extensive",
      "empty",
      "scanty",
      "unusual"
    ],
    "answerIndex": 2,
    "explanation": "The antonym of 'ample' (plentiful) is 'scanty'.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-246",
    "subject": "english",
    "topic": "foreign-phrases",
    "topicLabel": "Foreign Phrases in English",
    "difficulty": "medium",
    "question": "The Latin words 'Prima facie' means",
    "options": [
      "for the time being",
      "in proportion",
      "with equal place",
      "on the first impression"
    ],
    "answerIndex": 3,
    "explanation": "'Prima facie' is a Latin phrase meaning 'on the first impression' or 'at first sight'.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-247",
    "subject": "english",
    "topic": "vocabulary-fill-blanks",
    "topicLabel": "Vocabulary Fill in the Blanks",
    "difficulty": "medium",
    "question": "Many companies see technology as a __________ for a whole host of business problems.",
    "options": [
      "consideration",
      "linking",
      "preference",
      "panacea"
    ],
    "answerIndex": 3,
    "explanation": "'Panacea' means a solution for all problems.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-248",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "The judge acquitted the prisoner __________ the charge of murder.",
    "options": [
      "from",
      "of",
      "with",
      "about"
    ],
    "answerIndex": 1,
    "explanation": "'Acquitted of' is the correct idiomatic preposition usage.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-249",
    "subject": "english",
    "topic": "vocabulary-fill-blanks",
    "topicLabel": "Vocabulary Fill in the Blanks",
    "difficulty": "medium",
    "question": "You must __________ your house in order before you offer advice to others.",
    "options": [
      "get",
      "arrange",
      "bring",
      "organize"
    ],
    "answerIndex": 0,
    "explanation": "'Get your house in order' is the idiomatic phrase.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-250",
    "subject": "english",
    "topic": "vocabulary-fill-blanks",
    "topicLabel": "Vocabulary Fill in the Blanks",
    "difficulty": "hard",
    "question": "His rustic behavior was an embarrassment to the __________ sensibility of the young ladies.",
    "options": [
      "fragile",
      "soft",
      "delicate",
      "sober"
    ],
    "answerIndex": 2,
    "explanation": "'Delicate sensibility' is the standard collocation here.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-251",
    "subject": "english",
    "topic": "vocabulary-fill-blanks",
    "topicLabel": "Vocabulary Fill in the Blanks",
    "difficulty": "medium",
    "question": "Robert is too __________ as far as his food habits are concerned.",
    "options": [
      "enjoyable",
      "curious",
      "fastidious",
      "interesting"
    ],
    "answerIndex": 2,
    "explanation": "'Fastidious' means excessively particular or picky, fitting food habits.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-252",
    "subject": "english",
    "topic": "vocabulary-fill-blanks",
    "topicLabel": "Vocabulary Fill in the Blanks",
    "difficulty": "medium",
    "question": "The soldiers were instructed to __________ restraint and handle the situation peacefully.",
    "options": [
      "exercise",
      "enforce",
      "control",
      "remain"
    ],
    "answerIndex": 0,
    "explanation": "'Exercise restraint' is the standard idiomatic collocation.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-253",
    "subject": "english",
    "topic": "vocabulary-fill-blanks",
    "topicLabel": "Vocabulary Fill in the Blanks",
    "difficulty": "medium",
    "question": "As the waves rose the ship tossed, many of the passengers felt __________.",
    "options": [
      "lethargic",
      "queasy",
      "subdued",
      "tremulous"
    ],
    "answerIndex": 1,
    "explanation": "'Queasy' describes the nauseous feeling associated with seasickness.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-254",
    "subject": "english",
    "topic": "vocabulary-fill-blanks",
    "topicLabel": "Vocabulary Fill in the Blanks",
    "difficulty": "hard",
    "question": "Having lived a __________ life for forty years, he is not able to take any independent decision.",
    "options": [
      "safe",
      "happy",
      "cloistered",
      "successful"
    ],
    "answerIndex": 2,
    "explanation": "'Cloistered' means sheltered/isolated, explaining his inability to decide independently.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-255",
    "subject": "english",
    "topic": "vocabulary-fill-blanks",
    "topicLabel": "Vocabulary Fill in the Blanks",
    "difficulty": "medium",
    "question": "His approach to work is so __________ that none of his colleagues consider him dependable.",
    "options": [
      "uninterestingly",
      "common",
      "low",
      "casual"
    ],
    "answerIndex": 3,
    "explanation": "'Casual' (careless) approach explains why colleagues don't consider him dependable.",
    "source": "MPSC (Mizoram)",
    "year": 2021,
    "tags": [],
    "paperId": "mpsc-direct-2021-informatics-officer-general-english-paper-2"
  },
  {
    "id": "mpsc-og-3-256",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "We should guard ourselves against our green-eyed friends.",
    "options": [
      "rich",
      "jealous",
      "handsome",
      "enthusiastic"
    ],
    "answerIndex": 1,
    "explanation": "'Green-eyed' is an idiom meaning jealous.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-257",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "He has been accused of sitting on the fence.",
    "options": [
      "Confused",
      "observing the scene",
      "hesitating between two options",
      "resting on the fence"
    ],
    "answerIndex": 2,
    "explanation": "'Sitting on the fence' means being undecided or hesitating between two options.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-258",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "She rejected his proposal of marriage point blank.",
    "options": [
      "directly",
      "poignantly",
      "absurdly",
      "briefly"
    ],
    "answerIndex": 0,
    "explanation": "'Point blank' means directly and bluntly.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-259",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "easy",
    "question": "Sharon had to look high and low before she could find her house key.",
    "options": [
      "nowhere",
      "always",
      "everywhere",
      "somewhere"
    ],
    "answerIndex": 2,
    "explanation": "'Look high and low' means to search everywhere.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-260",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "Corruption is a burning question of the day.",
    "options": [
      "a dying issue",
      "an insignificant problem",
      "an irrelevant problem",
      "a widely debated issue"
    ],
    "answerIndex": 3,
    "explanation": "'A burning question' refers to a widely debated, urgent issue.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-261",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "If you pass this difficult examination, it will be a feather in your cap.",
    "options": [
      "you will get a very good job",
      "additional achievement",
      "your parents will be very happy",
      "You will get a scholarship for higher studies"
    ],
    "answerIndex": 1,
    "explanation": "'A feather in your cap' means an additional achievement or honour.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-262",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "A movement for world unity is in the offing.",
    "options": [
      "at the end",
      "about to start",
      "on the decline",
      "had started"
    ],
    "answerIndex": 1,
    "explanation": "'In the offing' means about to happen or start soon.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-263",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "Mawia is not cut out for this kind of work.",
    "options": [
      "trained",
      "suitable",
      "recommended",
      "considered"
    ],
    "answerIndex": 1,
    "explanation": "'Cut out for' means naturally suitable for something.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-264",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "The politician was able to sway the mob with his gift of the gab.",
    "options": [
      "fluency of speech",
      "flattering words",
      "abundance of promise",
      "political foresight"
    ],
    "answerIndex": 0,
    "explanation": "'Gift of the gab' means fluency and eloquence of speech.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-265",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "Discipline is on the wane in schools and colleges these days.",
    "options": [
      "increasing",
      "declining",
      "spreading",
      "spiralling"
    ],
    "answerIndex": 1,
    "explanation": "'On the wane' means declining or diminishing.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-266",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "With the existing management, the future of the company is in doldrums.",
    "options": [
      "dull",
      "bright",
      "uncertain",
      "secure"
    ],
    "answerIndex": 2,
    "explanation": "'In the doldrums' means in a state of uncertainty or stagnation.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-267",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "It was such a strange affair that I could not make head or tail of it.",
    "options": [
      "face it",
      "tolerate it",
      "remember",
      "understand it"
    ],
    "answerIndex": 3,
    "explanation": "'Make head or tail of' means to understand something.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-268",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "After the dinner was over she refused to foot the bill.",
    "options": [
      "to pay",
      "to prepare",
      "to destroy",
      "to play trick"
    ],
    "answerIndex": 0,
    "explanation": "'Foot the bill' means to pay for something.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-269",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "I did not know that he was pulling my leg all the time.",
    "options": [
      "befooling me",
      "degrading me",
      "defaming me",
      "complimenting me"
    ],
    "answerIndex": 0,
    "explanation": "'Pulling someone's leg' means teasing or befooling them jokingly.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-270",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "Harrassed by repeated acts of injustice Peter decided to put his foot down.",
    "options": [
      "resign",
      "not to yield",
      "withdraw",
      "accept the proposal unconditionally"
    ],
    "answerIndex": 1,
    "explanation": "'Put his foot down' means to firmly refuse to yield or take a firm stand.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-271",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "When the police came, the thieves took to their heels.",
    "options": [
      "were taken by surprise",
      "took to flight",
      "took shelter in a tall building",
      "unconditionally surrendered"
    ],
    "answerIndex": 1,
    "explanation": "'Took to their heels' means they fled/ran away.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-272",
    "subject": "english",
    "topic": "reading-comprehension",
    "topicLabel": "Reading Comprehension",
    "difficulty": "medium",
    "question": "Modern medicine has helped man",
    "options": [
      "to live longer everywhere in the world",
      "to live a healthy life in hygienic conditions",
      "to live in thickly populated areas without fear of epidemics",
      "balance population with available resources"
    ],
    "answerIndex": 2,
    "explanation": "The passage states modern medicine and sanitation allow dense populations to live without risk of pestilence.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-273",
    "subject": "english",
    "topic": "reading-comprehension",
    "topicLabel": "Reading Comprehension",
    "difficulty": "medium",
    "question": "Man has not yet succeded in controlling the furies of",
    "options": [
      "earthquakes",
      "floods",
      "hurricanes",
      "All the three"
    ],
    "answerIndex": 3,
    "explanation": "The passage states man has devised no adequate protection against earthquake, flood and hurricane.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-274",
    "subject": "english",
    "topic": "reading-comprehension",
    "topicLabel": "Reading Comprehension",
    "difficulty": "medium",
    "question": "Which one of the following statement best reflects the underlying conviction of the passage",
    "options": [
      "Man can do wonders",
      "Man's knowledge has no end",
      "Man has been able to control Nature to a great extent",
      "Man has been able to control nature completely"
    ],
    "answerIndex": 2,
    "explanation": "The passage argues nature is 'almost completely conquered' though still formidable in extreme events, reflecting substantial (not complete) control.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-275",
    "subject": "english",
    "topic": "reading-comprehension",
    "topicLabel": "Reading Comprehension",
    "difficulty": "medium",
    "question": "In ancient times, Man had an apprehension of",
    "options": [
      "famine",
      "epidemics",
      "wet summer",
      "All the three"
    ],
    "answerIndex": 3,
    "explanation": "The passage mentions famine, pestilence (epidemics) and a menacing wet summer as ancient fears.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-276",
    "subject": "english",
    "topic": "reading-comprehension",
    "topicLabel": "Reading Comprehension",
    "difficulty": "medium",
    "question": "The modern transport system is a blessing as it",
    "options": [
      "has helped decrease the distance between towns and villages",
      "has brought comfort to both towns and villages",
      "has made all the commodities available to everyone",
      "has encouraged people to travel for pleasure"
    ],
    "answerIndex": 2,
    "explanation": "The passage states modern transportation made the resources of the entire planet accessible to all its inhabitants.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-277",
    "subject": "english",
    "topic": "vocabulary-in-context",
    "topicLabel": "Vocabulary in Context",
    "difficulty": "easy",
    "question": "menace",
    "options": [
      "threat",
      "menial",
      "manage",
      "manual"
    ],
    "answerIndex": 0,
    "explanation": "'Menace' means a threat or danger.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-278",
    "subject": "english",
    "topic": "vocabulary-in-context",
    "topicLabel": "Vocabulary in Context",
    "difficulty": "easy",
    "question": "Inhabitants",
    "options": [
      "habit",
      "inhuman",
      "inhibit",
      "occupant"
    ],
    "answerIndex": 3,
    "explanation": "'Inhabitants' are occupants or residents of a place.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-279",
    "subject": "english",
    "topic": "vocabulary-in-context",
    "topicLabel": "Vocabulary in Context",
    "difficulty": "medium",
    "question": "Convulsions",
    "options": [
      "conversation",
      "disturbances",
      "compulsion",
      "convergence"
    ],
    "answerIndex": 1,
    "explanation": "'Convulsions' in this context refers to violent disturbances (natural upheavals).",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-280",
    "subject": "english",
    "topic": "vocabulary-in-context",
    "topicLabel": "Vocabulary in Context",
    "difficulty": "medium",
    "question": "impassable",
    "options": [
      "traversable",
      "passing on",
      "unnavigable",
      "insurmountable"
    ],
    "answerIndex": 0,
    "explanation": "The opposite of 'impassable' (cannot be crossed) is 'traversable' (can be crossed).",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-281",
    "subject": "english",
    "topic": "vocabulary-in-context",
    "topicLabel": "Vocabulary in Context",
    "difficulty": "medium",
    "question": "assures",
    "options": [
      "discourages",
      "guarantee",
      "ensure",
      "promise"
    ],
    "answerIndex": 0,
    "explanation": "The opposite of 'assures' (guarantees confidently) is 'discourages'.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-282",
    "subject": "english",
    "topic": "vocabulary-in-context",
    "topicLabel": "Vocabulary in Context",
    "difficulty": "medium",
    "question": "formidable",
    "options": [
      "unnerving",
      "powerful",
      "weak",
      "impressively large"
    ],
    "answerIndex": 2,
    "explanation": "The opposite of 'formidable' (powerful/intimidating) is 'weak'.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-283",
    "subject": "english",
    "topic": "vocabulary-in-context",
    "topicLabel": "Vocabulary in Context",
    "difficulty": "medium",
    "question": "adequate",
    "options": [
      "enough",
      "ample",
      "appropriate",
      "insufficient"
    ],
    "answerIndex": 3,
    "explanation": "The opposite of 'adequate' (sufficient) is 'insufficient'.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-284",
    "subject": "english",
    "topic": "verb-forms",
    "topicLabel": "Correct Verb Forms",
    "difficulty": "medium",
    "question": "It started to rain while we _________ basketball.",
    "options": [
      "plays",
      "are playing",
      "were playing",
      "had played"
    ],
    "answerIndex": 2,
    "explanation": "Past continuous 'were playing' correctly describes an ongoing action interrupted by another past action.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-285",
    "subject": "english",
    "topic": "verb-forms",
    "topicLabel": "Correct Verb Forms",
    "difficulty": "medium",
    "question": "I _________ him for a long time.",
    "options": [
      "know",
      "have known",
      "has known",
      "am knowing"
    ],
    "answerIndex": 1,
    "explanation": "Present perfect 'have known' correctly describes a state continuing up to now.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-286",
    "subject": "english",
    "topic": "verb-forms",
    "topicLabel": "Correct Verb Forms",
    "difficulty": "medium",
    "question": "When David lived in Chennai, he _________ to the cinema once a week.",
    "options": [
      "goes",
      "was going",
      "has been going",
      "went"
    ],
    "answerIndex": 3,
    "explanation": "Simple past 'went' correctly describes a repeated past habitual action.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-287",
    "subject": "english",
    "topic": "verb-forms",
    "topicLabel": "Correct Verb Forms",
    "difficulty": "medium",
    "question": "She _________ unconscious since morning.",
    "options": [
      "is",
      "was",
      "has been",
      "will be"
    ],
    "answerIndex": 2,
    "explanation": "Present perfect 'has been' correctly describes a state continuing from the past to the present.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-288",
    "subject": "english",
    "topic": "verb-forms",
    "topicLabel": "Correct Verb Forms",
    "difficulty": "easy",
    "question": "When I was in Mizoram , I _________ Mamit, Lunglei and Lawngtlai.",
    "options": [
      "visited",
      "was visited",
      "have visited",
      "have been visiting"
    ],
    "answerIndex": 0,
    "explanation": "Simple past 'visited' fits the completed past time frame set by 'When I was in Mizoram'.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [
      "mizoram"
    ],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-289",
    "subject": "english",
    "topic": "verb-forms",
    "topicLabel": "Correct Verb Forms",
    "difficulty": "medium",
    "question": "He used to visit us every week, but he _________ now.",
    "options": [
      "rarely comes",
      "is rarely coming",
      "has rarely come",
      "was rarely come"
    ],
    "answerIndex": 0,
    "explanation": "Simple present 'rarely comes' correctly contrasts with the past habitual 'used to visit'.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-290",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "His professional ability proves that he is cut _________ for this job.",
    "options": [
      "out",
      "up",
      "above",
      "down"
    ],
    "answerIndex": 0,
    "explanation": "'Cut out for' is the correct idiomatic phrase meaning naturally suited.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-291",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "The problem of communal discord cannot be glossed _________ by the government.",
    "options": [
      "at",
      "into",
      "over",
      "on"
    ],
    "answerIndex": 2,
    "explanation": "'Glossed over' means to conceal or play down an issue.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-292",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "After all, the hard work has come to tell _________ your health.",
    "options": [
      "in",
      "upon",
      "at",
      "over"
    ],
    "answerIndex": 1,
    "explanation": "'Tell upon' means to have a noticeable (usually negative) effect on.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-293",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "The Government acted judiciously to stave _________ the crisis.",
    "options": [
      "of",
      "out",
      "upon",
      "off"
    ],
    "answerIndex": 3,
    "explanation": "'Stave off' means to prevent or avert something.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-294",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "He has great antipathy _________ those who are hypocrites.",
    "options": [
      "against",
      "to",
      "for",
      "between"
    ],
    "answerIndex": 1,
    "explanation": "'Antipathy to' is the standard idiomatic collocation.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-295",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "The whole town plunged _________ sorrow after the massacre of the students.",
    "options": [
      "in",
      "into",
      "onto",
      "at"
    ],
    "answerIndex": 1,
    "explanation": "'Plunged into sorrow' is the correct idiomatic phrase.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-296",
    "subject": "english",
    "topic": "sentence-types",
    "topicLabel": "Simple, Compound, Complex Sentences",
    "difficulty": "medium",
    "question": "The horse reared and the rider was thrown off.",
    "options": [
      "Simple",
      "Compound",
      "Complex"
    ],
    "answerIndex": 1,
    "explanation": "Two independent clauses joined by 'and' make this a Compound sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-297",
    "subject": "english",
    "topic": "sentence-types",
    "topicLabel": "Simple, Compound, Complex Sentences",
    "difficulty": "medium",
    "question": "He was a mere boy but he offered to fight the giant.",
    "options": [
      "Simple",
      "Compound",
      "Complex"
    ],
    "answerIndex": 1,
    "explanation": "Two independent clauses joined by 'but' make this a Compound sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-298",
    "subject": "english",
    "topic": "sentence-types",
    "topicLabel": "Simple, Compound, Complex Sentences",
    "difficulty": "easy",
    "question": "Healthy persons have no need of the physician.",
    "options": [
      "Simple",
      "Compound",
      "Complex"
    ],
    "answerIndex": 0,
    "explanation": "This is a single-clause Simple sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-299",
    "subject": "english",
    "topic": "sentence-types",
    "topicLabel": "Simple, Compound, Complex Sentences",
    "difficulty": "medium",
    "question": "The place where Buddha was cremated has recently been discovered.",
    "options": [
      "Simple",
      "Compound",
      "Complex"
    ],
    "answerIndex": 2,
    "explanation": "The relative clause 'where Buddha was cremated' makes this a Complex sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-300",
    "subject": "english",
    "topic": "sentence-types",
    "topicLabel": "Simple, Compound, Complex Sentences",
    "difficulty": "easy",
    "question": "I have no advice to offer you.",
    "options": [
      "Simple",
      "Compound",
      "Complex"
    ],
    "answerIndex": 0,
    "explanation": "This is a single-clause Simple sentence with an infinitive phrase.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-301",
    "subject": "english",
    "topic": "sentence-types",
    "topicLabel": "Simple, Compound, Complex Sentences",
    "difficulty": "medium",
    "question": "We came upon a hut where a peasant lived.",
    "options": [
      "Simple",
      "Compound",
      "Complex"
    ],
    "answerIndex": 2,
    "explanation": "The relative clause 'where a peasant lived' makes this a Complex sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-302",
    "subject": "english",
    "topic": "sentence-types",
    "topicLabel": "Simple, Compound, Complex Sentences",
    "difficulty": "medium",
    "question": "Man proposes, but God disposes.",
    "options": [
      "Simple",
      "Compound",
      "Complex"
    ],
    "answerIndex": 1,
    "explanation": "Two independent clauses joined by 'but' make this a Compound sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-303",
    "subject": "english",
    "topic": "sentence-types",
    "topicLabel": "Simple, Compound, Complex Sentences",
    "difficulty": "medium",
    "question": "Except that he hurt his hand, he was lucky.",
    "options": [
      "Simple",
      "Compound",
      "Complex"
    ],
    "answerIndex": 2,
    "explanation": "The subordinate clause 'Except that he hurt his hand' makes this a Complex sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-304",
    "subject": "english",
    "topic": "sentence-types",
    "topicLabel": "Simple, Compound, Complex Sentences",
    "difficulty": "medium",
    "question": "They serve God well who serves His creatures.",
    "options": [
      "Simple",
      "Compound",
      "Complex"
    ],
    "answerIndex": 2,
    "explanation": "The relative clause 'who serves His creatures' makes this a Complex sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-305",
    "subject": "english",
    "topic": "sentence-types",
    "topicLabel": "Simple, Compound, Complex Sentences",
    "difficulty": "easy",
    "question": "His courage won him honour.",
    "options": [
      "Simple",
      "Compound",
      "Complex"
    ],
    "answerIndex": 0,
    "explanation": "This is a single-clause Simple sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-306",
    "subject": "english",
    "topic": "sentence-classification",
    "topicLabel": "Sentence Classification",
    "difficulty": "medium",
    "question": "None but a coward would say so.",
    "options": [
      "Affirmative",
      "Negative",
      "Interrogative",
      "Assertive"
    ],
    "answerIndex": 1,
    "explanation": "'None but' is a negative construction, making this a Negative sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-307",
    "subject": "english",
    "topic": "sentence-classification",
    "topicLabel": "Sentence Classification",
    "difficulty": "medium",
    "question": "I was doubtful whether it was you.",
    "options": [
      "Affirmative",
      "Negative",
      "Interrogative",
      "Imperative"
    ],
    "answerIndex": 0,
    "explanation": "This is a plain statement (declarative), hence Affirmative.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-308",
    "subject": "english",
    "topic": "sentence-classification",
    "topicLabel": "Sentence Classification",
    "difficulty": "medium",
    "question": "Oh that I had wings!",
    "options": [
      "Affirmative",
      "Exclamatory",
      "Interrogative",
      "Imperative"
    ],
    "answerIndex": 1,
    "explanation": "This expresses a strong wish with an exclamation mark, hence Exclamatory.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-309",
    "subject": "english",
    "topic": "sentence-classification",
    "topicLabel": "Sentence Classification",
    "difficulty": "easy",
    "question": "Get out of the room quickly.",
    "options": [
      "Affirmative",
      "Exclamatory",
      "Interrogative",
      "Imperative"
    ],
    "answerIndex": 3,
    "explanation": "This is a command, hence Imperative.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-310",
    "subject": "english",
    "topic": "sentence-classification",
    "topicLabel": "Sentence Classification",
    "difficulty": "medium",
    "question": "Their glory can never fade.",
    "options": [
      "Imperative",
      "Negative",
      "Interrogative",
      "Assertive"
    ],
    "answerIndex": 3,
    "explanation": "This is a declarative statement, hence Assertive.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-311",
    "subject": "english",
    "topic": "vocabulary-fill-blanks",
    "topicLabel": "Vocabulary Fill in the Blanks",
    "difficulty": "medium",
    "question": "The volcanic _________ was the cause of great devastation.",
    "options": [
      "outburst",
      "eruption",
      "erosion",
      "movement"
    ],
    "answerIndex": 1,
    "explanation": "'Volcanic eruption' is the standard collocation.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-312",
    "subject": "english",
    "topic": "vocabulary-fill-blanks",
    "topicLabel": "Vocabulary Fill in the Blanks",
    "difficulty": "medium",
    "question": "Although they are not rich,they always wear _________ clothes.",
    "options": [
      "respectful",
      "respective",
      "respectable",
      "respected"
    ],
    "answerIndex": 2,
    "explanation": "'Respectable clothes' means decent, presentable clothing.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-313",
    "subject": "english",
    "topic": "vocabulary-fill-blanks",
    "topicLabel": "Vocabulary Fill in the Blanks",
    "difficulty": "hard",
    "question": "Even a _________ glance will reveal the mystery.",
    "options": [
      "crude",
      "critical",
      "cursory",
      "curious"
    ],
    "answerIndex": 2,
    "explanation": "'Cursory' means quick and not thorough, fitting the sense of even a brief glance revealing something.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-314",
    "subject": "english",
    "topic": "vocabulary-fill-blanks",
    "topicLabel": "Vocabulary Fill in the Blanks",
    "difficulty": "medium",
    "question": "Like any other country India has its _________ share of superstitions.",
    "options": [
      "Peculiar",
      "fair",
      "proper",
      "abundant"
    ],
    "answerIndex": 1,
    "explanation": "'Fair share' is the idiomatic phrase.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-315",
    "subject": "english",
    "topic": "vocabulary-fill-blanks",
    "topicLabel": "Vocabulary Fill in the Blanks",
    "difficulty": "medium",
    "question": "We _________ trouble on our borders.",
    "options": [
      "comprehend",
      "supplement",
      "complement",
      "apprehend"
    ],
    "answerIndex": 3,
    "explanation": "'Apprehend' means to anticipate with concern.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-316",
    "subject": "english",
    "topic": "vocabulary-fill-blanks",
    "topicLabel": "Vocabulary Fill in the Blanks",
    "difficulty": "medium",
    "question": "If you drink too much, it will _________ your judgement.",
    "options": [
      "impede",
      "impair",
      "impose",
      "impose"
    ],
    "answerIndex": 1,
    "explanation": "'Impair' means to weaken or damage, fitting the effect on judgement.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-317",
    "subject": "english",
    "topic": "vocabulary-fill-blanks",
    "topicLabel": "Vocabulary Fill in the Blanks",
    "difficulty": "medium",
    "question": "Robert was _________ with a natural talent for music.",
    "options": [
      "given",
      "found",
      "endowed",
      "entrusted"
    ],
    "answerIndex": 2,
    "explanation": "'Endowed with' is the standard collocation for natural talent.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-318",
    "subject": "english",
    "topic": "vocabulary-fill-blanks",
    "topicLabel": "Vocabulary Fill in the Blanks",
    "difficulty": "medium",
    "question": "There was a serious _________ between the two brothers.",
    "options": [
      "altercation",
      "alteration",
      "aberration",
      "assimilation"
    ],
    "answerIndex": 0,
    "explanation": "'Altercation' means a noisy quarrel or dispute.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-319",
    "subject": "english",
    "topic": "vocabulary-fill-blanks",
    "topicLabel": "Vocabulary Fill in the Blanks",
    "difficulty": "medium",
    "question": "The committee's appeal to the people for money _________ little response.",
    "options": [
      "evoked",
      "provoked",
      "promoted",
      "provided"
    ],
    "answerIndex": 0,
    "explanation": "'Evoked' means to bring forth a response.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-320",
    "subject": "english",
    "topic": "vocabulary-fill-blanks",
    "topicLabel": "Vocabulary Fill in the Blanks",
    "difficulty": "medium",
    "question": "The photographs in the papers bore no _________ at all to the original.",
    "options": [
      "nearness",
      "resemblance",
      "identity",
      "comparison"
    ],
    "answerIndex": 1,
    "explanation": "'Bore no resemblance to' is the standard idiomatic phrase.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-321",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "Get cold feet",
    "options": [
      "to run for life",
      "to get cold",
      "to be afraid",
      "to become discourteous"
    ],
    "answerIndex": 2,
    "explanation": "'Get cold feet' means to become afraid or hesitant.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-322",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "An apple of discord",
    "options": [
      "the cause of a contention",
      "sour apple",
      "a quarrel",
      "a fight for an apple"
    ],
    "answerIndex": 0,
    "explanation": "'An apple of discord' means the cause of a quarrel or dispute.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-323",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "A skeleton in one's cupboard",
    "options": [
      "a skeleton in a closet",
      "a secret murder",
      "something embarassing kept as asecret",
      "a hidden skeleton"
    ],
    "answerIndex": 2,
    "explanation": "'A skeleton in one's cupboard' means an embarrassing secret.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-324",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "Sail in the same boat",
    "options": [
      "in similar circumstances",
      "sail in one boat",
      "a boat with sails",
      "enjoy boating"
    ],
    "answerIndex": 0,
    "explanation": "'Sail in the same boat' means to be in similar circumstances as others.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-325",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "A red- letter day",
    "options": [
      "a colourful day",
      "fatal day",
      "happy and significant day",
      "hapless day"
    ],
    "answerIndex": 2,
    "explanation": "'A red-letter day' means a happy and memorable day.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-326",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "At beck and call",
    "options": [
      "at rest",
      "at disposal",
      "at work",
      "at their desk"
    ],
    "answerIndex": 1,
    "explanation": "'At beck and call' means always available at someone's disposal.",
    "source": "MPSC (Mizoram)",
    "year": 2019,
    "tags": [],
    "paperId": "mpsc-direct-2019-soil-conservation-ranger-general-english"
  },
  {
    "id": "mpsc-og-3-327",
    "subject": "english",
    "topic": "verb-forms",
    "topicLabel": "Correct Verb Forms",
    "difficulty": "easy",
    "question": "The policeman ___________ the thief red-handed.",
    "options": [
      "catch",
      "caught",
      "is caught",
      "catching"
    ],
    "answerIndex": 1,
    "explanation": "Simple past 'caught' correctly completes this narrative sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-328",
    "subject": "english",
    "topic": "verb-forms",
    "topicLabel": "Correct Verb Forms",
    "difficulty": "medium",
    "question": "I do not think I ___________ be able to go.",
    "options": [
      "will",
      "may",
      "would",
      "shall"
    ],
    "answerIndex": 0,
    "explanation": "'Will' fits naturally with 'I do not think' expressing a future prediction.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-329",
    "subject": "english",
    "topic": "verb-forms",
    "topicLabel": "Correct Verb Forms",
    "difficulty": "medium",
    "question": "The whole day yesterday, the boys ___________ to the cricket commentary.",
    "options": [
      "listen",
      "will listen",
      "has listened",
      "listened"
    ],
    "answerIndex": 3,
    "explanation": "Simple past 'listened' fits the completed past-day time frame.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-330",
    "subject": "english",
    "topic": "verb-forms",
    "topicLabel": "Correct Verb Forms",
    "difficulty": "medium",
    "question": "I wish you ___________ tell me earlier.",
    "options": [
      "would",
      "could",
      "shall",
      "will"
    ],
    "answerIndex": 0,
    "explanation": "'Wish... would' is the standard construction for expressing a wish about someone else's willingness.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-331",
    "subject": "english",
    "topic": "verb-forms",
    "topicLabel": "Correct Verb Forms",
    "difficulty": "medium",
    "question": "After ___________ into the bus we discovered that we had boarded the wrong one.",
    "options": [
      "got",
      "get",
      "getting",
      "had got"
    ],
    "answerIndex": 2,
    "explanation": "The gerund 'getting' correctly follows the preposition 'After'.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-332",
    "subject": "english",
    "topic": "modals",
    "topicLabel": "Modal Verbs",
    "difficulty": "medium",
    "question": "You ___________ to pay your debts.",
    "options": [
      "must",
      "should",
      "ought",
      "will"
    ],
    "answerIndex": 2,
    "explanation": "'Ought to pay' is the correct modal construction with 'to'.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-333",
    "subject": "english",
    "topic": "verb-forms",
    "topicLabel": "Correct Verb Forms",
    "difficulty": "medium",
    "question": "Last week some wicked people ___________ brown sugar into the town but they were arrested.",
    "options": [
      "smuggled",
      "smuggle",
      "have smuggled",
      "are smuggling"
    ],
    "answerIndex": 0,
    "explanation": "Simple past 'smuggled' fits the completed past time frame ('Last week... were arrested').",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-334",
    "subject": "english",
    "topic": "modals",
    "topicLabel": "Modal Verbs",
    "difficulty": "medium",
    "question": "Students ___________ get up early.",
    "options": [
      "must",
      "shall",
      "should",
      "would"
    ],
    "answerIndex": 0,
    "explanation": "'Must' expresses a rule/obligation expected of students.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-335",
    "subject": "english",
    "topic": "verb-forms",
    "topicLabel": "Correct Verb Forms",
    "difficulty": "hard",
    "question": "In the morning, he ___________ a torn shirt but in the evening he changed it.",
    "options": [
      "is put on",
      "had put on",
      "has put on",
      "was put on"
    ],
    "answerIndex": 1,
    "explanation": "Past perfect 'had put on' correctly describes an action completed before the evening reference point.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-336",
    "subject": "english",
    "topic": "verb-forms",
    "topicLabel": "Correct Verb Forms",
    "difficulty": "medium",
    "question": "I thought he ___________ at home.",
    "options": [
      "will",
      "shall",
      "might",
      "would"
    ],
    "answerIndex": 3,
    "explanation": "Reported speech backshifts 'will' to 'would' when reporting in the past tense.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-337",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "The thief entered the house __________ the window.",
    "options": [
      "by",
      "on",
      "through",
      "into"
    ],
    "answerIndex": 2,
    "explanation": "'Through the window' is the correct preposition for entering via an opening.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-338",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "You must abide __________ the rules of the organisation.",
    "options": [
      "to",
      "by",
      "with",
      "on"
    ],
    "answerIndex": 1,
    "explanation": "'Abide by' is the standard idiomatic phrase meaning to comply with.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-339",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "There is no unity __________ the players.",
    "options": [
      "with",
      "between",
      "towards",
      "among"
    ],
    "answerIndex": 3,
    "explanation": "'Among' is used for more than two people/things, fitting 'the players'.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-340",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "His illness has taken a turn __________ the worst.",
    "options": [
      "for",
      "to",
      "of",
      "on"
    ],
    "answerIndex": 0,
    "explanation": "'A turn for the worst' is the standard idiomatic phrase.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-341",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "The tiger jumped __________ the fence.",
    "options": [
      "through",
      "over",
      "across",
      "above"
    ],
    "answerIndex": 1,
    "explanation": "'Jumped over' is the correct preposition for clearing an obstacle.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-342",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "They sat __________ campfires and sang all night.",
    "options": [
      "round",
      "over",
      "besides",
      "through"
    ],
    "answerIndex": 0,
    "explanation": "'Sat round campfires' is the idiomatic phrase for sitting in a circle around a fire.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-343",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "Are you wearing anything __________ your cardigan?",
    "options": [
      "under",
      "underneath",
      "below",
      "by"
    ],
    "answerIndex": 1,
    "explanation": "'Underneath' fits naturally when referring to a layer worn beneath a cardigan.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-344",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "He is arriving __________ the 3:30 bus.",
    "options": [
      "to",
      "by",
      "in",
      "on"
    ],
    "answerIndex": 3,
    "explanation": "'Arriving on the 3:30 bus' is the idiomatic usage for a specific scheduled service.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-345",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "He succumbed __________ his injuries.",
    "options": [
      "to",
      "with",
      "for",
      "in"
    ],
    "answerIndex": 0,
    "explanation": "'Succumbed to' is the standard idiomatic phrase.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-346",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "She is not interested __________ buying new clothes now.",
    "options": [
      "to",
      "for",
      "in",
      "at"
    ],
    "answerIndex": 2,
    "explanation": "'Interested in' is the standard idiomatic collocation.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-347",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "I told the students to buckle down this semester.",
    "options": [
      "work seriously",
      "take it easy",
      "drop a subject",
      "go for a vacation"
    ],
    "answerIndex": 0,
    "explanation": "'Buckle down' means to start working seriously and with effort.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-348",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "This is a hard nut to crack.",
    "options": [
      "expensive thing",
      "a difficult problem",
      "a foolish search",
      "an easy question"
    ],
    "answerIndex": 1,
    "explanation": "'A hard nut to crack' means a difficult problem to solve.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-349",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "Mrs. Roy keeps an open house on Saturday evening parties, you'll find all kinds of people there.",
    "options": [
      "welcomes all members",
      "welcomes a select group",
      "keeps the door of the house open",
      "keeps the gates open for a few people."
    ],
    "answerIndex": 0,
    "explanation": "'Keeps an open house' means she welcomes everyone without restriction.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-350",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "The master loves to rock the boat.",
    "options": [
      "to conspire against",
      "to agitate against",
      "to upset the balance",
      "to create difficulties."
    ],
    "answerIndex": 2,
    "explanation": "'Rock the boat' means to disturb a stable situation or upset the balance.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-351",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "I go to the theatre once in a blue moon.",
    "options": [
      "often",
      "infrequently",
      "daily",
      "always"
    ],
    "answerIndex": 1,
    "explanation": "'Once in a blue moon' means very infrequently.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-352",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "The Maths test was a piece of cake.",
    "options": [
      "hard",
      "easy",
      "problematic",
      "difficult"
    ],
    "answerIndex": 1,
    "explanation": "'A piece of cake' means something very easy.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-353",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "The ball is in your court, its up to you.",
    "options": [
      "your decision",
      "accomplish",
      "miss the chance you have to",
      "congenial"
    ],
    "answerIndex": 0,
    "explanation": "'The ball is in your court' means it is now your responsibility/decision.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-354",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "He was in the doldrums after being insulted.",
    "options": [
      "low spirits",
      "hilarious",
      "high spirited",
      "dedicated"
    ],
    "answerIndex": 0,
    "explanation": "'In the doldrums' means in low spirits or a state of gloom.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-355",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "The sisters finally saw eye to eye on the matter.",
    "options": [
      "agreed",
      "disagreed",
      "watched",
      "differed"
    ],
    "answerIndex": 0,
    "explanation": "'Saw eye to eye' means to be in full agreement.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-356",
    "subject": "english",
    "topic": "notion-and-concept",
    "topicLabel": "Notion/Concept of Sentences",
    "difficulty": "medium",
    "question": "It may be sunny today.",
    "options": [
      "habitual",
      "purpose",
      "possibility",
      "ability"
    ],
    "answerIndex": 2,
    "explanation": "'May' expresses possibility here.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-357",
    "subject": "english",
    "topic": "notion-and-concept",
    "topicLabel": "Notion/Concept of Sentences",
    "difficulty": "easy",
    "question": "One must always respect and treat the elders well.",
    "options": [
      "habitual",
      "obligation",
      "possibility",
      "purpose"
    ],
    "answerIndex": 1,
    "explanation": "'Must' expresses obligation.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-358",
    "subject": "english",
    "topic": "notion-and-concept",
    "topicLabel": "Notion/Concept of Sentences",
    "difficulty": "easy",
    "question": "Keep quiet.",
    "options": [
      "order",
      "request",
      "prohibition",
      "duty"
    ],
    "answerIndex": 0,
    "explanation": "This is a direct command, expressing an order.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-359",
    "subject": "english",
    "topic": "notion-and-concept",
    "topicLabel": "Notion/Concept of Sentences",
    "difficulty": "medium",
    "question": "Would you kindly come along with us.",
    "options": [
      "order",
      "request",
      "duty",
      "purpose"
    ],
    "answerIndex": 1,
    "explanation": "The polite phrasing 'Would you kindly' expresses a request.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-360",
    "subject": "english",
    "topic": "notion-and-concept",
    "topicLabel": "Notion/Concept of Sentences",
    "difficulty": "medium",
    "question": "The family usually travel by air.",
    "options": [
      "condition",
      "habitual",
      "purpose",
      "obligation"
    ],
    "answerIndex": 1,
    "explanation": "'Usually' indicates a habitual action.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-361",
    "subject": "english",
    "topic": "notion-and-concept",
    "topicLabel": "Notion/Concept of Sentences",
    "difficulty": "medium",
    "question": "Don't smoke please.",
    "options": [
      "request",
      "command",
      "advice",
      "duty"
    ],
    "answerIndex": 0,
    "explanation": "The word 'please' softens this into a polite request.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-362",
    "subject": "english",
    "topic": "notion-and-concept",
    "topicLabel": "Notion/Concept of Sentences",
    "difficulty": "easy",
    "question": "Get out.",
    "options": [
      "duty",
      "command",
      "request",
      "purpose"
    ],
    "answerIndex": 1,
    "explanation": "This blunt directive expresses a command.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-363",
    "subject": "english",
    "topic": "notion-and-concept",
    "topicLabel": "Notion/Concept of Sentences",
    "difficulty": "medium",
    "question": "Have fun at the fair.",
    "options": [
      "wish",
      "duty",
      "possibility",
      "threat"
    ],
    "answerIndex": 0,
    "explanation": "This expresses a wish for someone's enjoyment.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-364",
    "subject": "english",
    "topic": "notion-and-concept",
    "topicLabel": "Notion/Concept of Sentences",
    "difficulty": "medium",
    "question": "Feed the fish once a day.",
    "options": [
      "instruction",
      "obligation",
      "purpose",
      "habitual"
    ],
    "answerIndex": 0,
    "explanation": "This is a direct instruction on how to care for the fish.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-365",
    "subject": "english",
    "topic": "notion-and-concept",
    "topicLabel": "Notion/Concept of Sentences",
    "difficulty": "medium",
    "question": "Do have tea with me.",
    "options": [
      "invitation",
      "duty",
      "purpose",
      "order"
    ],
    "answerIndex": 0,
    "explanation": "'Do have tea with me' is a polite invitation.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-366",
    "subject": "english",
    "topic": "conjunctions",
    "topicLabel": "Conjunctions",
    "difficulty": "medium",
    "question": "He finished first __________ he began late.",
    "options": [
      "but",
      "though",
      "for",
      "because"
    ],
    "answerIndex": 1,
    "explanation": "'Though' correctly introduces the contrast between finishing first despite a late start.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-367",
    "subject": "english",
    "topic": "conjunctions",
    "topicLabel": "Conjunctions",
    "difficulty": "medium",
    "question": "My grandfather died __________ I was born.",
    "options": [
      "before",
      "since",
      "because",
      "or"
    ],
    "answerIndex": 0,
    "explanation": "'Before I was born' correctly places the death prior to the speaker's birth.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-368",
    "subject": "english",
    "topic": "conjunctions",
    "topicLabel": "Conjunctions",
    "difficulty": "easy",
    "question": "Come in __________ go out.",
    "options": [
      "and",
      "or",
      "but",
      "however"
    ],
    "answerIndex": 1,
    "explanation": "'Or' presents the alternative choice.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-369",
    "subject": "english",
    "topic": "conjunctions",
    "topicLabel": "Conjunctions",
    "difficulty": "medium",
    "question": "The war was lost; __________ the country was occupied.",
    "options": [
      "consequently",
      "however",
      "otherwise",
      "or"
    ],
    "answerIndex": 0,
    "explanation": "'Consequently' shows the war's loss led to the country's occupation.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-370",
    "subject": "english",
    "topic": "conjunctions",
    "topicLabel": "Conjunctions",
    "difficulty": "medium",
    "question": "I started on time __________ was late.",
    "options": [
      "and",
      "or",
      "but",
      "otherwise"
    ],
    "answerIndex": 2,
    "explanation": "'But' introduces the contrast between starting on time and still being late.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-371",
    "subject": "english",
    "topic": "conjunctions",
    "topicLabel": "Conjunctions",
    "difficulty": "medium",
    "question": "She was late, __________ the game had not started.",
    "options": [
      "but",
      "and",
      "however",
      "or"
    ],
    "answerIndex": 0,
    "explanation": "'But' introduces the fortunate contrast that the game hadn't started yet.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-372",
    "subject": "english",
    "topic": "conjunctions",
    "topicLabel": "Conjunctions",
    "difficulty": "medium",
    "question": "I was sick; __________ ,I did not go to work.",
    "options": [
      "because",
      "therefore",
      "since",
      "still"
    ],
    "answerIndex": 1,
    "explanation": "'Therefore' shows the sickness as the reason for not going to work.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-373",
    "subject": "english",
    "topic": "conjunctions",
    "topicLabel": "Conjunctions",
    "difficulty": "medium",
    "question": "He has car, __________ he can't drive it.",
    "options": [
      "therefore",
      "yet",
      "consequently",
      "because"
    ],
    "answerIndex": 1,
    "explanation": "'Yet' introduces the contrast/concession between having a car and not being able to drive.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-374",
    "subject": "english",
    "topic": "conjunctions",
    "topicLabel": "Conjunctions",
    "difficulty": "medium",
    "question": "I have graduated, __________ I will go on training.",
    "options": [
      "so",
      "or",
      "and",
      "yet"
    ],
    "answerIndex": 2,
    "explanation": "'And' connects the two sequential actions.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-375",
    "subject": "english",
    "topic": "one-word-substitution",
    "topicLabel": "One Word Substitution",
    "difficulty": "medium",
    "question": "One who is not sure about God's existence:",
    "options": [
      "atheist",
      "ascetic",
      "anarchist",
      "agnostic"
    ],
    "answerIndex": 3,
    "explanation": "An 'agnostic' is someone who is uncertain about the existence of God.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-376",
    "subject": "english",
    "topic": "one-word-substitution",
    "topicLabel": "One Word Substitution",
    "difficulty": "medium",
    "question": "A lover of oneself:",
    "options": [
      "polyglot",
      "numismatist",
      "narcissist",
      "hedonist"
    ],
    "answerIndex": 2,
    "explanation": "A 'narcissist' is someone excessively self-admiring.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-377",
    "subject": "english",
    "topic": "one-word-substitution",
    "topicLabel": "One Word Substitution",
    "difficulty": "medium",
    "question": "One who does not care for art and literature:",
    "options": [
      "stoic",
      "pacifist",
      "philistine",
      "misogamist"
    ],
    "answerIndex": 2,
    "explanation": "A 'philistine' is indifferent or hostile to art and culture.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-378",
    "subject": "english",
    "topic": "one-word-substitution",
    "topicLabel": "One Word Substitution",
    "difficulty": "medium",
    "question": "An unconventional style of living:",
    "options": [
      "bohemian",
      "heretic",
      "effeminate",
      "pyromania"
    ],
    "answerIndex": 0,
    "explanation": "'Bohemian' describes an unconventional lifestyle, often associated with artists.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-379",
    "subject": "english",
    "topic": "one-word-substitution",
    "topicLabel": "One Word Substitution",
    "difficulty": "medium",
    "question": "One who is a centre of attraction:",
    "options": [
      "iconoclast",
      "cynosure",
      "henpeck",
      "agoraphobe"
    ],
    "answerIndex": 1,
    "explanation": "A 'cynosure' is a person or thing that is the centre of attention.",
    "source": "MPSC (Mizoram)",
    "year": 2018,
    "tags": [],
    "paperId": "mpsc-direct-2018-acf-general-english"
  },
  {
    "id": "mpsc-og-3-380",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "I am not interested about anything that happened ___ the very remote past.",
    "options": [
      "with",
      "in",
      "on",
      "at"
    ],
    "answerIndex": 1,
    "explanation": "'In the very remote past' is the correct preposition for a period of time.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-381",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "She made a point ____ coming late so that everyone would look at her.",
    "options": [
      "of",
      "at",
      "in",
      "about"
    ],
    "answerIndex": 0,
    "explanation": "'Made a point of' is the standard idiomatic phrase.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-382",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "I'm not exactly keen ____ cooking; but I prefer it to washing.",
    "options": [
      "at",
      "in",
      "of",
      "on"
    ],
    "answerIndex": 3,
    "explanation": "'Keen on' is the standard idiomatic collocation.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-383",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "Passengers may leave bulky articles under the stairs ____ the conductor's permission.",
    "options": [
      "with",
      "by",
      "at",
      "for"
    ],
    "answerIndex": 0,
    "explanation": "'With the conductor's permission' is the correct preposition usage.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-384",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "As she was getting _____ the car one of her buttons fell off.",
    "options": [
      "on",
      "in",
      "into",
      "by"
    ],
    "answerIndex": 2,
    "explanation": "'Getting into the car' is the correct preposition for entering a car.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-385",
    "subject": "english",
    "topic": "conjunctions",
    "topicLabel": "Conjunctions",
    "difficulty": "easy",
    "question": "You will not succeed ___________ you work hard.",
    "options": [
      "unless",
      "if",
      "because",
      "although"
    ],
    "answerIndex": 0,
    "explanation": "'Unless you work hard' correctly expresses the necessary condition for success.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-386",
    "subject": "english",
    "topic": "conjunctions",
    "topicLabel": "Conjunctions",
    "difficulty": "medium",
    "question": "She acted __________ she knew everything about the matter.",
    "options": [
      "because",
      "although",
      "as if",
      "unless"
    ],
    "answerIndex": 2,
    "explanation": "'As if' correctly introduces a hypothetical manner of acting.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-387",
    "subject": "english",
    "topic": "conjunctions",
    "topicLabel": "Conjunctions",
    "difficulty": "medium",
    "question": "__________ you apologize, I will not forgive you.",
    "options": [
      "If",
      "Unless",
      "Because",
      "Although"
    ],
    "answerIndex": 1,
    "explanation": "'Unless you apologize' expresses the necessary condition for forgiveness.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-388",
    "subject": "english",
    "topic": "conjunctions",
    "topicLabel": "Conjunctions",
    "difficulty": "medium",
    "question": "I don't know ___________ he will come or not.",
    "options": [
      "whether",
      "although",
      "because",
      "unless"
    ],
    "answerIndex": 0,
    "explanation": "'Whether... or not' is the standard construction expressing uncertainty between alternatives.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-389",
    "subject": "english",
    "topic": "conjunctions",
    "topicLabel": "Conjunctions",
    "difficulty": "medium",
    "question": "She kept quiet __________ she was angry.",
    "options": [
      "although",
      "because",
      "so",
      "unless"
    ],
    "answerIndex": 1,
    "explanation": "'Because she was angry' gives the reason for keeping quiet.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-390",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "easy",
    "question": "She walked __________ the room quietly.",
    "options": [
      "on",
      "of",
      "across",
      "out"
    ],
    "answerIndex": 2,
    "explanation": "'Walked across the room' correctly describes movement from one side to the other.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-391",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "easy",
    "question": "The picture is hanging ___________ the wall.",
    "options": [
      "at",
      "on",
      "of",
      "for"
    ],
    "answerIndex": 1,
    "explanation": "'Hanging on the wall' is the standard idiomatic phrase.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-392",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "I have been waiting _______ more than two hours.",
    "options": [
      "till",
      "some",
      "for",
      "to"
    ],
    "answerIndex": 2,
    "explanation": "'For more than two hours' correctly indicates a duration.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-393",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "easy",
    "question": "They travelled _______ train.",
    "options": [
      "by",
      "in",
      "at",
      "to"
    ],
    "answerIndex": 0,
    "explanation": "'By train' is the standard idiomatic phrase for a mode of transport.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-394",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "easy",
    "question": "He jumped ________ the river.",
    "options": [
      "at",
      "on",
      "by",
      "into"
    ],
    "answerIndex": 3,
    "explanation": "'Jumped into the river' correctly describes movement into water.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-395",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "easy",
    "question": "She is interested _______ dancing.",
    "options": [
      "in",
      "at",
      "On",
      "to"
    ],
    "answerIndex": 0,
    "explanation": "'Interested in' is the standard idiomatic collocation.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-396",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "medium",
    "question": "He stood _______ the door wairing.",
    "options": [
      "on",
      "in",
      "at",
      "for"
    ],
    "answerIndex": 2,
    "explanation": "'Stood at the door' correctly describes a fixed position.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-397",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "easy",
    "question": "He is afraid _____ the dark.",
    "options": [
      "of",
      "at",
      "with",
      "to"
    ],
    "answerIndex": 0,
    "explanation": "'Afraid of' is the standard idiomatic collocation.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-398",
    "subject": "english",
    "topic": "prepositions",
    "topicLabel": "Prepositions",
    "difficulty": "easy",
    "question": "She was born _____ 1960.",
    "options": [
      "at",
      "in",
      "on",
      "by"
    ],
    "answerIndex": 1,
    "explanation": "'Born in 1960' is the correct preposition for a year.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-399",
    "subject": "english",
    "topic": "vocabulary",
    "topicLabel": "Vocabulary",
    "difficulty": "medium",
    "question": "His speech was so _________ that even critics praised his clarity and depth.",
    "options": [
      "verbose",
      "eloquent",
      "taciturn",
      "ambiguous"
    ],
    "answerIndex": 1,
    "explanation": "'Eloquent' fits the praise for clarity and depth of speech.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-400",
    "subject": "english",
    "topic": "vocabulary",
    "topicLabel": "Vocabulary",
    "difficulty": "medium",
    "question": "The scientist's theory was initially met with __________ , but later gained acceptance.",
    "options": [
      "scepticism",
      "acclaim",
      "enthusiasm",
      "compliance"
    ],
    "answerIndex": 0,
    "explanation": "'Scepticism' contrasts with the theory 'later gaining acceptance'.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-401",
    "subject": "english",
    "topic": "vocabulary",
    "topicLabel": "Vocabulary",
    "difficulty": "medium",
    "question": "She gave a __________ smile, hiding her true disappointment.",
    "options": [
      "radiant",
      "benevolent",
      "forced",
      "genuine"
    ],
    "answerIndex": 2,
    "explanation": "'Forced' smile fits hiding true disappointment behind a fake expression.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-402",
    "subject": "english",
    "topic": "vocabulary",
    "topicLabel": "Vocabulary",
    "difficulty": "medium",
    "question": "The manager was accused of being _________ favoring only a select group of employees.",
    "options": [
      "impartial",
      "biased",
      "neutral",
      "objective"
    ],
    "answerIndex": 1,
    "explanation": "'Biased' fits favoring only a select group.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-403",
    "subject": "english",
    "topic": "vocabulary",
    "topicLabel": "Vocabulary",
    "difficulty": "medium",
    "question": "The child showed _______ curiosity, asking endless questions.",
    "options": [
      "limited",
      "indifferent",
      "reluctant",
      "insatiable"
    ],
    "answerIndex": 3,
    "explanation": "'Insatiable' curiosity fits asking endless questions.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-404",
    "subject": "english",
    "topic": "vocabulary",
    "topicLabel": "Vocabulary",
    "difficulty": "medium",
    "question": "Her success was not due to luck but to her _________ efforts.",
    "options": [
      "sporadic",
      "relentless",
      "casual",
      "indifferent"
    ],
    "answerIndex": 1,
    "explanation": "'Relentless' efforts fits success attributed to hard work rather than luck.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-405",
    "subject": "english",
    "topic": "vocabulary",
    "topicLabel": "Vocabulary",
    "difficulty": "medium",
    "question": "The lawyer's argument was so __________ that it weakened his entire case.",
    "options": [
      "flawed",
      "compelling",
      "persuasive",
      "logical"
    ],
    "answerIndex": 0,
    "explanation": "'Flawed' fits an argument that weakened the case, unlike the other positive options.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-406",
    "subject": "english",
    "topic": "vocabulary",
    "topicLabel": "Vocabulary",
    "difficulty": "medium",
    "question": "His remarks were ________ and offended many people.",
    "options": [
      "considerate",
      "insensitive",
      "polite",
      "thoughtful"
    ],
    "answerIndex": 1,
    "explanation": "'Insensitive' remarks fit the offense caused to many people.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-407",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "Although the market is volatile, investors are advised to keep their powder dry until the next quarter's results are released.",
    "options": [
      "To panic and sell all assets immediately",
      "To spend all resources instantly",
      "To keep gun powder in a dry place",
      "To remain cautious and ready for action"
    ],
    "answerIndex": 3,
    "explanation": "'Keep your powder dry' means to remain cautious and prepared for future action.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-408",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "His claim that all politicians are corrupt is a sweeping statement.",
    "options": [
      "Untrue declaration",
      "Misunderstanding",
      "Overly generalized statement",
      "Statement that is proven to be true"
    ],
    "answerIndex": 2,
    "explanation": "'A sweeping statement' is an overly generalized claim.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-409",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "The need for diversity and inclusion has come to the fore in many workplaces.",
    "options": [
      "Become prominent",
      "Be invincible",
      "Inconspicuous",
      "Ahead of others"
    ],
    "answerIndex": 0,
    "explanation": "'Come to the fore' means to become prominent or noticeable.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-410",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "It is said that he has a finger in the pie.",
    "options": [
      "To have no stake",
      "Be involved in something",
      "Have wealth and luxury",
      "Acquire distinction or glory"
    ],
    "answerIndex": 1,
    "explanation": "'A finger in the pie' means to be involved in some activity or matter.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-411",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms and Phrases",
    "difficulty": "medium",
    "question": "Growing up in the mountains, I've been surrounded by people who are the salt of the earth.",
    "options": [
      "Sensitive people",
      "Good and honest people",
      "Hard-working people",
      "Simple and carefree people"
    ],
    "answerIndex": 1,
    "explanation": "'Salt of the earth' refers to good, honest, dependable people.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-412",
    "subject": "english",
    "topic": "sentence-types",
    "topicLabel": "Simple, Compound, Complex Sentences",
    "difficulty": "medium",
    "question": "I have no time that I can waste on idle talk.",
    "options": [
      "Simple Sentence",
      "Compound Sentence",
      "Complex Sentence",
      "None of these"
    ],
    "answerIndex": 2,
    "explanation": "The relative clause 'that I can waste on idle talk' makes this a Complex Sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-413",
    "subject": "english",
    "topic": "sentence-classification",
    "topicLabel": "Sentence Classification",
    "difficulty": "medium",
    "question": "Not many people would be cruel to animals.",
    "options": [
      "Assertive Sentence",
      "Affirmative Sentence",
      "Negative Sentence",
      "Comparative Sentence"
    ],
    "answerIndex": 2,
    "explanation": "'Not many' is a negative quantifier, making this a Negative Sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-414",
    "subject": "english",
    "topic": "sentence-classification",
    "topicLabel": "Sentence Classification",
    "difficulty": "medium",
    "question": "Very few cities in India are as rich as Mumbai.",
    "options": [
      "Comparative Sentence",
      "Negative Sentence",
      "Affirmative Sentence",
      "Positive Sentence"
    ],
    "answerIndex": 0,
    "explanation": "The 'as...as' construction with 'very few' is a comparative structure, classifying this as a Comparative Sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-415",
    "subject": "english",
    "topic": "sentence-types",
    "topicLabel": "Simple, Compound, Complex Sentences",
    "difficulty": "medium",
    "question": "Do you not remember her who was formerly your foe?",
    "options": [
      "Complex Sentence",
      "Compound Sentence",
      "Simple Sentence",
      "None of these"
    ],
    "answerIndex": 0,
    "explanation": "The relative clause 'who was formerly your foe' makes this a Complex Sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-416",
    "subject": "english",
    "topic": "sentence-classification",
    "topicLabel": "Sentence Classification",
    "difficulty": "medium",
    "question": "There was a great fall, my countrymen.",
    "options": [
      "Affirmative Sentence",
      "Assertive Sentence",
      "Positive Sentence",
      "Exclamatory Sentence"
    ],
    "answerIndex": 1,
    "explanation": "This is a declarative statement (from Mark Antony's speech), hence an Assertive Sentence.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-417",
    "subject": "english",
    "topic": "sentence-classification",
    "topicLabel": "Sentence Classification",
    "difficulty": "easy",
    "question": "She enjoys reading books every evening.",
    "options": [
      "Imperative",
      "Affirmative",
      "Interrogative",
      "Exclamatory"
    ],
    "answerIndex": 1,
    "explanation": "This is a plain positive statement, hence Affirmative.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-418",
    "subject": "english",
    "topic": "sentence-classification",
    "topicLabel": "Sentence Classification",
    "difficulty": "easy",
    "question": "Choose the sentence that functions as Imperative.",
    "options": [
      "Do you like listening to music ?",
      "What a beautiful flower it is!",
      "Finish your work on time.",
      "He does not play football on Sundays."
    ],
    "answerIndex": 2,
    "explanation": "'Finish your work on time.' is a command, hence Imperative.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-419",
    "subject": "english",
    "topic": "phrase-types",
    "topicLabel": "Types of Phrases",
    "difficulty": "medium",
    "question": "Identify the underlined phrase : \"She spoke in a very soft voice.\"",
    "options": [
      "Adjective phrase",
      "Adverb phrase",
      "Noun Phrase",
      "Verb phrase"
    ],
    "answerIndex": 1,
    "explanation": "'In a very soft voice' modifies the verb 'spoke', describing manner, making it an Adverb phrase.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-420",
    "subject": "english",
    "topic": "phrase-types",
    "topicLabel": "Types of Phrases",
    "difficulty": "medium",
    "question": "Identify the underlined phrase : \"You could have been told the truth earlier.\"",
    "options": [
      "Adverb phrase",
      "Noun phrase",
      "Verb phrase",
      "Adjective phrase"
    ],
    "answerIndex": 2,
    "explanation": "'Could have been told' is a verb phrase.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-421",
    "subject": "english",
    "topic": "clause-types",
    "topicLabel": "Types of Clauses",
    "difficulty": "medium",
    "question": "Choose the correct Clause to complete the blank : \"He continued working _______ he was completely exhausted.",
    "options": [
      "since",
      "even though",
      "as if",
      "as long as"
    ],
    "answerIndex": 1,
    "explanation": "'Even though he was completely exhausted' correctly expresses concession/contrast.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-422",
    "subject": "english",
    "topic": "clause-types",
    "topicLabel": "Types of Clauses",
    "difficulty": "medium",
    "question": "Which is the correct Clause to complete the sentence ? \"The teacher asked me _________ .\"",
    "options": [
      "where was I going",
      "where I go",
      "where I was going",
      "where am I going"
    ],
    "answerIndex": 2,
    "explanation": "Reported speech noun clauses use normal word order and backshifted tense: 'where I was going'.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-423",
    "subject": "english",
    "topic": "conditionals",
    "topicLabel": "Conditional Sentences",
    "difficulty": "medium",
    "question": "Choose the correct conditional sentence.",
    "options": [
      "If you will work hard, you will succeed.",
      "If you worked hard, you will succeed.",
      "If you work hard, you would succeed.",
      "If you work hard, you will succeed."
    ],
    "answerIndex": 3,
    "explanation": "The First Conditional uses present tense in the if-clause and 'will' in the main clause: 'If you work hard, you will succeed.'",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-424",
    "subject": "english",
    "topic": "sentence-structure",
    "topicLabel": "Correct Sentence Structure",
    "difficulty": "hard",
    "question": "Pick the correctly structured sentence.",
    "options": [
      "Scarcely had I reached the station when the train had left.",
      "Scarcely I had reached the station when the train left.",
      "Scarcely had I reached the station when the train left.",
      "Scarcely had I reached the station than the train left."
    ],
    "answerIndex": 2,
    "explanation": "'Scarcely had...when' with inversion and simple past in the second clause is the correct structure.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-425",
    "subject": "english",
    "topic": "subject-verb-agreement",
    "topicLabel": "Subject-Verb Agreement",
    "difficulty": "medium",
    "question": "Which is the correct sentence?",
    "options": [
      "Each of the students has completed his work.",
      "Each of the students has completed their work.",
      "Each of the students have completed their work.",
      "Each of the students has completed their works."
    ],
    "answerIndex": 0,
    "explanation": "'Each' takes a singular verb ('has') and traditionally a singular possessive ('his').",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-426",
    "subject": "english",
    "topic": "sentence-structure",
    "topicLabel": "Correct Sentence Structure",
    "difficulty": "medium",
    "question": "Choose the correct complex sentence.",
    "options": [
      "He is too tired that he cannot walk.",
      "He is very tired that he cannot walk.",
      "He is such tired that he cannot walk.",
      "He is so tired that he cannot walk."
    ],
    "answerIndex": 3,
    "explanation": "'So...that' is the correct construction for expressing result/consequence.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-427",
    "subject": "english",
    "topic": "direct-indirect-speech",
    "topicLabel": "Direct and Indirect Speech",
    "difficulty": "medium",
    "question": "\"Have you anything to tell me, little bird?\" asked Ulysses.",
    "options": [
      "Ulysses asked of the bird if it has anything to tell him.",
      "Ulysses asked the bird whether it had anything to tell him.",
      "Ulysses asked the little bird if there is anything to tell him.",
      "Ulysses asked to the bird whether it has anything to tell him."
    ],
    "answerIndex": 1,
    "explanation": "Indirect speech requires backshifting 'have' to 'had' and using 'whether'.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-428",
    "subject": "english",
    "topic": "direct-indirect-speech",
    "topicLabel": "Direct and Indirect Speech",
    "difficulty": "medium",
    "question": "He said that he did not wish to see any of them and ordered them to go away.",
    "options": [
      "He said, \"I do not wish to see any of them so go away\"",
      "He ordered, \"I do not want to see any of you so go away\"",
      "He said, \"Go away, I did not wish to see any of you\"",
      "He said, \"I do not wish to see any of you; go away.'"
    ],
    "answerIndex": 3,
    "explanation": "Converting to direct speech restores present tense and second person: 'I do not wish to see any of you; go away.'",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-429",
    "subject": "english",
    "topic": "direct-indirect-speech",
    "topicLabel": "Direct and Indirect Speech",
    "difficulty": "medium",
    "question": "She said to me, \"I have often told you not to mess with me.\"",
    "options": [
      "She reminded me that she had often told me not to mess with her.",
      "She told me that she has often told me not to mess with her.",
      "She said that she often reminded me not to mess with her.",
      "She told me not to mess with her."
    ],
    "answerIndex": 0,
    "explanation": "Present perfect 'have told' backshifts to past perfect 'had told', and the reporting verb captures the sense of reminding.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-430",
    "subject": "english",
    "topic": "direct-indirect-speech",
    "topicLabel": "Direct and Indirect Speech",
    "difficulty": "medium",
    "question": "He replied that he had promised to reward his employees and that he had kept his word.",
    "options": [
      "He replied, \"I promised to reward my employees and I kept word.\"",
      "He replied, \"I had promised to reward my employees and had kept my word.\"",
      "He replied, \"I promise to reward my employees. I keep my word.\"",
      "He replied, \"I have promised to reward my employees. I have kept my word.\""
    ],
    "answerIndex": 0,
    "explanation": "Past perfect in indirect speech converts to simple past in direct speech.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-431",
    "subject": "english",
    "topic": "direct-indirect-speech",
    "topicLabel": "Direct and Indirect Speech",
    "difficulty": "medium",
    "question": "She said, \"Will you have time to do it?\" And I said, \"Yes\".",
    "options": [
      "She asked if I will have time to do it and I replied that I will.",
      "She asked me if I will have time to do it and I said that I would.",
      "She asked me if I would have time to do it and I said that I would.",
      "She asked if I have the time to do it and I said that I will have the time."
    ],
    "answerIndex": 2,
    "explanation": "'Will' backshifts to 'would' in both the question and the reply in indirect speech.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-432",
    "subject": "english",
    "topic": "direct-indirect-speech",
    "topicLabel": "Direct and Indirect Speech",
    "difficulty": "easy",
    "question": "He said, \" I am going to the market.\"",
    "options": [
      "He said that he was going to the market.",
      "He said that he is going to the market.",
      "He said that I am going to the market.",
      "He said that I was going to the market."
    ],
    "answerIndex": 0,
    "explanation": "'Am going' backshifts to 'was going' and the pronoun changes to third person 'he'.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-433",
    "subject": "english",
    "topic": "direct-indirect-speech",
    "topicLabel": "Direct and Indirect Speech",
    "difficulty": "medium",
    "question": "She asked me why I was late.",
    "options": [
      "She asked me, \"Why I am late?\"",
      "She asked, \"Why were you late?\"",
      "She said to me, \"Why was I late?\"",
      "She said to me, \"Why are you late?\""
    ],
    "answerIndex": 1,
    "explanation": "Converting to direct speech restores question word order and second person: 'Why were you late?'",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-og-3-434",
    "subject": "english",
    "topic": "direct-indirect-speech",
    "topicLabel": "Direct and Indirect Speech",
    "difficulty": "medium",
    "question": "The teacher said, \"Honesty is the best policy.\"",
    "options": [
      "The teacher said that honesty is the best policy.",
      "The teacher said that honesty was the best policy.",
      "The teacher said honesty had been the best policy.",
      "The teacher said that honesty will be the best policy."
    ],
    "answerIndex": 0,
    "explanation": "Universal truths retain the present tense even in indirect speech.",
    "source": "MPSC (Mizoram)",
    "year": 2026,
    "tags": [],
    "paperId": "mpsc-direct-ng-2026-assistant-leso-general-english"
  },
  {
    "id": "mpsc-fr-ge2-011",
    "subject": "english",
    "topic": "verb-tense",
    "topicLabel": "Verb Tenses",
    "difficulty": "medium",
    "question": "I ___ the assignment I had been given.",
    "options": [
      "complete",
      "had completed",
      "was completing",
      "completes"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"had completed\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "verb-tense"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-012",
    "subject": "english",
    "topic": "verb-tense",
    "topicLabel": "Verb Tenses",
    "difficulty": "easy",
    "question": "She ___ to work with me every day.",
    "options": [
      "goes",
      "go",
      "went",
      "has gone"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"goes\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "verb-tense"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-013",
    "subject": "english",
    "topic": "verb-tense",
    "topicLabel": "Verb Tenses",
    "difficulty": "easy",
    "question": "He ___ that he is so special, but he is not.",
    "options": [
      "think",
      "thought",
      "thinks",
      "is thinking"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"thinks\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "verb-tense"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-014",
    "subject": "english",
    "topic": "verb-tense",
    "topicLabel": "Verb Tenses",
    "difficulty": "medium",
    "question": "We ___ a trip to Delhi, but we had to cancel it.",
    "options": [
      "contemplated",
      "had been contemplating",
      "has contemplated",
      "are contemplating"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"had been contemplating\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "verb-tense"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-015",
    "subject": "english",
    "topic": "verb-tense",
    "topicLabel": "Verb Tenses",
    "difficulty": "medium",
    "question": "I ___ to think that you do not like me.",
    "options": [
      "started",
      "start",
      "starts",
      "am starting"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"am starting\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "verb-tense"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-016",
    "subject": "english",
    "topic": "verb-tense",
    "topicLabel": "Verb Tenses",
    "difficulty": "easy",
    "question": "She ___ not think he deserves to be forgiven.",
    "options": [
      "do",
      "does",
      "did",
      "done"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"does\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "verb-tense"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-017",
    "subject": "english",
    "topic": "verb-tense",
    "topicLabel": "Verb Tenses",
    "difficulty": "easy",
    "question": "Jane and Mary ___ the graveyard each Saturday.",
    "options": [
      "visits",
      "visited",
      "visit",
      "visiting"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"visit\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "verb-tense"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-018",
    "subject": "english",
    "topic": "verb-tense",
    "topicLabel": "Verb Tenses",
    "difficulty": "medium",
    "question": "I ___ your father for a very long time, and he would have been proud of you.",
    "options": [
      "know",
      "knows",
      "knew",
      "have known"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"have known\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "verb-tense"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-019",
    "subject": "english",
    "topic": "verb-tense",
    "topicLabel": "Verb Tenses",
    "difficulty": "easy",
    "question": "Hurry up, the game ___ now.",
    "options": [
      "starts",
      "started",
      "is starting",
      "will start"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"is starting\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "verb-tense"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-020",
    "subject": "english",
    "topic": "verb-tense",
    "topicLabel": "Verb Tenses",
    "difficulty": "easy",
    "question": "We should always ___ by the rules of the school.",
    "options": [
      "abide",
      "abides",
      "abided",
      "abideth"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"abide\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "verb-tense"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-021",
    "subject": "english",
    "topic": "adjective-adverb",
    "topicLabel": "Adjectives & Adverbs",
    "difficulty": "medium",
    "question": "She answered all of my questions ___.",
    "options": [
      "superly",
      "superbedly",
      "superbly",
      "superily"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"superbly\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "adjective-adverb"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-022",
    "subject": "english",
    "topic": "adjective-adverb",
    "topicLabel": "Adjectives & Adverbs",
    "difficulty": "easy",
    "question": "She fell asleep in class because she was ___.",
    "options": [
      "broad",
      "bored",
      "board",
      "brood"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"bored\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "adjective-adverb"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-023",
    "subject": "english",
    "topic": "adjective-adverb",
    "topicLabel": "Adjectives & Adverbs",
    "difficulty": "easy",
    "question": "I have ___ objection to their marriage.",
    "options": [
      "no",
      "not",
      "non",
      "none"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"no\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "adjective-adverb"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-024",
    "subject": "english",
    "topic": "adjective-adverb",
    "topicLabel": "Adjectives & Adverbs",
    "difficulty": "easy",
    "question": "This dish is not ___.",
    "options": [
      "audible",
      "legible",
      "edible",
      "delible"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"edible\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "adjective-adverb"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-025",
    "subject": "english",
    "topic": "adjective-adverb",
    "topicLabel": "Adjectives & Adverbs",
    "difficulty": "medium",
    "question": "He wishes that he was still single ___.",
    "options": [
      "sometime",
      "anytime",
      "sometimes",
      "anytimes"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"sometimes\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "adjective-adverb"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-026",
    "subject": "english",
    "topic": "preposition-conjunction",
    "topicLabel": "Prepositions & Conjunctions",
    "difficulty": "medium",
    "question": "He lives in the flat ___ mine.",
    "options": [
      "above",
      "atop",
      "upon",
      "over"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"above\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "preposition-conjunction"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-027",
    "subject": "english",
    "topic": "preposition-conjunction",
    "topicLabel": "Prepositions & Conjunctions",
    "difficulty": "easy",
    "question": "The police promised to look ___ the matter of the theft.",
    "options": [
      "at",
      "for",
      "into",
      "onto"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"into\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "preposition-conjunction"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-028",
    "subject": "english",
    "topic": "preposition-conjunction",
    "topicLabel": "Prepositions & Conjunctions",
    "difficulty": "medium",
    "question": "Walk fast, ___ you are late for school.",
    "options": [
      "hence",
      "and",
      "unless",
      "lest"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"lest\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "preposition-conjunction"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-029",
    "subject": "english",
    "topic": "preposition-conjunction",
    "topicLabel": "Prepositions & Conjunctions",
    "difficulty": "easy",
    "question": "He was lazy, ___ he failed to get a job.",
    "options": [
      "since",
      "hereby",
      "so long as",
      "therefore"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"therefore\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "preposition-conjunction"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-030",
    "subject": "english",
    "topic": "preposition-conjunction",
    "topicLabel": "Prepositions & Conjunctions",
    "difficulty": "easy",
    "question": "He sat on the chair ___ to mine.",
    "options": [
      "beside",
      "aside",
      "next",
      "besides"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"next\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "preposition-conjunction"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-031",
    "subject": "english",
    "topic": "preposition-conjunction",
    "topicLabel": "Prepositions & Conjunctions",
    "difficulty": "easy",
    "question": "He struggled ___ the crowd to reach the exit.",
    "options": [
      "through",
      "trough",
      "throughout",
      "thorough"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"through\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "preposition-conjunction"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-032",
    "subject": "english",
    "topic": "preposition-conjunction",
    "topicLabel": "Prepositions & Conjunctions",
    "difficulty": "medium",
    "question": "He succeeded ___ his unfortunate circumstances.",
    "options": [
      "inspite",
      "aside",
      "despite",
      "beside"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"despite\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "preposition-conjunction"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-033",
    "subject": "english",
    "topic": "preposition-conjunction",
    "topicLabel": "Prepositions & Conjunctions",
    "difficulty": "easy",
    "question": "Tom leaned lazily ___ the wall.",
    "options": [
      "across",
      "against",
      "around",
      "amongst"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"against\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "preposition-conjunction"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-034",
    "subject": "english",
    "topic": "preposition-conjunction",
    "topicLabel": "Prepositions & Conjunctions",
    "difficulty": "medium",
    "question": "Theo is disappointed ___ Tom is delighted by the news of the holiday.",
    "options": [
      "whether",
      "whereas",
      "unless",
      "wheras"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"whereas\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "preposition-conjunction"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-035",
    "subject": "english",
    "topic": "preposition-conjunction",
    "topicLabel": "Prepositions & Conjunctions",
    "difficulty": "medium",
    "question": "The three friends divided their savings ___ themselves.",
    "options": [
      "among",
      "within",
      "between",
      "along"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"among\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "preposition-conjunction"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-036",
    "subject": "english",
    "topic": "sentence-transformation",
    "topicLabel": "Sentence Transformation",
    "difficulty": "medium",
    "question": "The rain stopped and the sun came out (To Complex)",
    "options": [
      "After the rain stopped, the sun came out",
      "The rain stopped. The sun came out",
      "The rain stopped the sun coming out",
      "The sun came out after the rain stopped"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"After the rain stopped, the sun came out\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-transformation"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-037",
    "subject": "english",
    "topic": "sentence-transformation",
    "topicLabel": "Sentence Transformation",
    "difficulty": "medium",
    "question": "Tom finished his homework and went to bed (To Simple)",
    "options": [
      "Tom finished his homework, and hence so forth went to bed",
      "Finishing his homework, Tom went to bed",
      "Going to bed, Tom finished his homework",
      "Tom finished his homework, and therefore, he went to bed"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Finishing his homework, Tom went to bed\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-transformation"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-038",
    "subject": "english",
    "topic": "sentence-transformation",
    "topicLabel": "Sentence Transformation",
    "difficulty": "medium",
    "question": "Despite being sick, he went to work (to Compound)",
    "options": [
      "Despite being sick; he went to work",
      "He was sick. He went to work",
      "He went to work sick",
      "He was sick but he nevertheless went to work"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"He was sick but he nevertheless went to work\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-transformation"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-039",
    "subject": "english",
    "topic": "sentence-transformation",
    "topicLabel": "Sentence Transformation",
    "difficulty": "medium",
    "question": "He has to eat healthier, or he will get sick (to Simple)",
    "options": [
      "He has to eat healthier to avoid getting sick",
      "He has to eat healthier so that he will get sick",
      "He will get sick if he does not eat healthier",
      "He has to eat healthier so long as he does not want to get sick"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"He has to eat healthier to avoid getting sick\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-transformation"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-040",
    "subject": "english",
    "topic": "sentence-transformation",
    "topicLabel": "Sentence Transformation",
    "difficulty": "medium",
    "question": "Although the concert was loud, it was enjoyable (to Compound)",
    "options": [
      "The concert was loud. It was enjoyable",
      "The concert was loud, but it was also enjoyable",
      "Being loud, the concert was enjoyable",
      "The concert was loud and enjoyable"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"The concert was loud, but it was also enjoyable\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-transformation"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-041",
    "subject": "english",
    "topic": "sentence-transformation",
    "topicLabel": "Sentence Transformation",
    "difficulty": "medium",
    "question": "Due to his illness, Nick did not go to work (to Complex)",
    "options": [
      "Nick did not go to work due to his illness",
      "Being ill, Nick did not go to work",
      "Nick, owing to his illness, did not go to work",
      "Nick did not go to work because he was ill"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"Nick did not go to work because he was ill\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-transformation"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-042",
    "subject": "english",
    "topic": "sentence-transformation",
    "topicLabel": "Sentence Transformation",
    "difficulty": "medium",
    "question": "It was raining but we went out (to Complex)",
    "options": [
      "Though it was raining, we went out",
      "It was raining because we went out",
      "We went out in the rain",
      "It was raining and we went out"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"Though it was raining, we went out\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-transformation"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-043",
    "subject": "english",
    "topic": "sentence-transformation",
    "topicLabel": "Sentence Transformation",
    "difficulty": "medium",
    "question": "Bill was so weak that he could not walk any further (to Simple)",
    "options": [
      "Bill cannot walk any further because he was so weak",
      "Bill was too weak to walk any further",
      "As he was so weak, Bill could not walk any further",
      "Bill could not walk any further as a consequence of his weakness"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Bill was too weak to walk any further\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-transformation"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-044",
    "subject": "english",
    "topic": "sentence-transformation",
    "topicLabel": "Sentence Transformation",
    "difficulty": "medium",
    "question": "It is so cold that I had to turn off the fan (to Compound)",
    "options": [
      "Being cold, I turned off the fan",
      "I turned off the fan as it was cold",
      "It is very cold and so I turned off the fan",
      "As it was cold, I turned off the fan"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"It is very cold and so I turned off the fan\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-transformation"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-045",
    "subject": "english",
    "topic": "sentence-transformation",
    "topicLabel": "Sentence Transformation",
    "difficulty": "medium",
    "question": "Although Pansy is rich, she is not happy (to Simple)",
    "options": [
      "Despite being rich, Claire is not happy",
      "Pansy is rich yet she is unhappy",
      "Pansy is unhappy in spite of being rich",
      "Although Pansy is rich, yet she is unhappy"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Pansy is unhappy in spite of being rich\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-transformation"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-046",
    "subject": "english",
    "topic": "sentence-transformation",
    "topicLabel": "Sentence Transformation",
    "difficulty": "medium",
    "question": "He performed in a confident manner. (use a Noun)",
    "options": [
      "He performed confidently",
      "He performed with confidence",
      "His performance was confident",
      "He performed in a manner which was confident"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"He performed with confidence\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-transformation"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-047",
    "subject": "english",
    "topic": "sentence-transformation",
    "topicLabel": "Sentence Transformation",
    "difficulty": "easy",
    "question": "It was so hot that we could not go out. (use 'too')",
    "options": [
      "It was too hot to go out",
      "It was too hot that we could not go out",
      "It was so hot that we could not go out too",
      "It was hot too go out"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"It was too hot to go out\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-transformation"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-048",
    "subject": "english",
    "topic": "sentence-transformation",
    "topicLabel": "Sentence Transformation",
    "difficulty": "medium",
    "question": "Lea is the greatest dancer amongst the troupe. (use Comparative Degree)",
    "options": [
      "Lea is greater than the greatest dancer amongst the troupe",
      "Lea is the greater dancer amongst the troupe",
      "No other dancer amongst the troupe is greater than Lea",
      "No other dancer is as great as Lea amongst the troupe"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"No other dancer amongst the troupe is greater than Lea\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-transformation"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-049",
    "subject": "english",
    "topic": "sentence-transformation",
    "topicLabel": "Sentence Transformation",
    "difficulty": "medium",
    "question": "The garden was made beautiful by the presence of the fairies (use a Verb)",
    "options": [
      "The garden was beautified by the presence of the fairies",
      "The presence of the fairies made the garden beautiful",
      "The garden was made beautifully by the presence of the fairies",
      "The presence of the fairies gave the garden beauty"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"The garden was beautified by the presence of the fairies\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-transformation"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-050",
    "subject": "english",
    "topic": "sentence-transformation",
    "topicLabel": "Sentence Transformation",
    "difficulty": "medium",
    "question": "He has not been seen by anyone (to Affirmative)",
    "options": [
      "Anyone has not seen him",
      "He has been seen by anyone",
      "He has been seen by nobody",
      "Anyone has seen him"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"He has been seen by nobody\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-transformation"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-051",
    "subject": "english",
    "topic": "sentence-transformation",
    "topicLabel": "Sentence Transformation",
    "difficulty": "hard",
    "question": "He smiled at the ladies with great charm (use Adjective)",
    "options": [
      "He smiled at the ladies with great charmingly",
      "He smiled at the ladies with charming",
      "He smiled at the ladies charmingly",
      "He smiled at the ladies in a charmful manner"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"He smiled at the ladies charmingly\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-transformation"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-052",
    "subject": "english",
    "topic": "sentence-transformation",
    "topicLabel": "Sentence Transformation",
    "difficulty": "medium",
    "question": "As soon as he arrived, he went to bed (use 'No sooner...than')",
    "options": [
      "No sooner had he arrived than he went to bed",
      "No sooner than he arrived, he went to bed",
      "No sooner as he arrived than he went to bed",
      "No sooner did he arrived, then went to bed"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"No sooner had he arrived than he went to bed\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-transformation"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-053",
    "subject": "english",
    "topic": "sentence-transformation",
    "topicLabel": "Sentence Transformation",
    "difficulty": "medium",
    "question": "She was too ill-mannered to be tolerated (use 'so... that')",
    "options": [
      "She was too ill-mannered so that I could not tolerate her",
      "She was too ill-mannered so I cannot tolerate that",
      "She was so ill-mannered that to be tolerated",
      "She was so ill-mannered that I could not tolerate her"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"She was so ill-mannered that I could not tolerate her\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-transformation"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-054",
    "subject": "english",
    "topic": "sentence-transformation",
    "topicLabel": "Sentence Transformation",
    "difficulty": "hard",
    "question": "She is a very proud person (to Negative)",
    "options": [
      "She is not a very proud person",
      "She is a very humble person",
      "She is not a very humble person",
      "She is not at all proud"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"She is not a very humble person\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-transformation"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-055",
    "subject": "english",
    "topic": "sentence-transformation",
    "topicLabel": "Sentence Transformation",
    "difficulty": "medium",
    "question": "No other girl is as accomplished a singer as Minny. (use Superlative)",
    "options": [
      "Minny is the accomplishest singer among the girls",
      "No other girl is more accomplished in singing than Minny",
      "Minny is an accomplished singer among the girls",
      "Minny is the most accomplished singer among the girls"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"Minny is the most accomplished singer among the girls\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-transformation"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-056",
    "subject": "english",
    "topic": "sentence-synthesis",
    "topicLabel": "Sentence Synthesis",
    "difficulty": "medium",
    "question": "John is a very eligible man. He is wealthy and generous. (use Noun phrase in apposition)",
    "options": [
      "John, a wealthy and generous man, is very eligible.",
      "John is eligible as well as wealthy and generous.",
      "Being wealthy and generous, John is an eligible man.",
      "John is eligible, wealthy and generous."
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"John, a wealthy and generous man, is very eligible.\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-synthesis"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-057",
    "subject": "english",
    "topic": "sentence-synthesis",
    "topicLabel": "Sentence Synthesis",
    "difficulty": "medium",
    "question": "He succeeded. It is due to his hard work. (use 'by dint of')",
    "options": [
      "He succeeded by dint of due to his hard work.",
      "He succeeded by dint of his hard work.",
      "It is due to his hard work by dint of his success.",
      "He succeeded due to his hard work by dint of."
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"He succeeded by dint of his hard work.\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-synthesis"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-058",
    "subject": "english",
    "topic": "sentence-synthesis",
    "topicLabel": "Sentence Synthesis",
    "difficulty": "medium",
    "question": "I saw her loyalty. I was impressed. (use an Adjective)",
    "options": [
      "I saw her loyalty and was impressed",
      "I was impressed by her loyalty",
      "I was impressed on seeing how loyal she was",
      "I was impressed on seeing how loyally she was being"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"I was impressed on seeing how loyal she was\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-synthesis"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-059",
    "subject": "english",
    "topic": "sentence-synthesis",
    "topicLabel": "Sentence Synthesis",
    "difficulty": "medium",
    "question": "The movie was too violent. I could not finish it. (use infinitive)",
    "options": [
      "The movie was so violent that I could not finish it",
      "The movie was too violent that I could not finish it",
      "The movie was too violent, hence I could not finish it",
      "The movie was too violent to finish"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"The movie was too violent to finish\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-synthesis"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-060",
    "subject": "english",
    "topic": "sentence-synthesis",
    "topicLabel": "Sentence Synthesis",
    "difficulty": "medium",
    "question": "He finished his work. He went home. (use a Participial Phrase)",
    "options": [
      "He finished his work and went home",
      "Finishing his work, he went home",
      "As soon as he finished his work, he went home",
      "He went home after finishing his work"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Finishing his work, he went home\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-synthesis"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-061",
    "subject": "english",
    "topic": "sentence-synthesis",
    "topicLabel": "Sentence Synthesis",
    "difficulty": "medium",
    "question": "She was so beautiful. Other women became jealous. (use a Noun)",
    "options": [
      "She was so beautiful that other women became jealous",
      "Her beauty made other women become jealous",
      "She was a beauty that other women were jealous",
      "Her beauty made other women became jealous."
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Her beauty made other women become jealous\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-synthesis"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-062",
    "subject": "english",
    "topic": "sentence-synthesis",
    "topicLabel": "Sentence Synthesis",
    "difficulty": "medium",
    "question": "He sat on a bench. It had just been painted. (use Compound adjective)",
    "options": [
      "He sat on a freshly-painted bench",
      "He sat on a just-been-painted bench",
      "He sat on a painted-bench",
      "He sat on a bench that had just been-painted"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"He sat on a freshly-painted bench\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-synthesis"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-063",
    "subject": "english",
    "topic": "sentence-synthesis",
    "topicLabel": "Sentence Synthesis",
    "difficulty": "medium",
    "question": "The Chairman promised to meet their demands. The workers were still angry. (use 'Although')",
    "options": [
      "Although the Chairman promised to meet their demands, the workers were still angry",
      "The chairman promised to meet their demands although the workers were still angry",
      "Although the workers were still angry, the Chairman promised to meet their demands",
      "The Chairman although promised to meet the demands of the angry workers"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"Although the Chairman promised to meet their demands, the workers were still angry\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-synthesis"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-064",
    "subject": "english",
    "topic": "sentence-synthesis",
    "topicLabel": "Sentence Synthesis",
    "difficulty": "medium",
    "question": "Kim did not forget the thief's name. She also did not forget his face. (use 'neither...nor')",
    "options": [
      "Kim did not forget neither the thief's name and face",
      "Kim did not forget the thief's name and face neither",
      "Kim did not forget neither the thief's name or his face",
      "Kim did not forget neither the thief's name nor his face"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"Kim did not forget neither the thief's name nor his face\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-synthesis"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-065",
    "subject": "english",
    "topic": "sentence-synthesis",
    "topicLabel": "Sentence Synthesis",
    "difficulty": "medium",
    "question": "This car is economical. It also feels good to drive (use 'Not only... but also')",
    "options": [
      "Not only does this car economical but also feels good to drive",
      "This car not only is economical, but also feels good to drive",
      "Not only this car is economical, but also feels good to drive",
      "This car not only feels good to drive, but also feels economical"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"This car not only is economical, but also feels good to drive\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sentence-synthesis"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-066",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms & Phrases",
    "difficulty": "easy",
    "question": "To find your feet",
    "options": [
      "To adjust to a new situation",
      "To become suddenly more energetic",
      "To want to travel",
      "To meet someone whom you instantly like"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"To adjust to a new situation\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "idioms"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-067",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms & Phrases",
    "difficulty": "easy",
    "question": "To spice things up",
    "options": [
      "To find a solution",
      "To give up a bad habit",
      "To learn a new skill",
      "To make things more exciting"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"To make things more exciting\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "idioms"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-068",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms & Phrases",
    "difficulty": "easy",
    "question": "To be in hot water",
    "options": [
      "To be in pleasant circumstances",
      "To be in serious trouble",
      "To make the correct choice",
      "To investigate something further"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"To be in serious trouble\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "idioms"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-069",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms & Phrases",
    "difficulty": "easy",
    "question": "To be under the weather",
    "options": [
      "To keep a secret",
      "To be intoxicated",
      "To feel unwell or sick",
      "To lack ambition"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"To feel unwell or sick\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "idioms"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-070",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms & Phrases",
    "difficulty": "easy",
    "question": "To make a mountain out of a molehill",
    "options": [
      "To pretend to know something",
      "To try to appear as what one is not",
      "To make a small problem seem bigger than it actually is",
      "To laugh at other people's misfortune"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"To make a small problem seem bigger than it actually is\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "idioms"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-071",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms & Phrases",
    "difficulty": "easy",
    "question": "To tie the knot",
    "options": [
      "To get married",
      "To agree with someone",
      "To overthink a situation till you cannot do anything else",
      "To complete a task in a careless manner"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"To get married\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "idioms"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-072",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms & Phrases",
    "difficulty": "medium",
    "question": "From the horse's mouth",
    "options": [
      "To be suspicious of one's good fortune",
      "To come into unexpected money or good luck",
      "From someone with direct, personal knowledge",
      "A daunting task"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"From someone with direct, personal knowledge\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "idioms"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-073",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms & Phrases",
    "difficulty": "easy",
    "question": "Sink or swim",
    "options": [
      "To be indecisive",
      "Fail or succeed",
      "Something of superior quality",
      "Ruthlessly competitive"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Fail or succeed\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "idioms"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-074",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms & Phrases",
    "difficulty": "easy",
    "question": "To cost an arm and a leg",
    "options": [
      "The cause of someone's misfortune",
      "At little to no cost",
      "To postpone something",
      "Very expensive"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"Very expensive\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "idioms"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-075",
    "subject": "english",
    "topic": "idioms",
    "topicLabel": "Idioms & Phrases",
    "difficulty": "medium",
    "question": "To be pushing up daisies",
    "options": [
      "An eternally optimistic person",
      "A chronic liar",
      "To be dead and buried",
      "Someone who works hard, but can never become successful"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"To be dead and buried\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "idioms"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-076",
    "subject": "english",
    "topic": "word-choice",
    "topicLabel": "Word Choice",
    "difficulty": "medium",
    "question": "I shall ___ to your superior judgment in this matter.",
    "options": [
      "defer",
      "infer",
      "differ",
      "infirm"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"defer\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "word-choice"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-077",
    "subject": "english",
    "topic": "word-choice",
    "topicLabel": "Word Choice",
    "difficulty": "easy",
    "question": "You will ___ all your credibility if you continue to drink like this.",
    "options": [
      "loose",
      "loss",
      "lost",
      "lose"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"lose\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "word-choice"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-078",
    "subject": "english",
    "topic": "word-choice",
    "topicLabel": "Word Choice",
    "difficulty": "medium",
    "question": "The politician promised to ___ a large amount of funds to build a school.",
    "options": [
      "a lot",
      "ballot",
      "allot",
      "elect"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"allot\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "word-choice"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-079",
    "subject": "english",
    "topic": "word-choice",
    "topicLabel": "Word Choice",
    "difficulty": "easy",
    "question": "The refugees were told to collect ___ belongings.",
    "options": [
      "there",
      "they're",
      "their",
      "them"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"their\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "word-choice"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-080",
    "subject": "english",
    "topic": "word-choice",
    "topicLabel": "Word Choice",
    "difficulty": "medium",
    "question": "The colour of her gown ___ her skin tone perfectly.",
    "options": [
      "compliments",
      "conditions",
      "condiments",
      "complements"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"complements\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "word-choice"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-081",
    "subject": "english",
    "topic": "word-choice",
    "topicLabel": "Word Choice",
    "difficulty": "easy",
    "question": "I am sure that ___ the right person for this job.",
    "options": [
      "you're",
      "youre",
      "your",
      "yourself"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"you're\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "word-choice"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-082",
    "subject": "english",
    "topic": "word-choice",
    "topicLabel": "Word Choice",
    "difficulty": "medium",
    "question": "We have taken steps to ___ that your money is safe with us.",
    "options": [
      "insure",
      "ensue",
      "assure",
      "ensure"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"ensure\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "word-choice"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-083",
    "subject": "english",
    "topic": "word-choice",
    "topicLabel": "Word Choice",
    "difficulty": "medium",
    "question": "We shall now ___ to the next room.",
    "options": [
      "precede",
      "proceed",
      "procede",
      "preceed"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"proceed\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "word-choice"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-084",
    "subject": "english",
    "topic": "word-choice",
    "topicLabel": "Word Choice",
    "difficulty": "hard",
    "question": "I shall ___ the clients about your acceptance of their proposal.",
    "options": [
      "apprise",
      "reprise",
      "appraise",
      "comprise"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"apprise\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "word-choice"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-085",
    "subject": "english",
    "topic": "word-choice",
    "topicLabel": "Word Choice",
    "difficulty": "hard",
    "question": "Everyone ___ to the Chairman's suggestion to break for lunch.",
    "options": [
      "ascended",
      "ascented",
      "accented",
      "assented"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"assented\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "word-choice"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-086",
    "subject": "english",
    "topic": "antonyms",
    "topicLabel": "Antonyms",
    "difficulty": "medium",
    "question": "Give the Antonym: Zenith",
    "options": [
      "Bottom",
      "Beauty",
      "Ugliness",
      "Height"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"Bottom\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "antonyms"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-087",
    "subject": "english",
    "topic": "antonyms",
    "topicLabel": "Antonyms",
    "difficulty": "medium",
    "question": "Give the Antonym: Obvious",
    "options": [
      "Obstruse",
      "Heavy",
      "Subtle",
      "Deep"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Subtle\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "antonyms"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-088",
    "subject": "english",
    "topic": "antonyms",
    "topicLabel": "Antonyms",
    "difficulty": "easy",
    "question": "Give the Antonym: Perpetual",
    "options": [
      "Permanent",
      "Transparent",
      "Temporary",
      "Plain"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Temporary\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "antonyms"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-089",
    "subject": "english",
    "topic": "antonyms",
    "topicLabel": "Antonyms",
    "difficulty": "medium",
    "question": "Give the Antonym: Benefit",
    "options": [
      "Advantage",
      "Bereft",
      "Charity",
      "Detriment"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"Detriment\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "antonyms"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-090",
    "subject": "english",
    "topic": "antonyms",
    "topicLabel": "Antonyms",
    "difficulty": "easy",
    "question": "Give the Antonym: Anxious",
    "options": [
      "Pity",
      "Careful",
      "Concerned",
      "Carefree"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"Carefree\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "antonyms"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-091",
    "subject": "english",
    "topic": "synonyms",
    "topicLabel": "Synonyms",
    "difficulty": "medium",
    "question": "Give the Synonym: Convivial",
    "options": [
      "Cheerful",
      "Inspiring",
      "Dour",
      "Depressing"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"Cheerful\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "synonyms"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-092",
    "subject": "english",
    "topic": "synonyms",
    "topicLabel": "Synonyms",
    "difficulty": "easy",
    "question": "Give the Synonym: Gargantuan",
    "options": [
      "Tiny",
      "Weak",
      "Enormous",
      "Strong"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Enormous\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "synonyms"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-093",
    "subject": "english",
    "topic": "synonyms",
    "topicLabel": "Synonyms",
    "difficulty": "medium",
    "question": "Give the Synonym: Passive",
    "options": [
      "Calm",
      "Messy",
      "Tidy",
      "Active"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"Calm\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "synonyms"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-094",
    "subject": "english",
    "topic": "synonyms",
    "topicLabel": "Synonyms",
    "difficulty": "medium",
    "question": "Give the Synonym: Sensible",
    "options": [
      "Foolish",
      "Safe",
      "Dangerous",
      "Clever"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"Clever\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "synonyms"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-095",
    "subject": "english",
    "topic": "synonyms",
    "topicLabel": "Synonyms",
    "difficulty": "easy",
    "question": "Give the Synonym: Conclusion",
    "options": [
      "Ending",
      "Explanation",
      "Beginning",
      "Judging"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"Ending\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "synonyms"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-096",
    "subject": "english",
    "topic": "one-word-substitution",
    "topicLabel": "One-Word Substitution",
    "difficulty": "medium",
    "question": "The act of killing one's father",
    "options": [
      "Regicide",
      "Patricide",
      "Matricide",
      "Homicide"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Patricide\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "one-word-substitution"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-097",
    "subject": "english",
    "topic": "one-word-substitution",
    "topicLabel": "One-Word Substitution",
    "difficulty": "easy",
    "question": "A state under a cruel and oppressive government",
    "options": [
      "Tyranny",
      "Republic",
      "Apocalypse",
      "Monarchy"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"Tyranny\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "one-word-substitution"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-098",
    "subject": "english",
    "topic": "one-word-substitution",
    "topicLabel": "One-Word Substitution",
    "difficulty": "easy",
    "question": "A hater of women",
    "options": [
      "Philogynist",
      "Monogamist",
      "Bigamist",
      "Misogynist"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"Misogynist\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "one-word-substitution"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-099",
    "subject": "english",
    "topic": "one-word-substitution",
    "topicLabel": "One-Word Substitution",
    "difficulty": "medium",
    "question": "A book published after the author's death",
    "options": [
      "Postmortem",
      "Philanthropy",
      "Posthumous",
      "Philately"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Posthumous\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "one-word-substitution"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-fr-ge2-100",
    "subject": "english",
    "topic": "one-word-substitution",
    "topicLabel": "One-Word Substitution",
    "difficulty": "easy",
    "question": "Favouring one's relatives for a job",
    "options": [
      "Sinecure",
      "Iconoclasm",
      "Biased",
      "Nepotism"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"Nepotism\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "one-word-substitution"
    ],
    "paperId": "mpsc-direct-2024-forest-ranger-general-english-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-003",
    "subject": "current-affairs",
    "topic": "mizoram-current-affairs",
    "topicLabel": "Mizoram Current Affairs",
    "difficulty": "hard",
    "question": "The healthcare programme recently launched by Mizoram Chief Minister Lalduhoma is called -",
    "options": [
      "Mizoram Universal Healthcare Programme",
      "Mizoram Universal Healthcare Scheme",
      "Mizoram Universal Healthcare System",
      "Mizoram Universal Healthcare Policy"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Mizoram Universal Healthcare Scheme\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "mizoram-current-affairs"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-005",
    "subject": "gk",
    "topic": "indian-society",
    "topicLabel": "Indian Society & Tribes",
    "difficulty": "medium",
    "question": "In which states are the Pardhi community primarily found?",
    "options": [
      "Mizoram and Manipur",
      "Bihar and Jharkhand",
      "Maharashtra and Madhya Pradesh",
      "Odisha and Tamil Nadu"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Maharashtra and Madhya Pradesh\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "indian-society"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-006",
    "subject": "current-affairs",
    "topic": "awards-honours",
    "topicLabel": "Awards & Honours",
    "difficulty": "medium",
    "question": "'Honorary Order of Freedom of Barbados' Award recently awarded to a leader from India is-",
    "options": [
      "Dr. S. Jaishankar",
      "Narendra Modi",
      "Rajnath Singh",
      "Amit Shah"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Narendra Modi\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "awards-honours"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-007",
    "subject": "geography",
    "topic": "protected-areas",
    "topicLabel": "Wildlife Sanctuaries",
    "difficulty": "easy",
    "question": "Pobitora Wildlife Sanctuary is located in -",
    "options": [
      "Meghalaya",
      "Darjeeling",
      "Assam",
      "Manipur"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Assam\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "protected-areas"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-009",
    "subject": "current-affairs",
    "topic": "defence",
    "topicLabel": "Defence & Military",
    "difficulty": "medium",
    "question": "Germany and which country jointly developed the Taurus KEPD-350 missile?",
    "options": [
      "China",
      "India",
      "Russia",
      "Sweden"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"Sweden\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "defence"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-010",
    "subject": "current-affairs",
    "topic": "defence",
    "topicLabel": "Defence & Military",
    "difficulty": "easy",
    "question": "A bilateral naval exercise called Exercise Varuna is between India and which country?",
    "options": [
      "Australia",
      "USA",
      "France",
      "Germany"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"France\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "defence"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-011",
    "subject": "current-affairs",
    "topic": "science-space",
    "topicLabel": "Science & Space",
    "difficulty": "easy",
    "question": "Who are the NASA astronauts stranded in space for nine months?",
    "options": [
      "Sunita Reeves and Bobby Wilmore",
      "Suni Williams and Butch Wilmore",
      "Sunny Williams and Buck Wilmore",
      "Sona Williams and Burt Wilmore"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Suni Williams and Butch Wilmore\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "science-space"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-013",
    "subject": "history",
    "topic": "ancient-india",
    "topicLabel": "Ancient India",
    "difficulty": "easy",
    "question": "Mahavira was the ___ tirthankara.",
    "options": [
      "21st",
      "22nd",
      "23rd",
      "24th"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"24th\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "ancient-india"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-014",
    "subject": "history",
    "topic": "ancient-india",
    "topicLabel": "Ancient India",
    "difficulty": "medium",
    "question": "Alexander the Great conquered India in the year -",
    "options": [
      "326 BC",
      "327 BC",
      "326 BC",
      "325 BC"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"326 BC\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "ancient-india"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-015",
    "subject": "history",
    "topic": "ancient-india",
    "topicLabel": "Ancient India",
    "difficulty": "easy",
    "question": "Asoka followed the policy of Dhamma after which War?",
    "options": [
      "Patna War",
      "Magadha War",
      "Kalinga War",
      "Palinga War"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Kalinga War\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "ancient-india"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-016",
    "subject": "history",
    "topic": "modern-india",
    "topicLabel": "Modern Indian History",
    "difficulty": "easy",
    "question": "Who was the leader of the Aligarh Movement?",
    "options": [
      "Sir Syed Ahmad Khan",
      "Muhammad Ali Jinnah",
      "Allama Iqbal",
      "Maulana Abul Kalam Azad"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"Sir Syed Ahmad Khan\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "modern-india"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-017",
    "subject": "history",
    "topic": "modern-india",
    "topicLabel": "Modern Indian History",
    "difficulty": "easy",
    "question": "Drain of Wealth Theory was propounded by-",
    "options": [
      "RP Dutt",
      "Dadabhai Naoroji",
      "Bal Gangadhar Tilak",
      "Mahatma Gandhi"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Dadabhai Naoroji\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "modern-india"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-018",
    "subject": "history",
    "topic": "ancient-india",
    "topicLabel": "Ancient India",
    "difficulty": "medium",
    "question": "Which of the following Gods was not worshipped by the Rig Vedic people?",
    "options": [
      "Agni",
      "Indra",
      "Krishna",
      "Varuna"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Krishna\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "ancient-india"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-019",
    "subject": "history",
    "topic": "ancient-india",
    "topicLabel": "Ancient India",
    "difficulty": "medium",
    "question": "The founder of the Gupta Empire was -",
    "options": [
      "Sri Gupta",
      "Samudragupta",
      "Chandragupta II",
      "Skandagupta"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"Sri Gupta\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "ancient-india"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-020",
    "subject": "history",
    "topic": "early-medieval-india",
    "topicLabel": "Early Medieval India",
    "difficulty": "medium",
    "question": "The Tripartite Struggle was fought by the Palas, Pratiharas and the Rashtrakutas for the capture of -",
    "options": [
      "Delhi",
      "Magadha",
      "Amravati",
      "Kanauj"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"Kanauj\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "early-medieval-india"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-021",
    "subject": "history",
    "topic": "delhi-sultanate",
    "topicLabel": "Delhi Sultanate",
    "difficulty": "medium",
    "question": "Ala-Uddin Khilji was most famous for his -",
    "options": [
      "Military policy",
      "Land reform",
      "Religious policy",
      "Market control policy"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"Market control policy\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "delhi-sultanate"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-022",
    "subject": "history",
    "topic": "freedom-struggle",
    "topicLabel": "Freedom Struggle",
    "difficulty": "easy",
    "question": "The official leader of the Revolt of 1857 was -",
    "options": [
      "Tantia Tope",
      "Bahadur Shah Zafar",
      "Rani Lakshmi Bai",
      "Kunwar Singh"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Bahadur Shah Zafar\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "freedom-struggle"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-023",
    "subject": "history",
    "topic": "european-conquest",
    "topicLabel": "European Conquest of India",
    "difficulty": "medium",
    "question": "The British East India Company gained the Diwani Rights of Bengal, Bihar and Orissa after -",
    "options": [
      "The Battle of Buxar 1764",
      "The Battle of Plassey 1757",
      "Regulating Act 1773",
      "Pitts India Act 1784"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"The Battle of Buxar 1764\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "european-conquest"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-024",
    "subject": "history",
    "topic": "freedom-struggle",
    "topicLabel": "Freedom Struggle",
    "difficulty": "easy",
    "question": "The credit for Integrating the Princely States into the Union goes to",
    "options": [
      "Mahatma Gandhi",
      "Jawaharlal Nehru",
      "Sardar Vallabhbhai Patel",
      "Raja Rammohan Roy"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Sardar Vallabhbhai Patel\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "freedom-struggle"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-025",
    "subject": "geography",
    "topic": "mizoram-geography",
    "topicLabel": "Mizoram Geography",
    "difficulty": "medium",
    "question": "Which district in India has the highest literacy?",
    "options": [
      "Malappuram district in Kerala",
      "Serchhip district in Mizoram",
      "Coimbatore in Tamil Nadu",
      "Mokokchung district in Nagaland"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Serchhip district in Mizoram\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "mizoram-geography"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-026",
    "subject": "geography",
    "topic": "physiographic-divisions",
    "topicLabel": "Physiographic Divisions",
    "difficulty": "easy",
    "question": "Which of the following is the highest peak in India?",
    "options": [
      "Nanda Devi",
      "Kangchenjunga",
      "Mount Everest",
      "Anamudi"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Kangchenjunga\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "physiographic-divisions"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-027",
    "subject": "geography",
    "topic": "rivers",
    "topicLabel": "Rivers of India",
    "difficulty": "medium",
    "question": "Which of the following rivers does not originate in India?",
    "options": [
      "Ganga",
      "Yamuna",
      "Indus",
      "Beas"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Indus\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "rivers"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-028",
    "subject": "gk",
    "topic": "economy",
    "topicLabel": "Indian Economy",
    "difficulty": "easy",
    "question": "Which sector includes activities like trade, transport, and communication?",
    "options": [
      "Primary sector",
      "Secondary sector",
      "Tertiary sector",
      "Economic sector"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Tertiary sector\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "economy"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-029",
    "subject": "geography",
    "topic": "rivers",
    "topicLabel": "Rivers of India",
    "difficulty": "medium",
    "question": "The Sunderbans delta is formed by the confluence of which rivers?",
    "options": [
      "Ganga and Yamuna",
      "Ganga and Brahmaputra",
      "Brahmaputra and Barak",
      "Godavari and Krishna"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Ganga and Brahmaputra\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "rivers"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-030",
    "subject": "geography",
    "topic": "rivers",
    "topicLabel": "Rivers of India",
    "difficulty": "easy",
    "question": "What is the longest river in India?",
    "options": [
      "Ganga",
      "Krishna",
      "Brahmaputra",
      "Godavari"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"Ganga\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "rivers"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-031",
    "subject": "gk",
    "topic": "world-economy",
    "topicLabel": "World Economy",
    "difficulty": "medium",
    "question": "The 'Four Asian Tigers' are:",
    "options": [
      "Japan, India, Hong Kong, South Korea",
      "Hong Kong, Singapore, South Korea, Taiwan",
      "Thailand, Malaysia, Indonesia, Philippines",
      "Japan, South Korea, North Korea, China"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Hong Kong, Singapore, South Korea, Taiwan\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "world-economy"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-032",
    "subject": "gk",
    "topic": "world-economy",
    "topicLabel": "World Economy",
    "difficulty": "medium",
    "question": "Which of the following is the world's largest exporter of oil?",
    "options": [
      "United States",
      "Russia",
      "Saudi Arabia",
      "Iraq"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Saudi Arabia\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "world-economy"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-033",
    "subject": "gk",
    "topic": "society",
    "topicLabel": "Society & Culture",
    "difficulty": "medium",
    "question": "Which of the following refers to a relationship between a cultural group and its natural environment?",
    "options": [
      "Cultural ecology",
      "Cultural convergence",
      "Cultural diffusion",
      "Cultural assimilation"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"Cultural ecology\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "society"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-034",
    "subject": "geography",
    "topic": "world-geography",
    "topicLabel": "World Geography",
    "difficulty": "easy",
    "question": "Which is the largest continent by land area?",
    "options": [
      "North America",
      "Africa",
      "Asia",
      "Europe"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Asia\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "world-geography"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-035",
    "subject": "gk",
    "topic": "economy",
    "topicLabel": "Indian Economy",
    "difficulty": "easy",
    "question": "Which of the following is a primary sector activity?",
    "options": [
      "Banking",
      "Services",
      "Agriculture",
      "IT"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Agriculture\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "economy"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-036",
    "subject": "geography",
    "topic": "world-geography",
    "topicLabel": "World Geography",
    "difficulty": "medium",
    "question": "Which mountain range forms a natural border between France and Spain?",
    "options": [
      "Alps",
      "Pyrenees",
      "Carpathians",
      "Apennines"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Pyrenees\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "world-geography"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-037",
    "subject": "polity",
    "topic": "constitutional-amendments",
    "topicLabel": "Constitutional Amendments",
    "difficulty": "medium",
    "question": "Which amendment of the Constitution of India is known as mini-constitution?",
    "options": [
      "Constitution Forty-First Amendment Act, 1976",
      "Constitution Forty-Second Amendment Act, 1976",
      "Constitution Forty-Third Amendment Act, 1977",
      "Constitution Forty-Fourth Amendment Act, 1978"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Constitution Forty-Second Amendment Act, 1976\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "constitutional-amendments"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-038",
    "subject": "polity",
    "topic": "constitution",
    "topicLabel": "Indian Constitution",
    "difficulty": "easy",
    "question": "Which among the following is the supreme law of the land in India?",
    "options": [
      "Indian Penal Code",
      "Constitution of India",
      "Fundamental Rights",
      "Directive Principles of State Policy"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Constitution of India\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "constitution"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-039",
    "subject": "polity",
    "topic": "parliament",
    "topicLabel": "Parliament",
    "difficulty": "easy",
    "question": "What is the minimum age required to be a member of the Lok Sabha?",
    "options": [
      "25 years",
      "30 years",
      "35 years",
      "18 years"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"25 years\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "parliament"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-040",
    "subject": "polity",
    "topic": "executive",
    "topicLabel": "Union Executive",
    "difficulty": "medium",
    "question": "The President of India is elected by an electoral college consisting of-",
    "options": [
      "Only members of Lok Sabha",
      "Members of Lok Sabha and Rajya Sabha",
      "Elected members of the Legislative Assemblies of States",
      "Members of Lok Sabha, Rajya Sabha and elected members of the Legislative Assemblies of States"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"Members of Lok Sabha, Rajya Sabha and elected members of the Legislative Assemblies of States\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "executive"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-041",
    "subject": "polity",
    "topic": "parliament",
    "topicLabel": "Parliament",
    "difficulty": "easy",
    "question": "What is the maximum number of members in the Rajya Sabha?",
    "options": [
      "180",
      "200",
      "250",
      "500"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"250\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "parliament"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-042",
    "subject": "polity",
    "topic": "parliament",
    "topicLabel": "Parliament",
    "difficulty": "easy",
    "question": "Who has the power to dissolve the Lok Sabha?",
    "options": [
      "The President of India",
      "The Prime Minister of India",
      "The Speaker of the Lok Sabha",
      "The Chief Justice of India"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"The President of India\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "parliament"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-043",
    "subject": "history",
    "topic": "modern-india",
    "topicLabel": "Modern Indian History",
    "difficulty": "easy",
    "question": "Who was the first woman Prime Minister of India?",
    "options": [
      "Pratibha Patil",
      "Indira Gandhi",
      "Sonia Gandhi",
      "Rajkumari Amrit Kaur"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Indira Gandhi\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "modern-india"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-044",
    "subject": "polity",
    "topic": "constitutional-bodies",
    "topicLabel": "Constitutional Bodies",
    "difficulty": "medium",
    "question": "Who was the first Chief Election Commissioner of India?",
    "options": [
      "T.N. Seshan",
      "B.B. Tandon",
      "Sukumar Sen",
      "V.S. Ramadevi"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Sukumar Sen\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "constitutional-bodies"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-045",
    "subject": "polity",
    "topic": "constitution",
    "topicLabel": "Indian Constitution",
    "difficulty": "medium",
    "question": "The concept of 'Concurrent List' in the Indian Constitution is borrowed from which country?",
    "options": [
      "United States",
      "United Kingdom",
      "Canada",
      "Australia"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"Australia\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "constitution"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-046",
    "subject": "polity",
    "topic": "fundamental-duties",
    "topicLabel": "Fundamental Duties",
    "difficulty": "medium",
    "question": "Which of the following is not a Fundamental Duty?",
    "options": [
      "To abide by the Constitution",
      "To vote in elections",
      "To protect the sovereignty of India",
      "To protect the environment"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"To vote in elections\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "fundamental-duties"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-047",
    "subject": "polity",
    "topic": "parliament",
    "topicLabel": "Parliament",
    "difficulty": "medium",
    "question": "Which of the following is not a power of the Rajya Sabha?",
    "options": [
      "The power to amend the Constitution",
      "The power to introduce money bills",
      "The power to declare war",
      "The power to pass laws"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"The power to introduce money bills\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "parliament"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-048",
    "subject": "polity",
    "topic": "constitution",
    "topicLabel": "Indian Constitution",
    "difficulty": "easy",
    "question": "Which of the following is the longest written Constitution in the world?",
    "options": [
      "United States Constitution",
      "Constitution of India",
      "Constitution of Canada",
      "Constitution of Germany"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Constitution of India\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "constitution"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-049",
    "subject": "gk",
    "topic": "economy",
    "topicLabel": "Indian Economy",
    "difficulty": "medium",
    "question": "Which of the following is NOT a dimension of Human Development Index (HDI)?",
    "options": [
      "Health",
      "Education",
      "Income",
      "Environmental sustainability"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"Environmental sustainability\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "economy"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-050",
    "subject": "gk",
    "topic": "economy",
    "topicLabel": "Indian Economy",
    "difficulty": "medium",
    "question": "The Multidimensional Poverty Index (MPI) considers which factors?",
    "options": [
      "Only income levels",
      "Health, education, and standard of living",
      "Inflation and unemployment",
      "Agricultural productivity"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Health, education, and standard of living\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "economy"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-051",
    "subject": "gk",
    "topic": "economy",
    "topicLabel": "Indian Economy",
    "difficulty": "medium",
    "question": "In India, which body releases the Poverty Line estimates?",
    "options": [
      "NITI Aayog",
      "Reserve Bank of India",
      "Ministry of Finance",
      "National Statistical Office"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"NITI Aayog\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "economy"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-052",
    "subject": "gk",
    "topic": "government-schemes",
    "topicLabel": "Government Schemes",
    "difficulty": "easy",
    "question": "What is the primary aim of Pradhan Mantri Jan Dhan Yojana (PMJDY)?",
    "options": [
      "Promoting digital transactions",
      "Providing access to financial services for all",
      "Encouraging entrepreneurship",
      "Reducing direct taxes"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Providing access to financial services for all\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "government-schemes"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-053",
    "subject": "gk",
    "topic": "world-economy",
    "topicLabel": "World Economy",
    "difficulty": "medium",
    "question": "The World Bank classifies countries into different income groups based on-",
    "options": [
      "GDP growth rate",
      "Per capita income",
      "Employment rate",
      "Population size"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Per capita income\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "world-economy"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-054",
    "subject": "gk",
    "topic": "society",
    "topicLabel": "Society & Demography",
    "difficulty": "medium",
    "question": "The term 'Demographic Transition' refers to-",
    "options": [
      "Movement of people between regions",
      "Shift in birth and death rates over time",
      "Increase in agricultural output",
      "Implementation of population control policies"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Shift in birth and death rates over time\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "society"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-055",
    "subject": "gk",
    "topic": "international-organizations",
    "topicLabel": "International Organizations",
    "difficulty": "medium",
    "question": "Which organization publishes the Global Hunger Index?",
    "options": [
      "United Nations Development Programme (UNDP)",
      "World Bank",
      "International Food Policy Research Institute (IFPRI)",
      "Food and Agriculture Organization (FAO)"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"International Food Policy Research Institute (IFPRI)\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "international-organizations"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-056",
    "subject": "gk",
    "topic": "government-schemes",
    "topicLabel": "Government Schemes",
    "difficulty": "medium",
    "question": "Which of the following is NOT a social sector initiative in India?",
    "options": [
      "Beti Bachao Beti Padhao",
      "Stand-Up India",
      "Ujjwala Yojana",
      "Startup India"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"Startup India\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "government-schemes"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-057",
    "subject": "geography",
    "topic": "population",
    "topicLabel": "Population Geography",
    "difficulty": "medium",
    "question": "Which Indian state has the highest population density as per the latest census?",
    "options": [
      "Maharashtra",
      "Uttar Pradesh",
      "Bihar",
      "West Bengal"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Bihar\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "population"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-058",
    "subject": "gk",
    "topic": "government-schemes",
    "topicLabel": "Government Schemes",
    "difficulty": "easy",
    "question": "Which Govt. of India scheme aims to provide housing to all?",
    "options": [
      "Pradhan Mantri Awas Yojana (PMAY)",
      "Smart Cities Mission",
      "National Urban Livelihoods Mission",
      "Atal Mission for Rejuvenation and Urban Transformation (AMRUT)"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"Pradhan Mantri Awas Yojana (PMAY)\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "government-schemes"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-059",
    "subject": "gk",
    "topic": "society",
    "topicLabel": "Society & Welfare",
    "difficulty": "medium",
    "question": "Which of the following best describes 'Social Protection'?",
    "options": [
      "Policies aimed at reducing budget deficits",
      "Programs that provide security against economic risks and vulnerabilities",
      "Privatization of social services",
      "Measures to encourage international trade"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Programs that provide security against economic risks and vulnerabilities\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "society"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-060",
    "subject": "gk",
    "topic": "society",
    "topicLabel": "Society & Welfare",
    "difficulty": "medium",
    "question": "What does the term 'Social Capital' refer to?",
    "options": [
      "Government funding for social programs",
      "Economic resources owned by society",
      "Networks of relationships among people in a society",
      "Total wealth of a country"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Networks of relationships among people in a society\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "society"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-061",
    "subject": "gk",
    "topic": "environment",
    "topicLabel": "Environment & Ecology",
    "difficulty": "medium",
    "question": "The term 'Biodiversity Hotspot' was coined by-",
    "options": [
      "E.O. Wilson",
      "Norman Myers",
      "Charles Darwin",
      "Rachel Carson"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Norman Myers\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "environment"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-062",
    "subject": "gk",
    "topic": "environment",
    "topicLabel": "Environment & Ecology",
    "difficulty": "medium",
    "question": "Which of the following is the main cause of ocean acidification?",
    "options": [
      "Excess oxygen in water",
      "Carbon dioxide absorption by seawater",
      "Oil spills",
      "Marine biodiversity loss"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Carbon dioxide absorption by seawater\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "environment"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-063",
    "subject": "gk",
    "topic": "environment",
    "topicLabel": "Environment & Ecology",
    "difficulty": "easy",
    "question": "Which of the following gases is primarily responsible for the depletion of the ozone layer?",
    "options": [
      "Carbon dioxide",
      "Sulfur dioxide",
      "Chlorofluorocarbons (CFCs)",
      "Methane"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Chlorofluorocarbons (CFCs)\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "environment"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-064",
    "subject": "gk",
    "topic": "environment",
    "topicLabel": "Environment & Ecology",
    "difficulty": "easy",
    "question": "The Paris Agreement aims to-",
    "options": [
      "End all fossil fuel use immediately",
      "Limit global temperature rise to below 2°C",
      "Reduce population growth",
      "Increase greenhouse gas emissions"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Limit global temperature rise to below 2°C\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "environment"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-065",
    "subject": "gk",
    "topic": "environment",
    "topicLabel": "Environment & Ecology",
    "difficulty": "medium",
    "question": "The term 'Sixth Mass Extinction' refers to-",
    "options": [
      "A geological phenomenon",
      "A period of increased volcanic activity",
      "Human-induced loss of species",
      "The end of the Ice Age"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Human-induced loss of species\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "environment"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-066",
    "subject": "gk",
    "topic": "environment",
    "topicLabel": "Environment & Ecology",
    "difficulty": "hard",
    "question": "Which organization releases the Global Climate Risk Index?",
    "options": [
      "United Nations Environment Programme (UNEP)",
      "World Wildlife Fund (WWF)",
      "Germanwatch",
      "Intergovernmental Panel on Climate Change (IPCC)"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Germanwatch\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "environment"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-067",
    "subject": "gk",
    "topic": "environment",
    "topicLabel": "Environment & Ecology",
    "difficulty": "medium",
    "question": "The term 'Carbon Neutrality' means-",
    "options": [
      "Completely stopping carbon emissions",
      "Balancing carbon emissions with carbon removal",
      "Reducing carbon footprint to zero",
      "Storing carbon in landfills"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Balancing carbon emissions with carbon removal\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "environment"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-068",
    "subject": "gk",
    "topic": "environment",
    "topicLabel": "Environment & Ecology",
    "difficulty": "easy",
    "question": "The Ramsar Convention is related to the conservation of-",
    "options": [
      "Rainforests",
      "Deserts",
      "Wetlands",
      "Mangroves"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Wetlands\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "environment"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-069",
    "subject": "gk",
    "topic": "environment",
    "topicLabel": "Environment & Ecology",
    "difficulty": "easy",
    "question": "Which gas is responsible for acid rain?",
    "options": [
      "Carbon dioxide",
      "Oxygen",
      "Nitrogen",
      "Sulfur dioxide"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"Sulfur dioxide\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "environment"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-070",
    "subject": "gk",
    "topic": "environment",
    "topicLabel": "Environment & Ecology",
    "difficulty": "easy",
    "question": "What is the main function of mangroves in coastal ecosystems?",
    "options": [
      "Increase ocean depth",
      "Protect against soil erosion and storm surges",
      "Reduce oxygen levels in water",
      "Prevent fish migration"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Protect against soil erosion and storm surges\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "environment"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-071",
    "subject": "gk",
    "topic": "environment",
    "topicLabel": "Environment & Ecology",
    "difficulty": "easy",
    "question": "Which of the following best defines 'Ecotourism'?",
    "options": [
      "Sustainable tourism focused on conservation and community benefits",
      "Traveling to cities for shopping",
      "Large-scale industrial tourism",
      "Mining in protected areas"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"Sustainable tourism focused on conservation and community benefits\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "environment"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-072",
    "subject": "history",
    "topic": "modern-india",
    "topicLabel": "Modern Indian History",
    "difficulty": "easy",
    "question": "The Chipko Movement, an environmental movement in India, was aimed at-",
    "options": [
      "Preventing river pollution",
      "Promoting organic farming",
      "Protecting forests from deforestation",
      "Stopping mining activities"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Protecting forests from deforestation\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "modern-india"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-073",
    "subject": "gk",
    "topic": "science",
    "topicLabel": "General Science",
    "difficulty": "easy",
    "question": "Which planet is known as the 'Red Planet'?",
    "options": [
      "Venus",
      "Mars",
      "Jupiter",
      "Mercury"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Mars\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "science"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-074",
    "subject": "gk",
    "topic": "science",
    "topicLabel": "General Science",
    "difficulty": "easy",
    "question": "What is the largest organ in the human body?",
    "options": [
      "Heart",
      "Liver",
      "Brain",
      "Skin"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"Skin\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "science"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-075",
    "subject": "gk",
    "topic": "science",
    "topicLabel": "General Science",
    "difficulty": "easy",
    "question": "What is the primary source of energy for the Earth?",
    "options": [
      "The Moon",
      "The Sun",
      "Fossil fuels",
      "Wind"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"The Sun\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "science"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-076",
    "subject": "gk",
    "topic": "science",
    "topicLabel": "General Science",
    "difficulty": "easy",
    "question": "In which part of the cell does respiration occur?",
    "options": [
      "Nucleus",
      "Mitochondria",
      "Ribosome",
      "Chloroplast"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Mitochondria\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "science"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-077",
    "subject": "gk",
    "topic": "science",
    "topicLabel": "General Science",
    "difficulty": "easy",
    "question": "What is the chemical symbol for gold?",
    "options": [
      "Au",
      "Ag",
      "Pb",
      "Fe"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"Au\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "science"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-078",
    "subject": "gk",
    "topic": "science",
    "topicLabel": "General Science",
    "difficulty": "easy",
    "question": "Which of the following is a mammal that lays eggs?",
    "options": [
      "Dolphin",
      "Bat",
      "Platypus",
      "Kangaroo"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Platypus\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "science"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-079",
    "subject": "gk",
    "topic": "science",
    "topicLabel": "General Science",
    "difficulty": "medium",
    "question": "The Earth's core is mainly composed of which two elements?",
    "options": [
      "Oxygen and Nitrogen",
      "Iron and Nickel",
      "Carbon and Hydrogen",
      "Silicon and Magnesium"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Iron and Nickel\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "science"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-080",
    "subject": "gk",
    "topic": "science",
    "topicLabel": "General Science",
    "difficulty": "easy",
    "question": "Which of the following is the longest bone in the human body?",
    "options": [
      "Femur",
      "Tibia",
      "Humerus",
      "Radius"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"Femur\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "science"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-081",
    "subject": "gk",
    "topic": "science",
    "topicLabel": "General Science",
    "difficulty": "easy",
    "question": "Which is the largest planet in the Solar System?",
    "options": [
      "Saturn",
      "Earth",
      "Neptune",
      "Jupiter"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"Jupiter\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "science"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-082",
    "subject": "gk",
    "topic": "science",
    "topicLabel": "General Science",
    "difficulty": "easy",
    "question": "Which of these diseases is caused by a virus?",
    "options": [
      "Tuberculosis",
      "Malaria",
      "AIDS",
      "Diabetes"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"AIDS\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "science"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-083",
    "subject": "gk",
    "topic": "science",
    "topicLabel": "General Science",
    "difficulty": "easy",
    "question": "What is the basic unit of life?",
    "options": [
      "Organ",
      "Cell",
      "Tissue",
      "Organism"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Cell\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "science"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-084",
    "subject": "gk",
    "topic": "environment",
    "topicLabel": "Environment & Ecology",
    "difficulty": "easy",
    "question": "Which of the following gases is primarily responsible for the greenhouse effect?",
    "options": [
      "Oxygen",
      "Carbon dioxide",
      "Nitrogen",
      "Helium"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Carbon dioxide\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "environment"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-085",
    "subject": "gk",
    "topic": "mizoram-society",
    "topicLabel": "Mizoram Society & Culture",
    "difficulty": "medium",
    "question": "Mizo society is a-",
    "options": [
      "Patriarchal society",
      "Matriarchal society",
      "Polyandrous society",
      "Polygamous society"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"Patriarchal society\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "mizoram-society"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-086",
    "subject": "gk",
    "topic": "mizoram-society",
    "topicLabel": "Mizoram Society & Culture",
    "difficulty": "medium",
    "question": "The first step of jhumming cultivation is",
    "options": [
      "Clearing of land",
      "Demarcation of land",
      "Selection of land",
      "Burning of dried trees"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Selection of land\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "mizoram-society"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-092",
    "subject": "gk",
    "topic": "mizoram-society",
    "topicLabel": "Mizoram Society & Culture",
    "difficulty": "hard",
    "question": "Tumphit instrument is made of -",
    "options": [
      "Mithun's horn",
      "Wooden pieces",
      "Bamboo tubes",
      "Marble"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Bamboo tubes\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "mizoram-society"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-095",
    "subject": "gk",
    "topic": "mizoram-society",
    "topicLabel": "Mizoram Society & Culture",
    "difficulty": "medium",
    "question": "Mizo language belongs to -",
    "options": [
      "Mon-Khmer",
      "Indo-Chinese",
      "Tibeto-Burman",
      "Karen"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Tibeto-Burman\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "mizoram-society"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-098",
    "subject": "history",
    "topic": "mizoram-history",
    "topicLabel": "Mizoram History",
    "difficulty": "hard",
    "question": "The first Superintendent of the Lushai Hills was -",
    "options": [
      "John Shakespeare",
      "C.S. Murray",
      "V. Tregear",
      "Robert McCabe"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"John Shakespeare\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "mizoram-history"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-jelad-gk2-099",
    "subject": "history",
    "topic": "mizoram-history",
    "topicLabel": "Mizoram History",
    "difficulty": "hard",
    "question": "In 1907, the Lakher Pioneer Mission was started by -",
    "options": [
      "Edwin Rowlands",
      "J.H. Lorrain",
      "D.E. Jones",
      "Reginald A. Lorrain"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"Reginald A. Lorrain\".",
    "source": "MPSC (Mizoram)",
    "year": 2025,
    "tags": [
      "mizoram-history"
    ],
    "paperId": "mpsc-direct-ng-2025-je-lad-pwd-iwrd-general-knowledge-paper-2"
  },
  {
    "id": "mpsc-mls-gk-003",
    "subject": "current-affairs",
    "topic": "government-schemes",
    "topicLabel": "Government Schemes",
    "difficulty": "medium",
    "question": "The PM-DevINE scheme is a new venture of government exclusively targeted for infrastructure projects in:",
    "options": [
      "150 Most Backward Districts",
      "Most Backward Tribal Areas",
      "North East India",
      "Coastal Regions"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"North East India\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "government-schemes"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-004",
    "subject": "current-affairs",
    "topic": "sports",
    "topicLabel": "Sports",
    "difficulty": "medium",
    "question": "Who were the flag bearers for India during the opening ceremony at the 2024 Paris Olympics?",
    "options": [
      "PV Sindhu & Sharath Kamal",
      "PV Sindhu & Neeraj Chopra",
      "PV Sindhu & Rohan Bopanna",
      "PV Sindhu & HS Prannoy"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"PV Sindhu & Sharath Kamal\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "sports"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-005",
    "subject": "current-affairs",
    "topic": "elections",
    "topicLabel": "Elections",
    "difficulty": "medium",
    "question": "How many seats did the Indian National Congress (INC) win in General Election to member of Parliament (Lok Sabha) in 2024?",
    "options": [
      "96",
      "97",
      "98",
      "99"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"99\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "elections"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-006",
    "subject": "current-affairs",
    "topic": "culture",
    "topicLabel": "Culture & Festivals",
    "difficulty": "easy",
    "question": "Pakke Paga Hornbill Festival, which was seen in the news, is celebrated in which state of India?",
    "options": [
      "Assam",
      "Sikkim",
      "Arunachal Pradesh",
      "Nagaland"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Arunachal Pradesh\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "culture"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-008",
    "subject": "current-affairs",
    "topic": "international-relations",
    "topicLabel": "International Relations",
    "difficulty": "medium",
    "question": "Prime Minister Narendra Modi handed over the G20 presidency to :",
    "options": [
      "Carmen Lucia",
      "Jair Bolsonaro",
      "Michel Temer",
      "Luiz Inacio Lula da Silva"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"Luiz Inacio Lula da Silva\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "international-relations"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-010",
    "subject": "current-affairs",
    "topic": "world-affairs",
    "topicLabel": "World Affairs",
    "difficulty": "medium",
    "question": "What is the controversial form of execution that was recently introduced in the US?",
    "options": [
      "Nitrogen Hypoxia",
      "Carbon Monoxide hypoxia",
      "Hydrogen cyanide hypoxia",
      "Sarin gas execution"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"Nitrogen Hypoxia\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "world-affairs"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-012",
    "subject": "current-affairs",
    "topic": "science-tech",
    "topicLabel": "Science & Technology",
    "difficulty": "medium",
    "question": "Which giant tech company recently announced the launch of 'AMBER alerts' to find missing children?",
    "options": [
      "Microsoft",
      "Google",
      "Meta",
      "Apple"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Meta\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "science-tech"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-013",
    "subject": "current-affairs",
    "topic": "international-organizations",
    "topicLabel": "International Organizations",
    "difficulty": "medium",
    "question": "The Global Waste Management Outlook, 2024 was published by -",
    "options": [
      "UNDP",
      "UNEP",
      "IMF",
      "World Bank"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"UNEP\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "international-organizations"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-014",
    "subject": "current-affairs",
    "topic": "government-schemes",
    "topicLabel": "Government Schemes",
    "difficulty": "hard",
    "question": "Consider the following statements regarding 'Digital India Bhashini': 1. Bhashini stands for BHASHA Interface for India. 2. It is an AI-led language translation platform under the Ministry of IT and Electronics. 3. Bhashini Platform is a part of the National Language Translation Mission. Which of the statements given above is/are false?",
    "options": [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "All statements are true"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"All statements are true\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "government-schemes"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-015",
    "subject": "current-affairs",
    "topic": "science-tech",
    "topicLabel": "Science & Technology",
    "difficulty": "medium",
    "question": "The 2023 Nobel Prize in Physiology or Medicine was awarded to Katalin Karikó and Drew Weissman for their pioneering work on -",
    "options": [
      "CRISPR-CAS9 gene editing systems",
      "CAR-T cells for cancer treatment",
      "mRNA vaccines against COVID19",
      "Thermal and mechanical transducers"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"mRNA vaccines against COVID19\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "science-tech"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-016",
    "subject": "polity",
    "topic": "parliament",
    "topicLabel": "Parliament & Legislation",
    "difficulty": "hard",
    "question": "Consider the following statements regarding the Nari Shakti Vandan Adhiniyam or the Women's Reservation Bill which was recently passed by the Parliament: 1. The Act aims to reserve one-third of all seats for women in the Lok Sabha and the State Legislatures. 2. The Act also included reservation of one third of the seats to women of economically weaker sections. 3. The Act shall also reserve one third of the seats for SC and ST sections. Choose the correct answer:",
    "options": [
      "1 and 2 are true",
      "1 and 3 are true",
      "Only 1 is true",
      "All statements are true"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Only 1 is true\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "parliament"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-017",
    "subject": "current-affairs",
    "topic": "elections",
    "topicLabel": "Elections",
    "difficulty": "medium",
    "question": "The Election Commission of India started the 'Mera Pehla Vote Desh Ke Liye' campaign with which ministry?",
    "options": [
      "Ministry of Education",
      "Ministry of Home Affairs",
      "Ministry of Minority Affairs",
      "Ministry of Youth affairs and sports"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"Ministry of Education\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "elections"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-018",
    "subject": "gk",
    "topic": "economy",
    "topicLabel": "Indian Economy",
    "difficulty": "medium",
    "question": "Which of these statements regarding the launched Central Bank Digital Currency (CBDC) is false?",
    "options": [
      "They are legal tenders issued and backed by a central bank.",
      "It is the same as a fiat currency and is exchangeable one-to-one with the fiat currency.",
      "The digital fiat currency can be transacted using wallets backed by blockchain.",
      "The value of the digital currency is pegged to the price of a commodity such as gold or silver."
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"The value of the digital currency is pegged to the price of a commodity such as gold or silver.\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "economy"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-019",
    "subject": "current-affairs",
    "topic": "world-affairs",
    "topicLabel": "World Affairs",
    "difficulty": "medium",
    "question": "Which country launched the 'Ukraine Security Assistance Initiative'?",
    "options": [
      "USA",
      "UK",
      "Australia",
      "Germany"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"USA\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "world-affairs"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-020",
    "subject": "current-affairs",
    "topic": "science-tech",
    "topicLabel": "Science & Technology",
    "difficulty": "medium",
    "question": "Which Indian institution has developed and patented a device named 'Artsens' to screen for cardiovascular diseases?",
    "options": [
      "IIT Delhi",
      "IISc Bengaluru",
      "IIT Madras",
      "NIT Tiruchirappalli"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"IIT Madras\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "science-tech"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-021",
    "subject": "gk",
    "topic": "international-organizations",
    "topicLabel": "International Organizations",
    "difficulty": "medium",
    "question": "The 'International Day of Solidarity with the Palestinian People' observed by the UN yearly since 1978 is on -",
    "options": [
      "November 29",
      "November 30",
      "December 1",
      "December 2"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"November 29\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "international-organizations"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-022",
    "subject": "current-affairs",
    "topic": "science-tech",
    "topicLabel": "Science & Technology",
    "difficulty": "medium",
    "question": "Air India's AI-powered chat assistant, a generative AI virtual agent, is called -",
    "options": [
      "SkyMate",
      "Maharaja",
      "CloudTalk",
      "Aisha"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Maharaja\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "science-tech"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-023",
    "subject": "current-affairs",
    "topic": "economy",
    "topicLabel": "Indian Economy",
    "difficulty": "medium",
    "question": "What is the daily payment limit for UPI transactions set by the National Payments Corporation of India (NPCI) starting from January 1, 2024? (except for Educational Institute or Healthcare)",
    "options": [
      "Rs. 10,000",
      "Rs. 50,000",
      "Rs. 1 lakh",
      "Rs. 5 lakh"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Rs. 1 lakh\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "economy"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-024",
    "subject": "current-affairs",
    "topic": "science-tech",
    "topicLabel": "Science & Technology",
    "difficulty": "medium",
    "question": "Which company has recently announced an initiative 'AI Odyssey' to skill 100,000 developers in India on AI technology?",
    "options": [
      "IBM",
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"Microsoft\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "science-tech"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-025",
    "subject": "current-affairs",
    "topic": "defence",
    "topicLabel": "Defence & Military",
    "difficulty": "medium",
    "question": "Drishti 10 Starliner, the indigenously manufactured Unmanned Aerial Vehicle (UAV) recently flagged off by Chief of Naval Staff was developed by -",
    "options": [
      "Adani Defence and Aerospace",
      "DRDO",
      "Hindustan Aeronautics",
      "Advanced Weapons and Equipment India Limited"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"Adani Defence and Aerospace\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "defence"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-027",
    "subject": "current-affairs",
    "topic": "polity",
    "topicLabel": "Polity Current Affairs",
    "difficulty": "easy",
    "question": "Which state in India became the first to implement the Uniform Civil Code?",
    "options": [
      "Goa",
      "Himachal Pradesh",
      "Uttarakhand",
      "Gujarat"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Uttarakhand\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "polity"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-028",
    "subject": "current-affairs",
    "topic": "world-affairs",
    "topicLabel": "World Affairs",
    "difficulty": "medium",
    "question": "Which country enshrined the Right to Abortion in its Constitution?",
    "options": [
      "USA",
      "France",
      "Germany",
      "Denmark"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"France\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "world-affairs"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-030",
    "subject": "current-affairs",
    "topic": "world-affairs",
    "topicLabel": "World Affairs",
    "difficulty": "medium",
    "question": "Who is the first woman to be elected as Chief Minister of a province in Pakistan?",
    "options": [
      "Maryam Nawaz",
      "Benazir Bhutto",
      "Zartaj Gul",
      "Nafisa Shah"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"Maryam Nawaz\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "world-affairs"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-031",
    "subject": "current-affairs",
    "topic": "border-affairs",
    "topicLabel": "Border & Security Affairs",
    "difficulty": "hard",
    "question": "Consider the following statements regarding the Free Movement Regime - 1. It has been in place since 2018. 2. It allows tribes inhabiting both sides of the border to travel up to 16 km across the border without visas. 3. Individuals were also allowed up to 3 months in the neighboring country by getting a one-year border pass. Select the statements that are True:",
    "options": [
      "1 only",
      "1 and 2",
      "2 and 3",
      "1 and 3"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"2 and 3\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "border-affairs"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-032",
    "subject": "current-affairs",
    "topic": "world-affairs",
    "topicLabel": "World Affairs",
    "difficulty": "medium",
    "question": "Which country filed a case against Israel in the International Court of Justice claiming violations of its obligations under the Genocide Convention regarding acts against Palestinians in Gaza?",
    "options": [
      "UK",
      "Germany",
      "South Africa",
      "Brazil"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"South Africa\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "world-affairs"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-033",
    "subject": "current-affairs",
    "topic": "international-relations",
    "topicLabel": "International Relations",
    "difficulty": "medium",
    "question": "The foundation stone for Bharat Mart was recently laid by Prime Minister Narendra Modi in which city -",
    "options": [
      "Dubai",
      "Cairo",
      "Riyadh",
      "Abu Dhabi"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"Dubai\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "international-relations"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-034",
    "subject": "current-affairs",
    "topic": "judiciary",
    "topicLabel": "Judiciary",
    "difficulty": "medium",
    "question": "The Supreme Court of India, in an attempt to ensure the complete eradication of manual scavenging has ordered the compensation in the cases of sewer deaths to be increased to -",
    "options": [
      "Rs. 10 lakhs",
      "Rs. 20 lakhs",
      "Rs. 30 lakhs",
      "Rs. 40 lakhs"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Rs. 30 lakhs\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "judiciary"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-035",
    "subject": "current-affairs",
    "topic": "economy",
    "topicLabel": "Indian Economy",
    "difficulty": "medium",
    "question": "What per cent of GST is levied on cancer-fighting drugs, medicines for rare diseases, and food products for special medical purposes?",
    "options": [
      "0%",
      "2%",
      "5%",
      "12%"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"0%\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "economy"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-036",
    "subject": "current-affairs",
    "topic": "science-tech",
    "topicLabel": "Science & Technology",
    "difficulty": "medium",
    "question": "Which institution has released a set of guidelines regarding Generative AI in India to ensure responsible AI use?",
    "options": [
      "TRAI",
      "NASSCOM",
      "MeitY",
      "Ministry of Information and Broadcasting"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"MeitY\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "science-tech"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-037",
    "subject": "current-affairs",
    "topic": "economy",
    "topicLabel": "Indian Economy",
    "difficulty": "medium",
    "question": "GIFT NIFTY is the first cross-border initiative in connecting the capital markets of India and which country?",
    "options": [
      "Japan",
      "France",
      "USA",
      "Singapore"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"Singapore\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "economy"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-038",
    "subject": "current-affairs",
    "topic": "science-tech",
    "topicLabel": "Science & Technology",
    "difficulty": "easy",
    "question": "Which of the following advanced AI model has been launched by Google's parent company Alphabet?",
    "options": [
      "Aqua",
      "Gemini",
      "Neo",
      "Gossip"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Gemini\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "science-tech"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-040",
    "subject": "current-affairs",
    "topic": "world-affairs",
    "topicLabel": "World Affairs",
    "difficulty": "medium",
    "question": "Which country has joined NATO as its 32nd member?",
    "options": [
      "Sweden",
      "Finland",
      "Ukraine",
      "Serbia"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"Sweden\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "world-affairs"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-041",
    "subject": "polity",
    "topic": "constitutional-sources",
    "topicLabel": "Sources of the Constitution",
    "difficulty": "medium",
    "question": "Which of the following features and their source is wrongly matched?",
    "options": [
      "Judicial review — British practice",
      "Concurrent List — Australian Constitution",
      "Directive Principles — Irish Constitution",
      "Fundamental Rights — US Constitution"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"Judicial review — British practice\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "constitutional-sources"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-042",
    "subject": "polity",
    "topic": "federalism",
    "topicLabel": "Federalism",
    "difficulty": "medium",
    "question": "Which of the following is a feature common to both the Indian Federation and the American Federation?",
    "options": [
      "A single citizenship",
      "Dual Judiciary",
      "Three lists in the Constitution",
      "A Federal Supreme Court to interpret the Constitution"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"A Federal Supreme Court to interpret the Constitution\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "federalism"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-043",
    "subject": "polity",
    "topic": "dpsp",
    "topicLabel": "Directive Principles of State Policy",
    "difficulty": "medium",
    "question": "Which of the following is/are included in the Directive Principles of State Policy? 1. Prohibition of traffic in human beings and forced labour. 2. Prohibition of consumption except for medicinal purposes of intoxicating drinks and of other drugs which are injurious to health.",
    "options": [
      "1 only",
      "2 only",
      "Both 1 and 2",
      "Neither 1 nor 2"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"2 only\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "dpsp"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-044",
    "subject": "polity",
    "topic": "dpsp",
    "topicLabel": "Directive Principles of State Policy",
    "difficulty": "medium",
    "question": "The Articles of the Constitution of India which deal with Directive Principles of State Policy are :",
    "options": [
      "26-41",
      "30-45",
      "36-51",
      "46-61"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"36-51\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "dpsp"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-045",
    "subject": "polity",
    "topic": "dpsp",
    "topicLabel": "Directive Principles of State Policy",
    "difficulty": "hard",
    "question": "Consider the following statements regarding Uniform Civil Code: 1. It is mentioned in Article 43 of the Constitution. 2. It would replace the distinct personal laws of each religion. 3. It has been enforced in three states in India. Select the correct answer.",
    "options": [
      "Only 1 is True",
      "Only 2 is true",
      "1 and 2 are true",
      "2 and 3 are true"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Only 2 is true\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "dpsp"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-047",
    "subject": "polity",
    "topic": "legislative-lists",
    "topicLabel": "Union, State & Concurrent Lists",
    "difficulty": "hard",
    "question": "Which of the following is not correctly matched with reference to the Constitution?",
    "options": [
      "Forests — Concurrent List",
      "Bankruptcy and insolvency — State List",
      "Insurance — Union List",
      "Marriage and Divorce — Concurrent List"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Bankruptcy and insolvency — State List\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "legislative-lists"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-048",
    "subject": "polity",
    "topic": "constitutional-bodies",
    "topicLabel": "Constitutional & Extra-Constitutional Bodies",
    "difficulty": "medium",
    "question": "The Prime Minister, Union Cabinet Minister, Chief Minister and Council of Ministers are all members of",
    "options": [
      "National Integration Council",
      "Planning Commission",
      "National Development Council",
      "Zonal Council"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"National Development Council\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "constitutional-bodies"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-049",
    "subject": "polity",
    "topic": "article-370",
    "topicLabel": "Article 370 & J&K Reorganisation",
    "difficulty": "medium",
    "question": "Choose the correct answer, considering the following statements: 1. The Jammu and Kashmir Reorganisation Bill, 2019 was introduced in Rajya Sabha. 2. The abrogation of Article 370 bifurcated the state into three separate Union Territories — Jammu & Kashmir, Ladakh and Leh.",
    "options": [
      "Only 1 is true",
      "Only 2 is true",
      "Both 1 and 2 are true",
      "Neither 1 or 2 are true"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"Only 1 is true\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "article-370"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-052",
    "subject": "polity",
    "topic": "parliament",
    "topicLabel": "Parliament & Legislation",
    "difficulty": "medium",
    "question": "Which of the statements is/are false regarding the powers of the Rajya Sabha? 1. A money bill cannot be introduced in the Rajya Sabha 2. The Rajya Sabha has no power to reject or amend a Money Bill 3. It has voting rights on the Demands for grants",
    "options": [
      "1 and 2",
      "Only 1",
      "Only 3",
      "2 and 3"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Only 3\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "parliament"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-053",
    "subject": "polity",
    "topic": "union-budget",
    "topicLabel": "Union Budget",
    "difficulty": "medium",
    "question": "Which one of the following is responsible for the preparation and presentation of Union Budget to the Parliament?",
    "options": [
      "Department of Revenue",
      "Department of Financial Services",
      "Department of Expenditure",
      "Department of Economic Affairs"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"Department of Economic Affairs\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "union-budget"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-054",
    "subject": "polity",
    "topic": "constitutional-bodies",
    "topicLabel": "Constitutional & Extra-Constitutional Bodies",
    "difficulty": "medium",
    "question": "The establishment and power of the Election Commission of India comes under ___ of the Constitution.",
    "options": [
      "Part IV, Article 324",
      "Part VI, Article 320",
      "Part XV, Article 324",
      "Part XI, Article 320"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"Part XV, Article 324\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "constitutional-bodies"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-055",
    "subject": "polity",
    "topic": "constitutional-bodies",
    "topicLabel": "Constitutional & Extra-Constitutional Bodies",
    "difficulty": "medium",
    "question": "Which one is not true about the Attorney General of India?",
    "options": [
      "He is the legal advisor to the Government of India",
      "He has voting rights in the proceeding of the Parliament",
      "His tenure and salary are decided by the President",
      "He appears before high courts and Supreme Court in cases involving union government."
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"He has voting rights in the proceeding of the Parliament\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "constitutional-bodies"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-056",
    "subject": "polity",
    "topic": "parliament",
    "topicLabel": "Parliament & Legislation",
    "difficulty": "medium",
    "question": "The quorum for Joint Sitting of the Indian Parliament is -",
    "options": [
      "One-twelfth of the total number of members of the House.",
      "One-sixth of the total numbers of members of the House.",
      "Two-thirds of the total number of members of the House.",
      "One-tenth of the total number of members of the House."
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"One-tenth of the total number of members of the House.\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "parliament"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-058",
    "subject": "polity",
    "topic": "judiciary",
    "topicLabel": "Judiciary",
    "difficulty": "medium",
    "question": "This single system of courts, adopted from the ___ enforces both Central laws as well as the state laws.",
    "options": [
      "Government of India Act of 1935",
      "Government of India Act of 1953",
      "Government of India Act of 1947",
      "Government of India Act of 1950"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"Government of India Act of 1935\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "judiciary"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-059",
    "subject": "polity",
    "topic": "constitutional-sources",
    "topicLabel": "Sources of the Constitution",
    "difficulty": "medium",
    "question": "The concept of the Freedom of trade in India's Constitution is adopted from the Constitution of which country?",
    "options": [
      "United Kingdom",
      "United States",
      "Ireland",
      "Australia"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"Australia\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "constitutional-sources"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-061",
    "subject": "gk",
    "topic": "economy",
    "topicLabel": "Indian Economy",
    "difficulty": "medium",
    "question": "The Human Development Index (HDI) summarizes a great deal of social performance in a single composite index, which combines -",
    "options": [
      "disparity reduction rate, human resource development rate and the composite index.",
      "longevity, education and living standard.",
      "minimum schooling, adult literacy and tertiary educational attainment.",
      "human resource training, development and R&D."
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"longevity, education and living standard.\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "economy"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-062",
    "subject": "gk",
    "topic": "international-organizations",
    "topicLabel": "International Organizations",
    "difficulty": "hard",
    "question": "When was the United Nations Commission on Sustainable Development (CSD) started by the UN General Assembly?",
    "options": [
      "January 1992",
      "March 1993",
      "December 1992",
      "November 1993"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"December 1992\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "international-organizations"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-063",
    "subject": "gk",
    "topic": "government-schemes",
    "topicLabel": "Government Schemes",
    "difficulty": "medium",
    "question": "With regard to the Pradhan Mantri Rozgar Protsahan Yojana, consider the following statements- 1. It is implemented by the Ministry of Labour and Employment. 2. The scheme is targeted for workers earning wages upto Rs. 15,000/- per month 3. Any person who crossed 30 years of age can join the scheme. Which among the above statements is/are correct?",
    "options": [
      "1 and 2",
      "1 and 3",
      "2 and 3",
      "1,2 and 3"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"1 and 2\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "government-schemes"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-064",
    "subject": "gk",
    "topic": "government-schemes",
    "topicLabel": "Government Schemes",
    "difficulty": "medium",
    "question": "Which of these is not an objective of 'Make In India' initiative?",
    "options": [
      "To promote export-led growth.",
      "To remove disconnect between demand and supply of skilled manpower.",
      "To attract foreign investment for new industrialisation.",
      "To create 100 million additional jobs by 2022."
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"To promote export-led growth.\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "government-schemes"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-065",
    "subject": "gk",
    "topic": "government-schemes",
    "topicLabel": "Government Schemes",
    "difficulty": "medium",
    "question": "The 'YUVA PORTAL' to identify potential young Start-Ups functions under which union ministry?",
    "options": [
      "Ministry of Science and Technology",
      "Ministry of Youth Affairs and Sports",
      "Ministry of Power",
      "Ministry of Housing and Urban Affairs"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Ministry of Youth Affairs and Sports\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "government-schemes"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-067",
    "subject": "gk",
    "topic": "economy",
    "topicLabel": "Indian Economy",
    "difficulty": "medium",
    "question": "Consider the following statements: 1. The Self-Help Group (SHG) programme was originally initiated by the State Bank of India by providing microcredit to the financially deprived. 2. In an SHG all members of a group take responsibility for a loan that an individual member takes. Which of these statements are true?",
    "options": [
      "Only I",
      "Only II",
      "I and II",
      "Neither I nor II"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Only II\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "economy"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-068",
    "subject": "polity",
    "topic": "constituent-assembly",
    "topicLabel": "Constituent Assembly",
    "difficulty": "medium",
    "question": "Which of the following Committees of the Constituent Assembly was headed by Sardar Vallabhbhai Patel? 1. Provincial Constitution Committee 2. Advisory Committee on Fundamental Rights, Minorities, and Tribal and Excluded Areas 3. Union Constitution committee 4. Drafting Committee",
    "options": [
      "1 and 2",
      "2 and 3",
      "3 and 4",
      "All of the above"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"1 and 2\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "constituent-assembly"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-069",
    "subject": "polity",
    "topic": "preamble",
    "topicLabel": "Preamble",
    "difficulty": "medium",
    "question": "The term 'Socialist' in the Preamble was added to the constitution in the year ___ by the ___ Constitutional Amendment Act.",
    "options": [
      "1975; 40th",
      "1975; 42nd",
      "1976; 42nd",
      "1977; 43rd"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"1976; 42nd\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "preamble"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-070",
    "subject": "history",
    "topic": "modern-india",
    "topicLabel": "Modern Indian History",
    "difficulty": "medium",
    "question": "India's first Five Year Plan introduced by Jawaharlal Nehru spanned the period between -",
    "options": [
      "April 1950 — March 1955",
      "April 1951 — March 1956",
      "April 1952 — March 1957",
      "April 1953 — March 1958"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"April 1951 — March 1956\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "modern-india"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-071",
    "subject": "history",
    "topic": "modern-india",
    "topicLabel": "Modern Indian History",
    "difficulty": "medium",
    "question": "The State Reorganisation Commission was constituted in the year -",
    "options": [
      "1950",
      "1951",
      "1952",
      "1953"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"1953\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "modern-india"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-072",
    "subject": "history",
    "topic": "freedom-struggle",
    "topicLabel": "Freedom Struggle",
    "difficulty": "medium",
    "question": "Who was the president of Indian National Congress at the time of India's Independence?",
    "options": [
      "J.B. Kripalani",
      "Jawaharlal Nehru",
      "Sardar Vallabhai Patel",
      "Abul Kalam Azad"
    ],
    "answerIndex": 0,
    "explanation": "Correct answer: \"J.B. Kripalani\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "freedom-struggle"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-081",
    "subject": "reasoning",
    "topic": "quantitative-aptitude",
    "topicLabel": "Quantitative Aptitude",
    "difficulty": "medium",
    "question": "The average of 7 consecutive numbers is 20. The largest of these numbers is:",
    "options": [
      "21",
      "22",
      "23",
      "24"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"23\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "quantitative-aptitude"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-082",
    "subject": "reasoning",
    "topic": "quantitative-aptitude",
    "topicLabel": "Quantitative Aptitude",
    "difficulty": "hard",
    "question": "A shopkeeper cheats to the extent of 10% while buying and selling, by using false weights. His total gain is -",
    "options": [
      "20%",
      "21%",
      "22%",
      "23%"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"21%\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "quantitative-aptitude"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-083",
    "subject": "reasoning",
    "topic": "quantitative-aptitude",
    "topicLabel": "Quantitative Aptitude",
    "difficulty": "hard",
    "question": "A can do a piece of work in 10 days, B in 15 days. They work together for 5 days, the rest of the work is finished by C in two more days. If they get Rs. 3000 as wages for the whole work, what are the daily wages of A, B and C respectively (in Rs.)?",
    "options": [
      "200, 250, 300",
      "300, 200, 250",
      "200, 300, 400",
      "None of these"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"300, 200, 250\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "quantitative-aptitude"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-087",
    "subject": "reasoning",
    "topic": "verbal-analogy",
    "topicLabel": "Verbal Analogy",
    "difficulty": "medium",
    "question": "Exhibit : display :: send : ?",
    "options": [
      "Stamp",
      "Receive",
      "Show",
      "Emit"
    ],
    "answerIndex": 3,
    "explanation": "Correct answer: \"Emit\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "verbal-analogy"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-088",
    "subject": "reasoning",
    "topic": "quantitative-aptitude",
    "topicLabel": "Quantitative Aptitude",
    "difficulty": "hard",
    "question": "In a class of 60 students where girls are twice that of boys, Laxmi ranked 27th from the top. If there are 9 boys ahead of Laxmi, how many girls are after her rank?",
    "options": [
      "23",
      "21",
      "22",
      "24"
    ],
    "answerIndex": 2,
    "explanation": "Correct answer: \"22\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "quantitative-aptitude"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-090",
    "subject": "reasoning",
    "topic": "logical-reasoning",
    "topicLabel": "Logical Reasoning",
    "difficulty": "medium",
    "question": "I. Tanya is older than Eric. II. Cliff is older than Tanya. III. Eric is older than Cliff. If the first two statements are true, the third statement is",
    "options": [
      "true",
      "false",
      "uncertain",
      "none"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"false\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "logical-reasoning"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  },
  {
    "id": "mpsc-mls-gk-091",
    "subject": "reasoning",
    "topic": "verbal-analogy",
    "topicLabel": "Verbal Analogy",
    "difficulty": "hard",
    "question": "Seismography : Earthquake :: Taseometer : ?",
    "options": [
      "Landslides",
      "Strains",
      "Resistances",
      "Volcanoes"
    ],
    "answerIndex": 1,
    "explanation": "Correct answer: \"Strains\".",
    "source": "MPSC (Mizoram)",
    "year": 2024,
    "tags": [
      "verbal-analogy"
    ],
    "paperId": "mpsc-direct-2024-mizoram-legal-service-general-knowledge"
  }
];
