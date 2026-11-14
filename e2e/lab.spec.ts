import { expect, test, type Page } from '@playwright/test'
import { texts as contents } from '../src/i18n/text'
import { interpolate } from '../src/i18n/format'
import { langs } from '../src/i18n/langs'
import { BASE, inspect } from './helpers'

/** Nothing scrolls the page sideways, no timeline step is squeezed into word fragments, and every SQL note is in view. */
async function readable(page: Page) {
  const problems = await page.evaluate(() => {
    const em = parseFloat(getComputedStyle(document.documentElement).fontSize)
    const narrow = [...document.querySelectorAll('.timeline-box')].filter((box) => box.getBoundingClientRect().width < 5 * em)
    const hidden = [...document.querySelectorAll('.code-note:not(:empty)')].filter((note) => {
      const box = note.parentElement!.getBoundingClientRect()
      return note.getBoundingClientRect().right > box.right + 1
    })
    return { overflow: document.documentElement.scrollWidth - innerWidth > 1, narrow: narrow.length, hidden: hidden.length }
  })
  expect(problems).toEqual({ overflow: false, narrow: 0, hidden: 0 })
}

/** The same at the project's own viewport and on a 375px phone with text at 200%, then back. */
async function fitsLargeText(page: Page) {
  await readable(page)
  const size = page.viewportSize()!
  await page.setViewportSize({ width: 375, height: 800 })
  await page.addStyleTag({ content: 'html { font-size: 200% }' })
  await readable(page)
  await page.addStyleTag({ content: 'html { font-size: 106.25% }' })
  await page.setViewportSize(size)
}

for (const lang of langs) {
  test(`every question can be finished in ${lang}`, async ({ page }) => {
    const t = contents[lang].labs.d1
    const n = (i: number) => contents[lang].number(i)
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    const button = (name: string) => page.getByRole('button', { name, exact: true })
    const guided = async (steps: number) => {
      for (let i = 0; i < steps; i++) await button(t.stage.guided).click()
      await expect(button(t.stage.guided)).toHaveCount(0)
    }
    const check = async () => {
      await button(t.controls.verify).click()
      await expect(page.locator('.lab-feedback')).toHaveAttribute('data-verdict', 'ok')
    }
    const heading = (i: number) => page.getByRole('heading', { level: 3, name: t.questions[i].title })

    await page.goto(`${BASE}${lang}/labs/d1/`)
    await expect(heading(0)).toBeVisible()
    await inspect(page)

    // 1: the standard duplicate, step by step.
    await guided(9)
    await check()
    await inspect(page)
    await button(t.controls.next).click()

    // 2: the first request lost.
    await expect(heading(1)).toBeVisible()
    await guided(7)
    await check()
    await expect(page.getByRole('heading', { name: t.worlds.heading })).toBeVisible()
    await inspect(page)
    await fitsLargeText(page)
    await button(t.controls.next).click()

    // 3: what the screen should say. A refresh keeps the place.
    await expect(heading(2)).toBeVisible()
    await page.reload()
    await expect(heading(2)).toBeVisible()
    await page.getByRole('radio', { name: t.answers.q3.options.failed }).check()
    await button(t.controls.verify).click()
    await expect(page.locator('.lab-feedback')).toHaveAttribute('data-verdict', 'not-yet')
    await page.getByRole('radio', { name: t.answers.q3.options.unknown }).check()
    await check()
    await inspect(page)
    await fitsLargeText(page)
    await button(t.controls.next).click()

    // 4 and 5: predictions about new code, then the reveal.
    await expect(heading(3)).toBeVisible()
    await page.getByRole('radio', { name: t.answers.q4.options.blocked }).check()
    await check()
    await expect(page.getByRole('table', { name: t.shared.requests })).toContainText(t.shared.blocked)
    await inspect(page)
    await fitsLargeText(page)
    await button(t.controls.next).click()
    await expect(heading(4)).toBeVisible()
    await page.getByRole('radio', { name: t.answers.q5.options.two }).check()
    await check()
    await button(t.controls.next).click()

    // 6: both numbers, and a run that proves the first.
    await expect(heading(5)).toBeVisible()
    await page.getByRole('radio', { name: interpolate(t.answers.q6.option, { count: n(4) }) }).first().check()
    await page.getByRole('radio', { name: interpolate(t.answers.q6.option, { count: n(1) }) }).last().check()
    await guided(19)
    await check()
    await inspect(page)
    await fitsLargeText(page)

    // The last part: a draft, then the sample answer.
    await page.getByRole('textbox', { name: t.final.label }).fill('x')
    await button(t.final.show).click()
    await expect(page.getByText(t.final.answer)).toBeVisible()
    expect(errors).toEqual([])
  })
}

test('switching language keeps the lab at the same point', async ({ page }) => {
  const [zh, en] = [contents['zh-TW'].labs.d1, contents.en.labs.d1]
  await page.goto(`${BASE}en/labs/d1/`)
  await page.getByRole('button', { name: en.buttons.send, exact: true }).click()
  await page.getByRole('combobox', { name: contents.en.ui.languageSwitchLabel }).selectOption('zh-TW')
  await expect(page).toHaveURL(`${BASE}zh-TW/labs/d1/?v=1&events=send`)
  await expect(page.getByRole('figure', { name: zh.phone.label })).toContainText(zh.phone.waiting)
})

test('in the middle of question 1, the page fits a phone at 200% text', async ({ page }) => {
  await page.goto(`${BASE}zh-TW/labs/d1/?v=1&events=send,req1-ok,process,res1-lost,timeout,resend`)
  await expect(page.getByRole('heading', { level: 3, name: contents['zh-TW'].labs.d1.questions[0].title })).toBeVisible()
  await fitsLargeText(page)
})

test('the two worlds\' rows line up even when question 1\'s request arrived late', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile', 'phones stack the two worlds')
  const q1 = 'send,timeout,resend,req1-ok,process,res1-ok,timeout,req2-ok,process,res2-ok,verify,next'
  await page.goto(`${BASE}en/labs/d1/?v=1&events=${q1},send,req1-lost,timeout,resend,req2-ok,process,res2-ok,verify`)
  await expect(page.getByRole('region', { name: contents.en.labs.d1.worlds.heading })).toBeVisible()
  const tops = await page.evaluate(() =>
    [...document.querySelectorAll('.worlds-pair .lab-timeline')].map((f) => [...f.querySelectorAll('.timeline-steps > li')].map((li) => Math.round(li.getBoundingClientRect().top))),
  )
  expect(tops[0]).toEqual(tops[1])
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('the lab shows its setup and says the workshop needs JavaScript, with no buttons that do nothing', async ({ page }) => {
    const t = contents.en.labs.d1
    await page.goto(`${BASE}en/labs/d1/`)
    // getByText skips <noscript> content, so the note is found by its class.
    await expect(page.locator('.lab-alert')).toHaveText(t.noscript)
    await expect(page.locator('.lab-alert')).toBeVisible()
    await expect(page.getByText(t.setup[0].detail)).toBeVisible()
    await expect(page.getByRole('main').getByRole('button')).toHaveCount(0)
  })
})
