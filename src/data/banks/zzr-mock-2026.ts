import type { BankDifficulty, BankQuestion, ExamPaper, QuestionBank } from './types';
import type { UdcLdcPaperMeta } from './mpsc-udc-ldc';

// ==========================================================
// ZAWLBUK ZIRNA RUN MOCK TEST — 24 OCTOBER 2026
//
// Paper I  (General Knowledge + General English)  — 75 MCQ
// Paper II (Computer + Arithmetic + Reasoning)     — 100 MCQ
//
// Paper II answers are transcribed from the coaching centre's
// printed answer key (Paper II, Series B). Paper I has no printed
// key in the source pack, so those answers are worked solutions;
// their confidence is recorded per question. Items where the key
// is factually questionable keep the keyed answer and carry a
// `disputeNote`, so the mock reproduces what the paper marks while
// still telling the learner where the answer is disputed.
// ==========================================================

const PAPER_1_ID = 'zzr-mock-2026-paper-1';
const PAPER_2_ID = 'zzr-mock-2026-paper-2';

export const zzrMock2026Papers: ExamPaper[] = [
  {
    id: PAPER_1_ID,
    examType: 'Mock',
    examName: 'Zawlbuk Zirna Run Mock Test',
    post: 'Assistant Grade & UDC',
    paperNumber: 'Paper I',
    paperSubject: 'General Knowledge & General English',
    year: 2026,
    sourceFile: '/papers/zzr-mock-2026/paper-1-series-b.pdf',
  },
  {
    id: PAPER_2_ID,
    examType: 'Mock',
    examName: 'Zawlbuk Zirna Run Mock Test',
    post: 'Assistant Grade & UDC',
    paperNumber: 'Paper II',
    paperSubject: 'Basic Computer, Arithmetic & Reasoning',
    year: 2026,
    sourceFile: '/papers/zzr-mock-2026/paper-2-series-b.pdf',
  },
];

export const zzrMock2026ExpectedMcq: Record<string, number> = {
  [PAPER_1_ID]: 75,
  [PAPER_2_ID]: 100,
};

export const zzrMock2026PaperMeta: Record<string, UdcLdcPaperMeta> = {
  [PAPER_1_ID]: {
    marksPerQuestion: 2,
    durationMinutes: 180,
    negativeMarking: true,
    penaltyFraction: 1 / 3,
  },
  [PAPER_2_ID]: {
    marksPerQuestion: 2,
    durationMinutes: 180,
    negativeMarking: true,
    penaltyFraction: 1 / 3,
  },
};

type Section = NonNullable<BankQuestion['studySection']>;

interface Seed {
  q: string;
  /** Printed instruction that applies to the question stem. */
  direction?: string;
  options: [string, string, string, string];
  answer: number;
  topic: string;
  topicLabel: string;
  section: Section;
  explanation: string;
  difficulty?: BankDifficulty;
  confidence?: 'high' | 'medium' | 'low';
  imagePath?: string;
  disputeNote?: string;
  sourceDefect?: BankQuestion['sourceDefect'];
  gkKind?: 'static' | 'current';
  gkTopic?: BankQuestion['gkTopic'];
  tags?: string[];
}

const GK_TOPIC_BY_TOPIC: Record<string, NonNullable<BankQuestion['gkTopic']>> = {
  'polity-constitution': 'polity-constitution',
  geography: 'geography',
  'modern-indian-history': 'modern-indian-history',
  economy: 'economy',
  'general-science': 'general-science',
  'mizoram-culture': 'mizoram',
  'mizoram-history': 'mizoram',
  'current-affairs': 'current-affairs',
};

const SUBJECT_BY_SECTION: Record<Section, BankQuestion['subject']> = {
  gk: 'gk',
  english: 'english',
  computer: 'computer',
  arithmetic: 'arithmetic',
  reasoning: 'reasoning',
};

function build(
  paperId: string,
  source: string,
  sourceHref: string,
  answerSource: 'derived' | 'transcribed',
  answerKeyRef: string | undefined,
  seeds: Seed[],
): BankQuestion[] {
  return seeds.map((s, i) => {
    const number = i + 1;
    const gkTopic = s.gkTopic ?? (s.section === 'gk' ? GK_TOPIC_BY_TOPIC[s.topic] : undefined);
    const gkKind = s.gkKind ?? (s.topic === 'current-affairs' ? 'current' : gkTopic ? 'static' : undefined);
    return {
      id: `${paperId}-q${String(number).padStart(3, '0')}`,
      type: 'mcq',
      questionNumber: String(number),
      subject: SUBJECT_BY_SECTION[s.section],
      studySection: s.section,
      topic: s.topic,
      topicLabel: s.topicLabel,
      difficulty: s.difficulty ?? 'medium',
      question: s.direction ? `${s.direction}\n\n${s.q}` : s.q,
      options: s.options,
      answerIndex: s.answer,
      explanation: s.explanation,
      ...(s.imagePath ? { imagePath: s.imagePath } : {}),
      ...(s.disputeNote ? { disputeNote: s.disputeNote } : {}),
      ...(s.sourceDefect ? { sourceDefect: s.sourceDefect } : {}),
      ...(gkTopic ? { gkTopic } : {}),
      ...(gkKind ? { gkKind } : {}),
      ...(gkKind === 'current' ? { answerAsOf: 'October 2026' } : {}),
      ...(s.tags ? { tags: s.tags } : gkTopic === 'mizoram' ? { tags: ['mizoram'] } : {}),
      answerSource,
      answerConfidence: s.confidence ?? 'high',
      ...(answerKeyRef ? { answerKeyRef } : {}),
      source,
      sourceHref,
      paperId,
      year: 2026,
    };
  });
}

