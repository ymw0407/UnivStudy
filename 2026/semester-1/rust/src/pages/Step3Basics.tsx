import { useLocale } from "../i18n";
import { Step3BasicsKo } from "./Step3Basics.ko";
import { Step3BasicsEn } from "./Step3Basics.en";
import { Step3BasicsZh } from "./Step3Basics.zh";

export function Step3Basics() {
  const { locale } = useLocale();
  if (locale === "en") return <Step3BasicsEn />;
  if (locale === "zh") return <Step3BasicsZh />;
  return <Step3BasicsKo />;
}
