import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const figure = style({
  margin: `${vars.space[5]} 0`,
  padding: vars.space[3],
  borderRadius: vars.radius.md,
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  textAlign: 'center',
});

export const img = style({
  maxWidth: '100%',
  height: 'auto',
  borderRadius: vars.radius.sm,
});

export const caption = style({
  marginTop: vars.space[2],
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
  lineHeight: vars.lineHeight.snug,
});

export const source = style({
  display: 'block',
  marginTop: vars.space[1],
  fontSize: vars.fontSize.xs,
  color: vars.color.textFaint,
  fontFamily: vars.font.mono,
});

export const placeholder = style({
  padding: `${vars.space[12]} ${vars.space[5]}`,
  fontSize: vars.fontSize.sm,
  color: vars.color.textFaint,
  fontStyle: 'italic',
  background: vars.color.surfaceAlt,
  border: `2px dashed ${vars.color.border}`,
  borderRadius: vars.radius.md,
});

// 인라인 SVG 도식을 담는 컨테이너. color: currentColor 가 안쪽 SVG의
// stroke="currentColor" / fill="currentColor" 에 전달되어 다크/라이트 모두 자연스럽게 어울린다.
export const svgBox = style({
  padding: `${vars.space[3]} ${vars.space[4]}`,
  color: vars.color.text,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
