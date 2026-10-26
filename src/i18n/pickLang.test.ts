import { afterEach, expect, test, vi } from 'vitest'
import { pickLang, readStoredLang, storeLang } from './pickLang'

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

test('a stored choice wins; an invalid one is ignored', () => {
  expect(pickLang('en', 'zh-TW')).toBe('en')
  expect(pickLang('fr', 'zh-TW')).toBe('zh-TW')
})

test('any zh browser language goes to zh-TW; everything else, or nothing, to en', () => {
  for (const l of ['zh', 'zh-TW', 'zh-CN', 'zh-Hant-HK', 'ZH-tw']) expect(pickLang(null, l)).toBe('zh-TW')
  for (const l of ['en-US', 'fr', '', undefined]) expect(pickLang(null, l)).toBe('en')
})

test('the stored choice round-trips', () => {
  storeLang('en')
  expect(readStoredLang()).toBe('en')
})

test('blocked storage: reading returns null and writing does not throw', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('blocked')
  })
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('blocked')
  })
  expect(readStoredLang()).toBeNull()
  expect(() => storeLang('en')).not.toThrow()
})
