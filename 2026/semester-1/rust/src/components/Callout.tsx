import type { ReactNode } from "react";
import * as s from "./Callout.css";

interface CalloutProps {
  title: string;
  children: ReactNode;
}

export function Callout({ title, children }: CalloutProps) {
  return (
    <div className={s.container}>
      <strong className={s.title}>{title}</strong>
      {children}
    </div>
  );
}
