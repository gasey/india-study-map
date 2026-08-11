window.MPSC.units.push({
  id: 'p4u3',
  paper: 'Paper IV — Cyber Forensic',
  title: 'Digital Forensics & Computer Forensics',
  marks: 40,
  syllabus: 'What is Digital Forensics and digital evidence, Principles of Digital Evidence. Sources of digital evidence. Key technical concepts - bits, bytes, numbering scheme, file extensions and file signatures, hashing algorithms, MD5, SHA1, SHA256, importance of hash values in digital forensics, data acquisition and evidence collection - Volatile data collection, Non-volatile data collection, imaging and extraction of storage devices, write-blockers. Memory forensics - memory dump. Deleted file and partitions - concepts and recovery, file carving, metadata, password cracking - brute-force method, dictionary attack, rainbow tables. Basics of computer forensics, acquisition methods, image format (raw, DD, SMART, AFF, E01 etc.), disk and file encryption techniques, windows registry analysis, hibernation file (hiberfil.sys), windows event log, artifacts recognition from slack space and unallocated space, Crash Dump Analysis, MFT analysis, metadata analysis. Anti-forensics - data hiding, file extension mismatch, encryption, Steganography, data destruction; Evidence Collection in Linux and Mac Operating system. Computer forensic tools.',

  notes: [
    {
      h: 'Principles of digital evidence',
      b: '<p>The <b>ACPO principles</b> (UK Association of Chief Police Officers) are the standard formulation and are quoted almost verbatim in Indian training material:</p>' +
         '<ol>' +
         '<li>No action taken should change data held on a device that may subsequently be relied upon in court.</li>' +
         '<li>Where a person finds it necessary to access original data, that person must be <b>competent</b> to do so and able to give evidence explaining the relevance and implications of their actions.</li>' +
         '<li>An <b>audit trail</b> of all processes applied should be created and preserved, such that an independent third party could repeat those processes and reach the same result.</li>' +
         '<li>The person in charge of the investigation has <b>overall responsibility</b> for ensuring the law and these principles are adhered to.</li>' +
         '</ol>' +
         '<p>Note principle 2: it does not forbid touching the original, it conditions it on competence and explicability — a nuance MCQs test.</p>' +
         '<div class="tip"><b>Indian legal hook.</b> Electronic records are admitted under <b>Section 65B of the Indian Evidence Act, 1872</b>, which requires a certificate. The leading cases are <em>Anvar P.V. v. P.K. Basheer</em> (2014) and <em>Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal</em> (2020), which restored and settled the mandatory nature of the 65B certificate. The Bharatiya Sakshya Adhiniyam, 2023 has since replaced the Evidence Act, carrying the provision forward at Section 63.</div>'
    },
    {
      h: 'Order of volatility',
      b: '<p>Collect most volatile first (RFC 3227):</p>' +
         '<ol><li>CPU registers and cache</li><li>Routing tables, ARP cache, process table, kernel statistics, RAM</li><li>Temporary file systems</li><li>Disk</li><li>Remote logging and monitoring data</li><li>Physical configuration and network topology</li><li>Archival media</li></ol>' +
         '<p>The practical consequence: <b>capture RAM before pulling the plug</b>. A memory dump yields encryption keys, running malware never written to disk, open network connections, clipboard contents and decrypted document fragments.</p>'
    },
    {
      h: 'Hashing',
      b: '<table>' +
         '<tr><th>Algorithm</th><th>Digest size</th><th>Status</th></tr>' +
         '<tr><td>MD5</td><td><b>128 bits</b> (32 hex chars)</td><td>Collision-broken; still used for integrity verification of images</td></tr>' +
         '<tr><td>SHA-1</td><td><b>160 bits</b> (40 hex chars)</td><td>Collision demonstrated (SHAttered, 2017); deprecated</td></tr>' +
         '<tr><td>SHA-256</td><td><b>256 bits</b> (64 hex chars)</td><td>Current standard</td></tr>' +
         '</table>' +
         '<p>Properties required of a cryptographic hash: <b>deterministic</b>, <b>fast</b> to compute, <b>pre-image resistant</b> (cannot invert), <b>second pre-image resistant</b>, <b>collision resistant</b>, and exhibiting the <b>avalanche effect</b> (a one-bit input change alters roughly half the output bits).</p>' +
         '<p>Uses in forensics: proving an image is a faithful copy (hash the source, hash the image, compare); proving evidence has not changed since seizure; and <b>hash sets</b> — matching against known-file databases such as NSRL to filter out irrelevant system files, or against known-illegal-content hash lists.</p>' +
         '<div class="tip"><b>Nuance worth marks.</b> MD5 being "broken" means an attacker can <em>construct</em> two colliding files. It does not mean a random accidental collision is plausible, nor that an existing file can be altered to keep its hash. That is why MD5 remains acceptable for verifying that an image was copied correctly.</div>'
    },
    {
      h: 'Acquisition, write-blockers and image formats',
      b: '<p>A <b>write-blocker</b> sits between the evidence drive and the examination machine and permits read commands while denying writes. Hardware blockers are preferred in court over software ones. Without it, merely attaching a disk to Windows modifies timestamps and may write recovery data.</p>' +
         '<table>' +
         '<tr><th>Format</th><th>Nature</th></tr>' +
         '<tr><td><b>raw / dd</b></td><td>Bit-for-bit copy, no metadata, no compression. Universally readable; same size as the source.</td></tr>' +
         '<tr><td><b>E01</b> (EnCase Evidence File)</td><td>Compressed, embeds case metadata, stores CRC per block plus an overall hash. Splittable.</td></tr>' +
         '<tr><td><b>AFF</b></td><td>Advanced Forensic Format — open, extensible, compressed, holds arbitrary metadata.</td></tr>' +
         '<tr><td><b>SMART</b></td><td>Format of the SMART tool (ASR Data); segmented with metadata.</td></tr>' +
         '</table>' +
         '<p>Acquisition types: <b>physical</b> (whole device, sector by sector, including unallocated and slack — the forensic ideal), <b>logical</b> (only allocated files visible to the file system), and <b>sparse/targeted</b> (a selected subset).</p>'
    },
    {
      h: 'File signatures vs extensions; carving',
      b: '<p>A <b>file signature</b> (magic number) is a byte pattern at the start — and sometimes end — of a file that identifies its true type. The extension is merely a label and can be changed freely, so an extension/signature mismatch is a classic <b>anti-forensic</b> indicator.</p>' +
         '<table>' +
         '<tr><th>Type</th><th>Header (hex)</th><th>ASCII</th></tr>' +
         '<tr><td>JPEG</td><td>FF D8 FF</td><td>ÿØÿ</td></tr>' +
         '<tr><td>PNG</td><td>89 50 4E 47</td><td>.PNG</td></tr>' +
         '<tr><td>GIF</td><td>47 49 46 38</td><td>GIF8</td></tr>' +
         '<tr><td>PDF</td><td>25 50 44 46</td><td>%PDF</td></tr>' +
         '<tr><td>ZIP / DOCX / XLSX / APK</td><td>50 4B 03 04</td><td>PK..</td></tr>' +
         '<tr><td>RAR</td><td>52 61 72 21</td><td>Rar!</td></tr>' +
         '<tr><td>Windows PE (.exe/.dll)</td><td>4D 5A</td><td>MZ</td></tr>' +
         '<tr><td>ELF (Linux)</td><td>7F 45 4C 46</td><td>.ELF</td></tr>' +
         '<tr><td>SQLite</td><td>53 51 4C 69 74 65</td><td>SQLite</td></tr>' +
         '</table>' +
         '<p><b>File carving</b> recovers files from unallocated space using signatures alone, <em>without</em> file-system metadata. Its main limitation is <b>fragmentation</b>: header-footer carving assumes the file is contiguous, so a fragmented file carves out corrupt. Note that ZIP-based formats (DOCX, XLSX, APK) all share the PK header — a favourite question.</p>'
    },
    {
      h: 'Windows artefacts',
      b: '<ul>' +
         '<li><b>Registry</b> — hives on disk: <code>SYSTEM</code>, <code>SOFTWARE</code>, <code>SAM</code>, <code>SECURITY</code> in <code>%SystemRoot%\\System32\\config</code>, plus <code>NTUSER.DAT</code> per user profile. Yields USB device history (USBSTOR), typed URLs, run keys (persistence), recently used files, time zone, and the computer name.</li>' +
         '<li><b>hiberfil.sys</b> — compressed image of RAM written on hibernation. A substitute memory dump, potentially containing keys and plaintext.</li>' +
         '<li><b>pagefile.sys</b> — virtual memory backing store; unstructured but rich in fragments.</li>' +
         '<li><b>Event logs</b> — <code>.evtx</code> files under <code>System32\\winevt\\Logs</code>. Security, System and Application. Event ID <b>4624</b> = successful logon, <b>4625</b> = failed logon, <b>4634</b> = logoff, <b>1102</b> = audit log cleared (itself highly suspicious).</li>' +
         '<li><b>Prefetch</b> (<code>.pf</code>) — evidence of program execution, with run count and last-run times.</li>' +
         '<li><b>$MFT</b> — per-file metadata, including <b>$STANDARD_INFORMATION</b> and <b>$FILE_NAME</b> timestamp sets. Divergence between the two suggests <b>timestomping</b>.</li>' +
         '<li><b>Alternate Data Streams (ADS)</b> — NTFS feature allowing hidden content attached to a file; a classic hiding place.</li>' +
         '</ul>' +
         '<p>NTFS records four timestamps, abbreviated <b>MACE / MACB</b>: Modified, Accessed, Created (born), Entry-modified (MFT change).</p>'
    },
    {
      h: 'Password attacks and anti-forensics',
      b: '<ul>' +
         '<li><b>Brute force</b> — try every combination. Guaranteed to succeed eventually; cost grows exponentially with length.</li>' +
         '<li><b>Dictionary attack</b> — try a wordlist plus mutations. Far faster, but fails on genuinely random passwords.</li>' +
         '<li><b>Rainbow tables</b> — precomputed chains of hashes trading memory for time. <b>Defeated entirely by salting</b>, since a unique random salt per password makes precomputation useless.</li>' +
         '</ul>' +
         '<p><b>Anti-forensics</b> techniques named in the syllabus: data hiding (ADS, slack space, hidden partitions), file extension mismatch, encryption, <b>steganography</b>, and data destruction (wiping, degaussing, physical destruction).</p>' +
         '<div class="tip"><b>Steganography vs cryptography.</b> Cryptography hides the <em>meaning</em> of a message — an observer sees ciphertext and knows communication occurred. Steganography hides the <em>existence</em> of the message inside an innocuous carrier. The commonest technique is <b>LSB substitution</b>, replacing the least significant bit of each pixel byte, which is visually imperceptible.</div>'
    },
    {
      h: 'Deleted files and partition recovery',
      b: '<p>"Deleting" a file almost never erases its data — it only removes the <b>pointer</b> to that data, leaving the content sitting in what the file system now calls unallocated space until something else is written over it.</p>' +
         '<table>' +
         '<tr><th>File system</th><th>What actually happens on delete</th></tr>' +
         '<tr><td>FAT (12/16/32)</td><td>The first byte of the filename in the directory entry is overwritten with <b>0xE5</b>; the cluster chain in the File Allocation Table is cleared. The remaining filename characters and the data clusters survive.</td></tr>' +
         '<tr><td>NTFS</td><td>The file\'s <b>$MFT</b> entry is flagged as free (its "in use" bit is cleared) and the corresponding clusters are marked free in <b>$Bitmap</b>. The MFT record itself, and the data, typically remain intact until reallocated.</td></tr>' +
         '</table>' +
         '<p>Modern Windows routes user deletions through the <b>Recycle Bin</b> (<code>$Recycle.Bin</code>), which stores each item as a pair: <b>$I</b> (metadata — original path, size, deletion time) and <b>$R</b> (the actual file data). Older Windows used a single <code>INFO2</code> index file. Recovering the $I/$R pair even after the bin is "emptied" is a standard exercise, since emptying only removes the pointers again.</p>' +
         '<p><b>Partition recovery.</b> On a BIOS/MBR disk, the <b>Master Boot Record</b> at logical sector 0 holds the boot code and a table of up to four partition entries; on a GPT disk a protective MBR is followed by the GUID Partition Table with a duplicate backup copy at the end of the disk. If the table itself is deleted or corrupted, the partition\'s data is usually still intact — recovery tools scan the raw disk for known <b>volume boot record</b> signatures (e.g. NTFS\'s "NTFS" OEM ID, FAT\'s "FAT32") to relocate and rebuild the missing partition entry.</p>' +
         '<div class="tip"><b>TestDisk vs PhotoRec.</b> Both are open-source and commonly paired: <b>TestDisk</b> repairs partition tables and boot sectors — it works at the file-system/partition level. <b>PhotoRec</b> ignores the file system entirely and carves files by signature straight from raw sectors, which is why it survives a full reformat that defeats TestDisk.</div>'
    },
    {
      h: 'Memory forensics and crash dump analysis',
      b: '<p>A <b>memory dump</b> captures the contents of RAM at a point in time, either live (via a tool such as WinPmem/FTK Imager while the system runs) or as a by-product of a crash.</p>' +
         '<p>When Windows hits a fatal kernel-mode error (a <b>"Stop error"</b>/BSOD, identified by a bug-check code such as <code>0x0000007B</code>), it can write a <b>crash dump</b> to disk before restarting:</p>' +
         '<table>' +
         '<tr><th>Dump type</th><th>Contents / size</th></tr>' +
         '<tr><td><b>Complete memory dump</b></td><td>All of physical RAM — largest, most forensically complete; written to <code>%SystemRoot%\\MEMORY.DMP</code>.</td></tr>' +
         '<tr><td><b>Kernel memory dump</b></td><td>Only kernel-mode memory (drivers, kernel structures), skipping user-mode process memory — smaller, still very useful.</td></tr>' +
         '<tr><td><b>Small memory dump (minidump)</b></td><td>A compact summary (historically ~64–256 KB) with the stop-code, loaded driver list and stack trace; stored under <code>%SystemRoot%\\Minidump\\</code>, one file per crash.</td></tr>' +
         '<tr><td><b>Automatic / active memory dump</b></td><td>Windows 8+ default; behaves like a kernel dump but is sized intelligently relative to RAM.</td></tr>' +
         '</table>' +
         '<p>Crash dumps are analysed with tools such as <b>WinDbg</b> (the <code>!analyze -v</code> command decodes the bug-check and faulting driver). Forensically they matter beyond troubleshooting: a dump can preserve evidence of a kernel-mode rootkit, a malicious driver, or process memory that would otherwise have been lost, because it is captured automatically at the moment of failure rather than requiring the examiner to have triggered acquisition themselves.</p>'
    },
    {
      h: 'Evidence collection in Linux and Mac operating systems',
      b: '<p>The Windows-centric artefacts above have direct analogues on other platforms, and the syllabus calls this out as a distinct topic.</p>' +
         '<p><b>Linux.</b> Acquisition is typically done with <code>dd</code> or the forensically hardened <code>dc3dd</code>/<code>dcfldd</code> (which add hashing and logging on the fly), from a boot medium so the target file system is never mounted read-write. Key volatile sources live under <code>/proc</code> (per-process memory maps, open file handles, network sockets) — the Linux equivalent of live RAM/process collection. Non-volatile artefacts include <code>/var/log/syslog</code> or <code>/var/log/auth.log</code> (authentication and system events, analogous to Windows Event Logs), shell history files (<code>~/.bash_history</code>), cron jobs, and the <b>swap partition</b> (analogous to <code>pagefile.sys</code>). The common file systems (ext3/ext4) use <b>inodes</b> rather than an MFT; deleted-file recovery tools such as <code>extundelete</code> or manual <code>debugfs</code> inspection work by walking freed inodes and the journal.</p>' +
         '<p><b>Mac (macOS).</b> The disk uses <b>HFS+</b> or, from 2017 onward, <b>APFS</b>. Configuration and application state live in <b>plist</b> files (property lists, XML or binary, under <code>~/Library/Preferences</code>) — the rough Mac counterpart to the Windows registry. <b>FileVault</b> provides full-disk encryption; an examiner needs the user password or the recovery key to acquire readable data from a powered-off encrypted Mac. macOS keeps a <b>unified log</b> (queried with <code>log show</code>) in place of separate event-log files, stores credentials in the <b>Keychain</b>, and <code>.DS_Store</code> files left in folders can reveal that a directory was browsed in Finder even after its contents are deleted. <b>Time Machine</b> backups are a rich secondary evidence source, often retaining deleted files long after the live disk has overwritten them.</p>' +
         '<div class="tip"><b>Exam trap.</b> Do not assume "MFT analysis" or "$STANDARD_INFORMATION/$FILE_NAME timestamps" generalise to Linux/Mac questions — those are NTFS-specific terms. The Linux equivalent structure is the <b>inode</b>, which stores its own timestamp set (mtime/atime/ctime, and birth time on ext4) but has no direct MFT counterpart.</div>'
    },
    {
      h: 'Disk and file encryption techniques',
      b: '<p>Encryption is listed separately from anti-forensics because it is also a legitimate security control the examiner must work around, not merely something a suspect deploys deliberately.</p>' +
         '<table>' +
         '<tr><th>Scheme</th><th>Platform / scope</th><th>Notes</th></tr>' +
         '<tr><td><b>BitLocker</b></td><td>Windows, full-disk</td><td>Keys can be sealed to a <b>TPM</b> (Trusted Platform Module) so the volume auto-unlocks only on the original hardware/boot state.</td></tr>' +
         '<tr><td><b>FileVault</b></td><td>macOS, full-disk</td><td>Ties to the user\'s login password; a separate recovery key can be escrowed.</td></tr>' +
         '<tr><td><b>EFS</b> (Encrypting File System)</td><td>Windows, file/folder-level</td><td>Encrypts individual files transparently for the logged-in user, unlike BitLocker\'s whole-volume scope.</td></tr>' +
         '<tr><td><b>VeraCrypt</b> (successor to TrueCrypt)</td><td>Cross-platform, volume or whole-disk</td><td>Supports <b>hidden volumes</b> offering plausible deniability — a decoy volume unlocks with one password while a second hidden volume needs another.</td></tr>' +
         '</table>' +
         '<p>The forensic consequence of full-disk encryption is that a <b>powered-off, encrypted</b> drive imaged without the key or passphrase yields only ciphertext. This is precisely why <b>live/volatile acquisition</b> (capturing RAM, per the order-of-volatility) is prioritised whenever a suspect machine is found running and unlocked — the encryption key normally exists in plaintext in memory while the volume is mounted, and is lost the moment the machine is powered down.</p>'
    },
    {
      h: 'Digital evidence, numbering systems and forensic tools',
      b: '<p><b>Digital forensics</b> is the application of scientifically derived and proven methods toward the identification, collection, preservation, analysis and presentation of digital evidence, such that it is admissible in a court of law. <b>Digital evidence</b> is any probative information stored or transmitted in binary form.</p>' +
         '<p><b>Sources of digital evidence</b> extend well beyond a suspect\'s hard disk: computers and laptops, mobile phones and tablets, cloud storage and email accounts, network traffic and server/firewall logs, CCTV/DVR footage, IoT and embedded devices (smart-home hubs, vehicle infotainment, wearables), and removable media (USB drives, memory cards).</p>' +
         '<p><b>Numbering fundamentals.</b> A <b>bit</b> is a single binary digit (0/1); a <b>byte</b> is 8 bits and can represent 256 distinct values (0–255 in decimal, <code>00</code>–<code>FF</code> in hexadecimal). Forensic tools display data in hex because two hex digits map exactly onto one byte, unlike decimal.</p>' +
         '<table>' +
         '<tr><th>Category</th><th>Representative tools</th></tr>' +
         '<tr><td>Disk imaging</td><td>FTK Imager, EnCase, X-Ways Forensics, <code>dd</code>/<code>dc3dd</code></td></tr>' +
         '<tr><td>Memory analysis</td><td><b>Volatility</b>, Rekall</td></tr>' +
         '<tr><td>File-system / case analysis suites</td><td>Autopsy (front end to <b>The Sleuth Kit</b>) — open source; EnCase, FTK — commercial</td></tr>' +
         '<tr><td>Deleted-file / partition recovery</td><td>TestDisk, PhotoRec, Recuva</td></tr>' +
         '<tr><td>Network</td><td>Wireshark</td></tr>' +
         '<tr><td>Mobile</td><td>Cellebrite UFED, MSAB XRY</td></tr>' +
         '</table>' +
         '<div class="tip"><b>Discriminator.</b> Autopsy is often mis-paired with "commercial, paid tool" in distractor options — it and The Sleuth Kit are free and open source, which is exactly why they are the standard teaching tool despite EnCase/FTK dominating paid casework.</div>'
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
      e: '<p><b>Autopsy</b> is free and open source, built as a graphical front end to <b>The Sleuth Kit</b>, which is exactly why it is favoured in training environments and by resource-constrained agencies despite EnCase and FTK dominating paid casework.</p><p>It handles file-system and case analysis (timeline, keyword search, hash filtering), not packet capture or mobile extraction — those are the separate specialisations of Wireshark and Cellebrite UFED/MSAB XRY respectively.</p>' }
  ]
});
