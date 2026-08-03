// Dump the current bank to bank.json, the input merge.py expects.
//
// The bank ships as TypeScript, so it is stripped down to plain JS and
// required. Kept deliberately dumb — a real TS loader here would be more
// moving parts than the one regex it replaces.
import { writeFileSync, readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, '..', '..', 'src', 'data', 'banks', 'mpsc-state-tax-officer.ts');

const js = readFileSync(src, 'utf8')
  .replace(/^import type[^\n]*\n/m, '')
  .replace(/const (questions\d*|papers): (BankQuestion|ExamPaper)\[\] =/g, 'const $1 =')
  .replace(/export const mpscStateTaxOfficer: QuestionBank =/, 'export const bank =');

const tmp = join(mkdtempSync(join(tmpdir(), 'bankdump-')), 'bank.mjs');
writeFileSync(tmp, js);
const { bank } = await import(pathToFileURL(tmp).href);

writeFileSync(join(here, 'bank.json'), JSON.stringify(bank, null, 1));
console.log(`wrote bank.json — ${bank.questions.length} questions, ${bank.papers?.length ?? 0} papers`);
