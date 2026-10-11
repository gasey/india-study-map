/** Component checks without a browser: answer persistence, filters, and exam submission. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import React from 'react';
import Renderer, { act } from 'react-test-renderer';
const require = createRequire(import.meta.url);
const data = new Map();
const storage = { getItem: k => data.get(k) ?? null, setItem: (k, v) => data.set(k, String(v)), removeItem: k => data.delete(k), clear: () => data.clear(), key: i => [...data.keys()][i] ?? null, get length() { return data.size; } };
globalThis.localStorage = storage;
// Node's native BroadcastChannel keeps the test process alive; this harness
// tests UI wiring, while the storage checks cover cross-tab coordination.
globalThis.BroadcastChannel = undefined;
globalThis.window = { localStorage: storage, addEventListener() {}, removeEventListener() {}, setInterval, clearInterval, setTimeout };
globalThis.document = { hidden: false, addEventListener() {}, removeEventListener() {} };
globalThis.requestAnimationFrame = () => 0;
const q = { id: 'learn-one', paperId: 'exam-test', questionNumber: '1', question: 'Which answer?', options: ['Right choice', 'Wrong choice', 'Another', 'Last'], answerIndex: 0, explanation: 'Because the rule applies.', topic: 'computer_basics', topicLabel: 'Computer fundamentals', subject: 'computer', year: 2026, difficulty: 'easy' };
const q2 = { ...q, id: 'learn-two', questionNumber: '2', question: 'Second question?' };
const held = { ...q, id: 'learn-held', questionNumber: '3', sourceReview: true };
const written = { id: 'learn-written', paperId: 'exam-test', type: 'descriptive', questionNumber: '4', question: 'Write a paragraph.', explanation: 'Develop one idea.', topic: 'written', topicLabel: 'Written English', subject: 'english', studySection: 'english', year: 2026, difficulty: 'easy' };
const paper = { id: 'exam-test', examName: 'Example paper', post: 'Example post', paperNumber: 'Paper-I', year: 2026, paperSubject: 'General paper' };
globalThis.__learningFixtures = { questions: [q, q2, held, written], papers: [paper] };
const result = await build({
  stdin: { contents: "export { PracticeView } from './src/modules/udc-ldc/PracticeView'; export { ExamView } from './src/modules/udc-ldc/ExamView'; export { default as Page } from './src/modules/udc-ldc/UdcLdcPage';", resolveDir: process.cwd(), loader: 'tsx' },
  bundle: true, write: false, format: 'cjs', platform: 'node', packages: 'external', loader: { '.css': 'empty' },
  plugins: [{ name: 'component-fixtures', setup(b) {
    const mocks = {
      '@/data/banks/index': 'export const getBank = () => globalThis.__learningFixtures;',
      '@/data/banks/mpsc-udc-ldc': 'export const mpscUdcLdcPaperMeta = {"exam-test":{marksPerQuestion:1,durationMinutes:60,negativeMarking:false,penaltyFraction:0}}; export const mpscUdcLdcNegativeMarking = {};',
      '@/data/banks/mpsc-group-b-general': 'export const groupBGeneralPapers = []; export const groupBGeneralQuestions = []; export const groupBPaperMeta = {}; export const groupBExpectedMcq = {};',
      '@/lib/mpscApi': 'export const getCorrections = async () => ({});',
      '@/modules/mpsc/QuestionReviewPanel': 'export const QuestionReviewPanel = () => null;',
      './useFlags': 'export const useFlags = () => ({ flags: {}, signedIn: false });',
      './GroupBPaperLibrary': 'export const GroupBPaperLibrary = () => null;',
    };
    b.onResolve({ filter: /.*/ }, args => Object.hasOwn(mocks, args.path) ? { path: args.path, namespace: 'fixture' } : undefined);
    b.onLoad({ filter: /.*/, namespace: 'fixture' }, args => ({ contents: mocks[args.path], loader: 'js' }));
  } }],
});
const module = { exports: {} };
new Function('require', 'module', 'exports', result.outputFiles[0].text)(require, module, module.exports);
const { PracticeView, ExamView, Page } = module.exports;
const text = node => typeof node === 'string' || typeof node === 'number' ? String(node) : (node?.children ?? []).map(text).join('');
const button = (tree, label) => {
  const found = tree.root.findAllByType('button').find(b => text(b).includes(label));
  assert.ok(found, `Missing button: ${label}`); return found;
};
const flush = async () => { await new Promise(resolve => setTimeout(resolve, 5)); };
let tree;
let events = [];
await act(async () => { tree = Renderer.create(React.createElement(PracticeView, { questions: [q, q2], progress: {}, onAnswer: (...args) => events.push(args) })); });
await act(async () => {
  const choose = button(tree, 'Wrong choice').props.onClick;
  choose(); choose();
});
assert.equal(events.length, 1, 'selection records once before Next, including double taps');
assert.equal(events[0][0], q.id);
assert.equal(events[0][1], false);
assert.equal(events[0][2].selectedIndex, 1);
await act(async () => { tree.update(React.createElement(PracticeView, { questions: [q2], progress: { [q.id]: { n: 1, lastCorrect: false, at: Date.now() } }, onAnswer: (...args) => events.push(args) })); });
assert.match(text(tree.root), /Because the rule applies/);
await act(async () => { button(tree, 'Next question').props.onClick(); });
assert.match(text(tree.root), /Second question/);
assert.equal(events.length, 1, 'Next must not count the previous answer again');
await act(async () => { tree.unmount(); });

