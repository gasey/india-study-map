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

const SUPERSCRIPT = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const SUBSCRIPT = '₀₁₂₃₄₅₆₇₈₉';

function toSuper(digits: string): string {
  return [...digits].map((d) => SUPERSCRIPT[Number(d)] ?? d).join('');
}

function toSub(digits: string): string {
  return [...digits].map((d) => SUBSCRIPT[Number(d)] ?? d).join('');
}

/**
 * Repair OCR-damaged math notation in question stems and options.
 *
 * The source PDFs went through multiple rounds of text extraction that
 * lost or flattened mathematical glyphs. This function restores:
 *
 * 1. Square-root symbols (Ö from symbol fonts → √)
 * 2. Subscripts in arithmetic sequences (a14 → a₁₄, a8 → a₈, d1 → d₁)
 * 3. Superscripts in polynomials (x2 → x², x3 → x³, x4 → x⁴, caret form x^2)
 * 4. Area/volume units (cm2 → cm², cm3 → cm³, m2 → m², m3 → m³, etc.)
 * 5. Missing space before units (462cm2 → 462 cm²)
 * 6. Dimension separators (12*6*4 → 12 × 6 × 4, 300x200 → 300 × 200).
 *    Bare-number factors only — "12m*6mx4m" is left as-is, because pulling
 *    the unit letters in would guess where they belong.
 * Note: a lost radical sign (e.g. `50/3` for `50√3`) is NOT repaired here —
 * guessing it would corrupt ordinary fractions, so those items stay in the
 * bank for a human pass.
 *
 * All repairs are deliberately narrow to avoid corrupting prose or
 * non-mathematical text.
 */
function repairMathGlyphs(text: string): string {
  return text
    // 1. Square-root symbol from symbol fonts
    .replace(/Ö/g, '√')

    // 2. Subscripts in arithmetic/geometric sequences — a1, a2, ..., a20, d1, d2.
    //    Runs BEFORE the polynomial rule below so that a8/a14 read as a₈/a₁₄,
    //    not as superscripts. Narrow to lowercase bases so "Alt+D2" and
    //    option labels are never touched.
    .replace(/\b([ad])\^?([1-9]|1[0-9]|20)\b/g, (_, base: string, sub: string) =>
      `${base}${toSub(sub)}`,
    )

    // 3. Superscripts in polynomials — x2, x3, x4, ... x12, and caret form x^2.
    //    Lowercase bases only: uppercase letter-digit tokens in this bank are
    //    Excel cell references (=SUM(C2:C10)), function keys (F2, Alt+F4),
    //    and codes like G7 — "fixing" them to superscripts corrupts the text.
    .replace(/\b([a-z])\^?([2-9]|1[0-2])\b/g, (_, base: string, exp: string) =>
      `${base}${toSuper(exp)}`,
    )

    // 4. Area and volume units — cm2→cm², cm3→cm³, m2→m², m3→m³, km2→km², etc.
    .replace(/\b(cm|mm|km|m|ft|in|yd)([23])\b/gi, (_, unit: string, exp: string) =>
      `${unit}${toSuper(exp)}`,
    )

    // 5. Missing space before units — 462cm2 → 462 cm², 10.35cm2 → 10.35 cm²
    .replace(/(\d)(cm|mm|km|m|ft|in|yd)([23])\b/gi, (_, num: string, unit: string, exp: string) =>
      `${num} ${unit}${toSuper(exp)}`,
    )

    // 6. Dimension separators between bare numbers — 12*6*4 → 12 × 6 × 4.
    .replace(/\b(\d+(?:\.\d+)?)\s*[*x×]\s*(\d+(?:\.\d+)?)\s*[*x×]\s*(\d+(?:\.\d+)?)\b/g,
      '$1 × $2 × $3',
    )

    // 7. Simple two-factor dimensions — 300x200 → 300 × 200 (but not in words like "300x200 yards")
    .replace(/\b(\d+(?:\.\d+)?)\s*[*x×]\s*(\d+(?:\.\d+)?)\b/g, '$1 × $2');
}

function InlineText({ text, plain }: { text: string; plain?: boolean }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  MARKED.lastIndex = 0;
  let repaired = repairMathGlyphs(text);
  if (plain) {
    // No underline / italic / bold for this question — drop the recovered
    // emphasis markers and render the plain word. English is left alone for now.
    repaired = repaired.replace(MARKED, (_m, u: string | undefined, e: string | undefined) => u ?? e ?? '');
    return <>{repaired}</>;
  }
  while ((m = MARKED.exec(repaired)) !== null) {
    if (m.index > last) parts.push(repaired.slice(last, m.index));
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
  if (!parts.length) return <>{repaired}</>;
  if (last < repaired.length) parts.push(repaired.slice(last));
  return <>{parts}</>;
}

const SUBPART_RE = /\s?\(([a-zA-Z]|\d{1,2}|[ivxlcdm]+)\)\s*/g;

function splitSubparts(text: string): { main: string; parts: string[] } | null {
  const marks: { index: number; length: number }[] = [];
  SUBPART_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = SUBPART_RE.exec(text)) !== null) {
    const before = text[m.index - 1];
    if (m.index === 0 || before === ' ' || before === '\n' || before === '—' || before === '-') {
      marks.push({ index: m.index, length: m[0].length });
    }
  }
  if (marks.length < 2) return null;
  const main = text.slice(0, marks[0].index).trim();
  const parts: string[] = [];
  for (let i = 0; i < marks.length; i += 1) {
    const start = marks[i].index;
    const end = i + 1 < marks.length ? marks[i + 1].index : text.length;
    parts.push(text.slice(start, end).trim());
  }
  return main ? { main, parts } : { main: '', parts };
}

function SubParts({ text, plain }: { text: string; plain?: boolean }) {
  const split = splitSubparts(text);
  if (!split) return <InlineText text={text} plain={plain} />;
  return (
    <>
      {split.main && <div style={{ marginBottom: 6 }}>{split.main}</div>}
      <ul style={{ margin: '4px 0 0 0', paddingLeft: '1.5rem' }}>
        {split.parts.map((part, i) => (
          <li key={i} style={{ marginBottom: 2 }}>
            <InlineText text={part} plain={plain} />
          </li>
        ))}
      </ul>
    </>
  );
}

export function QuestionText({ text, plain }: { text: string; plain?: boolean }) {
  if (!text) return null;
  // Called as a plain function, not rendered as an element, because the whole
  // point is to find out whether it CAN parse: it returns null when the text
  // merely mentions List-II, and then the ordinary renderer runs instead of
  // half a table appearing.
  const table = plain ? null : MatchingLists({ text });
  if (table) return table;

  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  if (lines.length === 1) return <SubParts text={text} plain={plain} />;

  return (
    <span style={{ display: 'block' }}>
      {lines.map((line, i) => (
        <span key={i} style={{ display: 'block', minHeight: line ? undefined : '0.65em' }}>
          <InlineText text={line} plain={plain} />
        </span>
      ))}
    </span>
  );
}
