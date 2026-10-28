import { codeKeys } from '../content/types'
import { contentFor, type Content } from '../i18n/content'
import { langs, type Lang } from '../i18n/langs'

/** Wraps every string except fields named in `codes` (ids and codes are data, not text). */
function wrap<T>(value: T, codes: ReadonlySet<string> = new Set(), key = ''): T {
  if (typeof value === 'string') return (codes.has(key) ? value : `⟦${value}⟧`) as T
  if (Array.isArray(value)) return value.map((v) => wrap(v, codes, key)) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, wrap(v, codes, k)])) as T
  }
  return value
}

/** A fake locale: every string a page can show comes back as ⟦…⟧, so any unwrapped text was hard-coded. */
export function pseudoContents(): Record<Lang, Content> {
  return Object.fromEntries(
    langs.map((lang) => {
      const c = contentFor(lang)
      return [
        lang,
        {
          ...c,
          ui: wrap(c.ui),
          topics: wrap(c.topics, new Set(codeKeys)),
          sections: wrap(c.sections, new Set(['id', 'topic', 'product', 'platform'])),
          number: (n: number) => `⟦${c.number(n)}⟧`,
        },
      ]
    }),
  ) as Record<Lang, Content>
}

/** Text left after removing every (possibly nested) ⟦…⟧, trimmed. */
export function unwrapped(text: string): string {
  let rest = text
  for (let prev = ''; prev !== rest; ) {
    prev = rest
    rest = rest.replace(/⟦[^⟦⟧]*⟧/g, '')
  }
  return rest.trim()
}
