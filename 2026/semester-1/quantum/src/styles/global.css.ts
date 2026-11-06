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

globalStyle('h2', {
  fontSize: vars.fontSize['2xl'],
  marginTop: vars.space[20],
  marginBottom: vars.space[6],
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

globalStyle('h3', {
  fontSize: vars.fontSize.xl,
  marginTop: vars.space[12],
  marginBottom: vars.space[4],
  color: vars.color.heading,
  '@media': {
    '(max-width: 600px)': { fontSize: vars.fontSize.lg, marginTop: vars.space[10] },
  },
});

globalStyle('h4', {
  fontSize: vars.fontSize.lg,
  marginTop: vars.space[8],
  marginBottom: vars.space[3],
  color: vars.color.heading,
});

// ─── Prose ───────────────────────────────────────────────────
globalStyle('p', {
  margin: `${vars.space[4]} 0`,
  lineHeight: vars.lineHeight.relaxed,
});

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
globalStyle('li > ul, li > ol', {
  margin: `${vars.space[1]} 0`,
});
globalStyle('li > ul > li, li > ol > li', {
  margin: `${vars.space[1]} 0`,
});

globalStyle('ul', {
  listStyle: 'disc',
});
globalStyle('ul li::marker', {
  color: vars.color.accent,
});

// ─── Blockquote — 정의/강조 ──────────────────────────────────
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

// ─── KaTeX (math 블록) ───────────────────────────────────────
// remark-math + rehype-katex 가 $$ ... $$ 를 .katex-display 로 감싸 준다.
// 기본 0.5em 여백보다 좀 더 넉넉히, 그리고 좁은 화면에서 가로 스크롤 가능하게.
globalStyle('.katex-display', {
  margin: `${vars.space[6]} 0`,
  padding: `${vars.space[3]} ${vars.space[4]}`,
  background: vars.color.eqBg,
  border: `1px solid ${vars.color.eqBorder}`,
  borderRadius: vars.radius.md,
  overflowX: 'auto',
  overflowY: 'hidden',
});
globalStyle('.katex', {
  color: vars.color.heading,
  fontSize: '1.05em',
});
// 인라인 수식은 박스 없이, 글자 그대로 흐름에 녹게
globalStyle(':not(.katex-display) > .katex', {
  fontSize: '1em',
});
