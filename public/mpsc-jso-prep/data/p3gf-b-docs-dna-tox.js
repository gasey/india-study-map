/* Paper III, Part B — General Forensic. Topics IV-VI. */

window.MPSC.units.push({
  id: 'p3gf4',
  paper: 'Paper III — General Forensic',
  title: 'IV. Questioned Documents',
  marks: 10,
  syllabus: 'Definition and importance of Questioned documents. Forgery and its types & characteristics. Invisible and indented writing. Importance of handwriting examination in forensics. Identifying features of fake and genuine Indian currency notes. Different Types of alterations - erasures, additions, overwritings and obliterations. Difference between photomicrography & microphotography.',

  notes: [
    { h: 'Forgery types',
      b: '<table><tr><th>Type</th><th>Method</th><th>Tell-tale signs</th></tr>' +
         '<tr><td><b>Freehand / simulated</b></td><td>Copying a model signature by eye</td><td>Tremor, slow drawn line, blunt starts and stops, pen lifts</td></tr>' +
         '<tr><td><b>Traced</b></td><td>Following an original through transmitted light or carbon</td><td>Guide lines, indentations, <b>near-exact superimposition</b> with the model</td></tr>' +
         '<tr><td><b>Simple / spurious</b></td><td>Signing another\'s name with no attempt to imitate</td><td>Writer\'s own natural handwriting habits show through</td></tr>' +
         '<tr><td><b>Guided hand</b></td><td>Hand steadied or guided by another</td><td>Features of two writers combined</td></tr></table>' +
         '<p><b>Key principle:</b> genuine writing is <em>fast and unconscious</em>; forgery is <em>slow and deliberate</em>. Hence the paradox that a forgery often looks <b>better</b> than the genuine article — too careful, too even. Two identical signatures are themselves suspicious, since no one signs twice exactly alike; that indicates tracing or mechanical reproduction.</p>' +
         '<p>Class characteristics of handwriting come from the copybook system taught; individual characteristics come from personal habit — line quality, pen pressure, connecting strokes, i-dots and t-bars, spacing, slant, ratio of letter heights.</p>' },

    { h: 'Alterations, indented and invisible writing',
      b: '<ul><li><b>Erasure</b> — <em>mechanical</em> (rubber, blade — disturbs fibres, thins paper, visible under oblique light) or <em>chemical</em> (bleaching — leaves a stain fluorescing under UV).</li>' +
         '<li><b>Obliteration</b> — covering writing with ink or correction fluid. Read through it with <b>IR examination</b>, since inks differing in IR absorption separate even when they look identical.</li>' +
         '<li><b>Addition/interlineation</b> — detected by differences in ink, pen pressure, alignment and spacing.</li>' +
         '<li><b>Overwriting</b> — tracing over existing strokes; exposed by IR/UV and by ink differentiation via TLC.</li></ul>' +
         '<p><b>Indented writing</b> is the impression left on the sheet beneath. It is developed by <b>ESDA</b> (Electrostatic Detection Apparatus), which is <em>non-destructive</em> and can recover impressions from several sheets down. Oblique lighting is the simpler alternative.</p>' +
         '<p><b>Invisible/secret writing</b> — organic "sympathetic inks" (lemon juice, milk) develop with gentle heat; others need UV or chemical reagents.</p>' },

    { h: 'Indian currency security features',
      b: '<p>Genuine Reserve Bank of India notes (Mahatma Gandhi New Series) carry:</p>' +
         '<ul><li><b>Watermark</b> — Mahatma Gandhi portrait and electrotype denomination, visible against light, formed by varying paper thickness (not printed).</li>' +
         '<li><b>Security thread</b> — windowed, colour-shifting green to blue on higher denominations, inscribed <em>भारत</em> and <em>RBI</em>.</li>' +
         '<li><b>Latent image</b> — denomination numeral visible when held horizontally at eye level.</li>' +
         '<li><b>Intaglio printing</b> — raised print felt by touch; also the basis of identification marks for the visually impaired (different geometric shapes per denomination).</li>' +
         '<li><b>Optically variable ink</b> — the numeral shifts green to blue on tilting.</li>' +
         '<li><b>Micro-lettering</b>, <b>see-through register</b> (the denomination completing when held to light), fluorescent number panel and UV-visible fibres.</li></ul>' +
         '<p>Counterfeits are typically produced by scanning and offset or inkjet printing, so they lack intaglio relief and true watermarks — a simulated watermark is <em>printed</em> and therefore visible in reflected as well as transmitted light. Counterfeiting is punishable under the <b>Bharatiya Nyaya Sanhita, 2023</b> (previously IPC ss.489A–489E).</p>' },

    { h: 'Photomicrography vs microphotography',
      b: '<p>A pure definition question that appears verbatim in the syllabus:</p>' +
         '<ul><li><b>Photomicrography</b> — photographing a <em>small object through a microscope</em> to produce an <b>enlarged</b> image. This is what forensic laboratories actually do.</li>' +
         '<li><b>Microphotography</b> — producing a <b>greatly reduced</b> photograph, e.g. microfilm, readable only under magnification.</li></ul>' +
         '<p>Mnemonic: photo<b>micro</b>graphy makes the <em>micro</em> visible; <b>micro</b>photography makes the <em>photograph</em> micro.</p>' }
  ],

  questions: [
    { q: 'Two signatures that superimpose almost exactly on one another indicate', o: ['Both are genuine', 'Tracing or mechanical reproduction', 'A guided hand signature', 'Normal natural variation'], a: 1,
      e: '<p>No person signs twice identically — <b>natural variation</b> is an inherent feature of genuine writing. Near-exact superimposition therefore indicates <b>tracing</b> or a mechanical/scanned reproduction.</p><p>This inverts the intuitive expectation, which is exactly why it is examined: candidates assume similarity proves genuineness.</p>' },

    { q: 'ESDA (Electrostatic Detection Apparatus) is used to detect', o: ['Erased ink', 'Indented writing impressions', 'Counterfeit watermarks', 'Ink age'], a: 1,
      e: '<p>ESDA develops <b>indented impressions</b> left when writing on a sheet above, and can recover them from several sheets down.</p><p>Its major advantage is being <b>non-destructive</b> — the document is unaltered and remains available for other examinations, so ESDA is performed <em>before</em> any destructive testing.</p>' },

    { q: 'Obliterated writing covered with a different ink is most effectively read using', o: ['Ultraviolet fluorescence only', 'Infrared examination', 'X-ray diffraction', 'Polarised light microscopy'], a: 1,
      e: '<p><b>IR examination</b> works because inks that look identical in visible light frequently differ in IR absorption or luminescence — the covering ink becomes transparent while the underlying ink remains visible.</p><p>UV is more useful for chemical erasures and paper treatment. IR is the first-line technique for obliteration specifically.</p>' },

    { q: 'A forged signature produced by freehand simulation typically shows', o: ['Rapid, fluent line quality', 'Tremor, blunt beginnings and endings, and pen lifts', 'Greater natural variation than the genuine', 'Heavier pressure throughout'], a: 1,
      e: '<p>The forger writes <b>slowly and consciously</b>, producing tremor, hesitation, blunt starts and stops where the pen was placed and lifted deliberately, and unnatural pen lifts mid-stroke.</p><p>Genuine writing is fast and automatic, giving tapered strokes and fluent line quality. The underlying principle — <em>speed betrays authenticity</em> — resolves most questions in this topic.</p>' },

    { q: 'The watermark on a genuine Indian banknote is produced by', o: ['Printing with fluorescent ink', 'Varying the thickness of the paper during manufacture', 'Embossing after printing', 'Applying a transparent film'], a: 1,
      e: '<p>A true watermark is formed in the <b>paper itself</b> by varying its thickness while still wet, so it is visible only in <b>transmitted</b> light and cannot be felt.</p><p>Counterfeits <em>print</em> a simulated watermark, which is consequently visible in reflected light too — the standard field test is simply to look at the note without backlighting.</p>' },

    { q: 'Photomicrography is best defined as', o: ['Producing greatly reduced photographs such as microfilm', 'Photographing a small object through a microscope to obtain an enlarged image', 'Photographing documents under UV light', 'Photographing a crime scene from a distance'], a: 1,
      e: '<p><b>Photomicrography</b> = photography <em>through a microscope</em>, giving an enlarged image — the routine laboratory technique for recording striations, fibres and ridge detail.</p><p>Option (a) is <b>microphotography</b>, the reverse operation, and is the intended distractor. The syllabus names both together precisely so they can be contrasted.</p>' },

    { q: 'A chemical erasure on a document is best revealed by', o: ['Infrared luminescence', 'Ultraviolet examination showing a stain or altered fluorescence', 'ESDA', 'Comparison microscopy'], a: 1,
      e: '<p>Bleaching agents leave residues that alter the paper\'s <b>UV fluorescence</b>, so the treated area appears as a differently fluorescing patch.</p><p><em>Mechanical</em> erasure is better shown by oblique light, which reveals disturbed fibres and thinned paper. Distinguishing the two erasure types by the technique used to detect them is the usual framing.</p>' }
  ]
});

