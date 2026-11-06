import { style } from "@vanilla-extract/css";
import { vars } from "../styles/theme.css";

export const list = style({
  listStyle: "none",
  padding: "1rem 0 0",
  margin: "1.75rem 0",
  borderTop: `1px dashed ${vars.color.border}`,
});

export const item = style({
  padding: "0.4rem 0 0.4rem 2rem",
  position: "relative",
  fontSize: "0.925rem",
  lineHeight: 1.8,
  color: "#444",
  "::before": {
    content: '"✅"',
    position: "absolute",
    left: 0,
    top: "0.4rem",
  },
});
