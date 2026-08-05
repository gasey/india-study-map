import { useState, useEffect } from 'react';

interface FlaggedItem {
  question_id: string;
  stem: string;
  marked_answer: string;
  model_answer: string;
  reasoning: string;
  status: 'pending' | 'reviewed' | 'ambiguous' | 'corrected';
  your_decision: string | null;
  your_reasoning: string | null;
}

export function VerificationPanel() {
  const [flagged, setFlagged] = useState<FlaggedItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [reviewed, setReviewed] = useState(0);

  useEffect(() => {
    fetch('/mpsc_verification_tracker.json')
      .then(r => r.json())
      .then(d => {
        setFlagged(d.items);
        setReviewed(d.items.filter((i: FlaggedItem) => i.status !== 'pending').length);
      });
  }, []);

  if (!flagged.length) return <div>Loading...</div>;

  const item = flagged[current];
  const handleDecision = (decision: string, reason: string) => {
    const updated = [...flagged];
    updated[current] = {
      ...item,
      your_decision: decision,
      your_reasoning: reason,
      status: 'reviewed',
    };
    setFlagged(updated);
    setReviewed(reviewed + 1);
    if (current < flagged.length - 1) setCurrent(current + 1);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <h2>Verification: {reviewed}/{flagged.length} reviewed</h2>
      <div style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px' }}>
        <p><strong>Question:</strong> {item.stem}</p>
        <p><strong>Marked answer:</strong> {item.marked_answer} | <strong>Model says:</strong> {item.model_answer}</p>
        <p><strong>Reasoning:</strong> {item.reasoning}</p>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => handleDecision(item.marked_answer, 'Marked answer is correct')}>
          ✓ Keep {item.marked_answer}
        </button>
        <button onClick={() => handleDecision(item.model_answer, 'Model answer is correct')}>
          ✓ Use {item.model_answer}
        </button>
        <button onClick={() => handleDecision('?', 'Ambiguous - needs manual review')}>
          ? Ambiguous
        </button>
      </div>
    </div>
  );
}
