import type { TopicId } from './sections'
import type { GroupId, LabId, Phase } from './types'

type Placement = { readonly group: GroupId; readonly phase: Phase }

/** Groups in map order (design §5.1). */
export const groups = ['spec', 'anomalies', 'change', 'data', 'systems', 'storage', 'concurrency', 'flow'] as const satisfies readonly GroupId[]

/**
 * Every topic exactly once (the mapped type rejects a missing, extra or misspelt key). Key order is map
 * order and prev/next order.
 */
export const topics = {
  T1: { group: 'spec', phase: 2 },
  T2: { group: 'spec', phase: 2 },
  T8: { group: 'spec', phase: 2 },
  T12: { group: 'spec', phase: 2 },
  T3: { group: 'anomalies', phase: 1 },
  T4: { group: 'anomalies', phase: 1 },
  T5: { group: 'anomalies', phase: 2 },
  T6: { group: 'anomalies', phase: 2 },
  T7: { group: 'anomalies', phase: 2 },
  T9: { group: 'change', phase: 2 },
  T10: { group: 'change', phase: 2 },
  T0: { group: 'data', phase: 2 },
  T11: { group: 'data', phase: 2 },
  Q1: { group: 'systems', phase: 4 },
  Q2: { group: 'systems', phase: 4 },
  Q3: { group: 'systems', phase: 4 },
  Q4: { group: 'systems', phase: 4 },
  Q5: { group: 'storage', phase: 4 },
  Q6: { group: 'storage', phase: 4 },
  Q7: { group: 'storage', phase: 4 },
  Q8: { group: 'storage', phase: 4 },
  Q9: { group: 'concurrency', phase: 4 },
  Q10: { group: 'concurrency', phase: 4 },
  Q11: { group: 'concurrency', phase: 4 },
  Q12: { group: 'flow', phase: 4 },
  Q13: { group: 'flow', phase: 4 },
  Q14: { group: 'flow', phase: 4 },
  Q15: { group: 'flow', phase: 4 },
  Q16: { group: 'flow', phase: 4 },
} as const satisfies { readonly [T in TopicId]: Placement }

/** `topics` are the ones a lab practises and links from; `related` are read next, linked from the lab's end. */
export const labs = {
  d1: { topics: ['T3', 'T4'], related: ['T5', 'T6', 'T7'], phase: 3 },
  d2: { topics: ['T5'], related: [], phase: 5 },
  d3: { topics: ['T6', 'T7'], related: [], phase: 6 },
} as const satisfies Record<LabId, { readonly topics: readonly TopicId[]; readonly related: readonly TopicId[]; readonly phase: Phase }>
