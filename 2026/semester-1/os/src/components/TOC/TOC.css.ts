import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const toc = style({
  position: 'sticky',
  top: `calc(${vars.size.header} + ${vars.space[6]})`,
  maxHeight: `calc(100vh - ${vars.size.header} - ${vars.space[8]})`,
  overflowY: 'auto',
  padding: `${vars.space[3]} ${vars.space[4]}`,
  fontSize: vars.fontSize.sm,
  borderLeft: `1px solid ${vars.color.border}`,
  color: vars.color.textMuted,
});

export const title = style({
  fontSize: vars.fontSize.xs,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: vars.color.textFaint,
  marginBottom: vars.space[2],
});

export const list = style({
  listStyle: 'none',
  padding: 0,
  margin: 0,
});

export const item = style({
  margin: `${vars.space[1]} 0`,
});

export const link = style({
  display: 'block',
  padding: `${vars.space[1]} 0`,
  color: vars.color.textMuted,
  textDecoration: 'none',
  lineHeight: 1.4,
  ':hover': {
    color: vars.color.accent,
  },
});

export const linkActive = style({
  color: vars.color.accent,
  fontWeight: 600,
});

export const h3 = style({
  paddingLeft: vars.space[3],
  fontSize: '0.85em',
});
