import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

// 모든 다이어그램을 감싸는 카드형 컨테이너. 본문 안에 자연스럽게 끼어들 수 있도록
// padding 과 border 만 가지고, 폭은 100% 로 유연하게 잡는다.
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
  // 글자가 깨끗하게 렌더되도록 antialias 힌트
  shapeRendering: 'geometricPrecision',
  // viewBox 기반이므로 max-width 로만 한 번 제한
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
