import { style } from "@vanilla-extract/css";
import { vars } from "../styles/theme.css";

export const container = style({
  borderLeft: `4px solid ${vars.color.accent}`,
  background: "#fef7f6",
  padding: "1rem 1.25rem",
  margin: "2rem 0",
  borderRadius: "0 8px 8px 0",
  fontSize: "0.9rem",
  lineHeight: 1.8,
  color: "#444",
});

export const title = style({
  display: "block",
  marginBottom: "0.35rem",
  fontWeight: 700,
  color: vars.color.accent,
  fontSize: "0.9rem",
});
