import type { ReactNode } from "react";
import * as s from "./Checklist.css";

interface ChecklistProps {
  items: ReactNode[];
}

export function Checklist({ items }: ChecklistProps) {
  return (
    <ul className={s.list}>
      {items.map((item, i) => (
        <li key={i} className={s.item}>
          {item}
        </li>
      ))}
    </ul>
  );
}
