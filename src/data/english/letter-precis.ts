// ============================================
// LETTER WRITING & PRÉCIS — format drill + compression guide
//
// Backs the "✍️ Letter & Précis" tab in the State Tax Officer module.
//
// Grounding: every `realPrompts` string below is a verbatim (or near-
// verbatim) task from an actual Mizoram PSC General English paper in the
// Old_Questions corpus at /home.old/hruaia/Downloads/mpsc_pdfs_examination/
// — not invented. Letter tasks there run 10–15 marks, précis 14–15, and
// the précis instruction is almost always "in about one-third of its
// original length" plus "giving a suitable title".
//
// HONESTY NOTE: MPSC has never published a marking rubric for the
// descriptive English papers. The block order and conventions here are the
// standard Indian formal-letter layout used across Indian competitive
// exams — presented as "the safe default", never as "MPSC requires this".
// What actually loses marks is a missing block or an inconsistent layout,
// not which margin the address sits on.
// ============================================

export type Align = 'left' | 'right' | 'centre';

export interface LetterBlock {
  id: string;
  /** Short name the drill asks you to place. */
  label: string;
  align: Align;
  /** The block as it would actually appear on the answer sheet. */
  sample: string;
  /** Why it sits here / what loses marks. */
  note: string;
}

export interface LetterFormat {
  id: string;
  name: string;
  glyph: string;
  tone: 'Formal' | 'Semi-formal' | 'Informal';
  /** Marks and length seen on real papers. */
  marks: string;
  /** One line on when this one shows up. */
  whenAsked: string;
  /** Verbatim tasks from real MPSC papers. */
  realPrompts: string[];
  blocks: LetterBlock[];
  /** Ready-made opening lines — the hardest sentence to invent under time. */
  openers: string[];
  /** The correct complimentary close(s) for this type. */
  closes: string[];
  /** A full worked letter, so the skeleton has something to hang on. */
  example: string;
  mistakes: string[];
}

