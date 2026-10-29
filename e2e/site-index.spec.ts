import { expect, test } from '@playwright/test'
import { INDEX_KEY } from '../src/app/indexToggle'
import { routePath } from '../src/app/routes'
import { sectionsOf } from '../src/content/live'
import { contents } from '../src/i18n/content'
import { interpolate } from '../src/i18n/format'
import { langs, type Lang } from '../src/i18n/langs'
import { BASE } from './helpers'

const { ui, topics } = contents.en

test('every level of the site index folds and unfolds, and only an open topic shows its sections', async ({ page }, info) => {
  await page.goto(routePath({ kind: 'topic', lang: 'en', topic: 'T4' }, BASE))
  const index = page.locator('.site-index')
  // On a phone the index starts closed behind its own toggle; on wide screens it is always open.
  if (info.project.name === 'mobile') await index.locator('> summary').click()
  const nav = page.getByRole('navigation', { name: ui.index.label })
  const sectionLink = (topic: 'T3' | 'T4') => nav.locator(`a[href$="#${sectionsOf(topic)[0].id}"]`)

  await expect(sectionLink('T4')).toBeVisible()
  await expect(sectionLink('T3')).toBeHidden()
  await nav.getByLabel(interpolate(ui.index.sections, { topic: topics.T3!.title })).click()
  await expect(sectionLink('T3')).toBeVisible()

  await nav.getByText(ui.groups.anomalies).click()
  await expect(nav.getByRole('link', { name: topics.T3!.title })).toBeHidden()
  await nav.getByText(ui.groups.anomalies).click()
  await expect(nav.getByRole('link', { name: topics.T3!.title })).toBeVisible()
  // The map is reached from the site name and the pager; the index lists only groups and topics while one zone is live.
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
