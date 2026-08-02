/* Paper III, Part A — General Science, UNIT I: PHYSICAL SCIENCE (34 marks). */

window.MPSC.units.push({
  id: 'p3p1',
  paper: 'Paper III — Physics',
  title: 'Mechanics, Waves and Optics',
  marks: 14,
  syllabus: 'Laws of motion, conservation of energy, linear momentum and angular momentum, gravitational field and potential due to spherical bodies, Kepler\'s laws; work done by constant force and variable force, work-energy theorem, power, elastic and inelastic collisions, rigid body, degrees of freedom, angular velocity, angular momentum, moments of inertia. Simple harmonic motion, damped oscillation, forced oscillation and resonance, wave motion, longitudinal and transverse waves, speed of travelling wave, principle of superposition of waves. Laws of reflection and refraction; system of two thin lenses; total internal reflection and its applications, magnification, power of a lens, interference of light-Young\'s experiment; interference by thin films, Fraunhofer diffraction-single slit, diffraction grating, resolving power, Fresnel diffraction, half period zones and zone plates.',

  notes: [
    { h: 'Mechanics — the formulae that actually get tested',
      b: '<p>This is the single largest physics block (14 marks), so it repays drilling.</p>' +
         '<ul><li><b>Newton\'s laws:</b> F = ma; action and reaction are equal, opposite, and act on <em>different</em> bodies — the last clause is why they never cancel.</li>' +
         '<li><b>Momentum:</b> p = mv. Conserved in <b>all</b> collisions, elastic or not.</li>' +
         '<li><b>Kinetic energy:</b> KE = ½mv² = <b>p²/2m</b>. Conserved <b>only</b> in elastic collisions.</li>' +
         '<li><b>Work–energy theorem:</b> net work = change in KE. For a variable force, W = ∫F·dx (the area under the F–x graph).</li>' +
         '<li><b>Power</b> = W/t = F·v.</li></ul>' +
         '<div class="tip"><b>The collision distinction, stated precisely.</b> Momentum is conserved in every collision. Kinetic energy is conserved <em>only</em> in an elastic one. In a <b>perfectly inelastic</b> collision the bodies stick together and the KE loss is maximal — but never total, because momentum conservation forbids the combined mass coming to rest unless the initial total momentum was zero.</div>' +
         '<p><b>Rotation</b> mirrors translation term for term: mass ↔ moment of inertia I; force ↔ torque τ = Iα; momentum ↔ angular momentum L = Iω; KE ↔ ½Iω². Standard moments of inertia about a central axis: solid sphere <b>2/5 MR²</b>, hollow sphere 2/3 MR², solid disc/cylinder <b>½MR²</b>, ring/hoop <b>MR²</b>, rod about centre 1/12 ML².</p>' +
         '<p><b>Angular momentum conservation</b> explains the skater pulling arms in: I falls, so ω rises to keep L constant — and KE actually <em>increases</em>, supplied by the muscular work done pulling in.</p>' +
         '<p><b>Kepler\'s laws:</b> (1) orbits are ellipses with the Sun at a focus; (2) equal areas in equal times — a consequence of angular momentum conservation, so planets move fastest at perihelion; (3) <b>T² ∝ a³</b>.</p>' +
         '<p>Gravitation: F = Gm₁m₂/r². For a <b>uniform spherical shell</b>, the field <b>inside is zero</b> and outside it acts as though all mass were at the centre. Escape velocity = √(2GM/R) ≈ 11.2 km/s for Earth, and is <b>√2 times</b> orbital velocity.</p>' },

    { h: 'SHM, damping and resonance',
      b: '<p><b>SHM:</b> restoring force proportional to displacement and oppositely directed, F = −kx. Displacement x = A sin(ωt + φ).</p>' +
         '<ul><li>Simple pendulum: <b>T = 2π√(L/g)</b> — independent of mass and (for small angles) of amplitude.</li>' +
         '<li>Spring–mass: <b>T = 2π√(m/k)</b>.</li>' +
         '<li>Total energy = ½kA², constant. KE is maximum at the mean position, PE maximum at the extremes.</li></ul>' +
         '<p><b>Damped</b> oscillation loses amplitude to dissipative forces. <b>Forced</b> oscillation is driven externally; when the driving frequency equals the natural frequency, <b>resonance</b> gives maximum amplitude — limited only by damping.</p>' },

    { h: 'Waves',
      b: '<p><b>v = fλ.</b> Transverse waves oscillate perpendicular to propagation (light, string waves) and <b>can be polarised</b>; longitudinal waves oscillate along it (sound) and <b>cannot</b>. Sound cannot travel through vacuum; light can.</p>' +
         '<p><b>Superposition:</b> resultant displacement is the vector sum. Constructive interference needs a path difference of <b>nλ</b>; destructive needs <b>(n + ½)λ</b>. <b>Beats</b> arise from two close frequencies, with beat frequency = |f₁ − f₂|.</p>' +
         '<p>Standing wave on a string fixed at both ends: fundamental f = v/2L, with all harmonics present. A pipe <b>closed at one end</b> produces only <b>odd</b> harmonics and a fundamental of v/4L.</p>' },

    { h: 'Optics',
      b: '<p><b>Refraction:</b> n = c/v, and Snell\'s law n₁sin θ₁ = n₂sin θ₂. <b>Total internal reflection</b> occurs going from denser to rarer medium beyond the critical angle, where <b>sin C = 1/n</b>. It is the basis of optical fibres, mirages, and the sparkle of diamond (n = 2.42, C ≈ 24°).</p>' +
         '<p><b>Lenses:</b> power P = 1/f (in metres), unit dioptre. Converging lenses have positive f and power; diverging negative. For <b>two thin lenses in contact</b>: <b>1/F = 1/f₁ + 1/f₂</b>, so powers simply add, P = P₁ + P₂.</p>' +
         '<p><b>Young\'s double slit:</b> fringe width <b>β = λD/d</b>. Fringes widen with longer wavelength or greater screen distance, and narrow as the slits separate. The <b>central fringe is bright</b>. Immersing the apparatus in a liquid of index n shrinks β by a factor n, since λ shortens.</p>' +
         '<p><b>Single-slit Fraunhofer diffraction:</b> minima at <b>a sin θ = nλ</b> — note this is the condition for <em>minima</em>, the reverse of the double-slit maxima condition, and is the classic confusion. The central maximum is <b>twice as wide</b> as the others and much brighter.</p>' +
         '<p><b>Resolving power</b> rises with aperture and falls with wavelength (Rayleigh criterion θ ≈ 1.22λ/D). This is precisely why electron microscopes outperform optical ones — the de Broglie wavelength of an electron is far shorter than that of visible light.</p>' }
  ],

  questions: [
    { q: 'In a perfectly inelastic collision between two bodies, which quantity is conserved?', o: ['Kinetic energy only', 'Momentum only', 'Both kinetic energy and momentum', 'Neither'], a: 1,
      e: '<p><b>Momentum is conserved in every collision</b>, elastic or inelastic — it follows from Newton\'s third law. <b>Kinetic energy is conserved only in elastic collisions</b>; in an inelastic collision it is converted to heat, sound and deformation.</p><p>A perfectly inelastic collision is the case of <em>maximum</em> KE loss, since the bodies move off together.</p>' },

    { q: 'The moment of inertia of a solid sphere of mass M and radius R about a diameter is', o: ['MR²', '½MR²', '⅖MR²', '⅔MR²'], a: 2,
      e: '<p>For a <b>solid sphere</b> about a diameter, I = <b>⅖MR²</b>.</p><p>Compare: hollow sphere ⅔MR², solid disc/cylinder ½MR², ring MR². The pattern is intuitive — the further the mass sits from the axis, the larger I, so the ring (all mass at radius R) has the largest coefficient and the solid sphere among the smallest.</p>' },

    { q: 'A skater spinning with arms outstretched pulls their arms inward. Their angular velocity', o: ['Decreases, as angular momentum falls', 'Increases, because moment of inertia decreases and angular momentum is conserved', 'Remains unchanged', 'Increases because torque is applied'], a: 1,
      e: '<p>With no external torque, <b>L = Iω is conserved</b>. Pulling the arms in reduces I, so ω must rise.</p><p>Note the follow-up worth knowing: rotational KE = ½Iω² actually <b>increases</b>, the extra energy coming from the muscular work done in pulling the arms inward against the centrifugal effect.</p>' },

    { q: 'The critical angle for a medium of refractive index 1.5 is given by', o: ['sin C = 1.5', 'sin C = 1/1.5', 'tan C = 1.5', 'cos C = 1/1.5'], a: 1,
      e: '<p><b>sin C = 1/n</b> = 1/1.5 = 0.667, so C ≈ 41.8°.</p><p>Total internal reflection occurs only when travelling from a <b>denser to a rarer</b> medium at an angle exceeding C. Since sin C must be ≤ 1, option (a) is impossible on inspection — a useful sanity check.</p>' },

    { q: 'In Young\'s double slit experiment, the fringe width is doubled if', o: ['The slit separation is doubled', 'The distance to the screen is doubled', 'The wavelength is halved', 'The slit width is doubled'], a: 1,
      e: '<p>Fringe width <b>β = λD/d</b>. Doubling <b>D</b> doubles β.</p><p>Doubling the separation <b>d</b> would <em>halve</em> β, and halving λ would also halve it — both are inverse or direct in the wrong direction. Read carefully which symbol each option is changing.</p>' },

    { q: 'The condition for the first minimum in single-slit Fraunhofer diffraction is', o: ['a sin θ = λ/2', 'a sin θ = λ', 'a sin θ = 2λ', 'd sin θ = λ'], a: 1,
      e: '<p>Single-slit <b>minima</b> occur at <b>a sin θ = nλ</b>, so the first is at a sin θ = λ.</p><p>This is the standard trap: for the <b>double</b> slit, d sin θ = nλ gives <b>maxima</b>. The same-looking equation means opposite things in the two experiments — worth committing to memory as a pair.</p>' },

    { q: 'Two thin lenses of power +5 D and −2 D are placed in contact. The power of the combination is', o: ['+7 D', '+3 D', '−3 D', '+10 D'], a: 1,
      e: '<p>For thin lenses in contact, powers simply <b>add</b>: P = P₁ + P₂ = 5 + (−2) = <b>+3 D</b>.</p><p>The equivalent focal length is F = 1/P = 1/3 m ≈ 33.3 cm, and the positive sign means the combination is still converging.</p>' },

    { q: 'The time period of a simple pendulum depends on', o: ['The mass of the bob', 'The amplitude, for all amplitudes', 'The length of the pendulum and acceleration due to gravity', 'The material of the string'], a: 2,
      e: '<p><b>T = 2π√(L/g)</b> — it depends only on length and g.</p><p>Independence of mass is the classic result. Independence of amplitude holds only for <b>small</b> oscillations, where sin θ ≈ θ; option (b) says "for all amplitudes", which is why it is wrong rather than merely imprecise.</p>' },

    { q: 'Sound waves cannot be polarised because they are', o: ['Longitudinal', 'Transverse', 'Of low frequency', 'Mechanical'], a: 0,
      e: '<p>Polarisation requires oscillation <b>perpendicular</b> to the direction of travel, so a preferred plane exists. Sound is <b>longitudinal</b> — the oscillation is along the propagation direction — so there is no such plane.</p><p>Being mechanical is irrelevant: transverse waves on a string are mechanical and <em>can</em> be polarised. Polarisation is in fact the standard proof that light is transverse.</p>' },

    { q: 'A pipe closed at one end produces', o: ['All harmonics', 'Only even harmonics', 'Only odd harmonics', 'No harmonics'], a: 2,
      e: '<p>A closed pipe has a node at the closed end and an antinode at the open end, permitting only <b>odd harmonics</b> (1st, 3rd, 5th…). Its fundamental is v/4L.</p><p>An open pipe supports all harmonics with fundamental v/2L — so a closed pipe of the same length sounds an octave <em>lower</em>, which is why organ builders use them for deep notes in short spaces.</p>' }
  ]
});

