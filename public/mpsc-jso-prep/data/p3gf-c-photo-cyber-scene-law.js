/* Paper III, Part B — General Forensic. Topics VII-X. */

window.MPSC.units.push({
  id: 'p3gf7',
  paper: 'Paper III — General Forensic',
  title: 'VII. Forensic Photography',
  marks: 10,
  syllabus: 'Fundamentals of photography. Role of photography in forensic science & photographs as evidence. Use of natural light and portrait photography. Micro and Macro photography. Crime scene and laboratory photography. Advanced Digital Photography Techniques, Infra-red and UV photography and its application in Forensics. Specialized techniques used for Documents, Fingerprints.',

  notes: [
    { h: 'The exposure triangle',
      b: '<ul><li><b>Aperture (f-number)</b> — controls light admitted and <b>depth of field</b>. A <em>smaller</em> f-number (f/2.8) means a <em>wider</em> opening, more light and <b>shallow</b> depth of field. A <em>larger</em> f-number (f/16) means a narrower opening and <b>greater</b> depth of field. The inverse relationship is the standard trap.</li>' +
         '<li><b>Shutter speed</b> — controls duration and motion blur. Fast freezes movement; slow requires a tripod.</li>' +
         '<li><b>ISO</b> — sensor sensitivity. Higher ISO permits darker scenes but introduces <b>noise/grain</b>.</li></ul>' +
         '<p>Each full "stop" doubles or halves the light, so the three can be traded against one another. For crime scene work, <b>maximum depth of field</b> is usually wanted — a high f-number with a tripod and correspondingly slow shutter.</p>' },

    { h: 'Crime scene photography protocol',
      b: '<p>Photograph <b>before anything is moved</b>, working from general to specific:</p>' +
         '<ol><li><b>Overall / long range</b> — establishes the scene and its surroundings, including approach and exits.</li>' +
         '<li><b>Mid-range</b> — relates an item of evidence to a fixed reference point, showing spatial relationships.</li>' +
         '<li><b>Close-up</b> — the item filling the frame, taken <b>twice</b>: once without a scale and once <b>with a scale</b> and identifier.</li></ol>' +
         '<p>Rules: the camera should be <b>perpendicular</b> to the subject to avoid perspective distortion; a photographic log records every frame; and evidence must never be altered or added for effect. Maintain a <b>continuous, unedited</b> set — enhancement is permitted only on copies and must be documented.</p>' },

    { h: 'Macro, micro and specialised techniques',
      b: '<ul><li><b>Macrophotography</b> — close-up at roughly life size, from about 1:1 up to 10:1, <em>without</em> a microscope. Used for tool marks, wounds, fingerprints, cartridge cases.</li>' +
         '<li><b>Photomicrography</b> — photography <em>through a microscope</em>, above about 10× to thousands of times. Used for fibres, hair, striations, pollen.</li>' +
         '<li><b>Oblique/side lighting</b> — a low-angle beam that casts shadows, revealing surface relief: indented writing, dust prints, tool marks, footwear impressions.</li>' +
         '<li><b>Ultraviolet</b> — reveals body fluids (semen and saliva fluoresce), bruising invisible to the eye, altered documents, and security features.</li>' +
         '<li><b>Infrared</b> — penetrates ink and staining. Reads <b>obliterated writing</b>, distinguishes inks that look identical, recovers writing on charred documents, and shows tattoos in decomposed tissue.</li>' +
         '<li><b>Alternate Light Source (ALS)</b> — tuned wavelengths with barrier filters, the general-purpose scene tool for fluorescence.</li></ul>' +
         '<p><b>Fingerprint photography</b> uses a scale in-plane with the ridge detail, even lighting to avoid hot spots, and a perpendicular camera axis. Prints on curved or mirrored surfaces need polarising filters to suppress reflection.</p>' },

    { h: 'Photographs as evidence',
      b: '<p>A photograph is admissible when shown to be a <b>fair and accurate representation</b> of what it depicts, supported by the photographer\'s testimony, the log, and an unbroken chain of custody.</p>' +
         '<p>For <b>digital</b> images the position is stricter: the original file must be preserved unaltered, hashed on acquisition, and any enhancement performed on a working copy with every step recorded so it can be repeated. In India, digital photographs are electronic records — admitted under <b>Section 63 of the Bharatiya Sakshya Adhiniyam, 2023</b> (formerly Section 65B of the Evidence Act), which requires the accompanying certificate.</p>' }
  ],

  questions: [
    { q: 'To obtain the greatest depth of field when photographing a crime scene, the photographer should use', o: ['A small f-number such as f/2.8', 'A large f-number such as f/16', 'The highest available ISO', 'The fastest available shutter speed'], a: 1,
      e: '<p>A <b>large f-number means a narrow aperture</b>, which increases depth of field so that near and far objects are both sharp — exactly what a scene photograph needs.</p><p>The inverse relationship between f-number and aperture size is the trap in option (a). The cost is less light, so a tripod and slower shutter are required.</p>' },

    { q: 'Infrared photography is most useful in document examination for', o: ['Detecting fingerprints on paper', 'Reading obliterated or charred writing', 'Measuring paper thickness', 'Determining the age of ink'], a: 1,
      e: '<p>Inks that appear identical in visible light often differ in <b>IR absorption</b>, so a covering ink can become transparent while the writing beneath remains visible. IR also recovers writing on <b>charred</b> documents.</p><p>UV is the better choice for chemical erasures and security features — the two are routinely contrasted in this topic.</p>' },

    { q: 'The correct sequence for crime scene photography is', o: ['Close-up, mid-range, overall', 'Overall, mid-range, close-up', 'Mid-range, overall, close-up', 'Any order, provided all are taken'], a: 1,
      e: '<p>Work <b>general to specific</b>: overall establishes the scene, mid-range relates evidence to fixed reference points, and close-up records detail — the last taken <b>twice</b>, with and without a scale.</p><p>The order matters evidentially: it lets a court follow the scene from context down to detail without a gap in the visual chain.</p>' },

    { q: 'Macrophotography differs from photomicrography in that macrophotography', o: ['Uses a microscope', 'Produces images at approximately life size without a microscope', 'Can only be done in ultraviolet light', 'Always requires a scale'], a: 1,
      e: '<p><b>Macrophotography</b> works at roughly 1:1 to 10:1 using a close-focusing lens — <em>no microscope</em>. <b>Photomicrography</b> is photography through a microscope at far higher magnification.</p><p>The distinction is examinable because the syllabus lists "Micro and Macro photography" together, inviting exactly this comparison.</p>' },

    { q: 'Oblique (side) lighting is used at a crime scene principally to reveal', o: ['Body fluid stains', 'Surface relief such as dust prints, indentations and tool marks', 'Bloodstain species of origin', 'Ink differences in documents'], a: 1,
      e: '<p>A low-angle beam casts <b>shadows across surface irregularities</b>, making dust impressions, footwear marks, indented writing and tool marks visible when they are invisible under direct light.</p><p>Body fluids are found with UV or an ALS; ink differences need IR. Each option maps to a genuine but different technique.</p>' },

    { q: 'A close-up photograph of an item of evidence should be taken', o: ['Only with a scale', 'Only without a scale', 'Both with and without a scale', 'With a scale placed outside the frame'], a: 2,
      e: '<p><b>Both.</b> The version without a scale shows the item undisturbed; the version with an in-plane scale allows dimensions to be established and, for impressions, permits 1:1 comparison prints.</p><p>The scale must lie in the <b>same plane</b> as the subject, with the camera perpendicular — otherwise perspective distortion makes the measurement unreliable.</p>' }
  ]
});

