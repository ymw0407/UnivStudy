import { style } from "@vanilla-extract/css";
import { vars } from "../styles/theme.css";

export const list = style({
  listStyle: "none",
  padding: 0,
  margin: "2rem 0",
  counterReset: "step",
});

export const card = style({
  counterIncrement: "step",
  position: "relative",
  border: `1px solid ${vars.color.border}`,
  borderRadius: "12px",
  padding: "1.25rem 1.5rem 1.25rem 4.75rem",
  margin: "0.75rem 0",
  background: vars.color.bg,
  transition: "all 0.2s ease",
  ":hover": {
    borderColor: vars.color.accent,
    transform: "translateY(-2px)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
  },
  "::before": {
    content: "counter(step)",
    position: "absolute",
    left: "1.25rem",
    top: "1.25rem",
    width: "2.25rem",
    height: "2.25rem",
    borderRadius: "8px",
    background: vars.color.accent,
    color: "#fff",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.875rem",
  },
});

export const cardLink = style({
  color: vars.color.fg,
  fontWeight: 600,
  fontSize: "1rem",
  lineHeight: 1.4,
});

export const desc = style({
  display: "block",
  color: vars.color.muted,
  fontSize: "0.875rem",
  marginTop: "0.35rem",
  lineHeight: 1.65,
});

export const tags = style({
  marginTop: "0.75rem",
  display: "flex",
  flexWrap: "wrap",
  gap: "0.375rem",
});

export const tag = style({
  fontSize: "0.7rem",
  background: "#f3f4f6",
  border: `1px solid ${vars.color.border}`,
  color: vars.color.muted,
  padding: "0.15rem 0.6rem",
  borderRadius: "1rem",
  fontWeight: 500,
});
