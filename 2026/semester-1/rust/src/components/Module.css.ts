import { style } from "@vanilla-extract/css";
import { vars } from "../styles/theme.css";

export const module = style({
  marginTop: "3.5rem",
  paddingTop: "2.5rem",
  borderTop: `1px solid ${vars.color.border}`,
});

export const moduleHeader = style({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  marginBottom: "1.25rem",
});

export const badge = style({
  fontFamily: vars.font.mono,
  fontSize: "0.75rem",
  background: vars.color.accent,
  color: "#fff",
  padding: "0.25rem 0.625rem",
  borderRadius: "6px",
  fontWeight: 700,
  flexShrink: 0,
  letterSpacing: "0.03em",
});

export const moduleTitle = style({
  margin: 0,
  border: "none",
  padding: 0,
  fontSize: "1.3rem",
  fontWeight: 700,
  lineHeight: 1.35,
  color: vars.color.fg,
});

export const plainTitle = style({
  fontSize: "1.3rem",
  fontWeight: 700,
  marginTop: 0,
  marginBottom: "1rem",
  paddingBottom: "0.75rem",
  borderBottom: `2px solid ${vars.color.accent}`,
  lineHeight: 1.35,
  color: vars.color.fg,
});
