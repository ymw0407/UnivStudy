import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const box = style({
  margin: `${vars.space[5]} 0`,
  padding: `${vars.space[5]} ${vars.space[5]}`,
  borderRadius: vars.radius.md,
  background: vars.color.eqBg,
  border: `1px solid ${vars.color.eqBorder}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space[2],
});

export const expr = style({
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.lg,
  color: vars.color.heading,
  lineHeight: vars.lineHeight.relaxed,
  textAlign: 'center',
  whiteSpace: 'pre-wrap',
  wordBreak: 'keep-all',
  '@media': {
    '(max-width: 600px)': { fontSize: vars.fontSize.base },
  },
});

export const label = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textFaint,
  fontWeight: 600,
  letterSpacing: '0.04em',
});
