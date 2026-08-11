// ============================================
// Shared technical/non-technical post classification — used by both
// PapersPage's "Hide technical-subject papers" filter and the Question
// Bank's "Hide technical posts" filter, so there's exactly one list to
// maintain instead of two copies drifting apart.
// ============================================

export const TECHNICAL_POSTS = new Set([
  'AE/SDO',
  'AE/SDO (Civil)',
  'AE/SDO (Electrical)',
  'AE/SDO (Mechanical)',
  'Junior Engineer',
  'Junior Engineer (Civil)',
  'Junior Engineer (Electrical)',
  'Junior Engineer (Mechanical)',
  'Junior Engineer (I&WR)',
  'Civil Engineer',
  'Mechanical Engineer',
  'Electrical Engineer',
  'Computer Science Engineer',
  'Geologist',
  'Draftsman',
  'Soil Conservation Ranger',
  'Surveyor',
  'Fisheries Officer',
  'Forestry Officer',
  'Agriculture Officer',
  'Entomologist',
  'Veterinary Officer',
  'Nursing',
  'Technical Officer',
  'Mizoram Engineering Service',
]);

export function isPostTechnical(post: string | null | undefined): boolean {
  return post ? TECHNICAL_POSTS.has(post) : false;
}

// The Question Bank's per-question `post` facet is raw, unnormalized free
// text straight from each PDF's extraction — the same underlying post
// ("AE/SDO", Civil stream) shows up as "AE/SDO (Civil)", "AE/SDO (CIVIL)",
// "AE/SDO (Assistant Engineer/Sub-Divisional Officer)", "AE/SDO (Civil)
// under Public Works Department", etc. An exact-Set match against
// TECHNICAL_POSTS (calibrated for PapersPage's server-normalized
// Sitting.post instead) misses nearly all of these variants. This keyword
// regex catches the loose free-text case instead.
const TECHNICAL_POST_RE = /\b(AE\/SDO|Engineer\w*|Geologist|Draftsman|Soil Conservation Ranger|Surveyor|Fisheries Officer|Forestry Officer|Agriculture Officer|Entomologist|Veterinary|Nursing|Technical Officer|Public Health Engineering|PHE)\b/i;

export function isPostTechnicalLoose(post: string | null | undefined): boolean {
  return post ? TECHNICAL_POST_RE.test(post) : false;
}

// ---- paper-*subject* classification (distinct axis — see PapersPage.tsx's
// DEVLOG entry for why this exists separately from the post-based one) ----

const GENERAL_SUBJECT_RE = /\b(gk|general knowledge|gs|general studies|general english|english|comprehension|aptitude|reasoning|mathematics|maths|precis|pr[ée]cis|essay|current affairs)\b/i;
const TECHNICAL_SUBJECT_RE = /\b(engineering|engineer|technical|veterinary|animal husbandry|horticulture|sericulture|agriculture|fisheries|ophthalmology|obstetrics|gynaecology|gynecology|surgery|medicine|dialysis|radiotherapy|pharmacy|nursing|social work|psychology|home science|sociology|law\b|legal|rules|act\b|manual)\b/i;

export function isPaperSubjectTechnical(subject: string | null | undefined): boolean {
  if (!subject) return false;
  if (GENERAL_SUBJECT_RE.test(subject)) return false;
  return TECHNICAL_SUBJECT_RE.test(subject);
}
