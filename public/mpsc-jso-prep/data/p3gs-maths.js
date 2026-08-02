/* Paper III, Part A — General Science, UNIT III: MATHEMATICS (30 marks).
   The syllabus offers Biological Science (30) OR Mathematics (30). Mathematics chosen. */

window.MPSC.units.push({
  id: 'p3m1',
  paper: 'Paper III — Mathematics',
  title: 'Sets, Relations and Functions',
  marks: 10,
  syllabus: 'Sets and their representation; Union, intersection and complement of sets and their algebraic properties; Power set, Relations, type of relations, equivalence relations, functions; one-one, into and onto functions, the composition of functions.',

  notes: [
    { h: 'Sets and the counting formulae',
      b: '<p><b>Power set:</b> if |A| = n then |P(A)| = <b>2ⁿ</b>. The number of <em>proper</em> subsets is 2ⁿ − 1 (excluding A itself); the empty set is a subset of every set.</p>' +
         '<p><b>Inclusion–exclusion</b> — the workhorse for numerical questions:</p>' +
         '<ul><li>|A ∪ B| = |A| + |B| − |A ∩ B|</li>' +
         '<li>|A ∪ B ∪ C| = |A| + |B| + |C| − |A∩B| − |B∩C| − |A∩C| + |A∩B∩C|</li></ul>' +
         '<p><b>De Morgan\'s laws:</b> (A ∪ B)′ = A′ ∩ B′ and (A ∩ B)′ = A′ ∪ B′. Union and intersection are commutative, associative and mutually distributive.</p>' +
         '<p><b>Cartesian product:</b> |A × B| = |A| × |B|. The number of <b>relations</b> from A to B is 2^(mn), since a relation is any subset of A × B.</p>' },

    { h: 'Types of relation',
      b: '<p>A relation R on a set A is:</p>' +
         '<ul><li><b>Reflexive</b> — (a, a) ∈ R for every a ∈ A.</li>' +
         '<li><b>Symmetric</b> — (a, b) ∈ R ⟹ (b, a) ∈ R.</li>' +
         '<li><b>Transitive</b> — (a, b) ∈ R and (b, c) ∈ R ⟹ (a, c) ∈ R.</li>' +
         '<li><b>Equivalence relation</b> — all three together.</li></ul>' +
         '<p>An equivalence relation <b>partitions</b> the set into disjoint equivalence classes. Standard examples: equality; congruence modulo n; parallelism of lines; similarity of triangles.</p>' +
         '<p><b>Watch the classic traps.</b> "Perpendicular to" is symmetric but <em>not</em> reflexive and <em>not</em> transitive. "Is a subset of" is reflexive and transitive but <em>not</em> symmetric. "Is the brother of" is not symmetric (the sibling may be a sister). On a set with n elements there are <b>2^(n²)</b> relations in total.</p>' },

    { h: 'Functions',
      b: '<ul><li><b>One-one (injective)</b> — distinct inputs give distinct outputs. f(x₁) = f(x₂) ⟹ x₁ = x₂. Graphically, the horizontal line test.</li>' +
         '<li><b>Onto (surjective)</b> — every element of the codomain is attained, i.e. range = codomain.</li>' +
         '<li><b>Bijective</b> — both. Only a bijection has an inverse.</li>' +
         '<li><b>Into</b> — not onto: some codomain element is unattained.</li></ul>' +
         '<p><b>Counting functions</b> from a set of size m to a set of size n:</p>' +
         '<ul><li>Total functions: <b>nᵐ</b></li>' +
         '<li>One-one functions: <b>ⁿPₘ</b>, and only if n ≥ m</li>' +
         '<li>Onto functions require n ≤ m</li></ul>' +
         '<p><b>Composition:</b> (f ∘ g)(x) = f(g(x)) — apply <b>g first</b>. Composition is <b>associative but not commutative</b>. If f and g are both one-one then f ∘ g is one-one; likewise for onto. And (f ∘ g)⁻¹ = g⁻¹ ∘ f⁻¹ — the order reverses.</p>' }
  ],

  questions: [
    { q: 'If a set A has 5 elements, the number of elements in its power set is', o: ['10', '25', '32', '120'], a: 2,
      e: '<p>|P(A)| = <b>2ⁿ = 2⁵ = 32</b>.</p><p>Do not confuse this with 5² = 25 or 5! = 120, both offered as distractors. The number of <em>proper</em> subsets would be 31.</p>' },

    { q: 'In a class of 60 students, 35 play cricket, 30 play football and 15 play both. The number who play neither is', o: ['5', '10', '15', '20'], a: 1,
      e: '<p>|C ∪ F| = 35 + 30 − 15 = <b>50</b> play at least one game. Therefore 60 − 50 = <b>10</b> play neither.</p><p>The commonest error is forgetting to subtract the overlap, giving 65 — which exceeds the class size and should immediately signal the mistake.</p>' },

    { q: 'The relation "is perpendicular to" on the set of all lines in a plane is', o: ['An equivalence relation', 'Symmetric but neither reflexive nor transitive', 'Reflexive and transitive but not symmetric', 'Transitive only'], a: 1,
      e: '<p>It is <b>symmetric</b> (if L₁ ⊥ L₂ then L₂ ⊥ L₁), but <b>not reflexive</b> (no line is perpendicular to itself) and <b>not transitive</b> (if L₁ ⊥ L₂ and L₂ ⊥ L₃ then L₁ is <em>parallel</em> to L₃, not perpendicular).</p><p>Contrast with "is parallel to", which <em>is</em> an equivalence relation — the pairing examiners like to exploit.</p>' },

    { q: 'The number of one-one functions from a set with 3 elements to a set with 5 elements is', o: ['15', '60', '125', '243'], a: 1,
      e: '<p>One-one functions number <b>⁵P₃ = 5 × 4 × 3 = 60</b> — choose a distinct image for each of the 3 inputs in order.</p><p>5³ = 125 counts <em>all</em> functions, and 3⁵ = 243 reverses the roles. Note that no one-one function exists when the domain is larger than the codomain.</p>' },

    { q: 'If f(x) = 2x + 3 and g(x) = x², then (f ∘ g)(2) equals', o: ['11', '19', '49', '25'], a: 0,
      e: '<p>(f ∘ g)(2) = f(g(2)) — apply <b>g first</b>: g(2) = 4, then f(4) = 2(4) + 3 = <b>11</b>.</p><p>Reversing the order gives (g ∘ f)(2) = g(7) = 49, which is offered as option (c). Composition is <b>not commutative</b>, and this is exactly how that is tested.</p>' },

    { q: 'A relation R on a set A is an equivalence relation if it is', o: ['Reflexive and symmetric only', 'Symmetric and transitive only', 'Reflexive, symmetric and transitive', 'Reflexive and transitive only'], a: 2,
      e: '<p>All three properties are required. An equivalence relation <b>partitions</b> the set into disjoint equivalence classes.</p><p>Each of the other options is a genuine but weaker structure — reflexive + transitive alone is a <em>preorder</em>, for instance — which is why they make plausible distractors.</p>' },

    { q: 'The total number of relations from a set with 3 elements to a set with 2 elements is', o: ['6', '8', '64', '512'], a: 2,
      e: '<p>A relation is any <b>subset of A × B</b>. Here |A × B| = 3 × 2 = 6, so the number of subsets is <b>2⁶ = 64</b>.</p><p>The trap is answering 6 (the size of the Cartesian product) rather than the number of its subsets. Compare: the number of <em>functions</em> from A to B would be 2³ = 8.</p>' }
  ]
});

