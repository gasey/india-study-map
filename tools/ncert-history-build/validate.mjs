import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { questions as authored } from './questions.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const sourceDir = process.env.NCERT_SOURCE_DIR || path.resolve(root, '../../../../ncert-history/sources');
const chapters = JSON.parse(readFileSync(path.join(root,'public/ncert-history/chapters.json'),'utf8'));
const questions = JSON.parse(readFileSync(path.join(root,'public/ncert-history/questions.json'),'utf8'));
const sourcePages = JSON.parse(readFileSync(path.join(here,'source-pages.json'),'utf8'));
assert.equal(chapters.length,39);
assert.equal(questions.length,authored.length);
assert.equal(new Set(questions.map(q=>q.id)).size,questions.length);
for(const c of chapters) assert(questions.some(q=>q.chapterId===c.id),`Missing ${c.id}`);
for(const [i,q] of questions.entries()){
  const [chapterId,prompt,options,answerIndex,explanation,anchor]=authored[i];
  assert.equal(q.chapterId,chapterId);assert.equal(q.prompt,prompt);assert.equal(q.explanation,explanation);
  assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);
  assert.equal(q.options[q.answerIndex],options[answerIndex],q.id);
  assert.equal(q.sourceUrl,`https://www.ncert.nic.in/textbook/pdf/${chapterId}.pdf#page=${q.sourcePdfPage}`);
  assert.equal(q.sourcePdfPage, sourcePages[q.id], q.id);
  const sourceFile=path.join(sourceDir,`${chapterId}.txt`);
  if (existsSync(sourceFile)) {
    const source=readFileSync(sourceFile,'utf8');
    const pos=source.toLowerCase().indexOf(anchor.toLowerCase());
    assert(pos>=0,`Missing anchor ${q.id}`);
    assert.equal(q.sourcePdfPage,source.slice(0,pos).split('\f').length,q.id);
  }
}
console.log(`Validated ${questions.length} source-linked MCQs across ${chapters.length} PDFs.`);
