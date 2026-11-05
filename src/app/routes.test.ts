import { expect, test } from 'vitest'
import { livePaths, parseRoute, routePath } from './routes'

const b = '/data-systems-lab/'

test('paths round-trip for every live route', () => {
  expect(livePaths(1, b)).toEqual([
    `${b}zh-TW/`,
    `${b}zh-TW/groups/anomalies/`,
    `${b}zh-TW/topics/t3/`,
    `${b}zh-TW/topics/t4/`,
    `${b}en/`,
    `${b}en/groups/anomalies/`,
    `${b}en/topics/t3/`,
    `${b}en/topics/t4/`,
  ])
  for (const p of livePaths(1, b)) expect(routePath(parseRoute(p, b, 1)!, b)).toBe(p)
})

test('a group has a page once one of its topics is live', () => {
  expect(parseRoute(`${b}en/groups/anomalies/`, b, 1)).toEqual({ kind: 'group', lang: 'en', group: 'anomalies' })
  expect(parseRoute(`${b}en/groups/spec/`, b, 1)).toBeNull()
  expect(parseRoute(`${b}en/groups/spec/`, b, 2)).toEqual({ kind: 'group', lang: 'en', group: 'spec' })
  for (const p of [`${b}en/groups/Spec/`, `${b}en/groups/`, `${b}en/groups/spec/x/`, `${b}en/groups/toString/`, `${b}en/groups/zones/`]) {
    expect(parseRoute(p, b, 6), p).toBeNull()
  }
})

test('a missing trailing slash still parses', () => {
  expect(parseRoute(`${b}en/topics/t3`, b, 1)).toEqual({ kind: 'topic', lang: 'en', topic: 'T3' })
  expect(parseRoute('/data-systems-lab', b, 1)).toEqual({ kind: 'root' })
  expect(parseRoute(`${b}index.html`, b, 1)).toEqual({ kind: 'root' })
  expect(parseRoute(`${b}en/topics/t3/index.html`, b, 1)).toEqual({ kind: 'topic', lang: 'en', topic: 'T3' })
})

test('a root base works too', () => {
  expect(parseRoute('/zh-TW/topics/t4/', '/', 1)).toEqual({ kind: 'topic', lang: 'zh-TW', topic: 'T4' })
  expect(routePath({ kind: 'map', lang: 'en' }, '/')).toBe('/en/')
})

test('unknown, not-yet-live and malformed paths are not found', () => {
  for (const p of [`${b}fr/`, `${b}en/topics/t5/`, `${b}en/topics/x/y/`, `${b}EN/`, `${b}en/topics/T3/`, `${b}en//`, '/en/', `${b}en/topics/`, `${b}en/x/t3/`]) {
    expect(parseRoute(p, b, 1), p).toBeNull()
  }
})

test('a lab has a page from its own phase on, after the topics', () => {
  expect(livePaths(2, b).some((p) => p.includes('/labs/'))).toBe(false)
  expect(parseRoute(`${b}en/labs/d1/`, b, 2)).toBeNull()
  expect(parseRoute(`${b}en/labs/d1/`, b, 3)).toEqual({ kind: 'lab', lang: 'en', lab: 'd1' })
  expect(livePaths(3, b).filter((p) => p.includes('/labs/'))).toEqual([`${b}zh-TW/labs/d1/`, `${b}en/labs/d1/`])
  for (const p of livePaths(3, b)) expect(routePath(parseRoute(p, b, 3)!, b)).toBe(p)
  for (const p of [`${b}en/labs/d2/`, `${b}en/labs/D1/`, `${b}en/labs/`, `${b}en/labs/d1/x/`, `${b}en/labs/toString/`]) {
    expect(parseRoute(p, b, 3), p).toBeNull()
  }
})