window.MPSC.units.push({
  id: 'p3m2',
  paper: 'Paper III — Mathematics',
  title: 'Permutations and Combinations',
  marks: 10,
  syllabus: 'The fundamental principle of counting, permutations and combinations; Meaning of P(n, r) and C(n, r). Simple applications.',

  notes: [
    { h: 'The core formulae',
      b: '<p><b>Fundamental principle of counting:</b> if one task can be done in m ways and a second independently in n ways, both can be done in m × n ways (multiplication for "and", addition for "or").</p>' +
         '<ul><li><b>Permutation</b> — arrangement, <b>order matters</b>: <b>ⁿPᵣ = n! / (n − r)!</b></li>' +
         '<li><b>Combination</b> — selection, <b>order does not matter</b>: <b>ⁿCᵣ = n! / [r!(n − r)!]</b></li>' +
         '<li>Relation: <b>ⁿPᵣ = ⁿCᵣ × r!</b></li></ul>' +
         '<div class="tip"><b>The decision rule.</b> Ask whether rearranging the chosen items produces a different outcome. A <em>committee</em> of 3 from 10 is a combination; the offices of <em>president, secretary and treasurer</em> filled from 10 is a permutation. Handshakes and diagonals are combinations; seating and ranking are permutations.</div>' },

    { h: 'Useful identities and standard cases',
      b: '<ul><li>ⁿC₀ = ⁿCₙ = 1; ⁿC₁ = n; <b>ⁿCᵣ = ⁿCₙ₋ᵣ</b> (so ¹⁰C₈ = ¹⁰C₂ = 45 — always compute the smaller one).</li>' +
         '<li><b>Pascal\'s rule:</b> ⁿCᵣ + ⁿCᵣ₋₁ = ⁿ⁺¹Cᵣ</li>' +
         '<li>Sum of all combinations: ⁿC₀ + ⁿC₁ + … + ⁿCₙ = <b>2ⁿ</b></li>' +
         '<li><b>0! = 1</b> by definition.</li></ul>' +
         '<p><b>Standard cases worth memorising:</b></p>' +
         '<ul><li>Arrangements of n objects with repetitions p, q, r alike: <b>n! / (p! q! r!)</b></li>' +
         '<li><b>Circular</b> permutations of n objects: <b>(n − 1)!</b>; if clockwise and anticlockwise are indistinguishable (a necklace), <b>(n − 1)!/2</b></li>' +
         '<li>Arrangements with r positions and repetition allowed: <b>nʳ</b></li>' +
         '<li>Number of diagonals of an n-sided polygon: <b>ⁿC₂ − n = n(n − 3)/2</b></li>' +
         '<li>Handshakes among n people: <b>ⁿC₂</b></li>' +
         '<li>"At least one" problems: compute the <b>complement</b> — total minus none.</li>' +
         '<li>Items that must stay together: <b>treat the block as one unit</b>, then multiply by the internal arrangements of the block.</li></ul>' }
  ],

  questions: [
    { q: 'The number of ways of selecting a committee of 3 members from 10 people is', o: ['30', '120', '720', '1000'], a: 1,
      e: '<p>A committee has no ranking, so this is a <b>combination</b>: ¹⁰C₃ = (10 × 9 × 8)/(3 × 2 × 1) = <b>120</b>.</p><p>720 is ¹⁰P₃, the answer if the three posts were distinct offices — the intended trap. Always ask whether order matters.</p>' },

    { q: 'The number of different arrangements of the letters of the word "LEVEL" is', o: ['120', '60', '30', '20'], a: 2,
      e: '<p>LEVEL has 5 letters with L twice and E twice. Arrangements = 5! / (2! × 2!) = 120/4 = <b>30</b>.</p><p>Failing to divide by the repeats gives 120 — option (a), and the single commonest error in this topic.</p>' },

    { q: 'In how many ways can 6 people be seated around a circular table?', o: ['720', '120', '60', '6'], a: 1,
      e: '<p>Circular permutations of n objects = <b>(n − 1)! = 5! = 120</b>. One person is fixed as a reference because rotations of the same arrangement are not distinct.</p><p>720 = 6! is the answer for a <em>row</em>. If the arrangement could also be flipped (a necklace or garland), it would be (n−1)!/2 = 60.</p>' },

    { q: 'The number of diagonals in a regular octagon is', o: ['16', '20', '28', '8'], a: 1,
      e: '<p>Diagonals = n(n − 3)/2 = 8 × 5 / 2 = <b>20</b>.</p><p>Equivalently ⁸C₂ − 8 = 28 − 8 = 20: every pair of vertices gives a line, minus the 8 that are sides. Note 28 is offered as the trap — that is ⁸C₂, forgetting to subtract the sides.</p>' },

    { q: 'If ⁿC₈ = ⁿC₂, then n equals', o: ['6', '10', '16', '8'], a: 1,
      e: '<p>Use <b>ⁿCᵣ = ⁿCₙ₋ᵣ</b>. Since the lower indices differ, we need 8 = n − 2, giving <b>n = 10</b>.</p><p>Check: ¹⁰C₈ = ¹⁰C₂ = 45. ✓ The alternative case r₁ = r₂ fails here because 8 ≠ 2.</p>' },

    { q: 'How many 3-digit numbers can be formed from the digits 1 to 9 if repetition is allowed?', o: ['504', '729', '84', '81'], a: 1,
      e: '<p>With repetition allowed each of the 3 positions independently takes any of 9 digits: <b>9³ = 729</b>.</p><p>Without repetition it would be ⁹P₃ = 9 × 8 × 7 = 504, which is option (a). Note the digits start at 1, so there is no leading-zero complication.</p>' },

    { q: 'In how many ways can the letters of the word "CHAIR" be arranged so that the vowels are always together?', o: ['24', '48', '120', '12'], a: 1,
      e: '<p>CHAIR has vowels A and I. Treat them as a single block: this gives 4 units (C, H, R, [AI]) arranged in <b>4! = 24</b> ways, and the block itself internally in <b>2! = 2</b> ways.</p><p>Total = 24 × 2 = <b>48</b>. The block technique — bundle, arrange, then multiply by internal arrangements — handles every "always together" question.</p>' }
  ]
});

