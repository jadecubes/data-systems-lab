import { expect, test } from '@playwright/test'
import { INDEX_KEY } from '../src/app/indexToggle'
import { langs } from '../src/i18n/langs'
import { BASE, inspect } from './helpers'

for (const path of ['en/topics/x/y', 'fr/', 'en/topics/t5/']) {
  test(`${path} is a 404 whose links reach both maps`, async ({ page }) => {
    const res = await page.goto(BASE + path)
    expect(res!.status()).toBe(404)
    expect(await res!.text()).not.toMatch(/<script|<!--/)
    await inspect(page)
    for (const lang of langs) {
      await page.goto(BASE + path)
      await page.locator(`section[lang="${lang}"] a`).click()
      await expect(page).toHaveURL(`${BASE}${lang}/`)
      await expect(page.locator('html')).toHaveAttribute('lang', lang)
    }
  })
}

for (const path of ['en/topics/t3/index.html', 'en//topics/t3/']) {
  test(`${path} is served as the T3 page and stays that page once scripts run`, async ({ page }) => {
    // A reader who hid the index elsewhere: an alias page that is left as served has no button to show it.
    await page.addInitScript((key) => localStorage.setItem(key, 'hidden'), INDEX_KEY)
    const res = await page.goto(BASE + path)
    expect(res!.status()).toBe(200)
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1')).toHaveText('Timeouts: not knowing whether it worked')
    // Either the index shows, or the menu button that can show it does.
    await expect(page.locator('.site-index:visible, .index-toggle:visible')).not.toHaveCount(0)
  })
}

test('index.html at the root still sends the reader to a language', async ({ page }) => {
  // Playwright's browsers default to en-US.
  await page.goto(`${BASE}index.html`)
  await expect(page).toHaveURL(`${BASE}en/`)
})

test('a missing trailing slash still reaches the page', async ({ page }) => {
  const res = await page.goto(`${BASE}en/topics/t3`)
  expect(res!.status()).toBe(200)
  await expect(page).toHaveURL(`${BASE}en/topics/t3/`)
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('pages read and navigate', async ({ page, request }) => {
    // The root has no page of its own: a redirect with an empty body, which without scripts goes to the English map.
    expect(await (await request.get(BASE)).text()).toMatch(/<body>\s*<\/body>/)
    await page.goto(BASE)
    await expect(page).toHaveURL(`${BASE}en/`)
    await page.locator(`.card a[href="${BASE}en/topics/t3/"]`).click()
    await expect(page.locator('#ch9-unreliable-networks')).toBeVisible()
  })
})
