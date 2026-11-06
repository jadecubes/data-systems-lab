import { expect, test } from '@playwright/test'
import { INDEX_KEY } from '../src/app/indexToggle'
import { routePath } from '../src/app/routes'
import { sectionsOf } from '../src/content/live'
import { texts as contents } from '../src/i18n/text'
import { langs, type Lang } from '../src/i18n/langs'
import { BASE } from './helpers'

const { ui, topics } = contents.en

test('every group of the site index folds and unfolds, and only the current topic lists its sections', async ({ page }, info) => {
  await page.goto(routePath({ kind: 'topic', lang: 'en', topic: 'T4' }, BASE))
  const index = page.locator('.site-index')
  // On a phone the index starts closed behind its own toggle; on wide screens it is always open.
  if (info.project.name === 'mobile') await index.locator('> summary').click()
  const nav = page.getByRole('navigation', { name: ui.index.label })
  const sectionLink = (topic: 'T3' | 'T4') => nav.locator(`a[href$="#${sectionsOf(topic)[0].id}"]`)

  await expect(sectionLink('T4')).toBeVisible()
  await expect(sectionLink('T3')).toHaveCount(0)

  await nav.getByText(ui.groups.anomalies).click()
  await expect(nav.getByRole('link', { name: topics.T3!.title })).toBeHidden()
  await nav.getByText(ui.groups.anomalies).click()
  await expect(nav.getByRole('link', { name: topics.T3!.title })).toBeVisible()

  // Another group starts folded; opening it shows its topics.
  await expect(nav.getByRole('link', { name: topics.Q1!.title })).toBeHidden()
  await nav.getByText(ui.groups.systems).click()
  await expect(nav.getByRole('link', { name: topics.Q1!.title })).toBeVisible()
  // The map is reached from the site name and the pager; the index lists groups and topics, never the map.
  await expect(nav.locator(`a[href="${routePath({ kind: 'map', lang: 'en' }, BASE)}"]`)).toHaveCount(0)
})

test('on a wide screen the index hides and shows, and stays hidden on the next page', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile', 'phones fold the index behind its own toggle instead')
  await page.goto(routePath({ kind: 'map', lang: 'en' }, BASE))
  const nav = page.getByRole('navigation', { name: ui.index.label })
  const left = () => page.locator('#main').evaluate((el) => el.getBoundingClientRect().left)
  const shown = await left()
  const menu = page.getByRole('button', { name: ui.index.label })
  await expect(menu).toHaveAttribute('aria-expanded', 'true')
  await menu.click()
  await expect(nav).toBeHidden()
  expect(await left()).toBeLessThan(shown)
  await menu.click()
  await expect(nav).toBeVisible()
  await menu.click()
  await expect(nav).toBeHidden()

  await page.goto(routePath({ kind: 'topic', lang: 'en', topic: 'T3' }, BASE))
  await expect(nav).toBeHidden()
  await expect(menu).toHaveAttribute('aria-expanded', 'false')
  await menu.click()
  await expect(nav).toBeVisible()
  expect(await left()).toBe(shown)
})