window.MPSC.units.push({
  id: 'p3p2',
  paper: 'Paper III — Physics',
  title: 'Thermodynamics and Electrodynamics',
  marks: 10,
  syllabus: 'Laws of thermodynamics, reversible and irreversible processes, entropy; isothermal, adiabatic, isobaric processes and entropy changes; van der Waals equation of state of real gas, critical constants, Maxwell-Boltzmann distribution of molecular velocities. Coulomb\'s law, electric field, Gauss\' law; electric potential; capacitors, dielectrics and polarization, Ohm\'s law, Kirchhoff\'s first and second rules, resistors in series and parallel, potential and field due to a dipole, force and torque on a dipole in an external field, Biot-Savart law, Ampere\'s law, Faraday\'s law; Lenz law; self and mutual inductances, DC and AC circuits with R, L and C components.',

  notes: [
    { h: 'Laws of thermodynamics',
      b: '<ul><li><b>Zeroth</b> — two systems each in equilibrium with a third are in equilibrium with each other. This is what makes temperature meaningful and thermometry possible.</li>' +
         '<li><b>First</b> — ΔU = Q − W (energy conservation). Heat added to a system either raises internal energy or does work.</li>' +
         '<li><b>Second</b> — entropy of an isolated system never decreases. Equivalently, no engine can convert heat wholly into work (Kelvin–Planck), and heat does not flow spontaneously cold to hot (Clausius).</li>' +
         '<li><b>Third</b> — entropy approaches a constant (zero for a perfect crystal) as T → 0 K, which is unattainable.</li></ul>' +
         '<table><tr><th>Process</th><th>Constant</th><th>Key result</th></tr>' +
         '<tr><td><b>Isothermal</b></td><td>Temperature</td><td>ΔU = 0, so <b>Q = W</b></td></tr>' +
         '<tr><td><b>Adiabatic</b></td><td>No heat exchange</td><td><b>Q = 0</b>, so ΔU = −W; PVᵞ = constant</td></tr>' +
         '<tr><td><b>Isobaric</b></td><td>Pressure</td><td>W = PΔV</td></tr>' +
         '<tr><td><b>Isochoric</b></td><td>Volume</td><td>W = 0, so <b>ΔU = Q</b></td></tr></table>' +
         '<p><b>Carnot efficiency</b> η = 1 − T_cold/T_hot, with temperatures in <b>kelvin</b>. It is the maximum any engine between those reservoirs can achieve, and reaches 1 only if T_cold = 0 K.</p>' +
         '<p>A <b>reversible</b> process is quasi-static with no dissipation and leaves no net change in the universe; all real processes are irreversible and generate entropy.</p>' },

    { h: 'Real gases and molecular speeds',
      b: '<p><b>van der Waals equation:</b> (P + a/V²)(V − b) = RT for one mole. The <b>a</b> term corrects for intermolecular attraction (reducing the observed pressure) and <b>b</b> for the finite volume of the molecules themselves.</p>' +
         '<p><b>Critical constants:</b> T_c = 8a/27Rb, P_c = a/27b², V_c = 3b. Above the critical temperature a gas <b>cannot be liquefied by pressure alone</b>, however great.</p>' +
         '<p><b>Maxwell–Boltzmann distribution</b> of molecular speeds — three speeds in ascending order, worth memorising in sequence:</p>' +
         '<ul><li>Most probable v_p = √(2RT/M)</li><li>Average v_avg = √(8RT/πM)</li><li>Root mean square v_rms = √(3RT/M)</li></ul>' +
         '<p>So <b>v_p &lt; v_avg &lt; v_rms</b>, in the ratio 1 : 1.128 : 1.224. Raising temperature broadens and flattens the curve and shifts the peak to higher speed.</p>' },

    { h: 'Electrostatics and circuits',
      b: '<p><b>Coulomb:</b> F = kq₁q₂/r², k = 1/4πε₀ ≈ 9 × 10⁹ N·m²/C². <b>Gauss:</b> flux Φ = q_enclosed/ε₀ — the flux through a closed surface depends <em>only</em> on the charge inside, not on where it sits or what is outside.</p>' +
         '<p><b>Capacitors:</b> C = Q/V; parallel plate C = ε₀A/d. Inserting a <b>dielectric</b> of constant K multiplies capacitance by K, because polarisation partly cancels the field. Energy stored U = ½CV² = Q²/2C.</p>' +
         '<div class="tip"><b>The combination rules are opposite for the two components.</b> Resistors: series adds (R = R₁ + R₂), parallel reciprocals add. Capacitors: <b>parallel adds</b> (C = C₁ + C₂), series reciprocals add. Candidates routinely apply the resistor rule to capacitors.</div>' +
         '<p><b>Kirchhoff:</b> the junction rule (ΣI = 0) expresses conservation of <b>charge</b>; the loop rule (ΣV = 0) expresses conservation of <b>energy</b>.</p>' +
         '<p><b>Electric dipole:</b> moment p = q × 2a. In a uniform field the net force is <b>zero</b> but the torque is τ = pE sin θ, so the dipole rotates without translating. Its field falls as <b>1/r³</b>, faster than a point charge\'s 1/r².</p>' },

    { h: 'Magnetism and induction',
      b: '<ul><li><b>Biot–Savart law</b> gives the field from a current element; <b>Ampère\'s law</b> ∮B·dl = μ₀I is its integral form, useful where symmetry exists. Field at distance r from a long straight wire: B = μ₀I/2πr.</li>' +
         '<li><b>Faraday\'s law:</b> induced emf = −dΦ/dt. The magnitude depends on the <b>rate of change</b> of flux, not on flux itself.</li>' +
         '<li><b>Lenz\'s law</b> is the minus sign: the induced current opposes the change producing it. It is a statement of <b>energy conservation</b> — were it otherwise, the induced current would reinforce the change and produce energy from nothing.</li>' +
         '<li>Self-inductance L (emf = −L dI/dt) and mutual inductance M, both in henry.</li></ul>' +
         '<p><b>AC circuits:</b> inductive reactance X_L = ωL rises with frequency; capacitive reactance X_C = 1/ωC falls with frequency. Impedance Z = √(R² + (X_L − X_C)²). At <b>resonance</b> X_L = X_C, so Z is minimum (= R) and current is maximum, at f = 1/(2π√(LC)).</p>' }
  ],

  questions: [
    { q: 'In an isothermal process for an ideal gas', o: ['Q = 0', 'ΔU = 0 and Q = W', 'W = 0', 'ΔU = Q'], a: 1,
      e: '<p>Internal energy of an ideal gas depends only on temperature, so at constant temperature <b>ΔU = 0</b>. The first law then gives <b>Q = W</b> — all heat supplied goes into work.</p><p>Q = 0 defines an <b>adiabatic</b> process (option a); W = 0 defines isochoric (option c), for which ΔU = Q (option d). Each distractor is a real process, correctly described but wrongly labelled.</p>' },

    { q: 'Three capacitors of 2 µF each are connected in parallel. The equivalent capacitance is', o: ['6 µF', '2/3 µF', '0.67 µF', '2 µF'], a: 0,
      e: '<p><b>Capacitors in parallel add:</b> C = 2 + 2 + 2 = <b>6 µF</b>.</p><p>2/3 µF would be the <em>series</em> result. Note this is the reverse of resistors, where series adds — the single most common slip in this topic.</p>' },

    { q: 'Lenz\'s law is a direct consequence of the conservation of', o: ['Charge', 'Momentum', 'Energy', 'Magnetic flux'], a: 2,
      e: '<p>Lenz\'s law — the induced current opposes the change producing it — expresses conservation of <b>energy</b>. If the induced effect reinforced the change instead, the system would accelerate itself and generate energy from nothing.</p><p>Conservation of <b>charge</b> underlies Kirchhoff\'s <em>junction</em> rule, which is the intended near-miss.</p>' },

    { q: 'For a Carnot engine operating between 500 K and 300 K, the maximum efficiency is', o: ['40%', '60%', '166%', '20%'], a: 0,
      e: '<p>η = 1 − T_cold/T_hot = 1 − 300/500 = 1 − 0.6 = <b>0.4 = 40%</b>.</p><p>Temperatures <b>must be in kelvin</b> — using Celsius is the standard error. Efficiency can never exceed 100%, so option (c) is discardable on inspection.</p>' },

    { q: 'Arrange the molecular speeds in increasing order', o: ['v_rms < v_avg < v_p', 'v_p < v_avg < v_rms', 'v_avg < v_p < v_rms', 'All three are equal'], a: 1,
      e: '<p><b>v_p &lt; v_avg &lt; v_rms</b>, in the ratio 1 : 1.128 : 1.224 — following from √2 &lt; √(8/π) &lt; √3.</p><p>The most probable speed is the peak of the Maxwell–Boltzmann curve; because the distribution has a long high-speed tail, both the average and the rms are pulled above the peak.</p>' },

    { q: 'The electric field due to a dipole at a large distance r varies as', o: ['1/r', '1/r²', '1/r³', '1/r⁴'], a: 2,
      e: '<p>A dipole field falls as <b>1/r³</b> — faster than a point charge\'s 1/r², because at large distance the equal and opposite charges very nearly cancel.</p><p>Related result: in a <b>uniform</b> field a dipole experiences <b>zero net force</b> but a torque τ = pE sin θ, so it rotates into alignment without translating.</p>' },

    { q: 'Above the critical temperature, a gas', o: ['Liquefies readily under pressure', 'Cannot be liquefied by pressure alone', 'Becomes a solid', 'Obeys the ideal gas law exactly'], a: 1,
      e: '<p>Above <b>T_c</b> the molecular kinetic energy exceeds the intermolecular attraction, so no amount of pressure produces a liquid — the substance becomes a <b>supercritical fluid</b>.</p><p>This is why gases must be <em>cooled below</em> their critical temperature before compression liquefies them, and why oxygen (T_c = 155 K) cannot be liquefied at room temperature however hard it is squeezed.</p>' },

    { q: 'In a series LCR circuit at resonance', o: ['Impedance is maximum and current minimum', 'Impedance is minimum and equals the resistance', 'The current lags the voltage by 90°', 'No current flows'], a: 1,
      e: '<p>At resonance <b>X_L = X_C</b>, so the reactances cancel and <b>Z = R</b>, its minimum value. Current is therefore <b>maximum</b> and is <b>in phase</b> with the applied voltage.</p><p>Resonant frequency f = 1/(2π√(LC)). Note that a <em>parallel</em> LCR circuit behaves oppositely, with maximum impedance at resonance — a distinction examiners exploit.</p>' },

    { q: 'According to Gauss\'s law, the electric flux through a closed surface depends on', o: ['The shape of the surface', 'The charge enclosed by the surface only', 'All charges, inside and outside', 'The surface area only'], a: 1,
      e: '<p>Φ = q_enclosed/ε₀. The flux depends <b>only on the enclosed charge</b> — not on the surface\'s shape or size, nor on where inside the charge sits, nor on any external charges.</p><p>External charges do affect the field <em>at individual points</em> on the surface, but their contributions to the total flux cancel exactly, since their field lines enter and leave.</p>' },

    { q: 'Kirchhoff\'s junction rule is based on the conservation of', o: ['Energy', 'Charge', 'Momentum', 'Magnetic flux'], a: 1,
      e: '<p>The <b>junction rule</b> (ΣI = 0) says charge does not accumulate at a node — conservation of <b>charge</b>.</p><p>The <b>loop rule</b> (ΣV = 0) says a charge returning to its starting point has no net energy change — conservation of <b>energy</b>. Questions routinely ask for one and offer the other.</p>' }
  ]
});