const paper1Seeds: Seed[] = [
  {
    q: `With reference to a Money Bill in the Indian Parliament, consider the following statements:
1. A Money Bill can be introduced only in the Lok Sabha and only on the recommendation of the President.
2. A Money Bill can be introduced by any Member of Parliament, provided the President's recommendation has been obtained.
3. The Speaker of the Lok Sabha has the final authority to certify whether a Bill is a Money Bill.
Which of the statements given above is/are correct?`,
    options: ['1 only', '1 and 2 only', '1 and 3 only', '1, 2 and 3'],
    answer: 2,
    topic: 'polity-constitution',
    topicLabel: 'Polity & Constitution',
    section: 'gk',
    explanation: `A Money Bill can be introduced only in the Lok Sabha and only on the President's recommendation, so statement 2 is wrong. The Speaker certifies whether a Bill is a Money Bill, and that decision is final. Statements 1 and 3 are correct.`,
  },
  {
    q: `Consider the following statements regarding the Schedules of the Indian Constitution:
(i) The Ninth Schedule was added by the First Constitutional Amendment Act, 1951.
(ii) The Tenth Schedule, dealing with the Anti-Defection Law, was added by the 52nd Constitutional Amendment Act, 1985.
(iii) The Eleventh Schedule contains 18 subjects relating to Panchayats.
(iv) The Twelfth Schedule contains 18 subjects relating to Municipalities.
Which of the statements given above is/are correct?`,
    options: ['Only (i) and (ii)', 'Only (i), (ii) and (iv)', 'Only (ii), (iii) and (iv)', 'All four statements'],
    answer: 1,
    topic: 'polity-constitution',
    topicLabel: 'Polity & Constitution',
    section: 'gk',
    explanation: `The Ninth Schedule was added by the First Amendment (1951), the Tenth by the 52nd Amendment (1985), and the Twelfth Schedule has 18 municipal subjects. The Eleventh Schedule has 29 Panchayat subjects, not 18, so (iii) is wrong.`,
  },
  {
    q: `Match the constitutional features with their principal sources.
1. Directive Principles — A. Ireland
2. Fundamental Duties — B. USSR
3. Concurrent List — C. Australia
4. Judicial review — D. United States
Choose the correct code.`,
    options: ['1-A, 2-B, 3-C, 4-D', '1-B, 2-A, 3-D, 4-C', '1-C, 2-D, 3-A, 4-B', '1-D, 2-C, 3-B, 4-A'],
    answer: 0,
    topic: 'polity-constitution',
    topicLabel: 'Polity & Constitution',
    section: 'gk',
    explanation: `The Directive Principles were inspired by Ireland, Fundamental Duties by the USSR, the Concurrent List by Australia, and judicial review by the United States.`,
  },
  {
    q: `Which of the following statements about the Council of Ministers is correct?`,
    options: [
      'It is collectively responsible to the Rajya Sabha.',
      'It is collectively responsible to the Lok Sabha.',
      'It is collectively responsible to the Parliament.',
      'It is collectively responsible to the Election Commission.',
    ],
    answer: 1,
    topic: 'polity-constitution',
    topicLabel: 'Polity & Constitution',
    section: 'gk',
    explanation: `Article 75(3) makes the Council of Ministers collectively responsible to the Lok Sabha, not to the Rajya Sabha or the Election Commission.`,
  },
  {
    q: `Boundary dispute between two Autonomous Districts within the same State — who has the final authority to decide?`,
    options: [
      'Governor on recommendation of Commission under Para 14',
      'Supreme Court under Article 131',
      'Parliament by amending the Sixth Schedule',
      'President after reference to Governor',
    ],
    answer: 0,
    topic: 'polity-constitution',
    topicLabel: 'Polity & Constitution',
    section: 'gk',
    explanation: `Paragraph 14 of the Sixth Schedule provides for a Commission appointed by the Governor to settle boundary disputes between autonomous districts; the Governor acts on its recommendation.`,
    confidence: 'medium',
  },
  {
    q: `Consider the procedure for creation of a Legislative Council:
1. The State Assembly must pass a resolution by special majority (two-thirds of those present and voting and an absolute majority of total membership).
2. Parliament then creates the Council by simple majority under Article 169(1).
3. Such a law of Parliament is NOT deemed a Constitution Amendment under Article 368.
Which of the statements given above is/are correct?`,
    options: ['1 and 2 only', '2 and 3 only', '1, 2 and 3', '1 and 3 only'],
    answer: 2,
    topic: 'polity-constitution',
    topicLabel: 'Polity & Constitution',
    section: 'gk',
    explanation: `All three steps are correct. The Assembly resolution needs a special majority, Parliament then acts by ordinary law under Article 169, and that law is not a constitutional amendment under Article 368.`,
  },
  {
    q: `Consider the following statements regarding Earth's interior:
1. S-waves cannot travel through the Earth's outer core.
2. P-waves can travel through both solid and liquid materials.
3. The Earth's inner core is believed to be liquid.
Which of the statements given above is/are correct?`,
    options: ['1 only', '1 and 2 only', '2 and 3 only', '1 and 2 only'],
    answer: 1,
    topic: 'geography',
    topicLabel: 'Geography',
    section: 'gk',
    explanation: `S-waves cannot pass through the liquid outer core, while P-waves can travel through solids and liquids. The inner core is solid, not liquid, so 1 and 2 are correct. The paper prints (b) and (d) identically; the keyed choice is (b).`,
    sourceDefect: 'duplicate-options',
    disputeNote: 'Options (b) and (d) are printed identically. The keyed answer is (b), but the duplication means the printed item is defective.',
  },
  {
    q: `Consider the following statements about El Niño:
1. It involves abnormal warming of the central and eastern equatorial Pacific Ocean.
2. It can influence the Indian summer monsoon.
3. It invariably causes drought throughout India.
Which of the statements given above is/are correct?`,
    options: ['1 only', '1 and 3 only', '1 and 2 only', '1, 2 and 3'],
    answer: 2,
    topic: 'geography',
    topicLabel: 'Geography',
    section: 'gk',
    explanation: `El Niño is abnormal warming of the central and eastern equatorial Pacific and can weaken the Indian monsoon, but it does not invariably cause drought everywhere in India. Statements 1 and 2 are correct.`,
  },
  {
    q: `Which layer of the atmosphere contains most weather phenomena?`,
    options: ['Troposphere', 'Stratosphere', 'Mesosphere', 'Thermosphere'],
    answer: 0,
    topic: 'geography',
    topicLabel: 'Geography',
    section: 'gk',
    explanation: `The troposphere holds most of the atmosphere's water vapour and is the layer where clouds, rain and most weather phenomena occur.`,
  },
  {
    q: `Which river is known as the "Dakshin Ganga"?`,
    options: ['Krishna', 'Kaveri', 'Narmada', 'Godavari'],
    answer: 3,
    topic: 'geography',
    topicLabel: 'Geography',
    section: 'gk',
    explanation: `The Godavari is called Dakshin Ganga because of its length, drainage area and cultural importance in peninsular India.`,
  },
  {
    q: `Which of the following wetlands were reported as new Ramsar sites in India in October 2026?`,
    options: [
      'Chilika Lake and Wular Lake',
      'Loktak Lake and Deepor Beel',
      'Sukhna Wetland and Sauj Jheel',
      'Sambhar Lake and Vembanad Lake',
    ],
    answer: 2,
    topic: 'current-affairs',
    topicLabel: 'Current Affairs — October 2026',
    section: 'gk',
    explanation: `Sukhna Wetland (Chandigarh) and Sauj Jheel (Uttar Pradesh) were the new Ramsar sites reported in October 2026.`,
    gkKind: 'current',
    confidence: 'medium',
  },
  {
    q: `Consider the following statements about the Indian monsoon:
1. Differential heating of land and sea contributes to monsoon circulation.
2. The Tibetan Plateau influences the atmospheric circulation of South Asia.
3. The Western Ghats cause orographic rainfall on their windward side.
Which of the statements given above is/are correct?`,
    options: ['1 only', '1 and 2 only', '2 and 3 only', '1, 2 and 3'],
    answer: 3,
    topic: 'geography',
    topicLabel: 'Geography',
    section: 'gk',
    explanation: `All three are correct. Land–sea heating drives the seasonal pressure difference, the Tibetan Plateau affects South Asian circulation, and the Western Ghats force moist winds to rise and produce orographic rain on the windward side.`,
  },
  {
    q: `Which of the following are major factors affecting the location of industries?
1. Availability of raw materials
2. Access to markets
3. Transport facilities
4. Availability of power and labour
Select the correct answer.`,
    options: ['1 and 2 only', '2 and 3 only', '1, 2 and 3 only', '1, 2, 3 and 4'],
    answer: 3,
    topic: 'geography',
    topicLabel: 'Geography — Industry',
    section: 'gk',
    explanation: `All four are standard locational factors. Industries also weigh land, capital and government policy, but raw materials, markets, transport, power and labour are the classic set.`,
  },
  {
    q: `With reference to mangrove forests, consider the following statements:
1. They are adapted to saline or brackish coastal environments.
2. They can reduce coastal erosion and wave impacts.
3. They are found exclusively in freshwater environments.
Which of the statements given above is/are correct?`,
    options: ['1 only', '1 and 3 only', '1 and 2 only', '1, 2 and 3'],
    answer: 2,
    topic: 'geography',
    topicLabel: 'Geography — Mangroves',
    section: 'gk',
    explanation: `Mangroves grow in saline or brackish coastal water and help stabilise coastlines and reduce wave energy. They are not freshwater-only, so 3 is wrong.`,
  },
  {
    q: `With reference to Caller Name Presentation (CNAP), consider the following statements:
1. It is intended to display the caller's name along with the phone number.
2. It is designed partly to help users identify callers and address certain forms of telephone fraud.
3. It is a satellite-based navigation system.
Select the correct answer.`,
    options: ['1 only', '1 and 2 only', '1 and 3 only', '1, 2 and 3'],
    answer: 1,
    topic: 'current-affairs',
    topicLabel: 'Current Affairs — CNAP',
    section: 'gk',
    explanation: `CNAP displays the caller's name with the number and can help users identify callers and reduce certain frauds. It has nothing to do with satellite navigation, so 3 is wrong.`,
    gkKind: 'current',
  },
  {
    q: `The Mizoram Government announced a reward of ₹40 lakh each for Lalremsiami and Lalthantluangi in October 2026. Which schemes were associated with this reward?`,
    options: [
      'Khelo India and TOPS',
      'Mizoram State Incentive Cash Award Scheme and Bana Kaih Scheme',
      'MGNREGA and Bana Kaih Scheme',
      'National Sports Development Fund and TOPS',
    ],
    answer: 1,
    topic: 'current-affairs',
    topicLabel: 'Current Affairs — Mizoram',
    section: 'gk',
    explanation: `The reward was linked to the Mizoram State Incentive Cash Award Scheme and the Bana Kaih Scheme.`,
    gkKind: 'current',
    confidence: 'medium',
  },
  {
    q: `Consider the following statements regarding the funding pattern under the VB-G RAM G Act, 2025:
1. States are required to bear 40% of the total programme expenditure.
2. For Northeastern and Himalayan States, the Union Government bears 90% of the expenditure.
3. Union Territories without a legislature receive 100% funding from the Union Government.
Which of the statements given above are correct?`,
    options: ['1 only', '2 and 3 only', '1 and 2 only', '1, 2 and 3'],
    answer: 3,
    topic: 'current-affairs',
    topicLabel: 'Current Affairs — Welfare Funding',
    section: 'gk',
    explanation: `The Act's funding framework uses a 60:40 Centre–State split, a 90:10 split for Northeastern and Himalayan States, and full Union funding for Union Territories without a legislature. All three statements are correct.`,
    gkKind: 'current',
    confidence: 'medium',
  },
  {
    q: `Which of the following statements about India's performance at the 2026 Asian Games is correct?
1. India won 21 gold medals.
2. Athletics was India's leading medal-producing sport, with 24 medals.
3. India finished first in the overall medal tally.
Select the correct answer.`,
    options: ['1 and 2 only', '1 and 3 only', '1 only', '1, 2 and 3'],
    answer: 0,
    topic: 'current-affairs',
    topicLabel: 'Current Affairs — Sports',
    section: 'gk',
    explanation: `Statements 1 and 2 match the reported Indian performance. India did not finish first in the overall medal tally, so 3 is wrong.`,
    gkKind: 'current',
    confidence: 'medium',
  },
  {
    q: `Which of the following Indian cultural traditions are inscribed on UNESCO's Representative List of the Intangible Cultural Heritage of Humanity?
1. Durga Puja in Kolkata
2. Garba of Gujarat
3. Kumbh Mela
4. Bihu festival of Assam
Select the correct answer.`,
    options: ['1 and 4 only', '2 and 4 only', '1, 2 and 3 only', '1, 2, 3 and 4'],
    answer: 2,
    topic: 'current-affairs',
    topicLabel: 'Current Affairs — UNESCO Heritage',
    section: 'gk',
    explanation: `Durga Puja in Kolkata (2021), Garba of Gujarat (2023) and Kumbh Mela (2017) are on the Representative List. Bihu is not, so 4 is wrong.`,
    gkKind: 'current',
  },
  {
    q: `What is the primary objective of the digital financial initiatives launched by Mizoram in October 2026?`,
    options: [
      'To promote private banking only',
      'To replace all physical currency',
      'To improve transparency, efficiency and accountability in public financial management',
      'To regulate international stock markets',
    ],
    answer: 2,
    topic: 'current-affairs',
    topicLabel: 'Current Affairs — Mizoram',
    section: 'gk',
    explanation: `The stated objective is better transparency, efficiency and accountability in public financial management, not replacing currency or regulating global markets.`,
    gkKind: 'current',
    confidence: 'medium',
  },
  {
    q: `Which one of the following ancient towns is well-known for its elaborate system of water harvesting and management by building a series of dams and channelising water into connected reservoirs?`,
    options: ['Dholavira', 'Kalibangan', 'Rakhigarhi', 'Ropar'],
    answer: 0,
    topic: 'modern-indian-history',
    topicLabel: 'Ancient India — Harappan Sites',
    section: 'gk',
    explanation: `Dholavira in Kutch is noted for an elaborate system of dams, channels and reservoirs that harvested and stored water.`,
  },
  {
    q: `With reference to medieval India, which one of the following is the correct sequence in ascending order in terms of size?`,
    options: ['Paragana—Sarkar—Suba', 'Sarkar—Paragana—Suba', 'Suba—Sarkar—Paragana', 'Paragana—Suba—Sarkar'],
    answer: 0,
    topic: 'modern-indian-history',
    topicLabel: 'Medieval India — Administration',
    section: 'gk',
    explanation: `In the Mughal administrative hierarchy, a pargana was smaller than a sarkar, and a sarkar was smaller than a suba.`,
  },
  {
    q: `Consider the following statements:
1. The Montagu-Chelmsford Reforms of 1919 recommended granting voting rights to all women above the age of 21.
2. The Government of India Act of 1935 gave women reserved seats in the legislature.
Which of the statements given above is/are correct?`,
    options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
    answer: 1,
    topic: 'modern-indian-history',
    topicLabel: 'Modern India — Constitutional Reforms',
    section: 'gk',
    explanation: `The 1919 reforms did not introduce universal adult franchise for women; the 1935 Act did provide reserved seats for women in provincial legislatures. Hence only statement 2 is correct.`,
  },
  {
    q: `With reference to 8 August 1942 in Indian history, which one of the following statements is correct?`,
    options: [
      'The Quit India Resolution was adopted by the AICC.',
      "The Viceroy's Executive Council was expanded to include more Indians.",
      'The Congress ministries resigned in seven provinces.',
      'Cripps proposed an Indian Union with full Dominion Status once the Second World War was over.',
    ],
    answer: 0,
    topic: 'modern-indian-history',
    topicLabel: 'Modern India — Quit India',
    section: 'gk',
    explanation: `The All India Congress Committee adopted the Quit India Resolution on 8 August 1942 at Gowalia Tank, Bombay. The other events belong to different years.`,
  },
  {
    q: `Indigo cultivation in India declined by the beginning of the 20th century because of`,
    options: [
      'peasant resistance to the oppressive conduct of planters',
      'its unprofitability in the world market because of new inventions',
      "national leaders' opposition to the cultivation of indigo",
      'Government control over the planters',
    ],
    answer: 1,
    topic: 'modern-indian-history',
    topicLabel: 'Modern India — Indigo',
    section: 'gk',
    explanation: `Synthetic dyes developed in the late 19th century made natural indigo uncompetitive in the world market. Peasant resistance was important earlier, but the early-20th-century decline is mainly explained by synthetic substitutes.`,
  },
  {
    q: `The Gandhi-Irwin Pact included which of the following?
1. Invitation to Congress to participate in the Round Table Conference
2. Withdrawal of Ordinances promulgated in connection with the Civil Disobedience Movement
3. Acceptance of Gandhiji's suggestion for enquiry into police excesses
4. Release of only those prisoners who were not charged with violence
Select the correct answer using the code given below.`,
    options: ['1 only', '1, 2 and 4 only', '3 only', '2, 3 and 4 only'],
    answer: 1,
    topic: 'modern-indian-history',
    topicLabel: 'Modern India — Gandhi-Irwin Pact',
    section: 'gk',
    explanation: `The Pact provided for Congress participation in the Second Round Table Conference, withdrawal of ordinances and release of prisoners not charged with violence. It did not concede an inquiry into police excesses, so 3 is wrong.`,
  },
  {
    q: `Consider the following statements about the Charter Act of 1813:
1. It ended the trade monopoly of the East India Company in India except for trade in tea and trade with China.
2. It asserted the sovereignty of the British Crown over the Indian territories held by the Company.
3. The revenues of India were now controlled by the British Parliament.
Which of the statements given above are correct?`,
    options: ['1 and 2 only', '2 and 3 only', '1 and 3 only', '1, 2 and 3'],
    answer: 0,
    topic: 'modern-indian-history',
    topicLabel: 'Modern India — Charter Acts',
    section: 'gk',
    explanation: `The 1813 Act ended the Company's monopoly except for tea and China trade and asserted Crown sovereignty. Direct parliamentary control of Indian revenues came with the Government of India Act 1858, so 3 is wrong.`,
  },
  {
    q: `In projectors, which lenses are used?`,
    options: ['Concave lens', 'Convex lens', 'Bipolar lens', 'Unipolar lens'],
    answer: 1,
    topic: 'general-science',
    topicLabel: 'General Science — Physics',
    section: 'gk',
    explanation: `Projectors use convex lenses to converge light and form a real, enlarged image on the screen.`,
  },
  {
    q: `Which of the following is/are correct?
1. Deficiency of vitamin A causes night blindness.
2. BCG vaccine is given to prevent Tuberculosis.`,
    options: ['Only 1', 'Only 2', 'Both 1 & 2', 'Neither 1 nor 2'],
    answer: 2,
    topic: 'general-science',
    topicLabel: 'General Science — Biology',
    section: 'gk',
    explanation: `Vitamin A deficiency causes night blindness, and BCG is the vaccine used against tuberculosis. Both statements are correct.`,
  },
  {
    q: `Brass is an alloy created by mixing:`,
    options: ['Copper & zinc', 'Copper & tin', 'Zinc & silver', 'Lead & tin'],
    answer: 0,
    topic: 'general-science',
    topicLabel: 'General Science — Chemistry',
    section: 'gk',
    explanation: `Brass is an alloy of copper and zinc. Copper and tin make bronze.`,
  },
  {
    q: `Foot and mouth disease is caused by:`,
    options: ['Fungus', 'Bacteria', 'Viruses', 'Salmonella'],
    answer: 2,
    topic: 'general-science',
    topicLabel: 'General Science — Biology',
    section: 'gk',
    explanation: `Foot-and-mouth disease is caused by a virus (an aphthovirus).`,
  },
  {
    q: `The X-ray was discovered by:`,
    options: ['Wilhelm Conrad Röntgen', 'Heinrich Hertz', 'Max Planck', 'Nikola Tesla'],
    answer: 0,
    topic: 'general-science',
    topicLabel: 'General Science — Physics',
    section: 'gk',
    explanation: `Wilhelm Conrad Röntgen discovered X-rays in 1895 and received the first Nobel Prize in Physics for the work.`,
  },
  {
    q: `Which category of waves enables bats to employ echolocation for spatial navigation and prey detection in darkness?`,
    options: ['Radio waves', 'Ultrasonic sound waves', 'Infrared waves', 'Microwaves'],
    answer: 1,
    topic: 'general-science',
    topicLabel: 'General Science — Physics',
    section: 'gk',
    explanation: `Bats emit high-frequency ultrasonic sound waves and interpret the returning echoes for navigation and hunting.`,
  },
  {
    q: `Which blood group is considered the universal donor?`,
    options: ['AB+', 'O−', 'O+', 'AB'],
    answer: 1,
    topic: 'general-science',
    topicLabel: 'General Science — Biology',
    section: 'gk',
    explanation: `O-negative red cells lack A, B and Rh antigens, so they can be given to recipients of any ABO/Rh type in an emergency.`,
  },
  {
    q: `What is the boiling point of water in Fahrenheit?`,
    options: ['100°F', '212°F', '315°F', '180°F'],
    answer: 1,
    topic: 'general-science',
    topicLabel: 'General Science — Physics',
    section: 'gk',
    explanation: `Water boils at 100°C, which converts to 212°F at standard atmospheric pressure.`,
  },
  {
    q: `The Human Development Index (HDI) includes which of the following dimensions?
1. A long and healthy life
2. Being knowledgeable
3. A decent standard of living
4. Human security
Select the correct answer using the code given below.`,
    options: ['1 and 2 only', '4 only', '1 and 4 only', '1, 2 and 3 only'],
    answer: 3,
    topic: 'economy',
    topicLabel: 'Indian Economy — HDI',
    section: 'gk',
    explanation: `HDI has three dimensions: health/longevity, knowledge and a decent standard of living. Human security is not one of them.`,
  },
  {
    q: `Consider the following statements with regard to Statutory Liquidity Ratio (SLR):
1. To meet SLR, commercial banks can use cash only.
2. SLR is maintained by the banks with themselves.
3. SLR restricts the banks' leverage in pumping more money into the economy.
Which of the statements given above is/are correct?`,
    options: ['1, 2 and 3', '2 and 3', '1 and 3', 'Only 2'],
    answer: 1,
    topic: 'economy',
    topicLabel: 'Indian Economy — Banking',
    section: 'gk',
    explanation: `SLR can be met with cash, gold or approved securities, so 1 is false. Banks maintain SLR with themselves, and it limits their lending capacity, so 2 and 3 are correct.`,
  },
  {
    q: `Which of the following is included in the Current Account of the Balance of Payments?`,
    options: [
      'Foreign Direct Investment (FDI)',
      'External Commercial Borrowings (ECB)',
      'Export and import of services',
      'Changes in foreign exchange reserves',
    ],
    answer: 2,
    topic: 'economy',
    topicLabel: 'Indian Economy — Balance of Payments',
    section: 'gk',
    explanation: `The current account covers goods, services, income and transfers. FDI and ECB are capital-account items, and reserve changes are recorded separately.`,
  },
  {
    q: `In India, income tax is classified as:`,
    options: ['A direct tax', 'An indirect tax', 'GST', 'Custom duty'],
    answer: 0,
    topic: 'economy',
    topicLabel: 'Indian Economy — Taxation',
    section: 'gk',
    explanation: `Income tax is a direct tax: its burden falls on the person who pays it and cannot be shifted to another party.`,
  },
  {
    q: `How is the primary deficit derived from the fiscal deficit?`,
    options: [
      'By subtracting capital expenditure from the fiscal deficit',
      'By subtracting net interest payments on past debt from the fiscal deficit',
      'By adding revenue deficit to the total capital expenditure',
      'By deducting tax revenues from total government consumption',
    ],
    answer: 1,
    topic: 'economy',
    topicLabel: 'Indian Economy — Fiscal Policy',
    section: 'gk',
    explanation: `Primary deficit = fiscal deficit − net interest payments. It shows the current fiscal gap after removing the cost of past borrowing.`,
  },
  {
    q: `In which area of the Indian economy would we most commonly hear the term "disguised unemployment"?`,
    options: ['Organized Manufacturing Sector', 'Public Sector Undertakings (PSUs)', 'Information Technology Sector', 'Agricultural Sector'],
    answer: 3,
    topic: 'economy',
    topicLabel: 'Indian Economy — Employment',
    section: 'gk',
    explanation: `Disguised unemployment is common in agriculture, where more workers are engaged than are actually needed, so removing some would not reduce output.`,
  },
  {
    q: `What is the fundamental difference between Gross Domestic Product (GDP) and Net Domestic Product (NDP)?`,
    options: [
      'NDP includes net foreign factor income, while GDP excludes it.',
      'GDP accounts for indirect taxes, whereas NDP accounts for subsidies.',
      'GDP includes depreciation of capital equipment, while NDP excludes it.',
      'NDP measures goods at market prices, while GDP measures them at factor cost.',
    ],
    answer: 2,
    topic: 'economy',
    topicLabel: 'Indian Economy — National Income',
    section: 'gk',
    explanation: `GDP is gross of depreciation; NDP is GDP minus depreciation of capital equipment.`,
  },
  {
    q: `Consider the following statements regarding the traditional Mizo musical instrument, Rawchhem:
1. It resembles a Scottish bagpipe or a mouth organ.
2. It is made from a dry, hollow gourd fitted with nine bamboo tubes of different sizes and lengths.
3. The different musical notes are produced by blocking or opening holes in the bamboo tubes with the fingers.
4. Sound is produced by blowing into the open end of the bamboo tubes rather than the gourd.
Which of the statements given above are correct?`,
    options: ['1 and 2 only', '1, 2 and 3 only', '2, 3 and 4 only', '1, 2, 3 and 4'],
    answer: 1,
    topic: 'mizoram-culture',
    topicLabel: 'Mizoram — Culture',
    section: 'gk',
    explanation: `Rawchhem is a gourd-and-bamboo wind instrument compared to a bagpipe or mouth organ. Its notes are varied by covering holes in the bamboo pipes, and the player blows through the gourd mouthpiece, not the open ends of the pipes. Thus 1, 2 and 3 are correct.`,
    confidence: 'medium',
  },
  {
    q: `Which of the following is the name of the tax paid by villagers to the chief?`,
    options: [
      'Chawng chhiah, Sachhiah, Buh chhiah',
      'Sekawt hawn man, Khuai chhiah, Fathang',
      'Sa chhiah, Ngawn Chawm, Fathang',
      'Fathang, Sa chhiah, Ran chhiah',
    ],
    answer: 0,
    topic: 'mizoram-culture',
    topicLabel: 'Mizoram — Traditional Taxes',
    section: 'gk',
    explanation: `Chawng chhiah, Sachhiah and Buh chhiah were traditional dues paid to the chief. The other sets mix different kinds of customary payments.`,
    confidence: 'medium',
  },
  {
    q: `Consider the following statements regarding traditional Mizo snares:
1. Kharkhep trap is mainly used for catching bear.
2. Vaithang is a snare used for catching rats.
3. Sahdal is a snare used for catching certain terrestrial birds.
4. Mangkhawng is a type of trap used for killing small animals and birds.
Which of the statements given above are CORRECT?`,
    options: ['1 and 2 only', '1, 2 and 3 only', '1, 2, 3 and 4', '2, 3 and 4 only'],
    answer: 2,
    topic: 'mizoram-culture',
    topicLabel: 'Mizoram — Traditional Traps',
    section: 'gk',
    explanation: `All four are traditional Mizo traps/snares used for the animals named: Kharkhep for bear, Vaithang for rats, Sahdal for terrestrial birds and Mangkhawng for small animals and birds.`,
    confidence: 'medium',
  },
  {
    q: `Consider the following pairs of traditional festivals of the Mizo people and the communities associated with them:
1. Hlukhla – Lai
2. Lyuva Khutla – Mara
3. Sikpui Ruoi – Ralte
4. Chavang Kut – Hmar only
Which of the pairs given above are correctly matched?`,
    options: ['1 and 2 only', '1, 2 and 3 only', '2, 3 and 4 only', '1, 2, 3 and 4'],
    answer: 1,
    topic: 'mizoram-culture',
    topicLabel: 'Mizoram — Festivals',
    section: 'gk',
    explanation: `Hlukhla is associated with the Lai, Lyuva Khutla with the Mara, and Sikpui Ruoi with the Ralte. Chavang Kut is a Kuki-Chin festival, not exclusively Hmar, so pair 4 is wrong.`,
    confidence: 'medium',
  },
  {
    q: `Match the following political parties with their respective aims:
List I: Political Parties
1. Mizo Union
2. United Mizo Freedom Organisation (UMFO)
3. Eastern India Tribal Union (EITU)
4. Mizoram Pradesh Congress Committee
List II: Aim
A. Formation of a hill state
B. Abolition of chieftainship
C. Joining the Union of Burma
D. Formation of a state within the Indian Union
Select the correct answer using the code given below.`,
    options: ['1–B, 2–C, 3–A, 4–D', '1–C, 2–B, 3–D, 4–A', '1–B, 2–A, 3–C, 4–D', '1–D, 2–C, 3–A, 4–B'],
    answer: 0,
    topic: 'mizoram-history',
    topicLabel: 'Mizoram — Political History',
    section: 'gk',
    explanation: `The Mizo Union sought abolition of chieftainship, the UMFO advocated joining Burma, the EITU sought a hill state, and the MPCC worked for a state within the Indian Union.`,
    confidence: 'medium',
  },
  {
    q: `Consider the following statements.
In early Mizo society, which was a patriarchal society with a focus on male lineage, when the chiefs died, their sons inherited the chieftainship.
Which of the following statements is/are correct?
(i) The children of the real wife are alone legitimate to be the heir and succeed the lands on their father's death.
(ii) The children by concubines are known as Chhungpuifa.
(iii) If a chief has no legitimate sons, his youngest Hmeifa succeeds to his village.
Select the CORRECT answer using the code given below.`,
    options: ['i only', 'ii only', 'ii & iii', 'i, ii & iii'],
    answer: 0,
    topic: 'mizoram-culture',
    topicLabel: 'Mizoram — Chieftainship',
    section: 'gk',
    explanation: `Only (i) is correct. Chhungpuifa are the legitimate children of the real wife; children of concubines are not called Chhungpuifa. The youngest son who could inherit in the traditional scheme is Fatlum, not Hmeifa, so (ii) and (iii) are wrong.`,
    confidence: 'medium',
  },
  {
    q: `Which of the following traditional Mizo instruments and their uses are correctly matched?
1. Lemlawi – Musical instrument
2. Suvel – Weaving instrument
3. Fal – Earthen pot
4. Lampei – Snare
Select the correct answer using the code given below.`,
    options: ['1 and 2 only', '1, 2 and 3 only', '2, 3 and 4 only', '1, 2, 3 and 4'],
    answer: 1,
    topic: 'mizoram-culture',
    topicLabel: 'Mizoram — Material Culture',
    section: 'gk',
    explanation: `Lemlawi is a musical instrument, Suvel is a weaving tool and Fal is an earthen pot. Lampei is an earthen vessel used for sacrifices, not a snare, so 4 is wrong.`,
    confidence: 'medium',
  },
  {
    q: `The candidates waited __outside__ until their names were called.`,
    direction: 'Identify the part of speech of the underlined word.',
    options: ['Preposition', 'Adjective', 'Adverb', 'Conjunction'],
    answer: 2,
    topic: 'english-grammar',
    topicLabel: 'English — Parts of Speech',
    section: 'english',
    explanation: `"Outside" tells us where the candidates waited, so it modifies the verb and is an adverb of place.`,
  },
  {
    q: `__Each__ of the applicants was asked to produce an identity card.`,
    direction: 'Identify the part of speech of the underlined word.',
    options: ['Pronoun', 'Adjective', 'Adverb', 'Noun'],
    answer: 0,
    topic: 'english-grammar',
    topicLabel: 'English — Parts of Speech',
    section: 'english',
    explanation: `"Each" stands in for each individual applicant and is an indefinite pronoun.`,
  },
  {
    q: `We continued the discussion __despite__ their objections.`,
    direction: 'Identify the part of speech of the underlined word.',
    options: ['Conjunction', 'Adverb', 'Verb', 'Preposition'],
    answer: 3,
    topic: 'english-grammar',
    topicLabel: 'English — Parts of Speech',
    section: 'english',
    explanation: `"Despite" is a preposition governing the noun phrase "their objections".`,
  },
  {
    q: `The officer gave a __clear__ explanation of the procedure.`,
    direction: 'Identify the part of speech of the underlined word.',
    options: ['Noun', 'Adjective', 'Adverb', 'Verb'],
    answer: 1,
    topic: 'english-grammar',
    topicLabel: 'English — Parts of Speech',
    section: 'english',
    explanation: `"Clear" modifies the noun "explanation" and is therefore an adjective.`,
  },
  {
    q: `You may leave __once__ you have submitted your answer sheet.`,
    direction: 'Identify the part of speech of the underlined word.',
    options: ['Adverb', 'Preposition', 'Conjunction', 'Pronoun'],
    answer: 2,
    topic: 'english-grammar',
    topicLabel: 'English — Parts of Speech',
    section: 'english',
    explanation: `"Once" introduces the subordinate clause "once you have submitted..." and functions as a conjunction.`,
  },
  {
    q: `The candidate was exempted ______ paying the application fee.`,
    direction: 'Choose the correct preposition to fill in the blank.',
    options: ['from', 'of', 'with', 'by'],
    answer: 0,
    topic: 'english-grammar',
    topicLabel: 'English — Prepositions',
    section: 'english',
    explanation: `The fixed expression is "exempted from" paying a fee or obligation.`,
  },
  {
    q: `The officer is accountable ______ the department head for any delay.`,
    direction: 'Choose the correct preposition to fill in the blank.',
    options: ['with', 'for', 'at', 'to'],
    answer: 3,
    topic: 'english-grammar',
    topicLabel: 'English — Prepositions',
    section: 'english',
    explanation: `One is "accountable to" a person and "accountable for" an act or result. The blank is followed by the department head, so "to" is correct.`,
  },
  {
    q: `The success of the programme depends ______ effective coordination among departments.`,
    direction: 'Choose the correct preposition to fill in the blank.',
    options: ['of', 'on', 'with', 'at'],
    answer: 1,
    topic: 'english-grammar',
    topicLabel: 'English — Prepositions',
    section: 'english',
    explanation: `The verb "depend" takes the preposition "on".`,
  },
  {
    q: `Neither of the two candidates *have* submitted the required certificate.`,
    direction: 'Choose the best replacement for the italicised words. If no correction is needed, choose "No correction required".',
    options: ['have been submitting', 'are submitting', 'has submitted', 'No correction required'],
    answer: 2,
    topic: 'english-grammar',
    topicLabel: 'English — Subject-Verb Agreement',
    section: 'english',
    explanation: `"Neither" is singular, so the verb should be "has submitted".`,
  },
  {
    q: `The receptionist asked me *where was I going*.`,
    direction: 'Choose the best replacement for the italicised words. If no correction is needed, choose "No correction required".',
    options: ['where I was going', 'where am I going', 'where I going was', 'No correction required'],
    answer: 0,
    topic: 'english-grammar',
    topicLabel: 'English — Reported Speech',
    section: 'english',
    explanation: `In indirect speech the word order is statement order: "where I was going", not "where was I going".`,
  },
  {
    q: `The committee *discussed about* the proposal before approving it.`,
    direction: 'Choose the best replacement for the italicised words. If no correction is needed, choose "No correction required".',
    options: ['discussed on the proposal', 'discussed regarding the proposal', 'discussed over the proposal', 'discussed the proposal'],
    answer: 3,
    topic: 'english-grammar',
    topicLabel: 'English — Verb Usage',
    section: 'english',
    explanation: `"Discuss" is transitive and takes a direct object; "discussed the proposal" is correct.`,
  },
  {
    q: `Hardly had the proceedings begun *than* the lights went out.`,
    direction: 'Choose the best replacement for the italicised words. If no correction is needed, choose "No correction required".',
    options: ['then the lights went out', 'when the lights went out', 'that the lights went out', 'No correction required'],
    answer: 1,
    topic: 'english-grammar',
    topicLabel: 'English — Sentence Correction',
    section: 'english',
    explanation: `"Hardly" is paired with "when": "Hardly had ... when ...".`,
  },
  {
    q: `The revised guidelines *apply* to all employees, regardless of their designation.`,
    direction: 'Choose the best replacement for the italicised words. If no correction is needed, choose "No correction required".',
    options: ['applies to all employees', 'are apply to all employees', 'No correction required', 'applying to all employees'],
    answer: 2,
    topic: 'english-grammar',
    topicLabel: 'English — Sentence Correction',
    section: 'english',
    explanation: `The plural subject "guidelines" takes the plural verb "apply", and the rest of the sentence is correct. No correction is required.`,
  },
  {
    q: `The auditor detected several ______ in the accounts and recommended a thorough ______.`,
    direction: 'Choose the correct pair of words to complete the sentence.',
    options: ['irregularities, investigation', 'achievements, celebration', 'improvements, suspension', 'similarities, appointment'],
    answer: 0,
    topic: 'english-vocabulary',
    topicLabel: 'English — Vocabulary',
    section: 'english',
    explanation: `An auditor detects irregularities and recommends an investigation; the other pairs do not fit the context.`,
  },
  {
    q: `A fair selection process must be ______ and free from political ______.`,
    direction: 'Choose the correct pair of words to complete the sentence.',
    options: ['secretive, participation', 'arbitrary, guidance', 'selective, discussion', 'transparent, interference'],
    answer: 3,
    topic: 'english-vocabulary',
    topicLabel: 'English — Vocabulary',
    section: 'english',
    explanation: `A fair process should be transparent and free from political interference.`,
  },
  {
    q: `The new policy aims to ______ unnecessary expenditure without ______ essential services.`,
    direction: 'Choose the correct pair of words to complete the sentence.',
    options: ['encourage, maintaining', 'reduce, compromising', 'conceal, providing', 'increase, expanding'],
    answer: 1,
    topic: 'english-vocabulary',
    topicLabel: 'English — Vocabulary',
    section: 'english',
    explanation: `The policy aims to reduce expenditure without compromising essential services.`,
  },
  {
    q: `The witness gave such ______ accounts of the incident that the court questioned his ______.`,
    direction: 'Choose the correct pair of words to complete the sentence.',
    options: ['consistent, punctuality', 'detailed, generosity', 'contradictory, credibility', 'accurate, efficiency'],
    answer: 2,
    topic: 'english-vocabulary',
    topicLabel: 'English — Vocabulary',
    section: 'english',
    explanation: `Contradictory accounts would lead the court to question the witness's credibility.`,
  },
  {
    q: `Choose the correct antonym of the given word: **Meticulous**`,
    options: ['Careless', 'Thorough', 'Precise', 'Diligent'],
    answer: 0,
    topic: 'english-vocabulary',
    topicLabel: 'English — Antonyms',
    section: 'english',
    explanation: `Meticulous means very careful and precise; its opposite is careless.`,
  },
  {
    q: `Choose the correct antonym of the given word: **Scarcity**`,
    options: ['Shortage', 'Deficiency', 'Inadequacy', 'Abundance'],
    answer: 3,
    topic: 'english-vocabulary',
    topicLabel: 'English — Antonyms',
    section: 'english',
    explanation: `Scarcity means shortage; abundance is its opposite.`,
  },
  {
    q: `Choose the correct antonym of the given word: **Obstinate**`,
    options: ['Stubborn', 'Compliant', 'Resolute', 'Inflexible'],
    answer: 1,
    topic: 'english-vocabulary',
    topicLabel: 'English — Antonyms',
    section: 'english',
    explanation: `Obstinate means stubbornly refusing to change; compliant means willing to yield or obey.`,
  },
  {
    q: `Choose the correct meaning of the idiom: The officer refused to **turn a blind eye** to the irregularities.`,
    options: ['Examine them closely', 'Report them immediately', 'Deliberately ignore them', 'Misunderstand them completely'],
    answer: 2,
    topic: 'english-idioms',
    topicLabel: 'English — Idioms & Phrases',
    section: 'english',
    explanation: `To "turn a blind eye" is to deliberately ignore something wrong.`,
  },
  {
    q: `Choose the correct meaning of the idiom: The two departments worked **at cross purposes**, delaying the implementation of the scheme.`,
    options: ['With conflicting aims', 'With complete agreement', 'With exceptional speed', 'With equal responsibility'],
    answer: 0,
    topic: 'english-idioms',
    topicLabel: 'English — Idioms & Phrases',
    section: 'english',
    explanation: `Working at cross purposes means pursuing conflicting aims that hinder each other.`,
  },
  {
    q: `Choose the correct meaning of the idiom: The minister's assurance should be taken **with a pinch of salt**.`,
    options: ['Accepted without question', 'Treated as an official order', 'Rejected as completely false', 'Viewed with some doubt'],
    answer: 3,
    topic: 'english-idioms',
    topicLabel: 'English — Idioms & Phrases',
    section: 'english',
    explanation: `To take something with a pinch of salt is to view it with scepticism or some doubt, not to reject it outright.`,
  },
  {
    q: `Identify the sentence type according to its grammatical form: "Please ensure that all the windows are closed."`,
    options: ['Declarative', 'Imperative', 'Interrogative', 'Exclamatory'],
    answer: 1,
    topic: 'english-sentence-types',
    topicLabel: 'English — Sentence Types',
    section: 'english',
    explanation: `The sentence gives a request or instruction, so it is imperative.`,
  },
  {
    q: `Identify the sentence type according to its grammatical form: "How remarkably well she handled the crisis!"`,
    options: ['Imperative', 'Declarative', 'Exclamatory', 'Interrogative'],
    answer: 2,
    topic: 'english-sentence-types',
    topicLabel: 'English — Sentence Types',
    section: 'english',
    explanation: `The sentence expresses strong emotion and ends with an exclamation mark, so it is exclamatory.`,
  },
  {
    q: `The lightest element in the periodic table is:`,
    options: ['Lithium', 'Helium', 'Fluorine', 'Hydrogen'],
    answer: 3,
    topic: 'general-science',
    topicLabel: 'General Science — Chemistry',
    section: 'gk',
    explanation: `Hydrogen has atomic number 1 and the lowest atomic mass of all elements.`,
  },
];

