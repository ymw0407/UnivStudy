import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type Locale = "ko" | "en" | "zh";

export const LOCALES: readonly Locale[] = ["ko", "en", "zh"] as const;

const STORAGE_KEY = "rust-wiki-locale";

function detectInitialLocale(): Locale {
  if (typeof window === "undefined") return "ko";
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "ko" || saved === "en" || saved === "zh") return saved;
  const browser = navigator.language?.toLowerCase() ?? "";
  if (browser.startsWith("zh")) return "zh";
  if (browser.startsWith("en")) return "en";
  return "ko";
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectInitialLocale);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore storage errors (private mode etc.) */
    }
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale: setLocaleState }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

// ============== Chrome strings ==============

type StringKey =
  | "nav.back"
  | "nav.contents"
  | "nav.prev"
  | "nav.next"
  | "footer.tagline"
  | "banner.translationPending.title"
  | "banner.translationPending.body"
  | "lang.label"
  | "lang.ko"
  | "lang.en"
  | "lang.zh";

const strings: Record<Locale, Record<StringKey, string>> = {
  ko: {
    "nav.back": "← 목차로 돌아가기",
    "nav.contents": "목차",
    "nav.prev": "이전",
    "nav.next": "다음",
    "footer.tagline": "2026 · 시스템 최신 기술 · Rust Course Wiki",
    "banner.translationPending.title": "본문 번역 진행 중",
    "banner.translationPending.body":
      "이 페이지의 본문은 아직 선택한 언어로 번역되지 않았습니다. 한국어 원본을 표시합니다.",
    "lang.label": "언어",
    "lang.ko": "한국어",
    "lang.en": "English",
    "lang.zh": "中文",
  },
  en: {
    "nav.back": "← Back to contents",
    "nav.contents": "Contents",
    "nav.prev": "Previous",
    "nav.next": "Next",
    "footer.tagline": "2026 · Advanced Systems · Rust Course Wiki",
    "banner.translationPending.title": "Translation in progress",
    "banner.translationPending.body":
      "This page has not been translated to your selected language yet. Showing the Korean original.",
    "lang.label": "Language",
    "lang.ko": "한국어",
    "lang.en": "English",
    "lang.zh": "中文",
  },
  zh: {
    "nav.back": "← 返回目录",
    "nav.contents": "目录",
    "nav.prev": "上一页",
    "nav.next": "下一页",
    "footer.tagline": "2026 · 系统前沿技术 · Rust Course Wiki",
    "banner.translationPending.title": "翻译进行中",
    "banner.translationPending.body":
      "本页内容尚未翻译为您选择的语言。当前显示韩语原文。",
    "lang.label": "语言",
    "lang.ko": "한국어",
    "lang.en": "English",
    "lang.zh": "中文",
  },
};

export function useT(): (key: StringKey) => string {
  const { locale } = useLocale();
  return (key) => strings[locale][key] ?? strings.ko[key] ?? key;
}
