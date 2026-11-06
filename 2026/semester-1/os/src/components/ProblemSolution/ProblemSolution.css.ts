import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: vars.space[3],
  margin: `${vars.space[5]} 0`,
});

export const cell = style({
  padding: `${vars.space[4]} ${vars.space[5]}`,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
});

export const cellProblem = style({
  background: vars.color.problemSoft,
  borderColor: vars.color.problem,
});
export const cellSolution = style({
  background: vars.color.solutionSoft,
  borderColor: vars.color.solution,
});
export const cellLimitation = style({
  background: vars.color.limitationSoft,
  borderColor: vars.color.limitation,
});

export const label = style({
  fontSize: vars.fontSize.xs,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
});

export const labelProblem = style({ color: vars.color.problem });
export const labelSolution = style({ color: vars.color.solution });
export const labelLimitation = style({ color: vars.color.limitation });

export const body = style({
  fontSize: vars.fontSize.base,
  lineHeight: vars.lineHeight.snug,
  color: vars.color.text,
});
