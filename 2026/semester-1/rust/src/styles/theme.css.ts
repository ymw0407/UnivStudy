import { createGlobalTheme } from "@vanilla-extract/css";

export const vars = createGlobalTheme(":root", {
  color: {
    bg: "#ffffff",
    fg: "#1a1a1a",
    muted: "#6b6b6b",
    border: "#e5e5e5",
    accent: "#ce422b",
    accentSoft: "#fdecea",
    codeBg: "#f6f6f4",
    cardBg: "#fafafa",
    docsRefBg: "#f4f8fb",
    docsRefBorder: "#d9e6f0",
    docsRefAccent: "#2c6cb0",
  },
  font: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", Consolas, Menlo, monospace',
  },
  size: {
    maxWidth: "760px",
  },
});