export const letterFormats: LetterFormat[] = [
  {
    id: 'official',
    name: 'Official letter to a government officer',
    glyph: '🏛️',
    tone: 'Formal',
    marks: '10–15 marks · 120–200 words',
    whenAsked:
      'The single most-asked letter on MPSC English papers. Any task beginning "Write a letter to the Director / Commissioner / Chairman…" is this format, whether the purpose is a request, an enquiry, a complaint or an application.',
    realPrompts: [
      'Write a letter to the Director, Department of Horticulture, Government of Mizoram, requesting him…',
      'Write a letter to the Transport Director for re-issuing your driving license as you have recently misplaced the original copy.',
      'You are XYZ of C-79, Luangmual, Aizawl. Write a letter to the Director, NIELIT, Zuangtui, Aizawl inquiring about the duration of such a course and the terms and conditions for admission.',
      'Write a letter to the Chairman of your Local Council complaining about the damaged drains and roads in your locality, requesting repairs at the earliest. (15)',
      'Write a letter to the Chairman, Aizawl Municipal Corporation / your municipality seeking permission to construct a house in your chosen site. (10)',
      'Write a letter to the Director, Department of Food, Civil Supplies & Consumer Affairs, Government of Mizoram… Fair Price Shops. (10)',
    ],
    blocks: [
      {
        id: 'sender',
        label: "Sender's address",
        align: 'left',
        sample: 'C-79, Luangmual,\nAizawl, Mizoram – 796009',
        note:
          "Very first thing on the page, top-left. If the question hands you an identity (\"You are XYZ of ABC Locality\") use that address, never your own. Two or three lines, PIN on the last one.",
      },
      {
        id: 'date',
        label: 'Date',
        align: 'left',
        sample: '22 September 2026',
        note:
          "One blank line under the sender's address. Write the month in words — 22 September 2026, not 22/09/26 — so there is no dd/mm vs mm/dd ambiguity.",
      },
      {
        id: 'receiver',
        label: "Receiver's designation & address",
        align: 'left',
        sample:
          'The Director,\nDepartment of Horticulture,\nGovernment of Mizoram,\nAizawl – 796001',
        note:
          'Designation first, then department, then government/organisation, then place. Address the post, not the person: "The Director", never "Mr. Lalthanga" — the officer changes, the post does not.',
      },
      {
        id: 'subject',
        label: 'Subject line',
        align: 'left',
        sample:
          'Subject: Request for supply of grafted mango saplings under the district nursery scheme.',
        note:
          'One line, one purpose, underlined if you like. This is where the examiner reads your whole answer in three seconds. Leaving it out is the most common single-block loss in a formal letter.',
      },
      {
        id: 'salutation',
        label: 'Salutation',
        align: 'left',
        sample: 'Sir / Madam,',
        note:
          'Comma after it. Use "Sir," or "Sir / Madam," when you are writing to a post rather than a named human — which in an official letter is always.',
      },
      {
        id: 'body',
        label: 'Body — three paragraphs',
        align: 'left',
        sample:
          '¶1 Who you are and why you are writing (1–2 sentences).\n¶2 The facts: what happened, when, how bad, any reference number.\n¶3 The ask: exactly what action you want, and by when.',
        note:
          'Three paragraphs, in this order, every time. Purpose → facts → request. Most weak answers merge them into one block of prose and the "request" never actually gets made.',
      },
      {
        id: 'close',
        label: 'Complimentary close',
        align: 'left',
        sample: 'Yours faithfully,',
        note:
          'Capital Y, small f, comma. "Yours faithfully" because you opened with "Sir" and do not know the name. "Your\'s" does not exist.',
      },
      {
        id: 'signature',
        label: 'Signature & name',
        align: 'left',
        sample: '(Signature)\nXYZ\nResident, Luangmual, Aizawl',
        note:
          'Signature line, then the name in the identity the question gave you, then your standing (resident / applicant / consumer). Do not sign your real name in an exam answer.',
      },
    ],
    openers: [
      'I wish to bring to your kind notice that…',
      'With reference to your advertisement/notification dated …, I would like to…',
      'I am writing to request the issue of a duplicate … as the original has been misplaced.',
      'I would be grateful if you could furnish me with information regarding…',
    ],
    closes: ['Yours faithfully,'],
    example: `C-79, Luangmual,
Aizawl, Mizoram – 796009

22 September 2026

The Director,
Transport Department,
Government of Mizoram,
Aizawl – 796001

Subject: Request for issue of a duplicate driving licence.

Sir / Madam,

I am a resident of Luangmual, Aizawl, and the holder of driving licence
No. MZ-01/2019/44821, issued by your office in March 2019.

I regret to report that the original licence was misplaced on 14 September
2026 while travelling by public transport between Aizawl and Lunglei. A
report of the loss was lodged at Vaivakawn Police Station on 15 September
2026, and a copy of the General Diary entry is enclosed. I hold no other
driving licence, and none has been suspended or cancelled.

I therefore request that a duplicate licence be issued to me at the earliest
convenience. I shall remain available to complete any formalities or
verification your office may require.

Thanking you,

Yours faithfully,

(Signature)
XYZ
Luangmual, Aizawl

Enclosed: Copy of police General Diary entry dated 15.09.2026.`,
    mistakes: [
      'No subject line — the examiner has to read three paragraphs to find out what you want.',
      'Ending "Yours sincerely" after opening with "Sir". Sincerely goes with a name; faithfully goes with Sir.',
      'Writing your real name and address instead of the XYZ / ABC Locality identity the question supplied.',
      'Burying the actual request in the middle. The last paragraph must be the ask, stated plainly.',
      'Emotional language ("the authorities are utterly careless"). Official letters complain with facts and dates, not adjectives.',
    ],
  },
  {
    id: 'editor',
    name: 'Letter to the Editor',
    glyph: '📰',
    tone: 'Formal',
    marks: '10–15 marks · 150–200 words',
    whenAsked:
      'Whenever the task is a public grievance — roads, drains, parking, plastic, a neglected park, mental-health awareness. The trick is that you are not asking the newspaper to fix anything; you are using it to reach the authorities and the public.',
    realPrompts: [
      'You are a resident of Tuikhuahtlang, Aizawl. Write a letter to the Editor, Aizawl Times in about 150–200 words on the misuse and poor maintenance of the public park in your city. You may suggest…',
      'Write a letter to the Editor of ‘The Mizoram Express’ signing yourself as XYZ of ABC Locality in…',
      'Write a letter to the editor of Vanglaini about the deplorable state of the roads in your area.',
      'Write a letter to the Editor of an English daily of your choice stating reasons why use of plastic bags should be banned. (15)',
      'Write a letter to the editor of your local newspaper about the importance of mental health awareness on the occasion of World Mental Health Day. (10)',
    ],
    blocks: [
      {
        id: 'sender',
        label: "Sender's address",
        align: 'left',
        sample: 'Tuikhuahtlang,\nAizawl, Mizoram – 796001',
        note:
          'Top-left as always. Locality is enough — the paper prints the locality, not the house number.',
      },
      { id: 'date', label: 'Date', align: 'left', sample: '22 September 2026', note: 'One blank line below the address.' },
      {
        id: 'receiver',
        label: 'The Editor + paper',
        align: 'left',
        sample: 'The Editor,\nAizawl Times,\nAizawl, Mizoram',
        note:
          'Always "The Editor" — never a name, never "Dear Sir, Editor". The paper\'s name goes on line two exactly as the question spells it.',
      },
      {
        id: 'subject',
        label: 'Subject line',
        align: 'left',
        sample: 'Subject: Misuse and poor maintenance of the public park at Tuikhuahtlang.',
        note:
          'Name the issue and the place. This doubles as the headline the paper would print, so make it concrete — not "Subject: A problem in our area".',
      },
      { id: 'salutation', label: 'Salutation', align: 'left', sample: 'Sir / Madam,', note: 'Comma after.' },
      {
        id: 'hook',
        label: 'The "through your columns" opening',
        align: 'left',
        sample:
          'Through the columns of your esteemed daily, I wish to draw the attention of the concerned authorities to…',
        note:
          'The one sentence that makes this a letter to the editor rather than a complaint letter. It states the *route*: you → newspaper → authorities → public. Missing it is the classic way this answer reads as the wrong format.',
      },
      {
        id: 'body',
        label: 'Body — problem, effect, suggestion',
        align: 'left',
        sample:
          '¶1 The problem, in specifics.\n¶2 Who it harms and how — this is what earns the marks.\n¶3 Two or three practical suggestions, then the appeal to the authorities.',
        note:
          'A grievance with no suggested remedy is only half an answer. Papers that ask you to "suggest measures" are telling you the third paragraph is separately marked.',
      },
      {
        id: 'close',
        label: 'Complimentary close',
        align: 'left',
        sample: 'Yours truly,',
        note: '"Yours truly" or "Yours faithfully" — both accepted. Not "sincerely": you do not know the editor.',
      },
      {
        id: 'signature',
        label: 'Signature as XYZ',
        align: 'left',
        sample: '(Signature)\nXYZ\nTuikhuahtlang, Aizawl',
        note:
          'MPSC prompts literally say "signing yourself as XYZ of ABC Locality". Obey that exactly — it is an instruction, not a suggestion.',
      },
    ],
    openers: [
      'Through the columns of your esteemed daily, I wish to draw the attention of the concerned authorities to…',
      'I would like to use the wide readership of your newspaper to highlight a problem that residents of … have endured for months.',
      'It is with considerable concern that I write to draw public attention to…',
    ],
    closes: ['Yours truly,', 'Yours faithfully,'],
    example: `Tuikhuahtlang,
Aizawl, Mizoram – 796001

22 September 2026

The Editor,
Aizawl Times,
Aizawl, Mizoram

Subject: Misuse and poor maintenance of the public park at Tuikhuahtlang.

Sir / Madam,

Through the columns of your esteemed daily, I wish to draw the attention of
the concerned authorities to the condition of the public park at
Tuikhuahtlang, the only open green space serving nearly four localities.

The park has not been maintained for over a year. Its benches are broken,
the lighting has failed, and the boundary fence has collapsed on the
southern side. In the absence of any supervision the ground is now used
after dark for drinking and gambling, and waste is dumped along its edge.
The result is that the people the park exists for — children, and elderly
residents who once walked there in the evenings — no longer use it at all.

I would suggest three remedies: the appointment of a caretaker by the Local
Council, the restoration of lighting and fencing before the rains, and fixed
opening hours with the gates locked at night. The cost of these measures
would be small beside the cost of losing a public space altogether.

I hope the authorities concerned will take early notice.

Yours truly,

(Signature)
XYZ
Tuikhuahtlang, Aizawl`,
    mistakes: [
      'Writing it as a complaint to the municipality that happens to be addressed to a newspaper — the "through your columns" framing is what defines the format.',
      'Listing the problem for three paragraphs and suggesting nothing.',
      'Signing your real name when the question said to sign as XYZ.',
      '"Dear Editor" or "Respected Editor". It is "Sir / Madam,".',
    ],
  },
  {
    id: 'application',
    name: 'Job application letter',
    glyph: '📄',
    tone: 'Formal',
    marks: '10–15 marks · 150–200 words + enclosures',
    whenAsked:
      'Tasks phrased "apply for the post of…", usually with an explicit instruction to attach a resume. Structurally an official letter with two extra obligations: cite the advertisement, and list the enclosures.',
    realPrompts: [
      'Write a letter applying for this post. / Write a letter of application for the post of an Office Assistant.',
      '…post of Veterinary Assistant Surgeon. Attach your complete resume. (15)',
      'Write a letter to the Director of Education, applying for appointment as a teacher in the Education Department.',
      'Write a letter to the Director of Horticulture responding to a job advertisement and request an…',
    ],
    blocks: [
      { id: 'sender', label: "Sender's address", align: 'left', sample: 'C-79, Luangmual,\nAizawl – 796009', note: 'Top-left.' },
      { id: 'date', label: 'Date', align: 'left', sample: '22 September 2026', note: 'Below the address.' },
      {
        id: 'receiver',
        label: 'Receiver (appointing authority)',
        align: 'left',
        sample:
          'The Secretary,\nMizoram Public Service Commission,\nNew Secretariat Complex,\nAizawl – 796001',
        note: 'The appointing authority named in the advertisement — not "HR" and not a person.',
      },
      {
        id: 'subject',
        label: 'Subject line',
        align: 'left',
        sample: 'Subject: Application for the post of Veterinary Assistant Surgeon.',
        note:
          'Word it exactly as the advertisement words the post. "Application for the post of X" — the safest subject line in the whole paper.',
      },
      { id: 'salutation', label: 'Salutation', align: 'left', sample: 'Sir / Madam,', note: 'Comma after.' },
      {
        id: 'reference',
        label: 'Reference to the advertisement',
        align: 'left',
        sample:
          'With reference to your advertisement published in the Aizawl Times dated 5 September 2026, I wish to offer myself as a candidate for the above post.',
        note:
          'The opening sentence must name where and when you saw the vacancy. An application that does not reference the advertisement reads as unsolicited.',
      },
      {
        id: 'body',
        label: 'Body — qualifications, experience, fit',
        align: 'left',
        sample:
          '¶1 Qualifications: degree, institution, year, class.\n¶2 Experience and relevant skills, most recent first.\n¶3 Why you suit *this* post, and your availability.',
        note:
          'Qualifications before experience, experience before argument. Keep it to what the advertisement asked for — the resume carries the rest.',
      },
      { id: 'close', label: 'Complimentary close', align: 'left', sample: 'Yours faithfully,', note: 'Faithfully, because you opened with Sir.' },
      { id: 'signature', label: 'Signature & name', align: 'left', sample: '(Signature)\nXYZ', note: 'Name as the question gave it.' },
      {
        id: 'enclosures',
        label: 'Enclosures list',
        align: 'left',
        sample:
          'Enclosed:\n1. Curriculum Vitae\n2. Attested copies of educational certificates\n3. Copy of registration certificate',
        note:
          'A numbered list at the very bottom, below the signature. When the question says "Attach your complete resume", this block *is* the mark — leaving it out throws away an easy one.',
      },
    ],
    openers: [
      'With reference to your advertisement published in … dated …, I wish to offer myself as a candidate for the above post.',
      'In response to the advertisement issued by your office vide No. … dated …, I beg to apply for the post of …',
    ],
    closes: ['Yours faithfully,'],
    example: `C-79, Luangmual,
Aizawl – 796009

22 September 2026

The Director,
Animal Husbandry & Veterinary Department,
Government of Mizoram,
Aizawl – 796001

Subject: Application for the post of Veterinary Assistant Surgeon.

Sir / Madam,

With reference to your advertisement published in the Aizawl Times dated
5 September 2026, I wish to offer myself as a candidate for the above post.

I hold a Bachelor of Veterinary Science and Animal Husbandry degree from the
College of Veterinary Sciences, Aizawl, passed in the first division in 2023,
and I am registered with the Mizoram State Veterinary Council. During my
internship year I worked at the District Veterinary Hospital, Aizawl, where I
handled routine out-patient work, vaccination drives and two district-level
foot-and-mouth disease containment camps.

Having grown up in a rural district, I am familiar with the conditions under
which field veterinary work is carried out in Mizoram, and I am willing to
serve at any station to which I may be posted. I am available to join at one
month's notice.

My complete curriculum vitae and supporting documents are enclosed for your
kind consideration.

Yours faithfully,

(Signature)
XYZ

Enclosed:
1. Curriculum Vitae
2. Attested copies of educational certificates
3. Copy of Veterinary Council registration certificate`,
    mistakes: [
      'No enclosures list when the question explicitly said to attach a resume.',
      'Reproducing an entire resume inside the letter body. The letter argues; the resume lists.',
      'Not naming the advertisement, its paper and its date.',
      'Claiming qualifications the question did not give you — invent plainly and consistently, do not inflate.',
    ],
  },
  {
    id: 'complaint',
    name: 'Complaint letter to a company',
    glyph: '⚠️',
    tone: 'Formal',
    marks: '10–15 marks · 120–180 words',
    whenAsked:
      'A defective product, a service failure, a wrong delivery. Distinguished from the official letter by one thing: you have a transaction to cite — an order number, an invoice, a date of purchase.',
    realPrompts: [
      'Write a letter of complaint to the concerned company, inventing all the necessary details.',
      'Write a letter to the Chief Engineer, Electric Department, complaining that the current gets cut off…',
      'Write a letter of complaint to the Superintendent of Police (Traffic), Aizawl…',
      'Write a letter to the Commissioner of Police, Aizawl, making him/her aware of the frequent cases of…',
    ],
    blocks: [
      { id: 'sender', label: "Sender's address", align: 'left', sample: 'C-79, Luangmual,\nAizawl – 796009', note: 'Top-left.' },
      { id: 'date', label: 'Date', align: 'left', sample: '22 September 2026', note: 'Below the address.' },
      {
        id: 'receiver',
        label: 'Receiver (Customer Service Manager)',
        align: 'left',
        sample: 'The Customer Service Manager,\nQuality Electronics Pvt. Ltd.,\nBawngkawn, Aizawl – 796014',
        note: 'A post that can actually act on it — Customer Service Manager, Branch Manager, Chief Engineer.',
      },
      {
        id: 'subject',
        label: 'Subject with reference number',
        align: 'left',
        sample: 'Subject: Complaint regarding defective refrigerator supplied against Invoice No. QE/2026/1187.',
        note:
          'Put the order or invoice number *in the subject line*. It is the difference between a complaint that can be traced and one that cannot — and examiners reward the invented detail.',
      },
      { id: 'salutation', label: 'Salutation', align: 'left', sample: 'Sir / Madam,', note: 'Comma after.' },
      {
        id: 'body',
        label: 'Body — transaction, defect, redress',
        align: 'left',
        sample:
          '¶1 What you bought, when, where, against which invoice.\n¶2 What is wrong, when it started, what you already tried.\n¶3 What you want — replacement, repair, refund — and a reasonable deadline.',
        note:
          'Paragraph 3 must name one specific remedy. "Kindly do the needful" is the weakest sentence in exam English; say replacement or refund.',
      },
      { id: 'close', label: 'Complimentary close', align: 'left', sample: 'Yours faithfully,', note: 'Faithfully.' },
      { id: 'signature', label: 'Signature & name', align: 'left', sample: '(Signature)\nXYZ', note: 'With "Consumer" or your standing, if useful.' },
      {
        id: 'enclosures',
        label: 'Enclosures (bill / warranty copy)',
        align: 'left',
        sample: 'Enclosed: Copy of invoice No. QE/2026/1187 and warranty card.',
        note: 'Optional but cheap — it shows you understand that a complaint needs evidence.',
      },
    ],
    openers: [
      'I regret to inform you that the … purchased from your showroom on … has developed a serious defect.',
      'I wish to lodge a formal complaint regarding … supplied against Invoice No. … dated …',
    ],
    closes: ['Yours faithfully,'],
    example: `C-79, Luangmual,
Aizawl – 796009

22 September 2026

The Customer Service Manager,
Quality Electronics Pvt. Ltd.,
Bawngkawn, Aizawl – 796014

Subject: Complaint regarding defective refrigerator supplied against
Invoice No. QE/2026/1187.

Sir / Madam,

On 2 September 2026 I purchased a 260-litre refrigerator, model QE-FR260,
from your Bawngkawn showroom against the invoice cited above. It was
delivered and installed by your technicians on 4 September 2026.

Within a week the appliance began to fail. It does not hold temperature in
the lower compartment, the motor runs continuously without cutting off, and
it emits a loud rattling noise at night. I reported the fault to your
service number on 12 September and again on 17 September. A technician
visited once, declared the compressor defective, and no further action has
followed.

As the appliance is under warranty and has been faulty from the first week
of use, I request its replacement with a new unit, or a full refund, within
fifteen days of receipt of this letter. Copies of the invoice and the
warranty card are enclosed.

Yours faithfully,

(Signature)
XYZ

Enclosed: Copy of invoice No. QE/2026/1187 and warranty card.`,
    mistakes: [
      'No invoice/order number anywhere. The question says "inventing all the necessary details" — inventing them is the task.',
      'Anger instead of chronology. Dates and facts are the complaint; adjectives are not.',
      '"Kindly do the needful" in place of a named remedy.',
      'No deadline, so nothing in the letter obliges anyone to act.',
    ],
  },
  {
    id: 'business',
    name: 'Business letter — order or enquiry',
    glyph: '📦',
    tone: 'Formal',
    marks: '10–15 marks · 120–180 words',
    whenAsked:
      'Placing an order, asking a firm for a quotation, enquiring about a course or a service. The distinguishing feature is a tabulated or numbered list in the middle of the letter — the only letter type where that is correct.',
    realPrompts: [
      'Write a letter to Quality Furniture Store, Aizawl, placing an order for at least six items of furniture for…',
      'Write a letter of inquiry based on your interest…',
      'Write a letter to a travel agency in Shimla…',
      'Write a letter to the DFO (District Forest Officer), Forest Department, enquiring about the availability…',
      'Write a letter to the Branch Manager of State Bank of India to transfer your saving Bank Account.',
    ],
    blocks: [
      {
        id: 'sender',
        label: "Sender's address / letterhead",
        align: 'left',
        sample: 'Zothansanga Stores,\nBara Bazar,\nAizawl – 796001',
        note: 'If you are writing as a firm, the firm name heads the address.',
      },
      { id: 'date', label: 'Date', align: 'left', sample: '22 September 2026', note: 'Below the address.' },
      {
        id: 'receiver',
        label: 'Receiver (the firm)',
        align: 'left',
        sample: 'The Sales Manager,\nQuality Furniture Store,\nChanmari, Aizawl – 796007',
        note: 'The Sales Manager / The Proprietor — a post at the firm.',
      },
      {
        id: 'subject',
        label: 'Subject line',
        align: 'left',
        sample: 'Subject: Order for office furniture — Order No. ZS/06/2026.',
        note: 'Give your own order a reference number. It is the detail that makes a business letter read as real.',
      },
      { id: 'salutation', label: 'Salutation', align: 'left', sample: 'Dear Sir / Madam,', note: '"Dear Sir" is acceptable in trade correspondence where a bare "Sir" would be brusque.' },
      {
        id: 'intro',
        label: 'Opening — the purpose in one line',
        align: 'left',
        sample:
          'With reference to your price list dated 10 September 2026, we are pleased to place the following order.',
        note: 'One sentence. Business letters do not warm up.',
      },
      {
        id: 'list',
        label: 'The itemised list',
        align: 'left',
        sample:
          '1. Executive office table (teak) — 2 nos.\n2. Revolving chair, high back — 6 nos.\n3. Steel filing cabinet, four-drawer — 3 nos.\n4. Visitor chair — 8 nos.\n5. Conference table, 8-seater — 1 no.\n6. Book rack, five-shelf — 2 nos.',
        note:
          'Numbered, with quantities. When the question says "at least six items", the examiner is counting — give six or more, each on its own line.',
      },
      {
        id: 'terms',
        label: 'Terms — delivery, payment, discount',
        align: 'left',
        sample:
          'Kindly deliver the above at our Bara Bazar premises on or before 10 October 2026. Payment will be made by cheque within fifteen days of delivery, and we request the usual trade discount of 10 per cent.',
        note:
          'Delivery date, payment mode, discount. Three details, one short paragraph — this is the paragraph weak answers forget entirely.',
      },
      { id: 'close', label: 'Complimentary close', align: 'left', sample: 'Yours faithfully,', note: 'Faithfully.' },
      {
        id: 'signature',
        label: 'Signature, name & designation',
        align: 'left',
        sample: '(Signature)\nXYZ\nProprietor, Zothansanga Stores',
        note: 'A business letter is signed with a designation — you sign on behalf of the firm, not as yourself.',
      },
    ],
    openers: [
      'With reference to your price list dated …, we are pleased to place the following order.',
      'We shall be obliged if you will quote your lowest rates for the following items.',
      'I would be grateful if you could furnish details of the duration, fees and admission requirements for…',
    ],
    closes: ['Yours faithfully,'],
    example: `Zothansanga Stores,
Bara Bazar,
Aizawl – 796001

22 September 2026

The Sales Manager,
Quality Furniture Store,
Chanmari, Aizawl – 796007

Subject: Order for office furniture — Order No. ZS/06/2026.

Dear Sir / Madam,

With reference to your price list dated 10 September 2026, we are pleased to
place the following order for our newly opened branch office:

1. Executive office table (teak) — 2 nos.
2. Revolving chair, high back — 6 nos.
3. Steel filing cabinet, four-drawer — 3 nos.
4. Visitor chair — 8 nos.
5. Conference table, 8-seater — 1 no.
6. Book rack, five-shelf — 2 nos.

Kindly ensure that the items conform to the specifications and finish shown
in your catalogue. Delivery is required at our Bara Bazar premises on or
before 10 October 2026, as the office opens on 15 October. Payment will be
made by cheque within fifteen days of delivery, and we request the usual
trade discount of 10 per cent on the listed rates.

An early confirmation of this order would be appreciated.

Yours faithfully,

(Signature)
XYZ
Proprietor, Zothansanga Stores`,
    mistakes: [
      'Writing the order as prose. The list is the format; burying six items in a sentence loses the marks for it.',
      'Counting fewer items than the question demanded.',
      'No delivery date and no payment terms — an order nobody could actually fulfil.',
      'Using "I" throughout when writing on behalf of a firm; trade correspondence uses "we".',
    ],
  },
  {
    id: 'informal',
    name: 'Informal / personal letter',
    glyph: '💌',
    tone: 'Informal',
    marks: '10 marks · 100–150 words',
    whenAsked:
      'Letters to a friend, a relative, a younger sibling — inviting, advising, congratulating, consoling. Fewer blocks than a formal letter, and two of the formal blocks are actively wrong here.',
    realPrompts: [
      'Write a letter to your friend inviting him to visit the tourist spots in Mizoram. (10)',
      'Write a letter to a young relative of yours telling him about the dangers of driving without a licence.',
    ],
    blocks: [
      {
        id: 'sender',
        label: "Sender's address",
        align: 'left',
        sample: 'C-79, Luangmual,\nAizawl – 796009',
        note: 'Still top-left. This block survives; the receiver\'s address does not.',
      },
      { id: 'date', label: 'Date', align: 'left', sample: '22 September 2026', note: 'Below the address.' },
      {
        id: 'salutation',
        label: 'Salutation (by name)',
        align: 'left',
        sample: 'My dear Lalrina,',
        note:
          '"Dear Lalrina," / "My dear brother," — a name or a relationship, never "Sir". Straight after the date: there is no receiver\'s address and no subject line in a personal letter, and adding either is the single clearest sign the candidate has memorised only one format.',
      },
      {
        id: 'opening',
        label: 'Opening courtesy',
        align: 'left',
        sample: 'I hope this letter finds you and everyone at home in good health. It has been nearly a year since we last met.',
        note: 'One or two sentences of warmth before the business of the letter. In a formal letter this would be padding; here its absence is the fault.',
      },
      {
        id: 'body',
        label: 'Body — the actual message',
        align: 'left',
        sample:
          '¶ The invitation / advice / news, with concrete detail: what, when, why it matters to them.',
        note:
          'Contractions ("I\'m", "don\'t"), questions, and a conversational rhythm are correct here and wrong in a formal letter. The register is half the marks.',
      },
      {
        id: 'closing-wish',
        label: 'Closing wish / regards',
        align: 'left',
        sample: 'Do convey my regards to uncle and aunt. Write back and let me know what you decide.',
        note: 'Regards to the family, and an invitation to reply. Formal letters never do this.',
      },
      {
        id: 'close',
        label: 'Subscription',
        align: 'left',
        sample: 'Yours affectionately,',
        note:
          '"Yours affectionately" / "Yours lovingly" / "With love" for family; "Yours sincerely" for a friend you are slightly formal with. Never "Yours faithfully" — that is for strangers.',
      },
      { id: 'signature', label: 'First name only', align: 'left', sample: 'XYZ', note: 'First name. No designation, no signature line, no address repeated.' },
    ],
    openers: [
      'I hope this letter finds you and everyone at home in good health.',
      'It was such a pleasure to receive your letter after so long.',
      'I have been meaning to write to you ever since I heard the news.',
    ],
    closes: ['Yours affectionately,', 'Yours lovingly,', 'With love,', 'Yours sincerely,'],
    example: `C-79, Luangmual,
Aizawl – 796009

22 September 2026

My dear Lalrina,

I hope this letter finds you and everyone at home in good health. It has
been nearly a year since you last visited us, and your aunt asks about you
almost every week.

I am writing with an invitation. The winter here is the best season for
travelling, and I would like you to spend a fortnight with us in December.
There is a great deal I want you to see. We could drive to Reiek for the
view over the valley, spend a day at Vantawng Falls near Thenzawl, and take
the boat out at Tamdil. If you can stay a little longer, Champhai and the
Myanmar border road are worth the journey on their own.

Do let me know your dates early so that I can apply for leave. Convey my
regards to uncle and aunt, and write back soon.

Yours affectionately,
XYZ`,
    mistakes: [
      'Adding a subject line. Personal letters have none — this is the most reliable way to lose format marks here.',
      "Writing the receiver's address. You are not posting this to an office.",
      '"Yours faithfully" to your own brother.',
      'Formal register throughout ("I wish to bring to your kind notice") — the tone is itself being marked.',
    ],
  },
];

