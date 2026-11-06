import { globalStyle } from '@vanilla-extract/css';
import { vars } from './theme.css';

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
});

globalStyle('html, body', {
  margin: 0,
  padding: 0,
  background: vars.color.bg,
  color: vars.color.text,
  fontFamily: vars.font.sans,
  fontSize: vars.fontSize.md,
  lineHeight: vars.lineHeight.normal,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  overflowX: 'hidden',
});

globalStyle('body', {
  minHeight: '100vh',
});

// ─── Headings ────────────────────────────────────────────────
globalStyle('h1, h2, h3, h4, h5, h6', {
  fontFamily: vars.font.sans,
  color: vars.color.heading,
  lineHeight: vars.lineHeight.tight,
  margin: 0,
  fontWeight: 700,
  wordBreak: 'keep-all',
});

globalStyle('h1', {
  fontSize: vars.fontSize['3xl'],
  letterSpacing: '-0.02em',
  '@media': {
    '(max-width: 600px)': { fontSize: vars.fontSize['2xl'] },
  },
});

// H2 — 주요 섹션 구분자. 왼쪽 bar + 위쪽 여백 크게.
globalStyle('h2', {
  fontSize: vars.fontSize['2xl'],
  marginTop: vars.space[16],
  marginBottom: vars.space[5],
  paddingLeft: vars.space[4],
  letterSpacing: '-0.015em',
  borderLeft: `4px solid ${vars.color.accent}`,
  '@media': {
    '(max-width: 600px)': {
      fontSize: vars.fontSize.xl,
      marginTop: vars.space[12],
      paddingLeft: vars.space[3],
    },
  },
});

// H3 — 서브 섹션. 색 포인트 하나로 구분.
globalStyle('h3', {
  fontSize: vars.fontSize.xl,
  marginTop: vars.space[10],
  marginBottom: vars.space[3],
  color: vars.color.heading,
  '@media': {
    '(max-width: 600px)': { fontSize: vars.fontSize.lg, marginTop: vars.space[8] },
  },
});

globalStyle('h4', {
  fontSize: vars.fontSize.lg,
  marginTop: vars.space[6],
  marginBottom: vars.space[2],
  color: vars.color.heading,
});

// ─── Prose ───────────────────────────────────────────────────
globalStyle('p', {
  margin: `${vars.space[4]} 0`,
  lineHeight: vars.lineHeight.relaxed,
});

// 기본 a 는 밑줄 없이 — 카드/버튼으로 쓰는 Link 가 많기 때문.
// 본문(prose) 링크 밑줄은 Chapter.css 의 body 범위에서만 적용한다.
globalStyle('a', {
  color: vars.color.link,
  textDecoration: 'none',
});
globalStyle('a:hover', {
  color: vars.color.linkHover,
});

// ─── Lists ───────────────────────────────────────────────────
globalStyle('ul, ol', {
  margin: `${vars.space[4]} 0`,
  paddingLeft: vars.space[6],
  lineHeight: vars.lineHeight.relaxed,
});
globalStyle('li', {
  margin: `${vars.space[2]} 0`,
});
// 중첩 리스트는 top 간격을 살짝만
globalStyle('li > ul, li > ol', {
  margin: `${vars.space[1]} 0`,
});
globalStyle('li > ul > li, li > ol > li', {
  margin: `${vars.space[1]} 0`,
});

// Bullet 색 포인트
globalStyle('ul', {
  listStyle: 'disc',
});
globalStyle('ul li::marker', {
  color: vars.color.accent,
});

// ─── Blockquote — 원문에서 정의/강조로 많이 쓰이므로 좀 더 눈에 띄게 ─
globalStyle('blockquote', {
  margin: `${vars.space[5]} 0`,
  padding: `${vars.space[3]} ${vars.space[5]}`,
  borderLeft: `4px solid ${vars.color.noteBorder}`,
  background: vars.color.noteBg,
  color: vars.color.text,
  borderRadius: `0 ${vars.radius.md} ${vars.radius.md} 0`,
  fontSize: vars.fontSize.base,
  lineHeight: vars.lineHeight.normal,
});
globalStyle('blockquote p', {
  margin: `${vars.space[2]} 0`,
});
globalStyle('blockquote strong', {
  color: vars.color.heading,
});
globalStyle('blockquote > blockquote', {
  marginTop: vars.space[2],
  marginBottom: vars.space[2],
  background: 'transparent',
  borderLeftColor: vars.color.borderStrong,
});

// ─── Code ────────────────────────────────────────────────────
globalStyle('code', {
  fontFamily: vars.font.mono,
  fontSize: '0.92em',
  padding: '1px 6px',
  borderRadius: vars.radius.sm,
  background: vars.color.inlineCodeBg,
  color: vars.color.inlineCodeText,
});

globalStyle('pre', {
  margin: `${vars.space[5]} 0`,
  padding: 0,
  borderRadius: vars.radius.md,
  overflow: 'auto',
  maxWidth: '100%',
});
globalStyle('pre code', {
  background: 'transparent',
  padding: 0,
  fontSize: vars.fontSize.sm,
  color: 'inherit',
});

// ─── Separators ──────────────────────────────────────────────
globalStyle('hr', {
  border: 0,
  height: '1px',
  background: `linear-gradient(to right, transparent, ${vars.color.border} 20%, ${vars.color.border} 80%, transparent)`,
  margin: `${vars.space[12]} 0`,
});

// ─── Tables ──────────────────────────────────────────────────
globalStyle('table', {
  width: '100%',
  borderCollapse: 'collapse',
  margin: `${vars.space[5]} 0`,
  fontSize: vars.fontSize.sm,
  display: 'block',
  overflowX: 'auto',
});
globalStyle('th, td', {
  border: `1px solid ${vars.color.border}`,
  padding: `${vars.space[2]} ${vars.space[3]}`,
  textAlign: 'left',
  verticalAlign: 'top',
});
globalStyle('th', {
  background: vars.color.surfaceAlt,
  fontWeight: 600,
  color: vars.color.heading,
});

// ─── Emphasis ────────────────────────────────────────────────
globalStyle('strong, b', {
  fontWeight: 700,
  color: vars.color.heading,
});
globalStyle('em, i', {
  fontStyle: 'italic',
  color: vars.color.text,
});

// ─── Images ──────────────────────────────────────────────────
globalStyle('img', {
  maxWidth: '100%',
  height: 'auto',
});

// ─── Selection ───────────────────────────────────────────────
globalStyle('::selection', {
  background: vars.color.accentSoft,
  color: vars.color.accent,
});