test('on a wide screen the index column starts with the current topic in view, even near the end of a long index', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile', 'phones fold the index behind its own toggle instead')
  await page.setViewportSize({ width: 1280, height: 800 })
  const measure = () =>
    page.evaluate(() => {
      const column = document.querySelector('.index-column')!
      const here = column.querySelector('[aria-current="page"]')!.getBoundingClientRect()
      const box = column.getBoundingClientRect()
      return { inView: here.top >= box.top && here.bottom <= box.bottom, scrolled: column.scrollTop }
    })
  await page.goto(routePath({ kind: 'topic', lang: 'en', topic: 'Q16' }, BASE))
  expect((await measure()).inView).toBe(true)
  // A topic already in view leaves the column where it was, at large text sizes too.
  await page.goto(routePath({ kind: 'topic', lang: 'en', topic: 'T1' }, BASE))
  expect(await measure()).toEqual({ inView: true, scrolled: 0 })
  const big = await page.context().newPage()
  await big.setViewportSize({ width: 1280, height: 800 })
  // 200% text from the first paint, when the column decides whether to scroll.
  await big.addInitScript(() =>
    new MutationObserver((_, observer) => {
      if (!document.head) return
      document.head.append(Object.assign(document.createElement('style'), { textContent: ':root { font-size: 200% }' }))
      observer.disconnect()
    }).observe(document, { childList: true, subtree: true }),
  )
  await big.goto(routePath({ kind: 'topic', lang: 'en', topic: 'T1' }, BASE))
  expect(await big.evaluate(() => document.querySelector('.index-column')!.scrollTop)).toBe(0)
  await big.close()
  // An index hidden on an earlier page shows the current topic when the reader brings it back.
  await page.addInitScript((key) => localStorage.setItem(key, 'hidden'), INDEX_KEY)
  await page.goto(routePath({ kind: 'topic', lang: 'en', topic: 'Q16' }, BASE))
  await page.getByRole('button', { name: ui.index.label }).click()
  expect((await measure()).inView).toBe(true)
})

test('on a phone the index keeps its own toggle and shows no menu button', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'only phones fold the index')
  await page.goto(routePath({ kind: 'map', lang: 'en' }, BASE))
  await expect(page.locator('.site-index > summary')).toBeVisible()
  await expect(page.locator('.index-toggle')).toBeHidden()
})

test('if scripts never load, a reader who hid the index still sees it, since nothing could show it again', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile', 'phones fold the index behind its own toggle instead')
  await page.addInitScript((key) => localStorage.setItem(key, 'hidden'), INDEX_KEY)
  await page.route('**/assets/*.js', (r) => r.abort())
  await page.goto(routePath({ kind: 'topic', lang: 'en', topic: 'T4' }, BASE))
  await expect(page.getByRole('navigation', { name: ui.index.label })).toBeVisible()
})

test('a module script that fails after the page loaded leaves the index and its button as they were', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile', 'phones fold the index behind its own toggle instead')
  await page.addInitScript((key) => localStorage.setItem(key, 'hidden'), INDEX_KEY)
  await page.goto(routePath({ kind: 'topic', lang: 'en', topic: 'T4' }, BASE))
  const nav = page.getByRole('navigation', { name: ui.index.label })
  const menu = page.getByRole('button', { name: ui.index.label })
  await expect(menu).toHaveAttribute('aria-expanded', 'false')
  // A browser extension or a host's toolbar can add a module script of its own; this one fails to load.
  await page.evaluate(
    () =>
      new Promise((done) => {
        const script = Object.assign(document.createElement('script'), { type: 'module', src: '/missing.js', onerror: done })
        document.head.append(script)
      }),
  )
  await expect(nav).toBeHidden()
  await menu.click()
  await expect(nav).toBeVisible()
  await expect(menu).toHaveAttribute('aria-expanded', 'true')
})

test('nothing moves when scripts add the menu button and the language select', async ({ browser }, info) => {
  const boxes = async (javaScriptEnabled: boolean, lang: Lang) => {
    const page = await browser.newPage({ ...info.project.use, javaScriptEnabled })
    await page.goto(routePath({ kind: 'topic', lang, topic: 'T4' }, BASE))
    if (javaScriptEnabled) await expect(page.locator('.language-switch select')).toBeVisible()
    const box = await page.evaluate(() =>
      ['#site-index', '#main', '.site-name', '.language-switch > *'].map((s) => {
        const { top, left, width } = document.querySelector(s)!.getBoundingClientRect()
        return { s, top, left, width }
      }),
    )
    await page.close()
    return box
  }
  for (const lang of langs) expect(await boxes(true, lang)).toEqual(await boxes(false, lang))
})
