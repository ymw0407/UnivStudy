import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import * as s from "./Layout.css";
import { LanguageSelector } from "./LanguageSelector";
import { useT } from "../i18n";

interface LayoutProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  showBackToToc?: boolean;
  children: ReactNode;
}

export function Layout({
  kicker,
  title,
  subtitle: sub,
  showBackToToc = true,
  children,
}: LayoutProps) {
  const t = useT();
  return (
    <>
      <header className={s.header}>
        <LanguageSelector />
        {kicker && <div className={s.kicker}>{kicker}</div>}
        <h1 className={s.headerTitle}>{title}</h1>
        {sub && <p className={s.subtitle}>{sub}</p>}
      </header>
      <main className={s.main}>
        {showBackToToc && (
          <Link className={s.backToToc} to="/">
            {t("nav.back")}
          </Link>
        )}
        {children}
      </main>
      <footer className={s.footer}>{t("footer.tagline")}</footer>
    </>
  );
}

export function Lede({ children }: { children: ReactNode }) {
  return <p className={s.lede}>{children}</p>;
}
