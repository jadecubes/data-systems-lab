import { Fragment } from 'react'
import { routePath } from '../app/routes'
import { mapLayout, sectionsOf } from '../content/live'
import type { TopicId } from '../content/sections'
import type { Phase } from '../content/types'
import { sectionText, sectionTitle, type Content } from '../i18n/content'
import { interpolate } from '../i18n/format'

export function MapPage({ content, phase, base }: { content: Content; phase: Phase; base: string }) {
  const { ui, lang } = content

  // Folded, a card shows its title and what it teaches; unfolded, its summary and sections. The read link sits
  // outside the <summary>, so it opens the topic in one click either way and is never a control inside a control.
  const card = (topic: TopicId) => {
    const text = content.topics[topic]!
    const here = routePath({ kind: 'topic', lang, topic }, base)
    return (
      <li key={topic} className="card">
        {/* First in the DOM: Tab reaches it before the card's toggle and section links, as it is drawn top-right. */}
        <a className="card-read" href={here} aria-label={interpolate(ui.card.readLabel, { topic: text.title })}>
          {ui.card.read}
        </a>
        <details>
          <summary>
            <span className="card-title">{text.title}</span>
            <span className="visually-hidden">{ui.card.learn}</span>
            <span className="learn-tags">
              {text.tags.map((tag) => (
                <span key={tag} className="learn-tag">
                  {tag}
                </span>
              ))}
            </span>
          </summary>
          <p>{text.summary}</p>
          <ol className="card-sections">
            {sectionsOf(topic).map(({ id }) => (
              <li key={id}>
                <a href={`${here}#${id}`}>{sectionTitle(content, content.sections[id], sectionText(content, topic, id)).title}</a>
              </li>
            ))}
          </ol>
        </details>
      </li>
    )
  }

  // Groups are the top level while one zone is live; zone headings come with the second zone (phase 4).
  return (
    <>
      <h1>{ui.siteTitle}</h1>
      <p className="lead">{ui.mapIntro}</p>
      {mapLayout(phase).flatMap(({ zone, groups }) =>
        groups.map(({ group, topics }) => (
          <Fragment key={group ?? zone}>
            {group && <h2>{ui.groups[group]}</h2>}
            <ul className="cards">{topics.map(card)}</ul>
          </Fragment>
        )),
      )}
    </>
  )
}