// ---------------------------------------------------------------------------
// Convention drills — the pairings that are pure memory, and cost marks
// individually: which close goes with which salutation, which blocks belong
// to which letter type.
// ---------------------------------------------------------------------------

export interface ConventionDrill {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explain: string;
}

export const conventionDrills: ConventionDrill[] = [
  {
    id: 'cv-1',
    question: 'You opened a letter with "Sir,". Which complimentary close is correct?',
    options: ['Yours faithfully,', 'Yours sincerely,', 'Yours affectionately,', 'Your\'s truly,'],
    answer: 0,
    explain:
      'Faithfully pairs with an unnamed addressee (Sir / Madam). Sincerely pairs with a name (Dear Mr. Lalthanga). "Your\'s" is never correct in any register — there is no apostrophe in the possessive "yours".',
  },
  {
    id: 'cv-2',
    question: 'You opened with "Dear Mr. Lalthanga,". Which close is correct?',
    options: ['Yours sincerely,', 'Yours faithfully,', 'Yours truly,', 'Respectfully yours,'],
    answer: 0,
    explain:
      'Name in the salutation → "Yours sincerely". The rule is worth memorising as a pair: no name = faithfully, name = sincerely.',
  },
  {
    id: 'cv-3',
    question: 'Which block does an informal letter NOT have?',
    options: ["Subject line", "Sender's address", 'Date', 'Salutation'],
    answer: 0,
    explain:
      'A personal letter has no subject line and no receiver\'s address. It keeps the sender\'s address, the date, the salutation, the body and the subscription. Adding a subject line to a letter to your brother is the clearest sign of a memorised-one-format answer.',
  },
  {
    id: 'cv-4',
    question: 'In an official letter, how should the receiver be addressed?',
    options: [
      'The Director, Department of Horticulture, Government of Mizoram',
      'Mr. Lalthanga, Director of Horticulture',
      'Dear Director Sir',
      'To Whomsoever It May Concern',
    ],
    answer: 0,
    explain:
      'Address the post, not the person: designation → department → government → place. Office-holders change; the post does not. "To Whomsoever It May Concern" is for certificates, not letters with a known addressee.',
  },
  {
    id: 'cv-5',
    question: 'A letter to the editor is distinguished from an ordinary complaint letter by —',
    options: [
      'the "through the columns of your esteemed daily" framing',
      'the absence of a subject line',
      'being addressed to a named journalist',
      'using "Yours affectionately"',
    ],
    answer: 0,
    explain:
      'The route is the format: you write to the paper so that the authorities and the public read it. Without that sentence the answer is a complaint letter that happens to be addressed to an editor. It keeps its subject line, is addressed to "The Editor", and closes "Yours truly" or "Yours faithfully".',
  },
  {
    id: 'cv-6',
    question: 'The question says "signing yourself as XYZ of ABC Locality". What do you sign?',
    options: [
      'XYZ, of ABC Locality — exactly as instructed',
      'Your own name and address',
      'Nothing; leave the signature blank',
      'A made-up name of your own choosing',
    ],
    answer: 0,
    explain:
      'That phrasing is an instruction, not a suggestion — MPSC papers use it precisely so answers stay anonymous. Signing your real name in an exam answer is a genuine risk; inventing a different name ignores a direct instruction.',
  },
  {
    id: 'cv-7',
    question: 'Where does the enclosures list go in a job application?',
    options: [
      'Numbered, at the very bottom, below the signature',
      'In the subject line',
      'Immediately after the salutation',
      'Inside the last body paragraph as prose',
    ],
    answer: 0,
    explain:
      'Below the signature, numbered. When a question says "Attach your complete resume", this block is the mark for it — and it is the easiest mark in the letter to forget.',
  },
  {
    id: 'cv-8',
    question: 'In which letter type is a numbered list in the middle of the body correct?',
    options: [
      'A business order letter',
      'A letter to the editor',
      'An informal letter to a friend',
      'None — letters are always continuous prose',
    ],
    answer: 0,
    explain:
      'An order letter lists items with quantities; that list *is* the format. Everywhere else, prose. When the task says "at least six items", the examiner counts the lines.',
  },
  {
    id: 'cv-9',
    question: 'What belongs in the third (last) paragraph of a formal complaint or request?',
    options: [
      'The specific action you want, and by when',
      'A summary of everything above',
      'Your qualifications',
      'An apology for troubling the officer',
    ],
    answer: 0,
    explain:
      'Purpose → facts → request. Weak answers state the problem beautifully and never actually ask for anything. "Kindly do the needful" is not an ask; "replacement or refund within fifteen days" is.',
  },
  {
    id: 'cv-10',
    question: 'How should the date be written?',
    options: ['22 September 2026', '22/09/26', '09-22-2026', 'Sept. 22nd, \'26'],
    answer: 0,
    explain:
      'Month in words removes the dd/mm versus mm/dd ambiguity entirely, and avoids abbreviations — which formal correspondence does not use. Place it one blank line below the sender\'s address.',
  },
  {
    id: 'cv-11',
    question: 'Which subject line is strongest?',
    options: [
      'Subject: Complaint regarding defective refrigerator supplied against Invoice No. QE/2026/1187.',
      'Subject: Complaint.',
      'Subject: Regarding a problem I am facing with a product purchased from your showroom recently.',
      'Subject: Urgent!!! Please read.',
    ],
    answer: 0,
    explain:
      'Name the thing and carry the reference number. Option B says nothing; C is a sentence, not a subject line; D is the register of a text message. The subject line is where the examiner reads your whole answer in three seconds.',
  },
  {
    id: 'cv-12',
    question: 'A business letter written on behalf of a firm uses which pronoun?',
    options: ['We', 'I', 'One', 'It'],
    answer: 0,
    explain:
      'Trade correspondence speaks for the firm: "we are pleased to place the following order". "I" is correct only when you write as a private individual.',
  },
  {
    id: 'cv-13',
    question: 'Which close is appropriate for a letter to your younger brother?',
    options: ['Yours affectionately,', 'Yours faithfully,', 'Yours truly,', 'Respectfully submitted,'],
    answer: 0,
    explain:
      '"Yours affectionately" / "Yours lovingly" / "With love" for family. "Yours faithfully" is for a stranger holding an office — using it on a sibling is a register error the examiner cannot miss.',
  },
  {
    id: 'cv-14',
    question: 'The block order of a formal letter is —',
    options: [
      "Sender's address → date → receiver → subject → salutation → body → close → signature",
      "Date → sender's address → salutation → subject → receiver → body → signature → close",
      "Receiver → sender's address → date → salutation → body → subject → close → signature",
      "Salutation → subject → sender's address → date → receiver → body → close → signature",
    ],
    answer: 0,
    explain:
      'Who is writing, when, to whom, about what, greeting, message, sign-off, name. Every formal type in this tab follows that spine — the job application and the complaint letter just add an enclosures block below the signature.',
  },
];

