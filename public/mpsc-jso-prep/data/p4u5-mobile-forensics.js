window.MPSC.units.push({
  id: 'p4u5',
  paper: 'Paper IV — Cyber Forensic',
  title: 'Mobile Forensics',
  marks: 40,
  syllabus: 'Types of mobile phones, basics of mobile phones and their components, identification of mobile phones and chipsets. Components Inside Mobile devices, Crimes using mobile phones, SIM Card, SIM Security, Mobile forensic & its challenges, seizure and isolation from network. Mobile phone evidence Extraction process. Operating systems. Android - The Linux kernel layer, Libraries, Dalvik virtual machine. Android security. Android file hierarchy, Android Manifest, XML, Developer options. ADB, fastboot, Rooting, EDL mode, bootloader; iOS - The HFS Plus file system, jailbreaking, iTunes backup, DFU Mode, Plists. Mobile phone acquisition methods - physical, logical, full file system. Chip off and JTAG. Potential evidence stored on mobile phones - Rules of evidence, SQLite examination. Location data. App Analysis. Mobile Forensic Tools.',

  notes: [
    {
      h: 'Identifiers you must not confuse (IMEI, IMSI, ICCID, MSISDN)',
      b: '<div class="analogy"><b>💡 Analogy — Car Chassis, Driver\'s Licence, Licence Card Serial &amp; Phone Directory Number:</b><br>' +
         '• <b>IMEI (15 digits)</b> is the <b>Car\'s Chassis / VIN Number</b> stamped into the metal body of the phone handset itself. Even if you change drivers (swap SIM cards), the car\'s chassis number stays the same!<br>' +
         '• <b>IMSI (15 digits)</b> is the <b>Subscriber\'s Driver Licence Account ID</b> stored inside the SIM chip.<br>' +
         '• <b>ICCID (19–20 digits)</b> is the <b>Physical Plastic Card Serial Number</b> laser-engraved on the back of the SIM card.<br>' +
         '• <b>MSISDN</b> is the public 10-digit <b>Mobile Phone Number</b> (`+91-98xxxxxxxx`) mapped to the IMSI in the telecom operator\'s HLR/HSS database (you can port or change your MSISDN without changing the handset IMEI!).</div>' +
         '<table>' +
         '<tr><th>Identifier</th><th>Exact Length &amp; Structure</th><th>Identifies</th><th>Where Stored / Retrieved</th></tr>' +
         '<tr><td><b>IMEI</b> (International Mobile Equipment Identity)</td><td><b>15 decimal digits</b>:<br><code>[8-digit TAC][6-digit SNR][1-digit Luhn Check]</code></td><td>The physical <b>handset / modem slot</b> (Dual-SIM phones have <b>two IMEIs</b>: IMEI 1 &amp; IMEI 2!)</td><td>Modem NVRAM / EFS partition, printed on box/SIM tray, or dial <b><code>*#06#</code></b></td></tr>' +
         '<tr><td><b>IMSI</b> (International Mobile Subscriber Identity)</td><td>Up to <b>15 digits</b>:<br><code>[3-digit MCC][2/3-digit MNC][MSIN]</code></td><td>The cellular <b>subscriber account</b> on the network</td><td>Inside the SIM card elementary file <b><code>EF_IMSI</code></b></td></tr>' +
         '<tr><td><b>ICCID</b> (Integrated Circuit Card Identifier)</td><td><b>19 or 20 digits</b>:<br>Starts with <b><code>89</code></b> (ISO telecom industry prefix) + Country code (`91` for India)</td><td>The <b>physical SIM card chip</b> itself</td><td>Engraved on SIM plastic body &amp; stored in <b><code>EF_ICCID</code></b></td></tr>' +
         '<tr><td><b>MSISDN</b> (Mobile Station International Subscriber Directory Number)</td><td>Max 15 digits (E.164):<br><code>CC (91) + NDC + Subscriber Number</code></td><td>The <b>diallable phone number</b></td><td>Telecom operator\'s <b>HLR / HSS</b> (often NOT reliably stored on the SIM!)</td></tr>' +
         '</table>' +
         '<div class="example"><b>🔬 Worked Example — Decomposing an Indian IMEI &amp; IMSI + Luhn Check Digit:</b><br>' +
         '• <b>Indian IMSI Example:</b> <code>404 10 9876543210</code> $\\to$ <b>MCC = <code>404</code> or <code>405</code> (India!)</b> (do NOT confuse with `+91` which is the E.164 country dialling code; `310` is USA). `10` = MNC (Bharti Airtel Delhi). `9876543210` = MSIN.<br>' +
         '• <b>IMEI Luhn Check Digit Rule:</b> Given the first 14 digits of an IMEI, double every <b>second digit from the right</b> (i.e. positions 2, 4, 6, 8, 10, 12, 14). If doubling produces a two-digit number (e.g. $7 \\times 2 = 14$), add the digits together ($1 + 4 = 5$). Sum all 14 resulting digits; the 15th check digit is the number ($0\\text{–}9$) needed to make the total sum a multiple of 10!</div>'
    },
    {
      h: 'SIM Card Internals (UICC File System) & SIM Security (PIN, PUK, Ki)',
      b: '<p>A modern <b>SIM (Subscriber Identity Module)</b> runs on a <b>UICC (Universal Integrated Circuit Card)</b> containing its own CPU, ROM, RAM, and EEPROM with a hierarchical file system defined by 3GPP TS 31.102:</p>' +
         '<div class="diagram"><div class="diag-title">SIM Card Internal File System Hierarchy (MF → DF → EF)</div>' +
         '<div class="flow-row">' +
         '<div class="flow-step"><b>MF (Master File <code>3F00</code>)</b><small>Root directory; holds <code>EF_ICCID (2FE2)</code></small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>DF_TELECOM (<code>7F10</code>)</b><small>Hold user contacts <code>EF_ADN</code>, dialled <code>EF_LND</code>, <code>EF_SMS</code></small></div><span class="flow-arrow">&amp;</span>' +
         '<div class="flow-step"><b>DF_GSM (<code>7F20</code>) / ADF_USIM</b><small>Holds <code>EF_IMSI</code>, <code>EF_KC</code>, <code>EF_LOCI</code>, <code>EF_FPLMN</code></small></div>' +
         '</div></div>' +
         '<ul>' +
         '<li><b>High-Value Elementary Files (EFs) on a SIM:</b>' +
         '<br>• <b><code>EF_ICCID</code>:</b> Unique 19–20 digit card serial number (readable <em>even when the SIM is PIN-locked</em>!).' +
         '<br>• <b><code>EF_IMSI</code>:</b> 15-digit subscriber identity.' +
         '<br>• <b><code>EF_ADN</code> (Abbreviated Dialling Numbers):</b> SIM phonebook contacts.' +
         '<br>• <b><code>EF_LND</code> (Last Numbers Dialled)</b> &amp; <b><code>EF_FDN</code> (Fixed Dialling Numbers)</b>.' +
         '<br>• <b><code>EF_SMS</code>:</b> Up to 20–50 text messages stored in 176-byte fixed slots. When a SIM SMS is deleted, only the <b>first status byte</b> of the 176-byte slot changes from `0x01` (read) / `0x03` (unread) to <b>`0x00` (free/deleted)</b> while the remaining 175 bytes of message text remain intact!' +
         '<br>• <b><code>EF_LOCI</code> (Location Information):</b> Stores the <b>TMSI</b> (Temporary Mobile Subscriber Identity) and the <b>LAI (Location Area Identity = MCC + MNC + LAC)</b> of the <em>last cell tower area</em> the phone registered with before power-off!</li>' +
         '<li><b>SIM Security Keys:</b>' +
         '<br>• <b>PIN1 (CHV1, 4–8 digits):</b> Guards normal subscriber files. <b>3 consecutive wrong PIN attempts</b> lock the SIM.' +
         '<br>• <b>PUK1 (Personal Unblocking Key, 8 digits):</b> Issued by the mobile network operator to reset a blocked PIN. <b>10 consecutive wrong PUK attempts permanently and irreversibly brick (burn out) the SIM card!</b>' +
         '<br>• <b>$K_i$ (128-bit Subscriber Authentication Key):</b> Stored inside a hardware-protected region of the SIM and in the operator\'s Authentication Centre (AuC); never transmitted over the air and cannot be read directly via standard SIM readers.</li>' +
         '</ul>'
    },
    {
      h: 'Seizure, Network Isolation & BFU vs AFU Encryption States',
      b: '<p>When seizing a mobile phone at a crime scene, the #1 immediate threat is <b>remote wipe / remote lock</b> (via Google Find My Device, Apple Find My iPhone, or WhatsApp/Telegram remote message deletion) or incoming calls/messages overwriting volatile evidence.</p>' +
         '<div class="vs-grid">' +
         '<div class="vs-card"><h4>BFU (Before First Unlock)</h4><p>• The device has just been <b>powered on or rebooted</b>, and the user has <b>NOT yet entered their passcode/pattern</b> even once.<br>• Under modern <b>File-Based Encryption (FBE)</b> (Android 7+ Credential Encrypted storage; iOS Class A/B/C Data Protection), the master decryption keys remain wrapped by the user\'s passcode inside the hardware TEE/Secure Enclave and are <b>absent from RAM</b>.<br>• Only tiny <em>Device Encrypted (DE)</em> boot files (alarms, accessibility, wallpaper) are accessible; almost zero user chats/photos can be extracted without a passcode or chipset exploit!</p></div>' +
         '<div class="vs-card"><h4>AFU (After First Unlock)</h4><p>• The user has unlocked the phone <b>at least once since the last boot</b>, even if the screen subsequently locked again.<br>• The <b>Credential Encrypted (CE) / Class C decryption keys remain resident in volatile RAM</b> so background apps can receive messages and notifications!<br>• Forensic tools (Cellebrite UFED, GrayKey) can extract <b>95%+ of the Full File System</b> in AFU state — which is completely lost if the phone reboots or its battery dies!</p></div>' +
         '</div>' +
         '<div class="example"><b>🔬 Golden Scene Seizure Protocol — Switched ON vs Switched OFF Handset:</b><br>' +
         '1. <b>If the phone is found SWITCHED OFF:</b> <b>Keep it OFF!</b> Turning it on boots it into BFU state anyway while altering timestamps and risking connecting to a cell tower.<br>' +
         '2. <b>If the phone is found SWITCHED ON:</b> <b>Keep it ON (never reboot or power it off, or you drop from AFU $\\to$ BFU)!</b>' +
         '<br>  • If the screen is <b>unlocked</b>: immediately increase screen timeout to Maximum/Never, enable <b>Airplane Mode</b>, disable Wi-Fi/Bluetooth, and enable <em>Developer Options $\\to$ Stay Awake + USB Debugging</em> (documenting every tap under ACPO Principle 2/3).' +
         '<br>  • Place the device in a <b>Faraday Bag / Shielded RF Box</b> and connect it to an <b>external USB power bank</b> inside the bag! Why? Inside a Faraday bag, the phone sees zero cell signal and boosts its cellular transmitter to maximum wattage hunting for a tower, draining the battery in 2–3 hours; if the battery hits 0%, the phone shuts down and drops from AFU into locked BFU!</div>'
    },
    {
      h: 'Android Architecture, Security, File Hierarchy, ADB, Fastboot & Qualcomm EDL',
      b: '<div class="stack-diagram">' +
         '<div class="stack-layer"><b>Layer 4: System &amp; Third-Party User Applications (<code>.apk</code>)</b><span>Contacts, SMS, WhatsApp, Browser (each runs in its own sandbox UID)</span></div>' +
         '<div class="stack-layer"><b>Layer 3: Java / Kotlin API Application Framework</b><span>Activity Manager, Content Providers, Location Manager, Telephony Manager, Notification Manager</span></div>' +
         '<div class="stack-layer"><b>Layer 2b: Android Runtime (ART / Legacy Dalvik VM)</b><span>Executes <code>.dex</code> (Dalvik Executable) bytecode; ART compiles Ahead-of-Time (AOT/JIT)</span></div>' +
         '<div class="stack-layer"><b>Layer 2a: Native C/C++ Libraries &amp; HAL (Hardware Abstraction Layer)</b><span>SQLite, OpenGL ES, WebKit, BoringSSL, Camera/Audio/Sensor HAL</span></div>' +
         '<div class="stack-layer"><b>Layer 1: Modified Linux Kernel (SELinux Mandatory Access Control)</b><span>Process/memory management, Binder IPC driver, power management, device drivers</span></div>' +
         '</div>' +
         '<ul>' +
         '<li><b>Dalvik VM vs ART (Android Runtime):</b> Both execute <b>register-based <code>.dex</code> bytecode</b> (unlike the stack-based standard Java JVM). Android 1.0–4.4 used <b>Dalvik</b> with Just-in-Time (JIT) compilation; Android 5.0+ replaced Dalvik with <b>ART</b>, which uses <b>Ahead-of-Time (AOT)</b> + profile-guided compilation into native `.oat` ELF code.</li>' +
         '<li><b>APK Structure &amp; `AndroidManifest.xml`:</b> Every `.apk` file is a <b>ZIP archive (magic bytes <code>50 4B 03 04</code>)</b> containing `classes.dex`, `resources.arsc`, `lib/`, `META-INF/` signature certificates, and <b><code>AndroidManifest.xml</code></b> — which declares the app\'s package name, minimum SDK, four component types (<b>Activities, Services, Broadcast Receivers, Content Providers</b>), and requested <b>Permissions</b> (`READ_SMS`, `ACCESS_FINE_LOCATION`, `RECORD_AUDIO`).</li>' +
         '<li><b>Crucial Android File System Paths:</b>' +
         '<br>• <b><code>/data/data/&lt;package_name&gt;/</code></b> (or `/data/user/0/<package_name>/`): Private sandbox directory for each app, holding `databases/` (SQLite `.db`), `shared_prefs/` (XML key-value configs), `files/`, and `cache/`. Protected by Linux UID + SELinux — <b>inaccessible to normal ADB pull unless rooted or extracted via Full File System / Physical exploit</b>!' +
         '<br>• <b><code>/sdcard/</code></b> (symlink to `/storage/emulated/0/` or `/data/media/0/`): Shared user storage (`DCIM/Camera`, `Download`, `WhatsApp/Media`) — accessible via MTP/logical extraction.' +
         '<br>• <b><code>/data/system/</code>:</b> Critical OS telemetry: `packages.xml`, `users/0/settings_secure.xml`, <b><code>usagestats/</code></b> (app launch history), and legacy lockscreen files (`gesture.key` / `password.key` / `locksettings.db`).</li>' +
         '</ul>' +
         '<table>' +
         '<tr><th>Android Access Mode</th><th>Layer / Protocol</th><th>Forensic Capabilities &amp; Caveats</th></tr>' +
         '<tr><td><b>ADB</b> (Android Debug Bridge)</td><td>OS user-space daemon (`adbd`) over USB TCP port 5037</td><td>Requires <b>USB Debugging</b> enabled in Developer Options (tap <em>Build Number 7 times</em>) AND RSA host key authorization (`adb_keys`) on an unlocked screen. Runs `adb devices`, `adb shell`, `adb pull`, `adb backup`, `adb bugreport`.</td></tr>' +
         '<tr><td><b>Fastboot / Bootloader</b></td><td>Secondary Bootloader (ABOOT/ABL) before Linux kernel loads</td><td>Flashes partitions (`fastboot flash`). Warning: running <code>fastboot oem unlock</code> / <code>flashing unlock</code> <b>triggers an immediate mandatory cryptographic factory wipe of `/data`</b>!</td></tr>' +
         '<tr><td><b>Recovery Mode</b></td><td>Separate bootable mini-OS partition</td><td>Stock recovery installs signed OTA updates or wipes `/data`; Custom recovery (<b>TWRP</b>) mounts `/data` to dump full file systems if unlocked/unencrypted.</td></tr>' +
         '<tr><td><b>EDL Mode</b> (Emergency Download)</td><td><b>Qualcomm Primary Bootloader (PBL)</b> in Mask ROM (USB PID `9008`)</td><td>Communicates via <b>Sahara &amp; Firehose</b> programmer protocols <em>below the OS and bootloader</em>! Allows Cellebrite/Oxygen to extract a raw physical dump of Qualcomm flash storage on supported devices without unlocking the bootloader. (MediaTek equivalent: <b>BROM / Preloader mode</b>; Samsung equivalent: <b>Odin / Download mode</b>.)</td></tr>' +
         '</table>'
    },
    {
      h: 'iOS Architecture, APFS, Plists, DFU vs Recovery, Secure Enclave & iTunes Backups',
      b: '<ul>' +
         '<li><b>iOS XNU Kernel &amp; File System:</b> Built on Darwin (XNU hybrid kernel = Mach microkernel + FreeBSD + I/O Kit). Older iOS (&lt; 10.3) used <b>HFSX / HFS+</b>; iOS 10.3+ uses <b>APFS (Apple File System)</b> with Copy-on-Write metadata and hardware-backed <b>Data Protection classes</b> (`NSFileProtectionComplete` [Class A, locked when screen locks], `CompleteUnlessOpen` [Class B], `CompleteUntilFirstUserAuthentication` [Class C, accessible in AFU!], `None` [Class D]).</li>' +
         '<li><b>Secure Enclave Processor (SEP):</b> A dedicated hardware security coprocessor with its own encrypted memory and hardware UID key fused at manufacture. Enforces a minimum <b>80-millisecond delay per passcode attempt in silicon</b> plus escalating time lockouts, preventing offline high-speed brute-forcing even if the NAND chip is desoldered!</li>' +
         '</ul>' +
         '<div class="vs-grid">' +
         '<div class="vs-card"><h4>iOS Recovery Mode vs DFU Mode</h4><p>• <b>Recovery Mode:</b> Loads the <b>iBoot</b> second-stage bootloader; screen displays the <em>"Connect to computer / Finder / iTunes"</em> cable icon.<br>• <b>DFU (Device Firmware Update) Mode:</b> Completely <b>bypasses iBoot</b> and talks directly to the hardware <b>BootROM (`SecureROM`)</b> burned into the Apple A-series silicon! The <b>screen stays 100% pitch black</b>. BootROM vulnerabilities (like `checkm8` on A5–A11 chips) are exploited in DFU mode because BootROM sits in read-only silicon and can never be patched by an iOS software update!</p></div>' +
         '<div class="vs-card"><h4>Unencrypted vs Encrypted iTunes / Finder Backup</h4><p>• <b>Unencrypted Backup:</b> Extracts photos, SMS (`sms.db`), contacts, call logs, and app sandboxes — <b>OMITS sensitive security databases</b>.<br>• <b>Password-Encrypted Backup (Forensic Goldmine!):</b> If you set a known forensic password (or know the suspect\'s backup password), iOS includes <b>1. The iOS Keychain (saved Wi-Fi passwords, website credentials, app tokens), 2. Apple Health (`healthdb_secure.sqlite`), 3. Safari Browsing History, and 4. Call History (`CallHistory.storedata`)</b>!</p></div>' +
         '</div>' +
         '<ul>' +
         '<li><b>High-Yield iOS Artefacts:</b>' +
         '<br>• <b>Property Lists (`.plist`):</b> XML or binary configuration files (beginning with 8-byte magic header <b><code>bplist00</code></b>, decoded with `plutil -p` or `plistutil`).' +
         '<br>• <b>`sms.db`</b> (`/private/var/mobile/Library/SMS/sms.db`): iMessage &amp; SMS text messages (timestamps in Apple 2001 epoch!).' +
         '<br>• <b>`KnowledgeC.db`</b> (`/private/var/mobile/Library/CoreDuet/Knowledge/knowledgeC.db`): <b>Pattern-of-life goldmine</b> recording screen lock/unlock events, exact app foreground focus times down to the second, battery plug-in, Bluetooth audio connections, and CarPlay usage!' +
         '<br>• <b>`Cache.sqlite` &amp; `consolidated.db` / `routined`:</b> Historical GPS, Wi-Fi BSSID, and cell tower location caches.</li>' +
         '</ul>'
    },
    {
      h: 'Mobile Acquisition Pyramid: Manual → Logical → Full File System → Physical (JTAG / Chip-Off)',
      b: '<div class="stack-diagram">' +
         '<div class="stack-layer"><b>Level 5 (Most Invasive / Destructive): Chip-Off &amp; ISP (In-System Programming)</b><span>Physically desoldering NAND / eMMC / UFS chip with hot air or milling — DESTRUCTIVE!</span></div>' +
         '<div class="stack-layer"><b>Level 4 (Hardware Invasive): JTAG (IEEE 1149.1 Test Access Port)</b><span>Soldering hair-thin wires to PCB debug TAP pads (TDI, TDO, TCK, TMS, TRST) — Non-destructive if careful</span></div>' +
         '<div class="stack-layer"><b>Level 3 (Bootloader / BootROM Exploit): Physical Extraction (Bit-for-Bit)</b><span>Via Qualcomm EDL, MediaTek BROM, or checkm8; captures raw flash + unallocated space</span></div>' +
         '<div class="stack-layer"><b>Level 2 (Agent / AFU Privilege Escalation): Full File System (FFS) Extraction</b><span>Captures entire `/data` or `/private/var` directory tree including all SQLite `.db` &amp; `-wal` files!</span></div>' +
         '<div class="stack-layer"><b>Level 1 (Least Invasive): Manual (Camera) &amp; Logical Extraction (ADB / iTunes Backup / AT / MTP)</b><span>Queries OS APIs only; fast &amp; safe, but misses deleted data and unbacked-up private app folders</span></div>' +
         '</div>' +
         '<div class="clarity"><b>⚡ Concept Clarity — Why Chip-Off and JTAG Rarely Work on Modern (Post-2016) Smartphones:</b><br>' +
         'On older phones without hardware encryption, desoldering the eMMC/NAND flash chip (<b>Chip-Off</b>) and placing it into an adapter (UP-828 / EasyJTAG) gave a readable bit-for-bit raw image. On modern Android (FBE with TrustZone/StrongBox) and iOS (Secure Enclave), every block on the flash chip is encrypted with a hardware-bound key fused inside the SoC/SEP processor! If you desolder the flash chip and read it outside the phone, you get 100% undecryptable random ciphertext — and worse, because you destroyed the phone PCB, you can no longer boot the phone to enter the passcode! Therefore, on modern encrypted phones, <b>Full File System (FFS) extraction in AFU state</b> is the practical forensic gold standard.</div>'
    },
    {
      h: 'WhatsApp, App Analysis, Location Forensics & Mobile Crime Typology',
      b: '<div class="example"><b>🔬 Forensic Walkthrough — Recovering Encrypted &amp; Deleted WhatsApp Messages on Android:</b><br>' +
         '1. <b>Where WhatsApp Stores Files on Android:</b>' +
         '<br>  • <b>Private Sandbox (requires Root / Full File System extraction):</b> `/data/data/com.whatsapp/databases/msgstore.db` (plaintext SQLite chat database!) + `msgstore.db-wal` + `wa.db` (contacts) + `/data/data/com.whatsapp/files/key` (the <b>158-byte AES decryption key file</b>).' +
         '<br>  • <b>Shared External Storage (accessible via simple Logical / MTP extraction):</b> `/sdcard/Android/media/com.whatsapp/WhatsApp/Databases/msgstore.db.crypt14` (or `.crypt15`).<br>' +
         '2. <b>The Forensic Catch:</b> A simple logical extraction can grab `msgstore.db.crypt14` from `/sdcard/`, <b>but you CANNOT decrypt `.crypt12` or `.crypt14` without the 158-byte `key` file from `/data/data/com.whatsapp/files/key`</b> (unless the user enabled end-to-end encrypted backup with a known 64-digit key/password)!<br>' +
         '3. <b>Recovering Deleted Messages:</b> Once you have plaintext `msgstore.db` and `msgstore.db-wal`, check the `message` (or `messages`) table, carve SQLite freelist/unallocated cell space, and parse uncheckpointed frames inside `msgstore.db-wal`. Even if a message was deleted, check `/sdcard/.../WhatsApp/Media/WhatsApp Images/Sent` and thumbnail caches!</div>' +
         '<p><b>Four Sources of Mobile Location Evidence (and the Proximity vs Connection Trap):</b></p>' +
         '<ul>' +
         '<li><b>1. On-Device GPS:</b> EXIF `GPSLatitude`/`GPSLongitude` in camera photos, Google Maps/Uber SQLite caches (`da_destination_history`), Apple `routined`. Accuracy: 3–10 metres.</li>' +
         '<li><b>2. Wi-Fi BSSID Positioning Caches:</b> Phones passively scan and cache MAC addresses (<b>BSSIDs</b>) and signal strengths (RSSI) of nearby Wi-Fi routers even without connecting to them! Comparing these BSSIDs against Skyhook/Wigle/Google location databases places the phone within ~20–50 metres indoors. <em>(Remember: detecting a BSSID proves physical proximity, NOT that the suspect authenticated to that Wi-Fi network!)</em></li>' +
         '<li><b>3. Cellular Tower (Cell ID / LAC / TAC) &amp; CDRs:</b> On-SIM `EF_LOCI` and telecom operator <b>Call Detail Records (CDRs)</b> / Tower Dump logs show which sector antenna (`CGI = MCC-MNC-LAC-CI`) handled a call/SMS/data session.</li>' +
         '<li><b>4. Cloud Account Telemetry:</b> Google Takeout / Sensorvault Location History and iCloud backups obtained via legal requisition.</li>' +
         '</ul>' +
         '<p><b>Mobile Phone Crime Typology (Instrument vs Target vs Incidental):</b></p>' +
         '<ul>' +
         '<li><b>Phone as Instrument:</b> Smishing (SMS phishing), Vishing (voice OTP fraud), UPI/QR-code collect-request fraud, sextortion/cyberbullying, remote detonation/coordination.</li>' +
         '<li><b>Phone as Target:</b> Physical snatching, <b>SIM-Swap fraud</b> (attacker tricks telco into issuing a duplicate SIM for the victim\'s number to hijack 2FA SMS OTPs — here the SIM/identity is first the <em>Target</em>, then becomes the <em>Instrument</em> for draining bank accounts!), Pegasus/stalkerware spyware infection, IMEI tampering (a cognizable offence in India under the <b>Telecommunications Act, 2023</b>!).</li>' +
         '<li><b>Phone as Incidental / Evidentiary Container:</b> A murder or robbery suspect\'s phone seized solely because its call logs, cell-tower trail, and Google Maps history place the suspect at the crime scene.</li>' +
         '</ul>'
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
      e: '<p><code>mmssms.db</code> (sometimes referenced as <code>sms.db</code>) is the Android messaging provider\'s database, holding SMS and MMS content, timestamps and thread IDs.</p><p><code>contacts2.db</code> holds contacts and <code>calllog.db</code> holds call history — each app/provider keeps its own dedicated SQLite store, which is why examiners must know which database maps to which artefact rather than searching blindly.</p>' },

    { q: 'In a 15-digit IMEI number, what do the first 8 digits represent, and which mathematical algorithm is used to compute the 15th (final) check digit?',
      o: ['The first 8 digits are the TAC (Type Allocation Code, identifying device make and model), and the 15th digit is computed by the Luhn (mod 10) algorithm',
          'The first 8 digits are the MCC/MNC, and the 15th digit is a CRC-32 checksum',
          'The first 8 digits are the subscriber MSISDN, and the 15th digit is always 0',
          'The first 8 digits are the SIM ICCID prefix, and the 15th digit uses RSA-2048'], a: 0,
      e: '<p>A 15-digit IMEI consists of an <b>8-digit TAC (Type Allocation Code)</b> assigned by the GSMA (which reveals the exact manufacturer and model of the device), followed by a <b>6-digit SNR (Serial Number)</b>, and a <b>1-digit Luhn check digit</b> (`mod 10` double-every-second-digit checksum).</p>' },

    { q: 'Why must a forensic officer connect an external USB power bank to a powered-on smartphone when sealing it inside a Faraday bag during transport to the lab?',
      o: ['Because inside a Faraday bag the phone loses all network signal and boosts its cellular radio transmitter to maximum power searching for a cell tower, rapidly draining the battery and risking a power-off that drops the phone from AFU into locked BFU state',
          'Because Faraday bags only block radio waves when connected to 5V DC power',
          'Because charging the battery automatically bypasses the Android lockscreen',
          'Because a battery below 50% deletes the SIM card\'s ICCID'], a: 0,
      e: '<p>When a powered-on phone is placed in a Faraday bag, its baseband modem detects zero signal and ramps its RF transmit power to maximum while continuously scanning all frequency bands for a cell tower. This drains the battery in a few hours; if the battery dies, the phone shuts off, losing all volatile RAM and transitioning from <b>AFU (After First Unlock)</b> back to <b>BFU (Before First Unlock)</b> where Credential Encrypted keys are inaccessible!</p>' },

    { q: 'Why does a physical Chip-Off extraction (desoldering the UFS/eMMC flash chip) on a modern Android 13 or iPhone 15 handset almost always fail to yield readable user data?',
      o: ['Because modern mobile OSes enforce mandatory File-Based Encryption (FBE) whose master decryption keys are fused inside the SoC\'s hardware TEE / Secure Enclave, so the raw flash dump contains only undecryptable ciphertext',
          'Because modern smartphones no longer use NAND flash memory',
          'Because Chip-Off only captures the SIM card and not internal storage',
          'Because modern flash chips erase themselves when heated above 50°C'], a: 0,
      e: '<p>On modern smartphones (iOS since iPhone 5s/SEP; Android since mandatory File-Based Encryption in Android 7–10+), every block written to the UFS/eMMC flash chip is encrypted using hardware-bound keys locked inside the processor\'s <b>Trusted Execution Environment (TEE) / Secure Enclave</b>. Desoldering the flash chip separates it from the CPU that holds the hardware key, leaving the examiner with unreadable ciphertext and a dead phone.</p>' },

    { q: 'An investigator uses logical extraction to pull `/sdcard/Android/media/com.whatsapp/WhatsApp/Databases/msgstore.db.crypt14` from an Android phone. What additional file — and from which private directory — is required to decrypt `.crypt14` locally without the user\'s cloud backup password?',
      o: ['The 158-byte `key` file located in `/data/data/com.whatsapp/files/key` (accessible only via root or Full File System extraction)',
          '`AndroidManifest.xml` from `/system/app/`',
          '`contacts2.db` from `/sdcard/Download/`',
          '`build.prop` from `/system/`'], a: 0,
      e: '<p>WhatsApp stores its encrypted backup database (`msgstore.db.crypt12` / `.crypt14`) on shared storage (`/sdcard/`), where any file manager or logical extraction can copy it. However, the AES decryption key is protected inside WhatsApp\'s private sandbox at <b>`/data/data/com.whatsapp/files/key`</b>, which requires root or Full File System extraction (or the WhatsApp Key/DB Extractor downgrade trick on older versions) to obtain.</p>' },

    { q: 'On an iOS device, which SQLite database (located at `/private/var/mobile/Library/CoreDuet/Knowledge/knowledgeC.db`) is a "pattern-of-life" goldmine that records exact timestamps of screen lock/unlock state, which app was in the foreground, battery plug-in events, and Bluetooth/CarPlay connections?',
      o: ['`knowledgeC.db`',
          '`mmssms.db`',
          '`SAM.db`',
          '`ntuser.dat`'], a: 0,
      e: '<p><b>`knowledgeC.db`</b> (part of iOS\'s CoreDuet / DuetExpertCenter subsystem) tracks fine-grained user and device state transitions over roughly 4 weeks — letting a forensic examiner prove whether a driver was actively holding their iPhone unlocked with WhatsApp in the foreground at the exact second of a traffic collision!</p>' },

    { q: 'When an SMS message stored directly on a legacy SIM card (inside the elementary file `EF_SMS`) is deleted by the user, what actually happens to the 176-byte SMS slot on the SIM?',
      o: ['Only the first status byte of the 176-byte record is changed to `0x00` (marking the slot free), while the remaining 175 bytes holding the sender number, timestamp, and message text remain intact until overwritten',
          'All 176 bytes are immediately overwritten with `0xFF`',
          'The SIM card\'s PUK counter is decremented by 1',
          'The deleted SMS is automatically uploaded to the operator\'s HLR'], a: 0,
      e: '<p>In the 3GPP SIM file system (`DF_TELECOM / EF_SMS`, file ID `6F3C`), each SMS occupies a fixed <b>176-byte linear record</b>. Byte 1 is the status byte (`0x01` = read, `0x03` = unread, `0x05` = sent, `0x07` = unsent). Deleting the message simply changes Byte 1 to <b>`0x00` (free space)</b>, leaving the entire 175-byte SMS payload recoverable by any forensic SIM card reader!</p>' },

    { q: 'How does JTAG (Joint Test Action Group, IEEE 1149.1) acquisition differ from Chip-Off acquisition in mobile forensics?',
      o: ['JTAG solders fine wires to existing debug Test Access Port (TAP) pads on the circuit board to read the flash memory through the CPU without removing the storage chip, whereas Chip-Off physically desolders and removes the storage chip from the board',
          'JTAG requires desoldering the flash chip, whereas Chip-Off uses Bluetooth',
          'JTAG only recovers SIM card contacts, whereas Chip-Off only recovers SD cards',
          'JTAG is a cloud backup method, whereas Chip-Off is an ADB command'], a: 0,
      e: '<p><b>JTAG</b> communicates with the processor\'s boundary-scan debug interface via 5 standard signals (<b>TDI, TDO, TCK, TMS, TRST</b>) exposed on test pads on the PCB. Because the flash chip stays soldered to the board, the phone remains functional afterward if the wires are cleanly removed — making JTAG <b>non-destructive</b> compared with <b>Chip-Off</b>.</p>' },

    { q: 'While examining a seized iPhone file system, an investigator opens a configuration `.plist` file in a hex editor and sees the first 8 ASCII bytes read `bplist00` (`62 70 6C 69 73 74 30 30`). What does this header indicate?',
      o: ['It is a binary Property List file that must be parsed or converted (e.g., via `plutil` or `plistutil`) before its key-value pairs can be read as text',
          'It is an encrypted BitLocker volume header',
          'It is a corrupted SQLite 3 database header',
          'It is an Android Dalvik executable (`.dex`) file'], a: 0,
      e: '<p>Apple stores Property Lists (`.plist`) in either plain XML (`<?xml ...`) or compact <b>Binary Plist</b> format, which always begins with the 8-byte magic signature <b>`bplist00`</b>.</p>' },

    { q: 'Suppose the first 14 digits of a mobile phone\'s IMEI are `35693803564380`. Using the Luhn (mod 10) algorithm, what is the 15th check digit?',
      o: ['9', '0', '5', '3'], a: 0,
      e: '<p>Apply the <b>Luhn algorithm</b> to `3 5 6 9 3 8 0 3 5 6 4 3 8 0`, doubling every 2nd digit from theleft/right (positions 2, 4, 6, 8, 10, 12, 14):<br>• Odd positions (unchanged): $3, 6, 3, 0, 5, 4, 8$<br>• Even positions (doubled, sum digits if $\\ge 10$): $5\\times 2=10\\to 1$; $9\\times 2=18\\to 9$; $8\\times 2=16\\to 7$; $3\\times 2=6$; $6\\times 2=12\\to 3$; $3\\times 2=6$; $0\\times 2=0$.<br>• Total sum $= (3+1) + (6+9) + (3+7) + (0+6) + (5+3) + (4+6) + (8+0) = 4 + 15 + 10 + 6 + 8 + 10 + 8 = 61$.<br>• Next multiple of 10 above 61 is 70, so the 15th check digit is $70 - 61 =$ <b>9</b>!</p>' },

    { q: 'On a SIM card (UICC), which Elementary File (EF) stores the Abbreviated Dialling Numbers (the user\'s SIM phonebook contacts), and which EF stores the Last Numbers Dialled?',
      o: ['`EF_ADN` (Abbreviated Dialling Numbers) stores contacts, and `EF_LND` stores Last Numbers Dialled',
          '`EF_IMSI` stores contacts, and `EF_ICCID` stores dialled numbers',
          '`EF_LOCI` stores contacts, and `EF_KC` stores dialled numbers',
          '`EF_SMS` stores both contacts and dialled numbers'], a: 0,
      e: '<p>Under the `DF_TELECOM` (`7F10`) directory on a SIM card:<br>• <b>`EF_ADN` (Abbreviated Dialling Numbers):</b> stores the user\'s SIM contacts (names + phone numbers).<br>• <b>`EF_LND` (Last Numbers Dialled):</b> stores outgoing dialled calls.<br>• <b>`EF_FDN` (Fixed Dialling Numbers):</b> restricted whitelist of numbers.<br>• <b>`EF_SMS`:</b> text messages.</p>' },

    { q: 'Since Android 4.2.2+, even if "USB Debugging" is turned ON in Developer Options on a suspect\'s locked Android phone, plugging it into a new forensic workstation via ADB displays `unauthorized`. How can an investigator legitimately bypass this RSA host authorization prompt without knowing the phone\'s passcode?',
      o: ['Locate the suspect\'s own paired laptop/PC, extract the trusted `~/.android/adbkey` (and `adbkey.pub`) files from that computer, and copy them into the forensic workstation\'s `.android` directory (since the phone\'s `/data/misc/adb/adb_keys` already trusts that RSA key pair!)',
          'Cut the green data wire inside the USB cable',
          'Remove the SIM card and dial *#06#',
          'Place the phone inside a Faraday bag for 24 hours'], a: 0,
      e: '<p>When a user clicks "Always allow from this computer" on the Android USB debugging prompt, the host computer\'s public RSA key (`adbkey.pub`) is saved on the phone in `/data/misc/adb/adb_keys`. If the investigator seizes the suspect\'s laptop and copies its private `~/.android/adbkey` to the forensic laptop, the locked phone immediately recognises the workstation as already authorised and grants an `adb` shell!</p>' },

    { q: 'How did the replacement of the legacy Dalvik Virtual Machine by ART (Android Runtime, introduced in Android 5.0) change how Android app `.dex` bytecode is executed?',
      o: ['Dalvik relied on Just-in-Time (JIT) interpretation at runtime, whereas ART introduced Ahead-of-Time (AOT) / profile-guided compilation that compiles `.dex` bytecode into native machine code (`.oat` ELF binaries) upon installation',
          'ART removed support for `.apk` files and requires Windows `.exe` files',
          'Dalvik ran in kernel mode (Ring 0), whereas ART runs inside the SIM card',
          'ART disables all app sandboxing'], a: 0,
      e: '<p>In Android 1.0–4.4, <b>Dalvik</b> compiled bytecode on the fly each time the app ran (<b>JIT</b>). Starting in Android 5.0 (Lollipop), <b>ART (Android Runtime)</b> uses `dex2oat` to compile `.dex` bytecode into native `.oat` machine binaries ahead of time (<b>AOT</b>, later blended with JIT profile-guided compilation in Android 7+), dramatically improving performance and creating `.oat`/`.odex`/`.vdex` artefacts on disk.</p>' },

    { q: 'In Android 7.0+ "File-Based Encryption" (FBE / Direct Boot), internal `/data` storage is divided into two cryptographic zones: Device Encrypted (DE) storage and Credential Encrypted (CE) storage. What is the difference between DE and CE storage when a phone boots into BFU (Before First Unlock) state?',
      o: ['Device Encrypted (DE) storage is decrypted immediately upon boot (allowing alarms, accessibility, and incoming phone rings to work in BFU), whereas Credential Encrypted (CE) storage (which holds user photos, SMS, WhatsApp, and contacts) remains locked until the user enters their passcode/pattern for the first time (AFU)',
          'Credential Encrypted (CE) storage is always unencrypted, whereas DE requires a PUK code',
          'Both DE and CE are completely wiped on every reboot',
          'DE storage resides on the SIM card, whereas CE storage resides in the cloud'], a: 0,
      e: '<p>Android\'s <b>Direct Boot</b> splits storage into:<br>• <b>DE (Device Encrypted):</b> protected only by hardware keys verified at boot — accessible in <b>BFU</b> so the alarm clock rings and emergency calls work after a night-time reboot.<br>• <b>CE (Credential Encrypted):</b> the default storage for 99% of user apps (`/data/user/0/`), protected by the user\'s lockscreen credential — accessible <b>only after transition to AFU</b>!</p>' },

    { q: 'Why was the `checkm8` ("checkmate") exploit discovered in 2019 for Apple A5 through A11 iPhones (iPhone 4s to iPhone X) considered a permanent, unpatchable hardware milestone for iOS forensics?',
      o: ['Because the vulnerability resides in Apple\'s read-only hardware BootROM (`SecureROM`) executed during DFU mode, which is burned into silicon at manufacture and cannot be patched by any iOS software update',
          'Because Apple voluntarily disabled encryption on all iPhones after 2019',
          'Because it works over SMS without touching the phone',
          'Because it resets the IMEI to all zeros'], a: 0,
      e: '<p>`checkm8` is a use-after-free vulnerability in the USB DFU stack of Apple\'s first-stage <b>BootROM (`SecureROM`)</b> on A5–A11 SoCs. Because `SecureROM` is etched permanently into read-only mask ROM inside the processor silicon, Apple could only fix it by manufacturing new silicon (A12 and later), allowing forensic tools to boot a RAM disk in DFU mode on iPhone 5s–X across all iOS versions.</p>' },

    { q: 'What is "ISP" (In-System Programming, also called "Direct eMMC / UFS Tap") in advanced mobile hardware forensics, and why is it preferred over traditional Chip-Off when applicable?',
      o: ['ISP solders micro-jumper wires directly to the eMMC/UFS storage chip\'s PCB signal lines (CLK, CMD, DAT0, VCC, VCCQ, GND) to read the raw flash memory directly into a flash reader WITHOUT heating or desoldering the storage chip from the phone\'s motherboard',
          'ISP requests the user\'s browsing history from their Internet Service Provider',
          'ISP melts the motherboard in an acid bath to extract the SIM card',
          'ISP is a cloud backup protocol for iCloud'], a: 0,
      e: '<p>Unlike JTAG (which talks through the CPU\'s debug port) and unlike Chip-Off (which applies $300^\\circ\\text{C}+$ hot air to desolder the BGA flash chip, risking thermal damage), <b>ISP (In-System Programming)</b> taps directly into the eMMC/UFS data bus traces (`CMD, CLK, DAT0`) on the board while keeping the chip soldered in place.</p>' },

    { q: 'When analysing Telecom Operator Call Detail Records (CDRs) in a mobile crime investigation, what does the "CGI" (Cell Global Identity) column `404-10-4021-18492` tell the investigator?',
      o: ['The exact cellular base-station sector antenna (MCC = 404 India, MNC = 10 Operator, LAC/TAC = 4021 Location Area Code, CI = 18492 Cell Tower Sector ID) that served the handset at the start/end of the call or SMS',
          'The GPS coordinates of the suspect accurate to 1 millimetre',
          'The audio recording of the phone conversation',
          'The suspect\'s bank account PIN'], a: 0,
      e: '<p>A telecom <b>CDR (Call Detail Record)</b> logs metadata (never voice audio!) for every call and SMS: Calling Number (A-party), Called Number (B-party), Date, Start Time, Duration, <b>IMEI</b> of handset, <b>IMSI</b> of SIM, and the <b>First/Last CGI (Cell Global Identity = MCC + MNC + LAC + Cell ID)</b>. Mapping the Cell ID against the operator\'s Tower Location Mast Directory places the handset within the coverage sector ($60^\\circ / 120^\\circ$ azimuth) of that specific cell tower.</p>' },

    { q: 'In Android forensics, if a suspect cleared their call log and uninstalled an incriminating app right before seizure, which system directory (accessible in Full File System extractions at `/data/system/usagestats/`) still records exact timestamps of when every app package was moved to the foreground or background?',
      o: ['Android UsageStats (`/data/system/usagestats/` or `adb shell dumpsys usagestats`)',
          '`/sdcard/DCIM/Camera/`',
          '`EF_ICCID` on the SIM card',
          '`/proc/cpuinfo`'], a: 0,
      e: '<p>Android\'s <b>`UsageStatsManager` (`/data/system/usagestats/`)</b> is the Android counterpart to iOS\'s `knowledgeC.db`: it maintains daily, weekly, monthly, and yearly binary/XML logs of every application package\'s `MOVE_TO_FOREGROUND` and `MOVE_TO_BACKGROUND` events, surviving even after the user uninstalls the app!</p>' },

    { q: 'Under the Indian Telecommunications Act, 2023, tampering with, altering, or reprogramming a mobile handset\'s 15-digit IMEI number is classified as:',
      o: ['A serious cognizable, non-bailable criminal offence punishable with up to 3 years imprisonment and/or fine up to ₹50 lakh',
          'A legal software customisation allowed for privacy',
          'A minor traffic violation with a ₹100 fine',
          'Permitted whenever a phone is rooted'], a: 0,
      e: '<p>Under Section 42(3)(c) &amp; (f) of the <b>Telecommunications Act, 2023</b> (building on Section 65 of the IT Act, 2000), knowingly tampering with telecommunication identifiers such as the <b>IMEI</b> — or possessing equipment that spoofs/flashes IMEIs — is a stringent cognizable offence punishable with imprisonment up to <b>3 years, a fine up to ₹50 lakh, or both</b>.</p>' }
  ]
});
