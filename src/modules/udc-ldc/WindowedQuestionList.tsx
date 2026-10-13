import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { BankQuestion } from '@/data/banks/types';

const BLOCK_SIZE = 10;

/** Keep measured placeholders when a block leaves the scroll viewport. */
function QuestionBlock({ questions, offset, renderQuestion, eager }: {
  questions: BankQuestion[]; offset: number;
  renderQuestion: (question: BankQuestion, index: number) => ReactNode;
  eager: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const height = useRef(questions.length * 430);
  const [active, setActive] = useState(eager);
  useEffect(() => {
    const element = ref.current;
    if (!element || !('IntersectionObserver' in window)) {
      setActive(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      // Keep a keyboard-focused option or review form mounted.
      if (!entry.isIntersecting && element.contains(document.activeElement)) return;
      setActive(entry.isIntersecting);
    }, { root: element.closest('.scroll-panel'), rootMargin: '1600px 0px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!active || !element) return;
    const measure = () => { height.current = element.getBoundingClientRect().height; };
    measure();
    if (!('ResizeObserver' in window)) return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [active]);
  return <div ref={ref} style={active ? undefined : { height: height.current }}>
    {active && questions.map((question, index) => renderQuestion(question, offset + index))}
  </div>;
}

export function WindowedQuestionList({ questions, renderQuestion }: {
  questions: BankQuestion[];
  renderQuestion: (question: BankQuestion, index: number) => ReactNode;
}) {
  // Small paper lists retain ordinary browser search and print behavior.
  if (questions.length <= 300) return <>{questions.map(renderQuestion)}</>;
  return <div className="udc-windowed-questions">
    {Array.from({ length: Math.ceil(questions.length / BLOCK_SIZE) }, (_, block) => {
      const offset = block * BLOCK_SIZE;
      return <QuestionBlock key={questions[offset].id} questions={questions.slice(offset, offset + BLOCK_SIZE)}
        offset={offset} renderQuestion={renderQuestion} eager={block === 0} />;
    })}
  </div>;
}
