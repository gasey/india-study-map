// ============================================
// REVISION MODULE — entry point
//
// Comprehensive UPSC/PSC revision module built from the
// user's Instagram study-note screenshots: guides, quizzes,
// flashcards (SM-2 SRS), timeline, mind map, PDF book.
//
// The heavy lifting lives in RevisionApp.jsx (plain JSX —
// the module predates the TS shell). tsc leaves it alone
// (allowJs + checkJs:false), Vite bundles it as usual.
// ============================================

// @ts-ignore — plain JSX module, no type declarations
import RevisionApp from './RevisionApp.jsx';

export default function RevisionPage() {
  return <RevisionApp />;
}
