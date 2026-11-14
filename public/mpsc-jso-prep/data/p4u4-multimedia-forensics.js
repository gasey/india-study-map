window.MPSC.units.push({
  id: 'p4u4',
  paper: 'Paper IV — Cyber Forensic',
  title: 'Multimedia Forensics',
  marks: 40,
  syllabus: 'Understand the Fundamentals of Multimedia Forensics, including its role in digital forensics. Introduction to digital signals: audio, image and video, Digitization process: sampling and quantization, Image Enhancement Techniques: Spatial and frequency domain. Methods of source camera identification, Methods for tampering of digital image/video, Forensic authentication of digital image/video, Enhancement of digital image/video. Audio forensics - Acoustic Parameters of Sound, Fourier Analysis, Frequency and Time Domain Representation of Speech Signal, Fast Fourier Transform, Methods of tampering for digital audio, Forensic authentication of digital audio, Enhancement of digital audio.',

  notes: [
    {
      h: 'Digitisation: sampling, quantisation, Nyquist & aliasing',
      b: '<p>Converting a continuous real-world analogue signal (sound wave, light intensity) into a digital file requires two distinct, independent operations in an Analogue-to-Digital Converter (ADC):</p>' +
         '<div class="diagram"><div class="diag-title">The Digitisation Pipeline: Continuous Analogue → Discrete Digital</div>' +
         '<div class="flow-row">' +
         '<div class="flow-step"><b>Analogue Signal $x(t)$</b><small>Continuous in time &amp; amplitude</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>Anti-Aliasing Low-Pass Filter</b><small>Strips frequencies above $f_s/2$</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>1. Sampling</b><small>Discretises TIME (or SPACE)</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>2. Quantisation</b><small>Discretises AMPLITUDE into $2^b$ levels</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>Binary Encoding (PCM)</b><small>Bit stream</small></div>' +
         '</div></div>' +
         '<div class="analogy"><b>💡 Analogy — Tracing a Mountain Range on Graph Paper:</b> Imagine sketching a smooth mountain range onto grid paper. <b>Sampling</b> is how closely spaced your <em>vertical grid lines</em> are along the horizontal distance axis (horizontal resolution). <b>Quantisation</b> is how finely spaced your <em>horizontal altitude marks</em> are on the vertical axis (bit depth). If your vertical grid lines are too far apart (undersampling), a sharp narrow peak between two grid lines disappears completely or looks like a gentle hill (<b>aliasing</b>). If your horizontal altitude marks are only every 500 metres (low bit depth), smooth slopes turn into blocky staircase steps (<b>quantisation noise / posterisation / false contouring</b>)!</div>' +
         '<ul>' +
         '<li><b>Nyquist–Shannon Sampling Theorem:</b> To reconstruct a band-limited signal having maximum frequency $f_{\\max}$ without loss, the sampling rate $f_s$ must satisfy: $$f_s \\ge 2 \\cdot f_{\\max}$$ Here $2 f_{\\max}$ is the <b>Nyquist rate</b>, and $f_N = f_s / 2$ is the <b>Nyquist (folding) frequency</b>.</li>' +
         '<li><b>Aliasing (Undersampling):</b> If a frequency component $f > f_s/2$ enters the sampler without first being blocked by an analogue <b>anti-aliasing low-pass filter</b>, it folds back across $f_s/2$ and masquerades irreversibly as a false lower alias frequency: $$f_{\\text{alias}} = |f - k \\cdot f_s| \\quad \\text{(chosen so } f_{\\text{alias}} \\le f_s/2\\text{)}$$ Visually, spatial aliasing appears as jagged staircase edges ("jaggies"), Moiré patterns on striped shirts, or the wagon-wheel effect in video where spokes appear to spin backward!</li>' +
         '<li><b>Quantisation &amp; Dynamic Range (SQNR):</b> Quantising with $b$ bits per sample yields $L = 2^b$ discrete levels. Each additional bit doubles the amplitude resolution and improves the Signal-to-Quantisation-Noise Ratio (SQNR) by approximately <b>$6.02\\text{ dB}$ per bit</b>: $$\\text{SQNR}_{\\text{dB}} \\approx 6.02 \\cdot b + 1.76\\text{ dB}$$ (So 16-bit CD audio has $65,536$ levels and $\\approx 98\\text{ dB}$ dynamic range.)</li>' +
         '</ul>' +
         '<div class="example"><b>🔬 Worked Numericals — Aliasing Frequency &amp; Uncompressed Media File Size:</b><br>' +
         '<b>Problem 1 (Aliasing):</b> An audio recorder samples at $f_s = 8000\\text{ Hz}$ (Nyquist folding frequency $f_s/2 = 4000\\text{ Hz}$). If a pure $5500\\text{ Hz}$ whistle enters un-filtered, what frequency is heard in the recording?<br>' +
         '• $f_{\\text{alias}} = |5500 - 8000| =$ <b>2500 Hz</b>! (Once recorded, no digital filter can undo this.)<br>' +
         '<b>Problem 2 (Uncompressed Audio Size):</b> Calculate the size of a 1-minute (60 s) uncompressed stereo (2-channel) WAV file recorded at $44.1\\text{ kHz}$, 16-bit:<br>' +
         '• $\\text{Bytes} = \\text{Sample Rate} \\times \\text{Bytes/Sample} \\times \\text{Channels} \\times \\text{Time} = 44,100 \\times 2\\text{ B} \\times 2 \\times 60\\text{ s} = 10,584,000\\text{ bytes} \\approx$ <b>10.09 MB</b>.<br>' +
         '<b>Problem 3 (Uncompressed Image Size):</b> A $1920 \\times 1080$ Full-HD 24-bit RGB BMP image $= 1920 \\times 1080 \\times 3\\text{ bytes} = 6,220,800\\text{ bytes} \\approx$ <b>5.93 MB</b>.</div>'
    },
    {
      h: 'Image enhancement: spatial vs frequency domain',
      b: '<div class="vs-grid">' +
         '<div class="vs-card"><h4>Spatial Domain ($g(x,y) = T[f(x,y)]$)</h4><p>Manipulates the <b>pixel intensity matrix directly</b> via point operations (contrast stretching, gamma $s = c r^\\gamma$, histogram equalisation) or sliding a $3\\times 3$ / $5\\times 5$ convolution mask (kernel) across every pixel\'s neighbourhood.</p></div>' +
         '<div class="vs-card"><h4>Frequency Domain ($G(u,v) = H(u,v) \\cdot F(u,v)$)</h4><p>Transforms the image via 2D DFT/FFT into spatial frequencies, multiplies by a filter transfer function $H(u,v)$, and applies the Inverse FFT. Remember: <b>Smooth flat background = Low Frequency; Sharp edges, text &amp; fine grain noise = High Frequency!</b></p></div>' +
         '</div>' +
         '<table>' +
         '<tr><th>Filter / Operation</th><th>Domain &amp; Type</th><th>Forensic Use Case &amp; Behaviour</th></tr>' +
         '<tr><td><b>Histogram Equalisation</b></td><td>Spatial (Point)</td><td>Spreads a narrow clustered intensity histogram across $0\\text{–}255$ using the Cumulative Distribution Function (CDF) to reveal detail in dark/overexposed CCTV frames.</td></tr>' +
         '<tr><td><b>Mean (Box) / Gaussian Filter</b></td><td>Spatial (Linear Low-Pass)</td><td>Replaces centre pixel with average of neighbourhood; smooths Gaussian sensor noise but <b>blurs sharp edges</b>.</td></tr>' +
         '<tr><td><b>Median Filter</b></td><td>Spatial (<b>Non-linear</b> Order-Statistic)</td><td>Sorts neighbourhood intensities and picks the middle value; <b>completely eliminates Salt-and-Pepper (impulse) noise while preserving sharp edges</b>!</td></tr>' +
         '<tr><td><b>Sobel / Prewitt / Roberts</b></td><td>Spatial (1st-Derivative Gradient)</td><td>Computes first derivative $|\\nabla f|$; highlights prominent edges (e.g., vehicle licence plate boundaries).</td></tr>' +
         '<tr><td><b>Laplacian / Unsharp Mask</b></td><td>Spatial (2nd-Derivative $\\nabla^2 f$)</td><td>Isotropic sharpening filter that accentuates fine edges and crisp text, though sensitive to noise.</td></tr>' +
         '<tr><td><b>Canny Edge Detector</b></td><td>Spatial (Multi-stage optimal)</td><td>Gaussian smoothing $\\to$ gradient magnitude/angle $\\to$ non-maximum suppression $\\to$ double-threshold hysteresis.</td></tr>' +
         '<tr><td><b>Band-Reject / Notch Filter</b></td><td>Frequency Domain</td><td>Surgically zeroes out specific frequency spikes to <b>remove periodic interference</b> (e.g., CCTV power-line hum bars or halftone scan patterns).</td></tr>' +
         '</table>' +
         '<div class="example"><b>🔬 Worked Numerical — Why a $3\\times 3$ Median Filter Beats a Mean Filter on Impulse Noise:</b><br>' +
         'Consider a uniform dark grey region of an image with pixel values around 50, corrupted at the centre by a single white "salt" noise spike of <b>255</b>:<br>' +
         '$$\\begin{bmatrix} 50 & 52 & 48 \\\\ 50 & \\mathbf{255} & 50 \\\\ 49 & 51 & 50 \\end{bmatrix}$$' +
         '• <b>$3\\times 3$ Mean (Averaging) Filter:</b> Sums all 9 pixels and divides by 9: $(50+52+48+50+255+50+49+51+50)/9 = 655 / 9 = \\mathbf{72.8 \\approx 73}$. The noise spike contaminates the output and blurs into neighbours!<br>' +
         '• <b>$3\\times 3$ Median Filter:</b> Sorts the 9 values in ascending order: <code>[48, 49, 50, 50, <b>50</b>, 50, 51, 52, 255]</code> and picks the 5th (middle) value $= \\mathbf{50}$! The 255 impulse outlier is pushed to the extreme end of the sorted list and discarded completely!</div>' +
         '<div class="tip"><b>⚠️ SWGDE / Forensic Enhancement Rule:</b> Never enhance the original evidence file! Always work on a verified hash-matched working copy, keep an exact repeatable audit log of every filter parameter applied (ACPO Principle 3), and present the original and enhanced exhibits side-by-side in court.</div>'
    },
    {
      h: 'Fourier analysis, DFT vs FFT & the STFT Time-Frequency trade-off',
      b: '<ul>' +
         '<li><b>Fourier Transform (FT / DFT):</b> states that any periodic or finite-duration time-domain signal $x(t)$ can be decomposed into a sum of sinusoids of different frequencies, amplitudes, and phases.</li>' +
         '<li><b>DFT vs FFT Complexity:</b> Computing an $N$-point Discrete Fourier Transform (DFT) directly from its definition requires $N^2$ complex multiplications: <b>$O(N^2)$</b>. The <b>Fast Fourier Transform (FFT)</b> (Cooley–Tukey, 1965) is a divide-and-conquer algorithm that computes the <em>exact same mathematical result</em> in <b>$O(N \\log_2 N)$</b> operations! For $N = 1024$ ($2^{10}$), DFT takes $1,048,576$ operations while FFT takes only $10,240$ — a $100\\times$ speedup!</li>' +
         '<li><b>Short-Time Fourier Transform (STFT) &amp; Gabor Uncertainty Principle:</b> A standard FFT over an entire 5-minute audio clip tells you <em>which</em> frequencies existed, but loses all information about <em>when</em> each word was spoken. The <b>STFT</b> slides a short window function (Hamming/Hann window of length $W$) along the signal to produce a 2D <b>Spectrogram</b>:</li>' +
         '</ul>' +
         '<div class="vs-grid">' +
         '<div class="vs-card"><h4>Wide-Band Spectrogram (Short Window, ~3–5 ms)</h4><p>• <b>Excellent Time Resolution</b> (sharp vertical glottal pulse striations), poor Frequency Resolution.<br>• Smeared horizontally across frequencies so individual harmonics merge into broad dark bands.<br>• <b>Forensic favourite for measuring vocal-tract Formant trajectories (F1, F2, F3)!</b></p></div>' +
         '<div class="vs-card"><h4>Narrow-Band Spectrogram (Long Window, ~20–40 ms)</h4><p>• <b>Excellent Frequency Resolution</b> (resolves individual horizontal harmonic lines $F_0, 2F_0, 3F_0$ and 50 Hz ENF hum), poor Time Resolution.<br>• Smeared across rapid plosive consonants.<br>• <b>Forensic favourite for measuring exact pitch $F_0$ and 50 Hz ENF traces!</b></p></div>' +
         '</div>'
    },
    {
      h: 'Source camera identification (EXIF, Quantisation Tables, Bayer CFA, PRNU)',
      b: '<p>When an investigator needs to prove which camera or smartphone captured a photograph (e.g., linking an anonymous ransom photo or CSAM image to a suspect\'s seized phone), five forensic layers are examined in increasing order of evidentiary strength:</p>' +
         '<div class="stack-diagram">' +
         '<div class="stack-layer"><b>Level 5 (Strongest — Individual Device Match): PRNU Sensor Fingerprint</b><span>Identifies the exact physical sensor chip (survives JPEG compression &amp; EXIF stripping!)</span></div>' +
         '<div class="stack-layer"><b>Level 4 (Sensor Defect Match): Dead / Hot / Stuck Pixels</b><span>Fixed defective pixel coordinates shared across photos from the same camera</span></div>' +
         '<div class="stack-layer"><b>Level 3 (Model/Pipeline Match): Bayer CFA Demosaicing &amp; Lens Aberration</b><span>Interpolation correlations from the RGGB (50% Green, 25% Red, 25% Blue) filter array</span></div>' +
         '<div class="stack-layer"><b>Level 2 (Brand/Firmware Match): JPEG Quantisation &amp; Huffman Tables</b><span>Custom 8×8 DQT matrices hardcoded in camera firmware vs Photoshop/WhatsApp profiles</span></div>' +
         '<div class="stack-layer"><b>Level 1 (Weakest — Easily Forged/Stripped): EXIF Metadata &amp; Thumbnail</b><span>Camera Make/Model, Serial, GPS, DateTimeOriginal, Software tag</span></div>' +
         '</div>' +
         '<div class="clarity"><b>⚡ Concept Clarity — Why Bayer CFA Has 50% Green Pixels (RGGB) &amp; How PRNU Works:</b><br>' +
         '• <b>Bayer Colour Filter Array (CFA):</b> A raw CMOS/CCD photodiode only measures monochrome light intensity (brightness). To capture colour, a mosaic filter grid of $2\\times 2$ squares containing <b>1 Red, 2 Green, and 1 Blue (50% Green, 25% Red, 25% Blue)</b> sits over the pixels — twice as much Green because the human retina\'s M/L cones peak in green luminance sensitivity! The camera then interpolates ("<b>demosaics</b>") the missing two colours at every pixel.<br>' +
         '• <b>PRNU (Photo-Response Non-Uniformity):</b> Tiny, unavoidable silicon wafer inhomogeneities during sensor fabrication cause individual pixels to generate fractionally more or less voltage under uniform light. By averaging the noise residuals of 20–50 reference photos from a suspect\'s camera to extract its Reference PRNU Pattern and correlating it with a questioned image, an examiner can link the image to that <b>exact individual physical camera</b> with false-alarm rates below $10^{-6}$, just like ballistic striations on a bullet!</div>'
    },
    {
      h: 'Detecting image tampering & Forensic Authentication',
      b: '<div class="vs-grid">' +
         '<div class="vs-card"><h4>Copy-Move (Cloning) Forgery</h4><p>• Copies a region and pastes it <b>within the SAME image</b> (e.g., copying grass over a body, or duplicating a crowd).<br>• Because the cloned patch comes from the same photo, it shares the <b>same camera PRNU, global noise floor, and colour palette</b>.<br>• Detected by: <b>1. Block-based matching</b> (DCT/PCA on overlapping blocks) or <b>2. Keypoint-based matching (SIFT / SURF / ORB)</b>, which catches cloned regions even if rotated or rescaled!</p></div>' +
         '<div class="vs-card"><h4>Image Splicing (Compositing)</h4><p>• Cuts an object from <b>Image A</b> and pastes it into <b>Image B</b>.<br>• Introduces mismatches between the host image and foreign patch.<br>• Detected by: <b>PRNU absence/mismatch</b> in the pasted zone, <b>CFA demosaicing disruption</b>, <b>8×8 JPEG Block Artifact Grid (BAG) misalignment</b>, inconsistent <b>lighting/specular highlights/shadow geometry</b>, and <b>Error Level Analysis (ELA)</b>.</p></div>' +
         '</div>' +
         '<div class="example"><b>🔬 Forensic Case Walkthrough — Authenticating a Questioned JPEG in 4 Steps:</b><br>' +
         'A suspect submits `alibi.jpg` claiming he took it straight on his iPhone 15 at 14:00.<br>' +
         '1. <b>EXIF &amp; Thumbnail Check (`ExifTool`):</b> The EXIF `DateTimeOriginal` says 14:00, but the `Software` tag reads `Adobe Photoshop 2024`, and the embedded <b>EXIF Thumbnail (`FF D8 ... FF D9` inside the APP1 segment)</b> still shows the original unedited license plate before the suspect blurred it! (Classic <b>EXIF Thumbnail Mismatch</b>.)<br>' +
         '2. <b>Double JPEG Compression (DCT Histogram):</b> Baseline JPEG divides the image into $8\\times 8$ blocks, applies the <b>Discrete Cosine Transform (DCT)</b>, and divides by a Quantisation Table $Q_1$. When opened, edited, and re-saved at quality $Q_2$, the DCT coefficient histogram displays telltale <b>periodic missing-value comb peaks / valleys</b> (and Benford\'s Law violations).<br>' +
         '3. <b>Error Level Analysis (ELA):</b> Re-saving the image at a known JPEG quality (e.g. 95%) and subtracting it from the questioned image shows the freshly pasted region glowing brightly at a higher compression error level than the twice-compressed background.<br>' +
         '4. <b>PRNU Correlation:</b> Correlating against the suspect\'s iPhone reference PRNU shows strong positive correlation everywhere <em>except</em> a rectangular patch over the street sign where correlation drops to zero — proving local splicing!</div>'
    },
    {
      h: 'Colour spaces (RGB vs YCbCr), Chroma Subsampling & Video GOP Forensics',
      b: '<p><b>Why JPEG &amp; Video Codecs Convert RGB $\\to$ YCbCr:</b> Human vision has far higher spatial acuity for <b>luminance/brightness ($Y$, rod cells)</b> than for <b>chrominance/colour ($Cb$ blue-difference, $Cr$ red-difference, cone cells)</b>. Converting RGB into <b>YCbCr</b> decouples brightness from colour so encoders can keep $Y$ at 100% full resolution while downsampling $Cb$ and $Cr$ — <b>Chroma Subsampling ($J:a:b$ notation over a $4\\times 2$ pixel block)</b>:</p>' +
         '<ul>' +
         '<li><b><code>4:4:4</code>:</b> 4 Y, 4 Cb, 4 Cr samples per row — <b>no chroma subsampling</b> ($100\\%$ colour resolution; RAW/studio mastering).</li>' +
         '<li><b><code>4:2:2</code>:</b> Chroma sampled at <b>half horizontal resolution</b>, full vertical resolution ($33\\%$ bandwidth saving; broadcast ProRes/SDI).</li>' +
         '<li><b><code>4:2:0</code>:</b> Chroma sampled at <b>half horizontal AND half vertical resolution</b> (only 1 Cb and 1 Cr sample per $2\\times 2$ block of 4 Y pixels $\\Rightarrow 50\\%$ total data reduction; standard for JPEG, H.264/AVC, H.265/HEVC, MP4 consumer video).</li>' +
         '</ul>' +
         '<div class="diagram"><div class="diag-title">Video Group of Pictures (GOP) Structure &amp; Temporal Inter-Frame Prediction</div>' +
         '<div class="flow-row">' +
         '<div class="flow-step"><b>I-Frame (Intra)</b><small>Self-contained keyframe (standalone JPEG); starts GOP</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>B-Frame (Bi-dir)</b><small>Predicted from past I/P AND future P frame (smallest!)</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>P-Frame (Predicted)</b><small>Stores only motion vectors &amp; residual from prior I/P</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>Next I-Frame</b><small>Starts new GOP</small></div>' +
         '</div></div>' +
         '<ul>' +
         '<li><b>Container vs Codec:</b> A <b>Container</b> (`.mp4`, `.mkv`, `.avi`, `.mov`) is the outer file box holding video, audio, subtitle, and metadata tracks. A <b>Codec</b> (`H.264/AVC`, `H.265/HEVC`, `VP9`, `AV1`, `AAC`) is the mathematical compression algorithm inside. Re-muxing changes the container without re-encoding the codec stream.</li>' +
         '<li><b>How Video Frame Deletion / Insertion is Caught:</b> If a suspect deletes 30 frames (1 second) from a CCTV video and re-exports it, the fixed GOP rhythm (e.g., `I B B P B B P ...` every 15 frames) suffers a <b>GOP phase shift and prediction residual spike</b> every $N$ frames, proving temporal tampering!</li>' +
         '</ul>'
    },
    {
      h: 'Audio Forensics: Acoustic Parameters, Speech ($F_0$ vs Formants) & 50 Hz ENF Authentication',
      b: '<table>' +
         '<tr><th>Acoustic Parameter</th><th>Physical Cause (Source–Filter Model)</th><th>Perceptual / Forensic Role</th></tr>' +
         '<tr><td><b>Fundamental Frequency ($F_0$)</b></td><td>Rate of opening/closing of the <b>vocal folds (glottis)</b> — the <em>Source</em></td><td>Perceived as voice <b>Pitch</b> (Adult Male: <b>85–180 Hz</b>; Adult Female: <b>165–255 Hz</b>; Children: ~300 Hz). Easily altered by emotion, illness, or disguise.</td></tr>' +
         '<tr><td><b>Formants ($F_1, F_2, F_3, F_4$)</b></td><td>Resonant frequencies of the <b>supralaryngeal vocal tract</b> (throat, tongue, oral/nasal cavity) — the <em>Filter</em></td><td>Determine <b>vowel identity</b> and anatomical vocal-tract dimensions. Much harder to disguise than $F_0$; primary acoustic markers in forensic speaker comparison!</td></tr>' +
         '<tr><td><b>Amplitude / Intensity</b></td><td>Sound pressure wave excursion (measured in logarithmic <b>decibels, dB</b>)</td><td>Perceived as <b>Loudness</b> ($+6\\text{ dB} = 2\\times$ voltage/pressure amplitude; $+3\\text{ dB} = 2\\times$ acoustic power; $+10\\text{ dB} \\approx 2\\times$ perceived loudness).</td></tr>' +
         '<tr><td><b>Timbre (Spectral Envelope)</b></td><td>Relative distribution of overtones / harmonics ($2F_0, 3F_0, \\dots$)</td><td>Voice quality/colour; captured mathematically via <b>MFCCs (Mel-Frequency Cepstral Coefficients)</b> in automatic speaker recognition.</td></tr>' +
         '</table>' +
         '<div class="example"><b>🔬 Forensic Audio Case Walkthrough — Catching a Forged Bribery Recording via 50 Hz ENF Analysis:</b><br>' +
         '<b>What is ENF?</b> India\'s national power grid operates at a nominal <b>50 Hz AC</b> (North America uses 60 Hz) with harmonics at $100\\text{ Hz}, 150\\text{ Hz}, \\dots$. Because grid load fluctuates second-by-second across the entire interconnected grid, the instantaneous frequency wanders randomly around $50\\text{ Hz}$ (e.g., $49.962\\text{ Hz} \\to 50.018\\text{ Hz}$). Any mains-powered or nearby battery-powered microphone picks up this tiny electromagnetic/acoustic hum.<br>' +
         '<b>How it solves two forensic questions at once:</b><br>' +
         '1. <b>Timestamp Verification:</b> Extracting the $50\\text{ Hz}$ (or $100\\text{ Hz}$) trace via narrow-band STFT and cross-correlating it against a reference Power Grid ENF Database pins down the <b>exact date and minute the recording was made</b>!<br>' +
         '2. <b>Splice / Edit Detection:</b> If a suspect deletes the word <em>"not"</em> from a sentence and carefully level-matches the waveform, the $50\\text{ Hz}$ ENF phase and frequency curve exhibits an <b>abrupt phase jump / frequency step discontinuity</b> at the exact millisecond of the cut!</div>'
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
      e: '<p>PRNU is a property of the image sensor itself, so the same fixed-pattern noise fingerprint is present in every frame a camera captures. Extracting and correlating this fingerprint frame-by-frame both identifies the source camera and can localise frames or regions whose fingerprint is absent or inconsistent — a sign of splicing or frame substitution.</p><p>Container timestamps, frame rate and ENF are all separate authentication channels (container metadata, capture-rate consistency, and audio-specific analysis respectively) and do not substitute for a sensor-level fingerprint check.</p>' },

    { q: 'Which acoustic parameter is perceived by the human ear as pitch, and is directly linked to the rate of vocal-fold vibration (F0)?',
      o: ['Amplitude', 'Frequency', 'Timbre', 'Bandwidth'], a: 1,
      e: '<p><b>Frequency</b>, measured in Hz, is perceived as pitch; for voiced speech this is governed by the <b>fundamental frequency (F0)</b>, the rate of vocal-fold vibration.</p><p>Amplitude is perceived as loudness (measured in dB), not pitch, and timbre is the overall spectral colour/quality of a sound rather than its pitch — a common distractor pairing in this topic.</p>' },

    { q: 'In forensic speaker comparison, the fundamental frequency (F0) alone is considered a weak identification parameter mainly because',
      o: ['It cannot be measured from a recording', 'It varies with emotion, vocal effort and health, and typical F0 ranges overlap heavily across different speakers',
          'It is identical for every human speaker', 'It only exists in synthetically generated speech'], a: 1,
      e: '<p>F0 is easy to measure but fluctuates with a speaker\'s emotional state, vocal effort, health and even deliberate disguise, and the typical ranges (male ≈ 85–180 Hz, female ≈ 165–255 Hz) overlap substantially between individuals.</p><p><b>Formants</b>, shaped by the more fixed geometry of an individual\'s vocal tract, are treated as a comparatively more stable — though still not infallible — discriminator, which is why forensic voice comparison relies on multiple parameters together rather than F0 in isolation.</p>' },

    { q: 'Which representation of a speech signal displays how frequency content changes over time, making it the primary tool for formant analysis in forensic audio examination?',
      o: ['Waveform', 'Spectrogram', 'Amplitude histogram', 'Scatter plot'], a: 1,
      e: '<p>A <b>spectrogram</b> plots frequency against time with intensity/colour representing magnitude, generated via the short-time Fourier transform (STFT). Formant bands and F0 harmonic striations are directly visible on it.</p><p>A raw <b>waveform</b> (time-domain) plots only amplitude against time and carries no frequency information at all — it cannot show formants.</p>' },

    { q: 'A forensic examiner suspects two segments of a speech recording were spliced together, with the editor carefully matching the loudness levels across the join. The edit is most likely to still be revealed by',
      o: ['The time-domain waveform alone, since amplitude always changes at a splice', 'The spectrogram, which can show a spectral or formant discontinuity, or a change in background-noise spectrum, at the join even when amplitude levels match',
          'A simple decibel (dB) meter reading of the whole file', 'Comparing the file sizes of the two segments'], a: 1,
      e: '<p>Level-matching a splice hides the edit from a time-domain amplitude view, but the two segments almost always differ in background-noise spectrum, reverberation character or formant transition at the join instant — differences that show up as a visible discontinuity on a <b>spectrogram</b> even when the waveform envelope looks perfectly continuous.</p><p>This is precisely why forensic audio examiners rely on time-frequency (spectrogram) analysis rather than the waveform alone for splice detection.</p>' },

    { q: '"Forensic authentication of digital image/video," as distinct from tampering detection, is best described as',
      o: ['Detecting one specific manipulation technique such as copy-move forgery', 'Establishing whether the file is a genuine, unaltered original from the claimed source device, combining source verification and integrity verification',
          'Enhancing an image to improve its visibility', 'Compressing a video file for efficient storage'], a: 1,
      e: '<p><b>Authentication</b> is the broader, goal-level question of whether a file is a genuine original from the claimed device at the claimed time. <b>Tampering detection</b> (ELA, double-JPEG analysis, PRNU-region inconsistency, etc.) supplies the technique-level evidence used to answer that question — it is a tool within authentication, not a synonym for it.</p><p>Enhancement and compression are unrelated processes entirely.</p>' },

    { q: 'The two complementary pillars of digital image/video authentication are source verification and integrity verification. Which option correctly pairs each with its typical technique?',
      o: ['Source verification uses PRNU/sensor-fingerprint matching and file-structure comparison; integrity verification uses ELA and double-compression analysis',
          'Source verification uses histogram equalisation; integrity verification uses chroma subsampling', 'Source verification uses ENF analysis; integrity verification uses EXIF GPS tags',
          'Both pillars rely solely on comparing file sizes'], a: 0,
      e: '<p><b>Source verification</b> asks whether the file came from the claimed device, answered via PRNU sensor-fingerprint matching, file-structure/quantisation-table comparison and EXIF make/model consistency. <b>Integrity verification</b> asks whether the file has been altered since capture, answered via ELA, double-JPEG/double-compression analysis and PRNU-region inconsistency.</p><p>Histogram equalisation and chroma subsampling are enhancement/compression concepts, not authentication techniques, and ENF/EXIF-GPS are audio- and image-metadata tools respectively that do not map onto this source/integrity split as shown.</p>' },

    { q: 'An analogue audio signal contains a 7 kHz pure tone, but is sampled at a sampling frequency of fs = 10 kHz without an anti-aliasing filter. What false (alias) frequency will appear in the reconstructed digital signal?',
      o: ['3 kHz', '7 kHz', '5 kHz', '2 kHz'], a: 0,
      e: '<p>Here the Nyquist folding frequency is $f_s / 2 = 10 / 2 = 5\\text{ kHz}$. Because $7\\text{ kHz} > 5\\text{ kHz}$, aliasing occurs and the tone folds across $5\\text{ kHz}$ to: $$f_{\\text{alias}} = |f_s - f| = |10\\text{ kHz} - 7\\text{ kHz}| = \\mathbf{3\\text{ kHz}}$$</p>' },

    { q: 'In PCM audio digitisation, adding 1 extra bit to the quantisation bit depth increases the Signal-to-Quantisation-Noise Ratio (SQNR) / dynamic range by approximately:',
      o: ['6 dB per bit (so 16-bit audio has ~96–98 dB dynamic range)',
          '1 dB per bit',
          '20 dB per bit',
          '3 dB in total regardless of bit depth'], a: 0,
      e: '<p>Each additional quantisation bit doubles the number of amplitude levels ($2^b$), cutting the RMS quantisation step error in half. Because $20 \\log_{10}(2) \\approx 6.02\\text{ dB}$, the theoretical SQNR of a $b$-bit ADC is $\\text{SQNR} \\approx 6.02 b + 1.76\\text{ dB}$ — roughly <b>6 dB per bit</b> ($\approx 98\\text{ dB}$ for 16-bit CD audio).</p>' },

    { q: 'What is the uncompressed file size (in bytes) of a 10-second stereo (2-channel) digital audio clip sampled at 48,000 Hz with a 16-bit sample depth?',
      o: ['1,920,000 bytes (approx. 1.83 MB)',
          '960,000 bytes',
          '15,360,000 bytes',
          '480,000 bytes'], a: 0,
      e: '<p>16 bits $= 2$ bytes per sample. Therefore: $$\\text{Size} = 48,000\\text{ samples/s} \\times 2\\text{ bytes/sample} \\times 2\\text{ channels} \\times 10\\text{ s} = \\mathbf{1,920,000\\text{ bytes}}$$ (Option b forgets to multiply by 2 channels for stereo; option c forgets to divide 16 bits by 8 to get bytes.)</p>' },

    { q: 'Consider a 3×3 pixel neighbourhood in a noisy CCTV frame with intensities:\n[ 20, 22, 19 ]\n[ 21, 250, 20 ]\n[ 18, 23, 21 ]\nWhat value replaces the centre pixel (250) when a 3×3 Median Filter is applied, versus a 3×3 Mean (Averaging) Filter?',
      o: ['Median filter gives 21; Mean filter gives 46',
          'Median filter gives 250; Mean filter gives 21',
          'Median filter gives 46; Mean filter gives 21',
          'Both give 46'], a: 0,
      e: '<p>• <b>Median Filter:</b> Sort the 9 values: <code>[18, 19, 20, 20, <b>21</b>, 21, 22, 23, 250]</code>. The 5th (middle) value is <b>21</b> — completely eliminating the 250 salt-noise impulse!<br>• <b>Mean Filter:</b> $(18+19+20+20+21+21+22+23+250) / 9 = 414 / 9 =$ <b>46</b> (which smears the noise spike across the pixel).</p>' },

    { q: 'A CCTV video frame suffers from regular diagonal interference bars caused by 50 Hz AC power-line hum coupling into an analogue coax cable. Which filter is specifically designed to remove such repetitive periodic noise?',
      o: ['A frequency-domain Notch (or Band-Reject) filter that attenuates the specific isolated frequency spikes corresponding to the periodic interference',
          'A spatial 3×3 Laplacian sharpening filter',
          'Global histogram equalisation',
          'Sobel first-derivative edge detection'], a: 0,
      e: '<p>Repetitive, spatially periodic interference across an entire image transforms into a pair of bright, isolated impulse spikes in the 2D Fourier spectrum. Zeroing out just those spikes with a <b>frequency-domain Notch filter</b> removes the hum bars across the entire image without blurring edges.</p>' },

    { q: 'In a standard Bayer Colour Filter Array (CFA) used on single-sensor digital cameras, what is the proportion of Red, Green, and Blue filters in each 2×2 pixel mosaic, and why?',
      o: ['50% Green, 25% Red, 25% Blue (RGGB) — because the human visual system\'s luminance sensitivity peaks in the green region of the spectrum',
          '33.3% Red, 33.3% Green, 33.3% Blue',
          '50% Red, 25% Green, 25% Blue',
          '50% Blue, 25% Red, 25% Green'], a: 0,
      e: '<p>Every $2\\times 2$ Bayer square contains <b>two Green filters, one Red filter, and one Blue filter (RGGB)</b>. Green is sampled at twice the density of Red or Blue to mimic the human retina\'s M/L cone luminance response, giving sharper perceived detail after demosaicing.</p>' },

    { q: 'A suspect uses Photoshop to clone a patch of blue sky over a drone in a photograph and rotates/scales the cloned patch slightly before pasting. Which copy-move detection method is specifically resilient to rotation and scaling of the cloned region?',
      o: ['Keypoint-based matching (such as SIFT or SURF feature descriptors)',
          'Checking the file extension',
          'Converting the image from RGB to greyscale',
          'Reading the EXIF DateTimeOriginal field'], a: 0,
      e: '<p>Traditional $8\\times 8$ block-matching copy-move detectors fail when the cloned patch is rotated or resized. <b>SIFT (Scale-Invariant Feature Transform)</b> and <b>SURF</b> extract local keypoints whose descriptor vectors are mathematically invariant to scale, rotation, and minor illumination changes, allowing them to pair up the source and cloned regions accurately.</p>' },

    { q: 'During examination of a suspect\'s JPEG image, the analyst extracts the small preview image embedded inside the JPEG\'s EXIF APP1 metadata segment and discovers that the preview still shows a person who was cropped out of the main image. This forensic finding is known as:',
      o: ['EXIF Thumbnail Mismatch (discrepancy between the original camera-generated EXIF thumbnail and the edited main image)',
          'Chroma subsampling',
          'Belady\'s anomaly',
          'Nyquist aliasing'], a: 0,
      e: '<p>When a digital camera captures a JPEG, it writes a miniature JPEG <b>thumbnail</b> (typically $160\\times 120$) inside the EXIF header. Many basic image editors update the main image canvas when cropping or painting over an object, but fail to regenerate the embedded EXIF thumbnail — leaving the unedited original scene preserved inside the file\'s header!</p>' },

    { q: 'In Short-Time Fourier Transform (STFT) spectrogram analysis of speech, what is the fundamental trade-off between choosing a Wide-Band spectrogram (short time window ~4 ms) versus a Narrow-Band spectrogram (long time window ~30 ms)?',
      o: ['Wide-band gives fine time resolution (good for tracking vocal-tract formants and glottal pulses), whereas Narrow-band gives fine frequency resolution (good for resolving individual F0 harmonics and 50 Hz ENF hum)',
          'Wide-band gives fine frequency resolution, whereas Narrow-band gives fine time resolution',
          'Both give identical time and frequency resolution',
          'Narrow-band can only be computed on uncompressed BMP images'], a: 0,
      e: '<p>By the <b>Gabor / Heisenberg Time-Frequency Uncertainty Principle</b> ($\\Delta t \\cdot \\Delta f \\ge \\frac{1}{4\\pi}$), a short analysis window (↓ $\\Delta t$) localises events sharply in time but widens the frequency bandwidth (↑ $\\Delta f$, <b>Wide-band</b> — ideal for formants). Conversely, a long window (↑ $\\Delta t$) narrows the frequency resolution (↓ $\\Delta f$, <b>Narrow-band</b> — ideal for individual harmonics and ENF traces).</p>' },

    { q: 'When increasing sound pressure amplitude (voltage) by a factor of 2, by how many decibels (dB) does the signal level increase?',
      o: ['Approximately +6 dB (since 20 × log10(2) ≈ 6.02 dB)',
          'Approximately +1 dB',
          'Approximately +20 dB',
          'Approximately +60 dB'], a: 0,
      e: '<p>For amplitude/voltage ratios, decibels are defined as $\\text{dB} = 20 \\log_{10}(A_2 / A_1)$. Doubling amplitude ($A_2 / A_1 = 2$) gives $20 \\log_{10}(2) \\approx$ <b>+6.02 dB</b> (whereas multiplying amplitude by 10 gives $+20\\text{ dB}$, and doubling acoustic power gives $10 \\log_{10}(2) \\approx +3\\text{ dB}$).</p>' },

    { q: 'In Error Level Analysis (ELA) of a questioned JPEG image, why does a recently spliced or painted patch appear significantly brighter in the ELA residual map than the surrounding untouched camera background?',
      o: ['Because the original camera background has already gone through one or more lossy JPEG DCT quantisation cycles and reached a stable low-error minimum, whereas the freshly inserted/edited patch is at its first compression cycle and loses much more high-frequency energy when re-saved at the test quality',
          'Because ELA detects the GPS coordinates of the pasted pixels',
          'Because pasted pixels always have a higher ISO setting',
          'Because ELA converts the image into an audio waveform'], a: 0,
      e: '<p>Each time an $8\\times 8$ JPEG block is compressed at a given quality level, its DCT coefficients settle closer to the quantisation grid. When an analyst re-saves the image at e.g. 95% quality and computes the absolute pixel difference, blocks that have already been compressed several times change very little (appearing dark in ELA), whereas a freshly pasted or airbrushed region undergoes its first lossy quantisation drop and lights up brightly.</p>' },

    { q: 'How does JPEG 2000 (.jp2) differ fundamentally from baseline JPEG (.jpg) in its mathematical transform and visual compression artefacts at very low bitrates?',
      o: ['JPEG 2000 uses the Discrete Wavelet Transform (DWT) on the whole image/tiles (producing smooth blurring rather than 8×8 blocking artefacts), whereas baseline JPEG uses the Discrete Cosine Transform (DCT) on 8×8 pixel blocks',
          'JPEG 2000 uses 8×8 DCT blocks, whereas baseline JPEG uses wavelets',
          'JPEG 2000 is restricted to 256-colour palettes like GIF',
          'Baseline JPEG is always lossless, whereas JPEG 2000 is always lossy'], a: 0,
      e: '<p>Baseline JPEG splits the image into independent $8\\times 8$ pixel blocks and applies the <b>DCT</b> — causing noticeable $8\\times 8$ <b>blocking artefacts</b> at high compression. <b>JPEG 2000</b> replaces the $8\\times 8$ DCT with the multi-resolution <b>Discrete Wavelet Transform (DWT)</b>, supporting both lossless and lossy compression in one bitstream and eliminating $8\\times 8$ block boundaries.</p>' },

    { q: 'When a JPEG image is cropped by a few rows or columns (not a multiple of 8 pixels), edited, and re-saved as a JPEG, which forensic technique detects the resulting shift in the 8×8 pixel compression boundaries?',
      o: ['Block Artifact Grid (BAG) / 8×8 JPEG blocking grid alignment analysis',
          'Electrical Network Frequency (ENF) 50 Hz analysis',
          'Formant F1/F2 vowel analysis',
          'Chroma 4:4:4 upsampling'], a: 0,
      e: '<p>Baseline JPEG always partitions an image into $8\\times 8$ blocks starting at the top-left corner $(0,0)$. If an image is spliced with a patch whose $8\\times 8$ grid does not line up with the host image\'s $8\\times 8$ grid (or if the image is cropped by e.g. 3 pixels and re-saved), <b>Block Artifact Grid (BAG)</b> extraction immediately highlights the out-of-phase $8\\times 8$ block boundaries.</p>' },

    { q: 'In spatial-domain image enhancement, the Power-Law (Gamma) transformation is defined as s = c · r^γ. If a crime-scene CCTV frame captured at night is extremely dark and underexposed (washed out in the shadows), what value of γ (gamma) should the analyst choose to brighten the dark shadow details?',
      o: ['A fractional gamma value γ < 1 (e.g., γ = 0.4), which maps a narrow range of dark input intensities into a wider range of brighter output levels',
          'A large gamma value γ > 1 (e.g., γ = 2.5), which darkens the image further',
          'γ = 0, which turns the entire image flat white',
          'A negative gamma value γ = −10'], a: 0,
      e: '<p>In $s = c \\cdot r^\\gamma$ (for normalised intensities $r \\in [0, 1]$):<ul><li><b>$\\gamma < 1$ (e.g. $0.4$, fractional power / nth root):</b> curves upward (like the log transform), expanding dark shadow levels into brighter values — ideal for underexposed night CCTV footage!</li><li><b>$\\gamma > 1$ (e.g. $2.5$):</b> curves downward, compressing darks and expanding bright highlights — used for overexposed washed-out daylight scenes.</li></ul></p>' },

    { q: 'Which edge-detection algorithm is universally regarded as the "optimal" multi-stage edge detector, combining (1) Gaussian smoothing, (2) gradient magnitude & direction, (3) non-maximum suppression to thin edges to 1 pixel, and (4) double-threshold hysteresis tracking?',
      o: ['Canny edge detector',
          'Roberts cross operator',
          'Mean box filter',
          'Median filter'], a: 0,
      e: '<p>John Canny\'s 1986 <b>Canny Edge Detector</b> satisfies three optimality criteria (low error rate, single-pixel edge localisation, and single response per edge) through its 4-step pipeline: Gaussian denoising $\\to$ Sobel gradient $\\to$ <b>non-maximum suppression</b> $\\to$ <b>hysteresis thresholding</b> (using high and low thresholds $T_H, T_L$).</p>' },

    { q: 'In automatic and forensic speaker recognition, what do "MFCCs" stand for, and what physical aspect of the human speech apparatus do they model?',
      o: ['Mel-Frequency Cepstral Coefficients — they model the short-term power spectrum (spectral envelope / vocal-tract filter shape) spaced on the perceptual Mel frequency scale of human hearing',
          'Master File Compression Codes — used to compress MP3 files',
          'Magnetic Flux Calibration Constants — used in tape recorders',
          'Multi-Frame Chroma Channels — used in H.264 video'], a: 0,
      e: '<p><b>MFCCs (Mel-Frequency Cepstral Coefficients)</b> are computed by taking the Fourier spectrum of a short speech frame, mapping the powers onto the <b>Mel scale</b> (which is linear below $1\\text{ kHz}$ and logarithmic above $1\\text{ kHz}$, matching the human cochlea), taking the logarithm, and applying the Discrete Cosine Transform (DCT). This separates the smooth <b>vocal-tract spectral envelope (formant filter)</b> from the glottal pitch source ($F_0$).</p>' },

    { q: 'Which audio enhancement technique estimates the average noise power spectrum during silent/non-speech pauses of a recording and subtracts it from the noisy speech spectrum across the entire recording?',
      o: ['Spectral Subtraction',
          'Butt splicing',
          'Chroma subsampling',
          'Aliasing'], a: 0,
      e: '<p><b>Spectral Subtraction</b> (Boll, 1979) is the classic stationary broadband noise-reduction method in forensic audio enhancement: the examiner profiles the noise floor $|N(\\omega)|^2$ during an interval where nobody is speaking (e.g., air-conditioner hum or tape hiss) and subtracts that spectral profile from each STFT frame $|Y(\\omega)|^2$ to recover cleaner speech $|\\hat{S}(\\omega)|^2$.</p>' },

    { q: 'Why does India\'s Electrical Network Frequency (ENF) analysis look for a fundamental mains hum around 50 Hz (and harmonics at 100 Hz, 150 Hz), whereas ENF analysis on a recording made in the United States or Canada looks around 60 Hz?',
      o: ['Because India\'s national AC electrical power grid operates at a nominal frequency of 50 Hz, whereas the North American power grid operates at 60 Hz',
          'Because Indian microphones cannot record frequencies above 50 Hz',
          'Because 50 Hz is the Nyquist rate of human speech',
          'Because 50 Hz is the fundamental frequency of all adult female voices'], a: 0,
      e: '<p>The nominal AC mains grid frequency is <b>50 Hz in India, Europe, UK, Australia, and most of Asia/Africa</b> (giving full-wave rectified harmonics at <b>100 Hz, 150 Hz, 200 Hz</b>), whereas <b>North America (USA, Canada) and parts of Japan/South America operate at 60 Hz</b> (harmonics at 120 Hz, 180 Hz). Merely observing whether an audio/video file carries a 50 Hz vs 60 Hz ENF hum can immediately expose a false claim about which continent the recording was made on!</p>' }
  ]
});
