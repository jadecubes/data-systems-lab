import { expect, type Page } from '@playwright/test'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

/** The build under test is served under this path, so a link that forgets the base breaks. */
export const BASE = process.env.BASE_PATH ?? '/'
export const CJK = /[㐀-鿿豈-﫿　-〿＀-￯]/

/** No horizontal scroll, and no axe violations with every fold open. */
export async function inspect(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1)
  // Everything a reader can unfold is checked unfolded: closed <details> hide their content from axe.
  await page.evaluate(() => document.querySelectorAll('details').forEach((d) => (d.open = true)))
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') })
  const violations = await page.evaluate(async () => {
    // target-size (WCAG 2.2) is off by default; small toggles next to links are easy to miss on a phone.
    const result = await (window as unknown as { axe: { run(options: object): Promise<{ violations: { id: string; nodes: { target: string[] }[] }[] }> } }).axe.run({ rules: { 'target-size': { enabled: true } } })
    return result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) }))
  })
  expect(violations).toEqual([])
}
