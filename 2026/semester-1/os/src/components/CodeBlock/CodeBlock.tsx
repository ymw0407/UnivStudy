import { useEffect, useState, type ReactNode } from 'react';
import * as s from './CodeBlock.css';

type HighlighterLike = {
  codeToHtml: (
    code: string,
    opts: {
      lang: string;
      themes: { light: string; dark: string };
      defaultColor?: 'light' | 'dark' | false;
    },
  ) => string;
};

let highlighterPromise: Promise<HighlighterLike> | null = null;

const THEMES = { light: 'github-light', dark: 'github-dark-dimmed' } as const;

async function getHighlighter(): Promise<HighlighterLike> {
  if (!highlighterPromise) {
    highlighterPromise = import('shiki').then((m) =>
      m.createHighlighter({
        themes: [THEMES.light, THEMES.dark],
        langs: ['c', 'bash', 'typescript', 'javascript', 'python', 'plaintext'],
      }),
    );
  }
  return highlighterPromise;
}

function extractText(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (children && typeof children === 'object' && 'props' in children) {
    const props = (children as { props: { children?: ReactNode } }).props;
    return extractText(props.children);
  }
  return '';
}

export function CodeBlock({
  language = 'plaintext',
  filename,
  children,
}: {
  language?: string;
  filename?: string;
  children?: ReactNode;
}) {
  // trailing newline 제거 — MDX 가 code fence 마지막에 자동으로 \n 을 넣음
  const raw = extractText(children).replace(/\n+$/, '');
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supported = new Set(['c', 'bash', 'typescript', 'javascript', 'python', 'plaintext']);
    const lang = supported.has(language) ? language : 'plaintext';
    getHighlighter().then((hl) => {
      if (cancelled) return;
      try {
        setHtml(
          hl.codeToHtml(raw, {
            lang,
            themes: THEMES,
          }),
        );
      } catch {
        setHtml(null);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [raw, language]);

  const showLangBadge = language && language !== 'plaintext';

  return (
    <div className={s.wrapper}>
      {filename && (
        <div className={s.filenameBar}>
          <span className={s.filenameDots} aria-hidden>
            <span className={s.dot} />
            <span className={s.dot} />
            <span className={s.dot} />
          </span>
          <span>{filename}</span>
        </div>
      )}
      {showLangBadge && <span className={s.langBadge}>{language}</span>}
      {html ? (
        <div className={s.codeArea} dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre className={`${s.codeArea} ${s.plain}`}>
          <code>{raw}</code>
        </pre>
      )}
    </div>
  );
}

export function MdxPre({ children }: { children?: ReactNode }) {
  if (children && typeof children === 'object' && 'props' in children) {
    const props = (children as {
      props: { className?: string; children?: ReactNode };
    }).props;
    const match = /language-(\w+)/.exec(props.className ?? '');
    const language = match ? match[1] : 'plaintext';
    return <CodeBlock language={language}>{props.children}</CodeBlock>;
  }
  return <pre>{children}</pre>;
}