// ---------------------------------------------------------------------------
// PRÉCIS
// ---------------------------------------------------------------------------

export interface PrecisRule {
  id: string;
  rule: string;
  detail: string;
  /** Marks-losing version of the same thing. */
  violation?: string;
}

export const precisRules: PrecisRule[] = [
  {
    id: 'pr-length',
    rule: 'One-third of the original — count it, and state the count',
    detail:
      'MPSC papers ask for a précis "in about one-third of its original length" almost every time. A 292-word passage wants roughly 95–100 words; ±10% is safe. Count the passage in blocks of ten as you read it, and write your own word count in brackets at the end — it shows the examiner you obeyed the instruction.',
    violation: 'Half the original length. However good the prose, it is not a précis.',
  },
  {
    id: 'pr-title',
    rule: 'Always give a title — it is asked for, and separately marked',
    detail:
      '"…write a précis giving a suitable title" is the standard MPSC wording. Three to six words, a noun phrase, naming the subject — "Hospitality in the East", not "A passage about how hospitable people in Egypt are". Never a full sentence, never a question.',
    violation: 'No title at all — a whole sub-mark thrown away for one line of writing.',
  },
  {
    id: 'pr-person',
    rule: 'Third person, past tense, indirect speech',
    detail:
      'Whatever the passage does, your précis reports it from outside. "I" and "we" become "the writer"; "you" becomes "people" or "one". Direct speech becomes indirect. Present tense stays only for universal truths ("water boils at 100°C").',
    violation: 'Keeping the author\'s "I" — the précis then reads as a continuation of the passage, not a report of it.',
  },
  {
    id: 'pr-own-words',
    rule: 'Your own words — but keep the technical ones',
    detail:
      'Lifting whole sentences is the commonest failure. Reproduce the thought, not the phrasing. The exception is technical or untranslatable terms — "musafir", "photosynthesis", "one-third" — which you keep as they are, because replacing them would change the meaning.',
    violation: 'A précis stitched together from four sentences copied verbatim.',
  },
  {
    id: 'pr-one-para',
    rule: 'One continuous paragraph, no bullets, no headings',
    detail:
      'A précis is connected prose. No numbering, no sub-headings, no dashes, no "&", no abbreviations. It must read as something a person wrote, not as notes.',
    violation: 'Note-form answers — the content may be right and the format still fails.',
  },
  {
    id: 'pr-nothing-new',
    rule: 'Nothing enters that was not in the passage',
    detail:
      'No opinion of yours, no extra example, no conclusion the author did not draw. A précis is a compression, not a response. If you find yourself writing "This shows that we should…", delete it.',
    violation: 'A closing moral the passage never states.',
  },
  {
    id: 'pr-cut-list',
    rule: 'What always gets cut',
    detail:
      'Examples and illustrations ("for instance…", "such as…"), repetitions of a point already made, quotations, statistics that only illustrate, rhetorical questions, figures of speech, direct speech, the author\'s asides in brackets or dashes, and all intensifiers (very, really, quite, indeed).',
    violation: 'Keeping the vivid example and cutting the principle it was illustrating — the exact wrong way round.',
  },
  {
    id: 'pr-keep-list',
    rule: 'What always survives',
    detail:
      'The central idea, each distinct supporting point (once), the logical connectives that hold the argument together (however, therefore, because), and any qualification that changes the claim — "in the desert, however, a present is seldom received" is not an aside, it is an exception, and exceptions are content.',
  },
  {
    id: 'pr-method',
    rule: 'The method, in order',
    detail:
      'Read once for the sense. Read again marking the topic sentence of each paragraph. Count the words and fix your target. Write the points in a list, in the passage\'s own order. Turn the list into connected prose in your own words. Count. Trim or expand to hit the target. Add the title last, once you know what the thing actually says.',
  },
];

export interface CompressionMove {
  id: string;
  move: string;
  how: string;
  before: string;
  after: string;
}

