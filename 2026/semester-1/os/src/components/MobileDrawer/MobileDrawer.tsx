import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import * as s from './MobileDrawer.css';

export function MobileDrawer({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <>
      <div className={s.backdrop} onClick={onClose} aria-hidden />
      <aside className={s.panel} role="dialog" aria-modal="true" aria-label="내비게이션">
        <div className={s.header}>
          <span className={s.title}>목차</span>
          <button
            type="button"
            className={s.closeButton}
            onClick={onClose}
            aria-label="메뉴 닫기"
          >
            ×
          </button>
        </div>
        <div className={s.body}>{children}</div>
      </aside>
    </>,
    document.body,
  );
}
