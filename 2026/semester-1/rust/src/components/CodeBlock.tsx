import "./prism-setup";
import "prismjs/components/prism-java";

import { Highlight, themes } from "prism-react-renderer";
import * as s from "./CodeBlock.css";

interface CodeBlockProps {
  lang?: string;
  children: string;
  flush?: boolean;
}

export function CodeBlock({ lang = "rust", children, flush = false }: CodeBlockProps) {
  const code = children.replace(/^\n/, "").replace(/\n$/, "");

  return (
    <Highlight theme={themes.vsDark} code={code} language={lang}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <pre className={`${s.pre} ${flush ? s.preFlush : ""}`}>
          <code className={s.code}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} className={s.line}>
                <span className={s.lineNo}>{i + 1}</span>
                <span className={s.lineContent}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  );
}
