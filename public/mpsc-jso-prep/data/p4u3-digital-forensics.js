window.MPSC.units.push({
  id: 'p4u3',
  paper: 'Paper IV — Cyber Forensic',
  title: 'Digital Forensics & Computer Forensics',
  marks: 40,
  syllabus: 'What is Digital Forensics and digital evidence, Principles of Digital Evidence. Sources of digital evidence. Key technical concepts - bits, bytes, numbering scheme, file extensions and file signatures, hashing algorithms, MD5, SHA1, SHA256, importance of hash values in digital forensics, data acquisition and evidence collection - Volatile data collection, Non-volatile data collection, imaging and extraction of storage devices, write-blockers. Memory forensics - memory dump. Deleted file and partitions - concepts and recovery, file carving, metadata, password cracking - brute-force method, dictionary attack, rainbow tables. Basics of computer forensics, acquisition methods, image format (raw, DD, SMART, AFF, E01 etc.), disk and file encryption techniques, windows registry analysis, hibernation file (hiberfil.sys), windows event log, artifacts recognition from slack space and unallocated space, Crash Dump Analysis, MFT analysis, metadata analysis. Anti-forensics - data hiding, file extension mismatch, encryption, Steganography, data destruction; Evidence Collection in Linux and Mac Operating system. Computer forensic tools.',

  notes: [
    {
      h: 'Principles of digital evidence & Indian legal admissibility',
      b: '<p><b>Digital Forensics</b> is the application of scientifically proven methods to <em>identify, collect, preserve, examine, analyse, and present</em> digital evidence in a manner legally admissible in court. The <b>Four ACPO Principles</b> (UK Association of Chief Police Officers, adopted globally and in Indian MeitY/CFSL SOPs) are:</p>' +
         '<ol>' +
         '<li><b>Principle 1 (No alteration):</b> No action taken by law enforcement or their agents should change data held on a computer or storage medium which may subsequently be relied upon in court.</li>' +
         '<li><b>Principle 2 (Exception for live competence):</b> In exceptional circumstances where a person finds it necessary to access original data held on a device (e.g., live RAM capture on an encrypted running server), that person must be <b>competent</b> to do so and able to give evidence explaining the relevance and the implications of their actions.</li>' +
         '<li><b>Principle 3 (Reproducible audit trail):</b> An audit trail or record of all processes applied to digital evidence should be created and preserved. An independent third party should be able to examine those processes and achieve the <b>exact same result</b>.</li>' +
         '<li><b>Principle 4 (Overall responsibility):</b> The person in charge of the investigation has overall responsibility for ensuring that the law and these principles are adhered to.</li>' +
         '</ol>' +
         '<div class="clarity"><b>⚡ Concept Clarity — Indian Electronic Evidence Law (IEA 1872 vs BSA 2023):</b><br>' +
         '• <b>Primary Evidence:</b> When the <em>original physical device</em> (suspect laptop, DVR hard disk, mobile phone) itself is seized and produced in court under <b>Section 62 IEA / Section 57 BSA 2023</b>, no certificate is needed.<br>' +
         '• <b>Secondary Electronic Output (Certificate Mandatory!):</b> When a forensic image, printout, CD/DVD, USB copy, or server log extract is produced, it is governed by <b>Section 65B(4) of the Indian Evidence Act, 1872</b> — now <b>Section 63(4) of the Bharatiya Sakshya Adhiniyam (BSA), 2023</b> (effective 1 July 2024).<br>' +
         '• <b>Landmark Supreme Court Cases:</b> In <em>Anvar P.V. v. P.K. Basheer</em> (2014) and <em>Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal</em> (2020), the Supreme Court overruled <em>Shafhi Mohammad</em> (2018) and settled that a <b>Section 65B(4) certificate is strictly mandatory</b> for secondary electronic records. Note also that under <b>Section 63 BSA 2023</b>, the certificate now includes a specific schedule/part to be signed by the <b>Forensic Expert</b> alongside the person in charge of the device and explicitly requires recording the <b>cryptographic hash value (e.g., SHA-256)</b>!</div>'
    },
    {
      h: 'Order of volatility & Live vs Dead acquisition',
      b: '<p>Per <b>IETF RFC 3227</b> (Guidelines for Evidence Collection and Archiving), always collect evidence from <b>most volatile to least volatile</b>:</p>' +
         '<div class="diagram"><div class="diag-title">RFC 3227 Order of Volatility (Most Ephemeral → Most Persistent)</div>' +
         '<div class="flow-row">' +
         '<div class="flow-step"><b>1. CPU Registers &amp; Cache</b><small>Nanoseconds</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>2. RAM, Routing, ARP, Process Table</b><small>Lost on power-off</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>3. Temp File Systems / Swap</b><small>Lost on reboot</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>4. Hard Disk / SSD (Non-volatile)</b><small>Months–Years</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>5. Remote Logs &amp; Archival Media</b><small>Tape / Optical / Cloud</small></div>' +
         '</div></div>' +
         '<div class="example"><b>🔬 Forensic Scene Walkthrough — Live Triage (Powered-On Laptop) vs Dead Acquisition:</b><br>' +
         '<b>Scenario:</b> You raid a suspect\'s room and find a Windows 11 laptop powered ON with the desktop unlocked. Should you pull the power plug?<br>' +
         '• <b>Why you MUST NOT pull the plug immediately:</b> If the drive is encrypted with <b>BitLocker</b>, <b>FileVault</b>, or <b>VeraCrypt</b>, pulling the power cord destroys the plaintext Full Volume Encryption Key (FVEK) sitting in RAM, turning the hard drive into unbreakable ciphertext! You also lose fileless malware, active TCP/IP sockets (`netstat -abno`), clipboard text, and decrypted chat sessions.<br>' +
         '• <b>Step-by-step Live Triage:</b> (1) Photograph the screen; (2) Insert a clean forensic USB holding statically compiled trusted binaries; (3) Dump physical RAM first using <code>WinPmem</code>, <code>DumpIt</code>, or <code>FTK Imager Lite</code>; (4) Check disk encryption status (`manage-bde -status`); if encrypted and mounted, acquire a logical/decrypted volume image while live; (5) Document every command in the ACPO Principle 2/3 audit log!</div>'
    },
    {
      h: 'Cryptographic Hashing vs Fuzzy Hashing (SSDEEP)',
      b: '<div class="analogy"><b>💡 Analogy — Cryptographic Hash vs Fuzzy Hash:</b> A <b>Cryptographic Hash (SHA-256)</b> is like a glass wax seal on an evidence bag: if a single grain of dust inside changes (1 bit flipped in a 2 TB drive), the seal shatters completely and produces an unrecognisably different string (<b>Avalanche Effect</b>). A <b>Fuzzy Hash / Context-Triggered Piecewise Hash (<code>ssdeep</code>)</b> is like a human facial composite sketch: if a malware author changes 5 lines of code in a virus or crops 2% of an illicit image, SHA-256 changes 100%, whereas <code>ssdeep</code> reports <b>"94% similarity match"</b>!</div>' +
         '<table>' +
         '<tr><th>Algorithm</th><th>Digest Bits</th><th>Hex Characters</th><th>Bytes</th><th>Forensic Status &amp; Use</th></tr>' +
         '<tr><td><b>MD5</b> (Message Digest 5)</td><td><b>128 bits</b></td><td><b>32 hex chars</b></td><td>16 B</td><td>Cryptographically collision-broken (Wang 2004); still widely logged alongside SHA-256 for legacy NSRL hash-set lookup and accidental bit-rot checks.</td></tr>' +
         '<tr><td><b>SHA-1</b> (Secure Hash Alg 1)</td><td><b>160 bits</b></td><td><b>40 hex chars</b></td><td>20 B</td><td>Chosen-prefix collision demonstrated (Google <em>SHAttered</em> PDF collision, 2017); deprecated for standalone security.</td></tr>' +
         '<tr><td><b>SHA-256</b> (SHA-2 family)</td><td><b>256 bits</b></td><td><b>64 hex chars</b></td><td>32 B</td><td><b>Current courtroom gold standard</b> (mandated in BSA 2023 s.63 certificate forms).</td></tr>' +
         '<tr><td><b>SHA-512</b> (SHA-2 family)</td><td><b>512 bits</b></td><td><b>128 hex chars</b></td><td>64 B</td><td>High-assurance hashing; used in macOS/Linux `/etc/shadow` password hashes (`$6$`).</td></tr>' +
         '<tr><td><b>ssdeep / TLSH</b> (Fuzzy)</td><td>Variable</td><td>Block-chunk signature</td><td>—</td><td><b>Piecewise similarity hashing:</b> detects polymorphic malware variants, modified documents, or partially overwritten fragments.</td></tr>' +
         '</table>' +
         '<ul>' +
         '<li><b>Three One-Way Security Properties:</b> (1) <b>Pre-image resistance (One-wayness):</b> given digest $H(M)$, infeasible to find message $M$; (2) <b>Second pre-image resistance (Weak collision resistance):</b> given a specific evidence file $M_1$, infeasible to craft a modified file $M_2 \\neq M_1$ with $H(M_1) = H(M_2)$; (3) <b>Collision resistance (Strong collision resistance / Birthday bound $2^{n/2}$):</b> infeasible to find <em>any</em> pair $(M_1, M_2)$ with $H(M_1) = H(M_2)$.</li>' +
         '<li><b>Hash Databases in Forensics:</b> <b>Known-Good (Whitelisting)</b> — the NIST <b>NSRL (National Software Reference Library)</b> contains hashes of millions of standard OS and application files so tools like Autopsy/EnCase can hide 200,000 normal Windows DLLs ("de-duplication / ignorable hash filtering"). <b>Known-Bad (Blacklisting)</b> — hashes of known malware, CSAM, or terror material flagged immediately upon ingestion.</li>' +
         '</ul>'
    },
    {
      h: 'Acquisition, Write-Blockers, HPA/DCO & Forensic Image Formats',
      b: '<p>A <b>Write-Blocker</b> intercepts storage bus commands (SATA, NVMe, USB, SAS) between the suspect drive and the forensic workstation, allowing `READ` commands while blocking or spoofing any `WRITE` command so the disk\'s sectors and metadata remain 100% untouched. <b>Hardware write-blockers</b> (Tableau, WiebeTech) are preferred over software registry write-blockers because they are OS-independent and immune to host OS driver bugs.</p>' +
         '<table>' +
         '<tr><th>Image Format</th><th>Extensions</th><th>Metadata &amp; Compression</th><th>Integrity Verification</th></tr>' +
         '<tr><td><b>Raw / dd</b></td><td><code>.dd, .raw, .img, .001</code></td><td><b>None</b> — pure 1:1 sector stream; image size equals exact source disk capacity.</td><td>Requires external `.txt` hash log (`md5sum` / `sha256sum`).</td></tr>' +
         '<tr><td><b>EnCase EWF</b></td><td><code>.E01, .E02 …</code> (or `.Ex01`)</td><td>Header stores Case #, Examiner, Notes, Timestamp; supports <b>zlib compression</b> and split segments.</td><td>Internal <b>32-bit CRC checksum every 64 sectors (32 KB block)</b> + overall MD5/SHA-1 footer!</td></tr>' +
         '<tr><td><b>AFF / AFF4</b></td><td><code>.aff, .afd, .aff4</code></td><td>Open-source (Simson Garfinkel); extensible key-value metadata, zlib/LZMA compression, non-vendor-locked.</td><td>Built-in per-page SHA-256 / MD5 signatures.</td></tr>' +
         '<tr><td><b>SMART</b></td><td><code>.s01</code></td><td>ASR Data Linux forensic format; segmented with metadata.</td><td>Internal CRC and hash verification.</td></tr>' +
         '</table>' +
         '<div class="clarity"><b>⚡ Concept Clarity — Hidden Disk Areas: HPA (Host Protected Area) &amp; DCO (Device Configuration Overlay):</b><br>' +
         'At the end of a hard drive, ATA firmware commands (`SET MAX ADDRESS` for <b>HPA</b>; `DEVICE CONFIGURATION SET` for <b>DCO</b>) can tell the drive controller to report a smaller sector count to the OS BIOS than physically exists. Ordinary OS tools cannot see past the fake limit! A suspect can hide gigabytes of contraband inside the HPA/DCO. Forensic tools (`hdparm -N`, `FTK Imager`, hardware imagers) detect the discrepancy between native maximum LBA and reported LBA and temporarily lift the HPA/DCO to image the entire physical disk.</div>'
    },
    {
      h: 'File signatures (Magic Bytes) vs extensions & File Carving',
      b: '<p>Operating systems like Windows use the <b>filename extension</b> (`.jpg`, `.pdf`, `.docx`) to decide which icon to display and which program to launch. However, a file\'s <em>true format</em> is determined by its binary <b>File Signature (Magic Bytes)</b> at byte offset 0 (header) and optionally at the end (footer/trailer). Renaming `ransomware.exe` to `invoice.pdf` triggers a <b>Signature/Extension Mismatch</b> alert in every forensic suite.</p>' +
         '<table>' +
         '<tr><th>File Format</th><th>Header Magic Bytes (Hex)</th><th>ASCII</th><th>Footer / Trailer (Hex) &amp; Exam Notes</th></tr>' +
         '<tr><td><b>JPEG / JFIF / Exif</b></td><td><code>FF D8 FF</code> (e.g. `FF D8 FF E0` or `E1`)</td><td><code>ÿØÿ</code></td><td>Footer: <b><code>FF D9</code></b> (End of Image).</td></tr>' +
         '<tr><td><b>PNG</b></td><td><code>89 50 4E 47 0D 0A 1A 0A</code></td><td><code>.PNG....</code></td><td>Footer: <code>49 45 4E 44 AE 42 60 82</code> (`IEND`).</td></tr>' +
         '<tr><td><b>GIF</b></td><td><code>47 49 46 38 37 61</code> or <code>39 61</code></td><td><code>GIF87a</code> / <code>GIF89a</code></td><td>Footer: <code>00 3B</code>.</td></tr>' +
         '<tr><td><b>PDF</b></td><td><code>25 50 44 46 2D</code></td><td><code>%PDF-</code></td><td>Footer: <code>25 25 45 4F 46</code> (<code>%%EOF</code>).</td></tr>' +
         '<tr><td><b>ZIP / DOCX / XLSX / PPTX / APK / JAR</b></td><td><code>50 4B 03 04</code></td><td><code>PK..</code></td><td>End of Central Dir: <code>50 4B 05 06</code>. <b>All Office 2007+ XML &amp; Android APKs are ZIP containers!</b></td></tr>' +
         '<tr><td><b>Legacy MS Office (.doc/.xls/.ppt)</b></td><td><code>D0 CF 11 E0 A1 B1 1A E1</code></td><td>(OLE2 / Compound File)</td><td>Spell it as <em>"DOCFILE0"</em> in hex!</td></tr>' +
         '<tr><td><b>RAR Archive</b></td><td><code>52 61 72 21 1A 07</code></td><td><code>Rar!..</code></td><td>RAR v4 / v5 archive.</td></tr>' +
         '<tr><td><b>Windows PE (.exe, .dll, .sys)</b></td><td><code>4D 5A</code> (at offset 0) + <code>50 45 00 00</code></td><td><code>MZ</code> … <code>PE..</code></td><td>`MZ` is named after MS-DOS architect Mark Zbikowski.</td></tr>' +
         '<tr><td><b>Linux ELF Binary</b></td><td><code>7F 45 4C 46</code></td><td><code>.ELF</code></td><td>Linux/Android native executable or `.so` library.</td></tr>' +
         '<tr><td><b>SQLite 3 Database</b></td><td><code>53 51 4C 69 74 65 20 66 6F 72 6D 61 74 20 33 00</code></td><td><code>SQLite format 3.</code></td><td>100-byte header; page size at offset 16 (2 bytes Big-Endian).</td></tr>' +
         '</table>' +
         '<div class="example"><b>🔬 Worked Walkthrough — How File Carving (`Scalpel`, `Foremost`, `PhotoRec`) Works on Raw Hex:</b><br>' +
         'Suppose a suspect formatted a USB drive, destroying the FAT/MFT directory. You scan unallocated sectors and find:<br>' +
         '• Sector 500, Offset <code>0x00</code>: <code>FF D8 FF E1 ... [Exif metadata + compressed image bytes] ...</code><br>' +
         '• Sector 518, Offset <code>0x01A4</code>: <code>... A2 8F FF D9 00 00 00 00</code><br>' +
         'A file carver spots the JPEG start-of-image header <b><code>FF D8 FF</code></b> at Sector 500 and extracts every contiguous byte up to and including the end-of-image footer <b><code>FF D9</code></b> at Sector 518 into `carved_001.jpg`! Notice that carving recovers the <b>full image content and internal EXIF metadata</b>, but it <b> CANNOT recover the original filename (`holiday.jpg`) or NTFS/FAT file-system timestamps</b> because those lived in the destroyed directory/MFT, not inside the file\'s data clusters!</div>'
    },
    {
      h: 'Deleted files, Partition recovery (MBR vs GPT) & SSD TRIM',
      b: '<div class="vs-grid">' +
         '<div class="vs-card"><h4>MBR (Master Boot Record — Legacy BIOS)</h4><p>• Lives at <b>Logical Sector 0 (LBA 0)</b> (512 bytes total).<br>• Contains 446 bytes of bootstrap code + <b>four 16-byte primary partition table entries</b> (64 bytes) + <b>2-byte boot signature <code>55 AA</code></b>.<br>• Supports max <b>4 primary partitions</b> (or 3 primary + 1 extended) and max disk size of <b>2 TB</b> ($2^{32} \\times 512\\text{ B}$).<br>• Single point of failure — if LBA 0 is overwritten, the partition table is lost (must scan for VBRs with `TestDisk`).</p></div>' +
         '<div class="vs-card"><h4>GPT (GUID Partition Table — UEFI)</h4><p>• Starts with a <b>Protective MBR at LBA 0</b>, followed by Primary GPT Header at LBA 1 and Partition Entries at LBA 2–33.<br>• Supports <b>128 partitions by default</b> on Windows and 64-bit LBA (up to <b>9.4 ZB</b>).<br>• <b>Forensic bonus:</b> automatically maintains a <b>Backup GPT Header and Partition Table at the very end of the disk</b>, allowing instant recovery if the primary table is wiped!</p></div>' +
         '</div>' +
         '<p><b>What happens under the hood when a file is deleted:</b></p>' +
         '<ul>' +
         '<li><b>On FAT32:</b> The first byte of the 32-byte directory entry is overwritten with <b><code>0xE5</code></b>, and its cluster entries in the FAT are zeroed out. The remaining 10 characters of the 8.3 filename, the starting cluster pointer, file size, and the data clusters themselves remain untouched until overwritten.</li>' +
         '<li><b>On NTFS:</b> The file\'s 1024-byte <code>$MFT</code> record header flag changes from <code>0x01</code> (In-Use File) to <b><code>0x00</code> (Deleted File)</b> (or <code>0x03</code> In-Use Directory $\\to$ <code>0x02</code> Deleted Directory), and its clusters are marked `0` in <code>$Bitmap</code>. All attributes (`$SI`, `$FN`, data runs) stay inside the MFT slot until that slot is reused!</li>' +
         '<li><b>Windows Recycle Bin Forensics:</b> Deleting via Explorer moves the file to <code>C:\\$Recycle.Bin\\&lt;User-SID&gt;\\</code> and splits it into two files sharing a 6-character random ID: <b><code>$Ixxxxxx.ext</code></b> (the <b>Index/Metadata file</b> containing the <em>original full file path, file size in bytes, and 64-bit deletion FILETIME</em>) and <b><code>$Rxxxxxx.ext</code></b> (the <b>Raw original data</b>). Look up the folder\'s SID (e.g., `S-1-5-21-...-1001`) in the `SAM`/`SOFTWARE` hive to prove exactly which user account deleted the file! (Note: Windows XP used `RECYCLER` with a single `INFO2` metadata file.)</li>' +
         '</ul>' +
         '<div class="tip"><b>⚠️ Why SSDs Break Traditional Deleted-File Recovery (TRIM &amp; Wear-Levelling):</b> On a mechanical HDD, deleted clusters sit unchanged until overwritten. On a modern <b>Solid State Drive (SSD)</b>, because NAND flash blocks cannot be overwritten without a slow erase cycle first, the OS sends the <b>ATA `TRIM` (or NVMe `Deallocate`) command</b> immediately upon file deletion. The SSD\'s internal Garbage Collection then erases those blocks and returns all zeros (`0x00`) whenever a forensic tool reads the unallocated sectors — even through a hardware write-blocker!</div>'
    },
    {
      h: 'Windows Artefacts Deep-Dive: Registry, Event Logs, MFT, Execution & USB Tracking',
      b: '<p>Windows is the most heavily tested OS in Paper IV Unit III. Memorise these core forensic locations:</p>' +
         '<table>' +
         '<tr><th>Artefact</th><th>On-Disk Location</th><th>What It Proves in an Investigation</th></tr>' +
         '<tr><td><b>System Registry Hives</b></td><td><code>C:\\Windows\\System32\\config\\</code><br>(<code>SAM, SYSTEM, SOFTWARE, SECURITY, DEFAULT</code>)</td><td>• <code>SAM</code>: Local user accounts, RIDs (500 = built-in Admin, 1000+ = standard users), NTLM password hashes, login counts.<br>• <code>SYSTEM</code>: ComputerName, TimeZoneInformation, <code>Select\\Current</code> control set, <b><code>Enum\\USBSTOR</code> &amp; <code>MountedDevices</code></b>.<br>• <code>SOFTWARE</code>: Installed programs, OS version, Wi-Fi profile names (`NetworkList`), autostart `Run`/`RunOnce` persistence keys.</td></tr>' +
         '<tr><td><b>User Registry Hives</b></td><td><code>C:\\Users\\&lt;user&gt;\\NTUSER.DAT</code> &amp;<br><code>AppData\\Local\\Microsoft\\Windows\\UsrClass.dat</code></td><td>• <code>NTUSER.DAT</code>: `RecentDocs`, `TypedPaths`, `WordWheelQuery` (Explorer search terms), `UserAssist` (ROT-13 encoded GUI program launches &amp; run counts!), `MountPoints2`.<br>• <code>UsrClass.dat</code> + `NTUSER.DAT`: <b>Shellbags (`BagMRU`)</b> — proves a user browsed a folder in Explorer <em>even after that folder or USB drive was deleted/unplugged</em>!</td></tr>' +
         '<tr><td><b>Prefetch Files</b></td><td><code>C:\\Windows\\Prefetch\\&lt;EXE&gt;-&lt;HASH&gt;.pf</code></td><td>Proves <b>program execution</b>: records executable name, 8-char path hash, <b>total run count</b>, <b>last 8 execution timestamps</b>, and files/DLLs referenced during the first 10 seconds of launch.</td></tr>' +
         '<tr><td><b>Link Files (`.lnk`) &amp; Jump Lists</b></td><td><code>AppData\\Roaming\\Microsoft\\Windows\\Recent\\</code></td><td>Created automatically when a user opens a data file: records target\'s original path, <b>Volume Serial Number</b>, NetBIOS name, MAC address, and target MACB timestamps even if the file was opened from a removable drive.</td></tr>' +
         '<tr><td><b>Shimcache &amp; Amcache</b></td><td><code>SYSTEM</code> hive (`AppCompatCache`) &amp; <code>Amcache.hve</code></td><td>Tracks executables present/run on the system; <b>`Amcache.hve` additionally stores the SHA-1 hash of the executable</b>!</td></tr>' +
         '<tr><td><b>NTFS Master File Table &amp; Journals</b></td><td><code>$MFT</code>, <code>$LogFile</code>, <code>$UsnJrnl:$J</code></td><td>• <code>$MFT</code>: 1024-byte records with <code>$STANDARD_INFORMATION</code> vs <code>$FILE_NAME</code> timestamps.<br>• <code>$UsnJrnl</code> (Update Sequence Number Change Journal): high-level log recording every file creation, rename, modification, and deletion reason code.</td></tr>' +
         '</table>' +
         '<p><b>High-Yield Windows Event Log IDs (<code>C:\\Windows\\System32\\winevt\\Logs\\*.evtx</code>):</b></p>' +
         '<ul>' +
         '<li><b>Security.evtx:</b> <b><code>4624</code></b> = Successful Logon (check <b>Logon Type</b>: <code>Type 2</code> = Interactive local keyboard, <code>Type 3</code> = Network/SMB share, <code>Type 7</code> = Unlock screen, <code>Type 10</code> = RemoteInteractive / <b>RDP Remote Desktop</b>); <b><code>4625</code></b> = Failed Logon (brute force); <b><code>4634 / 4647</code></b> = Logoff; <b><code>4672</code></b> = Special Privileges assigned (Admin logon); <b><code>4720</code></b> = User account created; <b><code>1102</code></b> = <b>Security Audit Log Cleared</b> (smoking-gun anti-forensics!).</li>' +
         '<li><b>System.evtx:</b> <b><code>6005</code></b> = Event Log service started (boot); <b><code>6006</code></b> = Clean shutdown; <b><code>6008</code></b> = Unexpected/dirty shutdown; <b><code>7045</code></b> = <b>New Windows Service installed</b> (classic malware/ransomware persistence); <b><code>104</code></b> = System log cleared.</li>' +
         '</ul>' +
         '<div class="example"><b>🔬 Forensic Case Walkthrough — Proving USB Data Exfiltration in 5 Steps:</b><br>' +
         'An employee is accused of plugging in a personal SanDisk USB drive and copying `SecretBid.xlsx`. How do you prove every link of the chain?<br>' +
         '1. <b>Device Make/Model/Serial:</b> Check `SYSTEM\\CurrentControlSet\\Enum\\USBSTOR` $\\Rightarrow$ reveals Vendor (`SanDisk`), Product (`Cruzer_Blade`), and unique hardware Serial Number.<br>' +
         '2. <b>Drive Letter &amp; Volume GUID:</b> Cross-reference the serial number in `SYSTEM\\MountedDevices` $\\Rightarrow$ maps to Drive `E:\\` and a Volume GUID.<br>' +
         '3. <b>Which User Account Used It:</b> Check whether that Volume GUID exists inside `NTUSER.DAT\\...\\MountPoints2` of `Users\\rahul` $\\Rightarrow$ proves user `rahul` mounted the USB!<br>' +
         '4. <b>First &amp; Last Connection Times:</b> Check `C:\\Windows\\inf\\setupapi.dev.log` (first driver install timestamp) and Registry key last-write timestamps / Event Logs (`Microsoft-Windows-DriverFrameworks-UserMode/Operational` Event IDs 2003/2100).<br>' +
         '5. <b>What Files/Folders Were Opened on `E:\\`:</b> Parse `rahul`\'s <b>`.lnk` shortcut files</b>, <b>Jump Lists</b>, and <b>Shellbags (`UsrClass.dat`)</b> $\\Rightarrow$ shows `E:\\Confidential\\SecretBid.xlsx` was opened at 18:42 IST!</div>'
    },
    {
      h: 'Memory Forensics, Hibernation, Pagefile & Crash Dump Analysis',
      b: '<p>Three special Windows system files on the root of `C:\\` preserve volatile memory contents on non-volatile disk:</p>' +
         '<div class="vs-grid">' +
         '<div class="vs-card"><h4>1. <code>hiberfil.sys</code> (Hibernation File)</h4><p>When a laptop hibernates (ACPI state S4), Windows compresses and writes the <b>entire contents of physical RAM</b> into `C:\\hiberfil.sys` so it can resume on next boot. Forensic tools (`Volatility`, `Hibernation Recon`) decompress `hiberfil.sys` into a full raw memory image containing running processes, network sockets, and encryption keys from the time of hibernation.</p></div>' +
         '<div class="vs-card"><h4>2. <code>pagefile.sys</code> &amp; <code>swapfile.sys</code></h4><p>Backing store for virtual memory demand paging (`swapfile.sys` pages UWP/Metro apps). Unstructured collection of 4 KB pages evicted from RAM; carved using strings/YARA/bulk_extractor to recover fragments of decrypted documents, URLs, emails, and passwords.</p></div>' +
         '</div>' +
         '<p><b>3. Windows Crash Dumps (BSOD / Stop Error Dumps):</b> Written automatically when the kernel crashes:</p>' +
         '<ul>' +
         '<li><b>Complete Memory Dump (<code>%SystemRoot%\\MEMORY.DMP</code>):</b> captures 100% of physical RAM (user + kernel mode).</li>' +
         '<li><b>Kernel Memory Dump (<code>%SystemRoot%\\MEMORY.DMP</code>):</b> captures only Ring 0 kernel memory (HAL, kernel, loaded `.sys` drivers, kernel page tables) — omits user-mode process space; fast and ideal for catching kernel rootkits.</li>' +
         '<li><b>Small Memory Dump / Minidump (<code>%SystemRoot%\\Minidump\\MiniMMDDYY-01.dmp</code>):</b> 64 KB–256 KB summary recording the Stop error code, faulting instruction, EPROCESS pointer of current process, and list of loaded drivers. Analysed using Microsoft <b>WinDbg (`!analyze -v`)</b>.</li>' +
         '</ul>' +
         '<p><b>Memory Forensics with Volatility Framework (Must-Know Plugins):</b></p>' +
         '<ul>' +
         '<li><b>Process Discovery &amp; Hidden Rootkit Detection:</b> <code>pslist</code> walks the doubly-linked list of `EPROCESS` structures (`ActiveProcessLinks`). If a Direct Kernel Object Manipulation (<b>DKOM</b>) rootkit unlinks its malicious process from that list to hide from Task Manager, <b><code>psscan</code></b> catches it by scanning raw physical memory for pool tags (`Proc`)! Comparing `pslist` vs `psscan` (or running `psxview`) immediately exposes hidden rootkit processes.</li>' +
         '<li><b>Process Tree &amp; Command Lines:</b> <code>pstree</code> (parent-child hierarchy — e.g., catching `winword.exe` spawning `powershell.exe`), <code>cmdline</code> / <code>cmdscan</code> / <code>consoles</code>.</li>' +
         '<li><b>Network &amp; Code Injection:</b> <code>netscan</code> (active and recently closed TCP/UDP sockets + owning PIDs), <code>malfind</code> (detects injected shellcode / hollowing in `PAGE_EXECUTE_READWRITE` memory regions), <code>dlllist</code>, <code>handles</code>, <code>hashdump</code> (extracts SAM password hashes straight from RAM).</li>' +
         '</ul>'
    },
    {
      h: 'Password Cracking, Encryption & Anti-Forensics (Steganography, Timestomping, NIST 800-88)',
      b: '<p><b>Password Recovery &amp; Attack Techniques:</b></p>' +
         '<ul>' +
         '<li><b>Dictionary Attack:</b> tests words from a curated wordlist (`rockyou.txt`) plus rule-based mutations (`P@ssw0rd123`). Fast, defeats human-chosen passwords.</li>' +
         '<li><b>Brute-Force Attack:</b> exhaustively tests every possible character combination in a keyspace of size $C^L$ (where $C$ is alphabet size and $L$ is length). Guaranteed to succeed eventually, but time grows exponentially with length $L$.</li>' +
         '<li><b>Rainbow Table Attack (Time-Memory Trade-Off):</b> precomputes giant chains of plaintext-to-hash pairs so a captured unsalted hash (like legacy Windows LM/NTLM) can be looked up in seconds. <b>Completely defeated by Password Salting:</b> appending a unique random salt to each user\'s password before hashing ($H(\\text{password} \\parallel \\text{salt})$) means identical passwords produce completely different hashes and precomputed rainbow tables become useless! Modern systems also use slow key-stretching KDFs (<b>PBKDF2, bcrypt, scrypt, Argon2</b>).</li>' +
         '</ul>' +
         '<p><b>Disk vs File Encryption:</b> <b>BitLocker</b> (Windows full-volume, uses TPM 2.0 + Recovery Key), <b>FileVault 2</b> (macOS full-volume XTS-AES), <b>LUKS / dm-crypt</b> (Linux full-volume), <b>VeraCrypt</b> (containers &amp; <b>hidden decoy volumes</b> for plausible deniability), and <b>EFS (Encrypting File System)</b> (Windows NTFS per-file/folder encryption tied to the user\'s X.509 certificate). Note: when an EFS file is copied to a FAT32 USB drive, it loses its encryption wrapper unless backed up with `cipher /x`!</p>' +
         '<p><b>Anti-Forensics Taxonomy &amp; How Analysts Defeat Each Technique:</b></p>' +
         '<table>' +
         '<tr><th>Anti-Forensic Technique</th><th>How the Suspect Hides/Destroys Data</th><th>How the Forensic Examiner Detects/Counters It</th></tr>' +
         '<tr><td><b>1. Timestomping</b></td><td>Uses `timestomp.exe` or PowerShell to backdate a malicious file\'s Modified/Created times so it blends in with `System32` DLLs.</td><td>User-mode APIs only alter NTFS <b><code>$STANDARD_INFORMATION ($SI)</code></b> timestamps; only the Windows kernel updates <b><code>$FILE_NAME ($FN)</code></b> timestamps in the `$MFT`! If `$SI` Created is 2019 while `$FN` Created is 2026 (or if nanosecond fractions in `$SI` are all `.0000000`), timestomping is proven!</td></tr>' +
         '<tr><td><b>2. NTFS Alternate Data Streams (ADS)</b></td><td>Attaches a hidden payload to an innocent file via <code>type malware.exe &gt; readme.txt:hidden.exe</code>. Explorer shows `readme.txt`\'s size unchanged!</td><td>Every stream has a separate <b><code>$DATA</code> attribute</b> inside the file\'s `$MFT` record; visible via `dir /r`, PowerShell `Get-Item -Stream *`, Autopsy, or FTK Imager.</td></tr>' +
         '<tr><td><b>3. Steganography (LSB)</b></td><td>Embeds secret bits into the <b>Least Significant Bit (LSB)</b> of RGB pixel bytes or audio samples (`Steghide`, `OpenStego`).</td><td>Changing the LSB alters pixel intensity by at most $\\pm 1/255$ (invisible to the eye), but changes the carrier file\'s hash and leaves statistical anomalies detected by <b>Steganalysis (Chi-square attack, RS analysis, histogram pairs)</b>.</td></tr>' +
         '<tr><td><b>4. Data Destruction / Sanitization (NIST SP 800-88)</b></td><td>Attempts to erase storage media permanently.</td><td>Classified by <b>NIST SP 800-88 Rev 1</b> into three strict tiers:<br>• <b>Clear:</b> logical overwriting of all user-addressable sectors (`dd if=/dev/zero`, `sdelete`).<br>• <b>Purge:</b> firmware-level `Secure Erase`, cryptographic erase (destroying the FDE key), or <b>degaussing</b> (magnetic HDDs/tapes only — <em>degaussing has ZERO effect on SSDs or optical media!</em>).<br>• <b>Destroy:</b> physical shredding, incineration, disintegration, or smelting.</td></tr>' +
         '</table>'
    },
    {
      h: 'Evidence collection in Linux and macOS & Computer Forensic Tools',
      b: '<div class="vs-grid">' +
         '<div class="vs-card"><h4>Linux Forensics</h4><p>• <b>Acquisition:</b> `dd`, `dcfldd`, `dc3dd` (on-the-fly hashing + split output), `LiME` (Linux Memory Extractor kernel module for RAM).<br>• <b>Live Volatile State:</b> `/proc/&lt;pid&gt;/exe` (even if the binary on disk was deleted, `/proc/&lt;pid&gt;/exe` can still copy the live binary out of RAM!), `/proc/&lt;pid&gt;/fd`, `/proc/net/tcp`.<br>• <b>Logs &amp; Persistence:</b> `/var/log/auth.log` or `/var/log/secure` (SSH/sudo logins), `/var/log/wtmp` &amp; `btmp` (binary login logs read with `last` / `lastb`), `~/.bash_history`, `/etc/passwd` &amp; `/etc/shadow`, `/etc/crontab`, `systemd` unit files.</p></div>' +
         '<div class="vs-card"><h4>macOS Forensics</h4><p>• <b>File System &amp; Encryption:</b> <b>APFS</b> (Copy-on-Write, snapshots) + <b>FileVault 2</b>.<br>• <b>Configuration (`Plist` files):</b> Binary or XML Property Lists (`~/Library/Preferences/*.plist`, parsed with `plutil` or `plistutil`) — macOS equivalent of the Windows Registry.<br>• <b>Key Artefacts:</b> <b>`.DS_Store`</b> (proves Finder folder viewing &amp; icon positions), <b>QuarantineEventsV2</b> SQLite DB (tracks every file downloaded from the internet with source URL!), <b>FSEvents</b> (`.fseventsd` file-system change journal), <b>Unified Logs</b> (`.tracev3`), <b>Keychain</b>, and <b>Time Machine</b> snapshots.</p></div>' +
         '</div>' +
         '<p><b>Master Computer Forensic Tools Classification:</b></p>' +
         '<ul>' +
         '<li><b>Full Commercial Suites:</b> OpenText <b>EnCase</b>, Exterro <b>FTK (Forensic Toolkit)</b>, <b>X-Ways Forensics</b>, Magnet <b>AXIOM</b>, Belkasoft X.</li>' +
         '<li><b>Open-Source Disk Analysis Suite:</b> <b>The Sleuth Kit (TSK)</b> (CLI tools like `mmls`, `fls`, `icat`, `istat` by Brian Carrier) + <b>Autopsy</b> (GUI front-end).</li>' +
         '<li><b>Imaging &amp; Triage:</b> <b>FTK Imager</b>, <b>Guymager</b>, `dd` / `dcfldd` / `dc3dd`, <b>KAPE</b> (Kroll Artifact Parser and Extractor).</li>' +
         '<li><b>Memory Forensics:</b> <b>Volatility</b> (Volatility 2 &amp; 3), Rekall, MemProcFS, WinPmem, LiME.</li>' +
         '<li><b>Partition &amp; File Carving:</b> <b>TestDisk</b> (partition/boot sector repair) vs <b>PhotoRec</b>, <b>Scalpel</b>, <b>Foremost</b>, <b>bulk_extractor</b> (raw carving).</li>' +
         '<li><b>Registry &amp; Timeline Tools:</b> Eric Zimmerman\'s Tools (`Registry Explorer`, `MFTECmd`, `PECmd`, `EvtxECmd`), `RegRipper`, `Plaso / log2timeline`.</li>' +
         '</ul>'
    }
  ],

  questions: [
    { q: 'The digest produced by the SHA-1 algorithm is',
      o: ['128 bits', '160 bits', '256 bits', '512 bits'], a: 1,
      e: '<p><b>SHA-1 produces 160 bits</b>, written as 40 hexadecimal characters. MD5 is 128 bits (32 hex chars) and SHA-256 is 256 bits (64 hex chars).</p><p>A fast field check: count the hex characters and divide by 2 to get bytes, or multiply by 4 to get bits.</p>' },

    { q: 'The primary purpose of a write-blocker in digital forensics is to',
      o: ['Encrypt the forensic image as it is created',
          'Prevent any modification of the evidence drive while it is read',
          'Increase the speed of the imaging process',
          'Detect and repair bad sectors on the suspect drive'], a: 1,
      e: '<p>A write-blocker allows read commands through and blocks writes, preserving the evidence drive unaltered and satisfying <b>ACPO Principle 1</b>.</p><p>It is needed because simply attaching a disk to a running Windows system will update timestamps and can write recovery or indexing data — changing the very hash you are relying on.</p>' },

    { q: 'A file named report.pdf is found to begin with the bytes FF D8 FF. This indicates that the file is actually',
      o: ['A corrupted PDF', 'A JPEG image', 'A ZIP archive', 'An executable'], a: 1,
      e: '<p><b>FF D8 FF is the JPEG signature.</b> A genuine PDF starts with <code>25 50 44 46</code> ("%PDF").</p><p>This is an <b>extension/signature mismatch</b> — listed in the syllabus under anti-forensics — and is deliberate concealment rather than corruption. Forensic tools flag such mismatches automatically.</p>' },

    { q: 'Rainbow table attacks are effectively defeated by',
      o: ['Increasing the hash output length', 'Adding a unique random salt to each password before hashing',
          'Using MD5 instead of SHA-1', 'Storing passwords in a separate database'], a: 1,
      e: '<p>A <b>salt</b> is a unique random value combined with each password before hashing. Because the attacker would need a separate precomputed table for every possible salt, precomputation becomes worthless.</p><p>Longer digests do not help — the table is indexed by password, not by digest size. This is why modern systems use salted, deliberately slow functions such as bcrypt, scrypt or Argon2.</p>' },

    { q: 'Which Windows file is essentially a compressed copy of RAM written to disk and can substitute for a memory dump?',
      o: ['pagefile.sys', 'hiberfil.sys', 'ntuser.dat', 'thumbs.db'], a: 1,
      e: '<p><b>hiberfil.sys</b> is written when the machine hibernates, capturing the whole of physical memory in compressed form. It can yield encryption keys, running processes and plaintext long after shutdown.</p><p><code>pagefile.sys</code> also contains memory-derived data but only pages that were <em>evicted</em>, and without the structure of a full dump. <code>ntuser.dat</code> is a registry hive; <code>thumbs.db</code> is an image thumbnail cache.</p>' },

    { q: 'File carving recovers files primarily by',
      o: ['Reading file system metadata from the MFT',
          'Locating header and footer signatures in unallocated space',
          'Restoring entries from the Recycle Bin',
          'Reconstructing the file allocation table'], a: 1,
      e: '<p><b>Carving works without file-system metadata</b>, scanning raw sectors for known headers and footers. That is exactly why it works after formatting or metadata destruction.</p><p>Its chief weakness is <b>fragmentation</b>: header-to-footer carving assumes contiguity, so a fragmented file is recovered corrupt. Options (a), (c) and (d) all depend on metadata that carving deliberately ignores.</p>' },

    { q: 'According to the order of volatility, which should be collected FIRST at a live scene?',
      o: ['Hard disk contents', 'Archival backup tapes', 'Contents of RAM and routing tables', 'Remote syslog data'], a: 2,
      e: '<p>Most volatile first. After CPU registers and cache, the next tier is <b>RAM together with routing tables, ARP cache and the process table</b> — all lost the instant power is removed.</p><p>This is why "pull the plug" is no longer taught as the default response: it destroys everything above disk level, including encryption keys held only in memory.</p>' },

    { q: 'The essential difference between steganography and cryptography is that steganography',
      o: ['Uses stronger keys', 'Conceals the existence of the message rather than its content',
          'Can only be applied to image files', 'Is computationally irreversible'], a: 1,
      e: '<p>Cryptography hides <b>meaning</b>: an observer sees ciphertext and knows a secret message exists. Steganography hides <b>existence</b>: the carrier looks like an ordinary photograph or audio file.</p><p>They are complementary and often combined — encrypt first, then embed. Steganography works in images, audio, video, network traffic and even document whitespace, so (c) is wrong.</p>' },

    { q: 'Which forensic image format is a bit-for-bit copy containing no embedded metadata or compression?',
      o: ['E01', 'AFF', 'raw (dd)', 'SMART'], a: 2,
      e: '<p><b>raw/dd</b> is a plain sector-for-sector copy — no header, no metadata, no compression, and therefore always the same size as the source.</p><p>E01, AFF and SMART all wrap the data with case metadata and integrity checks and support compression. Raw\'s advantage is universal compatibility; its disadvantage is that the hash and case details must be tracked separately.</p>' },

    { q: 'In Windows Security event logs, Event ID 4625 records',
      o: ['A successful account logon', 'A failed account logon', 'The audit log being cleared', 'An account logoff'], a: 1,
      e: '<p><b>4625 = failed logon</b>; 4624 = successful logon; 4634 = logoff; <b>1102 = the audit log was cleared</b>, which is itself strong evidence of anti-forensic activity.</p><p>A run of 4625 events followed by a 4624 from the same source is the signature of a successful brute-force attack.</p>' },

    { q: 'A significant discrepancy between the $STANDARD_INFORMATION and $FILE_NAME timestamps of an NTFS file most strongly suggests',
      o: ['Disk corruption', 'Timestomping — deliberate manipulation of file times',
          'The file was compressed', 'The file was copied from a FAT32 volume'], a: 1,
      e: '<p>Common anti-forensic tools alter the <b>$STANDARD_INFORMATION</b> timestamps, which are what Explorer displays, but not the <b>$FILE_NAME</b> set held in the MFT. Comparing the two exposes <b>timestomping</b>.</p><p>This is why "MFT analysis" and "metadata analysis" appear as distinct syllabus items — the comparison is the technique.</p>' },

    { q: 'Under Indian law, the admissibility of electronic records was governed by which section of the Indian Evidence Act, 1872?',
      o: ['Section 45', 'Section 65B', 'Section 293', 'Section 27'], a: 1,
      e: '<p><b>Section 65B</b> governed electronic records and required an accompanying certificate. <em>Anvar P.V. v. P.K. Basheer</em> (2014) held the certificate mandatory, and <em>Arjun Panditrao Khotkar</em> (2020) settled the position after conflicting rulings.</p><p>Section 45 concerns expert opinion generally. Since 1 July 2024 the Evidence Act has been replaced by the <b>Bharatiya Sakshya Adhiniyam, 2023</b>, where the equivalent provision is <b>Section 63</b> — be ready for the question in either form.</p>' },

    { q: 'Which of the following is a hallmark of physical acquisition as opposed to logical acquisition?',
      o: ['It copies only files visible to the file system',
          'It captures unallocated space and slack space as well as live files',
          'It is always faster than logical acquisition',
          'It requires the device to be powered off'], a: 1,
      e: '<p><b>Physical acquisition</b> copies every sector, so deleted files, slack space and unallocated areas come with it. <b>Logical acquisition</b> copies only what the file system currently lists, and therefore misses deleted data entirely.</p><p>Physical imaging is generally slower, not faster, since it reads the whole medium regardless of how little is in use — so (c) inverts the truth.</p>' },

    { q: 'The avalanche effect in a cryptographic hash function means that',
      o: ['The digest length grows with input length',
          'Changing one bit of input changes approximately half the output bits',
          'Collisions become more likely as more data is hashed',
          'The function can be computed in parallel'], a: 1,
      e: '<p>The <b>avalanche effect</b> makes the output statistically unrelated to the input, so no partial information about the message leaks from its digest.</p><p>Forensically it is what makes hashing a reliable integrity check: any alteration, even a single bit in a multi-gigabyte image, produces a completely different digest rather than a similar one.</p>' },

    { q: 'When a file is deleted from a FAT file system, what actually happens to it?',
      o: ['The data clusters are immediately zero-filled',
          'The first byte of the filename in the directory entry is replaced with 0xE5 and the cluster chain is cleared',
          'The file is moved to a hidden system partition',
          'The file is compressed and re-written'], a: 1,
      e: '<p>FAT deletion replaces the <b>first byte of the filename with 0xE5</b> in the directory entry and clears the file\'s entry in the File Allocation Table. The remaining filename bytes and, crucially, the data in the clusters are left untouched until overwritten.</p><p>This is exactly why undelete tools can recover FAT files by scanning for entries starting with 0xE5 and rebuilding the original cluster chain — nothing about the content itself was erased.</p>' },

    { q: 'On an NTFS volume, deleting a file primarily changes',
      o: ['The $STANDARD_INFORMATION creation timestamp only',
          'The MFT entry\'s "in use" flag and the corresponding clusters in $Bitmap, both marked free',
          'The partition boot sector',
          'The file\'s hash value'], a: 1,
      e: '<p>NTFS deletion clears the "in use" bit on the file\'s <b>$MFT</b> record and frees the corresponding clusters in <b>$Bitmap</b>. The MFT record and the underlying data typically remain recoverable until something else is allocated over them.</p><p>This is the same principle as FAT deletion expressed in NTFS terms — "deletion" removes bookkeeping, not content, which is the foundation of nearly all undelete and carving techniques.</p>' },

    { q: 'On a BIOS/MBR-partitioned disk, the Master Boot Record is located at',
      o: ['The last sector of the disk', 'Logical sector 0', 'The first sector of the active partition', 'A fixed offset inside the $MFT'], a: 1,
      e: '<p>The <b>MBR sits at logical sector 0</b> of the disk and holds boot code plus a table of up to four primary partition entries.</p><p>A GPT disk instead begins with a protective MBR followed by the GUID Partition Table, which — unlike the single MBR copy — keeps a <b>backup copy at the end of the disk</b>, making GPT more resilient to partition-table corruption.</p>' },

    { q: 'Which pair of open-source tools is most accurately described as "TestDisk repairs partition tables and boot sectors, while ___ carves files directly from raw sectors by signature, ignoring the file system"?',
      o: ['EnCase', 'PhotoRec', 'Autopsy', 'Volatility'], a: 1,
      e: '<p><b>PhotoRec</b> is bundled with TestDisk but works purely by signature-based carving on raw sectors, so it keeps working even after a full reformat that would defeat TestDisk\'s file-system-aware repairs.</p><p>Autopsy is a case-management front end to The Sleuth Kit; Volatility is for memory analysis; EnCase is a commercial imaging/analysis suite — none of them is the carving counterpart to TestDisk.</p>' },

    { q: 'A Windows "small memory dump" (minidump) is normally written to',
      o: ['%SystemRoot%\\MEMORY.DMP', '%SystemRoot%\\Minidump\\', '%SystemRoot%\\System32\\config\\', 'The Recycle Bin'], a: 1,
      e: '<p>Minidumps are stored individually, one per crash, under <code>%SystemRoot%\\Minidump\\</code>. The <b>complete memory dump</b> (all of physical RAM) is instead written as the single file <code>%SystemRoot%\\MEMORY.DMP</code>.</p><p><code>System32\\config</code> holds the registry hives, not crash dumps — a common distractor pairing since both are system-critical Windows folders.</p>' },

    { q: 'Which type of Windows crash dump captures kernel-mode memory (drivers, kernel structures) but deliberately excludes user-mode process memory?',
      o: ['Complete memory dump', 'Kernel memory dump', 'Small memory dump', 'Live memory dump'], a: 1,
      e: '<p>A <b>kernel memory dump</b> is a deliberate middle ground: larger and more useful than a minidump, but smaller than a complete dump because it omits user-mode process memory entirely.</p><p>Forensically, a kernel dump is still enough to identify a malicious driver or kernel-mode rootkit, which is often the more relevant question after a suspicious crash than recovering an ordinary application\'s memory.</p>' },

    { q: 'On a Linux system, which location is the primary source of live/volatile information about running processes, open files and network sockets?',
      o: ['/var/log', '/etc/passwd', '/proc', '/boot'], a: 2,
      e: '<p><b>/proc</b> is a virtual, RAM-resident file system exposing per-process memory maps, open file descriptors and network state — the Linux analogue of live process/RAM collection on Windows.</p><p><code>/var/log</code> holds persistent (non-volatile) logs such as <code>syslog</code> and <code>auth.log</code>; <code>/etc/passwd</code> is the static user account list; <code>/boot</code> holds the kernel and bootloader files.</p>' },

    { q: 'Forensically hardened variants of the dd imaging command, such as dc3dd or dcfldd, primarily add which capability over plain dd?',
      o: ['Automatic decryption of the target volume', 'On-the-fly hashing and logging during acquisition', 'Compression of the output image', 'Write-blocking at the software level'], a: 1,
      e: '<p><b>dc3dd</b> and <b>dcfldd</b> extend plain <code>dd</code> with built-in progress reporting, <b>on-the-fly hashing</b> (e.g. MD5/SHA-256 computed as the image is written) and logging — giving the examiner an integrity record without a separate hashing pass.</p><p>Plain <code>dd</code> does none of this natively; an examiner using it must hash the source and the resulting image as separate steps.</p>' },

    { q: 'On macOS, application and system configuration data is predominantly stored in',
      o: ['Registry hives', 'plist (property list) files', 'INFO2 files', 'The MFT'], a: 1,
      e: '<p>macOS uses <b>plist files</b> (XML or binary property lists, typically under <code>~/Library/Preferences</code>) as its rough counterpart to the Windows registry.</p><p>Registry hives and the MFT are Windows/NTFS-specific; <code>INFO2</code> was the pre-Vista Windows Recycle Bin index file — none apply to macOS.</p>' },

    { q: 'FileVault, Apple\'s full-disk encryption for macOS, is most directly comparable to which Windows technology?',
      o: ['EFS (Encrypting File System)', 'BitLocker', 'Alternate Data Streams', 'VSS (Volume Shadow Copy)'], a: 1,
      e: '<p><b>FileVault</b> encrypts the entire startup volume, making it the macOS counterpart of <b>BitLocker</b>, not of EFS — EFS encrypts individual files/folders for a logged-in user rather than the whole disk.</p><p>Without the user\'s password or an escrowed recovery key, a powered-off FileVault- or BitLocker-encrypted disk yields only ciphertext to an examiner, which is why capturing keys from live RAM is prioritised whenever the machine is found running.</p>' },

    { q: 'Why is capturing RAM given priority when a suspect machine is found powered on and unlocked with a full-disk-encrypted volume mounted?',
      o: ['RAM contains a faster copy of all disk files', 'The encryption key typically exists in plaintext in memory only while the volume is mounted',
          'RAM acquisition does not require a write-blocker', 'Disk imaging is impossible on encrypted volumes'], a: 1,
      e: '<p>Full-disk encryption schemes such as BitLocker and FileVault hold the unlock key in <b>plaintext in RAM</b> while the volume is mounted and in use. Once the machine is powered off, that key is gone and the disk image becomes unreadable ciphertext without the passphrase or recovery key.</p><p>This is a direct application of the <b>order-of-volatility</b> principle from RFC 3227: RAM must be captured before shutdown precisely because some evidence — like an encryption key — exists nowhere else.</p>' },

    { q: 'One byte is equal to how many bits, and how many distinct values can it represent?',
      o: ['4 bits, 16 values', '8 bits, 256 values', '16 bits, 65536 values', '8 bits, 128 values'], a: 1,
      e: '<p>A <b>byte is 8 bits</b> and can represent <b>256</b> distinct values, expressed as 0–255 in decimal or <code>00</code>–<code>FF</code> in hexadecimal.</p><p>This is exactly why forensic tools display data in hex: two hex digits map onto one byte cleanly, whereas decimal does not divide evenly along byte boundaries — a convenience rather than a security property.</p>' },

    { q: 'Which tool is primarily used for analysing a captured RAM image (memory forensics) rather than for disk imaging or partition recovery?',
      o: ['FTK Imager', 'TestDisk', 'Volatility', 'dc3dd'], a: 2,
      e: '<p><b>Volatility</b> is the standard open-source framework for analysing RAM captures — extracting running processes, network connections, loaded drivers and injected code from a memory dump.</p><p>FTK Imager and dc3dd are acquisition tools (they can capture RAM but do not analyse it), and TestDisk operates on disk partitions, not memory — a distinction the syllabus draws by listing "memory forensics" separately from "acquisition."</p>' },

    { q: 'Autopsy, a widely taught digital forensics case-analysis platform, is best described as',
      o: ['A commercial, paid suite competing with EnCase', 'A free, open-source front end to The Sleuth Kit', 'A mobile-device extraction tool like Cellebrite UFED', 'A network packet-capture tool like Wireshark'], a: 1,
      e: '<p><b>Autopsy</b> is free and open source, built as a graphical front end to <b>The Sleuth Kit</b>, which is exactly why it is favoured in training environments and by resource-constrained agencies despite EnCase and FTK dominating paid casework.</p><p>It handles file-system and case analysis (timeline, keyword search, hash filtering), not packet capture or mobile extraction — those are the separate specialisations of Wireshark and Cellebrite UFED/MSAB XRY respectively.</p>' },

    { q: 'Under the Bharatiya Sakshya Adhiniyam (BSA), 2023 (which replaced the Indian Evidence Act, 1872 from 1 July 2024), which section governs the admissibility of electronic records and replaces the old Section 65B?',
      o: ['Section 63 of the BSA, 2023',
          'Section 45 of the BSA, 2023',
          'Section 61 of the BSA, 2023',
          'Section 106 of the BSA, 2023'], a: 0,
      e: '<p><b>Section 63 of the Bharatiya Sakshya Adhiniyam, 2023</b> directly replaces Section 65B of the Indian Evidence Act, 1872 for the admissibility of secondary electronic records, and its Schedule specifies a two-part certificate (Part A by the person in control of the device/system, Part B by the Expert) including the cryptographic hash value (e.g., SHA-256). (Section 61 BSA states that electronic records shall not be denied admissibility merely on the ground that they are electronic.)</p>' },

    { q: 'In Digital Forensics, what is the primary purpose of "fuzzy hashing" (Context-Triggered Piecewise Hashing, such as `ssdeep`) compared with SHA-256?',
      o: ['To detect near-identical or modified files (such as polymorphic malware variants or cropped images) by computing a percentage similarity score',
          'To encrypt forensic images faster than AES-256',
          'To replace SHA-256 in Section 65B/63 court certificates because it has zero collisions',
          'To compress unallocated space inside an E01 file'], a: 0,
      e: '<p>Standard cryptographic hashes like MD5 and SHA-256 exhibit the <b>avalanche effect</b> — changing a single byte changes ~50% of the bits, giving 0% similarity. <b>Fuzzy hashing (`ssdeep`, `TLSH`)</b> breaks a file into context-triggered piecewise chunks and hashes each chunk, allowing an investigator to measure <b>percentage homology/similarity</b> between two files even after minor edits.</p>' },

    { q: 'During intake of a seized workstation, an investigator uses the NIST NSRL (National Software Reference Library) hash database in Autopsy. What is the main purpose of matching against the NSRL?',
      o: ['Known-good filtering ("de-duplication / whitelisting") to ignore standard operating system and commercial application files so the analyst can focus on user-created and anomalous files',
          'Cracking Windows SAM NTLM user passwords via rainbow tables',
          'Recovering deleted partitions from a damaged GPT header',
          'Decrypting BitLocker volumes without the TPM key'], a: 0,
      e: '<p>The <b>NSRL</b> is a massive collection of cryptographic hashes of known, legitimate OS and commercial software files (`kernel32.dll`, `notepad.exe`, MS Office files). Filtering out NSRL matches ("known-good") eliminates 90%+ of irrelevant system files from review.</p>' },

    { q: 'A suspect uses the ATA command `SET MAX ADDRESS` to reserve 80 GB at the end of a 500 GB hard drive so that Windows Disk Management sees only a 420 GB disk. What is this hidden area called?',
      o: ['Host Protected Area (HPA)',
          'NTFS Alternate Data Stream (ADS)',
          'Volume Shadow Copy (VSS)',
          'Master File Table Slack'], a: 0,
      e: '<p>A <b>Host Protected Area (HPA)</b> (and its companion <b>Device Configuration Overlay, DCO</b>) is an ATA/SATA firmware area beyond the reported maximum LBA sector address that normal OS tools cannot see or mount. Forensic acquisition hardware and tools like `hdparm -N` check the native max LBA against the reported LBA to detect and image HPAs.</p>' },

    { q: 'While inspecting unallocated clusters in a hex editor, you find a file beginning with the hex bytes `50 4B 03 04` (`PK..`). Which of the following file types could this file legitimately be?',
      o: ['Any of `.zip`, `.docx`, `.xlsx`, `.pptx`, `.apk`, or `.jar`',
          'Only a plain `.zip` archive — never a Microsoft Office document',
          'A Windows Portable Executable (`.exe` or `.dll`)',
          'A legacy Office 97–2003 `.doc` or `.xls` compound document'], a: 0,
      e: '<p><code>50 4B 03 04</code> (`PK..`, named after Phil Katz, creator of PKZIP) is the magic header of the <b>ZIP container format</b>. Microsoft Office 2007+ OpenXML documents (`.docx`, `.xlsx`, `.pptx`), OpenDocument files (`.odt`), Java `.jar` files, and Android `.apk` packages are all ZIP archives containing XML/resources inside — so they all begin with <code>50 4B 03 04</code>! (Legacy `.doc`/`.xls` files begin with `D0 CF 11 E0`.)</p>' },

    { q: 'When a file is carved purely from unallocated space using header and footer signatures (e.g., `FF D8 FF` to `FF D9` for a JPEG), which piece of information is NOT stored inside the carved file itself and therefore CANNOT be recovered by pure carving alone?',
      o: ['The file\'s original directory filename and NTFS `$MFT` timestamps',
          'The camera make, model, and GPS coordinates stored in the JPEG\'s internal EXIF header',
          'The pixel width and height of the JPEG image',
          'The quantization tables used to compress the JPEG'], a: 0,
      e: '<p>A file\'s <b>filename</b>, parent folder path, ACL permissions, and file-system MACB timestamps live in the file system\'s metadata structures (the `$MFT` record or FAT directory entry), <b>not</b> inside the file\'s data clusters. Pure signature carving extracts only the raw data clusters between header and footer — so internal metadata like EXIF tags and image dimensions come along intact, while the external file-system filename is lost.</p>' },

    { q: 'In Windows 10/11, when a user deletes `C:\\Users\\Alice\\Desktop\\bribe.xlsx` by sending it to the Recycle Bin, what two files are created inside `C:\\$Recycle.Bin\\<SID>\\`?',
      o: ['`$Ixxxxxx.xlsx` (metadata holding original path, size, and deletion timestamp) and `$Rxxxxxx.xlsx` (the actual file data)',
          '`INFO2` and `thumbs.db`',
          '`$MFT` and `$Bitmap`',
          '`bribe.xlsx.bak` and `bribe.xlsx.lnk`'], a: 0,
      e: '<p>Since Windows Vista/7/10/11, `$Recycle.Bin` creates a pair for every recycled item:<br>• <b><code>$I&lt;6-char-ID&gt;.ext</code></b>: the Index/Metadata file containing the original full path (`C:\\Users\\Alice\\Desktop\\bribe.xlsx`), original file size, and exact 64-bit Windows FILETIME of deletion.<br>• <b><code>$R&lt;6-char-ID&gt;.ext</code></b>: the Raw payload containing the intact file contents.</p>' },

    { q: 'Why is recovering deleted files via traditional file carving usually unsuccessful on a modern SSD compared with a mechanical HDD, even when the SSD is imaged immediately through a hardware write-blocker?',
      o: ['Because the OS sends the TRIM / Deallocate command upon deletion, causing the SSD controller\'s background garbage collection to physically erase unallocated flash blocks and return zeros (`0x00`)',
          'Because SSDs do not use clusters or sectors',
          'Because hardware write-blockers cannot connect to SATA or NVMe SSDs',
          'Because SSDs store all files in volatile SRAM'], a: 0,
      e: '<p>When a file is deleted on a TRIM-enabled SSD, the OS issues the <b>TRIM command</b> notifying the SSD\'s Flash Translation Layer (FTL) that those LBAs are no longer in use. Under Deterministic Read Zero after TRIM (DZAT), the SSD controller immediately returns `0x00` for trimmed sectors and erases the underlying NAND blocks via garbage collection — even when read through a write-blocker!</p>' },

    { q: 'Which Windows Registry keys are examined together to determine the vendor, product, serial number, and assigned drive letter of every USB flash drive ever connected to a system?',
      o: ['`SYSTEM\\CurrentControlSet\\Enum\\USBSTOR` and `SYSTEM\\MountedDevices`',
          '`SAM\\SAM\\Domains\\Account\\Users` and `SECURITY\\Policy`',
          '`SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run` and `Prefetch`',
          '`NTUSER.DAT\\Console` and `System32\\drivers\\etc\\hosts`'], a: 0,
      e: '<p><b>`Enum\\USBSTOR`</b> (and `Enum\\USB`) in the `SYSTEM` hive records the hardware Vendor ID, Product ID, Revision, and unique device Serial Number of every USB mass-storage device plugged in. Cross-referencing that serial number in <b>`SYSTEM\\MountedDevices`</b> reveals the last drive letter (`E:`, `F:`) and Volume GUID assigned to it.</p>' },

    { q: 'An investigator wants to prove that a suspect browsed a specific folder (`E:\\SecretPhotos\\2026\\`) in Windows File Explorer on an external drive that has since been unplugged and destroyed. Which Windows artefact specifically records folder traversal, window view settings, and directory paths even after the folder is gone?',
      o: ['Shellbags (`BagMRU` and `Bags` in `UsrClass.dat` / `NTUSER.DAT`)',
          'The `hosts` file',
          'The `SAM` registry hive',
          'Windows Defender firewall logs'], a: 0,
      e: '<p><b>Shellbags</b> (stored in `UsrClass.dat` and `NTUSER.DAT`) are used by Windows Explorer to remember folder display preferences (icon size, sort order, window position). Because Windows creates a Shellbag entry whenever a user opens a folder in Explorer — and never deletes it when the folder or USB drive is removed — Shellbags provide ironclad proof that a specific user account navigated into that directory!</p>' },

    { q: 'In Windows Security Event Logs (`Security.evtx`), an investigator finds an Event ID `4624` (Successful Logon) with `Logon Type = 10`. What type of logon does `Logon Type 10` prove?',
      o: ['RemoteInteractive logon via Remote Desktop Protocol (RDP / Terminal Services)',
          'Local physical keyboard logon at the console (`Logon Type 2`)',
          'Network SMB file-share connection (`Logon Type 3`)',
          'Scheduled Task logon (`Logon Type 4`)'], a: 0,
      e: '<p>Memorise the four crucial Event ID 4624 Logon Types:<br>• <b>Type 2 (Interactive):</b> user sat physically at the keyboard/screen.<br>• <b>Type 3 (Network):</b> SMB share / network folder mapping.<br>• <b>Type 7 (Unlock):</b> unlocking a locked workstation.<br>• <b>Type 10 (RemoteInteractive):</b> remote graphical login via <b>RDP (Remote Desktop Protocol)</b>!</p>' },

    { q: 'While analysing a captured Windows RAM image in Volatility, a forensic analyst notices that `malware.exe` (PID 3812) is completely missing from the output of `volatility -f mem.raw pslist`, but DOES appear in the output of `volatility -f mem.raw psscan`. What does this discrepancy prove?',
      o: ['A Direct Kernel Object Manipulation (DKOM) rootkit unlinked `malware.exe`\'s `EPROCESS` structure from the doubly-linked active process list to hide it from Task Manager, while its raw `EPROCESS` pool allocation remained in physical RAM',
          '`malware.exe` is an ordinary 16-bit MS-DOS program',
          'The RAM image is corrupted and unreadable',
          '`pslist` only lists terminated processes whereas `psscan` lists running processes'], a: 0,
      e: '<p><b>`pslist`</b> walks the kernel\'s doubly-linked list (`ActiveProcessLinks`) — the exact same list the Windows API and Task Manager use. A <b>DKOM rootkit</b> hides a running process by changing the forward (`Flink`) and backward (`Blink`) pointers of its neighbours to skip over its `EPROCESS` block. However, the process still exists in RAM so the scheduler can run its threads; <b>`psscan`</b> scans raw physical memory for `EPROCESS` pool tags and catches the hidden process red-handed!</p>' },

    { q: 'A suspect runs the command `type payload.exe > innocent.txt:secret.exe` on an NTFS drive. What happens to the visible file size of `innocent.txt` in Windows Explorer, and where is `secret.exe` stored?',
      o: ['The visible file size of `innocent.txt` does NOT change at all; `secret.exe` is stored in a secondary named `$DATA` attribute (Alternate Data Stream) attached to `innocent.txt`\'s MFT record',
          'The visible file size of `innocent.txt` increases by the size of `payload.exe`',
          '`innocent.txt` is overwritten and destroyed',
          'The command fails because NTFS allows only one `$DATA` attribute per file'], a: 0,
      e: '<p>NTFS supports multiple `$DATA` attributes on a single MFT record. The default unnamed `$DATA` stream is what Windows Explorer displays for file size and opens in Notepad. Any named stream (`filename:streamname`) is an <b>Alternate Data Stream (ADS)</b> — its size is NOT added to the primary file\'s reported size in Explorer, making it a classic anti-forensic hiding spot detected via `dir /r` or MFT analysis.</p>' },

    { q: 'According to NIST Special Publication 800-88 Rev. 1 (Guidelines for Media Sanitization), what are the three formal levels of media sanitization in increasing order of thoroughness, and why is degaussing ineffective on an SSD?',
      o: ['Clear, Purge, Destroy — and degaussing uses a strong magnetic field, which has no effect on electronic NAND flash memory cells in an SSD',
          'Format, Wipe, Shred — and degaussing melts SSD controllers',
          'Delete, Trim, Format — and degaussing only works on optical DVDs',
          'Purge, Clear, Destroy — and degaussing is the recommended NIST method for SSDs'], a: 0,
      e: '<p>NIST SP 800-88 defines <b>Clear</b> (logical sector overwrite), <b>Purge</b> (cryptographic erase / firmware Secure Erase / degaussing), and <b>Destroy</b> (shredding/incineration). Because <b>degaussing</b> erases data by disrupting magnetic domains on spinning HDD platters or magnetic tape, applying a degausser to a semiconductor <b>NAND flash SSD, USB drive, or SD card</b> leaves 100% of the stored flash data intact!</p>' },

    { q: 'During live incident response on a compromised Linux server, the attacker deleted the malicious binary `/tmp/backdoor` from disk after launching it, but the process (PID 4410) is still running in memory. How can the investigator recover an intact copy of the deleted executable binary?',
      o: ['Copy it directly from the virtual procfs pseudo-file `/proc/4410/exe` before terminating the process',
          'Run `history -c` in bash',
          'Copy `/etc/shadow`',
          'Reboot the server and check `/tmp`'], a: 0,
      e: '<p>On Linux, as long as a process remains running, the kernel keeps an open inode reference to its executable image exposed via the `/proc/<PID>/exe` symlink. Even if the attacker ran `rm /tmp/backdoor` (marking the directory entry deleted), running `cp /proc/4410/exe /mnt/usb/recovered_backdoor.elf` recovers the <b>complete, bit-perfect ELF binary</b> directly from the live system!</p>' },

    { q: 'Which Windows artefact located at `C:\\Windows\\Prefetch\\<EXE>-<8-char-hash>.pf` proves that an executable program was run on the system, how many times it was run, the last 8 execution timestamps, and which files/DLLs it loaded during its first 10 seconds of execution?',
      o: ['Windows Prefetch (`.pf`) files',
          '`SAM` registry hive',
          '`hosts` file',
          '`boot.ini`'], a: 0,
      e: '<p><b>Windows Prefetch (`.pf`) files</b> are designed by the Windows Cache Manager to speed up application startup by monitoring the first 10 seconds of a program\'s launch. Even if a suspect runs a portable wiping tool (`ccleaner.exe`) from a USB stick and then deletes the `.exe` and unplugs the USB stick, the leftover `CCLEANER.EXE-xxxxxxxx.pf` file in `C:\\Windows\\Prefetch\\` proves the program was executed, how many times it ran, and its exact last execution timestamps!</p>' },

    { q: 'In the `NTUSER.DAT` registry hive of a Windows user profile, the `UserAssist` key records GUI programs launched by the user via Windows Explorer. How are the program names inside `UserAssist` obfuscated by Windows?',
      o: ['ROT-13 Caesar cipher substitution (shifting each English letter by 13 positions, e.g. `cmd.exe` → `pzq.rkr`)',
          'AES-256 hardware encryption tied to the TPM',
          'SHA-512 one-way hashing',
          'Base64 encoding compressed with LZW'], a: 0,
      e: '<p>Microsoft obfuscates the value names under `NTUSER.DAT\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\UserAssist` using simple <b>ROT-13</b> substitution (where `A ↔ N`, `B ↔ O`, so `notepad.exe` is stored as `abgrcnq.rkr`) along with the focus time, run counter, and last execution FILETIME.</p>' },

    { q: 'In Windows Event Logs, an investigator sees Security Event ID `1102` and System Event ID `7045` occurring within 2 minutes of each other. What sequence of events do these two Event IDs indicate?',
      o: ['A new Windows Service was installed (`7045` — common malware persistence) and the Security Audit Log was cleared (`1102` — anti-forensic log wiping)',
          'A user logged off (`1102`) and the printer ran out of paper (`7045`)',
          'The system clock was synced (`1102`) and BitLocker finished encrypting (`7045`)',
          'A failed password attempt (`1102`) and a clean shutdown (`7045`)'], a: 0,
      e: '<p><b>Event ID `7045`</b> in `System.evtx` records the installation of a new Windows Service (frequently used by ransomware, Cobalt Strike, or PsExec to gain `SYSTEM` persistence), and <b>Event ID `1102`</b> in `Security.evtx` is generated automatically the instant someone clears the Security event log (`wevtutil cl Security`)!</p>' },

    { q: 'When a Windows file encrypted with EFS (Encrypting File System) on an NTFS partition is copied onto a FAT32-formatted USB thumb drive, what happens to the file\'s encryption?',
      o: ['Because FAT32 does not support NTFS EFS metadata attributes, the file is decrypted transparently on the fly (if copied by the authorised user) and stored as plaintext on the FAT32 USB drive',
          'The FAT32 drive automatically converts itself into BitLocker format',
          'The copy is blocked permanently even for the file\'s owner',
          'The file remains encrypted inside a FAT32 MFT record'], a: 0,
      e: '<p><b>EFS (Encrypting File System)</b> is an <b>NTFS-specific</b> file-system feature that stores the File Encryption Key (FEK) inside an NTFS `$LOGGED_UTILITY_STREAM ($EFS)` attribute. Because FAT32 and exFAT lack this attribute, copying an EFS-encrypted file onto a FAT32 USB stick strips the EFS wrapper and writes the file in <b>plaintext</b> on the USB drive!</p>' },

    { q: 'How does VeraCrypt (and its predecessor TrueCrypt) provide "plausible deniability" against coerced password disclosure through its Hidden Volume feature?',
      o: ['It embeds a second encrypted "hidden volume" inside the free/unallocated space of an outer "decoy volume", where entering the decoy password mounts the harmless outer volume and entering the second secret password mounts the hidden volume — and the hidden volume\'s unused space is indistinguishable from random encrypted bytes',
          'It deletes the hard drive firmware if a wrong password is typed once',
          'It stores the volume password in plain text inside `hiberfil.sys`',
          'It uses ROT-13 on filenames'], a: 0,
      e: '<p>A VeraCrypt container fills 100% of its allocated space with cryptographically random bytes on creation. If a suspect creates a <b>Hidden Volume</b> inside the outer volume\'s free space, they have two passwords: Password A opens the outer decoy volume (containing harmless tax forms), while Password B opens the inner hidden volume. Because free space in a VeraCrypt container always looks like uniform random noise, an examiner cannot mathematically prove whether a hidden volume exists inside the free space unless outer-OS artefacts (`.lnk` files, Shellbags, Registry MRUs pointing to the mounted hidden drive letter) leak its use!</p>' },

    { q: 'Which two NTFS file-system journal files located in the root directory record metadata transactions (`$LogFile`) and a high-level chronological change log of every file creation, deletion, and rename (`$UsnJrnl:$J`)?',
      o: ['`$LogFile` and `$UsnJrnl` (Update Sequence Number Change Journal)',
          '`pagefile.sys` and `hiberfil.sys`',
          '`$Boot` and `$BadClus`',
          '`SAM` and `SECURITY`'], a: 0,
      e: '<p>NTFS maintains two distinct journals:<br>• <b><code>$LogFile</code>:</b> Low-level transaction redo/undo log used by the OS to recover file-system metadata consistency after a sudden power loss.<br>• <b><code>$UsnJrnl</code> (specifically its `$J` data stream):</b> High-level Update Sequence Number Change Journal that records filenames, MFT reference numbers, timestamps, and reason flags (`FILE_CREATE`, `DATA_OVERWRITE`, `FILE_DELETE`, `RENAME_OLD_NAME`), allowing investigators to prove a file existed and was deleted long after its MFT slot was overwritten!</p>' },

    { q: 'In Steganography using 1-bit Least Significant Bit (LSB) substitution on an uncompressed 24-bit RGB BMP image of resolution 1024 × 768, what is the maximum steganographic payload (in bytes) that can be hidden if 1 bit is embedded into each of the R, G, and B colour channels of every pixel?',
      o: ['294,912 bytes (288 KB)',
          '98,304 bytes (96 KB)',
          '2,359,296 bytes (2.25 MB)',
          '786,432 bytes (768 KB)'], a: 0,
      e: '<p>1. Total pixels $= 1024 \\times 768 = 786,432$ pixels.<br>2. Each 24-bit RGB pixel has <b>3 colour bytes</b> (R, G, B). Embedding 1 LSB per channel gives <b>3 secret bits per pixel</b>.<br>3. Total secret bits $= 786,432 \\times 3 = 2,359,296$ bits.<br>4. Divide by 8 bits/byte $= 2,359,296 / 8 =$ <b>294,912 bytes (288 KB)</b> (exactly $1/8$ of the $2.25\\text{ MB}$ uncompressed image size!).</p>' },

    { q: 'On a macOS workstation under investigation, which hidden file inside a folder records custom Finder window positions and icon layouts (proving a user opened and viewed that folder in Finder), and which SQLite database tracks the source URL of every file downloaded from a web browser?',
      o: ['`.DS_Store` (Finder folder view metadata) and `QuarantineEventsV2` (Gatekeeper download URL history)',
          '`NTUSER.DAT` and `Amcache.hve`',
          '`/etc/shadow` and `/var/log/wtmp`',
          '`INFO2` and `Prefetch`'], a: 0,
      e: '<p>On macOS:<br>• <b>`.DS_Store`</b> (Desktop Services Store) is the direct macOS counterpart to Windows <em>Shellbags</em> — proving which directories a user viewed in Finder and holding references to files that were inside.<br>• <b>`com.apple.LaunchServices.QuarantineEventsV2`</b> (coupled with the `com.apple.quarantine` extended attribute) logs every file downloaded via Safari/Chrome/Mail along with the exact timestamp and originating download URL!</p>' },

    { q: 'When comparing a GUID Partition Table (GPT) disk against a legacy BIOS Master Boot Record (MBR) disk, which of the following is a major structural advantage of GPT for both storage and forensic partition recovery?',
      o: ['GPT supports disks larger than 2 TB (using 64-bit LBAs), supports up to 128 primary partitions on Windows without extended partitions, and automatically stores a backup GPT header and partition table at the end of the disk',
          'GPT stores all partitions inside Sector 0 only and is limited to 4 partitions and 2 TB',
          'GPT cannot be used on SSDs',
          'GPT does not use logical block addressing'], a: 0,
      e: '<p>Legacy <b>MBR</b> uses 32-bit LBA sector pointers (capping disk capacity at $2^{32} \\times 512\\text{ B} =$ <b>2 TB</b>), limits primary partitions to <b>4</b>, and keeps only a single partition table at LBA 0. <b>GPT</b> uses 64-bit LBAs (up to 9.4 ZB), supports 128 partitions by default, checksums its headers with CRC32, and stores a complete <b>Secondary/Backup GPT at the final sectors of the drive</b> so a corrupted primary partition table can be restored instantly.</p>' }
  ]
});
