import { isLang, type Lang } from './langs'

export const LANG_KEY = 'data-systems-lab.lang'

/** A choice the reader made wins; otherwise any Chinese browser gets zh-TW and everyone else English. */
export function pickLang(stored: string | null, browserLanguage: string | undefined): Lang {
  if (stored && isLang(stored)) return stored
  return browserLanguage?.toLowerCase().startsWith('zh') ? 'zh-TW' : 'en'
}

// Storage can throw (private windows, blocked site data); the language choice is a convenience only.
export function readStoredLang(): string | null {
  try {
    return localStorage.getItem(LANG_KEY)
  } catch {
    return null
  }
}

export function storeLang(lang: Lang): void {
  try {
    localStorage.setItem(LANG_KEY, lang)
  } catch {
    // Without storage the root page falls back to the browser language.
  }
}
