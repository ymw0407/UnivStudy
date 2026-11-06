import { useLocale } from "../i18n";
import { Step2SetupKo } from "./Step2Setup.ko";
import { Step2SetupEn } from "./Step2Setup.en";
import { Step2SetupZh } from "./Step2Setup.zh";

export function Step2Setup() {
  const { locale } = useLocale();
  if (locale === "en") return <Step2SetupEn />;
  if (locale === "zh") return <Step2SetupZh />;
  return <Step2SetupKo />;
}
