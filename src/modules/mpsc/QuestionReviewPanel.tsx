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

interface Props {
  bankId: string;
  questionId: string;
  /** Present for MCQs — drives the "what should the answer be?" dropdown.
   *  Omitted for descriptive questions/sub-parts, which flag with free text
   *  instead. */
  options?: string[];
  /** Which lettered sub-part (a..z) this panel reviews, if any — threaded
   *  into every flag/comment/note call so admin review can target it. */
  subpartLabel?: string;
}

export function QuestionReviewPanel({ bankId, questionId, options, subpartLabel }: Props) {
  const { user } = useAuthStore();
  const [section, setSection] = useState<Section>(null);

  return (
    <div className="mt-2 pt-2" style={{ borderTop: '1px dashed var(--border)' }}>
      <div className="flex gap-3 text-xs">
        <button onClick={() => setSection(section === 'flag' ? null : 'flag')} style={{ color: section === 'flag' ? 'var(--accent)' : 'var(--text-secondary)' }}>
          🚩 Flag{subpartLabel ? ` (${subpartLabel})` : ''}
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

      {section === 'flag' && user && (
        <FlagForm bankId={bankId} questionId={questionId} options={options} subpartLabel={subpartLabel} onDone={() => setSection(null)} />
      )}
      {section === 'note' && user && <NoteBox bankId={bankId} questionId={questionId} />}
      {section === 'comments' && <CommentsThread bankId={bankId} questionId={questionId} canPost={!!user} />}
    </div>
  );
}

function FlagForm({
  bankId, questionId, options, subpartLabel, onDone,
}: { bankId: string; questionId: string; options?: string[]; subpartLabel?: string; onDone: () => void }) {
  const isMcq = !!options && options.length > 0;
  const [issueType, setIssueType] = useState('wrong_answer');
  const [suggested, setSuggested] = useState<string>('');
  const [suggestedText, setSuggestedText] = useState('');
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
            subpartLabel: subpartLabel ?? null,
            suggestedAnswerIndex: isMcq && suggested !== '' ? Number(suggested) : null,
            suggestedText: !isMcq && suggestedText.trim() ? suggestedText.trim() : null,
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
      {isMcq && issueType === 'wrong_answer' && (
        <select
          value={suggested}
          onChange={(e) => setSuggested(e.target.value)}
          className="px-2 py-1 rounded text-xs w-full"
          style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          <option value="">What should the answer be? (optional)</option>
          {options!.map((o, i) => <option key={i} value={i}>{String.fromCharCode(97 + i)}) {o}</option>)}
        </select>
      )}
      {!isMcq && (
        <textarea
          value={suggestedText}
          onChange={(e) => setSuggestedText(e.target.value)}
          placeholder="Suggested corrected text (optional)…"
          rows={2}
          className="px-2 py-1 rounded text-xs w-full"
          style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        />
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
  const { user } = useAuthStore();
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyBody, setReplyBody] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editBody, setEditBody] = useState('');

  const load = () => {
    api.listComments(bankId, questionId).then((r) => setComments(r.comments));
  };
  useEffect(load, [bankId, questionId]);

  const post = async () => {
    if (!body.trim()) return;
    setPosting(true);
    try {
      await api.addComment(bankId, questionId, body.trim());
      setBody('');
      load();
    } finally {
      setPosting(false);
    }
  };

  const postReply = async (parentId: number) => {
    if (!replyBody.trim()) return;
    setPosting(true);
    try {
      await api.addComment(bankId, questionId, replyBody.trim(), parentId);
      setReplyBody('');
      setReplyTo(null);
      load();
    } finally {
      setPosting(false);
    }
  };

  const saveEdit = async (id: number) => {
    if (!editBody.trim()) return;
    await api.editComment(id, editBody.trim());
    setEditingId(null);
    load();
  };

  const remove = async (id: number) => {
    await api.deleteComment(id);
    load();
  };

  const togglePin = async (id: number) => {
    await api.pinComment(id);
    load();
  };

  const isMine = (c: Comment) => !!user && c.username === user.username;
  const isAdmin = user?.role === 'admin';

  const renderComment = (c: Comment, indent: boolean) => (
    <div key={c.id} className="text-xs p-2 rounded" style={{ background: 'var(--bg-app)', marginLeft: indent ? 16 : 0 }}>
      <div className="flex items-center gap-1.5 flex-wrap">
        {c.isPinned && <span title="Pinned by admin">📌</span>}
        <span className="font-medium">{c.displayName ?? c.username}</span>
        <span style={{ color: 'var(--text-secondary)' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
        {c.updatedAt && <span style={{ color: 'var(--text-secondary)' }}>(edited)</span>}
      </div>
      {editingId === c.id ? (
        <div className="mt-1 space-y-1">
          <textarea
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            rows={2}
            className="px-2 py-1 rounded text-xs w-full"
            style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
          <div className="flex gap-2">
            <button onClick={() => saveEdit(c.id)} className="font-medium" style={{ color: 'var(--accent)' }}>Save</button>
            <button onClick={() => setEditingId(null)} style={{ color: 'var(--text-secondary)' }}>Cancel</button>
          </div>
        </div>
      ) : (
        <p className="mt-0.5">{c.body}</p>
      )}
      <div className="flex gap-2 mt-1" style={{ color: 'var(--text-secondary)' }}>
        {!indent && canPost && <button onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}>Reply</button>}
        {(isMine(c) || isAdmin) && editingId !== c.id && (
          <button onClick={() => { setEditingId(c.id); setEditBody(c.body); }}>Edit</button>
        )}
        {(isMine(c) || isAdmin) && <button onClick={() => remove(c.id)}>Delete</button>}
        {isAdmin && <button onClick={() => togglePin(c.id)}>{c.isPinned ? 'Unpin' : 'Pin'}</button>}
      </div>
      {replyTo === c.id && (
        <div className="mt-1.5 flex gap-1.5">
          <input
            type="text"
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && postReply(c.id)}
            placeholder="Reply…"
            className="px-2 py-1 rounded text-xs flex-1"
            style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
          <button onClick={() => postReply(c.id)} disabled={posting} className="px-2.5 py-1 rounded text-xs font-medium" style={{ background: 'var(--accent)', color: '#fff' }}>
            Post
          </button>
        </div>
      )}
    </div>
  );

  const topLevel = comments?.filter((c) => !c.parentId) ?? [];
  const repliesOf = (id: number) => comments?.filter((c) => c.parentId === id) ?? [];

  return (
    <div className="mt-2 space-y-2">
      {comments === null && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Loading…</p>}
      {comments?.length === 0 && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>No comments yet.</p>}
      {topLevel.map((c) => (
        <div key={c.id} className="space-y-1.5">
          {renderComment(c, false)}
          {repliesOf(c.id).map((r) => renderComment(r, true))}
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
