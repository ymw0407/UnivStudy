import { style } from "@vanilla-extract/css";
import { vars } from "../styles/theme.css";

export const group = style({
  position: "absolute",
  top: "1.25rem",
  right: "1.25rem",
  display: "inline-flex",
  gap: "2px",
  padding: "3px",
  background: "#f1f1ef",
  border: `1px solid ${vars.color.border}`,
  borderRadius: "8px",
  fontSize: "0.75rem",
  fontFamily: vars.font.sans,
  userSelect: "none",
  zIndex: 10,
  "@media": {
    "(max-width: 768px)": {
      top: "0.75rem",
      right: "0.75rem",
      fontSize: "0.7rem",
    },
  },
});

export const button = style({
  padding: "0.35rem 0.7rem",
  background: "transparent",
  border: "none",
  borderRadius: "6px",
  color: vars.color.muted,
  fontWeight: 600,
  cursor: "pointer",
  transition: "background 0.15s, color 0.15s",
  ":hover": {
    color: vars.color.fg,
  },
});

export const active = style({
  background: "#ffffff",
  color: vars.color.accent,
  boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
});
