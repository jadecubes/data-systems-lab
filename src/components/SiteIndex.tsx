import { routePath, type PageRoute } from '../app/routes'
import { mapLayout } from '../content/live'
import { labs } from '../content/structure'
import type { TopicId } from '../content/sections'
import type { Phase } from '../content/types'
import type { Content } from '../i18n/content'

/**
 * The left column on every page: one short list of the live groups, each opening its own page. The current group is
 * marked: the page itself, or the group of the current topic (on a lab page, of the topics it practises). Topics live
 * on the map and the group pages, sections on their topic page, so nothing here folds. On wide screens the index is
 * shown unless the reader hides it with the header's menu button (IndexToggle); on narrow ones the reader opens it.
 */
export function SiteIndex({ content, route, phase, base }: { content: Content; route: PageRoute; phase: Phase; base: string }) {
  const { ui, lang } = content
  const currentTopics: readonly TopicId[] = route.kind === 'topic' ? [route.topic] : route.kind === 'lab' ? labs[route.lab].topics : []
  return (
    <div className="index-column">
      <details className="site-index">
        <summary>{ui.index.label}</summary>
        <nav id="site-index" aria-label={ui.index.label}>
          <ul>
            {mapLayout(phase).map(({ group, topics }) => (
              <li key={group}>
                <a
                  href={routePath({ kind: 'group', lang, group }, base)}
                  aria-current={route.kind === 'group' && route.group === group ? 'page' : topics.some((t) => currentTopics.includes(t)) || undefined}
                >
                  {ui.groups[group]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </details>
    </div>
  )
}