window.MPSC.units.push({
  id: 'p3gf5',
  paper: 'Paper III — General Forensic',
  title: 'V. Forensic DNA / Biology',
  marks: 10,
  syllabus: 'Cell- structure and cell organelles. Structure of DNA and RNA. Hereditary, Alleles & mutations. Mendel\'s law of inheritance. Concept of genetics polymorphism. Antigen and Antibody. Human skeletal system. Forensic significance of Blood, Semen, & Hair. Blood composition and blood groups (ABO, Rh, MN system), Secretor and non-secretor. Morphology of spermatozoa.',

  notes: [
    { h: 'DNA structure and forensic DNA typing',
      b: '<p>DNA is a <b>double helix</b> (Watson and Crick, 1953) of antiparallel strands. Backbone: deoxyribose sugar and phosphate. Bases pair <b>A–T (2 hydrogen bonds)</b> and <b>G–C (3 hydrogen bonds)</b>, so G–C rich DNA is more thermally stable. RNA differs in being single-stranded, using ribose, and substituting <b>uracil</b> for thymine.</p>' +
         '<p><b>Chargaff\'s rule:</b> A = T and G = C. If a sample is 30% adenine, it is 30% thymine, leaving 40% for G+C, i.e. 20% each — a standard calculation.</p>' +
         '<p>Forensic DNA typing targets <b>STRs (Short Tandem Repeats)</b> — short repeated motifs whose repeat number varies between individuals. Amplified by <b>PCR</b> and separated by capillary electrophoresis. The global standard core loci include the CODIS set; <b>amelogenin</b> is included for sex determination (X and Y differ in amplicon size).</p>' +
         '<p><b>Mitochondrial DNA</b> — <b>maternally inherited</b>, present in high copy number, so it survives in degraded remains, old bone, and <b>hair shafts without roots</b>. It cannot individualise, since all maternal relatives share it. <b>Y-STRs</b> are paternally inherited and used in sexual assault mixtures to isolate the male contributor.</p>' +
         '<p><b>India:</b> the DNA Technology (Use and Application) Regulation Bill has been debated but not enacted; DNA evidence is admitted under the general expert-evidence and electronic-record provisions.</p>' },

    { h: 'Blood — identification and grouping',
      b: '<p>Composition: plasma ~55%, formed elements ~45% (erythrocytes, leucocytes, platelets). <b>Mature human red blood cells lack a nucleus</b> — so blood DNA actually comes from <b>white</b> cells, a favourite examiner point. Birds, reptiles and fish have nucleated RBCs.</p>' +
         '<p>Examination proceeds in a fixed order:</p>' +
         '<ol><li><b>Presumptive</b> — <b>Kastle-Meyer</b> (phenolphthalein → pink), <b>benzidine</b> (obsolete, carcinogenic), <b>luminol</b> (chemiluminescence in the dark; detects dilutions to 1:1,000,000 and reveals cleaned-up bloodstains), <b>leucomalachite green</b>. All react with the <b>peroxidase activity of haem</b> and therefore give false positives with plant peroxidases and some oxidising agents.</li>' +
         '<li><b>Confirmatory</b> — <b>Takayama</b> (haemochromogen crystals) and <b>Teichmann</b> (haemin crystals).</li>' +
         '<li><b>Species of origin</b> — <b>precipitin test</b> with anti-human serum.</li>' +
         '<li><b>Individualisation</b> — DNA typing.</li></ol>' +
         '<table><tr><th>Group</th><th>Antigen on RBC</th><th>Antibody in serum</th></tr>' +
         '<tr><td>A</td><td>A</td><td>anti-B</td></tr><tr><td>B</td><td>B</td><td>anti-A</td></tr>' +
         '<tr><td>AB</td><td>A and B</td><td><b>none</b> — universal recipient</td></tr>' +
         '<tr><td>O</td><td>none</td><td>anti-A and anti-B — <b>universal donor</b></td></tr></table>' +
         '<p><b>Rh</b>: Rh-negative mothers carrying Rh-positive fetuses risk haemolytic disease of the newborn. The <b>MN system</b> is determined by co-dominant alleles giving groups M, N and MN.</p>' +
         '<p><b>Secretors (~80%)</b> secrete their ABO antigens into saliva, semen, sweat and other body fluids; <b>non-secretors (~20%)</b> do not. This allowed grouping from stains before DNA typing, and the <b>absorption-inhibition</b> test detects it.</p>' },

    { h: 'Semen and spermatozoa',
      b: '<p>Presumptive: <b>acid phosphatase (AP)</b> test — rapid purple colour. Confirmatory: <b>microscopic identification of spermatozoa</b>, or the <b>Florence (iodine)</b> and <b>Barberio (picric acid)</b> crystal tests, or immunological detection of <b>PSA (p30)</b>.</p>' +
         '<p><b>Spermatozoon morphology:</b> head (with the <b>acrosome</b> cap and the nucleus carrying the haploid genome), midpiece (packed with <b>mitochondria</b> supplying ATP), and tail/flagellum for motility. Overall length about <b>55–60 µm</b>. In an <b>azoospermic</b> individual PSA is essential, since no sperm will be found.</p>' +
         '<p><b>Differential extraction</b> separates sperm DNA from the victim\'s epithelial DNA in a sexual assault sample, exploiting the sperm head\'s resistance to lysis without a reducing agent such as DTT.</p>' },

    { h: 'Hair and the skeleton',
      b: '<p><b>Hair structure:</b> <b>cuticle</b> (outer scales — imbricate in humans; coronal or spinous in many animals), <b>cortex</b> (pigment granules, the main comparison region), <b>medulla</b> (central canal). The <b>medullary index</b> = medulla diameter ÷ hair diameter: <b>less than 0.33 in humans</b>, generally <b>above 0.5 in animals</b>. Growth phases: anagen (growing), catagen (transitional), telogen (resting — a shed telogen hair has a club root and usually little nuclear DNA, so mtDNA is used).</p>' +
         '<p><b>Skeleton:</b> 206 bones in the adult. Forensic anthropology establishes the biological profile:</p>' +
         '<ul><li><b>Sex</b> — the <b>pelvis</b> is most reliable (wider sciatic notch, subpubic angle over 90° in females), then the skull.</li>' +
         '<li><b>Age</b> — epiphyseal fusion, dental eruption, cranial suture closure, pubic symphysis.</li>' +
         '<li><b>Stature</b> — regression from long bone length, classically by the <b>Trotter and Gleser</b> formulae; the <b>femur</b> gives the best estimate.</li>' +
         '<li><b>Identification</b> — dental records, ante-mortem radiographs, and <b>superimposition</b> of skull and photograph.</li></ul>' }
  ],

  questions: [
    { q: 'DNA extracted from a liquid blood sample comes principally from', o: ['Red blood cells', 'White blood cells', 'Platelets', 'Plasma proteins'], a: 1,
      e: '<p><b>Mature human red blood cells have no nucleus</b> and therefore no nuclear DNA. The DNA in a blood sample comes from <b>leucocytes</b>.</p><p>Note that nucleated RBCs <em>are</em> found in birds, reptiles, amphibians and fish — which is one way species origin can be suggested microscopically.</p>' },

    { q: 'A person of blood group AB has', o: ['Anti-A and anti-B antibodies in serum', 'No ABO antibodies in serum', 'Only anti-A antibody', 'No antigens on the red cells'], a: 1,
      e: '<p>Group AB carries <b>both A and B antigens</b> on the red cells and therefore <b>no ABO antibodies</b> in serum — hence "universal recipient".</p><p>Group O is the mirror image: no antigens, both antibodies, universal donor. Option (d) describes group O, the deliberate near-miss.</p>' },

    { q: 'Luminol is used at a crime scene primarily to', o: ['Confirm that a stain is human blood', 'Detect latent or cleaned-up bloodstains by chemiluminescence', 'Determine the ABO group of a stain', 'Fix bloodstains for transport'], a: 1,
      e: '<p>Luminol reacts with the <b>peroxidase activity of haem</b> to emit blue light in darkness, revealing traces diluted to about 1:1,000,000 — including stains someone has attempted to wash away.</p><p>It is strictly <b>presumptive</b>: it gives false positives with bleach, some metals and plant peroxidases, and cannot establish that blood is human. Species requires the <b>precipitin</b> test.</p>' },

    { q: 'The medullary index of human hair is generally', o: ['Less than 0.33', 'Between 0.5 and 0.8', 'Greater than 1.0', 'Exactly 0.5'], a: 0,
      e: '<p>Medullary index = medulla diameter ÷ total hair diameter. It is <b>below 0.33 in humans</b> and typically <b>above 0.5 in animals</b>, making it a quick and reliable human-vs-animal discriminator.</p><p>Human medullae are also frequently fragmented or absent altogether, whereas animal medullae are usually continuous and well defined.</p>' },

    { q: 'Mitochondrial DNA is particularly valuable in forensic casework because it is', o: ['Unique to each individual', 'Present in high copy number and maternally inherited', 'Found only in the cell nucleus', 'More discriminating than STR typing'], a: 1,
      e: '<p>High copy number means mtDNA survives in degraded material where nuclear DNA has been destroyed — old bone, teeth, and <b>rootless hair shafts</b>.</p><p>Its limitation is the flip side of maternal inheritance: <b>all maternal relatives share the same sequence</b>, so it cannot individualise. Options (a) and (d) both invert this.</p>' },

    { q: 'The confirmatory test for the presence of semen in a stain is', o: ['The acid phosphatase test', 'Microscopic identification of spermatozoa', 'The Kastle-Meyer test', 'The precipitin test'], a: 1,
      e: '<p>Acid phosphatase is <b>presumptive</b> only. Confirmation requires <b>visualising spermatozoa</b>, or detecting <b>PSA (p30)</b> — essential where the donor is azoospermic or vasectomised.</p><p>Kastle-Meyer is a presumptive blood test and precipitin determines species — both belong to a different analyte, which is what the question checks.</p>' },

    { q: 'In a DNA sample, 30% of the bases are adenine. The percentage of guanine is', o: ['30%', '20%', '40%', '70%'], a: 1,
      e: '<p>By <b>Chargaff\'s rule</b>, A = T, so T is also 30% and A+T = 60%. The remaining <b>40%</b> is G+C, split equally since G = C — hence <b>20% guanine</b>.</p><p>Note this holds only for double-stranded DNA. Single-stranded DNA and RNA do not obey Chargaff\'s rule, which is a common follow-up trap.</p>' },

    { q: 'A secretor is a person who', o: ['Has blood group O', 'Secretes ABO blood group antigens into body fluids such as saliva and semen', 'Produces excess sweat', 'Lacks the Rh antigen'], a: 1,
      e: '<p>About <b>80%</b> of people are secretors, releasing their ABO antigens into saliva, semen, sweat and vaginal secretions. Detection is by <b>absorption-inhibition</b>.</p><p>Before DNA typing this permitted blood grouping from a stain containing no blood at all — historically important, and the reason the syllabus still names it.</p>' },

    { q: 'Which skeletal element is most reliable for determining the sex of unidentified remains?', o: ['Femur', 'Skull', 'Pelvis', 'Sternum'], a: 2,
      e: '<p>The <b>pelvis</b> is most reliable, because it is adapted for childbirth in females — a wider sciatic notch, a subpubic angle exceeding 90°, and a broader, shallower shape overall.</p><p>The skull is second best. The femur is used chiefly for <b>stature</b> estimation via Trotter and Gleser regression — a different question in the biological profile.</p>' }
  ]
});

