import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const wrap = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space[4],
  marginTop: vars.space[16],
  paddingTop: vars.space[6],
  borderTop: `1px solid ${vars.color.border}`,
  '@media': {
    '(max-width: 600px)': {
      gridTemplateColumns: '1fr',
      gap: vars.space[3],
      marginTop: vars.space[10],
    },
  },
});

export const link = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  padding: `${vars.space[4]} ${vars.space[5]}`,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  background: vars.color.surface,
  color: vars.color.text,
  transition:
    'transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease, background 0.12s ease',
  // 전역 a 에 걸려 있는 dashed underline 제거
  borderBottom: `1px solid ${vars.color.border}`,
  ':hover': {
    textDecoration: 'none',
    transform: 'translateY(-1px)',
    boxShadow: vars.shadow.md,
    borderColor: vars.color.accent,
    background: vars.color.accentSoft,
  },
});

export const linkRight = style({
  textAlign: 'right',
  alignItems: 'flex-end',
});

export const hint = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[1],
  fontSize: vars.fontSize.xs,
  color: vars.color.accent,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontWeight: 700,
});

export const title = style({
  fontSize: vars.fontSize.md,
  fontWeight: 600,
  color: vars.color.heading,
  lineHeight: 1.3,
});

export const spacer = style({});
