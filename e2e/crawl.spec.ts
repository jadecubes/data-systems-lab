import { expect, test } from '@playwright/test'
import { pageTitle } from '../src/app/App'
import { parseRoute, routePath, type PageRoute } from '../src/app/routes'
import { CURRENT_PHASE } from '../src/config'
import { liveTopics, sectionsOf } from '../src/content/live'
import { contents } from '../src/i18n/content'
import { langs, otherLang } from '../src/i18n/langs'
import { BASE, CJK, inspect } from './helpers'

test('every internal link from the maps loads directly; every live topic is reached with all its sections', async ({ page, request }) => {
  const queue = langs.map((lang) => routePath({ kind: 'map', lang }, BASE))
  const seen = new Set<string>()
  while (queue.length) {
    const url = queue.shift()!
    if (seen.has(url)) continue
    seen.add(url)
    // Loading each URL on its own is what a refresh or a shared link does.
    const res = await request.get(url, { maxRedirects: 0 })
    expect(res.status(), url).toBe(200)
    const html = await res.text()
    // Before scripts run, the language switch is a link to the same page in the other language.
    const route = parseRoute(url, BASE, CURRENT_PHASE)!
    if (route.kind === 'root') throw new Error(`${url} links to the root, which has no page`)
    expect(html.match(/<a\b[^>]*\bhref="([^"]*)"[^>]*\bhreflang=/i)?.[1], url).toBe(routePath({ ...route, lang: otherLang(route.lang) }, BASE))
    for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)) {
      if (/^https?:\/\//.test(href)) continue
      expect(href.startsWith(BASE), `${url} links to ${href}`).toBe(true)
      queue.push(href.split('#')[0])
    }
  }

  const topicPaths = [...seen].filter((u) => u.includes('/topics/')).sort()
  const expected = langs.flatMap((lang) => liveTopics(CURRENT_PHASE).map((topic) => routePath({ kind: 'topic', lang, topic }, BASE)))
  expect(topicPaths).toEqual(expected.sort())

  // A prerendered page whose text or structure differs from its first client render makes React throw it away and
  // render again (attribute differences are caught by the hydration unit test in App.test.tsx).
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(`${page.url()}: ${e.message}`))
  for (const url of seen) {
    const route = parseRoute(url, BASE, CURRENT_PHASE) as PageRoute
    await page.goto(url)
    await page.waitForLoadState('networkidle')
    await inspect(page)
    expect(await page.locator('html').getAttribute('lang')).toBe(route.lang)
    await expect(page).toHaveTitle(pageTitle(route, contents))
    expect(await page.locator('body').innerText(), url).not.toContain('{p:')
    const switcher = page.locator('.language-switch select')
    await expect(switcher).toHaveValue(route.lang)
    await expect(switcher.locator(`option[value="${otherLang(route.lang)}"]`)).toHaveCount(1)
    // Readers who enlarge text (200%) on a 375px phone must not get a sideways-scrolling page either.
    const size = page.viewportSize()!
    await page.setViewportSize({ width: 375, height: 800 })
    await page.addStyleTag({ content: 'html { font-size: 200% }' })
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${url} at 200% text`).toBeLessThanOrEqual(1)
    await page.setViewportSize(size)
    if (route.kind === 'topic') {
      for (const s of sectionsOf(route.topic)) await expect(page.locator(`[id="${s.id}"]`), url).toHaveCount(1)
    }
    if (route.lang === 'en') {
      const leaks = await page.evaluate((source) => {
        const cjk = new RegExp(source)
        const found: string[] = cjk.test(document.title) ? [document.title] : []
        for (const el of document.body.querySelectorAll('*')) {
          if (el.closest('[lang="zh-TW"]')) continue
          for (const n of el.childNodes) if (n.nodeType === Node.TEXT_NODE && cjk.test(n.textContent!)) found.push(n.textContent!)
          for (const a of ['aria-label', 'alt', 'title']) {
            const v = el.getAttribute(a)
            if (v && cjk.test(v)) found.push(v)
          }
        }
        return found
      }, CJK.source)
      expect(leaks, url).toEqual([])
    }
  }
  expect(errors).toEqual([])
})
