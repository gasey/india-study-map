import type { BankQuestion, ExamPaper, McqBankQuestion } from '@/data/banks/types';

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
  role: 'learner' | 'moderator' | 'reviewer' | 'editor' | 'admin' | 'owner';
  displayName: string | null;
  /** Only present on the /api/auth/me response, not /api/auth/login's. */
  capabilities?: string[];
}

export interface QuestionReport {
  id: number;
  bankId: string;
  questionId: string;
  issueType: string;
  suggestedAnswerIndex: number | null;
  /** Free-text suggested fix — for descriptive questions/sub-parts, which
   *  have no answer index to suggest. */
  suggestedText: string | null;
  /** Which lettered sub-part (a..z) this flag targets, if any. */
  subpartLabel: string | null;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  adminNote: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  username: string | null;
}

export interface CorrectedSubpart {
  label: string;
  text: string;
  modelAnswer?: string;
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
  /** Per-sub-part overrides for descriptive questions. */
  subparts: CorrectedSubpart[] | null;
  updatedAt: string;
}

export interface Comment {
  id: number;
  body: string;
  createdAt: string;
  updatedAt: string | null;
  username: string;
  displayName: string | null;
  /** One level of reply — the comment this replies to, if any. */
  parentId: number | null;
  isPinned: boolean;
}

export interface AdminComment extends Comment {
  bankId: string;
  questionId: string;
}

export interface AuditLogEntry {
  id: number;
  bankId: string;
  questionId: string;
  subpartLabel: string | null;
  action: 'correction' | 'report_status' | 'comment_pinned' | 'comment_deleted';
  actorId: number;
  actorUsername: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  note: string | null;
  createdAt: string;
}

export interface AdminStats {
  byBankStatus: { bankId: string; status: string; count: number }[];
  byIssueType: { issueType: string; count: number }[];
  totalComments: number;
  totalCorrections: number;
  perUser: { id: number; username: string; reportsFiled: number; commentsPosted: number; correctionsAuthored: number }[];
  recentActivity: Omit<AuditLogEntry, 'before' | 'after' | 'actorId'>[];
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

export function buildParams(f: object): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(f)) {
    if (value === undefined || value === '') continue;
    if (Array.isArray(value)) value.forEach((v) => params.append(key, String(v)));
    else params.set(key, String(value));
  }
  const q = params.toString();
  return q ? `?${q}` : '';
}

// ---- MPSC Old Questions bank: server-side filtering/pagination (Phase 4).
// Legacy /api/mpsc/bank (the full 76K-question dump) is intentionally not
// wrapped here anymore — see useMpscData.ts for why.
export interface BankQuestionFilters {
  examType?: string[];
  post?: string[];
  year?: string[];
  paperId?: string[];
  subject?: string[];
  difficulty?: string[];
  type?: string[];
  search?: string;
}

