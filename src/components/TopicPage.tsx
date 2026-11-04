import { routePath } from '../app/routes'
import { neighbours, sectionsOf } from '../content/live'
import type { TopicId } from '../content/sections'
import type { Phase } from '../content/types'
import { sectionText, type Content } from '../i18n/content'
import { interpolate } from '../i18n/format'
import { SectionBlock } from './SectionBlock'

export function TopicPage({ content, topic, phase, base }: { content: Content; topic: TopicId; phase: Phase; base: string }) {
  const { ui, lang } = content
  const text = content.topics[topic]!
  // Section data comes through `content`, like every other string on the page.
  const blocks = sectionsOf(topic).map(({ id }) => ({ meta: content.sections[id], text: sectionText(content, topic, id) }))
  const { prev, next } = neighbours(topic, phase)
  const link = (t: TopicId) => routePath({ kind: 'topic', lang, topic: t }, base)
  return (
    <>
      <h1>{text.title}</h1>
      <p className="lead">{text.summary}</p>
      <div className="learn">
        <span id="learn-label" className="learn-label">
          {ui.card.learn}
        </span>
        <ul className="learn-tags" aria-labelledby="learn-label">
          {text.tags.map((tag) => (
            <li key={tag} className="learn-tag">
              {tag}
            </li>
          ))}
        </ul>
      </div>
      {blocks.map(({ meta, text }) => (
        <SectionBlock key={meta.id} content={content} meta={meta} text={text} />
      ))}
      <nav className="pager" aria-label={ui.nav.label}>
        {prev && (
          <a className="pager-prev" href={link(prev)}>
            {interpolate(ui.nav.prev, { title: content.topics[prev]!.title })}
          </a>
        )}
        <a className="pager-map" href={routePath({ kind: 'map', lang }, base)}>
          {ui.nav.map}
        </a>
        {next && (
          <a className="pager-next" href={link(next)}>
            {interpolate(ui.nav.next, { title: content.topics[next]!.title })}
          </a>
        )}
      </nav>
    </>
  )
}
