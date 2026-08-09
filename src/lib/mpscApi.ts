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

// ---- Admin: Papers metadata editing (Phase 6). Papers are 1:1 with source
// PDFs — no create/delete, only fixing blank/wrong extracted metadata.
export interface AdminPapersQuery {
  q?: string;
  missingYear?: boolean;
  limit?: number;
  offset?: number;
}
export interface PaperPatchInput {
  examType?: string;
  examName?: string;
  post?: string;
  paperNumber?: string;
  paperSubject?: string;
  year?: number | null;
}
export function getAdminPapers(query: AdminPapersQuery = {}) {
  return request<{ total: number; papers: (ExamPaper & { questionCount: number })[] }>(`/api/admin/papers/${buildParams(query)}`);
}
export function updatePaper(id: string, input: PaperPatchInput) {
  return request<ExamPaper & { questionCount: number }>(`/api/admin/papers/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

// ---- Import pipeline (Phase 6). Accepts a pre-extracted JSON file (paper
// metadata + parsed questions), not raw PDFs — see the backend's
// migrate_v8.sql comment for why live PDF OCR isn't wired in here. Every
// run is a dry-run first; apply() is a separate, explicit step, and the
// count check (parsed questions in === rows written) is the whole point —
// it's the literal fix for the real IMP-0138 incident (280 questions lost
// silently because nothing compared).
export type ImportStatus = 'dry_run' | 'applied' | 'rolled_back' | 'failed';
export interface ImportRun {
  id: number;
  filename: string;
  status: ImportStatus;
  parsedPapers: number;
  parsedQuestions: number;
  writtenQuestions: number;
  error: string | null;
  actorUsername: string;
  createdAt: string;
  appliedAt: string | null;
}
export function getAdminImports() {
  return request<{ runs: ImportRun[] }>('/api/admin/imports/');
}
export async function createImport(file: File) {
  const form = new FormData();
  form.append('file', file);
  const headers: Record<string, string> = {};
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  const res = await fetch(`${API_BASE}/api/admin/imports/`, { method: 'POST', body: form, headers });
  if (!res.ok) {
    let detail = res.statusText;
    try { detail = (await res.json()).detail ?? detail; } catch { /* ignore */ }
    throw new ApiError(res.status, detail);
  }
  return res.json() as Promise<{ id: number; status: ImportStatus; parsedPapers: number; parsedQuestions: number }>;
}
export function applyImport(id: number) {
  return request<{ id: number; status: ImportStatus; writtenQuestions: number }>(`/api/admin/imports/${id}/apply/`, { method: 'POST' });
}
export function rollbackImport(id: number) {
  return request<{ status: string; deleted: number }>(`/api/admin/imports/${id}/rollback/`, { method: 'POST' });
}

// ---- FeatureFlag (Phase 6): per-role rollout flags. Public GET only
// surfaces `audience: 'everyone'` flags that are on; the admin surface below
// sees everything, gated by the `flag.write` capability.
export type FlagAudience = 'everyone' | 'logged_in' | 'moderator' | 'reviewer' | 'editor' | 'admin';
export interface FeatureFlag {
  key: string;
  describes: string;
  audience: FlagAudience;
  isOn: boolean;
  rolledOut: string | null;
}
export interface FlagInput {
  key: string;
  describes?: string;
  audience?: FlagAudience;
  is_on?: boolean;
  rolled_out?: string | null;
}
export interface FlagPatchInput {
  describes?: string;
  audience?: FlagAudience;
  is_on?: boolean;
  rolled_out?: string | null;
}
export function getFlags() {
  return request<{ flags: FeatureFlag[] }>('/api/flags/');
}
export function getAdminFlags() {
  return request<{ flags: FeatureFlag[] }>('/api/admin/flags/');
}
export function createFlag(input: FlagInput) {
  return request<FeatureFlag>('/api/admin/flags/', { method: 'POST', body: JSON.stringify(input) });
}
export function updateFlag(key: string, input: FlagPatchInput) {
  return request<FeatureFlag>(`/api/admin/flags/${encodeURIComponent(key)}`, { method: 'PATCH', body: JSON.stringify(input) });
}
export function deleteFlag(key: string) {
  return request<{ status: string }>(`/api/admin/flags/${encodeURIComponent(key)}`, { method: 'DELETE' });
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

// ---- StaticSet (Phase 5c): registry metadata for Library's premade sets.
// The set files themselves are untouched — this is metadata layered on top,
// linked to registry.ts entries by matching `route` (e.g. '/embed/codex').
export type StaticSetGroup = 'lab' | 'exam_guide' | 'quick_practice';
export interface StaticSet {
  id: number;
  title: string;
  group: StaticSetGroup;
  route: string;
  nItems: number | null;
  unit: string;
  blurb: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string | null;
}
export interface StaticSetInput {
  title: string;
  group: StaticSetGroup;
  route: string;
  nItems?: number | null;
  unit?: string;
  blurb?: string;
  isPublished?: boolean;
}
function staticSetToBody(input: Partial<StaticSetInput>) {
  return JSON.stringify({
    ...(input.title !== undefined && { title: input.title }),
    ...(input.group !== undefined && { group: input.group }),
    ...(input.route !== undefined && { route: input.route }),
    ...(input.nItems !== undefined && { n_items: input.nItems }),
    ...(input.unit !== undefined && { unit: input.unit }),
    ...(input.blurb !== undefined && { blurb: input.blurb }),
    ...(input.isPublished !== undefined && { is_published: input.isPublished }),
  });
}
export function getStaticSets() {
  return request<{ sets: StaticSet[] }>('/api/static-sets/');
}
export function getAdminStaticSets() {
  return request<{ sets: StaticSet[] }>('/api/admin/static-sets/');
}
export function createStaticSet(input: StaticSetInput) {
  return request<StaticSet>('/api/admin/static-sets/', { method: 'POST', body: staticSetToBody(input) });
}
export function updateStaticSet(id: number, input: Partial<StaticSetInput>) {
  return request<StaticSet>(`/api/admin/static-sets/${id}`, { method: 'PATCH', body: staticSetToBody(input) });
}
export function deleteStaticSet(id: number) {
  return request<{ status: string }>(`/api/admin/static-sets/${id}`, { method: 'DELETE' });
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
export function signup(username: string, password: string, displayName?: string) {
  return request<{ token: string; user: ApiUser }>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ username, password, displayName: displayName ?? '' }),
  });
}
/** Admin/owner-only: sets a random temp password and returns it once. No
 *  email exists to send it to (see main.py) — relay it out of band. */
export function adminResetPassword(userId: number) {
  return request<{ status: string; userId: number; tempPassword: string }>(`/api/admin/users/${userId}/reset-password`, { method: 'POST' });
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

// ---- Real per-topic attempt log. Fire-and-forget from every place that
// already records an attempt locally (recordBankAttempt/recordAttempt call
// sites) -- swallows errors on purpose, since a failed sync must never
// block or corrupt the local-first UX those functions already guarantee.
// Only called when authToken is set; anonymous/guest usage has no account
// to attach server data to.
export interface TopicAccuracy {
  subject: string;
  topic: string;
  topicLabel: string;
  correct: number;
  attempts: number;
  accuracy: number;
}
export function logAttempt(input: { subject: string; topic: string; topicLabel: string; source: string; correct: boolean }) {
  if (!authToken) return;
  request('/api/attempts/log', { method: 'POST', body: JSON.stringify(input) }).catch(() => {});
}
export function getMyTopicAccuracy() {
  return request<{ topics: TopicAccuracy[] }>('/api/me/topic-accuracy');
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
