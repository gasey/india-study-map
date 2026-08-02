import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/authStore';
import * as api from '@/lib/mpscApi';
import type { Comment } from '@/lib/mpscApi';

type Section = null | 'flag' | 'note' | 'comments';

const ISSUE_TYPES = [
  { value: 'wrong_answer', label: 'Wrong answer' },
  { value: 'unclear', label: 'Unclear / ambiguous' },
  { value: 'typo', label: 'Typo / OCR garble' },
  { value: 'other', label: 'Other' },
];

export function QuestionReviewPanel({ bankId, questionId, options }: { bankId: string; questionId: string; options: string[] }) {
  const { user } = useAuthStore();
  const [section, setSection] = useState<Section>(null);

  return (
    <div className="mt-2 pt-2" style={{ borderTop: '1px dashed var(--border)' }}>
      <div className="flex gap-3 text-xs">
        <button onClick={() => setSection(section === 'flag' ? null : 'flag')} style={{ color: section === 'flag' ? 'var(--accent)' : 'var(--text-secondary)' }}>
          🚩 Flag
        </button>
        <button onClick={() => setSection(section === 'note' ? null : 'note')} style={{ color: section === 'note' ? 'var(--accent)' : 'var(--text-secondary)' }}>
          📝 My note
        </button>
        <button onClick={() => setSection(section === 'comments' ? null : 'comments')} style={{ color: section === 'comments' ? 'var(--accent)' : 'var(--text-secondary)' }}>
          💬 Comments
        </button>
      </div>

      {section && !user && (
        <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
          Log in (top right) to flag, note, or comment on this question.
        </p>
      )}

      {section === 'flag' && user && <FlagForm bankId={bankId} questionId={questionId} options={options} onDone={() => setSection(null)} />}
      {section === 'note' && user && <NoteBox bankId={bankId} questionId={questionId} />}
      {section === 'comments' && <CommentsThread bankId={bankId} questionId={questionId} canPost={!!user} />}
    </div>
  );
}

function FlagForm({ bankId, questionId, options, onDone }: { bankId: string; questionId: string; options: string[]; onDone: () => void }) {
  const [issueType, setIssueType] = useState('wrong_answer');
  const [suggested, setSuggested] = useState<string>('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (done) {
    return <p className="text-xs mt-2" style={{ color: '#2e7d4f' }}>Thanks — flagged for review. Check "My reports" in the Progress tab for status.</p>;
  }

  return (
    <form
      className="mt-2 space-y-2"
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
          await api.submitReport({
            bankId,
            questionId,
            issueType,
            suggestedAnswerIndex: suggested === '' ? null : Number(suggested),
            message,
          });
          setDone(true);
          setTimeout(onDone, 1500);
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Failed to submit');
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <select
        value={issueType}
        onChange={(e) => setIssueType(e.target.value)}
        className="px-2 py-1 rounded text-xs w-full"
        style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
      >
        {ISSUE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
      </select>
      {issueType === 'wrong_answer' && (
        <select
          value={suggested}
          onChange={(e) => setSuggested(e.target.value)}
          className="px-2 py-1 rounded text-xs w-full"
          style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          <option value="">What should the answer be? (optional)</option>
          {options.map((o, i) => <option key={i} value={i}>{String.fromCharCode(97 + i)}) {o}</option>)}
        </select>
      )}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Explain the issue…"
        rows={2}
        className="px-2 py-1 rounded text-xs w-full"
        style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
      />
      {error && <p className="text-xs" style={{ color: '#a33232' }}>{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="px-3 py-1 rounded text-xs font-medium"
        style={{ background: 'var(--accent)', color: '#fff' }}
      >
        {submitting ? 'Submitting…' : 'Submit flag'}
      </button>
    </form>
  );
}

function NoteBox({ bankId, questionId }: { bankId: string; questionId: string }) {
  const [note, setNote] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.getNote(bankId, questionId).then((r) => {
      if (!cancelled) {
        setNote(r.note);
        setLoaded(true);
      }
    });
    return () => { cancelled = true; };
  }, [bankId, questionId]);

  const save = async () => {
    setSaving(true);
    try {
      await api.saveNote(bankId, questionId, note);
      setSavedAt(Date.now());
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) return <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>Loading…</p>;

  return (
    <div className="mt-2 space-y-1.5">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Private note only you can see…"
        rows={2}
        className="px-2 py-1 rounded text-xs w-full"
        style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
      />
      <div className="flex items-center gap-2">
        <button
          onClick={save}
          disabled={saving}
          className="px-3 py-1 rounded text-xs font-medium"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          {saving ? 'Saving…' : 'Save note'}
        </button>
        {savedAt && <span className="text-xs" style={{ color: '#2e7d4f' }}>Saved</span>}
      </div>
    </div>
  );
}

function CommentsThread({ bankId, questionId, canPost }: { bankId: string; questionId: string; canPost: boolean }) {
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api.listComments(bankId, questionId).then((r) => {
      if (!cancelled) setComments(r.comments);
    });
    return () => { cancelled = true; };
  }, [bankId, questionId]);

  const post = async () => {
    if (!body.trim()) return;
    setPosting(true);
    try {
      const c = await api.addComment(bankId, questionId, body.trim());
      setComments((prev) => [...(prev ?? []), c]);
      setBody('');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="mt-2 space-y-2">
      {comments === null && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Loading…</p>}
      {comments?.length === 0 && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>No comments yet.</p>}
      {comments?.map((c) => (
        <div key={c.id} className="text-xs p-2 rounded" style={{ background: 'var(--bg-app)' }}>
          <span className="font-medium">{c.displayName ?? c.username}</span>
          <span className="ml-1.5" style={{ color: 'var(--text-secondary)' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
          <p className="mt-0.5">{c.body}</p>
        </div>
      ))}
      {canPost ? (
        <div className="flex gap-1.5">
          <input
            type="text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && post()}
            placeholder="Add a comment…"
            className="px-2 py-1 rounded text-xs flex-1"
            style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
          <button
            onClick={post}
            disabled={posting}
            className="px-2.5 py-1 rounded text-xs font-medium"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            Post
          </button>
        </div>
      ) : (
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Log in to comment.</p>
      )}
    </div>
  );
}
