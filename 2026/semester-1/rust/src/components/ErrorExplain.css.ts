import { style } from "@vanilla-extract/css";
import { vars } from "../styles/theme.css";

export const container = style({
  margin: "2rem 0",
  border: `1px solid ${vars.color.border}`,
  borderRadius: "10px",
  overflow: "hidden",
});

export const errHead = style({
  background: "#2b2b2b",
  color: "#ff6b6b",
  fontFamily: vars.font.mono,
  fontSize: "0.78rem",
  padding: "0.6rem 1rem",
  letterSpacing: "0.03em",
  fontWeight: 600,
});

export const errPre = style({
  margin: 0,
  border: "none",
  borderRadius: 0,
  background: "#1e1e1e",
  color: "#e6e6e6",
  fontSize: "0.78rem",
  lineHeight: 1.65,
  padding: "1rem",
  boxShadow: "none",
});

export const errExplain = style({
  background: "#fffcf0",
  borderTop: `1px solid ${vars.color.border}`,
  padding: "1rem 1.25rem",
  fontSize: "0.925rem",
  lineHeight: 1.9,
  color: "#444",
});
