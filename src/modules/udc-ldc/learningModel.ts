import { isScorableMcq, type BankQuestion } from '@/data/banks/types';
import { sectionOf, SECTION_LABEL, GK_TOPIC_LABEL } from './filters';
import { COMPUTER_TOPICS, ENGLISH_TOPICS, MATH_TOPICS, studyTopicOf } from './studyTopics';
import type { LearningArea, LearningDashboardModel, LearningState, QuestionLearning } from '@/lib/learning/types';
export type { LearningDashboardModel, LearningArea } from '@/lib/learning/types';

/** Resolve reviewed bank taxonomy; no keyword guessing is used to declare a weakness. */
export function learningTopicOf(q: BankQuestion): { id: string; label: string } {
  const subject = sectionOf(q);
  if (subject === 'arithmetic' || subject === 'computer') {
    const id = studyTopicOf(q, subject);
    const choices = subject === 'arithmetic' ? MATH_TOPICS : COMPUTER_TOPICS;
    return { id: `${subject}:${id}`, label: choices.find(([key]) => key === id)?.[1] ?? 'Mixed / needs topic review' };
  }
  if (subject === 'english') {
    const id = studyTopicOf(q, subject);
    return { id: `english:${id}`, label: ENGLISH_TOPICS.find(([key]) => key === id)?.[1] ?? 'Other English' };
  }
  if (subject === 'gk') {
    const id = q.gkTopic ?? 'general';
    return { id: `gk:${id}`, label: GK_TOPIC_LABEL[id] };
  }
  return { id: `${subject}:${q.topic}`, label: q.topicLabel || SECTION_LABEL[subject] };
}
export function isLearningScorable(q: BankQuestion): boolean {
  return isScorableMcq(q) && !q.sourceDefect;
}
/** Accuracy is question-balanced: repeatedly answering one familiar item cannot
 * drown out the distinct questions still being missed. Lifetime answer accuracy
 * remains separate in summary. Reading never increases answer evidence. */
