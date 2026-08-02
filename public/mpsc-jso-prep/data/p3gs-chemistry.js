/* Paper III, Part A — General Science, UNIT II: CHEMICAL SCIENCE (36 marks). */

window.MPSC.units.push({
  id: 'p3c1',
  paper: 'Paper III — Chemistry',
  title: 'Atomic Structure, Periodic Properties and Bonding',
  marks: 10,
  syllabus: 'Quantum numbers, shapes of orbitals, Aufbau principle, Pauli\'s principle, Hund\'s rule. Properties of elements - atomic radii, ionic radii, ionization energy, electron affinity, electronegativity, oxidation state, covalent character in ionic compounds; ionic character in covalent compounds. Hybridization; VSEPR theory, valence bond theory, molecular orbital theory, crystal field theory; hydrogen bonding.',

  notes: [
    { h: 'Quantum numbers and electron filling',
      b: '<table><tr><th>Number</th><th>Symbol</th><th>Values</th><th>Determines</th></tr>' +
         '<tr><td>Principal</td><td>n</td><td>1, 2, 3…</td><td>Shell, size and energy</td></tr>' +
         '<tr><td>Azimuthal</td><td>l</td><td>0 to n−1</td><td>Subshell and <b>shape</b> (s, p, d, f)</td></tr>' +
         '<tr><td>Magnetic</td><td>m<sub>l</sub></td><td>−l to +l</td><td><b>Orientation</b></td></tr>' +
         '<tr><td>Spin</td><td>m<sub>s</sub></td><td>+½ or −½</td><td>Spin direction</td></tr></table>' +
         '<p>Orbitals per subshell: s = 1, p = 3, d = 5, f = 7, holding 2, 6, 10 and 14 electrons. Maximum electrons in a shell = <b>2n²</b>.</p>' +
         '<ul><li><b>Aufbau</b> — fill lowest energy first, by the <b>(n + l) rule</b>: lower n + l fills first, and where two are tied, the lower n wins. This is why <b>4s (n+l = 4) fills before 3d (n+l = 5)</b>.</li>' +
         '<li><b>Pauli exclusion</b> — no two electrons in an atom share all four quantum numbers, so an orbital holds at most two electrons, of opposite spin.</li>' +
         '<li><b>Hund\'s rule</b> — within a subshell, orbitals are singly occupied with parallel spins before any pairing begins.</li></ul>' +
         '<p><b>Anomalous configurations:</b> Cr is [Ar]3d⁵4s¹ and Cu is [Ar]3d¹⁰4s¹, because <b>half-filled and fully-filled</b> subshells carry extra exchange-energy stability. These two are asked repeatedly.</p>' },

    { h: 'Periodic trends',
      b: '<table><tr><th>Property</th><th>Across a period (L→R)</th><th>Down a group</th></tr>' +
         '<tr><td>Atomic radius</td><td>Decreases</td><td>Increases</td></tr>' +
         '<tr><td>Ionisation energy</td><td><b>Increases</b></td><td>Decreases</td></tr>' +
         '<tr><td>Electron affinity</td><td>Increases (magnitude)</td><td>Decreases</td></tr>' +
         '<tr><td>Electronegativity</td><td><b>Increases</b></td><td>Decreases</td></tr>' +
         '<tr><td>Metallic character</td><td>Decreases</td><td>Increases</td></tr></table>' +
         '<p>Across a period, nuclear charge rises while electrons enter the same shell, so effective nuclear charge increases and the atom contracts. Down a group, a new shell is added and shielding rises, so size grows and the outer electrons are held less tightly.</p>' +
         '<p><b>Exceptions worth knowing:</b> ionisation energy dips from Be to B (a 2p electron is easier to remove than a 2s) and from N to O (removing one of O\'s paired 2p electrons relieves repulsion). <b>Fluorine has a lower electron affinity than chlorine</b>, because F\'s small size makes the incoming electron feel strong repulsion — so Cl, not F, has the highest electron affinity in the whole table. <b>Fluorine is the most electronegative element</b> (4.0 on the Pauling scale) — do not confuse electronegativity with electron affinity.</p>' +
         '<p><b>Ionic radii:</b> a cation is <em>smaller</em> than its parent atom, an anion <em>larger</em>. For an isoelectronic series (N³⁻, O²⁻, F⁻, Na⁺, Mg²⁺, Al³⁺ — all 10 electrons), radius <b>decreases as nuclear charge rises</b>.</p>' +
         '<p><b>Fajans\' rules</b> — covalent character in an ionic bond increases with a <b>small, highly charged cation</b>, a <b>large, highly charged anion</b>, and a cation with a noble-gas-unlike (d¹⁰) configuration. This is why AlCl₃ is appreciably covalent while NaCl is not.</p>' },

    { h: 'Bonding, hybridisation and VSEPR',
      b: '<table><tr><th>Hybridisation</th><th>Electron geometry</th><th>Angle</th><th>Example</th></tr>' +
         '<tr><td>sp</td><td>Linear</td><td>180°</td><td>BeCl₂, C₂H₂, CO₂</td></tr>' +
         '<tr><td>sp²</td><td>Trigonal planar</td><td>120°</td><td>BF₃, C₂H₄</td></tr>' +
         '<tr><td>sp³</td><td>Tetrahedral</td><td>109.5°</td><td>CH₄, NH₄⁺</td></tr>' +
         '<tr><td>sp³d</td><td>Trigonal bipyramidal</td><td>90°, 120°</td><td>PCl₅</td></tr>' +
         '<tr><td>sp³d²</td><td>Octahedral</td><td>90°</td><td>SF₆</td></tr></table>' +
         '<p><b>VSEPR</b>: electron pairs arrange to minimise repulsion, in the order <b>lone pair–lone pair &gt; lone pair–bond pair &gt; bond pair–bond pair</b>. Lone pairs therefore compress bond angles — the reason CH₄ (no lone pair) is 109.5°, NH₃ (one) is 107°, and H₂O (two) is 104.5°. All three are sp³; only the <em>molecular</em> shape differs (tetrahedral, pyramidal, bent).</p>' +
         '<p><b>Molecular orbital theory</b> — bond order = (bonding − antibonding electrons)/2. It succeeds where valence bond theory fails: <b>O₂ is paramagnetic</b> because it has two unpaired electrons in π* orbitals, a fact VB theory cannot explain. Bond orders: N₂ = 3, O₂ = 2, F₂ = 1, and <b>Ne₂ = 0</b>, so it does not exist.</p>' +
         '<p><b>Hydrogen bonding</b> requires H bonded to <b>F, O or N</b>. It explains water\'s anomalously high boiling point, ice being <em>less dense</em> than water (the open tetrahedral lattice), and the double helix of DNA. <b>Intra</b>molecular H-bonding (as in o-nitrophenol) <em>lowers</em> boiling point relative to the para isomer, which forms <b>inter</b>molecular bonds.</p>' }
  ],

  questions: [
    { q: 'The 4s orbital is filled before the 3d orbital because', o: ['4s is closer to the nucleus', '4s has a lower (n + l) value', '3d does not exist in the ground state', '4s can hold more electrons'], a: 1,
      e: '<p>By the <b>(n + l) rule</b>: 4s has n + l = 4 + 0 = 4, while 3d has 3 + 2 = 5. Lower (n + l) fills first, so 4s precedes 3d.</p><p>Where two orbitals have the same (n + l), the one with lower n fills first — which is why 3p (3+1=4) precedes 4s (4+0=4).</p>' },

    { q: 'The bond angle in water (104.5°) is less than the tetrahedral angle because', o: ['Oxygen is sp² hybridised', 'The two lone pairs on oxygen repel the bond pairs more strongly', 'Hydrogen atoms repel each other', 'Water is a linear molecule'], a: 1,
      e: '<p>Water is <b>sp³</b> hybridised with two bond pairs and two lone pairs. Lone pairs occupy more space and repel more strongly, compressing the H–O–H angle from 109.5° to <b>104.5°</b>.</p><p>The trend is systematic: CH₄ 109.5° (no lone pair) → NH₃ 107° (one) → H₂O 104.5° (two). Being able to reproduce that sequence answers most VSEPR questions.</p>' },

    { q: 'The element with the highest electron affinity is', o: ['Fluorine', 'Chlorine', 'Oxygen', 'Helium'], a: 1,
      e: '<p><b>Chlorine</b>, not fluorine. Fluorine\'s very small size means the incoming electron enters a compact 2p shell where inter-electronic repulsion is severe, reducing the energy released.</p><p>Fluorine <em>is</em> the most <b>electronegative</b> element — the distinction between electronegativity (attraction for a shared pair in a bond) and electron affinity (energy released on gaining an electron in the gas phase) is exactly what this question tests.</p>' },

    { q: 'The electronic configuration of chromium (Z = 24) is', o: ['[Ar] 3d⁴ 4s²', '[Ar] 3d⁵ 4s¹', '[Ar] 3d⁶ 4s⁰', '[Ar] 3d³ 4s³'], a: 1,
      e: '<p>Chromium is <b>[Ar] 3d⁵ 4s¹</b>. A <b>half-filled</b> d subshell has extra stability from exchange energy and symmetrical distribution, so one 4s electron is promoted.</p><p>Copper does the same for a <b>fully-filled</b> shell: [Ar] 3d¹⁰ 4s¹. Option (d) is impossible regardless — an s orbital cannot hold three electrons.</p>' },

    { q: 'Which molecule is paramagnetic, a fact explained by molecular orbital theory but not by valence bond theory?', o: ['N₂', 'O₂', 'F₂', 'H₂'], a: 1,
      e: '<p><b>O₂</b> has <b>two unpaired electrons</b> in its degenerate π* antibonding orbitals, making it paramagnetic — liquid oxygen visibly sticks to a magnet.</p><p>The Lewis/VB structure O=O shows all electrons paired and predicts diamagnetism. This failure is the classic argument for MO theory, and among the most-asked comparisons in the topic.</p>' },

    { q: 'In the isoelectronic series N³⁻, O²⁻, F⁻, Na⁺, Mg²⁺, the ionic radius', o: ['Increases with increasing nuclear charge', 'Decreases with increasing nuclear charge', 'Remains constant', 'Is largest for Na⁺'], a: 1,
      e: '<p>All five have <b>10 electrons</b>. As nuclear charge rises from N (7) to Mg (12), the same electron cloud is pulled in more tightly, so <b>radius decreases</b>: N³⁻ &gt; O²⁻ &gt; F⁻ &gt; Na⁺ &gt; Mg²⁺.</p><p>The general rules follow from this — anions are larger than their parent atoms, cations smaller.</p>' },

    { q: 'According to Fajans\' rules, covalent character in an ionic compound is greatest when the cation is', o: ['Large with low charge', 'Small with high charge', 'Large with high charge', 'Small with low charge'], a: 1,
      e: '<p>A <b>small, highly charged cation</b> has high polarising power, distorting the anion\'s electron cloud and introducing covalent character. A <b>large, highly charged anion</b> is correspondingly more polarisable.</p><p>This explains why AlCl₃ (small, 3+ cation) is appreciably covalent and volatile while NaCl is a classic ionic solid.</p>' },

    { q: 'Ice floats on water because hydrogen bonding in ice produces', o: ['A denser packing than liquid water', 'An open tetrahedral lattice that is less dense than liquid water', 'Stronger covalent O–H bonds', 'A complete absence of intermolecular forces'], a: 1,
      e: '<p>In ice each water molecule is hydrogen-bonded to four others in a rigid <b>open tetrahedral lattice</b> containing hexagonal voids, making it <b>less dense</b> than liquid water — where the lattice has partly collapsed.</p><p>Water is therefore anomalous: most substances are denser as solids. The consequence is that lakes freeze from the top down, which is why aquatic life survives winter.</p>' }
  ]
});

