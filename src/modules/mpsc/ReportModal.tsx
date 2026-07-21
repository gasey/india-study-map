import { useState } from 'react';
import type { BankQuestion, ExamPaper } from '@/data/banks/types';

const REPORT_API_URL = 'http://134.209.154.122/mpsc-api/api/mpsc/report';

interface ReportModalProps {
  question: BankQuestion;
  paper?: ExamPaper;
  onClose: () => void;
}

export function ReportModal({ question, paper, onClose }: ReportModalProps) {
  const [issueType, setIssueType] = useState<string>('incorrect-answer');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // e.g. "Direct_NG · LDC · Mizoram Public Service Commission Competitive Examination"
  const examLabel = paper
    ? [paper.examType, paper.post, paper.examName].filter(Boolean).join(' · ')
    : undefined;

  const handleSubmit = async () => {
    const report = {
      questionId: question.id,
      issueType,
      notes,
      questionText: question.question,
      examName: paper?.examName ?? null,
      examType: paper?.examType ?? null,
      post: paper?.post ?? null,
    };

    try {
      const response = await fetch(REPORT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(onClose, 2000);
      }
    } catch (e) {
      console.error('Report failed:', e);
      alert('Failed to submit report. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-900 rounded-lg p-6 max-w-sm">
          <div className="text-center">
            <div className="text-3xl mb-2">✓</div>
            <p className="font-medium">Report submitted</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Thank you for helping improve the question bank.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 border-b dark:border-slate-700">
          <h2 className="font-semibold">Report Issue</h2>
          <button onClick={onClose} className="text-xl leading-none opacity-50 hover:opacity-100">
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Question Preview */}
          <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded text-sm">
            {examLabel && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">{examLabel}</p>
            )}
            <p className="font-medium text-xs text-gray-600 dark:text-gray-400 mb-1">Question:</p>
            <p className="line-clamp-3">{question.question}</p>
            {question.options && (
              <div className="mt-2 space-y-1 text-xs">
                {question.options.map((opt, i) => (
                  <div key={i} className={i === question.answerIndex ? 'font-semibold' : ''}>
                    {String.fromCharCode(65 + i)}. {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Issue Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Issue Type</label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="w-full px-3 py-2 border rounded dark:bg-slate-800 dark:border-slate-600"
            >
              <option value="incorrect-answer">Incorrect Answer Key</option>
              <option value="typo">Typo or Grammar</option>
              <option value="wrong-subject">Wrong Subject Category</option>
              <option value="duplicate">Duplicate Question</option>
              <option value="unclear">Unclear Question</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Additional Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Explain the issue in detail..."
              className="w-full px-3 py-2 border rounded dark:bg-slate-800 dark:border-slate-600 text-sm resize-none"
              rows={4}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 p-4 border-t dark:border-slate-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm rounded border dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}
