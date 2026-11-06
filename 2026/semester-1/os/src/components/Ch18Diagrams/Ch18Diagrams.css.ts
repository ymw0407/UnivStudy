import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

// 18장(Threads & Concurrency) 후반에 추가되는 Linux 구현 관점 다이어그램들.
// 다른 장의 다이어그램 컨테이너와 동일한 톤.
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
  maxWidth: '820px',
  margin: '0 auto',
});

export const caption = style({
  marginTop: vars.space[2],
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  textAlign: 'center',
  fontStyle: 'italic',
});
