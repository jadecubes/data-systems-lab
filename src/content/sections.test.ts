import { expect, test } from 'vitest'
import { sections } from './sections'

const byId = (id: string) => sections.find((s) => s.id === id)

test('covers the 89 topic sections: 31 first-line, 58 second-line, unique ids', () => {
  expect(sections).toHaveLength(89)
  expect(sections.filter((s) => s.topic.startsWith('T'))).toHaveLength(31)
  expect(new Set(sections.map((s) => s.id)).size).toBe(89)
  for (const s of sections) expect(s.id).toMatch(/^ch\d+-[a-z0-9]+(-[a-z0-9]+)*$/)
})

test('T3 and T4 sections, in guide order', () => {
  expect(sections.filter((s) => s.topic === 'T3').map((s) => s.id)).toEqual([
    'ch1-problems-with-distributed-systems',
    'ch5-the-problems-with-remote-procedure-calls',
    'ch9-unreliable-networks',
  ])
  expect(sections.filter((s) => s.topic === 'T4').map((s) => s.id)).toEqual([
    'ch8-handling-errors-and-aborts',
    'ch8-exactly-once-message-processing-revisited',
    'ch13-the-end-to-end-argument-for-databases',
  ])
})

test('book titles: plain headings, verified overrides, and sections without one', () => {
  expect(byId('ch9-unreliable-networks')).toMatchObject({ bookTitle: 'Unreliable Networks', zhName: '不可靠的網路', chapter: 9 })
  expect(byId('ch5-the-problems-with-remote-procedure-calls')).toMatchObject({
    bookTitle: 'The problems with remote procedure calls',
    zhName: '遠端程序呼叫的問題',
  })
  expect(byId('ch8-replication-and-durability')).toMatchObject({ bookTitle: 'Replication and Durability', zhName: '複製與持久性' })
  expect(byId('ch6-intro-replication-and-backups')).toMatchObject({ bookTitle: null, zhName: null })
  expect(byId('ch13-how-to-choose')).toMatchObject({ bookTitle: null, topic: 'T8' })
})

test('pages are printed pages (PDF − 24), including multi-range', () => {
  expect(byId('ch9-unreliable-networks')!.pages).toEqual([[347, 348]])
  expect(byId('ch2-intro-functional-and-nonfunctional-requirements')!.pages).toEqual([[33, 33]])
  expect(byId('ch5-the-merits-of-schemas')!.pages).toEqual([[177, 178], [192, 192]])
})

test('ratings are codes', () => {
  expect(byId('ch2-how-important-is-reliability')).toMatchObject({ product: 'use', platform: 'ask' })
  expect(byId('ch5-message-brokers')).toMatchObject({ product: 'term', platform: 'use' })
})
