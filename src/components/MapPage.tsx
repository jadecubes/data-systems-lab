import { Fragment } from 'react'
import { mapLayout } from '../content/live'
import type { Phase } from '../content/types'
import type { Content } from '../i18n/content'
import { TopicCard } from './TopicCard'

export function MapPage({ content, phase, base }: { content: Content; phase: Phase; base: string }) {
  const { ui } = content
  return (
    <>
      <h1>{ui.siteTitle}</h1>
      <p className="lead">{ui.mapIntro}</p>
      <p className="book-source">{ui.bookSource}</p>
      {mapLayout(phase).map(({ group, topics }) => (
        <Fragment key={group}>
          <h2>{ui.groups[group]}</h2>
          <ul className="cards">
            {topics.map((topic) => (
              <TopicCard key={topic} content={content} topic={topic} phase={phase} base={base} />
            ))}
          </ul>
        </Fragment>
      ))}
    </>
  )
}
