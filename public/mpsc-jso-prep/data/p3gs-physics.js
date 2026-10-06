/* Paper III, Part A — General Science, UNIT I: PHYSICAL SCIENCE (34 marks). */

window.MPSC.units.push({
  id: 'p3p1',
  paper: 'Paper III — Physics',
  title: 'Mechanics, Waves and Optics',
  marks: 14,
  syllabus: 'Laws of motion, conservation of energy, linear momentum and angular momentum, gravitational field and potential due to spherical bodies, Kepler\'s laws; work done by constant force and variable force, work-energy theorem, power, elastic and inelastic collisions, rigid body, degrees of freedom, angular velocity, angular momentum, moments of inertia. Simple harmonic motion, damped oscillation, forced oscillation and resonance, wave motion, longitudinal and transverse waves, speed of travelling wave, principle of superposition of waves. Laws of reflection and refraction; system of two thin lenses; total internal reflection and its applications, magnification, power of a lens, interference of light-Young\'s experiment; interference by thin films, Fraunhofer diffraction-single slit, diffraction grating, resolving power, Fresnel diffraction, half period zones and zone plates.',

  notes: [
    { h: 'In plain language — motion and light',
      b: '<div class="analogy"><b>Force and momentum:</b> think of pushing shopping carts. A heavier or faster cart is harder to stop because it has more momentum; a longer push changes its motion more. The work–energy theorem says that the push transfers energy, which shows up as a change in speed.<br><br><b>Rotation:</b> a door is easier to swing when you push far from its hinge. The same force has more turning effect because it acts with a longer lever arm.<br><br><b>Waves:</b> a wave carries a pattern and energy forward, while the material mostly wiggles in place. Light fringes appear where wave peaks meet (bright) or peaks meet troughs (dark). A diffraction pattern is what happens when waves spread after passing a narrow opening.</div>' },
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
      e: '<p>A closed pipe has a node at the closed end and an antinode at the open end, permitting only <b>odd harmonics</b> (1st, 3rd, 5th…). Its fundamental is v/4L.</p><p>An open pipe supports all harmonics with fundamental v/2L — so a closed pipe of the same length sounds an octave <em>lower</em>, which is why organ builders use them for deep notes in short spaces.</p>' },

    { q: 'A force F = 3x² N acts along the x-axis. The work done as an object moves from x = 0 to x = 2 m is', o: ['4 J', '6 J', '8 J', '12 J'], a: 2,
      e: '<p>For a variable force, <b>W = ∫F dx</b>. Thus W = ∫₀² 3x² dx = [x³]₀² = <b>8 J</b>.</p><p>Using F at the endpoint times distance would be wrong because the force changes throughout the displacement. On an F–x graph, this integral is the area under the curve.</p>' },

    { q: 'The gravitational potential at distance r outside a spherical body of mass M is', o: ['GM/r²', '−GM/r', '−GMr', 'Zero everywhere outside'], a: 1,
      e: '<p>With zero potential chosen at infinity, <b>V = −GM/r</b>. The negative sign means a test mass is gravitationally bound; work must be supplied to carry it from r to infinity.</p><p>The field magnitude is GM/r², so potential and field are different quantities with different distance dependence. The shell theorem lets a spherical body be treated as a point mass at its centre for external points.</p>' },

    { q: 'A planet moves in an elliptical orbit. It moves fastest when it is', o: ['Farthest from the Sun', 'Nearest to the Sun', 'At either end of the minor axis only', 'At constant speed everywhere'], a: 1,
      e: '<p>Kepler’s equal-areas law says equal areas are swept in equal times. Near the Sun the planet must move faster to sweep the same area, so it is fastest at <b>perihelion</b> and slowest at aphelion.</p><p>This is also angular-momentum conservation: the Sun’s gravitational force is central, so its torque about the Sun is zero.</p>' },

    { q: 'If the orbital radius of a satellite around the same planet is increased by a factor of 4, its orbital period changes by a factor of', o: ['2', '4', '8', '16'], a: 2,
      e: '<p>Kepler’s third law gives <b>T² ∝ r³</b>, hence T ∝ r^(3/2). Increasing r by 4 multiplies T by 4^(3/2) = <b>8</b>.</p><p>The proportionality assumes the satellite mass is negligible compared with the planet and the orbit is governed by that planet’s gravity.</p>' },

    { q: 'A 2 kg body moving at 3 m/s sticks to a stationary 1 kg body. Their common speed after collision is', o: ['1 m/s', '2 m/s', '3 m/s', '6 m/s'], a: 1,
      e: '<p>Conserve linear momentum: (2 kg)(3 m/s) + (1 kg)(0) = (3 kg)v. Therefore <b>v = 2 m/s</b>.</p><p>The collision is perfectly inelastic because the bodies stick. Initial KE is 9 J; final KE is 6 J, so 3 J becomes heat, sound or deformation, while momentum remains conserved.</p>' },

    { q: 'A solid cylinder rolls without slipping down a slope. Its total kinetic energy is', o: ['Only translational, ½Mv²', 'Only rotational, ½Iω²', 'Translational plus rotational kinetic energy', 'Zero because static friction does no work'], a: 2,
      e: '<p>Rolling motion combines centre-of-mass translation and rotation: <b>K = ½Mv² + ½Iω²</b>, with v = ωR for rolling without slipping.</p><p>Static friction can provide the torque that starts rotation even when its point of contact has zero instantaneous velocity relative to the surface; the no-slip condition does not remove either energy term.</p>' },

    { q: 'For a mass–spring oscillator, the total mechanical energy is quadrupled when the amplitude is', o: ['Halved', 'Doubled', 'Tripled', 'Unchanged'], a: 1,
      e: '<p>Total energy is <b>E = ½kA²</b>. Doubling amplitude multiplies energy by 2² = <b>4</b>.</p><p>Energy is proportional to amplitude squared, not amplitude itself. At equilibrium all of this energy is kinetic; at the turning points it is elastic potential energy.</p>' },

    { q: 'Two coherent light waves have a path difference of 3λ/2. Their interference is', o: ['Constructive', 'Destructive', 'Always zero intensity regardless of amplitudes', 'Impossible to determine because wavelength is unknown'], a: 1,
      e: '<p>A path difference of (m + ½)λ gives a phase difference of an odd multiple of π and therefore <b>destructive interference</b> for equal amplitudes. Here 3λ/2 = (1 + ½)λ.</p><p>For unequal amplitudes the minimum is not perfectly dark, but it is still the condition for a minimum.</p>' },

    { q: 'In Young’s double-slit experiment, the entire apparatus is immersed in a liquid of refractive index 1.5. The new fringe width is', o: ['1.5β', 'β', 'β/1.5', 'β/1.5²'], a: 2,
      e: '<p>In the medium, frequency stays fixed while wavelength becomes λ/n. Since β = λD/d, the new width is <b>β/n = β/1.5</b>.</p><p>The common mistake is to multiply by n. The wave slows in the liquid, so its wavelength and the fringe spacing shrink.' }
  ]
});

