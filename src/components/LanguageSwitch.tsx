import { useEffect, useState } from 'react'
import { routePath, type PageRoute } from '../app/routes'
import type { Contents } from '../i18n/content'
import { langs, otherLang, type Lang } from '../i18n/langs'
import { storeLang } from '../i18n/pickLang'

/**
 * A select of every language that opens the same page in the chosen one, and remembers the choice for `/`.
 * The prerendered page shows a plain link instead, because a select cannot navigate without JavaScript; the
 * select replaces it once scripts run. It lands at the top of the page: the switch sits in the header, so the
 * reader has scrolled up to reach it.
 */
export function LanguageSwitch({ route, contents, base }: { route: PageRoute; contents: Contents; base: string }) {
  const label = contents[route.lang].ui.languageSwitchLabel
  const [scripted, setScripted] = useState(false)
  useEffect(() => setScripted(true), [])
  const go = (lang: Lang) => {
    storeLang(lang)
    location.assign(routePath({ ...route, lang }, base))
  }
  const target = otherLang(route.lang)
  return (
    <nav className="language-switch" aria-label={label}>
      {scripted ? (
        // Controlled by the page's language, so the select never names a language the page is not in.
        <select aria-label={label} autoComplete="off" value={route.lang} onChange={(e) => go(e.target.value as Lang)}>
          {langs.map((lang) => (
            <option key={lang} value={lang} lang={lang}>
              {contents[lang].ui.langName}
            </option>
          ))}
        </select>
      ) : (
        <a href={routePath({ ...route, lang: target }, base)} lang={target} hrefLang={target} onClick={() => storeLang(target)}>
          {contents[target].ui.langName}
        </a>
      )}
    </nav>
  )
}
