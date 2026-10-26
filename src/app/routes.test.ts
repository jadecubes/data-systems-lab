import { expect, test } from 'vitest'
import { livePaths, parseRoute, routePath } from './routes'

const b = '/data-systems-lab/'

test('paths round-trip for every live route', () => {
  expect(livePaths(1, b)).toEqual([
    `${b}zh-TW/`,
    `${b}zh-TW/topics/t3/`,
    `${b}zh-TW/topics/t4/`,
    `${b}en/`,
    `${b}en/topics/t3/`,
    `${b}en/topics/t4/`,
  ])
  for (const p of livePaths(1, b)) expect(routePath(parseRoute(p, b, 1)!, b)).toBe(p)
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
