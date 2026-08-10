import type { SubjectId } from '@/types';

/** Fixed subject → colour, per tokens.css's comments and HANDOFF.md's rule:
 *  a learner should recognise a subject by colour before reading the label. */
export const SUBJECT_HUE: Record<SubjectId, string> = {
  geography: 'var(--green)',
  history: 'var(--brown)',
  polity: 'var(--blue)',
};
