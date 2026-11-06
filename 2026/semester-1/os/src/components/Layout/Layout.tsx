import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../Header/Header';
import { Sidebar } from '../Sidebar/Sidebar';
import { MobileDrawer } from '../MobileDrawer/MobileDrawer';
import * as s from './Layout.css';

export function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname, location.hash]);

  return (
    <div className={s.shell}>
      <div className={s.headerArea}>
        <Header onMenuClick={() => setDrawerOpen(true)} />
      </div>
      <aside className={s.sidebarArea}>
        <Sidebar />
      </aside>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Sidebar />
      </MobileDrawer>
      <main className={s.mainArea}>
        <Outlet />
        <footer className={s.footer}>© OS Book — OSTEP 기반 학습 노트</footer>
      </main>
    </div>
  );
}
