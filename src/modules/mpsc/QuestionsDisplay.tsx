import { useState, useEffect } from 'react';

interface Question {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  paperId: string;
  _diagramPath?: string;
}

export function QuestionsDisplay() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [jumpTo, setJumpTo] = useState('');

  useEffect(() => {
    fetch('/mpsc_bank_converted.json')
      .then(r => r.json())
      .then(d => {
        setQuestions(d.questions);
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
  const answerLetter = String.fromCharCode(65 + q.answerIndex);
  const hasDiagram = Boolean(q._diagramPath);
  const diagramPath = q._diagramPath
    ? '/mpsc-diagrams/' + q._diagramPath.split('/').pop()
    : undefined;

  const handleJump = () => {
    const num = parseInt(jumpTo);
    if (num > 0 && num <= questions.length) {
      setCurrent(num - 1);
      setJumpTo('');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3>Question {current + 1} / {questions.length}</h3>
        <div style={{ display: 'flex', gap: '5px' }}>
          <input
            type="number"
            min="1"
            max={questions.length}
            value={jumpTo}
            onChange={(e) => setJumpTo(e.target.value)}
            placeholder="Jump to..."
            style={{ width: '100px', padding: '5px' }}
          />
          <button onClick={handleJump}>Jump</button>
        </div>
      </div>

      <div style={{ border: '1px solid #eee', padding: '15px', marginBottom: '15px', minHeight: '100px' }}>
        <p><strong>{q.question}</strong></p>

        {hasDiagram && (
          <div style={{ margin: '15px 0', textAlign: 'center' }}>
            <img
              src={diagramPath}
              alt="Question diagram"
              style={{ maxWidth: '100%', maxHeight: '300px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>Diagram image included</p>
          </div>
        )}

        <div style={{ marginTop: '15px' }}>
          {q.options.map((opt, i) => (
            <div key={i} style={{ padding: '8px', margin: '5px 0', background: i === q.answerIndex ? '#e8f5e9' : '#f5f5f5' }}>
              <input type="radio" name="answer" value={i} /> {String.fromCharCode(65 + i)}. {opt}
            </div>
          ))}
        </div>
        <p style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
          Paper: {q.paperId} | Answer: {answerLetter} {hasDiagram && '| Has diagram'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}>← Prev</button>
        <button onClick={() => setCurrent(Math.min(questions.length - 1, current + 1))} disabled={current === questions.length - 1}>Next →</button>
      </div>
    </div>
  );
}
