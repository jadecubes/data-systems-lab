import { useEffect, useState } from 'react'
import { isIndexHidden, setIndexHidden } from '../app/indexToggle'
import { routePath, type PageRoute } from '../app/routes'
import { groupOf, mapLayout, sectionsOf } from '../content/live'
import type { TopicId } from '../content/sections'
import type { Phase } from '../content/types'
import { sectionText, sectionTitle, type Content } from '../i18n/content'
import { interpolate } from '../i18n/format'

/**
 * The left column on every map and topic page: each live topic under its group (zones come with the second
 * zone, in phase 4). Groups and each topic's sections fold. The path to the current topic starts open, and so
 * does every group on the map. On wide screens the index is shown unless the reader hides it with the button above it; on
 * narrow ones the reader opens it. The menu button needs JavaScript, so the prerendered page leaves it out.
 */
export function SiteIndex({ content, route, phase, base }: { content: Content; route: PageRoute; phase: Phase; base: string }) {
  const { ui, lang } = content
  const current = route.kind === 'topic' ? route.topic : null
  const currentGroup = current && groupOf(current)
  const onMap = route.kind === 'map'
  // Null until scripts run; then whether the index is hidden.
  const [hidden, setHidden] = useState<boolean | null>(null)
  useEffect(() => setHidden(isIndexHidden()), [])
  // Read from the page, not from state, so the button always does what the reader sees it should.
  const toggle = () => {
    const next = !isIndexHidden()
    setIndexHidden(next)
    setHidden(next)
  }

  const topicItem = (topic: TopicId) => {
    const here = routePath({ kind: 'topic', lang, topic }, base)
    const title = content.topics[topic]!.title
    // The toggle and the link are siblings: a link inside a <summary> would be a control inside a control.
    return (
      <li key={topic} className="index-topic">
        <details open={topic === current}>
          <summary aria-label={interpolate(ui.index.sections, { topic: title })} />
        </details>
        <a href={here} aria-current={topic === current ? 'page' : undefined}>
          {title}
        </a>
        <ol>
          {sectionsOf(topic).map(({ id }) => (
            <li key={id}>
              <a href={`${here}#${id}`}>{sectionTitle(content, content.sections[id], sectionText(content, topic, id)).title}</a>
            </li>
          ))}
        </ol>
      </li>
    )
  }

  return (
    <div className="index-column">
      {hidden !== null && (
        // An icon alone; the title shows its name on hover, the aria-label gives it to screen readers.
        <button
          type="button"
          className="index-toggle"
          aria-label={ui.index.label}
          title={ui.index.label}
          aria-controls="site-index"
          aria-expanded={!hidden}
          onClick={toggle}
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
            <path d="M2 3.5h12M2 8h12M2 12.5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
      <details className="site-index">
        <summary>{ui.index.label}</summary>
        <nav id="site-index" aria-label={ui.index.label}>
          {mapLayout(phase).flatMap(({ zone, groups }) =>
            groups.map(({ group, topics }) =>
              group ? (
                <details key={group} className="index-group" open={onMap || group === currentGroup}>
                  <summary>{ui.groups[group]}</summary>
                  <ul>{topics.map(topicItem)}</ul>
                </details>
              ) : (
                <ul key={zone}>{topics.map(topicItem)}</ul>
              ),
            ),
          )}
        </nav>
      </details>
    </div>
  )
}