export interface BankQuestionQuery extends BankQuestionFilters {
  sortBy?: 'year' | 'difficulty' | 'question' | 'id';
  sortDir?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export function listBankQuestions(query: BankQuestionQuery) {
  return request<{ total: number; questions: BankQuestion[] }>(`/api/mpsc/questions${buildParams(query)}`);
}
export function getBankFacets(filters: BankQuestionFilters) {
  return request<Record<string, Record<string, number>>>(`/api/mpsc/questions/facets${buildParams(filters)}`);
}
export function sampleBankQuestions(filters: BankQuestionFilters, count = 25) {
  return request<{ questions: McqBankQuestion[] }>(`/api/mpsc/questions/sample${buildParams({ ...filters, count })}`);
}
export function getBankPapers() {
  return request<{ papers: (ExamPaper & { questionCount: number })[] }>('/api/mpsc/papers');
}
export function getBankQuestion(id: string) {
  return request<BankQuestion>(`/api/mpsc/questions/${encodeURIComponent(id)}`);
}

// ---- Papers tree (Phase 5): exam type -> year -> sitting -> papers.
// Supersedes the client-side sittingKey()/useBankPapers() grouping.
export interface PapersTreeSitting {
  key: string;
  examType: string;
  examName: string;
  post: string | null;
  year: number | null;
  label: string;
  papers: (ExamPaper & { questionCount: number })[];
  totalQuestions: number;
}
export interface PapersTreeYear {
  year: number | null;
  sittings: PapersTreeSitting[];
}
export interface PapersTreeExamType {
  examType: string;
  years: PapersTreeYear[];
}
export interface PapersTree {
  examTypes: PapersTreeExamType[];
}
export function getPapersTree() {
  return request<PapersTree>('/api/papers/tree/');
}

// ---- TestDefinition (Phase 5): a saved filter, not a materialized
// question-id list — "filter" is the same shape /api/mpsc/questions takes.
export type TestKind = 'real_paper' | 'full_sitting' | 'sectional' | 'adaptive' | 'sprint';
export interface TestDefinition {
  id: number;
  title: string;
  kind: TestKind;
  filter: BankQuestionFilters;
  nQuestions: number;
  durationS: number;
  negative: number;
  shuffle: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string | null;
}
export interface TestDefinitionInput {
  title: string;
  kind: TestKind;
  filter: BankQuestionFilters;
  nQuestions: number;
  durationS: number;
  negative?: number;
  shuffle?: boolean;
  isPublished?: boolean;
}
function testDefinitionToBody(input: Partial<TestDefinitionInput>) {
  return JSON.stringify({
    ...(input.title !== undefined && { title: input.title }),
    ...(input.kind !== undefined && { kind: input.kind }),
    ...(input.filter !== undefined && { filter: input.filter }),
    ...(input.nQuestions !== undefined && { n_questions: input.nQuestions }),
    ...(input.durationS !== undefined && { duration_s: input.durationS }),
    ...(input.negative !== undefined && { negative: input.negative }),
    ...(input.shuffle !== undefined && { shuffle: input.shuffle }),
    ...(input.isPublished !== undefined && { is_published: input.isPublished }),
  });
}
export function getTests() {
  return request<{ tests: TestDefinition[] }>('/api/tests/');
}
export function getAdminTests() {
  return request<{ tests: TestDefinition[] }>('/api/admin/tests/');
}
export function createTest(input: TestDefinitionInput) {
  return request<TestDefinition>('/api/admin/tests/', { method: 'POST', body: testDefinitionToBody(input) });
}
export function updateTest(id: number, input: Partial<TestDefinitionInput>) {
  return request<TestDefinition>(`/api/admin/tests/${id}`, { method: 'PATCH', body: testDefinitionToBody(input) });
}
export function deleteTest(id: number) {
  return request<{ status: string }>(`/api/admin/tests/${id}`, { method: 'DELETE' });
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
  bankId: string; questionId: string; issueType: string; suggestedAnswerIndex?: number | null;
  suggestedText?: string | null; subpartLabel?: string | null; message: string;
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
export function addComment(bankId: string, questionId: string, body: string, parentId?: number | null) {
  return request<Comment>('/api/questions/comments', { method: 'POST', body: JSON.stringify({ bankId, questionId, body, parentId }) });
}
export function editComment(id: number, body: string) {
  return request<{ status: string }>(`/api/questions/comments/${id}`, { method: 'PATCH', body: JSON.stringify({ body }) });
}
export function deleteComment(id: number) {
  return request<{ status: string }>(`/api/questions/comments/${id}`, { method: 'DELETE' });
}
export function pinComment(id: number) {
  return request<{ status: string; isPinned: boolean }>(`/api/questions/comments/${id}/pin`, { method: 'POST' });
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
export interface AdminReportsFilter {
  status?: string;
  bankId?: string;
  issueType?: string[];
  search?: string;
  fromDate?: string;
  toDate?: string;
  hasSuggestion?: boolean;
  subpartLabel?: string;
  sort?: 'newest' | 'oldest';
  limit?: number;
  offset?: number;
}

export function adminListReports(filter: AdminReportsFilter = {}) {
  return request<{ reports: QuestionReport[] }>(`/api/admin/reports${buildParams(filter)}`);
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
  correctedSubparts?: CorrectedSubpart[] | null; subpartLabel?: string | null;
  reportIds?: number[]; adminNote?: string;
}) {
  return request<{ status: string }>('/api/admin/corrections', { method: 'POST', body: JSON.stringify(input) });
}
export function adminListUsers() {
  return request<{ users: (ApiUser & { createdAt: string })[] }>('/api/admin/users');
}
export function adminAssignRole(userId: number, role: ApiUser['role']) {
  return request<{ status: string; userId: number; role: string }>(`/api/admin/users/${userId}/role`, {
    method: 'POST',
    body: JSON.stringify({ role }),
  });
}
export function adminListAuditLog(filter: {
  bankId?: string; questionId?: string; actorId?: number; action?: string; fromDate?: string; toDate?: string;
  limit?: number; offset?: number;
} = {}) {
  return request<{ entries: AuditLogEntry[] }>(`/api/admin/audit-log${buildParams(filter)}`);
}
export function adminListComments(filter: {
  bankId?: string; search?: string; fromDate?: string; toDate?: string; pinned?: boolean; limit?: number; offset?: number;
} = {}) {
  return request<{ comments: AdminComment[] }>(`/api/admin/comments${buildParams(filter)}`);
}
export function adminStats() {
  return request<AdminStats>('/api/admin/stats');
}

export { ApiError };