/** The mechanical operations — this is the "how to shorten" the drills test. */
export const compressionMoves: CompressionMove[] = [
  {
    id: 'cm-clause',
    move: 'Clause → phrase',
    how: 'Any "who / which / that was…" can usually collapse into a phrase.',
    before: 'The man who was standing at the gate refused to let us in.',
    after: 'The man at the gate refused us entry.',
  },
  {
    id: 'cm-phrase',
    move: 'Phrase → single word',
    how: 'Long connectives and verb phrases have one-word equivalents. This is the highest-yield habit in the whole exercise.',
    before: 'In spite of the fact that he was tired, he continued to make an attempt.',
    after: 'Although tired, he persisted.',
  },
  {
    id: 'cm-one-word',
    move: 'Many words → one precise word',
    how: 'A definition in the passage is an invitation to use the word it defines.',
    before: 'a person who travels from place to place with no fixed home',
    after: 'a nomad',
  },
  {
    id: 'cm-example',
    move: 'Drop the illustration, keep the point',
    how: 'Anything after "for instance", "for example", "such as", ":" is usually illustration. Keep the claim it illustrates.',
    before:
      'Hospitality is deeply valued: a middle-class family in a quiet street will often eat supper at their door and invite every respectable passer-by to join them.',
    after: 'Hospitality is deeply valued at every social level.',
  },
  {
    id: 'cm-generalise',
    move: 'Generalise a list',
    how: 'Four items of a kind become the kind.',
    before: 'They grew apples, oranges, bananas, pineapples and grapes for the market.',
    after: 'They grew fruit for the market.',
  },
  {
    id: 'cm-merge',
    move: 'Merge parallel sentences',
    how: 'Two sentences making the same kind of point join with a comma or a semicolon and lose their repeated subject.',
    before: 'The benches are broken. The lighting has failed. The fence has collapsed.',
    after: 'The benches, lighting and fence are all in disrepair.',
  },
  {
    id: 'cm-speech',
    move: 'Direct speech → indirect',
    how: 'Drop the quotation marks, shift the tense back, change the pronouns.',
    before: '"I shall never return to this place," he said.',
    after: 'He said he would never return there.',
  },
  {
    id: 'cm-rhetorical',
    move: 'Rhetorical question → statement',
    how: 'A question the author does not expect answered is a claim in disguise. Write the claim.',
    before: 'Can anyone doubt that education shapes a nation?',
    after: 'Education undeniably shapes a nation.',
  },
  {
    id: 'cm-filler',
    move: 'Delete intensifiers and fillers',
    how: 'very, really, quite, indeed, actually, in fact, it may be said that, needless to say, as a matter of fact.',
    before: 'It may be said that this is, in fact, a very serious and really quite urgent problem.',
    after: 'This is a serious and urgent problem.',
  },
  {
    id: 'cm-voice',
    move: 'Passive → active',
    how: 'Active usually saves two or three words and names the actor.',
    before: 'It was decided by the committee that the scheme would be postponed.',
    after: 'The committee postponed the scheme.',
  },
  {
    id: 'cm-nominal',
    move: 'Un-nominalise — turn the noun back into a verb',
    how: '"make a decision" → "decide"; "give consideration to" → "consider"; "reach an agreement" → "agree".',
    before: 'The board gave careful consideration to the proposal and then made a decision to reject it.',
    after: 'The board considered the proposal and rejected it.',
  },
];

export interface PhrasePair {
  long: string;
  short: string;
}

/** Wordy phrase → one word. Pure memory, immediate payoff. */
export const wordyPhrases: PhrasePair[] = [
  { long: 'due to the fact that', short: 'because' },
  { long: 'in spite of the fact that', short: 'although' },
  { long: 'in the event that', short: 'if' },
  { long: 'at the present time / at this point in time', short: 'now' },
  { long: 'in the near future', short: 'soon' },
  { long: 'a large number of', short: 'many' },
  { long: 'the majority of', short: 'most' },
  { long: 'a small number of', short: 'few' },
  { long: 'in order to', short: 'to' },
  { long: 'for the purpose of', short: 'for' },
  { long: 'with regard to / in respect of', short: 'about' },
  { long: 'has the ability to', short: 'can' },
  { long: 'is in a position to', short: 'can' },
  { long: 'make a decision', short: 'decide' },
  { long: 'come to an agreement', short: 'agree' },
  { long: 'take into consideration', short: 'consider' },
  { long: 'put an end to', short: 'end' },
  { long: 'at all times', short: 'always' },
  { long: 'on a daily basis', short: 'daily' },
  { long: 'in the vicinity of', short: 'near' },
  { long: 'is of the opinion that', short: 'thinks' },
  { long: 'in the majority of instances', short: 'usually' },
  { long: 'prior to / in advance of', short: 'before' },
  { long: 'subsequent to', short: 'after' },
  { long: 'owing to the fact that', short: 'since' },
  { long: 'during the course of', short: 'during' },
  { long: 'in close proximity to', short: 'near' },
  { long: 'afford an opportunity to', short: 'allow' },
];

/** Many words → one word. The classic MPSC one-word-substitution set, chosen
 *  for the ones that actually turn up inside précis passages. */
export const oneWordSubs: PhrasePair[] = [
  { long: 'one who travels from place to place with no fixed home', short: 'nomad' },
  { long: 'a speech made without any preparation', short: 'impromptu' },
  { long: 'that which cannot be avoided', short: 'inevitable' },
  { long: 'that which cannot be believed', short: 'incredible' },
  { long: 'a person who knows many languages', short: 'polyglot' },
  { long: 'government by the people', short: 'democracy' },
  { long: 'one who loves mankind and works for its welfare', short: 'philanthropist' },
  { long: 'a supposed cure for all diseases', short: 'panacea' },
  { long: 'words written on a tomb', short: 'epitaph' },
  { long: 'a life history written by the person himself', short: 'autobiography' },
  { long: 'one who eats no meat', short: 'vegetarian' },
  { long: 'a place where orphans live', short: 'orphanage' },
  { long: 'the period between two reigns or governments', short: 'interregnum' },
  { long: 'a medicine that counteracts a poison', short: 'antidote' },
  { long: 'one who is indifferent to pleasure or pain', short: 'stoic' },
  { long: 'a person appointed to settle a dispute', short: 'arbitrator' },
  { long: 'something that happens at the same time as something else', short: 'simultaneous' },
  { long: 'a group of people travelling together across a desert', short: 'caravan' },
];

// ---------------------------------------------------------------------------
// One fully worked précis, on a real passage.
//
// Source: MPSC, Mizoram Group 'B' (Gazetted) General Services (Combined
// Competitive) Examinations, July-2024, General English, Q.1 (14 marks) —
// "Read the passage below and write a précis giving a suitable title."
// Passage reproduced from the paper's OCR text in the Old_Questions corpus.
// ---------------------------------------------------------------------------

export interface WorkedCut {
  cut: string;
  why: string;
}

export const workedPrecis = {
  source:
    "MPSC, Group 'B' (Gazetted) Combined Competitive Examination, July 2024 — General English, Q.1 (14 marks)",
  instruction: 'Read the passage below and write a précis giving a suitable title.',
  passage: `Hospitality is a virtue for which the natives of the East in general are highly and deservedly admired; and the people of Egypt are well entitled to commendation on this account. A word which signifies literally "a person on a journey" ("musafir") is the term most commonly employed in this country in the sense of a visitor or guest. There are very few persons here who would think of sitting down to a meal, if there were a stranger in the house without inviting him to partake of it unless the latter were a menial; in which case, he would be invited to eat with the servants. It would be considered a shameful violation of good manners if a Muslim abstained from ordering the table to be prepared at the usual time because a visitor happened to be present. Persons of the middle classes in this country, if living in a retired situation, sometimes take their supper before the door of their house, and invite every passenger of respectable appearance to eat with them. This is very commonly done among the lower order. In cities and large towns, claims on hospitality are unfrequent; as there are many wekalehs, or khans, where strangers may obtain lodging; and food is very easily procured; but in the villages, travellers are often lodged and entertained by the Sheykh or some other inhabitant; and if the guest be a person of the middle or higher classes, or even not very poor he gives a present to his host's servants, or to the host himself. In the desert, however, a present is seldom received from a guest. By a Sunneh law, a traveller may claim entertainment from a person able to afford it to him, for three days.`,
  passageWords: 292,
  target: '≈ 97 words (one-third of 292). Anything from 88 to 107 is safely inside tolerance.',

  /** Step 2 of the method: the topic points, in the passage's own order. */
  points: [
    'Easterners, and Egyptians particularly, are admired for hospitality.',
    'Their ordinary word for a guest means literally "a traveller".',
    'Almost nobody eats in front of a stranger without inviting him.',
    'Delaying a meal because a guest is present would be shameful.',
    'Middle and poorer families eat at their doors and invite respectable passers-by.',
    'Towns need hospitality less — lodging and food are available there.',
    'In villages the headman or another inhabitant lodges travellers.',
    'Guests who can afford it give a present — but seldom in the desert.',
    'Religious law entitles a traveller to three days of entertainment.',
  ],

  /** Step 3: everything that went, and why. This is the part worth studying. */
  cuts: [
    {
      cut: '"highly and deservedly admired", "well entitled to commendation on this account"',
      why: 'Two ways of saying the same thing. Repetition is the first cut, always — keep one, in fewer words: "rightly admired".',
    },
    {
      cut: '("musafir") and "signifies literally \'a person on a journey\'"',
      why: 'The foreign word itself is an illustration of the point, not the point. The point is that their ordinary word for a guest means "traveller" — keep the meaning, drop the transliteration.',
    },
    {
      cut: '"unless the latter were a menial; in which case, he would be invited to eat with the servants"',
      why: 'A subordinate qualification about an edge case. It does not change the central claim, and at one-third length there is no room for edge cases.',
    },
    {
      cut: '"if living in a retired situation", "of respectable appearance"',
      why: 'Descriptive colour. "Respectable" is worth two words if you have them; "in a retired situation" is not.',
    },
    {
      cut: '"there are many wekalehs, or khans, where strangers may obtain lodging; and food is very easily procured"',
      why: 'The *reason* towns need less hospitality can compress to four words: "lodging and food are available". The named institutions are illustration.',
    },
    {
      cut: '"the Sheykh or some other inhabitant" → "the headman or another villager"',
      why: 'Not a cut but a substitution — a term the examiner will read at speed, with the sense preserved.',
    },
    {
      cut: '"by a Sunneh law"',
      why: 'Compressed to "religious law". The precise name is a detail; the fact that law, not mere custom, guarantees three days is the content.',
    },
  ] as WorkedCut[],

  /** What must NOT be cut, and why people cut it anyway. */
  keeps: [
    '"In the desert, however, a present is seldom received" — this looks like an aside and is actually an exception. Exceptions are content; cutting one changes the claim from "usually, except in the desert" to "always".',
    '"for three days" — a number that limits a right is never decoration.',
    '"however", "but", "than" — the connectives. Cut them and the précis becomes a list of facts instead of an argument.',
  ],

  precis: `Hospitality is a virtue Easterners, and Egyptians especially, are rightly admired for. Their word for a visitor means simply a traveller, and few would eat before a stranger without inviting him to share the meal; to delay a meal because a guest was present would be thought disgraceful. Poorer and middle-class families often eat at their doors, inviting respectable passers-by. Such claims arise less in towns, where lodging and food are easily had, than in villages, where the headman or another inhabitant lodges travellers, the better-off leaving a present, though seldom in the desert. Religious law entitles a traveller three days' entertainment.`,
  precisWords: 102,
  title: 'Hospitality in the East',

  titleRejects: [
    { title: 'Hospitality', why: 'True but empty — it names the topic without naming the passage. A title should be three to six words.' },
    {
      title: 'A passage describing how hospitable the people of Egypt are to travellers',
      why: 'A sentence, not a title. It also describes the passage rather than its subject ("a passage describing…" is never a title).',
    },
    { title: 'Why Should We Be Hospitable?', why: 'A question, and one the passage never asks. Titles do not editorialise.' },
    { title: 'The Guest as Traveller', why: 'Elegant, but it captures one sentence of nine points — a title must cover the whole.' },
  ],
};

