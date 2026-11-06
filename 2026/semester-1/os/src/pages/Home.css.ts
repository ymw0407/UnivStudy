import { style } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css';

export const root = style({
  maxWidth: vars.maxWidth.page,
  margin: '0 auto',
});

export const hero = style({
  padding: `${vars.space[12]} 0 ${vars.space[8]}`,
  borderBottom: `1px solid ${vars.color.border}`,
  marginBottom: vars.space[10],
  '@media': {
    '(max-width: 600px)': {
      padding: `${vars.space[6]} 0 ${vars.space[5]}`,
      marginBottom: vars.space[6],
    },
  },
});

export const heroEyebrow = style({
  fontSize: vars.fontSize.xs,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: vars.color.accent,
  fontWeight: 700,
  marginBottom: vars.space[3],
});

export const heroTitle = style({
  fontSize: vars.fontSize['4xl'],
  letterSpacing: '-0.02em',
  marginBottom: vars.space[4],
  wordBreak: 'keep-all',
  '@media': {
    '(max-width: 600px)': { fontSize: vars.fontSize['2xl'] },
  },
});

export const heroDesc = style({
  fontSize: vars.fontSize.lg,
  color: vars.color.textMuted,
  maxWidth: '680px',
  lineHeight: vars.lineHeight.snug,
  wordBreak: 'keep-all',
  '@media': {
    '(max-width: 600px)': { fontSize: vars.fontSize.base },
  },
});

export const evoStrip = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space[4],
  marginBottom: vars.space[12],
  '@media': {
    '(max-width: 800px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const evoCard = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  padding: `${vars.space[6]} ${vars.space[6]}`,
  borderRadius: vars.radius.lg,
  background: `linear-gradient(135deg, ${vars.color.accentSoft}, ${vars.color.surface})`,
  border: `1px solid ${vars.color.borderStrong}`,
  borderBottom: `1px solid ${vars.color.borderStrong}`, // 전역 a dashed 방지
  color: vars.color.text,
  transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
  ':hover': {
    textDecoration: 'none',
    transform: 'translateY(-2px)',
    boxShadow: vars.shadow.md,
    borderColor: vars.color.accent,
  },
});

export const evoLabel = style({
  fontSize: vars.fontSize.xs,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: vars.color.accent,
  fontWeight: 700,
});

export const evoTitle = style({
  fontSize: vars.fontSize.xl,
  color: vars.color.heading,
  fontWeight: 700,
});

export const evoDesc = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
  lineHeight: vars.lineHeight.snug,
});

export const evoArrow = style({
  marginTop: vars.space[2],
  color: vars.color.accent,
  fontWeight: 600,
  fontSize: vars.fontSize.sm,
});

export const partSection = style({
  marginBottom: vars.space[12],
  '@media': {
    '(max-width: 600px)': { marginBottom: vars.space[8] },
  },
});

export const partHeader = style({
  marginBottom: vars.space[5],
});

export const partLabel = style({
  fontSize: vars.fontSize.xs,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: vars.color.textFaint,
  fontWeight: 700,
});

export const partTitle = style({
  fontSize: vars.fontSize['2xl'],
  marginTop: vars.space[1],
  marginBottom: vars.space[2],
  '@media': {
    '(max-width: 600px)': { fontSize: vars.fontSize.xl },
  },
});

export const partDesc = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.base,
});

export const chapterGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: vars.space[3],
  '@media': {
    '(max-width: 480px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const chapterCard = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  padding: `${vars.space[4]} ${vars.space[5]}`,
  borderRadius: vars.radius.md,
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderBottom: `1px solid ${vars.color.border}`, // 전역 a dashed 방지
  color: vars.color.text,
  transition: 'transform 0.1s ease, border-color 0.1s ease, box-shadow 0.1s ease',
  ':hover': {
    textDecoration: 'none',
    borderColor: vars.color.accent,
    transform: 'translateY(-1px)',
    boxShadow: vars.shadow.sm,
  },
});

export const chapterNumber = style({
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.xs,
  color: vars.color.accent,
  fontWeight: 700,
});

export const chapterTitle = style({
  fontSize: vars.fontSize.md,
  fontWeight: 600,
  color: vars.color.heading,
});

export const chapterSubtitle = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
  lineHeight: vars.lineHeight.snug,
});
