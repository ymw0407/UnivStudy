import type { ReactNode } from 'react';
import * as s from './Callout.css';

type Kind = 'note' | 'warn' | 'tip' | 'summary';

const LABELS: Record<Kind, string> = {
  note: '보충 설명',
  warn: '주의',
  tip: '팁',
  summary: '정리',
};

const ICONS: Record<Kind, string> = {
  note: 'ⓘ',
  warn: '⚠',
  tip: '✦',
  summary: '≡',
};

export function Callout({
  kind = 'note',
  title,
  children,
}: {
  kind?: Kind;
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside className={s.callout({ kind })}>
      <div className={s.icon} aria-hidden>
        {ICONS[kind]}
      </div>
      <div className={s.label}>{title ?? LABELS[kind]}</div>
      <div className={s.body}>{children}</div>
    </aside>
  );
}
