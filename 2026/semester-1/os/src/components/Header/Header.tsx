import { NavLink, Link } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import * as s from './Header.css';

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className={s.header}>
      <div className={s.left}>
        <button
          type="button"
          className={s.menuButton}
          onClick={onMenuClick}
          aria-label="메뉴 열기"
        >
          <span className={s.menuIcon} aria-hidden>
            ☰
          </span>
        </button>
        <Link to="/" className={s.brand}>
          <span className={s.brandBadge}>OS</span>
          <span className={s.brandText}>운영체제 정리</span>
        </Link>
      </div>
      <nav className={s.nav}>
        <NavLink
          to="/"
          end
          className={({ isActive }) => `${s.navLink} ${s.navLinkDesktop} ${isActive ? s.navLinkActive : ''}`}
        >
          Home
        </NavLink>
        <NavLink
          to="/evolution/scheduler"
          className={({ isActive }) => `${s.navLink} ${s.navLinkDesktop} ${isActive ? s.navLinkActive : ''}`}
        >
          Scheduler 변천사
        </NavLink>
        <NavLink
          to="/evolution/memory"
          className={({ isActive }) => `${s.navLink} ${s.navLinkDesktop} ${isActive ? s.navLinkActive : ''}`}
        >
          Memory 변천사
        </NavLink>
        <NavLink
          to="/quiz"
          className={({ isActive }) => `${s.navLink} ${s.navLinkDesktop} ${isActive ? s.navLinkActive : ''}`}
        >
          문제 풀기
        </NavLink>
        <ThemeToggle />
      </nav>
    </header>
  );
}
