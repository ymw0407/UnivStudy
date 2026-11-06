import type { ReactNode } from "react";
import * as s from "./Module.css";

interface ModuleProps {
  badge?: string;
  title: string;
  children: ReactNode;
}

export function Module({ badge: b, title, children }: ModuleProps) {
  return (
    <section className={s.module}>
      {b ? (
        <div className={s.moduleHeader}>
          <span className={s.badge}>{b}</span>
          <h2 className={s.moduleTitle}>{title}</h2>
        </div>
      ) : (
        <h2 className={s.plainTitle}>{title}</h2>
      )}
      {children}
    </section>
  );
}
