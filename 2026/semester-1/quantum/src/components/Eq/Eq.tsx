import type { ReactNode } from 'react';
import * as s from './Eq.css';

// 디스플레이 수식 박스. KaTeX 대신, 강의자료의 수식을 유니코드(|ψ⟩, ⊗, √, α …)와
// 단순 텍스트로 옮겨 적어 화면 가운데에 크게 보여 준다. label 로 식 이름을 붙일 수 있다.
export function Eq({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className={s.box}>
      <div className={s.expr}>{children}</div>
      {label && <div className={s.label}>{label}</div>}
    </div>
  );
}
