export const langs = ['zh-TW', 'en'] as const
export type Lang = (typeof langs)[number]

export function isLang(s: string): s is Lang {
  return (langs as readonly string[]).includes(s)
}

export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'zh-TW' : 'en'
}
