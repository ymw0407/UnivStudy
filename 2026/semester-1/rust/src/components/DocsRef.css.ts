import { style } from "@vanilla-extract/css";
import { vars } from "../styles/theme.css";

export const container = style({
  marginTop: "2rem",
  padding: "1rem 1.25rem",
  background: "#f7fafc",
  border: `1px solid #e2e8f0`,
  borderLeft: `4px solid ${vars.color.docsRefAccent}`,
  borderRadius: "0 8px 8px 0",
  fontSize: "0.875rem",
});

export const title = style({
  display: "block",
  marginBottom: "0.5rem",
  color: vars.color.docsRefAccent,
  fontWeight: 700,
  fontSize: "0.875rem",
});

export const list = style({
  margin: 0,
  paddingLeft: "1.125rem",
});

export const link = style({
  color: vars.color.docsRefAccent,
  fontWeight: 500,
  lineHeight: 1.8,
  ":hover": {
    textDecoration: "underline",
  },
});
