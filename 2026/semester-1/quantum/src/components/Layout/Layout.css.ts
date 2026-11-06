import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const shell = style({
  minHeight: '100vh',
  paddingTop: vars.size.header,
  paddingLeft: vars.size.sidebar,
  '@media': {
    '(max-width: 900px)': {
      paddingLeft: 0,
    },
  },
});

export const headerArea = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 50,
});

export const sidebarArea = style({
  position: 'fixed',
  top: vars.size.header,
  left: 0,
  bottom: 0,
  width: vars.size.sidebar,
  background: vars.color.surfaceAlt,
  borderRight: `1px solid ${vars.color.border}`,
  overflowY: 'auto',
  overflowX: 'hidden',
  zIndex: 40,
  '@media': {
    '(max-width: 900px)': {
      display: 'none',
    },
  },
});

export const mainArea = style({
  padding: `${vars.space[8]} ${vars.space[8]}`,
  minWidth: 0,
  maxWidth: '100%',
  '@media': {
    '(max-width: 900px)': {
      padding: `${vars.space[5]} ${vars.space[4]}`,
    },
  },
});

export const footer = style({
  marginTop: vars.space[20],
  padding: `${vars.space[6]} 0`,
  borderTop: `1px solid ${vars.color.border}`,
  color: vars.color.textFaint,
  fontSize: vars.fontSize.sm,
  textAlign: 'center',
});
