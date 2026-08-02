/* Paper I — General English, MCQ section (60 marks). Authored to syllabus,
 * not mined — this complements the 35 key-verified questions in
 * data/p2gk-verified.js (source: one real past paper with a published key).
 */

window.MPSC.units.push({
  id: 'p1m1',
  paper: 'Paper I — General English (MCQ)',
  title: 'Parts of Speech',
  marks: 20,
  syllabus: 'Paper I, General English — Grammar: Parts of speech (MCQ with negative marking): 20 Marks.',

  notes: [
    { h: 'The eight parts of speech, by function',
      b: '<table><tr><th>Part of speech</th><th>Function</th><th>Example</th></tr>' +
         '<tr><td>Noun</td><td>Names a person, place, thing, or idea</td><td><i>freedom</i>, <i>Aizawl</i>, <i>committee</i></td></tr>' +
         '<tr><td>Pronoun</td><td>Stands in for a noun</td><td><i>he</i>, <i>which</i>, <i>himself</i>, <i>anyone</i></td></tr>' +
         '<tr><td>Verb</td><td>Action or state of being</td><td><i>run</i>, <i>seems</i>, <i>had been waiting</i></td></tr>' +
         '<tr><td>Adjective</td><td>Modifies a noun/pronoun</td><td><i>tall</i>, <i>this</i>, <i>three</i></td></tr>' +
         '<tr><td>Adverb</td><td>Modifies a verb, adjective, or another adverb</td><td><i>quickly</i>, <i>very</i>, <i>too</i></td></tr>' +
         '<tr><td>Preposition</td><td>Relates a noun/pronoun to another word</td><td><i>in</i>, <i>besides</i>, <i>despite</i></td></tr>' +
         '<tr><td>Conjunction</td><td>Joins words, phrases or clauses</td><td><i>and</i>, <i>because</i>, <i>although</i></td></tr>' +
         '<tr><td>Interjection</td><td>Expresses sudden emotion, grammatically independent</td><td><i>Oh!</i>, <i>Alas!</i>, <i>Wow!</i></td></tr></table>' +
         '<p>Past MPSC papers phrase this as <em>"identify the part of speech of the underlined word(s)"</em>. Since the same word often functions differently depending on context, the questions are really testing contextual reading, not rote memorisation of a word list.</p>' },

    { h: 'The words that shift category — the exam\'s favourite trap',
      b: '<p>A large share of marks in this section come from words that are <b>one part of speech in one sentence and another in the next</b>. Learn to test by function, not by the word itself:</p>' +
         '<ul>' +
         '<li><b>"That"</b> — conjunction (<i>I know that he left</i>), relative pronoun (<i>the book that I read</i>), demonstrative adjective (<i>that book</i>), or demonstrative pronoun standing alone (<i>That is true</i>).</li>' +
         '<li><b>"Well"</b> — adverb (<i>she sings well</i>), adjective meaning healthy (<i>I am well</i>), noun (<i>a deep well</i>), or interjection (<i>Well, let\'s begin</i>).</li>' +
         '<li><b>"Round"</b> — adjective (<i>a round table</i>), noun (<i>a round of golf</i>), preposition (<i>round the corner</i>), verb (<i>to round off</i>), or adverb (<i>turn round</i>).</li>' +
         '<li><b>"But"</b> — usually a conjunction (<i>poor but happy</i>), but a preposition meaning "except" (<i>no one but him</i>).</li>' +
         '<li><b>Words ending "-ing"</b> — a verb in a continuous tense (<i>she is running</i>), a gerund functioning as a noun (<i>running is healthy</i>), or a participle functioning as an adjective (<i>the running water</i>). This distinction alone accounts for many past questions.</li>' +
         '<li><b>Possessive pronouns vs possessive adjectives</b> — "his" before a noun is an adjective (<i>his book</i>); standing alone it is a pronoun (<i>the book is his</i>).</li>' +
         '</ul>' +
         '<div class="tip"><b>Method.</b> Ignore the word itself and ask what job it is doing in <em>that specific sentence</em>: does it name something (noun), point to something (pronoun/adjective), assert an action or state (verb), or describe/modify (adjective/adverb)? The test always resolves to function, never to the word\'s "usual" category.</div>' },

    { h: 'Pronoun subtypes — a common sub-question',
      b: '<ul>' +
         '<li><b>Personal</b> — I, you, he, she, it, we, they (and object forms me, him, etc.)</li>' +
         '<li><b>Possessive</b> — mine, yours, his, hers, its, ours, theirs</li>' +
         '<li><b>Reflexive/Intensive</b> — myself, himself, herself, themselves (reflexive when it is the object referring back to the subject: <i>she hurt herself</i>; intensive when it just emphasises: <i>she herself carried the box</i>)</li>' +
         '<li><b>Relative</b> — who, whom, whose, which, that (introduces a relative clause)</li>' +
         '<li><b>Demonstrative</b> — this, that, these, those (standing alone, not before a noun)</li>' +
         '<li><b>Interrogative</b> — who, what, which (in questions)</li>' +
         '<li><b>Indefinite</b> — someone, anybody, none, all, each, few</li>' +
         '</ul>' }
  ],

  questions: [
    { q: 'Identify the part of speech of the underlined word: "She herself completed the entire project alone."',
      o: ['Reflexive pronoun', 'Intensive pronoun', 'Personal pronoun', 'Demonstrative pronoun'], a: 1,
      e: '<p>"Herself" here simply <b>emphasises</b> that she, and no one else, did it — the sentence would still be complete without it ("She completed the project"). That makes it an <b>intensive</b> pronoun.</p><p>It would be <b>reflexive</b> only if it were the object of the verb referring back to the subject, e.g. "She hurt herself." The distinction is whether the word is grammatically necessary (reflexive) or purely emphatic (intensive).</p>' },

    { q: 'Identify the part of speech of the underlined word: "Running is an excellent form of exercise."',
      o: ['Verb', 'Adjective', 'Gerund (noun)', 'Adverb'], a: 2,
      e: '<p>"Running" is the <b>subject of the sentence</b> — a noun position — so despite its "-ing" form it functions as a <b>gerund</b>.</p><p>Compare "The running water is cold," where the same word modifies a noun and is a <b>participle/adjective</b>; or "She is running," where it is part of the verb phrase. The "-ing" form\'s part of speech always depends on its job in the sentence, never on its shape.</p>' },

    { q: 'Identify the part of speech of "that" in: "I never knew that he had already left."',
      o: ['Relative pronoun', 'Demonstrative adjective', 'Conjunction', 'Demonstrative pronoun'], a: 2,
      e: '<p>Here "that" simply introduces a noun clause ("that he had already left") reporting what was known — a <b>conjunction</b>, with no grammatical role of its own inside the clause.</p><p>Contrast "the man that I met" (relative pronoun, replacing "man" inside its clause) and "that man is tall" (demonstrative adjective, modifying "man"). Always check whether "that" is playing a grammatical role inside its clause (pronoun) or merely linking clauses (conjunction).</p>' },

    { q: 'Identify the part of speech of the underlined word: "Besides clothes, I gave him some money."',
      o: ['Conjunction', 'Preposition', 'Adverb', 'Noun'], a: 1,
      e: '<p>"Besides" here relates the noun "clothes" to the rest of the sentence, meaning "in addition to" — a <b>preposition</b>, taking "clothes" as its object.</p><p>"Besides" can also be a conjunctive adverb linking two independent clauses ("I have no money; besides, I am tired"). The test is whether it takes a following noun/pronoun as its object (preposition) or stands alone linking clauses (adverb).</p>' },

    { q: 'In the sentence "What are the latest tidings from the capital?", the word "tidings" functions as a',
      o: ['Adjective', 'Verb', 'Noun', 'Adverb'], a: 2,
      e: '<p>"Tidings" (meaning news) is the thing being asked about — the <b>complement/subject-referring noun</b> of the sentence.</p><p>This tests vocabulary as much as grammar: candidates unfamiliar with the archaic-sounding word "tidings" may misjudge its category. When in doubt, ask what role the unfamiliar word plays relative to the verb "are" — here it names the thing being described, so it must be a noun.</p>' },

    { q: 'Identify the part of speech of the underlined word: "It is too hot to go out today."',
      o: ['Adjective', 'Adverb', 'Preposition', 'Conjunction'], a: 1,
      e: '<p>"Too" modifies the adjective "hot", intensifying it — an <b>adverb</b>. Adverbs frequently modify adjectives (not just verbs), which is the case tested here.</p><p>Do not confuse "too" (adverb, meaning excessively / also) with "to" (preposition/infinitive marker) — a common spelling-driven confusion in this section.</p>' },

    { q: 'Identify the part of speech of "well" in: "The doctor said the patient is well now."',
      o: ['Adverb', 'Noun', 'Adjective', 'Interjection'], a: 2,
      e: '<p>Here "well" describes the patient\'s <b>state of health</b> — a predicate <b>adjective</b> meaning "healthy," following the linking verb "is."</p><p>Contrast "she sang well" (adverb, modifying the verb), "they drew water from the well" (noun), and "Well, shall we begin?" (interjection). "Well" changing category across all four uses makes it a favourite MPSC test word.</p>' },

    { q: 'Identify the part of speech of the underlined word: "No one but him objected to the plan."',
      o: ['Conjunction', 'Adverb', 'Preposition', 'Pronoun'], a: 2,
      e: '<p>"But" here means "except" and takes "him" as its object — functioning as a <b>preposition</b>, not its far more common role as a conjunction.</p><p>This is why "him" (object form), not "he", is grammatically correct here — a preposition always takes the object case. If "but" were a conjunction joining clauses, it would not govern the case of a following pronoun this way.</p>' },

    { q: 'In "This is what I want," the word "what" functions as a',
      o: ['Interrogative pronoun', 'Relative pronoun', 'Conjunction', 'Adjective'], a: 1,
      e: '<p>"What" here introduces the noun clause "what I want" and stands in for "the thing that" — functioning as a <b>relative pronoun</b> (specifically, a "fused" relative meaning "that which").</p><p>It would be <b>interrogative</b> only in a genuine question: "What do you want?" Since this sentence is a statement, not a question, interrogative is wrong despite the superficial resemblance.</p>' },

    { q: 'Identify the part of speech of the underlined word: "Oh! That I had the wings of a bird."',
      o: ['Adjective', 'Adverb', 'Interjection', 'Verb'], a: 2,
      e: '<p>"Oh!" expresses sudden emotion (here, longing) and stands grammatically apart from the rest of the sentence — the defining feature of an <b>interjection</b>.</p><p>Interjections are the only part of speech with no grammatical connection to the words around them; they can be removed without affecting the sentence\'s grammar, only its emotional colour.</p>' }
  ]
});
