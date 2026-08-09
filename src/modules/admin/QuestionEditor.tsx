import { useEffect, useState } from 'react';
import * as api from '@/lib/mpscApi';
import { getBank } from '@/data/banks/index';
import { isMcqQuestion } from '@/data/banks/types';
import type { BankQuestion } from '@/data/banks/types';

// ============================================
// QuestionEditor — 330px right inspector per components.md: stem textarea,
// radio-per-option with the correct one tinted --ok, a 2-col metadata grid,
// explanation, then "Save & log" / "Discard". "Saving writes a correction
// record — the original extraction is never overwritten, and the audit log
// keeps the before/after." A hard requirement, not a nicety.
//
// Extracted from AdminPanel.tsx's ReportRow (the only place this form logic
// existed before) so a bank-agnostic Reports tab — and, later, a Questions
// browse tab — can both open it, instead of it being wired only into one
// report row's inline expand.
//
// The MPSC bank ('mpsc-old-questions') was deliberately made API-only in
// Phase 4 — there is no in-memory map of all its questions to look one up
// in. Every other bank is still a bundled static JSON. So the "current
// question" lookup is bank-conditional: a live single-question fetch for
// MPSC, a registry lookup for everything else — not a page-level
// questionsById map the console would have to preload per bank.
// ============================================

async function resolveQuestion(bankId: string, questionId: string): Promise<BankQuestion | undefined> {
  if (bankId === 'mpsc-old-questions') {
    try {
      return await api.getBankQuestion(questionId);
    } catch {
      return undefined;
    }
  }
  return getBank(bankId)?.questions.find((q) => q.id === questionId);
}

interface QuestionEditorProps {
  bankId: string;
  questionId: string;
  subpartLabel?: string | null;
  suggestedAnswerIndex?: number | null;
  reportIds?: number[];
  initialAdminNote?: string;
  onSaved: () => void;
  onDiscard: () => void;
}

