/**
 * Render a question stem, turning the recovered emphasis markup back into real
 * emphasis: `__word__` into an underline, `*word*` into italics.
 *
 * MPSC marks the tested word typographically — "Identify the parts of speech of
 * the underlined word" on "The population of India is less than that of China"
 * is asking about `less`, and about `that` the answer would be Pronoun instead.
 * Text extraction drops the mark: an underline is a filled rectangle in the page
 * graphics rather than a text attribute, and italics survive only as a different
 * font object with a subsetted name that says nothing. Both are put back by
 * tools/recover_underlines.py in the bank repo.
 *
 * Without this component the reader sees literal underscores and asterisks and
 * is left guessing exactly as the solver was.
 *
 * The two marks are kept DISTINCT rather than both rendered as an underline,
 * because the direction the candidate reads names one of them: Taxation Paper-I
 * q1–10 say "the words in italics", and underlining those would contradict the
 * instruction on the same screen.
 *
 * Deliberately NOT a markdown renderer. These stems contain `_____` blanks,
 * stray backticks and lone asterisks straight off the page, and a general
 * markdown pass would eat them or emphasise half a sentence. Two rules, applied
 * once.
 */

// `__x__` / `*x*` where x is non-empty and contains no further delimiter, so a
// `_____` blank (underscores with nothing between them) can never match. The
// leading `[^\s_]` / `[^\s*]` also stops a bare `__ ` blank from opening a span.
//
// Capped at 80 characters on purpose. No stem in the bank has two leftover `__`
// blanks, and the four containing an asterisk each contain exactly one — but if
// that ever changed, an unbounded match would run from the first delimiter to
// the second and emphasise everything in between, silently marking the wrong
// words. That is the exact failure this markup exists to fix. A real span is a
// word or a short clause; "as heroes do" is the longest in the bank.
const MARKED = /__([^\s_][^_]{0,78})__|\*([^\s*][^*]{0,78})\*/g;

/**
 * A "match List-I with List-II" question, whose two columns the page prints
 * side by side and the text layer flattens into one paragraph:
 *
 *   List-I (Festival): A. Bihu; B. Sangai; C. Hornbill; D. Onam.
 *   List-II (State): 1. Assam; 2. Manipur; 3. Nagaland; 4. Kerela.
 *
 * Read as a run of prose that is close to unusable — the reader has to hold
 * four lettered items in mind while scanning for the numbered one, which is
 * precisely the work the printed layout does for them. The options are the
 * A-1, B-2 code combinations and are unaffected; this is purely the stem.
 *
 * Only reformats when BOTH halves are found and both parse into items. A
 * partial match renders as plain text rather than half a table.
 */
// ⚠️ Both headings appear TWICE: once in the instruction ("Match List-I with
// List-II and give the correct answer from the code given under:") and once as
// the actual column heading ("List-I (Festival): A. Bihu; ..."). Matching the
// first occurrence splits on the instruction and hands back " with " as the
// left column, so the table silently refuses to render. Take the LAST of each.
const L1 = /\bList\s*[-–—]?\s*(?:I|1)\b\s*(\([^)]*\))?\s*[:.\-–—]?\s*/gi;
const L2 = /\bList\s*[-–—]?\s*(?:II|2)\b\s*(\([^)]*\))?\s*[:.\-–—]?\s*/gi;
const ITEM = /([A-Z]|\d{1,2})\s*[.):]\s*([^;]+?)(?=\s*(?:[;.]\s*(?:[A-Z]|\d{1,2})\s*[.):]|$))/g;

function lastMatch(re: RegExp, s: string, before = Infinity) {
  let out: RegExpExecArray | null = null;
  let m: RegExpExecArray | null;
  re.lastIndex = 0;
  while ((m = re.exec(s)) !== null) {
    if (m.index >= before) break;
    out = m;
  }
  return out;
}

function items(s: string): [string, string][] {
  const out: [string, string][] = [];
  let m: RegExpExecArray | null;
  ITEM.lastIndex = 0;
  while ((m = ITEM.exec(s)) !== null) out.push([m[1], m[2].trim().replace(/[.;]\s*$/, '')]);
  return out;
}

function MatchingLists({ text }: { text: string }) {
  const two = lastMatch(L2, text);
  if (!two) return null;
  const one = lastMatch(L1, text, two.index);
  if (!one) return null;
  const lead = text.slice(0, one.index);
  const headA = one[1] || '';
  const headB = two[1] || '';
  const colA = text.slice(one.index + one[0].length, two.index);
  const colB = text.slice(two.index + two[0].length);
  const a = items(colA);
  const b = items(colB);
  if (a.length < 2 || b.length < 2) return null;
  const cell: React.CSSProperties = { padding: '3px 10px 3px 0', verticalAlign: 'top' };
  return (
    <>
      {lead.trim() && <div style={{ marginBottom: 8 }}>{lead.trim()}</div>}
      <table style={{ borderCollapse: 'collapse', fontSize: '0.95em', margin: '2px 0 4px' }}>
        <thead>
          <tr style={{ textAlign: 'left' }}>
            <th colSpan={2} style={{ ...cell, paddingRight: 24 }}>List-I {headA || ''}</th>
            <th colSpan={2} style={cell}>List-II {headB || ''}</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.max(a.length, b.length) }).map((_, i) => (
            <tr key={i}>
              <td style={{ ...cell, opacity: 0.6 }}>{a[i]?.[0] ? `${a[i][0]}.` : ''}</td>
              <td style={{ ...cell, paddingRight: 24 }}>{a[i]?.[1] ?? ''}</td>
              <td style={{ ...cell, opacity: 0.6 }}>{b[i]?.[0] ? `${b[i][0]}.` : ''}</td>
              <td style={cell}>{b[i]?.[1] ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export function QuestionText({ text }: { text: string }) {
  if (!text) return null;
  // Called as a plain function, not rendered as an element, because the whole
  // point is to find out whether it CAN parse: it returns null when the text
  // merely mentions List-II, and then the ordinary renderer runs instead of
  // half a table appearing.
  const table = MatchingLists({ text });
  if (table) return table;
  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  MARKED.lastIndex = 0;
  while ((m = MARKED.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      m[1] !== undefined ? (
        <u key={m.index} style={{ textUnderlineOffset: 3 }}>
          {m[1]}
        </u>
      ) : (
        <em key={m.index}>{m[2]}</em>
      ),
    );
    last = m.index + m[0].length;
  }
  if (!parts.length) return <>{text}</>;
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
