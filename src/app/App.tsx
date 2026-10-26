import { LanguageSwitch } from '../components/LanguageSwitch'
import { MapPage } from '../components/MapPage'
import { NotFoundPage } from '../components/NotFoundPage'
import { SiteIndex } from '../components/SiteIndex'
import { TopicPage } from '../components/TopicPage'
import type { Phase } from '../content/types'
import type { Contents, Ui } from '../i18n/content'
import { interpolate } from '../i18n/format'
import type { Lang } from '../i18n/langs'
import { routePath, type PageRoute, type Route } from './routes'

/** A null route is the not-found page. The root has no page of its own; see rootPage.ts. */
export function App({ route, contents, phase, base }: { route: PageRoute | null; contents: Contents; phase: Phase; base: string }) {
  if (!route) {
    return (
      <main className="page">
        <NotFoundPage contents={contents} base={base} />
      </main>
    )
  }
  const content = contents[route.lang]
  return (
    <>
      <a className="skip-link" href={`${routePath(route, base)}#main`}>
        {content.ui.index.skip}
      </a>
      <header className="site-header">
        <a className="site-name" href={routePath({ kind: 'map', lang: route.lang }, base)} aria-current={route.kind === 'map' ? 'page' : undefined}>
          {content.ui.siteTitle}
        </a>
        <LanguageSwitch route={route} contents={contents} base={base} />
      </header>
      <div className="layout">
        <SiteIndex content={content} route={route} phase={phase} base={base} />
        <main id="main">
          {route.kind === 'map' ? (
            <MapPage content={content} phase={phase} base={base} />
          ) : (
            <TopicPage content={content} topic={route.topic} phase={phase} base={base} />
          )}
        </main>
      </div>
    </>
  )
}

export function pageTitle(route: Route | null, contents: Contents): string {
  const both = (pick: (ui: Ui) => string) => `${pick(contents['zh-TW'].ui)} ${pick(contents.en.ui)}`
  if (!route) return both((ui) => ui.notFound.title)
  if (route.kind === 'root') return both((ui) => ui.siteTitle)
  const { ui, topics } = contents[route.lang]
  if (route.kind === 'map') return interpolate(ui.pageTitle.map, { site: ui.siteTitle })
  return interpolate(ui.pageTitle.topic, { topic: topics[route.topic]!.title, site: ui.siteTitle })
}

/** Bilingual pages declare English on <html>; their Chinese block carries lang="zh-TW". */
export function htmlLang(route: PageRoute | null): Lang {
  return route ? route.lang : 'en'
}
