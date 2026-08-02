window.MPSC.units.push({
  id: 'p1m3',
  paper: 'Paper I — General English (MCQ)',
  title: 'Formation of Sentences',
  marks: 20,
  syllabus: 'Paper I, General English — Formation of sentence (MCQ with negative marking): 20 Marks.',

  notes: [
    { h: 'Subject-verb agreement — the highest-yield rule',
      b: '<ul>' +
         '<li>A singular subject takes a singular verb, plural takes plural — but the exam tests the <b>cases where this is not obvious</b>:</li>' +
         '<li><b>Words between subject and verb don\'t change agreement.</b> "The <u>list</u> of items <b>is</b> long" — "list" is the subject, "items" is not; a following prepositional phrase never governs the verb.</li>' +
         '<li><b>Collective nouns</b> (team, committee, family, jury) take a <b>singular</b> verb when acting as one unit ("The committee <b>meets</b> today") and can take plural when members act individually — but singular is the default and safer choice in formal writing.</li>' +
         '<li><b>"Each", "either", "neither", "everyone", "somebody"</b> are always <b>singular</b>: "Each of the boys <b>has</b> a book" (not "have").</li>' +
         '<li><b>Two subjects joined by "and"</b> are usually plural ("Ram and Shyam <b>are</b> here"), but joined by <b>"or"/"nor"</b>, the verb agrees with the <b>nearer</b> subject: "Neither the teacher nor the students <b>were</b> present."</li>' +
         '<li><b>"None"</b> can take either, but is traditionally treated as singular ("none of us <b>is</b> ready").</li>' +
         '</ul>' },

    { h: 'Tense sequence',
      b: '<p>The core rule: if the <b>main clause is in a past tense</b>, the subordinate clause generally also stays in some form of the past — it cannot jump to present or future.</p>' +
         '<ul><li>Correct: "He said that he <b>was</b> tired." (not "is")</li>' +
         '<li>Correct: "She told me that she <b>would come</b> tomorrow." (not "will come")</li>' +
         '<li><b>Exception — universal/general truths stay present</b> regardless of the main clause\'s tense: "The teacher said that the earth <b>revolves</b> around the sun." (not "revolved" — the fact was true then, is true now, and always will be)</li>' +
         '<li><b>Exception — habitual truths</b> at the time of speaking may also stay in a tense reflecting continued relevance.</li></ul>' +
         '<div class="tip">This "reported speech" pattern is the single most common trigger for tense-sequence questions in MPSC papers — a sentence is given as direct speech and must be converted, or an error in an already-converted sentence must be spotted.</div>' },

    { h: 'Common error-spotting categories',
      b: '<ul>' +
         '<li><b>Preposition errors</b> — fixed collocations: "married <b>to</b>" (not "with"), "different <b>from</b>" (not "than", in formal usage), "good <b>at</b>" (not "in"), "capable <b>of</b>" (not "to"), "interested <b>in</b>" (not "on"), "arrived <b>at</b>" a place (small/point) vs "arrived <b>in</b>" a city/country (large area).</li>' +
         '<li><b>Double comparatives/superlatives</b> — "more better" and "most best" are always wrong; use one degree marker only.</li>' +
         '<li><b>Dangling modifiers</b> — a modifying phrase must logically attach to the subject that follows it: "Walking to school, <u>the rain started</u>" is wrong (the rain wasn\'t walking); it should be "Walking to school, <u>I got caught</u> in the rain."</li>' +
         '<li><b>Parallelism</b> — items in a list or comparison must share the same grammatical form: "She likes reading, writing, and <b>to paint</b>" is wrong; it should be "reading, writing, and <b>painting</b>".</li>' +
         '<li><b>Redundancy</b> — "return back", "repeat again", "each and every", "free gift" all duplicate meaning already present.</li>' +
         '<li><b>Article errors</b> — "a" before consonant sounds, "an" before vowel <em>sounds</em> (not just vowel letters: "a university", "an hour").</li>' +
         '</ul>' },

    { h: 'Active/passive and direct/indirect conversion',
      b: '<p><b>Active → Passive:</b> the object of the active sentence becomes the subject; the verb becomes a form of "be" + past participle; the original subject becomes an agent phrase with "by" (often omissible).</p>' +
         '<p>"The chef cooked the meal" → "The meal <b>was cooked</b> by the chef."</p>' +
         '<p><b>Direct → Indirect (reported) speech</b> requires three simultaneous shifts: pronouns change to match the reporting perspective, tense shifts backward (per the rule above), and time/place words shift ("today"→"that day", "here"→"there", "tomorrow"→"the next day").</p>' +
         '<p>Direct: <em>He said, "I will finish it tomorrow."</em> → Indirect: <em>He said that he would finish it the next day.</em></p>' }
  ],

  questions: [
    { q: 'Choose the grammatically correct sentence.',
      o: ['The list of items in the report are long.', 'The list of items in the report is long.',
          'The list of items in the report were long.', 'The lists of items in the report is long.'], a: 1,
      e: '<p>The subject is <b>"list"</b> (singular) — "items" and "report" sit inside a prepositional phrase and cannot govern the verb. So the correct verb is <b>"is"</b>.</p><p>This is the single most-tested agreement trap: a plural noun placed between subject and verb tempts the writer into a plural verb that does not actually agree with the true subject.</p>' },

    { q: 'Choose the grammatically correct sentence.',
      o: ['Each of the students have submitted their assignment.', 'Each of the students has submitted his or her assignment.',
          'Each of the students are submitting the assignment.', 'Each of the student has submit the assignment.'], a: 1,
      e: '<p>"Each" is always treated as <b>singular</b>, regardless of the plural noun that follows it ("of the students"). So the verb must be <b>"has"</b>, and formal usage prefers a singular pronoun agreeing with "each" — "his or her", not "their".</p><p>Options (a) and (c) make the classic error of letting "students" (inside the "of" phrase) govern the verb instead of "each".</p>' },

    { q: 'Choose the correctly converted reported speech for: He said, "I am going to the market."',
      o: ['He said that he is going to the market.', 'He said that he was going to the market.',
          'He said that he went to the market.', 'He said that he will go to the market.'], a: 1,
      e: '<p>The reporting verb "said" is <b>past tense</b>, so the present continuous "am going" shifts backward to <b>"was going"</b> — past continuous.</p><p>It does not become simple past ("went") because the continuous aspect (an action in progress) must be preserved; only the tense shifts backward, not the aspect.</p>' },

    { q: 'Choose the grammatically correct sentence.',
      o: ['Neither the manager nor the employees was informed.', 'Neither the manager nor the employees were informed.',
          'Neither the manager or the employees were informed.', 'Neither the manager and the employees were informed.'], a: 1,
      e: '<p>With <b>"neither...nor"</b>, the verb agrees with the <b>nearer</b> subject — here "employees" (plural), so the verb is <b>"were"</b>.</p><p>Also note "neither" must pair with "nor", not "or" (option c) — a fixed correlative pairing that is itself a common error-spotting target.</p>' },

    { q: 'Choose the sentence free of a dangling modifier.',
      o: ['Walking to school, the rain started suddenly.', 'Walking to school, I was caught in sudden rain.',
          'The rain started, walking to school suddenly.', 'To walk to school, the rain was sudden.'], a: 1,
      e: '<p>The opening participle phrase "Walking to school" must describe the <b>grammatical subject that immediately follows it</b>. Only in option (b) is that subject ("I") actually the one doing the walking.</p><p>In option (a), the sentence literally claims the rain was walking to school — the classic dangling-modifier absurdity that the question format exploits.</p>' },

    { q: 'Choose the grammatically correct sentence.',
      o: ['She likes reading, writing, and to paint.', 'She likes reading, writing, and painting.',
          'She likes to read, writing, and painting.', 'She likes read, write, and paint.'], a: 1,
      e: '<p>Items joined in a list must share the <b>same grammatical form</b> — here, all three should be gerunds ("-ing" forms): <b>reading, writing, and painting</b>.</p><p>Option (a) breaks parallelism by switching to an infinitive ("to paint") partway through the list — a very common and specifically-named error type (faulty parallelism).</p>' },

    { q: 'Choose the correctly punctuated/worded sentence.',
      o: ['He is more taller than his brother.', 'He is more tall than his brother.',
          'He is taller than his brother.', 'He is much more taller than his brother.'], a: 2,
      e: '<p><b>"Taller"</b> alone is correct — the comparative degree is already marked by the "-er" suffix, so adding "more" as well is a <b>double comparative</b>, which is always an error in standard English.</p><p>This rule extends to superlatives: "most best", "most tallest" are equally wrong for the same reason — never stack two markers of the same degree.</p>' },

    { q: 'Choose the sentence with the correct preposition.',
      o: ['She is married with a doctor.', 'She is married to a doctor.',
          'She is married by a doctor.', 'She is married of a doctor.'], a: 1,
      e: '<p>The fixed collocation is "married <b>to</b>" — English preposition choice is often idiomatic rather than logical, and this pairing simply has to be learned rather than derived.</p><p>Similar fixed pairs worth memorising: "different <b>from</b>", "good <b>at</b>", "capable <b>of</b>", "interested <b>in</b>".</p>' },

    { q: 'Convert to passive voice: "The manager will announce the results tomorrow."',
      o: ['The results will be announced by the manager tomorrow.', 'The results were announced by the manager tomorrow.',
          'The results are announced by the manager tomorrow.', 'The results will announce by the manager tomorrow.'], a: 0,
      e: '<p>The active future "will announce" becomes the passive future <b>"will be announced"</b> — the modal "will" is retained, and "be + past participle" replaces the active verb form. The object "the results" becomes the new subject.</p><p>Option (d) drops the required "be", which is a very common error when students convert modal-verb sentences to passive voice.</p>' },

    { q: 'Choose the sentence free of redundancy.',
      o: ['Please return back the book to the library.', 'Please return the book to the library.',
          'Please return back again the book to the library.', 'Please repeat and return back the book.'], a: 1,
      e: '<p>"Return" already means "to go/give back" — adding "back" is redundant, since the meaning of "back" is already contained in "return".</p><p>This class of error ("return back", "repeat again", "each and every", "free gift", "final outcome") is a recurring category in error-spotting questions: the fix is always to delete the redundant word, not to reword the sentence.</p>' }
  ]
});
