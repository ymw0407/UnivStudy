import { useLocale, type Locale } from "../i18n";
import * as s from "./LanguageSelector.css";

const OPTIONS: Array<{ value: Locale; label: string }> = [
  { value: "ko", label: "한국어" },
  { value: "en", label: "EN" },
  { value: "zh", label: "中文" },
];

export function LanguageSelector() {
  const { locale, setLocale } = useLocale();

  return (
    <div className={s.group} role="radiogroup" aria-label="Language">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={locale === opt.value}
          className={`${s.button} ${locale === opt.value ? s.active : ""}`}
          onClick={() => setLocale(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
