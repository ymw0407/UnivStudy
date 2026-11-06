import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const page = style({
  maxWidth: vars.maxWidth.prose,
  margin: '0 auto',
  padding: `0 ${vars.space[4]}`,
});

export const header = style({
  marginBottom: vars.space[6],
});

export const eyebrow = style({
  fontSize: vars.fontSize.xs,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: vars.color.accent,
  fontWeight: 700,
  marginBottom: vars.space[2],
});

export const title = style({
  fontSize: vars.fontSize['3xl'],
  marginBottom: vars.space[2],
  wordBreak: 'keep-all',
  '@media': {
    '(max-width: 600px)': { fontSize: vars.fontSize['2xl'] },
  },
});

export const desc = style({
  fontSize: vars.fontSize.md,
  color: vars.color.textMuted,
  lineHeight: vars.lineHeight.snug,
  maxWidth: '700px',
  wordBreak: 'keep-all',
});

// ── 진행 바 / 요약 ─────────────────────────────────────────

export const summaryBar = style({
  position: 'sticky',
  top: `calc(${vars.size.header} + ${vars.space[2]})`,
  zIndex: 5,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[4],
  padding: `${vars.space[3]} ${vars.space[5]}`,
  marginBottom: vars.space[6],
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.sm,
  flexWrap: 'wrap',
});

export const progressText = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
  fontWeight: 600,
});

export const scoreText = style({
  fontSize: vars.fontSize.sm,
  fontWeight: 700,
  color: vars.color.accent,
});

export const summaryActions = style({
  marginLeft: 'auto',
  display: 'flex',
  gap: vars.space[2],
});

// ── 문항 카드 ─────────────────────────────────────────────

export const questionCard = style({
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  padding: `${vars.space[6]} ${vars.space[6]}`,
  marginBottom: vars.space[5],
  boxShadow: vars.shadow.sm,
  '@media': {
    '(max-width: 600px)': {
      padding: `${vars.space[4]} ${vars.space[4]}`,
    },
  },
});

export const questionHead = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  marginBottom: vars.space[3],
  flexWrap: 'wrap',
});

export const questionNumber = style({
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.sm,
  color: vars.color.textFaint,
  fontWeight: 700,
});

export const typeBadge = style({
  fontSize: vars.fontSize.xs,
  fontWeight: 700,
  padding: `2px ${vars.space[2]}`,
  borderRadius: vars.radius.sm,
  background: vars.color.accentSoft,
  color: vars.color.accent,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
});

export const prompt = style({
  fontSize: vars.fontSize.md,
  lineHeight: vars.lineHeight.normal,
  color: vars.color.text,
  marginBottom: vars.space[4],
  whiteSpace: 'pre-wrap',
  wordBreak: 'keep-all',
});

// ── MC / TF 옵션 ──────────────────────────────────────────

export const optionList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const optionButton = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.space[3],
  width: '100%',
  padding: `${vars.space[3]} ${vars.space[4]}`,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  color: vars.color.text,
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: 'inherit',
  fontSize: vars.fontSize.base,
  lineHeight: vars.lineHeight.snug,
  transition: 'border-color 0.12s ease, background 0.12s ease',
  ':hover': {
    borderColor: vars.color.borderStrong,
  },
  ':disabled': {
    cursor: 'default',
  },
});

export const optionSelected = style({
  borderColor: vars.color.accent,
  background: vars.color.accentSoft,
});

export const optionCorrect = style({
  borderColor: vars.color.solution,
  background: vars.color.solutionSoft,
});

export const optionIncorrect = style({
  borderColor: vars.color.problem,
  background: vars.color.problemSoft,
});

export const optionMark = style({
  flex: '0 0 24px',
  height: '24px',
  borderRadius: '50%',
  border: `2px solid ${vars.color.borderStrong}`,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: vars.fontSize.xs,
  fontWeight: 700,
});

// ── 단답 / 코드 블랭크 입력 ───────────────────────────────

export const textInput = style({
  width: '100%',
  padding: `${vars.space[3]} ${vars.space[3]}`,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  color: vars.color.text,
  fontFamily: 'inherit',
  fontSize: vars.fontSize.base,
  ':focus': {
    outline: `2px solid ${vars.color.accent}`,
    outlineOffset: '1px',
    borderColor: vars.color.accent,
  },
});

export const blankInput = style({
  display: 'inline-block',
  minWidth: '80px',
  padding: `2px ${vars.space[2]}`,
  margin: `0 2px`,
  border: `1px solid ${vars.color.borderStrong}`,
  borderRadius: vars.radius.sm,
  background: vars.color.surface,
  color: vars.color.text,
  fontFamily: vars.font.mono,
  fontSize: '0.95em',
  ':focus': {
    outline: `2px solid ${vars.color.accent}`,
    outlineOffset: '1px',
  },
});

export const blankCorrect = style({
  borderColor: vars.color.solution,
  background: vars.color.solutionSoft,
});