window.MPSC.units.push({
  id: 'p3c2',
  paper: 'Paper III — Chemistry',
  title: 'Organic Compounds and Reaction Mechanisms',
  marks: 10,
  syllabus: 'Preparation, properties and interconversions of alkyl and aryl halides, alcohols, phenols, ethers, aldehydes, ketones, carboxylic acids, amines, amides and nitriles. Cleavage of covalent bond, types of reagents, electron displacement mechanisms - Inductive, electromeric, resonance, hyperconjugation, reaction intermediates, SN1 SN2, E1 and E2 mechanisms.',

  notes: [
    { h: 'Bond cleavage, reagents and intermediates',
      b: '<ul><li><b>Homolytic</b> cleavage gives each fragment one electron → <b>free radicals</b>. Favoured by heat, UV light and non-polar solvents.</li>' +
         '<li><b>Heterolytic</b> cleavage gives both electrons to one fragment → <b>ions</b> (carbocation and carbanion). Favoured by polar solvents.</li></ul>' +
         '<p><b>Reagents:</b> a <b>nucleophile</b> is electron-rich and attacks positive centres (OH⁻, CN⁻, NH₃, H₂O — all Lewis bases). An <b>electrophile</b> is electron-deficient and attacks electron-rich centres (NO₂⁺, H⁺, AlCl₃, carbocations — all Lewis acids).</p>' +
         '<p><b>Carbocation stability: 3° &gt; 2° &gt; 1° &gt; methyl</b>, from the electron-releasing inductive effect of alkyl groups and from <b>hyperconjugation</b> (the more α-hydrogens, the greater the stabilisation). <b>Carbanion stability runs the opposite way</b>: methyl &gt; 1° &gt; 2° &gt; 3°, since alkyl groups destabilise a negative charge. Benzyl and allyl cations are exceptionally stable through <b>resonance</b>.</p>' },

    { h: 'Electron displacement effects',
      b: '<ul><li><b>Inductive (I)</b> — permanent polarisation transmitted through <b>sigma</b> bonds; weakens rapidly with distance. −I groups withdraw (NO₂, CN, halogens, COOH); +I groups release (alkyl).</li>' +
         '<li><b>Electromeric (E)</b> — a <b>temporary</b> complete transfer of a π electron pair, occurring only in the presence of an attacking reagent and reversing when it is removed.</li>' +
         '<li><b>Resonance/mesomeric (M)</b> — permanent delocalisation through <b>conjugated π</b> systems. −M withdraw (NO₂, CHO, COOH); +M release (OH, NH₂, OR, halogens).</li>' +
         '<li><b>Hyperconjugation</b> — delocalisation of σ (C–H) electrons into an adjacent empty p orbital or π system, sometimes called "no-bond resonance". It stabilises carbocations and alkenes.</li></ul>' +
         '<p><b>Acidity</b> is explained by these effects: carboxylic acids &gt; phenols &gt; water &gt; alcohols. Phenol is far more acidic than an alcohol because the <b>phenoxide ion is resonance-stabilised</b>. Electron-withdrawing groups raise acidity, so trichloroacetic acid ≫ acetic acid.</p>' +
         '<p><b>Basicity of amines in aqueous solution</b> follows 2° &gt; 1° &gt; 3° &gt; NH₃ — the inductive effect alone would predict 3° highest, but <b>steric hindrance and reduced solvation of the bulky tertiary ammonium ion</b> override it. In the gas phase, where solvation is absent, the order does revert to 3° &gt; 2° &gt; 1°. This reversal is a favourite question.</p>' },

    { h: 'SN1 vs SN2, E1 vs E2',
      b: '<table><tr><th></th><th>S<sub>N</sub>1</th><th>S<sub>N</sub>2</th></tr>' +
         '<tr><td>Steps</td><td>Two — carbocation intermediate</td><td>One, concerted</td></tr>' +
         '<tr><td>Kinetics</td><td><b>First order</b>, rate = k[substrate]</td><td><b>Second order</b>, rate = k[substrate][Nu]</td></tr>' +
         '<tr><td>Favoured by</td><td><b>3°</b> substrates</td><td><b>1°</b> substrates (methyl best)</td></tr>' +
         '<tr><td>Stereochemistry</td><td><b>Racemisation</b> (planar cation attacked from both faces)</td><td><b>Inversion</b> of configuration (Walden inversion)</td></tr>' +
         '<tr><td>Solvent</td><td>Polar <b>protic</b></td><td>Polar <b>aprotic</b></td></tr></table>' +
         '<p>The reactivity orders are exactly opposite — that contrast is the heart of nearly every question here.</p>' +
         '<p><b>Elimination:</b> <b>E1</b> is two-step via a carbocation, first order, and competes with SN1. <b>E2</b> is concerted, second order, requires a <b>strong base</b>, and demands <b>anti-periplanar</b> geometry of the H and leaving group.</p>' +
         '<p><b>Saytzeff (Zaitsev) rule</b> — elimination gives predominantly the <b>more substituted</b>, more stable alkene. With a bulky base such as <em>tert</em>-butoxide, the <b>Hofmann</b> product (less substituted) dominates instead, because steric bulk forces attack at the less hindered hydrogen.</p>' },

    { h: 'Named reactions and functional group tests',
      b: '<ul><li><b>Aldol condensation</b> — aldehyde/ketone with α-hydrogen + dilute base → β-hydroxy carbonyl.</li>' +
         '<li><b>Cannizzaro</b> — aldehyde with <b>no α-hydrogen</b> (e.g. HCHO, benzaldehyde) + concentrated alkali → disproportionation to alcohol and acid.</li>' +
         '<li><b>Iodoform test</b> — positive for CH₃CO– groups and for CH₃CH(OH)– : ethanol and acetaldehyde give it, but <b>methanol and formaldehyde do not</b>.</li>' +
         '<li><b>Tollens\' reagent</b> (ammoniacal AgNO₃) gives a silver mirror with <b>aldehydes only</b>; <b>Fehling\'s</b> gives a red Cu₂O precipitate with aliphatic aldehydes but <b>not</b> with aromatic ones such as benzaldehyde. Both distinguish aldehydes from ketones.</li>' +
         '<li><b>Carbylamine test</b> — primary amine + CHCl₃ + alcoholic KOH → foul-smelling isocyanide. Specific to <b>1° amines</b>.</li>' +
         '<li><b>Markovnikov\'s rule</b> — in HX addition to an unsymmetrical alkene, H goes to the carbon with more hydrogens. Reversed to <b>anti-Markovnikov</b> by peroxides (the Kharasch effect), which switches the mechanism to free-radical.</li></ul>' }
  ],

  questions: [
    { q: 'An SN2 reaction proceeds with', o: ['Racemisation', 'Retention of configuration', 'Inversion of configuration', 'No stereochemical change'], a: 2,
      e: '<p>SN2 is concerted, with the nucleophile attacking from the side <b>opposite</b> the leaving group — producing <b>inversion</b> (Walden inversion), like an umbrella turning inside out.</p><p><b>SN1</b> gives racemisation, because the planar carbocation intermediate can be attacked from either face. Pairing mechanism with stereochemical outcome is the standard framing.</p>' },

    { q: 'The order of carbocation stability is', o: ['methyl > 1° > 2° > 3°', '3° > 2° > 1° > methyl', '1° > 2° > 3° > methyl', 'All are equally stable'], a: 1,
      e: '<p><b>3° &gt; 2° &gt; 1° &gt; methyl.</b> Alkyl groups release electrons inductively and stabilise the positive charge through <b>hyperconjugation</b> — more α-hydrogens means more stabilisation.</p><p>Note that <b>carbanion</b> stability is the exact reverse, since alkyl groups destabilise a negative charge — option (a) is that order, offered as the trap.</p>' },

    { q: 'A tertiary alkyl halide undergoing hydrolysis follows first-order kinetics. The mechanism is', o: ['SN2', 'SN1', 'E2', 'Free radical'], a: 1,
      e: '<p><b>First-order kinetics</b> means only the substrate appears in the rate law, indicating a rate-determining <b>ionisation</b> to a carbocation — the SN1 pathway. Tertiary substrates favour it because the 3° carbocation is stabilised.</p><p>SN2 would be second order, and is in any case sterically blocked at a tertiary centre. Kinetic order plus substrate class together identify the mechanism.</p>' },

    { q: 'Which compound will NOT give a positive iodoform test?', o: ['Ethanol', 'Acetone', 'Methanol', 'Acetaldehyde'], a: 2,
      e: '<p>The iodoform test requires a <b>CH₃CO–</b> group or a <b>CH₃CH(OH)–</b> group. <b>Methanol</b> (CH₃OH) has neither — the methyl carbon bears the OH directly, with no adjacent carbon.</p><p>Ethanol and acetaldehyde qualify, as does acetone. The companion fact: <b>formaldehyde also fails</b> the test, for the same structural reason.</p>' },

    { q: 'Benzaldehyde undergoes the Cannizzaro reaction with concentrated alkali because it', o: ['Has no alpha hydrogen', 'Is aromatic', 'Has a high boiling point', 'Contains a benzene ring'], a: 0,
      e: '<p>The Cannizzaro reaction requires an aldehyde with <b>no α-hydrogen</b>, so aldol condensation is impossible and the molecule instead disproportionates into an alcohol and a carboxylate.</p><p>Formaldehyde behaves identically and is not aromatic at all — which shows aromaticity (option b) is incidental. It is the absence of the α-hydrogen that decides it.</p>' },

    { q: 'In aqueous solution, the basicity order of methylamines is', o: ['3° > 2° > 1° > NH₃', '2° > 1° > 3° > NH₃', 'NH₃ > 1° > 2° > 3°', '1° > 2° > 3° > NH₃'], a: 1,
      e: '<p>In water the observed order is <b>2° &gt; 1° &gt; 3° &gt; NH₃</b>. The inductive effect alone would put 3° highest, but the bulky trialkylammonium ion suffers <b>steric hindrance and poor solvation</b>, which outweighs it.</p><p>In the <b>gas phase</b>, with no solvent, the order does revert to 3° &gt; 2° &gt; 1° &gt; NH₃ — the reversal that makes this a favourite question.</p>' },

    { q: 'Addition of HBr to propene in the presence of peroxide gives predominantly', o: ['2-bromopropane, following Markovnikov\'s rule', '1-bromopropane, anti-Markovnikov addition', 'A racemic mixture of both', 'No reaction'], a: 1,
      e: '<p>Peroxides switch the mechanism from ionic to <b>free-radical</b>, so bromine adds to the terminal carbon — <b>anti-Markovnikov</b> addition, the <b>Kharasch peroxide effect</b>.</p><p>Critically, this works <b>only with HBr</b>. HCl and HI do not show it, because their bond energetics make the radical chain steps unfavourable — a detail examiners like to probe.</p>' },

    { q: 'Hyperconjugation involves the delocalisation of', o: ['Lone pair electrons', 'Sigma (C–H) electrons into an adjacent p orbital or π system', 'Pi electrons in a conjugated system', 'Inner shell electrons'], a: 1,
      e: '<p>Hyperconjugation delocalises <b>σ (C–H) bonding electrons</b> into an adjacent empty p orbital or π system — hence its other name, <b>"no-bond resonance"</b>.</p><p>It stabilises carbocations and alkenes, and the extent scales with the number of <b>α-hydrogens</b>. Option (c) describes ordinary resonance, which involves π rather than σ electrons.</p>' }
  ]
});

