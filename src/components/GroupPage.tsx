import { mapLayout } from '../content/live'
import type { GroupId, Phase } from '../content/types'
import type { Content } from '../i18n/content'
import { TopicCard } from './TopicCard'

/** One group's topics, opened from the site index; the map still shows every group. */
export function GroupPage({ content, group, phase, base }: { content: Content; group: GroupId; phase: Phase; base: string }) {
  const topics = mapLayout(phase).find((g) => g.group === group)!.topics
  return (
    <>
      <h1>{content.ui.groups[group]}</h1>
      <ul className="cards">
        {topics.map((topic) => (
          <TopicCard key={topic} content={content} topic={topic} phase={phase} base={base} />
        ))}
      </ul>
    </>
  )
}
