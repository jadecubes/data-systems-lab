import { flushSync } from 'react-dom'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App, pageTitle } from './app/App'
import { parseRoute, routePath } from './app/routes'
import { CURRENT_PHASE } from './config'
import { contents } from './i18n/content'
import { pickLang, readStoredLang } from './i18n/pickLang'
import './styles/app.css'
import './styles/lab.css'

const base = import.meta.env.BASE_URL
const route = parseRoute(location.pathname, base, CURRENT_PHASE)

if (route?.kind === 'root') {
  // Only the dev server gets here: built sites write the root as a redirect of its own (rootPage.ts).
  location.replace(routePath({ kind: 'map', lang: pickLang(readStoredLang(), navigator.language) }, base))
} else {
  const container = document.getElementById('root')!
  const app = <App route={route} contents={contents} phase={CURRENT_PHASE} base={base} />
  // Built pages are prerendered and only hydrate. A host may serve one under an alias we do not parse
  // (for example `en//topics/t3/`); that page is already right, so it is left as served. The dev server
  // serves the empty template, which is rendered from the route.
  if (!container.firstElementChild) {
    document.title = pageTitle(route, contents)
    // Synchronously, so the header exists when it is measured below.
    flushSync(() => createRoot(container).render(app))
  } else if (route) hydrateRoot(container, app)
  // Left as served, the page has no menu button, so an index the reader hid elsewhere must show here (it appears
  // once this script runs, moving the page; these aliases are rare, and an index with no way back is worse).
  else delete document.documentElement.dataset.index

  // CSS cannot read the sticky header's height, which grows when it wraps; section links and the index start below it.
  const header = document.querySelector<HTMLElement>('.site-header')
  if (header) {
    // On a fresh visit, a linked section was scrolled to before the height was known, so it is scrolled to again once
    // measured. A reload or a return keeps the place the browser restores.
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    let rescroll = navigation?.type === 'navigate'
    new ResizeObserver(() => {
      document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`)
      if (rescroll) document.querySelector(':target')?.scrollIntoView()
      rescroll = false
    }).observe(header)
  }
}
