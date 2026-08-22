import type { BankQuestion, QuestionBank } from './types';

// ============================================
// ASSISTANT CONTROLLER OF MINES 2026 — QUESTION BANK
//
// Source: "ASSISTANT CONTROLLER OF MINES - 2026" marked answer key HTML
// (166 questions: 66 General English Part-B + 100 General Studies).
//
// GENERATED FILE — do not hand-edit. Re-run tools/assistant-controller-of-mines/
// parse.py then build_bank.py to reproduce.
//
// PROVENANCE — read before trusting these as authoritative: the source
// document is a "Marked Answer Key" but contains its own leaked reasoning
// trace (e.g. GS Q33: "Wait, the provided key array... Let's fix this to
// match the key exactly"), which means it was authored by an LLM working
// from a described key, not transcribed from a real MPSC-published PDF.
// `answerSource` is 'derived' throughout for exactly that reason — there is
// no independently-verifiable "official" key behind this bank, unlike the
// state-tax-officer bank's answerKeyRef-bearing records.
//
// Three questions (English Q9, GS Q33, GS Q67) had two answer blocks in the
// source, the first superseded by an inline editorial correction — this
// bank carries only the corrected (second) answer, per tools/assistant-
// controller-of-mines/parse.py. GS Q67 additionally carries a disputeNote:
// its own correction left an unresolved contradiction ("32 tunnels" vs.
// printed options "44-47") that no amount of "let's fix this" resolves.
//
// Topics are assigned by NUMBER RANGE within each section (no per-question
// topic label exists in the source) — see build_bank.py's RANGE tables.
// ============================================

