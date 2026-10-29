import { expect, test } from '@playwright/test'
import { routePath } from '../src/app/routes'
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
    expect(await left('.site-name')).toBe(await left('.site-index'))
    // On a phone the language switch wraps under the site name, so its right edge is checked on desktop only.
    if (info.project.name === 'desktop') expect(Math.abs((await right('.language-switch')) - ((await right('.layout')) - 16))).toBeLessThanOrEqual(1)
  }
})