window.MPSC.units.push({
  id: 'p3gf6',
  paper: 'Paper III — General Forensic',
  title: 'VI. Forensic Toxicology',
  marks: 10,
  syllabus: 'Forensic Toxicology - introduction, concept and significance. Definition and classification of poisons. Definition and classification of liquors based on Origin (Indian made Foreign liquor, country made liquor and illicit liquors). Fermented and distilled methods. Characteristics of Beer, Wine and whiskey. Analysis of beverages - alcoholic and non alcoholic. Viscera and its preservation.',

  notes: [
    { h: 'Classification of poisons',
      b: '<p><b>Paracelsus:</b> "the dose makes the poison" — any substance is toxic at sufficient dose. <b>LD50</b> is the dose lethal to 50% of a test population; a <em>lower</em> LD50 means a <em>more</em> toxic substance.</p>' +
         '<table><tr><th>Class</th><th>Examples</th></tr>' +
         '<tr><td><b>Corrosives</b></td><td>Strong acids (H₂SO₄, HNO₃, HCl), alkalis (NaOH, KOH)</td></tr>' +
         '<tr><td><b>Irritants</b></td><td>Inorganic — arsenic, mercury, lead; organic — croton oil, castor (ricin); mechanical — powdered glass</td></tr>' +
         '<tr><td><b>Neurotics (CNS)</b></td><td>Cerebral — opium, alcohol, datura; spinal — <b>strychnine</b>; peripheral — curare</td></tr>' +
         '<tr><td><b>Cardiac</b></td><td>Oleander, aconite, digitalis</td></tr>' +
         '<tr><td><b>Asphyxiants</b></td><td>Carbon monoxide, carbon dioxide, hydrogen cyanide</td></tr></table>' +
         '<p><b>Signature findings</b> worth memorising: <b>arsenic</b> — "rice water" stools, <b>Mees\' lines</b> on nails, garlic odour, detectable in hair and nails long after death; <b>carbon monoxide</b> — <b>cherry-red</b> post-mortem lividity, binds haemoglobin with roughly 200–250 times the affinity of oxygen; <b>cyanide</b> — bitter almond odour, brick-red lividity, extremely rapid; <b>organophosphates</b> — inhibit acetylcholinesterase, causing pinpoint pupils and excess secretions, treated with atropine and pralidoxime; <b>strychnine</b> — opisthotonos and risus sardonicus with the victim conscious throughout.</p>' },

    { h: 'Viscera collection and preservation',
      b: '<p>This is the topic\'s highest-yield practical content.</p>' +
         '<ul><li><b>Preservative: saturated saline</b> is the routine choice for viscera. <b>Rectified spirit</b> is used <em>except</em> where alcohol or an alcohol-related poison is suspected — since it would destroy the very finding sought. For <b>suspected alcohol</b>, use <b>sodium fluoride with potassium oxalate</b>: fluoride inhibits microbial fermentation that would otherwise generate post-mortem alcohol, and oxalate anticoagulates.</li>' +
         '<li>Volume of preservative should be roughly <b>three times</b> the volume of the viscera and must cover it completely.</li>' +
         '<li><b>Standard viscera</b>: stomach with contents; upper portion of small intestine with contents; about <b>500 g of liver</b> (the principal organ of metabolism and detoxification, so it concentrates most poisons); <b>one half of each kidney</b>; blood; urine. Add brain for volatile poisons, and hair and nails where <b>chronic arsenic or heavy metal</b> poisoning is suspected.</li>' +
         '<li>Containers must be clean, wide-mouthed, separately sealed and labelled, with a <b>sample of the preservative itself</b> sent as a control — otherwise the defence can attribute any finding to contamination.</li></ul>' +
         '<div class="tip"><b>Chain of custody.</b> Every transfer is documented and the seal is verified on receipt. A break in the chain is the commonest ground on which toxicological evidence is successfully challenged.</div>' },

    { h: 'Liquors: classification and manufacture',
      b: '<ul><li><b>IMFL (Indian Made Foreign Liquor)</b> — spirits made in India to foreign styles: whisky, rum, gin, vodka, brandy.</li>' +
         '<li><b>Country liquor</b> — licensed, locally produced, traditional.</li>' +
         '<li><b>Illicit liquor</b> — unlicensed and illegally distilled. The forensic danger is <b>methanol</b> contamination, the cause of hooch tragedies.</li></ul>' +
         '<p><b>Fermentation</b> converts sugar to ethanol and CO₂ by yeast (<em>Saccharomyces cerevisiae</em>), and stops on its own at roughly <b>14–15% alcohol</b> because the yeast is killed by its own product. <b>Distillation</b> then separates by boiling point (ethanol 78.3 °C, water 100 °C) to reach higher strengths.</p>' +
         '<table><tr><th>Beverage</th><th>Source</th><th>Process</th><th>Typical ABV</th></tr>' +
         '<tr><td>Beer</td><td>Malted barley + hops</td><td>Fermented</td><td>4–8%</td></tr>' +
         '<tr><td>Wine</td><td>Grapes</td><td>Fermented</td><td>9–16%</td></tr>' +
         '<tr><td>Whisky</td><td>Fermented grain mash</td><td><b>Distilled</b>, cask-aged</td><td>40–50%</td></tr></table>' +
         '<p><b>Proof spirit</b> (Indian/British system): 100° proof = <b>57.1% ABV</b>. <b>Absolute alcohol</b> is 100% ethanol. Analysis of beverages is by <b>GC-FID or GC-MS with headspace sampling</b>, which separates and quantifies ethanol and methanol together.</p>' +
         '<div class="tip"><b>Methanol.</b> Metabolised by alcohol dehydrogenase to <b>formaldehyde and then formic acid</b>, causing severe metabolic acidosis and <b>blindness</b> via optic nerve damage. The antidote is <b>ethanol or fomepizole</b>, which competitively occupy the same enzyme so the methanol is excreted unmetabolised. This is the single most examinable fact in the topic.</div>' }
  ],

  questions: [
    { q: 'When alcohol poisoning is suspected, the correct preservative for a blood sample is', o: ['Rectified spirit', 'Saturated saline', 'Sodium fluoride with potassium oxalate', 'Formalin'], a: 2,
      e: '<p><b>Sodium fluoride</b> inhibits the microbial fermentation that would otherwise <em>generate</em> alcohol in the sample after collection, and <b>potassium oxalate</b> acts as anticoagulant.</p><p><b>Rectified spirit must never be used</b> where alcohol is in question — it is itself alcohol and would destroy the finding. That trap is the entire point of the question.</p>' },

    { q: 'Methanol poisoning causes blindness because methanol is metabolised to', o: ['Acetaldehyde and acetic acid', 'Formaldehyde and formic acid', 'Ethanol and water', 'Oxalic acid only'], a: 1,
      e: '<p>Alcohol dehydrogenase converts methanol to <b>formaldehyde</b> and then <b>formic acid</b>, which damages the optic nerve and produces severe metabolic acidosis.</p><p>The antidote is <b>ethanol or fomepizole</b>: both compete for alcohol dehydrogenase, so methanol is excreted unchanged. Acetaldehyde and acetic acid (option a) are the <em>ethanol</em> metabolites.</p>' },

    { q: 'Cherry-red post-mortem lividity is characteristic of poisoning by', o: ['Cyanide', 'Carbon monoxide', 'Arsenic', 'Organophosphate'], a: 1,
      e: '<p><b>Carbon monoxide</b> forms carboxyhaemoglobin, which is bright cherry-red. CO binds haemoglobin roughly 200–250 times more avidly than oxygen.</p><p><b>Cyanide</b> gives a <em>brick-red</em> lividity with a bitter almond odour — the intended near-miss. Arsenic gives no characteristic lividity colour.</p>' },

    { q: 'Fermentation alone cannot produce a beverage stronger than about', o: ['5% alcohol', '15% alcohol', '40% alcohol', '57% alcohol'], a: 1,
      e: '<p>Yeast is killed by its own ethanol at roughly <b>14–15% ABV</b>, which caps fermented drinks such as wine and beer.</p><p>Exceeding that requires <b>distillation</b>, exploiting the boiling point difference between ethanol (78.3 °C) and water. This is precisely why whisky, rum and brandy are classed as distilled rather than fermented beverages.</p>' },

    { q: 'In a routine viscera collection, the approximate quantity of liver preserved is', o: ['50 g', '100 g', '500 g', '1500 g'], a: 2,
      e: '<p>About <b>500 g of liver</b> is taken, because the liver is the chief organ of metabolism and detoxification and therefore concentrates most poisons.</p><p>The standard set also includes stomach with contents, upper small intestine with contents, half of each kidney, blood and urine — with hair and nails added where <b>chronic arsenic</b> is suspected.</p>' },

    { q: 'Mees\' lines on the nails are a classic sign of chronic poisoning by', o: ['Lead', 'Arsenic', 'Mercury', 'Thallium'], a: 1,
      e: '<p><b>Mees\' lines</b> — transverse white bands across the nails — are classically associated with <b>arsenic</b>. Chronic exposure also gives "rice water" stools, a garlic odour and peripheral neuropathy.</p><p>Because arsenic is deposited in <b>keratin</b>, hair and nails retain it long after death and can even give a rough exposure timeline along the length of a hair.</p>' },

    { q: 'In the Indian system, 100° proof spirit corresponds to an alcohol content of approximately', o: ['50.0% ABV', '57.1% ABV', '75.0% ABV', '100% ABV'], a: 1,
      e: '<p>In the British/Indian system, <b>100° proof = 57.1% ABV</b>. The historic definition is the weakest spirit that will still permit gunpowder soaked in it to ignite.</p><p>Do not confuse this with the American system, where proof is simply twice the ABV, making 100 proof = 50% — which is option (a), the deliberate trap.</p>' },

    { q: 'Strychnine poisoning characteristically produces', o: ['Pinpoint pupils and excessive secretions', 'Violent convulsions with the victim remaining conscious', 'Cherry-red lividity', 'Rice water stools'], a: 1,
      e: '<p>Strychnine blocks inhibitory glycine receptors in the spinal cord, producing violent generalised convulsions with <b>opisthotonos</b> and <b>risus sardonicus</b> — while <b>consciousness is retained</b>, which is its grim hallmark.</p><p>Option (a) is organophosphate poisoning, (c) carbon monoxide and (d) arsenic. Each option is a genuine signature for a different poison, which is what makes this a good discriminator.</p>' }
  ]
});
