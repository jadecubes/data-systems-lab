import { expect, test } from '@playwright/test'
import { routePath } from '../src/app/routes'
import { sectionsOf } from '../src/content/live'
import { langs } from '../src/i18n/langs'
import { BASE } from './helpers'

for (const lang of langs) {
  test(`a map card folds and unfolds, and its read link opens the topic even while folded (${lang})`, async ({ page }) => {
    await page.goto(routePath({ kind: 'map', lang }, BASE))
    const card = page.locator('.card').first()
    const summary = card.locator('details > p')
    await expect(summary).toBeHidden()
    await card.locator('summary').click()
    await expect(summary).toBeVisible()
    await card.locator('summary').click()
    await expect(summary).toBeHidden()
    await card.locator('.card-read').click()
    await expect(page).toHaveURL(routePath({ kind: 'topic', lang, topic: 'T1' }, BASE))
  })
}

test('the header lines up with the page below it', async ({ page }, info) => {
  const left = (selector: string) => page.locator(selector).evaluate((el) => Math.round(el.getBoundingClientRect().left))
  const right = (selector: string) => page.locator(selector).evaluate((el) => Math.round(el.getBoundingClientRect().right))
  for (const route of [{ kind: 'map', lang: 'en' }, { kind: 'topic', lang: 'en', topic: 'T3' }] as const) {
    await page.goto(routePath(route, BASE))
    // On wide screens the menu button's slot starts the header; phones have no button there.
    expect(await left(info.project.name === 'desktop' ? '.header-menu' : '.site-name')).toBe(await left('.site-index'))
    // The language switch ends the header's row, on a phone too: the site name wraps beside it, not above it.
    expect(Math.abs((await right('.language-switch')) - ((await right('.layout')) - 16))).toBeLessThanOrEqual(1)
  }
})

// Twice the browser's default text size stands in for a phone's large-text setting, where the header wraps and grows.
for (const lang of langs) {
  for (const textScale of [1, 2]) {
    test(`the header stays in view while reading, and a link to a section lands below it (${lang}, text ×${textScale})`, async ({ page }, info) => {
      // The narrowest common phone, where the site name wraps most.
      if (info.project.name === 'mobile') await page.setViewportSize({ width: 375, height: 812 })
      await (await page.context().newCDPSession(page)).send('Page.setFontSizes', { fontSizes: { standard: 16 * textScale } })
      const { id } = sectionsOf('T1')[1]
      await page.goto(`${routePath({ kind: 'topic', lang, topic: 'T1' }, BASE)}#${id}`)
      await page.waitForLoadState('load')
      const header = (await page.locator('.site-header').boundingBox())!
      expect(header.y).toBe(0)
      // However large the text, most of the screen is left for reading.
      expect(header.height).toBeLessThan(page.viewportSize()!.height / 2)
      await expect(page.locator('.site-name')).toBeInViewport()
      expect((await page.locator(`[id="${id}"] h2`).boundingBox())!.y).toBeGreaterThanOrEqual(header.height)
    })
  }
}

test('reloading a section link keeps the reader’s place', async ({ page }) => {
  // Once the header is measured, the page has done any scrolling of its own.
  const measured = () => expect.poll(() => page.evaluate(() => document.documentElement.style.getPropertyValue('--header-height'))).not.toBe('')
  await page.goto(`${routePath({ kind: 'topic', lang: 'en', topic: 'T1' }, BASE)}#${sectionsOf('T1')[1].id}`)
  await measured()
  await page.evaluate(() => window.scrollBy(0, 400))
  const place = await page.evaluate(() => scrollY)
  await page.reload()
  await measured()
  expect(await page.evaluate(() => scrollY)).toBe(place)
})
