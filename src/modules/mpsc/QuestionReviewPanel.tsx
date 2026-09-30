import { useEffect, useRef, useState } from 'react';
import { hasCap, useAuthStore } from '@/lib/authStore';
import * as api from '@/lib/mpscApi';
import type { Comment, PublicFlagStatus } from '@/lib/mpscApi';
import { QuestionEditor } from '@/modules/admin/QuestionEditor';

type Section = 'flag' | 'note' | 'comments';

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
  /**
   * Open the comments thread as soon as this turns true — used by the clerical
   * bank to show the discussion the moment a question is ANSWERED.
   *
   * After answering is the only safe moment: a pinned comment routinely says
   * which option is right and why, so opening it any earlier would hand over
   * the answer to someone who had not committed to one yet.
   *
   * Fires once per question. Re-opening on every render would fight a reader
   * who deliberately closed the thread.
   */
  autoOpenComments?: boolean;
}

export function QuestionReviewPanel({
  bankId, questionId, options, subpartLabel, autoOpenComments,
}: Props) {
  const { user } = useAuthStore();
  const [sections, setSections] = useState<Set<Section>>(new Set());
  const [autoDone, setAutoDone] = useState(false);
  const [publicFlag, setPublicFlag] = useState<PublicFlagStatus | null>(null);
  const [editing, setEditing] = useState(false);

  const toggle = (section: Section) => {
    setSections((current) => {
      const next = new Set(current);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };
  const collapseAll = () => setSections(new Set());

  useEffect(() => {
    if (autoOpenComments && !autoDone) {
      setSections(new Set(['note', 'comments']));
      setAutoDone(true);
    }
  }, [autoOpenComments, autoDone]);

  // A new question reuses this component instance, so the one-shot latch has
  // to clear or only the first question in a drill would ever auto-open.
  useEffect(() => {
    setAutoDone(false);
    setSections(new Set());
    setPublicFlag(null);
    setEditing(false);
    let live = true;
    api.publicFlagStatus(bankId, questionId)
      .then((status) => { if (live) setPublicFlag(status); })
      .catch(() => { if (live) setPublicFlag(null); });
    return () => { live = false; };
  }, [bankId, questionId]);

  return (
    <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)', background: 'color-mix(in srgb, var(--bg-panel-elev) 35%, transparent)' }}>
      <button
        type="button"
        onClick={() => toggle('comments')}
        className="w-full text-left rounded-xl px-3 py-2"
        style={{
          border: '1px solid color-mix(in srgb, var(--accent) 38%, var(--border))',
          background: 'var(--bg-panel-elev)',
          color: 'var(--text-secondary)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center rounded-lg text-base" style={{ width: 32, height: 32, background: 'color-mix(in srgb, var(--info, #3b7dd8) 18%, transparent)' }}>💬</span>
          <span className="flex-1">
            <span className="block text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Question discussion</span>
            <span className="block text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Share an explanation, correction, or useful exam tip with other learners.
            </span>
          </span>
          <span className="text-lg" style={{ color: 'var(--accent)' }}>{sections.has('comments') ? '▾' : '→'}</span>
        </div>
      </button>

      <div className="flex gap-2 flex-wrap items-center">
        <button className="px-2.5 py-1 rounded-full text-xs" onClick={() => toggle('flag')} style={{ border: '1px solid color-mix(in srgb, #c4462f 35%, var(--border))', background: sections.has('flag') ? 'color-mix(in srgb, #c4462f 12%, transparent)' : 'transparent', color: '#c4462f' }}>
          🚩 Flag{subpartLabel ? ` (${subpartLabel})` : ''}
        </button>
        <button className="px-2.5 py-1 rounded-full text-xs" onClick={() => toggle('note')} style={{ border: '1px solid color-mix(in srgb, #b06f1a 35%, var(--border))', background: sections.has('note') ? 'color-mix(in srgb, #b06f1a 12%, transparent)' : 'transparent', color: '#b06f1a' }}>
          📝 My note
        </button>
        <button className="px-2.5 py-1 rounded-full text-xs" onClick={() => toggle('comments')} style={{ border: '1px solid color-mix(in srgb, var(--info, #3b7dd8) 35%, var(--border))', background: sections.has('comments') ? 'color-mix(in srgb, var(--info, #3b7dd8) 12%, transparent)' : 'transparent', color: 'var(--info, #3b7dd8)' }}>
          💬 Comments
        </button>
        {hasCap(user, 'correction.write') && (
          <button className="px-2.5 py-1 rounded-full text-xs" onClick={() => setEditing((open) => !open)} style={{ border: '1px solid var(--border)', background: editing ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'transparent', color: editing ? 'var(--accent)' : 'var(--text-secondary)' }}>
            ✏️ Edit question
          </button>
        )}
        {sections.size > 0 && (
          <button className="ml-auto text-xs" onClick={collapseAll} style={{ color: 'var(--text-secondary)' }}>
            Collapse all
          </button>
        )}
      </div>

      {editing && user && (
        <div className="mt-2 rounded" style={{ border: '1px solid var(--border)', overflow: 'hidden' }}>
          <QuestionEditor
            bankId={bankId}
            questionId={questionId}
            onSaved={() => {
              setEditing(false);
              window.dispatchEvent(new CustomEvent('mpsc-correction-applied', { detail: { bankId, questionId } }));
            }}
            onDiscard={() => setEditing(false)}
          />
        </div>
      )}

      {publicFlag?.flagged && (
        <div className="text-xs mt-2 px-3 py-2 rounded-lg" style={{ color: 'var(--warn, #b06f1a)', background: 'color-mix(in srgb, var(--warn, #b06f1a) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--warn, #b06f1a) 25%, transparent)' }}>
          🚩 This question has been flagged by learners — be cautious and check the wording/answer.
          {publicFlag.count > 1 ? ` ${publicFlag.count} reports are on file.` : ''}
        </div>
      )}

      {sections.size > 0 && !user && (
        <p className="text-xs mt-2 px-3 py-2 rounded-lg" style={{ color: 'var(--text-secondary)', background: 'var(--bg-app)' }}>
          Log in (top right) to flag or save a private note. Comments are readable without an account.
        </p>
      )}

      {sections.has('flag') && user && (
        <FlagForm bankId={bankId} questionId={questionId} options={options} subpartLabel={subpartLabel} onDone={() => toggle('flag')} />
      )}
      {sections.has('note') && user && <NoteBox bankId={bankId} questionId={questionId} />}
      {sections.has('comments') && <CommentsThread bankId={bankId} questionId={questionId} canPost={!!user} />}
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
  const submitLock = useRef(false);

  if (done) {
    return <p className="text-xs mt-2" style={{ color: '#2e7d4f' }}>Thanks — flagged for review. Check "My reports" in the Progress tab for status.</p>;
  }

  return (
    <form
      className="mt-2 space-y-2"
      onSubmit={async (e) => {
        e.preventDefault();
        if (submitLock.current) return;
        submitLock.current = true;
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
          submitLock.current = false;
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
  const saveLock = useRef(false);

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
    if (saveLock.current) return;
    saveLock.current = true;
    setSaving(true);
    try {
      await api.saveNote(bankId, questionId, note);
      setSavedAt(Date.now());
    } finally {
      saveLock.current = false;
      setSaving(false);
    }
  };

  if (!loaded) return <p className="text-xs mt-2 px-3 py-2 rounded-lg" style={{ color: 'var(--text-secondary)', background: 'var(--bg-app)' }}>Loading your private note…</p>;

  return (
    <div className="mt-2 p-3 rounded-xl space-y-2" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
      <div>
        <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Private study note</div>
        <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>Only you can see this note.</div>
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Private note only you can see…"
        rows={3}
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
  const [error, setError] = useState<string | null>(null);
  const postLock = useRef(false);

  const load = () => {
    api.listComments(bankId, questionId).then((r) => setComments(r.comments));
  };
  useEffect(load, [bankId, questionId]);

  const post = async () => {
    if (!body.trim()) return;
    if (postLock.current) return;
    postLock.current = true;
    setPosting(true);
    setError(null);
    try {
      await api.addComment(bankId, questionId, body.trim());
      setBody('');
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not post comment');
    } finally {
      postLock.current = false;
      setPosting(false);
    }
  };

  const postReply = async (parentId: number) => {
    if (!replyBody.trim()) return;
    if (postLock.current) return;
    postLock.current = true;
    setPosting(true);
    setError(null);
    try {
      await api.addComment(bankId, questionId, replyBody.trim(), parentId);
      setReplyBody('');
      setReplyTo(null);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not post reply');
    } finally {
      postLock.current = false;
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
  // comment.moderate is rank-2 (moderator+) on the backend — pin/edit/
  // delete-others now match that bar exactly, not the old admin-only one.
  const canModerate = hasCap(user, 'comment.moderate');

  const renderComment = (c: Comment, indent: boolean) => (
    <div key={c.id} className="text-xs p-3 rounded-xl" style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-secondary)', marginLeft: indent ? 16 : 0 }}>
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
        <p className="mt-0.5" style={{ color: 'var(--text-secondary)' }}>{c.body}</p>
      )}
      <div className="flex gap-2 mt-1" style={{ color: 'var(--text-secondary)' }}>
        {!indent && canPost && <button onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}>Reply</button>}
        {(isMine(c) || canModerate) && editingId !== c.id && (
          <button onClick={() => { setEditingId(c.id); setEditBody(c.body); }}>Edit</button>
        )}
        {(isMine(c) || canModerate) && <button onClick={() => remove(c.id)}>Delete</button>}
        {canModerate && <button onClick={() => togglePin(c.id)}>{c.isPinned ? 'Unpin' : 'Pin'}</button>}
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
    <div className="mt-2 p-3 rounded-xl space-y-2" style={{ background: 'var(--bg-app)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Question discussion</div>
          <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>Share a correction, explanation, or useful exam tip.</div>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ color: 'var(--text-secondary)', background: 'var(--bg-panel-elev)' }}>Public</span>
      </div>
      {comments === null && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Loading…</p>}
      {comments?.length === 0 && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>No comments yet.</p>}
      {error && <p className="text-xs" style={{ color: 'var(--bad, #a33232)' }}>{error}</p>}
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
            className="px-3 py-2 rounded-lg text-xs flex-1"
            style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
          <button
            onClick={post}
            disabled={posting}
            className="px-3 py-2 rounded-lg text-xs font-medium"
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
