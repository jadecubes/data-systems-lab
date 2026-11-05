// Queries that only ever return what is live in a phase, so no screen can link to an unpublished page.
import { sections, type TopicId } from './sections'
import { groups, labs, topics } from './structure'
import type { GroupId, LabId, Phase } from './types'

const allTopics = Object.keys(topics) as TopicId[]

function layout(ids: readonly TopicId[]) {
  return groups.map((group) => ({ group, topics: ids.filter((id) => topics[id].group === group) })).filter((g) => g.topics.length)
}

export const mapOrder: readonly TopicId[] = layout(allTopics).flatMap((g) => g.topics)

/** A group is live once one of its topics is. */
export function liveGroups(phase: Phase): GroupId[] {
  return mapLayout(phase).map(({ group }) => group)
}

export function isLiveGroup(id: string, phase: Phase): id is GroupId {
  return (liveGroups(phase) as string[]).includes(id)
}

export function liveTopics(phase: Phase): TopicId[] {
  return mapOrder.filter((id) => topics[id].phase <= phase)
}

export function isLiveTopic(id: string, phase: Phase): id is TopicId {
  return Object.hasOwn(topics, id) && topics[id as TopicId].phase <= phase
}

export function mapLayout(phase: Phase) {
  return layout(liveTopics(phase))
}

export function neighbours(topic: TopicId, phase: Phase): { prev?: TopicId; next?: TopicId } {
  const live = liveTopics(phase)
  const i = live.indexOf(topic)
  return { ...(i > 0 && { prev: live[i - 1] }), ...(i < live.length - 1 && { next: live[i + 1] }) }
}

export function sectionsOf(topic: TopicId) {
  return sections.filter((s) => s.topic === topic)
}

export function liveLabs(phase: Phase): LabId[] {
  return (Object.keys(labs) as LabId[]).filter((lab) => labs[lab].phase <= phase)
}

export function isLiveLab(id: string, phase: Phase): id is LabId {
  return Object.hasOwn(labs, id) && labs[id as LabId].phase <= phase
}

/** The live lab that practises a topic, if any. */
export function labOf(topic: TopicId, phase: Phase): LabId | undefined {
  return liveLabs(phase).find((lab) => (labs[lab].topics as readonly TopicId[]).includes(topic))
}
