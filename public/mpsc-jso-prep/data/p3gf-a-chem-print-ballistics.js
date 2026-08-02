/* Paper III, Part B — General Forensic (100 marks, 10 topics x 10).
   Common paper for ALL divisions. Topics I-III here. */

window.MPSC.units.push({
  id: 'p3gf1',
  paper: 'Paper III — General Forensic',
  title: 'I. Forensic Chemistry',
  marks: 10,
  syllabus: 'Narcotic drugs, psychotropic substances and control substances. Corrosive chemicals - hydrochloric acid, sulphuric acid, nitric acid and Alkalis. Chemical separation techniques - Solvent extraction, Solid phase extraction and solid phase microextraction. Legal definition of Arson and motives. Definition of explosives, deflagration and detonation. Characteristics of high and low explosives. Definition and components of improvised explosive device IED.',

  notes: [
    { h: 'Narcotics and the NDPS Act',
      b: '<p>The <b>Narcotic Drugs and Psychotropic Substances Act, 1985</b> is the controlling statute. Distinguish the two families:</p>' +
         '<ul><li><b>Narcotic drug</b> — derived from or related to opium, coca or cannabis. Opium, morphine, heroin (diacetylmorphine), codeine, cocaine, charas, ganja.</li>' +
         '<li><b>Psychotropic substance</b> — acts on the mind; largely synthetic. LSD, amphetamine, methamphetamine, MDMA, diazepam.</li></ul>' +
         '<p>The Act grades punishment by quantity: <b>small quantity</b>, <b>lesser than commercial</b>, and <b>commercial quantity</b>. Section 27 covers consumption; Section 20 cannabis; Section 21 manufactured drugs.</p>' +
         '<p><b>Presumptive (colour) tests</b> — screening only, never confirmatory:</p>' +
         '<table><tr><th>Test</th><th>Detects</th><th>Positive colour</th></tr>' +
         '<tr><td><b>Marquis</b></td><td>Opiates (morphine, heroin)</td><td>Purple / violet</td></tr>' +
         '<tr><td><b>Marquis</b></td><td>Amphetamine, MDMA</td><td>Orange → brown</td></tr>' +
         '<tr><td><b>Scott (cobalt thiocyanate)</b></td><td>Cocaine</td><td>Blue</td></tr>' +
         '<tr><td><b>Duquenois–Levine</b></td><td>Cannabis</td><td>Purple (into chloroform layer)</td></tr>' +
         '<tr><td><b>Van Urk</b></td><td>LSD</td><td>Blue-purple</td></tr>' +
         '<tr><td><b>Mandelin</b></td><td>Ketamine, amphetamines</td><td>Orange / brown</td></tr></table>' +
         '<p>Confirmation requires an instrumental method — <b>GC-MS is the gold standard</b>, since mass spectrometry gives a molecular fingerprint.</p>' },

    { h: 'Corrosives',
      b: '<table><tr><th>Acid</th><th>Formula</th><th>Forensic note</th></tr>' +
         '<tr><td>Hydrochloric</td><td>HCl</td><td>Fumes in moist air; gives white precipitate with AgNO₃</td></tr>' +
         '<tr><td>Sulphuric</td><td>H₂SO₄</td><td>Dense, oily, strongly dehydrating — chars organic matter black. Used in acid attacks</td></tr>' +
         '<tr><td>Nitric</td><td>HNO₃</td><td>Turns proteins/skin <b>yellow</b> — the xanthoproteic reaction</td></tr></table>' +
         '<p>Alkalis: NaOH and KOH, soapy to touch, saponify fats and cause deep liquefactive necrosis. Acid burns cause coagulative necrosis; alkali burns penetrate deeper and are more damaging.</p>' },

    { h: 'Separation techniques',
      b: '<ul><li><b>Solvent (liquid–liquid) extraction</b> — partitions an analyte between two immiscible liquids according to its <b>partition coefficient</b>. pH control is the key lever: acidic drugs extract from acidified solution, basic drugs from alkaline solution.</li>' +
         '<li><b>SPE (solid phase extraction)</b> — analyte retained on a solid sorbent cartridge, washed, then eluted. Uses less solvent and gives cleaner extracts than LLE.</li>' +
         '<li><b>SPME (solid phase microextraction)</b> — a coated fused-silica fibre adsorbs analyte, typically from headspace, then desorbs it directly in the GC injector. <b>Solvent-free</b>; the standard method for fire debris and volatiles.</li></ul>' },

    { h: 'Arson and explosives',
      b: '<p><b>Arson</b> is the malicious and wilful burning of property. Motives: insurance fraud, revenge, vandalism, concealment of another crime, excitement/pyromania, and extremism.</p>' +
         '<p>Fire needs the <b>fire tetrahedron</b>: fuel, oxygen, heat, and an uninhibited chain reaction. An <b>accelerant</b> (usually petrol or kerosene) speeds spread; residues are recovered by headspace or SPME and identified by GC-MS. <b>Point of origin</b> is traced by V-shaped burn patterns, deepest charring and alligatoring.</p>' +
         '<p><b>Deflagration vs detonation</b> — the single most examinable distinction here:</p>' +
         '<table><tr><th></th><th>Deflagration</th><th>Detonation</th></tr>' +
         '<tr><td>Wave</td><td>Subsonic — travels by thermal conduction</td><td><b>Supersonic</b> — a shock wave</td></tr>' +
         '<tr><td>Speed</td><td>cm/s to m/s</td><td>1,000–9,000 m/s</td></tr>' +
         '<tr><td>Explosive class</td><td><b>Low</b> — gunpowder, black powder</td><td><b>High</b> — TNT, RDX, PETN</td></tr>' +
         '<tr><td>Effect</td><td>Pushing, heaving</td><td>Shattering (<b>brisance</b>)</td></tr></table>' +
         '<p><b>High explosives</b> subdivide into <em>primary</em> (very sensitive, used in detonators — lead azide, mercury fulminate) and <em>secondary</em> (needs a booster — TNT, RDX, PETN, ANFO).</p>' +
         '<p>An <b>IED</b> has five components: <b>power source, initiator/detonator, explosive charge, switch/trigger, and container</b>.</p>' }
  ],

  questions: [
    { q: 'The Marquis reagent gives a purple-violet colour with', o: ['Cocaine', 'Opiates such as morphine and heroin', 'Cannabis', 'LSD'], a: 1,
      e: '<p>Marquis + opiates → <b>purple/violet</b>. With amphetamine and MDMA it goes orange to brown instead, so the same reagent distinguishes two drug classes by colour.</p><p>Cocaine is Scott (blue), cannabis is Duquenois–Levine (purple into the chloroform layer), LSD is Van Urk. All are <b>presumptive</b> only — confirmation needs GC-MS.</p>' },

    { q: 'Detonation differs from deflagration principally in that detonation', o: ['Produces more smoke', 'Propagates as a supersonic shock wave', 'Requires no oxidiser', 'Occurs only in liquid explosives'], a: 1,
      e: '<p>Detonation propagates <b>faster than the speed of sound in the material</b>, as a shock wave at 1,000–9,000 m/s. Deflagration is subsonic and spreads by thermal conduction.</p><p>This is why high explosives <b>shatter</b> (brisance) while low explosives like gunpowder push and heave — the basis of scene interpretation after a blast.</p>' },

    { q: 'Which is classified as a primary high explosive?', o: ['TNT', 'RDX', 'Lead azide', 'ANFO'], a: 2,
      e: '<p><b>Lead azide</b> is a primary explosive — highly sensitive to heat, friction and shock, so it is used in <b>detonators</b> to initiate the main charge.</p><p>TNT, RDX and ANFO are secondary explosives: relatively insensitive, requiring a booster, which is precisely what makes them safe enough to handle in bulk.</p>' },

    { q: 'Nitric acid causes a characteristic yellow discolouration of skin and protein because of', o: ['Saponification', 'The xanthoproteic reaction', 'Coagulative necrosis alone', 'Dehydration and charring'], a: 1,
      e: '<p>The <b>xanthoproteic reaction</b> nitrates aromatic amino acid residues (tyrosine, tryptophan), producing a yellow product that deepens to orange with alkali.</p><p>Charring and dehydration to a black mass is characteristic of <b>sulphuric</b> acid; saponification of fats is what alkalis do.</p>' },

    { q: 'Solid phase microextraction (SPME) is particularly suited to fire debris analysis because it', o: ['Requires large solvent volumes', 'Is solvent-free and samples the headspace directly', 'Destroys the sample', 'Works only on aqueous samples'], a: 1,
      e: '<p>SPME uses a coated fibre that adsorbs volatiles from the <b>headspace</b> above the debris, then desorbs them straight into the GC injector — <b>no solvent at all</b>.</p><p>That matters because a solvent peak can mask the light hydrocarbons that identify petrol, and because the debris itself is preserved for re-analysis.</p>' },

    { q: 'The five components of an improvised explosive device are power source, initiator, explosive charge, container and', o: ['Accelerant', 'Switch or trigger', 'Fuse cord only', 'Propellant'], a: 1,
      e: '<p>The five are <b>power source, initiator/detonator, explosive charge, switch/trigger, container</b>. The switch is the component that decides <em>when</em> it functions — victim-operated, timer, command or remote.</p><p>Post-blast, recovering switch fragments is a priority because the switch type speaks directly to intent and to the bomb-maker\'s signature.</p>' },

    { q: 'Under the NDPS Act, 1985, punishment for an offence is graded principally according to', o: ['The purity of the drug', 'The quantity involved — small, intermediate or commercial', 'The age of the accused', 'Whether the drug is natural or synthetic'], a: 1,
      e: '<p>The NDPS Act grades sentences by <b>quantity</b>: small quantity, quantity lesser than commercial, and commercial quantity, with the thresholds notified per substance.</p><p>Purity is not the statutory trigger — the Supreme Court in <em>Hira Singh v. Union of India</em> (2020) held that the <b>whole weight of the mixture</b>, not just the pure drug content, is counted. That makes quantity determination the single most consequential laboratory finding in an NDPS case.</p>' }
  ]
});

