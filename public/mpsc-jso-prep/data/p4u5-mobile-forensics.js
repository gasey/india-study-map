window.MPSC.units.push({
  id: 'p4u5',
  paper: 'Paper IV — Cyber Forensic',
  title: 'Mobile Forensics',
  marks: 40,
  syllabus: 'Types of mobile phones, basics of mobile phones and their components, identification of mobile phones and chipsets. Components Inside Mobile devices, Crimes using mobile phones, SIM Card, SIM Security, Mobile forensic & its challenges, seizure and isolation from network. Mobile phone evidence Extraction process. Operating systems. Android - The Linux kernel layer, Libraries, Dalvik virtual machine. Android security. Android file hierarchy, Android Manifest, XML, Developer options. ADB, fastboot, Rooting, EDL mode, bootloader; iOS - The HFS Plus file system, jailbreaking, iTunes backup, DFU Mode, Plists. Mobile phone acquisition methods - physical, logical, full file system. Chip off and JTAG. Potential evidence stored on mobile phones - Rules of evidence, SQLite examination. Location data. App Analysis. Mobile Forensic Tools.',

  notes: [
    {
      h: 'Identifiers you must not confuse',
      b: '<table>' +
         '<tr><th>Identifier</th><th>Length</th><th>Identifies</th><th>Stored on</th></tr>' +
         '<tr><td><b>IMEI</b></td><td>15 digits</td><td>The <b>handset</b></td><td>Device firmware</td></tr>' +
         '<tr><td><b>IMSI</b></td><td>up to 15 digits</td><td>The <b>subscriber</b></td><td>SIM card</td></tr>' +
         '<tr><td><b>ICCID</b></td><td>19–20 digits</td><td>The <b>SIM card itself</b></td><td>Printed on and stored in SIM</td></tr>' +
         '<tr><td><b>MSISDN</b></td><td>varies</td><td>The <b>phone number</b></td><td>Network (HLR)</td></tr>' +
         '</table>' +
         '<p>Dial <code>*#06#</code> to display the IMEI. Its structure: 8-digit <b>TAC</b> (Type Allocation Code, identifying make and model) + 6-digit serial + 1 check digit computed by the <b>Luhn algorithm</b>.</p>' +
         '<p>The IMSI decomposes into <b>MCC</b> (Mobile Country Code — 404/405 for India) + <b>MNC</b> (Mobile Network Code) + MSIN. Note that the phone number is <em>not</em> stored on the SIM in any reliable way; it lives in the operator\'s network records.</p>' +
         '<div class="tip"><b>The distinction that decides marks:</b> IMEI = equipment, IMSI = subscriber, ICCID = the physical card. Swap the SIM and the IMSI/ICCID change while the IMEI does not. This is exactly how investigators link multiple SIMs to one handset via CDR analysis.</div>'
    },
    {
      h: 'SIM card',
      b: '<p>A SIM is a smart card running its own microprocessor and file system. Sizes: full-size, mini, micro, nano, and <b>eSIM</b> (embedded, provisioned over the air — a growing forensic problem since it cannot be physically removed).</p>' +
         '<p>Evidence typically recoverable from a SIM: ICCID, IMSI, <b>ADN</b> (Abbreviated Dialling Numbers — the contacts), <b>LND</b> (Last Numbers Dialled), <b>SMS</b> messages including deleted ones flagged as free, and <b>LOCI</b> (Location Information — the last known Location Area Identity, useful for placing the device).</p>' +
         '<p><b>SIM security:</b> the <b>PIN</b> protects normal use — three wrong attempts block the card. The <b>PUK</b> (8 digits, held by the operator) unblocks it; <b>ten</b> wrong PUK attempts permanently destroy the card. The <b>Ki</b> is the secret authentication key, never readable off the card.</p>' +
         '<div class="tip"><b>Never guess a SIM PIN on evidence.</b> Exhausting PIN attempts forces a PUK you may not have, and exhausting the PUK destroys the evidence irreversibly. Obtain the PUK from the service provider first.</div>'
    },
    {
      h: 'Seizure and network isolation',
      b: '<p>The overriding risk is <b>remote wipe</b>. A seized phone left connected can be wiped, locked or have data altered by the suspect or an accomplice.</p>' +
         '<p>Isolation options, in rough order of preference:</p>' +
         '<ul>' +
         '<li><b>Faraday bag / box / shielded room</b> — blocks radio. Note the phone will boost transmit power hunting for signal, so <b>keep it on charge</b>; a bagged phone flattens fast and may power off into a more locked state.</li>' +
         '<li><b>Aeroplane mode</b> — requires interacting with the device, which alters it; acceptable if documented and justified under ACPO Principle 2.</li>' +
         '<li><b>Removing the SIM</b> — stops cellular but not Wi-Fi or Bluetooth.</li>' +
         '</ul>' +
         '<p><b>Found switched on → keep it on</b> (powering down may trigger full-disk encryption requiring a passcode on reboot, and loses volatile data). <b>Found switched off → leave it off.</b> Photograph the screen state, and record whether it was in BFU or AFU state.</p>' +
         '<p><b>BFU vs AFU</b> — <em>Before First Unlock</em>: encryption keys are not in memory and very little is extractable. <em>After First Unlock</em>: keys are resident, and far more data is accessible. This is the single most consequential distinction in modern mobile forensics.</p>'
    },
    {
      h: 'Android internals',
      b: '<p>Layered architecture, bottom-up: <b>Linux kernel</b> → <b>HAL and native libraries</b> (plus the Android Runtime) → <b>Application Framework</b> → <b>Applications</b>.</p>' +
         '<ul>' +
         '<li>The runtime was originally the <b>Dalvik VM</b> — register-based (unlike the stack-based Java VM), executing <code>.dex</code> bytecode with just-in-time compilation. It was replaced by <b>ART</b> (Android Runtime) from Android 5.0, which uses ahead-of-time compilation.</li>' +
         '<li><b>AndroidManifest.xml</b> declares the package name, components (activities, services, receivers, providers), and the <b>permissions</b> the app requests. It is the first thing to examine in app analysis.</li>' +
         '<li>Apps ship as <b>.apk</b> files — which are ZIP archives, so they carry the <code>50 4B 03 04</code> "PK" signature.</li>' +
         '<li>Security model: each app runs under its own <b>UID</b> in an application sandbox, isolated by standard Linux permissions.</li>' +
         '</ul>' +
         '<p><b>Key paths:</b> <code>/data/data/&lt;package&gt;/</code> holds each app\'s private data — this is where the SQLite databases live, and it is inaccessible without root or a full file system extraction. <code>/sdcard/</code> or <code>/storage/emulated/0/</code> is user-accessible shared storage. <code>/system/</code> holds the OS.</p>' +
         '<p><b>Access modes:</b> <b>ADB</b> (Android Debug Bridge) for shell access over USB, requiring USB debugging enabled in Developer Options; <b>fastboot</b> for bootloader-level flashing; <b>EDL</b> (Emergency Download Mode) on Qualcomm chipsets for low-level access; <b>recovery mode</b>; and <b>rooting</b> to obtain superuser privileges.</p>'
    },
    {
      h: 'iOS internals',
      b: '<ul>' +
         '<li>File system: <b>HFS+</b> historically, replaced by <b>APFS</b> from iOS 10.3 — copy-on-write, with snapshots and native encryption.</li>' +
         '<li><b>Plist</b> (property list) files store configuration and app state, in XML or binary form. Binary plists must be converted before reading — a routine exam point.</li>' +
         '<li><b>DFU mode</b> (Device Firmware Update) is a low-level state that bypasses the bootloader and iBoot, used for restore and, forensically, for certain exploits. <b>Recovery mode</b> is the higher-level alternative that does load iBoot.</li>' +
         '<li><b>Jailbreaking</b> removes Apple\'s restrictions to gain root — the iOS analogue of rooting. It modifies the device, so its forensic use must be justified and documented.</li>' +
         '<li><b>iTunes/Finder backups</b> are a major evidence source, often obtainable from a suspect\'s computer rather than the phone. An <b>encrypted</b> backup counter-intuitively contains <em>more</em> data than an unencrypted one — it includes keychain items, health and Wi-Fi data.</li>' +
         '<li>The <b>Secure Enclave</b> is a separate coprocessor holding cryptographic keys, and is why brute-forcing modern iOS passcodes is rate-limited in hardware.</li>' +
         '</ul>'
    },
    {
      h: 'Acquisition methods',
      b: '<table>' +
         '<tr><th>Method</th><th>Gets</th><th>Invasiveness</th></tr>' +
         '<tr><td><b>Manual</b></td><td>What is visible by operating the handset, photographed</td><td>None, but alters device; no deleted data</td></tr>' +
         '<tr><td><b>Logical</b></td><td>Live files via API/backup — contacts, SMS, call logs</td><td>Low; misses deleted data</td></tr>' +
         '<tr><td><b>File system</b></td><td>Full directory structure including app databases and journals</td><td>Moderate; usually needs root/jailbreak or an exploit</td></tr>' +
         '<tr><td><b>Physical</b></td><td>Bit-for-bit image including unallocated space</td><td>High; often impossible on modern encrypted devices</td></tr>' +
         '<tr><td><b>JTAG</b></td><td>Physical image via the debug test-access port on the board</td><td>Invasive; requires soldering to test points</td></tr>' +
         '<tr><td><b>Chip-off</b></td><td>Physical image by desoldering the NAND flash and reading it directly</td><td><b>Destructive</b>; last resort, and encryption may render it useless</td></tr>' +
         '</table>' +
         '<p>The ordering principle mirrors the order of volatility: <b>least invasive first</b>, escalating only as necessary, because each step forecloses options behind it. Note that on a modern encrypted device, chip-off recovers ciphertext — physical extraction is no longer the gold standard it once was.</p>' +
         '<p><b>Where the evidence lives:</b> app SQLite databases under <code>/data/data/</code>, call logs and SMS, browser history, <b>location data</b> (GPS in image EXIF, Wi-Fi and cell-tower caches, Google Location History), cloud sync artefacts, notification history, and deleted rows recoverable from SQLite free pages and WAL files (see Unit II).</p>'
    },
    {
      h: 'Mobile forensic challenges & rules of evidence',
      b: '<p><b>Why mobile forensics is harder than disk forensics:</b> device diversity (thousands of OS/chipset/firmware combinations vs. a handful of desktop OSes), rapid OS version churn, near-universal <b>encryption at rest</b>, vendor lock-down (bootloader/Secure Enclave), volatile evidence that a wrong step destroys (remote wipe, screen-lock timeout, battery death), heavy reliance on <b>cloud-synced</b> data the handset itself never fully holds, and anti-forensic apps (vaults, secure messengers with disappearing messages, factory-reset triggers).</p>' +
         '<p>The four <b>rules-of-evidence principles</b> (from the ACPO Good Practice Guide, applied to digital/mobile evidence generally) govern every step:</p>' +
         '<ol>' +
         '<li><b>Principle 1</b> — no action by the examiner should change data held on the device or media that may later be relied upon in court.</li>' +
         '<li><b>Principle 2</b> — where access to original data is unavoidable, the person doing so must be <b>competent</b> and able to explain the relevance and implications of their actions.</li>' +
         '<li><b>Principle 3</b> — an <b>audit trail</b> of every process applied must be created and preserved, such that an independent third party could repeat it and reach the same result.</li>' +
         '<li><b>Principle 4</b> — the <b>case officer</b> (investigation lead) bears overall responsibility for ensuring the law and these principles are followed.</li>' +
         '</ol>' +
         '<div class="tip"><b>Exam trap:</b> Principle 1 does not say "no action is ever permitted" — Principle 2 explicitly allows necessary access by a competent examiner. Together they mean: minimise change, and where change is unavoidable, justify and document it. This is the same logic behind the airplane-mode-vs-Faraday-bag choice at seizure.</div>'
    },
    {
      h: 'Rooting, bootloader & EDL mode',
      b: '<p><b>Bootloader</b> is the first code that runs, choosing which partition/OS image to boot (normal, recovery, fastboot). Manufacturers ship it <b>locked</b> by default. Unlocking it (e.g. <code>fastboot oem unlock</code> / <code>fastboot flashing unlock</code>) is usually required before flashing a custom recovery or gaining deep access — and on most devices this <b>triggers an automatic factory data wipe</b> as an anti-theft measure. That makes bootloader unlocking a last-resort, evidence-destroying step in most casework.</p>' +
         '<p><b>Rooting</b> installs a superuser binary/manager (historically <code>su</code>, now commonly <b>Magisk</b>, which patches the boot image to stay largely undetectable to apps) to grant root privileges to the shell/apps. Forensically valuable because it exposes <code>/data/data/</code>, but it <b>modifies the system partition</b> and must be justified exactly as jailbreaking is on iOS.</p>' +
         '<p><b>EDL (Emergency Download) mode</b> is a low-level diagnostic mode on <b>Qualcomm</b> chipsets, reached via a key combination, a test point, or a crafted USB command, that talks to the Primary Bootloader over the <b>Sahara</b> and <b>Firehose</b> protocols. It permits raw read/write of the flash storage <em>below</em> the operating system and lock screen — which is exactly why commercial extraction tools exploit it for physical acquisition of otherwise-locked devices.</p>' +
         '<div class="tip"><b>Ordering:</b> bootloader (chooses what to boot) → fastboot (a bootloader-level flashing protocol) → recovery mode (a minimal secondary OS for updates/wipes) → EDL (chip-level, below all of the above, Qualcomm-specific). Confusing EDL with "just another recovery mode" is a common wrong-option trap.</div>'
    },
    {
      h: 'Location data & app analysis',
      b: '<p><b>Location evidence comes from four independent sources</b>, each with a different accuracy/availability trade-off:</p>' +
         '<ul>' +
         '<li><b>GPS</b> — most accurate; embedded as EXIF latitude/longitude in photos, and logged in navigation-app databases.</li>' +
         '<li><b>Wi-Fi positioning</b> — the device caches nearby access-point BSSIDs with signal strength and timestamps; resolved against crowd-sourced AP-location databases (Google/Apple) even indoors where GPS fails.</li>' +
         '<li><b>Cell-tower data</b> — Cell ID + LAC/TAC give a coarse area fix from the handset side; the network side holds this too (see LOCI on the SIM, and operator CDRs).</li>' +
         '<li><b>Cloud location history</b> — e.g. Google\'s account-level Location History/Timeline, which persists even if on-device caches are cleared, and must be requested from the provider rather than extracted from the handset.</li>' +
         '</ul>' +
         '<p><b>App analysis</b> starts with the manifest/permissions (capability) and then the app\'s private SQLite stores. Messaging apps are the highest-value target: WhatsApp\'s chat database ships as <code>msgstore.db</code>, encrypted on-device as <code>msgstore.db.crypt12/.crypt14</code>, with the decryption key stored in a separate key file reachable only via root or a full file system extraction. Browser history, social-media caches and notification logs round out the app-analysis picture.</p>' +
         '<div class="tip"><b>Trap:</b> a Wi-Fi/cell cache placed the device near a location — it does not prove the device <em>connected</em> to that network/tower, only that it detected it. Treat proximity evidence and connection evidence as distinct claims.</div>'
    },
    {
      h: 'Mobile forensic tools',
      b: '<table>' +
         '<tr><th>Tool</th><th>Vendor / type</th><th>Notes</th></tr>' +
         '<tr><td><b>Cellebrite UFED</b></td><td>Cellebrite (commercial)</td><td>"Universal Forensic Extraction Device" — logical, file system and physical extraction; bundles chipset-level exploits (Qualcomm/EDL-class) for locked devices; the de facto industry standard</td></tr>' +
         '<tr><td><b>MSAB XRY</b></td><td>MSAB (commercial)</td><td>Competing full-suite extraction and analysis platform</td></tr>' +
         '<tr><td><b>Magnet AXIOM</b></td><td>Magnet Forensics (commercial)</td><td>Combines device, cloud and computer artefacts in one case</td></tr>' +
         '<tr><td><b>Oxygen Forensic Detective</b></td><td>Oxygen (commercial)</td><td>Strong on app/cloud artefact parsing</td></tr>' +
         '<tr><td><b>Andriller</b></td><td>Open-source</td><td>Android-only, lightweight logical/physical extraction and decoding</td></tr>' +
         '<tr><td><b>Autopsy</b></td><td>Open-source</td><td>General digital-forensics platform; useful for SQLite/file examination on top of a prior image</td></tr>' +
         '</table>' +
         '<p>Regardless of tool, the acquired image must be <b>hashed</b> (MD5/SHA-256) immediately on completion, and every verification hash re-checked before analysis and before court presentation — the tool automates extraction, not the chain of custody.</p>'
    },
    {
      h: 'Evidence extraction workflow',
      b: '<p>The end-to-end process, mirroring the general digital-forensics model but with mobile-specific steps inserted:</p>' +
         '<ol>' +
         '<li><b>Seizure & isolation</b> — Faraday bag/aeroplane mode, power-state decision (on stays on, off stays off), photograph screen state.</li>' +
         '<li><b>Documentation</b> — make, model, IMEI, ICCID/IMSI if SIM present, visible damage, BFU/AFU state, seizure time and location, chain-of-custody form opened.</li>' +
         '<li><b>Method selection</b> — least invasive method that meets the investigative need (see the acquisition-methods table), driven by lock state, OS version and available exploits.</li>' +
         '<li><b>Acquisition</b> — extract, then <b>hash</b> the resulting image/report immediately.</li>' +
         '<li><b>Preservation</b> — original device sealed and stored; all further work happens on the verified copy/image, never the original.</li>' +
         '<li><b>Examination & analysis</b> — parse file system/SQLite artefacts, correlate app, location and network evidence.</li>' +
         '<li><b>Reporting & presentation</b> — reproducible, documented findings suitable for court, satisfying ACPO Principle 3.</li>' +
         '</ol>' +
         '<div class="tip"><b>Discriminator:</b> hashing happens right after acquisition, not just before trial — a hash taken only at the end cannot prove the image was unaltered from the moment it was created.</div>'
    },
    {
      h: 'Mobile phone fundamentals: types, components & chipset identification',
      b: '<p><b>Feature phone vs smartphone</b> is the basic typology: a <b>feature phone</b> runs a closed, proprietary or lightweight OS (or none at all beyond firmware), offers calling/SMS and limited apps, and stores far less forensically — mainly contacts, call logs and SMS on the handset/SIM. A <b>smartphone</b> runs a full multitasking OS (Android/iOS), installs third-party apps each with their own private storage, and is the primary target of modern mobile forensics because of the sheer volume and variety of app-generated evidence it holds.</p>' +
         '<p><b>Core hardware components inside a mobile device:</b></p>' +
         '<table>' +
         '<tr><th>Component</th><th>Function</th><th>Forensic relevance</th></tr>' +
         '<tr><td><b>Baseband processor / modem</b></td><td>Handles radio (cellular) communication, runs its own separate firmware/OS</td><td>Holds IMEI, radio firmware; a distinct attack surface from the main OS (e.g. EDL mode talks to the bootloader below the application processor)</td></tr>' +
         '<tr><td><b>Application processor (SoC)</b></td><td>Runs the main OS (Android/iOS) and all apps</td><td>Where user data, app databases and the file system live</td></tr>' +
         '<tr><td><b>RAM</b></td><td>Volatile working memory</td><td>Holds decryption keys in AFU state, running-process artefacts; lost on power-off</td></tr>' +
         '<tr><td><b>Flash storage (NAND/eMMC/UFS)</b></td><td>Non-volatile storage for OS, apps and user data</td><td>Target of physical/chip-off acquisition; holds unallocated space where deleted data can persist</td></tr>' +
         '<tr><td><b>SIM slot</b></td><td>Interfaces with the SIM/eSIM</td><td>See SIM card note — ICCID/IMSI, ADN, SMS, LOCI</td></tr>' +
         '<tr><td><b>Radio/antenna module</b></td><td>Cellular, Wi-Fi, Bluetooth, GPS, NFC radios</td><td>Source of location and connectivity artefacts; also the reason Faraday isolation is needed at seizure</td></tr>' +
         '</table>' +
         '<p><b>Identifying the phone and chipset</b> during triage (before deciding an acquisition method) draws on several sources: the <b>model number</b> printed under the battery/SIM tray or in Settings; the <b>FCC ID</b> (for devices sold in the US, look up the FCC database for exact make/model/frequency bands) or equivalent regional certification marks; the <b>IMEI\'s TAC</b> (first 8 digits), which identifies make and model via the GSMA TAC database; and, at the chip level, <b>baseband/bootloader identification strings</b> (visible in EDL/download-mode handshakes or bootloader logs) that reveal the SoC vendor (Qualcomm, MediaTek, Samsung Exynos, Apple Silicon) — this is what determines which chipset-specific exploit (e.g. EDL/Sahara-Firehose for Qualcomm) a forensic tool can use.</p>' +
         '<div class="tip"><b>Why this comes first in the syllabus:</b> chipset identification directly gates method selection later in the unit — an examiner who cannot tell a Qualcomm device from a MediaTek one cannot correctly choose (or explain) an EDL-based physical extraction. Model/FCC ID/TAC identification is the triage step that precedes every acquisition decision.</div>'
    },
    {
      h: 'Crimes using mobile phones',
      b: '<p>The syllabus names this as a distinct topic: a typology of mobile-enabled crime, mirroring the instrument/target/incidental framing used for computer-based crime in the general cyber-forensic unit.</p>' +
         '<table>' +
         '<tr><th>Role of the phone</th><th>Examples</th></tr>' +
         '<tr><td><b>Instrument</b> — phone used to commit the crime</td><td>Harassment/threatening calls and SMS, <b>smishing</b> (SMS-based phishing links), voice-call phishing (vishing), WhatsApp-based fraud (fake KYC/lottery/job-offer messages), <b>mobile banking/UPI fraud</b> via social engineering or malicious apps, circulation of obscene/defamatory content, cyberstalking via location-sharing features</td></tr>' +
         '<tr><td><b>Target</b> — the phone or its access itself is attacked</td><td>Physical theft/snatching of the handset, <b>SIM-swap fraud</b> (fraudulently reissuing a victim\'s SIM to intercept OTPs and take over bank/email accounts), unauthorised remote access/spyware installation, IMEI cloning</td></tr>' +
         '<tr><td><b>Incidental / evidentiary</b> — crime committed elsewhere, phone merely holds evidence of it</td><td>A phone recovered from a suspect in an unrelated offence (murder, narcotics, terrorism) that happens to contain call logs, location history or messages relevant to that case</td></tr>' +
         '</table>' +
         '<p>SIM-swap fraud deserves special attention because it chains two crimes: the phone is first the <b>target</b> (fraudulent SIM reissue, usually via social engineering of the telecom operator or an insider), then becomes the <b>instrument</b> for downstream banking fraud once OTPs are intercepted on the cloned SIM. This dual role is a frequent exam distractor.</p>' +
         '<div class="tip"><b>Exam trap:</b> "theft of a mobile phone" and "a mobile phone recovered during theft investigation" sound similar but are opposite categories — the first is the phone as <b>target</b>, the second is the phone as <b>incidental evidence</b> of a different crime (or the phone being the fruit/object of the theft itself, not the instrument of it).</div>'
    },
    {
      h: 'SQLite examination on mobile phones',
      b: '<p>Unit II covers SQLite\'s file format generally; this is the mobile-specific application named in the syllabus under "potential evidence stored on mobile phones." Most native and third-party mobile apps persist their data in SQLite databases inside the app\'s private storage (<code>/data/data/&lt;package&gt;/databases/</code> on Android), which is exactly why file system or physical extraction — not logical extraction alone — is needed to reach them.</p>' +
         '<table>' +
         '<tr><th>Database</th><th>App / source</th><th>Holds</th></tr>' +
         '<tr><td><code>contacts2.db</code></td><td>Android Contacts provider</td><td>Contact names, numbers, associated accounts</td></tr>' +
         '<tr><td><code>mmssms.db</code> (a.k.a. <code>sms.db</code>)</td><td>Android messaging</td><td>SMS and MMS content, timestamps, thread IDs</td></tr>' +
         '<tr><td><code>msgstore.db</code> (<code>.crypt12/.crypt14</code> encrypted)</td><td>WhatsApp</td><td>Chat messages, timestamps, media references</td></tr>' +
         '<tr><td><code>calllog.db</code> / call log provider</td><td>Android telephony</td><td>Call history, duration, direction</td></tr>' +
         '</table>' +
         '<p><b>Why examine the database directly rather than through the app\'s UI:</b> the UI only shows what the app chooses to render — typically the current, non-deleted state. Opening the raw <code>.db</code> file with a SQLite viewer (or a forensic parser like Autopsy) exposes rows the UI hides, and more importantly lets the examiner recover deleted data:</p>' +
         '<ul>' +
         '<li>SQLite marks a deleted row\'s space as <b>free</b> rather than erasing it — until that page is reused, the old bytes are still recoverable by scanning free/unallocated pages within the <code>.db</code> file itself.</li>' +
         '<li>The <b>Write-Ahead Log</b> (<code>-wal</code> file, alongside the main <code>.db</code> and <code>-shm</code> shared-memory index) records changes not yet checkpointed into the main database — it frequently contains rows that were deleted from the main table moments before seizure but still sit uncommitted in the WAL.</li>' +
         '<li>The rollback journal (<code>-journal</code>, on older SQLite configurations) serves the same recovery purpose as the WAL for databases not using WAL mode.</li>' +
         '</ul>' +
         '<div class="tip"><b>Discriminator:</b> "the app shows no messages" and "the phone contains no messages" are not the same claim. A message deleted from WhatsApp\'s or the SMS app\'s UI routinely survives — recoverable from SQLite free pages or the WAL — until the space is overwritten by later writes. This is the single most common way "deleted" evidence is actually recovered in mobile cases.</div>'
    }
  ],

  questions: [
    { q: 'The IMEI number of a mobile phone identifies the',
      o: ['Subscriber', 'SIM card', 'Handset equipment', 'Network operator'], a: 2,
      e: '<p><b>IMEI = International Mobile Equipment Identity</b> — it identifies the <b>handset</b>, is 15 digits, and can be displayed by dialling <code>*#06#</code>.</p><p>The <b>IMSI</b> identifies the subscriber and lives on the SIM; the <b>ICCID</b> identifies the SIM card itself. Because the IMEI stays constant when SIMs are swapped, call-detail-record analysis can tie several SIMs to one handset.</p>' },

    { q: 'Entering an incorrect SIM PUK code ten consecutive times results in',
      o: ['The SIM being temporarily locked for 24 hours',
          'The SIM being permanently disabled',
          'The handset being IMEI-blacklisted',
          'A reset to the default PIN of 0000'], a: 1,
      e: '<p>Three wrong <b>PIN</b> attempts block the SIM and demand the PUK. <b>Ten</b> wrong <b>PUK</b> attempts destroy the card permanently and irrecoverably.</p><p>This is why an examiner never guesses at PIN or PUK values on evidence — obtain the PUK from the service provider. Losing the SIM this way is unrecoverable evidence loss and would be indefensible in court.</p>' },

    { q: 'A mobile device seized in the AFU (After First Unlock) state is forensically significant because',
      o: ['The device cannot be encrypted in this state',
          'Decryption keys are resident in memory, making far more data accessible',
          'The IMEI can be changed without detection',
          'It guarantees the passcode has been disabled'], a: 1,
      e: '<p>In <b>AFU</b>, the user has unlocked the device at least once since boot, so file-based encryption keys are loaded in RAM and much user data is decryptable. In <b>BFU</b> (Before First Unlock) the keys are absent and extraction yields very little.</p><p>This is precisely why a phone found switched on should be <b>kept</b> switched on and charged — rebooting it drops the device back to BFU and can destroy your access.</p>' },

    { q: 'Which acquisition method involves physically desoldering the memory chip from the circuit board?',
      o: ['JTAG', 'Chip-off', 'Logical extraction', 'File system extraction'], a: 1,
      e: '<p><b>Chip-off</b> removes the NAND flash for direct reading. It is <b>destructive</b> and irreversible, so it is a last resort.</p><p><b>JTAG</b> also yields a physical image but works through the board\'s existing test-access port without removing the chip, making it invasive yet non-destructive. On modern encrypted handsets, chip-off frequently returns only ciphertext — the technique has lost much of its former value.</p>' },

    { q: 'In Android, the private data of an installed application — including its SQLite databases — is normally stored under',
      o: ['/sdcard/Android/', '/system/app/', '/data/data/&lt;package name&gt;/', '/cache/'], a: 2,
      e: '<p><code>/data/data/&lt;package&gt;/</code> is the app\'s sandboxed private directory, containing <code>databases/</code>, <code>shared_prefs/</code>, <code>files/</code> and <code>cache/</code>.</p><p>Because Linux permissions confine it to the app\'s own UID, reaching it requires <b>root or a full file system extraction</b> — which is exactly why logical extraction misses so much. <code>/system/</code> holds the OS; <code>/sdcard/</code> is shared user storage.</p>' },

    { q: 'The Dalvik Virtual Machine used in earlier versions of Android is',
      o: ['Stack-based, like the Java VM', 'Register-based', 'A hardware virtualisation layer', 'Identical to the Java VM'], a: 1,
      e: '<p>Dalvik is <b>register-based</b>, unlike the stack-based JVM, and executes <code>.dex</code> bytecode — a design chosen to suit resource-constrained mobile hardware.</p><p>From Android 5.0 it was replaced by <b>ART</b>, which compiles ahead of time at install rather than just-in-time at run time. The syllabus names Dalvik explicitly, but knowing the ART succession is worth having.</p>' },

    { q: 'A Faraday bag is used during mobile device seizure to',
      o: ['Prevent physical damage in transit',
          'Isolate the device from all radio networks',
          'Preserve battery charge',
          'Shield the device from magnetic data corruption'], a: 1,
      e: '<p>A Faraday bag blocks radio signals, preventing <b>remote wipe</b>, remote lock and incoming data that would alter the evidence.</p><p>Note the practical catch: a shielded phone raises transmit power searching for a network and drains its battery quickly, so it must be kept on charge inside the bag. Letting it die can drop an AFU device back to BFU.</p>' },

    { q: 'The AndroidManifest.xml file in an APK primarily declares',
      o: ['The app\'s source code', 'Components and requested permissions',
          'The user\'s stored credentials', 'The device\'s hardware specification'], a: 1,
      e: '<p>The manifest declares the package name, minimum SDK, application components (activities, services, broadcast receivers, content providers) and the <b>permissions</b> requested.</p><p>In app analysis it is the first artefact examined, because the permission list immediately shows whether an app could access location, SMS, contacts, camera or microphone — establishing capability.</p>' },

    { q: 'On iOS devices, configuration and application state data is commonly stored in',
      o: ['Registry hives', 'Plist (property list) files', 'INI files', 'YAML manifests'], a: 1,
      e: '<p><b>Plists</b> are Apple\'s configuration format, in either XML or <b>binary</b> form. Binary plists are not human-readable and must be converted (e.g. with <code>plutil</code>) before analysis.</p><p>The Windows equivalent is the registry, which is why option (a) is offered — the two are conceptual counterparts across platforms.</p>' },

    { q: 'An encrypted iTunes backup, compared with an unencrypted one, generally contains',
      o: ['Less data, since sensitive items are excluded',
          'More data, including keychain, health and Wi-Fi information',
          'Exactly the same data',
          'Only the device configuration'], a: 1,
      e: '<p>Counter-intuitively, an <b>encrypted backup holds more</b>. Apple only includes keychain credentials, Health data, Wi-Fi settings and call history when the backup is encrypted, because encryption protects them.</p><p>Practical consequence: if a passcode for an encrypted backup is available, it is a richer source than an unencrypted backup of the same device — a favourite examiner point precisely because the intuition runs the other way.</p>' },

    { q: 'The 15-digit IMSI stored on a SIM card begins with the MCC, which for India is',
      o: ['91', '404 or 405', '001', '310'], a: 1,
      e: '<p>The <b>Mobile Country Code</b> for India is <b>404/405</b>. It is followed by the Mobile Network Code (MNC) identifying the operator, then the MSIN identifying the subscriber.</p><p>Do not confuse the MCC with the international dialling code <b>+91</b> — option (a) is the trap. 310 is the United States.</p>' },

    { q: 'ADB (Android Debug Bridge) requires which setting to be enabled on the target device?',
      o: ['Airplane mode', 'USB debugging in Developer Options', 'Device encryption', 'Safe mode'], a: 1,
      e: '<p>ADB communicates with a device only when <b>USB debugging</b> is enabled under Developer Options, and — since Android 4.2.2 — only after the host\'s RSA key is authorised on an unlocked screen.</p><p>That authorisation requirement is why ADB is often unavailable on a locked seized handset, and why examiners look for a previously paired computer whose <code>adb_key</code> is already trusted.</p>' },

    { q: 'Which acquisition method should generally be attempted first on a seized mobile device?',
      o: ['Chip-off', 'JTAG', 'The least invasive method that meets the investigative need', 'Physical extraction'], a: 2,
      e: '<p>The governing principle is <b>least invasive first</b>, escalating only as required — manual, then logical, then file system, then physical, then JTAG, then chip-off.</p><p>Each step risks foreclosing the ones behind it: a failed chip-off leaves nothing to retry. This mirrors ACPO Principle 1 and the order-of-volatility logic in Unit III, and examiners like it precisely because it tests judgement rather than recall.</p>' },

    { q: 'The ICCID printed on a SIM card is typically',
      o: ['15 digits, identical in length to the IMEI', '19–20 digits', 'A 4-digit numeric code', '6 alphanumeric characters'], a: 1,
      e: '<p>The <b>ICCID</b> (Integrated Circuit Card Identifier) runs to <b>19–20 digits</b> and identifies the physical SIM card itself, distinct from the 15-digit IMEI which identifies the handset.</p><p>Examiners are frequently tested on exact digit counts because they are the fastest way to check whether a candidate actually knows which identifier is which, rather than just recognising the acronyms.</p>' },

    { q: 'LOCI, an artefact recoverable from a SIM card, records the',
      o: ['List of contacts dialled in the last 24 hours', 'Last known Location Area Identity', 'Log of incoming call identities', 'Locked-out ICCID history'], a: 1,
      e: '<p><b>LOCI (Location Information)</b> stores the last Location Area Identity the handset registered with — a coarse but useful placement clue recoverable straight from the SIM, without needing network CDRs.</p><p>Do not confuse it with <b>LND</b> (Last Numbers Dialled) or <b>ADN</b> (Abbreviated Dialling Numbers, i.e. contacts) — all three live on the SIM but record entirely different things.</p>' },

    { q: 'Compared with a removable SIM, an eSIM poses a particular forensic challenge because it',
      o: ['Cannot store an IMSI', 'Is provisioned over the air and cannot be physically removed for isolation or independent examination', 'Is always unencrypted', 'Uses a different, non-standard IMEI format'], a: 1,
      e: '<p>An <b>eSIM</b> is embedded in the device and provisioned remotely, so an examiner cannot simply pull the card to isolate cellular connectivity or examine it independently the way a removable SIM allows.</p><p>This pushes isolation entirely onto other controls — Faraday bag/box or aeroplane mode — since "remove the SIM" is not an available option, a distinction worth remembering against the seizure-and-isolation note.</p>' },

    { q: 'Under the ACPO-derived rules-of-evidence principles for digital evidence, Principle 2 addresses the situation where',
      o: ['No examiner may ever access original data under any circumstance',
          'Access to original data is necessary, in which case the examiner must be competent and able to explain the relevance and implications of their actions',
          'A case officer may delegate all responsibility to the forensic tool vendor',
          'An audit trail is optional if the device is returned to the owner'], a: 1,
      e: '<p><b>Principle 2</b> is the necessary-access clause: when touching original data cannot be avoided, it must be done by a <b>competent</b> person who can justify and explain what they did and why.</p><p>It works alongside Principle 1 (minimise change) rather than against it — this pairing is exactly why justified, documented actions like aeroplane mode at seizure remain defensible even though they alter the device.</p>' },

    { q: 'EDL (Emergency Download) mode, exploited by many commercial extraction tools for physical acquisition, is a low-level mode specific to',
      o: ['Apple A-series chipsets', 'Qualcomm chipsets, accessed via the Sahara/Firehose protocols', 'MediaTek chipsets only', 'Any Android device regardless of chipset'], a: 1,
      e: '<p><b>EDL mode</b> is a Qualcomm-specific diagnostic mode that communicates with the Primary Bootloader over the <b>Sahara</b> and <b>Firehose</b> protocols, permitting raw flash read/write beneath the operating system and lock screen.</p><p>Because it operates below the OS, it can bypass a screen lock that would otherwise block logical or file-system extraction — which is precisely why forensic tool vendors build exploits around it.</p>' },

    { q: 'Unlocking an Android bootloader (e.g. via `fastboot oem unlock`) is forensically risky mainly because it',
      o: ['Permanently disables the IMEI', 'Typically triggers an automatic factory data wipe on most devices', 'Converts the file system from ext4 to FAT32', 'Instantly decrypts all user data'], a: 1,
      e: '<p>As an anti-theft measure, most manufacturers wipe the device automatically the moment the bootloader is unlocked, destroying exactly the evidence the examiner was trying to reach.</p><p>This is why bootloader unlocking sits at the extreme, last-resort end of the "least invasive first" ordering — it is attempted only when no other route to the data exists and the loss is accepted or unavoidable.</p>' },

    { q: 'APFS, which replaced HFS+ as Apple\'s mobile file system from iOS 10.3, introduced which capability relevant to forensic examiners?',
      o: ['Removal of all encryption support', 'Copy-on-write with native per-file encryption and snapshots', 'Mandatory FAT32 compatibility', 'Elimination of the need for a backup mechanism'], a: 1,
      e: '<p><b>APFS</b> (Apple File System) added copy-on-write semantics, space sharing, snapshots/clones, and strong native <b>per-file encryption</b> — all of which change how deleted data and prior states can (or cannot) be recovered compared with the older HFS+.</p><p>Its copy-on-write design means an in-place "overwrite" often actually writes new blocks and updates metadata pointers, which examiners must account for when reasoning about data recency and remnants.</p>' },

    { q: 'The key difference between DFU mode and Recovery mode on an iOS device is that DFU mode',
      o: ['Loads iBoot and displays a "connect to computer" screen, exactly like Recovery mode',
          'Bypasses the bootloader and iBoot entirely, dropping to the lowest available level',
          'Is only accessible after jailbreaking', 'Erases the Secure Enclave keys automatically'], a: 1,
      e: '<p><b>DFU (Device Firmware Update)</b> mode bypasses the bootloader and iBoot completely — the screen stays black, with no logo — making it the lowest-level state available, used for full restores and certain forensic/exploit techniques.</p><p><b>Recovery mode</b>, by contrast, still loads iBoot and shows the familiar "connect to iTunes/Finder" prompt. Mixing the two up is a classic wrong-option trap since both are reached by button combinations at boot.</p>' },

    { q: 'The Secure Enclave on modern Apple devices is best described as',
      o: ['A cloud backup server operated by Apple', 'A separate coprocessor holding cryptographic keys and enforcing passcode-retry rate limiting in hardware', 'A software-only sandbox for third-party apps', 'The partition that stores Plist configuration files'], a: 1,
      e: '<p>The <b>Secure Enclave</b> is a physically separate coprocessor with its own memory, managing biometric (Touch ID/Face ID) matching and cryptographic keys, and it enforces escalating delays and eventual wipe policies on repeated wrong passcode attempts.</p><p>Because these controls are hardware-enforced rather than software-enforced, brute-forcing a modern iPhone passcode cannot be sped up by software alone — a key reason iOS physical acquisition is far harder than on comparable Android devices.</p>' },

    { q: 'Full file system (FFS) extraction, as distinct from logical extraction, primarily gives the examiner',
      o: ['A bit-for-bit image of unallocated flash space, identical to a physical extraction',
          'The complete file system — all app sandboxes, SQLite databases, journals and system files — without necessarily including raw unallocated space',
          'Only the same data logical extraction provides, formatted differently',
          'Access limited strictly to the /sdcard/ partition'], a: 1,
      e: '<p><b>Full file system extraction</b> reaches every accessible file and directory, including app-private SQLite databases and their journal/WAL files that logical extraction cannot see — but it is still working at the file-system level, not necessarily recovering raw unallocated flash the way a true physical image does.</p><p>This places it squarely between logical and physical in the acquisition table\'s invasiveness/completeness ordering, and exam questions often test whether candidates conflate "full file system" with "physical."</p>' },

    { q: 'Cellebrite UFED, widely used in mobile forensics, stands for',
      o: ['Universal Forensic Extraction Device', 'Unified File Encryption Detector', 'USB Forensic Evidence Drive', 'Uniform File Examination Database'], a: 0,
      e: '<p><b>UFED = Universal Forensic Extraction Device</b>, Cellebrite\'s flagship platform supporting logical, file-system and physical extraction, bundling chipset-level exploits (including EDL-class techniques) to reach locked devices.</p><p>Whichever commercial tool performs the extraction, the resulting image must still be hashed immediately and its chain of custody documented — the tool automates acquisition, not the evidentiary safeguards around it.</p>' },

    { q: 'WhatsApp chat data on Android is stored in a database that is typically',
      o: ['msgstore.db, unencrypted and freely readable by any app', 'msgstore.db.crypt12/.crypt14 — encrypted, with the key recoverable only via root or a full file system extraction', 'Stored exclusively on WhatsApp\'s cloud servers with nothing left on-device', 'Held only inside the AndroidManifest.xml file'], a: 1,
      e: '<p>WhatsApp encrypts its chat database on-device as <code>msgstore.db.crypt12</code> or <code>.crypt14</code>, with the decryption key kept in a separate key file that ordinary logical extraction cannot reach — recovering both requires root access or a full file system extraction.</p><p>This is a concrete illustration of why the acquisition-method choice matters for app analysis specifically: a logical extraction may show that WhatsApp is installed and used, while remaining unable to decrypt a single message.</p>' },

    { q: 'A device\'s cached Wi-Fi access-point list, used to resolve approximate location, records the fact that the device',
      o: ['Successfully authenticated and connected to those access points', 'Merely detected those access points within radio range, which is resolved against a crowd-sourced AP-location database', 'Was physically inside each access point\'s premises', 'Transferred data through each access point'], a: 1,
      e: '<p>Wi-Fi positioning works by logging <em>detected</em> BSSIDs with signal strength and timestamps, then matching them against a crowd-sourced database of known AP locations — detection, not connection or authentication, is what is being recorded.</p><p>Examiners must therefore present Wi-Fi-cache evidence as proximity evidence only; claiming it proves the device connected to, let alone was inside, a given premises overstates what the artefact actually shows.</p>' },

    { q: 'The baseband processor in a mobile device is primarily responsible for',
      o: ['Running the main operating system and installed apps', 'Handling radio/cellular communication, with its own separate firmware', 'Storing SQLite databases for third-party apps', 'Rendering the display and touchscreen input'], a: 1,
      e: '<p>The <b>baseband processor (modem)</b> handles cellular radio communication and runs its own firmware, distinct from the <b>application processor (SoC)</b> that runs the main OS and apps.</p><p>This separation matters forensically: low-level modes like EDL talk to the bootloader beneath the application processor, and the baseband is where the IMEI and radio firmware reside — a different attack surface than the app-data-holding flash storage.</p>' },

    { q: 'During triage, an examiner identifies a suspect handset\'s chipset (e.g. Qualcomm vs MediaTek) mainly because this',
      o: ['Determines the phone\'s IMEI check digit', 'Gates which chipset-specific acquisition exploit (e.g. EDL/Sahara-Firehose for Qualcomm) can be used', 'Is required before dialling *#06#', 'Changes the SIM\'s ICCID format'], a: 1,
      e: '<p>Chipset identification (via model number, FCC ID, the IMEI\'s TAC, or baseband/bootloader identification strings) directly gates <b>method selection</b> — commercial tools bundle chipset-specific exploits, such as EDL mode over Sahara/Firehose, which only apply to Qualcomm silicon.</p><p>Getting the chipset wrong means reaching for the wrong extraction technique entirely, which is why the syllabus places phone/chipset identification before acquisition methods.</p>' },

    { q: 'SIM-swap fraud is a useful exam example because it illustrates a mobile phone being',
      o: ['Only ever the instrument of a crime, never the target', 'First the target (fraudulent SIM reissue), then the instrument (OTP interception enabling banking fraud)', 'Only incidental evidence in an unrelated case', 'Impossible to classify under the instrument/target/incidental typology'], a: 1,
      e: '<p><b>SIM-swap fraud</b> chains two roles: the phone/subscriber identity is first the <b>target</b> when the SIM is fraudulently reissued to the attacker, then becomes the <b>instrument</b> once intercepted OTPs are used to take over the victim\'s banking or email accounts.</p><p>This dual-role chaining is a common distractor — candidates often try to force it into a single category when the syllabus\'s typology allows (and expects) a crime to occupy more than one role across its lifecycle.</p>' },

    { q: 'A phone recovered from a suspect during an unrelated narcotics investigation, found to contain relevant call logs, is best classified under the mobile-crime typology as the phone being',
      o: ['The instrument of the crime', 'The target of the crime', 'Incidental / evidentiary to a different offence', 'Not classifiable under this typology'], a: 2,
      e: '<p>Where the phone was not used to commit the offence and was not itself attacked, but merely happens to hold evidence of a crime committed by other means, it falls under the <b>incidental/evidentiary</b> category — distinct from instrument (used to commit) and target (itself attacked).</p><p>This is the same instrument/target/incidental structure used for general computer-crime classification, applied here specifically to mobile-enabled crime as the syllabus names it.</p>' },

    { q: 'A message deleted from WhatsApp\'s conversation view on a suspect\'s Android phone may still be recoverable because',
      o: ['WhatsApp automatically restores deleted messages after 24 hours', 'SQLite marks a deleted row\'s space as free rather than erasing it, and the row may also persist uncommitted in the write-ahead log', 'The UI always displays a hidden "deleted items" folder', 'Deletion is impossible on encrypted databases'], a: 1,
      e: '<p>SQLite does not immediately erase a deleted row\'s bytes — it marks that space as <b>free</b>, recoverable until overwritten. The <b>write-ahead log (-wal)</b> can additionally hold changes, including deletions of rows that still exist unmodified in the main database, or vice versa, not yet checkpointed at seizure time.</p><p>This is why examining the raw <code>.db</code>/<code>-wal</code> files directly, rather than trusting the app\'s UI, is standard practice for recovering "deleted" mobile messages.</p>' },

    { q: 'Which of the following mobile SQLite databases would an examiner check specifically to recover Android SMS/MMS content?',
      o: ['contacts2.db', 'mmssms.db', 'calllog.db', 'AndroidManifest.xml'], a: 1,
      e: '<p><code>mmssms.db</code> (sometimes referenced as <code>sms.db</code>) is the Android messaging provider\'s database, holding SMS and MMS content, timestamps and thread IDs.</p><p><code>contacts2.db</code> holds contacts and <code>calllog.db</code> holds call history — each app/provider keeps its own dedicated SQLite store, which is why examiners must know which database maps to which artefact rather than searching blindly.</p>' }
  ]
});