window.MPSC.units.push({
  id: 'p3m3',
  paper: 'Paper III — Mathematics',
  title: 'Statistics and Probability',
  marks: 10,
  syllabus: 'Measures of dispersion; calculation of mean, median, mode of grouped and ungrouped data, calculation of standard deviation, variance and mean deviation for grouped and ungrouped data. Probability: Probability of an event, addition and multiplication theorems of probability.',

  notes: [
    { h: 'Measures of central tendency',
      b: '<ul><li><b>Mean</b> = Σx / n (ungrouped) or Σfx / Σf (grouped). Uses every value, so it is <b>most affected by extreme values</b>.</li>' +
         '<li><b>Median</b> — the middle value of ordered data. For even n, the mean of the two middle values. <b>Unaffected by outliers</b>, so it is preferred for skewed data such as income.</li>' +
         '<li><b>Mode</b> — the most frequent value. A data set may have no mode or several.</li></ul>' +
         '<p><b>Empirical relation</b> for a moderately skewed distribution: <b>Mode = 3 Median − 2 Mean</b>. Learn it in this form; it is directly examinable.</p>' +
         '<p>In a perfectly symmetric distribution, mean = median = mode.</p>' },

    { h: 'Measures of dispersion',
      b: '<ul><li><b>Range</b> = maximum − minimum. Crude; uses only two values.</li>' +
         '<li><b>Mean deviation</b> = Σ|x − x̄| / n. Taken about the mean or median; it is <b>least about the median</b>.</li>' +
         '<li><b>Variance</b> σ² = Σ(x − x̄)² / n. Computationally: <b>σ² = (Σx²/n) − x̄²</b>.</li>' +
         '<li><b>Standard deviation</b> σ = √variance. <b>Same units as the data</b>, which is why it is preferred over variance for reporting.</li>' +
         '<li><b>Coefficient of variation</b> = (σ / x̄) × 100. Being dimensionless, it is the correct tool for <b>comparing consistency between two data sets</b> with different units or very different means — a lower CV means greater consistency.</li></ul>' +
         '<p><b>Effect of transformations:</b> adding a constant to every value shifts the mean but <b>leaves σ unchanged</b>. Multiplying every value by k multiplies the mean by k and σ by |k|, and the variance by k². This is a favourite conceptual question.</p>' +
         '<p>Standard deviation of the first n natural numbers: σ = √[(n² − 1)/12].</p>' },

    { h: 'Probability',
      b: '<p>P(E) = favourable outcomes / total outcomes, with <b>0 ≤ P(E) ≤ 1</b>. P(E′) = 1 − P(E).</p>' +
         '<p><b>Addition theorem:</b> P(A ∪ B) = P(A) + P(B) − P(A ∩ B). For <b>mutually exclusive</b> events (which cannot occur together), P(A ∩ B) = 0, so P(A ∪ B) = P(A) + P(B).</p>' +
         '<p><b>Multiplication theorem:</b> P(A ∩ B) = P(A) × P(B|A). For <b>independent</b> events (where one\'s occurrence does not affect the other\'s probability), P(A ∩ B) = P(A) × P(B).</p>' +
         '<div class="tip"><b>Do not conflate mutually exclusive with independent.</b> They are near-opposites: if two events with non-zero probability are mutually exclusive, then one occurring <em>guarantees</em> the other did not — which makes them strongly <b>dependent</b>. Two events cannot be both mutually exclusive and independent unless one has probability zero.</div>' +
         '<p><b>Reference counts:</b> a standard deck has <b>52 cards</b>, 4 suits of 13, <b>26 red and 26 black</b>, 12 face cards (J, Q, K), and 4 aces. Two dice give <b>36</b> outcomes; a sum of 7 occurs in 6 of them, making it the most likely total.</p>' +
         '<p>For "at least one" problems, compute the <b>complement</b>: P(at least one) = 1 − P(none).</p>' }
  ],

  questions: [
    { q: 'If every observation in a data set is increased by 5, the standard deviation', o: ['Increases by 5', 'Decreases by 5', 'Remains unchanged', 'Is multiplied by 5'], a: 2,
      e: '<p>Standard deviation measures <b>spread about the mean</b>. Adding a constant shifts every value <em>and</em> the mean equally, so every deviation (x − x̄) is unchanged — and so is σ.</p><p>By contrast, <b>multiplying</b> every value by k multiplies σ by |k| and the variance by k². Distinguishing shift from scale is the point of the question.</p>' },

    { q: 'For a moderately skewed distribution, mean = 30 and median = 28. The mode is approximately', o: ['24', '26', '32', '29'], a: 0,
      e: '<p>Mode = 3 Median − 2 Mean = 3(28) − 2(30) = 84 − 60 = <b>24</b>.</p><p>Sanity check: in a positively skewed distribution the order is mode &lt; median &lt; mean, and 24 &lt; 28 &lt; 30 fits. If your answer breaks that ordering, you have misapplied the formula.</p>' },

    { q: 'Two events A and B are mutually exclusive with P(A) = 0.3 and P(B) = 0.4. Then P(A ∪ B) is', o: ['0.12', '0.58', '0.7', '0.1'], a: 2,
      e: '<p>Mutually exclusive means P(A ∩ B) = 0, so P(A ∪ B) = 0.3 + 0.4 = <b>0.7</b>.</p><p>0.12 would be P(A) × P(B) — correct only for <b>independent</b> events, and these are not independent. Mutually exclusive events with non-zero probability are in fact strongly dependent.</p>' },

    { q: 'A card is drawn from a well-shuffled deck of 52. The probability that it is a red king is', o: ['1/26', '1/13', '1/52', '2/13'], a: 0,
      e: '<p>There are <b>2 red kings</b> (hearts and diamonds), so P = 2/52 = <b>1/26</b>.</p><p>1/13 would be the probability of any king (4/52); 1/52 a specific single card. Careless reading of "red king" as "king" is the intended slip.</p>' },

    { q: 'The measure of dispersion best suited to comparing the consistency of two data sets with different means is', o: ['Range', 'Standard deviation', 'Coefficient of variation', 'Mean deviation'], a: 2,
      e: '<p>The <b>coefficient of variation</b> = (σ / x̄) × 100 is a <b>relative, dimensionless</b> measure, so it can compare sets with different units or very different magnitudes. <b>Lower CV means greater consistency.</b></p><p>Standard deviation is absolute — a σ of 5 is large for a mean of 10 but negligible for a mean of 10,000, which is precisely why it cannot be used for this comparison.</p>' },

    { q: 'Two dice are thrown. The probability that the sum is 7 is', o: ['1/6', '1/12', '5/36', '7/36'], a: 0,
      e: '<p>There are 36 equally likely outcomes. A sum of 7 arises from 6 of them — (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) — giving 6/36 = <b>1/6</b>.</p><p>7 is the <b>most probable total</b> with two dice, having more combinations than any other sum. Counting ordered pairs rather than unordered is essential here.</p>' },

    { q: 'The median of the data 12, 7, 15, 9, 20, 11 is', o: ['11', '11.5', '12', '13'], a: 1,
      e: '<p>Order first: 7, 9, 11, 12, 15, 20. With <b>n = 6</b> (even), the median is the mean of the 3rd and 4th values = (11 + 12)/2 = <b>11.5</b>.</p><p>Two errors are being probed: failing to sort the data, and taking a single middle value when n is even.</p>' },

    { q: 'The probability of getting at least one head in three tosses of a fair coin is', o: ['3/8', '1/2', '7/8', '1/8'], a: 2,
      e: '<p>Use the <b>complement</b>: P(no head) = P(three tails) = (1/2)³ = 1/8. So P(at least one head) = 1 − 1/8 = <b>7/8</b>.</p><p>The complement method is far faster than summing the cases of exactly one, two and three heads, and it is the standard approach for every "at least one" question.</p>' }
  ]
});
