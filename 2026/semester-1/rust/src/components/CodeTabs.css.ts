import { style } from "@vanilla-extract/css";
import { vars } from "../styles/theme.css";

export const wrapper = style({
  margin: "1.5rem 0",
  borderRadius: "10px",
  overflow: "hidden",
  background: "#1e1e2e",
  border: "1px solid #313244",
});

export const caption = style({
  padding: "0.625rem 1rem",
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "#a6adc8",
  background: "#181825",
  borderBottom: "1px solid #313244",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
});

export const tabBar = style({
  display: "flex",
  background: "#181825",
  borderBottom: "1px solid #313244",
  overflowX: "auto",
  WebkitOverflowScrolling: "touch",
});

export const tab = style({
  flexShrink: 0,
  padding: "0.75rem 1.25rem",
  fontSize: "0.8rem",
  fontWeight: 600,
  fontFamily: vars.font.sans,
  color: "#6c7086",
  background: "transparent",
  border: "none",
  borderBottom: "2px solid transparent",
  cursor: "pointer",
  transition: "color 0.15s, border-color 0.15s",
  userSelect: "none",
  ":hover": {
    color: "#cdd6f4",
  },
  "@media": {
    "(max-width: 768px)": {
      padding: "0.625rem 0.875rem",
      fontSize: "0.75rem",
    },
  },
});

export const tabActive = style({
  color: "#fab387",
  borderBottomColor: "#fab387",
  background: "#1e1e2e",
});
