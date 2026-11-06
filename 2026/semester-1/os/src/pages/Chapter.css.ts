import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css';

export const layout = style({
  display: 'grid',
  // prose 컬럼은 1fr 로 남는 공간을 모두 차지 → 데스크탑에서 본문이 꽉 차게 보임
  gridTemplateColumns: `minmax(0, 1fr) ${vars.size.toc}`,
  gap: vars.space[8],
  maxWidth: vars.maxWidth.page,
  margin: '0 auto',
  minWidth: 0,
  '@media': {
    '(max-width: 1200px)': {
      gridTemplateColumns: 'minmax(0, 1fr)',
      gap: vars.space[4],
    },
  },
});

export const article = style({
  minWidth: 0,
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  padding: `${vars.space[10]} ${vars.space[12]} ${vars.space[12]}`,
  boxShadow: vars.shadow.sm,
  fontSize: vars.fontSize.md,
  lineHeight: vars.lineHeight.relaxed,
  '@media': {
    '(max-width: 1400px)': {
      padding: `${vars.space[10]} ${vars.space[10]} ${vars.space[12]}`,
    },
    '(max-width: 900px)': {
      padding: `${vars.space[6]} ${vars.space[5]} ${vars.space[8]}`,
    },
    '(max-width: 600px)': {
      padding: `${vars.space[5]} ${vars.space[4]} ${vars.space[6]}`,
      borderRadius: vars.radius.md,
    },
  },
});

export const breadcrumb = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.accent,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  fontWeight: 700,
  marginBottom: vars.space[3],
});

export const title = style({
  fontSize: vars.fontSize['3xl'],
  marginBottom: vars.space[3],
  wordBreak: 'keep-all',
  '@media': {
    '(max-width: 600px)': { fontSize: vars.fontSize['2xl'] },
  },
});

export const subtitle = style({
  fontSize: vars.fontSize.lg,
  color: vars.color.textMuted,
  marginBottom: vars.space[8],
  fontWeight: 400,
  wordBreak: 'keep-all',
  lineHeight: vars.lineHeight.snug,
  '@media': {
    '(max-width: 600px)': { fontSize: vars.fontSize.md, marginBottom: vars.space[6] },
  },
});

export const divider = style({
  height: '1px',
  background: vars.color.border,
  margin: `${vars.space[6]} 0 ${vars.space[8]}`,
});

export const body = style({});

// 첫 번째 H2는 divider 직후라서 위쪽 여백을 살짝 줄인다
globalStyle(`${body} > :first-child`, {
  marginTop: 0,
});
globalStyle(`${body} h2:first-of-type`, {
  marginTop: vars.space[2],
});

// anchor 점프 시 header 높이만큼 여유
globalStyle(`${body} h2, ${body} h3, ${body} h4`, {
  scrollMarginTop: `calc(${vars.size.header} + 16px)`,
});
globalStyle(`${body} a[id]`, {
  scrollMarginTop: `calc(${vars.size.header} + 16px)`,
  display: 'block',
  position: 'relative',
  top: '-8px',
});

// 본문(prose) 내부의 실제 인라인 링크에만 dashed underline
globalStyle(`${body} p a, ${body} li a, ${body} blockquote a`, {
  borderBottom: `1px dashed ${vars.color.link}`,
});
globalStyle(`${body} p a:hover, ${body} li a:hover, ${body} blockquote a:hover`, {
  borderBottomStyle: 'solid',
});

export const tocCol = style({
  '@media': {
    '(max-width: 1200px)': {
      display: 'none',
    },
  },
});

export const notFound = style({
  padding: vars.space[10],
  textAlign: 'center',
  color: vars.color.textMuted,
});
