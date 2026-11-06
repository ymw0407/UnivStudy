import { useLocale } from "../i18n";
import { IndexPageKo } from "./IndexPage.ko";
import { IndexPageEn } from "./IndexPage.en";
import { IndexPageZh } from "./IndexPage.zh";

export function IndexPage() {
  const { locale } = useLocale();
  if (locale === "en") return <IndexPageEn />;
  if (locale === "zh") return <IndexPageZh />;
  return <IndexPageKo />;
}
