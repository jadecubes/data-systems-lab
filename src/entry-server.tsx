import { renderToString } from 'react-dom/server'
import { App, htmlLang, pageTitle } from './app/App'
import { rootPage } from './app/rootPage'
import { livePaths, parseRoute } from './app/routes'
import { CURRENT_PHASE } from './config'
import { contents } from './i18n/content'

/** Used by scripts/prerender.mjs. A null pathname renders the not-found page. */
export function renderPage(pathname: string | null, base: string) {
  const route = pathname === null ? null : parseRoute(pathname, base, CURRENT_PHASE)
  if (route?.kind === 'root') throw new Error('the root is written by renderRoot')
  return {
    html: renderToString(<App route={route} contents={contents} phase={CURRENT_PHASE} base={base} />),
    title: pageTitle(route, contents),
    lang: htmlLang(route),
  }
}

/** The whole root document: it only redirects. */
export function renderRoot(base: string): string {
  return rootPage(base, pageTitle({ kind: 'root' }, contents))
}

export function paths(base: string): string[] {
  return livePaths(CURRENT_PHASE, base)
}
