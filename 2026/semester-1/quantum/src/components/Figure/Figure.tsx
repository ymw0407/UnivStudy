import { useState, type ReactNode } from 'react';
import * as s from './Figure.css';

function resolveSrc(src: string | undefined): string | undefined {
  if (!src) return undefined;
  if (/^(https?:)?\/\//.test(src) || src.startsWith('data:')) return src;
  const base = import.meta.env.BASE_URL || '/';
  const trimmed = src.replace(/^\//, '');
  return base.endsWith('/') ? base + trimmed : base + '/' + trimmed;
}

export function Figure({
  src,
  alt,
  caption,
  source,
  children,
}: {
  src?: string;
  alt?: string;
  caption?: string;
  source?: string;
  children?: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  const resolved = resolveSrc(src);

  return (
    <figure className={s.figure}>
      {children ? (
        <div className={s.svgBox}>{children}</div>
      ) : resolved && !failed ? (
        <img
          className={s.img}
          src={resolved}
          alt={alt ?? caption ?? ''}
          onError={() => setFailed(true)}
          loading="lazy"
        />
      ) : (
        <div className={s.placeholder}>
          {caption ?? alt ?? '그림이 여기에 들어갑니다'} (강의자료 그림 대기 중)
        </div>
      )}
      {caption && <figcaption className={s.caption}>{caption}</figcaption>}
      {source && <span className={s.source}>출처: {source}</span>}
    </figure>
  );
}
