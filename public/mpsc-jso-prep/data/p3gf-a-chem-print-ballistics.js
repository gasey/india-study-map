/* Paper III, Part B — General Forensic (100 marks, 10 topics x 10).
   Common paper for ALL divisions. Topics I-III here. */

window.MPSC.units.push({
  id: 'p3gf1',
  paper: 'Paper III — General Forensic',
  title: 'I. Forensic Chemistry',
  marks: 10,
  syllabus: 'Narcotic drugs, psychotropic substances and control substances. Corrosive chemicals - hydrochloric acid, sulphuric acid, nitric acid and Alkalis. Chemical separation techniques - Solvent extraction, Solid phase extraction and solid phase microextraction. Legal definition of Arson and motives. Definition of explosives, deflagration and detonation. Characteristics of high and low explosives. Definition and components of improvised explosive device IED.',

  notes: [
    { h: 'Narcotics, Psychotropics and the NDPS Act, 1985',
      b: '<p>The <b>Narcotic Drugs and Psychotropic Substances Act, 1985</b> is the controlling statute in India. Distinguish the three statutory categories:</p>' +
         '<ul><li><b>Narcotic drug</b> — derived from or chemically related to opium (papaverine, morphine, codeine, thebaine, semi-synthetic heroin/diacetylmorphine), coca leaf (cocaine) or cannabis (charas/hashish resin, ganja flowering tops, bhang leaves).</li>' +
         '<li><b>Psychotropic substance</b> — synthetic or natural substance acting on the central nervous system to alter mood, perception or consciousness: LSD, amphetamine, methamphetamine, MDMA (ecstasy), ketamine, benzodiazepines (diazepam, alprazolam), barbiturates.</li>' +
         '<li><b>Controlled substance (precursor chemical)</b> — chemicals used in the illicit manufacture of narcotic drugs or psychotropic substances (Section 9A): <b>acetic anhydride</b> (converts morphine to heroin), <b>ephedrine / pseudoephedrine</b> (precursor for methamphetamine), anthranilic acid, ergotamine.</li></ul>' +
         '<p>The Act grades punishment by quantity: <b>small quantity</b>, <b>lesser than commercial (intermediate)</b>, and <b>commercial quantity</b> (e.g., Heroin: small = 5 g, commercial = 250 g; Cannabis/Ganja: small = 1000 g, commercial = 20 kg; Cocaine: small = 2 g, commercial = 100 g). Section 27 covers consumption; Section 20 cannabis; Section 21 manufactured drugs.</p>' +
         '<div class="analogy"><b>💡 Analogy — Presumptive Colour Test vs GC-MS Confirmation:</b> A presumptive colour test (like Marquis) is like a <b>building security guard glancing at a visitor\'s badge colour from 10 feet away</b> — fast and great for screening out obvious cases, but aspirin or sugar mixtures can sometimes fool the eye. <b>GC-MS (Gas Chromatography–Mass Spectrometry)</b> first separates the mixture in a race down a long capillary tube (GC) and then smashes each pure molecule into fragments to record its unique mass spectrum (MS) — like a <b>full biometric fingerprint scan</b> that is legally indisputable in court.</div>' +
         '<p><b>Presumptive (colour) tests</b> — screening only, never confirmatory:</p>' +
         '<table><tr><th>Test</th><th>Detects</th><th>Positive colour</th></tr>' +
         '<tr><td><b>Marquis</b> (formaldehyde + conc. H₂SO₄)</td><td>Opiates (morphine, heroin, codeine)</td><td>Purple / violet</td></tr>' +
         '<tr><td><b>Marquis</b></td><td>Amphetamine, methamphetamine, MDMA</td><td>Orange → reddish-brown (MDMA goes purple-black)</td></tr>' +
         '<tr><td><b>Scott (cobalt thiocyanate)</b></td><td>Cocaine</td><td>Blue (3-step test: blue precipitate → dissolves pink in HCl → blue returns in chloroform layer)</td></tr>' +
         '<tr><td><b>Duquenois–Levine</b> (vanillin + acetaldehyde + HCl)</td><td>Cannabis (THC / cannabinoids)</td><td>Purple extracted into the lower chloroform layer</td></tr>' +
         '<tr><td><b>Van Urk / Ehrlich</b> (p-DMAB)</td><td>LSD (indole alkaloids)</td><td>Blue-purple</td></tr>' +
         '<tr><td><b>Mandelin</b> (ammonium metavanadate + H₂SO₄)</td><td>Ketamine, amphetamines, methadone</td><td>Deep orange / reddish-brown</td></tr>' +
         '<tr><td><b>Simon\'s test</b> (nitroprusside + acetaldehyde)</td><td>Secondary amines (methamphetamine, MDMA)</td><td>Deep blue (distinguishes methamphetamine from primary amine amphetamine)</td></tr>' +
         '<tr><td><b>Zwikker\'s / Dille-Koppanyi</b></td><td>Barbiturates</td><td>Violet-blue</td></tr></table>' +
         '<p>Confirmation requires an instrumental method — <b>GC-MS, LC-MS/MS or FTIR</b>, since mass spectrometry and infrared spectroscopy give a molecular fingerprint.</p>' },

    { h: 'Corrosive Chemicals: Acids and Alkalis',
      b: '<table><tr><th>Corrosive</th><th>Formula</th><th>Forensic & Clinical Hallmarks</th></tr>' +
         '<tr><td><b>Hydrochloric acid</b> (Muriatic acid)</td><td>HCl</td><td>Colourless/faint yellow liquid that fumes in moist air; does not char organic matter; gives curdy <b>white precipitate of AgCl with AgNO₃</b> soluble in ammonia. Greyish-white eschar on skin/mucosa.</td></tr>' +
         '<tr><td><b>Sulphuric acid</b> (Oil of Vitriol)</td><td>H₂SO₄</td><td>Dense, heavy, oily, odourless liquid; intensely hygroscopic/dehydrating — extracts water from carbohydrates/tissues leaving a <b>black charred mass (carbonisation)</b>. Most commonly misused in <b>vitriolage (acid attacks)</b>; punishable under BNS Sections 124(1)/124(2) (formerly IPC 326A/326B). Confirmatory test: white precipitate of BaSO₄ with <b>Barium Chloride (BaCl₂)</b> insoluble in HNO₃.</td></tr>' +
         '<tr><td><b>Nitric acid</b> (Aqua Fortis)</td><td>HNO₃</td><td>Powerful oxidising agent; turns proteins, skin, nails and hair bright <b>yellow</b> via the <b>xanthoproteic reaction</b> (nitration of aromatic benzene rings in tyrosine and tryptophan), deepening to orange with alkali. Gives brown fumes of NO₂ with copper turnings.</td></tr>' +
         '<tr><td><b>Alkalis</b> (Caustic soda / potash)</td><td>NaOH, KOH, NH₄OH</td><td>Soapy, slimy feel to touch; <b>saponify fats</b> and dissolve proteins causing <b>liquefactive necrosis</b>. Unlike acids (which form a hard coagulative crust that limits deeper penetration), alkalis continue burrowing deep into tissues, frequently causing oesophageal perforation and strictures.</td></tr></table>' +
         '<div class="clarity"><b>⚡ Concept Clarity — Coagulative vs Liquefactive Necrosis:</b> Strong <b>acids</b> denature and clot tissue proteins into a tough leathery eschar (<b>coagulative necrosis</b>), which acts as a partial barrier against deeper seepage. Strong <b>alkalis</b> saponify lipids and dissolve protein matrices into a soft, gelatinous soup (<b>liquefactive necrosis</b>), allowing the chemical to penetrate far deeper into the eye or oesophagus.</div>' },

    { h: 'Chemical Separation Techniques',
      b: '<ul><li><b>Solvent (liquid–liquid) extraction (LLE)</b> — partitions an analyte between two immiscible liquid phases (aqueous + organic solvent like chloroform/ether/ethyl acetate) according to the <b>Nernst Distribution Law</b> ($K_D = C_o / C_{aq}$). <b>pH control is the master lever</b> because unionised drugs dissolve in organic solvents while ionised salts stay in water:<ul>' +
         '<li><b>Acidic drugs</b> (barbiturates, salicylates, phenytoin) are unionised at low pH → extract into organic solvent from an <b>acidified</b> aqueous solution.</li>' +
         '<li><b>Basic drugs</b> (morphine, heroin, cocaine, amphetamines, strychnine) are unionised at high pH → extract into organic solvent from an <b>alkaline</b> aqueous solution.</li></ul></li>' +
         '<li><b>SPE (Solid Phase Extraction)</b> — passes liquid sample through a cartridge packed with a chromatographic solid sorbent (e.g., C18 reverse-phase silica or ion-exchange resin) in four steps: <b>Condition → Load → Wash impurities → Elute target analyte</b>. Uses far less organic solvent, eliminates emulsion problems of LLE, and yields cleaner extracts.</li>' +
         '<li><b>SPME (Solid Phase Microextraction)</b> — invented by Janusz Pawliszyn; uses a retractable fused-silica fibre coated with a Stationary polymeric phase (e.g., PDMS). Exposed directly to liquid or the <b>vapour headspace</b> above a sealed sample vial, then thermally desorbed straight inside the hot injection port of a Gas Chromatograph. <b>100% solvent-free</b>; the gold-standard method for volatile fire accelerants and blood volatiles.</li></ul>' +
         '<div class="example"><b>🔬 Worked Example — Fire Debris Accelerant Recovery via Headspace SPME + GC-MS:</b><br>' +
         '<b>Scenario:</b> Charred carpet remnants from a suspected arson scene are sealed in an airtight nylon fire-debris bag or clean paint can.<br>' +
         '<b>Step 1 (Passive Headspace Heating):</b> The sealed container is warmed to 60–80 °C for 30 minutes so volatile hydrocarbon residues vaporise into the air space (headspace) above the ash.<br>' +
         '<b>Step 2 (SPME Fibre Adsorption):</b> A syringe needle housing a PDMS-coated SPME fibre pierces the septum; the fibre extends into the headspace for 15 minutes, trapping hydrocarbon vapours without touching the dirty soot or using any liquid solvent.<br>' +
         '<b>Step 3 (Thermal Desorption & GC-MS):</b> The fibre is retracted and inserted directly into the 250 °C GC injector. Because <b>no solvent was used</b>, there is no giant solvent peak at the start of the chromatogram to mask light C₅–C₈ alkanes/toluene/xylenes. The resulting total ion chromatogram (TIC) displays the classic homologous alkane + C₂/C₃-alkylbenzene pattern of <b>petrol (gasoline)</b>.</div>' },

    { h: 'Arson, Explosives and IEDs',
      b: '<p><b>Arson</b> is the wilful and malicious burning or charring of property (covered under BNS Section 326, formerly IPC Sections 435/436). Common motives: <b>insurance fraud / financial gain, revenge/spite, vandalism/malice, concealment of another crime (homicide/burglary), excitement/pyromania, and political extremism/sabotage</b>.</p>' +
         '<p>Fire requires the <b>fire tetrahedron</b>: fuel, oxygen (oxidiser), heat (ignition energy), and an uninhibited chemical chain reaction. An <b>accelerant</b> (petrol, kerosene, diesel, turpentine) speeds fire spread and leaves diagnostic pour patterns ("trailers", "puddle shapes", spalling, low burning). <b>Point of origin</b> is located by V-shaped burn patterns (the apex points down to the seat of fire), deepest wood charring, "alligatoring" of blistered char, and first-blown fuses.</p>' +
         '<div class="analogy"><b>💡 Analogy — Deflagration vs Detonation:</b> Imagine a line of <b>dominoes</b>. <b>Deflagration</b> is like pushing the first domino so each one falls only after physically touching and heating its neighbour — fast, subsonic, and great for steadily pushing a bullet down a gun barrel. <b>Detonation</b> is like hitting the entire table with a <b>supersonic sledgehammer shockwave</b> — the compressive shock front travels at 1,000–9,000 m/s through the explosive crystal lattice, snapping chemical bonds instantaneously and shattering everything around it (<b>brisance</b>).</div>' +
         '<div class="vs-grid">' +
         '<div class="vs-card"><h4>🔥 Deflagration (Low Explosives)</h4><ul>' +
         '<li><b>Propagation:</b> Subsonic flame front (&lt; speed of sound, cm/s to ~300 m/s) driven by <b>thermal conduction</b> and hot gas transfer.</li>' +
         '<li><b>Examples:</b> Black powder (KNO₃ + charcoal + sulphur, 75:15:10), smokeless gunpowders (single-base nitrocellulose; double-base NC + nitroglycerine), pyrotechnics/fireworks.</li>' +
         '<li><b>Confinement needed?</b> Yes — requires confinement (e.g., cartridge case or pipe) to build explosive pressure.</li>' +
         '<li><b>Mechanical effect:</b> Pushing, heaving, propelling (no shattering crater).</li></ul></div>' +
         '<div class="vs-card"><h4>💥 Detonation (High Explosives)</h4><ul>' +
         '<li><b>Propagation:</b> <b>Supersonic shock wave</b> (1,000–9,000 m/s) compressing and decomposing the explosive directly.</li>' +
         '<li><b>Examples:</b> TNT (~6,900 m/s), RDX (~8,750 m/s), PETN (~8,400 m/s), HMX, Dynamite, ANFO, TATP.</li>' +
         '<li><b>Confinement needed?</b> No — detonates with devastating effect even in open air.</li>' +
         '<li><b>Mechanical effect:</b> <b>Brisance</b> — extreme shattering, cratering at seat of blast, micro-pitting and shock fragmentation.</li></ul></div>' +
         '</div>' +
         '<div class="vs-grid">' +
         '<div class="vs-card"><h4>⚡ Primary High Explosives (Initiators)</h4><p>Extremely sensitive to heat, friction, spark or impact. Used in tiny quantities inside <b>detonators / blasting caps / primers</b> to generate the initial shock wave.<br><b>Examples:</b> Lead azide ($\\text{Pb(N}_3)_2$), Mercury fulminate ($\\text{Hg(CNO)}_2$), Lead styphnate, Diazodinitrophenol (DDNP), TATP (improvised).</p></div>' +
         '<div class="vs-card"><h4>🧱 Secondary High Explosives (Main Charge)</h4><p>Relatively insensitive to mechanical shock and safe to handle/transport; require the shock wave of a primary detonator (or booster) to detonate.<br><b>Examples:</b> TNT, RDX (Cyclonite; mixed with plasticiser in C-4 and Semtex), PETN (used in Detonating Cord / Cordtex), HMX, ANFO (Ammonium Nitrate + Fuel Oil, 94:6).</p></div>' +
         '</div>' +
         '<p>An <b>Improvised Explosive Device (IED)</b> has <b>five essential components ("PIES-C")</b>:</p>' +
         '<div class="diagram">[1. Power Source (Battery)] ──► [2. Switch / Trigger (Timer, RCIED, Victim-operated)] ──► [3. Initiator / Detonator (Blasting cap with Primary HE)] ──► [4. Main Explosive Charge (Secondary HE / ANFO)] + [5. Container / Casing & Shrapnel (Pipe, pressure cooker, ball bearings)]</div>' }
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
      e: '<p>The NDPS Act grades sentences by <b>quantity</b>: small quantity, quantity lesser than commercial, and commercial quantity, with the thresholds notified per substance.</p><p>Purity is not the statutory trigger — the Supreme Court in <em>Hira Singh v. Union of India</em> (2020) held that the <b>whole weight of the mixture</b>, not just the pure drug content, is counted. That makes quantity determination the single most consequential laboratory finding in an NDPS case.</p>' },

    { q: 'Which precursor chemical (controlled substance under the NDPS Act) is illicitly used to acetylate morphine into heroin (diacetylmorphine)?', o: ['Ephedrine', 'Acetic anhydride', 'Potassium permanganate', 'Ergotamine'], a: 1,
      e: '<p><b>Acetic anhydride</b> converts morphine (extracted from opium) into <b>diacetylmorphine (heroin)</b> by acetylating both hydroxyl groups, and is therefore strictly regulated as a controlled substance under Section 9A of the NDPS Act.</p><p>Ephedrine is the precursor for methamphetamine; ergotamine is the precursor for LSD; potassium permanganate is used in purifying cocaine.</p>' },

    { q: 'In liquid–liquid (solvent) extraction of a biological fluid, a basic drug such as morphine or cocaine is most efficiently extracted into an organic solvent when the aqueous phase is made', o: ['Strongly acidic (pH 1–2)', 'Alkaline (above its pKa) so the drug is unionised', 'Neutral with saturated NaCl only', 'Boiling hot'], a: 1,
      e: '<p>By the Henderson–Hasselbalch principle, a <b>basic drug</b> is protonated (positively charged/ionised) in acid and stays in water, but becomes <b>unionised (free base) in an alkaline medium</b>, allowing it to partition into the organic solvent.</p><p>Conversely, acidic drugs such as barbiturates and salicylates are extracted into organic solvent from an <b>acidified</b> aqueous solution.</p>' },

    { q: 'Which presumptive colour test specifically yields a purple colour that extracts into the lower chloroform layer when cannabis (THC) is present?', o: ['Scott test', 'Duquenois–Levine test', 'Van Urk test', 'Simon\'s test'], a: 1,
      e: '<p>The <b>Duquenois–Levine test</b> reacts cannabinoids with vanillin and acetaldehyde in hydrochloric acid to form a violet-purple complex; the Levine modification adds <b>chloroform</b>, and migration of the purple colour into the lower organic chloroform layer differentiates cannabis from false positives such as coffee or nutmeg.</p>' },

    { q: 'Alkali burns of the oesophagus and eye generally cause deeper and more severe tissue destruction than acid burns because alkalis induce', o: ['Coagulative necrosis with a protective eschar', 'Liquefactive necrosis and saponification of fats', 'Xanthoproteic nitration', 'Rapid evaporation at body temperature'], a: 1,
      e: '<p>Alkalis (NaOH, KOH) cause <b>liquefactive necrosis</b> by dissolving proteins and <b>saponifying lipids</b>, turning tissue into a soft liquid mass through which the alkali continues to penetrate deeply.</p><p>Strong acids cause <b>coagulative necrosis</b>, forming a tough leathery crust (eschar) that limits deeper penetration (with the exception of hydrofluoric acid).</p>' },

    { q: 'The shattering, crushing effect produced by a high explosive in the immediate vicinity of the detonation due to its extreme detonation velocity and pressure is termed', o: ['Deflagration', 'Brisance', 'Alligatoring', 'Spalling'], a: 1,
      e: '<p><b>Brisance</b> is the shattering capability of a high explosive, directly proportional to its detonation velocity and density. It pulverises rock, shears steel and digs a crater at the seat of the blast.</p><p>Alligatoring and spalling are fire/arson indicators on charred wood and concrete respectively.</p>' },

    { q: 'What is the standard composition of military plastic explosive C-4?', o: ['TNT and ammonium nitrate', 'RDX (~91%) combined with a plasticiser/binder such as polyisobutylene', 'Nitroglycerine absorbed in kieselguhr', 'Black powder and aluminium powder'], a: 1,
      e: '<p><b>C-4 (Composition C-4)</b> consists of approximately <b>91% RDX (cyclotrimethylenetrinitramine)</b> combined with a plasticiser (dioctyl sebacate/adipate) and polyisobutylene binder, making it malleable and insensitive to bullet impact.</p><p>Semtex combines both <b>RDX and PETN</b> with a polymeric binder; nitroglycerine in kieselguhr is classical dynamite.</p>' },

    { q: 'In a vitriolage (acid attack) case where clothing shows black charred holes and no yellow staining, the aqueous extract of the fabric gives a heavy white precipitate with Barium Chloride (BaCl₂) that does not dissolve in dilute nitric acid. The acid used was', o: ['Hydrochloric acid', 'Nitric acid', 'Sulphuric acid', 'Oxalic acid'], a: 2,
      e: '<p><b>Sulphuric acid (H₂SO₄)</b> chars organic fabric black by dehydration, and sulphate ions ($\\text{SO}_4^{2-}$) react with $\\text{BaCl}_2$ to give a dense white precipitate of <b>barium sulphate ($\\text{BaSO}_4$)</b> that is insoluble in dilute HCl or $\\text{HNO}_3$.</p><p>Hydrochloric acid reacts with $\\text{AgNO}_3$ (not $\\text{BaCl}_2$), and nitric acid turns proteinaceous tissue/wool yellow.</p>' }
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
      b: '<ul><li><b>Nehemiah Grew</b> (1684) — first scientific description of friction ridges and sweat pores to the Royal Society.</li>' +
         '<li><b>Marcello Malpighi</b> (1686) — noted ridge patterns and described the dermal layer (Malpighian layer).</li>' +
         '<li><b>Jan Evangelista Purkinje</b> (1823) — first systematic thesis classifying fingerprint patterns into <b>nine categories</b>.</li>' +
         '<li><b>Sir William Herschel</b> (1858) — British ICS officer who first used handprints/fingerprints on civil contracts with Rajyadhar Konai in <b>Jungipoor (Jangipur), Hooghly district, Bengal</b>, demonstrating long-term persistence.</li>' +
         '<li><b>Dr Henry Faulds</b> (1880) — Scottish physician in Japan; published in <em>Nature</em> proposing crime-scene latent print identification and greasiness transfer; first to exonerate a suspect via a greasy print on a bottle.</li>' +
         '<li><b>Sir Francis Galton</b> (1892) — published <em>Finger Prints</em>; mathematically established the <b>two foundational laws (permanence and individuality)</b>, simplified classification into <b>Arches, Loops and Whorls</b>, and defined ridge minutiae still called <b>Galton details</b>.</li>' +
         '<li><b>Juan Vucetich</b> (Argentina, 1892) — devised the Vucetich dactyloscopy system and solved the world\'s first murder by bloody fingerprint evidence (the <b>Francisca Rojas</b> case in Necochea, 1892).</li>' +
         '<li><b>Sir Edward Henry</b>, working with Indian sub-inspectors <b>Khan Bahadur Azizul Haque</b> and <b>Rai Bahadur Hem Chandra Bose</b>, developed the <b>Henry Classification System</b> in Bengal. On <b>12 June 1897, the world\'s first Fingerprint Bureau was established at Writers\' Building, Calcutta</b> (four years before Scotland Yard\'s bureau in 1901). Haque and Bose LATER also devised the Single Digit Classification system.</li></ul>' },

    { h: 'The Two Governing Principles (Basis of Dactyloscopy)',
      b: '<ol><li><b>Individuality (Uniqueness)</b> — no two fingerprints, not even two fingers of the same person or fingers of <b>monozygotic (identical) twins</b>, have ever been found to possess identical ridge minutiae. Galton calculated the probability of two identical prints at less than 1 in 64 billion.</li>' +
         '<li><b>Permanence (Immutable Persistence)</b> — friction ridges form between the <b>10th and 16th weeks of foetal development</b> (complete by ~4th month in utero) and remain unchanged throughout life until post-mortem decomposition of the skin. Superficial cuts affecting only the outer epidermis heal without altering the pattern; only deep injury destroying the <b>dermal papillae (stratum basale / generating layer, ~1–2 mm deep)</b> creates a permanent scar, which itself becomes a unique individualising landmark.</li></ol>' +
         '<div class="analogy"><b>💡 Analogy — Why Identical Twins Have Identical DNA but Different Fingerprints:</b> Think of <b>DNA as the architect\'s blueprint</b> for building two identical twin houses — same floor plan, same rooms, same paint colour. <b>Fingerprints are like wet concrete poured onto the driveway</b> of each house between weeks 10 and 16 of pregnancy: as the foetus moves, touches the amniotic sac, and experiences microscopic blood-pressure and fluid ripples on its volar pads, the wet concrete ripples into slightly different ridge forks and endings. Same blueprint (DNA), different random ripples in the wet cement (fingerprints)!</div>' },

    { h: 'Three Levels of Friction Ridge Detail: Class vs Individual',
      b: '<div class="vs-grid">' +
         '<div class="vs-card"><h4>Level 1: Class Characteristics (Pattern Types)</h4><p>Overall ridge flow visible to the naked eye. Used for <b>classification and exclusion</b>, never for individualisation:</p><ul>' +
         '<li><b>Loops (~60–65%)</b> — ridges enter from one side, recurve, and exit the same side. Have <b>1 core and 1 delta</b>. Subtypes: <b>Ulnar loop</b> (opens toward little finger/ulna bone — most common) &amp; <b>Radial loop</b> (opens toward thumb/radius bone). Analysed by <b>ridge counting</b> between core and delta.</li>' +
         '<li><b>Whorls (~30–35%)</b> — circular/spiral ridges making at least one complete circuit. Have <b>2 or more deltas</b>. Subtypes: Plain whorl, Central pocket loop, Double loop (twinned loop), Accidental whorl. Analysed by <b>ridge tracing</b> (Inner / Meeting / Outer) from left delta to right delta.</li>' +
         '<li><b>Arches (~5%)</b> — ridges enter one side, rise slightly in the middle, and exit the opposite side. <b>Plain arch has 0 deltas and 0 core</b>; Tented arch has an upthrust/angle at the centre.</li></ul></div>' +
         '<div class="vs-card"><h4>Level 2 &amp; Level 3: Individual Characteristics</h4><p><b>Level 2 — Minutiae (Galton Details):</b> Specific points where ridges end, split or combine. Identification rests on the <b>type, orientation, and spatial relationship</b> of minutiae:</p><ul>' +
         '<li><b>Ridge ending</b> (abrupt termination) &amp; <b>Bifurcation</b> (ridge splits in two)</li>' +
         '<li><b>Dot / Island</b> (tiny isolated ridge), <b>Short independent ridge</b></li>' +
         '<li><b>Lake / Enclosure</b> (bifurcation that rejoins), <b>Spur / Hook</b>, <b>Bridge / Crossover</b>, <b>Trifurcation</b></li></ul>' +
         '<p><b>Level 3 — Microscopic Ridge Detail:</b> Used when prints are fragmentary:</p><ul>' +
         '<li><b>Poroscopy</b> (coined by <b>Edmond Locard</b>, 1912) — size, shape, number and position of <b>eccrine sweat pores</b> along the ridges (20–40 pores can individualise).</li>' +
         '<li><b>Edgeoscopy</b> (coined by <b>Salil Kumar Chatterjee</b>, 1962) — microscopic contour shapes along the <b>edges of friction ridges</b> (straight, convex, peak, table, pocket, angle).</li></ul></div>' +
         '</div>' +
         '<div class="clarity"><b>⚡ Concept Clarity — Henry Primary Classification Arithmetic:</b> In the 10-finger Henry system, fingers are paired (1&amp;2, 3&amp;4, 5&amp;6, 7&amp;8, 9&amp;10). Only <b>Whorls (and Accidentals)</b> receive numerical weights: <b>16</b> (pair 1), <b>8</b> (pair 2), <b>4</b> (pair 3), <b>2</b> (pair 4), <b>1</b> (pair 5). Loops and Arches get <b>0</b>. Even-numbered fingers go in the numerator, odd-numbered in the denominator, and <b>1 is added to both top and bottom</b>. Thus a person with <b>zero whorls (all loops/arches)</b> has a Henry Primary Classification of <b>1/1</b>, while a person with <b>all 10 whorls</b> has $(16+8+4+2+1)+1 / (16+8+4+2+1)+1 =$ <b>32/32</b>!</div>' },

    { h: 'Types of Prints, Latent Print Chemistry & AFIS',
      b: '<ul><li><b>Patent (visible) prints</b> — left by fingers coated with a coloured/visible substance: blood, ink, soot, paint, grease, dirt. Photographed directly using scale and oblique/filtered light.</li>' +
         '<li><b>Plastic (moulded/indented) prints</b> — 3D negative impression pressed into a soft malleable medium: candle wax, wet paint, window putty, soap, clay, butter, dust. Photographed with <b>low-angle oblique light</b> and cast if needed.</li>' +
         '<li><b>Latent (invisible) prints</b> — composed of natural skin secretions:<ul>' +
         '<li><b>Eccrine sweat</b> (from palms/soles; 98–99% water + <b>inorganic salts [NaCl/chlorides]</b> + <b>water-soluble amino acids, urea, lactic acid</b>).</li>' +
         '<li><b>Sebaceous secretions</b> (from touching hair/face; <b>fatty acids, glycerides, wax esters, squalene</b>).</li></ul></li></ul>' +
         '<div class="vs-grid">' +
         '<div class="vs-card"><h4>📄 Porous Surfaces (Paper, Cardboard, Unfinished Wood)</h4><p>Sweat soaks into the fibres; amino acids bind to cellulose and stay in place for years.</p>' +
         '<p><b>Sequential Order of Processing:</b><br><code>1. Iodine Fuming</code> (vapours dissolve physically in lipids → transient yellow-brown print; must photograph immediately or fix with starch/benzoflavone)<br><code>2. DFO (1,8-Diazafluoren-9-one) or 1,2-Indanedione</code> (reacts with amino acids → pale pink, intensely <b>fluorescent</b> under ~470–530 nm green laser/ALS; more sensitive than ninhydrin)<br><code>3. Ninhydrin</code> (reacts with <b>alpha-amino acids</b> → purple-blue product called <b>Ruhemann\'s purple</b>)<br><code>4. Physical Developer (PD) / Silver Nitrate</code> ($\\text{AgNO}_3$ reacts with <b>chloride ions</b> → AgCl → turns dark metallic silver under UV/light; PD deposits silver on water-insoluble lipids even if paper was wetted).</p></div>' +
         '<div class="vs-card"><h4>🪟 Non-Porous Surfaces (Glass, Plastic, Metal, Glossy Paint)</h4><p>Residue sits on top of the surface and is easily wiped away.</p>' +
         '<ul><li><b>Powder Dusting:</b> Regular black/carbon, aluminium flake, magnetic powder (Magna brush — no bristles, ideal for leather/plastics), or fluorescent powders adhering mechanically to moisture and oily residue; lifted on adhesive tape.</li>' +
         '<li><b>Cyanoacrylate (Superglue) Fuming:</b> Ethyl cyanoacrylate ester vapour polymerises via anionic chain reaction initiated by moisture/amines on ridges → forms hard, durable <b>white polycyanoacrylate ridges</b>, which can then be stained with fluorescent dyes like <b>Rhodamine 6G</b> or Basic Yellow 40.</li>' +
         '<li><b>Small Particle Reagent (SPR):</b> Suspension of <b>molybdenum disulphide ($\\text{MoS}_2$)</b> in detergent solution — the method of choice for <b>wet, rain-soaked or submerged non-porous surfaces</b> (e.g., car pulled from a canal).</li>' +
         '<li><b>Vacuum Metal Deposition (VMD):</b> Evaporates ultra-thin gold and zinc films in vacuum — ultra-sensitive for aged plastics and polythene bags.</li></ul></div>' +
         '</div>' +
         '<div class="example"><b>🔬 Worked Example — Crime Scene Latent Print Surface-to-Reagent Selection Matrix:</b><br>' +
         'An investigator recovers four items from a kidnapping scene. Here is the exact laboratory protocol:<br>' +
         '1. <b>Ransom note on dry bond paper (Porous):</b> Process sequentially with <b>DFO / 1,2-Indanedione</b> (fluorescent amino acid reaction) followed by <b>Ninhydrin</b> (Ruhemann\'s purple).<br>' +
         '2. <b>Black plastic handgun &amp; glossy magazine (Dry Non-Porous):</b> Place in a fuming cabinet for <b>Cyanoacrylate (Superglue) fuming</b> to lock ridges in white polymer, then stain with <b>Rhodamine 6G</b>.<br>' +
         '3. <b>Duct tape — sticky adhesive side:</b> Use <b>Gentian Violet (Crystal Violet)</b> or Sticky-Side Powder (stains skin cells/lipids trapped in adhesive).<br>' +
         '4. <b>Bloody palm print on a wooden door:</b> Fix proteins and stain with <b>Amido Black</b>, <b>Coomassie Blue</b>, or <b>Hungarian Red</b>.</div>' +
         '<p><b>AFIS (Automated Fingerprint Identification System) / NAFIS:</b> Extracts a mathematical coordinate map of Level 1 pattern and Level 2 minutiae (ridge endings and bifurcations with $(x, y, \\theta)$ vectors) to search millions of records and return a <b>ranked candidate list</b>. AFIS never declares a final match on its own — a human fingerprint expert must perform <b>ACE-V (Analysis, Comparison, Evaluation, and independent Verification)</b>.</p>' }
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
      e: '<p>AFIS searches minutiae templates and returns a <b>ranked candidate list</b>. The identification decision remains with a <b>trained examiner</b> performing a visual comparison, conventionally under ACE-V.</p><p>This distinction matters legally: an AFIS "hit" is an investigative lead, not evidence of identity, and stating otherwise in court would be indefensible.</p>' },

    { q: 'What is the Primary Classification fraction under the Henry System for an individual whose ten fingers are all Loops (i.e. zero Whorls)?', o: ['0 / 0', '1 / 1', '10 / 10', '32 / 32'], a: 1,
      e: '<p>In the Henry Primary Classification, only <b>whorls</b> are assigned numerical values (16, 8, 4, 2, 1 for pairs 1 to 5), while loops and arches score <b>0</b>. Because <b>1 is added to both the numerator and the denominator</b> to avoid division by zero, ten loops yield $(0+1)/(0+1) =$ <b>1/1</b>.</p><p>Conversely, an individual with whorls on all ten fingers has a primary classification of <b>32/32</b>.</p>' },

    { q: 'Which latent fingerprint development method uses an aqueous suspension of molybdenum disulphide (MoS₂) to develop prints on wet or rain-soaked non-porous surfaces?', o: ['Ninhydrin spray', 'Small Particle Reagent (SPR)', 'Iodine fuming', 'DFO'], a: 1,
      e: '<p><b>Small Particle Reagent (SPR)</b> consists of fine <b>molybdenum disulphide ($\\text{MoS}_2$)</b> particles suspended in a surfactant solution. The hydrophobic particles adhere to the fatty/sebaceous components of latent prints even on <b>wet glass, metal or submerged vehicles</b> where dry powders or superglue fuming would fail.</p>' },

    { q: 'A fingerprint pattern in which friction ridges enter from one side of the finger, recurve around a core, and exit on the same side toward the little finger (ulna bone) is classified as a', o: ['Radial loop', 'Ulnar loop', 'Central pocket loop whorl', 'Tented arch'], a: 1,
      e: '<p>A loop has <b>one core and one delta</b>, with ridges entering and exiting on the same side. When the loop opens (slopes) toward the <b>ulna (little finger side)</b>, it is an <b>ulnar loop</b> — the single most common pattern in human populations (~60% of all prints). When it opens toward the thumb (radius bone), it is a radial loop.</p>' },

    { q: 'The standard four-stage methodology used by human fingerprint examiners to reach and validate an identification decision is known by the acronym', o: ['CODIS', 'ACE-V (Analysis, Comparison, Evaluation, Verification)', 'SWGFAST', 'HENRY-10'], a: 1,
      e: '<p><b>ACE-V</b> stands for <b>Analysis</b> (assessing quality/quantity of Level 1–3 detail in the latent print first), <b>Comparison</b> (side-by-side comparison with the exemplar), <b>Evaluation</b> (reaching a conclusion of Identification, Exclusion, or Inconclusive), and <b>Verification</b> (independent review by a second qualified examiner).</p>' },

    { q: 'When processing a porous paper document for latent fingerprints using multiple chemical reagents, what is the correct sequential order so that earlier tests do not destroy the target of later tests?', o: ['Silver nitrate → Ninhydrin → Iodine fuming', 'Iodine fuming (or DFO) → Ninhydrin → Physical Developer / Silver nitrate', 'Physical Developer → Iodine fuming → DFO', 'Cyanoacrylate → SPR → Ninhydrin'], a: 1,
      e: '<p>On porous paper, <b>Iodine fuming</b> (physical absorption into lipids) or <b>DFO/Indanedione</b> (fluorescent amino-acid reagent) comes first, followed by <b>Ninhydrin</b> (amino acids → Ruhemann\'s purple), and finally <b>Silver nitrate or Physical Developer</b> (which washes away water-soluble amino acids and targets chlorides/water-insoluble lipids). Running an aqueous silver reagent first would wash out the amino acids needed for DFO and Ninhydrin.</p>' },

    { q: 'A friction ridge skin injury will result in a permanent scar altering the fingerprint pattern only if the damage penetrates down to the', o: ['Stratum corneum (outer dead epidermis)', 'Dermal papillae / basal generating layer (1–2 mm deep)', 'Sebaceous gland', 'Sweat pore opening'], a: 1,
      e: '<p>The outer epidermis is continuously regenerated from template cells in the <b>dermal papillae (stratum basale)</b> roughly 1–2 mm below the surface. Superficial cuts or abrasions heal with the exact original ridge pattern restored; only destruction of the dermal papillae leaves a permanent scar.</p>' },

    { q: 'Who coined the term "Edgeoscopy" in 1962 for the forensic study of characteristic shapes along the edges of friction ridges?', o: ['Edmond Locard', 'Salil Kumar Chatterjee', 'Azizul Haque', 'Francis Galton'], a: 1,
      e: '<p>Indian fingerprint expert <b>Salil Kumar Chatterjee</b> introduced <b>Edgeoscopy</b> in 1962, classifying microscopic ridge-edge contours into seven characteristic shapes (straight, convex, peak, table, pocket, concave, angle). <b>Edmond Locard</b> pioneered <b>Poroscopy</b> (sweat pores) in 1912.</p>' }
  ]
});

