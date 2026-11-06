import { useEffect } from 'react'
import { revealCurrent } from '../app/indexToggle'
import { routePath, type PageRoute } from '../app/routes'
import { mapLayout, sectionsOf } from '../content/live'
import { labs } from '../content/structure'
import type { TopicId } from '../content/sections'
import type { Phase } from '../content/types'
import { sectionText, sectionTitle, type Content } from '../i18n/content'

/**
 * The left column on every page: each live topic under its group, and under the current topic its sections. Groups
 * fold; topics do not, since a toggle beside each link reads as a bullet and any topic's sections are one click away.
 * The path to the current topic (on a lab page, to the topics it practises) starts open, and so does everything on the
 * map. On wide screens the index is shown unless the reader hides it with the header's menu button (IndexToggle); on
 * narrow ones the reader opens it.
 */
export function SiteIndex({ content, route, phase, base }: { content: Content; route: PageRoute; phase: Phase; base: string }) {
  const { ui, lang } = content
  const current = route.kind === 'topic' ? route.topic : null
  const pathTo: readonly TopicId[] = current ? [current] : route.kind === 'lab' ? labs[route.lab].topics : []
  const opens = (topics: readonly TopicId[]) => route.kind === 'map' || topics.some((t) => pathTo.includes(t))
  useEffect(revealCurrent, [])

  const topicItem = (topic: TopicId) => {
    const here = routePath({ kind: 'topic', lang, topic }, base)
    return (
      <li key={topic} className="index-topic">
        <a href={here} aria-current={topic === current ? 'page' : undefined}>
          {content.topics[topic]!.title}
        </a>
        {topic === current && (
          <ol>
            {sectionsOf(topic).map(({ id }) => (
              <li key={id}>
                <a href={`${here}#${id}`}>{sectionTitle(content, content.sections[id], sectionText(content, topic, id)).title}</a>
              </li>
            ))}
          </ol>
        )}
      </li>
    )
  }

  return (
    <div className="index-column">
      <details className="site-index">
        <summary>{ui.index.label}</summary>
        <nav id="site-index" aria-label={ui.index.label}>
          {mapLayout(phase).map(({ group, topics }) => (
            <details key={group} className="index-group" open={opens(topics)}>
              <summary>{ui.groups[group]}</summary>
              <ul>{topics.map(topicItem)}</ul>
            </details>
          ))}
        </nav>
      </details>
    </div>
  )
}
