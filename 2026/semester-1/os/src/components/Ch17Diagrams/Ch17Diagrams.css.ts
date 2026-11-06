import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

// Ch15 패턴과 동일한 카드형 컨테이너 — 본문 내 자연스럽게 끼어들도록.
export const diagram = style({
  margin: `${vars.space[5]} 0 ${vars.space[6]}`,
  padding: `${vars.space[4]} ${vars.space[3]}`,
  background: vars.color.surfaceAlt,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  overflow: 'hidden',
});

export const svg = style({
  display: 'block',
  width: '100%',
  height: 'auto',
  shapeRendering: 'geometricPrecision',
  maxWidth: '760px',
  margin: '0 auto',
});

export const caption = style({
  marginTop: vars.space[2],
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  textAlign: 'center',
  fontStyle: 'italic',
});