export const blankIncorrect = style({
  borderColor: vars.color.problem,
  background: vars.color.problemSoft,
});

export const codeBlock = style({
  padding: `${vars.space[4]} ${vars.space[4]}`,
  background: vars.color.codeBg,
  color: vars.color.codeText,
  borderRadius: vars.radius.md,
  fontFamily: vars.font.mono,
  fontSize: '0.9rem',
  lineHeight: 1.6,
  overflowX: 'auto',
  whiteSpace: 'pre',
  marginBottom: vars.space[3],
});

// ── 액션 버튼 ─────────────────────────────────────────────

export const actionRow = style({
  marginTop: vars.space[4],
  display: 'flex',
  gap: vars.space[2],
  flexWrap: 'wrap',
});

export const primaryButton = style({
  padding: `${vars.space[2]} ${vars.space[4]}`,
  borderRadius: vars.radius.md,
  background: vars.color.accent,
  color: 'white',
  fontWeight: 600,
  fontSize: vars.fontSize.sm,
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'background 0.12s ease',
  ':hover': {
    background: vars.color.accentStrong,
  },
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

export const ghostButton = style({
  padding: `${vars.space[2]} ${vars.space[4]}`,
  borderRadius: vars.radius.md,
  background: 'transparent',
  color: vars.color.textMuted,
  fontWeight: 600,
  fontSize: vars.fontSize.sm,
  border: `1px solid ${vars.color.border}`,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'border-color 0.12s ease, color 0.12s ease',
  ':hover': {
    borderColor: vars.color.borderStrong,
    color: vars.color.text,
  },
});

// ── 피드백 ────────────────────────────────────────────────

export const feedback = style({
  marginTop: vars.space[3],
  padding: `${vars.space[3]} ${vars.space[4]}`,
  borderRadius: vars.radius.md,
  fontSize: vars.fontSize.sm,
  lineHeight: vars.lineHeight.snug,
  borderLeft: `3px solid ${vars.color.accent}`,
  background: vars.color.accentSoft,
  whiteSpace: 'pre-wrap',
  wordBreak: 'keep-all',
});

export const feedbackCorrect = style({
  borderLeftColor: vars.color.solution,
  background: vars.color.solutionSoft,
  color: vars.color.text,
});

export const feedbackIncorrect = style({
  borderLeftColor: vars.color.problem,
  background: vars.color.problemSoft,
  color: vars.color.text,
});

export const feedbackLabel = style({
  fontWeight: 700,
  marginBottom: vars.space[1],
  display: 'block',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  fontSize: vars.fontSize.xs,
});

export const modelAnswer = style({
  marginTop: vars.space[3],
  padding: `${vars.space[4]} ${vars.space[4]}`,
  borderRadius: vars.radius.md,
  background: vars.color.summaryBg,
  borderLeft: `3px solid ${vars.color.summaryBorder}`,
  fontSize: vars.fontSize.sm,
  lineHeight: vars.lineHeight.normal,
  whiteSpace: 'pre-wrap',
  wordBreak: 'keep-all',
});

export const rubric = style({
  marginTop: vars.space[3],
  paddingLeft: vars.space[5],
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
});

// ── overview grid ─────────────────────────────────────────

export const overviewIntro = style({
  marginBottom: vars.space[8],
});

export const partSection = style({
  marginBottom: vars.space[10],
});

export const partTitle = style({
  fontSize: vars.fontSize.xl,
  marginBottom: vars.space[2],
});

export const partDesc = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
  marginBottom: vars.space[4],
});

export const quizGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: vars.space[3],
});

export const quizCard = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  padding: `${vars.space[4]} ${vars.space[5]}`,
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  textDecoration: 'none',
  color: 'inherit',
  transition: 'border-color 0.12s ease, box-shadow 0.12s ease, transform 0.12s ease',
  ':hover': {
    borderColor: vars.color.accent,
    boxShadow: vars.shadow.md,
    transform: 'translateY(-1px)',
    textDecoration: 'none',
  },
});

export const quizCardNumber = style({
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.xs,
  color: vars.color.textFaint,
});

export const quizCardTitle = style({
  fontSize: vars.fontSize.md,
  fontWeight: 700,
  color: vars.color.heading,
});

export const quizCardMeta = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  marginTop: vars.space[1],
});

export const empty = style({
  padding: vars.space[8],
  color: vars.color.textFaint,
  textAlign: 'center',
  fontStyle: 'italic',
});

// ── chapter quiz header nav ───────────────────────────────

export const backLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[1],
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
  textDecoration: 'none',
  marginBottom: vars.space[3],
  ':hover': {
    color: vars.color.accent,
    textDecoration: 'none',
  },
});

export const chapterLink = style({
  display: 'inline-block',
  marginTop: vars.space[2],
  fontSize: vars.fontSize.sm,
  color: vars.color.accent,
  textDecoration: 'none',
  ':hover': { textDecoration: 'underline' },
});
