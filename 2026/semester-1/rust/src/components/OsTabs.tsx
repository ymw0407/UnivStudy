import { useState, type ReactNode } from "react";
import * as s from "./OsTabs.css";

export interface OsTab {
  id: string;
  label: string;
  content: ReactNode;
}

interface OsTabsProps {
  tabs: OsTab[];
}

export function OsTabs({ tabs }: OsTabsProps) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");

  return (
    <div className={s.container}>
      <div className={s.labels}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${s.label} ${active === tab.id ? s.labelActive : ""}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={s.content}>
        {tabs.find((t) => t.id === active)?.content}
      </div>
    </div>
  );
}
