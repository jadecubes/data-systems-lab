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
    // On a phone the language switch wraps under the site name, so its right edge is checked on desktop only.
    if (info.project.name === 'desktop') expect(Math.abs((await right('.language-switch')) - ((await right('.layout')) - 16))).toBeLessThanOrEqual(1)
  }
})

for (const lang of langs) {
  test(`the header stays in view while reading, and a link to a section lands below it (${lang})`, async ({ page }, info) => {
    // The narrowest common phone, where the site name wraps most.
    if (info.project.name === 'mobile') await page.setViewportSize({ width: 375, height: 812 })
    const { id } = sectionsOf('T1')[1]
    await page.goto(`${routePath({ kind: 'topic', lang, topic: 'T1' }, BASE)}#${id}`)
    const header = (await page.locator('.site-header').boundingBox())!
    expect(header.y).toBe(0)
    await expect(page.locator('.site-name')).toBeInViewport()
    expect((await page.locator(`[id="${id}"] h2`).boundingBox())!.y).toBeGreaterThanOrEqual(header.height)
  })
}