// ---------------------------------------------------------------------------
// The core drill: choose the correct shortening. One original sentence,
// four candidate compressions, one right. The explanation says why each
// wrong one fails, because the failure modes are the syllabus here.
// ---------------------------------------------------------------------------

export interface PrecisDrill {
  id: string;
  /** Which compressionMove this tests — used for the topic filter. */
  skill: string;
  original: string;
  options: string[];
  answer: number;
  explain: string;
  /** Parallel to options; the entry at `answer` is ''. */
  whyWrong: string[];
}

export const precisDrills: PrecisDrill[] = [
  {
    id: 'pd-1',
    skill: 'Phrase → word',
    original:
      'In spite of the fact that the weather was extremely unfavourable, the villagers continued to make an attempt to repair the road.',
    options: [
      'Despite the bad weather, the villagers kept trying to repair the road.',
      'Although the weather was very unfavourable indeed, the villagers still continued in their attempts at repairing the road.',
      'The villagers repaired the road.',
      'Bad weather. Villagers — road repair attempts continued.',
    ],
    answer: 0,
    explain:
      '"In spite of the fact that" → "despite"; "continued to make an attempt" → "kept trying". 21 words become 12 with nothing lost.',
    whyWrong: [
      '',
      'Barely shorter — it swaps one long connective for another and keeps "very…indeed". A précis that saves four words out of twenty-one is not a précis.',
      'Too short: it deletes the obstacle (the weather) and the fact that the repair was only attempted, not achieved. Compression must not become falsification.',
      'Note form. A précis is continuous prose — no dashes, no telegraphic fragments, however few words they use.',
    ],
  },
  {
    id: 'pd-2',
    skill: 'Drop the illustration',
    original:
      'Reading widens the mind in a way nothing else can. A boy in a village who has never left his district may, through books, walk the streets of London, cross the Sahara, or stand on the deck of a whaling ship.',
    options: [
      'Reading widens the mind as nothing else can, carrying even the most isolated reader far beyond his own surroundings.',
      'Reading widens the mind. A village boy can visit London, cross the Sahara and stand on a whaling ship through books.',
      'Reading widens the mind in a way that nothing else is able to widen it.',
      'Books about London, the Sahara and whaling ships are good for village boys.',
    ],
    answer: 0,
    explain:
      'The second sentence is one long illustration of the first. Keep the claim, compress the illustration into its own point — "beyond his own surroundings" — and the whole thing halves.',
    whyWrong: [
      '',
      'Keeps all three examples. Examples are the first thing a précis sacrifices; here they are three-quarters of the words.',
      'Keeps only the claim and pads it. The illustration carried real information — that reading reaches people who cannot travel — and that is lost.',
      'Inverts the passage. The subject is reading, not a recommendation about village boys. This is the worst failure: it changes what was said.',
    ],
  },
  {
    id: 'pd-3',
    skill: 'Direct → indirect speech',
    original:
      '"I shall never again trust a man who breaks his word to me twice," the old merchant declared angrily.',
    options: [
      'The old merchant declared that he would never again trust a man who broke his word twice.',
      '"I shall never trust such a man again," the old merchant said.',
      'The old merchant angrily declared that he shall never again trust a man who breaks his word to him twice.',
      'The old merchant was very angry about being cheated twice by someone he trusted.',
    ],
    answer: 0,
    explain:
      'Quotation marks go, "shall" shifts to "would", "I" becomes "he", "to me" becomes unnecessary. Précis is always reported, never quoted.',
    whyWrong: [
      '',
      'Still direct speech. Shortening a quotation does not convert it — the quotation marks themselves are the format error.',
      'Half-converted: it reports the speech but leaves the tense unshifted ("shall…breaks"). Indirect speech in the past requires "would…broke".',
      'Adds a fact that is not in the original — nothing says he was cheated, only that a promise was broken. Never introduce information.',
    ],
  },
  {
    id: 'pd-4',
    skill: 'Rhetorical question → statement',
    original:
      'Can anyone seriously maintain that a nation which neglects its teachers will be well governed a generation later?',
    options: [
      'A nation that neglects its teachers cannot expect to be well governed a generation later.',
      'Is it possible for a country that ignores teachers to be governed well after a generation?',
      'Nobody can seriously maintain anything at all about how nations will be governed.',
      'Teachers are the most important people in any nation.',
    ],
    answer: 0,
    explain:
      'A rhetorical question is a claim wearing a question mark. Write the claim. "Can anyone maintain that X?" means "X is not so".',
    whyWrong: [
      '',
      'Still a question, merely reworded. The format error survives the paraphrase.',
      'Misreads the rhetoric as genuine scepticism. The author is asserting something, not doubting everything.',
      'An opinion the passage did not state, and a stronger one than it implied. Précis adds nothing.',
    ],
  },
  {
    id: 'pd-5',
    skill: 'Clause → phrase',
    original:
      'The committee, which had been appointed by the government in the month of March, submitted a report which ran to more than four hundred pages.',
    options: [
      'The committee appointed by the government in March submitted a report of over four hundred pages.',
      'The committee that the government had appointed in March gave in its report, and that report was more than four hundred pages in length.',
      'A government committee wrote a long report.',
      'In March the government appointed a committee. It submitted a report. The report was over 400 pages.',
    ],
    answer: 0,
    explain:
      'Both "which" clauses collapse: "which had been appointed" → "appointed"; "which ran to more than four hundred pages" → "of over four hundred pages". 24 words → 15.',
    whyWrong: [
      '',
      'Keeps both relative clauses and adds a second main clause. Longer than the original in feel, barely shorter in count.',
      'Loses the month and the figure. "Long" is not "four hundred pages" — précis drops illustrations, not facts.',
      'Three choppy sentences where one will do, plus "400" — a précis uses no figures in numeral shorthand and no note-style fragmentation.',
    ],
  },
  {
    id: 'pd-6',
    skill: 'Generalise a list',
    original:
      'The valley produced oranges, bananas, pineapples, passion fruit and grapes in such quantity that the markets of the plains depended on it.',
    options: [
      'The valley produced so much fruit that the markets of the plains depended on it.',
      'The valley produced oranges, bananas, pineapples, passion fruit and grapes, on which the plains markets depended.',
      'The valley produced fruit.',
      'The valley was the most important fruit-growing region in the country.',
    ],
    answer: 0,
    explain:
      'Five items of one kind become the kind. The information that matters is the quantity and the dependence, not the species list.',
    whyWrong: [
      '',
      'Keeps the whole list and saves four words. Lists are exactly what generalisation exists for.',
      'Drops the two things the sentence was actually about: the scale of production and the plains\' dependence on it.',
      'Upgrades "the plains markets depended on it" into "most important in the country" — a bigger claim than the original made.',
    ],
  },
  {
    id: 'pd-7',
    skill: 'Un-nominalise',
    original:
      'After giving careful consideration to all the objections that had been raised, the board arrived at a decision to postpone the implementation of the scheme.',
    options: [
      'Having considered all the objections, the board postponed the scheme.',
      'After carefully considering all of the objections that had been raised, the board decided that it would postpone implementing the scheme.',
      'The board postponed the scheme.',
      'The board rejected the scheme because of the objections raised against it.',
    ],
    answer: 0,
    explain:
      '"give consideration to" → "consider", "arrive at a decision to postpone" → "postpone", "the implementation of the scheme" → "the scheme". 24 words → 10.',
    whyWrong: [
      '',
      'Un-nominalises one phrase and leaves the other ("decided that it would postpone implementing"). Half the saving, all of the clutter.',
      'Drops the deliberation entirely — that the board weighed objections first is part of what the sentence reports.',
      'Postponed is not rejected. The commonest way a compression goes wrong is by strengthening a verb.',
    ],
  },
  {
    id: 'pd-8',
    skill: 'Cut fillers',
    original:
      'It may be said that this is, in fact, a very serious problem, and one which is, needless to say, really quite urgent as well.',
    options: [
      'This is a serious and urgent problem.',
      'It may be said that this is a serious problem which is also urgent.',
      'This problem is very serious and really urgent.',
      'This is possibly a serious problem and may perhaps be urgent.',
    ],
    answer: 0,
    explain:
      'Every word of hedging and intensification here carries no information: "it may be said that", "in fact", "very", "needless to say", "really quite", "as well". 24 words → 6.',
    whyWrong: [
      '',
      'Keeps the emptiest phrase in the sentence. "It may be said that" is the first thing to delete, not the last.',
      'Keeps "very" and "really" — intensifiers go, without exception.',
      'Introduces doubt ("possibly", "may perhaps") the original did not have. The hedges in the original were verbal tics, not qualifications.',
    ],
  },
  {
    id: 'pd-9',
    skill: 'Passive → active',
    original:
      'It was decided by the district authorities that the distribution of relief material would be carried out by the village councils.',
    options: [
      'The district authorities decided that village councils would distribute relief material.',
      'It was decided that relief material would be distributed by village councils.',
      'Village councils distributed relief material.',
      'The district authorities gave relief material to the village councils.',
    ],
    answer: 0,
    explain:
      'Two passives, two actors named, twenty words → eleven. Active voice is shorter and tells you who did what — both of which a précis wants.',
    whyWrong: [
      '',
      'Deletes the decider. "It was decided" leaves the district authorities out of a sentence that was about them.',
      'Turns a decision into an accomplished fact. The passage reports a decision, not a distribution.',
      'A different event. Deciding who will distribute is not handing over the material.',
    ],
  },
  {
    id: 'pd-10',
    skill: 'Many words → one word',
    original:
      'He was the kind of man who travels from place to place without ever settling in a fixed home, and he spoke a great number of languages fluently.',
    options: [
      'He was a nomad and a fluent polyglot.',
      'He was a man who moved from place to place without settling anywhere, and who could speak many languages well.',
      'He travelled a lot and knew languages.',
      'He was a homeless man who could speak several languages.',
    ],
    answer: 0,
    explain:
      'Twenty-seven words reduce to eight because English already has the words: "nomad" and "polyglot". A definition sitting in a passage is an invitation to use the word it defines.',
    whyWrong: [
      '',
      'A faithful paraphrase that saves almost nothing. This is the most common near-miss in précis work.',
      'Vague to the point of losing content — "knew languages" is not "spoke many languages fluently".',
      '"Nomad" and "homeless" are not synonyms. A nomad has no fixed home by way of life; a homeless man has none by misfortune.',
    ],
  },
  {
    id: 'pd-11',
    skill: 'Merge parallel sentences',
    original:
      'The benches in the park are broken. The lighting has failed completely. The boundary fence has collapsed along the southern side.',
    options: [
      "The park's benches, lighting and southern fence are all in disrepair.",
      'The benches are broken, the lighting has failed, and the fence has collapsed on the south side.',
      'The park is badly maintained.',
      'The park is in ruins and cannot be used by anyone at all.',
    ],
    answer: 0,
    explain:
      'Three sentences making the same kind of point become one list with a shared predicate. Twenty words → ten, and all three facts survive.',
    whyWrong: [
      '',
      'Merges the sentences but keeps all three predicates. Better than the original; not the best available compression.',
      'Loses all three specifics. In a passage about a park, what exactly has failed is the content.',
      'Exaggerates. "In disrepair" is what the passage supports; "in ruins and unusable by anyone" is not.',
    ],
  },
  {
    id: 'pd-12',
    skill: 'Third person, no opinion',
    original:
      'I have always believed, and I say this after thirty years in the classroom, that no reform of education can succeed unless it begins with the teacher.',
    options: [
      'The writer, after thirty years of teaching, holds that educational reform must begin with the teacher.',
      'I have always believed that no reform of education can succeed unless it begins with the teacher.',
      'The writer believes reform must begin with the teacher, and he is quite right about this.',
      'Educational reform never succeeds.',
    ],
    answer: 0,
    explain:
      'The author\'s "I" becomes "the writer"; the thirty years stay, because they are the ground of the claim, not decoration.',
    whyWrong: [
      '',
      'Keeps the first person. A précis reports the passage from outside it.',
      'Adds the précis-writer\'s agreement. Your opinion never enters, not even approvingly.',
      'Drops the whole condition ("unless it begins with the teacher") and turns a qualified claim into a flat one.',
    ],
  },
  {
    id: 'pd-13',
    skill: 'Keep the exception',
    original:
      'Guests of the middling and better sort usually leave a present for their host or his servants. In the desert, however, a present is seldom received from a guest.',
    options: [
      'Better-off guests usually leave a present, though seldom in the desert.',
      'Guests usually leave a present for their host.',
      'Guests of the middling and better sort leave a present with the host or his servants, but this is not the case in the desert where presents are seldom received.',
      'Guests never give presents in the desert.',
    ],
    answer: 0,
    explain:
      '"However" marks an exception, and exceptions are content, not decoration. Compressing to eleven words while keeping both halves is the whole skill.',
    whyWrong: [
      '',
      'Deletes the exception, which changes "usually, except in the desert" into "always". This is the single most expensive cut in précis work.',
      'Keeps everything, saves nothing. Faithful is not the same as compressed.',
      '"Seldom" is not "never". Shortening must not sharpen.',
    ],
  },
  {
    id: 'pd-14',
    skill: 'Drop the illustration',
    original:
      'The monsoon dominates Indian agriculture completely. If it arrives in the first week of June, the rice transplanting in the eastern districts goes ahead on time; if it is ten days late, the same fields lie dry and the entire cropping calendar slips.',
    options: [
      'The monsoon dominates Indian agriculture: even ten days\' delay disrupts the whole cropping calendar.',
      'The monsoon dominates Indian agriculture. Rice transplanting in the eastern districts depends on whether it arrives in the first week of June or ten days later.',
      'The monsoon dominates Indian agriculture.',
      'Indian agriculture would be better off with irrigation than with dependence on the monsoon.',
    ],
    answer: 0,
    explain:
      'The rice-transplanting sentence is an illustration, but it carries one fact worth keeping — the smallness of the margin. Keep the claim plus the force of the example; drop its furniture.',
    whyWrong: [
      '',
      'Keeps the illustration nearly intact, including the districts and the crop, and saves barely a fifth.',
      'Drops the illustration *and* what it proved. The passage was showing how narrow the margin is; a bare claim loses that.',
      'A recommendation the passage never made. Précis never prescribes.',
    ],
  },
  {
    id: 'pd-15',
    skill: 'Phrase → word',
    original:
      'Owing to the fact that a large number of applicants had submitted their forms prior to the closing date, the office was in a position to complete the scrutiny at the present time.',
    options: [
      'Since many applicants applied before the closing date, the office could complete the scrutiny now.',
      'Because a large number of applicants had submitted forms before the closing date, the office was able to complete the scrutiny at this time.',
      'The office completed the scrutiny.',
      'The office finished early because everyone applied on time.',
    ],
    answer: 0,
    explain:
      'Four stock phrases, four one-word equivalents: owing to the fact that → since; a large number of → many; prior to → before; was in a position to → could; at the present time → now. 32 words → 15.',
    whyWrong: [
      '',
      'Fixes two of the four and leaves "a large number of" and "at this time". Half-done compression is the usual exam answer.',
      'Loses the cause entirely — and the sentence was mostly about the cause.',
      '"Everyone" is not "a large number", and "finished early" is not "could complete now". Two meaning changes in nine words.',
    ],
  },
  {
    id: 'pd-16',
    skill: 'Cut repetition',
    original:
      'The scheme was a failure. It did not achieve what it had set out to achieve. Its objectives remained unfulfilled from beginning to end.',
    options: [
      'The scheme failed entirely to achieve its objectives.',
      'The scheme was a failure, did not achieve what it set out to achieve, and left its objectives unfulfilled.',
      'The scheme was a failure.',
      'The scheme failed because its objectives were badly designed.',
    ],
    answer: 0,
    explain:
      'Three sentences saying one thing. Keep the thing, keep the emphasis ("entirely"), drop the other two. 23 words → 8.',
    whyWrong: [
      '',
      'Preserves all three restatements in a single sentence — the repetition is still there, merely re-punctuated.',
      'Loses "objectives" and the completeness of the failure, which the triple statement existed to convey.',
      'Supplies a reason the passage never gave. Never explain on the author\'s behalf.',
    ],
  },
  {
    id: 'pd-17',
    skill: 'Third person, no opinion',
    original:
      'You must remember that you cannot expect your children to read if you yourself never open a book in their presence.',
    options: [
      'Children cannot be expected to read if their parents never read in front of them.',
      'You cannot expect your children to read if you never open a book yourself.',
      'Parents who do not read are failing their children badly.',
      'Children learn to read by watching their parents.',
    ],
    answer: 0,
    explain:
      'Second person becomes third: "you" → "parents", "your children" → "children". The claim is unchanged; only the stance moves outside the passage.',
    whyWrong: [
      '',
      'Still second person, and barely shorter.',
      'Adds a judgement ("failing their children badly") the passage did not make.',
      'Changes the claim: the original is about expectation and example, not about the mechanism by which reading is learnt.',
    ],
  },
  {
    id: 'pd-18',
    skill: 'Keep the qualification',
    original:
      'Except in the hill districts, where the terrain makes it impracticable, the scheme has been extended to every block in the state.',
    options: [
      'The scheme covers every block except in the hill districts, where the terrain makes it impracticable.',
      'The scheme has been extended to every block in the state.',
      'The scheme covers every block in the state, apart from a few places.',
      'The hill districts have been unfairly excluded from the scheme.',
    ],
    answer: 0,
    explain:
      'Only five words are saved here, and that is correct — this sentence is nearly all content. Not every sentence compresses by two-thirds; the budget is spent across the passage, not evenly.',
    whyWrong: [
      '',
      'Deletes the exception, turning a qualified statement into a false one. This is the most damaging single error available in a précis.',
      '"A few places" loses both which places and why — the terrain is the reason the exception exists.',
      'Imports an accusation. "Impracticable terrain" is a reason, not an injustice.',
    ],
  },
  {
    id: 'pd-19',
    skill: 'Merge parallel sentences',
    original:
      'Coal is found in Jharkhand. Iron ore is mined in Odisha. Bauxite deposits occur in Chhattisgarh. All three states depend heavily on mineral revenue.',
    options: [
      'Jharkhand, Odisha and Chhattisgarh yield coal, iron ore and bauxite respectively, and all depend heavily on mineral revenue.',
      'Coal, iron ore and bauxite are found in eastern India, where states depend on mineral revenue.',
      'Three eastern states mine minerals and depend on the revenue.',
      'Jharkhand, Odisha and Chhattisgarh are the richest mineral states in India.',
    ],
    answer: 0,
    explain:
      '"Respectively" is the précis-writer\'s friend: it merges three paired facts into one clause without losing a single pairing. 24 words → 18, with nothing dropped.',
    whyWrong: [
      '',
      'Loses which mineral belongs to which state — the pairing was the information.',
      'Loses both the states and the minerals. Almost all the content has gone to save six words.',
      'A ranking the passage never asserted.',
    ],
  },
  {
    id: 'pd-20',
    skill: 'Cut the aside',
    original:
      'The library — a handsome building, incidentally, put up in 1904 by a merchant whose name nobody now remembers — had not been repaired for thirty years.',
    options: [
      'The library, built in 1904, had not been repaired for thirty years.',
      'The library, a handsome building put up in 1904 by a forgotten merchant, had not been repaired for thirty years.',
      'The library had not been repaired for thirty years.',
      'The library was a fine old building that had fallen into neglect.',
    ],
    answer: 0,
    explain:
      'Everything between the dashes is the author stepping aside. The date survives because it establishes the building\'s age against thirty years of neglect; the merchant and the adjective do not.',
    whyWrong: [
      '',
      'Keeps the aside, merely tidied. "Incidentally" is the author telling you this can be cut.',
      'Defensible, but it loses the date — and the contrast between a building of 1904 and thirty years without repair is part of the point.',
      'Vague. "Fallen into neglect" is not "not repaired for thirty years": a specific fact replaced by an impression.',
    ],
  },
  {
    id: 'pd-21',
    skill: 'Cut the quotation',
    original:
      'As Bacon observed, "Reading maketh a full man; conference a ready man; and writing an exact man." The point is that different activities train different capacities.',
    options: [
      'Different activities train different capacities: reading, discussion and writing each develop a distinct one.',
      'As Bacon said, reading makes a full man, conference a ready man and writing an exact man, which shows different activities train different capacities.',
      'Bacon said that reading, conference and writing are all valuable.',
      'Different activities train different capacities.',
    ],
    answer: 0,
    explain:
      'Quotations go — but the substance inside them may not. Here the three-way distinction is the content and the attribution is not; keep the distinction, drop Bacon and the quotation marks.',
    whyWrong: [
      '',
      'Reproduces the quotation almost verbatim and attributes it. Quotations are never carried into a précis.',
      'Keeps the attribution and loses the distinction — exactly the wrong half.',
      'Keeps only the abstract claim. The three named activities were the evidence for it and cost only six words.',
    ],
  },
  {
    id: 'pd-22',
    skill: 'Whole-paragraph compression',
    original:
      'There are people who say that the age of adventure is over — that every mountain has been climbed, every river traced to its source, every desert crossed. They forget that adventure is not a matter of geography at all. It is a temper of mind, and a man may show it in a laboratory, a hospital ward, or an argument he is losing, as fully as on any ice-field.',
    options: [
      'Those who think adventure is over because the world has been explored forget that adventure is a temper of mind, shown as readily in a laboratory or a hospital as on an ice-field.',
      'Some people say the age of adventure is over because every mountain has been climbed, every river traced and every desert crossed. But adventure is a temper of mind, not geography, and can be shown in a laboratory, a hospital ward or an argument as much as on an ice-field.',
      'Adventure is a temper of mind, not a matter of geography.',
      'The age of adventure is not over, because there are still many places left to explore.',
    ],
    answer: 0,
    explain:
      'Sixty-eight words to thirty-two. The three explored-places examples generalise to "the world has been explored"; the three modern examples keep two, since they carry the argument\'s actual claim.',
    whyWrong: [
      '',
      'Keeps all six examples. Faithful, well written, and about twice the length a précis allows.',
      'Keeps the thesis and discards the objection it answers. A passage structured as "people say X… they forget Y" loses its shape if X goes.',
      'Contradicts the passage, which concedes that the geography is exhausted and relocates adventure to the mind.',
    ],
  },
];