window.MPSC.units.push({
  id: 'p3c3',
  paper: 'Paper III — Chemistry',
  title: 'Equilibrium, Kinetics, Electrochemistry and Experimental Analysis',
  marks: 16,
  syllabus: 'Characteristics of equilibrium constant and applications, Kp, Kc, Qp and Qc, Ionization of acids and bases, Ka, Kb, Kw and Ksp, solubility. Concepts of rate, differential and integrated rate expression for zero and first order reactions, order and molecularity of reaction; half life. Variation of conductance for weak and strong electrolytes, Kohlrausch\'s law, Arrhenius theory of electrolytic dissociation, Ostwald\'s dilution law, Electrochemical cell, EMF and Nernst equation; Faradays laws of electrolysis. Volumetric titrimetry; primary and secondary standard; expressing concentration of solution, acid base and redox indicators; concept of group separation in qualitative analysis; theories of distillation, fractional distillation, steam distillation, sublimation, zone refining; solvent extraction: principle and efficiency of the technique, chromatography: classification, principles and efficiency of different techniques.',

  notes: [
    { h: 'Note — this is the largest single unit in Paper III',
      b: '<div class="tip">At <b>16 marks</b> this is the heaviest sub-unit anywhere in the paper, and its second half (titrimetry, distillation, solvent extraction, chromatography) <b>overlaps directly with Forensic Chemistry and Toxicology</b> in Part B. Preparing it well pays twice.</div>' },

    { h: 'Equilibrium',
      b: '<p><b>K<sub>p</sub> = K<sub>c</sub>(RT)^Δn</b>, where Δn = moles of gaseous product − gaseous reactant. When Δn = 0, K<sub>p</sub> = K<sub>c</sub>.</p>' +
         '<p><b>Reaction quotient Q</b> has the same form as K but uses current concentrations. If <b>Q &lt; K</b> the reaction runs forward; <b>Q &gt; K</b>, it runs backward; <b>Q = K</b>, it is at equilibrium.</p>' +
         '<p><b>Le Chatelier:</b> a system at equilibrium shifts to counteract an imposed change. Pressure increase favours the side with fewer gas moles; temperature increase favours the endothermic direction. A <b>catalyst does not shift equilibrium</b> — it speeds both directions equally and only shortens the time to reach it.</p>' +
         '<p><b>Ionic equilibria:</b> K<sub>w</sub> = [H⁺][OH⁻] = 10⁻¹⁴ at 25 °C, so pH + pOH = 14. pH = −log[H⁺].</p>' +
         '<p><b>Ostwald\'s dilution law</b> for a weak electrolyte: K<sub>a</sub> = cα²/(1 − α), and for small α, <b>α ≈ √(K<sub>a</sub>/c)</b> — degree of dissociation rises on dilution.</p>' +
         '<p><b>Solubility product:</b> for A<sub>x</sub>B<sub>y</sub>, K<sub>sp</sub> = (xS)ˣ(yS)ʸ. For AB, K<sub>sp</sub> = S²; for AB₂, K<sub>sp</sub> = 4S³. Precipitation occurs when the ionic product exceeds K<sub>sp</sub>. The <b>common ion effect</b> suppresses solubility — the basis of group separation in qualitative analysis.</p>' },

    { h: 'Chemical kinetics',
      b: '<p><b>Order</b> is experimental — the sum of the exponents in the rate law, and may be zero or fractional. <b>Molecularity</b> is theoretical — the number of species colliding in an elementary step, always a positive integer and never more than three. The distinction is examined constantly.</p>' +
         '<table><tr><th></th><th>Zero order</th><th>First order</th></tr>' +
         '<tr><td>Rate law</td><td>rate = k</td><td>rate = k[A]</td></tr>' +
         '<tr><td>Integrated</td><td>[A] = [A]₀ − kt</td><td>ln[A]₀/[A] = kt</td></tr>' +
         '<tr><td>Half-life</td><td>t½ = [A]₀/2k (<b>depends on concentration</b>)</td><td>t½ = <b>0.693/k</b> (independent of concentration)</td></tr>' +
         '<tr><td>Units of k</td><td>mol L⁻¹ s⁻¹</td><td>s⁻¹</td></tr></table>' +
         '<p>The <b>concentration-independent half-life</b> is the signature of first-order kinetics — and the reason radioactive decay, which is first order, has a fixed half-life.</p>' +
         '<p><b>Arrhenius:</b> k = Ae^(−Ea/RT). Raising temperature or lowering activation energy increases the rate. A <b>catalyst provides an alternative path of lower Ea</b>; it does not alter ΔH or the position of equilibrium.</p>' },

    { h: 'Electrochemistry',
      b: '<p><b>Conductance:</b> specific conductance (κ) <em>falls</em> on dilution (fewer ions per unit volume), while <b>molar conductance (Λ) rises</b>. For a <b>strong</b> electrolyte Λ increases slightly and linearly with √c, extrapolating to Λ°; for a <b>weak</b> electrolyte it rises steeply near infinite dilution, so Λ° cannot be found by extrapolation and must come from <b>Kohlrausch\'s law</b> (Λ° = sum of independent ionic contributions).</p>' +
         '<p><b>Galvanic cell:</b> oxidation at the <b>anode (negative)</b>, reduction at the <b>cathode (positive)</b>. Mnemonics: <em>An Ox, Red Cat</em>. <b>In electrolysis the signs reverse</b> — the anode is positive — though oxidation still occurs there. That sign reversal is a standard trap.</p>' +
         '<p><b>Nernst equation</b> at 298 K: E = E° − (0.0591/n) log Q.</p>' +
         '<p><b>Faraday\'s laws:</b> mass deposited ∝ charge passed (w = ZIt), and for the same charge, masses are proportional to equivalent weights. <b>1 F = 96,500 C</b> deposits one gram-equivalent.</p>' },

    { h: 'Experimental and separation techniques — high forensic overlap',
      b: '<p><b>Titrimetry:</b> a <b>primary standard</b> must be highly pure, stable in air, non-hygroscopic and of high equivalent weight — examples are sodium carbonate, potassium dichromate and oxalic acid. A <b>secondary standard</b> (NaOH, HCl, KMnO₄) is standardised against a primary one because it fails one of those criteria.</p>' +
         '<p><b>Indicators:</b> phenolphthalein (colourless → pink, pH 8.3–10) for strong acid–strong base and weak acid–strong base; methyl orange (red → yellow, pH 3.1–4.4) for strong acid–weak base. <b>KMnO₄ is a self-indicator.</b></p>' +
         '<p><b>Separation methods:</b></p>' +
         '<ul><li><b>Simple distillation</b> — boiling points differing by more than ~25 °C.</li>' +
         '<li><b>Fractional distillation</b> — close boiling points, using a column that provides repeated vaporisation–condensation cycles.</li>' +
         '<li><b>Steam distillation</b> — for compounds that are <b>immiscible with water, volatile in steam, and would decompose at their normal boiling point</b>. The mixture boils below 100 °C because the total vapour pressure is the <em>sum</em> of the components\'. Used for essential oils and aniline.</li>' +
         '<li><b>Sublimation</b> — solid to vapour directly; camphor, naphthalene, iodine, NH₄Cl.</li>' +
         '<li><b>Zone refining</b> — for ultra-pure semiconductors, exploiting the greater solubility of impurities in the molten zone, which is swept along the rod.</li>' +
         '<li><b>Solvent extraction</b> — governed by the <b>partition/distribution coefficient</b>. Crucially, <b>several small portions of solvent extract more than one large portion</b> of the same total volume — the single most examinable quantitative point here.</li></ul>' +
         '<p><b>Chromatography</b> — separation between a <b>stationary</b> and a <b>mobile</b> phase. <b>R<sub>f</sub> = distance travelled by solute ÷ distance travelled by solvent front</b>, always between 0 and 1.</p>' +
         '<table><tr><th>Type</th><th>Mobile phase</th><th>Basis</th></tr>' +
         '<tr><td>Paper / TLC</td><td>Liquid</td><td>Partition / adsorption</td></tr>' +
         '<tr><td>Column</td><td>Liquid</td><td>Adsorption</td></tr>' +
         '<tr><td><b>GC</b></td><td>Inert gas</td><td>Volatility and partition — the forensic workhorse, coupled to MS</td></tr>' +
         '<tr><td><b>HPLC</b></td><td>Liquid under pressure</td><td>For non-volatile and thermally labile compounds</td></tr>' +
         '<tr><td>Ion exchange</td><td>Liquid</td><td>Ionic charge</td></tr></table>' +
         '<p><b>Qualitative analysis group separation</b> relies on selective precipitation using the common ion effect: Group I (dilute HCl) Ag⁺, Pb²⁺, Hg₂²⁺; Group II (H₂S in acid) Cu²⁺, Cd²⁺, As³⁺; Group III (NH₄OH) Fe³⁺, Al³⁺, Cr³⁺; Group IV (H₂S in alkali) Zn²⁺, Mn²⁺, Ni²⁺, Co²⁺; Group V (ammonium carbonate) Ba²⁺, Sr²⁺, Ca²⁺; Group VI Mg²⁺ and alkali metals.</p>' }
  ],

  questions: [
    { q: 'The half-life of a first-order reaction', o: ['Is directly proportional to initial concentration', 'Is independent of initial concentration', 'Is inversely proportional to initial concentration', 'Depends on the order only'], a: 1,
      e: '<p>For first order, <b>t½ = 0.693/k</b> — no concentration term. This is the defining kinetic signature of first-order reactions.</p><p>For <b>zero order</b>, t½ = [A]₀/2k, which <em>is</em> proportional to initial concentration (option a). Radioactive decay is first order, which is exactly why a nuclide has a fixed half-life.</p>' },

    { q: 'A catalyst increases the rate of a reaction by', o: ['Increasing the activation energy', 'Providing an alternative path of lower activation energy', 'Shifting the equilibrium to the right', 'Increasing the enthalpy change'], a: 1,
      e: '<p>A catalyst offers an alternative mechanism with <b>lower activation energy</b>, so a larger fraction of collisions succeeds.</p><p>It <b>does not shift equilibrium</b> — it accelerates forward and reverse reactions equally, so only the <em>time taken</em> to reach equilibrium changes. It also leaves ΔH untouched, since ΔH is a state function.</p>' },

    { q: 'Which is a suitable primary standard in volumetric analysis?', o: ['Sodium hydroxide', 'Hydrochloric acid', 'Potassium dichromate', 'Potassium permanganate'], a: 2,
      e: '<p><b>Potassium dichromate</b> is highly pure, stable, non-hygroscopic and of high equivalent weight — a classic primary standard.</p><p>NaOH is <b>hygroscopic and absorbs CO₂</b>; concentrated HCl is volatile with variable concentration; KMnO₄ decomposes slowly in light and always contains some MnO₂. All three are <b>secondary</b> standards, needing standardisation against a primary one.</p>' },

    { q: 'Steam distillation is used for compounds that are', o: ['Soluble in water and non-volatile', 'Immiscible with water, volatile in steam, and liable to decompose at their boiling point', 'Ionic solids', 'Higher boiling than water and water-soluble'], a: 1,
      e: '<p>Steam distillation applies to substances that are <b>immiscible with water, appreciably volatile in steam, and would decompose if heated to their normal boiling point</b>.</p><p>Because the total vapour pressure is the <b>sum</b> of the two components\' partial pressures, the mixture boils <b>below 100 °C</b>, protecting the compound. It is standard for essential oils and aniline.</p>' },

    { q: 'In solvent extraction, extracting with three 20 mL portions of solvent rather than one 60 mL portion gives', o: ['A lower yield', 'A higher yield', 'Exactly the same yield', 'No extraction at all'], a: 1,
      e: '<p><b>Multiple small extractions are more efficient</b> than a single large one of the same total volume. Each stage re-establishes the partition equilibrium against a fresh, solute-free solvent, so the fraction remaining is multiplied down at every step.</p><p>This is the most examinable quantitative point in the technique, and it is applied directly in forensic toxicology when isolating drugs from viscera.</p>' },

    { q: 'The R_f value in chromatography is defined as', o: ['Distance travelled by solvent ÷ distance travelled by solute', 'Distance travelled by solute ÷ distance travelled by solvent front', 'Time taken by solute ÷ time taken by solvent', 'Mass of solute ÷ mass of solvent'], a: 1,
      e: '<p><b>R<sub>f</sub> = distance travelled by the solute ÷ distance travelled by the solvent front</b>, always between 0 and 1.</p><p>Since the solute can never outrun the solvent front, any R<sub>f</sub> above 1 signals a measurement error. Option (a) inverts the ratio — the intended trap.</p>' },

    { q: 'For the reaction N₂ + 3H₂ ⇌ 2NH₃, the relation between Kp and Kc is', o: ['Kp = Kc', 'Kp = Kc(RT)⁻²', 'Kp = Kc(RT)²', 'Kp = Kc(RT)'], a: 1,
      e: '<p>Δn = moles of gaseous products − reactants = 2 − 4 = <b>−2</b>. Since K<sub>p</sub> = K<sub>c</sub>(RT)^Δn, we get <b>K<sub>p</sub> = K<sub>c</sub>(RT)⁻²</b>.</p><p>Count only <b>gaseous</b> species. When Δn = 0 the two constants are equal, which is worth checking first in any such question.</p>' },

    { q: 'Molar conductance of a weak electrolyte on dilution', o: ['Decreases sharply', 'Increases sharply, especially near infinite dilution', 'Remains constant', 'First decreases then increases'], a: 1,
      e: '<p>Dilution increases the <b>degree of dissociation</b> of a weak electrolyte (Ostwald\'s dilution law), so molar conductance rises steeply near infinite dilution.</p><p>Because that rise is asymptotic, Λ° <b>cannot</b> be obtained by extrapolation as it can for a strong electrolyte — it must be calculated from <b>Kohlrausch\'s law</b>. Note that <em>specific</em> conductance always falls on dilution.</p>' },

    { q: 'The number of coulombs required to deposit one gram-equivalent of a substance in electrolysis is', o: ['9,650', '96,500', '6.02 × 10²³', '1,000'], a: 1,
      e: '<p>One <b>faraday = 96,500 C</b> deposits one gram-equivalent. This follows from Faraday\'s first law, w = ZIt.</p><p>The figure is the charge on one mole of electrons: 1.6 × 10⁻¹⁹ C × 6.02 × 10²³ ≈ 96,500 C — worth being able to reconstruct rather than merely recall.</p>' },

    { q: 'If the reaction quotient Q is less than the equilibrium constant K, the reaction will', o: ['Proceed in the forward direction', 'Proceed in the reverse direction', 'Be at equilibrium', 'Stop entirely'], a: 0,
      e: '<p><b>Q &lt; K</b> means products are under-represented relative to equilibrium, so the reaction proceeds <b>forward</b> to make more product and raise Q toward K.</p><p>Q &gt; K drives it backward; Q = K means equilibrium. Comparing Q with K is the standard way to predict the direction of a reaction from a given set of concentrations.</p>' },

    { q: 'In a galvanic cell, oxidation occurs at the', o: ['Cathode, which is positive', 'Anode, which is negative', 'Anode, which is positive', 'Cathode, which is negative'], a: 1,
      e: '<p>In a <b>galvanic</b> cell, oxidation occurs at the <b>anode</b>, which is the <b>negative</b> terminal (electrons are released there and flow out to the external circuit).</p><p><b>In electrolysis the polarity reverses</b> — the anode becomes positive — though oxidation still occurs there. Option (c) is that electrolytic case, and confusing the two is the classic error.</p>' },

    { q: 'The solubility product of a sparingly soluble salt AB₂ with solubility S is', o: ['S²', 'S³', '4S³', '27S⁴'], a: 2,
      e: '<p>AB₂ dissociates to give A²⁺ at concentration S and B⁻ at concentration 2S. So K<sub>sp</sub> = (S)(2S)² = <b>4S³</b>.</p><p>Compare: for AB, K<sub>sp</sub> = S²; for AB₃, K<sub>sp</sub> = 27S⁴. Derive the stoichiometric coefficients each time rather than memorising — the pattern is (xS)ˣ(yS)ʸ.</p>' }
  ]
});