window.MPSC.units.push({
  id: 'p3gf8',
  paper: 'Paper III — General Forensic',
  title: 'VIII. Cyber Forensic (general level)',
  marks: 10,
  syllabus: 'Basics of computer, hardware & accessories, operating system & software. Computer forensic - definition, types of computer crimes. Cyber crime & digital evidence. Cyber crime - definition, crimes on internet, hacking, virus, worms, cookies, pornography. Software piracy, intellectual property and computer security. Encryption & decryption.',

  notes: [
    { h: 'Scope note — pitch this lower than Paper IV',
      b: '<div class="tip">This is a <b>10-mark general topic</b> sat by every division, including DNA and Ballistics candidates who are not computer specialists. Expect <b>definitional and terminology questions</b>, not the depth of Paper IV. If you have prepared Paper IV properly, this topic is nearly free marks — but do learn the malware taxonomy and the IT Act sections, which Paper IV does not cover.</div>' },

    { h: 'Malware taxonomy',
      b: '<table><tr><th>Type</th><th>Defining property</th></tr>' +
         '<tr><td><b>Virus</b></td><td>Attaches to a host file; needs <b>user action</b> to execute and spread</td></tr>' +
         '<tr><td><b>Worm</b></td><td><b>Self-replicating and self-propagating</b> across networks; needs <b>no host file and no user action</b></td></tr>' +
         '<tr><td><b>Trojan horse</b></td><td>Disguised as legitimate software; <b>does not self-replicate</b></td></tr>' +
         '<tr><td><b>Ransomware</b></td><td>Encrypts data and demands payment</td></tr>' +
         '<tr><td><b>Spyware / keylogger</b></td><td>Covertly gathers information or records keystrokes</td></tr>' +
         '<tr><td><b>Rootkit</b></td><td>Conceals its own presence and that of other malware at a privileged level</td></tr>' +
         '<tr><td><b>Botnet</b></td><td>Network of compromised machines ("zombies") under remote control</td></tr>' +
         '<tr><td><b>Logic bomb</b></td><td>Dormant code triggered by a condition or date</td></tr></table>' +
         '<p><b>The virus-vs-worm distinction is the single most examined point here:</b> a virus needs a host and a user; a worm needs neither.</p>' +
         '<p><b>Cookies</b> are small text files a website stores in the browser to maintain state — session, preferences, tracking. They are <b>not malware and cannot execute</b>, but forensically they evidence which sites a user visited and when.</p>' },

    { h: 'Cyber crime categories',
      b: '<ul><li><b>Against individuals</b> — identity theft, cyberstalking, defamation, phishing, cyberbullying, obscene content.</li>' +
         '<li><b>Against property</b> — hacking, software piracy, credit card fraud, IPR infringement.</li>' +
         '<li><b>Against organisations/government</b> — unauthorised access, DoS and DDoS, cyber terrorism, website defacement.</li></ul>' +
         '<p><b>Social engineering</b> attacks the human rather than the machine: <b>phishing</b> (mass deceptive email), <b>spear phishing</b> (targeted at a named individual), <b>vishing</b> (voice), <b>smishing</b> (SMS), and <b>pharming</b> (DNS redirection to a fake site).</p>' +
         '<p><b>Hacker classes:</b> black hat (malicious), white hat (authorised, ethical), grey hat (unauthorised but not malicious), script kiddie (using others\' tools without understanding).</p>' },

    { h: 'Encryption',
      b: '<table><tr><th></th><th>Symmetric</th><th>Asymmetric</th></tr>' +
         '<tr><td>Keys</td><td><b>One shared</b> key encrypts and decrypts</td><td><b>Key pair</b> — public and private</td></tr>' +
         '<tr><td>Speed</td><td><b>Fast</b></td><td>Slow</td></tr>' +
         '<tr><td>Problem solved</td><td>Bulk data</td><td><b>Key distribution</b>; digital signatures</td></tr>' +
         '<tr><td>Examples</td><td>AES, DES, 3DES, Blowfish</td><td>RSA, Diffie–Hellman, ECC</td></tr></table>' +
         '<p><b>Confidentiality:</b> encrypt with the <b>recipient\'s public key</b>; only their private key can open it. <b>Digital signature:</b> encrypt the hash with the <b>sender\'s private key</b>; anyone can verify with the sender\'s public key, which proves origin and integrity — <b>non-repudiation</b>. Getting these two the right way round is the classic exam discriminator.</p>' +
         '<p>Practical systems are <b>hybrid</b>: asymmetric cryptography exchanges a symmetric session key, which then does the bulk work. Note that <b>hashing is not encryption</b> — it is one-way and has no key.</p>' },

    { h: 'Indian law and IPR',
      b: '<p><b>Information Technology Act, 2000</b> (amended 2008) — key sections:</p>' +
         '<ul><li><b>s.43</b> — damage to computer/system, civil penalty.</li>' +
         '<li><b>s.65</b> — tampering with computer source documents.</li>' +
         '<li><b>s.66</b> — computer-related offences (hacking). <b>66C</b> identity theft, <b>66D</b> cheating by personation, <b>66E</b> violation of privacy, <b>66F</b> cyber terrorism.</li>' +
         '<li><b>s.67</b> — publishing or transmitting obscene material in electronic form; <b>67A</b> sexually explicit; <b>67B</b> child pornography.</li>' +
         '<li><b>s.69</b> — powers of interception, monitoring and decryption.</li>' +
         '<li><b>s.79</b> — intermediary liability and safe harbour.</li></ul>' +
         '<p><b>Section 66A was struck down</b> as unconstitutional in <em>Shreya Singhal v. Union of India</em> (2015) — a very likely question.</p>' +
         '<p><b>IPR:</b> copyright protects expression (software is protected as a literary work under the Copyright Act, 1957); patents protect inventions; trademarks protect marks and branding; trade secrets protect confidential business information. <b>Software piracy</b> is unauthorised copying, distribution or use.</p>' },

    { h: 'Computer basics, hardware & OS/software',
      b: '<p>At this general level, expect only <b>identification-level</b> questions on hardware and software categories — not internal architecture.</p>' +
         '<ul><li><b>Hardware</b> — the physical parts: <b>input</b> devices (keyboard, mouse, scanner), <b>output</b> devices (monitor, printer), the <b>CPU</b> (processes instructions; contains the ALU and control unit), <b>primary memory</b> — <b>RAM</b> (volatile, temporary working memory, lost on power-off) and <b>ROM</b> (non-volatile, holds firmware/BIOS) — and <b>secondary storage</b> (HDD, SSD, optical/USB media — persists without power).</li>' +
         '<li><b>Accessories/peripherals</b> — external devices connected to a computer: printers, scanners, external drives, webcams, UPS.</li>' +
         '<li><b>Operating system</b> — system software that manages hardware and provides the platform on which other programs run (e.g. Windows, Linux, macOS, Android). It handles memory, files, devices and processes.</li>' +
         '<li><b>Application software</b> — programs that perform user tasks (word processors, browsers) and run <em>on top of</em> the OS, not instead of it.</li></ul>' +
         '<div class="tip">The recurring exam trap is <b>RAM vs ROM</b>: RAM is volatile and read-write; ROM is non-volatile and (traditionally) read-only, storing boot instructions.</div>' },

    { h: 'Computer forensics — definition and crime types',
      b: '<p><b>Computer forensics (digital forensics)</b> is the application of scientific methods to identify, preserve, analyse and present <b>digital evidence</b> in a manner that is legally admissible. Its core aim is to reconstruct events while preserving the <b>integrity</b> of the original data — typically via a <b>write-blocked, hashed image</b> of the source, never the original media itself.</p>' +
         '<p><b>Types of computer crime</b> (by the role of the computer):</p>' +
         '<ul><li><b>Computer as the target</b> — hacking, denial-of-service, data theft, virus/malware attacks on a system.</li>' +
         '<li><b>Computer as the instrument/tool</b> — used to commit a traditional crime: online fraud, identity theft, forgery of e-documents.</li>' +
         '<li><b>Computer as incidental</b> — merely stores evidence of an unrelated crime, e.g. a drug dealer\'s contact list on a phone.</li></ul>' +
         '<p><b>Digital evidence</b> is any probative information stored or transmitted in digital form. Its defining properties are that it is <b>latent</b> (not directly visible, needs a tool to reveal), easily <b>altered or destroyed</b>, and can be <b>duplicated exactly</b> — which is why forensic copies are hash-verified against the original.</p>' }
  ],

  questions: [
    { q: 'The essential difference between a computer virus and a worm is that a worm', o: ['Is always more destructive', 'Self-replicates and spreads without needing a host file or user action', 'Cannot be detected by antivirus software', 'Only affects networked servers'], a: 1,
      e: '<p>A <b>worm is self-contained and self-propagating</b> — it needs neither a host file nor any user action. A <b>virus</b> attaches to a host file and requires the user to run it.</p><p>Destructiveness is irrelevant to the classification, so (a) is wrong. This distinction is the most frequently asked point in the whole topic.</p>' },

    { q: 'Section 66A of the Information Technology Act, 2000 was', o: ['Amended in 2008 to widen its scope', 'Struck down as unconstitutional by the Supreme Court in 2015', 'Made a non-bailable offence', 'Replaced by Section 66F'], a: 1,
      e: '<p>In <b><em>Shreya Singhal v. Union of India</em> (2015)</b> the Supreme Court struck down s.66A as violating Article 19(1)(a), holding it vague and overbroad.</p><p>It had criminalised sending "grossly offensive" or "menacing" messages. The Court notably upheld s.69A (blocking powers) in the same judgment — a nuance worth carrying.</p>' },

    { q: 'To send a confidential message using asymmetric cryptography, the sender encrypts it with', o: ['The sender\'s private key', 'The sender\'s public key', 'The recipient\'s public key', 'The recipient\'s private key'], a: 2,
      e: '<p>For <b>confidentiality</b>, encrypt with the <b>recipient\'s public key</b> — only the matching private key, which only the recipient holds, can decrypt it.</p><p>Encrypting with the <em>sender\'s private key</em> (option a) is a <b>digital signature</b>: it proves origin but provides no secrecy, since the sender\'s public key is available to everyone. Confusing these two is the standard error.</p>' },

    { q: 'Cookies stored by a web browser are', o: ['A form of virus', 'Small text files recording session and preference data, useful as browsing evidence', 'Encrypted password stores', 'Executable programs downloaded from websites'], a: 1,
      e: '<p>Cookies are <b>passive text files</b> — they cannot execute and are not malware. Forensically they are valuable because they evidence <b>which sites were visited and when</b>, and may persist after browser history is cleared.</p><p>The syllabus lists cookies alongside viruses and worms, which invites the misconception that they are malicious. They are not.</p>' },

    { q: 'Under the Information Technology Act, 2000, identity theft is dealt with under Section', o: ['66C', '67A', '43', '72'], a: 0,
      e: '<p><b>s.66C</b> covers identity theft — fraudulent use of another\'s electronic signature, password or unique identification feature.</p><p>Neighbouring sections: <b>66D</b> cheating by personation, <b>66E</b> privacy violation, <b>66F</b> cyber terrorism, <b>67</b> obscene material. Learning 66C/66D/66E/66F as a block is the efficient approach.</p>' },

    { q: 'Which of the following is a symmetric encryption algorithm?', o: ['RSA', 'AES', 'Diffie–Hellman', 'ECC'], a: 1,
      e: '<p><b>AES</b> uses a single shared key for both encryption and decryption — symmetric. RSA, Diffie–Hellman and ECC are all asymmetric.</p><p>Symmetric algorithms are far faster, which is why real systems are <b>hybrid</b>: RSA or Diffie–Hellman establishes a session key, and AES then encrypts the actual traffic.</p>' },

    { q: 'A Trojan horse differs from a virus in that a Trojan', o: ['Spreads faster', 'Does not self-replicate', 'Cannot steal data', 'Only affects mobile devices'], a: 1,
      e: '<p>A <b>Trojan does not self-replicate</b>. It relies entirely on deceiving the user into installing it by masquerading as legitimate software.</p><p>Trojans are frequently the most damaging category in practice — backdoors, banking Trojans and remote access tools — so (c) is plainly wrong. Replication behaviour, not damage, defines the categories.</p>' },

    { q: 'Which of the following best describes RAM in a computer system?', o: ['Non-volatile memory that stores the BIOS/firmware', 'Volatile memory used as temporary working storage, lost on power-off', 'A type of secondary storage device', 'An input peripheral'], a: 1,
      e: '<p><b>RAM</b> (Random Access Memory) is <b>volatile</b> — its contents are lost the instant power is removed — and serves as the CPU\'s temporary working memory while programs run.</p><p><b>ROM</b> is the non-volatile counterpart that holds boot/firmware instructions, which is the standard contrast tested alongside this.</p>' },

    { q: 'An operating system is best described as', o: ['An input/output peripheral', 'Application software used to perform a specific user task', 'System software that manages hardware and provides the platform for other programs to run on', 'A form of secondary storage'], a: 2,
      e: '<p>The <b>operating system</b> (e.g. Windows, Linux, Android) is system software: it manages memory, files, devices and processes, and provides the base on which <b>application software</b> — word processors, browsers — runs.</p><p>Confusing "system software" with "application software" is the common trap; the OS sits beneath applications, not alongside them as a peripheral.</p>' },

    { q: 'In computer forensics, a forensic examiner works on', o: ['The original media directly, to save time', 'A write-blocked, hashed image of the original media', 'A verbal description of the data', 'A printed copy of all files only'], a: 1,
      e: '<p>To preserve the <b>integrity</b> of the original evidence, examiners work on a <b>write-protected forensic image</b> whose hash matches the source exactly, so any analysis can be shown not to have altered the original.</p><p>Working directly on original media risks unintentional modification and would compromise admissibility.</p>' },

    { q: 'When a computer network is used merely to steal money through fraudulent online transactions, the computer is acting as', o: ['The target of the crime', 'The instrument/tool of the crime', 'Incidental to the crime', 'Neither target nor tool'], a: 1,
      e: '<p>Computer crimes are classified by the computer\'s role: as the <b>target</b> (e.g. hacking a system), as the <b>instrument</b> used to commit a traditional crime such as online fraud, or as merely <b>incidental</b>, storing evidence of an unrelated offence.</p><p>Online financial fraud uses the computer as a <b>tool</b> to commit theft/cheating, so it falls in the second category.</p>' },

    { q: 'A defining property of digital evidence that most requires cautious handling is that it is', o: ['Always physically visible without special tools', 'Easily altered or destroyed, yet also exactly duplicable', 'Immune to deletion', 'Always stored on a single device only'], a: 1,
      e: '<p>Digital evidence is <b>latent</b> (needs a tool to reveal, unlike a fingerprint one can see) and is <b>easily altered or destroyed</b> — a single write operation can overwrite it. It can, however, be <b>duplicated exactly</b>, which is why hash-verified imaging is standard practice.</p><p>This combination — fragile yet perfectly copyable — is unique to digital evidence and is why forensic protocols emphasise imaging before analysis.</p>' },

    { q: 'Peripherals such as printers, scanners and external drives are examples of', o: ['Operating system components', 'Application software', 'Hardware accessories connected to a computer', 'Encryption algorithms'], a: 2,
      e: '<p><b>Peripherals/accessories</b> are external hardware devices attached to a computer to extend its input, output or storage capability — printers and scanners are output/input devices, external drives add secondary storage.</p><p>They are physical hardware, distinct from the operating system or application software, which are both categories of software, not physical devices.</p>' },

    { q: 'The core aim of the definition of computer forensics is to', o: ['Repair damaged computer hardware', 'Identify, preserve, analyse and present digital evidence in a legally admissible manner', 'Install antivirus software on seized systems', 'Design new operating systems'], a: 1,
      e: '<p><b>Computer forensics</b> is the application of scientific methods to <b>identify, preserve, analyse and present digital evidence</b> so that it holds up in court — the emphasis throughout is on preserving the integrity of the original data.</p><p>Hardware repair and software design are unrelated technical activities, not forensic ones — a common distractor pairing at this general level.</p>' }
  ]
});