export function QuestionEditor({
  bankId, questionId, subpartLabel, suggestedAnswerIndex, reportIds, initialAdminNote, onSaved, onDiscard,
}: QuestionEditorProps) {
  const [question, setQuestion] = useState<BankQuestion | null | undefined>(undefined);
  const [answerIndex, setAnswerIndex] = useState<string>(String(suggestedAnswerIndex ?? ''));
  const [explanation, setExplanation] = useState('');
  const [note, setNote] = useState('');
  const [adminNote, setAdminNote] = useState(initialAdminNote ?? '');
  const [stem, setStem] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [subparts, setSubparts] = useState<{ label: string; text: string; modelAnswer: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setQuestion(undefined);
    resolveQuestion(bankId, questionId).then((q) => {
      if (cancelled) return;
      setQuestion(q ?? null);
      if (q) {
        setStem(q.question);
        setExplanation(q.explanation ?? '');
        if (isMcqQuestion(q)) setOptions(q.options);
        else setSubparts((q.subparts ?? []).map((sp) => ({ label: sp.label, text: sp.text, modelAnswer: sp.modelAnswer ?? '' })));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [bankId, questionId]);

  const isDescriptive = question != null && !isMcqQuestion(question);
  const stemChanged = question != null && stem !== question.question;
  const optionsChanged = question != null && isMcqQuestion(question) && options.some((o, i) => o !== question.options[i]);

  const setOption = (i: number, value: string) => setOptions((prev) => prev.map((o, j) => (j === i ? value : o)));
  const setSubpart = (i: number, field: 'text' | 'modelAnswer', value: string) =>
    setSubparts((prev) => prev.map((sp, j) => (j === i ? { ...sp, [field]: value } : sp)));

  const save = async () => {
    setSaving(true);
    try {
      await api.adminUpsertCorrection({
        bankId,
        questionId,
        subpartLabel: subpartLabel ?? null,
        correctedAnswerIndex: isDescriptive || answerIndex === '' ? null : Number(answerIndex),
        correctedExplanation: explanation || null,
        correctedNote: note || null,
        correctedStem: stemChanged ? stem : null,
        correctedOptions: optionsChanged ? options : null,
        correctedSubparts: isDescriptive
          ? subparts.map((sp) => ({ label: sp.label, text: sp.text, modelAnswer: sp.modelAnswer || undefined }))
          : null,
        reportIds,
        adminNote,
      });
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  const labelCls = 'block text-xs font-medium mb-1';
  const inputStyle = { background: 'var(--bg-app)', border: '1px solid var(--border)', color: 'var(--text-primary)' } as const;
  const inputCls = 'px-2 py-1.5 rounded text-xs w-full';

  return (
    <div
      className="w-[330px] shrink-0 overflow-y-auto scroll-panel flex flex-col gap-3 p-4"
      style={{ borderLeft: '1px solid var(--border)', background: 'var(--bg-panel)' }}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Edit question</div>
        <button onClick={onDiscard} className="text-xs" style={{ color: 'var(--text-secondary)' }}>✕ Discard</button>
      </div>

      {question === undefined && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Loading question…</p>}
      {question === null && <p className="text-xs" style={{ color: 'var(--bad)' }}>Question {questionId} not found in {bankId}.</p>}

      {question && (
        <>
          <div>
            <label className={labelCls}>Question stem{stemChanged && <span style={{ color: 'var(--accent)' }}> · edited</span>}</label>
            <textarea value={stem} onChange={(e) => setStem(e.target.value)} rows={3} className={inputCls} style={inputStyle} />
          </div>

          {!isDescriptive && (
            <div>
              <label className={labelCls}>Options{optionsChanged && <span style={{ color: 'var(--accent)' }}> · edited</span>}</label>
              <div className="flex flex-col gap-1.5">
                {options.map((o, i) => {
                  const isCorrect = String(i) === answerIndex || (answerIndex === '' && isMcqQuestion(question) && i === question.answerIndex);
                  return (
                    <label key={i} className="flex items-center gap-1.5">
                      <input type="radio" name="answer" checked={String(i) === answerIndex} onChange={() => setAnswerIndex(String(i))} />
                      <input
                        type="text"
                        value={o}
                        onChange={(e) => setOption(i, e.target.value)}
                        className={`${inputCls} flex-1`}
                        style={isCorrect ? { ...inputStyle, borderColor: 'var(--ok)', color: 'var(--ok)' } : inputStyle}
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {isDescriptive && (
            <div>
              <label className={labelCls}>Sub-parts (a..z)</label>
              <div className="flex flex-col gap-2">
                {subparts.map((sp, i) => (
                  <div key={sp.label} className="p-2 rounded space-y-1" style={{ background: 'var(--bg-app)', border: '1px solid var(--border)' }}>
                    <span className="text-xs font-semibold" style={{ color: sp.label === subpartLabel ? 'var(--accent)' : 'var(--text-secondary)' }}>
                      {sp.label}) {sp.label === subpartLabel && '← flagged'}
                    </span>
                    <textarea value={sp.text} onChange={(e) => setSubpart(i, 'text', e.target.value)} rows={2} className={inputCls} style={inputStyle} />
                    <input
                      type="text"
                      value={sp.modelAnswer}
                      onChange={(e) => setSubpart(i, 'modelAnswer', e.target.value)}
                      placeholder="Study-pointer / model answer…"
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2-col metadata grid per spec — subject/difficulty are read-only
              context here (owned by extraction/topic tagging, not this
              editor); explanation and the two note fields are the editable
              metadata this screen actually owns. */}
          <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <div>Subject<div className="capitalize" style={{ color: 'var(--text-primary)' }}>{question.subject}</div></div>
            <div>Difficulty<div className="capitalize" style={{ color: 'var(--text-primary)' }}>{question.difficulty}</div></div>
          </div>

          <div>
            <label className={labelCls}>Corrected explanation</label>
            <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={2} className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls}>Public note (shown on the question)</label>
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls}>Note to reporter</label>
            <input type="text" value={adminNote} onChange={(e) => setAdminNote(e.target.value)} className={inputCls} style={inputStyle} />
          </div>

          <div className="flex items-center gap-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
            <button onClick={onDiscard} className="px-3 py-1.5 rounded text-xs flex-1" style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              Discard
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="px-3 py-1.5 rounded text-xs font-medium flex-1"
              style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
            >
              {saving ? 'Saving…' : 'Save & log'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
