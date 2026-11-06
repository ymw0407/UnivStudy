import { style } from "@vanilla-extract/css";
import { vars } from "../styles/theme.css";

export const container = style({
  margin: "1.5rem 0",
  border: `1px solid ${vars.color.border}`,
  borderRadius: "10px",
  overflow: "hidden",
});

export const labels = style({
  display: "flex",
  background: "#f8f9fa",
  borderBottom: `1px solid ${vars.color.border}`,
});

export const label = style({
  flex: 1,
  padding: "0.75rem 1rem",
  textAlign: "center",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.85rem",
  color: vars.color.muted,
  userSelect: "none",
  background: "transparent",
  border: "none",
  borderBottom: "3px solid transparent",
  transition: "all 0.15s",
  selectors: {
    "&:not(:last-child)": {
      borderRight: `1px solid ${vars.color.border}`,
    },
    "&:hover": { background: "#fff", color: vars.color.fg },
  },
});

export const labelActive = style({
  background: "#fff",
  color: vars.color.accent,
  borderBottomColor: vars.color.accent,
});

export const content = style({
  padding: "1.25rem",
});
