/* Paper III, Part B — General Forensic. Topics VII-X. */

window.MPSC.units.push({
  id: 'p3gf7',
  paper: 'Paper III — General Forensic',
  title: 'VII. Forensic Photography',
  marks: 10,
  syllabus: 'Fundamentals of photography. Role of photography in forensic science & photographs as evidence. Use of natural light and portrait photography. Micro and Macro photography. Crime scene and laboratory photography. Advanced Digital Photography Techniques, Infra-red and UV photography and its application in Forensics. Specialized techniques used for Documents, Fingerprints.',

  notes: [
    { h: 'The exposure triangle (Aperture, Shutter Speed & ISO)',
      b: '<div class="analogy"><b>💡 Analogy — Filling a Bucket with Water:</b> Think of capturing a properly exposed photograph like filling a 1-litre bucket to the brim. <b>Aperture ($f$-stop)</b> is how <em>wide</em> you open the tap valve; <b>Shutter Speed</b> is how <em>many seconds</em> you leave the tap open; and <b>ISO</b> is the <em>size of the bucket</em> (higher ISO uses a tiny cup that fills instantly, but splashes water everywhere as <b>digital grain/noise</b>!). If you narrow the tap to a pinhole (high $f$-number like $f/16$) to keep the whole room in sharp focus, you must leave the tap open longer (slower shutter speed on a tripod) to still collect 1 litre of light!</div>' +
         '<ul><li><b>Aperture ($f$-number $= \\text{focal length } f / \\text{entrance pupil diameter } D$):</b> Controls both light admitted and <b>Depth of Field (DoF)</b>. Because it is a fraction, a <em>smaller</em> $f$-number ($f/1.8, f/2.8$) means a <em>wider</em> physical opening, admitting more light but giving a <b>very shallow depth of field</b> (blurred background). A <em>larger</em> $f$-number ($f/16, f/22$) means a narrower pinhole opening and <b>maximum depth of field</b> (foreground to background all sharp — essential for overall crime scene photos!). Standard full-stop scale (each step halves the light area by $\\sqrt{2} \\approx 1.4$): <code>f/1.4 → f/2 → f/2.8 → f/4 → f/5.6 → f/8 → f/11 → f/16 → f/22</code>.</li>' +
         '<li><b>Shutter speed:</b> Duration the sensor is exposed ($1/1000\\text{ s}$ freezes fast motion; slower than $1/60\\text{ s}$ requires a tripod to prevent camera shake).</li>' +
         '<li><b>ISO sensitivity:</b> Electronic signal amplification ($100, 200, 400, 800, 3200\\dots$). Forensic photographers keep ISO as low as possible (<b>ISO 100–200</b>) to prevent sensor noise from obscuring fine ridge/striation detail.</li></ul>' },

    { h: 'Crime scene photography protocol',
      b: '<div class="diagram"><div class="diag-title">The Mandatory 3-Stage Crime Scene Progression (General → Specific)</div>' +
         '<div class="flow-row">' +
         '<div class="flow-step"><b>1. Overall (Long-Range)</b><small>4 corners of room + exterior approach/exits</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>2. Mid-Range</b><small>Links evidence item to a fixed landmark</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>3. Close-Up (×2 shots!)</b><small>Shot A: Plain (unadulterated)<br>Shot B: With ABFO #2 L-scale in same plane</small></div>' +
         '</div></div>' +
         '<p><b>Golden Rules of Evidence Photography:</b> Photograph <b>before anything is touched or moved</b>; hold the camera optical axis <b>strictly perpendicular ($90^\\circ$)</b> to the evidence plane (using an <b>ABFO No. 2 right-angled L-scale</b> — if the circles on the ABFO scale appear elliptical, the camera was tilted and perspective correction is required!); always shoot in uncompressed <b>RAW + TIFF</b> where possible; maintain a continuous frame-by-frame <b>Photo Log</b> (never delete a "bad" shot on the scene SD card — deleting creates a frame-number gap that defence counsel will challenge!).</p>' },

    { h: 'Macro vs Micro, Oblique Lighting, UV, IR & ALS Photography',
      b: '<div class="vs-grid">' +
         '<div class="vs-card"><h4>Macrophotography (1:1 to 10:1)</h4><p>Close-up photography at life-size ($1\\times$) up to $10\\times$ magnification using a dedicated <b>macro lens or extension tubes WITHOUT a microscope</b>. Used for latent fingerprints, cartridge headstamps, bite marks, and tool marks.</p></div>' +
         '<div class="vs-card"><h4>Photomicrography (&gt;10× via Microscope)</h4><p>Camera mounted <b>directly onto a compound or comparison microscope</b> ($10\\times$ to $1000\\times+$). Used for hair medulla/cuticle scales, textile fibres, gunshot residue, diatom tests, and bullet land/groove micro-striations.</p></div>' +
         '</div>' +
         '<table>' +
         '<tr><th>Lighting / Spectral Technique</th><th>Wavelength / Angle</th><th>Primary Forensic Applications</th></tr>' +
         '<tr><td><b>Oblique (Side / Grazing) Lighting</b></td><td>Flash/torch held at a very low angle ($5^\\circ\\text{–}15^\\circ$) parallel to surface</td><td>Casts strong shadows across 3D relief: <b>footwear/tyre impressions in dust or soil, indented writing on paper pads, and tool marks</b>.</td></tr>' +
         '<tr><td><b>Ultraviolet (UV) Photography</b></td><td>$100\\text{–}400\\text{ nm}$ (UVA $315\\text{–}400\\text{ nm}$)</td><td>Locates <b>biological fluids (semen, saliva, urine fluoresce brightly)</b>, detects chemical erasures/optical brighteners on forged documents, and reveals healed <b>sub-dermal bite marks/bruising</b> via reflective UV.</td></tr>' +
         '<tr><td><b>Infrared (IR) Photography</b></td><td>$700\\text{–}1100\\text{ nm}$ (Near-IR)</td><td>Penetrates carbon/soot and upper ink layers: <b>reads obliterated/crossed-out writing</b> (when two visually identical black inks have different IR reflectance/luminescence), reads <b>charred documents</b>, visualises <b>gunshot residue (GSR) tatooing on dark clothing</b>, and reveals tattoos on decomposed/burnt skin.</td></tr>' +
         '<tr><td><b>Alternate Light Source (ALS)</b></td><td>Tunable narrowband LED/laser (e.g. $450\\text{ nm}$ blue + orange barrier filter goggles)</td><td>Excites fluorescence in DFO/indanedione/Rhodamine-6G treated fingerprints, fibres, bone fragments, and body fluids.</td></tr>' +
         '</table>' },

    { h: 'Photographs as evidence in Indian courts',
      b: '<p>A crime-scene photograph is admissible when authenticated as a <b>fair and accurate representation</b> of the scene. Under Indian law, digital photographs captured on a DSLR or smartphone are <b>electronic records</b> governed by <b>Section 63 of the Bharatiya Sakshya Adhiniyam (BSA), 2023</b> (formerly <b>Section 65B of the Indian Evidence Act, 1872</b>), requiring the mandatory authenticity certificate and cryptographic hash preservation of the master storage card.</p>' }
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
      e: '<p><b>Both.</b> The version without a scale shows the item undisturbed; the version with an in-plane scale allows dimensions to be established and, for impressions, permits 1:1 comparison prints.</p><p>The scale must lie in the <b>same plane</b> as the subject, with the camera perpendicular — otherwise perspective distortion makes the measurement unreliable.</p>' },

    { q: 'Why does the standard forensic ABFO No. 2 right-angled ruler scale include three small printed reference circles?',
      o: ['To detect and mathematically correct perspective distortion if the camera was not held strictly perpendicular (90°) to the evidence plane (since a circle tilted off-axis appears as an ellipse)',
          'To measure the ISO noise level of the camera sensor',
          'To calibrate the white balance of ultraviolet lamps',
          'To mark the magnetic north direction of the crime scene'], a: 0,
      e: '<p>The <b>ABFO No. 2 scale</b> (designed by the American Board of Forensic Odontology for bite marks, wounds, and impressions) has two perpendicular metric arms and <b>three reference circles</b>. If the camera lens axis is perfectly $90^\\circ$ to the scale plane, the circles stay circular; if tilted, they distort into ellipses, alerting the examiner and allowing geometric rectification.</p>' },

    { q: 'When photographing a latent fingerprint developed on a clear glass window or a shiny mirror, which optical filter is mounted on the camera lens to suppress surface glare and reflections?',
      o: ['A Circular Polarising (CPL) filter',
          'A neutral density (ND) filter',
          'A warming 81A filter',
          'A star-cross diffraction filter'], a: 0,
      e: '<p>Light reflected at Brewster\'s angle from non-metallic dielectric surfaces (glass, water, polished wood, plastic) becomes strongly linearly polarised. Rotating a <b>polarising filter</b> on the camera lens blocks the reflected glare so the underlying fingerprint ridges or interior of a vehicle can be photographed clearly.</p>' },

    { q: 'In forensic photography on a dark bloodstained black jacket, which photographic technique makes dark gunshot residue (GSR) soot and powder stippling stand out clearly against the dark fabric?',
      o: ['Infrared (IR) reflectance photography (where dyed dark fabric often reflects IR and appears light, while carbon-rich GSR absorbs IR and appears jet-black)',
          'Decreasing the shutter speed to 30 seconds in daylight',
          'Using a red colour filter under normal room light',
          'Shooting at ISO 64,000'], a: 0,
      e: '<p>On dark or blood-soaked clothing, black gunshot residue (soot and unburnt powder tattooing) is invisible to the naked eye. Under <b>Near-Infrared ($750\\text{–}900\\text{ nm}$) photography</b>, most organic textile dyes reflect IR strongly (turning the cloth bright white in the IR photo), while carbon/graphite GSR particles absorb IR strongly (staying jet-black), providing dramatic contrast for range-of-fire estimation!</p>' },

    { q: 'A forensic photographer shifts the lens aperture by ONE full stop from f/8 to f/11 while keeping ISO constant. How does this change the amount of light reaching the sensor, and what shutter-speed adjustment is required to maintain the exact same exposure?',
      o: ['f/11 admits HALF as much light as f/8, so the shutter speed must be DOUBLED in duration (e.g., from 1/125 s to 1/60 s)',
          'f/11 admits TWICE as much light as f/8, so the shutter speed must be halved',
          'Light admitted is unchanged because only depth of field changes',
          'f/11 admits one-quarter the light, requiring 4× shutter duration'], a: 0,
      e: '<p>In the standard full-stop $f$-number sequence (`f/2.8 → f/4 → f/5.6 → f/8 → f/11 → f/16`), each step up multiplies the $f$-number by $\\sqrt{2} \\approx 1.414$, which <b>halves the area of the circular aperture opening ($1/(\\sqrt{2})^2 = 1/2$)</b>. By the Law of Reciprocity, halving the aperture light requires doubling the exposure time ($1/125\\text{ s} \\to 1/60\\text{ s}$).</p>' },

    { q: 'When using an Alternate Light Source (ALS) set to emit blue excitation light at 450 nm to examine a crime scene for latent biological fluids or Rhodamine-6G-treated fingerprints, what colour barrier filter (goggles and camera lens filter) must be used, and why?',
      o: ['An orange or yellow long-pass barrier filter (approx. 520–550 nm) — to block the intense reflected 450 nm blue excitation light while transmitting the longer-wavelength Stokes-shifted fluorescence emitted by the evidence',
          'A blue 450 nm band-pass filter — to let only the blue flashlight beam into the camera',
          'An opaque lead cap',
          'No filter is ever used with an ALS'], a: 0,
      e: '<p>By <b>Stokes\' Law of Fluorescence</b>, a fluorescing substance absorbs shorter-wavelength, higher-energy excitation light (e.g., $450\\text{ nm}$ blue) and re-emits longer-wavelength, lower-energy light (e.g., $530\\text{–}580\\text{ nm}$ yellow-orange). Because the reflected blue excitation beam is thousands of times brighter than the weak fluorescence, an <b>orange/yellow barrier filter</b> is placed over the camera lens and the examiner\'s eyes to block the $450\\text{ nm}$ blue light completely so only the glowing evidence is captured!</p>' },

    { q: 'Why do forensic photography protocols strictly prefer saving master evidentiary images in RAW (or uncompressed TIFF) format rather than JPEG alone?',
      o: ['Because RAW records the unmodified, uncompressed 12/14-bit sensor data directly from the Bayer array with zero lossy DCT block compression, serving as the "digital negative"',
          'Because RAW files are 10× smaller than JPEG files',
          'Because JPEG files cannot be displayed on computer monitors',
          'Because RAW files automatically delete camera shake'], a: 0,
      e: '<p>A camera <b>RAW</b> file (`.CR2/.CR3` Canon, `.NEF` Nikon, `.ARW` Sony, `.DNG` Adobe) preserves the linear $12\\text{–}14$ bit per pixel sensor readout before lossy $8\\times 8$ DCT JPEG compression discards high-frequency detail — making RAW the courtroom equivalent of an original film negative.</p>' },

    { q: 'In portrait and mugshot / identification photography, why is a short-telephoto focal length (typically 85 mm to 105 mm full-frame equivalent) preferred over a wide-angle lens (such as 24 mm) held close to the face?',
      o: ['Because shooting close with a wide-angle lens causes severe perspective distortion ("big-nose / foreshortening effect"), whereas an 85–105 mm lens allows a comfortable working distance that renders facial proportions naturally and accurately',
          'Because wide-angle lenses cannot focus on human skin',
          'Because 85 mm lenses only shoot in infrared',
          'Because 24 mm lenses have zero depth of field'], a: 0,
      e: '<p>Perspective distortion depends on <b>camera-to-subject distance</b>. Using a wide-angle lens ($24\\text{ mm}$) close to a subject\'s face exaggerates the size of the nose and forehead relative to the ears, distorting anthropometric facial features. A <b>portrait focal length ($85\\text{–}105\\text{ mm}$)</b> steps the photographer back to $\\sim 2\\text{ metres}$, preserving true facial geometry.</p>' }
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

    { h: 'Malware taxonomy & HTTP Cookies',
      b: '<div class="analogy"><b>💡 Analogy — Virus vs Worm vs Trojan Horse:</b><br>' +
         '• A <b>Virus</b> is like a biological parasite clinging to a parcel: it <b>requires a host file</b> (`.exe`, `.docx` macro) and <b>requires human action</b> (opening/running the file) to activate and infect other files.<br>' +
         '• A <b>Worm</b> is like a self-driving tunneling robot: it is a <b>standalone program that self-replicates and spreads automatically across network ports</b> (e.g., WannaCry over SMB port 445) with <b>zero host file and zero human click required</b>!<br>' +
         '• A <b>Trojan Horse</b> is the wooden horse of Troy: it disguises itself as a useful free game or PDF invoice to trick you into running it, then opens a hidden backdoor — it <b>does NOT self-replicate</b>!</div>' +
         '<table><tr><th>Malware Type</th><th>Defining Property &amp; Examples</th></tr>' +
         '<tr><td><b>Virus</b></td><td>Attaches to a host file/boot sector; requires <b>user action</b> to execute and replicate (e.g. Melissa, CIH).</td></tr>' +
         '<tr><td><b>Worm</b></td><td><b>Standalone, self-replicating &amp; self-propagating</b> over networks; needs <b>no host file and no user action</b> (e.g. Morris Worm, ILOVEYOU, Conficker, Stuxnet).</td></tr>' +
         '<tr><td><b>Trojan Horse</b></td><td>Disguised as legitimate software; <b>does NOT self-replicate</b>; drops RATs/backdoors (e.g. Zeus banking Trojan).</td></tr>' +
         '<tr><td><b>Ransomware</b></td><td>Encrypts victim\'s files (often via hybrid RSA + AES) or locks the screen and demands cryptocurrency ransom (e.g. WannaCry, LockBit).</td></tr>' +
         '<tr><td><b>Spyware / Keylogger</b></td><td>Covertly monitors user activity and captures keystrokes, screenshots, and credentials.</td></tr>' +
         '<tr><td><b>Rootkit</b></td><td>Hides its own processes, files, and network connections (at user mode, kernel ring 0, or firmware/bootkit level) to maintain stealthy persistence.</td></tr>' +
         '<tr><td><b>Botnet ("Zombies")</b></td><td>A fleet of compromised machines controlled remotely by a <b>Botmaster via a Command-and-Control (C2) server</b> to launch DDoS attacks or spam campaigns.</td></tr>' +
         '<tr><td><b>Logic Bomb / Time Bomb</b></td><td>Dormant malicious code planted inside legitimate software that triggers only when a specific date or condition occurs (e.g. when an employee\'s ID is removed from payroll).</td></tr></table>' +
         '<p><b>HTTP Cookies:</b> Small plain-text `key=value` files stored by a web server inside the user\'s web browser (`Cookies` SQLite DB) to maintain stateful sessions (login tokens, shopping carts, tracking). <b>Cookies are NOT malware and cannot execute code</b>, though stealing a session cookie via XSS ("session hijacking") allows an attacker to impersonate a logged-in user, and forensically cookies prove which websites a suspect visited and when.</p>' },

    { h: 'Cyber crime categories & Social Engineering',
      b: '<ul><li><b>Against Individuals:</b> Cyberstalking, cyberbullying, morphing/defamation, identity theft, sextortion, CSAM/child pornography, phishing.</li>' +
         '<li><b>Against Property:</b> Credit-card/UPI fraud, software piracy, copyright/trademark infringement, ransomware extortion, unauthorized fund transfer.</li>' +
         '<li><b>Against Organisations / Society / Government:</b> Hacking/unauthorised access, <b>DoS / DDoS (Distributed Denial of Service)</b>, website defacement, data breaches, <b>Cyber Terrorism (Section 66F IT Act)</b>.</li></ul>' +
         '<p><b>Social Engineering Phishing Variants:</b> <b>Phishing</b> (mass deceptive emails spoofing banks/services), <b>Spear Phishing</b> (targeted at a specific named individual/organisation), <b>Whaling</b> (spear-phishing aimed at C-level executives/VIPs), <b>Vishing</b> (voice call phishing for OTPs), <b>Smishing</b> (SMS phishing links), and <b>Pharming</b> (corrupting a DNS server or the local `hosts` file so typing a genuine bank URL redirects silently to a fake server!).</p>' },

    { h: 'Encryption, Decryption & Digital Signatures',
      b: '<div class="vs-grid">' +
         '<div class="vs-card"><h4>Symmetric Key Cryptography (Secret Key)</h4><p>• Uses the <b>EXACT SAME single shared key</b> for both encryption and decryption.<br>• Very <b>fast</b> — used for bulk disk/file/network encryption.<br>• Main challenge: secure key distribution ($N(N-1)/2$ keys needed for $N$ users).<br>• Examples: <b>AES (128/192/256-bit), DES (56-bit), 3DES, Blowfish, RC4, ChaCha20</b>.</p></div>' +
         '<div class="vs-card"><h4>Asymmetric Key Cryptography (Public Key)</h4><p>• Uses a mathematically linked <b>Key Pair: Public Key</b> (shared with the world) + <b>Private Key</b> (kept strictly secret by owner).<br>• Computationally <b>slower</b>; solves key exchange and enables Digital Signatures.<br>• Examples: <b>RSA, Diffie–Hellman (key exchange), ECC (Elliptic Curve), DSA, ElGamal</b>.</p></div>' +
         '</div>' +
         '<div class="clarity"><b>⚡ Concept Clarity — Which Key Do You Use for Confidentiality vs Digital Signatures?</b><br>' +
         'When Alice sends a message to Bob:<br>' +
         '1. <b>For Confidentiality (Secrecy):</b> Alice encrypts the message with <b>Bob\'s PUBLIC Key</b> $\\to$ only Bob can decrypt it using <b>Bob\'s PRIVATE Key</b>.<br>' +
         '2. <b>For Authentication, Integrity &amp; Non-Repudiation (Digital Signature):</b> Alice hashes the message and encrypts (signs) the hash with <b>Alice\'s OWN PRIVATE Key</b> $\\to$ Bob (or a court) verifies the signature using <b>Alice\'s PUBLIC Key</b>!</div>' },

    { h: 'Indian Information Technology Act, 2000 (Amended 2008) & IPR',
      b: '<table>' +
         '<tr><th>IT Act Section</th><th>Offence / Legal Provision</th></tr>' +
         '<tr><td><b>Section 43</b></td><td>Civil liability/compensation for unauthorised access, downloading data, introducing virus, or denial of service.</td></tr>' +
         '<tr><td><b>Section 65</b></td><td>Tampering with <b>computer source documents (source code)</b> — up to 3 years / ₹2 lakh fine.</td></tr>' +
         '<tr><td><b>Section 66</b></td><td>Computer-related offences (dishonestly/fraudulently doing any act in s.43 — <b>Hacking</b>).</td></tr>' +
         '<tr><td><b>Section 66A</b></td><td><em>Offensive messages — <b>STRUCK DOWN as unconstitutional</b> by Supreme Court in <b>Shreya Singhal v. UOI (2015)</b> for violating Article 19(1)(a) free speech!</em></td></tr>' +
         '<tr><td><b>Section 66B</b></td><td>Dishonestly receiving stolen computer resource or communication device.</td></tr>' +
         '<tr><td><b>Section 66C</b></td><td><b>Identity Theft</b> (fraudulent use of another\'s password, digital signature, or unique ID).</td></tr>' +
         '<tr><td><b>Section 66D</b></td><td><b>Cheating by Personation</b> using a computer resource (phishing, fake profiles, online scams).</td></tr>' +
         '<tr><td><b>Section 66E</b></td><td><b>Violation of Privacy</b> (capturing/transmitting images of a private area of any person without consent — voyeurism).</td></tr>' +
         '<tr><td><b>Section 66F</b></td><td><b>Cyber Terrorism</b> (threatening unity/integrity/sovereignty of India or critical infrastructure — punishable up to <b>Life Imprisonment</b>!).</td></tr>' +
         '<tr><td><b>Section 67 / 67A / 67B</b></td><td>Publishing/transmitting: <b>67</b> = Obscene material; <b>67A</b> = Sexually explicit act; <b>67B</b> = <b>Child Sexual Exploitative and Abuse Material (CSAM / Child Pornography)</b>.</td></tr>' +
         '<tr><td><b>Section 69 &amp; 69A</b></td><td><b>s.69:</b> Power to intercept, monitor, or decrypt information; <b>s.69A:</b> Power to block public access to websites (upheld in <em>Shreya Singhal</em>).</td></tr>' +
         '<tr><td><b>Section 70B</b></td><td>Designates <b>CERT-In (Indian Computer Emergency Response Team)</b> as the national agency for cyber incident response.</td></tr>' +
         '<tr><td><b>Section 79</b></td><td><b>Intermediary Safe Harbour</b> (exempts ISPs/social media platforms from liability for third-party content if they exercise due diligence and obey takedown orders).</td></tr>' +
         '</table>' +
         '<p><b>Intellectual Property Rights (IPR) &amp; Software Piracy:</b> In India, computer software and source code are protected as a <b>"Literary Work" under the Copyright Act, 1957</b>. Forms of <b>software piracy</b> include <em>Softlifting</em> (installing a single-user licence on multiple office PCs), <em>Hard-disk loading</em> (hardware dealers pre-installing pirated OS/software on new PCs), <em>Counterfeiting</em>, and <em>Online/Warez piracy</em>.</p>' },

    { h: 'Computer basics, hardware & OS/software',
      b: '<p>At this general level, expect only <b>identification-level</b> questions on hardware and software categories — not internal architecture.</p>' +
         '<ul><li><b>Hardware</b> — the physical parts: <b>input</b> devices (keyboard, mouse, scanner, MICR, OCR, OMR), <b>output</b> devices (monitor, printer, plotter), the <b>CPU</b> (processes instructions; contains the <b>ALU</b> [Arithmetic Logic Unit], <b>Control Unit [CU]</b>, and <b>Registers</b>), <b>primary memory</b> — <b>RAM</b> (volatile, temporary working memory, lost on power-off) and <b>ROM</b> (non-volatile, holds firmware/BIOS/UEFI) — and <b>secondary storage</b> (HDD, SSD, optical/USB media — persists without power).</li>' +
         '<li><b>Operating system</b> — system software that manages hardware and provides the platform on which other programs run (e.g. Windows, Linux, macOS, Android, iOS).</li>' +
         '<li><b>Application software</b> — programs that perform user tasks (word processors, spreadsheets, browsers) and run <em>on top of</em> the OS.</li></ul>' },

    { h: 'Computer forensics — definition and crime types',
      b: '<p><b>Computer forensics (digital forensics)</b> is the application of scientific methods to identify, preserve, analyse and present <b>digital evidence</b> in a manner that is legally admissible. Its core aim is to reconstruct events while preserving the <b>integrity</b> of the original data — typically via a <b>write-blocked, hashed image</b> of the source, never the original media itself.</p>' +
         '<p><b>Types of computer crime</b> (by the role of the computer): <b>Target</b> (hacking, DDoS, malware), <b>Instrument/Tool</b> (online fraud, phishing, forgery), or <b>Incidental/Repository</b> (stores evidence of a traditional crime).</p>' }
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
      e: '<p><b>Computer forensics</b> is the application of scientific methods to <b>identify, preserve, analyse and present digital evidence</b> so that it holds up in court — the emphasis throughout is on preserving the integrity of the original data.</p><p>Hardware repair and software design are unrelated technical activities, not forensic ones — a common distractor pairing at this general level.</p>' },

    { q: 'Under the Information Technology Act, 2000 (as amended in 2008), which section specifically criminalises publishing or transmitting material depicting children in sexually explicit acts (Child Pornography / CSAM) in electronic form?',
      o: ['Section 67B', 'Section 66F', 'Section 65', 'Section 79'], a: 0,
      e: '<p>Memorise the Section 67 triad in the IT Act, 2000:<br>• <b>Section 67:</b> Publishing/transmitting obscene material in electronic form.<br>• <b>Section 67A:</b> Publishing/transmitting material containing sexually explicit acts.<br>• <b>Section 67B:</b> Publishing, browsing, collecting, or transmitting <b>Child Pornography (CSAM)</b> in electronic form (first conviction up to 5 years and ₹10 lakh fine). Meanwhile, <b>Section 66F</b> covers Cyber Terrorism.</p>' },

    { q: 'An attacker compromises a DNS server (or modifies a victim\'s local `hosts` file) so that when the victim types the genuine URL `www.sbi.co.in` into their browser, they are silently redirected to a fraudulent look-alike IP address. This attack is called:',
      o: ['Pharming', 'Vishing', 'Smishing', 'Shoulder surfing'], a: 0,
      e: '<p><b>Pharming</b> redirects users from a legitimate website domain name to a fraudulent IP address via DNS cache poisoning or `hosts` file modification — requiring no phishing link click at all! (<b>Vishing</b> is voice-call phishing; <b>Smishing</b> is SMS phishing.)</p>' },

    { q: 'To create a Digital Signature that guarantees authentication, message integrity, and non-repudiation, the sender hashes the document and encrypts the hash using:',
      o: ['The sender\'s own PRIVATE key (which anyone can verify using the sender\'s PUBLIC key)',
          'The recipient\'s PUBLIC key',
          'The recipient\'s PRIVATE key',
          'An unsalted MD5 checksum with no key'], a: 0,
      e: '<p>Because only the sender possesses the <b>sender\'s Private Key</b>, encrypting the document\'s hash with the sender\'s private key proves that nobody else could have signed it (<b>Non-Repudiation &amp; Authentication</b>), and recalculating the hash upon verification with the sender\'s public key proves not a single bit was altered in transit (<b>Integrity</b>).</p>' },

    { q: 'In India, computer software programs and source code are primarily protected as a "Literary Work" under which Intellectual Property legislation?',
      o: ['The Copyright Act, 1957',
          'The Geographical Indications of Goods Act, 1999',
          'The Designs Act, 2000',
          'The Arms Act, 1959'], a: 0,
      e: '<p>Under Section 2(o) of the <b>Indian Copyright Act, 1957</b>, "literary work" explicitly includes computer programs, tables, and compilations including computer databases. Unauthorised copying or distribution constitutes software piracy and copyright infringement (and tampering with computer source code required to be kept by law is also punishable under <b>Section 65 of the IT Act, 2000</b>).</p>' },

    { q: 'A disgruntled database administrator plants a hidden script inside the company\'s server that checks the HR table every midnight and automatically wipes the database if his employee ID is marked "Terminated". This type of malicious code is a:',
      o: ['Logic bomb', 'Network worm', 'Browser cookie', 'Firewall'], a: 0,
      e: '<p>A <b>logic bomb</b> (or <b>time bomb</b> when triggered by a specific date/time) is malicious code intentionally inserted into an authorised system that lies dormant until triggered by a specific logical condition (such as an employee\'s dismissal).</p>' },

    { q: 'Which section of the Information Technology Act, 2000 designates CERT-In (Indian Computer Emergency Response Team) as the national nodal agency for responding to cybersecurity incidents?',
      o: ['Section 70B', 'Section 66A', 'Section 43A', 'Section 65B'], a: 0,
      e: '<p><b>Section 70B of the IT Act, 2000</b> establishes <b>CERT-In</b> to serve as the national agency for collection, analysis, and dissemination of information on cyber incidents, forecasts, alerts, and emergency response. (Section 70 covers Protected Systems / Critical Information Infrastructure under NCIIPC.)</p>' },

    { q: 'A thousands-strong network of compromised home computers and IoT cameras ("zombies") silently infected with malware and controlled remotely by an attacker\'s Command-and-Control (C2) server to flood a government website with traffic is called a:',
      o: ['Botnet (launching a Distributed Denial of Service / DDoS attack)',
          'White-hat firewall',
          'Browser cookie cache',
          'Hardware write-blocker'], a: 0,
      e: '<p>A <b>botnet</b> is a network of malware-compromised hosts ("bots" or "zombies") marshalled by a central <b>botmaster via a C2 server</b>. When all bots simultaneously flood a target server with requests so legitimate users cannot connect, the attack is a <b>Distributed Denial of Service (DDoS)</b>.</p>' },

    { q: 'What is the defining characteristic of a "Rootkit" compared with ordinary malware?',
      o: ['It is specifically designed to subvert the operating system (at user-mode API, kernel Ring 0, or firmware level) to hide its own presence, processes, files, and network connections from administrators and security tools',
          'It only infects Microsoft Word `.docx` macros',
          'It is a legal hardware accessory used to cool the CPU',
          'It is an unencrypted text cookie stored by a shopping website'], a: 0,
      e: '<p>A <b>rootkit</b> ("root" privilege + "kit" of tools) hooks OS system calls or manipulates kernel data structures (such as DKOM unlinking in RAM) so that malicious processes, files, and open backdoor ports remain completely invisible to standard utilities like `ps`, `ls`, `netstat`, and Task Manager.</p>' },

    { q: 'Under the Information Technology Act, 2000, which section provides "Safe Harbour" immunity to Intermediaries (such as ISPs, telecom carriers, and social media platforms) from liability for third-party content hosted or transmitted through them, provided they observe due diligence and act swiftly on lawful takedown orders?',
      o: ['Section 79', 'Section 65', 'Section 66E', 'Section 43'], a: 0,
      e: '<p><b>Section 79 of the IT Act, 2000</b> grants conditional immunity ("safe harbour") to <b>intermediaries</b> for third-party data, subject to the IT (Intermediary Guidelines and Digital Media Ethics Code) Rules and the Supreme Court\'s reading in <em>Shreya Singhal</em> (requiring intermediaries to act upon receiving actual knowledge via a court order or government notification).</p>' },

    { q: 'Which type of software piracy occurs when an unscrupulous computer hardware dealer pre-installs unlicensed copies of commercial operating systems and office suites onto new PCs before selling them to customers?',
      o: ['Hard-disk loading',
          'Softlifting',
          'Phishing',
          'Steganography'], a: 0,
      e: '<p>Learn the four classic forms of software piracy:<br>• <b>Hard-disk loading:</b> PC dealers pre-loading illegal copies of software onto hard drives of new computers to make the hardware sale more attractive.<br>• <b>Softlifting:</b> purchasing a single licensed copy and installing it on multiple machines in an office/home beyond the EULA limit.<br>• <b>Counterfeiting:</b> manufacturing fake CDs/DVDs/packaging mimicking genuine holograms.<br>• <b>Online / Warez piracy:</b> downloading cracked software via torrents/warez sites.</p>' },

    { q: 'Inside the Central Processing Unit (CPU), which internal sub-component is responsible for fetching instructions, decoding opcodes, and generating timing and control signals to direct all other units, versus the sub-component that executes arithmetic (+, −) and bitwise logic (AND, OR, XOR)?',
      o: ['The Control Unit (CU) fetches/decodes/directs, while the Arithmetic Logic Unit (ALU) executes mathematical and logical operations',
          'The ALU fetches instructions, while the Hard Disk executes arithmetic',
          'The ROM executes arithmetic, while the Monitor decodes instructions',
          'The Scanner decodes instructions, while the Printer executes logic'], a: 0,
      e: '<p>In the classic Von Neumann CPU architecture, the <b>Control Unit (CU)</b> directs instruction fetch-decode-execute sequencing and control signals, the <b>Arithmetic Logic Unit (ALU)</b> performs all arithmetic and Boolean logic operations, and <b>Registers</b> provide ultra-fast working storage inside the CPU core.</p>' },

    { q: 'Which of the following is a One-Way Cryptographic Hash Function (which has NO key and CANNOT be decrypted back to the original plaintext) rather than a reversible encryption algorithm?',
      o: ['SHA-256 (Secure Hash Algorithm 256-bit)',
          'AES-256 (Advanced Encryption Standard)',
          'RSA-2048',
          'Triple-DES (3DES)'], a: 0,
      e: '<p><b>SHA-256</b> (like MD5 and SHA-1) is a <b>one-way cryptographic hash function</b> — it compresses arbitrary data into a fixed 256-bit fingerprint for integrity verification and <b>cannot be "decrypted"</b>! By contrast, AES and 3DES are reversible symmetric encryption algorithms, and RSA is a reversible asymmetric encryption algorithm.</p>' }
  ]
});

