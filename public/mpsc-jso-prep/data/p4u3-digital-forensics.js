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
      e: '<p>The <b>avalanche effect</b> makes the output statistically unrelated to the input, so no partial information about the message leaks from its digest.</p><p>Forensically it is what makes hashing a reliable integrity check: any alteration, even a single bit in a multi-gigabyte image, produces a completely different digest rather than a similar one.</p>' }
  ]
});