window.MPSC.units.push({
  id: 'p3gf3',
  paper: 'Paper III — General Forensic',
  title: 'III. Forensic Ballistics',
  marks: 10,
  syllabus: 'Definition and scope. Types of evidences associated. Ammunition components. Types of Firearms - Shotgun, revolver, pistol, rifle and country made firearms. Gunshot Residue (GSR) - meaning and importance. Internal and external ballistics. Types of tool marks - class and individual characteristics. Forensic significance of glass and paint. Comparison microscope and its application in Forensic.',

  notes: [
    { h: 'The Four Branches of Ballistics',
      b: '<ol><li><b>Internal (Interior) Ballistics</b> — everything that happens <em>inside</em> the firearm from the instant the firing pin strikes the primer until the projectile exits the muzzle (approx. 1–3 milliseconds): primer ignition, deflagration of smokeless propellant, peak chamber pressure, engraving of rifling lands/grooves onto the bullet jacket, barrel vibration, and recoil.</li>' +
         '<li><b>Transitional (Intermediate) Ballistics</b> — the brief muzzle-exit zone where uncorked high-pressure propellant gases, flame, soot and unburnt powder overtake the bullet, causing muzzle flash, blast wave, and GSR deposition on nearby targets.</li>' +
         '<li><b>External (Exterior) Ballistics</b> — flight of the projectile through the air from muzzle exit to target impact: parabolic trajectory, aerodynamic drag, gravity drop, gyroscopic spin stabilisation, drift, yaw (wobble), tumbling, and ricochet.</li>' +
         '<li><b>Terminal (Wound) Ballistics</b> — interaction of the projectile with the target: glass/metal perforation, tissue penetration, permanent wound track, temporary cavitation (hydrostatic shock in high-velocity rifle wounds), and entry/exit wound morphology.</li></ol>' },

    { h: 'Firearms, Ammunition Components & Bore/Gauge',
      b: '<p><b>Rifled weapons</b> (rifle, semi-automatic pistol, revolver) have spiral grooves cut inside the barrel; the raised metal portions between grooves are called <b>lands</b>. Lands bite into the bullet to impart <b>gyroscopic spin</b> for aerodynamic stability in flight. <b>Smoothbore weapons</b> (shotguns, muskets) have a smooth interior barrel wall without rifling.</p>' +
         '<table><tr><th>Weapon Type</th><th>Mechanism &amp; Forensic Scene Signature</th></tr>' +
         '<tr><td><b>Revolver</b></td><td>Revolving cylinder with 5–6 chambers; <b>does NOT eject fired cartridge cases</b> automatically — cases remain inside the cylinder unless manually emptied by the shooter.</td></tr>' +
         '<tr><td><b>Semi-automatic Pistol</b></td><td>Removable box magazine in the grip; recoil/blowback operates the slide, which <b>automatically extracts and ejects the spent cartridge case</b> at the crime scene after every shot.</td></tr>' +
         '<tr><td><b>Rifle</b></td><td>Long rifled barrel fired from the shoulder; high muzzle velocity (700–1,000 m/s) producing massive temporary cavitation in terminal ballistics.</td></tr>' +
         '<tr><td><b>Shotgun</b></td><td>Long smoothbore barrel firing multiple lead pellets (birdshot/buckshot) or a single rifled slug; barrel constriction at the muzzle is called <b>choke</b> (full, modified, cylinder) to control pellet spread.</td></tr>' +
         '<tr><td><b>Country-made firearm (Katta / Tamancha)</b></td><td>Improvised, non-standard smoothbore weapons common in India (often chambered crudely for .315", .303" or 12-bore ammunition). Lack uniform rifling, frequently suffer barrel burst, and must be identified via <b>breech-face, firing-pin and chamber striations</b> on the cartridge case.</td></tr></table>' +
         '<p><b>Ammunition (Cartridge) Components:</b></p>' +
         '<ul><li><b>Cartridge Case</b> — usually brass (70% copper, 30% zinc); holds primer, propellant and bullet together and expands on firing (obturation) to seal hot gases from escaping backward.</li>' +
         '<li><b>Primer</b> — percussion-sensitive primary explosive mixture (classically <b>Lead styphnate + Barium nitrate + Antimony sulphide</b>). Struck by the firing pin to produce a hot flame jet. In <b>rimfire</b> (.22 LR), priming compound is spun into the rim; in <b>centrefire</b>, it sits in a central cup (Boxer primer has 1 central flash hole and internal anvil; Berdan primer has 2 flash holes and anvil built into the case).</li>' +
         '<li><b>Propellant</b> — black powder (charcoal + KNO₃ + S) or modern <b>smokeless powder</b> (Single-base = Nitrocellulose; Double-base = Nitrocellulose + Nitroglycerine; Triple-base = NC + NG + Nitroguanidine).</li>' +
         '<li><b>Projectile</b> — lead or jacketed bullet (FMJ, hollow-point, soft-point), or lead pellets + <b>plastic/felt wad</b> in a shotgun shell.</li></ul>' +
         '<div class="analogy"><b>💡 Analogy — Why a 12-Gauge Shotgun Is Wider Than a 20-Gauge Shotgun:</b> Imagine you have <b>exactly 1 pound of bread dough</b>. If you divide that 1 pound into <b>12 equal round balls</b>, each ball is quite large. If you divide the same 1 pound into <b>20 equal round balls</b>, each individual ball must be smaller! Shotgun <b>gauge</b> is literally the number of solid lead spheres of that barrel\'s diameter that weigh 1 pound: therefore, a <b>12-gauge barrel (0.729 inch / 18.5 mm)</b> is significantly wider than a <b>20-gauge barrel (0.615 inch / 15.6 mm)</b>. (The sole exception is the .410 shotgun, which is an actual calibre measurement in inches.)</div>' +
         '<div class="clarity"><b>⚡ Concept Clarity — How Calibre Is Measured:</b> In a <b>rifled barrel</b>, calibre is measured between two opposite <b>lands</b> (the minor/bore diameter), expressed either in hundredths/thousandths of an inch (e.g., .38, .45, .303, .22) or in millimetres (e.g., 9×19 mm Parabellum, 7.62×39 mm).</div>' },

    { h: 'Tool Marks, Rifling & The Comparison Microscope',
      b: '<p><b>Types of Tool Marks at Crime Scenes:</b> (1) <b>Impressed / Compression marks</b> — tool pressed straight into softer surface (e.g., firing pin impression, hammer dent, crowbar indentation), reproducing the tool\'s surface topography in negative; (2) <b>Striated / Abrasion marks</b> — hard tool slides across a surface (e.g., bullet sliding down a rifled barrel, extractor/ejector sliding across brass, bolt cutter shearing a padlock shackle), leaving microscopic parallel scratch lines (striations).</p>' +
         '<div class="vs-grid">' +
         '<div class="vs-card"><h4>🏭 Class Characteristics</h4><p>Design specifications decided before manufacture and shared by <b>all firearms/tools of that make and model</b> (can exclude a weapon or narrow to a brand, never individualise):</p><ul>' +
         '<li><b>On a Fired Bullet:</b> Calibre, number of lands and grooves (e.g., 6 lands/grooves), direction of twist (Right/clockwise or Left/counter-clockwise), angle/pitch of twist, and width of land and groove impressions.</li>' +
         '<li><b>On a Cartridge Case:</b> Firing pin shape/location (rimfire vs centrefire), relative geometric position of extractor and ejector.</li></ul></div>' +
         '<div class="vs-card"><h4>🔬 Individual Characteristics</h4><p>Random microscopic imperfections created during machining and subsequent wear, corrosion and fouling — <b>unique to one single firearm barrel or breech</b>:</p><ul>' +
         '<li><b>On a Fired Bullet:</b> Microscopic <b>striations</b> inside the land and groove impressions engraved by the barrel wall.</li>' +
         '<li><b>On a Cartridge Case:</b> <b>Breech-face marks</b> (stamped onto the base as the case slams back under pressure), <b>firing pin impression detail</b>, <b>extractor marks</b> (on the rim), <b>ejector marks</b> (on the head), and <b>chamber striations</b>.</li></ul></div>' +
         '</div>' +
         '<p>The <b>Comparison Microscope</b> — invented by Philip Gravelle and championed in forensic ballistics by <b>Col. Calvin Goddard</b> (who solved the 1929 St Valentine\'s Day Massacre) — joins two compound microscopes via an <b>optical bridge</b> into a single split eyepiece. The examiner mounts the crime-scene bullet on one stage and a test-fired bullet (recovered undamaged in a water tank or cotton box) on the other, rotating both until the microscopic striation lines flow continuously across the dividing hairline.</p>' },

    { h: 'Gunshot Residue (GSR), Range Estimation & Gunshot Wounds',
      b: '<p><b>Gunshot Residue (GSR)</b> consists of burnt and unburnt propellant particles plus vaporised primer constituents that condense into microscopic <b>spheroidal droplets (0.5–10 µm)</b> fusing <b>Lead (Pb), Barium (Ba) and Antimony (Sb)</b> in a single particle. Confirmatory analysis uses <b>SEM-EDX (Scanning Electron Microscopy with Energy-Dispersive X-ray Spectroscopy)</b> on adhesive carbon stubs dabbed on the shooter\'s thumb-web/back of hand, because SEM reveals the unique molten spheroidal morphology while EDX confirms the simultaneous co-presence of Pb + Ba + Sb.</p>' +
         '<p><b>Colour/Chemical Spot Tests for GSR &amp; Range Estimation around Bullet Holes:</b></p>' +
         '<ul><li><b>Sodium Rhodizonate test</b> → detects <b>Lead (Pb)</b> and Barium (turns pink/red-violet, then blue-violet with HCl buffer).</li>' +
         '<li><b>Modified Griess test</b> or <b>Walker test</b> (desensitised photographic paper + sulphanilic acid / alpha-naphthylamine) → detects <b>Nitrite ($\\text{NO}_2^-$)</b> residues from burnt smokeless powder; transfers the spatial pattern of nitrites around a clothing bullet hole to determine the <b>range of firing</b>.</li>' +
         '<li><b>Harrison–Gilroy test</b> → colorimetric swab test for Sb, Ba and Pb using triphenylmethylarsonium iodide and sodium rhodizonate.</li>' +
         '<li><b>Dermal Nitrate / Paraffin test (Diphenylamine in conc. H₂SO₄)</b> → deep blue with oxidising nitrates; now <b>obsolete for hands</b> because fertilisers, tobacco, urine, cosmetics and matches give false positives.</li></ul>' +
         '<div class="vs-grid">' +
         '<div class="vs-card"><h4>🎯 Entry Gunshot Wound</h4><ul>' +
         '<li>Usually <b>smaller and round/oval</b> (except contact wounds over bone, which are <b>stellate/cruciate</b> due to subcutaneous gas blowback).</li>' +
         '<li>Margins are <b>inverted</b> (pushed inward).</li>' +
         '<li>Surrounded by an <b>Abrasion Collar (Contusion Ring)</b> — caused by bullet stretching and scraping epidermis as it indents skin (present regardless of range) — plus a <b>Dirt/Grease Ring (Bullet Wipe)</b>.</li>' +
         '<li>May show <b>burning/singing of hair, soot blackening (wipes off), and powder tattooing/stippling (intradermal punctate abrasions that CANNOT be wiped off)</b> depending on firing distance.</li>' +
         '<li>In flat skull bone: <b>internal bevelling</b> (cone widens on the inner table of the skull).</li></ul></div>' +
         '<div class="vs-card"><h4>🚪 Exit Gunshot Wound</h4><ul>' +
         '<li>Usually <b>larger, irregular, slit-like or torn</b> (because the bullet has deformed or tumbled inside the body).</li>' +
         '<li>Margins are <b>everted</b> (pushed outward).</li>' +
         '<li><b>NO abrasion collar</b> (unless skin was pressed tightly against a hard wall/belt — a "shored exit"), <b>NO soot blackening, NO powder tattooing, and NO grease ring</b>.</li>' +
         '<li>In flat skull bone: <b>external bevelling</b> (cone widens on the outer table of the skull).</li></ul></div>' +
         '</div>' },

    { h: 'Forensic Glass Fracture Analysis & Automotive Paint',
      b: '<p><b>Glass Examination:</b> Glass is an amorphous solid (supercooled liquid), typically soda-lime-silica ($\\text{SiO}_2 + \\text{Na}_2\\text{O} + \\text{CaO}$), borosilicate (Pyrex — heat-resistant headlights), tempered/toughened safety glass (dices into small cubical fragments — car side windows), or laminated glass (plastic PVB sheet sandwiched between two glass layers — car windshields).</p>' +
         '<ul><li><b>Physical &amp; Optical Comparison:</b> Jigsaw mechanical fit (conclusive individualisation!), Density comparison (sink-float / density gradient column using bromoform + bromobenzene), and <b>Refractive Index (RI)</b> via <b>Becke line method</b> (bright halo moves into the medium of <em>higher</em> refractive index as microscope focus distance is increased) or automated <b>GRIM (Glass Refractive Index Measurement)</b> using oil immersion temperature variation until phase contrast disappears (match point). Trace elements by ICP-MS or μ-XRF.</li>' +
         '<li><b>Fracture Mechanics &amp; Direction of Force:</b> When a projectile strikes a pane of glass, the glass bends away from the force. The <b>opposite (exit) face stretches under tension and cracks first</b>, radiating outward from the point of impact as <b>Radial fractures</b>. Next, the impact face experiences tension around the circumference, forming circular <b>Concentric fractures</b> connecting the radial lines.<ul>' +
         '<li><b>Cone / Crater Effect (Hertzian Cone):</b> A high-velocity bullet punches a bevelled crater whose <b>wider mouth (flaking/coning) is on the EXIT side</b> (exactly like skull bone bevelling).</li>' +
         '<li><b>The 3R (or 4R) Rule for Stress Lines (Wallner / Rib / Hackle marks):</b> Examining the curved conchoidal stress lines on the cross-sectional edge of a broken glass fragment: <b><u>R</u>idges on <u>R</u>adial cracks are at <u>R</u>ight angles ($90^\\circ$) to the <u>R</u>everse (exit) side</b> of impact (and parallel to the side from which force came). (On concentric cracks, the opposite holds: right angles are on the impact side.)</li>' +
         '<li><b>Sequence of Multiple Shots:</b> A new fracture <b>always terminates (stops) at an existing fracture line</b> because stress cannot propagate across an open gap.</li></ul></li></ul>' +
         '<div class="example"><b>🔬 Worked Example — Crime Scene Shooting Reconstruction (Weapon, Range, Glass Direction &amp; Shot Sequence):</b><br>' +
         '<b>Scene Findings:</b> A victim is found inside a room with two bullet holes (Hole A and Hole B) in a window pane. No spent cartridge cases are found on the ground despite two shots being fired. The victim\'s shirt shows punctate reddish-brown stippling (tattooing) around the chest entry wound that cannot be wiped away with a wet swab.<br>' +
         '<b>Reconstruction Step 1 (Weapon Type):</b> Two shots fired with <b>zero ejected cartridge cases</b> strongly points to a <b>Revolver</b> (which retains spent cases inside its revolving cylinder).<br>' +
         '<b>Reconstruction Step 2 (Range of Firing):</b> Intradermal <b>powder tattooing/stippling</b> that does not wipe off proves the shot was fired from <b>intermediate/close range</b> (typically ~15 cm to 60–90 cm for a handgun), where unburnt gunpowder grains still had enough kinetic energy to embed in the skin.<br>' +
         '<b>Reconstruction Step 3 (Direction of Shot through Glass):</b> Hole A shows cone cratering (flaking) on the <em>inside</em> surface of the room\'s glass, and the rib marks on its <b>Radial cracks meet the inside surface at Right angles (3R Rule)</b> → the shot was fired <b>from outside the window into the room</b>.<br>' +
         '<b>Reconstruction Step 4 (Sequence of Shots A vs B):</b> The radial cracks radiating from Hole B stop abruptly where they intersect the radial cracks of Hole A → <b>Shot A was fired first, and Shot B was fired second!</b></div>' +
         '<p><b>Forensic Paint Analysis:</b> Essential trace evidence in <b>hit-and-run traffic collisions</b> and forced-entry burglaries (tool transfer). Automotive paint is applied in <b>four distinct layers</b> on the steel body: (1) <b>Electrocoat Primer</b> (epoxy resin for corrosion resistance, black/grey), (2) <b>Primer Surfacer</b> (smooths imperfections, pigmented), (3) <b>Basecoat / Colour coat</b> (acrylic/polyurethane containing organic/inorganic pigments plus aluminium or mica flakes for metallic/pearlescent finish), and (4) <b>Clearcoat</b> (unpigmented acrylic/polyurethane topcoat for UV and scratch gloss protection).<br>' +
         '<b>Examination:</b> A <b>physical jigsaw match</b> of a chipped paint flake edge back to the suspect vehicle\'s damaged fender is <em>conclusive individual evidence</em>. Otherwise, cross-sectional stereomicroscopy / polarised light microscopy compares layer sequence, thickness and colour; <b>FTIR microspectroscopy</b> and <b>Pyrolysis-GC-MS (Py-GC-MS)</b> identify the organic polymeric binders/resins of each layer; <b>SEM-EDX / XRF / Raman</b> identify inorganic pigments; and databases like <b>PDQ (Paint Data Query)</b> narrow down vehicle make, model and manufacturing year.</p>' }
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
      e: '<p>Two microscopes joined by an <b>optical bridge</b> place a questioned bullet and a test-fired bullet in one visual field, so striations can be aligned and matched directly.</p><p>Magnification is not the point — a compound microscope can magnify as much. Elemental composition is SEM-EDX; refractive index is a glass method.</p>' },

    { q: 'When a high-velocity bullet perforates a flat pane of window glass, the cone-shaped crater (bevelling/flaking) is wider on', o: ['The side from which the bullet entered (impact side)', 'The exit side (opposite the direction of impact)', 'Both sides equally', 'The top edge of the hole only'], a: 1,
      e: '<p>A high-velocity projectile punches out a Hertzian cone in brittle materials like glass and flat skull bone, producing <b>coning/bevelling that widens on the EXIT side</b> (the direction of bullet travel). This provides an immediate visual indicator of the direction of fire.</p>' },

    { q: 'Two bullet holes, X and Y, are found in a store window. The radial cracks radiating from hole Y terminate abruptly where they meet the radial cracks of hole X. What does this establish?', o: ['Both shots were fired simultaneously from two guns', 'Bullet X struck the glass first, and Bullet Y was fired second', 'Bullet Y struck the glass first, and Bullet X was fired second', 'Bullet Y was fired from inside the store'], a: 1,
      e: '<p>Fracture propagation stops at an existing open crack because mechanical stress cannot cross an air gap. Since the cracks from <b>Y terminate at the cracks of X</b>, the cracks from X were already present — proving that <b>shot X was fired first and shot Y second</b>.</p>' },

    { q: 'In refractive index determination of microscopic glass fragments by the Becke line method, when the microscope stage is lowered (increasing the working distance), the bright Becke halo moves toward', o: ['The medium with the lower refractive index', 'The medium with the higher refractive index', 'The centre of the microscope stage regardless of RI', 'The light source'], a: 1,
      e: '<p>As the distance between the objective lens and the specimen is increased (focus raised / stage lowered), the bright <b>Becke line</b> moves into the medium of <b>higher refractive index</b>. In automated GRIM analysis, the immersion silicone oil is heated until its RI matches the glass fragment and the Becke halo disappears completely.</p>' },

    { q: 'Which chemical test is specifically used on clothing around a bullet hole to map the spatial pattern of nitrite (NO₂⁻) residues from burnt smokeless powder and thereby estimate the range of firing?', o: ['Marquis test', 'Walker test / Modified Griess test', 'Becke line test', 'Kastle-Meyer test'], a: 1,
      e: '<p>The <b>Walker test</b> and <b>Modified Griess test</b> chemically react with <b>nitrite ($\\text{NO}_2^-$)</b> particles deposited from burnt smokeless gunpowder to form an orange-red azo dye on treated photographic/filter paper pressed against the garment. Comparing the diameter and density of this nitrite pattern against test-firings at known distances establishes the <b>range of firing</b>.</p>' },

    { q: 'In a rifled firearm barrel, the calibre is measured as the internal diameter between', o: ['Two opposite grooves', 'Two opposite lands (the raised spiral ridges)', 'The outer walls of the barrel', 'The chamber and the muzzle'], a: 1,
      e: '<p>In rifled barrels, <b>lands</b> are the raised helical portions left between the cut <b>grooves</b>. Calibre (bore diameter) is strictly defined as the distance across the bore between <b>two opposite lands</b>.</p>' },

    { q: 'Which analytical technique is best suited for identifying and comparing the organic polymeric binders in microscopic layers of automotive paint chips from a hit-and-run scene?', o: ['Griess test', 'FTIR microspectroscopy and Pyrolysis-GC-MS (Py-GC-MS)', 'Anodic stripping voltammetry', 'Ninhydrin fuming'], a: 1,
      e: '<p>Automotive paint consists of organic polymeric binders (acrylics, alkyds, polyurethanes, epoxies) and inorganic pigments. <b>FTIR microspectroscopy</b> and <b>Pyrolysis-GC-MS (Py-GC-MS)</b> characterise the organic binder resins layer by layer, while SEM-EDX or XRF analyses the inorganic elemental pigments.</p>' },

    { q: 'A gunshot entry wound inflicted with the muzzle held in tight contact against skin overlying a flat bone such as the skull characteristically shows', o: ['Wide powder tattooing spread over 30 cm', 'A stellate (star-shaped / cruciate) tear with soot and CO inside the wound track and on the bone', 'No soot or tissue damage', 'External bevelling of the outer table of the skull'], a: 1,
      e: '<p>In a <b>tight contact shot over bone (skull)</b>, all expanding propellant gases enter the wound and reflect off the underlying bone, ballooning the scalp outward until it splits into a jagged <b>stellate (star-shaped) tear</b> with inverted/lacerated flaps, seared margins, carboxyhaemoglobin cherry-red colouring, and black soot deposited deep inside the wound track on the periosteum.</p>' }
  ]
});
