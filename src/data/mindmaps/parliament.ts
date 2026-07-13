import type { MindMap } from './types';

// Mined from olol: Lecture 3 (Parliament).pptx
export const parliamentMindMap: MindMap = {
  id: 'parliament',
  title: 'Parliament (Art 79–108)',
  description: 'Structure, sessions, Speaker, devices, RS vs LS — the whole lecture as one tree.',
  root: {
    id: 'root',
    label: 'PARLIAMENT',
    note: 'Articles 79–108. Structure, functioning, conduct of business, powers and privileges.',
    chapterId: 'polity-parliament',
    children: [
      {
        id: 'structure',
        label: 'Structure (Art 79–81)',
        children: [
          { id: 'president', label: 'President', note: 'Part of Parliament though not a member of either House — assent mandatory for a Bill to become an Act.' },
          {
            id: 'rs',
            label: 'Rajya Sabha (Art 80)',
            note: 'Council of States — max 250.',
            children: [
              { id: 'rs-238', label: '\u2264238 state/UT reps', note: 'Elected by elected MLAs via proportional representation by single transferable vote; UT members as Parliament prescribes; seats per the Fourth Schedule.' },
              { id: 'rs-12', label: '12 nominated', note: 'By the President — literature, science, art, social service.' },
              { id: 'rs-cont', label: 'Continuing house (Art 83)', note: 'Never dissolved; one-third retires every 2nd year; member term 6 years.' },
            ],
          },
          {
            id: 'ls',
            label: 'Lok Sabha',
            note: 'House of the People.',
            children: [
              { id: 'ls-550', label: 'Max 550 (543 filled)', note: '530 states + 20 UTs; UT seats by direct election under the 1965 Act; Anglo-Indian nomination removed effective Jan 2020.' },
              { id: 'ls-5y', label: '5-year term (Art 83)', note: 'From first meeting; Emergency extension one year at a time, not beyond 6 months after proclamation ends. Dissolution applies to LS only.' },
            ],
          },
        ],
      },
      {
        id: 'statelist',
        label: 'Reach into the State List',
        note: 'Union law prevails on the Concurrent List (unless earlier presidential assent to the state law).',
        children: [
          { id: 'sl-emerg', label: 'Emergency / Art 356', note: 'During National Emergency or President\u2019s Rule, Parliament legislates on State List items.' },
          { id: 'sl-249', label: 'Art 249 — RS resolution', note: '\u2154 of members present & voting, in the national interest.' },
          { id: 'sl-252', label: 'Art 252 — states invite', note: 'Two or more state legislatures resolve for a parliamentary law.' },
          { id: 'sl-253', label: 'Art 253 — treaties', note: 'To implement international agreements.' },
        ],
      },
      {
        id: 'speaker',
        label: 'Speaker',
        note: 'Head of the LS; powers from the Constitution, the Rules, and conventions.',
        children: [
          { id: 'sp-money', label: 'Money Bill certifier', note: 'Decides finally whether a bill is a Money Bill.' },
          { id: 'sp-joint', label: 'Presides joint sittings', note: 'Also final interpreter of Rules inside the House; casting vote only on ties (Art 100).' },
          { id: 'sp-defect', label: 'Tenth Schedule', note: 'Decides defection disqualifications of LS members.' },
          { id: 'sp-protem', label: 'Speaker Pro Tem', note: 'Senior-most member, sworn by the President; administers oaths, enables election of the new Speaker, then the office lapses.' },
          { id: 'sp-panel', label: 'Panel of Chairpersons', note: 'Up to 10 members nominated by the Speaker; preside with full powers in the Speaker/Deputy\u2019s absence.' },
          { id: 'sp-deputy', label: 'Deputy Speaker (Art 95–96)', note: 'Acts when the office is vacant; ordinary member while the Speaker presides; cannot preside during own removal resolution.' },
        ],
      },
      {
        id: 'sessions',
        label: 'Sessions & sittings',
        note: 'President summons; max 6 months between two sessions.',
        children: [
          { id: 'se-3', label: 'Budget · Monsoon · Winter', note: 'Feb–May, Jul–Sep, Nov–Dec — three sessions by convention.' },
          { id: 'se-adj', label: 'Adjournment', note: 'Suspends a sitting for hours/days/weeks; sine die = indefinitely.' },
          { id: 'se-pro', label: 'Prorogation', note: 'Terminates the session.' },
          { id: 'se-dis', label: 'Dissolution', note: 'Lok Sabha only.' },
        ],
      },
      {
        id: 'devices',
        label: 'Devices of proceedings',
        children: [
          { id: 'dv-qh', label: 'Question Hour', note: 'First hour. Starred = oral + supplementaries; unstarred = written; short-notice.' },
          { id: 'dv-zero', label: 'Zero Hour', note: 'Not in the Rules of Procedure — the gap after Question Hour before the agenda.' },
          { id: 'dv-adjm', label: 'Adjournment motion', note: 'LS only — urgent public issue; extraordinary, interrupts normal business.' },
          { id: 'dv-cens', label: 'Censure motion', note: 'LS only; strong disapproval — government need not resign (unlike no-confidence).' },
          { id: 'dv-cut', label: 'Cut motion', note: 'Opposes a demand in the financial bill.' },
          { id: 'dv-mass', label: 'Ministerial Assurances', note: 'Committee checks whether ministers\u2019 promises to the House are fulfilled.' },
        ],
      },
      {
        id: 'functions',
        label: 'Functions',
        children: [
          { id: 'fn-leg', label: 'Legislative', note: 'Union + Concurrent Lists; State List by the four routes.' },
          { id: 'fn-exec', label: 'Control of executive', note: 'No-confidence, questions, motions — the Cabinet answers to the LS.' },
          { id: 'fn-fin', label: 'Financial', note: 'No spending without approval; PAC and Estimates Committee audit the executive.' },
          { id: 'fn-amend', label: 'Constituent', note: 'Amendments need both Houses equally.' },
          { id: 'fn-elect', label: 'Electoral', note: 'Elects President & VP; RS alone initiates VP\u2019s removal.' },
          { id: 'fn-terr', label: 'Territorial', note: 'Can alter state/UT boundaries — the map-maker power.', chapterId: 'polity-states-reorganisation' },
        ],
      },
      {
        id: 'rsls',
        label: 'RS vs LS',
        children: [
          { id: 'rl-eq', label: 'Equal', note: 'Ordinary bills, President\u2019s election/impeachment, ordinances, all three emergencies, constitutional bodies\u2019 reports.' },
          { id: 'rl-uneq', label: 'LS stronger', note: 'Money Bills (LS only, RS returns in 14 days), demands for grants, collective responsibility, joint-sitting numbers, national emergency discontinuance.' },
          { id: 'rl-special', label: 'RS special', note: 'Art 249 (State List), Art 312 (new All-India Services), initiates VP\u2019s removal, approves emergency when LS stands dissolved.' },
          { id: 'rl-108', label: 'Joint sitting (Art 108)', note: 'Deadlock: rejection, disagreement on amendments, or 6 months\u2019 inaction. Never for a Money Bill.' },
        ],
      },
    ],
  },
};
