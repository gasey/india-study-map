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

export function QuestionText({ text }: { text: string }) {
  if (!text) return null;
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