window.MPSC.units.push({
  id: 'p3gf9',
  paper: 'Paper III — General Forensic',
  title: 'IX. Crime Scene Investigation',
  marks: 10,
  syllabus: 'Criminalistics - definition, meaning of recognition, collection, identification, individualization and interpretation of physical evidence. Crime Scene - definition, securing the scene, documentation of crime scene (Sketch & photography). Types of Crime Scene - Indoor, Outdoor & Mobile. Secondary Crime Scene. Nature & importance of crime Scene reconstruction.',

  notes: [
    { h: 'Locard and the core concepts',
      b: '<p><b>Locard\'s Exchange Principle:</b> <em>every contact leaves a trace</em>. Two objects in contact exchange material, and this mutual transfer is the theoretical foundation of the whole discipline.</p>' +
         '<p><b>Identification vs individualisation</b> — the distinction the syllabus is pointing at:</p>' +
         '<ul><li><b>Identification</b> places a substance in a <em>class</em>: "this is blood", "this is heroin", "this is a cotton fibre".</li>' +
         '<li><b>Individualisation</b> traces it to a <em>single unique source</em>: this blood came from this person; this bullet was fired from this weapon.</li></ul>' +
         '<p>Only evidence with <b>individual characteristics</b> can be individualised — fingerprints, DNA, striations, handwriting. <b>Class evidence</b> (blood group, fibre type, glass refractive index, shoe size) can exclude, and can corroborate powerfully in combination, but cannot alone identify one source.</p>' },

    { h: 'Types of scene',
      b: '<ul><li><b>Indoor</b> — most controllable; evidence is comparatively protected from weather and contamination.</li>' +
         '<li><b>Outdoor</b> — <b>most vulnerable</b>; weather, animals and public access degrade evidence, so it takes priority in processing.</li>' +
         '<li><b>Mobile</b> — vehicles, vessels, aircraft.</li></ul>' +
         '<p><b>Primary scene</b> — where the offence actually occurred. <b>Secondary scene</b> — any other location related to it: where the body was moved to, where the weapon was disposed of, the suspect\'s vehicle or residence. Both must be processed; a body-dump site is a secondary scene, and treating it as primary is a classic investigative error.</p>' },

    { h: 'Securing and documenting the scene',
      b: '<p>Sequence: <b>secure and preserve → document → search → collect → transport</b>.</p>' +
         '<p>First responder priorities in order: <b>preserve life</b> (medical aid first, always), arrest any suspect present, protect the scene, establish a cordon, record everyone entering and leaving, and note transient evidence (odours, lighting, temperature, appliance states) before it changes.</p>' +
         '<p><b>Three documentation methods, used together and never as substitutes:</b></p>' +
         '<ol><li><b>Notes</b> — continuous written record with times.</li><li><b>Photography</b> — overall, mid-range, close-up with and without scale.</li><li><b>Sketch</b> — the <em>rough sketch</em> is made at the scene, to scale or not, and is <b>never altered afterwards</b>; the <em>finished/scale sketch</em> is prepared later from it. A sketch is essential because it records <b>exact measurements and spatial relationships</b>, which photographs distort.</li></ol>' +
         '<p>Measurement methods for fixing an item\'s position: <b>rectangular coordinates</b> (perpendicular distances from two fixed walls), <b>triangulation</b> (distances from two fixed reference points — best for outdoor scenes), <b>baseline</b>, and <b>polar coordinates</b>.</p>' +
         '<p><b>Search patterns:</b> strip/line, grid (a double strip, the most thorough), spiral (inward or outward), zone/quadrant (best for indoor scenes with rooms), and wheel/radial (for small circular areas).</p>' },

    { h: 'Collection and reconstruction',
      b: '<p>Collection rules: handle minimally; <b>package each item separately</b>; use <b>paper bags or breathable containers for biological evidence</b> — plastic traps moisture and promotes bacterial growth that destroys DNA; air-dry wet stains before packaging; use a <b>druggist fold</b> for trace evidence; collect <b>control and reference samples</b> alongside; and seal, label and sign every package. Maintain the <b>chain of custody</b> throughout.</p>' +
         '<div class="tip"><b>The most-tested practical rule in this topic:</b> biological evidence goes in <b>paper</b>, never plastic. Plastic retains moisture, mould grows, and the DNA degrades.</div>' +
         '<p><b>Crime scene reconstruction</b> determines the sequence of events from physical evidence — using bloodstain pattern analysis, trajectory analysis, wound patterns and the positions of items. It answers <em>what happened and in what order</em>, complementing (and sometimes contradicting) witness accounts. It follows the scientific method: data collection, hypothesis, testing, then theory.</p>' }
  ],

  questions: [
    { q: 'Locard\'s Exchange Principle states that', o: ['Every criminal returns to the scene', 'Every contact leaves a trace', 'No two fingerprints are alike', 'Physical evidence is always individualising'], a: 1,
      e: '<p><b>"Every contact leaves a trace"</b> — two objects in contact mutually transfer material. This is the theoretical foundation for collecting trace evidence at all.</p><p>Option (c) is the principle of fingerprint individuality; option (d) is false, since most physical evidence is class evidence only.</p>' },

    { q: 'Determining that a stain is human blood of group A is an example of', o: ['Individualisation', 'Identification and class characterisation', 'Reconstruction', 'Interpretation'], a: 1,
      e: '<p>Establishing that it is blood, that it is human, and that it belongs to group A places it in successively narrower <b>classes</b> — but many people share group A, so no unique source is established.</p><p><b>Individualisation</b> would require DNA typing. This identification/individualisation distinction is explicitly named in the syllabus and is the conceptual core of the topic.</p>' },

    { q: 'Biological evidence such as bloodstained clothing should be packaged in', o: ['Sealed plastic bags', 'Paper bags or breathable containers, after air drying', 'Airtight glass jars', 'Metal containers'], a: 1,
      e: '<p><b>Plastic retains moisture</b>, encouraging bacterial and fungal growth that degrades DNA. Paper breathes, so the item continues to dry.</p><p>The item must be <b>air-dried first</b> wherever possible. Airtight containers are correct for a different category — volatiles and fire debris, where escape of the accelerant is the concern.</p>' },

    { q: 'A location where a body is discovered after being moved from where the killing occurred is', o: ['The primary crime scene', 'A secondary crime scene', 'Not a crime scene at all', 'A mobile crime scene'], a: 1,
      e: '<p>The <b>primary</b> scene is where the offence occurred; a disposal site is a <b>secondary</b> scene. Both must be fully processed.</p><p>Recognising that the discovery site is secondary is critical — it tells investigators a primary scene exists elsewhere, and transfer evidence on the body may lead to it.</p>' },

    { q: 'Which search pattern is generally most suitable for a large outdoor crime scene?', o: ['Zone or quadrant search', 'Grid search', 'Wheel or radial search', 'Spiral search'], a: 1,
      e: '<p>A <b>grid search</b> — a strip search repeated at right angles — covers ground <b>twice from two directions</b>, making it the most thorough option for large open areas.</p><p><b>Zone</b> search suits indoor scenes divided into rooms; <b>wheel/radial</b> suits small circular areas. Outdoor scenes are also the most vulnerable to weather, so thoroughness and speed both matter.</p>' },

    { q: 'The rough sketch prepared at a crime scene', o: ['Must always be drawn exactly to scale', 'Should never be altered after leaving the scene', 'Replaces the need for photographs', 'Is prepared only after the evidence is removed'], a: 1,
      e: '<p>The <b>rough sketch is a contemporaneous record and must never be altered</b>. Corrections and scale drawing are done on the <em>finished</em> sketch prepared later from it — altering the original would destroy its evidentiary value.</p><p>It need not be to scale (a), and it complements rather than replaces photography (c), since only a sketch preserves accurate measurements.</p>' },

    { q: 'Triangulation as a crime scene measurement method fixes an object\'s position by', o: ['Perpendicular distances from two adjacent walls', 'Distances measured from two fixed reference points', 'Its distance along a single baseline', 'Compass bearing and distance from the centre'], a: 1,
      e: '<p><b>Triangulation</b> measures from <b>two fixed reference points</b>, so the item sits at the intersection of two arcs. It is preferred <b>outdoors</b>, where there are no convenient perpendicular walls.</p><p>Option (a) is the <b>rectangular coordinate</b> method, used indoors; option (d) is <b>polar coordinates</b>. Each is a real method, matched to a different scene type.</p>' },

    { q: 'The first priority of the first responder at a crime scene is to', o: ['Photograph the scene', 'Preserve life and render medical aid', 'Collect fragile evidence', 'Interview witnesses'], a: 1,
      e: '<p><b>Preservation of life always comes first</b>, ahead of every evidentiary consideration. Medical intervention that disturbs the scene is accepted and simply documented.</p><p>Only then follow arrest of any suspect present, securing the scene, and documentation. Examiners test this because candidates over-focus on evidence and forget the ethical hierarchy.</p>' }
  ]
});

