import type { MindMap } from './types';

// ============================================
// UD&PA Mizoram — department map.
//
// Structure is taken from the department's own site navigation
// (udpa.mizoram.gov.in), so the wings, scheme list and citizen-service
// entries mirror how the department actually organises itself rather than
// how an outsider would guess. Figures are sourced where known and flagged
// where not — see the ⚠️ notes.
//
// Built for the MUDAL System Manager interview: the IT-relevance branch is
// the one that turns this from GK into an answer.
// ============================================

export const udpaMindMap: MindMap = {
  id: 'udpa',
  title: 'UD&PA Mizoram — Department Map',
  description: 'Wings, schemes, RERA, citizen services and MUDAL — and where the IT work actually sits.',
  subject: 'polity',
  root: {
    id: 'root',
    label: 'UD&PA DEPARTMENT',
    note: 'Urban Development & Poverty Alleviation Department, Government of Mizoram. Established 24 August 2006. Directorate at New Secretariat Complex (MINECO), Khatla, Aizawl. Covers 28 towns.',
    children: [
      {
        id: 'leadership',
        label: 'Who runs it',
        note: 'Names a panel expects you to know without hesitation.',
        children: [
          { id: 'ld-min', label: 'Minister — Pu K. Sapdanga', note: 'Holds Home, UD&PA, and Personnel & Administrative Reforms. In office since 8 Dec 2023.' },
          { id: 'ld-cs', label: 'Commissioner & Secretary — V. Lalsangliana', note: 'Signed Advertisement No.1 of 2026–2027 — your recruitment notice.' },
          { id: 'ld-us', label: 'Under Secretary — Lalrinsanga Hnamte', note: 'Countersigned the same advertisement.' },
          { id: 'ld-cm', label: 'Chief Minister — Pu Lalduhoma', note: 'ZPM. Holds Finance, Planning, Vigilance, GAD, Political & Cabinet, Law & Judicial.' },
        ],
      },
      {
        id: 'structure',
        label: 'Organisational structure',
        note: 'Directly from the department\'s own Establishment listing.',
        children: [
          { id: 'st-dir', label: 'Directorate Office', note: 'Headquarters.' },
          { id: 'st-tcp', label: 'Town & Country Planning (TCP)', note: 'Master plans, land-use zoning, development control. The wing that depends on spatial land data — your DILRMP bridge.' },
          { id: 'st-san', label: 'Sr. Sanitation Office', note: 'Sanitation and solid waste.' },
          {
            id: 'st-dudo',
            label: '9 DUDO offices',
            note: 'District Urban Development Offices: Lunglei, Champhai, Kolasib, Mamit, Serchhip, Khawzawl, Hnahthial, Saitual — plus Aizawl.',
          },
          { id: 'st-css', label: 'Centrally Sponsored Scheme cell', note: 'Listed as its own establishment unit — the scheme-delivery arm.' },
          { id: 'st-mudal', label: 'MUDAL (PSU)', note: 'Mizoram Urban Development Agency Ltd — the department\'s implementing company. See its own branch.' },
        ],
      },
      {
        id: 'schemes',
        label: 'Schemes',
        note: 'Each reports upward to MoHUA with MIS, dashboard and geo-tagging obligations. That reporting burden is why the IT function matters.',
        children: [
          {
            id: 'sc-amrut',
            label: 'AMRUT / AMRUT 2.0',
            note: 'Water supply, sewerage, septage, water-body rejuvenation, urban green spaces. Largely CAPITAL, not O&M. Carries the GIS-based Master Plan sub-scheme (~₹515 cr, 1:4000 geo-referenced base + land-use maps, TCPO nodal, NRSC contracted) — your strongest GIS bridge.',
          },
          { id: 'sc-pmay', label: 'PMAY-U / PMAY-U 2.0', note: 'Housing. Four verticals: BLC (Beneficiary-Led Construction), AHP (Affordable Housing in Partnership), ISSR (In-Situ Slum Redevelopment), CLSS (Credit Linked Subsidy).' },
          { id: 'sc-sbm', label: 'SBM-U / SBM-U 2.0', note: 'Garbage Free Cities. Ladder: ODF → ODF+ → ODF++ → Water+. Star rating, legacy dump remediation, Swachh Survekshan.' },
          { id: 'sc-nulm', label: 'DAY-NULM', note: 'The "Poverty Alleviation" half of the name. SEP, EST&P, SM&ID (SHGs), SUH (shelter for urban homeless), SUSV (street vendors).' },
          { id: 'sc-scm', label: 'Smart Cities Mission — CLOSED', note: 'Ended 31 March 2025. Aizawl was Mizoram\'s only Smart City, delivered via Aizawl Smart City Ltd (ASCL). Its assets and mandate passed to MUDAL.' },
        ],
      },
      {
        id: 'rera',
        label: 'RERA — the regulatory arm',
        note: 'Real Estate Regulatory Authority sits under UD&PA. Easy to miss, and a genuine differentiator if you mention it — most candidates think of the department as schemes only.',
        children: [
          { id: 'rera-auth', label: 'Authority', note: 'The regulator itself.' },
          { id: 'rera-reg', label: 'Registration', note: 'Project and agent registration — a records-and-workflow system, i.e. an IT surface.' },
          { id: 'rera-comp', label: 'Complaints', note: 'Adjudication of buyer complaints.' },
          { id: 'rera-aml', label: 'AML & CFT guidelines', note: 'Anti-money-laundering / countering financing of terrorism guidelines published 2022 and 2023.' },
          { id: 'rera-rep', label: 'Annual Report', note: 'Latest published on the site: 2021–2022.' },
        ],
      },
      {
        id: 'citizen',
        label: 'Citizen-facing services',
        note: 'Every one of these is a digital touchpoint — which is precisely where a System Manager\'s work lands.',
        children: [
          { id: 'ci-rti', label: 'RTI', note: 'Department lists DDA, SPIO and SAPIO, plus an online application route.' },
          { id: 'ci-pg', label: 'Public Grievance Portal', note: 'General grievance intake.' },
          { id: 'ci-vendor', label: 'Street vendor grievance form', note: 'DAY-NULM Grievance Redressal for Street Vendors — an online form, linked to SUSV.' },
          { id: 'ci-pwd', label: 'Grievance officers for Persons with Disabilities', note: 'A named, separate redressal channel.' },
          { id: 'ci-dustbin', label: 'Adopt-A-Dustbin', note: 'A local civic initiative with an application form, FAQ and image gallery. Worth knowing by name — it shows you read the department site, not just the scheme list.' },
          { id: 'ci-charter', label: "Citizen's Charter", note: 'Published service commitments.' },
        ],
      },
      {
        id: 'mudal',
        label: 'MUDAL & the ICCC',
        note: 'The PSU you are applying to, and the asset you would most likely own.',
        children: [
          { id: 'mu-what', label: 'MUDAL', note: 'Mizoram Urban Development Agency Ltd — Govt of Mizoram PSU under UD&PA. Board\'s first meeting 28 July 2026 approved your exam syllabus. First recruitment: 12 posts.' },
          { id: 'mu-ascl', label: 'ASCL legacy', note: 'Aizawl Smart City Ltd\'s ~43 projects, assets, contracts and data now consolidating into MUDAL. This transition is the live problem.' },
          {
            id: 'mu-iccc',
            label: 'ICCC — Aizawl Ven Buk',
            note: '₹87.18 cr. 237 fixed + 39 PTZ cameras across 76 locations. Facial recognition at 5 sites, ANPR, 5 VMD boards, 15 public Wi-Fi points. ~30-day retention. ~₹7.8 lakh/month O&M. Inaugurated 1 Apr 2023 by the Union Home Minister.',
          },
          { id: 'mu-projects', label: 'Other delivered projects', note: 'Solid waste facility (~₹41 cr, incineration + ~75 TPD MRF at Luangmual); 37 MLD water treatment plant (damaged by Cyclone Remal, resumed ~Apr 2025); Chaltlang Sports Complex; Laldenga Cultural Centre; City Centre complex.' },
          { id: 'mu-money', label: 'The funding problem', note: 'SCM grant funding ended; the ICCC is now a State liability. Strong answers: State budget provision, cost rationalisation from audit, SLA-linked AMC, CSR. ⚠️ NOT AMRUT (capital/water, not O&M) and NOT ANPR challan revenue (MUDAL has no enforcement powers).' },
        ],
      },
      {
        id: 'itwork',
        label: '⭐ Where the IT work actually sits',
        note: 'This branch is what turns department GK into an interview answer. If asked "what would you do here?", these are the surfaces.',
        children: [
          { id: 'it-mis', label: 'Scheme MIS & MoHUA reporting', note: 'Every scheme reports upward — progress, utilisation, geo-tagging, physical verification. The IT function is how the department proves delivery and draws down funds.' },
          { id: 'it-gis', label: 'GIS & spatial data', note: 'AMRUT GIS master plans, urban asset mapping, property tax base mapping. Your DILRMP experience lands here directly.' },
          { id: 'it-iccc', label: 'ICCC operations', note: 'Uptime, camera network, storage and retention, vendor AMC against SLAs, Police/Traffic integration, access control and audit on facial recognition.' },
          { id: 'it-records', label: 'Records digitisation', note: 'Building permission files, property records, DPRs, PMAY-U and NULM beneficiary records — the same scan/clean/index/retrieve workflow you ran at DILRMP.' },
          { id: 'it-citizen', label: 'Citizen service systems', note: 'RTI, grievance portals, RERA registration and complaints, street-vendor redressal — all workflow systems needing maintenance and integration.' },
          { id: 'it-gov', label: 'IT governance', note: 'Asset register, AMC expiry calendar, e-Office and DSC administration, documentation, BCP/DRP, DPDP Act compliance.' },
        ],
      },
      {
        id: 'docs',
        label: 'Published document classes',
        note: 'What the department puts on record — useful to know the categories exist.',
        children: [
          { id: 'doc-rr', label: 'Recruitment Rules', note: 'Engineering wing, Inspector of Sanitation, Joint/Deputy Director.' },
          { id: 'doc-orders', label: 'Orders', note: 'Promotion, appointment, pension/resignation, office orders.' },
          { id: 'doc-legal', label: 'Acts, Rules, Notifications' },
          { id: 'doc-tender', label: 'Tenders' },
          { id: 'doc-slb', label: 'Service Level Benchmark', note: 'Published service standards — the measurement side of delivery.' },
          { id: 'doc-qms', label: 'QMS', note: 'Quality Management System — the department maintains one.' },
        ],
      },
    ],
  },
};
