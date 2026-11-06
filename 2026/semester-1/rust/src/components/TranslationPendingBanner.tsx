import { useLocale, useT } from "../i18n";
import * as s from "./TranslationPendingBanner.css";

export function TranslationPendingBanner() {
  const { locale } = useLocale();
  const t = useT();
  if (locale === "ko") return null;
  return (
    <div className={s.banner} role="note">
      <strong className={s.title}>{t("banner.translationPending.title")}</strong>
      {t("banner.translationPending.body")}
    </div>
  );
}
