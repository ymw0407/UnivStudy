import { useLocale } from "../i18n";
import { Step1IntroKo } from "./Step1Intro.ko";
import { Step1IntroEn } from "./Step1Intro.en";
import { Step1IntroZh } from "./Step1Intro.zh";

export function Step1Intro() {
  const { locale } = useLocale();
  if (locale === "en") return <Step1IntroEn />;
  if (locale === "zh") return <Step1IntroZh />;
  return <Step1IntroKo />;
}