window.MPSC.units.push({
  id: 'p3p2',
  paper: 'Paper III — Physics',
  title: 'Thermodynamics and Electrodynamics',
  marks: 10,
  syllabus: 'Laws of thermodynamics, reversible and irreversible processes, entropy; isothermal, adiabatic, isobaric processes and entropy changes; van der Waals equation of state of real gas, critical constants, Maxwell-Boltzmann distribution of molecular velocities. Coulomb\'s law, electric field, Gauss\' law; electric potential; capacitors, dielectrics and polarization, Ohm\'s law, Kirchhoff\'s first and second rules, resistors in series and parallel, potential and field due to a dipole, force and torque on a dipole in an external field, Biot-Savart law, Ampere\'s law, Faraday\'s law; Lenz law; self and mutual inductances, DC and AC circuits with R, L and C components.',

  notes: [
    { h: 'In plain language — heat, charge and circuits',
      b: '<div class="analogy"><b>Thermodynamics:</b> imagine gas in a piston. Heating it can warm the gas (raise internal energy), push the piston (do work), or do both. The first law is the bookkeeping rule that keeps those energy changes balanced. Entropy describes how spread out energy is; in ordinary real processes, some energy becomes less available to do useful work.<br><br><b>Circuits:</b> voltage is like electrical pressure, current is the rate of charge flow, and resistance is the narrowing of the pipe. A capacitor is like a tiny charge-storage tank. An inductor resists sudden changes in current, much as a heavy flywheel resists a sudden change in spinning speed.<br><br><b>Induction:</b> changing the magnetic field through a loop makes a voltage. The induced current pushes back against the change, like a spring resisting being compressed.</div>' },
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
      e: '<p>The <b>junction rule</b> (ΣI = 0) says charge does not accumulate at a node — conservation of <b>charge</b>.</p><p>The <b>loop rule</b> (ΣV = 0) says a charge returning to its starting point has no net energy change — conservation of <b>energy</b>. Questions routinely ask for one and offer the other.</p>' },

    { q: 'One mole of an ideal gas expands isothermally and reversibly from V to 2V at temperature T. The work done by the gas is', o: ['RT ln 2', 'RT', '2RT', 'Zero'], a: 0,
      e: '<p>For a reversible isothermal ideal-gas expansion, <b>W = nRT ln(V₂/V₁)</b>. With n = 1 and V₂/V₁ = 2, W = RT ln 2.</p><p>Isothermal means ΔU = 0 for an ideal gas, so the heat absorbed equals this work. The result depends on the path: an irreversible expansion between the same endpoints need not have the same work.</p>' },

    { q: 'For one mole of an ideal gas in a reversible adiabatic process, the heat exchanged is', o: ['Positive', 'Negative', 'Zero', 'Equal to the change in entropy'], a: 2,
      e: '<p>Adiabatic means <b>Q = 0</b> by definition. From the first law ΔU = Q − W, so ΔU = −W: expansion cools the gas and compression heats it.</p><p>A reversible adiabatic process is isentropic (ΔS = 0); an irreversible adiabatic process can have increasing entropy even though no heat crosses the boundary.</p>' },

    { q: 'A heat engine absorbs 800 J from a hot reservoir and rejects 500 J to a cold reservoir each cycle. Its efficiency is', o: ['37.5%', '62.5%', '160%', 'Cannot be calculated'], a: 0,
      e: '<p>Work output is Qₕ − Q𝚌 = 800 − 500 = 300 J. Efficiency <b>η = W/Qₕ = 300/800 = 0.375 = 37.5%</b>.</p><p>Do not divide by the rejected heat. A real engine’s efficiency is below the Carnot limit for its two reservoir temperatures.</p>' },

    { q: 'A parallel-plate capacitor remains connected to a battery while a dielectric of constant K is inserted fully. Which quantity increases?', o: ['Potential difference', 'Charge on the plates', 'Plate separation', 'Battery emf'], a: 1,
      e: '<p>The battery fixes the potential difference. The dielectric raises capacitance from C₀ to <b>KC₀</b>, so Q = CV also rises by K.</p><p>If the capacitor were isolated instead, Q would stay fixed and the voltage would fall. Always identify whether the battery remains connected.</p>' },

    { q: 'A 6 Ω resistor and a 3 Ω resistor are connected in parallel. Their equivalent resistance is', o: ['9 Ω', '3 Ω', '2 Ω', '18 Ω'], a: 2,
      e: '<p>For parallel resistors, 1/R = 1/6 + 1/3 = 3/6 = 1/2, so <b>R = 2 Ω</b>.</p><p>The equivalent resistance must be smaller than the smallest branch resistance (3 Ω); this quick check rules out 3, 9 and 18 Ω.</p>' },

    { q: 'An electric dipole p is placed in a uniform electric field E at angle θ. Its potential energy is', o: ['pE sin θ', '−pE cos θ', 'pE tan θ', 'Zero for every orientation'], a: 1,
      e: '<p>Dipole potential energy is <b>U = −p·E = −pE cos θ</b>. It is lowest when aligned with the field (θ = 0) and highest when anti-aligned (θ = π).</p><p>The torque magnitude is pE sin θ; torque and potential energy are related but are not the same expression.</p>' },

    { q: 'A long straight wire carries current I. If the current is doubled and the observation distance is also doubled, the magnetic field magnitude', o: ['Doubles', 'Halves', 'Is unchanged', 'Becomes four times larger'], a: 2,
      e: '<p>For a long straight wire, <b>B = μ₀I/(2πr)</b>. Doubling I and r leaves I/r unchanged, so the field is unchanged.</p><p>The result follows from Ampère’s law and assumes the observation point is far from wire ends.</p>' },

    { q: 'A coil has 100 turns and the magnetic flux through each turn changes by 0.02 Wb in 0.1 s. The magnitude of the induced emf is', o: ['0.02 V', '2 V', '20 V', '200 V'], a: 2,
      e: '<p>Faraday’s law gives |ε| = N|ΔΦ/Δt| = 100 × 0.02/0.1 = <b>20 V</b>.</p><p>The induced emf depends on the rate of flux change and the number of turns. Lenz’s law supplies its direction: it opposes the change in flux.</p>' },

    { q: 'In a pure inductor connected to an ideal AC source, the current', o: ['Leads voltage by π/2', 'Lags voltage by π/2', 'Is in phase with voltage', 'Is always zero'], a: 1,
      e: '<p>For an ideal inductor, voltage leads current by 90°, so current <b>lags voltage by π/2</b>. Its reactance is Xₗ = ωL.</p><p>For a pure capacitor the relation reverses: current leads voltage by π/2. A resistor has voltage and current in phase.</p>' }
  ]
});

