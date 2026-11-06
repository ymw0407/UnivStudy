import type { ReactNode } from 'react';
import * as s from './ProblemSolution.css';

export function ProblemSolution({
  problem,
  solution,
  limitation,
}: {
  problem: ReactNode;
  solution: ReactNode;
  limitation?: ReactNode;
}) {
  return (
    <div className={s.grid}>
      <div className={`${s.cell} ${s.cellProblem}`}>
        <div className={`${s.label} ${s.labelProblem}`}>문제</div>
        <div className={s.body}>{problem}</div>
      </div>
      <div className={`${s.cell} ${s.cellSolution}`}>
        <div className={`${s.label} ${s.labelSolution}`}>해결</div>
        <div className={s.body}>{solution}</div>
      </div>
      {limitation && (
        <div className={`${s.cell} ${s.cellLimitation}`}>
          <div className={`${s.label} ${s.labelLimitation}`}>남은 한계</div>
          <div className={s.body}>{limitation}</div>
        </div>
      )}
    </div>
  );
}
