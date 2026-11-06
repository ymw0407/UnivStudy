import { NavLink } from 'react-router-dom';
import { parts, chaptersByPart } from '../../content/manifest';
import * as s from './Sidebar.css';

export function Sidebar() {
  return (
    <nav className={s.root}>
      {parts.map((part) => (
        <div key={part.id} className={s.partGroup}>
          <div className={s.partTitle}>{part.title}</div>
          {chaptersByPart(part.id).map((ch) => (
            <NavLink
              key={ch.slug}
              to={`/ch/${ch.slug}`}
              className={({ isActive }) => `${s.chapterLink} ${isActive ? s.chapterLinkActive : ''}`}
            >
              <span className={s.chapterNumber}>{String(ch.number).padStart(2, '0')}</span>
              <span className={s.chapterTitle}>{ch.title}</span>
            </NavLink>
          ))}
        </div>
      ))}
      <div className={s.evoSection}>
        <NavLink
          to="/evolution/scheduler"
          className={({ isActive }) =>
            `${s.evoLink} ${isActive ? s.chapterLinkActive : ''}`
          }
        >
          → Scheduler 변천사
        </NavLink>
        <NavLink
          to="/evolution/memory"
          className={({ isActive }) =>
            `${s.evoLink} ${isActive ? s.chapterLinkActive : ''}`
          }
        >
          → Memory 변천사
        </NavLink>
      </div>
    </nav>
  );
}