window.MPSC.units.push({
  id: 'p3gf10',
  paper: 'Paper III — General Forensic',
  title: 'X. Forensic Criminology & Laws',
  marks: 10,
  syllabus: 'Important sections of laws pertaining to Forensic Science and Evidence, Technology IT Act, Narcotic Drugs & Psychotropic Substances Act, Arms Act. Difference between a civil case & criminal case. Expert testimony. Importance of chain of custody. Hierarchy of Courts and their powers. Lok Adalat, Lok Ayukta and Juvenile Courts.',

  notes: [
    { h: 'The 2023 criminal law overhaul — know both names',
      b: '<div class="tip">Three new statutes came into force on <b>1 July 2024</b>. The syllabus was approved earlier and uses the old names, so <b>be ready for questions in either form</b>:<br>' +
         '• <b>Bharatiya Nyaya Sanhita, 2023</b> replaces the Indian Penal Code, 1860<br>' +
         '• <b>Bharatiya Nagarik Suraksha Sanhita, 2023</b> replaces the CrPC, 1973<br>' +
         '• <b>Bharatiya Sakshya Adhiniyam, 2023</b> replaces the Indian Evidence Act, 1872</div>' +
         '<table><tr><th>Provision</th><th>Old</th><th>New</th></tr>' +
         '<tr><td>Expert opinion</td><td>Evidence Act <b>s.45</b></td><td>BSA <b>s.39</b></td></tr>' +
         '<tr><td>Electronic records</td><td>Evidence Act <b>s.65B</b></td><td>BSA <b>s.63</b></td></tr>' +
         '<tr><td>Confession leading to discovery</td><td>Evidence Act <b>s.27</b></td><td>BSA <b>s.23</b></td></tr>' +
         '<tr><td>Government scientific experts</td><td>CrPC <b>s.293</b></td><td>BNSS <b>s.329</b></td></tr>' +
         '<tr><td>Medical examination of accused</td><td>CrPC <b>s.53</b></td><td>BNSS <b>s.51</b></td></tr></table>' +
         '<p><b>Section 293 CrPC / 329 BNSS</b> matters directly to your future job: reports of specified <b>Government Scientific Experts</b> — including the Director of a Forensic Science Laboratory and the Chemical Examiner — may be used as evidence <b>without the expert being called in person</b>, though the court may summon them. This is why FSL reports carry weight on their own.</p>' +
         '<p>The BNSS also makes <b>forensic investigation mandatory</b> for offences punishable with seven years or more, and requires videography of the evidence collection process — a significant expansion of FSL workload.</p>' },

    { h: 'Civil vs criminal',
      b: '<table><tr><th></th><th>Civil</th><th>Criminal</th></tr>' +
         '<tr><td>Wrong against</td><td>An individual — private right</td><td>The State/society</td></tr>' +
         '<tr><td>Initiated by</td><td>Plaintiff, by plaint</td><td>The State, by FIR/complaint</td></tr>' +
         '<tr><td><b>Standard of proof</b></td><td><b>Preponderance of probabilities</b></td><td><b>Beyond reasonable doubt</b></td></tr>' +
         '<tr><td>Outcome</td><td>Damages, injunction, decree</td><td>Fine, imprisonment, acquittal</td></tr>' +
         '<tr><td>Parties</td><td>Plaintiff v. Defendant</td><td>State v. Accused</td></tr></table>' +
         '<p>The differing <b>standard of proof</b> is the single most examined row, and explains how the same facts can produce a civil finding of liability but a criminal acquittal.</p>' },

    { h: 'Expert testimony and chain of custody',
      b: '<p>An <b>expert witness</b> is a person specially skilled in a field (s.45 Evidence Act / s.39 BSA). Uniquely, an expert may give <b>opinion</b> evidence, whereas an ordinary witness may testify only to facts personally perceived.</p>' +
         '<p>Expert opinion is <b>advisory and not binding</b> — the court is the final judge of fact and may reject it. It is regarded as a weak form of evidence when uncorroborated, and Indian courts have repeatedly held that conviction should not rest on expert opinion alone without corroboration.</p>' +
         '<p><b>Chain of custody</b> is the chronological documentation of every person who handled an item, with dates, times and purpose, from collection to court. A break invites the inference of tampering or substitution and is <b>the commonest successful challenge to forensic evidence</b>. Each transfer must be signed, and seals must be intact and verified on receipt.</p>' },

    { h: 'Court hierarchy and special forums',
      b: '<p><b>Supreme Court</b> → <b>High Courts</b> → <b>District and Sessions Courts</b> → <b>Judicial Magistrate First Class / Chief Judicial Magistrate</b> → <b>Judicial Magistrate Second Class</b>.</p>' +
         '<p><b>Sentencing powers:</b> a Sessions Judge may pass any sentence authorised by law, but a <b>death sentence requires confirmation by the High Court</b>. A CJM may impose up to <b>7 years</b>; a JMFC up to <b>3 years</b> and fine up to ₹10,000; a JM Second Class up to <b>1 year</b>.</p>' +
         '<ul><li><b>Lok Adalat</b> — statutory forum under the <b>Legal Services Authorities Act, 1987</b> for compromise settlement. Its award is <b>deemed a decree of a civil court, is final, and no appeal lies</b> — the most examined feature. There is <b>no court fee</b>, and fees already paid are refunded. It cannot try non-compoundable criminal offences.</li>' +
         '<li><b>Lok Ayukta</b> — a state-level anti-corruption ombudsman investigating maladministration by public functionaries. Its central counterpart is the <b>Lokpal</b> (Lokpal and Lokayuktas Act, 2013). Recommendatory, not judicial.</li>' +
         '<li><b>Juvenile Justice Board</b> — under the <b>Juvenile Justice (Care and Protection of Children) Act, 2015</b>, dealing with children in conflict with law (under 18). The 2015 Act permits a <b>16–18 year old accused of a heinous offence</b> to be tried as an adult after a preliminary assessment by the Board — the change introduced after the 2012 Delhi case.</li></ul>' }
  ],

  questions: [
    { q: 'The standard of proof in a criminal case is', o: ['Preponderance of probabilities', 'Beyond reasonable doubt', 'Clear and convincing evidence', 'Prima facie satisfaction'], a: 1,
      e: '<p>Criminal cases require proof <b>beyond reasonable doubt</b>; civil cases require only a <b>preponderance of probabilities</b>.</p><p>The difference explains why identical facts can yield civil liability and criminal acquittal. This row of the civil/criminal table is the most reliably examined point in the topic.</p>' },

    { q: 'An award passed by a Lok Adalat is', o: ['Appealable to the District Court', 'Deemed a decree of a civil court and final, with no appeal', 'Merely a recommendation to the parties', 'Binding only in civil matters below ₹1 lakh'], a: 1,
      e: '<p>Under the <b>Legal Services Authorities Act, 1987</b>, a Lok Adalat award is <b>deemed a decree of a civil court and is final</b> — <b>no appeal lies</b> against it, since it rests on the parties\' own compromise.</p><p>The only remedy is a writ petition on limited grounds. There is also no court fee, and any fee already paid is refunded.</p>' },

    { q: 'Under Section 293 CrPC (now Section 329 BNSS), the report of a Government Scientific Expert', o: ['Is inadmissible unless the expert testifies in person', 'May be used as evidence without calling the expert, though the court may summon them', 'Is binding on the court', 'Applies only to Central Government laboratories'], a: 1,
      e: '<p>The provision allows reports of specified <b>Government Scientific Experts</b> — including the Director of an FSL and the Chemical Examiner — to be used as evidence <b>without the expert appearing</b>, while preserving the court\'s power to summon them.</p><p>This directly concerns your future role, and note (c) is wrong: expert opinion is always <b>advisory, never binding</b>.</p>' },

    { q: 'The Bharatiya Sakshya Adhiniyam, 2023 provision corresponding to Section 65B of the Indian Evidence Act is', o: ['Section 39', 'Section 63', 'Section 23', 'Section 45'], a: 1,
      e: '<p>Electronic records move from <b>Evidence Act s.65B</b> to <b>BSA s.63</b>, carrying forward the certificate requirement.</p><p>Also worth holding: expert opinion s.45 → <b>s.39</b>; confession leading to discovery s.27 → <b>s.23</b>. Since the syllabus predates the change, either numbering may appear.</p>' },

    { q: 'Under the Juvenile Justice Act, 2015, a child aged 16 to 18 accused of a heinous offence may', o: ['Never be tried as an adult', 'Be tried as an adult after a preliminary assessment by the Juvenile Justice Board', 'Be tried as an adult automatically', 'Be tried only by a Sessions Court'], a: 1,
      e: '<p>The 2015 Act permits a <b>16–18 year old accused of a heinous offence</b> (one punishable with seven years or more) to be tried as an adult, but <b>only after a preliminary assessment</b> by the Board of the child\'s mental and physical capacity and ability to understand the consequences.</p><p>It is therefore neither prohibited (a) nor automatic (c) — the assessment is the essential middle step.</p>' },

    { q: 'A break in the chain of custody most directly raises the inference that', o: ['The expert was unqualified', 'The evidence may have been tampered with or substituted', 'The offence was not committed', 'The court lacks jurisdiction'], a: 1,
      e: '<p>An unaccounted gap means no one can testify to the item\'s integrity during that period, opening the inference of <b>tampering, substitution or contamination</b>.</p><p>It is the commonest successful challenge to forensic evidence — which is why every transfer must be signed, timed and sealed, and why seals are verified on receipt.</p>' },

    { q: 'A Judicial Magistrate of the First Class may pass a sentence of imprisonment up to', o: ['1 year', '3 years', '7 years', 'Any term authorised by law'], a: 1,
      e: '<p>A <b>JMFC</b> may impose up to <b>3 years</b> and a fine up to ₹10,000. A <b>JM Second Class</b> may impose up to <b>1 year</b>; a <b>CJM</b> up to <b>7 years</b>.</p><p>A <b>Sessions Judge</b> may pass any sentence authorised by law, but a <b>death sentence requires High Court confirmation</b> — option (d) describes the Sessions Judge.</p>' },

    { q: 'Expert opinion evidence in an Indian court is', o: ['Binding on the court', 'Advisory, and the court is the final judge of fact', 'Admissible only in civil cases', 'Conclusive if uncontradicted'], a: 1,
      e: '<p>Expert opinion is <b>advisory</b>. The court is the final arbiter and may accept or reject it, even where uncontradicted — so (d) is wrong too.</p><p>Indian courts have consistently held that conviction should not rest on expert opinion <b>alone without corroboration</b>. The expert\'s distinctive privilege is simply that they may give <em>opinion</em> where an ordinary witness may speak only to perceived facts.</p>' }
  ]
});
