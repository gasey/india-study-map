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
      e: '<p>The governing principle is <b>least invasive first</b>, escalating only as required — manual, then logical, then file system, then physical, then JTAG, then chip-off.</p><p>Each step risks foreclosing the ones behind it: a failed chip-off leaves nothing to retry. This mirrors ACPO Principle 1 and the order-of-volatility logic in Unit III, and examiners like it precisely because it tests judgement rather than recall.</p>' }
  ]
});