window.MPSC.units.push({
  id: 'p3gf2',
  paper: 'Paper III — General Forensic',
  title: 'II. Forensic Fingerprints',
  marks: 10,
  syllabus: 'Definition & history of Fingerprint identification, Basis for the science of Fingerprints, Fingerprint as Forensic evidence. Types of fingerprint - visible fingerprints & latent fingerprints and plastic prints. Class and individual characteristics. Automatic Fingerprint Identification system (AFIS), Methods of developing latent fingerprints. Poroscopy and edgeoscopy.',

  notes: [
    { h: 'History — heavily tested, and India is central to it',
      b: '<ul><li><b>Nehemiah Grew</b> (1684) — first scientific description of ridges and pores.</li>' +
         '<li><b>Jan Evangelista Purkinje</b> (1823) — first classification into nine ridge patterns.</li>' +
         '<li><b>Sir William Herschel</b> — used fingerprints on contracts in <b>Jungipoor, Bengal</b>, from 1858.</li>' +
         '<li><b>Henry Faulds</b> (1880) — proposed forensic use in <em>Nature</em>; first to use a print to clear a suspect.</li>' +
         '<li><b>Sir Francis Galton</b> (1892) — <em>Finger Prints</em>; established <b>permanence and individuality</b>, and named the minutiae still called <b>Galton details</b>.</li>' +
         '<li><b>Sir Edward Henry</b>, with <b>Azizul Haque</b> and <b>Hem Chandra Bose</b>, developed the <b>Henry Classification System</b> at Calcutta. The world\'s <b>first Fingerprint Bureau was established at Calcutta in 1897</b>.</li>' +
         '<li><b>Juan Vucetich</b> (Argentina, 1892) — first murder solved by fingerprint evidence (the Francisca Rojas case).</li></ul>' },

    { h: 'The two governing principles',
      b: '<ol><li><b>Individuality (uniqueness)</b> — no two fingerprints, even from identical twins, are the same. Twins share DNA but ridge detail is shaped by random intrauterine forces, so it is <em>not</em> genetically determined.</li>' +
         '<li><b>Permanence (persistence)</b> — ridges form by about the <b>fourth month of foetal life</b> and remain unchanged until decomposition. Superficial injury regenerates identically; only damage to the <b>dermal papillae</b> leaves a permanent scar, which itself becomes an identifying feature.</li></ol>' },

    { h: 'Patterns and characteristics',
      b: '<p><b>Class characteristics</b> (pattern types, roughly by frequency): <b>Loops ~60–65%</b> (ulnar and radial), <b>Whorls ~30–35%</b> (plain, central pocket, double loop, accidental), <b>Arches ~5%</b> (plain and tented).</p>' +
         '<p>Landmarks: the <b>delta</b> (triradius) and the <b>core</b>. Arches have <b>no delta</b>; loops have <b>one</b>; whorls have <b>two or more</b> — a reliable one-mark question. <b>Ridge counting</b> is used for loops, <b>ridge tracing</b> for whorls.</p>' +
         '<p><b>Individual characteristics (minutiae / Galton details)</b>: ridge ending, bifurcation, island/dot, lake/enclosure, spur/hook, bridge, trifurcation. Identification rests on the type, number and <b>relative position</b> of these.</p>' +
         '<p><b>Poroscopy</b> (Locard) — identification from the size, shape and distribution of <b>sweat pores</b> on the ridges. <b>Edgeoscopy</b> (Chatterjee) — identification from the <b>edge contours</b> of ridges. Both are third-level detail, used when only a small fragment is available.</p>' },

    { h: 'Types of print and development methods',
      b: '<ul><li><b>Patent (visible)</b> — made in a visible medium: blood, ink, grease.</li>' +
         '<li><b>Latent</b> — invisible, from sweat and sebaceous residue; requires development.</li>' +
         '<li><b>Plastic (moulded)</b> — impressed into a soft surface: wax, putty, soap.</li></ul>' +
         '<table><tr><th>Method</th><th>Surface</th><th>Targets</th></tr>' +
         '<tr><td>Powder dusting</td><td>Non-porous, smooth</td><td>Moisture and oils</td></tr>' +
         '<tr><td><b>Ninhydrin</b></td><td><b>Porous</b> — paper, card</td><td><b>Amino acids</b> → purple "Ruhemann\'s purple"</td></tr>' +
         '<tr><td>DFO / 1,2-indanedione</td><td>Porous</td><td>Amino acids → fluorescent; more sensitive than ninhydrin</td></tr>' +
         '<tr><td><b>Cyanoacrylate (superglue) fuming</b></td><td><b>Non-porous</b></td><td>Polymerises on residue → white ridges</td></tr>' +
         '<tr><td>Silver nitrate</td><td>Porous</td><td><b>Chlorides</b> → dark on light exposure</td></tr>' +
         '<tr><td>Iodine fuming</td><td>Porous, fresh prints</td><td>Fats/oils; <b>transient</b> — must be fixed and photographed at once</td></tr>' +
         '<tr><td>Small Particle Reagent</td><td><b>Wet</b> non-porous</td><td>Lipids</td></tr></table>' +
         '<p><b>AFIS</b> stores minutiae templates and returns a <em>ranked candidate list</em>. It does not make an identification — <b>a trained examiner makes the final comparison</b>, conventionally by the ACE-V methodology (Analysis, Comparison, Evaluation, Verification).</p>' }
  ],

  questions: [
    { q: 'The world\'s first Fingerprint Bureau was established in 1897 at', o: ['London', 'Calcutta', 'Buenos Aires', 'Paris'], a: 1,
      e: '<p>The first Fingerprint Bureau was set up at <b>Calcutta</b> in 1897, under Sir Edward Henry with <b>Azizul Haque</b> and <b>Hem Chandra Bose</b>, who did the substantive mathematical work behind the Henry Classification System.</p><p>Scotland Yard\'s bureau followed in 1901. Given the Mizoram GK paper\'s Indian focus, the Calcutta priority is very likely to be asked.</p>' },

    { q: 'Which fingerprint pattern type has no delta?', o: ['Loop', 'Whorl', 'Plain arch', 'Central pocket loop'], a: 2,
      e: '<p>A <b>plain arch has no delta</b>; a loop has exactly one; a whorl has two or more. A <b>tented</b> arch may show a rudimentary delta-like formation, which is why the question specifies <em>plain</em>.</p><p>Counting deltas is the fastest route to pattern classification and a reliable exam point.</p>' },

    { q: 'Ninhydrin develops latent prints on porous surfaces by reacting with', o: ['Chlorides', 'Amino acids', 'Lipids and oils', 'Water'], a: 1,
      e: '<p>Ninhydrin reacts with <b>amino acids</b> in sweat residue to give <b>Ruhemann\'s purple</b>. Because amino acids soak into and stay within paper fibres, it works on documents even years later.</p><p>Silver nitrate targets chlorides; iodine fuming targets fats. Matching reagent to residue component is the standard framing of this question.</p>' },

    { q: 'Cyanoacrylate (superglue) fuming is the method of choice for', o: ['Paper documents', 'Non-porous surfaces such as plastic and glass', 'Wet surfaces', 'Skin of a deceased person only'], a: 1,
      e: '<p>Cyanoacrylate vapour polymerises on the moisture and organic residue of a latent print, forming a durable <b>white</b> ridge deposit on <b>non-porous</b> surfaces.</p><p>Its practical advantage is that the developed print is physically stable, so it can subsequently be dyed or dusted and photographed without loss. For porous paper, ninhydrin or DFO is used instead.</p>' },

    { q: 'Identical twins have different fingerprints because ridge detail is', a: 1,
      o: ['Determined by a recessive gene', 'Shaped by random forces during foetal development', 'Formed only after birth', 'Altered by the environment throughout life'],
      e: '<p>Ridge patterns form between roughly the 10th and 16th weeks in utero under <b>random</b> mechanical and fluid forces on the volar pads. They are influenced by genetics only in general pattern tendency, not in fine detail.</p><p>This is why fingerprints defeat identical twins where <b>DNA does not</b> — a contrast examiners like precisely because it links two topics of this paper.</p>' },

    { q: 'Poroscopy refers to identification based on', o: ['The edges of friction ridges', 'The sweat pores on friction ridges', 'The pattern of the delta', 'Ridge counts between core and delta'], a: 1,
      e: '<p><b>Poroscopy</b> (Edmond Locard) uses the number, size, shape and position of <b>sweat pores</b>. <b>Edgeoscopy</b> (Salil Kumar Chatterjee) uses ridge <b>edge contours</b> — that is option (a), the intended near-miss.</p><p>Both are third-level detail, reserved for fragmentary prints with too few conventional minutiae.</p>' },

    { q: 'The role of AFIS in a fingerprint investigation is to', o: ['Make the final identification automatically', 'Produce a ranked list of candidates for examiner comparison', 'Develop latent prints chemically', 'Classify prints into arches, loops and whorls only'], a: 1,
      e: '<p>AFIS searches minutiae templates and returns a <b>ranked candidate list</b>. The identification decision remains with a <b>trained examiner</b> performing a visual comparison, conventionally under ACE-V.</p><p>This distinction matters legally: an AFIS "hit" is an investigative lead, not evidence of identity, and stating otherwise in court would be indefensible.</p>' }
  ]
});

