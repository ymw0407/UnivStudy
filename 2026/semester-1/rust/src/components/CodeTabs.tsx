import { useState } from "react";
import { CodeBlock } from "./CodeBlock";
import * as s from "./CodeTabs.css";

export interface CodeTab {
  label: string;
  lang?: string;
  code: string;
}

interface CodeTabsProps {
  tabs: CodeTab[];
  caption?: string;
}

export function CodeTabs({ tabs, caption }: CodeTabsProps) {
  const [idx, setIdx] = useState(0);
  const active = tabs[idx];

  return (
    <div className={s.wrapper}>
      {caption && <div className={s.caption}>{caption}</div>}
      <div className={s.tabBar} role="tablist">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            role="tab"
            aria-selected={idx === i}
            className={`${s.tab} ${idx === i ? s.tabActive : ""}`}
            onClick={() => setIdx(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <CodeBlock lang={active.lang} flush>
        {active.code}
      </CodeBlock>
    </div>
  );
}
