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
      e: '<p>Histogram equalisation spreads a narrow, bunched intensity histogram across the full available range, improving <b>global contrast</b>. It is a spatial-domain point operation.</p><p>Forensic caveat: it alters pixel values, so it must be performed on a working copy with the operation documented, never on the original evidence file.</p>' }
  ]
});
