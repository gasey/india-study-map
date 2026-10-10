import { QuestionText } from './QuestionText';

/** Keep shared source directions and reading context with the question. */
export function QuestionContext({ direction, passage, plain, collapsed = false }: {
  direction?: string; passage?: string; plain?: boolean; collapsed?: boolean;
}) {
  return <>
    {direction && <div className="udc-question-direction"><QuestionText text={direction} plain={plain} /></div>}
    {passage && <details className="udc-question-passage" open={!collapsed}>
      <summary>Read passage</summary>
      <div style={{ marginTop: 8, lineHeight: 1.65, overflowWrap: 'anywhere' }}>
        <QuestionText text={passage} plain={plain} />
      </div>
    </details>}
  </>;
}
