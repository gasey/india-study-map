// Shared shape for the small, locally-authored MCQ lists used by the
// Python, Postgres, and Nihongo lesson modules — deliberately NOT the
// Question Bank engine (no scoring/timer/palette), just click-to-reveal
// cards. Extracted here once three modules needed the identical shape.
export interface QuizQuestion {
  q: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}
