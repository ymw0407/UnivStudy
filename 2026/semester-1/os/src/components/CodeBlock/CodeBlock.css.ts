import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

// 외곽 — 본문(article)과 같은 surface 배경을 쓰고 border 로만 구분.
// 회색 강조 없이 깔끔하게, 충분한 padding 확보.
export const wrapper = style({
  position: 'relative',
  margin: `${vars.space[5]} 0`,
  borderRadius: vars.radius.md,
  overflow: 'hidden',
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
});

// 상단 파일명 바 (있을 때만)
export const filenameBar = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  padding: `${vars.space[2]} ${vars.space[5]}`,
  fontSize: vars.fontSize.xs,
  fontFamily: vars.font.mono,
  color: vars.color.textMuted,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const filenameDots = style({
  display: 'inline-flex',
  gap: '4px',
});

export const dot = style({
  width: '9px',
  height: '9px',
  borderRadius: '50%',
  background: vars.color.border,
});

// 우상단 언어 뱃지
export const langBadge = style({
  position: 'absolute',
  top: vars.space[2],
  right: vars.space[3],
  padding: `2px ${vars.space[2]}`,
  fontSize: '0.68rem',
  fontFamily: vars.font.mono,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: vars.color.textFaint,
  background: vars.color.surfaceAlt,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  zIndex: 1,
  userSelect: 'none',
  pointerEvents: 'none',
});

// 코드 영역 (fallback / shiki HTML 공통 컨테이너)
export const codeArea = style({
  margin: 0,
  padding: `${vars.space[5]} ${vars.space[6]}`,
  overflow: 'auto',
  fontSize: '0.9rem',
  lineHeight: 1.55,
  fontFamily: vars.font.mono,
  background: 'transparent',
  color: vars.color.text,
});

export const plain = style({
  whiteSpace: 'pre',
  fontFamily: vars.font.mono,
  margin: 0,
});

// ─── Shiki 렌더링된 마크업을 우리 컨테이너에 자연스럽게 녹이기 ─────────
//
// 중요: shiki 는 line span 들 사이에 literal "\n" 텍스트 노드를 남긴다.
//   <span class="line">...</span>\n<span class="line">...</span>\n...
//
// <pre> 의 기본 white-space: pre 때문에 이 "\n" 이 실제 줄바꿈으로 렌더되고,
// .line 들에 display:block 까지 걸려 있으면 매 줄 사이에 빈 줄이 하나씩 추가로 생긴다.
// 해결: 컨테이너(.shiki, .shiki code) 는 white-space: normal 로 두어 line 사이
//        "\n" 을 공백으로 축소시키고, .line 내부에서만 white-space: pre 로 코드
//        공백을 보존한다. 빈 줄은 min-height 로 한 줄 높이 유지.
globalStyle(`${wrapper} .shiki`, {
  background: 'transparent !important',
  padding: '0 !important',
  margin: 0,
  fontSize: 'inherit',
  lineHeight: 'inherit',
  fontFamily: vars.font.mono,
  whiteSpace: 'normal',
});
globalStyle(`${wrapper} .shiki code`, {
  display: 'block',
  background: 'transparent',
  padding: 0,
  fontSize: 'inherit',
  lineHeight: 'inherit',
  fontFamily: vars.font.mono,
  whiteSpace: 'normal',
});
globalStyle(`${wrapper} .shiki .line`, {
  display: 'block',
  whiteSpace: 'pre',
  minHeight: '1.55em', // 빈 줄도 한 줄 높이를 차지하도록 (lineHeight 와 맞춤)
  fontFamily: vars.font.mono,
});
globalStyle(`${wrapper} .shiki .line span`, {
  fontFamily: vars.font.mono,
  whiteSpace: 'pre',
});

// 다크 모드 — 시맨틱 색은 var 로 스위치, 배경은 우리가 직접 surface(다크) 사용
globalStyle('[data-theme="dark"] .shiki, [data-theme="dark"] .shiki span', {
  color: 'var(--shiki-dark) !important',
  fontStyle: 'var(--shiki-dark-font-style) !important',
  fontWeight: 'var(--shiki-dark-font-weight) !important',
  textDecoration: 'var(--shiki-dark-text-decoration) !important',
});
