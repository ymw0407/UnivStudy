import { globalStyle } from "@vanilla-extract/css";
import { vars } from "./theme.css";

globalStyle("*, *::before, *::after", {
  boxSizing: "border-box",
});

globalStyle("html", {
  fontSize: "16px",
  scrollBehavior: "smooth",
});

globalStyle("body", {
  margin: 0,
  padding: 0,
  background: vars.color.bg,
  color: vars.color.fg,
  fontFamily: vars.font.sans,
  lineHeight: 1.9,
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
  wordBreak: "keep-all",
  overflowWrap: "break-word",
});

/* ── Links ── */

globalStyle("a", {
  color: vars.color.accent,
  textDecoration: "none",
  transition: "color 0.15s",
});

globalStyle("a:hover", {
  textDecoration: "underline",
});

/* ── Headings ── */

globalStyle("h1, h2, h3, h4", {
  lineHeight: 1.4,
  wordBreak: "keep-all",
});

globalStyle("h2", {
  fontSize: "1.35rem",
  fontWeight: 700,
  marginTop: "3rem",
  marginBottom: "0.75rem",
  paddingBottom: "0.6rem",
  borderBottom: `2px solid ${vars.color.border}`,
  color: vars.color.fg,
});

globalStyle("h3", {
  fontSize: "1.1rem",
  fontWeight: 700,
  marginTop: "2.25rem",
  marginBottom: "0.5rem",
  color: vars.color.fg,
  letterSpacing: "-0.01em",
});

/* ── Body text ── */

globalStyle("p", {
  margin: "0.9rem 0",
  fontSize: "0.975rem",
  lineHeight: 2,
  color: "#333",
  wordBreak: "keep-all",
});

globalStyle("strong", {
  fontWeight: 700,
  color: vars.color.fg,
});

/* ── Lists ── */

globalStyle("ul, ol", {
  paddingLeft: "1.5rem",
  margin: "0.75rem 0",
});

globalStyle("li", {
  marginBottom: "0.5rem",
  fontSize: "0.975rem",
  lineHeight: 1.9,
  color: "#333",
});

globalStyle("li > ul, li > ol", {
  marginTop: "0.25rem",
  marginBottom: "0.25rem",
});

/* ── Inline code ── */

globalStyle("code", {
  fontFamily: vars.font.mono,
  fontSize: "0.875em",
});

globalStyle(":not(pre) > code", {
  background: "#f3f4f6",
  padding: "0.15em 0.45em",
  borderRadius: "4px",
  color: "#e11d48",
  fontWeight: 500,
  fontSize: "0.85em",
});

/* ── Code blocks (fallback, CodeBlock 컴포넌트가 덮어씀) ── */

globalStyle("pre", {
  background: "#1e1e2e",
  border: "none",
  borderRadius: "10px",
  padding: "1.25rem",
  overflowX: "auto",
  fontFamily: vars.font.mono,
  fontSize: "0.84rem",
  lineHeight: 1.7,
  color: "#cdd6f4",
  margin: "1.5rem 0",
});

/* ── Tables ── */

globalStyle("table", {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
  margin: "1.5rem 0",
  fontSize: "0.9rem",
  border: `1px solid ${vars.color.border}`,
  borderRadius: "8px",
  overflow: "hidden",
});

globalStyle("th, td", {
  padding: "0.7rem 1rem",
  textAlign: "left",
});

globalStyle("th", {
  background: "#f8f9fa",
  fontWeight: 600,
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: vars.color.muted,
  borderBottom: `2px solid ${vars.color.border}`,
});

globalStyle("td", {
  borderBottom: `1px solid ${vars.color.border}`,
});

globalStyle("tr:last-child td", {
  borderBottom: "none",
});

/* ── hr ── */

globalStyle("hr", {
  border: "none",
  borderTop: `1px solid ${vars.color.border}`,
  margin: "3rem 0",
});
