import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const header = style({
  height: vars.size.header,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `0 ${vars.space[5]}`,
  background: vars.color.surface,
  borderBottom: `1px solid ${vars.color.border}`,
  boxShadow: vars.shadow.sm,
  '@media': {
    '(max-width: 600px)': {
      padding: `0 ${vars.space[3]}`,
    },
  },
});

export const left = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  minWidth: 0,
});

export const menuButton = style({
  display: 'none',
  width: '36px',
  height: '36px',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  background: vars.color.surface,
  color: vars.color.text,
  cursor: 'pointer',
  '@media': {
    '(max-width: 900px)': {
      display: 'inline-flex',
    },
  },
  ':hover': {
    background: vars.color.surfaceAlt,
    borderColor: vars.color.borderStrong,
  },
});

export const menuIcon = style({
  fontSize: '1.125rem',
  lineHeight: 1,
});

export const brand = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  color: vars.color.heading,
  fontWeight: 700,
  fontSize: vars.fontSize.md,
  minWidth: 0,
  ':hover': {
    textDecoration: 'none',
  },
});

export const brandBadge = style({
  width: '28px',
  height: '28px',
  borderRadius: vars.radius.sm,
  background: vars.color.accent,
  color: 'white',
  display: 'grid',
  placeItems: 'center',
  fontSize: vars.fontSize.xs,
  fontWeight: 700,
  flexShrink: 0,
});

export const brandText = style({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  '@media': {
    '(max-width: 380px)': {
      display: 'none',
    },
  },
});

export const nav = style({
  display: 'flex',
  gap: vars.space[2],
  alignItems: 'center',
  flexShrink: 0,
});

export const navLink = style({
  padding: `${vars.space[2]} ${vars.space[3]}`,
  borderRadius: vars.radius.md,
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
  fontWeight: 500,
  ':hover': {
    background: vars.color.surfaceAlt,
    color: vars.color.heading,
    textDecoration: 'none',
  },
});

// 데스크탑에서만 표시 — 모바일은 햄버거 메뉴 + 사이드바 드로어로 이동
export const navLinkDesktop = style({
  '@media': {
    '(max-width: 900px)': {
      display: 'none',
    },
  },
});

export const navLinkActive = style({
  background: vars.color.accentSoft,
  color: vars.color.accent,
});
