// Queries that only ever return what is live in a phase, so no screen can link to an unpublished page.
import { sections, type TopicId } from './sections'
import { groups, topics, zoneDefaults } from './structure'
import type { GroupId, Phase, RoleRatings, SectionMeta, ZoneId } from './types'

const allTopics = Object.keys(topics) as TopicId[]

/** Second-line topics have no group. */
export function groupOf(id: TopicId): GroupId | undefined {
  return (topics[id] as { group?: GroupId }).group
}
const zones: ZoneId[] = ['first', 'second']

function layout(ids: readonly TopicId[]) {
  return zones
    .map((zone) => {
      const inZone = ids.filter((id) => topics[id].zone === zone)
      const zoneGroups = zone === 'first' ? groups : [undefined]
      return {
        zone,
        groups: zoneGroups
          .map((group) => ({ group: group ?? null, topics: inZone.filter((id) => groupOf(id) === group) }))
          .filter((g) => g.topics.length),
      }
    })
    .filter((z) => z.groups.length)
}

export const mapOrder: readonly TopicId[] = layout(allTopics).flatMap((z) => z.groups.flatMap((g) => g.topics))

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

export function ratingExceptions(section: SectionMeta, zone: ZoneId): Partial<RoleRatings> {
  const defaults = zoneDefaults[zone]
  return {
    ...(section.product !== defaults.product && { product: section.product }),
    ...(section.platform !== defaults.platform && { platform: section.platform }),
  }
}
