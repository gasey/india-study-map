// Exercise printed combined emphasis and blanks without opening a browser.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const require = createRequire(import.meta.url);
const source = fileURLToPath(new URL('../../src/modules/udc-ldc/QuestionText.tsx', import.meta.url));
const js = ts.transpileModule(readFileSync(source, 'utf8'), {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const module = { exports: {} };
new Function('require', 'module', 'exports', js)(require, module, module.exports);
const { QuestionText } = module.exports;
const render = (text, options = {}) => renderToStaticMarkup(React.createElement(QuestionText, { text, ...options }));
const contextJs = ts.transpileModule(readFileSync(new URL('../../src/modules/udc-ldc/QuestionContext.tsx', import.meta.url), 'utf8'), {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const contextModule = { exports: {} };
new Function('require', 'module', 'exports', contextJs)(
  (id) => id === './QuestionText' ? module.exports : require(id), contextModule, contextModule.exports);
const context = (props) => renderToStaticMarkup(React.createElement(contextModule.exports.QuestionContext, props));
assert.equal(context({}), '');
assert.match(context({ direction: 'Read **carefully**.', passage: 'A __*marked*__ passage.' }), /<details[^>]*open=""/);
assert.match(context({ passage: 'A __*marked*__ passage.' }), /<u[^>]*><em>marked<\/em><\/u>/);
assert.doesNotMatch(context({ passage: 'Still available to read', collapsed: true }), /open=/);
assert.match(context({ passage: 'Still available to read', collapsed: true }), /Still available to read/);

const combined = render('The __*Bible*__ is a book. He spoke __softly__, then filled _____.');
assert.match(combined, /<u[^>]*><em>Bible<\/em><\/u>/);
assert.match(combined, /<u[^>]*>softly<\/u>/);
assert.equal((combined.match(/class="udc-blank"/g) || []).length, 1);
assert.ok(combined.endsWith('</span>.'));
assert.doesNotMatch(combined, /\*|_/);

assert.match(render('It was ***beautiful***.'), /<strong><em>beautiful<\/em><\/strong>/);
assert.match(render('**a __key__ point** and *another*'), /<strong>a <u[^>]*>key<\/u> point<\/strong> and <em>another<\/em>/);
const blanks = render('First ___; second _____.', { answers: ['one', 'two'] });
assert.match(blanks, /class="udc-blank-fill">one<\/span>/);
assert.match(blanks, /class="udc-blank-fill">two<\/span>/);
assert.doesNotMatch(blanks, /<u|<em/);
assert.equal(render('12*6*4', { plain: true }), '12 × 6 × 4');
assert.equal(render('__*x*__ + ***y*** + _____', { plain: true }), 'x + y + _____');
assert.doesNotMatch(render('___ then ____'), /<u|<em|<strong/);
const repairs = JSON.parse(readFileSync(new URL('./group-b-text-repairs.json', import.meta.url), 'utf8')).papers;
for (const slug of ['ng-april-2026-assistant-leso-general-english',
  'archive-lang-2026-assistant-controller-of-mines-august-2026-assistant-controller-of-mines-cd36d7cc']) {
  for (const [number, question] of Object.entries(repairs[slug].questions)) {
    for (const text of [question.q, ...Object.values(question.opts)]) {
      assert.doesNotMatch(render(text), /\*|__/, `${slug} Q${number}: emphasis delimiters must not leak into display`);
    }
  }
}
console.log('QuestionText checks passed: combined emphasis, trailing text, separate blanks, answer reveal and plain arithmetic.');
