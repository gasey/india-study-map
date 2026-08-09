/**
 * Renders `__word__` as an underlined span — the fix for questions like
 * "identify the part of speech of the underlined word", where the original
 * exam's underline formatting was lost during OCR extraction and the admin
 * correction form lets someone re-mark the target word with __word__.
 *
 * The delimited run must contain NO underscores of its own. Fill-in-the-blank
 * stems ("divided __________ the two brothers") are written as a long run of
 * underscores, and a lazy `__(.+?)__` happily matches inside one — eating the
 * blank and leaving a stray underlined "_". 100 questions in the State Tax
 * Officer bank alone are fill-in-the-blank, so that is the common case, not
 * the edge case.
 *
 * Lives here rather than inside one module because both the State Tax Officer
 * bank and the MPSC bank's QuestionCard render corrected stems — duplicating
 * this regex would mean duplicating the gotcha above.
 */
export function renderEmphasis(text: string) {
  const parts = text.split(/__([^_]+)__/g);
  return parts.map((part, i) => (i % 2 === 1 ? <u key={i}>{part}</u> : part));
}
