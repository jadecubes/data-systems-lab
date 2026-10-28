import { expect, test } from '@playwright/test'
import { BASE } from './helpers'

// The rule itself is unit-tested (rootPage.test.ts); this checks it reads the real navigator.language.
test.describe('a simplified-Chinese browser', () => {
  test.use({ locale: 'zh-CN' })
  test('the root sends it to the Chinese map', async ({ page }) => {
    await page.goto(BASE)
    await expect(page).toHaveURL(`${BASE}zh-TW/`)
  })
})

test.describe('a Chinese browser', () => {
  test.use({ locale: 'zh-TW' })

  test('switching language stays on the page, and the root then remembers the choice', async ({ page }) => {
    await page.goto(`${BASE}zh-TW/topics/t3/`)
    await page.getByRole('combobox', { name: '切換語言' }).selectOption('en')
    await expect(page).toHaveURL(`${BASE}en/topics/t3/`)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.locator('#ch9-unreliable-networks')).toBeVisible()
    await expect(page.getByRole('combobox', { name: 'Change language' })).toHaveValue('en')
    // Back on the Chinese page, the select names the page's own language, not the one chosen before leaving.
    await page.goBack()
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW')
    await expect(page.getByRole('combobox', { name: '切換語言' })).toHaveValue('zh-TW')
    await page.goto(BASE)
    await expect(page).toHaveURL(`${BASE}en/`)
  })

  test('with storage blocked, the root still follows the browser language', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new Error('blocked')
        },
      })
    })
    await page.goto(BASE)
    await expect(page).toHaveURL(`${BASE}zh-TW/`)
  })
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('the language switch is a link to the same page in the other language', async ({ page }) => {
    await page.goto(`${BASE}en/topics/t3/`)
    await page.getByRole('navigation', { name: 'Change language' }).getByRole('link', { name: '繁體中文' }).click()
    await expect(page).toHaveURL(`${BASE}zh-TW/topics/t3/`)
  })
})
