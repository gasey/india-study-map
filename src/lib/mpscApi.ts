// ============================================
// mpsc-api client — the shiksha-dev droplet's FastAPI service.
// Covers: auth, question reports (complaints), admin-authored
// corrections, comments, personal notes, and mock-test progress.
// Bank-agnostic: every question is identified by (bankId, questionId),
// so this works for State Tax Officer today and any future bank.
// ============================================

// HTTPS is required here, not just nice-to-have: the deployed site is
// served over HTTPS (Vercel), and browsers silently block http:// fetches
// from an https:// page as mixed content — that showed up as a bare
// "Failed to fetch" with no other clue. api.map.hawayu.in is a dedicated
// subdomain (A record -> the droplet) with its own Let's Encrypt cert,
// proxying straight to the mpsc-api service — see DEVLOG.md.
const API_BASE = 'https://api.map.hawayu.in';

export interface ApiUser {
  id: number;
  username: string;
  role: 'user' | 'admin';
  displayName: string | null;
}

export interface QuestionReport {
  id: number;
  bankId: string;
  questionId: string;
  issueType: string;
  suggestedAnswerIndex: number | null;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  adminNote: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  username: string | null;
}

export interface Correction {
  answerIndex: number | null;
  explanation: string | null;
  note: string | null;
  /** Rewritten stem — supports __word__ to mark the target word as underlined,
   *  for questions ("identify the part of speech of the underlined word…")
   *  where OCR extraction lost the original underline formatting. */
  stem: string | null;
  /** Rewritten option text, replacing all 4 options — for OCR-garbled MCQs
   *  where the printed options came through blank or scrambled. */
  options: string[] | null;
  updatedAt: string;
}

export interface Comment {
  id: number;
  body: string;
  createdAt: string;
  username: string;
  displayName: string | null;
}

export interface MockAttemptRecord {
  id: number;
  bankId: string;
  testLabel: string;
  total: number;
  correct: number;
  wrong: number;
  unattempted: number;
  score: number;
  takenAt: string;
}

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

let authToken: string | null = null;
export function setApiToken(token: string | null) {
  authToken = token;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as Record<string, string>) };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {
      // ignore
    }
    throw new ApiError(res.status, detail);
  }
  return res.json();
}

// ---- Auth ----
export function login(username: string, password: string) {
  return request<{ token: string; user: ApiUser }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}
export function me() {
  return request<ApiUser>('/api/auth/me');
}

// ---- Reports ----
export function submitReport(input: {
  bankId: string; questionId: string; issueType: string; suggestedAnswerIndex?: number | null; message: string;
}) {
  return request<QuestionReport>('/api/questions/report', { method: 'POST', body: JSON.stringify(input) });
}
export function myReports(bankId?: string) {
  const q = bankId ? `?bankId=${encodeURIComponent(bankId)}` : '';
  return request<{ reports: QuestionReport[] }>(`/api/questions/my-reports${q}`);
}

// ---- Corrections ----
export function getCorrections(bankId: string) {
  return request<Record<string, Correction>>(`/api/questions/corrections?bankId=${encodeURIComponent(bankId)}`);
}

// ---- Comments ----
export function listComments(bankId: string, questionId: string) {
  return request<{ comments: Comment[] }>(
    `/api/questions/comments?bankId=${encodeURIComponent(bankId)}&questionId=${encodeURIComponent(questionId)}`,
  );
}
export function addComment(bankId: string, questionId: string, body: string) {
  return request<Comment>('/api/questions/comments', { method: 'POST', body: JSON.stringify({ bankId, questionId, body }) });
}

// ---- Personal notes ----
export function getNote(bankId: string, questionId: string) {
  return request<{ note: string; updatedAt: string | null }>(
    `/api/questions/notes?bankId=${encodeURIComponent(bankId)}&questionId=${encodeURIComponent(questionId)}`,
  );
}
export function saveNote(bankId: string, questionId: string, note: string) {
  return request<{ status: string }>('/api/questions/notes', { method: 'PUT', body: JSON.stringify({ bankId, questionId, note }) });
}

// ---- Progress ----
export function recordMockAttempt(input: {
  bankId: string; testLabel: string; total: number; correct: number; wrong: number; unattempted: number; score: number;
}) {
  return request<{ status: string; attemptId: number }>('/api/progress/mock-attempt', { method: 'POST', body: JSON.stringify(input) });
}
export function getHistory(bankId?: string) {
  const q = bankId ? `?bankId=${encodeURIComponent(bankId)}` : '';
  return request<{ attempts: MockAttemptRecord[] }>(`/api/progress/history${q}`);
}

// ---- Admin ----
export function adminListReports(status?: string, bankId?: string) {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (bankId) params.set('bankId', bankId);
  const q = params.toString() ? `?${params.toString()}` : '';
  return request<{ reports: QuestionReport[] }>(`/api/admin/reports${q}`);
}
export function adminBulkStatus(ids: number[], status: 'accepted' | 'rejected', adminNote: string) {
  return request<{ updated: number }>('/api/admin/reports/bulk-status', {
    method: 'POST',
    body: JSON.stringify({ ids, status, adminNote }),
  });
}
export function adminUpsertCorrection(input: {
  bankId: string; questionId: string; correctedAnswerIndex?: number | null; correctedExplanation?: string | null;
  correctedNote?: string | null; correctedStem?: string | null; correctedOptions?: string[] | null;
  reportIds?: number[]; adminNote?: string;
}) {
  return request<{ status: string }>('/api/admin/corrections', { method: 'POST', body: JSON.stringify(input) });
}
export function adminListUsers() {
  return request<{ users: (ApiUser & { createdAt: string })[] }>('/api/admin/users');
}

export { ApiError };
