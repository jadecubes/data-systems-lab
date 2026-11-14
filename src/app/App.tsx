import { GroupPage } from '../components/GroupPage'
import { IndexToggle } from '../components/IndexToggle'
import { LabPage } from '../components/LabPage'
import { LanguageSwitch } from '../components/LanguageSwitch'
import { MapPage } from '../components/MapPage'
import { NotFoundPage } from '../components/NotFoundPage'
import { SiteIndex } from '../components/SiteIndex'
import { TopicPage } from '../components/TopicPage'
import type { Phase } from '../content/types'
import type { Contents } from '../i18n/content'
import { routePath, type PageRoute } from './routes'

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
        <IndexToggle content={content} />
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
          ) : route.kind === 'group' ? (
            <GroupPage content={content} group={route.group} phase={phase} base={base} />
          ) : route.kind === 'lab' ? (
            <LabPage content={content} lab={route.lab} phase={phase} base={base} />
          ) : (
            <TopicPage content={content} topic={route.topic} phase={phase} base={base} />
          )}
        </main>
      </div>
    </>
  )
}

export { htmlLang, pageTitle } from './title'
