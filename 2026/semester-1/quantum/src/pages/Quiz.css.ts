import { style } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css';

export const root = style({
  maxWidth: vars.maxWidth.prose,
  margin: '0 auto',
});

export const head = style({
  paddingBottom: vars.space[6],
  borderBottom: `1px solid ${vars.color.border}`,
  marginBottom: vars.space[8],
});

export const eyebrow = style({
  fontSize: vars.fontSize.xs,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: vars.color.accent,
  fontWeight: 700,
  marginBottom: vars.space[3],
});

export const title = style({
  fontSize: vars.fontSize['3xl'],
  marginBottom: vars.space[3],
  '@media': { '(max-width: 600px)': { fontSize: vars.fontSize['2xl'] } },
});

export const desc = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.base,
  lineHeight: vars.lineHeight.snug,
  wordBreak: 'keep-all',
});

export const scoreBar = style({
  marginTop: vars.space[5],
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[4],
  flexWrap: 'wrap',
});

export const score = style({
  fontSize: vars.fontSize.base,
  color: vars.color.text,
  background: vars.color.surfaceAlt,
  padding: `${vars.space[2]} ${vars.space[4]}`,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
});

export const reset = style({
  padding: `${vars.space[2]} ${vars.space[3]}`,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  color: vars.color.textMuted,
  cursor: 'pointer',
  fontSize: vars.fontSize.sm,
  ':hover': { background: vars.color.surfaceAlt, color: vars.color.heading },
});

export const filters = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[2],
  marginBottom: vars.space[10],
});

export const chip = style({
  padding: `${vars.space[1]} ${vars.space[3]}`,
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  color: vars.color.textMuted,
  cursor: 'pointer',
  fontSize: vars.fontSize.sm,
  transition: 'background 0.1s ease, color 0.1s ease, border-color 0.1s ease',
  ':hover': { borderColor: vars.color.accent, color: vars.color.heading },
});

export const chipActive = style({
  background: vars.color.accentSoft,
  color: vars.color.accent,
  borderColor: vars.color.accent,
  fontWeight: 600,
});

export const section = style({
  marginBottom: vars.space[12],
});

export const sectionTitle = style({
  fontSize: vars.fontSize.xl,
  marginBottom: vars.space[5],
  paddingBottom: vars.space[2],
  borderBottom: `2px solid ${vars.color.accentSoft}`,
  display: 'flex',
  alignItems: 'baseline',
  gap: vars.space[3],
  wordBreak: 'keep-all',
});

export const sectionNum = style({
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.sm,
  color: vars.color.accent,
  fontWeight: 700,
});

export const card = style({
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  padding: `${vars.space[5]} ${vars.space[6]}`,
  marginBottom: vars.space[4],
  boxShadow: vars.shadow.sm,
  '@media': { '(max-width: 600px)': { padding: `${vars.space[4]} ${vars.space[4]}` } },
});

export const question = style({
  fontSize: vars.fontSize.md,
  fontWeight: 600,
  color: vars.color.heading,
  marginBottom: vars.space[4],
  lineHeight: vars.lineHeight.snug,
  wordBreak: 'keep-all',
});

export const choices = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
});

export const choice = style({
  width: '100%',
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.space[3],
  textAlign: 'left',
  padding: `${vars.space[3]} ${vars.space[4]}`,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  color: vars.color.text,
  cursor: 'pointer',
  fontSize: vars.fontSize.base,
  lineHeight: vars.lineHeight.snug,
  transition: 'background 0.1s ease, border-color 0.1s ease',
  selectors: {
    '&:not(:disabled):hover': {
      borderColor: vars.color.accent,
      background: vars.color.accentSoft,
    },
    '&:disabled': { cursor: 'default' },
  },
});

export const choiceCorrect = style({
  borderColor: vars.color.tipBorder,
  background: vars.color.tipBg,
  color: vars.color.heading,
  fontWeight: 600,
});

export const choiceWrong = style({
  borderColor: vars.color.problem,
  background: vars.color.problemSoft,
  color: vars.color.heading,
});

export const choiceMark = style({
  flexShrink: 0,
  width: '22px',
  height: '22px',
  borderRadius: '50%',
  display: 'grid',
  placeItems: 'center',
  fontSize: vars.fontSize.sm,
  fontWeight: 700,
  background: vars.color.surfaceAlt,
  color: vars.color.textMuted,
});

export const explain = style({
  marginTop: vars.space[4],
  padding: `${vars.space[3]} ${vars.space[4]}`,
  borderRadius: vars.radius.md,
  fontSize: vars.fontSize.sm,
  lineHeight: vars.lineHeight.normal,
  borderLeft: '4px solid',
});

export const explainOk = style({
  background: vars.color.tipBg,
  borderLeftColor: vars.color.tipBorder,
});

export const explainNo = style({
  background: vars.color.warnBg,
  borderLeftColor: vars.color.warnBorder,
});

export const explainTag = style({
  display: 'inline-block',
  marginRight: vars.space[2],
  fontWeight: 700,
  fontSize: vars.fontSize.xs,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: vars.color.heading,
});
