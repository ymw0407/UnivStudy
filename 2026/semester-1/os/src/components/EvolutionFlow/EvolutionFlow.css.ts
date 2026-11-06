import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const page = style({
  maxWidth: vars.maxWidth.page,
  margin: '0 auto',
});

export const header = style({
  marginBottom: vars.space[8],
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

export const layout = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(300px, 380px) 1fr',
  gap: vars.space[8],
  '@media': {
    '(max-width: 900px)': {
      gridTemplateColumns: '1fr',
      gap: vars.space[4],
    },
  },
});

export const flowCol = style({
  position: 'sticky',
  top: `calc(${vars.size.header} + ${vars.space[4]})`,
  alignSelf: 'start',
  maxHeight: `calc(100vh - ${vars.size.header} - ${vars.space[6]})`,
  overflowY: 'auto',
  // 위/아래로 충분한 여백을 둬서 마지막 노드가 스크롤 경계에 딱 붙어
  // 잘려 보이는 느낌을 없앤다.
  padding: `${vars.space[5]} ${vars.space[3]} ${vars.space[6]}`,
  scrollBehavior: 'smooth',
  // 스크롤 가능한 영역 위/아래에 subtle 한 fade mask 를 적용해,
  // 노드가 스크롤 경계에서 "짤려 보이는" 느낌을 줄인다.
  maskImage:
    'linear-gradient(to bottom, transparent 0, black 20px, black calc(100% - 20px), transparent 100%)',
  WebkitMaskImage:
    'linear-gradient(to bottom, transparent 0, black 20px, black calc(100% - 20px), transparent 100%)',
  '@media': {
    '(max-width: 900px)': {
      position: 'static',
      maxHeight: 'none',
      maskImage: 'none',
      WebkitMaskImage: 'none',
    },
  },
});

export const phaseHeader = style({
  padding: `${vars.space[4]} ${vars.space[3]} ${vars.space[2]}`,
  marginTop: vars.space[3],
  fontSize: vars.fontSize.xs,
  fontWeight: 700,
  color: vars.color.accent,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  borderTop: `1px dashed ${vars.color.border}`,
  selectors: {
    '&:first-child': {
      marginTop: 0,
      borderTop: 'none',
      paddingTop: 0,
    },
  },
});

export const flowList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
});

export const node = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: '100%',
  // 텍스트 양이 적은 노드도 비어 보이지 않도록 최소 높이를 둔다.
  minHeight: '84px',
  textAlign: 'left',
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  // 수직 padding 을 키워 카드가 더 "잡히는" 느낌을 주고, 좌측 accent bar 공간도 확보.
  padding: `${vars.space[4]} ${vars.space[4]} ${vars.space[4]} ${vars.space[5]}`,
  cursor: 'pointer',
  transition: 'transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease, background 0.12s ease',
  color: vars.color.text,
  fontFamily: 'inherit',
  overflow: 'hidden',
  // 좌측 accent indicator bar (기본은 투명)
  '::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '3px',
    background: 'transparent',
    transition: 'background 0.12s ease',
  },
  ':hover': {
    borderColor: vars.color.borderStrong,
    boxShadow: vars.shadow.sm,
    transform: 'translateX(1px)',
  },
});

export const nodeActive = style({
  borderColor: vars.color.evoActive,
  background: vars.color.evoActiveBg,
  boxShadow: vars.shadow.md,
  selectors: {
    '&::before': {
      background: vars.color.evoActive,
    },
  },
});

export const nodePast = style({
  opacity: 0.55,
});

export const nodeFuture = style({
  opacity: 0.9,
});

export const nodeIndex = style({
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.xs,
  color: vars.color.textFaint,
  marginBottom: '2px',
});

export const nodeTitle = style({
  fontSize: vars.fontSize.base,
  fontWeight: 700,
  color: vars.color.heading,
  marginBottom: '2px',
  lineHeight: 1.3,
});

export const nodeTagline = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
  lineHeight: vars.lineHeight.snug,
});

export const connector = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space[1],
  padding: `${vars.space[2]} 0`,
  fontSize: vars.fontSize.xs,
  lineHeight: 1.3,
});

export const connectorLine = style({
  width: '2px',
  height: '14px',
  background: vars.color.evoArrow,
  opacity: 0.5,
});

export const connectorLabel = style({
  maxWidth: '260px',
  textAlign: 'center',
  padding: `3px ${vars.space[2]}`,
  background: vars.color.problemSoft,
  color: vars.color.problem,
  border: `1px solid ${vars.color.problem}`,
  borderRadius: vars.radius.sm,
  fontWeight: 600,
  fontSize: vars.fontSize.xs,
});

