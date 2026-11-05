// Page titles and the page language, without the components: the e2e tests check them in Node.
import { interpolate } from '../i18n/format'
import type { Lang } from '../i18n/langs'
import { labTitle, type Texts, type Ui } from '../i18n/text'
import type { PageRoute, Route } from './routes'

export function pageTitle(route: Route | null, contents: Texts): string {
  const both = (pick: (ui: Ui) => string) => `${pick(contents['zh-TW'].ui)} ${pick(contents.en.ui)}`
  if (!route) return both((ui) => ui.notFound.title)
  if (route.kind === 'root') return both((ui) => ui.siteTitle)
  const { ui, topics } = contents[route.lang]
  if (route.kind === 'map') return interpolate(ui.pageTitle.map, { site: ui.siteTitle })
  if (route.kind === 'group') return interpolate(ui.pageTitle.group, { group: ui.groups[route.group], site: ui.siteTitle })
  if (route.kind === 'lab') return interpolate(ui.pageTitle.lab, { lab: labTitle(contents[route.lang], route.lab), site: ui.siteTitle })
  return interpolate(ui.pageTitle.topic, { topic: topics[route.topic]!.title, site: ui.siteTitle })
}

/** Bilingual pages declare English on <html>; their Chinese block carries lang="zh-TW". */
export function htmlLang(route: PageRoute | null): Lang {
  return route ? route.lang : 'en'
}
