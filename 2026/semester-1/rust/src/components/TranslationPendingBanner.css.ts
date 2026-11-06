import { style } from "@vanilla-extract/css";
import { vars } from "../styles/theme.css";

export const banner = style({
  margin: "0 0 2rem",
  padding: "1rem 1.25rem",
  background: "#fff8e5",
  border: "1px solid #f0d787",
  borderLeft: "4px solid #e5a93b",
  borderRadius: "8px",
  fontSize: "0.9rem",
  lineHeight: 1.6,
  color: "#5b4a1a",
  fontFamily: vars.font.sans,
});

export const title = style({
  display: "block",
  fontWeight: 700,
  marginBottom: "0.25rem",
  color: "#8a5a00",
});
