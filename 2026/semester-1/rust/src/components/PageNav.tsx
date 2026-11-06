import { Link } from "react-router-dom";
import * as s from "./PageNav.css";
import { useT } from "../i18n";

interface PageNavProps {
  prev?: { to: string; label?: string };
  next?: { to: string; label?: string };
}

export function PageNav({ prev, next }: PageNavProps) {
  const t = useT();
  return (
    <nav className={s.nav}>
      {prev ? (
        <Link className={s.link} to={prev.to}>
          ← {prev.label ?? t("nav.prev")}
        </Link>
      ) : (
        <span />
      )}
      <Link className={s.link} to="/">
        {t("nav.contents")}
      </Link>
      {next ? (
        <Link className={s.link} to={next.to}>
          {next.label ?? t("nav.next")} →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