export const detailCol = style({
  minWidth: 0,
});

export const detailCard = style({
  padding: `${vars.space[8]} ${vars.space[8]}`,
  borderRadius: vars.radius.lg,
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  boxShadow: vars.shadow.sm,
  '@media': {
    '(max-width: 600px)': {
      padding: `${vars.space[5]} ${vars.space[5]}`,
    },
  },
});

export const detailEyebrowRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  marginBottom: vars.space[2],
  flexWrap: 'wrap',
});

export const detailEyebrow = style({
  fontSize: vars.fontSize.xs,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: vars.color.accent,
  fontWeight: 700,
});

export const detailPhaseBadge = style({
  fontSize: vars.fontSize.xs,
  padding: `2px ${vars.space[2]}`,
  borderRadius: vars.radius.sm,
  background: vars.color.accentSoft,
  color: vars.color.accent,
  fontWeight: 600,
});

export const detailTitle = style({
  fontSize: vars.fontSize['2xl'],
  marginTop: vars.space[1],
  marginBottom: vars.space[2],
  wordBreak: 'keep-all',
  '@media': {
    '(max-width: 600px)': { fontSize: vars.fontSize.xl },
  },
});

export const detailTagline = style({
  fontSize: vars.fontSize.md,
  color: vars.color.textMuted,
  marginBottom: vars.space[6],
  fontStyle: 'italic',
});

export const section = style({
  marginBottom: vars.space[6],
});

export const sectionLabel = style({
  display: 'inline-block',
  fontSize: vars.fontSize.xs,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: vars.space[2],
  padding: `2px ${vars.space[2]}`,
  borderRadius: vars.radius.sm,
});

export const sectionIdea = style({
  color: vars.color.accent,
  background: vars.color.accentSoft,
});
export const sectionAdvantage = style({
  color: vars.color.solution,
  background: vars.color.solutionSoft,
});
export const sectionProblem = style({
  color: vars.color.problem,
  background: vars.color.problemSoft,
});

export const sectionBody = style({
  color: vars.color.text,
  lineHeight: vars.lineHeight.normal,
  fontSize: vars.fontSize.base,
});

export const subIdeaList = style({
  marginTop: vars.space[2],
  paddingLeft: vars.space[5],
  fontSize: vars.fontSize.sm,
  color: vars.color.text,
  lineHeight: vars.lineHeight.snug,
});

export const subIdeaItem = style({
  marginBottom: vars.space[1],
});

export const readMore = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[2],
  marginTop: vars.space[4],
  padding: `${vars.space[3]} ${vars.space[5]}`,
  borderRadius: vars.radius.md,
  background: vars.color.accent,
  color: 'white',
  fontWeight: 600,
  fontSize: vars.fontSize.sm,
  letterSpacing: '-0.01em',
  border: 'none',
  boxShadow: vars.shadow.sm,
  transition: 'transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease',
  ':hover': {
    textDecoration: 'none',
    background: vars.color.accentStrong,
    transform: 'translateY(-1px)',
    boxShadow: vars.shadow.md,
  },
  ':active': {
    transform: 'translateY(0)',
    boxShadow: vars.shadow.sm,
  },
});

export const readMoreArrow = style({
  transition: 'transform 0.18s ease',
  display: 'inline-block',
  selectors: {
    [`${readMore}:hover &`]: {
      transform: 'translateX(3px)',
    },
  },
});

export const meta = style({
  marginTop: vars.space[4],
  fontSize: vars.fontSize.xs,
  color: vars.color.textFaint,
  fontStyle: 'italic',
});

export const figure = style({
  margin: `${vars.space[5]} 0 ${vars.space[6]}`,
  padding: vars.space[3],
  background: vars.color.surfaceAlt,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
});

export const figureImg = style({
  display: 'block',
  width: '100%',
  height: 'auto',
  borderRadius: vars.radius.sm,
});

export const figureCaption = style({
  marginTop: vars.space[2],
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  textAlign: 'center',
  fontStyle: 'italic',
});

export const figurePlaceholder = style({
  padding: `${vars.space[8]} ${vars.space[4]}`,
  border: `1px dashed ${vars.color.borderStrong}`,
  borderRadius: vars.radius.md,
  color: vars.color.textFaint,
  textAlign: 'center',
  fontSize: vars.fontSize.sm,
  fontStyle: 'italic',
});
