import { recipe } from '@vanilla-extract/recipes';
import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const callout = recipe({
  base: {
    margin: `${vars.space[5]} 0`,
    padding: `${vars.space[4]} ${vars.space[5]}`,
    borderLeft: '4px solid',
    borderRadius: `0 ${vars.radius.md} ${vars.radius.md} 0`,
    fontSize: vars.fontSize.base,
    lineHeight: vars.lineHeight.normal,
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    columnGap: vars.space[3],
    rowGap: vars.space[1],
    alignItems: 'start',
  },
  variants: {
    kind: {
      note: {
        background: vars.color.noteBg,
        borderLeftColor: vars.color.noteBorder,
      },
      warn: {
        background: vars.color.warnBg,
        borderLeftColor: vars.color.warnBorder,
      },
      tip: {
        background: vars.color.tipBg,
        borderLeftColor: vars.color.tipBorder,
      },
      summary: {
        background: vars.color.summaryBg,
        borderLeftColor: vars.color.summaryBorder,
      },
    },
  },
  defaultVariants: { kind: 'note' },
});

export const icon = style({
  fontSize: '1.1rem',
  lineHeight: 1.4,
  gridColumn: 1,
  gridRow: '1 / span 2',
  width: '28px',
  height: '28px',
  display: 'grid',
  placeItems: 'center',
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.35)',
});

export const label = style({
  gridColumn: 2,
  fontSize: vars.fontSize.xs,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: vars.color.heading,
  opacity: 0.8,
});

export const body = style({
  gridColumn: 2,
});
// 콜아웃 내부 첫/마지막 요소의 여백 리셋
globalStyle(`${body} > p:first-child, ${body} > ul:first-child, ${body} > ol:first-child`, {
  marginTop: 0,
});
globalStyle(`${body} > p:last-child, ${body} > ul:last-child, ${body} > ol:last-child`, {
  marginBottom: 0,
});
