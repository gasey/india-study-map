import type { MindsetCheckIn } from './store';

// ============================================
// Curated calm messages for the daily "Return to Learning" card.
//
// Ground rule (see /study-mindset and DEVLOG): this must never read as
// motivational hype or productivity guilt. No "hustle", "grind", "no
// excuses", no shame, no streak pressure. The tone is closer to a friend
// pointing out a pattern than a coach cheering you on.
// ============================================

export const MINDSET_MESSAGES: string[] = [
  "You are allowed to be confused.\nYou are not required to solve everything immediately.",
  "Don't prepare yourself into certainty.\nTry the question.",
  "Getting it wrong is not evidence that you are slow.\nIt is evidence that you found something to learn.",
  "AI can explain the answer.\nBut first give your own brain a chance.",
  "Stay with the discomfort for another minute.",
  "You don't need perfect understanding before attempting retrieval.",
  "Confusion is a signal, not an identity.",
  "Your goal today is not to feel smart.\nYour goal is to learn.",
  "You can be uncertain and still continue.",
  "Don't turn one difficult question into a judgment about yourself.",
  "You don't have to know yet.",
  "The wobble isn't proof you can't ride.\nIt's information.",
  "Notice the urge to check the answer.\nThen wait ten more seconds.",
  "A wrong guess you thought about is worth more than a right answer you didn't.",
  "You're not behind. You're just at the part that's supposed to feel hard.",
  "Reread later. Try first.",
  "Nobody's brain arrives at the answer instantly. Yours doesn't have to either.",
  "This feeling has a name: not-knowing-yet. It passes.",
  "You don't need the perfect method today. You need one honest attempt.",
  "Being stuck is not the same as being stupid.",
  "Let the question sit in your mind before you go looking for its answer.",
  "One confusing question doesn't undo everything you already know.",
  "You can feel behind and still be doing this right.",
  "The discomfort you're avoiding is where the learning actually happens.",
  "You are not required to finish this feeling quickly.",
  "Try answering before you try understanding.",
  "It's fine if your first guess is wrong. That's what a guess is for.",
  "You don't need to protect an image of being someone who never struggles.",
  "Today's job isn't certainty. It's one honest attempt.",
  "Slow down before you skip ahead to relief.",
  "Confusion means you found the edge of what you know — that's useful, not shameful.",
  "You're allowed to not have this figured out yet.",
  "Struggling with a question and being bad at a subject are two different things.",
];

/** Check-in-adapted lines — shown once a mood is picked, instead of a
 *  rotating general message. Kept short and specific to the state. */
const CHECK_IN_MESSAGES: Record<MindsetCheckIn, string> = {
  avoiding: "You don't need to feel ready.\nOpen one question and try.",
  confused: "Good. You've found the edge of your knowledge.\nStay here for two minutes.",
  scattered: "Don't solve the whole day.\nSolve the next question.",
  calm: "Good place to start from.\nPick one question and see where it takes you.",
};

/** Returns the message to show today — check-in-specific if a mood was
 *  picked today, otherwise the next message in rotation (wraps around). */
export function messageFor(checkIn: MindsetCheckIn | null, lastShownIdx: number): string {
  if (checkIn) return CHECK_IN_MESSAGES[checkIn];
  const idx = ((lastShownIdx + 1) % MINDSET_MESSAGES.length + MINDSET_MESSAGES.length) % MINDSET_MESSAGES.length;
  return MINDSET_MESSAGES[idx];
}
