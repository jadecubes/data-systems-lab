import type { TopicId } from './sections'
import type { GroupId, LabId, Phase, RoleRatings, ZoneId } from './types'

type Placement = { readonly zone: ZoneId; readonly group?: GroupId; readonly phase: Phase }

/** First-line groups, in map order (design §5.1). */
export const groups = ['spec', 'anomalies', 'change', 'data'] as const satisfies readonly GroupId[]

/**
 * Every topic exactly once (the mapped type rejects a missing, extra or misspelt key). Key order is map
 * order and prev/next order.
 */
export const topics = {
  T1: { zone: 'first', group: 'spec', phase: 2 },
  T2: { zone: 'first', group: 'spec', phase: 2 },
  T8: { zone: 'first', group: 'spec', phase: 2 },
  T12: { zone: 'first', group: 'spec', phase: 2 },
  T3: { zone: 'first', group: 'anomalies', phase: 1 },
  T4: { zone: 'first', group: 'anomalies', phase: 1 },
  T5: { zone: 'first', group: 'anomalies', phase: 2 },
  T6: { zone: 'first', group: 'anomalies', phase: 2 },
  T7: { zone: 'first', group: 'anomalies', phase: 2 },
  T9: { zone: 'first', group: 'change', phase: 2 },
  T10: { zone: 'first', group: 'change', phase: 2 },
  T0: { zone: 'first', group: 'data', phase: 2 },
  T11: { zone: 'first', group: 'data', phase: 2 },
  Q1: { zone: 'second', phase: 4 },
  Q2: { zone: 'second', phase: 4 },
  Q3: { zone: 'second', phase: 4 },
  Q4: { zone: 'second', phase: 4 },
  Q5: { zone: 'second', phase: 4 },
  Q6: { zone: 'second', phase: 4 },
  Q7: { zone: 'second', phase: 4 },
  Q8: { zone: 'second', phase: 4 },
  Q9: { zone: 'second', phase: 4 },
  Q10: { zone: 'second', phase: 4 },
  Q11: { zone: 'second', phase: 4 },
  Q12: { zone: 'second', phase: 4 },
  Q13: { zone: 'second', phase: 4 },
  Q14: { zone: 'second', phase: 4 },
  Q15: { zone: 'second', phase: 4 },
  Q16: { zone: 'second', phase: 4 },
} as const satisfies { readonly [T in TopicId]: Placement }

export const labs = {
  d1: { topics: ['T3', 'T4'], phase: 3 },
  d2: { topics: ['T5'], phase: 5 },
  d3: { topics: ['T6', 'T7'], phase: 6 },
} as const satisfies Record<LabId, { readonly topics: readonly TopicId[]; readonly phase: Phase }>

/** Each zone's default rating; topic pages flag only sections that differ (design §4). */
export const zoneDefaults = {
  first: { product: 'use', platform: 'use' },
  second: { product: 'ask', platform: 'use' },
} as const satisfies Record<ZoneId, RoleRatings>
