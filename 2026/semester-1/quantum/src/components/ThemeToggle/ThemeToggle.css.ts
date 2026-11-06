import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const button = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space[1],
  width: '36px',
  height: '36px',
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  background: vars.color.surface,
  color: vars.color.text,
  cursor: 'pointer',
  fontSize: '1rem',
  transition: 'background 0.15s ease, border-color 0.15s ease',
  ':hover': {
    background: vars.color.surfaceAlt,
    borderColor: vars.color.borderStrong,
  },
});

export const icon = style({
  fontSize: '1rem',
  lineHeight: 1,
});
