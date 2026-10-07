import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { questions as authored } from './questions.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const chapters = JSON.parse(readFileSync(path.join(here, 'chapters.json'), 'utf8'));
const chapterById = new Map(chapters.map((c) => [c.id, c]));
const sourceDir = process.env.NCERT_SOURCE_DIR || path.resolve(root, '../../../../ncert-history/sources');
const sourcePages = JSON.parse(readFileSync(path.join(here, 'source-pages.json'), 'utf8'));
const outputDir = path.join(root, 'public/ncert-history');

function shuffleOptions(options, correctIndex, seed) {
  const pairs = options.map((option, index) => ({ option, index }));
  let state = [...seed].reduce((value, char) => Math.imul(value ^ char.charCodeAt(0), 16777619) >>> 0, 2166136261);
  for (let i = pairs.length - 1; i > 0; i--) {
    state ^= state << 13; state ^= state >>> 17; state ^= state << 5;
    const j = (state >>> 0) % (i + 1);
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return { options: pairs.map((p) => p.option), answerIndex: pairs.findIndex((p) => p.index === correctIndex) };
}

const counts = new Map();
const questions = authored.map(([chapterId, prompt, options, answerIndex, explanation, anchor]) => {
  const chapter = chapterById.get(chapterId);
  if (!chapter) throw Error(`Unknown chapter: ${chapterId}`);
  if (options.length !== 4 || new Set(options.map((option) => option.toLowerCase().trim())).size !== 4) throw Error(`Invalid options: ${prompt}`);
  if (answerIndex < 0 || answerIndex > 3 || !explanation || !anchor) throw Error(`Invalid answer or explanation: ${prompt}`);
  const n = (counts.get(chapterId) || 0) + 1;
  counts.set(chapterId, n);
  const id = `${chapterId}-q${String(n).padStart(2, '0')}`;
  const sourceFile = path.join(sourceDir, `${chapterId}.txt`);
  let pdfPage = sourcePages[id];
  if (existsSync(sourceFile)) {
    const sourceText = readFileSync(sourceFile, 'utf8');
    const position = sourceText.toLowerCase().indexOf(anchor.toLowerCase());
    if (position < 0) throw Error(`Source anchor not found in ${chapterId}: ${anchor}`);
    pdfPage = sourceText.slice(0, position).split('\f').length;
    if (sourcePages[id] !== pdfPage) throw Error(`Source page changed for ${id}: ${sourcePages[id]} → ${pdfPage}`);
  }
  if (!Number.isInteger(pdfPage) || pdfPage < 1) throw Error(`No source page for ${id}`);
  return { id, grade: chapter.grade, chapterId, prompt, ...shuffleOptions(options, answerIndex, id),
    explanation, sourceUrl: `${chapter.sourceUrl}#page=${pdfPage}`, sourcePdfPage: pdfPage,
    provenance: 'New practice MCQ based on NCERT textbook; not an official NCERT question or key' };
});

for (const chapter of chapters) if (!counts.has(chapter.id)) throw Error(`Chapter has no MCQ: ${chapter.id}`);
if (new Set(questions.map((q) => q.id)).size !== questions.length) throw Error('Duplicate question ID');
mkdirSync(outputDir, { recursive: true });
writeFileSync(path.join(outputDir, 'chapters.json'), JSON.stringify(chapters, null, 2) + '\n');
writeFileSync(path.join(outputDir, 'questions.json'), JSON.stringify(questions, null, 2) + '\n');
console.log(`${questions.length} MCQs across ${chapters.length} chapter files; correct option positions:`,
  [0,1,2,3].map((i) => questions.filter((q) => q.answerIndex === i).length));
