import type { MindMap } from './types';

// Mined from olol: Lecture 6 (Judiciary).pptx + Lecture 6(SC).pptx
export const judiciaryMindMap: MindMap = {
  id: 'judiciary',
  title: 'Judiciary, Writs & PIL',
  description: 'One integrated pyramid — SC, Article 32, the five writs, and PIL.',
  root: {
    id: 'root',
    label: 'JUDICIARY',
    note: 'Salient features of the Indian judiciary — a single, integrated system.',
    chapterId: 'polity-judiciary',
    children: [
      {
        id: 'pyramid',
        label: 'Single integrated system',
        note: 'SC at the apex, High Courts at state level, subordinate courts below — all links of one chain.',
        children: [
          { id: 'sc', label: 'Supreme Court', note: 'Part V, Ch IV; Articles 124–147. Guardian and final interpreter of the Constitution; runs judicial administration.' },
          { id: 'hc', label: 'High Courts', note: 'One per state — but two or more states may share a Joint High Court (e.g. Gauhati HC for Assam, Nagaland, Mizoram, Arunachal).', chapterId: 'polity-judiciary' },
          { id: 'sub', label: 'Subordinate courts', note: 'Work under the High Courts.' },
        ],
      },
      {
        id: 'independence',
        label: 'Independence',
        children: [
          { id: 'in-app', label: 'Appointment by President' },
          { id: 'in-rem', label: 'Difficult impeachment', note: 'Removal only by a rigorous process.' },
          { id: 'in-sal', label: 'Protected salaries & pensions' },
          { id: 'in-est', label: 'Independent establishment', note: 'Plus adequate powers and functional autonomy.' },
        ],
      },
      {
        id: 'roles',
        label: 'Roles of the SC',
        children: [
          { id: 'ro-interp', label: 'Interpreter of the Constitution' },
          { id: 'ro-fed', label: 'Federal arbiter', note: 'Centre vs state(s); Centre + states vs states; state vs state.' },
          { id: 'ro-fr', label: 'Guardian of FRs', note: 'SC and HCs issue writs; SC can strike down laws violating Fundamental Rights (judicial review).' },
          { id: 'ro-open', label: 'Open trial & legal aid', note: 'Free courts, open trials, free legal aid for the poor.' },
        ],
      },
      {
        id: 'art32',
        label: 'Article 32',
        note: 'Right to Constitutional Remedies — "heart and soul of the Constitution" (Ambedkar). Art 32(2) confers writ jurisdiction.',
        children: [
          { id: 'w-hc', label: 'Habeas Corpus', note: 'Produce the detained person; valid reasons or release. Not against contempt proceedings of a legislature or court.' },
          { id: 'w-man', label: 'Mandamus', note: '"We command" — perform a public duty. Never against a private individual.' },
          { id: 'w-pro', label: 'Prohibition', note: 'Stop a lower court acting outside jurisdiction — judicial/quasi-judicial authorities only.' },
          { id: 'w-cer', label: 'Certiorari', note: 'Transfer or quash a lower court\u2019s decision — excess or lack of jurisdiction.' },
          { id: 'w-quo', label: 'Quo Warranto', note: '"By what authority?" — tests a claim to public office.' },
          { id: 'w-226', label: 'Art 32 vs Art 226', note: 'SC: Fundamental Rights only. HCs: FRs + other legal rights — wider.' },
        ],
      },
      {
        id: 'pil',
        label: 'PIL',
        note: 'Pro bono publico — for the common good. Judge-made law; only SC & HCs.',
        children: [
          { id: 'pil-usa', label: 'Origin: USA', note: 'There called Social Action Litigation.' },
          { id: 'pil-locus', label: 'No locus standi', note: 'Any member of the public can petition for the marginalised; even a postcard can be a petition; fees can be waived.' },
          { id: 'pil-hk', label: 'Hussainara Khatoon (1979)', note: 'v. State of Bihar, 9 Mar 1979 — right to speedy trial; ~40,000 undertrials released. The first great PIL.', chapterId: 'polity-judiciary' },
          { id: 'pil-fx', label: 'Effects', note: 'Expanded FRs, forced constitutional obligations, justice for the poor; judicial activism + Lok Adalats.' },
        ],
      },
    ],
  },
};
