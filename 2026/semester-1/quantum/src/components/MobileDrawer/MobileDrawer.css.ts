import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});
const slideIn = keyframes({
  from: { transform: 'translateX(-100%)' },
  to: { transform: 'translateX(0)' },
});

export const backdrop = style({
  position: 'fixed',
  inset: 0,
  zIndex: 100,
  background: 'rgba(0, 0, 0, 0.4)',
  animation: `${fadeIn} 0.15s ease`,
});

export const panel = style({
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  width: 'min(86vw, 320px)',
  zIndex: 101,
  background: vars.color.surface,
  borderRight: `1px solid ${vars.color.border}`,
  boxShadow: vars.shadow.lg,
  overflowY: 'auto',
  animation: `${slideIn} 0.2s ease`,
  display: 'flex',
  flexDirection: 'column',
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${vars.space[3]} ${vars.space[4]}`,
  borderBottom: `1px solid ${vars.color.border}`,
  flexShrink: 0,
});

export const title = style({
  fontSize: vars.fontSize.sm,
  fontWeight: 700,
  color: vars.color.heading,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
});

export const closeButton = style({
  width: '32px',
  height: '32px',
  border: 'none',
  borderRadius: vars.radius.sm,
  background: 'transparent',
  color: vars.color.textMuted,
  cursor: 'pointer',
  fontSize: '1.25rem',
  lineHeight: 1,
  ':hover': {
    background: vars.color.surfaceAlt,
    color: vars.color.heading,
  },
});

export const body = style({
  flex: 1,
  overflowY: 'auto',
});