const paper2Seeds: Seed[] = [
  {
    q: `A person travels half a journey at 40 kmph and the remaining half at 60 kmph. What is the average speed for the whole journey?`,
    options: ['48 kmph', '50 kmph', '45 kmph', '52 kmph'],
    answer: 0,
    topic: 'arithmetic-average',
    topicLabel: 'Arithmetic — Average Speed',
    section: 'arithmetic',
    explanation: `For equal distances, average speed = 2ab/(a+b) = (2 × 40 × 60)/(40 + 60) = 4800/100 = 48 kmph.`,
  },
  {
    q: `Study the diagram and find the number that lies inside all the figures.`,
    options: ['2', '5', '9', 'No such number is there'],
    answer: 0,
    topic: 'reasoning-venn-diagram',
    topicLabel: 'Reasoning — Venn Diagrams',
    section: 'reasoning',
    imagePath: '/question-images/zzr-mock-2026/paper2-q2.png',
    explanation: `The region common to all the figures contains only the number 2.`,
  },
  {
    q: `Select the set of numbers that is similar to the following set of numbers: (7, 16, 34)`,
    options: ['(10, 19, 28)', '(23, 31, 48)', '(29, 57, 96)', '(49, 58, 76)'],
    answer: 3,
    topic: 'reasoning-number-series',
    topicLabel: 'Reasoning — Number Analogy',
    section: 'reasoning',
    explanation: `The pattern is +9, then +18: 7 + 9 = 16 and 16 + 18 = 34. In the same way, 49 + 9 = 58 and 58 + 18 = 76.`,
  },
  {
    q: `If the sign '×' is interchanged with '÷' and the number '3' is interchanged with '2', then which of the following equations would be correct?`,
    options: [
      '3 ÷ 2 × 2 + 2 − 3 = 1',
      '3 × 2 ÷ 2 + 2 − 3 = 3',
      '2 × 3 ÷ 2 + 2 − 3 = 0',
      '2 × 3 − 2 + 2 ÷ 3 = 0',
    ],
    answer: 0,
    topic: 'reasoning-mathematical-operations',
    topicLabel: 'Reasoning — Mathematical Operations',
    section: 'reasoning',
    explanation: `The supplied key marks option (a). The instruction does not clearly state whether the digit substitution applies to both sides of an equation, and a literal substitution does not produce a unique defensible option.`,
    disputeNote: 'The printed key marks (a), but the stated operator/digit substitutions are ambiguous and do not yield a clear unique answer.',
  },
  {
    q: `Mayank's house faces South. He leaves from the back gate of his house and walks 18 m. Then he turns right and walks 28 m. Then he turns right and walks 35 m. Then he turns left and walks 12 m. He then turns left and walks 17 m. In which direction and how many metres away is he from the original position?`,
    options: ['20 metre North', '17 metre South', '30 metre West', '40 metre East'],
    answer: 3,
    topic: 'reasoning-direction-sense',
    topicLabel: 'Reasoning — Direction Sense',
    section: 'reasoning',
    explanation: `The back gate of a south-facing house is on the north side. Net north–south movement = 18 − 35 + 17 = 0; net east–west movement = 28 + 12 = 40 m east. He is 40 m east of the starting point.`,
  },
  {
    q: `Choose the figure which is different from the rest.`,
    options: ['1', '2', '3', '4'],
    answer: 1,
    topic: 'reasoning-figure-series',
    topicLabel: 'Reasoning — Figure Classification',
    section: 'reasoning',
    imagePath: '/question-images/zzr-mock-2026/paper2-q6.png',
    explanation: `Figure 2 is the keyed odd one out; its symbol-and-arrow arrangement differs from the remaining figures.`,
  },
  {
    q: `Choose the figure which would most closely resemble the unfolded form of Figure (Z).`,
    options: ['1', '2', '3', '4'],
    answer: 1,
    topic: 'reasoning-paper-folding',
    topicLabel: 'Reasoning — Paper Folding',
    section: 'reasoning',
    imagePath: '/question-images/zzr-mock-2026/paper2-q7.png',
    explanation: `Unfolding reflects the cut pattern across each fold line. Option 2 is the arrangement that results.`,
  },
  {
    q: `Choose the box that is similar to the box formed from the given sheet of paper (X).`,
    options: ['1 and 3 only', '1 and 4 only', '2 and 4 only', '3 and 4 only'],
    answer: 0,
    topic: 'reasoning-cube-folding',
    topicLabel: 'Reasoning — Cube Folding',
    section: 'reasoning',
    imagePath: '/question-images/zzr-mock-2026/paper2-q8.png',
    explanation: `When the net is folded, the visible face combinations in boxes 1 and 3 are possible; boxes 2 and 4 place faces in positions that conflict with the net.`,
  },
  {
    q: `A price of a product increases by 20% and then decreases by 10%. What is the net percentage change in its price?`,
    options: ['8% increase', '10% increase', '8% decrease', 'no change'],
    answer: 0,
    topic: 'arithmetic-percentage',
    topicLabel: 'Arithmetic — Percentage',
    section: 'arithmetic',
    explanation: `Take the original price as 100. After a 20% rise it is 120; after a 10% fall it is 108. The net change is an 8% increase.`,
  },
  {
    q: `A shopkeeper buys an article for ₹800 and sells it at a profit of 15%. What is the selling price?`,
    options: ['₹880', '₹900', '₹920', '₹940'],
    answer: 2,
    topic: 'arithmetic-profit-loss',
    topicLabel: 'Arithmetic — Profit & Loss',
    section: 'arithmetic',
    explanation: `Selling price = 800 × 1.15 = ₹920.`,
  },
  {
    q: `The average of 8 numbers is 24. If one number 32 is replaced by 20, what is the new average?`,
    options: ['21.5', '22', '22.5', '23'],
    answer: 2,
    topic: 'arithmetic-average',
    topicLabel: 'Arithmetic — Average',
    section: 'arithmetic',
    explanation: `Total = 8 × 24 = 192. Replacing 32 with 20 reduces the total by 12, giving 180. New average = 180/8 = 22.5.`,
  },
  {
    q: `Reaching the place of meeting on Tuesday 15 min before 8:30 h, Akshat found himself half an hour earlier than the man who was 40 min late. What was the scheduled time of the meeting?`,
    options: ['8:00 h', '8:05 h', '8:15 h', '8:45 h'],
    answer: 1,
    topic: 'reasoning-clock-calendar',
    topicLabel: 'Reasoning — Time & Calendar',
    section: 'reasoning',
    explanation: `Akshat arrived at 8:15. He was 30 minutes earlier than the man who arrived 40 minutes late, so Akshat was 10 minutes late. Scheduled time = 8:15 − 10 = 8:05.`,
  },
  {
    q: `A invested ₹30,000 and was joined by B after 3 months investing ₹40,000. If their profit after one year is ₹18,000, what is A's share?`,
    options: ['₹12,000', '₹10,000', '₹9,000', '₹8,000'],
    answer: 2,
    topic: 'arithmetic-partnership',
    topicLabel: 'Arithmetic — Partnership',
    section: 'arithmetic',
    explanation: `Profit-sharing ratio = A : B = (30,000 × 12) : (40,000 × 9) = 3,60,000 : 3,60,000 = 1 : 1. A's share = 18,000/2 = ₹9,000.`,
  },
  {
    q: `A man standing 40 m from a building observes its top at an angle of elevation of 45°. If his eye level is 1.5 m above the ground, what is the height of the building?`,
    options: ['42 m', '41.5 m', '45 m', '40 m'],
    answer: 1,
    topic: 'arithmetic-trigonometry',
    topicLabel: 'Arithmetic — Height & Distance',
    section: 'arithmetic',
    explanation: `Height above eye level = 40 tan 45° = 40 m. Adding the 1.5 m eye height gives 41.5 m.`,
  },
  {
    q: `Which of the following is/are characteristics of a computer?`,
    options: ['Diligence', 'Versatility', 'Reliability', 'All of the above'],
    answer: 3,
    topic: 'computer-fundamentals',
    topicLabel: 'Computer — Fundamentals',
    section: 'computer',
    explanation: `Diligence, versatility and reliability are all standard characteristics of computers, along with speed, accuracy and storage.`,
  },
  {
    q: `The capacity to perform multiple tasks simultaneously is termed as ______.`,
    options: ['Diligence', 'Versatility', 'Reliability', 'All of the above'],
    answer: 1,
    topic: 'computer-fundamentals',
    topicLabel: 'Computer — Fundamentals',
    section: 'computer',
    explanation: `Versatility is the ability to perform many different kinds of tasks; multitasking is described by the question's wording.`,
  },
  {
    q: `Second-generation computers were based on ______.`,
    options: ['IC', 'Vacuum tube', 'transistor', 'None of the above'],
    answer: 2,
    topic: 'computer-generations',
    topicLabel: 'Computer — Generations',
    section: 'computer',
    explanation: `Second-generation computers used transistors. Vacuum tubes belong to the first generation and integrated circuits to the third.`,
  },
  {
    q: `EDSAC stands for ______.`,
    options: [
      'Electronic Delay Storage Automatic Computer',
      'Electronic Discrete Storage Automatic Computer',
      'Electronic Delay Serial Automatic Computer',
      'Electronic Discrete Storage Automatic Computer',
    ],
    answer: 0,
    topic: 'computer-abbreviations',
    topicLabel: 'Computer — Abbreviations',
    section: 'computer',
    explanation: `EDSAC = Electronic Delay Storage Automatic Computer. Options (b) and (d) are printed identically, but they are not the expansion of EDSAC.`,
    disputeNote: 'Options (b) and (d) are printed identically. The keyed expansion is (a), so the duplicate pair is simply wrong rather than ambiguous.',
  },
  {
    q: `A hybrid computer has the combined properties of?`,
    options: ['Analog and digital computer', 'Digital computer', 'Computer', 'Micro computer'],
    answer: 0,
    topic: 'computer-types',
    topicLabel: 'Computer — Types',
    section: 'computer',
    explanation: `A hybrid computer combines analog and digital components, typically using analog processing for continuous inputs and digital processing for control and output.`,
  },
  {
    q: `Which was the world's fastest supercomputer in 2022?`,
    options: ['Summit', 'Tianhe-2A', 'Frontier', 'Fugaku'],
    answer: 2,
    topic: 'computer-supercomputers',
    topicLabel: 'Computer — Supercomputers',
    section: 'computer',
    explanation: `Frontier, installed at Oak Ridge National Laboratory, became the world's first exascale supercomputer and topped the TOP500 list in 2022.`,
  },
  {
    q: `Which of the following was India's first supercomputer?`,
    options: ['Mihir', 'Pratyush', 'PARAM Ganga', 'PARAM 8000'],
    answer: 3,
    topic: 'computer-supercomputers',
    topicLabel: 'Computer — Supercomputers',
    section: 'computer',
    explanation: `PARAM 8000, developed by C-DAC in 1991, was India's first indigenous supercomputer.`,
  },
  {
    q: `Full form of RAID is:`,
    options: [
      'Random Array of Inexpensive Disks',
      'Random Access of Independent Disks',
      'Redundant Array of Independent Disks',
      'Redundant Array of Inexpensive Disks',
    ],
    answer: 3,
    topic: 'computer-storage',
    topicLabel: 'Computer — Storage',
    section: 'computer',
    explanation: `RAID = Redundant Array of Inexpensive Disks (also expanded as Redundant Array of Independent Disks). Option (d) is the keyed full form.`,
  },
  {
    q: `Which of the following was the first electronic computer used for general purposes?`,
    options: ['EDVAC', 'EDSAC', 'ENIAC', 'UNIVAC'],
    answer: 2,
    topic: 'computer-history',
    topicLabel: 'Computer — History',
    section: 'computer',
    explanation: `ENIAC (1945) is regarded as the first general-purpose electronic digital computer. UNIVAC was the first commercial general-purpose computer.`,
  },
  {
    q: `What does the acronym "URL" stand for?`,
    options: ['Uniform Resource Locator', 'Universal Research Language', 'Universal Routing Language', 'Uniform Routing Locator'],
    answer: 0,
    topic: 'computer-internet',
    topicLabel: 'Computer — Internet & Web',
    section: 'computer',
    explanation: `URL = Uniform Resource Locator, the address used to locate a resource on the web.`,
  },
  {
    q: `What is the main function of the command interpreter?`,
    options: [
      'to provide the interface between the API and application program',
      'to handle the files in the operating system',
      'to get and execute the next user-specified command',
      'none of the mentioned',
    ],
    answer: 2,
    topic: 'computer-operating-system',
    topicLabel: 'Computer — Operating Systems',
    section: 'computer',
    explanation: `A command interpreter (shell) reads the next command typed by the user and arranges for it to be executed.`,
  },
  {
    q: `In Operating Systems, which of the following is/are CPU scheduling algorithms?`,
    options: ['Priority', 'Round Robin', 'Shortest Job First', 'All of the mentioned'],
    answer: 3,
    topic: 'computer-operating-system',
    topicLabel: 'Computer — Operating Systems',
    section: 'computer',
    explanation: `Priority scheduling, Round Robin and Shortest Job First are all CPU scheduling algorithms.`,
  },
  {
    q: `Which unit is used to measure the speed of a printer?`,
    options: ['DPI', 'CPM', 'PPM', 'None of the above'],
    answer: 2,
    topic: 'computer-peripherals',
    topicLabel: 'Computer — Peripherals',
    section: 'computer',
    explanation: `PPM (pages per minute) measures printer speed. DPI measures resolution, and CPM is used for character printers.`,
  },
  {
    q: `Which of the following groups consists of only input devices?`,
    options: ['Mouse, Keyboard, Monitor', 'Mouse, Keyboard, Printer', 'Mouse, Keyboard, Plotter', 'Mouse, Keyboard, Scanner'],
    answer: 3,
    topic: 'computer-input-devices',
    topicLabel: 'Computer — Input Devices',
    section: 'computer',
    explanation: `Monitor, printer and plotter are output devices. Mouse, keyboard and scanner are all input devices.`,
  },
  {
    q: `USB refers to a ______.`,
    options: ['storage device', 'processor', 'port type', 'None of the above'],
    answer: 2,
    topic: 'computer-ports',
    topicLabel: 'Computer — Ports & Interfaces',
    section: 'computer',
    explanation: `USB (Universal Serial Bus) is a standard port/interface type used to connect devices; USB drives are storage devices, but USB itself is the interface.`,
  },
  {
    q: `A nibble is equal to ______.`,
    options: ['4 bits', '8 bits', '16 bits', '32 bits'],
    answer: 0,
    topic: 'computer-data-representation',
    topicLabel: 'Computer — Data Representation',
    section: 'computer',
    explanation: `A nibble is 4 bits; a byte is 8 bits.`,
  },
  {
    q: `The term 'giga byte' equals to ______.`,
    options: ['1024 byte', '1024 KB', '1024 GB', '1024 MB'],
    answer: 3,
    topic: 'computer-data-representation',
    topicLabel: 'Computer — Data Representation',
    section: 'computer',
    explanation: `In binary storage units, 1 GB = 1024 MB.`,
  },
  {
    q: `The Internet is governed by:`,
    options: [
      'IETF (Internet Engineering Task Force)',
      'W3C (World Wide Web Consortium)',
      'InterNIC (Internet Network Information Center)',
      'None of the above',
    ],
    answer: 1,
    topic: 'computer-internet',
    topicLabel: 'Computer — Internet Governance',
    section: 'computer',
    explanation: `The printed key marks W3C. Strictly, no single body governs the whole Internet: W3C develops web standards, while ICANN/IANA, IETF and other bodies handle naming, addresses and protocols.`,
    disputeNote: 'The key marks W3C, which governs web standards rather than the whole Internet. The Internet has no single governing body.',
  },
  {
    q: `A car travels at 60 kmph for 2 hours 30 minutes. What distance does it cover?`,
    options: ['150 km', '135 km', '180 km', '120 km'],
    answer: 0,
    topic: 'arithmetic-speed-distance',
    topicLabel: 'Arithmetic — Speed, Distance & Time',
    section: 'arithmetic',
    explanation: `2 hours 30 minutes = 2.5 hours. Distance = 60 × 2.5 = 150 km.`,
  },
  {
    q: `The 5th term of an AP is 18 and the 10th term is 33. Find the first term.`,
    options: ['12', '9', '6', '3'],
    answer: 2,
    topic: 'arithmetic-progression',
    topicLabel: 'Arithmetic — Progressions',
    section: 'arithmetic',
    explanation: `a + 4d = 18 and a + 9d = 33. Subtracting gives 5d = 15, so d = 3. Then a + 12 = 18, so a = 6.`,
  },
  {
    q: `How many students have English as their favourite subject?`,
    options: ['20', '25', '30', '35'],
    answer: 2,
    topic: 'reasoning-data-interpretation',
    topicLabel: 'Reasoning — Data Interpretation',
    section: 'reasoning',
    imagePath: '/question-images/zzr-mock-2026/paper2-q35.png',
    explanation: `The chart shows English as the favourite subject of 30 students.`,
  },
  {
    q: `How many times in a day are the hands of a clock in a straight line but opposite in direction?`,
    options: ['20', '22', '24', '48'],
    answer: 1,
    topic: 'reasoning-clock-calendar',
    topicLabel: 'Reasoning — Clocks',
    section: 'reasoning',
    explanation: `The hands are opposite 11 times in 12 hours, so 22 times in 24 hours.`,
  },
  {
    q: `What is the smallest number that must be added to 1586 so that the sum is divisible by 17?`,
    options: ['2', '3', '4', '12'],
    answer: 3,
    topic: 'arithmetic-number-system',
    topicLabel: 'Arithmetic — Divisibility',
    section: 'arithmetic',
    explanation: `17 × 93 = 1581, leaving a remainder of 5. The next multiple is 17 × 94 = 1598, so add 1598 − 1586 = 12.`,
  },
  {
    q: `Solve: 48 ÷ {4 + 2(5 − 3)} + 7`,
    options: ['19', '15', '13', '11'],
    answer: 2,
    topic: 'arithmetic-simplification',
    topicLabel: 'Arithmetic — Simplification',
    section: 'arithmetic',
    explanation: `48 ÷ {4 + 2(2)} + 7 = 48 ÷ {4 + 4} + 7 = 48 ÷ 8 + 7 = 6 + 7 = 13.`,
  },
  {
    q: `If a : b = 4 : 7 and a : c = 2 : 5, then a : b : c is:`,
    options: ['4:7:5', '4:7:10', '2:3:5', '1:5:7'],
    answer: 1,
    topic: 'arithmetic-ratio',
    topicLabel: 'Arithmetic — Ratio & Proportion',
    section: 'arithmetic',
    explanation: `Make a common: a = 4, so c = 10 from a:c = 2:5. With b = 7, the ratio is 4:7:10.`,
  },
  {
    q: `The simple interest for two years is ₹400 at 10% per annum. Find the compound interest for the same rate and time period.`,
    options: ['₹400', '₹410', '₹420', '₹440'],
    answer: 2,
    topic: 'arithmetic-interest',
    topicLabel: 'Arithmetic — Interest',
    section: 'arithmetic',
    explanation: `SI = P × 10 × 2/100 = 400, so P = 2000. CI = 2000[(1.1)² − 1] = 2000 × 0.21 = ₹420.`,
  },
  {
    q: `A sum of ₹5000 amounts to ₹6050 in 2 years when compounded annually. What is the rate of interest per annum?`,
    options: ['5%', '10%', '12%', '15%'],
    answer: 1,
    topic: 'arithmetic-interest',
    topicLabel: 'Arithmetic — Interest',
    section: 'arithmetic',
    explanation: `(1 + r)² = 6050/5000 = 1.21, so 1 + r = 1.1 and r = 10%.`,
  },
  {
    q: `The selling price of a toy is ₹750. If the shopkeeper makes a profit of 25%, the cost price is:`,
    options: ['₹600', '₹500', '₹550', '₹650'],
    answer: 0,
    topic: 'arithmetic-profit-loss',
    topicLabel: 'Arithmetic — Profit & Loss',
    section: 'arithmetic',
    explanation: `Cost price = 750/1.25 = ₹600.`,
  },
  {
    q: `The population of a village is 12,000 and increases by 5% annually. What will be its population after 2 years?`,
    options: ['13,230', '12,600', '13,000', '13,500'],
    answer: 0,
    topic: 'arithmetic-percentage',
    topicLabel: 'Arithmetic — Percentage',
    section: 'arithmetic',
    explanation: `12,000 × (1.05)² = 12,000 × 1.1025 = 13,230.`,
  },
  {
    q: `A student saves ₹450 on a toy when a discount of 15% is given. The marked price of the toy is:`,
    options: ['₹4,000', '₹2,500', '₹3,500', '₹3,000'],
    answer: 3,
    topic: 'arithmetic-discount',
    topicLabel: 'Arithmetic — Discount',
    section: 'arithmetic',
    explanation: `15% of the marked price = ₹450, so marked price = 450/0.15 = ₹3,000.`,
  },
  {
    q: `Out of 25,000 voters in a constituency, 80% voted. How many did not vote?`,
    options: ['6,000', '4,000', '8,000', '5,000'],
    answer: 3,
    topic: 'arithmetic-percentage',
    topicLabel: 'Arithmetic — Percentage',
    section: 'arithmetic',
    explanation: `If 80% voted, 20% did not. 20% of 25,000 = 5,000.`,
  },
  {
    q: `A table costing ₹2,000 is sold for ₹1,800. What is the loss percent?`,
    options: ['10%', '8%', '5%', '12%'],
    answer: 0,
    topic: 'arithmetic-profit-loss',
    topicLabel: 'Arithmetic — Profit & Loss',
    section: 'arithmetic',
    explanation: `Loss = 200 on a cost of 2,000, so loss% = 200/2000 × 100 = 10%.`,
  },
  {
    q: `A can complete a work in 15 days and B can complete it in 20 days. If they work together for 4 days, what fraction of the work remains?`,
    options: ['7/15', '8/15', '2/5', '3/5'],
    answer: 1,
    topic: 'arithmetic-time-work',
    topicLabel: 'Arithmetic — Time & Work',
    section: 'arithmetic',
    explanation: `Together they do 1/15 + 1/20 = 7/60 per day. In 4 days they do 28/60 = 7/15, leaving 8/15.`,
  },
  {
    q: `The average age of 20 students is 16 years. If the teacher's age is included, the average becomes 17. What is the teacher's age?`,
    options: ['40 years', '37 years', '35 years', '32 years'],
    answer: 1,
    topic: 'arithmetic-average',
    topicLabel: 'Arithmetic — Average',
    section: 'arithmetic',
    explanation: `Total age of students = 20 × 16 = 320. With the teacher, 21 × 17 = 357. Teacher's age = 357 − 320 = 37 years.`,
  },
  {
    q: `A can complete a piece of work in 12 days, while B can complete it in 18 days. How many days will they take to complete the work together?`,
    options: ['9 days', '6 days', '8 days', '7 1/5 days'],
    answer: 3,
    topic: 'arithmetic-time-work',
    topicLabel: 'Arithmetic — Time & Work',
    section: 'arithmetic',
    explanation: `Combined rate = 1/12 + 1/18 = 5/36 per day, so time = 36/5 = 7 1/5 days.`,
  },
  {
    q: `The Information Technology Act 2000 (IT Act 2000) was notified on:`,
    options: ['7th November 2000', '17th December 2000', '7th October 2000', '17th October 2000'],
    answer: 3,
    topic: 'computer-it-act',
    topicLabel: 'Computer — Cyber Law',
    section: 'computer',
    explanation: `The Act was notified in June 2000 and came into force on 17 October 2000; the key uses the commencement date.`,
  },
  {
    q: `The combination of two or more interconnected networks is called:`,
    options: ['Internetwork', 'LAN', 'MAN', 'WAN'],
    answer: 0,
    topic: 'computer-networks',
    topicLabel: 'Computer — Networks',
    section: 'computer',
    explanation: `An internetwork is a collection of interconnected networks. The Internet is the largest example.`,
  },
  {
    q: `ISP stands for:`,
    options: [
      'International Service Provider',
      'International System Provider',
      'Internet Service Provider',
      'Internetwork System Provider',
    ],
    answer: 2,
    topic: 'computer-abbreviations',
    topicLabel: 'Computer — Abbreviations',
    section: 'computer',
    explanation: `ISP = Internet Service Provider, a company that provides access to the Internet.`,
  },
  {
    q: `What is the total number of students in classes A and D?`,
    options: ['50', '40', '20', '60'],
    answer: 0,
    topic: 'reasoning-data-interpretation',
    topicLabel: 'Reasoning — Data Interpretation',
    section: 'reasoning',
    imagePath: '/question-images/zzr-mock-2026/paper2-q53.png',
    explanation: `The chart gives 30 students in class A and 20 in class D, so the total is 50.`,
  },
  {
    q: `The network that provides high-speed connectivity or transmission speed is:`,
    options: ['MAN', 'LAN', 'WAN', 'Internetwork'],
    answer: 1,
    topic: 'computer-networks',
    topicLabel: 'Computer — Networks',
    section: 'computer',
    explanation: `A LAN covers a small area and normally offers the highest speed among these categories; WAN and MAN span larger distances.`,
  },
  {
    q: `A protocol is:`,
    options: [
      'a set of rules on how communication components and DTEs are to communicate',
      'logical communication channels used for transmission of data',
      'physical communication channels used for transmission of data',
      'None of these',
    ],
    answer: 0,
    topic: 'computer-networks',
    topicLabel: 'Computer — Protocols',
    section: 'computer',
    explanation: `A protocol is an agreed set of rules governing communication between devices.`,
  },
  {
    q: `The method of communication in which transmission of data takes place in both directions but in one direction at a time is:`,
    options: ['Simplex', 'Four-wire circuit', 'Half-duplex', 'Full duplex'],
    answer: 2,
    topic: 'computer-networks',
    topicLabel: 'Computer — Transmission Modes',
    section: 'computer',
    explanation: `Half-duplex allows communication in both directions, but only one direction at a time.`,
  },
  {
    q: `The telephone network is a good example of:`,
    options: ['Half-duplex', 'Simplex', 'Full duplex', 'a and c'],
    answer: 2,
    topic: 'computer-networks',
    topicLabel: 'Computer — Transmission Modes',
    section: 'computer',
    explanation: `A normal telephone conversation allows both parties to speak and listen at the same time, so it is full duplex.`,
  },
  {
    q: `How many students score between 20 and 40?`,
    options: ['20', '21', '22', '23'],
    answer: 2,
    topic: 'reasoning-data-interpretation',
    topicLabel: 'Reasoning — Data Interpretation',
    section: 'reasoning',
    imagePath: '/question-images/zzr-mock-2026/paper2-q58.png',
    explanation: `Adding the frequencies in the 20–40 score band in the chart gives 22 students.`,
  },
  {
    q: `TCP/IP stands for:`,
    options: [
      'Transmission Control Protocol / Internet Protocol',
      'Transmission Channel Protocol / Internet Protocol',
      'Transport Control Protocol / Internet Protocol',
      'Transmission Connection Protocol / Internet Protocol',
    ],
    answer: 0,
    topic: 'computer-abbreviations',
    topicLabel: 'Computer — Abbreviations',
    section: 'computer',
    explanation: `TCP/IP = Transmission Control Protocol / Internet Protocol, the basic protocol suite of the Internet.`,
  },
  {
    q: `What is the full form of HTML?`,
    options: [
      'High Transfer Machine Language',
      'High Transmission Markup Language',
      'Hyper Text Markup Language',
      'Hypermedia Markup Language',
    ],
    answer: 2,
    topic: 'computer-abbreviations',
    topicLabel: 'Computer — Abbreviations',
    section: 'computer',
    explanation: `HTML = Hyper Text Markup Language, used to structure web pages.`,
  },
  {
    q: `Which software is used to manage and control the hardware components and allows interaction between the hardware and the other different types of software?`,
    options: ['Application software', 'System software', 'Utility software', 'Operating system'],
    answer: 1,
    topic: 'computer-software',
    topicLabel: 'Computer — Software',
    section: 'computer',
    explanation: `The printed key marks system software. Technically, the operating system is the system software that directly manages hardware and provides the interface; system software is the broader category that contains it.`,
    disputeNote: 'The key marks system software (b); the more precise answer is operating system (d), which is the system software that directly manages hardware.',
  },
  {
    q: `Analytical Engine, the first fully automatic calculating machine, was developed by:`,
    options: ['Charles Babbage', 'Blaise Pascal', 'Leibniz', 'John Von Neumann'],
    answer: 0,
    topic: 'computer-history',
    topicLabel: 'Computer — History',
    section: 'computer',
    explanation: `Charles Babbage designed the Analytical Engine, regarded as the precursor of the modern computer.`,
  },
  {
    q: `The register which holds the current instruction under execution is:`,
    options: ['Instruction Register', 'Accumulator Register', 'Program Counter Register', 'Memory Buffer Register'],
    answer: 0,
    topic: 'computer-architecture',
    topicLabel: 'Computer — Architecture',
    section: 'computer',
    explanation: `The Instruction Register (IR) holds the instruction currently being decoded and executed.`,
  },
  {
    q: `A device used for converting pictures, maps and drawings into digital form is known as:`,
    options: ['Digital Printer', 'Character Recorder', 'Digitizer', 'None of the above'],
    answer: 2,
    topic: 'computer-input-devices',
    topicLabel: 'Computer — Input Devices',
    section: 'computer',
    explanation: `A digitizer converts analog images, maps and drawings into digital form.`,
  },
  {
    q: `Which among the following printing devices prints one page at a time?`,
    options: ['Inkjet Printer', 'Dot-Matrix Printer', 'Laser Printer', 'Drum Printer'],
    answer: 2,
    topic: 'computer-peripherals',
    topicLabel: 'Computer — Peripherals',
    section: 'computer',
    explanation: `A laser printer prints a complete page at a time, unlike line or character printers.`,
  },
  {
    q: `Which of the following systems is not system software?`,
    options: ['Operating system', 'Utility Program', 'Spreadsheet software', 'Programming Language Translator'],
    answer: 2,
    topic: 'computer-software',
    topicLabel: 'Computer — Software',
    section: 'computer',
    explanation: `Spreadsheet software is application software. Operating systems, utilities and language translators are system software.`,
  },
  {
    q: `A translator which is used to translate a high-level program into machine language is known as:`,
    options: ['Interpreter', 'Assembler', 'Language Converter', 'Programming Language Translator'],
    answer: 0,
    topic: 'computer-software',
    topicLabel: 'Computer — Language Translators',
    section: 'computer',
    explanation: `The printed key marks interpreter. A compiler is the usual term for translating a whole high-level program into machine code, while an interpreter translates and executes it statement by statement; the paper does not offer "compiler".`,
    disputeNote: 'The key marks interpreter. "Compiler" is the more usual answer for a whole-program high-level-to-machine translation, but it is not among the options.',
  },
  {
    q: `A computer is referred to as a data processor because it can:`,
    options: ['Process data', 'Store data', 'Retrieve data', 'All of the above'],
    answer: 3,
    topic: 'computer-fundamentals',
    topicLabel: 'Computer — Fundamentals',
    section: 'computer',
    explanation: `A computer processes, stores and retrieves data, so all three functions apply.`,
  },
  {
    q: `Identify the missing term: 9, 29, 67, 129, ?`,
    options: ['220', '221', '227', '229'],
    answer: 1,
    topic: 'reasoning-number-series',
    topicLabel: 'Reasoning — Number Series',
    section: 'reasoning',
    explanation: `The terms follow n³ + (n − 1): 2³ + 1 = 9, 3³ + 2 = 29, 4³ + 3 = 67, 5³ + 4 = 129, so the next is 6³ + 5 = 221.`,
  },
  {
    q: `Identify the missing term: SCD, TEF, UGH, ____, WKL`,
    options: ['CMN', 'UJI', 'VIJ', 'IJT'],
    answer: 2,
    topic: 'reasoning-letter-series',
    topicLabel: 'Reasoning — Letter Series',
    section: 'reasoning',
    explanation: `First letters run S, T, U, V, W; second letters C, E, G, I, K; third letters D, F, H, J, L. The missing term is VIJ.`,
  },
  {
    q: `Identify the missing term: B2CD, _____, BCD4, B5CD, BC6D`,
    options: ['B2C2D', 'BC3D', 'B2C3D', 'BCD7'],
    answer: 1,
    topic: 'reasoning-letter-series',
    topicLabel: 'Reasoning — Letter Series',
    section: 'reasoning',
    explanation: `The digit increases 2, 3, 4, 5, 6 and moves one position to the right each time: B2CD, BC3D, BCD4, B5CD, BC6D.`,
  },
  {
    q: `Paw : Cat :: Hoof : ?`,
    options: ['Lamb', 'Elephant', 'Lion', 'Horse'],
    answer: 3,
    topic: 'reasoning-analogy',
    topicLabel: 'Reasoning — Analogy',
    section: 'reasoning',
    explanation: `A paw is the foot of a cat; a hoof is the foot of a horse.`,
  },
  {
    q: `6 : 18 :: 4 : ? :: 22 : 242`,
    options: ['12', '8', '16', '20'],
    answer: 1,
    topic: 'reasoning-analogy',
    topicLabel: 'Reasoning — Analogy',
    section: 'reasoning',
    explanation: `The second number is the first multiplied by half of itself: 6 × 3 = 18, 4 × 2 = 8, 22 × 11 = 242.`,
  },
  {
    q: `If A + B means A is the mother of B; A − B means A is the brother of B; A % B means A is the father of B; and A × B means A is the sister of B, which of the following shows that P is the maternal uncle of Q?`,
    options: ['Q − N + M × P', 'P + S × N − Q', 'P − M + N × Q', 'Q − S % P'],
    answer: 2,
    topic: 'reasoning-blood-relations',
    topicLabel: 'Reasoning — Blood Relations',
    section: 'reasoning',
    explanation: `P − M makes P the brother of M; M + N makes M the mother of N; N × Q makes N the sister of Q. Therefore M is also Q's mother and P is Q's maternal uncle.`,
  },
  {
    q: `Introducing a boy, a girl said, "He is the son of the daughter of the father of my uncle." How is the boy related to the girl?`,
    options: ['Brother', 'Nephew', 'Uncle', 'Son-in-law'],
    answer: 0,
    topic: 'reasoning-blood-relations',
    topicLabel: 'Reasoning — Blood Relations',
    section: 'reasoning',
    explanation: `The father of the girl's uncle is her grandfather. The key assumes the relevant daughter is the girl's mother, making her son the girl's brother.`,
    disputeNote: 'The wording is ambiguous: if the daughter is the girl\'s aunt rather than her mother, the boy could be her cousin. The supplied key assumes brother.',
  },
  {
    q: `If 'WORK' is coded as '4-12-9-16', then how will you code 'WOMAN'?`,
    options: ['4-12-14-26-13', '4-26-14-13-12', '23-12-26-14-13', '23-15-13-1-14'],
    answer: 0,
    topic: 'reasoning-coding-decoding',
    topicLabel: 'Reasoning — Coding & Decoding',
    section: 'reasoning',
    explanation: `The code uses reverse alphabet positions: W = 4, O = 12, R = 9, K = 16. For WOMAN: W = 4, O = 12, M = 14, A = 26, N = 13.`,
  },
  {
    q: `Study the following letters and their corresponding digit code, then answer the question using the given conditions.
Conditions:
(I) If both the first and the last letters in the group are vowels, both should be coded as $.
(II) If both the first and the last letters in the group are consonants, both should be coded as #.
KUNAJB`,
    options: ['803917', '$0391$', '#0391#', '#0391$'],
    answer: 2,
    topic: 'reasoning-coding-decoding',
    topicLabel: 'Reasoning — Coding & Decoding',
    section: 'reasoning',
    imagePath: '/question-images/zzr-mock-2026/paper2-q77.png',
    explanation: `K and B are both consonants, so condition II replaces both first and last letters with #. The middle codes are 0-3-9-1, giving #0391#.`,
  },
  {
    q: `If ROSE is coded as 6821, CHAIR is coded as 73456 and PREACH is coded as 961473, what will be the code for SEARCH?`,
    options: ['246173', '214673', '214763', '216473'],
    answer: 3,
    topic: 'reasoning-coding-decoding',
    topicLabel: 'Reasoning — Coding & Decoding',
    section: 'reasoning',
    explanation: `The printed key marks (d). A literal decoding from the three given codes gives S = 2, E = 1, A = 4, R = 6, C = 7, H = 3, i.e. 214673 (b). The keyed option is retained so the mock matches the paper.`,
    disputeNote: 'Worked solution gives 214673 (b); the printed key marks 216473 (d).',
  },
  {
    q: `Statements:
1. Some A is B
2. No B is C
Conclusions:
1. No A is C
2. Some A is C
Read both conclusions and decide which logically follows.`,
    options: ['Conclusion 1 follows', 'Conclusion 2 follows', 'Both 1 and 2 follow', 'Either conclusion 1 or 2 follows'],
    answer: 3,
    topic: 'reasoning-syllogism',
    topicLabel: 'Reasoning — Syllogism',
    section: 'reasoning',
    explanation: `There is no definite relation between A and C: the A's that are B are not C, but other A's could be. The supplied key treats the two conclusions as complementary possibilities and marks (d).`,
    disputeNote: 'Under strict syllogistic logic neither conclusion is guaranteed; the supplied key marks (d) using the conventional either/or treatment.',
  },
  {
    q: `Statements:
1. Some ducks are vans
2. Some vans are not friends
Conclusions:
1. Some ducks are not vans is a possibility
2. All ducks are friends is a possibility
Read both conclusions and decide which logically follows.`,
    options: ['Conclusion 1 follows', 'Conclusion 2 follows', 'Both 1 and 2 follow', 'Neither 1 nor 2 follows'],
    answer: 2,
    topic: 'reasoning-syllogism',
    topicLabel: 'Reasoning — Syllogism',
    section: 'reasoning',
    explanation: `"Some ducks are vans" leaves open the possibility that other ducks are not vans, so 1 is possible. Nothing rules out all ducks being friends, so 2 is also possible.`,
  },
  {
    q: `A clock seen through a mirror shows quarter past three. What is the correct time shown by the clock?`,
    options: ['9:45', '9:15', '8:45', '3:15'],
    answer: 2,
    topic: 'reasoning-clock-calendar',
    topicLabel: 'Reasoning — Clocks',
    section: 'reasoning',
    explanation: `Mirror time = 11:60 − 3:15 = 8:45.`,
  },
  {
    q: `Assuming the given statement to be true, find which of the conclusions is/are definitely true:
Statement: H < A < T = G > U ≥ V ≥ B
Conclusions:
I. T > B
II. G > H`,
    options: ['Only conclusion I follows', 'Either conclusion I or II follows', 'None follows', 'Both conclusion I and II follow'],
    answer: 3,
    topic: 'reasoning-inequality',
    topicLabel: 'Reasoning — Inequalities',
    section: 'reasoning',
    explanation: `T = G > U ≥ V ≥ B gives T > B. Also G = T > A > H gives G > H. Both conclusions follow.`,
  },
  {
    q: `In how many ways can 5 students stand in a straight line?`,
    options: ['25', '60', '120', '240'],
    answer: 2,
    topic: 'reasoning-permutation-combination',
    topicLabel: 'Reasoning — Permutations',
    section: 'reasoning',
    explanation: `The number of arrangements is 5! = 120.`,
  },
  {
    q: `In how many ways can the letters of the word MATHS be arranged?`,
    options: ['60', '100', '120', '24'],
    answer: 2,
    topic: 'reasoning-permutation-combination',
    topicLabel: 'Reasoning — Permutations',
    section: 'reasoning',
    explanation: `MATHS has 5 distinct letters, so the number of arrangements is 5! = 120.`,
  },
  {
    q: `The area of a circle is 616 cm². Find its circumference.`,
    options: ['88 cm', '176 cm', '44 cm', '66 cm'],
    answer: 0,
    topic: 'arithmetic-mensuration',
    topicLabel: 'Arithmetic — Mensuration',
    section: 'arithmetic',
    explanation: `πr² = 616, so r² = 616 × 7/22 = 196 and r = 14 cm. Circumference = 2πr = 2 × 22/7 × 14 = 88 cm.`,
  },
  {
    q: `The parallel sides of a trapezium are 18 cm and 32 cm. If its area is 250 cm², find its height.`,
    options: ['10 cm', '12 cm', '15 cm', '8 cm'],
    answer: 0,
    topic: 'arithmetic-mensuration',
    topicLabel: 'Arithmetic — Mensuration',
    section: 'arithmetic',
    explanation: `Area = ½ × (18 + 32) × h = 25h. Setting 25h = 250 gives h = 10 cm.`,
  },
  {
    q: `The length of a rectangle is increased by 20% and its breadth is decreased by 10%. What is the percentage change in its area?`,
    options: ['8% increase', '10% increase', '8% decrease', '10% decrease'],
    answer: 0,
    topic: 'arithmetic-percentage',
    topicLabel: 'Arithmetic — Percentage',
    section: 'arithmetic',
    explanation: `New area factor = 1.20 × 0.90 = 1.08, so the area increases by 8%.`,
  },
  {
    q: `Simplify: 3/4 × 64 ÷ 8 + 5² − 7`,
    options: ['20', '24', '26', '28'],
    answer: 1,
    topic: 'arithmetic-simplification',
    topicLabel: 'Arithmetic — Simplification',
    section: 'arithmetic',
    explanation: `3/4 × 64 = 48; 48 ÷ 8 = 6; 5² = 25. So 6 + 25 − 7 = 24.`,
  },
  {
    q: `If January is called "March", March is called "April" and April is called "May", then which of the following months will have only 30 days?`,
    options: ['January', 'March', 'April', 'May'],
    answer: 3,
    topic: 'reasoning-clock-calendar',
    topicLabel: 'Reasoning — Calendar',
    section: 'reasoning',
    explanation: `April has 30 days, and in the code April is called May. The coded month with 30 days is therefore May.`,
  },
  {
    q: `How many pairs of letters are there in the word OPERATION which have as many letters between them in the word as in the English alphabet?`,
    options: ['5', '6', '7', 'more than 7'],
    answer: 3,
    topic: 'reasoning-letter-series',
    topicLabel: 'Reasoning — Alphabet Test',
    section: 'reasoning',
    explanation: `Checking each pair in order gives the pairs OP, OR, OT, OI, PR, PT, EI, RT and ON — nine pairs, which is more than 7.`,
  },
  {
    q: `Fill in the blanks: _ ml_nl_mlm_ l _ mlmn _`,
    options: ['nnmmll', 'nmlnml', 'mnlnlm', 'nmnnnl'],
    answer: 3,
    topic: 'reasoning-letter-series',
    topicLabel: 'Reasoning — Letter Series',
    section: 'reasoning',
    explanation: `Filling the blanks with option (d) gives the repeating six-letter block nmlmnl: nmlmnl | nmlmnl | nmlmnl.`,
  },
  {
    q: `Choose the word which is different from the rest.`,
    options: ['Cap', 'Turban', 'Helmet', 'Veil'],
    answer: 3,
    topic: 'reasoning-classification',
    topicLabel: 'Reasoning — Classification',
    section: 'reasoning',
    explanation: `Cap, turban and helmet are headwear. A veil is a face covering, so it is the odd one out.`,
  },
  {
    q: `Kima walks towards east and every time he turns, he takes a right turn only. He turns after every 2 km, 4 km, 7 km and 16 km. How far is Kima standing from his initial point?`,
    options: ['5 km', '7 km', '12 km', '13 km'],
    answer: 3,
    topic: 'reasoning-direction-sense',
    topicLabel: 'Reasoning — Direction Sense',
    section: 'reasoning',
    explanation: `Starting east: 2 km east, then 4 km south, then 7 km west, then 16 km north. Final displacement is 5 km west and 12 km north, so distance = √(5² + 12²) = 13 km.`,
  },
  {
    q: `In a code language, 123 means 'hot filtered coffee', 356 means 'very hot day', and 589 means 'day and night'. Which numeral stands for 'very'?`,
    options: ['5', '6', '8', '9'],
    answer: 1,
    topic: 'reasoning-coding-decoding',
    topicLabel: 'Reasoning — Coding & Decoding',
    section: 'reasoning',
    explanation: `"hot" is common to 123 and 356, so 3 = hot. "day" is common to 356 and 589, so 5 = day. In 356 the remaining numeral 6 must be "very".`,
  },
  {
    q: `If P is sitting second to the left of S and Q is sitting third to the right of R. T sits immediate right of S, and Q is not to the immediate right or left of S. Who sits to the immediate right of R?`,
    options: ['P', 'Q', 'S', 'T'],
    answer: 2,
    topic: 'reasoning-seating-arrangement',
    topicLabel: 'Reasoning — Seating Arrangement',
    section: 'reasoning',
    explanation: `Place P two places left of S and T immediately right of S. Q cannot be next to S, so Q must be third right of R with R immediately left of S. Therefore S sits to the immediate right of R.`,
  },
  {
    q: `If Hmingi is 12 ranks ahead of Siami, who ranks 13th from the last, then how many students are there in the class if Hmingi is 4th in the order of merit?`,
    options: ['26', '27', '28', '29'],
    answer: 2,
    topic: 'reasoning-ranking',
    topicLabel: 'Reasoning — Ranking',
    section: 'reasoning',
    explanation: `Hmingi is 4th and 12 ranks ahead of Siami, so Siami is 16th. Siami is 13th from the last, so total = 16 + 13 − 1 = 28.`,
  },
  {
    q: `Count the number of parallelograms in the given figure.`,
    options: ['20', '18', '16', '12'],
    answer: 1,
    topic: 'reasoning-counting-figures',
    topicLabel: 'Reasoning — Counting Figures',
    section: 'reasoning',
    imagePath: '/question-images/zzr-mock-2026/paper2-q97.png',
    explanation: `There are four slanted boundary/divider lines and three horizontal lines. Choosing any two of each gives C(4,2) × C(3,2) = 6 × 3 = 18 parallelograms, matching option (b).`,
  },
  {
    q: `What is the day of 29th April 2001?`,
    options: ['Monday', 'Sunday', 'Friday', 'None of these'],
    answer: 1,
    topic: 'reasoning-clock-calendar',
    topicLabel: 'Reasoning — Calendar',
    section: 'reasoning',
    explanation: `1 January 2001 was a Monday. 29 April is day 119 of the year, an offset of 118 days; 118 mod 7 = 6, so the day is Sunday.`,
  },
  {
    q: `Find the missing number:
7   2   27
6   3   12
8   3   ?`,
    options: ['25', '26', '28', '30'],
    answer: 2,
    topic: 'reasoning-missing-number',
    topicLabel: 'Reasoning — Missing Number',
    section: 'reasoning',
    explanation: `The pattern is (first − second)² + second: (7 − 2)² + 2 = 27, (6 − 3)² + 3 = 12, so (8 − 3)² + 3 = 28.`,
  },
  {
    q: `One rabbit saw 6 elephants while going towards the river. Every elephant saw 2 monkeys going towards the river. Every monkey holds one tortoise in its hands. How many animals are going towards the river?`,
    options: ['14', '11', '8', '5'],
    answer: 3,
    topic: 'reasoning-puzzle',
    topicLabel: 'Reasoning — Puzzle',
    section: 'reasoning',
    explanation: `The rabbit, 2 monkeys and 2 tortoises are going towards the river = 5 animals. The elephants saw the monkeys but were not said to be going towards the river.`,
  },
];

export const zzrMock2026: QuestionBank = {
  id: 'zzr-mock-2026',
  title: 'Zawlbuk Zirna Run Mock Test 2026',
  description:
    'Paper I (75 MCQ: General Knowledge & General English) and Paper II (100 MCQ: Computer, Arithmetic & Reasoning) from the Zawlbuk Zirna Run mock test of 24 October 2026. Browse, practise or sit each paper as a timed mock; attempts and wrong answers are tracked by the host module.',
  questions: [
    ...build(
      PAPER_1_ID,
      'Zawlbuk Zirna Run Mock Test, 24 October 2026 · Paper I (Series B)',
      '/papers/zzr-mock-2026/paper-1-series-b.pdf',
      'derived',
      undefined,
      paper1Seeds,
    ),
    ...build(
      PAPER_2_ID,
      'Zawlbuk Zirna Run Mock Test, 24 October 2026 · Paper II (Series B)',
      '/papers/zzr-mock-2026/paper-2-series-b.pdf',
      'transcribed',
      'Zawlbuk Zirna Run Paper II (Series B) answer key, 24 October 2026',
      paper2Seeds,
    ),
  ],
  papers: zzrMock2026Papers,
};
