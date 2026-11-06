import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const root = style({
  padding: `${vars.space[5]} ${vars.space[3]} ${vars.space[10]}`,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[5],
});

export const partGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

export const partTitle = style({
  fontSize: '0.7rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: vars.color.textFaint,
  padding: `${vars.space[2]} ${vars.space[3]}`,
  marginBottom: vars.space[1],
});

export const chapterLink = style({
  position: 'relative',
  display: 'flex',
  gap: vars.space[3],
  alignItems: 'baseline',
  padding: `${vars.space[2]} ${vars.space[3]}`,
  borderRadius: vars.radius.md,
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
  lineHeight: vars.lineHeight.snug,
  borderBottom: 'none',
  transition: 'background 0.1s ease, color 0.1s ease',
  ':hover': {
    background: vars.color.surface,
    color: vars.color.heading,
    textDecoration: 'none',
  },
});

export const chapterLinkActive = style({
  background: vars.color.accentSoft,
  color: vars.color.accent,
  fontWeight: 600,
  selectors: {
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: '6px',
      bottom: '6px',
      width: '3px',
      borderRadius: '2px',
      background: vars.color.accent,
    },
  },
});

export const chapterNumber = style({
  fontFamily: vars.font.mono,
  fontSize: '0.72rem',
  color: vars.color.textFaint,
  flexShrink: 0,
  minWidth: '22px',
});

export const chapterTitle = style({
  flex: 1,
});

export const evoSection = style({
  marginTop: vars.space[4],
  paddingTop: vars.space[4],
  borderTop: `1px solid ${vars.color.border}`,
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

export const evoLink = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  padding: `${vars.space[2]} ${vars.space[3]}`,
  borderRadius: vars.radius.md,
  fontSize: vars.fontSize.sm,
  color: vars.color.accent,
  fontWeight: 600,
  borderBottom: 'none',
  ':hover': {
    background: vars.color.accentSoft,
    textDecoration: 'none',
  },
});