window.MPSC.units.push({
  id: 'p3gf3',
  paper: 'Paper III — General Forensic',
  title: 'III. Forensic Ballistics',
  marks: 10,
  syllabus: 'Definition and scope. Types of evidences associated. Ammunition components. Types of Firearms - Shotgun, revolver, pistol, rifle and country made firearms. Gunshot Residue (GSR) - meaning and importance. Internal and external ballistics. Types of tool marks - class and individual characteristics. Forensic significance of glass and paint. Comparison microscope and its application in Forensic.',

  notes: [
    { h: 'The four branches of ballistics',
      b: '<ol><li><b>Internal</b> — from firing pin strike until the projectile leaves the muzzle. Chamber pressure, burning rate, recoil.</li>' +
         '<li><b>External</b> — flight through air. Trajectory, drag, gravity drop, yaw.</li>' +
         '<li><b>Terminal</b> — effect on striking the target. Penetration, wound ballistics.</li>' +
         '<li><b>Transitional/intermediate</b> — the brief muzzle-exit phase where propellant gases still act.</li></ol>' },

    { h: 'Firearms and ammunition',
      b: '<p><b>Rifled</b> weapons (rifle, pistol, revolver) have helical grooves imparting spin for stability. <b>Smoothbore</b> weapons (shotgun) do not.</p>' +
         '<table><tr><th>Weapon</th><th>Key feature</th></tr>' +
         '<tr><td><b>Revolver</b></td><td>Rotating cylinder; <b>does not eject</b> cases — they stay in the cylinder, so no cases at the scene</td></tr>' +
         '<tr><td><b>Pistol</b> (semi-auto)</td><td>Box magazine; <b>ejects</b> cases automatically after each shot</td></tr>' +
         '<tr><td><b>Rifle</b></td><td>Long rifled barrel, high velocity</td></tr>' +
         '<tr><td><b>Shotgun</b></td><td>Smoothbore; fires pellets/shot; measured in <b>gauge/bore</b></td></tr>' +
         '<tr><td><b>Country-made</b></td><td>Improvised; crude or absent rifling — often makes individualisation impossible</td></tr></table>' +
         '<p><b>Cartridge components:</b> case, primer, propellant (smokeless powder), and bullet/projectile. Shotgun shells add a <b>wad</b> separating powder from shot.</p>' +
         '<p><b>Bore measurement:</b> rifled arms use <em>calibre</em> (bore diameter in inches or mm). Shotguns use <b>gauge</b>, defined as the number of lead balls of bore diameter that weigh one pound — so a <b>smaller gauge number means a larger bore</b>, which is counter-intuitive and therefore examined.</p>' },

    { h: 'Marks and individualisation',
      b: '<p><b>Class characteristics</b> — shared by all items from a manufacturing process: calibre, number of lands and grooves, direction (right or left) and width of twist.</p>' +
         '<p><b>Individual characteristics</b> — from random tool wear and use, unique to one weapon: striations on the bullet from lands and grooves, and on the cartridge case the <b>firing pin impression, breech face marks, extractor and ejector marks</b>.</p>' +
         '<p>The <b>comparison microscope</b> — two compound microscopes joined by an optical bridge — lets the examiner view a questioned and a test-fired specimen <b>side by side in one field</b>. Introduced by Philip Gravelle and popularised by Calvin Goddard, it is the foundational instrument of the discipline and equally applicable to toolmarks, fibres and hair.</p>' },

    { h: 'Gunshot residue and range',
      b: '<p><b>GSR</b> comes from primer and propellant. The characteristic signature is spheroidal particles of <b>lead (Pb), barium (Ba) and antimony (Sb)</b> fused together — analysed by <b>SEM-EDX</b>, which shows both morphology and elemental composition.</p>' +
         '<p>Chemical tests: <b>Dermal nitrate/paraffin test</b> (diphenylamine — obsolete, non-specific); <b>Walker test</b> for <b>nitrites</b> around a bullet hole to estimate range; <b>Griess test</b> likewise; <b>sodium rhodizonate</b> for lead.</p>' +
         '<p><b>Range of firing</b> from residue pattern:</p>' +
         '<ul><li><b>Contact</b> — muzzle imprint, searing, blackening, <em>stellate/cruciate</em> tearing over bone, soot within the wound track.</li>' +
         '<li><b>Close (a few cm)</b> — soot/blackening plus tattooing.</li>' +
         '<li><b>Intermediate</b> — <b>tattooing/stippling</b> from unburnt powder embedding in skin; cannot be wiped away.</li>' +
         '<li><b>Distant</b> — no residue; only the entry wound with an abrasion collar.</li></ul>' +
         '<p><b>Entry vs exit wound:</b> entry is usually smaller, round, with an <b>abrasion collar</b> and inverted margins; exit is larger, irregular, everted, with no abrasion collar and no residue.</p>' },

    { h: 'Glass and paint',
      b: '<p><b>Glass</b> — compared by refractive index and density; elemental profile by ICP-MS. Fracture analysis: <b>radial</b> cracks form first and start on the side <em>opposite</em> the impact, <b>concentric</b> cracks form second. The <b>3R rule</b> — <em>Radial cracks form Right angles on the Reverse side</em> — gives the direction of impact. With multiple impacts, a new fracture <b>terminates</b> at an existing one, establishing the order of shots. A high-velocity projectile leaves a <b>cone-shaped hole widening in the direction of travel</b>.</p>' +
         '<p><b>Paint</b> — chiefly a hit-and-run evidence type. Layer sequence and colour are compared microscopically; binder and pigment identified by FTIR and pyrolysis GC-MS. Multi-layer automotive paint can be matched to make, model and year through databases such as PDQ.</p>' }
  ],

  questions: [
    { q: 'At a shooting scene no cartridge cases are recovered, though several shots were fired. This most suggests the weapon was a', o: ['Semi-automatic pistol', 'Revolver', 'Assault rifle', 'Shotgun'], a: 1,
      e: '<p>A <b>revolver retains its fired cases in the cylinder</b> — there is no automatic ejection. Pistols, rifles and semi-auto shotguns all eject cases at the scene.</p><p>The reasoning is not conclusive (a shooter may collect cases), but absence of cases with multiple shots fired is a classic revolver indicator and a favourite MCQ scenario.</p>' },

    { q: 'Gunshot residue is characteristically identified by the presence of fused particles containing', o: ['Iron, nickel and chromium', 'Lead, barium and antimony', 'Copper, zinc and tin', 'Sodium, potassium and calcium'], a: 1,
      e: '<p>Primer residue produces spheroidal particles fusing <b>Pb, Ba and Sb</b>. It is the combination in a single spheroidal particle — not any element alone — that is considered characteristic.</p><p><b>SEM-EDX</b> is the confirmatory method because it shows morphology and elemental composition together. Note that lead-free primers are increasingly used, which complicates this classic signature.</p>' },

    { q: 'The 3R rule in glass fracture analysis states that', o: ['Radial cracks form Right angles on the Reverse side of impact', 'Ring cracks Radiate Rightwards', 'Three Radial cracks indicate a Ricochet', 'Radial cracks always Return to the Rim'], a: 0,
      e: '<p><b>Radial cracks form Right angles on the Reverse side</b> — examine the stress lines on a radial crack edge; where they are perpendicular to a surface, that surface is the one <em>opposite</em> the impact.</p><p>Combined with the rule that a later fracture terminates at an earlier one, this establishes both the direction and the sequence of impacts — often decisive in reconstructing a shooting.</p>' },

    { q: 'Tattooing (stippling) around a wound indicates firing from', o: ['Contact range', 'Intermediate range', 'Distant range', 'Any range'], a: 1,
      e: '<p><b>Tattooing</b> is punctate abrasion caused by unburnt powder grains embedding in skin — it occurs at <b>intermediate range</b> and, being intradermal, <b>cannot be wiped off</b>.</p><p>Contact range shows muzzle imprint, searing and soot in the wound track; distant range shows no residue at all. The wipe-off test distinguishes tattooing from mere soot deposition.</p>' },

    { q: 'Which is a class characteristic of a fired bullet?', o: ['Striations from individual barrel imperfections', 'The number and twist direction of lands and grooves', 'Firing pin impression depth variation', 'Random breech face marks'], a: 1,
      e: '<p><b>Number, width and twist direction of lands and grooves</b> are determined by the manufacturing process and shared by every barrel of that model — class characteristics, which can only <em>exclude</em> or narrow to a group.</p><p>Individualisation to one weapon requires <b>striations</b> from random tool wear. Options (a), (c) and (d) are all individual characteristics.</p>' },

    { q: 'In shotgun terminology, a 12-gauge barrel compared with a 20-gauge barrel is', o: ['Smaller in diameter', 'Larger in diameter', 'The same diameter but longer', 'Always rifled'], a: 1,
      e: '<p>Gauge is the number of lead balls of bore diameter making up one pound, so a <b>smaller gauge number means a larger bore</b>. 12-gauge is therefore <b>wider</b> than 20-gauge.</p><p>The inverse relationship is deliberately counter-intuitive and is examined for exactly that reason. Note also that shotguns are <b>smoothbore</b>, so option (d) is wrong on a second count.</p>' },

    { q: 'The comparison microscope is essential in firearms examination because it', o: ['Magnifies more than a compound microscope', 'Allows two specimens to be viewed side by side in a single field', 'Determines elemental composition', 'Measures refractive index'], a: 1,
      e: '<p>Two microscopes joined by an <b>optical bridge</b> place a questioned bullet and a test-fired bullet in one visual field, so striations can be aligned and matched directly.</p><p>Magnification is not the point — a compound microscope can magnify as much. Elemental composition is SEM-EDX; refractive index is a glass method.</p>' }
  ]
});
