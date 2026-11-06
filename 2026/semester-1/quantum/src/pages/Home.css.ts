import { style } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css';

export const root = style({
  maxWidth: vars.maxWidth.page,
  margin: '0 auto',
});

export const hero = style({
  padding: `${vars.space[12]} 0 ${vars.space[10]}`,
  borderBottom: `1px solid ${vars.color.border}`,
  marginBottom: vars.space[12],
  '@media': {
    '(max-width: 600px)': {
      padding: `${vars.space[6]} 0 ${vars.space[6]}`,
      marginBottom: vars.space[8],
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
  maxWidth: '720px',
  lineHeight: vars.lineHeight.snug,
  wordBreak: 'keep-all',
  '@media': {
    '(max-width: 600px)': { fontSize: vars.fontSize.base },
  },
});

export const heroActions = style({
  marginTop: vars.space[6],
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[5],
  flexWrap: 'wrap',
});

export const primaryBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: `${vars.space[3]} ${vars.space[5]}`,
  borderRadius: vars.radius.md,
  background: vars.color.accent,
  color: '#ffffff',
  fontWeight: 600,
  fontSize: vars.fontSize.base,
  border: `1px solid ${vars.color.accent}`,
  transition: 'transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease',
  ':hover': {
    textDecoration: 'none',
    transform: 'translateY(-1px)',
    boxShadow: vars.shadow.md,
    background: vars.color.accentStrong,
    color: '#ffffff',
  },
});

export const secondaryBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: `${vars.space[3]} ${vars.space[5]}`,
  borderRadius: vars.radius.md,
  background: vars.color.surface,
  color: vars.color.accent,
  fontWeight: 600,
  fontSize: vars.fontSize.base,
  border: `1px solid ${vars.color.accent}`,
  transition: 'transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease',
  ':hover': {
    textDecoration: 'none',
    transform: 'translateY(-1px)',
    boxShadow: vars.shadow.md,
    background: vars.color.accentSoft,
    color: vars.color.accentStrong,
  },
});

export const heroMeta = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textFaint,
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
  paddingLeft: 0,
  borderLeft: 'none',
  '@media': {
    '(max-width: 600px)': { fontSize: vars.fontSize.xl },
  },
});

export const partDesc = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.base,
  maxWidth: '760px',
  lineHeight: vars.lineHeight.snug,
  wordBreak: 'keep-all',
});

export const chapterGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
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
  borderBottom: `1px solid ${vars.color.border}`,
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
  wordBreak: 'keep-all',
});
