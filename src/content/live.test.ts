import { expect, test } from 'vitest'
import { isLiveTopic, liveTopics, mapLayout, mapOrder, neighbours, ratingExceptions, sectionsOf } from './live'
import { sections } from './sections'
import { topics } from './structure'

test('map order follows the groups, then the second line', () => {
  expect(mapOrder).toEqual([
    'T1', 'T2', 'T8', 'T12', 'T3', 'T4', 'T5', 'T6', 'T7', 'T9', 'T10', 'T0', 'T11',
    'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q12', 'Q13', 'Q14', 'Q15', 'Q16',
  ])
})

test('phase 1 shows only T3 and T4, in one zone and one group', () => {
  expect(liveTopics(1)).toEqual(['T3', 'T4'])
  expect(mapLayout(1)).toEqual([{ zone: 'first', groups: [{ group: 'anomalies', topics: ['T3', 'T4'] }] }])
})

test('later phases add topics and the second zone', () => {
  expect(liveTopics(2)).toEqual(mapOrder.slice(0, 13))
  expect(mapLayout(2).map((z) => z.zone)).toEqual(['first'])
  expect(mapLayout(2)[0].groups.map(({ group }) => group)).toEqual(['spec', 'anomalies', 'change', 'data'])
  expect(mapLayout(4).map((z) => z.zone)).toEqual(['first', 'second'])
  expect(mapLayout(4)[1].groups).toEqual([{ group: null, topics: mapOrder.slice(13) }])
})

test('prev and next stay among live topics', () => {
  expect(neighbours('T3', 1)).toEqual({ next: 'T4' })
  expect(neighbours('T4', 1)).toEqual({ prev: 'T3' })
  expect(neighbours('T4', 2)).toEqual({ prev: 'T3', next: 'T5' })
})

test('isLiveTopic rejects unknown and not-yet-live topics', () => {
  expect(isLiveTopic('T3', 1)).toBe(true)
  expect(isLiveTopic('T5', 1)).toBe(false)
  expect(isLiveTopic('X9', 6)).toBe(false)
  expect(isLiveTopic('toString', 6)).toBe(false)
})

test('rating exceptions: only the roles that differ from the zone default; 12 sections in all', () => {
  const reliability = sections.find((s) => s.id === 'ch2-how-important-is-reliability')!
  expect(ratingExceptions(reliability, 'first')).toEqual({ platform: 'ask' })
  expect(sectionsOf('T3').map((s) => ratingExceptions(s, 'first'))).toEqual([{}, {}, {}])
  const all = sections.filter((s) => Object.keys(ratingExceptions(s, topics[s.topic].zone)).length)
  expect(all).toHaveLength(12)
})