// ---------------------------------------------------------------------------
// Keep or cut — a fast binary drill on single sentences. Faster than the
// four-option drill, and it trains the one judgement précis actually rests on.
// ---------------------------------------------------------------------------

export interface KeepCutDrill {
  id: string;
  sentence: string;
  /** true = keep (compressed), false = cut entirely. */
  keep: boolean;
  why: string;
}

export const keepCutDrills: KeepCutDrill[] = [
  {
    id: 'kc-1',
    sentence: 'Hospitality is a virtue for which the natives of the East in general are highly and deservedly admired.',
    keep: true,
    why: 'The central idea of the whole passage. Everything else in it exists to support this sentence.',
  },
  {
    id: 'kc-2',
    sentence: 'A word which signifies literally "a person on a journey" ("musafir") is the term most commonly employed here for a guest.',
    keep: true,
    why: 'Keep the point in compressed form — "their word for a guest means simply a traveller" — but drop the transliteration. The idea survives; the illustration of it does not.',
  },
  {
    id: 'kc-3',
    sentence: '…unless the latter were a menial; in which case, he would be invited to eat with the servants.',
    keep: false,
    why: 'A subordinate edge case that does not alter the main claim. At one-third length there is no budget for edge cases — unlike a genuine exception, cutting this changes nothing.',
  },
  {
    id: 'kc-4',
    sentence: 'In the desert, however, a present is seldom received from a guest.',
    keep: true,
    why: 'Looks like an aside, is actually an exception. Cut it and "guests usually give a present" becomes unqualified — a statement the passage does not make.',
  },
  {
    id: 'kc-5',
    sentence: 'By a Sunneh law, a traveller may claim entertainment from a person able to afford it, for three days.',
    keep: true,
    why: 'Compress to "religious law entitles a traveller to three days\' entertainment". A number that limits a right is never decoration.',
  },
  {
    id: 'kc-6',
    sentence: 'For instance, I remember a farmer in my own village who walked eleven miles to the dispensary and found it shut.',
    keep: false,
    why: '"For instance" plus a personal anecdote — illustration twice over. Whatever point it illustrated is the thing to keep.',
  },
  {
    id: 'kc-7',
    sentence: 'It may not be out of place here to observe that the question is a complicated one.',
    keep: false,
    why: 'Pure throat-clearing. "It may not be out of place to observe" is filler, and "the question is complicated" asserts nothing specific.',
  },
  {
    id: 'kc-8',
    sentence: 'The scheme therefore failed, and with it the credibility of the department that had promoted it.',
    keep: true,
    why: '"Therefore" marks a conclusion, and the second half is a distinct consequence, not a repetition. Both survive.',
  },
  {
    id: 'kc-9',
    sentence: 'Is there a man alive who has not, at some hour, envied the birds their wings?',
    keep: false,
    why: 'A rhetorical flourish. If it carries a claim, state the claim plainly; here it carries only mood, and mood is not content.',
  },
  {
    id: 'kc-10',
    sentence: 'Rainfall in the district fell from 2,400 mm in 1990 to 1,650 mm in 2020.',
    keep: true,
    why: 'Figures that establish a trend are content. You may compress them ("rainfall fell by almost a third in thirty years") but you may not drop them.',
  },
  {
    id: 'kc-11',
    sentence: 'As the poet has beautifully put it, "the child is father of the man".',
    keep: false,
    why: 'A quotation used ornamentally. Quotations never enter a précis; if the idea matters, express it in your own words without the attribution.',
  },
  {
    id: 'kc-12',
    sentence: 'Except in the hill blocks, where the terrain makes it impracticable, the scheme now covers the whole state.',
    keep: true,
    why: 'An exception with its reason attached. Both halves are load-bearing — drop either and the statement becomes false.',
  },
  {
    id: 'kc-13',
    sentence: 'The building, which is incidentally rather handsome, stands at the end of the road.',
    keep: false,
    why: '"Incidentally" is the author conceding this is beside the point. Take the concession. (If the location matters elsewhere, keep only "the building at the end of the road".)',
  },
  {
    id: 'kc-14',
    sentence: 'The same argument was advanced, in almost the same words, by the previous committee in 2011.',
    keep: true,
    why: 'Not a repetition by the author but a *statement about* repetition — that the argument is old and has been made before. That is new information.',
  },
];

