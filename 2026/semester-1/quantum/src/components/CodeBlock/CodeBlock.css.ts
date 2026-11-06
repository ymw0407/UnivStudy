import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const wrapper = style({
  position: 'relative',
  margin: `${vars.space[5]} 0`,
  borderRadius: vars.radius.md,
  overflow: 'hidden',
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
});

export const filenameBar = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  padding: `${vars.space[2]} ${vars.space[5]}`,
  fontSize: vars.fontSize.xs,
  fontFamily: vars.font.mono,
  color: vars.color.textMuted,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const filenameDots = style({
  display: 'inline-flex',
  gap: '4px',
});

export const dot = style({
  width: '9px',
  height: '9px',
  borderRadius: '50%',
  background: vars.color.border,
});

export const langBadge = style({
  position: 'absolute',
  top: vars.space[2],
  right: vars.space[3],
  padding: `2px ${vars.space[2]}`,
  fontSize: '0.68rem',
  fontFamily: vars.font.mono,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: vars.color.textFaint,
  background: vars.color.surfaceAlt,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  zIndex: 1,
  userSelect: 'none',
  pointerEvents: 'none',
});

export const codeArea = style({
  margin: 0,
  padding: `${vars.space[5]} ${vars.space[6]}`,
  overflow: 'auto',
  fontSize: '0.9rem',
  lineHeight: 1.55,
  fontFamily: vars.font.mono,
  background: 'transparent',
  color: vars.color.text,
});

export const plain = style({
  whiteSpace: 'pre',
  fontFamily: vars.font.mono,
  margin: 0,
});

globalStyle(`${wrapper} .shiki`, {
  background: 'transparent !important',
  padding: '0 !important',
  margin: 0,
  fontSize: 'inherit',
  lineHeight: 'inherit',
  fontFamily: vars.font.mono,
  whiteSpace: 'normal',
});
globalStyle(`${wrapper} .shiki code`, {
  display: 'block',
  background: 'transparent',
  padding: 0,
  fontSize: 'inherit',
  lineHeight: 'inherit',
  fontFamily: vars.font.mono,
  whiteSpace: 'normal',
});
globalStyle(`${wrapper} .shiki .line`, {
  display: 'block',
  whiteSpace: 'pre',
  minHeight: '1.55em',
  fontFamily: vars.font.mono,
});
globalStyle(`${wrapper} .shiki .line span`, {
  fontFamily: vars.font.mono,
  whiteSpace: 'pre',
});

globalStyle('[data-theme="dark"] .shiki, [data-theme="dark"] .shiki span', {
  color: 'var(--shiki-dark) !important',
  fontStyle: 'var(--shiki-dark-font-style) !important',
  fontWeight: 'var(--shiki-dark-font-weight) !important',
  textDecoration: 'var(--shiki-dark-text-decoration) !important',
});
