import { expect, test } from 'vitest'
import { LANG_KEY, pickLang } from '../i18n/pickLang'
import { rootPage } from './rootPage'

const base = '/b/'
const page = rootPage(base, 'A <title> & more')
const script = page.match(/<script>([\s\S]*?)<\/script>/)![1]

/** Runs the page's script against a fake browser and returns where it sent the reader. */
function redirect(stored: string | null | Error, browserLanguage: string | undefined): string {
  let target = ''
  const storage = {
    getItem(key: string) {
      if (stored instanceof Error) throw stored
      return key === LANG_KEY ? stored : null
    },
  }
  new Function('location', 'navigator', 'localStorage', script)({ replace: (url: string) => (target = url) }, { language: browserLanguage }, storage)
  return target
}

test.each([
  [null, 'zh-TW'],
  [null, 'zh-CN'],
  [null, 'ZH-hk'],
  [null, 'en-US'],
  [null, 'fr-FR'],
  [null, undefined],
  ['en', 'zh-TW'],
  ['zh-TW', 'en-US'],
  ['fr', 'zh-TW'],
  ['fr', 'en-US'],
])('the root sends a reader with stored %o and browser %o to the language pickLang chooses', (stored, browser) => {
  expect(redirect(stored, browser)).toBe(`${base}${pickLang(stored, browser)}/`)
})

test('with storage blocked, the root follows the browser language', () => {
  expect(redirect(new Error('blocked'), 'zh-TW')).toBe(`${base}zh-TW/`)
  expect(redirect(new Error('blocked'), 'en-US')).toBe(`${base}en/`)
})

test('the root shows no page of its own: no body content, no app script', () => {
  expect(page).toMatch(/<body>\s*<\/body>/)
  expect(page).not.toContain('type="module"')
  expect(page).toContain('<title>A &lt;title&gt; &amp; more</title>')
})

test('without JavaScript the root goes straight to the English map', () => {
  expect(page).toContain(`<noscript><meta http-equiv="refresh" content="0; url=${base}en/"></noscript>`)
})
