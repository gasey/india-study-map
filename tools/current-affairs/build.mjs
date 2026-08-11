#!/usr/bin/env node
// ============================================
// Daily Current Affairs pipeline — fetch news, summarize, generate MCQs,
// write today's public/data/current-affairs/{date}.json + update index.json.
//
// Run by .github/workflows/current-affairs.yml (schedule + workflow_dispatch).
// The workflow opens a PR with the result instead of pushing to main —
// that PR review is the "don't trust the LLM blindly" gate, so this
// script's job is just to produce a well-formed CurrentAffairsDay, fail
// loudly if it can't, and never silently write nothing.
//
// Local testing: export NEWSDATA_API_KEY / GEMINI_API_KEY / GROQ_API_KEY
// and run `node tools/current-affairs/build.mjs`.
// ============================================

import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', '..', 'public', 'data', 'current-affairs');

const NEWSDATA_API_KEY = process.env.NEWSDATA_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

for (const [name, val] of Object.entries({ NEWSDATA_API_KEY, GEMINI_API_KEY, GROQ_API_KEY })) {
  if (!val) fail(`missing_env:${name}`, `${name} is not set`);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const groq = new Groq({ apiKey: GROQ_API_KEY });

function fail(code, message) {
  console.error(`[current-affairs] ${code}: ${message}`);
  process.exit(1);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD, matches existing fixtures
}

async function fetchTodayArticles() {
  const url = new URL('https://newsdata.io/api/1/news');
  url.searchParams.set('apikey', NEWSDATA_API_KEY);
  url.searchParams.set('country', 'in');
  url.searchParams.set('language', 'en');
  url.searchParams.set('category', 'politics,world,business,science,environment,sports');

  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) fail('newsdata_http_error', `${res.status} ${res.statusText}`);
  const body = await res.json();
  return body.results ?? [];
}

/** Gemini first, Groq as fallback — same two-provider pattern as the
 *  reference build guide this pipeline is adapted from. */
async function callLlm(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.warn('[current-affairs] Gemini failed, falling back to Groq:', err.message);
    const resp = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
    });
    return resp.choices[0].message.content;
  }
}

function stripCodeFence(raw) {
  return raw.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
}

async function summarizeArticles(articles) {
  const joined = articles.slice(0, 25).map((a) => `${a.title}: ${a.description ?? ''}`).join('\n\n');
  const prompt =
    'You are preparing current-affairs study notes for Indian state and national public service ' +
    'commission exams (e.g. MPSC). From the articles below, produce a JSON object with exactly these keys:\n' +
    '"summary" (a few short paragraphs, factual, no commentary, separated by blank lines, covering ' +
    'National/International/Economy & Science as relevant), ' +
    '"keyFacts" (5-10 short bullet strings — names, dates, figures a candidate would need), ' +
    '"topics" (3-8 short topic tags, e.g. "Polity", "Environment", "Science and Technology").\n' +
    'Return ONLY valid JSON, no markdown fence, no commentary.\n\n' +
    `Articles:\n${joined}`;
  const raw = await callLlm(prompt);
  let parsed;
  try {
    parsed = JSON.parse(stripCodeFence(raw));
  } catch (err) {
    fail('summary_parse_failed', `LLM summary response was not valid JSON: ${err.message}\n${raw.slice(0, 500)}`);
  }
  if (!parsed.summary || !Array.isArray(parsed.keyFacts) || !Array.isArray(parsed.topics)) {
    fail('summary_shape_invalid', `Missing summary/keyFacts/topics in: ${raw.slice(0, 500)}`);
  }
  return parsed;
}

/** Matches this app's actual Mcq shape (src/modules/current-affairs/types.ts)
 *  — options as an {a,b,c,d} object with a lettered correctAnswer, NOT the
 *  reference guide's 0-indexed array shape (that guide targets a different
 *  app's schema). */
async function generateMcqs(summaryBlob, n = 15) {
  const prompt =
    `From the current-affairs summary below, write exactly ${n} multiple-choice questions suitable for ` +
    'an MPSC-style mock test. Return ONLY valid JSON (no markdown fence): a list of objects with keys ' +
    '"question" (string), "options" (object with keys "a","b","c","d", each a string), ' +
    '"correctAnswer" (one of "a"|"b"|"c"|"d"), "explanation" (string, 1-2 sentences), ' +
    '"difficulty" (one of "easy"|"medium"|"hard"), "topic" (short string matching one of the summary topics).\n\n' +
    `Summary:\n${summaryBlob.summary}\n\nKey facts:\n${summaryBlob.keyFacts.join('\n')}`;
  const raw = await callLlm(prompt);
  let mcqs;
  try {
    mcqs = JSON.parse(stripCodeFence(raw));
  } catch (err) {
    fail('mcq_parse_failed', `LLM MCQ response was not valid JSON: ${err.message}\n${raw.slice(0, 500)}`);
  }
  if (!Array.isArray(mcqs) || mcqs.length === 0) fail('mcq_empty', 'LLM returned zero questions');
  for (const [i, q] of mcqs.entries()) {
    const okOptions = q.options && ['a', 'b', 'c', 'd'].every((k) => typeof q.options[k] === 'string');
    const okAnswer = ['a', 'b', 'c', 'd'].includes(q.correctAnswer);
    if (!q.question || !okOptions || !okAnswer) {
      fail('mcq_shape_invalid', `Question ${i} is malformed: ${JSON.stringify(q).slice(0, 300)}`);
    }
  }
  return mcqs;
}

function buildDay(date, articles, summaryBlob, mcqs) {
  return {
    schemaVersion: 1,
    date,
    source: {
      title: `National & International — ${date}`,
      links: articles.slice(0, 25).map((a) => a.link).filter(Boolean),
      publishedAt: new Date().toISOString(),
    },
    summary: summaryBlob.summary,
    keyFacts: summaryBlob.keyFacts,
    topics: summaryBlob.topics,
    mcqs: mcqs.map((q, i) => ({
      id: `${date}-${i + 1}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      topic: q.topic,
    })),
  };
}

function updateIndex(date, day) {
  const indexPath = join(DATA_DIR, 'index.json');
  const index = existsSync(indexPath)
    ? JSON.parse(readFileSync(indexPath, 'utf8'))
    : { schemaVersion: 1, updatedAt: '', days: [] };

  const entry = { date, title: day.source.title, mcqCount: day.mcqs.length, topics: day.topics };
  index.days = [entry, ...index.days.filter((d) => d.date !== date)].sort((a, b) => b.date.localeCompare(a.date));
  index.updatedAt = new Date().toISOString();
  writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n');
}

async function main() {
  const date = todayIso();
  console.log(`[current-affairs] building ${date}`);

  const articles = await fetchTodayArticles();
  if (articles.length === 0) fail('no_articles', 'NewsData.io returned zero articles for today');
  console.log(`[current-affairs] fetched ${articles.length} articles`);

  const summaryBlob = await summarizeArticles(articles);
  console.log('[current-affairs] summary generated');

  const mcqs = await generateMcqs(summaryBlob);
  console.log(`[current-affairs] generated ${mcqs.length} MCQs`);

  const day = buildDay(date, articles, summaryBlob, mcqs);
  writeFileSync(join(DATA_DIR, `${date}.json`), JSON.stringify(day, null, 2) + '\n');
  updateIndex(date, day);

  console.log(`[current-affairs] wrote ${date}.json + updated index.json`);
}

main().catch((err) => fail('unexpected_error', err.stack ?? String(err)));