window.MPSC.units.push({
  id: 'p3gf9',
  paper: 'Paper III — General Forensic',
  title: 'IX. Crime Scene Investigation',
  marks: 10,
  syllabus: 'Criminalistics - definition, meaning of recognition, collection, identification, individualization and interpretation of physical evidence. Crime Scene - definition, securing the scene, documentation of crime scene (Sketch & photography). Types of Crime Scene - Indoor, Outdoor & Mobile. Secondary Crime Scene. Nature & importance of crime Scene reconstruction.',

  notes: [
    { h: 'Locard\'s Principle & Identification vs Individualisation',
      b: '<p><b>Edmond Locard\'s Exchange Principle (1910):</b> <em>"Every contact leaves a trace."</em> Whenever two objects come into contact, there is always a mutual cross-transfer of material between them (dust, fibres, hair, DNA, paint, digital logs).</p>' +
         '<div class="vs-grid">' +
         '<div class="vs-card"><h4>Class Characteristics (Identification)</h4><p>• Places an item into a <b>group or category</b> sharing common properties.<br>• Examples: ABO blood group (Type O+), synthetic polyester fibre, 9mm calibre bullet, Nike Air size 9 sole pattern, window glass refractive index.<br>• Powerfully <b>excludes (exonerates)</b> innocent suspects, and multiplying independent class probabilities (<b>Product Rule</b>) builds strong corroboration, but cannot alone prove a single unique source.</p></div>' +
         '<div class="vs-card"><h4>Individual Characteristics (Individualisation)</h4><p>• Attributes unique to <b>one specific source</b> to the exclusion of all others in the world, arising from random natural growth or random wear-and-tear.<br>• Examples: <b>Latent fingerprint minutiae</b>, <b>nuclear STR DNA profile</b>, <b>rifling micro-striations on a fired bullet</b>, <b>physical jigsaw fracture match (mechanical fit)</b> of broken glass/paint, and <b>PRNU camera sensor fingerprint</b>.</p></div>' +
         '</div>' },

    { h: 'Types of Crime Scene (Primary vs Secondary; Indoor, Outdoor, Mobile)',
      b: '<ul><li><b>By Originality of Location:</b>' +
         '<br>• <b>Primary Crime Scene:</b> The original location where the actual criminal act (e.g., murder or server breach) took place.' +
         '<br>• <b>Secondary Crime Scene:</b> Any subsequent location connected to the crime (e.g., the car used to transport the body, the forest where the body was dumped, or the canal where the murder weapon was thrown).</li>' +
         '<li><b>By Physical Environment:</b>' +
         '<br>• <b>Indoor Scene:</b> Easier to secure and protected from rain/wind.' +
         '<br>• <b>Outdoor Scene:</b> <b>Most vulnerable to rapid degradation</b> by rain, sunlight, wind, animals, and onlookers — must be processed and protected with highest urgency!' +
         '<br>• <b>Mobile / Conveyance Scene:</b> Vehicles, trains, boats, aircraft.</li></ul>' },

    { h: 'Securing, Documenting (Notes, Photos, Sketches) & Searching the Scene',
      b: '<div class="diagram"><div class="diag-title">The 7 S\'s of Crime Scene Investigation</div>' +
         '<div class="flow-row">' +
         '<div class="flow-step"><b>1. Secure Scene</b><small>Preserve life first! Cordon &amp; Entry Log</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>2. Separate Witnesses</b><small>Prevent collusion</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>3. Scan &amp; See (Photo)</b><small>Overall → Mid → Close-up</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>4. Sketch Scene</b><small>Rough → Finished + Measurements</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>5. Search, Collect &amp; Seal</b><small>Chain of Custody</small></div>' +
         '</div></div>' +
         '<p><b>Sketching &amp; Measurement Methods:</b> Every sketch requires a <b>North arrow, Legend, Title block (Case #, Date, Investigator), and Scale notation ("Not to Scale" on rough sketch)</b>. Four coordinate methods fix each item to stationary landmarks:</p>' +
         '<ul>' +
         '<li><b>1. Rectangular Coordinates:</b> Two perpendicular ($90^\\circ$) distances measured to two adjacent fixed walls — best for <b>indoor rectangular rooms</b>.</li>' +
         '<li><b>2. Triangulation:</b> Straight-line distances measured from <b>two fixed reference points</b> (e.g., two trees or building corners) forming a triangle — most accurate for <b>outdoor or irregular scenes</b>.</li>' +
         '<li><b>3. Baseline (Transect) Method:</b> Stretch a single straight tape between two fixed objects and measure distance along the tape plus perpendicular offset — ideal for long corridors or rural roads.</li>' +
         '<li><b>4. Polar (Azimuth / Compass) Coordinates:</b> Distance + compass angle ($0^\\circ\\text{–}360^\\circ$) from a single origin point — used for wide-area aircraft crashes or explosion scatter fields.</li>' +
         '</ul>' +
         '<p><b>5 Standard Search Patterns:</b> <b>Zone / Quadrant / Sector</b> (best for indoor houses with multiple rooms or vehicles); <b>Grid Search</b> (two perpendicular parallel strip searches — most thorough for large outdoor scenes); <b>Line / Strip Search</b> (line of searchers walking abreast across fields); <b>Spiral Search</b> (inward or outward — best for single-investigator scenes without obstacles or underwater scenes); <b>Wheel / Ray / Pie Search</b> (radiating outward from an epicentre like a bomb blast).</p>' },

    { h: 'Evidence Packaging Rules & Crime Scene Reconstruction',
      b: '<table>' +
         '<tr><th>Evidence Type</th><th>Correct Container</th><th>Why (Critical Exam Reason!)</th></tr>' +
         '<tr><td><b>Wet Blood, Semen, Saliva, Tissue, Clothing (Biological)</b></td><td><b>Air-dry first</b>, then package in <b>breathable Paper Bags / Cardboard boxes</b></td><td><b>NEVER seal wet biological evidence in airtight plastic!</b> Plastic traps moisture, causing anaerobic bacteria and mould to multiply rapidly and <b>destroy DNA</b>.</td></tr>' +
         '<tr><td><b>Arson / Fire Debris &amp; Volatile Accelerants</b></td><td><b>Airtight clean metal paint cans, glass Mason jars, or Nylon/Kapak bags</b></td><td>Prevents volatile hydrocarbon vapours (petrol, kerosene) from evaporating before Headspace GC-MS testing! (Polyethylene plastic bags are permeable to hydrocarbons and let vapours escape.)</td></tr>' +
         '<tr><td><b>Trace Evidence (Hairs, Fibres, Paint chips, Glass, GSR powder)</b></td><td><b>Paper "Druggist Fold" ( Pharmacist Fold )</b> placed inside an outer envelope</td><td>Double-folded paper parcel prevents microscopic particles from leaking out of envelope corners, and avoids static electricity of plastic vials!</td></tr>' +
         '<tr><td><b>Charred / Burnt Documents</b></td><td>Rigid box cushioned on a layer of <b>cotton wool</b></td><td>Extremely brittle; must never be folded or picked up with tweezers.</td></tr>' +
         '</table>' }
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
      e: '<p><b>Preservation of life always comes first</b>, ahead of every evidentiary consideration. Medical intervention that disturbs the scene is accepted and simply documented.</p><p>Only then follow arrest of any suspect present, securing the scene, and documentation. Examiners test this because candidates over-focus on evidence and forget the ethical hierarchy.</p>' },

    { q: 'Unlike biological bloodstains (which require breathable paper bags), how MUST fire debris suspected of containing volatile liquid accelerants (like petrol or kerosene) from an arson scene be packaged?',
      o: ['In clean, airtight metal paint cans, glass Mason jars, or heat-sealed Nylon/Kapak bags so volatile hydrocarbon vapours cannot evaporate',
          'In porous brown paper bags so the ashes can dry out',
          'In ordinary thin polyethylene grocery bags',
          'Wrapped loosely in cotton cloth'], a: 0,
      e: '<p>Arson debris is the exact opposite of biological evidence: trace petroleum accelerants are highly volatile and evaporate rapidly if placed in breathable paper bags (and can also permeate through ordinary low-density polyethylene plastic). Therefore, arson debris must be sealed immediately inside <b>airtight lined metal cans, glass jars, or vapour-tight Nylon bags</b> for Headspace GC-MS analysis.</p>' },

    { q: 'Which of the following types of physical evidence demonstrates "Individualisation" (tracing to a single unique source) rather than mere "Class Characterisation"?',
      o: ['Matching the jagged fracture edges of a piece of broken headlamp glass found at a hit-and-run scene directly into the broken headlamp housing on the suspect\'s car (physical / mechanical jigsaw fit)',
          'Determining that a paint chip is factory-applied Toyota white acrylic enamel',
          'Determining that a footwear impression was made by a Bata size 8 shoe',
          'Determining that a hair is a human scalp hair'], a: 0,
      e: '<p>A <b>physical/mechanical fracture match (jigsaw fit)</b> of random irregular break lines, like a nuclear STR DNA profile or latent fingerprint minutiae match, possesses <b>individual characteristics</b> unique to that single broken object. By contrast, factory paint layer composition, shoe size/brand, and species of hair are all <b>class characteristics</b>.</p>' },

    { q: 'Why do forensic investigators package microscopic trace evidence (such as single hairs, textile fibres, paint chips, or glass splinters) inside a folded paper "Druggist Fold" (Pharmacist Fold) rather than pouring them directly into a plain postal envelope or a plastic bag?',
      o: ['Because fine particles easily slip out through the unsealed bottom corners of an ordinary envelope and cling irreversibly to plastic bags via static electricity, whereas a double-folded paper Druggist Fold traps every particle without static charge',
          'Because paper dissolves hair shafts for DNA extraction',
          'Because a Druggist Fold is fireproof up to 1000°C',
          'Because postal envelopes are illegal in court'], a: 0,
      e: '<p>Standard letter envelopes have tiny gaps at the bottom corners where hairs, fibres, and powder leak out, while plastic bags build up <b>electrostatic charge</b> that makes pulling fine fibres back out nearly impossible. Folding a clean sheet of paper in thirds both ways (a <b>Druggist Fold</b>) and placing that packet inside an outer sealed envelope is the universal criminalistics standard.</p>' },

    { q: 'When collecting a bloodstain scraped from a wooden floor or wall at a crime scene, the crime scene officer also collects an unstained sample of the adjacent wood from a few inches away in a separate container. This second sample is called a:',
      o: ['Substrate / Blank Control Sample (used to verify that the background surface itself does not interfere with or give a false positive in laboratory tests)',
          'Primary crime scene',
          'Finished scale sketch',
          'Locard positive reference'], a: 0,
      e: '<p>A <b>Substrate Control (Blank Control)</b> is an uncontaminated sample of the background surface next to a stain (wood, soil, carpet) collected separately to prove that any chemical/biological reaction in the lab came from the stain itself and not from dyes, detergents, or microbes already present in the surface.</p>' },

    { q: 'In Bloodstain Pattern Analysis (BPA) used during crime scene reconstruction, a circular blood drop stain on the floor with an equal width and length (W = L) indicates that the blood drop struck the surface at an angle of impact of:',
      o: ['90° (falling vertically straight down perpendicular to the floor)',
          '10° (grazing the floor almost horizontally)',
          '45°',
          '180°'], a: 0,
      e: '<p>The angle of impact $\\theta$ of a blood droplet is calculated from its stain width $W$ and length $L$ via: $$\\sin \\theta = \\frac{\\text{Width } (W)}{\\text{Length } (L)}$$ When $W = L$, $\\sin \\theta = 1 \\Rightarrow \\theta = \\mathbf{90^\\circ}$ (a vertical passive drip). As the angle becomes more acute (e.g. $30^\\circ$, where $W = 0.5 L$), the stain elongates into an ellipse with a "tail" pointing in the <b>direction of travel</b>!</p>' },

    { q: 'Which crime scene sketch type shows the floor plan in the center with the four surrounding walls folded flat outward like the sides of a cardboard box — ideal for illustrating blood spatter or bullet holes on both the floor and the walls simultaneously?',
      o: ['Exploded / Cross-Projection Sketch',
          'Overview bird\'s-eye sketch only',
          'Elevation sketch only',
          'Perspective 3D artistic drawing'], a: 0,
      e: '<p>Know the four standard crime-scene sketch styles:<br>• <b>Overview / Floor-Plan (Bird\'s-Eye) Sketch:</b> standard 2D top-down view (most common).<br>• <b>Elevation Sketch:</b> side view showing vertical height on a single wall.<br>• <b>Exploded / Cross-Projection Sketch:</b> floor plan with the four walls folded down flat around the perimeter like an opened box — essential when bullet holes or blood spatter extend across walls and ceiling.<br>• <b>Perspective Sketch:</b> 3D drawing.</p>' }
  ]
});