// ---------------------------------------------------------------------------
// Title drill — separately marked on every MPSC précis question, and the
// cheapest mark in the paper to lose.
// ---------------------------------------------------------------------------

export interface TitleDrill {
  id: string;
  gist: string;
  options: string[];
  answer: number;
  explain: string;
}

export const titleDrills: TitleDrill[] = [
  {
    id: 'td-1',
    gist:
      'A passage arguing that the monsoon\'s timing, not its total quantity, governs Indian agriculture, with a delay of ten days enough to wreck a cropping calendar.',
    options: [
      'The Timing of the Monsoon',
      'Rain',
      'A Passage About How the Monsoon Affects Farmers in India',
      'Should India Depend on the Monsoon?',
    ],
    answer: 0,
    explain:
      'Three to six words, a noun phrase, naming what the passage is actually about — the timing, not rain in general. B is the topic without the passage; C describes the passage instead of its subject and is a sentence; D asks a question the passage never raises.',
  },
  {
    id: 'td-2',
    gist:
      'A passage on how education has always been controlled by whoever held power — the Church, then monarchs, then the merchant class after the Industrial Revolution.',
    options: [
      'Education and the Ruling Class',
      'The History of Education',
      'Education Has Always Been Controlled by Those in Power Throughout History',
      'Why Education Matters',
    ],
    answer: 0,
    explain:
      'The passage is about a relationship, and the title should name both halves of it. B is too broad (the passage is not a history of education in general); C is a full sentence; D names neither the argument nor its subject.',
  },
  {
    id: 'td-3',
    gist:
      'A passage claiming that adventure has not disappeared with the exploration of the world, because it is a quality of mind rather than of geography.',
    options: [
      'Adventure as a Temper of Mind',
      'Adventure',
      'Explorers of the Past and Present',
      'Is the Age of Adventure Over?',
    ],
    answer: 0,
    explain:
      'It captures the passage\'s actual move — relocating adventure from geography to mind. C describes the objection the passage answers, not its thesis; D is a question, and one the passage answers rather than asks.',
  },
  {
    id: 'td-4',
    gist:
      'A passage describing the hospitality of the East, guest customs in Egyptian towns and villages, and the three-day entitlement under religious law.',
    options: [
      'Hospitality in the East',
      'Egyptian Village Life',
      'The Guest Who Is Called a Traveller',
      'Hospitality: A Virtue for Which the Natives of the East Are Admired',
    ],
    answer: 0,
    explain:
      'Covers the whole passage in four words. B narrows it to one section; C is elegant but captures a single sentence; D lifts the opening line verbatim — a title is written, not copied.',
  },
  {
    id: 'td-5',
    gist:
      'A passage on why public libraries in small towns are closing, and what is lost when they do.',
    options: [
      'The Decline of the Small-Town Library',
      'Libraries',
      'Books and Reading in Modern Life',
      'Save Our Libraries!',
    ],
    answer: 0,
    explain:
      'Names the subject and the movement. C is a different, larger topic; D is an exhortation — a title reports the passage, it does not campaign on its behalf.',
  },
  {
    id: 'td-6',
    gist:
      'A passage arguing that no reform of education can succeed unless it begins with improving the position and training of teachers.',
    options: [
      'Reform Must Begin with the Teacher',
      'Teachers',
      'The Problems Faced by Teachers in Our Education System Today',
      'Education Reform in India',
    ],
    answer: 0,
    explain:
      'States the passage\'s claim compactly. C is a sentence-length description of a related but different topic; D names the field without the argument — and the argument is the passage.',
  },
];

export const totalLetterFormats = letterFormats.length;
export const totalPrecisDrills = precisDrills.length + keepCutDrills.length + titleDrills.length;
