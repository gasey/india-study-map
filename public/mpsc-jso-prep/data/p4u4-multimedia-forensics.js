window.MPSC.units.push({
  id: 'p4u4',
  paper: 'Paper IV — Cyber Forensic',
  title: 'Multimedia Forensics',
  marks: 40,
  syllabus: 'Understand the Fundamentals of Multimedia Forensics, including its role in digital forensics. Introduction to digital signals: audio, image and video, Digitization process: sampling and quantization, Image Enhancement Techniques: Spatial and frequency domain. Methods of source camera identification, Methods for tampering of digital image/video, Forensic authentication of digital image/video, Enhancement of digital image/video. Audio forensics - Acoustic Parameters of Sound, Fourier Analysis, Frequency and Time Domain Representation of Speech Signal, Fast Fourier Transform, Methods of tampering for digital audio, Forensic authentication of digital audio, Enhancement of digital audio.',

  notes: [
    {
      h: 'Digitisation: sampling and quantisation',
      b: '<p>Converting an analogue signal to digital involves two distinct steps, and the exam will test that you can separate them:</p>' +
         '<ul>' +
         '<li><b>Sampling</b> discretises the signal in <em>time</em> (for audio) or <em>space</em> (for images). Governs resolution / sample rate.</li>' +
         '<li><b>Quantisation</b> discretises the <em>amplitude</em> into a finite number of levels. Governs bit depth.</li>' +
         '</ul>' +
         '<p><b>Nyquist–Shannon sampling theorem:</b> a signal band-limited to <em>f<sub>max</sub></em> can be perfectly reconstructed if sampled at a rate <b>greater than 2·f<sub>max</sub></b>. Sampling below this causes <b>aliasing</b>, where high frequencies masquerade as false low ones.</p>' +
         '<p>Worked consequence: human hearing extends to about 20 kHz, so audio CD sampling is 44.1 kHz — comfortably above 2 × 20 kHz. Telephone speech is band-limited to 4 kHz and sampled at 8 kHz.</p>' +
         '<ul>' +
         '<li>Quantisation with <em>n</em> bits gives <b>2<sup>n</sup> levels</b>. 8-bit = 256 grey levels; 24-bit colour = 8 bits each for R, G and B.</li>' +
         '<li>Uncompressed size = samples × bit depth × channels. For an image: width × height × bit depth.</li>' +
         '<li>Error introduced by rounding to the nearest level is <b>quantisation noise</b>.</li>' +
         '</ul>'
    },
    {
      h: 'Image enhancement: spatial vs frequency domain',
      b: '<p><b>Spatial domain</b> operates directly on pixel values, <em>g(x,y) = T[f(x,y)]</em>.</p>' +
         '<ul>' +
         '<li><b>Point operations:</b> negative, log transform, power-law (gamma) correction, contrast stretching, thresholding.</li>' +
         '<li><b>Histogram equalisation</b> redistributes intensities to spread the histogram, improving global contrast.</li>' +
         '<li><b>Spatial filters (masks/kernels):</b> <em>smoothing</em> — mean/averaging (blurs, reduces noise) and <b>median</b> (non-linear, excellent against salt-and-pepper noise while preserving edges); <em>sharpening</em> — Laplacian, unsharp masking, high-boost; <em>edge detection</em> — Sobel, Prewitt, Roberts (first derivative) and Canny (multi-stage, optimal).</li>' +
         '</ul>' +
         '<p><b>Frequency domain</b> transforms the image (usually by the Fourier transform), multiplies by a filter function, then transforms back.</p>' +
         '<ul>' +
         '<li><b>Low-pass</b> filters attenuate high frequencies → smoothing and blurring.</li>' +
         '<li><b>High-pass</b> filters attenuate low frequencies → sharpening and edge emphasis.</li>' +
         '<li><b>Band-reject / notch</b> filters remove periodic noise — the standard cure for repetitive interference patterns.</li>' +
         '</ul>' +
         '<p>Key idea: <b>edges and fine detail are high frequency; smooth regions are low frequency.</b> Nearly every frequency-domain question resolves from that one sentence.</p>' +
         '<div class="tip"><b>Forensic caution.</b> Enhancement must be <em>reproducible and documented</em>. Work on a copy, record every operation, and never present an enhanced image as the original. Enhancement clarifies what is present; it must not add what was not.</div>'
    },
    {
      h: 'Fourier analysis and the FFT',
      b: '<p>The <b>Fourier transform</b> decomposes a signal into constituent sinusoids, converting a <em>time-domain</em> representation (amplitude vs time) into a <em>frequency-domain</em> one (magnitude vs frequency).</p>' +
         '<ul>' +
         '<li>The <b>DFT</b> is the discrete version; computed naively it costs <b>O(N²)</b>.</li>' +
         '<li>The <b>FFT</b> is an algorithm — not a different transform — that computes the same DFT in <b>O(N log N)</b>. The Cooley–Tukey formulation is the classic.</li>' +
         '<li>A <b>spectrogram</b> shows frequency against time with intensity as magnitude, obtained via the short-time Fourier transform. It is the workhorse display of audio forensics.</li>' +
         '</ul>' +
         '<p>Understand the trade-off: a long analysis window gives good frequency resolution but poor time resolution, and vice versa. You cannot have both — a direct consequence of the uncertainty principle.</p>'
    },
    {
      h: 'Source camera identification',
      b: '<p>Methods, roughly in ascending order of forensic strength:</p>' +
         '<ol>' +
         '<li><b>Metadata (EXIF)</b> — make, model, serial, lens, timestamp, GPS. Easy to read but trivially editable, so it is an investigative lead, not proof.</li>' +
         '<li><b>File structure</b> — JPEG quantisation tables, Huffman tables and thumbnail structure vary by manufacturer and model.</li>' +
         '<li><b>CFA / demosaicing artefacts</b> — sensors use a colour filter array (usually a <b>Bayer</b> pattern); the interpolation algorithm leaves manufacturer-specific traces.</li>' +
         '<li><b>Lens aberration</b> — radial distortion and chromatic aberration characteristic of the optics.</li>' +
         '<li><b>PRNU (Photo-Response Non-Uniformity)</b> — the strongest method. Minute manufacturing variations make each sensor pixel respond slightly differently to identical light. This pattern is stable, survives compression, and functions as a <b>sensor fingerprint</b> capable of identifying an individual camera, not merely a model.</li>' +
         '</ol>'
    },
    {
      h: 'Detecting image and video tampering',
      b: '<p>Tampering types: <b>copy-move</b> (cloning a region within the same image, typically to conceal something), <b>splicing</b> (compositing from a different image), <b>retouching/morphing</b>, and for video, <b>frame insertion, deletion or duplication</b>.</p>' +
         '<p>Detection approaches:</p>' +
         '<ul>' +
         '<li><b>Error Level Analysis (ELA)</b> — resave at known quality and compare; regions edited and resaved compress differently.</li>' +
         '<li><b>Double JPEG compression</b> — a manipulated-and-resaved image shows periodic artefacts in its DCT coefficient histograms.</li>' +
         '<li><b>PRNU inconsistency</b> — a spliced region carries the wrong sensor fingerprint, or none.</li>' +
         '<li><b>Lighting and shadow inconsistency</b>, and inconsistent vanishing points in the geometry.</li>' +
         '<li><b>Block artefact grid misalignment</b> — pasted content rarely aligns to the host\'s 8×8 JPEG grid.</li>' +
         '<li><b>Copy-move detection</b> by block matching or SIFT keypoint matching, which finds near-duplicate regions.</li>' +
         '</ul>' +
         '<p>Note that JPEG uses the <b>Discrete Cosine Transform</b> on 8×8 blocks and is <b>lossy</b>; PNG and GIF are lossless. Excessive compression produces visible <em>blocking</em>, and sharp edges show <em>ringing</em> (Gibbs) artefacts.</p>'
    },
    {
      h: 'Audio forensics',
      b: '<p><b>Acoustic parameters:</b> frequency (perceived as pitch, in Hz), amplitude (perceived as loudness, in dB), timbre (spectral shape), and the speech-specific <b>fundamental frequency F0</b> plus <b>formants</b> (resonances of the vocal tract, F1/F2/F3, which determine vowel identity).</p>' +
         '<p>Typical F0: adult male ≈ 85–180 Hz, adult female ≈ 165–255 Hz. The decibel is logarithmic — <b>+6 dB is roughly double the amplitude</b>, +10 dB is perceived as about twice as loud.</p>' +
         '<p><b>Authentication techniques:</b></p>' +
         '<ul>' +
         '<li><b>ENF (Electrical Network Frequency) analysis</b> — mains hum at 50 Hz in India (60 Hz in North America) is captured by recording equipment and fluctuates minutely over time in a pattern unique to that moment on the grid. Matching the embedded ENF trace against grid records can date a recording and expose edits as discontinuities. This is the single most powerful audio authentication method.</li>' +
         '<li><b>Butt splice detection</b> — abrupt discontinuities in waveform, spectrum or background noise floor.</li>' +
         '<li><b>Background noise consistency</b> and reverberation profile across the recording.</li>' +
         '<li><b>Compression history</b> — traces of prior lossy encoding in a supposedly original file.</li>' +
         '</ul>' +
         '<p><b>Enhancement:</b> spectral subtraction and adaptive filtering for noise reduction, band-pass filtering to isolate speech, notch filtering to remove tonal hum, and dereverberation. As with images, enhancement must be documented and never overwrite the original.</p>'
    },
    {
      h: 'Colour spaces and chroma subsampling',
      b: '<p><b>RGB</b> is an additive colour space (red, green, blue channels of equal resolution and importance) used for capture and display. Compression, however, almost always converts to <b>YCbCr</b>: a <b>luma</b> channel Y (brightness) plus two <b>chroma</b> channels Cb and Cr (colour difference).</p>' +
         '<p>The reason: the human visual system is far more sensitive to changes in brightness than in colour. Once brightness and colour are separated, chroma can be sampled at reduced resolution with little visible loss — this is <b>chroma subsampling</b>.</p>' +
         '<table><tr><th>Notation</th><th>Meaning</th><th>Typical use</th></tr>' +
         '<tr><td>4:4:4</td><td>No subsampling — chroma at full resolution</td><td>High-end video mastering</td></tr>' +
         '<tr><td>4:2:2</td><td>Chroma halved horizontally only</td><td>Broadcast video</td></tr>' +
         '<tr><td>4:2:0</td><td>Chroma halved both horizontally and vertically (quarter resolution)</td><td>JPEG, most consumer video (H.264/HEVC)</td></tr></table>' +
         '<div class="tip"><b>Exam trap.</b> Subsampling reduces <em>colour</em> resolution, not brightness/luma resolution and not bit depth. It is a resolution trick applied after the RGB→YCbCr conversion, distinct from quantisation (which reduces the number of amplitude/intensity levels) and from lossy DCT quantisation (which discards high-frequency coefficients).</div>'
    },
    {
      h: 'Image and video file formats and compression',
      b: '<p><b>Lossless</b> formats reconstruct the original data exactly: <b>PNG</b> (DEFLATE, supports transparency), <b>GIF</b> (256-colour indexed palette, LZW compression, supports simple animation), <b>BMP</b> (typically uncompressed) and <b>TIFF</b> (often uncompressed or lossless LZW — the archival choice in forensic labs since repeated re-saves cause no generational loss).</p>' +
         '<p><b>Lossy</b> compression discards information judged perceptually unimportant: baseline <b>JPEG</b> (DCT on 8×8 blocks + quantisation, described in the tampering note) and <b>JPEG 2000</b> (wavelet-based, better quality at low bitrates, no 8×8 blocking).</p>' +
         '<p>For video, distinguish the <b>container</b> — the wrapper file format bundling video, audio, subtitle and metadata streams (MP4, AVI, MKV, MOV) — from the <b>codec</b>, the algorithm that actually encodes/decodes each stream (H.264/AVC, H.265/HEVC, MPEG-4, VP9). The same container can carry streams from different codecs, and a file can be re-wrapped into a new container without touching codec-level compression.</p>' +
         '<p>Video codecs exploit temporal redundancy via a <b>Group of Pictures (GOP)</b>: <b>I-frames</b> (intra-coded, independently decodable, like a standalone still image), <b>P-frames</b> (predicted from a prior frame) and <b>B-frames</b> (predicted from both prior and future frames). P/B-frames are much smaller but cannot stand alone — which is exactly why frame insertion, deletion or duplication disrupts the GOP structure and leaves detectable motion-vector and re-encoding artefacts near the edit point.</p>'
    },
    {
      h: 'EXIF and embedded metadata forensics',
      b: '<p><b>EXIF (Exchangeable Image File Format)</b> data embedded in JPEG/TIFF files typically records camera make and model, lens, exposure settings, orientation, a <b>DateTimeOriginal</b> timestamp, GPS coordinates (if location services were enabled), and a <b>Software</b> tag.</p>' +
         '<ul>' +
         '<li>The <b>Software</b> tag is often overwritten by editing applications (Photoshop, GIMP, etc.) when a file is re-saved — a useful lead that a "camera original" has actually been processed.</li>' +
         '<li>Many cameras embed a small <b>thumbnail</b> inside the EXIF block. If the thumbnail and the full-resolution image show different content, the file has almost certainly been edited after the thumbnail was generated — a classic "thumbnail mismatch" giveaway.</li>' +
         '<li>Tools such as <b>ExifTool</b> read and can also strip or forge EXIF fields, so metadata is corroborating evidence, never standalone proof.</li>' +
         '</ul>' +
         '<div class="tip"><b>Exam trap.</b> A missing EXIF block is <em>not</em> itself evidence of tampering — social media platforms and messaging apps (WhatsApp, Instagram, etc.) routinely strip metadata on upload as standard practice. Absence of metadata must never be read as proof of manipulation; fall back on PRNU, file-structure and compression-history analysis instead.</div>'
    },
    {
      h: 'Video-specific tampering and authentication',
      b: '<p>Beyond frame-level insertion/deletion/duplication (covered under GOP structure), video carries its own authentication cues:</p>' +
         '<ul>' +
         '<li><b>Interlacing artefacts ("combing")</b> — interlaced capture records alternating odd/even scan-line fields at slightly different instants; combining them into one frame during motion produces jagged, comb-like edges. Recognising this rules out confusing it with compression or subsampling defects.</li>' +
         '<li><b>Double compression / re-encoding artefacts</b> — a video that has been edited and re-exported shows periodicities in macroblock statistics and GOP length, the video analogue of double-JPEG DCT-histogram analysis for stills.</li>' +
         '<li><b>Container-level metadata inconsistency</b> — creation vs modification timestamps, encoder tags and embedded GPS/device info in the container can conflict with the codec-level encoding history if the file has been re-wrapped or partially re-encoded.</li>' +
         '<li><b>PRNU for video</b> — the same sensor-fingerprint technique used for still images applies frame-by-frame to video and can both identify the source camera and flag frames whose fingerprint is missing or inconsistent (evidence of splicing or frame substitution).</li>' +
         '</ul>' +
         '<p>Enhancement of video follows the same still-image principles (documented, reversible, on a working copy) plus temporal techniques: frame averaging/stacking to reduce noise, motion-compensated deinterlacing, and stabilisation — none of which may alter evidentiary content.</p>'
    }
  ],

  questions: [
    { q: 'According to the Nyquist sampling theorem, a signal containing frequencies up to 4 kHz must be sampled at a rate greater than',
      o: ['2 kHz', '4 kHz', '8 kHz', '16 kHz'], a: 2,
      e: '<p>The minimum is <b>twice the highest frequency component</b>: 2 × 4 kHz = <b>8 kHz</b>. Telephone systems band-limit speech to about 4 kHz and sample at exactly 8 kHz for this reason.</p><p>Sampling below the Nyquist rate causes <b>aliasing</b>, where high-frequency content is irreversibly folded down and appears as spurious low frequencies.</p>' },

    { q: 'In the digitisation of an analogue signal, quantisation refers to discretising the',
      o: ['Signal in time', 'Signal in amplitude', 'Signal in phase', 'Sampling rate'], a: 1,
      e: '<p><b>Sampling</b> discretises time (or space); <b>quantisation</b> discretises <b>amplitude</b> into a finite set of levels.</p><p>The two are independent: sample rate determines bandwidth, bit depth determines dynamic range and quantisation noise. Confusing them is the standard error in this topic.</p>' },

    { q: 'PRNU (Photo-Response Non-Uniformity) is used in multimedia forensics to',
      o: ['Compress images without loss', 'Identify the specific camera sensor that captured an image',
          'Detect the presence of steganographic payloads', 'Enhance low-light photographs'], a: 1,
      e: '<p>PRNU arises from microscopic manufacturing imperfections that make each sensor pixel respond slightly differently to identical illumination. The resulting pattern is stable over the sensor\'s life and acts as a <b>sensor fingerprint</b>.</p><p>Crucially it identifies an <b>individual camera</b>, not just the make and model — which EXIF, quantisation tables and lens characteristics cannot do. It also survives moderate JPEG compression.</p>' },

    { q: 'The Fast Fourier Transform (FFT) reduces the computational complexity of the Discrete Fourier Transform from',
      o: ['O(N) to O(log N)', 'O(N²) to O(N log N)', 'O(N³) to O(N²)', 'O(2^N) to O(N²)'], a: 1,
      e: '<p>A direct DFT computation is <b>O(N²)</b>; the FFT achieves <b>O(N log N)</b> by recursively splitting the transform (Cooley–Tukey).</p><p>Remember that the FFT is an <em>algorithm</em>, not a different transform — it produces exactly the same coefficients as the DFT, just far faster. Options phrased as "the FFT is more accurate than the DFT" are always wrong.</p>' },

    { q: 'Which filter is most effective at removing salt-and-pepper noise while preserving edges?',
      o: ['Mean (averaging) filter', 'Median filter', 'Gaussian low-pass filter', 'Laplacian filter'], a: 1,
      e: '<p>The <b>median filter</b> is a non-linear order-statistic filter. Because an extreme impulse value is never the median of its neighbourhood, it is discarded outright rather than averaged in.</p><p>A mean filter <em>spreads</em> each impulse across the neighbourhood and blurs edges; the Laplacian is a sharpening operator that amplifies noise.</p>' },

    { q: 'In frequency-domain image processing, a high-pass filter is used primarily for',
      o: ['Noise smoothing', 'Edge sharpening', 'Contrast stretching', 'Removing periodic noise'], a: 1,
      e: '<p>Edges and fine detail are <b>high-frequency</b> content, so passing high frequencies emphasises them — sharpening. Low-pass filtering does the opposite and smooths.</p><p>Removing <em>periodic</em> noise is the job of a <b>band-reject or notch</b> filter, because periodic noise appears as discrete spikes at specific frequencies rather than across the whole high band.</p>' },

    { q: 'ENF (Electrical Network Frequency) analysis authenticates an audio recording by',
      o: ['Measuring the speaker\'s fundamental frequency',
          'Comparing embedded mains-hum fluctuations against grid frequency records',
          'Detecting the microphone\'s frequency response curve',
          'Analysing the reverberation time of the room'], a: 1,
      e: '<p>Mains supply frequency (<b>50 Hz in India</b>, 60 Hz in North America) drifts minutely and unpredictably around its nominal value. Recording equipment picks up this hum, embedding a time-stamped signature that can be matched against grid records.</p><p>It can both <b>date</b> a recording and expose <b>edits</b>, since a splice creates a discontinuity in the otherwise continuous ENF trace.</p>' },

    { q: 'JPEG compression is based on which transform?',
      o: ['Discrete Fourier Transform', 'Discrete Cosine Transform', 'Discrete Wavelet Transform', 'Hadamard Transform'], a: 1,
      e: '<p>Baseline JPEG applies the <b>DCT</b> to 8×8 pixel blocks, then quantises the coefficients — which is where the loss occurs — and entropy-codes the result.</p><p>JPEG 2000 uses the <b>Discrete Wavelet Transform</b> instead, so read the question carefully. The 8×8 block structure of baseline JPEG is what produces visible <em>blocking</em> artefacts and underpins block-grid tamper detection.</p>' },

    { q: 'An 8-bit greyscale image can represent how many distinct intensity levels?',
      o: ['8', '128', '256', '512'], a: 2,
      e: '<p><b>2⁸ = 256</b> levels, conventionally 0 (black) to 255 (white).</p><p>Extend the arithmetic: 24-bit colour allots 8 bits each to R, G and B, giving 256³ ≈ 16.7 million colours. Size calculations follow the same pattern — a 1024×768 24-bit uncompressed image is 1024 × 768 × 3 bytes ≈ 2.25 MB.</p>' },

    { q: 'Copy-move forgery in a digital image involves',
      o: ['Compositing a region taken from a different image',
          'Duplicating a region from within the same image',
          'Altering the EXIF metadata only',
          'Re-encoding the image at a lower quality'], a: 1,
      e: '<p><b>Copy-move</b> duplicates a region <em>within the same image</em>, typically to conceal an object by pasting nearby background over it. Because the source and destination share the same sensor noise, illumination and compression history, many cross-image detectors fail — hence dedicated block-matching or SIFT keypoint methods.</p><p>Compositing from a <em>different</em> image is <b>splicing</b>, which is the contrast the question is drawing.</p>' },

    { q: 'Aliasing in a digitised signal occurs when',
      o: ['The bit depth is too low', 'The sampling rate is below twice the highest frequency present',
          'The signal is over-amplified', 'Lossy compression is applied twice'], a: 1,
      e: '<p>Sampling below the Nyquist rate folds high-frequency components down into the represented band, where they appear as false low frequencies. The damage is <b>irreversible</b> — no post-processing can separate the aliased content from genuine signal.</p><p>Insufficient <em>bit depth</em> causes quantisation noise, a different defect entirely.</p>' },

    { q: 'Formants in speech analysis are',
      o: ['The fundamental frequency of vocal fold vibration',
          'Resonant frequencies of the vocal tract that characterise vowel sounds',
          'The sampling frequencies used in recording',
          'Periodic noise artefacts introduced by compression'], a: 1,
      e: '<p><b>Formants</b> (F1, F2, F3…) are vocal-tract resonances and determine which vowel is heard. The <b>fundamental frequency F0</b> is the rate of vocal fold vibration, perceived as pitch — that is option (a), a deliberate near-miss.</p><p>On a spectrogram formants appear as dark horizontal bands; their trajectories are central to forensic speaker comparison.</p>' },

    { q: 'Histogram equalisation is a technique used to',
      o: ['Remove periodic noise', 'Improve global contrast by redistributing intensity values',
          'Detect copy-move forgeries', 'Compress an image losslessly'], a: 1,
      e: '<p>Histogram equalisation spreads a narrow, bunched intensity histogram across the full available range, improving <b>global contrast</b>. It is a spatial-domain point operation.</p><p>Forensic caveat: it alters pixel values, so it must be performed on a working copy with the operation documented, never on the original evidence file.</p>' },

    { q: 'In video compression, which frame type is encoded independently of any other frame and can be decoded on its own?',
      o: ['P-frame', 'B-frame', 'I-frame', 'GOP-frame'], a: 2,
      e: '<p>An <b>I-frame (intra-coded)</b> is compressed using only information within itself, like a standalone JPEG, and needs no reference to any other frame to decode. It anchors the Group of Pictures (GOP).</p><p><b>P-frames</b> (predictive) reference the preceding frame and <b>B-frames</b> (bi-directional) reference both preceding and following frames — both are far smaller than an I-frame but cannot be decoded alone, which is exactly why deleting or inserting a frame disturbs the whole GOP and leaves a detectable structural discontinuity.</p>' },

    { q: 'Deleting a single frame from the middle of a compressed video stream is forensically significant chiefly because it',
      o: ['Changes the video\'s colour space from YCbCr to RGB',
          'Disrupts the GOP prediction structure, producing detectable discontinuities in motion vectors and re-encoding artefacts',
          'Automatically strips all EXIF metadata from the file',
          'Converts I-frames into B-frames'], a: 1,
      e: '<p>Because P- and B-frames are predicted from neighbouring frames, removing or inserting a frame breaks the prediction chain. The stream must be re-encoded around the edit point, leaving traces such as an irregular GOP length, motion-vector inconsistencies and double-compression artefacts near the splice — the video analogue of double-JPEG detection.</p><p>Colour space and EXIF are unrelated to frame-level editing; they are separate metadata/encoding layers.</p>' },

    { q: 'Chroma subsampling at a ratio of 4:2:0 (used in JPEG and most consumer video) works by',
      o: ['Discarding every fourth pixel entirely', 'Sampling luma at full resolution but chroma at reduced horizontal and vertical resolution',
          'Reducing the bit depth of the luma channel only', 'Sampling all three channels at identical reduced resolution'], a: 1,
      e: '<p>4:2:0 keeps <b>luma (Y)</b> — brightness — at full resolution while sampling the two <b>chroma channels (Cb, Cr)</b> at half resolution both horizontally and vertically, exploiting the fact that the human eye is far more sensitive to brightness detail than to colour detail.</p><p>This is why JPEG and most video codecs convert RGB to <b>YCbCr</b> before compressing: it lets you throw away chroma information cheaply without a visible quality loss, something not possible if you subsampled R, G and B directly.</p>' },

    { q: 'JPEG and most video codecs internally convert images from RGB to which colour space before compression?',
      o: ['CMYK', 'HSV', 'YCbCr', 'Lab'], a: 2,
      e: '<p><b>YCbCr</b> separates a luma (brightness) component, Y, from two chroma (colour-difference) components, Cb and Cr. This separation is what makes chroma subsampling and differential quantisation of colour vs brightness possible.</p><p>RGB, by contrast, mixes brightness and colour information across all three channels equally, so none of them can be discarded cheaply — which is precisely why compression pipelines convert to YCbCr first.</p>' },

    { q: 'A GIF image is limited to a maximum of how many colours per frame, and uses which lossless compression scheme?',
      o: ['16 colours; run-length encoding', '256 colours; LZW', '65,536 colours; Huffman coding', '16.7 million colours; DEFLATE'], a: 1,
      e: '<p>GIF uses an indexed <b>palette of at most 256 colours</b> (8-bit) and compresses it with <b>LZW (Lempel–Ziv–Welch)</b>, a lossless dictionary-based scheme — no information is discarded beyond the initial palette reduction.</p><p>PNG, by contrast, supports full 24-bit (or 32-bit with alpha) colour and uses <b>DEFLATE</b> compression; both PNG and GIF are lossless, unlike baseline JPEG.</p>' },

    { q: 'TIFF is commonly preferred over JPEG for archival storage of forensic image evidence chiefly because it',
      o: ['Produces smaller file sizes', 'Supports uncompressed or lossless storage, avoiding repeated generational quality loss',
          'Is the only format that stores EXIF data', 'Automatically embeds a PRNU fingerprint'], a: 1,
      e: '<p>TIFF commonly stores image data <b>uncompressed or with lossless compression</b> (e.g. LZW), so repeated opening and saving introduces no cumulative quality degradation — critical when an image must be re-examined multiple times across an investigation.</p><p>JPEG is lossy, so every re-save incurs fresh generation loss and — usefully for tamper detection — leaves the double-compression artefacts discussed under image tampering. TIFF files can carry EXIF too, and neither format inherently embeds PRNU, which is a sensor property, not a file-format feature.</p>' },

    { q: 'In video file terminology, the distinction between a "container" (e.g. MP4, AVI, MKV) and a "codec" (e.g. H.264, HEVC) is that the',
      o: ['Container is the compression algorithm and the codec is the wrapper file', 'Container and codec are two names for the same thing',
          'Container is the wrapper file format holding video/audio/subtitle streams, while the codec defines how those streams are encoded/decoded',
          'Container refers only to audio streams and codec only to video streams'], a: 2,
      e: '<p>A <b>container</b> (MP4, AVI, MKV, MOV) is a file format that bundles video, audio, subtitle and metadata streams together. The <b>codec</b> (H.264, HEVC, MPEG-4, VP9) is the algorithm that actually compresses/decompresses each stream. The same container can hold streams encoded with different codecs.</p><p>This matters forensically: a file can be re-wrapped into a different container without re-encoding the underlying stream, so container metadata (creation tool, timestamps) can legitimately differ from the codec-level encoding history — the two must be examined separately.</p>' },

    { q: 'The EXIF "Software" tag is forensically useful in source/authentication analysis chiefly because it',
      o: ['Records the exact GPS coordinates of capture', 'Can reveal that the file was processed by an image-editing application after capture',
          'Stores the camera\'s serial number', 'Is impossible to alter or remove'], a: 1,
      e: '<p>When an image is opened and re-saved by editing software (e.g. Photoshop, GIMP), that application typically overwrites the EXIF <b>Software</b> tag with its own name/version — a strong indicator that the file is not a straight-from-camera original, even before any pixel-level analysis is done.</p><p>It is easily edited or stripped, however, so like all EXIF fields it is a <em>lead</em>, not proof; its <em>absence</em> is not itself suspicious, since many platforms (social media, messaging apps) strip metadata on upload as routine practice.</p>' },

    { q: 'A forensic analyst finds that a JPEG allegedly straight from a smartphone camera has no EXIF metadata at all. This most likely indicates',
      o: ['Conclusive proof the image has been tampered with', 'Nothing conclusive by itself — metadata is commonly stripped by messaging apps and social media on upload/download',
          'That the image was captured in RAW format', 'That the sensor lacked a Bayer colour filter array'], a: 1,
      e: '<p>Platforms such as WhatsApp, Facebook, Instagram and Twitter routinely strip EXIF metadata for privacy and bandwidth reasons during upload/re-encoding, so a missing EXIF block on a widely shared image is common and not, by itself, evidence of tampering.</p><p>The correct forensic posture is to treat missing metadata as inconclusive and fall back on file-structure, PRNU or compression-history analysis rather than metadata alone — the trap here is treating absence of evidence as evidence of manipulation.</p>' },

    { q: '"Combing" artefacts — visible horizontal serration along moving edges — in a video frame are a sign of',
      o: ['Chroma subsampling', 'Interlaced video where two temporally distinct fields are combined into one frame',
          'PRNU sensor noise', 'Excessive JPEG quantisation'], a: 1,
      e: '<p>Interlaced video captures alternating odd and even scan lines (fields) at slightly different moments in time. When both fields are displayed together as one progressive frame and there is motion between them, the offset produces a jagged, comb-like edge — "combing".</p><p>This is a capture/display artefact, unrelated to chroma subsampling (a colour-resolution reduction) or JPEG quantisation (a still-image compression loss); recognising it correctly rules out those other causes when a frame looks torn.</p>' },

    { q: 'Standard CD-quality audio uses a bit depth of 16 bits per sample, giving how many distinct amplitude levels?',
      o: ['256', '4,096', '65,536', '16,777,216'], a: 2,
      e: '<p>16-bit quantisation gives <b>2<sup>16</sup> = 65,536</b> distinct amplitude levels — the same doubling logic as an 8-bit image giving 256 grey levels, just applied to amplitude instead of intensity.</p><p>Professional audio-for-video work commonly steps up to 24-bit depth (over 16 million levels) for a larger dynamic-range margin before mixing, later dithered down for delivery.</p>' },

    { q: 'Professional video production audio is typically sampled at 48 kHz rather than the 44.1 kHz used for music CDs mainly because',
      o: ['48 kHz is required by the Nyquist theorem for any signal', '48 kHz was adopted as a video-industry standard offering a cleaner relationship to film/video frame rates and easier synchronisation',
          '44.1 kHz cannot represent frequencies above 4 kHz', '48 kHz uses a lower bit depth than 44.1 kHz'], a: 1,
      e: '<p>Both 44.1 kHz and 48 kHz comfortably satisfy the Nyquist theorem for the ~20 kHz range of human hearing; the choice between them is a historical/industry-standard one, not a theorem requirement. 48 kHz became the broadcast/video-production standard because it divides more cleanly against common video frame rates, easing audio-video sync.</p><p>The trap: candidates sometimes assume a higher sample rate implies the lower one is theorem-deficient — bit depth and sample rate are independent parameters, and neither figure here says anything about bit depth.</p>' },

    { q: 'PRNU-based source identification, originally developed for still images, can also be applied to video by',
      o: ['Comparing the sensor-noise fingerprint frame-by-frame, which can also flag frames whose fingerprint is missing or inconsistent',
          'Analysing the video container\'s creation timestamp only', 'Measuring the video\'s frame rate against the camera\'s rated maximum',
          'Comparing the audio track\'s ENF signature to grid records'], a: 0,
      e: '<p>PRNU is a property of the image sensor itself, so the same fixed-pattern noise fingerprint is present in every frame a camera captures. Extracting and correlating this fingerprint frame-by-frame both identifies the source camera and can localise frames or regions whose fingerprint is absent or inconsistent — a sign of splicing or frame substitution.</p><p>Container timestamps, frame rate and ENF are all separate authentication channels (container metadata, capture-rate consistency, and audio-specific analysis respectively) and do not substitute for a sensor-level fingerprint check.</p>' }
  ]
});