window.MPSC.units.push({
  id: 'p3gf10',
  paper: 'Paper III — General Forensic',
  title: 'X. Forensic Criminology & Laws',
  marks: 10,
  syllabus: 'Important sections of laws pertaining to Forensic Science and Evidence, Technology IT Act, Narcotic Drugs & Psychotropic Substances Act, Arms Act. Difference between a civil case & criminal case. Expert testimony. Importance of chain of custody. Hierarchy of Courts and their powers. Lok Adalat, Lok Ayukta and Juvenile Courts.',

  notes: [
    { h: 'The 2023 Criminal Law Overhaul (IPC/CrPC/IEA → BNS/BNSS/BSA) — Know Both!',
      b: '<div class="tip">Three landmark statutes came into force across India on <b>1 July 2024</b>. Because the MPSC JSO syllabus was drafted earlier, <b>memorise both the classic and the new section numbers</b>:<br>' +
         '• <b>Bharatiya Nyaya Sanhita (BNS), 2023</b> $\\leftarrow$ replaces Indian Penal Code (IPC), 1860<br>' +
         '• <b>Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023</b> $\\leftarrow$ replaces Code of Criminal Procedure (CrPC), 1973<br>' +
         '• <b>Bharatiya Sakshya Adhiniyam (BSA), 2023</b> $\\leftarrow$ replaces Indian Evidence Act (IEA), 1872</div>' +
         '<table><tr><th>Forensic Legal Provision</th><th>Old Law (IEA / CrPC / IPC)</th><th>New Law (BSA / BNSS / BNS — 2023)</th></tr>' +
         '<tr><td><b>Opinion of Experts</b> (Science, Art, Fingerprints, Foreign Law, <em>+ Electronic Info</em>)</td><td><b>Section 45 IEA</b> (+ s.45A for Examiner of Electronic Evidence)</td><td><b>Section 39(1) &amp; 39(2) BSA, 2023</b></td></tr>' +
         '<tr><td><b>Admissibility of Electronic Records &amp; Certificate</b></td><td><b>Section 65B IEA</b></td><td><b>Section 63 BSA, 2023</b> (with 2-part Schedule certificate + SHA-256 hash)</td></tr>' +
         '<tr><td><b>Discovery of Fact from Information of Accused in Custody</b></td><td><b>Section 27 IEA</b></td><td><b>Section 23(2) Proviso BSA, 2023</b></td></tr>' +
         '<tr><td><b>Reports of Government Scientific Experts</b> (FSL Director/Asst Director admissible without personal appearance)</td><td><b>Section 293 CrPC</b></td><td><b>Section 329 BNSS, 2023</b></td></tr>' +
         '<tr><td><b>Medical Examination of Accused at Request of Police</b></td><td><b>Section 53 &amp; 53A CrPC</b> (rape accused)</td><td><b>Section 51 &amp; 52 BNSS, 2023</b></td></tr>' +
         '<tr><td><b>Specimen Signatures, Handwriting, Finger Impressions &amp; Voice Samples</b></td><td><b>Section 311A CrPC</b></td><td><b>Section 349 BNSS, 2023</b> (explicitly adds <b>finger impressions &amp; voice samples</b>!)</td></tr>' +
         '<tr><td><b>Mandatory Crime Scene Visit by Forensic Expert &amp; Videography</b></td><td><em>Did not exist</em></td><td><b>Section 176(3) BNSS, 2023</b> — <b>MANDATORY forensic expert visit &amp; mobile videography for all offences punishable with $\\ge 7$ years imprisonment!</b></td></tr>' +
         '<tr><td><b>Destruction / Disappearance of Evidence of Offence</b></td><td><b>Section 201 IPC</b></td><td><b>Section 238 BNS, 2023</b></td></tr></table>' },

    { h: 'NDPS Act, 1985 & Arms Act, 1959 — Key Forensic Provisions',
      b: '<ul>' +
         '<li><b>Narcotic Drugs and Psychotropic Substances (NDPS) Act, 1985:</b>' +
         '<br>• Punishes cultivation, manufacture, possession, sale, and trafficking of narcotic drugs (Opium, Morphine, Heroin/Diacetylmorphine, Cannabis/Charas/Ganja, Cocaine) and psychotropic substances (LSD, MDMA, Methamphetamine, Alprazolam).' +
         '<br>• <b>3-Tier Quantity Grading (Determines Punishment!):</b> Punishment scales strictly by whether the seized weight falls under <b>1. Small Quantity</b> (e.g., Heroin = <b>5 g</b>, Ganja = <b>1000 g [1 kg]</b>, Charas/Hashish = <b>100 g</b>, Cocaine = <b>2 g</b>, LSD = <b>0.002 g</b> $\\to$ rigorous imprisonment up to 1 year), <b>2. Intermediate Quantity</b> (between small and commercial $\\to$ up to 10 years), or <b>3. Commercial Quantity</b> (e.g., Heroin = <b>250 g</b>, Ganja = <b>20 kg</b>, Charas = <b>1 kg</b>, Cocaine = <b>100 g</b>, LSD = <b>0.1 g</b> $\\to$ <b>10 to 20 years rigorous imprisonment + ₹1–2 lakh fine</b>!).' +
         '<br>• <b>Key Sections:</b> <b>s.20</b> (Cannabis offences), <b>s.21</b> (Manufactured drugs/Heroin), <b>s.22</b> (Psychotropic substances), <b>s.50</b> (Mandatory right of suspect to be searched before a <b>Gazetted Officer or Nearest Magistrate</b> during personal search!), <b>s.52A</b> (Inventory &amp; sampling before a Magistrate).</li>' +
         '<li><b>Arms Act, 1959:</b>' +
         '<br>• Distinguishes <b>Prohibited Arms &amp; Ammunition</b> (automatic/semi-automatic military firearms, artillery, noxious gas weapons — <b>Section 7</b>) from licensed civilian firearms (<b>Section 3</b>).' +
         '<br>• <b>Section 25</b> (Punishment for illegal manufacture, sale, or possession of arms), <b>Section 27</b> (Punishment for using arms), <b>Section 39</b> (Mandatory previous sanction of the <b>District Magistrate</b> required before prosecuting for unlawful possession under s.3!), and <b>Section 45</b> (Exemptions).</li>' +
         '</ul>' },

    { h: 'Civil vs Criminal Cases, Expert Testimony & Chain of Custody',
      b: '<table><tr><th>Dimension</th><th>Civil Case</th><th>Criminal Case</th></tr>' +
         '<tr><td>Nature of Wrong</td><td>Private wrong against an individual (tort, contract, property)</td><td>Public offence against the State and society as a whole</td></tr>' +
         '<tr><td>Initiated By</td><td><b>Plaintiff</b> filing a Plaint (v. Defendant)</td><td><b>The State (Prosecution)</b> via Police FIR / Magistrate Complaint (v. Accused)</td></tr>' +
         '<tr><td><b>Standard of Proof</b></td><td><b>Preponderance of probabilities</b> ($>50\\%$ likelihood)</td><td><b>Proof beyond reasonable doubt</b></td></tr>' +
         '<tr><td>Procedural Code</td><td>Code of Civil Procedure (CPC), 1908</td><td>CrPC, 1973 / <b>BNSS, 2023</b></td></tr>' +
         '<tr><td>Remedy / Outcome</td><td>Compensation (damages), injunction, specific performance</td><td>Imprisonment, fine, community service (added in BNS 2023!), death, or acquittal</td></tr></table>' +
         '<p><b>Expert Testimony (s.45 IEA / s.39 BSA &amp; s.293 CrPC / s.329 BNSS):</b> Unlike an ordinary witness of fact (who can testify only to what they directly saw or heard), an <b>Expert Witness</b> is permitted to offer <b>opinion evidence</b> on matters of science, art, handwriting, fingerprints, ballistics, DNA, or electronic records (where the Examiner of Electronic Evidence is notified under <b>Section 79A of the IT Act, 2000</b>). Court examination always follows three stages under <b>s.137–138 IEA / s.142–143 BSA</b>: <b>1. Examination-in-Chief</b> (by the party calling the expert — no leading questions allowed), <b>2. Cross-Examination</b> (by opposing counsel — leading questions ARE allowed to test credibility and competence), and <b>3. Re-Examination</b> (to clarify ambiguities raised in cross). Remember: <b>expert opinion is advisory/corroborative, never binding on the Judge</b>!</p>' +
         '<p><b>Chain of Custody:</b> The unbroken, chronological written log documenting every person who seized, sealed, transported, stored, opened, analysed, and resealed an exhibit from the crime scene to the courtroom. Any unexplained gap or broken seal raises a reasonable doubt of tampering or sample substitution.</p>' },

    { h: 'Hierarchy of Criminal Courts, Sentencing Powers, Lok Adalat, Lokayukta & JJB',
      b: '<table>' +
         '<tr><th>Criminal Court Tier (High → Low)</th><th>Maximum Imprisonment Power</th><th>Maximum Fine Power (CrPC → BNSS 2023)</th></tr>' +
         '<tr><td><b>Supreme Court / High Court</b></td><td>Any sentence authorised by law</td><td>Unlimited</td></tr>' +
         '<tr><td><b>Sessions Judge / Additional Sessions Judge</b></td><td>Any sentence including <b>Life &amp; Death</b> (<em>Death sentence MUST be confirmed by the High Court under s.366 CrPC / s.407 BNSS!</em>)</td><td>Unlimited</td></tr>' +
         '<tr><td><b>Chief Judicial Magistrate (CJM)</b></td><td>Up to <b>7 years</b></td><td>Unlimited</td></tr>' +
         '<tr><td><b>Judicial Magistrate First Class (JMFC)</b></td><td>Up to <b>3 years</b></td><td>Up to ₹10,000 (CrPC) / <b>₹50,000 (BNSS 2023)</b> (+ community service)</td></tr>' +
         '<tr><td><b>Judicial Magistrate Second Class (JMSC)</b></td><td>Up to <b>1 year</b></td><td>Up to ₹5,000 (CrPC) / <b>₹10,000 (BNSS 2023)</b> (+ community service)</td></tr>' +
         '</table>' +
         '<ul>' +
         '<li><b>Lok Adalat ("People\'s Court"):</b> Statutory ADR forum under the <b>Legal Services Authorities Act, 1987</b> (inspired by Article 39A of the Constitution). Settles pending or pre-litigation civil disputes and <b>compoundable criminal offences</b> by mutual compromise. <b>No court fee</b> is charged (and paid court fees are refunded). Its award is <b>deemed a decree of a civil court and is FINAL and binding — NO APPEAL lies to any court!</b></li>' +
         '<li><b>Lokpal and Lokayuktas (Act of 2013):</b> Statutory anti-corruption ombudsmen (**Lokpal** at the Union level, **Lokayukta** at the State level; Maharashtra created India\'s first Lokayukta in 1971) empowered to investigate allegations of corruption and maladministration against public servants and ministers.</li>' +
         '<li><b>Juvenile Justice Board (JJB):</b> Constituted under the <b>Juvenile Justice (Care and Protection of Children) Act, 2015</b> for "children in conflict with law" (under 18 years). Consists of a Metropolitan Magistrate / JMFC (Principal Magistrate) + <b>two social workers (at least one of whom must be a woman)</b>. Maximum stay in a Special Home is 3 years; however, if a child aged <b>16 to 18 years</b> is accused of a <b>heinous offence</b> (minimum punishment $\\ge 7$ years), the JJB conducts a <b>preliminary assessment</b> of mental/physical capacity and may transfer the case to the <b>Children\'s Court (Sessions Court)</b> for trial as an adult (though a child can <em>never</em> be sentenced to death or life imprisonment without possibility of release!).</li>' +
         '</ul>' }
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
      e: '<p>A <b>JMFC</b> may impose up to <b>3 years</b> and a fine up to ₹10,000 (₹50,000 under BNSS 2023). A <b>JM Second Class</b> may impose up to <b>1 year</b>; a <b>CJM</b> up to <b>7 years</b>.</p><p>A <b>Sessions Judge</b> may pass any sentence authorised by law, but a <b>death sentence requires High Court confirmation</b> — option (d) describes the Sessions Judge.</p>' },

    { q: 'Expert opinion evidence in an Indian court is', o: ['Binding on the court', 'Advisory, and the court is the final judge of fact', 'Admissible only in civil cases', 'Conclusive if uncontradicted'], a: 1,
      e: '<p>Expert opinion is <b>advisory</b>. The court is the final arbiter and may accept or reject it, even where uncontradicted — so (d) is wrong too.</p><p>Indian courts have consistently held that conviction should not rest on expert opinion <b>alone without corroboration</b>. The expert\'s distinctive privilege is simply that they may give <em>opinion</em> where an ordinary witness may speak only to perceived facts.</p>' },

    { q: 'Under Section 176(3) of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023, for offences punishable with imprisonment of 7 years or more, what new forensic procedure is now legally MANDATORY?',
      o: ['The officer in charge of the police station must cause a forensic expert to visit the crime scene to collect forensic evidence and record the process on a mobile phone or other electronic device',
          'Every suspect must undergo narco-analysis within 24 hours',
          'All trials must be conducted by a Lok Adalat',
          'Only private forensic laboratories may examine the scene'], a: 0,
      e: '<p><b>Section 176(3) of the BNSS, 2023</b> is a landmark reform for Forensic Science Laboratories in India: whenever information is received of an offence punishable for <b>7 years or more</b>, the police officer <em>shall</em> cause the forensic expert to visit the crime scene to collect forensic evidence and also cause <b>videography of the process on a mobile phone or other electronic device</b>.</p>' },

    { q: 'Under Section 50 of the Narcotic Drugs and Psychotropic Substances (NDPS) Act, 1985, before conducting a personal body search of a suspect, the empowered officer has a mandatory legal duty to inform the suspect of their right to be searched in the presence of:',
      o: ['The nearest Gazetted Officer or the nearest Magistrate',
          'A local Ward Councillor or Sarpanch',
          'The Director of the Central Bureau of Investigation',
          'A family member only'], a: 0,
      e: '<p>The Constitution Bench of the Supreme Court (in <em>State of Punjab v. Baldev Singh</em> and <em>Vijaysinh Chandubhai Jadeja</em>) held that compliance with <b>Section 50 of the NDPS Act, 1985</b> is mandatory for personal searches: the suspect must be apprised of their legal right to be taken to the <b>nearest Gazetted Officer or the nearest Magistrate</b> before the search is conducted. Non-compliance vitiates the recovery.</p>' },

    { q: 'Under the NDPS Act, 1985 notifications, what are the prescribed "Small Quantity" and "Commercial Quantity" thresholds for Heroin (diacetylmorphine) and Ganja (cannabis fruiting/flowering tops) respectively?',
      o: ['Heroin: 5 g (Small) & 250 g (Commercial); Ganja: 1 kg (Small) & 20 kg (Commercial)',
          'Heroin: 100 g (Small) & 10 kg (Commercial); Ganja: 10 g (Small) & 100 g (Commercial)',
          'Both have a 1 kg threshold for all categories',
          'Heroin: 1 g (Small) & 10 g (Commercial); Ganja: 100 kg (Small) & 500 kg (Commercial)'], a: 0,
      e: '<p>Forensic Narcotics chemists weigh and quantify seized drugs precisely because NDPS sentencing turns on these statutory cutoffs:<br>• <b>Heroin:</b> Small $= \\mathbf{5\\text{ g}}$, Commercial $= \\mathbf{250\\text{ g}}$.<br>• <b>Ganja:</b> Small $= \\mathbf{1000\\text{ g (1 kg)}}$, Commercial $= \\mathbf{20\\text{ kg}}$.<br>• <b>Charas / Hashish:</b> Small $= \\mathbf{100\\text{ g}}$, Commercial $= \\mathbf{1\\text{ kg}}$.</p>' },

    { q: 'Under which section of the Information Technology Act, 2000 does the Central Government notify a Forensic Science Laboratory (such as CFSL or State FSL Cyber Division) as an "Examiner of Electronic Evidence" whose expert opinion is recognised under Section 45A IEA / Section 39(2) BSA 2023?',
      o: ['Section 79A of the IT Act, 2000',
          'Section 66A of the IT Act, 2000',
          'Section 43 of the IT Act, 2000',
          'Section 85 of the IT Act, 2000'], a: 0,
      e: '<p><b>Section 79A of the IT Act, 2000</b> empowers the Central Government (MeitY) to notify any department, body, or agency of the Central or State Government (including accredited CFSLs and State FSLs) as an <b>Examiner of Electronic Evidence</b> for providing expert opinion on electronic form evidence before any court.</p>' },

    { q: 'Under the Arms Act, 1959, before prosecuting an accused person for unlawful possession of a firearm without a licence under Section 3, whose previous sanction is legally mandatory under Section 39 of the Arms Act?',
      o: ['The District Magistrate',
          'The Station House Officer (SHO) of the Police Station',
          'The Juvenile Justice Board',
          'The Lokayukta'], a: 0,
      e: '<p>Under <b>Section 39 of the Arms Act, 1959</b>, no prosecution shall be instituted against any person in respect of any offence under Section 3 (unlicensed possession of firearms/ammunition) without the <b>previous sanction of the District Magistrate</b> (who examines the FSL Ballistics expert\'s test-firing report confirming that the seized item is a serviceable firearm before granting sanction!).</p>' },

    { q: 'When a Forensic Scientific Officer testifies in court under Section 137–138 of the Indian Evidence Act (Section 142–143 BSA, 2023), what is the correct statutory order of the three stages of witness examination, and during which stage are "leading questions" generally permitted?',
      o: ['(1) Examination-in-Chief → (2) Cross-Examination → (3) Re-Examination; and leading questions are permitted during Cross-Examination',
          '(1) Cross-Examination → (2) Examination-in-Chief → (3) Re-Examination; and leading questions are never permitted',
          '(1) Re-Examination → (2) Cross-Examination → (3) Examination-in-Chief; and leading questions are only allowed in Examination-in-Chief',
          'Only a single stage of questioning by the Judge exists'], a: 0,
      e: '<p>The three statutory stages are:<br>1. <b>Examination-in-Chief:</b> conducted by the party who called the expert (usually the Public Prosecutor) — leading questions are not permitted on disputed matters.<br>2. <b>Cross-Examination:</b> conducted by the adverse party (Defence Counsel) — <b>leading questions (questions suggesting the desired answer) ARE permitted</b> to test the expert\'s methodology, qualifications, and chain of custody.<br>3. <b>Re-Examination:</b> confined to explaining matters raised during Cross-Examination.</p>' }
  ]
});
