import { style } from "@vanilla-extract/css";
import { vars } from "../styles/theme.css";

export const nav = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "4rem",
  paddingTop: "1.5rem",
  borderTop: `1px solid ${vars.color.border}`,
  fontSize: "0.875rem",
});

export const link = style({
  color: vars.color.muted,
  fontWeight: 500,
  transition: "color 0.15s",
  ":hover": {
    color: vars.color.accent,
  },
});