// Final exam answers count once, skips and held rows count zero.
events = [];
await act(async () => { tree = Renderer.create(React.createElement(ExamView, { papers: [paper], questions: [q, q2, held], onRecordAttempts: async rows => events.push(...rows) })); });
await act(async () => { button(tree, 'Example paper').props.onClick(); });
await act(async () => { tree.root.findAllByType('input').find(n => n.props.name === q.id).props.onChange(); });
assert.equal(events.length, 0, 'mock test is recorded on final submission');
await act(async () => { button(tree, 'Submit').props.onClick(); await flush(); });
assert.equal(events.length, 1);
assert.equal(events[0].questionId, q.id);
assert.equal(events[0].correct, true);
assert.equal(storage.getItem('jabreeze.attempt.udc-ldc.exam.exam-test'), null, 'submitted sitting is cleared');
await act(async () => { tree.unmount(); });

// Instant mode survives remount; final submission reuses its event ID.
events = [];
const examProps = { papers: [paper], questions: [q, q2], onRecordAttempts: async rows => events.push(...rows) };
await act(async () => { tree = Renderer.create(React.createElement(ExamView, examProps)); });
await act(async () => { button(tree, 'Example paper').props.onClick(); });
await act(async () => { button(tree, 'Mark at the end').props.onClick(); });
await act(async () => { tree.root.findAllByType('input').find(n => n.props.name === q.id).props.onChange(); });
assert.equal(events.length, 1);
const instantId = events[0].eventId;
await act(async () => { tree.unmount(); tree = Renderer.create(React.createElement(ExamView, examProps)); });
await act(async () => { button(tree, 'Example paper').props.onClick(); });
assert.match(text(tree.root), /Marking as you go/);
assert.equal(tree.root.findAllByType('input').find(n => n.props.name === q.id).props.disabled, true);
await act(async () => { button(tree, 'Submit').props.onClick(); await flush(); });
assert.equal(events.at(-1).eventId, instantId);
await act(async () => { tree.unmount(); });

// Expiry uses the same submission path and records the restored valid answer.
storage.setItem('jabreeze.attempt.udc-ldc.exam.exam-test', JSON.stringify({ answers: { [q.id]: 1 }, marked: [], seen: [], idx: 0, startedAt: Date.now() - 61 * 60000, signature: `exam-test:2:${q.id}` }));
events = [];
await act(async () => { tree = Renderer.create(React.createElement(ExamView, examProps)); });
await act(async () => { button(tree, 'Example paper').props.onClick(); await flush(); });
assert.equal(events.length, 1);
assert.equal(events[0].correct, false);
assert.equal(storage.getItem('jabreeze.attempt.udc-ldc.exam.exam-test'), null);
await act(async () => { tree.unmount(); });

// Whole module: Browse selection and explicit reading feed the shared dashboard.
await act(async () => { tree = Renderer.create(React.createElement(Page)); await flush(); });
assert.match(text(tree.root), /My learning/);
await act(async () => { button(tree, 'browse').props.onClick(); });
await act(async () => { button(tree, 'Wrong choice').props.onClick(); await flush(); });
assert.match(text(tree.root), /Not quite/);
await act(async () => { button(tree, 'Mark studied').props.onClick(); await flush(); });
await act(async () => { button(tree, 'My learning').props.onClick(); });
assert.match(text(tree.root), /1 wrong answer/);
assert.match(text(tree.root), /Read/);
await act(async () => { tree.unmount(); });
console.log('Learning component checks passed: immediate practice recording, duplicate clicks, changing pools, exam submit/expiry/resume, shared Browse reading and mistakes.');
