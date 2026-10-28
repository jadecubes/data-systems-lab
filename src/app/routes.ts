import { isLiveTopic, liveTopics } from '../content/live'
import type { TopicId } from '../content/sections'
import type { Phase } from '../content/types'
import { isLang, langs, type Lang } from '../i18n/langs'

export type Route = { kind: 'root' } | { kind: 'map'; lang: Lang } | { kind: 'topic'; lang: Lang; topic: TopicId }
export type PageRoute = Extract<Route, { lang: Lang }>

/** `base` starts and ends with '/'. Every path ends with '/', matching the prerendered index.html files. */
export function routePath(route: Route, base: string): string {
  if (route.kind === 'root') return base
  if (route.kind === 'map') return `${base}${route.lang}/`
  return `${base}${route.lang}/topics/${route.topic.toLowerCase()}/`
}

/** null means not found: unknown language, a topic that is not live, or any other path. */
export function parseRoute(pathname: string, base: string, phase: Phase): Route | null {
  // Static hosts serve `…/index.html` as the same page as `…/`.
  const dir = pathname.replace(/\/index\.html$/, '/')
  const path = dir.endsWith('/') ? dir : `${dir}/`
  if (!path.startsWith(base)) return null
  const parts = path.slice(base.length, -1).split('/')
  if (parts.length === 1 && parts[0] === '') return { kind: 'root' }
  const [lang, section, slug] = parts
  if (!isLang(lang)) return null
  if (parts.length === 1) return { kind: 'map', lang }
  const topic = slug?.toUpperCase()
  if (parts.length !== 3 || section !== 'topics' || slug !== slug.toLowerCase() || !isLiveTopic(topic, phase)) return null
  return { kind: 'topic', lang, topic }
}

/** Every page the app renders; the root only redirects (rootPage.ts). */
export function livePaths(phase: Phase, base: string): string[] {
  const routes = langs.flatMap((lang): PageRoute[] => [{ kind: 'map', lang }, ...liveTopics(phase).map((topic) => ({ kind: 'topic' as const, lang, topic }))])
  return routes.map((r) => routePath(r, base))
}
