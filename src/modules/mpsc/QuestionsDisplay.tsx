import { useState, useEffect } from 'react';

interface Question {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  paperId: string;
}

export function QuestionsDisplay() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/mpsc_bank_converted.json')
      .then(r => r.json())
      .then(d => {
        setQuestions(d.questions.slice(0, 100)); // First 100 for demo
        setLoading(false);
      })
      .catch(e => {
        console.error('Failed to load questions:', e);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading questions...</div>;
  if (!questions.length) return <div>No questions found</div>;

  const q = questions[current];
  const answerLetter = String.fromCharCode(65 + q.answerIndex); // A, B, C, D

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <h3>Question {current + 1} / {questions.length}</h3>
      <div style={{ border: '1px solid #eee', padding: '15px', marginBottom: '15px', minHeight: '100px' }}>
        <p><strong>{q.question}</strong></p>
        <div style={{ marginTop: '15px' }}>
          {q.options.map((opt, i) => (
            <div key={i} style={{ padding: '8px', margin: '5px 0', background: i === q.answerIndex ? '#e8f5e9' : '#f5f5f5' }}>
              <input type="radio" name="answer" value={i} /> {String.fromCharCode(65 + i)}. {opt}
            </div>
          ))}
        </div>
        <p style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
          Paper: {q.paperId} | Answer: {answerLetter}
        </p>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}>← Prev</button>
        <button onClick={() => setCurrent(Math.min(questions.length - 1, current + 1))} disabled={current === questions.length - 1}>Next →</button>
      </div>
    </div>
  );
}