function areaFor(id: string, label: string, subjectId: string, subjectLabel: string, rows: BankQuestion[], state: LearningState, now: number): LearningArea {
  const scorable = rows.filter(isLearningScorable);
  const known = scorable.map(q => state.questions[q.id]).filter((p): p is QuestionLearning => !!p && p.recent.length > 0);
  const questionAccuracy = (p: QuestionLearning) => {
    const events = p.recent.slice(-3);
    return events.reduce((n, event) => n + Number(event.correct), 0) / events.length;
  };
  const accuracy = known.length ? Math.round(100 * known.reduce((n, p) => n + questionAccuracy(p), 0) / known.length) : null;
  const comparable = known.filter(p => p.recent.length >= 2 && p.recent[p.recent.length - 1].at - p.recent[0].at >= 60_000);
  const change = comparable.length ? comparable.reduce((sum, p) => sum + Number(p.recent[p.recent.length - 1].correct) - Number(p.recent[0].correct), 0) / comparable.length : 0;
  const attempted = scorable.filter(q => (state.questions[q.id]?.attempts ?? 0) > 0).length;
  const secure = known.filter(p => p.spacedSuccesses >= 3 && p.lastCorrect).length;
  const status = attempted === 0 ? 'unseen' : known.length < state.policy.minimumEvidence ? 'building' : (accuracy ?? 0) < 65 ? 'weak' : (accuracy ?? 0) >= 80 && secure >= Math.ceil(known.length / 2) ? 'strong' : 'developing';
  return {
    id, label, subjectId, subjectLabel, total: rows.length, scorable: scorable.length,
    studied: rows.filter(q => !!state.questions[q.id]?.studiedAt).length,
    scorableStudied: scorable.filter(q => !!state.questions[q.id]?.studiedAt).length,
    attempted, evidence: known.length, accuracy, status,
    due: scorable.filter(q => (state.questions[q.id]?.dueAt ?? Infinity) <= now).length,
    repeatMistakes: known.filter(p => p.wrong >= 2 && !p.lastCorrect).length,
    trend: comparable.length < 3 ? 'unknown' : change >= 0.2 ? 'improving' : change <= -0.2 ? 'declining' : 'steady',
    questionIds: [...scorable].sort((a, b) => {
      const pa = state.questions[a.id], pb = state.questions[b.id];
      const rank = (p: QuestionLearning | undefined) => (p?.dueAt ?? Infinity) <= now ? 0 : p?.lastCorrect === false ? 1 : !p?.attempts ? 2 : 3;
      return rank(pa) - rank(pb) || (pa?.dueAt ?? Infinity) - (pb?.dueAt ?? Infinity);
    }).map(q => q.id),
    // Read sessions are bounded. Put unstudied items first so completing one
    // batch exposes the next, retaining printed order within each group.
    readQuestionIds: [
      ...rows.filter(q => !state.questions[q.id]?.studiedAt),
      ...rows.filter(q => !!state.questions[q.id]?.studiedAt),
    ].map(q => q.id),
  };
}
export function buildLearningDashboard(questions: BankQuestion[], state: LearningState, now = Date.now()): LearningDashboardModel {
  // Stable IDs are deduplicated before coverage and queue creation.
  const unique = [...new Map(questions.map(q => [q.id, q])).values()];
  const scorable = unique.filter(isLearningScorable);
  const subjects = new Map<string, BankQuestion[]>(), topics = new Map<string, { label: string; subject: string; rows: BankQuestion[] }>();
  for (const q of unique) {
    const subject = sectionOf(q), topic = learningTopicOf(q);
    const subjectGroup = subjects.get(subject) ?? [];
    subjectGroup.push(q); subjects.set(subject, subjectGroup);
    const group = topics.get(topic.id) ?? { label: topic.label, subject, rows: [] };
    group.rows.push(q); topics.set(topic.id, group);
  }
  const subjectRows = [...subjects].map(([id, rows]) => areaFor(id, SECTION_LABEL[id as keyof typeof SECTION_LABEL], id, SECTION_LABEL[id as keyof typeof SECTION_LABEL], rows, state, now));
  const topicRows = [...topics].map(([id, group]) => areaFor(id, group.label, group.subject, SECTION_LABEL[group.subject as keyof typeof SECTION_LABEL], group.rows, state, now));
  const priority = (id: string) => {
    const p = state.questions[id];
    return (p?.dueAt ?? Infinity) - Math.min(p?.wrong ?? 0, 5) * 60_000;
  };
  const due = scorable.filter(q => (state.questions[q.id]?.dueAt ?? Infinity) <= now).map(q => q.id).sort((a, b) => priority(a) - priority(b));
  const missed = scorable.filter(q => state.questions[q.id]?.lastCorrect === false).sort((a, b) => (state.questions[b.id]?.wrong ?? 0) - (state.questions[a.id]?.wrong ?? 0) || priority(a.id) - priority(b.id));
  const weakTopics = topicRows.filter(row => row.status === 'weak').sort((a, b) => (a.accuracy ?? 100) - (b.accuracy ?? 100));
  const weakSet = new Set(weakTopics.flatMap(row => row.questionIds));
  // Cooldown applies to automatic recommendations. Explicit mistake review may
  // still be opened early; doing so cannot advance a spaced review stage.
  const weak = scorable.filter(q => weakSet.has(q.id) && (!state.questions[q.id]?.attempts || (state.questions[q.id]?.dueAt ?? Infinity) <= now)).map(q => q.id);
  const fresh = scorable.filter(q => !state.questions[q.id]?.attempts).map(q => q.id);
  // Round-robin untouched questions across subjects to avoid a large first paper
  // consuming every mixed session before another subject appears.
  const freshBySubject = subjectRows.map(row => row.questionIds.filter(id => !state.questions[id]?.attempts));
  const newMixed: string[] = [];
  for (let i = 0; newMixed.length < fresh.length; i++) for (const group of freshBySubject) if (group[i]) newMixed.push(group[i]);
  const size = state.policy.sessionSize, newSlots = Math.round(size * state.policy.newItemFraction);
  const review = [...new Set([...due, ...weak])];
  const mixed = [...new Set([...review.slice(0, size - Math.min(newSlots, newMixed.length)), ...newMixed.slice(0, newSlots)])];
  for (const id of [...review, ...newMixed]) { if (mixed.length >= size) break; if (!mixed.includes(id)) mixed.push(id); }
  const progress = scorable.map(q => state.questions[q.id]).filter((p): p is QuestionLearning => !!p);
  const knownAttempts = progress.reduce((sum, p) => sum + p.correct + p.wrong, 0);
  const mistakes = missed.map(q => {
    const p = state.questions[q.id];
    const lastWrong = [...p.recent].reverse().find(event => !event.correct);
    return { questionId: q.id, question: q.question, subjectLabel: SECTION_LABEL[sectionOf(q)], topicLabel: learningTopicOf(q).label, wrongCount: p.wrong, attempts: p.attempts, lastCorrect: p.lastCorrect ?? false, lastAttemptAt: p.lastAttemptAt ?? 0, dueAt: p.dueAt, mistakeReason: lastWrong?.mistakeReason, confidence: lastWrong?.confidence };
  });
  const recommendations: LearningDashboardModel['recommendations'] = [];
  if (mixed.length) recommendations.push({ id: 'mixed', title: 'Your next short session', description: review.length ? 'Due recall and weaker topics, with a few questions not yet answered. Early repeats do not advance the review interval.' : 'Build a first sample across subjects. Accurate weak-area suggestions need several different questions.', questionIds: mixed });
  if (due.length) recommendations.push({ id: 'due', title: 'Review what is due', description: `${due.length} questions are ready for another recall. Begin with ${Math.min(size, due.length)}.`, questionIds: due.slice(0, size) });
  for (const topic of weakTopics.slice(0, 2)) {
    const ids = topic.questionIds.filter(id => !state.questions[id]?.attempts || (state.questions[id]?.dueAt ?? Infinity) <= now).slice(0, size);
    if (ids.length) recommendations.push({ id: `weak:${topic.id}`, title: `Strengthen ${topic.label}`, description: `${topic.accuracy}% recent accuracy across ${topic.evidence} different questions. Read the explanations, then try a short recall session.`, questionIds: ids });
  }
  if (!recommendations.length && fresh.length) recommendations.push({ id: 'new', title: 'Explore a new topic', description: 'Your scheduled reviews can wait. Add a small sample of questions not yet answered.', questionIds: newMixed.slice(0, size) });
  return {
    summary: { total: scorable.length, readableTotal: unique.length, studied: unique.filter(q => !!state.questions[q.id]?.studiedAt).length, scorableStudied: scorable.filter(q => !!state.questions[q.id]?.studiedAt).length, attempted: progress.filter(p => p.attempts > 0).length, attempts: progress.reduce((sum, p) => sum + p.attempts, 0), knownAttempts, legacyAttempts: progress.reduce((sum, p) => sum + p.legacyAttempts, 0), accuracy: knownAttempts ? Math.round(100 * progress.reduce((sum, p) => sum + p.correct, 0) / knownAttempts) : null, due: due.length, mistakes: missed.length, repeatMistakes: progress.filter(p => p.wrong >= 2 && !p.lastCorrect).length, secure: progress.filter(p => p.spacedSuccesses >= 3 && p.lastCorrect).length, unseen: fresh.length },
    subjects: subjectRows, topics: topicRows, mistakes, recommendations,
    queues: { due, mistakes: missed.map(q => q.id), weak, new: newMixed, mixed }, policy: state.policy,
  };
}
