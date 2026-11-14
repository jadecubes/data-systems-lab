import { routePath } from '../app/routes'
import { labOf, sectionsOf } from '../content/live'
import type { TopicId } from '../content/sections'
import type { Phase } from '../content/types'
import { labTitle, sectionText, sectionTitle, type Content } from '../i18n/content'
import { interpolate } from '../i18n/format'

/**
 * A topic on the map and on its group's page. Folded, it shows its title and what it teaches; unfolded, its summary
 * and sections. The read link sits outside the <summary>, so it opens the topic in one click either way and is never a
 * control inside a control.
 */
export function TopicCard({ content, topic, phase, base }: { content: Content; topic: TopicId; phase: Phase; base: string }) {
  const { ui, lang } = content
  const text = content.topics[topic]!
  const here = routePath({ kind: 'topic', lang, topic }, base)
  const lab = labOf(topic, phase)
  return (
    <li className="card">
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
        {lab && (
          <p className="lab-link">
            <a href={routePath({ kind: 'lab', lang, lab }, base)}>{interpolate(ui.lab.link, { title: labTitle(content, lab) })}</a>
          </p>
        )}
      </details>
    </li>
  )
}