window.MPSC.units.push({
  id: 'p3p3',
  paper: 'Paper III — Physics',
  title: 'Atomic, Nuclear Physics and Electronics',
  marks: 10,
  syllabus: 'Photoelectric effect, Einstein\'s photon theory, Bohr\'s theory of hydrogen atom and quantization, wave nature of matter, de Broglie wavelength, wave particle duality, Heisenberg\'s uncertainty relationships, Schrodinger equation-eigen values and eigen functions of particle in a box; radioactivity, binding energy of nuclei, nuclear fission and fusion. Intrinsic semiconductors, electron and holes, doping, impurity states, n and p type semiconductors, conductivity, mobility and Hall effect, p-n junction diode, majority and minority carriers; diode rectification, logic gates.',

  notes: [
    { h: 'Quantum foundations',
      b: '<p><b>Photoelectric effect:</b> hf = φ + KE_max, where φ is the work function. The findings that killed the wave theory of light:</p>' +
         '<ul><li>Emission occurs only above a <b>threshold frequency</b>, no matter how intense the light.</li>' +
         '<li><b>Maximum KE depends on frequency, not intensity.</b></li>' +
         '<li><b>Intensity determines the number</b> of photoelectrons, not their energy.</li>' +
         '<li>Emission is <b>instantaneous</b> — no lag while energy accumulates.</li></ul>' +
         '<p><b>Bohr model:</b> angular momentum quantised as mvr = nh/2π. For hydrogen, E_n = <b>−13.6/n²</b> eV, so the ionisation energy from the ground state is 13.6 eV. Radiation is emitted only on transition between levels. Series: Lyman (to n=1, ultraviolet), Balmer (to n=2, visible), Paschen (to n=3, infrared).</p>' +
         '<p><b>de Broglie:</b> λ = h/p = h/mv. Everything has a wavelength, but for macroscopic bodies it is unobservably small. This is the principle behind the electron microscope — a fast electron\'s wavelength is far shorter than that of visible light, giving far higher resolving power.</p>' +
         '<p><b>Heisenberg uncertainty:</b> Δx·Δp ≥ h/4π, and ΔE·Δt ≥ h/4π. This is a fundamental property of nature, <b>not</b> a limitation of measuring instruments — a distinction frequently tested.</p>' +
         '<p><b>Particle in a box:</b> E_n = n²h²/8mL². Energy is quantised, the lowest state has <b>non-zero</b> energy (zero-point energy, required by uncertainty), and levels spread further apart as n rises and closer together as the box widens.</p>' },

    { h: 'Nuclear physics',
      b: '<table><tr><th>Radiation</th><th>Nature</th><th>Charge</th><th>Penetration</th></tr>' +
         '<tr><td><b>Alpha</b></td><td>Helium nucleus</td><td>+2</td><td>Least — stopped by paper</td></tr>' +
         '<tr><td><b>Beta</b></td><td>Electron/positron</td><td>−1/+1</td><td>Moderate — a few mm of aluminium</td></tr>' +
         '<tr><td><b>Gamma</b></td><td>Electromagnetic</td><td>0</td><td><b>Greatest</b> — needs lead or concrete</td></tr></table>' +
         '<p><b>Ionising power runs opposite to penetrating power</b>: alpha ionises most and penetrates least.</p>' +
         '<p><b>Decay:</b> N = N₀e^(−λt); half-life t½ = 0.693/λ. After n half-lives the fraction remaining is <b>(½)ⁿ</b>. Alpha emission reduces A by 4 and Z by 2; beta-minus emission leaves A unchanged and <b>raises Z by 1</b>.</p>' +
         '<p><b>Binding energy</b> = Δm·c², from the <b>mass defect</b> — a nucleus weighs less than its constituent nucleons. The <b>binding energy per nucleon</b> curve peaks near <b>iron-56</b> (~8.8 MeV), which is why iron is the most stable nucleus and why both fusion (of light nuclei) and fission (of heavy nuclei) release energy — both move products <em>toward</em> that peak.</p>' +
         '<p><b>Fission</b> splits a heavy nucleus (U-235, Pu-239), typically induced by a slow neutron, and sustains a chain reaction. <b>Fusion</b> joins light nuclei, requires enormous temperature to overcome Coulomb repulsion, and powers stars. Fusion releases more energy <em>per unit mass</em>; fission releases more per <em>event</em>.</p>' },

    { h: 'Semiconductors and electronics',
      b: '<p><b>Band gaps:</b> conductor ~0 (overlapping bands), semiconductor ~1 eV (Si 1.1, Ge 0.7), insulator &gt; 3 eV. In a semiconductor, <b>conductivity increases with temperature</b> as electrons are promoted across the gap — the <b>opposite</b> of a metal, where rising temperature increases lattice scattering and hence resistance. That inversion is a favourite question.</p>' +
         '<p><b>Doping</b> (Si and Ge are tetravalent):</p>' +
         '<ul><li><b>n-type</b> — pentavalent dopant (P, As, Sb) donates a spare electron. <b>Majority carriers: electrons.</b></li>' +
         '<li><b>p-type</b> — trivalent dopant (B, Al, Ga) creates a hole. <b>Majority carriers: holes.</b></li></ul>' +
         '<p>Both types remain <b>electrically neutral</b> overall — doping adds carriers, not net charge. Minority carriers are thermally generated.</p>' +
         '<p><b>p-n junction:</b> diffusion creates a <b>depletion region</b> and a potential barrier (~0.7 V for Si, ~0.3 V for Ge). <b>Forward bias</b> narrows the barrier and conducts; <b>reverse bias</b> widens it and blocks. A <b>half-wave</b> rectifier uses one diode and passes one half-cycle; a <b>full-wave</b> rectifier (two diodes, or four in a bridge) passes both.</p>' +
         '<p><b>Hall effect:</b> a current-carrying conductor in a perpendicular magnetic field develops a transverse voltage. The <b>sign of the Hall voltage reveals the carrier type</b> — the standard experimental proof that conduction in p-type material is by positive holes.</p>' +
         '<p><b>Logic gates:</b> NAND and NOR are <b>universal</b> — any logic function can be built from either alone. De Morgan: (A·B)′ = A′ + B′ and (A + B)′ = A′·B′. XOR outputs 1 only when the inputs differ.</p>' }
  ],

  questions: [
    { q: 'In the photoelectric effect, increasing the intensity of incident light while keeping frequency constant increases', o: ['The maximum kinetic energy of photoelectrons', 'The number of photoelectrons emitted', 'The threshold frequency', 'The work function'], a: 1,
      e: '<p>Intensity means more <b>photons per second</b>, so more electrons are ejected — but each photon still carries energy hf, so the <b>maximum KE is unchanged</b>.</p><p>Maximum KE depends on <b>frequency</b> alone. Threshold frequency and work function are properties of the metal and are unaffected by the light. This experiment is what established the photon picture.</p>' },

    { q: 'The energy of the electron in the ground state of a hydrogen atom is', o: ['−3.4 eV', '−13.6 eV', '+13.6 eV', '−1.51 eV'], a: 1,
      e: '<p>E_n = −13.6/n² eV, so for n = 1, E = <b>−13.6 eV</b>. The negative sign denotes a bound state; 13.6 eV is therefore the ionisation energy from the ground state.</p><p>−3.4 eV is n = 2 and −1.51 eV is n = 3 — both offered as distractors, and both worth recognising for series questions.</p>' },

    { q: 'The binding energy per nucleon is maximum for nuclei around', o: ['Hydrogen', 'Iron', 'Uranium', 'Helium'], a: 1,
      e: '<p>The binding energy per nucleon curve peaks near <b>iron-56</b> at about 8.8 MeV, making iron the most stable nucleus.</p><p>This single fact explains both processes: <b>fusion</b> of light nuclei and <b>fission</b> of heavy nuclei both move products <em>toward</em> the peak, and both therefore release energy. It is also why stellar fusion halts at iron.</p>' },

    { q: 'A radioactive sample has a half-life of 5 years. The fraction remaining after 15 years is', o: ['1/3', '1/8', '1/15', '1/16'], a: 1,
      e: '<p>15 years is <b>3 half-lives</b>, so the fraction remaining is (½)³ = <b>1/8</b>.</p><p>Decay is exponential, not linear — the common error is dividing time by half-life and inverting, giving 1/3. Use the rule: after n half-lives, (½)ⁿ remains.</p>' },

    { q: 'In an n-type semiconductor, the majority carriers are', o: ['Holes', 'Electrons', 'Protons', 'Positive ions'], a: 1,
      e: '<p><b>n-type</b> is doped with a <b>pentavalent</b> impurity (P, As, Sb) which donates a spare electron, so <b>electrons</b> are the majority carriers. In p-type the trivalent dopant creates holes.</p><p>Note that the material stays <b>electrically neutral</b> — doping supplies mobile carriers, not net charge. Protons and ions are never mobile carriers in a solid, so (c) and (d) are non-starters.</p>' },

    { q: 'When the temperature of a pure semiconductor is increased, its electrical conductivity', o: ['Decreases, as in a metal', 'Increases, as more electrons cross the band gap', 'Remains constant', 'First increases then becomes zero'], a: 1,
      e: '<p>Rising temperature promotes more electrons across the ~1 eV gap into the conduction band, so <b>conductivity increases</b> (resistance falls) — semiconductors have a <b>negative</b> temperature coefficient of resistance.</p><p>This is the <b>opposite</b> of a metal, where the carrier count is fixed and heating simply increases lattice scattering, raising resistance. The inversion is the whole point of the question.</p>' },

    { q: 'Heisenberg\'s uncertainty principle states that', o: ['Measuring instruments are imperfect', 'Position and momentum cannot both be determined precisely, as a fundamental property of nature', 'Energy is always conserved', 'Electrons move in fixed orbits'], a: 1,
      e: '<p>Δx·Δp ≥ h/4π is a <b>fundamental property of nature</b>, not a statement about instrument quality — option (a) is the most common misconception and the reason this is asked.</p><p>It also invalidates the Bohr picture of definite orbits (option d): a precisely known orbital radius and momentum together are forbidden, which is why quantum mechanics replaced orbits with orbitals.</p>' },

    { q: 'Which pair of logic gates is universal?', o: ['AND and OR', 'NAND and NOR', 'XOR and XNOR', 'NOT and AND'], a: 1,
      e: '<p><b>NAND and NOR are universal</b> — either one alone can build every other gate, and hence any logic circuit.</p><p>This has real engineering consequence: fabricating a chip from a single repeated gate type is simpler and cheaper, which is why NAND-based design dominates. AND and OR cannot produce inversion, so they are not universal.</p>' },

    { q: 'The Hall effect is used primarily to determine', o: ['The band gap of a semiconductor', 'The type and concentration of charge carriers', 'The resistivity of a metal', 'The threshold frequency'], a: 1,
      e: '<p>The <b>sign</b> of the Hall voltage reveals whether the carriers are negative electrons or positive holes, and its <b>magnitude</b> gives the carrier concentration.</p><p>It provided the direct experimental confirmation that conduction in p-type material really is by positive holes, rather than being merely a convenient bookkeeping fiction.</p>' },

    { q: 'In beta-minus decay, the mass number A and atomic number Z of the nucleus change as', o: ['A decreases by 4, Z decreases by 2', 'A unchanged, Z increases by 1', 'A unchanged, Z decreases by 1', 'Both unchanged'], a: 1,
      e: '<p>In β⁻ decay a neutron converts to a proton plus an electron and an antineutrino. The nucleon count is unchanged so <b>A stays the same</b>, but a neutron has become a proton so <b>Z rises by 1</b>.</p><p>Option (a) is alpha decay; option (c) is β⁺ (positron) decay; option (d) is gamma emission, which changes neither.</p>' }
  ]
});
