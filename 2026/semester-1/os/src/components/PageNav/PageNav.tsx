import { Link } from 'react-router-dom';
import { adjacentChapters } from '../../content/manifest';
import * as s from './PageNav.css';

export function PageNav({ slug }: { slug: string }) {
  const { prev, next } = adjacentChapters(slug);
  return (
    <nav className={s.wrap}>
      {prev ? (
        <Link to={`/ch/${prev.slug}`} className={s.link}>
          <span className={s.hint}>← 이전</span>
          <span className={s.title}>
            {String(prev.number).padStart(2, '0')}. {prev.title}
          </span>
        </Link>
      ) : (
        <div className={s.spacer} />
      )}
      {next ? (
        <Link to={`/ch/${next.slug}`} className={`${s.link} ${s.linkRight}`}>
          <span className={s.hint}>다음 →</span>
          <span className={s.title}>
            {String(next.number).padStart(2, '0')}. {next.title}
          </span>
        </Link>
      ) : (
        <div className={s.spacer} />
      )}
    </nav>
  );
}
