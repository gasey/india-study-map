/**
 * Render a question stem, turning `__word__` back into an actual underline.
 *
 * MPSC prints the tested word underlined — "Identify the parts of speech of the
 * underlined word" on "The population of India is less than that of China" is
 * asking about *less*, and about *that* the answer would be Pronoun instead.
 * Text extraction drops the rule (it is a filled rectangle in the page
 * graphics, not a text attribute), so tools/recover_underlines.py in the bank
 * repo puts it back as `__…__` markup.
 *
 * Without this component the reader sees literal underscores and is left
 * guessing exactly as the solver was.
 *
 * Deliberately NOT a markdown renderer. These stems contain `_____` blanks,
 * bare asterisks and stray backticks straight off the page, and a general
 * markdown pass would eat them or emphasise half a sentence. One rule, applied
 * once.
 */

// `__x__` where x is non-empty and holds no underscore, so a `_____` blank
// (underscores with nothing between them) can never match. The leading
// `[^\s_]` also stops a bare `__ ` blank from opening a span.
//
// Capped at 80 characters on purpose. No stem in the bank currently has two
// leftover `__` blanks, but if one ever did, an unbounded match would run from
// the first to the second and underline everything in between — silently
// marking the wrong words, which is the exact failure this markup exists to
// fix. A real underline is a word or a short clause; "as heroes do" is the
// longest in the bank.
const UNDERLINED = /__([^\s_][^_]{0,78})__/g;

export function QuestionText({ text }: { text: string }) {
  if (!text) return null;
  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  UNDERLINED.lastIndex = 0;
  while ((m = UNDERLINED.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <u key={m.index} style={{ textUnderlineOffset: 3 }}>
        {m[1]}
      </u>,
    );
    last = m.index + m[0].length;
  }
  if (!parts.length) return <>{text}</>;
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