export const assistantControllerOfMines2026Questions: BankQuestion[] = [
  {
    id: "acom26-parts-of-speech-001",
    type: "mcq",
    subject: "english",
    topic: "parts-of-speech",
    topicLabel: "Parts of Speech & Word Classes",
    difficulty: "medium",
    question: "In the sentence, \"The regional committee met __weekly__ to review the mining lease applications,\" what part of speech is the word 'weekly'?",
    options: [
      "Adjective",
      "Adverb",
      "Noun",
      "Conjunction"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) Adverb.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-parts-of-speech-002",
    type: "mcq",
    subject: "english",
    topic: "parts-of-speech",
    topicLabel: "Parts of Speech & Word Classes",
    difficulty: "medium",
    question: "In the sentence, \"We must find a __fast__ solution to the slope stability issue before the monsoon begins,\" what part of speech is the word 'fast'?",
    options: [
      "Adjective",
      "Adverb",
      "Verb",
      "Noun"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) Adjective.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-parts-of-speech-003",
    type: "mcq",
    subject: "english",
    topic: "parts-of-speech",
    topicLabel: "Parts of Speech & Word Classes",
    difficulty: "medium",
    question: "In the sentence, \"The surveyor walked __past__ the boundary pillar without noticing the structural damage,\" what part of speech is the word 'past'?",
    options: [
      "Adverb",
      "Noun",
      "Preposition",
      "Verb"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Preposition.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-parts-of-speech-004",
    type: "mcq",
    subject: "english",
    topic: "parts-of-speech",
    topicLabel: "Parts of Speech & Word Classes",
    difficulty: "medium",
    question: "In the sentence, \"The department decided to __house__ the new core samples in the main laboratory,\" what part of speech is the word 'house'?",
    options: [
      "Noun",
      "Adjective",
      "Verb",
      "Preposition"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Verb.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-parts-of-speech-005",
    type: "mcq",
    subject: "english",
    topic: "parts-of-speech",
    topicLabel: "Parts of Speech & Word Classes",
    difficulty: "medium",
    question: "In the sentence, \"__Neither__ the operator nor the safety engineer cleared the quarry site for blasting,\" what part of speech is the word 'neither'?",
    options: [
      "Conjunction",
      "Pronoun",
      "Adjective",
      "Adverb"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) Conjunction.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-parts-of-speech-006",
    type: "mcq",
    subject: "english",
    topic: "parts-of-speech",
    topicLabel: "Parts of Speech & Word Classes",
    difficulty: "medium",
    question: "In which of the following sentences is the word \"iron\" used as an adjective?",
    options: [
      "The miners extracted high-grade iron from the structural belt.",
      "You need to iron out the discrepancies in the annual mineral report.",
      "The safety inspector wore an iron helmet during the field audit.",
      "Iron is a vital resource for heavy industrial manufacturing."
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) The safety inspector wore an iron helmet during the field audit..",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-parts-of-speech-007",
    type: "mcq",
    subject: "english",
    topic: "parts-of-speech",
    topicLabel: "Parts of Speech & Word Classes",
    difficulty: "medium",
    question: "In which of the following sentences is the word \"before\" used as a subordinating conjunction?",
    options: [
      "I have visited the Tlawng river quarry before.",
      "The candidate stood before the selection board for his interview.",
      "Clean the core drill thoroughly before you store it in the shed.",
      "The administration issued the warning two days before."
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Clean the core drill thoroughly before you store it in the shed..",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-parts-of-speech-008",
    type: "mcq",
    subject: "english",
    topic: "parts-of-speech",
    topicLabel: "Parts of Speech & Word Classes",
    difficulty: "medium",
    question: "Read the sentence: \"The team completed the environmental audit fairly quickly.\" What does the adverb \"fairly\" modify?",
    options: [
      "The noun \"audit\"",
      "The verb \"completed\"",
      "The adverb \"quickly\"",
      "The adjective \"environmental\""
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) The adverb \"quickly\".",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-parts-of-speech-009",
    type: "mcq",
    subject: "english",
    topic: "parts-of-speech",
    topicLabel: "Parts of Speech & Word Classes",
    difficulty: "medium",
    question: "In the sentence, \"Both plans look operationally viable, but the second one is safer,\" the word \"Both\" functions as a/an:",
    options: [
      "Adjective",
      "Pronoun",
      "Conjunction",
      "Verb"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) Adjective.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-parts-of-speech-010",
    type: "mcq",
    subject: "english",
    topic: "parts-of-speech",
    topicLabel: "Parts of Speech & Word Classes",
    difficulty: "medium",
    question: "In the sentence, \"The local administration handled the public protest politely yet firmly,\" the word \"politely\" is an:",
    options: [
      "Adverb of Time",
      "Adverb of Degree",
      "Adverb of Manner",
      "Adverb of Place"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Adverb of Manner.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-error-spotting-001",
    type: "mcq",
    subject: "english",
    topic: "error-spotting",
    topicLabel: "Spotting Errors",
    difficulty: "medium",
    question: "\"The newly appointed inspector/(A)/handled the delicate border dispute /(B)/high professional and with absolute tact.\" /(C)",
    options: [
      "Segment (A) contains an incorrect adverb.",
      "Segment (B) contains an incorrect preposition.",
      "Segment (C) contains an incorrect use of adjective.",
      "No Error; the sentence is structurally perfect."
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Segment (C) contains an incorrect use of adjective..",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-error-spotting-002",
    type: "mcq",
    subject: "english",
    topic: "error-spotting",
    topicLabel: "Spotting Errors",
    difficulty: "medium",
    question: "\"The engineering team could not/(A)/operate the heavy core drill machinery/(B)/because it was running bad today.\" /(C)",
    options: [
      "Segment (A) contains a faulty modal verb.",
      "Segment (B) contains an incorrect compound noun.",
      "Segment (C) contains an incorrect use of adjective.",
      "No Error; the sentence is structurally perfect."
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Segment (C) contains an incorrect use of adjective..",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-error-spotting-003",
    type: "mcq",
    subject: "english",
    topic: "error-spotting",
    topicLabel: "Spotting Errors",
    difficulty: "medium",
    question: "The leaseholder complied / (A) / to all the statutory environmental rules /(B) / during the initial extraction phase./(C)",
    options: [
      "Segment (A) contains an incorrect past-participle structure.",
      "Segment (B) is incorrect because 'complied' requires the preposition 'with' instead of 'to'.\"",
      "Segment (C) contains a faulty temporal prepositional phrase.",
      "No Error; the sentence is structurally sound."
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) Segment (B) is incorrect because 'complied' requires the preposition 'with' instead of 'to'.\".",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-error-spotting-004",
    type: "mcq",
    subject: "english",
    topic: "error-spotting",
    topicLabel: "Spotting Errors",
    difficulty: "medium",
    question: "Between you and I, / (A) / the structural design of the stone-crushing unit/(B)/appears structurally flawed./(C)",
    options: [
      "Segment (A) contains an incorrect use of pronoun.",
      "Segment (B) contains an incorrect compound noun modifier.",
      "Segment (C) contains an incorrect adverbial modifier.",
      "No Error; the sentence is structurally sound."
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) Segment (A) contains an incorrect use of pronoun..",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-error-spotting-005",
    type: "mcq",
    subject: "english",
    topic: "error-spotting",
    topicLabel: "Spotting Errors",
    difficulty: "medium",
    question: "The sudden drop in mineral royalties /(A)/ will adverse affect/(B)/the development funds allocated to the local village council./(C)",
    options: [
      "Segment (A) contains an incorrect prepositional link.",
      "Segment (B) contains an incorrect use of adjective to modify the verb.",
      "Segment (C) contains a faulty passive construction.",
      "No Error; the sentence is structurally sound."
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) Segment (B) contains an incorrect use of adjective to modify the verb..",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-parts-of-speech-011",
    type: "mcq",
    subject: "english",
    topic: "parts-of-speech",
    topicLabel: "Parts of Speech & Word Classes",
    difficulty: "medium",
    question: "In the sentence, \"The department issued a __formal__ notice to the leaseholder,\" what category of adjective is the word 'formal'?",
    options: [
      "Adjective of Quality",
      "Demonstrative Adjective",
      "Distributive Adjective",
      "Quantitative Adjective"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) Adjective of Quality.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-parts-of-speech-012",
    type: "mcq",
    subject: "english",
    topic: "parts-of-speech",
    topicLabel: "Parts of Speech & Word Classes",
    difficulty: "medium",
    question: "In the sentence, \"The field office is located __near__ the active quarry site,\" what part of speech is the word 'near'?",
    options: [
      "Conjunction",
      "Preposition",
      "Verb",
      "Adverb"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) Preposition.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-parts-of-speech-013",
    type: "mcq",
    subject: "english",
    topic: "parts-of-speech",
    topicLabel: "Parts of Speech & Word Classes",
    difficulty: "medium",
    question: "In the sentence, \"The extraction process was __extremely__ chaotic due to unscientific planning,\" what does the adverb 'extremely' modify?",
    options: [
      "The noun \"process\"",
      "The verb \"was\"",
      "The adjective \"chaotic\"",
      "The noun \"planning\""
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) The adjective \"chaotic\".",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-parts-of-speech-014",
    type: "mcq",
    subject: "english",
    topic: "parts-of-speech",
    topicLabel: "Parts of Speech & Word Classes",
    difficulty: "medium",
    question: "Which of the target words in the choices below functions as a Gerund?",
    options: [
      "The inspector is 'checking' the transport passes at the border checkpost.",
      "'Blasting' requires a valid statutory permit from the mining controller.",
      "The 'shattered' shale layers made structural drilling highly unpredictable.",
      "She will be 'running' the drone volumetric survey tomorrow morning."
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) 'Blasting' requires a valid statutory permit from the mining controller..",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-parts-of-speech-015",
    type: "mcq",
    subject: "english",
    topic: "parts-of-speech",
    topicLabel: "Parts of Speech & Word Classes",
    difficulty: "medium",
    question: "In the sentence, \"The Assistant Controller found '__few__' errors in the structural design blueprint,\" the word 'few' is a/an",
    options: [
      "Indefinite Pronoun",
      "Adjective of Quantity",
      "Adverb of Degree",
      "Demonstrative Adjective"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) Adjective of Quantity.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-parts-of-speech-016",
    type: "mcq",
    subject: "english",
    topic: "parts-of-speech",
    topicLabel: "Parts of Speech & Word Classes",
    difficulty: "medium",
    question: "In the sentence, \"The heavy dumpers move __slowly__ along the steep hill paths,\" the word 'slowly' is an:",
    options: [
      "Adverb of Time",
      "Adverb of Degree",
      "Adverb of Manner",
      "Adverb of Place"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Adverb of Manner.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-parts-of-speech-017",
    type: "mcq",
    subject: "english",
    topic: "parts-of-speech",
    topicLabel: "Parts of Speech & Word Classes",
    difficulty: "medium",
    question: "In the sentence, \"The village council raised concerns __about__ the heavy dust pollution,\" what is the structural function of the word 'about'?",
    options: [
      "It modifies the verb \"raised\" as an adverb.",
      "It connects the noun phrase \"the heavy dust pollution\" to the rest of the sentence as a preposition.",
      "It links two independent clauses as a coordinating conjunction.",
      "It stands alone as an abstract naming word."
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) It connects the noun phrase \"the heavy dust pollution\" to the rest of the sentence as a preposition..",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-parts-of-speech-018",
    type: "mcq",
    subject: "english",
    topic: "parts-of-speech",
    topicLabel: "Parts of Speech & Word Classes",
    difficulty: "medium",
    question: "In the sentence, \"The safety parameters must be checked __daily__ by the site engineers,\" the word 'daily' functions as an:",
    options: [
      "Adjective of Quality",
      "Adverb of Frequency",
      "Noun of Time",
      "Coordinating Conjunction"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) Adverb of Frequency.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-parts-of-speech-019",
    type: "mcq",
    subject: "english",
    topic: "parts-of-speech",
    topicLabel: "Parts of Speech & Word Classes",
    difficulty: "medium",
    question: "In the sentence, \"The heavy rain caused the soil overburden to liquefy, __so__ the operations were suspended,\" the word 'so' is a/an:",
    options: [
      "Adverb of Degree",
      "Preposition of Reason",
      "Coordinating Conjunction",
      "Abstract Noun"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Coordinating Conjunction.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-parts-of-speech-020",
    type: "mcq",
    subject: "english",
    topic: "parts-of-speech",
    topicLabel: "Parts of Speech & Word Classes",
    difficulty: "medium",
    question: "In the sentence, \"The leaseholder must submit __each__ of the monthly extraction logs by Friday,\" the word 'each' functions as a/an:",
    options: [
      "Distributive Adjective",
      "Distributive Pronoun",
      "Adverb of Frequency",
      "Relative Pronoun"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) Distributive Pronoun.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-word-transformation-001",
    type: "mcq",
    subject: "english",
    topic: "word-transformation",
    topicLabel: "Word Transformation",
    difficulty: "medium",
    question: "She faced the approaching army __bravely__. (to Noun)",
    options: [
      "She faced the approaching army in a brave way",
      "She faced the approaching army with bravery",
      "She faced the approaching army with braveness",
      "She bravely faced the approaching army"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) She faced the approaching army with bravery.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-word-transformation-002",
    type: "mcq",
    subject: "english",
    topic: "word-transformation",
    topicLabel: "Word Transformation",
    difficulty: "medium",
    question: "I do not think I have the __strength__ to continue. (to Adjective)",
    options: [
      "I do not think I am strengthened enough to continue",
      "I do not think I can continue strongly",
      "I do not think I am strong enough to continue",
      "I do not think I have the strongness to continue"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) I do not think I am strong enough to continue.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-word-transformation-003",
    type: "mcq",
    subject: "english",
    topic: "word-transformation",
    topicLabel: "Word Transformation",
    difficulty: "medium",
    question: "He offered me a __proposal__ to deal directly with the suppliers. (to Verb)",
    options: [
      "He proposed that we deal directly with the suppliers",
      "He offered me a proposal to deal directly with the suppliers",
      "He proposalled to deal directly with the suppliers",
      "He offered me a proposition to deal directly with the suppliers"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) He proposed that we deal directly with the suppliers.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-word-transformation-004",
    type: "mcq",
    subject: "english",
    topic: "word-transformation",
    topicLabel: "Word Transformation",
    difficulty: "medium",
    question: "She gave a __beautiful__ smile at the reporters. (to Adverb)",
    options: [
      "She gave a smile of great beauty at the reporters",
      "She gave a beauteous smile at the reporters",
      "She beauteously smiled at the reporters",
      "She smiled beautifully at the reporters"
    ],
    answerIndex: 3,
    explanation: "Marked correct in the source answer key: (d) She smiled beautifully at the reporters.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-word-transformation-005",
    type: "mcq",
    subject: "english",
    topic: "word-transformation",
    topicLabel: "Word Transformation",
    difficulty: "medium",
    question: "It is __true__ that I do not deserve her. (to Noun)",
    options: [
      "I truly do not deserve her",
      "It is truthful that I do not deserve her",
      "It is the truth that I do not deserve her",
      "I truthfully do not deserve her"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) It is the truth that I do not deserve her.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-parts-of-speech-021",
    type: "mcq",
    subject: "english",
    topic: "parts-of-speech",
    topicLabel: "Parts of Speech & Word Classes",
    difficulty: "medium",
    question: "Read the following sentence and choose the correct degree of the target word: \"Of all the heavy aggregate transport trucks deployed at the site, the new dumper runs the __most efficiently__.\"",
    options: [
      "Comparative Degree of an Adjective",
      "Positive Degree of an Adverb",
      "Superlative Degree of an Adjective",
      "Superlative Degree of an Adverb"
    ],
    answerIndex: 3,
    explanation: "Marked correct in the source answer key: (d) Superlative Degree of an Adverb.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-parts-of-speech-022",
    type: "mcq",
    subject: "english",
    topic: "parts-of-speech",
    topicLabel: "Parts of Speech & Word Classes",
    difficulty: "medium",
    question: "Read the following sentence and choose the correct class of the target pronoun: \"The safety engineer __who__ authorized the blasting operation has submitted his field log.\"",
    options: [
      "Relative Pronoun",
      "Interrogative Pronoun",
      "Demonstrative Pronoun",
      "Reflexive Pronoun"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) Relative Pronoun.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-parts-of-speech-023",
    type: "mcq",
    subject: "english",
    topic: "parts-of-speech",
    topicLabel: "Parts of Speech & Word Classes",
    difficulty: "medium",
    question: "Read the following sentence and choose the specific category of the target adverb: \"The Assistant Controller of Mines __seldom__ issues an immediate suspension notice without a prior written warning.\"",
    options: [
      "Adverb of Manner",
      "Adverb of Degree",
      "Adverb of Frequency",
      "Adverb of Place"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Adverb of Frequency.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-parts-of-speech-024",
    type: "mcq",
    subject: "english",
    topic: "parts-of-speech",
    topicLabel: "Parts of Speech & Word Classes",
    difficulty: "medium",
    question: "Read the following sentence and choose the correct degree of the target adjective: \"The technical committee concluded that this was the __most apparent__ structural violation recorded this year.\"",
    options: [
      "Positive Degree",
      "Comparative Degree",
      "Superlative Degree",
      "Absolute Indefinite Degree"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Superlative Degree.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-parts-of-speech-025",
    type: "mcq",
    subject: "english",
    topic: "parts-of-speech",
    topicLabel: "Parts of Speech & Word Classes",
    difficulty: "medium",
    question: "Read the following sentence and choose the specific category of the target adverb: \"The technical task force set up its portable laboratory testing equipment __there__, right next to the core drill unit.\"",
    options: [
      "Adverb of Place",
      "Adverb of Time",
      "Adverb of Manner",
      "Adverb of Certainty"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) Adverb of Place.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-vocabulary-fill-001",
    type: "mcq",
    subject: "english",
    topic: "vocabulary-fill",
    topicLabel: "Vocabulary: Fill in the Blank",
    difficulty: "medium",
    question: "Because the steep terrain makes physical inspection exceptionally difficult, the department must rely on drone surveys to ________ the exact boundaries of the remote mountain leases.",
    options: [
      "obfuscate",
      "delineate",
      "reciprocate",
      "condone"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) delineate.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-vocabulary-fill-002",
    type: "mcq",
    subject: "english",
    topic: "vocabulary-fill",
    topicLabel: "Vocabulary: Fill in the Blank",
    difficulty: "medium",
    question: "Rather than implementing permanent engineering modifications, the contractor offered only a ________ short-term fix to the crumbling retaining wall.",
    options: [
      "perennial",
      "makeshift",
      "definitive",
      "meticulous"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) makeshift.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-vocabulary-fill-003",
    type: "mcq",
    subject: "english",
    topic: "vocabulary-fill",
    topicLabel: "Vocabulary: Fill in the Blank",
    difficulty: "medium",
    question: "The revenue records showed a massive discrepancy, indicating that illegal transport networks had been systematically ________ state mineral royalties for years.",
    options: [
      "siphoning",
      "bolstering",
      "condensing",
      "exonerating"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) siphoning.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-vocabulary-fill-004",
    type: "mcq",
    subject: "english",
    topic: "vocabulary-fill",
    topicLabel: "Vocabulary: Fill in the Blank",
    difficulty: "medium",
    question: "To avoid unscientific extraction, the state's updated mineral master plan mandates a ________ approach that prioritizes long-term resource conservation over immediate profit.",
    options: [
      "reckless",
      "sporadic",
      "judicious",
      "dogmatic"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) judicious.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-vocabulary-fill-005",
    type: "mcq",
    subject: "english",
    topic: "vocabulary-fill",
    topicLabel: "Vocabulary: Fill in the Blank",
    difficulty: "medium",
    question: "The village council's written petition was highly ________, listing dozens of specific dates and environmental violations caused by the nearby crushing units.",
    options: [
      "ambiguous",
      "superficial",
      "articulate",
      "redundant"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) articulate.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-idioms-001",
    type: "mcq",
    subject: "english",
    topic: "idioms",
    topicLabel: "Idioms & Phrases",
    difficulty: "medium",
    question: "Bite off more than you can chew:",
    options: [
      "To try to do more than you can manage",
      "To excel beyond one's expectations",
      "to let go of things that no longer serve you",
      "to receive no acknowledgement for hard work"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) To try to do more than you can manage.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-idioms-002",
    type: "mcq",
    subject: "english",
    topic: "idioms",
    topicLabel: "Idioms & Phrases",
    difficulty: "medium",
    question: "To be under the weather:",
    options: [
      "To make yourself less noticeable",
      "To make enough money to be comfortable",
      "To feel ill or unwell",
      "To feel lonely or melancholy for no reason"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) To feel ill or unwell.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-idioms-003",
    type: "mcq",
    subject: "english",
    topic: "idioms",
    topicLabel: "Idioms & Phrases",
    difficulty: "medium",
    question: "To be in the red:",
    options: [
      "To be guilty of a crime",
      "To attract unwanted attention",
      "To be lucky all the time",
      "To be in financial debt"
    ],
    answerIndex: 3,
    explanation: "Marked correct in the source answer key: (d) To be in financial debt.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-idioms-004",
    type: "mcq",
    subject: "english",
    topic: "idioms",
    topicLabel: "Idioms & Phrases",
    difficulty: "medium",
    question: "A man of straw:",
    options: [
      "a person who is weak, or lacks substance",
      "a person who can adapt to all situations",
      "a person without wealth or assets",
      "a light-hearted person"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) a person who is weak, or lacks substance.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-idioms-005",
    type: "mcq",
    subject: "english",
    topic: "idioms",
    topicLabel: "Idioms & Phrases",
    difficulty: "medium",
    question: "to die in harness:",
    options: [
      "To leave behind a lot of debt after death",
      "To leave behind a lot of wealth after death",
      "To die peacefully with a clear conscience",
      "To die while in service"
    ],
    answerIndex: 3,
    explanation: "Marked correct in the source answer key: (d) To die while in service.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-idioms-006",
    type: "mcq",
    subject: "english",
    topic: "idioms",
    topicLabel: "Idioms & Phrases",
    difficulty: "medium",
    question: "A litmus test:",
    options: [
      "A decisive test that provides a clear answer",
      "A test that produces inconclusive results",
      "A test that is doomed to end in failure",
      "a test that heavily favours someone"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) A decisive test that provides a clear answer.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-one-word-sub-001",
    type: "mcq",
    subject: "english",
    topic: "one-word-sub",
    topicLabel: "One-Word Substitution",
    difficulty: "medium",
    question: "someone who completely abstains from drinking:",
    options: [
      "teeter-totter",
      "prohibitionist",
      "teetotaler",
      "abstentist"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) teetotaler.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-one-word-sub-002",
    type: "mcq",
    subject: "english",
    topic: "one-word-sub",
    topicLabel: "One-Word Substitution",
    difficulty: "medium",
    question: "a word or practice that has gone out of use:",
    options: [
      "obsolete",
      "obstreperous",
      "abolish",
      "admonish"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) obsolete.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-one-word-sub-003",
    type: "mcq",
    subject: "english",
    topic: "one-word-sub",
    topicLabel: "One-Word Substitution",
    difficulty: "medium",
    question: "to cause someone to be celebrated or remembered forever:",
    options: [
      "immolate",
      "mortarium",
      "memoriam",
      "immortalize"
    ],
    answerIndex: 3,
    explanation: "Marked correct in the source answer key: (d) immortalize.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-one-word-sub-004",
    type: "mcq",
    subject: "english",
    topic: "one-word-sub",
    topicLabel: "One-Word Substitution",
    difficulty: "medium",
    question: "a state where no law and order exists:",
    options: [
      "apocalyptic",
      "tyranny",
      "anarchy",
      "dysmorphia"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) anarchy.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-one-word-sub-005",
    type: "mcq",
    subject: "english",
    topic: "one-word-sub",
    topicLabel: "One-Word Substitution",
    difficulty: "medium",
    question: "a decision or opinion that is completely agreed upon by everyone in a group:",
    options: [
      "Eponymous",
      "Unanimous",
      "anonymous",
      "ubiquitous"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) Unanimous.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-antonyms-001",
    type: "mcq",
    subject: "english",
    topic: "antonyms",
    topicLabel: "Antonyms",
    difficulty: "medium",
    question: "Arbitrary (Antonym):",
    options: [
      "Random",
      "Rational",
      "unclear",
      "unique"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) Rational.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-antonyms-002",
    type: "mcq",
    subject: "english",
    topic: "antonyms",
    topicLabel: "Antonyms",
    difficulty: "medium",
    question: "Convivial (Antonym):",
    options: [
      "Illegal",
      "Friendly",
      "unsociable",
      "lawful"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) unsociable.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-antonyms-003",
    type: "mcq",
    subject: "english",
    topic: "antonyms",
    topicLabel: "Antonyms",
    difficulty: "medium",
    question: "Inevitable (Antonym):",
    options: [
      "Delible",
      "Avoidable",
      "edible",
      "recognizable"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) Avoidable.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-antonyms-004",
    type: "mcq",
    subject: "english",
    topic: "antonyms",
    topicLabel: "Antonyms",
    difficulty: "medium",
    question: "Erstwhile (Antonym):",
    options: [
      "Former",
      "Permanent",
      "momentary",
      "current"
    ],
    answerIndex: 3,
    explanation: "Marked correct in the source answer key: (d) current.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-antonyms-005",
    type: "mcq",
    subject: "english",
    topic: "antonyms",
    topicLabel: "Antonyms",
    difficulty: "medium",
    question: "Compel (Antonym):",
    options: [
      "Dissuade",
      "Request",
      "force",
      "deny"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) Dissuade.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-sentence-transformation-001",
    type: "mcq",
    subject: "english",
    topic: "sentence-transformation",
    topicLabel: "Sentence Transformation",
    difficulty: "medium",
    question: "It is very hot. One cannot go out. (use an infinitive)",
    options: [
      "Being hot, we cannot go out",
      "It is too hot to go out",
      "It is very hot, therefore, we cannot go out",
      "We cannot go out as it is hot"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) It is too hot to go out.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-sentence-transformation-002",
    type: "mcq",
    subject: "english",
    topic: "sentence-transformation",
    topicLabel: "Sentence Transformation",
    difficulty: "medium",
    question: "He passed the test. It was very fortunate. (use an Adverb)",
    options: [
      "Fortunately, he passed the test",
      "He passed the test with great fortune",
      "It was very fortunate that he passed the test",
      "He was to fortunate to not have passed the test"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) Fortunately, he passed the test.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-sentence-transformation-003",
    type: "mcq",
    subject: "english",
    topic: "sentence-transformation",
    topicLabel: "Sentence Transformation",
    difficulty: "medium",
    question: "John is my friend. He is a captain in the army. (use Noun phrase in apposition)",
    options: [
      "John is my friend who is a captain in the army",
      "A captain in the army, John is my friend",
      "John, my friend, is a captain in the army",
      "John is my friend as well as a captain in the army"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) John, my friend, is a captain in the army.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-sentence-transformation-004",
    type: "mcq",
    subject: "english",
    topic: "sentence-transformation",
    topicLabel: "Sentence Transformation",
    difficulty: "medium",
    question: "I have sold my cow. It was red in colour. (using adjective clause)",
    options: [
      "My cow, red in colour, was sold",
      "I have sold my red cow",
      "I have sold my cow which was red in colour",
      "I have sold a cow that is red"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) I have sold my cow which was red in colour.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-sentence-transformation-005",
    type: "mcq",
    subject: "english",
    topic: "sentence-transformation",
    topicLabel: "Sentence Transformation",
    difficulty: "medium",
    question: "Do what you like. Do not bother me. (use adversative conjunction)",
    options: [
      "Do what you like, but don't bother me",
      "Do what you like and don't bother me",
      "Do what you like, therefore don't bother me",
      "Do what you like or don't bother me"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) Do what you like, but don't bother me.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-correct-usage-001",
    type: "mcq",
    subject: "english",
    topic: "correct-usage",
    topicLabel: "Correct Usage",
    difficulty: "medium",
    question: "Which sentence correctly handles subject-verb agreement with compound structures?",
    options: [
      "Neither the field surveyor nor the structural engineers is satisfied with the stability of the opencast benches.",
      "Neither the field surveyor nor the structural engineers are satisfied with the stability of the opencast benches.",
      "Neither the field surveyor nor the structural engineers was satisfied with the stability of the opencast benches.",
      "Neither the field surveyor nor the structural engineers has been satisfied with the stability of the opencast benches."
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) Neither the field surveyor nor the structural engineers are satisfied with the stability of the opencast benches..",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-correct-usage-002",
    type: "mcq",
    subject: "english",
    topic: "correct-usage",
    topicLabel: "Correct Usage",
    difficulty: "medium",
    question: "Which sentence displays correct word usage regarding \"effect\" and \"affect\"?",
    options: [
      "The unscientific dumping of aggregate waste will adverse effect the local water table within a few months.",
      "The unscientific dumping of aggregate waste will adversely effect the local water table within a few months.",
      "The unscientific dumping of aggregate waste will adversely affect the local water table within a few months.",
      "The unscientific dumping of aggregate waste will have an adverse affect on the local water table within a few months."
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) The unscientific dumping of aggregate waste will adversely affect the local water table within a few months..",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-correct-usage-003",
    type: "mcq",
    subject: "english",
    topic: "correct-usage",
    topicLabel: "Correct Usage",
    difficulty: "medium",
    question: "Which sentence handles the relative pronouns \"who\" and \"whom\" correctly?",
    options: [
      "Whom did the technical committee appoint as the chief safety officer for the new sandstone project?",
      "Who did the technical committee appoint as the chief safety officer for the new sandstone project?",
      "To who did the technical committee hand over the confidential mining boundary blueprints?",
      "Whom was designated by the technical committee as the chief safety officer for the new sandstone project?"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) Whom did the technical committee appoint as the chief safety officer for the new sandstone project?.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-correct-usage-004",
    type: "mcq",
    subject: "english",
    topic: "correct-usage",
    topicLabel: "Correct Usage",
    difficulty: "medium",
    question: "Which sentence uses possessive punctuation flawlessly?",
    options: [
      "The three quarrys' common access road was heavily damaged by the overloaded transport dumpers.",
      "The three quarries' common access road was heavily damaged by the overloaded transport dumpers.",
      "The three quarry's common access road was heavily damaged by the overloaded transport dumpers.",
      "The three quarries common access road was heavily damaged by the overloaded transport dumpers."
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) The three quarries' common access road was heavily damaged by the overloaded transport dumpers..",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-correct-usage-005",
    type: "mcq",
    subject: "english",
    topic: "correct-usage",
    topicLabel: "Correct Usage",
    difficulty: "medium",
    question: "Which sentence showcases accurate use of tense?",
    options: [
      "When the inspector reached the drilling site, he discovered that the workers already fled the area.",
      "When the inspector reached the drilling site, he discovered that the workers had already fled the area.",
      "When the inspector reaches the drilling site, he discovered that the workers already fled the area.",
      "When the inspector reached the drilling site, he discovers that the workers had already fled the area."
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) When the inspector reached the drilling site, he discovered that the workers had already fled the area..",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-current-affairs-2026-001",
    type: "mcq",
    subject: "current-affairs",
    topic: "current-affairs-2026",
    topicLabel: "Current Affairs 2026",
    difficulty: "medium",
    question: "What is the theme for the International Literacy Day 2026?",
    options: [
      "\"Promoting literacy in the digital era\"",
      "\"Promoting multilingual education: Literacy for mutual understanding and peace\"",
      "\"SDGs and the promise of education\"",
      "\"Promoting literacy for a world in transition: Building the foundation for sustainable and peaceful societies\""
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) \"SDGs and the promise of education\".",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-current-affairs-2026-002",
    type: "mcq",
    subject: "current-affairs",
    topic: "current-affairs-2026",
    topicLabel: "Current Affairs 2026",
    difficulty: "medium",
    question: "Which country has launched Project Vault, a critical minerals stockpiling initiative?",
    options: [
      "United States",
      "Russia",
      "Germany",
      "China"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) United States.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-current-affairs-2026-003",
    type: "mcq",
    subject: "current-affairs",
    topic: "current-affairs-2026",
    topicLabel: "Current Affairs 2026",
    difficulty: "medium",
    question: "Which book won the 2026 International Booker Prize?",
    options: [
      "Taiwan Travelogue",
      "The Things We Never Say",
      "The New Wilderness",
      "The Shadow King"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) Taiwan Travelogue.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-current-affairs-2026-004",
    type: "mcq",
    subject: "current-affairs",
    topic: "current-affairs-2026",
    topicLabel: "Current Affairs 2026",
    difficulty: "medium",
    question: "Which is the first police unit in India to introduce an Al-powered multilingual feature in the Namma 112 emergency helpline?",
    options: [
      "Bengaluru Police",
      "Mumbai Police",
      "Delhi Police",
      "Chennai Police"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) Bengaluru Police.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-modern-indian-history-001",
    type: "mcq",
    subject: "history",
    topic: "modern-indian-history",
    topicLabel: "Modern Indian History",
    difficulty: "medium",
    question: "Which of the following is not a feature of the Government of India Act 1935?",
    options: [
      "Provisions for a federal court and a Reserve Bank of India",
      "Burma was separated from India with effect from April 1937",
      "The Act provided for a two-chambered federal legislature (Bicameral legislature)",
      "Britishers to be tried in Indian courts"
    ],
    answerIndex: 3,
    explanation: "Marked correct in the source answer key: (d) Britishers to be tried in Indian courts.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-modern-indian-history-002",
    type: "mcq",
    subject: "history",
    topic: "modern-indian-history",
    topicLabel: "Modern Indian History",
    difficulty: "medium",
    question: "Which Act is also known as Morley Minto Reforms?",
    options: [
      "Chartered Act of 1853",
      "Chartered Act of 1813",
      "Indian Councils Act 1909",
      "Government of India Act 1919"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Indian Councils Act 1909.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-modern-indian-history-003",
    type: "mcq",
    subject: "history",
    topic: "modern-indian-history",
    topicLabel: "Modern Indian History",
    difficulty: "medium",
    question: "Rani Gaidinliu raised the banner of rebellion against the British from:",
    options: [
      "Arunachal Pradesh",
      "Andhra Pradesh",
      "Nagaland",
      "Sikkim"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Nagaland.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-modern-indian-history-004",
    type: "mcq",
    subject: "history",
    topic: "modern-indian-history",
    topicLabel: "Modern Indian History",
    difficulty: "medium",
    question: "Which of the following were associated with Home Rule Movement?",
    options: [
      "BG Tilak and Annie Besant",
      "Bhagat Singh and Azad",
      "Bahadur Shah I",
      "SC Bose and Satyendra Nath Tagore"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) BG Tilak and Annie Besant.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-modern-indian-history-005",
    type: "mcq",
    subject: "history",
    topic: "modern-indian-history",
    topicLabel: "Modern Indian History",
    difficulty: "medium",
    question: "On which of the following occasions, Bombay was handed over to Britishers by the Portuguese?",
    options: [
      "The Treaty of Madrid in 1630",
      "Freedom of Portuguese from the control of Spain",
      "Marriage of Charles II with the Portuguese Princess Catherine of Braganza",
      "Crushing of Spanish Armada by British in 1588"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Marriage of Charles II with the Portuguese Princess Catherine of Braganza.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-modern-indian-history-006",
    type: "mcq",
    subject: "history",
    topic: "modern-indian-history",
    topicLabel: "Modern Indian History",
    difficulty: "medium",
    question: "Which of the following is correct regarding the second battle of Panipat?",
    options: [
      "It was fought in 21st April 1526",
      "It was fought between Hemu and Babur",
      "Hemu died in the battle",
      "The victory enabled Babur to lay the foundation for the Mughal Empire in India"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Hemu died in the battle.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-modern-indian-history-007",
    type: "mcq",
    subject: "history",
    topic: "modern-indian-history",
    topicLabel: "Modern Indian History",
    difficulty: "medium",
    question: "Who was the first President of the Indian National Congress (INC) in 1885?",
    options: [
      "Womesh Chunder Bonnerjee",
      "Dadabhai Naoroji",
      "Gopal Krishna Gokhale",
      "Surendranath Banerjee"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) Womesh Chunder Bonnerjee.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-modern-indian-history-008",
    type: "mcq",
    subject: "history",
    topic: "modern-indian-history",
    topicLabel: "Modern Indian History",
    difficulty: "medium",
    question: "Which among the following is the first English Newspaper in India?",
    options: [
      "The Times of India",
      "The Hindu",
      "Darpan",
      "Bengal Gazette"
    ],
    answerIndex: 3,
    explanation: "Marked correct in the source answer key: (d) Bengal Gazette.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-geography-001",
    type: "mcq",
    subject: "geography",
    topic: "geography",
    topicLabel: "Geography",
    difficulty: "medium",
    question: "Tropical cyclones in the Atlantic is also known as:",
    options: [
      "Typhoons",
      "Willy-willies",
      "Shrieking sixties",
      "Hurricanes"
    ],
    answerIndex: 3,
    explanation: "Marked correct in the source answer key: (d) Hurricanes.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-geography-002",
    type: "mcq",
    subject: "geography",
    topic: "geography",
    topicLabel: "Geography",
    difficulty: "medium",
    question: "Which of the following best describes Longitude?",
    options: [
      "The angular distance of a point on the Earth's surface, measured in degrees from the centre of the Earth.",
      "The angular distance, measured in degrees along the equator, east or west of the Prime Meridian.",
      "Geographic coordinate that specifies the north-south position of a point on the surface of the Earth.",
      "23 degrees 27 minutes north of the Equator."
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) The angular distance, measured in degrees along the equator, east or west of the Prime Meridian..",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-geography-003",
    type: "mcq",
    subject: "geography",
    topic: "geography",
    topicLabel: "Geography",
    difficulty: "medium",
    question: "Which among the Union Territories of India has the largest area?",
    options: [
      "Delhi",
      "Andaman & Nicobar Islands",
      "Ladakh",
      "Dadra & Nagar Haveli"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Ladakh.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-geography-004",
    type: "mcq",
    subject: "geography",
    topic: "geography",
    topicLabel: "Geography",
    difficulty: "medium",
    question: "The Arun river, Barun river and Tamur river make the part of which among the following river system?",
    options: [
      "Kosi river system",
      "Ganga river system",
      "Yamuna river system",
      "Brahmaputra river system"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) Kosi river system.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-geography-005",
    type: "mcq",
    subject: "geography",
    topic: "geography",
    topicLabel: "Geography",
    difficulty: "medium",
    question: "The most plausible explanation for the location of Thar Desert in western India is:",
    options: [
      "The obstruction caused by the Aravalis to the rain bearing wind that proceeds to the Ganga Valley.",
      "The absence of mountains to the north of Rajasthan to cause orographic rainfall in it.",
      "The evaporation of moisture by heat.",
      "The moisture carried by South-west monsoon is driven away by the dry upper air current."
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) The absence of mountains to the north of Rajasthan to cause orographic rainfall in it..",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-geography-006",
    type: "mcq",
    subject: "geography",
    topic: "geography",
    topicLabel: "Geography",
    difficulty: "medium",
    question: "Which of the following is not included in the basic requirement for formation of tropical cyclones?",
    options: [
      "Coriolis effect.",
      "Ocean water must be at least 27°C",
      "There should be relatively moist air in the mid-level of the troposphere.",
      "Mostly formed in and around the equator."
    ],
    answerIndex: 3,
    explanation: "Marked correct in the source answer key: (d) Mostly formed in and around the equator..",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-polity-constitution-001",
    type: "mcq",
    subject: "polity",
    topic: "polity-constitution",
    topicLabel: "Polity & Constitution",
    difficulty: "medium",
    question: "Which article of the Constitution of India deals with the administration and control of Scheduled areas and Scheduled Tribes?",
    options: [
      "222(1)",
      "223(2)",
      "244(1)",
      "245(1)"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) 244(1).",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-polity-constitution-002",
    type: "mcq",
    subject: "polity",
    topic: "polity-constitution",
    topicLabel: "Polity & Constitution",
    difficulty: "medium",
    question: "In the Constitution of India, promotion of international peace and security is mentioned in the:",
    options: [
      "Ninth Schedule",
      "Directive Principles of State Policy",
      "Preamble",
      "Fundamental Duties"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) Directive Principles of State Policy.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-polity-constitution-003",
    type: "mcq",
    subject: "polity",
    topic: "polity-constitution",
    topicLabel: "Polity & Constitution",
    difficulty: "medium",
    question: "The \"Sarkaria Commission\" is associated with which aspect of Indian Polity?",
    options: [
      "Centre-State Relation",
      "Election Reforms",
      "Judicial Appointments",
      "Panchayati Raj System"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) Centre-State Relation.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-polity-constitution-004",
    type: "mcq",
    subject: "polity",
    topic: "polity-constitution",
    topicLabel: "Polity & Constitution",
    difficulty: "medium",
    question: "Which of the following judgement stated that Secularism and Federalism are the basic features of the Indian Constitution?",
    options: [
      "Keshavananda Bharati case",
      "SR Bommai Case",
      "Indira Sawhney case",
      "Minerva Mills Case"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) SR Bommai Case.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-polity-constitution-005",
    type: "mcq",
    subject: "polity",
    topic: "polity-constitution",
    topicLabel: "Polity & Constitution",
    difficulty: "medium",
    question: "In which year was the Planning Commission converted into 'NITI Aayog'?",
    options: [
      "2015",
      "2016",
      "2017",
      "2018"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) 2015.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-polity-constitution-006",
    type: "mcq",
    subject: "polity",
    topic: "polity-constitution",
    topicLabel: "Polity & Constitution",
    difficulty: "medium",
    question: "Place the following Legislative Acts in chronological order. A. Lokpal and Lokayukta Act B. Consumer Protection Act C. Right to Information Act D. Right to Education Act Choose the correct answer from the following options.",
    options: [
      "A, B, C, D",
      "B, D, C, A",
      "B, C, D, A",
      "C, B, A, D"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) B, C, D, A.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-polity-constitution-007",
    type: "mcq",
    subject: "polity",
    topic: "polity-constitution",
    topicLabel: "Polity & Constitution",
    difficulty: "medium",
    question: "Which is the first Indian State to establish Lokayukta?",
    options: [
      "Uttar Pradesh",
      "Andhra Pradesh",
      "West Bengal",
      "Maharashtra"
    ],
    answerIndex: 3,
    explanation: "Marked correct in the source answer key: (d) Maharashtra.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-economy-001",
    type: "mcq",
    subject: "economics",
    topic: "economy",
    topicLabel: "Economy",
    difficulty: "medium",
    question: "RBI's function as the \"Lender of the last resort\" usually refers to which of the following? (i) Lending to trade and industry bodies when they fail to borrow from other sources. (ii) Providing liquidity to the banks having a temporary crisis. (iii) Lending to governments to finance budgetary deficits. Select the correct answer below.",
    options: [
      "(i) and (ii)",
      "(ii) only",
      "(ii) and (iii)",
      "(iii) only"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) (ii) only.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-economy-002",
    type: "mcq",
    subject: "economics",
    topic: "economy",
    topicLabel: "Economy",
    difficulty: "medium",
    question: "What is the revised collateral-free loan limit for Micro and Small Enterprises as increased by the RBI effective 1st April 2026?",
    options: [
      "10 lakh",
      "15 lakh",
      "20 lakh",
      "25 lakh"
    ],
    answerIndex: 3,
    explanation: "Marked correct in the source answer key: (d) 25 lakh.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-economy-003",
    type: "mcq",
    subject: "economics",
    topic: "economy",
    topicLabel: "Economy",
    difficulty: "medium",
    question: "Gini coefficient of Gini Ratio can be associated with which one of the following measurements in an economy?",
    options: [
      "Rate of inflation",
      "Poverty index",
      "Income inequality",
      "Personal income"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Income inequality.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-economy-004",
    type: "mcq",
    subject: "economics",
    topic: "economy",
    topicLabel: "Economy",
    difficulty: "medium",
    question: "Which of the following is/are true about Direct Taxes? (i) It is only borne by the person/organization to whom it is levied (ii) Direct taxes can be shifted to other person/organization (iii) Gift tax is an example of Direct tax Select the correct option below.",
    options: [
      "Only (i)",
      "Only (ii)",
      "Both (i) and (iii)",
      "Both (i) and (ii)"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Both (i) and (iii).",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-economy-005",
    type: "mcq",
    subject: "economics",
    topic: "economy",
    topicLabel: "Economy",
    difficulty: "medium",
    question: "Select the best description of \" Greenfield Investment\" among the following: (i) The entity or a government buys an existing plant or company or factory and no new factories are set up as existing units are taken over (ii) MNCs enter foreign countries to build new factories/stores (iii) Greenfield Projects involve building with existing infrastructure Select the correct answer from the above description:",
    options: [
      "Only (i)",
      "Only (ii)",
      "Only (iii)",
      "(i) and (iii) only"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) Only (ii).",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-economy-006",
    type: "mcq",
    subject: "economics",
    topic: "economy",
    topicLabel: "Economy",
    difficulty: "medium",
    question: "What rate is considered to be a \"replacement level\" rate in Total Fertility Rate?",
    options: [
      "1.9 births per woman",
      "1.8 births per woman",
      "2.1 births per woman",
      "2.4 births per woman"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) 2.1 births per woman.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-economy-007",
    type: "mcq",
    subject: "economics",
    topic: "economy",
    topicLabel: "Economy",
    difficulty: "medium",
    question: "Which of the following is correct about repo rate?",
    options: [
      "It is the rate at which RBI borrows funds from Commercial Banks in the country.",
      "Current repo rate as on April 2026 is 4.50%.",
      "It is the rate at which RBI provides short term funds to commercial banks against approved securities as collateral.",
      "The interest rate at which the central bank borrows surplus funds from the commercial banks thereby absorbing excess liquidity from the system."
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) It is the rate at which RBI provides short term funds to commercial banks against approved securities as collateral..",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-science-environment-001",
    type: "mcq",
    subject: "science",
    topic: "science-environment",
    topicLabel: "Science & Environment",
    difficulty: "medium",
    question: "Which country has become the first country to shift from anthropocentric approach to an eco-centric approach in international jurisprudence?",
    options: [
      "France",
      "India",
      "Bhutan",
      "USA"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) India.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-science-environment-002",
    type: "mcq",
    subject: "science",
    topic: "science-environment",
    topicLabel: "Science & Environment",
    difficulty: "medium",
    question: "In which layer of the atmosphere is the International Space Station orbiting the Earth?",
    options: [
      "Troposphere",
      "Stratosphere",
      "Mesosphere",
      "Thermosphere"
    ],
    answerIndex: 3,
    explanation: "Marked correct in the source answer key: (d) Thermosphere.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-science-environment-003",
    type: "mcq",
    subject: "science",
    topic: "science-environment",
    topicLabel: "Science & Environment",
    difficulty: "medium",
    question: "Keystone species in an ecosystem are:",
    options: [
      "Species whose elimination can seriously affect the ecosystem",
      "Species whose elimination can benefit the ecosystem",
      "Species whose elimination has no effect on the ecosystem",
      "Species at the top of the food chain"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) Species whose elimination can seriously affect the ecosystem.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-science-environment-004",
    type: "mcq",
    subject: "science",
    topic: "science-environment",
    topicLabel: "Science & Environment",
    difficulty: "medium",
    question: "Number of Biodiversity Hotspots in the world is:",
    options: [
      "12",
      "18",
      "32",
      "36"
    ],
    answerIndex: 3,
    explanation: "Marked correct in the source answer key: (d) 36.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-science-environment-005",
    type: "mcq",
    subject: "science",
    topic: "science-environment",
    topicLabel: "Science & Environment",
    difficulty: "medium",
    question: "Acid rain is caused by an increase of ______ in the atmosphere:",
    options: [
      "Ozone and dust",
      "SO2 and NOx",
      "O2 and CO2",
      "CH4 and H2O"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) SO2 and NOx.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-science-environment-006",
    type: "mcq",
    subject: "science",
    topic: "science-environment",
    topicLabel: "Science & Environment",
    difficulty: "medium",
    question: "Which three edible plant species constitute about 60% supply of the world's food energy intake?",
    options: [
      "Wheat, Barley, Oat",
      "Wheat, Barley, Maize",
      "Wheat, Rice, Maize",
      "Wheat, Rice, Corn"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Wheat, Rice, Maize.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-science-environment-007",
    type: "mcq",
    subject: "science",
    topic: "science-environment",
    topicLabel: "Science & Environment",
    difficulty: "medium",
    question: "Homeostasis is:",
    options: [
      "Tendency of biological systems to change with change in environment",
      "Disturbance of self-regulatory system and natural controls",
      "Tendency of biological systems to resist change",
      "Biotic materials used in homeopathic medicines"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Tendency of biological systems to resist change.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-science-environment-008",
    type: "mcq",
    subject: "science",
    topic: "science-environment",
    topicLabel: "Science & Environment",
    difficulty: "medium",
    question: "Which of the following substance is used for Artificial Rain?",
    options: [
      "Silver Bromide",
      "Ammonium Nitrate",
      "Silver Iodide",
      "Ammonium Chloride"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Silver Iodide.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-science-environment-009",
    type: "mcq",
    subject: "science",
    topic: "science-environment",
    topicLabel: "Science & Environment",
    difficulty: "medium",
    question: "Water reaches its maximum density at which temperature?",
    options: [
      "-4°C",
      "-2°C",
      "2°C",
      "4°C"
    ],
    answerIndex: 3,
    explanation: "Marked correct in the source answer key: (d) 4°C.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-science-environment-010",
    type: "mcq",
    subject: "science",
    topic: "science-environment",
    topicLabel: "Science & Environment",
    difficulty: "medium",
    question: "Which of the following best describes an Estuary?",
    options: [
      "A stream or river that flows into a larger river.",
      "A triangular shaped land at the mouth of a river formed from the deposition of silt, sand and small rocks.",
      "A partially enclosed coastal body of water where the salty tidal water mixes with the fresh water of the river.",
      "The part of the sea where uniform ban on fishing is enforced."
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) A partially enclosed coastal body of water where the salty tidal water mixes with the fresh water of the river..",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-science-environment-011",
    type: "mcq",
    subject: "science",
    topic: "science-environment",
    topicLabel: "Science & Environment",
    difficulty: "medium",
    question: "Match the following vitamins with their corresponding chemical names: A Vitamin B2 B Vitamin E C Vitamin D D Vitamin A 1. Tocopherol 2. Retinol 3. Ergocalciferol 4. Riboflavin Choose the correct option.",
    options: [
      "A-4, B-1, C-3, D-2",
      "A-4, B-3, C-2, D-1",
      "A-4, B-3, C-1, D-2",
      "A-2, B-1, C-3, D-4"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) A-4, B-1, C-3, D-2.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-science-environment-012",
    type: "mcq",
    subject: "science",
    topic: "science-environment",
    topicLabel: "Science & Environment",
    difficulty: "medium",
    question: "The property of a substance to absorb moisture from the air upon exposure is called:",
    options: [
      "Desiccation",
      "Osmosis",
      "Deliquescence",
      "Efflorescence"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Deliquescence.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-science-environment-013",
    type: "mcq",
    subject: "science",
    topic: "science-environment",
    topicLabel: "Science & Environment",
    difficulty: "medium",
    question: "Choose the correct statements regarding Hypermetropia: (i) A person cannot see distant objects clearly (ii) A person cannot see near objects clearly (iii) The near point of the eye gets shifted away from the normal position (iv) The far point of the eye gets shifted towards the eye The correct statement is/are:",
    options: [
      "(i) and (iii)",
      "(ii) and (iv)",
      "(i) and (iv)",
      "(ii) and (iii)"
    ],
    answerIndex: 3,
    explanation: "Marked correct in the source answer key: (d) (ii) and (iii).",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-science-environment-014",
    type: "mcq",
    subject: "science",
    topic: "science-environment",
    topicLabel: "Science & Environment",
    difficulty: "medium",
    question: "Which of the following is not correctly matched?",
    options: [
      "Voltmeter : Potential difference",
      "Ammeter : Electric current",
      "Potentiometer : E.M.F.",
      "Galvanometer : Electric resistance"
    ],
    answerIndex: 3,
    explanation: "Marked correct in the source answer key: (d) Galvanometer : Electric resistance.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-science-environment-015",
    type: "mcq",
    subject: "science",
    topic: "science-environment",
    topicLabel: "Science & Environment",
    difficulty: "medium",
    question: "Which of the following is responsible for transport of organic products required for photosynthesis in plants?",
    options: [
      "Xylem",
      "Phloem",
      "Mitochondria",
      "Chloroplast"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) Phloem.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-mizoram-history-culture-001",
    type: "mcq",
    subject: "gk",
    topic: "mizoram-history-culture",
    topicLabel: "Mizoram History & Culture",
    difficulty: "medium",
    question: "\"Zawlbuk\" officially ended on:",
    options: [
      "January 1, 1937",
      "January 1, 1938",
      "January 1, 1939",
      "January 1, 1940"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) January 1, 1938.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-mizoram-history-culture-002",
    type: "mcq",
    subject: "gk",
    topic: "mizoram-history-culture",
    topicLabel: "Mizoram History & Culture",
    difficulty: "medium",
    question: "\"Rangkhol Kuki Lushai Gramar\" published in 1885 was written by:",
    options: [
      "TH Lewin",
      "Edwin Rowlands",
      "D.E. Jones",
      "CA Soppitt"
    ],
    answerIndex: 3,
    explanation: "Marked correct in the source answer key: (d) CA Soppitt.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-mizoram-history-culture-003",
    type: "mcq",
    subject: "gk",
    topic: "mizoram-history-culture",
    topicLabel: "Mizoram History & Culture",
    difficulty: "medium",
    question: "Modern education was introduced in Mizoram by which Christian Missionary?",
    options: [
      "F.W. Savidge",
      "Rev. D.E. Jones",
      "William Williams",
      "Watkin Roberts"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) F.W. Savidge.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-mizoram-history-culture-004",
    type: "mcq",
    subject: "gk",
    topic: "mizoram-history-culture",
    topicLabel: "Mizoram History & Culture",
    difficulty: "medium",
    question: "Which statement is correct on the journey of the dead in Mizo traditional belief?",
    options: [
      "Pawi believed the spirit journeys to 'Thlanpial'.",
      "Hmar believed the spirit journeys to 'Zinghmuh'.",
      "All spirits crossed Rihdil where they stepped upon the 'Lung rah buk'.",
      "'Hawilopar' and 'Lungloh tui' are located at 'Pialral Kawtchhuah'."
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) All spirits crossed Rihdil where they stepped upon the 'Lung rah buk'..",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-mizoram-history-culture-005",
    type: "mcq",
    subject: "gk",
    topic: "mizoram-history-culture",
    topicLabel: "Mizoram History & Culture",
    difficulty: "medium",
    question: "J. Shakespeare was known for:",
    options: [
      "His book 'A Monograph on Lushai Customs and Ceremonies'.",
      "Abolition of Chieftains in the Lushai Hills.",
      "Introducing the Land Settlement in the Lushai Hills.",
      "His leadership in the Chin-Lushai Expedition in 1889-1890."
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Introducing the Land Settlement in the Lushai Hills..",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-mizoram-history-culture-006",
    type: "mcq",
    subject: "gk",
    topic: "mizoram-history-culture",
    topicLabel: "Mizoram History & Culture",
    difficulty: "medium",
    question: "The chronological order of work involved in Mizo traditional agriculture is:",
    options: [
      "Mangkhawh, Hnuhhram, Hnuhpui, a thial, a thual, lo zawh",
      "Mangkhawh, Hnuhpui, Hnuhhram, a thial, a thual, lo zawh",
      "Mawngkhawh, Hnuhpui, Hnuhhram, a thual, a thial, lo zawh",
      "Hnuhpui, Mangkhawh, a thial, Hnuhhram, lo zawh"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Mawngkhawh, Hnuhpui, Hnuhhram, a thual, a thial, lo zawh.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-mizoram-history-culture-007",
    type: "mcq",
    subject: "gk",
    topic: "mizoram-history-culture",
    topicLabel: "Mizoram History & Culture",
    difficulty: "medium",
    question: "The great spiritual revival which transformed the religious landscape of the Mizo occurred in:",
    options: [
      "1918",
      "1919",
      "1920",
      "1921"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) 1919.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-sports-001",
    type: "mcq",
    subject: "gk",
    topic: "sports",
    topicLabel: "Sports",
    difficulty: "medium",
    question: "The first woman player to reach Roland Garros finals as a qualifier is:",
    options: [
      "Marketa Vondrousova",
      "Dinara Safina",
      "Maja Schwalinska",
      "Emma Raducanu"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Maja Schwalinska.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-current-affairs-2026-005",
    type: "mcq",
    subject: "current-affairs",
    topic: "current-affairs-2026",
    topicLabel: "Current Affairs 2026",
    difficulty: "medium",
    question: "In the 2026 West Bengal Legislative Assembly elections, which Kolkata-based constituency served as the battlefield for the high-profile direct electoral contest between the then-incumbent Chief Minister Mamata Banerjee and the leader of the opposition, Suvendu Adhikari?",
    options: [
      "Ballygunge",
      "Nandigram",
      "Diamond Harbour",
      "Bhabanipur"
    ],
    answerIndex: 3,
    explanation: "Marked correct in the source answer key: (d) Bhabanipur.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-current-affairs-2026-006",
    type: "mcq",
    subject: "current-affairs",
    topic: "current-affairs-2026",
    topicLabel: "Current Affairs 2026",
    difficulty: "medium",
    question: "A satirical political movement, the Cockroach Janta Party (CJP), which gained attention in 2026, was founded by:",
    options: [
      "Dhruv Rathee",
      "Abhijeet Dipke",
      "Yogendra Yadav",
      "Prashant Kishore"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) Abhijeet Dipke.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-current-affairs-2026-007",
    type: "mcq",
    subject: "current-affairs",
    topic: "current-affairs-2026",
    topicLabel: "Current Affairs 2026",
    difficulty: "medium",
    question: "The recently launched Mizo Taxi App is developed in collaborations between the State Transport Authority, NIT Mizoram and:",
    options: [
      "Rapido",
      "Siruk",
      "Lailen",
      "Digiride"
    ],
    answerIndex: 3,
    explanation: "Marked correct in the source answer key: (d) Digiride.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-modern-indian-history-009",
    type: "mcq",
    subject: "history",
    topic: "modern-indian-history",
    topicLabel: "Modern Indian History",
    difficulty: "medium",
    question: "The Cabinet Mission came to India in:",
    options: [
      "1942",
      "1945",
      "1946",
      "1947"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) 1946.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-modern-indian-history-010",
    type: "mcq",
    subject: "history",
    topic: "modern-indian-history",
    topicLabel: "Modern Indian History",
    difficulty: "medium",
    question: "The Ilbert Bill controversy occurred during the Viceroyalty of:",
    options: [
      "Lord Rippon",
      "Lord Lytton",
      "Lord Dufferin",
      "Lord Curzon"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) Lord Rippon.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-modern-indian-history-011",
    type: "mcq",
    subject: "history",
    topic: "modern-indian-history",
    topicLabel: "Modern Indian History",
    difficulty: "medium",
    question: "The Permanent Settlement of Bengal was introduced by:",
    options: [
      "Lord Mayo",
      "Lord Wellesley",
      "Lord Lytton",
      "Lord Cornwallis"
    ],
    answerIndex: 3,
    explanation: "Marked correct in the source answer key: (d) Lord Cornwallis.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-modern-indian-history-012",
    type: "mcq",
    subject: "history",
    topic: "modern-indian-history",
    topicLabel: "Modern Indian History",
    difficulty: "medium",
    question: "The Dandi March began on:",
    options: [
      "26 January 1930",
      "12 March 1930",
      "25 April 1930",
      "15 June 1930"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) 12 March 1930.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-geography-007",
    type: "mcq",
    subject: "geography",
    topic: "geography",
    topicLabel: "Geography",
    difficulty: "medium",
    question: "The National Highway No. 2 which ends at Tipa, Mizoram originates near:",
    options: [
      "Pasighat, Arunachal Pradesh",
      "Dibrugarh, Assam",
      "Jorhat, Assam",
      "Mokokchung, Nagaland"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) Dibrugarh, Assam.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-geography-008",
    type: "mcq",
    subject: "geography",
    topic: "geography",
    topicLabel: "Geography",
    difficulty: "medium",
    question: "The largest protected area in Mizoram is:",
    options: [
      "Phawngpui National Park",
      "Murlen National Park",
      "Tawi Wildlife Sanctuary",
      "Dampa Tiger Reserve"
    ],
    answerIndex: 3,
    explanation: "Marked correct in the source answer key: (d) Dampa Tiger Reserve.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-geography-009",
    type: "mcq",
    subject: "geography",
    topic: "geography",
    topicLabel: "Geography",
    difficulty: "medium",
    question: "The McMahon Line separates India from:",
    options: [
      "Pakistan",
      "China",
      "Nepal",
      "Bangladesh"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) China.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-geography-010",
    type: "mcq",
    subject: "geography",
    topic: "geography",
    topicLabel: "Geography",
    difficulty: "medium",
    question: "Which strait separates Asia from North America?",
    options: [
      "Malaca",
      "Bab-el-Mandeb",
      "Bering",
      "Tartary"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Bering.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-mining-minerals-001",
    type: "mcq",
    subject: "gk",
    topic: "mining-minerals",
    topicLabel: "Mining & Minerals",
    difficulty: "medium",
    question: "The number of tunnels constructed within the Bairabi-Sairang railway line is:",
    options: [
      "44",
      "45",
      "46",
      "47"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) 45.",
    disputeNote: "The source's own editorial note flags an unresolved inconsistency: \"The Bairabi-Sairang has 32 tunnels, but options are 44-47\" — i.e. the note-writer isn't sure any of the 4 printed options is factually right, even the one it settles on. Answered here as 45, the source's final corrected key, but treat this figure as unverified.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-mining-minerals-002",
    type: "mcq",
    subject: "gk",
    topic: "mining-minerals",
    topicLabel: "Mining & Minerals",
    difficulty: "medium",
    question: "The Singhbhum Shear Zone, famous for copper mining, is located mainly in:",
    options: [
      "Chhattisgarh",
      "Jharkhand",
      "Madhya Pradesh",
      "Uttar Pradesh"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) Jharkhand.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-polity-constitution-008",
    type: "mcq",
    subject: "polity",
    topic: "polity-constitution",
    topicLabel: "Polity & Constitution",
    difficulty: "medium",
    question: "Article 21 of the Constitution deals with:",
    options: [
      "Equality",
      "Freedom of religion",
      "Life and personal liberty",
      "Constitutional remedies 2013"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Life and personal liberty.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-polity-constitution-009",
    type: "mcq",
    subject: "polity",
    topic: "polity-constitution",
    topicLabel: "Polity & Constitution",
    difficulty: "medium",
    question: "Which Schedule contains provisions relating to the Anti-Defection Law?",
    options: [
      "Ninth",
      "Tenth",
      "Eleventh",
      "Twelfth"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) Tenth.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-polity-constitution-010",
    type: "mcq",
    subject: "polity",
    topic: "polity-constitution",
    topicLabel: "Polity & Constitution",
    difficulty: "medium",
    question: "The Finance Commission is constituted under:",
    options: [
      "Article 280",
      "Article 324",
      "Article 356",
      "Article 368"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) Article 280.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-polity-constitution-011",
    type: "mcq",
    subject: "polity",
    topic: "polity-constitution",
    topicLabel: "Polity & Constitution",
    difficulty: "medium",
    question: "Which Article provides for President's Rule?",
    options: [
      "352",
      "356",
      "360",
      "365"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) 356.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-polity-constitution-012",
    type: "mcq",
    subject: "polity",
    topic: "polity-constitution",
    topicLabel: "Polity & Constitution",
    difficulty: "medium",
    question: "The Right to Education as a Fundamental Right is provided under:",
    options: [
      "Article 19A",
      "Article 21A",
      "Article 29A",
      "Article 40"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) Article 21A.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-polity-constitution-013",
    type: "mcq",
    subject: "polity",
    topic: "polity-constitution",
    topicLabel: "Polity & Constitution",
    difficulty: "medium",
    question: "The Census of India 2027 will be the:",
    options: [
      "13th Census",
      "14th Census",
      "15th Census",
      "16th Census"
    ],
    answerIndex: 3,
    explanation: "Marked correct in the source answer key: (d) 16th Census.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-polity-constitution-014",
    type: "mcq",
    subject: "polity",
    topic: "polity-constitution",
    topicLabel: "Polity & Constitution",
    difficulty: "medium",
    question: "Which SDG specifically aims to eradicate poverty?",
    options: [
      "SDG 1",
      "SDG 2",
      "SDG 11",
      "SDG 12"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) SDG 1.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-polity-constitution-015",
    type: "mcq",
    subject: "polity",
    topic: "polity-constitution",
    topicLabel: "Polity & Constitution",
    difficulty: "medium",
    question: "India announced, in November 2021, its target year for achieving Net Zero emissions as:",
    options: [
      "2050",
      "2060",
      "2070",
      "2080"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) 2070.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-polity-constitution-016",
    type: "mcq",
    subject: "polity",
    topic: "polity-constitution",
    topicLabel: "Polity & Constitution",
    difficulty: "medium",
    question: "The Rights of Persons with Disabilities Act was enacted in:",
    options: [
      "2009",
      "2014",
      "2016",
      "2021"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) 2016.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-mining-minerals-003",
    type: "mcq",
    subject: "gk",
    topic: "mining-minerals",
    topicLabel: "Mining & Minerals",
    difficulty: "medium",
    question: "PMKKKY stands for:",
    options: [
      "Pradhan Mantri Khanij Kalyan Kosh Yojana",
      "Pradhan Mantri Khanij Kshetra Kalyan Yojana",
      "Pradhan Mantri Khanij Kendra Kalyan Yojana",
      "Mantri Kshetra Khanij Yojana"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) Pradhan Mantri Khanij Kshetra Kalyan Yojana.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-science-environment-016",
    type: "mcq",
    subject: "science",
    topic: "science-environment",
    topicLabel: "Science & Environment",
    difficulty: "medium",
    question: "The concept of biodiversity hotspot was proposed by:",
    options: [
      "Norman Myers",
      "Rachel Carson",
      "E.O. Wilson",
      "James Lovelock"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) Norman Myers.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-science-environment-017",
    type: "mcq",
    subject: "science",
    topic: "science-environment",
    topicLabel: "Science & Environment",
    difficulty: "medium",
    question: "Consider the following statements regarding Protected Areas in India: 1. National Parks provide a higher degree of protection than Wildlife Sanctuaries. 2. Grazing of livestock may be permitted in certain Wildlife Sanctuaries. 3. Private ownership of land is not allowed in Wildlife Sanctuaries. Which of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) 1 and 2 only.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-science-environment-018",
    type: "mcq",
    subject: "science",
    topic: "science-environment",
    topicLabel: "Science & Environment",
    difficulty: "medium",
    question: "Consider the following statements regarding the Intergovernmental Panel on Climate Change (IPCC): 1. The IPCC was established jointly by UNEP and WMO. 2. The IPCC conducts original climate research through its own laboratories. 3. The IPCC periodically publishes Assessment Reports on climate change. Which of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1,2 and 3"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) 1 and 3 only.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-science-environment-019",
    type: "mcq",
    subject: "science",
    topic: "science-environment",
    topicLabel: "Science & Environment",
    difficulty: "medium",
    question: "Consider the following statements regarding Environmental Impact Assessment (EIA): 1. Environmental Impact Assessment was first introduced in India through an EIA Notification issued in 1994. 2. Environmental Impact Assessment is a statutory requirement under the Environment (Protection) Act, 1986. 3. All projects requiring Environmental Clearance must necessarily undergo public hearing. Which of the statements given above are correct?",
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1,2 and 3"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) 1 and 2 only.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-science-environment-020",
    type: "mcq",
    subject: "science",
    topic: "science-environment",
    topicLabel: "Science & Environment",
    difficulty: "medium",
    question: "CAMPA stands for:",
    options: [
      "Compensatory Afforestation Fund Management and Planning Authority",
      "Central Afforestation Management Programme Authority",
      "Conservation and Afforestation Management Planning Agency",
      "Central Authority for Monitoring Protected Areas"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) Compensatory Afforestation Fund Management and Planning Authority.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-science-environment-021",
    type: "mcq",
    subject: "science",
    topic: "science-environment",
    topicLabel: "Science & Environment",
    difficulty: "medium",
    question: "Which law states that pressure exerted on a confined fluid is transmitted equally in all directions?",
    options: [
      "Archimedes' Principle",
      "Pascal's Law",
      "Ohm's Law",
      "Newton's First Law"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) Pascal's Law.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-science-environment-022",
    type: "mcq",
    subject: "science",
    topic: "science-environment",
    topicLabel: "Science & Environment",
    difficulty: "medium",
    question: "Insulin is produced by:",
    options: [
      "Liver",
      "Pancreas",
      "Kidney",
      "Spleen"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) Pancreas.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-science-environment-023",
    type: "mcq",
    subject: "science",
    topic: "science-environment",
    topicLabel: "Science & Environment",
    difficulty: "medium",
    question: "Which of the following pairs represents an alloy and its principal constituents correctly?",
    options: [
      "Brass-Copper and Zinc",
      "Bronze-Iron and Carbon",
      "Stainless Steel - Copper and Tin",
      "Solder Iron and Lead"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) Brass-Copper and Zinc.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-science-environment-024",
    type: "mcq",
    subject: "science",
    topic: "science-environment",
    topicLabel: "Science & Environment",
    difficulty: "medium",
    question: "Which part of a flower develops into a fruit after fertilization?",
    options: [
      "Ovule",
      "Stigma",
      "Ovary",
      "Sepal"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Ovary.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-mizoram-history-culture-008",
    type: "mcq",
    subject: "gk",
    topic: "mizoram-history-culture",
    topicLabel: "Mizoram History & Culture",
    difficulty: "medium",
    question: "Which one of the following is a water-based Mizo traditional games?",
    options: [
      "Inphehkan",
      "Belpa tawm",
      "Intaiban",
      "Inbikhurluh"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) Belpa tawm.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-mizoram-history-culture-009",
    type: "mcq",
    subject: "gk",
    topic: "mizoram-history-culture",
    topicLabel: "Mizoram History & Culture",
    difficulty: "medium",
    question: "The Mizo name for the constellation Orion is:",
    options: [
      "Thlasik kawng",
      "Chhohreivung",
      "Sikawikap",
      "Siruk"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) Chhohreivung.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-mizoram-history-culture-010",
    type: "mcq",
    subject: "gk",
    topic: "mizoram-history-culture",
    topicLabel: "Mizoram History & Culture",
    difficulty: "medium",
    question: "Inchhawlthuai is a term related to:",
    options: [
      "Mizo traditional games",
      "Courting amongst the youth",
      "A type of peace offerings",
      "Preparation of offerings"
    ],
    answerIndex: 3,
    explanation: "Marked correct in the source answer key: (d) Preparation of offerings.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-mizoram-history-culture-011",
    type: "mcq",
    subject: "gk",
    topic: "mizoram-history-culture",
    topicLabel: "Mizoram History & Culture",
    difficulty: "medium",
    question: "Chief Bengkhuaia led a strategic raid on the Alexandrapur Tea Estate in Cachar on:",
    options: [
      "18th January 1871",
      "23rd January 1871",
      "18th February 1871",
      "23rd February 1871"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) 23rd January 1871.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-mizoram-history-culture-012",
    type: "mcq",
    subject: "gk",
    topic: "mizoram-history-culture",
    topicLabel: "Mizoram History & Culture",
    difficulty: "medium",
    question: "The time between breakfast (tukthuan) and lunch (chawfak hun) is termed as:",
    options: [
      "Ni tlang san",
      "Nauril tam",
      "Fehrehsan",
      "Chawhnu tlang her"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Fehrehsan.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-mizoram-history-culture-013",
    type: "mcq",
    subject: "gk",
    topic: "mizoram-history-culture",
    topicLabel: "Mizoram History & Culture",
    difficulty: "medium",
    question: "War between the East and the West (Chhak leh Thlang Indo) happened during:",
    options: [
      "1867-1870",
      "1877-1880",
      "1887-1890",
      "1897-1900"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) 1877-1880.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-mizoram-history-culture-014",
    type: "mcq",
    subject: "gk",
    topic: "mizoram-history-culture",
    topicLabel: "Mizoram History & Culture",
    difficulty: "medium",
    question: "Which of the following dances is of the Lai tribes?",
    options: [
      "Sikpui lam",
      "Chai",
      "Chawnglaizawn",
      "Chheih lam"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) Chawnglaizawn.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-mizoram-history-culture-015",
    type: "mcq",
    subject: "gk",
    topic: "mizoram-history-culture",
    topicLabel: "Mizoram History & Culture",
    difficulty: "medium",
    question: "The first Mizo to receive the Kirti Chakra in the year 1968 is:",
    options: [
      "Capt Lalrinawma Sailo",
      "Capt Lalhleia",
      "Subedar Pakunga",
      "Subedar Chalhnuna Lushai"
    ],
    answerIndex: 3,
    explanation: "Marked correct in the source answer key: (d) Subedar Chalhnuna Lushai.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-polity-constitution-017",
    type: "mcq",
    subject: "polity",
    topic: "polity-constitution",
    topicLabel: "Polity & Constitution",
    difficulty: "medium",
    question: "The Inner Line Permit (ILP) system in Mizoram is regulated under the:",
    options: [
      "Sixth Schedule of the Constitution of India",
      "Bengal Eastern Frontier Regulation, 1873",
      "Article 371G of the Constitution of India",
      "Citizenship Act"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) Bengal Eastern Frontier Regulation, 1873.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-mining-minerals-004",
    type: "mcq",
    subject: "gk",
    topic: "mining-minerals",
    topicLabel: "Mining & Minerals",
    difficulty: "medium",
    question: "In the Mizoram State Budget 2026, how much financial outlay was specifically designated for undertaking Mining Sector Reforms?",
    options: [
      "₹50 crore",
      "₹75 crore",
      "₹100 crore",
      "₹150 crore"
    ],
    answerIndex: 2,
    explanation: "Marked correct in the source answer key: (c) ₹100 crore.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-mining-minerals-005",
    type: "mcq",
    subject: "gk",
    topic: "mining-minerals",
    topicLabel: "Mining & Minerals",
    difficulty: "medium",
    question: "The Union Ministry of Mines notified the 2026 Concession Rules to 5 specifically provide a detailed mechanism for inclusion of contiguous areas and associated minerals for which type of minerals?",
    options: [
      "Deep-seated minerals",
      "Atomic and hydrocarbon energy minerals",
      "Sand and ordinary clay",
      "Beach sand rare earth elements"
    ],
    answerIndex: 0,
    explanation: "Marked correct in the source answer key: (a) Deep-seated minerals.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-mizoram-current-affairs-001",
    type: "mcq",
    subject: "gk",
    topic: "mizoram-current-affairs",
    topicLabel: "Mizoram Current Affairs",
    difficulty: "medium",
    question: "What was the theme for 'Green Mizoram Day' observed across the State on June 11, 2026?",
    options: [
      "Plant Trees, Save Earth",
      "Trees are green gold, the roots of all life",
      "Greener Mizoram, Cleaner Future",
      "Forest for Life and Livelihoods"
    ],
    answerIndex: 1,
    explanation: "Marked correct in the source answer key: (b) Trees are green gold, the roots of all life.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  },
  {
    id: "acom26-mizoram-current-affairs-002",
    type: "mcq",
    subject: "gk",
    topic: "mizoram-current-affairs",
    topicLabel: "Mizoram Current Affairs",
    difficulty: "medium",
    question: "Recently, the Natural History Museum in Aizawl holds the distinction of being India's ________ national repository under the Biological Diversity Act.",
    options: [
      "11th",
      "15th",
      "18th",
      "21st"
    ],
    answerIndex: 3,
    explanation: "Marked correct in the source answer key: (d) 21st.",
    source: "Assistant Controller of Mines 2026 — Marked Answer Key",
    answerSource: "derived",
    tags: []
  }
];

export const assistantControllerOfMines2026: QuestionBank = {
  id: 'assistant-controller-of-mines-2026',
  title: 'Assistant Controller of Mines 2026',
  description:
    'Mock MPSC Assistant Controller of Mines paper — 66 General English (Part-B) and ' +
    '100 General Studies MCQs, including Mizoram-specific mining, history and current-affairs ' +
    'questions distinctive to this post. Self-authored practice content, not a published exam key.',
  questions: assistantControllerOfMines2026Questions,
};
