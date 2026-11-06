import type { ReactNode } from "react";
import * as s from "./ErrorExplain.css";

interface ErrorExplainProps {
  header: string;
  code: string;
  children: ReactNode;
}

export function ErrorExplain({ header, code, children }: ErrorExplainProps) {
  return (
    <div className={s.container}>
      <div className={s.errHead}>{header}</div>
      <pre className={s.errPre}>
        <code>{code}</code>
      </pre>
      <div className={s.errExplain}>{children}</div>
    </div>
  );
}