window.MPSC.units.push({
  id: 'p3p3',
  paper: 'Paper III — Physics',
  title: 'Atomic, Nuclear Physics and Electronics',
  marks: 10,
  syllabus: 'Photoelectric effect, Einstein\'s photon theory, Bohr\'s theory of hydrogen atom and quantization, wave nature of matter, de Broglie wavelength, wave particle duality, Heisenberg\'s uncertainty relationships, Schrodinger equation-eigen values and eigen functions of particle in a box; radioactivity, binding energy of nuclei, nuclear fission and fusion. Intrinsic semiconductors, electron and holes, doping, impurity states, n and p type semiconductors, conductivity, mobility and Hall effect, p-n junction diode, majority and minority carriers; diode rectification, logic gates.',

  notes: [
    { h: 'In plain language — atoms and tiny switches',
      b: '<div class="analogy"><b>Photons:</b> light delivers energy in packets. A brighter beam means more packets arriving; a higher frequency means each packet carries more energy. That is why brightness controls how many electrons escape, while frequency controls how energetic they are.<br><br><b>Radioactivity:</b> a half-life is a repeated halving, like a pile of 100 seeds where half are removed each round: 100 → 50 → 25 → 12.5. The pile does not lose the same fixed number each time.<br><br><b>Semiconductors:</b> picture a small energy step between two floors. Heat or light can lift electrons to the upper floor, where they can move through the material. Doping adds extra mobile electrons or creates missing-electron spots called holes. A diode is a one-way gate for current.</div>' },
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
      e: '<p>In β⁻ decay a neutron converts to a proton plus an electron and an antineutrino. The nucleon count is unchanged so <b>A stays the same</b>, but a neutron has become a proton so <b>Z rises by 1</b>.</p><p>Option (a) is alpha decay; option (c) is β⁺ (positron) decay; option (d) is gamma emission, which changes neither.</p>' },

    { q: 'Light of frequency 8 × 10¹⁴ Hz falls on a metal with work function 2 eV. Using h = 4.14 × 10⁻¹⁵ eV·s, the maximum photoelectron kinetic energy is approximately', o: ['0.31 eV', '1.31 eV', '2.00 eV', '3.31 eV'], a: 1,
      e: '<p>Photon energy is hf = (4.14 × 10⁻¹⁵)(8 × 10¹⁴) = 3.312 eV. Einstein’s equation gives <b>KEₘₐₓ = hf − φ = 3.312 − 2 ≈ 1.31 eV</b>.</p><p>The threshold frequency is φ/h; below it no photoelectrons are emitted regardless of intensity.</p>' },

    { q: 'The de Broglie wavelength of a particle is doubled if its momentum is', o: ['Doubled', 'Halved', 'Quadrupled', 'Unchanged'], a: 1,
      e: '<p>de Broglie’s relation is <b>λ = h/p</b>. Wavelength is inversely proportional to momentum, so halving p doubles λ.</p><p>For an electron accelerated through potential V, eV = p²/(2m), giving λ = h/√(2meV); therefore λ ∝ 1/√V.</p>' },

    { q: 'A hydrogen atom emits a photon when its electron makes a transition from n = 3 to n = 2. This line belongs to the', o: ['Lyman series', 'Balmer series', 'Paschen series', 'Brackett series'], a: 1,
      e: '<p>The Balmer series consists of transitions that <b>end at n = 2</b>; its lines are mainly visible. Lyman ends at n = 1 (ultraviolet), while Paschen ends at n = 3 (infrared).</p><p>Series names are identified by the final level, not the initial level.</p>' },

    { q: 'The number of half-lives required for a radioactive sample to fall to one-eighth of its initial undecayed nuclei is', o: ['2', '3', '4', '8'], a: 1,
      e: '<p>After n half-lives, the remaining fraction is (1/2)ⁿ. Since 1/8 = (1/2)³, the sample has undergone <b>3 half-lives</b>.</p><p>This describes the undecayed parent nuclei. The number of daughter nuclei formed depends on the initial sample and whether daughters are stable.</p>' },

    { q: 'A radioactive isotope has decay constant λ. Its mean lifetime τ is', o: ['λ', '1/λ', '0.693λ', '0.693/λ'], a: 1,
      e: '<p>The exponential decay law is N = N₀e^(−λt). The mean lifetime is <b>τ = 1/λ</b>; the half-life is t₁/₂ = ln 2/λ ≈ 0.693/λ.</p><p>Mean lifetime and half-life are related but not identical: τ ≈ 1.443 t₁/₂.</p>' },

    { q: 'A nucleus has a mass defect of 0.01 u. Using 1 u c² ≈ 931.5 MeV, its binding energy is approximately', o: ['0.093 MeV', '9.315 MeV', '93.15 MeV', '9315 MeV'], a: 1,
      e: '<p>Binding energy is Δmc² = 0.01 × 931.5 = <b>9.315 MeV</b>.</p><p>That is the total binding energy. Binding energy per nucleon requires dividing by the mass number A and is the better measure for comparing nuclear stability.</p>' },

    { q: 'A silicon sample is doped with phosphorus. The resulting semiconductor is', o: ['p-type, with holes as majority carriers', 'n-type, with electrons as majority carriers', 'Intrinsic, with equal carrier concentrations', 'An insulator'], a: 1,
      e: '<p>Phosphorus is pentavalent. Four valence electrons form bonds with neighbouring silicon atoms, leaving one donor electron, so the material is <b>n-type</b> with electrons as majority carriers.</p><p>The crystal remains electrically neutral overall: the mobile electrons are balanced by positively charged donor ions.</p>' },

    { q: 'For an ideal p–n diode under forward bias, the depletion-region barrier', o: ['Increases and current stops', 'Decreases and current rises strongly', 'Is unchanged and no current flows', 'Reverses the majority carriers'], a: 1,
      e: '<p>Forward bias opposes the built-in junction field, reducing the potential barrier and narrowing the depletion region. Majority carriers can cross more easily, so the current rises strongly.</p><p>Reverse bias widens the depletion region and blocks majority-carrier current, apart from a small reverse saturation current until breakdown.</p>' },

    { q: 'Which logic gate produces output 1 only when its two inputs are different?', o: ['AND', 'OR', 'XOR', 'XNOR'], a: 2,
      e: '<p><b>XOR</b> is 1 for inputs 01 and 10, and 0 for 00 and 11. XNOR gives the complement: 1 when the inputs are equal.</p><p>For two inputs, XOR is also the sum bit in a half-adder; AND gives the carry bit.</p>' },

    { q: 'For a particle in a one-dimensional infinite potential well of width L, the energy of level n is proportional to', o: ['n/L', 'n²/L²', '1/n²L²', 'L²/n²'], a: 1,
      e: '<p>The allowed energies are <b>Eₙ = n²h²/(8mL²)</b>, so E is proportional to n²/L².</p><p>The ground-state energy is not zero: confinement forces a nonzero momentum uncertainty. Widening the well reduces the level energies and their spacing.</p>' }
  ]
});
